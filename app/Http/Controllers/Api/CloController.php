<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\HandlesRoleAccess;
use App\Http\Controllers\Controller;
use App\Models\Clo;
use App\Models\Course;
use Illuminate\Http\Request;

class CloController extends Controller
{
    use HandlesRoleAccess;

    public function index(Request $request)
    {
        $user = $request->user();
        $query = Clo::with('course');

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

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'course_id' => 'required|integer|exists:courses,id',
            'code' => 'required|string|max:20',
            'description' => 'required|string',
            'program_outcomes' => 'array',
        ]);

        $course = Course::findOrFail($validated['course_id']);
        abort_unless($this->canAccessCourse($user, $course), 403, 'You are not allowed to add CLOs to this course.');

        $clo = Clo::create($validated);

        return response()->json($clo, 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $clo = Clo::findOrFail($id);

        abort_unless($this->canAccessCourse($user, $clo->course), 403, 'You are not allowed to update this CLO.');

        $validated = $request->validate([
            'code' => 'sometimes|string|max:20',
            'description' => 'sometimes|string',
            'program_outcomes' => 'array',
        ]);

        $clo->update($validated);

        return response()->json($clo);
    }

    public function destroy($id)
    {
        $user = request()->user();
        $clo = Clo::findOrFail($id);

        abort_unless($this->canAccessCourse($user, $clo->course), 403, 'You are not allowed to delete this CLO.');

        $clo->delete();

        return response()->json(['message' => 'CLO deleted']);
    }
}
