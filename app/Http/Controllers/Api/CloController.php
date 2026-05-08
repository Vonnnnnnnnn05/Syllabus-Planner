<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Clo;
use Illuminate\Http\Request;

class CloController extends Controller
{
    public function index(Request $request)
    {
        $query = Clo::with('course');

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|integer|exists:courses,id',
            'code' => 'required|string|max:20',
            'description' => 'required|string',
            'program_outcomes' => 'array',
        ]);

        $clo = Clo::create($validated);

        return response()->json($clo, 201);
    }

    public function update(Request $request, $id)
    {
        $clo = Clo::findOrFail($id);

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
        $clo = Clo::findOrFail($id);
        $clo->delete();

        return response()->json(['message' => 'CLO deleted']);
    }
}
