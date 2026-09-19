<?php

namespace App\Policies;

use App\Models\Semester;
use App\Models\User;

class SemesterPolicy
{
    public function manage(User $user): bool
    {
        return $user->can('academic.manage');
    }
}
