<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\HandlesRoleAccess;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\RequirementPolicy;
use Illuminate\Http\Request;

class RequirementPolicyController extends Controller
{
    use HandlesRoleAccess;

    public function index(Request $request)
    {
        $user = $request->user();
        $query = RequirementPolicy::with('course');

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        if ($this->isTeacher($user)) {
            $query->whereHas('course', fn ($q) => $q
                ->where('user_id', $user->id)
                ->orWhereHas('sharedTeachers', fn ($shared) => $shared->where('users.id', $user->id)));
        } elseif ($this->isDepartmentScopedRole($user)) {
            $query->whereHas('course', fn ($q) => $q->where('department_id', $user->department_id));
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'course_id' => 'required|integer|exists:courses,id',
            'requirements' => 'required|string',
            'policies' => 'required|string',
        ]);

        $course = Course::findOrFail($validated['course_id']);
        abort_unless($this->canAccessCourse($user, $course), 403, 'You are not allowed to add policies to this course.');

        $policy = RequirementPolicy::create($validated);

        return response()->json($policy->load('course'), 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $policy = RequirementPolicy::findOrFail($id);

        abort_unless($this->canAccessCourse($user, $policy->course), 403, 'You are not allowed to update this policy.');

        $validated = $request->validate([
            'requirements' => 'sometimes|string',
            'policies' => 'sometimes|string',
        ]);

        $policy->update($validated);

        return response()->json($policy->load('course'));
    }

    public function destroy($id)
    {
        $user = request()->user();
        $policy = RequirementPolicy::findOrFail($id);

        abort_unless($this->canAccessCourse($user, $policy->course), 403, 'You are not allowed to delete this policy.');

        $policy->delete();

        return response()->json(['message' => 'Policy deleted']);
    }
}
