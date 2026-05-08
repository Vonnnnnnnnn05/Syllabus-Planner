<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WeeklyPlan;
use Illuminate\Http\Request;

class WeeklyPlanController extends Controller
{
    public function index(Request $request)
    {
        $query = WeeklyPlan::with('course');

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        return response()->json($query->orderBy('week_number')->get());
    }

    public function store(Request $request)
    {
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

        $plan = WeeklyPlan::create($validated);

        return response()->json($plan, 201);
    }

    public function update(Request $request, $id)
    {
        $plan = WeeklyPlan::findOrFail($id);

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
        $plan = WeeklyPlan::findOrFail($id);
        $plan->delete();

        return response()->json(['message' => 'Weekly plan deleted']);
    }
}
