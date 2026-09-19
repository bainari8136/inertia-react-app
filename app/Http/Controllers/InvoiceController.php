<?php

namespace App\Http\Controllers;

use App\Models\FeeStructure;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Student;
use App\Services\FinanceService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function __construct(
        private FinanceService $financeService,
    ) {}

    public function index(Request $request)
    {
        $this->authorize('viewAny', Invoice::class);

        $user = $request->user();

        $query = Invoice::query()
            ->with(['student:id,first_name,last_name,registration_number', 'feeStructure:id,name'])
            ->when($request->filled('search'), function ($q) use ($request) {
                $search = $request->string('search');
                $q->where(function ($inner) use ($search) {
                    $inner->where('invoice_number', 'like', "%{$search}%")
                        ->orWhereHas('student', function ($s) use ($search) {
                            $s->where('registration_number', 'like', "%{$search}%")
                                ->orWhere('first_name', 'like', "%{$search}%")
                                ->orWhere('last_name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->boolean('outstanding'), fn ($q) => $q->outstanding());

        if ($user->can('invoices.view-own') && ! $user->can('invoices.view')) {
            abort_if(! $user->student, 403);
            $query->where('student_id', $user->student->id);
        }

        $invoices = $query
            ->latest('issued_at')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Invoice $i) => $this->invoiceListItem($i));

        return Inertia::render('Finance/Invoices/Index', [
            'invoices' => $invoices,
            'filters' => $request->only(['search', 'status', 'outstanding']),
            'statuses' => [Invoice::STATUS_ISSUED, Invoice::STATUS_PARTIAL, Invoice::STATUS_PAID, Invoice::STATUS_CANCELLED],
            'canCreate' => $user->can('create', Invoice::class),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Invoice::class);

        return Inertia::render('Finance/Invoices/Create', [
            'students' => Student::query()
                ->where('status', Student::STATUS_ACTIVE)
                ->orderBy('last_name')
                ->get(['id', 'first_name', 'last_name', 'registration_number', 'programme_id'])
                ->map(fn (Student $s) => [
                    'id' => $s->id,
                    'label' => "{$s->registration_number} — {$s->fullName()}",
                    'programme_id' => $s->programme_id,
                ]),
            'feeStructures' => FeeStructure::query()
                ->where('is_active', true)
                ->with('programme:id,name')
                ->get()
                ->map(fn (FeeStructure $f) => [
                    'id' => $f->id,
                    'label' => "{$f->name} — {$f->programme?->name} ($".number_format((float) $f->amount, 2).')',
                    'programme_id' => $f->programme_id,
                    'amount' => (float) $f->amount,
                    'name' => $f->name,
                ]),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Invoice::class);

        $data = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'fee_structure_id' => ['nullable', 'exists:fee_structures,id'],
            'description' => ['required_without:fee_structure_id', 'string', 'max:255'],
            'amount' => ['required_without:fee_structure_id', 'numeric', 'min:0'],
            'due_date' => ['nullable', 'date'],
        ]);

        $student = Student::findOrFail($data['student_id']);

        if (! empty($data['fee_structure_id'])) {
            $fee = FeeStructure::findOrFail($data['fee_structure_id']);
            $invoice = $this->financeService->createInvoiceFromFeeStructure($student, $fee, $request->user());
        } else {
            $invoice = $this->financeService->createInvoice(
                $student,
                $data['description'],
                (float) $data['amount'],
                $request->user(),
                null,
                $data['due_date'] ?? null,
            );
        }

        return redirect()
            ->route('finance.invoices.show', $invoice)
            ->with('status', 'Invoice generated successfully.');
    }

    public function show(Invoice $invoice)
    {
        $this->authorize('view', $invoice);

        $invoice->load(['student.programme', 'feeStructure', 'payments.recorder:id,name', 'issuer:id,name']);

        return Inertia::render('Finance/Invoices/Show', [
            'invoice' => $this->invoiceDetail($invoice),
            'paymentMethods' => Payment::METHODS,
            'canRecordPayment' => request()->user()->can('payments.record'),
        ]);
    }

    public function cancel(Invoice $invoice)
    {
        $this->authorize('create', Invoice::class);

        if ($invoice->amount_paid > 0) {
            return back()->withErrors(['invoice' => 'Cannot cancel an invoice with payments recorded.']);
        }

        $invoice->update(['status' => Invoice::STATUS_CANCELLED]);

        return back()->with('status', 'Invoice cancelled.');
    }

    /** @return array<string, mixed> */
    private function invoiceListItem(Invoice $invoice): array
    {
        return [
            'id' => $invoice->id,
            'invoice_number' => $invoice->invoice_number,
            'student_name' => $invoice->student?->fullName(),
            'registration_number' => $invoice->student?->registration_number,
            'description' => $invoice->description,
            'amount' => (float) $invoice->amount,
            'amount_paid' => (float) $invoice->amount_paid,
            'balance' => $invoice->balanceDue(),
            'status' => $invoice->status,
            'due_date' => $invoice->due_date?->toDateString(),
            'issued_at' => $invoice->issued_at?->toDateString(),
        ];
    }

    /** @return array<string, mixed> */
    private function invoiceDetail(Invoice $invoice): array
    {
        return [
            ...$this->invoiceListItem($invoice),
            'programme' => $invoice->student?->programme?->name,
            'issued_by' => $invoice->issuer?->name,
            'payments' => $invoice->payments->map(fn (Payment $p) => [
                'id' => $p->id,
                'receipt_number' => $p->receipt_number,
                'amount' => (float) $p->amount,
                'payment_method' => $p->payment_method,
                'reference' => $p->reference,
                'paid_at' => $p->paid_at->toDateTimeString(),
                'recorded_by' => $p->recorder?->name,
            ]),
        ];
    }
}
