<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    public const STATUS_ISSUED = 'issued';

    public const STATUS_PARTIAL = 'partial';

    public const STATUS_PAID = 'paid';

    public const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'student_id',
        'fee_structure_id',
        'invoice_number',
        'description',
        'amount',
        'amount_paid',
        'status',
        'due_date',
        'issued_at',
        'issued_by',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'amount_paid' => 'decimal:2',
            'due_date' => 'date',
            'issued_at' => 'datetime',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function feeStructure(): BelongsTo
    {
        return $this->belongsTo(FeeStructure::class);
    }

    public function issuer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issued_by');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function balanceDue(): float
    {
        return max(0, (float) $this->amount - (float) $this->amount_paid);
    }

    public function refreshPaymentStatus(): void
    {
        $paid = (float) $this->amount_paid;

        if ($paid <= 0) {
            $status = self::STATUS_ISSUED;
        } elseif ($paid >= (float) $this->amount) {
            $status = self::STATUS_PAID;
        } else {
            $status = self::STATUS_PARTIAL;
        }

        $this->update(['status' => $status]);
    }

    public function scopeOutstanding($query)
    {
        return $query->whereIn('status', [self::STATUS_ISSUED, self::STATUS_PARTIAL]);
    }
}
