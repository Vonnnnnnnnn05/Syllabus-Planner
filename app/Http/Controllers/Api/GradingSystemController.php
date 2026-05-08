<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GradingSystem;
use Illuminate\Http\Request;

class GradingSystemController extends Controller
{
    public function index(Request $request)
    {
        $query = GradingSystem::with('course');

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
        $validated = $request->validate([
            'course_id' => 'required|integer|exists:courses,id',
            'term' => 'required|string|max:20',
            'component_name' => 'required|string',
            'percentage' => 'required|integer|min:0|max:100',
        ]);

        $component = GradingSystem::create($validated);

        return response()->json($component, 201);
    }

    public function update(Request $request, $id)
    {
        $component = GradingSystem::findOrFail($id);

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
        $component = GradingSystem::findOrFail($id);
        $component->delete();

        return response()->json(['message' => 'Grading component deleted']);
    }
}
