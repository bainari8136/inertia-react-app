<?php

namespace App\Services;

use App\Models\Course;
use App\Models\CourseRegistration;
use App\Models\Semester;
use App\Models\SemesterRegistration;
use App\Models\Student;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class RegistrationService
{
    public const MAX_CREDITS = 24;

    public function findOrCreateDraft(Student $student, Semester $semester): SemesterRegistration
    {
        $this->ensureCanRegister($student, $semester);

        $registration = SemesterRegistration::query()
            ->where('student_id', $student->id)
            ->where('semester_id', $semester->id)
            ->first();

        if ($registration) {
            if (in_array($registration->status, [
                SemesterRegistration::STATUS_PENDING,
                SemesterRegistration::STATUS_APPROVED,
            ], true)) {
                throw ValidationException::withMessages([
                    'semester' => 'You already have a registration for this semester.',
                ]);
            }

            return $registration;
        }

        return SemesterRegistration::create([
            'student_id' => $student->id,
            'semester_id' => $semester->id,
            'status' => SemesterRegistration::STATUS_DRAFT,
        ]);
    }

    public function addCourse(SemesterRegistration $registration, Course $course): CourseRegistration
    {
        $this->ensureEditable($registration);
        $registration->loadMissing('student');

        if ($course->programme_id !== $registration->student->programme_id) {
            throw ValidationException::withMessages([
                'course_id' => 'This course is not available for your programme.',
            ]);
        }

        $existing = $registration->courseRegistrations()
            ->where('course_id', $course->id)
            ->first();

        if ($existing) {
            if ($existing->status === CourseRegistration::STATUS_ENROLLED) {
                throw ValidationException::withMessages([
                    'course_id' => 'You are already registered for this course.',
                ]);
            }

            $existing->update(['status' => CourseRegistration::STATUS_ENROLLED]);

            return $existing->fresh('course');
        }

        $registration->load(['courseRegistrations.course']);
        $projectedCredits = $registration->totalCredits() + $course->credit_hours;

        if ($projectedCredits > self::MAX_CREDITS) {
            throw ValidationException::withMessages([
                'course_id' => 'Maximum '.self::MAX_CREDITS.' credit hours exceeded.',
            ]);
        }

        return $registration->courseRegistrations()->create([
            'course_id' => $course->id,
            'status' => CourseRegistration::STATUS_ENROLLED,
        ])->load('course');
    }

    public function dropCourse(SemesterRegistration $registration, CourseRegistration $courseRegistration): void
    {
        $this->ensureEditable($registration);

        if ($courseRegistration->semester_registration_id !== $registration->id) {
            abort(404);
        }

        $courseRegistration->update(['status' => CourseRegistration::STATUS_DROPPED]);
    }

    public function submit(SemesterRegistration $registration): SemesterRegistration
    {
        $this->ensureEditable($registration);

        if ($registration->enrolledCourses()->count() === 0) {
            throw ValidationException::withMessages([
                'courses' => 'Add at least one course before submitting.',
            ]);
        }

        $registration->update([
            'status' => SemesterRegistration::STATUS_PENDING,
            'submitted_at' => now(),
            'rejection_reason' => null,
            'reviewed_by' => null,
            'reviewed_at' => null,
        ]);

        return $registration->fresh();
    }

    public function approve(SemesterRegistration $registration, User $reviewer): SemesterRegistration
    {
        if ($registration->status !== SemesterRegistration::STATUS_PENDING) {
            throw new \InvalidArgumentException('Only pending registrations can be approved.');
        }

        $registration->update([
            'status' => SemesterRegistration::STATUS_APPROVED,
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => now(),
            'rejection_reason' => null,
        ]);

        return $registration->fresh();
    }

    public function reject(SemesterRegistration $registration, User $reviewer, string $reason): SemesterRegistration
    {
        if ($registration->status !== SemesterRegistration::STATUS_PENDING) {
            throw new \InvalidArgumentException('Only pending registrations can be rejected.');
        }

        $registration->update([
            'status' => SemesterRegistration::STATUS_REJECTED,
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => now(),
            'rejection_reason' => $reason,
        ]);

        return $registration->fresh();
    }

    public function ensureCanRegister(Student $student, Semester $semester): void
    {
        if (! $student->canRegister()) {
            throw ValidationException::withMessages([
                'student' => 'Only active students can register for courses.',
            ]);
        }

        $this->ensureRegistrationOpen($semester);
    }

    public function ensureRegistrationOpen(Semester $semester): void
    {
        if (! $semester->isRegistrationOpen()) {
            throw ValidationException::withMessages([
                'semester' => 'Registration is not open for this semester.',
            ]);
        }
    }

    public function ensureEditable(SemesterRegistration $registration): void
    {
        if (! $registration->isEditable()) {
            throw ValidationException::withMessages([
                'registration' => 'This registration can no longer be modified.',
            ]);
        }

        $registration->loadMissing('student');

        if (! $registration->student->canRegister()) {
            throw ValidationException::withMessages([
                'student' => 'Only active students can modify registrations.',
            ]);
        }

        $registration->loadMissing('semester');
        $this->ensureRegistrationOpen($registration->semester);
    }

    public function currentOpenSemester(): ?Semester
    {
        return Semester::query()->registrationOpen()->first()
            ?? Semester::query()->current()->first();
    }
}
