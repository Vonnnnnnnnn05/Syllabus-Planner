<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\HandlesRoleAccess;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    use HandlesRoleAccess;

    public function index(Request $request)
    {
        $user = $request->user();
        $query = Course::with('department', 'user', 'sharedTeachers');

        if ($this->isTeacher($user)) {
            $query->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                    ->orWhereHas('sharedTeachers', fn ($shared) => $shared->where('users.id', $user->id));
            });
        } elseif ($this->isDepartmentScopedRole($user)) {
            $query->where('department_id', $user->department_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('course_code', 'like', "%{$search}%")
                  ->orWhere('course_title', 'like', "%{$search}%");
            });
        }

        if ($request->has('department') && $request->department !== 'All') {
            $query->whereHas('department', function ($q) use ($request) {
                $q->where('department_name', $request->department);
            });
        }

        if ($request->has('status') && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->get());
    }

    public function show($id)
    {
        $course = Course::with([
            'department',
            'user',
            'clos',
            'weeklyPlans',
            'gradingSystems',
            'requirementPolicies',
            'references',
            'syllabi',
            'rubrics',
        ])->findOrFail($id);

        abort_unless($this->canAccessCourse(request()->user(), $course), 403, 'You are not allowed to view this course.');

        return response()->json($course);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'course_code' => 'required|string|max:20',
            'course_title' => 'required|string',
            'course_description' => 'nullable|string',
            'prerequisite' => 'nullable|string|max:100',
            'credit_units' => 'integer|min:1|max:6',
            'semester' => 'required|string|max:50',
            'academic_year' => 'required|string|max:20',
            'department_id' => 'nullable|integer',
            'status' => 'string|max:20',
        ]);

        $validated['user_id'] = $user->id;

        if ($this->isTeacher($user) || $this->isDepartmentScopedRole($user)) {
            $validated['department_id'] = $user->department_id;
        }

        $course = Course::create($validated);

        return response()->json($course->load('department', 'user'), 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $course = Course::findOrFail($id);

        abort_unless($this->canAccessCourse($user, $course), 403, 'You are not allowed to update this course.');

        $validated = $request->validate([
            'course_code' => 'sometimes|string|max:20',
            'course_title' => 'sometimes|string',
            'course_description' => 'nullable|string',
            'prerequisite' => 'nullable|string|max:100',
            'credit_units' => 'integer|min:1|max:6',
            'semester' => 'sometimes|string|max:50',
            'academic_year' => 'sometimes|string|max:20',
            'department_id' => 'nullable|integer',
            'status' => 'string|max:20',
        ]);

        if ($this->isTeacher($user) || $this->isDepartmentScopedRole($user)) {
            unset($validated['department_id']);
        }

        $course->update($validated);

        return response()->json($course->load('department', 'user'));
    }

    public function destroy($id)
    {
        $user = request()->user();
        $course = Course::findOrFail($id);

        abort_unless(
            $this->canViewAllData($user) || (int) $course->user_id === (int) $user->id,
            403,
            'Only the owner or an admin can delete this course.'
        );

        $course->delete();

        return response()->json(['message' => 'Course deleted']);
    }

    public function share(Request $request, $id)
    {
        $user = $request->user();
        $course = Course::findOrFail($id);

        abort_unless(
            $this->canViewAllData($user) || (int) $course->user_id === (int) $user->id,
            403,
            'Only the owner or an admin can share this course.'
        );

        $validated = $request->validate([
            'teacher_id' => 'required|integer|exists:users,id',
        ]);

        $teacher = User::where('role', 'Teacher')->findOrFail($validated['teacher_id']);
        abort_if((int) $teacher->id === (int) $course->user_id, 422, 'The course owner already has access.');

        $course->sharedTeachers()->syncWithoutDetaching([$teacher->id]);

        return response()->json($course->load('department', 'user', 'sharedTeachers'));
    }
}
