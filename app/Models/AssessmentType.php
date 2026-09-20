<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AssessmentType extends Model
{
    use HasFactory;

    public const CATEGORY_COURSEWORK = 'coursework';
    public const CATEGORY_FINAL_EXAM = 'final_exam';
    public const CATEGORY_SUPPLEMENTARY = 'supplementary';

    protected $fillable = [
        'name',
        'code',
        'category',
        'max_score',
        'weight_percentage',
        'is_active',
    ];

    protected $casts = [
        'max_score' => 'float',
        'weight_percentage' => 'float',
        'is_active' => 'boolean',
    ];

    public function marks(): HasMany
    {
        return $this->hasMany(ExamMark::class);
    }
}
