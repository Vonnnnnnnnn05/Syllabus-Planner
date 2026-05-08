<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GradingSystem extends Model
{
    use HasFactory;

    protected $table = 'grading_systems';

    protected $fillable = [
        'course_id',
        'term',
        'component_name',
        'percentage',
    ];

    protected $casts = [
        'percentage' => 'integer',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
