<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Clo extends Model
{
    use HasFactory;

    protected $table = 'clos';

    protected $fillable = [
        'course_id',
        'code',
        'description',
        'program_outcomes',
    ];

    protected $casts = [
        'program_outcomes' => 'array',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
