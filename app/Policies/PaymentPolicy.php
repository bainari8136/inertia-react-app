<?php

namespace App\Policies;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\User;

class PaymentPolicy
{
    public function record(User $user, Invoice $invoice): bool
    {
        return $user->can('payments.record');
    }
}
