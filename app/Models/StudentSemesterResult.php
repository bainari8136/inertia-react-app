<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentSemesterResult extends Model
{
    use HasFactory;

    public const STATUS_DRAFT = 'draft';
    public const STATUS_PUBLISHED = 'published';

    protected $fillable = [
        'student_id',
        'semester_id',
        'total_credit_hours',
        'total_grade_points',
        'gpa',
        'cgpa',
        'academic_standing',
        'status',
        'published_at',
    ];

    protected $casts = [
        'total_credit_hours' => 'integer',
        'total_grade_points' => 'float',
        'gpa' => 'float',
        'cgpa' => 'float',
        'published_at' => 'datetime',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }
}
