<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\HandlesRoleAccess;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    use HandlesRoleAccess;

    public function index(Request $request)
    {
        $authUser = $request->user();
        $query = User::with('department')->whereIn('role', ['Admin', 'Teacher']);

        if ($this->isTeacher($authUser)) {
            $query->where('id', $authUser->id);
        } elseif ($this->isDepartmentScopedRole($authUser)) {
            $query->where('department_id', $authUser->department_id);
        }

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

    public function teachers()
    {
        return response()->json(
            User::query()
                ->where('role', 'Teacher')
                ->where('status', 'Active')
                ->orderBy('full_name')
                ->get(['id', 'name', 'full_name', 'email'])
        );
    }

    public function store(Request $request)
    {
        abort_unless($this->canManageUsers($request->user()), 403, 'You are not allowed to create users.');

        $validated = $request->validate([
            'name' => 'required|string',
            'full_name' => 'nullable|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'department_id' => 'nullable|integer',
            'role' => 'required|in:Admin,Teacher',
            'avatar' => 'nullable|string|max:10',
            'status' => 'string|max:20',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        return response()->json($user, 201);
    }

    public function update(Request $request, $id)
    {
        $authUser = $request->user();
        abort_unless($this->canManageUsers($authUser) || (int) $authUser->id === (int) $id, 403, 'You are not allowed to update this user.');

        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'full_name' => 'nullable|string',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'department_id' => 'nullable|integer',
            'role' => 'sometimes|in:Admin,Teacher',
            'avatar' => 'nullable|string|max:10',
            'status' => 'sometimes|string|max:20',
            'password' => 'nullable|string|min:6',
        ]);

        if (! $this->canManageUsers($authUser)) {
            unset($validated['role'], $validated['department_id'], $validated['status']);
        }

        if ($request->filled('password')) {
            $validated['password'] = Hash::make($request->password);
        }

        $user->update($validated);

        return response()->json($user);
    }

    public function destroy($id)
    {
        abort_unless($this->canManageUsers(request()->user()), 403, 'You are not allowed to delete users.');

        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }
}
