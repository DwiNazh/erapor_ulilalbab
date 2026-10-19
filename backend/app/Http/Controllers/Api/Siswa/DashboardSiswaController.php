<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardSiswaController extends Controller
{
    public function index(Request $request)
    {
        // ✅ FIX: gunakan Sanctum auth (bukan decode manual token)
        $siswa = $request->user();

        if (!$siswa) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        $siswaId = $siswa->id;

        // Ambil data siswa master
        $siswaData = DB::table('siswa')
            ->where('id', $siswaId)
            ->select('id', 'nama', 'nis')
            ->first();

        if (!$siswaData) {
            return response()->json([
                'success' => false,
                'message' => 'Siswa tidak ditemukan'
            ], 404);
        }

        // Ambil data terbaru siswa_tahun
        // ✅ FIX: kolom 'siswa_tahun.keterangan' tidak ada di tabel, dihapus dari select
        $siswaTahun = DB::table('siswa_tahun')
            ->leftJoin('rombel', 'siswa_tahun.rombel_id', '=', 'rombel.id')
            ->leftJoin('tahun_ajaran', 'siswa_tahun.tahun_ajaran_id', '=', 'tahun_ajaran.id')
            ->where('siswa_tahun.siswa_id', $siswaId)
            ->orderByDesc('siswa_tahun.id')
            ->select(
                'siswa_tahun.status',
                'tahun_ajaran.nama as tahun_ajaran',
                'rombel.tingkat_kelas as kelas',
                'rombel.sub_nama as sub_kelas'
            )
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'id'           => $siswaData->id,
                'nama'         => $siswaData->nama,
                'nis'          => $siswaData->nis,
                'kelas'        => $siswaTahun->kelas ?? null,
                'sub_kelas'    => $siswaTahun->sub_kelas ?? null,
                'tahun_ajaran' => $siswaTahun->tahun_ajaran ?? null,
                'status'       => $siswaTahun->status ?? null,
            ]
        ]);
    }
}