<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\HandlesRoleAccess;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\GradingSystem;
use Illuminate\Http\Request;

class GradingSystemController extends Controller
{
    use HandlesRoleAccess;

    public function index(Request $request)
    {
        $user = $request->user();
        $query = GradingSystem::with('course');

        if ($this->isTeacher($user)) {
            $query->whereHas('course', fn ($q) => $q->where('user_id', $user->id));
        } elseif ($this->isDepartmentScopedRole($user)) {
            $query->whereHas('course', fn ($q) => $q->where('department_id', $user->department_id));
        }

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        if ($request->has('term')) {
            $query->where('term', $request->term);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'course_id' => 'required|integer|exists:courses,id',
            'term' => 'required|string|max:20',
            'component_name' => 'required|string',
            'percentage' => 'required|integer|min:0|max:100',
        ]);

        $course = Course::findOrFail($validated['course_id']);
        abort_unless($this->canAccessCourse($user, $course), 403, 'You are not allowed to edit grading for this course.');

        $component = GradingSystem::create($validated);

        return response()->json($component, 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $component = GradingSystem::findOrFail($id);

        abort_unless($this->canAccessCourse($user, $component->course), 403, 'You are not allowed to update this grading component.');

        $validated = $request->validate([
            'term' => 'sometimes|string|max:20',
            'component_name' => 'sometimes|string',
            'percentage' => 'sometimes|integer|min:0|max:100',
        ]);

        $component->update($validated);

        return response()->json($component);
    }

    public function destroy($id)
    {
        $user = request()->user();
        $component = GradingSystem::findOrFail($id);

        abort_unless($this->canAccessCourse($user, $component->course), 403, 'You are not allowed to delete this grading component.');

        $component->delete();

        return response()->json(['message' => 'Grading component deleted']);
    }
}
