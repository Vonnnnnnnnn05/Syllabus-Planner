<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\CloController;
use App\Http\Controllers\Api\WeeklyPlanController;
use App\Http\Controllers\Api\GradingSystemController;
use App\Http\Controllers\Api\SyllabusController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::middleware('role:Admin,Dean,Department Head,Program Chair,Coordinator,Teacher')->group(function () {
        Route::apiResource('courses', CourseController::class);
        Route::apiResource('clos', CloController::class);
        Route::apiResource('weekly-plans', WeeklyPlanController::class);
        Route::apiResource('grading-systems', GradingSystemController::class);
        Route::apiResource('syllabi', SyllabusController::class);
        Route::get('/departments', [DepartmentController::class, 'index']);
        Route::get('/users', [UserController::class, 'index']);
        Route::put('/users/{id}', [UserController::class, 'update']);
    });

    Route::middleware('role:Admin,Dean,Department Head')->group(function () {
        Route::post('/departments', [DepartmentController::class, 'store']);
        Route::put('/departments/{id}', [DepartmentController::class, 'update']);
        Route::delete('/departments/{id}', [DepartmentController::class, 'destroy']);
    });

    Route::middleware('role:Admin')->group(function () {
        Route::post('/users', [UserController::class, 'store']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
});
