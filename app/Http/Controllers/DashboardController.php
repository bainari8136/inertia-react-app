<?php

namespace App\Http\Controllers;

use App\Models\Applicant;
use App\Models\CourseRegistration;
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
            return $this->lecturerDashboard();
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

    private function lecturerDashboard()
    {
        return Inertia::render('Dashboard/Lecturer', [
            'stats' => [
                'assigned_courses' => 0,
                'student_count' => Student::where('status', Student::STATUS_ACTIVE)->count(),
                'pending_grading' => 0,
            ],
        ]);
    }

    private function studentDashboard(User $user)
    {
        $student = $user->student?->load('programme');

        $registeredCourses = 0;
        $feeBalance = 0;

        if ($student) {
            $registeredCourses = CourseRegistration::query()
                ->where('status', CourseRegistration::STATUS_ENROLLED)
                ->whereHas('semesterRegistration', function ($q) use ($student) {
                    $q->where('student_id', $student->id)
                        ->where('status', SemesterRegistration::STATUS_APPROVED);
                })
                ->count();

            $feeBalance = $this->financeService->studentOutstandingBalance($student);
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
                'results_published' => 0,
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
