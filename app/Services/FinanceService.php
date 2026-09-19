<?php

namespace App\Services;

use App\Models\FeeStructure;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class FinanceService
{
    public function generateInvoiceNumber(): string
    {
        $year = now()->year;
        $count = Invoice::query()->whereYear('created_at', $year)->count() + 1;

        return sprintf('INV/%d/%05d', $year, $count);
    }

    public function generateReceiptNumber(): string
    {
        $year = now()->year;
        $count = Payment::query()->whereYear('created_at', $year)->count() + 1;

        return sprintf('RCPT/%d/%05d', $year, $count);
    }

    public function createInvoice(
        Student $student,
        string $description,
        float $amount,
        User $issuer,
        ?FeeStructure $feeStructure = null,
        ?string $dueDate = null,
    ): Invoice
     {
        return Invoice::create([
            'student_id' => $student->id,
            'fee_structure_id' => $feeStructure?->id,
            'invoice_number' => $this->generateInvoiceNumber(),
            'description' => $description,
            'amount' => $amount,
            'amount_paid' => 0,
            'status' => Invoice::STATUS_ISSUED,
            'due_date' => $dueDate,
            'issued_at' => now(),
            'issued_by' => $issuer->id,
        ]);
    }

    public function createInvoiceFromFeeStructure(Student $student, FeeStructure $fee, User $issuer): Invoice
    {
        if ($fee->programme_id !== $student->programme_id) {
            throw ValidationException::withMessages([
                'fee_structure_id' => 'This fee does not apply to the student\'s programme.',
            ]);
        }

        return $this->createInvoice(
            $student,
            $fee->name,
            (float) $fee->amount,
            $issuer,
            $fee,
            now()->addDays(30)->toDateString(),
        );
    }

    /**
     * @return list<Invoice>
     */
    public function bulkInvoiceForProgramme(FeeStructure $fee, User $issuer): array
    {
        $students = Student::query()
            ->where('programme_id', $fee->programme_id)
            ->where('status', Student::STATUS_ACTIVE)
            ->get();

        $created = [];

        DB::transaction(function () use ($students, $fee, $issuer, &$created) {
            foreach ($students as $student) {
                $exists = Invoice::query()
                    ->where('student_id', $student->id)
                    ->where('fee_structure_id', $fee->id)
                    ->whereNotIn('status', [Invoice::STATUS_CANCELLED])
                    ->exists();

                if ($exists) {
                    continue;
                }

                $created[] = $this->createInvoiceFromFeeStructure($student, $fee, $issuer);
            }
        });

        return $created;
    }

    public function recordPayment(Invoice $invoice, float $amount, string $method, User $recorder, ?string $reference = null): Payment
    {
        if ($invoice->status === Invoice::STATUS_CANCELLED) {
            throw ValidationException::withMessages([
                'amount' => 'Cannot record payment on a cancelled invoice.',
            ]);
        }

        if ($amount <= 0) {
            throw ValidationException::withMessages([
                'amount' => 'Payment amount must be greater than zero.',
            ]);
        }

        if ($amount > $invoice->balanceDue()) {
            throw ValidationException::withMessages([
                'amount' => 'Payment exceeds the outstanding balance.',
            ]);
        }

        return DB::transaction(function () use ($invoice, $amount, $method, $recorder, $reference) {
            $payment = Payment::create([
                'invoice_id' => $invoice->id,
                'receipt_number' => $this->generateReceiptNumber(),
                'amount' => $amount,
                'payment_method' => $method,
                'reference' => $reference,
                'paid_at' => now(),
                'recorded_by' => $recorder->id,
            ]);

            $invoice->increment('amount_paid', $amount);
            $invoice->refresh()->refreshPaymentStatus();

            return $payment->load('invoice.student');
        });
    }

    public function studentOutstandingBalance(Student $student): float
    {
        return (float) Invoice::query()
            ->where('student_id', $student->id)
            ->outstanding()
            ->selectRaw('SUM(amount - amount_paid) as balance')
            ->value('balance') ?? 0;
    }

    public function totalRevenue(): float
    {
        return (float) Payment::query()->sum('amount');
    }

    public function totalOutstanding(): float
    {
        return (float) Invoice::query()
            ->outstanding()
            ->selectRaw('SUM(amount - amount_paid) as balance')
            ->value('balance') ?? 0;
    }
}
