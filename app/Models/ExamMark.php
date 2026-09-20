<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamMark extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_result_id',
        'assessment_type_id',
        'score',
        'entered_by',
    ];

    protected $casts = [
        'score' => 'float',
    ];

    public function courseResult(): BelongsTo
    {
        return $this->belongsTo(CourseResult::class);
    }

    public function assessmentType(): BelongsTo
    {
        return $this->belongsTo(AssessmentType::class);
    }

    public function enteredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'entered_by');
    }
}
