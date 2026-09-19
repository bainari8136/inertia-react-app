<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseRegistration;
use App\Models\SemesterRegistration;
use App\Services\RegistrationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegistrationController extends Controller
{
    public function __construct(
        private RegistrationService $registrationService,
    ) {}

    public function index(Request $request)
    {
        $this->authorize('viewAny', SemesterRegistration::class);

        $user = $request->user();

        if ($user->hasRole('Student') && $user->student) {
            $registrations = SemesterRegistration::query()
                ->where('student_id', $user->student->id)
                ->with(['semester.academicYear', 'courseRegistrations.course'])
                ->latest()
                ->get()
                ->map(fn ($r) => $this->registrationSummary($r));

            $openSemester = $this->registrationService->currentOpenSemester();

            return Inertia::render('Registration/Index', [
                'registrations' => $registrations,
                'openSemester' => $openSemester ? [
                    'id' => $openSemester->id,
                    'name' => $openSemester->name,
                    'academic_year' => $openSemester->academicYear?->name,
                    'registration_open' => $openSemester->isRegistrationOpen(),
                    'closes_at' => $openSemester->registration_closes_at?->toDateTimeString(),
                ] : null,
                'canRegister' => $request->user()->can('register', SemesterRegistration::class),
            ]);
        }

        return redirect()->route('registration-approvals.index');
    }

    public function show(Request $request, SemesterRegistration $registration)
    {
        $this->authorize('view', $registration);

        $registration->load([
            'semester.academicYear',
            'student.programme',
            'courseRegistrations.course',
        ]);

        $availableCourses = [];
        if ($registration->isEditable() && $request->user()->student?->id === $registration->student_id) {
            $enrolledIds = $registration->courseRegistrations()
                ->where('status', CourseRegistration::STATUS_ENROLLED)
                ->pluck('course_id');

            $availableCourses = Course::query()
                ->where('programme_id', $registration->student->programme_id)
                ->whereNotIn('id', $enrolledIds)
                ->orderBy('code')
                ->get(['id', 'code', 'name', 'credit_hours']);
        }

        return Inertia::render('Registration/Show', [
            'registration' => $this->registrationDetail($registration),
            'availableCourses' => $availableCourses,
            'maxCredits' => RegistrationService::MAX_CREDITS,
        ]);
    }

    public function start(Request $request)
    {
        $this->authorize('register', SemesterRegistration::class);

        $student = $request->user()->student;
        abort_if(! $student, 403);

        $semester = $this->registrationService->currentOpenSemester();
        if (! $semester) {
            return back()->withErrors(['semester' => 'No semester is open for registration.']);
        }

        $registration = $this->registrationService->findOrCreateDraft($student, $semester);

        return redirect()->route('registration.show', $registration);
    }

    public function addCourse(Request $request, SemesterRegistration $registration)
    {
        $this->authorize('view', $registration);
        abort_if($request->user()->student?->id !== $registration->student_id, 403);

        $data = $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
        ]);

        $course = Course::findOrFail($data['course_id']);
        $this->registrationService->addCourse($registration, $course);

        return back()->with('status', "Added {$course->code} to your registration.");
    }

    public function dropCourse(Request $request, SemesterRegistration $registration, CourseRegistration $courseRegistration)
    {
        $this->authorize('view', $registration);
        abort_if($request->user()->student?->id !== $registration->student_id, 403);

        $this->registrationService->dropCourse($registration, $courseRegistration);

        return back()->with('status', 'Course dropped.');
    }

    public function submit(Request $request, SemesterRegistration $registration)
    {
        $this->authorize('view', $registration);
        abort_if($request->user()->student?->id !== $registration->student_id, 403);

        $this->registrationService->submit($registration);

        return redirect()
            ->route('registration.index')
            ->with('status', 'Registration submitted for approval.');
    }

    /** @return array<string, mixed> */
    private function registrationSummary(SemesterRegistration $registration): array
    {
        $registration->loadMissing(['semester.academicYear', 'courseRegistrations.course']);

        return [
            'id' => $registration->id,
            'semester' => $registration->semester?->name,
            'academic_year' => $registration->semester?->academicYear?->name,
            'status' => $registration->status,
            'course_count' => $registration->enrolledCourses()->count(),
            'total_credits' => $registration->totalCredits(),
            'submitted_at' => $registration->submitted_at?->toDateTimeString(),
        ];
    }

    /** @return array<string, mixed> */
    private function registrationDetail(SemesterRegistration $registration): array
    {
        return [
            ...$this->registrationSummary($registration),
            'is_editable' => $registration->isEditable(),
            'rejection_reason' => $registration->rejection_reason,
            'student' => [
                'name' => $registration->student?->fullName(),
                'registration_number' => $registration->student?->registration_number,
                'programme' => $registration->student?->programme?->name,
            ],
            'courses' => $registration->courseRegistrations
                ->where('status', CourseRegistration::STATUS_ENROLLED)
                ->map(fn (CourseRegistration $cr) => [
                    'id' => $cr->id,
                    'code' => $cr->course?->code,
                    'name' => $cr->course?->name,
                    'credit_hours' => $cr->course?->credit_hours,
                ])
                ->values()
                ->all(),
        ];
    }
}
