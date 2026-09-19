<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Semester extends Model
{
    protected $fillable = [
        'academic_year_id',
        'name',
        'starts_on',
        'ends_on',
        'registration_opens_at',
        'registration_closes_at',
        'is_current',
    ];

    protected function casts(): array
    {
        return [
            'starts_on' => 'date',
            'ends_on' => 'date',
            'registration_opens_at' => 'datetime',
            'registration_closes_at' => 'datetime',
            'is_current' => 'boolean',
        ];
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function semesterRegistrations(): HasMany
    {
        return $this->hasMany(SemesterRegistration::class);
    }

    public function isRegistrationOpen(): bool
    {
        if (! $this->registration_opens_at || ! $this->registration_closes_at) {
            return false;
        }

        $now = now();

        return $now->gte($this->registration_opens_at) && $now->lte($this->registration_closes_at);
    }

    public function scopeCurrent(Builder $query): Builder
    {
        return $query->where('is_current', true);
    }

    public function scopeRegistrationOpen(Builder $query): Builder
    {
        $now = now();

        return $query
            ->where('registration_opens_at', '<=', $now)
            ->where('registration_closes_at', '>=', $now);
    }
}
