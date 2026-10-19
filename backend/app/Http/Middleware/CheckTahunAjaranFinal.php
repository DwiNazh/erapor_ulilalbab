<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\TahunAjaran;

class CheckTahunAjaranFinal
{
    public function handle($request, Closure $next)
    {
        $tahun = TahunAjaran::where('is_active', 1)->first();

        if ($tahun && $tahun->finalized_at) {
            return response()->json([
                'message' => 'Tahun ajaran telah difinalisasi. Proses dikunci.'
            ], 403);
        }

        return $next($request);
    }
}
