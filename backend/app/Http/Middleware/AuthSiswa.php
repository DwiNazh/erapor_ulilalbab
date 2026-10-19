<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuthSiswa
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized - token tidak ditemukan.',
            ], 401);
        }

        try {
            // Decode custom token base64 (format dari AuthSiswaController lama)
            $data   = json_decode(base64_decode($token), true);
            $sumber = $data['sumber'] ?? null;
            $id     = $data['id']     ?? null;

            if (!$sumber || !$id) {
                throw new \Exception('Struktur token tidak valid');
            }

            if ($sumber === 'siswa') {
                $siswa = DB::table('siswa')->where('id', $id)->first();
            } else {
                $siswa = DB::table('siswas')->where('id', $id)->first();
            }

            if (!$siswa) {
                throw new \Exception('Siswa tidak ditemukan');
            }

            // Inject ke request — diambil di controller via $request->_siswa
            $request->attributes->set('_siswa', $siswa);
            $request->attributes->set('_sumber', $sumber);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token tidak valid atau sudah kadaluarsa.',
            ], 401);
        }

        return $next($request);
    }
}