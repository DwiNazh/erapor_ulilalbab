<?php

namespace App\Http\Controllers\Api\Kepsek;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardKepsekController extends Controller
{
    public function index(Request $request)
    {
        try {
            // 1. Daftar semua tahun ajaran (untuk dropdown frontend)
            $tahunList = DB::table('tahun_ajaran')
                ->orderByDesc('nama')
                ->pluck('nama')
                ->toArray();

            // 2. Resolusi tahun ajaran:
            //    - Jika ada query param ?tahun_ajaran=..., gunakan itu
            //    - Jika tidak, fallback ke tahun ajaran aktif
            $tahunAjaranParam = trim($request->query('tahun_ajaran', ''));

            if ($tahunAjaranParam) {
                $tahunAktif = DB::table('tahun_ajaran')
                    ->where('nama', $tahunAjaranParam)
                    ->first();
            } else {
                $tahunAktif = DB::table('tahun_ajaran')
                    ->where('aktif', 1)
                    ->first();
            }

            $tahunId   = $tahunAktif ? $tahunAktif->id   : null;
            $tahunNama = $tahunAktif ? $tahunAktif->nama  : null;

            // 3. Stat Cards
            $totalSiswa = DB::table('siswa_tahun')
                ->where('status', 'AKTIF')
                ->when($tahunId, fn($q) => $q->where('tahun_ajaran_id', $tahunId))
                ->count();

            $totalGuru = DB::table('users')->where('role', 'guru')->count();

            $totalRombel = DB::table('rombel')
                ->when($tahunId, fn($q) => $q->where('tahun_ajaran_id', $tahunId))
                ->count();

            $today = Carbon::today()->toDateString();
            $presensi = DB::table('absensi_mapel')
                ->whereDate('tanggal', $today)
                ->selectRaw("COUNT(*) as total, SUM(CASE WHEN status = 'H' THEN 1 ELSE 0 END) as hadir")
                ->first();

            $persenKehadiran = ($presensi && $presensi->total > 0)
                ? round(($presensi->hadir / $presensi->total) * 100)
                : 0;

            // ─── LOGIKA RATA-RATA DINAMIS ───────────────────────────────────────
            // Hanya menghitung komponen yang tidak NULL (tidak ikutkan 0 dari COALESCE
            // ke pembagi, agar tidak mereduksi rata-rata secara tidak adil).
            $sqlRataRata = "
                (COALESCE(uh1,0)+COALESCE(uh2,0)+COALESCE(uh3,0)+COALESCE(uh4,0)+COALESCE(uh5,0)+COALESCE(pts,0)+COALESCE(pas,0))
                /
                GREATEST(1,
                    (CASE WHEN uh1 IS NOT NULL THEN 1 ELSE 0 END) +
                    (CASE WHEN uh2 IS NOT NULL THEN 1 ELSE 0 END) +
                    (CASE WHEN uh3 IS NOT NULL THEN 1 ELSE 0 END) +
                    (CASE WHEN uh4 IS NOT NULL THEN 1 ELSE 0 END) +
                    (CASE WHEN uh5 IS NOT NULL THEN 1 ELSE 0 END) +
                    (CASE WHEN pts IS NOT NULL THEN 1 ELSE 0 END) +
                    (CASE WHEN pas IS NOT NULL THEN 1 ELSE 0 END)
                )";

            // ─── PERBAIKAN INTI ─────────────────────────────────────────────────
            // Masalah lama: join nilai_siswa → siswa_tahun hanya lewat siswa_id.
            // Karena satu siswa punya banyak baris siswa_tahun (berbeda tahun),
            // nilai dari tahun lain ikut ter-JOIN meskipun rombel sudah difilter.
            //
            // Solusi: tambahkan kondisi nilai_siswa.tahun_ajaran = $tahunNama
            // langsung di WHERE, sehingga hanya nilai milik tahun yang dipilih
            // yang masuk ke perhitungan.
            // ────────────────────────────────────────────────────────────────────

            // 4. Rata-rata Nilai per Tingkat Kelas
            $nilaiPerKelas = DB::table('nilai_siswa')
                ->join('siswa_tahun', function ($join) use ($tahunId) {
                    $join->on('nilai_siswa.siswa_id', '=', 'siswa_tahun.siswa_id')
                         ->when($tahunId, fn($j) => $j->where('siswa_tahun.tahun_ajaran_id', $tahunId));
                })
                ->join('rombel', 'siswa_tahun.rombel_id', '=', 'rombel.id')
                // Filter nilai_siswa langsung ke tahun ajaran yang dipilih
                ->when($tahunNama, fn($q) => $q->where('nilai_siswa.tahun_ajaran', $tahunNama))
                ->select(
                    'rombel.tingkat_kelas as kelas',
                    DB::raw("ROUND(AVG($sqlRataRata), 1) as rata_rata")
                )
                ->groupBy('rombel.tingkat_kelas')
                ->orderBy('rombel.tingkat_kelas')
                ->get()
                ->map(fn($item) => [
                    'kelas'     => 'Kelas ' . $item->kelas,
                    'rata_rata' => (float) $item->rata_rata,
                ]);

            // 5. Kehadiran Mingguan (selalu hari ini, tidak difilter tahun)
            $startOfWeek   = Carbon::now()->startOfWeek()->toDateString();
            $statsMingguan = DB::table('absensi_mapel')
                ->whereBetween('tanggal', [
                    $startOfWeek,
                    Carbon::now()->startOfWeek()->addDays(4)->toDateString(),
                ])
                ->select(
                    DB::raw('DATE(tanggal) as tgl'),
                    DB::raw('COUNT(*) as total'),
                    DB::raw("SUM(CASE WHEN status = 'H' THEN 1 ELSE 0 END) as hadir")
                )
                ->groupBy('tgl')
                ->get()
                ->keyBy('tgl');

            $labels            = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum'];
            $kehadiranMingguan = [];
            for ($i = 0; $i < 5; $i++) {
                $date              = Carbon::now()->startOfWeek()->addDays($i)->toDateString();
                $stat              = $statsMingguan->get($date);
                $kehadiranMingguan[] = [
                    'hari'  => $labels[$i],
                    'hadir' => ($stat && $stat->total > 0)
                        ? round(($stat->hadir / $stat->total) * 100)
                        : 0,
                ];
            }

            // 6. Top 5 Siswa Berprestasi
            $topSiswa = DB::table('nilai_siswa')
                ->join('siswa_tahun', function ($join) use ($tahunId) {
                    $join->on('nilai_siswa.siswa_id', '=', 'siswa_tahun.siswa_id')
                         ->when($tahunId, fn($j) => $j->where('siswa_tahun.tahun_ajaran_id', $tahunId));
                })
                ->join('rombel', 'siswa_tahun.rombel_id', '=', 'rombel.id')
                // Filter nilai_siswa langsung ke tahun ajaran yang dipilih
                ->when($tahunNama, fn($q) => $q->where('nilai_siswa.tahun_ajaran', $tahunNama))
                ->select(
                    'siswa_tahun.siswa_id',
                    DB::raw("COALESCE(
                        (SELECT nama_user FROM siswas WHERE siswas.id = siswa_tahun.siswa_id LIMIT 1),
                        (SELECT nama     FROM siswa  WHERE siswa.id  = siswa_tahun.siswa_id LIMIT 1)
                    ) as nama"),
                    DB::raw('CONCAT(rombel.tingkat_kelas, " ", rombel.sub_nama) as kelas'),
                    DB::raw("ROUND(AVG($sqlRataRata), 1) as nilai")
                )
                ->groupBy('siswa_tahun.siswa_id', 'rombel.tingkat_kelas', 'rombel.sub_nama')
                ->orderByDesc('nilai')
                ->limit(5)
                ->get()
                ->map(fn($item) => [
                    'id'    => $item->siswa_id,
                    'nama'  => $item->nama,
                    'kelas' => $item->kelas,
                    'nilai' => (float) $item->nilai,
                ]);

            // 7. Radar Chart — Rata-rata per Komponen
            $radarRaw = DB::table('nilai_siswa')
                ->join('siswa_tahun', function ($join) use ($tahunId) {
                    $join->on('nilai_siswa.siswa_id', '=', 'siswa_tahun.siswa_id')
                         ->when($tahunId, fn($j) => $j->where('siswa_tahun.tahun_ajaran_id', $tahunId));
                })
                ->join('rombel', 'siswa_tahun.rombel_id', '=', 'rombel.id')
                // Filter nilai_siswa langsung ke tahun ajaran yang dipilih
                ->when($tahunNama, fn($q) => $q->where('nilai_siswa.tahun_ajaran', $tahunNama))
                ->selectRaw("
                    ROUND(AVG(
                        (COALESCE(uh1,0)+COALESCE(uh2,0)+COALESCE(uh3,0)+COALESCE(uh4,0)+COALESCE(uh5,0)) /
                        GREATEST(1,
                            (CASE WHEN uh1 IS NOT NULL THEN 1 ELSE 0 END) +
                            (CASE WHEN uh2 IS NOT NULL THEN 1 ELSE 0 END) +
                            (CASE WHEN uh3 IS NOT NULL THEN 1 ELSE 0 END) +
                            (CASE WHEN uh4 IS NOT NULL THEN 1 ELSE 0 END) +
                            (CASE WHEN uh5 IS NOT NULL THEN 1 ELSE 0 END)
                        )
                    ), 1) as rata_uh,
                    ROUND(AVG(COALESCE(pts, 0)), 1) as rata_pts,
                    ROUND(AVG(COALESCE(pas, 0)), 1) as rata_pas
                ")
                ->first();

            $radarNilai = [
                ['komponen' => 'Ulangan Harian', 'nilai' => (float) ($radarRaw->rata_uh  ?? 0)],
                ['komponen' => 'PTS',            'nilai' => (float) ($radarRaw->rata_pts ?? 0)],
                ['komponen' => 'PAS',            'nilai' => (float) ($radarRaw->rata_pas ?? 0)],
            ];

            // 8. Tren Nilai — selalu semua tahun (tidak difilter, agar grafik tren bermakna)
            $trenNilai = DB::table('nilai_siswa')
                ->join('siswa_tahun', 'nilai_siswa.siswa_id', '=', 'siswa_tahun.siswa_id')
                ->join('rombel', 'siswa_tahun.rombel_id', '=', 'rombel.id')
                ->join('tahun_ajaran', 'rombel.tahun_ajaran_id', '=', 'tahun_ajaran.id')
                // Pastikan nilai_siswa berasal dari tahun yang sama dengan rombel-nya
                ->whereColumn('nilai_siswa.tahun_ajaran', 'tahun_ajaran.nama')
                ->select(
                    'tahun_ajaran.nama as periode',
                    'tahun_ajaran.semester_aktif as semester',
                    DB::raw("ROUND(AVG($sqlRataRata), 1) as rata_rata")
                )
                ->groupBy('tahun_ajaran.id', 'tahun_ajaran.nama', 'tahun_ajaran.semester_aktif')
                ->orderBy('tahun_ajaran.id')
                ->get()
                ->map(fn($item) => [
                    'periode'   => $item->periode . ' (' . $item->semester . ')',
                    'rata_rata' => (float) $item->rata_rata,
                ]);

            return response()->json([
                'success' => true,
                'data'    => [
                    'tahun_aktif'          => $tahunAktif
                        ? $tahunAktif->nama . ' (' . $tahunAktif->semester_aktif . ')'
                        : '-',
                    'tahun_ajaran_dipilih' => $tahunAktif?->nama ?? null,
                    'stats'                => [
                        'total_siswa'        => $totalSiswa,
                        'total_guru'         => $totalGuru,
                        'total_rombel'       => $totalRombel,
                        'kehadiran_hari_ini' => $persenKehadiran,
                    ],
                    'nilai_per_kelas'    => $nilaiPerKelas,
                    'kehadiran_mingguan' => $kehadiranMingguan,
                    'top_siswa'          => $topSiswa,
                    'radar_nilai'        => $radarNilai,
                    'tren_nilai'         => $trenNilai,
                ],
                'tahun_list' => $tahunList,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}