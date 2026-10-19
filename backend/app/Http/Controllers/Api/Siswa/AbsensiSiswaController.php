<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AbsensiSiswaController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            $nis = $user->nis ?? null;

            if (!$nis) {
                return response()->json([
                    'success' => false,
                    'message' => 'NIS tidak ditemukan pada akun login.'
                ], 422);
            }

            // 1. Ambil Tahun Ajaran Aktif
            $tahunAjaranAktif = DB::table('tahun_ajaran')
                ->where('aktif', 1)
                ->first();

            if (!$tahunAjaranAktif) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak ada tahun ajaran aktif.'
                ], 422);
            }

            // 2. Cari siswa_tahun_id berdasarkan NIS dan Tahun Ajaran Aktif
            $siswaTahun = DB::table('siswa_tahun')
                ->leftJoin('siswa', 'siswa.id', '=', 'siswa_tahun.siswa_id')
                ->leftJoin('siswas', 'siswas.id', '=', 'siswa_tahun.siswa_id')
                ->where('siswa_tahun.tahun_ajaran_id', $tahunAjaranAktif->id)
                ->where(function ($q) use ($nis) {
                    $q->where('siswa.nis', $nis)
                      ->orWhere('siswas.nis', $nis);
                })
                ->select('siswa_tahun.id')
                ->first();

            if (!$siswaTahun) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data siswa tidak ditemukan pada tahun ajaran aktif ini.'
                ], 404);
            }

            // 3. Ambil data dari tabel absensi_harian + Join info Tahun Ajaran
            $absensi = DB::table('absensi_harian')
                ->leftJoin('users', 'users.id', '=', 'absensi_harian.guru_id') // Wali kelas
                ->leftJoin('tahun_ajaran', 'tahun_ajaran.id', '=', 'absensi_harian.tahun_ajaran_id')
                ->where('absensi_harian.siswa_tahun_id', $siswaTahun->id)
                ->orderByDesc('absensi_harian.tanggal')
                ->select(
                    'absensi_harian.id',
                    'absensi_harian.tanggal',
                    'absensi_harian.status',
                    'absensi_harian.semester',
                    'absensi_harian.keterangan',
                    'users.name as nama_guru',
                    'tahun_ajaran.nama as nama_tahun_ajaran' // Mengambil teks nama tahun ajaran
                )
                ->get();

            // 4. Mapping data ke Frontend
            $data = $absensi->map(function ($item) {
                $statusText = "-";
                if ($item->status === "H") $statusText = "Hadir";
                if ($item->status === "S") $statusText = "Sakit";
                if ($item->status === "I") $statusText = "Izin";
                if ($item->status === "A") $statusText = "Alfa";

                return [
                    'id'           => $item->id,
                    'tanggal'      => $item->tanggal,
                    'status'       => $statusText,
                    'keterangan'   => $item->keterangan ?? "-",
                    'semester'     => $item->semester, // Murni database ('semester1' / 'semester2')
                    'guru'         => $item->nama_guru ?? "Wali Kelas",
                    'tahun_ajaran' => $item->nama_tahun_ajaran ?? "-",
                ];
            });

            // 5. Summary counter
            $summary = [
                'hadir' => $absensi->where('status', 'H')->count(),
                'sakit' => $absensi->where('status', 'S')->count(),
                'izin'  => $absensi->where('status', 'I')->count(),
                'alfa'  => $absensi->where('status', 'A')->count(),
            ];

            return response()->json([
                'success' => true,
                'message' => 'Absensi siswa berhasil diambil.',
                'summary' => $summary,
                'data'    => $data
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan server.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}