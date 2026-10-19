<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthSiswaController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'nis' => 'required',
            'password' => 'required'
        ]);

        // ✅ pakai Eloquent model (benar untuk Sanctum)
        $siswa = Siswa::where('nis', $request->nis)->first();

        if (!$siswa) {
            return response()->json([
                'success' => false,
                'message' => 'NIS tidak ditemukan'
            ], 401);
        }

        if (!Hash::check($request->password, $siswa->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Password salah'
            ], 401);
        }

        // 🔥 Sanctum token (INI SUDAH BENAR)
        $token = $siswa->createToken('siswa-token')->plainTextToken;

        $latestSt = \App\Models\SiswaTahun::where('siswa_id', $siswa->id)->orderByDesc('id')->with('rombel')->first();
        $kelas = $latestSt?->rombel?->tingkat_kelas ?? $siswa->kelas;
        $subKelas = $latestSt?->rombel?->sub_nama ?? $siswa->sub;

        return response()->json([
            'success' => true,
            'token' => $token,
            'siswa' => [
                'id' => $siswa->id,
                'nama' => $siswa->nama,
                'nis' => $siswa->nis,
                'kelas' => $kelas,
                'sub_kelas' => $subKelas,
            ]
        ]);
    }

    /**
     * ======================================
     * ME (VERSI SANCTUM - FIX TOTAL)
     * ======================================
     */
    public function me(Request $request)
    {
        // 🔥 ini cara benar Sanctum
        $siswa = $request->user();

        if (!$siswa) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        $latestSt = \App\Models\SiswaTahun::where('siswa_id', $siswa->id)->orderByDesc('id')->with('rombel')->first();
        $kelas = $latestSt?->rombel?->tingkat_kelas ?? $siswa->kelas;
        $subKelas = $latestSt?->rombel?->sub_nama ?? $siswa->sub;

        return response()->json([
            'success' => true,
            'siswa' => [
                'id' => $siswa->id,
                'nama' => $siswa->nama,
                'nis' => $siswa->nis,
                'kelas' => $kelas,
                'sub_kelas' => $subKelas,
            ]
        ]);
    }
}