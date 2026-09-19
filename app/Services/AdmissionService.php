<?php

namespace App\Services;

use App\Models\Applicant;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdmissionService
{
    public function approve(Applicant $applicant, User $reviewer, bool $createUserAccount = true): Student
    {
        if ($applicant->status !== Applicant::STATUS_PENDING) {
            throw new \InvalidArgumentException('Only pending applicants can be approved.');
        }

        return DB::transaction(function () use ($applicant, $reviewer, $createUserAccount) {
            $registrationNumber = $this->generateRegistrationNumber($applicant);

            $student = Student::create([
                'applicant_id' => $applicant->id,
                'programme_id' => $applicant->programme_id,
                'registration_number' => $registrationNumber,
                'status' => Student::STATUS_ACTIVE,
                'first_name' => $applicant->first_name,
                'last_name' => $applicant->last_name,
                'middle_name' => $applicant->middle_name,
                'email' => $applicant->email,
                'phone' => $applicant->phone,
                'date_of_birth' => $applicant->date_of_birth,
                'gender' => $applicant->gender,
                'address' => $applicant->address,
                'city' => $applicant->city,
                'country' => $applicant->country,
                'guardian_name' => $applicant->guardian_name,
                'guardian_phone' => $applicant->guardian_phone,
                'guardian_relationship' => $applicant->guardian_relationship,
                'academic_history' => $applicant->academic_history,
                'admitted_at' => now(),
            ]);

            if ($createUserAccount && ! User::where('email', $applicant->email)->exists()) {
                $user = User::create([
                    'name' => $student->fullName(),
                    'email' => $applicant->email,
                    'password' => 'ChangeMe123!',
                    'is_active' => true,
                ]);
                $user->assignRole('Student');
                $student->update(['user_id' => $user->id]);
            }

            $applicant->update([
                'status' => Applicant::STATUS_APPROVED,
                'reviewed_by' => $reviewer->id,
                'reviewed_at' => now(),
            ]);

            return $student->fresh(['programme.department']);
        });
    }

    public function reject(Applicant $applicant, User $reviewer, string $reason): void
    {
        if ($applicant->status !== Applicant::STATUS_PENDING) {
            throw new \InvalidArgumentException('Only pending applicants can be rejected.');
        }

        $applicant->update([
            'status' => Applicant::STATUS_REJECTED,
            'rejection_reason' => $reason,
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => now(),
        ]);
    }

    public function generateRegistrationNumber(Applicant $applicant): string
    {
        $applicant->loadMissing('programme');
        $year = now()->year;
        $code = $applicant->programme->code;

        $sequence = Student::query()
            ->where('programme_id', $applicant->programme_id)
            ->whereYear('admitted_at', $year)
            ->count() + 1;

        return sprintf('%s/%d/%04d', $code, $year, $sequence);
    }
}
