<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GraduationCohort extends Model
{
    use HasFactory;

    public const STATUS_UPCOMING = 'upcoming';
    public const STATUS_OPEN = 'open_for_clearance';
    public const STATUS_CONCLUDED = 'concluded';

    protected $fillable = [
        'academic_year_id',
        'name',
        'ceremony_date',
        'status',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'ceremony_date' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function clearanceRequests(): HasMany
    {
        return $this->hasMany(ClearanceRequest::class);
    }
}
