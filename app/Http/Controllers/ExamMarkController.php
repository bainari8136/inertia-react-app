<?php

namespace App\Http\Controllers;

use App\Models\AssessmentType;
use App\Models\CourseAllocation;
use App\Models\CourseRegistration;
use App\Models\CourseResult;
use App\Services\GradingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamMarkController extends Controller
{
    public function __construct(
        private GradingService $gradingService,
    ) {}

    public function index(Request $request)
    {
        abort_unless($request->user()->can('marks.enter') || $request->user()->can('marks.publish'), 403);

        $user = $request->user();

        $query = CourseAllocation::query()
            ->with(['course.programme', 'semester.academicYear', 'lecturer'])
            ->latest();

        if ($user->hasRole('Lecturer') && ! $user->can('marks.publish')) {
            $query->where('lecturer_id', $user->id);
        }

        $allocations = $query->get()->map(function (CourseAllocation $a) {
            $enrolledCount = CourseRegistration::query()
                ->where('course_id', $a->course_id)
                ->where('status', CourseRegistration::STATUS_ENROLLED)
                ->whereHas('semesterRegistration', fn ($q) => $q->where('semester_id', $a->semester_id))
                ->count();

            $publishedCount = CourseResult::query()
                ->where('status', CourseResult::STATUS_PUBLISHED)
                ->whereHas('courseRegistration', function ($q) use ($a) {
                    $q->where('course_id', $a->course_id)
                        ->whereHas('semesterRegistration', fn ($sr) => $sr->where('semester_id', $a->semester_id));
                })
                ->count();

            return [
                'id' => $a->id,
                'course_code' => $a->course?->code,
                'course_name' => $a->course?->name,
                'programme' => $a->course?->programme?->name,
                'semester' => $a->semester?->name,
                'academic_year' => $a->semester?->academicYear?->name,
                'lecturer_name' => $a->lecturer?->name,
                'enrolled_count' => $enrolledCount,
                'published_count' => $publishedCount,
            ];
        });

        return Inertia::render('Academic/Marks/Index', [
            'allocations' => $allocations,
        ]);
    }

    public function show(Request $request, CourseAllocation $allocation)
    {
        $user = $request->user();
        if ($user->hasRole('Lecturer') && ! $user->can('marks.publish')) {
            abort_if($allocation->lecturer_id !== $user->id, 403);
        }

        $allocation->load(['course.programme', 'semester.academicYear', 'lecturer']);

        $assessmentTypes = AssessmentType::where('is_active', true)->orderBy('id')->get();

        $registrations = CourseRegistration::query()
            ->where('course_id', $allocation->course_id)
            ->where('status', CourseRegistration::STATUS_ENROLLED)
            ->whereHas('semesterRegistration', fn ($q) => $q->where('semester_id', $allocation->semester_id))
            ->with(['semesterRegistration.student', 'courseResult.marks'])
            ->get();

        $students = $registrations->map(function (CourseRegistration $cr) use ($allocation, $assessmentTypes) {
            $student = $cr->semesterRegistration?->student;
            $result = $cr->courseResult ?? $this->gradingService->getOrCreateCourseResult($cr);

            if (! $result->course_allocation_id) {
                $result->update(['course_allocation_id' => $allocation->id]);
            }

            $marksMap = $result->marks->pluck('score', 'assessment_type_id')->all();

            return [
                'registration_id' => $cr->id,
                'result_id' => $result->id,
                'student_id' => $student?->id,
                'registration_number' => $student?->registration_number,
                'student_name' => $student?->fullName(),
                'marks' => $marksMap,
                'coursework_score' => $result->coursework_score,
                'exam_score' => $result->exam_score,
                'total_score' => $result->total_score,
                'grade' => $result->grade,
                'grade_points' => $result->grade_points,
                'remark' => $result->remark,
                'status' => $result->status,
            ];
        });

        return Inertia::render('Academic/Marks/Show', [
            'allocation' => [
                'id' => $allocation->id,
                'course_code' => $allocation->course?->code,
                'course_name' => $allocation->course?->name,
                'credit_hours' => $allocation->course?->credit_hours,
                'programme' => $allocation->course?->programme?->name,
                'semester' => $allocation->semester?->name,
                'academic_year' => $allocation->semester?->academicYear?->name,
                'lecturer_name' => $allocation->lecturer?->name,
            ],
            'assessmentTypes' => $assessmentTypes,
            'students' => $students,
            'canPublish' => $user->can('marks.publish'),
        ]);
    }

    public function store(Request $request, CourseAllocation $allocation)
    {
        $user = $request->user();
        if ($user->hasRole('Lecturer') && ! $user->can('marks.publish')) {
            abort_if($allocation->lecturer_id !== $user->id, 403);
        }

        $data = $request->validate([
            'marks' => ['required', 'array'],
            'marks.*.result_id' => ['required', 'exists:course_results,id'],
            'marks.*.assessment_type_id' => ['required', 'exists:assessment_types,id'],
            'marks.*.score' => ['required', 'numeric', 'min:0'],
        ]);

        foreach ($data['marks'] as $entry) {
            $result = CourseResult::findOrFail($entry['result_id']);
            $type = AssessmentType::findOrFail($entry['assessment_type_id']);

            $this->gradingService->recordMark(
                $result,
                $type,
                (float) $entry['score'],
                $user
            );
        }

        return back()->with('status', 'Marks saved and grades updated successfully.');
    }

    public function submit(Request $request, CourseAllocation $allocation)
    {
        $user = $request->user();
        if ($user->hasRole('Lecturer') && ! $user->can('marks.publish')) {
            abort_if($allocation->lecturer_id !== $user->id, 403);
        }

        $results = CourseResult::query()
            ->whereHas('courseRegistration', function ($q) use ($allocation) {
                $q->where('course_id', $allocation->course_id)
                    ->whereHas('semesterRegistration', fn ($sr) => $sr->where('semester_id', $allocation->semester_id));
            })
            ->get();

        foreach ($results as $result) {
            $this->gradingService->submitCourseResult($result);
        }

        return back()->with('status', 'Course results submitted for moderation and publishing.');
    }
}
