<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Syllabus extends Model
{
    use HasFactory;

    protected $table = 'syllabi';

    protected $fillable = [
        'course_id',
        'status',
        'version',
        'submitted_at',
        'reviewed_by',
        'approved_by',
        'notes',
    ];

    protected $casts = [
        'version' => 'integer',
        'submitted_at' => 'datetime',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
