<?php

namespace App\Policies;

use App\Models\Applicant;
use App\Models\User;

class ApplicantPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('applicants.view');
    }

    public function view(User $user, Applicant $applicant): bool
    {
        return $user->can('applicants.view');
    }

    public function create(User $user): bool
    {
        return $user->can('applicants.create');
    }

    public function update(User $user, Applicant $applicant): bool
    {
        return $user->can('applicants.update') && $applicant->status === Applicant::STATUS_PENDING;
    }

    public function admit(User $user, Applicant $applicant): bool
    {
        return $user->can('applicants.admit') && $applicant->status === Applicant::STATUS_PENDING;
    }
}
