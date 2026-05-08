<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::query()->where('email', '=', (string) $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (! in_array($user->role, ['Admin', 'Teacher'], true)) {
            throw ValidationException::withMessages([
                'email' => ['Only Admin and Teacher accounts can sign in.'],
            ]);
        }

        $sessionAuthenticated = $request->hasSession(true);
        if ($sessionAuthenticated) {
            Auth::guard('web')->login($user);
            $request->session()->regenerate();
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'session_authenticated' => $sessionAuthenticated,
            'user' => [
                'id' => $user->id,
                'fullName' => $user->full_name ?? $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar' => $user->avatar,
                'department' => $user->department?->department_name,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $accessToken = $request->user()?->currentAccessToken();
        if ($accessToken && method_exists($accessToken, 'delete')) {
            $accessToken->delete();
        }

        if ($request->hasSession(true)) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'fullName' => $user->full_name ?? $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'avatar' => $user->avatar,
            'department' => $user->department?->department_name,
            'status' => $user->status,
        ]);
    }
}
