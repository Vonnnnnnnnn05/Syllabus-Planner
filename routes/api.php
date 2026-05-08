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

    Route::apiResource('courses', CourseController::class);
    Route::apiResource('clos', CloController::class);
    Route::apiResource('weekly-plans', WeeklyPlanController::class);
    Route::apiResource('grading-systems', GradingSystemController::class);
    Route::apiResource('syllabi', SyllabusController::class);
    Route::apiResource('departments', DepartmentController::class);
    Route::apiResource('users', UserController::class);
});
