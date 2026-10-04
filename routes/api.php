<?php

use App\Http\Controllers\Api\AdminBookingController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ---- Public auth routes ----
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// ---- Protected routes (require Bearer token) ----
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);

    // ---- Admin-only routes (require auth:sanctum AND is_admin) ----
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/bookings', [AdminBookingController::class, 'index']);
        Route::delete('/bookings/{id}', [AdminBookingController::class, 'destroy']);
    });
});