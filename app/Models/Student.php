<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Student extends Model
{
    public const STATUS_ACTIVE = 'active';

    public const STATUS_DEFERRED = 'deferred';

    public const STATUS_SUSPENDED = 'suspended';

    public const STATUS_GRADUATED = 'graduated';

    public const STATUS_WITHDRAWN = 'withdrawn';

    /** @var list<string> */
    public const STATUSES = [
        self::STATUS_ACTIVE,
        self::STATUS_DEFERRED,
        self::STATUS_SUSPENDED,
        self::STATUS_GRADUATED,
        self::STATUS_WITHDRAWN,
    ];

    protected $fillable = [
        'user_id',
        'applicant_id',
        'programme_id',
        'registration_number',
        'status',
        'first_name',
        'last_name',
        'middle_name',
        'email',
        'phone',
        'date_of_birth',
        'gender',
        'address',
        'city',
        'country',
        'guardian_name',
        'guardian_phone',
        'guardian_relationship',
        'academic_history',
        'admitted_at',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'admitted_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function applicant(): BelongsTo
    {
        return $this->belongsTo(Applicant::class);
    }

    public function programme(): BelongsTo
    {
        return $this->belongsTo(Programme::class);
    }

    public function documents(): MorphMany
    {
        return $this->morphMany(StudentDocument::class, 'documentable');
    }

    public function semesterRegistrations(): HasMany
    {
        return $this->hasMany(SemesterRegistration::class);
    }

    public function semesterResults(): HasMany
    {
        return $this->hasMany(StudentSemesterResult::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function canRegister(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    public function fullName(): string
    {
        return trim("{$this->first_name} {$this->middle_name} {$this->last_name}");
    }
}
