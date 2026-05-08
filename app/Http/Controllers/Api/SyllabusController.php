<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\HandlesRoleAccess;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Syllabus;
use Illuminate\Http\Request;

class SyllabusController extends Controller
{
    use HandlesRoleAccess;

    public function index(Request $request)
    {
        $user = $request->user();
        $query = Syllabus::with('course');

        if ($this->isTeacher($user)) {
            $query->whereHas('course', fn ($q) => $q->where('user_id', $user->id));
        } elseif ($this->isDepartmentScopedRole($user)) {
            $query->whereHas('course', fn ($q) => $q->where('department_id', $user->department_id));
        }

        if ($request->has('status') && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'course_id' => 'required|integer|exists:courses,id',
            'status' => 'string|max:30',
            'version' => 'integer',
            'notes' => 'nullable|string',
        ]);

        $course = Course::findOrFail($validated['course_id']);
        abort_unless($this->canAccessCourse($user, $course), 403, 'You are not allowed to create syllabus for this course.');

        $syllabus = Syllabus::create($validated);

        return response()->json($syllabus, 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $syllabus = Syllabus::findOrFail($id);

        abort_unless($this->canAccessCourse($user, $syllabus->course), 403, 'You are not allowed to update this syllabus.');

        $validated = $request->validate([
            'status' => 'sometimes|string|max:30',
            'version' => 'sometimes|integer',
            'submitted_at' => 'nullable|date',
            'reviewed_by' => 'nullable|string|max:100',
            'approved_by' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        $syllabus->update($validated);

        return response()->json($syllabus);
    }

    public function destroy($id)
    {
        $user = request()->user();
        $syllabus = Syllabus::findOrFail($id);

        abort_unless($this->canAccessCourse($user, $syllabus->course), 403, 'You are not allowed to delete this syllabus.');

        $syllabus->delete();

        return response()->json(['message' => 'Syllabus deleted']);
    }
}
