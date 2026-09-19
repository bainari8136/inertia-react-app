<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Faculty extends Model
{
    protected $fillable = ['name', 'code'];

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    public function programmes(): HasManyThrough
    {
        return $this->hasManyThrough(Programme::class, Department::class);
    }
}
