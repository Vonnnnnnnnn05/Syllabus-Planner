<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index()
    {
        return response()->json(Department::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'department_name' => 'required|string',
            'department_code' => 'nullable|string|max:20',
        ]);

        $department = Department::create($validated);

        return response()->json($department, 201);
    }

    public function update(Request $request, $id)
    {
        $department = Department::findOrFail($id);

        $validated = $request->validate([
            'department_name' => 'sometimes|string',
            'department_code' => 'nullable|string|max:20',
        ]);

        $department->update($validated);

        return response()->json($department);
    }

    public function destroy($id)
    {
        $department = Department::findOrFail($id);
        $department->delete();

        return response()->json(['message' => 'Department deleted']);
    }
}
