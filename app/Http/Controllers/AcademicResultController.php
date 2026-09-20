<?php

namespace App\Http\Controllers;

use App\Models\CourseAllocation;
use App\Models\CourseResult;
use App\Models\Student;
use App\Services\GradingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicResultController extends Controller
{
    public function __construct(
        private GradingService $gradingService,
    ) {}

    public function index(Request $request)
    {
        abort_unless($request->user()->can('results.view') || $request->user()->can('marks.publish'), 403);

        $allocations = CourseAllocation::query()
            ->with(['course.programme', 'semester.academicYear', 'lecturer'])
            ->latest()
            ->get()
            ->map(function (CourseAllocation $a) {
                $resultsQuery = CourseResult::query()
                    ->whereHas('courseRegistration', function ($q) use ($a) {
                        $q->where('course_id', $a->course_id)
                            ->whereHas('semesterRegistration', fn ($sr) => $sr->where('semester_id', $a->semester_id));
                    });

                $total = (clone $resultsQuery)->count();
                $submitted = (clone $resultsQuery)->where('status', CourseResult::STATUS_SUBMITTED)->count();
                $published = (clone $resultsQuery)->where('status', CourseResult::STATUS_PUBLISHED)->count();

                return [
                    'id' => $a->id,
                    'course_code' => $a->course?->code,
                    'course_name' => $a->course?->name,
                    'programme' => $a->course?->programme?->name,
                    'semester' => $a->semester?->name,
                    'academic_year' => $a->semester?->academicYear?->name,
                    'lecturer_name' => $a->lecturer?->name,
                    'total_students' => $total,
                    'submitted_count' => $submitted,
                    'published_count' => $published,
                    'status' => $published > 0 && $published === $total ? 'published' : ($submitted > 0 ? 'submitted' : 'draft'),
                ];
            });

        return Inertia::render('Academic/Results/Index', [
            'allocations' => $allocations,
            'canPublish' => $request->user()->can('marks.publish'),
        ]);
    }

    public function publish(Request $request, CourseAllocation $allocation)
    {
        abort_unless($request->user()->can('marks.publish'), 403);

        $results = CourseResult::query()
            ->whereHas('courseRegistration', function ($q) use ($allocation) {
                $q->where('course_id', $allocation->course_id)
                    ->whereHas('semesterRegistration', fn ($sr) => $sr->where('semester_id', $allocation->semester_id));
            })
            ->get();

        foreach ($results as $result) {
            $this->gradingService->publishCourseResult($result, $request->user());
        }

        return back()->with('status', 'Results published and student GPAs recalculated successfully.');
    }

    public function myResults(Request $request)
    {
        abort_unless($request->user()->can('results.view-own') || $request->user()->hasRole('Student'), 403);

        $student = $request->user()->student;
        abort_if(! $student, 404);

        $transcriptData = $this->gradingService->getStudentTranscript($student);

        return Inertia::render('Academic/Results/MyResults', [
            'transcript' => $transcriptData,
        ]);
    }

    public function transcript(Request $request, Student $student)
    {
        $user = $request->user();

        if ($user->hasRole('Student')) {
            abort_if($user->student?->id !== $student->id, 403);
        } else {
            abort_unless($user->can('results.view'), 403);
        }

        $transcriptData = $this->gradingService->getStudentTranscript($student);

        return Inertia::render('Academic/Results/Transcript', [
            'transcript' => $transcriptData,
        ]);
    }
}
