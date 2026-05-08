<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Syllabus;
use Illuminate\Http\Request;

class SyllabusController extends Controller
{
    public function index(Request $request)
    {
        $query = Syllabus::with('course');

        if ($request->has('status') && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|integer|exists:courses,id',
            'status' => 'string|max:30',
            'version' => 'integer',
            'notes' => 'nullable|string',
        ]);

        $syllabus = Syllabus::create($validated);

        return response()->json($syllabus, 201);
    }

    public function update(Request $request, $id)
    {
        $syllabus = Syllabus::findOrFail($id);

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
        $syllabus = Syllabus::findOrFail($id);
        $syllabus->delete();

        return response()->json(['message' => 'Syllabus deleted']);
    }
}
