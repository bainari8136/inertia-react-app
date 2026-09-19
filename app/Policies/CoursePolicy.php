<?php

namespace App\Policies;

use App\Models\Course;
use App\Models\User;

class CoursePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('academic.manage') || $user->can('registrations.view') || $user->hasRole('Student');
    }

    public function manage(User $user): bool
    {
        return $user->can('academic.manage');
    }
}
