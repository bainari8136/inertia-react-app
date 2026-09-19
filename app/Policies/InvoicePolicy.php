<?php

namespace App\Policies;

use App\Models\Invoice;
use App\Models\User;

class InvoicePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('invoices.view') || $user->can('invoices.view-own');
    }

    public function view(User $user, Invoice $invoice): bool
    {
        if ($user->can('invoices.view')) {
            return true;
        }

        return $user->can('invoices.view-own') && $user->student?->id === $invoice->student_id;
    }

    public function create(User $user): bool
    {
        return $user->can('invoices.create');
    }
}
