<?php

namespace App\Policies;

use App\Models\SemesterRegistration;
use App\Models\Student;
use App\Models\User;

class SemesterRegistrationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('registrations.view') || $user->hasRole('Student');
    }

    public function view(User $user, SemesterRegistration $registration): bool
    {
        if ($user->can('registrations.view')) {
            return true;
        }

        return $user->hasRole('Student') && $user->student?->id === $registration->student_id;
    }

    public function register(User $user): bool
    {
        return $user->can('registrations.register') && $user->student !== null;
    }

    public function approve(User $user, SemesterRegistration $registration): bool
    {
        return $user->can('registrations.approve');
    }
}
