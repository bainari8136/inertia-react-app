<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GradingScale extends Model
{
    use HasFactory;

    protected $fillable = [
        'grade',
        'min_score',
        'max_score',
        'grade_points',
        'remark',
    ];

    protected $casts = [
        'min_score' => 'float',
        'max_score' => 'float',
        'grade_points' => 'float',
    ];
}
