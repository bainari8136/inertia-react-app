<?php

namespace App\Http\Controllers;

use App\Models\Applicant;
use App\Models\CourseAllocation;
use App\Models\CourseRegistration;
use App\Models\CourseResult;
use App\Models\SemesterRegistration;
use App\Models\Student;
use App\Models\User;
use App\Services\FinanceService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        private FinanceService $financeService,
    ) {}

    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->hasAnyRole(['Super Administrator', 'Registrar', 'Finance Officer'])) {
            return $this->adminDashboard();
        }

        if ($user->hasRole('Lecturer')) {
            return $this->lecturerDashboard($user);
        }

        if ($user->hasRole('Student')) {
            return $this->studentDashboard($user);
        }

        return $this->staffDashboard($user);
    }

    private function adminDashboard()
    {
        $pendingRegistrations = SemesterRegistration::pending()->count();

        return Inertia::render('Dashboard/Admin', [
            'stats' => [
                'total_students' => Student::count(),
                'total_staff' => User::whereDoesntHave('roles', fn ($q) => $q->where('name', 'Student'))->count(),
                'revenue_summary' => $this->financeService->totalRevenue(),
                'total_outstanding' => $this->financeService->totalOutstanding(),
                'pending_admissions' => Applicant::pending()->count(),
                'pending_approvals' => Applicant::pending()->count() + $pendingRegistrations,
                'pending_registrations' => $pendingRegistrations,
            ],
        ]);
    }

    private function lecturerDashboard(User $user)
    {
        $allocatedCourseIds = CourseAllocation::where('lecturer_id', $user->id)->pluck('course_id');

        $studentCount = Student::where('status', Student::STATUS_ACTIVE)
            ->whereHas('semesterRegistrations.courseRegistrations', function ($q) use ($allocatedCourseIds) {
                $q->whereIn('course_id', $allocatedCourseIds)
                    ->where('status', CourseRegistration::STATUS_ENROLLED);
            })
            ->count();

        $pendingGrading = CourseAllocation::where('lecturer_id', $user->id)
            ->whereHas('course.registrations', function ($q) {
                $q->where('status', CourseRegistration::STATUS_ENROLLED)
                    ->whereDoesntHave('courseResult', fn ($r) => $r->where('status', CourseResult::STATUS_PUBLISHED));
            })
            ->count();

        return Inertia::render('Dashboard/Lecturer', [
            'stats' => [
                'assigned_courses' => CourseAllocation::where('lecturer_id', $user->id)->count(),
                'student_count' => $studentCount,
                'pending_grading' => $pendingGrading,
            ],
        ]);
    }

    private function studentDashboard(User $user)
    {
        $student = $user->student?->load('programme');

        $registeredCourses = 0;
        $feeBalance = 0;
        $resultsPublished = 0;

        if ($student) {
            $registeredCourses = CourseRegistration::query()
                ->where('status', CourseRegistration::STATUS_ENROLLED)
                ->whereHas('semesterRegistration', function ($q) use ($student) {
                    $q->where('student_id', $student->id)
                        ->where('status', SemesterRegistration::STATUS_APPROVED);
                })
                ->count();

            $feeBalance = $this->financeService->studentOutstandingBalance($student);

            $resultsPublished = CourseResult::query()
                ->where('status', CourseResult::STATUS_PUBLISHED)
                ->whereHas('courseRegistration.semesterRegistration', function ($q) use ($student) {
                    $q->where('student_id', $student->id);
                })
                ->count();
        }

        return Inertia::render('Dashboard/Student', [
            'student' => $student ? [
                'id' => $student->id,
                'registration_number' => $student->registration_number,
                'full_name' => $student->fullName(),
                'programme' => $student->programme?->name,
                'status' => $student->status,
            ] : null,
            'stats' => [
                'registered_courses' => $registeredCourses,
                'fee_balance' => $feeBalance,
                'results_published' => $resultsPublished,
            ],
        ]);
    }

    private function staffDashboard(User $user)
    {
        return Inertia::render('Dashboard/Staff', [
            'user' => [
                'name' => $user->name,
                'roles' => $user->getRoleNames()->values()->all(),
            ],
        ]);
    }
}
