<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClearanceStage extends Model
{
    use HasFactory;

    public const DEPT_ACADEMIC = 'academic';
    public const DEPT_LIBRARY = 'library';
    public const DEPT_HOSTEL = 'hostel';
    public const DEPT_FINANCE = 'finance';
    public const DEPT_WELFARE = 'dean_of_students';
    public const DEPT_REGISTRAR = 'registrar';

    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';

    /**
     * @var list<string>
     */
    public const DEPARTMENTS = [
        self::DEPT_ACADEMIC,
        self::DEPT_LIBRARY,
        self::DEPT_HOSTEL,
        self::DEPT_FINANCE,
        self::DEPT_WELFARE,
        self::DEPT_REGISTRAR,
    ];

    protected $fillable = [
        'clearance_request_id',
        'department',
        'status',
        'remarks',
        'cleared_by',
        'cleared_at',
    ];

    protected function casts(): array
    {
        return [
            'cleared_at' => 'datetime',
        ];
    }

    public function clearanceRequest(): BelongsTo
    {
        return $this->belongsTo(ClearanceRequest::class);
    }

    public function clearedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cleared_by');
    }

    public function departmentLabel(): string
    {
        return match ($this->department) {
            self::DEPT_ACADEMIC => 'Academic Affairs / HOD',
            self::DEPT_LIBRARY => 'University Library',
            self::DEPT_HOSTEL => 'Hostel & Accommodation',
            self::DEPT_FINANCE => 'Bursar / Finance',
            self::DEPT_WELFARE => 'Dean of Students (Welfare & Disciplinary)',
            self::DEPT_REGISTRAR => 'Academic Registrar (Final Verification)',
            default => ucfirst(str_replace('_', ' ', $this->department)),
        };
    }
}
