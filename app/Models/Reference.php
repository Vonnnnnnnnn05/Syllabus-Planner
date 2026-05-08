<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reference extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'reference_type',
        'reference_title',
        'reference_author',
        'reference_year',
        'reference_link',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
