<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseResult extends Model
{
    use HasFactory;

    public const STATUS_DRAFT = 'draft';
    public const STATUS_SUBMITTED = 'submitted';
    public const STATUS_PUBLISHED = 'published';

    protected $fillable = [
        'course_registration_id',
        'course_allocation_id',
        'coursework_score',
        'exam_score',
        'total_score',
        'grade',
        'grade_points',
        'remark',
        'status',
        'submitted_at',
        'published_at',
        'published_by',
    ];

    protected $casts = [
        'coursework_score' => 'float',
        'exam_score' => 'float',
        'total_score' => 'float',
        'grade_points' => 'float',
        'submitted_at' => 'datetime',
        'published_at' => 'datetime',
    ];

    public function courseRegistration(): BelongsTo
    {
        return $this->belongsTo(CourseRegistration::class);
    }

    public function courseAllocation(): BelongsTo
    {
        return $this->belongsTo(CourseAllocation::class);
    }

    public function publishedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'published_by');
    }

    public function marks(): HasMany
    {
        return $this->hasMany(ExamMark::class);
    }

    public function isPublished(): bool
    {
        return $this->status === self::STATUS_PUBLISHED;
    }
}
