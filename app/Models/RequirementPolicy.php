<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RequirementPolicy extends Model
{
    use HasFactory;

    protected $table = 'requirement_policies';

    protected $fillable = [
        'course_id',
        'requirements',
        'policies',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
