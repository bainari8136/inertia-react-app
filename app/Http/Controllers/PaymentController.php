<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Payment;
use App\Services\FinanceService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(
        private FinanceService $financeService,
    ) {}

    public function store(Request $request, Invoice $invoice)
    {
        abort_unless($request->user()->can('payments.record'), 403);

        $data = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
            'payment_method' => ['required', 'in:'.implode(',', Payment::METHODS)],
            'reference' => ['nullable', 'string', 'max:255'],
        ]);

        $payment = $this->financeService->recordPayment(
            $invoice,
            (float) $data['amount'],
            $data['payment_method'],
            $request->user(),
            $data['reference'] ?? null,
        );

        return redirect()
            ->route('finance.invoices.show', $invoice)
            ->with('status', "Payment recorded. Receipt: {$payment->receipt_number}");
    }
}
