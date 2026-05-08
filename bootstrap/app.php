<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Throwable $e, Request $request) {
            if (! $request->expectsJson()) {
                return null;
            }

            if (! ($e instanceof HttpExceptionInterface) || $e->getStatusCode() !== 403) {
                return null;
            }

            $userRole = $request->user()?->role;

            return response()->json([
                'message' => $e->getMessage() ?: 'Access denied by role.',
                'your_role' => $userRole,
                'role_access_map' => [
                    'Admin' => ['full-access', 'manage-users', 'manage-departments'],
                    'Dean' => ['view-all-academic-data', 'manage-departments'],
                    'Department Head' => ['department-scoped-data', 'manage-departments'],
                    'Program Chair' => ['department-scoped-data'],
                    'Coordinator' => ['department-scoped-data'],
                    'Teacher' => ['own-course-data'],
                ],
            ], 403);
        });
    })->create();
