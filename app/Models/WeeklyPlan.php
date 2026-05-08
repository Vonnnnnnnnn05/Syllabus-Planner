<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WeeklyPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'week_number',
        'title',
        'learning_outcomes',
        'topics',
        'teaching_learning_activities',
        'assessment_methods',
        'related_clo',
    ];

    protected $casts = [
        'learning_outcomes' => 'array',
        'topics' => 'array',
        'teaching_learning_activities' => 'array',
        'assessment_methods' => 'array',
        'related_clo' => 'array',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
