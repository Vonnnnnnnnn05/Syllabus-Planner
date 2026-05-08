<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'department_id',
        'course_code',
        'course_title',
        'course_description',
        'prerequisite',
        'credit_units',
        'semester',
        'academic_year',
        'total_hours',
        'lecture_hours',
        'lab_hours',
        'status',
    ];

    protected $casts = [
        'credit_units' => 'integer',
        'total_hours' => 'integer',
        'lecture_hours' => 'integer',
        'lab_hours' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function sharedTeachers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'course_shares')->withTimestamps();
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function clos(): HasMany
    {
        return $this->hasMany(Clo::class);
    }

    public function weeklyPlans(): HasMany
    {
        return $this->hasMany(WeeklyPlan::class);
    }

    public function gradingSystems(): HasMany
    {
        return $this->hasMany(GradingSystem::class);
    }

    public function requirementPolicies(): HasMany
    {
        return $this->hasMany(RequirementPolicy::class);
    }

    public function references(): HasMany
    {
        return $this->hasMany(Reference::class);
    }

    public function syllabi(): HasMany
    {
        return $this->hasMany(Syllabus::class);
    }

    public function rubrics(): HasMany
    {
        return $this->hasMany(Rubric::class);
    }
}
