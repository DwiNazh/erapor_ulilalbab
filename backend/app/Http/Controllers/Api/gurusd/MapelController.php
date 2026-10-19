<?php

namespace App\Http\Controllers\Api\Gurusd;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PenugasanGuru;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MapelController extends Controller
{
    public function mapelDiampu()
    {
        try {
            $guruId = Auth::id();

            // 1. Ambil data tahun ajaran aktif saat ini
            $tahunAktif = DB::table('tahun_ajaran')
                ->where('status', 'aktif')
                ->first();

            if (!$tahunAktif) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tahun ajaran aktif belum dikonfigurasi oleh Admin.'
                ], 400);
            }

            $tahunAjaranId = $tahunAktif->id;

            // 2. Ambil penugasan guru hanya untuk tahun ajaran yang aktif
            $penugasan = PenugasanGuru::with([
                'mapel',
                'rombel' => function ($query) {
                    $query->withCount('siswa');
                }
            ])
            ->where('guru_id', $guruId)
            ->where('tahun_ajaran_id', $tahunAjaranId)
            ->get()
            ->map(function ($tugas) {
                return [
                    'id' => $tugas->id,
                    'guru_id' => $tugas->guru_id,
                    'mapel_id' => $tugas->mapel_id,
                    'nama_mapel' => $tugas->mapel->nama ?? '-',
                    'jumlah_siswa' => $tugas->rombel->siswa_count ?? 0,
                    'updated_at' => $tugas->updated_at,
                    'rombel' => [
                        'id' => $tugas->rombel->id ?? null,
                        'tingkat_kelas' => $tugas->rombel->tingkat_kelas ?? '-',
                        'sub_nama' => $tugas->rombel->sub_nama ?? '',
                    ],
                    'mapel' => [
                        'id' => $tugas->mapel->id ?? null,
                        'nama' => $tugas->mapel->nama ?? '-',
                        'kode' => $tugas->mapel->kode ?? '-',
                    ]
                ];
            });

            return response()->json([
                'success' => true,
                'data'    => $penugasan,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan server: ' . $e->getMessage()
            ], 500);
        }
    }
}