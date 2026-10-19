<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if (!$user->role) {
            return response()->json(['message' => 'Role user tidak ditemukan'], 403);
        }

        // Superadmin bisa akses semua route
        if ($user->role === 'superadmin') {
            return $next($request);
        }

        if ($user->role !== $role) {
            return response()->json([
                'message'       => 'Akses ditolak',
                'required_role' => $role,
                'your_role'     => $user->role,
            ], 403);
        }

        return $next($request);
    }
}