<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Payment;
use App\Services\FinanceService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinanceReportController extends Controller
{
    public function __construct(
        private FinanceService $financeService,
    ) {}

    public function index(Request $request)
    {
        abort_unless($request->user()->can('finance.reports'), 403);

        $recentPayments = Payment::query()
            ->with(['invoice.student:id,first_name,last_name,registration_number'])
            ->latest('paid_at')
            ->limit(10)
            ->get()
            ->map(fn (Payment $p) => [
                'receipt_number' => $p->receipt_number,
                'amount' => (float) $p->amount,
                'paid_at' => $p->paid_at->toDateString(),
                'student' => $p->invoice?->student?->fullName(),
                'registration_number' => $p->invoice?->student?->registration_number,
                'invoice_number' => $p->invoice?->invoice_number,
            ]);

        $topOutstanding = Invoice::query()
            ->outstanding()
            ->with('student:id,first_name,last_name,registration_number')
            ->orderByRaw('(amount - amount_paid) DESC')
            ->limit(10)
            ->get()
            ->map(fn (Invoice $i) => [
                'invoice_number' => $i->invoice_number,
                'student_name' => $i->student?->fullName(),
                'registration_number' => $i->student?->registration_number,
                'balance' => $i->balanceDue(),
            ]);

        return Inertia::render('Finance/Reports', [
            'stats' => [
                'total_revenue' => $this->financeService->totalRevenue(),
                'total_outstanding' => $this->financeService->totalOutstanding(),
                'invoices_issued' => Invoice::whereNotIn('status', [Invoice::STATUS_CANCELLED])->count(),
                'invoices_paid' => Invoice::where('status', Invoice::STATUS_PAID)->count(),
            ],
            'recentPayments' => $recentPayments,
            'topOutstanding' => $topOutstanding,
        ]);
    }
}
