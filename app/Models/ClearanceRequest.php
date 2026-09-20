<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClearanceRequest extends Model
{
    use HasFactory;

    public const TYPE_GRADUATION = 'graduation';
    public const TYPE_DEPARTURE = 'departure';
    public const TYPE_TRANSFER = 'transfer';

    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';

    protected $fillable = [
        'student_id',
        'graduation_cohort_id',
        'type',
        'status',
        'overall_cgpa',
        'degree_classification',
        'certificate_number',
        'submitted_at',
        'completed_at',
        'final_remarks',
    ];

    protected function casts(): array
    {
        return [
            'overall_cgpa' => 'decimal:2',
            'submitted_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function graduationCohort(): BelongsTo
    {
        return $this->belongsTo(GraduationCohort::class);
    }

    public function stages(): HasMany
    {
        return $this->hasMany(ClearanceStage::class);
    }

    public function isFullyApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }
}
