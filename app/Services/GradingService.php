<?php

namespace App\Services;

use App\Models\AssessmentType;
use App\Models\CourseRegistration;
use App\Models\CourseResult;
use App\Models\ExamMark;
use App\Models\GradingScale;
use App\Models\Semester;
use App\Models\Student;
use App\Models\StudentSemesterResult;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class GradingService
{
    public function getOrCreateCourseResult(CourseRegistration $courseRegistration): CourseResult
    {
        return CourseResult::firstOrCreate(
            ['course_registration_id' => $courseRegistration->id],
            [
                'status' => CourseResult::STATUS_DRAFT,
            ]
        );
    }

    public function recordMark(
        CourseResult $result,
        AssessmentType $type,
        float $score,
        User $recorder
    ): ExamMark {
        if ($score < 0 || $score > $type->max_score) {
            throw ValidationException::withMessages([
                'score' => "Score must be between 0 and {$type->max_score}.",
            ]);
        }

        if ($result->isPublished()) {
            throw ValidationException::withMessages([
                'result' => 'Cannot modify marks for already published results.',
            ]);
        }

        return DB::transaction(function () use ($result, $type, $score, $recorder) {
            $mark = ExamMark::updateOrCreate(
                [
                    'course_result_id' => $result->id,
                    'assessment_type_id' => $type->id,
                ],
                [
                    'score' => $score,
                    'entered_by' => $recorder->id,
                ]
            );

            $this->recalculateCourseResult($result);

            return $mark;
        });
    }

    public function recalculateCourseResult(CourseResult $result): CourseResult
    {
        $marks = $result->marks()->with('assessmentType')->get();

        $courseworkScore = 0.0;
        $examScore = 0.0;

        foreach ($marks as $mark) {
            $type = $mark->assessmentType;
            if (! $type || ! $type->is_active) {
                continue;
            }

            $weighted = ($mark->score / $type->max_score) * $type->weight_percentage;

            if ($type->category === AssessmentType::CATEGORY_COURSEWORK) {
                $courseworkScore += $weighted;
            } elseif ($type->category === AssessmentType::CATEGORY_FINAL_EXAM) {
                $examScore += $weighted;
            }
        }

        $totalScore = round($courseworkScore + $examScore, 1);

        $gradeInfo = $this->determineGrade($totalScore);

        $result->update([
            'coursework_score' => round($courseworkScore, 2),
            'exam_score' => round($examScore, 2),
            'total_score' => $totalScore,
            'grade' => $gradeInfo['grade'],
            'grade_points' => $gradeInfo['grade_points'],
            'remark' => $gradeInfo['remark'],
        ]);

        return $result->fresh();
    }

    public function determineGrade(float $totalScore): array
    {
        $scale = GradingScale::query()
            ->where('min_score', '<=', $totalScore)
            ->where('max_score', '>=', $totalScore)
            ->first();

        if ($scale) {
            return [
                'grade' => $scale->grade,
                'grade_points' => (float) $scale->grade_points,
                'remark' => $scale->remark,
            ];
        }

        return [
            'grade' => 'F',
            'grade_points' => 0.0,
            'remark' => 'Fail',
        ];
    }

    public function submitCourseResult(CourseResult $result): CourseResult
    {
        if ($result->isPublished()) {
            throw ValidationException::withMessages([
                'result' => 'Result is already published.',
            ]);
        }

        $result->update([
            'status' => CourseResult::STATUS_SUBMITTED,
            'submitted_at' => now(),
        ]);

        return $result->fresh();
    }

    public function publishCourseResult(CourseResult $result, User $publisher): CourseResult
    {
        $result->update([
            'status' => CourseResult::STATUS_PUBLISHED,
            'published_at' => now(),
            'published_by' => $publisher->id,
        ]);

        $reg = $result->courseRegistration;
        if ($reg && $reg->semesterRegistration) {
            $student = $reg->semesterRegistration->student;
            $semester = $reg->semesterRegistration->semester;
            if ($student && $semester) {
                $this->recalculateStudentSemesterResult($student, $semester);
            }
        }

        return $result->fresh();
    }

    public function recalculateStudentSemesterResult(Student $student, Semester $semester): StudentSemesterResult
    {
        $registrations = CourseRegistration::query()
            ->where('status', CourseRegistration::STATUS_ENROLLED)
            ->whereHas('semesterRegistration', function ($q) use ($student, $semester) {
                $q->where('student_id', $student->id)
                    ->where('semester_id', $semester->id);
            })
            ->with(['course', 'courseResult'])
            ->get();

        $totalCredits = 0;
        $totalQualityPoints = 0.0;
        $hasSupplementary = false;

        foreach ($registrations as $reg) {
            $course = $reg->course;
            $result = $reg->courseResult;

            if ($course && $result && $result->isPublished()) {
                $credits = $course->credit_hours;
                $points = (float) $result->grade_points;

                $totalCredits += $credits;
                $totalQualityPoints += ($credits * $points);

                if (in_array($result->grade, ['D', 'F'], true)) {
                    $hasSupplementary = true;
                }
            }
        }

        $gpa = $totalCredits > 0 ? round($totalQualityPoints / $totalCredits, 2) : 0.0;

        $standing = 'Pending';
        if ($totalCredits > 0) {
            if ($hasSupplementary) {
                $standing = 'Supplementary';
            } elseif ($gpa >= 2.0) {
                $standing = 'Pass';
            } else {
                $standing = 'Probation';
            }
        }

        $cgpa = $this->calculateCumulativeGpa($student);

        return StudentSemesterResult::updateOrCreate(
            [
                'student_id' => $student->id,
                'semester_id' => $semester->id,
            ],
            [
                'total_credit_hours' => $totalCredits,
                'total_grade_points' => round($totalQualityPoints, 2),
                'gpa' => $gpa,
                'cgpa' => $cgpa,
                'academic_standing' => $standing,
                'status' => StudentSemesterResult::STATUS_PUBLISHED,
                'published_at' => now(),
            ]
        );
    }

    public function calculateCumulativeGpa(Student $student): float
    {
        $registrations = CourseRegistration::query()
            ->where('status', CourseRegistration::STATUS_ENROLLED)
            ->whereHas('semesterRegistration', function ($q) use ($student) {
                $q->where('student_id', $student->id);
            })
            ->with(['course', 'courseResult'])
            ->get();

        $totalCredits = 0;
        $totalQualityPoints = 0.0;

        foreach ($registrations as $reg) {
            $course = $reg->course;
            $result = $reg->courseResult;

            if ($course && $result && $result->isPublished()) {
                $credits = $course->credit_hours;
                $points = (float) $result->grade_points;

                $totalCredits += $credits;
                $totalQualityPoints += ($credits * $points);
            }
        }

        return $totalCredits > 0 ? round($totalQualityPoints / $totalCredits, 2) : 0.0;
    }

    public function getStudentTranscript(Student $student): array
    {
        $student->loadMissing(['programme.department.faculty']);

        $semesterResults = StudentSemesterResult::query()
            ->where('student_id', $student->id)
            ->with('semester.academicYear')
            ->orderBy('semester_id')
            ->get();

        $semestersData = [];

        foreach ($semesterResults as $semResult) {
            $semester = $semResult->semester;
            if (! $semester) {
                continue;
            }

            $courses = CourseRegistration::query()
                ->where('status', CourseRegistration::STATUS_ENROLLED)
                ->whereHas('semesterRegistration', function ($q) use ($student, $semester) {
                    $q->where('student_id', $student->id)
                        ->where('semester_id', $semester->id);
                })
                ->with(['course', 'courseResult'])
                ->get()
                ->map(fn ($cr) => [
                    'code' => $cr->course?->code,
                    'name' => $cr->course?->name,
                    'credit_hours' => $cr->course?->credit_hours,
                    'grade' => $cr->courseResult?->grade ?? 'N/A',
                    'grade_points' => $cr->courseResult?->grade_points ?? 0.0,
                    'remark' => $cr->courseResult?->remark ?? 'Pending',
                    'published' => $cr->courseResult?->isPublished() ?? false,
                ]);

            $semestersData[] = [
                'semester_id' => $semester->id,
                'semester_name' => $semester->name,
                'academic_year' => $semester->academicYear?->name,
                'gpa' => (float) $semResult->gpa,
                'cgpa' => (float) $semResult->cgpa,
                'standing' => $semResult->academic_standing,
                'total_credits' => $semResult->total_credit_hours,
                'courses' => $courses,
            ];
        }

        return [
            'student' => [
                'id' => $student->id,
                'registration_number' => $student->registration_number,
                'name' => $student->fullName(),
                'programme' => $student->programme?->name,
                'programme_code' => $student->programme?->code,
                'faculty' => $student->programme?->department?->faculty?->name,
                'status' => $student->status,
                'admitted_at' => $student->admitted_at?->toDateString(),
            ],
            'cgpa' => $this->calculateCumulativeGpa($student),
            'semesters' => $semestersData,
        ];
    }
}
