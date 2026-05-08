<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('department');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('role') && $request->role !== 'All') {
            $query->where('role', $request->role);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'full_name' => 'nullable|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'department_id' => 'nullable|integer',
            'role' => 'string|max:30',
            'avatar' => 'nullable|string|max:10',
            'status' => 'string|max:20',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        return response()->json($user, 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'full_name' => 'nullable|string',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'department_id' => 'nullable|integer',
            'role' => 'sometimes|string|max:30',
            'avatar' => 'nullable|string|max:10',
            'status' => 'sometimes|string|max:20',
        ]);

        if ($request->has('password')) {
            $validated['password'] = Hash::make($request->password);
        }

        $user->update($validated);

        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }
}
