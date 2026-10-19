<?php

use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

// ✅ WAJIB: taruh DI ATAS
Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);

// Route publik
Route::get('/', function () {
    return response()->json(['message' => 'Backend API Akademik Berjalan Normal']);
});

// Catch-all SPA
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');