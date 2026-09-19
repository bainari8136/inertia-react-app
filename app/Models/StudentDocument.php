<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class StudentDocument extends Model
{
    protected $fillable = [
        'documentable_type',
        'documentable_id',
        'document_type',
        'original_name',
        'file_path',
    ];

    public function documentable(): MorphTo
    {
        return $this->morphTo();
    }
}
