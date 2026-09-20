<?php

namespace App\Policies;

use App\Models\CourseAllocation;
use App\Models\User;

class CourseAllocationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('allocations.view') || $user->can('allocations.manage');
    }

    public function view(User $user, CourseAllocation $allocation): bool
    {
        if ($user->can('allocations.manage')) {
            return true;
        }

        return $allocation->lecturer_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->can('allocations.manage');
    }

    public function delete(User $user, CourseAllocation $allocation): bool
    {
        return $user->can('allocations.manage');
    }
}
