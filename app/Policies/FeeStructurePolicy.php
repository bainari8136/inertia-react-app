<?php

namespace App\Policies;

use App\Models\FeeStructure;
use App\Models\User;

class FeeStructurePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('fees.view') || $user->can('fees.manage');
    }

    public function manage(User $user): bool
    {
        return $user->can('fees.manage');
    }
}
