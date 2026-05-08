<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rubric extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'name',
        'excellent',
        'good',
        'fair',
        'poor',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
