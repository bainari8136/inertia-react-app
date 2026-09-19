<?php

namespace App\Policies;

use App\Models\Student;
use App\Models\User;

class StudentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('students.view');
    }

    public function view(User $user, Student $student): bool
    {
        if ($user->can('students.view')) {
            return true;
        }

        return $user->hasRole('Student') && $user->student?->id === $student->id;
    }

    public function update(User $user, Student $student): bool
    {
        return $user->can('students.update');
    }

    public function manageStatus(User $user, Student $student): bool
    {
        return $user->can('students.manage-status');
    }
}
