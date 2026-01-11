<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\LegalCaseController;
use App\Http\Controllers\TeamMemberController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NoteController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);
    
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/reports', [DashboardController::class, 'reports']);

    Route::apiResource('clients', ClientController::class);
    Route::apiResource('cases', LegalCaseController::class);
    Route::apiResource('team-members', TeamMemberController::class);
    Route::apiResource('tasks', TaskController::class);
    Route::apiResource('schedules', ScheduleController::class);
    Route::apiResource('documents', DocumentController::class);
    Route::get('/documents/{id}/download', [DocumentController::class, 'download']);
    Route::apiResource('notes', NoteController::class);
});
