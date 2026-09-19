<?php

namespace App\Http\Controllers;

use App\Models\SemesterRegistration;
use App\Services\RegistrationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegistrationApprovalController extends Controller
{
    public function __construct(
        private RegistrationService $registrationService,
    ) {}

    public function index(Request $request)
    {
        $this->authorize('viewAny', SemesterRegistration::class);
        abort_unless($request->user()->can('registrations.approve'), 403);

        $registrations = SemesterRegistration::query()
            ->with(['student', 'semester.academicYear', 'courseRegistrations.course'])
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')), fn ($q) => $q->where('status', SemesterRegistration::STATUS_PENDING))
            ->latest('submitted_at')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (SemesterRegistration $r) => [
                'id' => $r->id,
                'student_name' => $r->student?->fullName(),
                'registration_number' => $r->student?->registration_number,
                'semester' => $r->semester?->name,
                'academic_year' => $r->semester?->academicYear?->name,
                'status' => $r->status,
                'course_count' => $r->courseRegistrations->where('status', 'enrolled')->count(),
                'total_credits' => $r->totalCredits(),
                'submitted_at' => $r->submitted_at?->toDateTimeString(),
            ]);

        return Inertia::render('Registration/Approvals', [
            'registrations' => $registrations,
            'filters' => $request->only('status'),
            'statuses' => [
                SemesterRegistration::STATUS_PENDING,
                SemesterRegistration::STATUS_APPROVED,
                SemesterRegistration::STATUS_REJECTED,
            ],
        ]);
    }

    public function show(SemesterRegistration $registration)
    {
        $this->authorize('approve', $registration);

        $registration->load([
            'student.programme',
            'semester.academicYear',
            'courseRegistrations.course',
        ]);

        return Inertia::render('Registration/ApprovalShow', [
            'registration' => [
                'id' => $registration->id,
                'status' => $registration->status,
                'student_name' => $registration->student?->fullName(),
                'registration_number' => $registration->student?->registration_number,
                'programme' => $registration->student?->programme?->name,
                'semester' => $registration->semester?->name,
                'academic_year' => $registration->semester?->academicYear?->name,
                'submitted_at' => $registration->submitted_at?->toDateTimeString(),
                'rejection_reason' => $registration->rejection_reason,
                'courses' => $registration->courseRegistrations
                    ->where('status', 'enrolled')
                    ->map(fn ($cr) => [
                        'code' => $cr->course?->code,
                        'name' => $cr->course?->name,
                        'credit_hours' => $cr->course?->credit_hours,
                    ])
                    ->values()
                    ->all(),
                'total_credits' => $registration->totalCredits(),
            ],
        ]);
    }

    public function approve(Request $request, SemesterRegistration $registration)
    {
        $this->authorize('approve', $registration);

        $this->registrationService->approve($registration, $request->user());

        return redirect()
            ->route('registration-approvals.index')
            ->with('status', 'Registration approved successfully.');
    }

    public function reject(Request $request, SemesterRegistration $registration)
    {
        $this->authorize('approve', $registration);

        $data = $request->validate([
            'rejection_reason' => ['required', 'string', 'max:1000'],
        ]);

        $this->registrationService->reject($registration, $request->user(), $data['rejection_reason']);

        return redirect()
            ->route('registration-approvals.index')
            ->with('status', 'Registration rejected.');
    }
}
