<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\HandlesRoleAccess;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\WeeklyPlan;
use Illuminate\Http\Request;

class WeeklyPlanController extends Controller
{
    use HandlesRoleAccess;

    public function index(Request $request)
    {
        $user = $request->user();
        $query = WeeklyPlan::with('course');

        if ($this->isTeacher($user)) {
            $query->whereHas('course', fn ($q) => $q
                ->where('user_id', $user->id)
                ->orWhereHas('sharedTeachers', fn ($shared) => $shared->where('users.id', $user->id)));
        } elseif ($this->isDepartmentScopedRole($user)) {
            $query->whereHas('course', fn ($q) => $q->where('department_id', $user->department_id));
        }

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        return response()->json($query->orderBy('week_number')->get());
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'course_id' => 'required|integer|exists:courses,id',
            'week_number' => 'required|integer|min:1|max:20',
            'title' => 'required|string',
            'learning_outcomes' => 'array',
            'topics' => 'array',
            'teaching_learning_activities' => 'array',
            'assessment_methods' => 'array',
            'related_clo' => 'nullable|array',
        ]);

        $course = Course::findOrFail($validated['course_id']);
        abort_unless($this->canAccessCourse($user, $course), 403, 'You are not allowed to add weekly plans to this course.');

        $plan = WeeklyPlan::create($validated);

        return response()->json($plan, 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $plan = WeeklyPlan::findOrFail($id);

        abort_unless($this->canAccessCourse($user, $plan->course), 403, 'You are not allowed to update this weekly plan.');

        $validated = $request->validate([
            'week_number' => 'sometimes|integer|min:1|max:20',
            'title' => 'sometimes|string',
            'learning_outcomes' => 'array',
            'topics' => 'array',
            'teaching_learning_activities' => 'array',
            'assessment_methods' => 'array',
            'related_clo' => 'nullable|array',
        ]);

        $plan->update($validated);

        return response()->json($plan);
    }

    public function destroy($id)
    {
        $user = request()->user();
        $plan = WeeklyPlan::findOrFail($id);

        abort_unless($this->canAccessCourse($user, $plan->course), 403, 'You are not allowed to delete this weekly plan.');

        $plan->delete();

        return response()->json(['message' => 'Weekly plan deleted']);
    }
}
