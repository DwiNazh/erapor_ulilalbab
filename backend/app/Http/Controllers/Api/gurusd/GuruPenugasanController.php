<?php

namespace App\Http\Controllers\Api\gurusd;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PenugasanGuru;
use App\Models\TahunAjaran;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GuruPenugasanController extends Controller
{
    public function penugasanSaya()
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

            // 2. Ambil penugasan guru (Hanya Tahun Ajaran Aktif & jenis mapel BUKAN 'wajib')
            $penugasan = PenugasanGuru::with([
                'mapel',
                'rombel' => function ($query) {
                    $query->withCount('siswa');
                }
            ])
            ->where('guru_id', $guruId)
            ->where('tahun_ajaran_id', $tahunAjaranId)
            
            // --- FILTER TAMBAHAN SESUAI SCREENSHOT ---
            ->whereHas('mapel', function ($query) {
                $query->where('jenis', '!=', 'wajib'); // Hanya mengambil jenis 'pilihan'
            })
            // ------------------------------------------
            
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

    /**
     * GET /api/guru/penugasan-rombel/{rombel_id}
     *
     * Dipakai oleh mode "Guru Bidang" di halaman NilaiAkademik.jsx.
     * Tujuannya: WALI KELAS bisa memantau SEMUA mata pelajaran
     * (termasuk yang diajar guru lain) di kelasnya sendiri secara read-only.
     *
     * PENTING: query ini SENGAJA tidak difilter guru_id = Auth::id(),
     * karena guru yang mengajar mapel pilihan di rombel ini biasanya
     * BUKAN guru yang sedang login (yang login = wali kelas rombel ini).
     */
    public function penugasanByRombel($rombel_id)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'guru') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $tahunAjaranAktif = TahunAjaran::where('aktif', 1)->first();

            // Sumber 1: tabel penugasan_guru
            $dariPenugasan = DB::table('penugasan_guru')
                ->join('mapel', 'mapel.id', '=', 'penugasan_guru.mapel_id')
                ->where('penugasan_guru.rombel_id', $rombel_id)
                ->when($tahunAjaranAktif, function ($q) use ($tahunAjaranAktif) {
                    $q->where('penugasan_guru.tahun_ajaran_id', $tahunAjaranAktif->id);
                })
                ->select(
                    'mapel.id as mapel_id',
                    'mapel.nama as nama_mapel',
                    'mapel.kode as kode_mapel',
                    'mapel.jenis',
                    'penugasan_guru.guru_id'
                );

            // Sumber 2: tabel jadwal (jaring pengaman, untuk data yang belum tersinkron ke penugasan_guru)
            $dariJadwal = DB::table('jadwal')
                ->join('mapel', 'mapel.id', '=', 'jadwal.mapel_id')
                ->where('jadwal.rombel_id', $rombel_id)
                ->when($tahunAjaranAktif, function ($q) use ($tahunAjaranAktif) {
                    $q->where('jadwal.tahun_ajaran_id', $tahunAjaranAktif->id);
                })
                ->select(
                    'mapel.id as mapel_id',
                    'mapel.nama as nama_mapel',
                    'mapel.kode as kode_mapel',
                    'mapel.jenis',
                    'jadwal.guru_id'
                );

            $gabungan = $dariPenugasan->union($dariJadwal)->get();

            $seen = [];
            $result = $gabungan
                ->filter(function ($p) use (&$seen) {
                    if (in_array($p->mapel_id, $seen)) return false;
                    $seen[] = $p->mapel_id;
                    return true;
                })
                ->map(function ($p) {
                    return [
                        'mapel_id' => $p->mapel_id,
                        'guru_id'  => $p->guru_id,
                        'mapel'    => [
                            'id'    => $p->mapel_id,
                            'nama'  => $p->nama_mapel,
                            'kode'  => $p->kode_mapel,
                            'jenis' => $p->jenis,
                        ],
                    ];
                })
                ->values();

            return response()->json([
                'success' => true,
                'data'    => $result
            ]);

        } catch (\Exception $e) {
            Log::error('Error penugasanByRombel', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}