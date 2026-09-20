<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseRegistration extends Model
{
    public const STATUS_ENROLLED = 'enrolled';

    public const STATUS_DROPPED = 'dropped';

    protected $fillable = [
        'semester_registration_id',
        'course_id',
        'status',
    ];

    public function semesterRegistration(): BelongsTo
    {
        return $this->belongsTo(SemesterRegistration::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function courseResult(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(CourseResult::class);
    }
}
