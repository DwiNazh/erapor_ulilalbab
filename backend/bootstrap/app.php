<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use App\Http\Middleware\RoleMiddleware;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'role' => RoleMiddleware::class,
            'auth.siswa' => \App\Http\Middleware\AuthSiswa::class,
        ]);

        // SPA cookie authentication
        $middleware->appendToGroup('api', [
            EnsureFrontendRequestsAreStateful::class,
        ]);

        // Hindari redirect ke halaman login untuk request API
        $middleware->redirectGuestsTo(
            fn(Request $request) => $request->is('api/*')
                ? null
                : '/login'
        );
    })

    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->shouldRenderJsonWhen(
            function (Request $request, Throwable $e) {
                return $request->is('api/*')
                    || $request->expectsJson();
            }
        );
    })->create();