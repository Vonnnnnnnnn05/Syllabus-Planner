<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $query = Course::with('department', 'user');

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

        return response()->json($course);
    }

    public function store(Request $request)
    {
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

        $validated['user_id'] = auth()->id() ?? 1;

        $course = Course::create($validated);

        return response()->json($course, 201);
    }

    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);

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

        $course->update($validated);

        return response()->json($course);
    }

    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $course->delete();

        return response()->json(['message' => 'Course deleted']);
    }
}
