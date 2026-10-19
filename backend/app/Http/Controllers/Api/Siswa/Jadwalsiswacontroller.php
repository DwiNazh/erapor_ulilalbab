<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth; // Tambahkan ini

class JadwalSiswaController extends Controller
{
    public function index(Request $request)
    {
        try {
            // ✅ GUNAKAN Auth::user() untuk mendapatkan data siswa yang sedang login via Sanctum
            $siswa = Auth::user();

            if (!$siswa) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated.',
                ], 401);
            }

            $hari      = $request->query('hari', 'Senin');
            $hariValid = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

            if (!in_array($hari, $hariValid)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Hari tidak valid.',
                ], 422);
            }

            // Cari rombel aktif siswa berdasarkan ID user yang sedang login
            $siswaRombel = DB::table('siswa_tahun')
                ->where('siswa_id', $siswa->id) // Laravel Sanctum ID
                ->where('status', 'AKTIF')
                ->orderByDesc('id')
                ->first();

            if (!$siswaRombel) {
                return response()->json([
                    'success' => true,
                    'message' => 'Siswa tidak memiliki rombel aktif.',
                    'data'    => [],
                ]);
            }

            // Ambil jadwal
            $jadwal = DB::table('jadwal as j')
                ->leftJoin('penugasan_guru as pg', 'pg.id', '=', 'j.penugasan_id')
                ->leftJoin('users as u', 'u.id', '=', 'pg.guru_id')
                ->leftJoin('mapel as m', 'm.id', '=', 'j.mapel_id')
                ->where('j.rombel_id', $siswaRombel->rombel_id)
                ->where('j.tahun_ajaran_id', $siswaRombel->tahun_ajaran_id)
                ->where('j.hari', $hari)
                ->orderBy('j.jam_mulai')
                ->select([
                    'j.id',
                    'j.jam_mulai',
                    'j.jam_selesai',
                    'j.hari',
                    DB::raw("COALESCE(m.nama, '-') as nama_mapel"),
                    DB::raw("COALESCE(u.name, '-') as nama_guru"),
                ])
                ->get();

            return response()->json([
                'success' => true,
                'data'    => $jadwal,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan server.',
            ], 500);
        }
    }
}