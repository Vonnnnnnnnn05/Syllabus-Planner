<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $userRole = strtolower(trim((string) $user->role));
        $allowedRoles = array_map(static fn ($role) => strtolower(trim($role)), $roles);

        if (! in_array($userRole, $allowedRoles, true)) {
            return $this->accessDeniedResponse($user->role, $roles);
        }

        return $next($request);
    }

    protected function accessDeniedResponse(?string $userRole, array $requiredRoles): JsonResponse
    {
        return response()->json([
            'message' => 'Access denied by role.',
            'your_role' => $userRole,
            'required_roles' => array_values($requiredRoles),
            'role_access_map' => [
                'Admin' => ['full-access', 'manage-users', 'manage-departments'],
                'Teacher' => ['own-syllabus-data'],
            ],
        ], 403);
    }
}
