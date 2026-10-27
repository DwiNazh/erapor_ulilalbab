<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\TahunAjaran;
use Illuminate\Support\Facades\DB;

class CheckTahunAjaranFinal
{
    public function handle($request, Closure $next)
    {
        $tahun = TahunAjaran::getAktif();

        if ($tahun) {
            $user = $request->user();
            $jenjangId = null;

            if ($user && !$user->isSuperadmin()) {
                $jenjangId = $user->jenjang_id;
            } else {
                $jenjangId = $request->input('jenjang_id') ?? $request->header('X-Jenjang-Id');
                if (!$jenjangId && $request->filled('rombel_id')) {
                    $jenjangId = DB::table('rombel')->where('id', $request->rombel_id)->value('jenjang_id');
                }
            }

            if ($jenjangId && $tahun->isFinalizedForJenjang($jenjangId)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Proses untuk jenjang ini telah difinalisasi. Perubahan data dikunci.'
                ], 403);
            }

            if (!$jenjangId && $tahun->finalized_at) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tahun ajaran telah difinalisasi. Perubahan data dikunci.'
                ], 403);
            }
        }

        return $next($request);
    }
}
