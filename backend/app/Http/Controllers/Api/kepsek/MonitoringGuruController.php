<?php

namespace App\Http\Controllers\Api\Kepsek;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\NilaiSiswa;
use App\Models\TahunAjaran;
use App\Models\Mapel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MonitoringGuruController extends Controller
{
    const KKM = 75;

    // ─── HELPER: hitung rata-rata rapor per baris nilai ──────────────────────
    // Rumus: (rata_UH × 40%) + (PTS × 30%) + (PAS × 30%)
    // Sama persis dengan RaporSiswaController & DashboardKepsekController
    private function sqlNilaiAkhir(): string
    {
        return "
            (
                (
                    (COALESCE(uh1,0)+COALESCE(uh2,0)+COALESCE(uh3,0)+COALESCE(uh4,0)+COALESCE(uh5,0))
                    / GREATEST(1,
                        (CASE WHEN uh1 IS NOT NULL THEN 1 ELSE 0 END)+
                        (CASE WHEN uh2 IS NOT NULL THEN 1 ELSE 0 END)+
                        (CASE WHEN uh3 IS NOT NULL THEN 1 ELSE 0 END)+
                        (CASE WHEN uh4 IS NOT NULL THEN 1 ELSE 0 END)+
                        (CASE WHEN uh5 IS NOT NULL THEN 1 ELSE 0 END)
                    )
                ) * 0.4
            )
            + (COALESCE(pts, 0) * 0.3)
            + (COALESCE(pas, 0) * 0.3)
        ";
    }

    private function calculateKinerja(float $avg): string
    {
        if ($avg >= 85) return 'Sangat Baik';
        if ($avg >= 75) return 'Baik';
        if ($avg >= 65) return 'Cukup';
        return 'Perlu Pembinaan';
    }

    // ─── 1. Daftar semua guru ─────────────────────────────────────────────────
    public function index()
    {
        try {
            $gurus = User::where('role', 'guru')
                ->select('id', 'name', 'nipy as nip')
                ->get();

            return response()->json(['status' => 'success', 'data' => $gurus]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // ─── 2. Daftar mapel + rombel yang pernah diajar guru ────────────────────
    // Tidak lagi terikat tahun aktif — ambil dari semua tahun_ajaran yang ada
    // penugasan untuk guru tersebut. Frontend menampilkan dropdown tahun.
    public function getSubjects(Request $request, $id)
    {
        try {
            $guru = User::select('id', 'name', 'nipy as nip')->findOrFail($id);

            // Semua tahun ajaran yang pernah ada penugasan untuk guru ini
            $tahunList = DB::table('penugasan_guru')
                ->join('tahun_ajaran', 'penugasan_guru.tahun_ajaran_id', '=', 'tahun_ajaran.id')
                ->where('penugasan_guru.guru_id', $id)
                ->orderByDesc('tahun_ajaran.nama')
                ->pluck('tahun_ajaran.nama')
                ->unique()
                ->values()
                ->toArray();

            // Tahun yang dipilih frontend (default: tahun aktif, fallback: pertama di list)
            $tahunParam = trim($request->query('tahun_ajaran', ''));
            if ($tahunParam) {
                $tahunRow = TahunAjaran::where('nama', $tahunParam)->first();
            } else {
                $tahunRow = TahunAjaran::where('aktif', 1)->first()
                    ?? TahunAjaran::orderByDesc('nama')->first();
            }

            if (!$tahunRow) {
                return response()->json(['status' => 'error', 'message' => 'Tahun ajaran tidak ditemukan'], 404);
            }

            $semesterAktif = (strtolower($tahunRow->semester_aktif) === 'ganjil') ? 1 : 2;
            $sqlNilai      = $this->sqlNilaiAkhir();

            // Penugasan guru pada tahun yang dipilih
            $subjects = DB::table('penugasan_guru')
                ->join('mapel',  'penugasan_guru.mapel_id',  '=', 'mapel.id')
                ->join('rombel', 'penugasan_guru.rombel_id', '=', 'rombel.id')
                ->where('penugasan_guru.guru_id', $id)
                ->where('penugasan_guru.tahun_ajaran_id', $tahunRow->id)
                ->select(
                    'mapel.id as mapel_id',
                    'mapel.nama as nama_mapel',
                    'penugasan_guru.rombel_id',
                    DB::raw("CONCAT('Kelas ', rombel.tingkat_kelas, ' ', rombel.sub_nama) as nama_rombel")
                )
                ->get()
                ->map(function ($sub) use ($id, $tahunRow, $semesterAktif, $sqlNilai) {
                    $avg = NilaiSiswa::where([
                            'guru_id'  => $id,
                            'mapel_id' => $sub->mapel_id,
                            'semester' => $semesterAktif,
                        ])
                        ->where('tahun_ajaran', $tahunRow->nama)
                        ->selectRaw("ROUND(AVG($sqlNilai), 1) as rata")
                        ->value('rata') ?? 0;

                    return [
                        'mapel_id'    => $sub->mapel_id,
                        'rombel_id'   => $sub->rombel_id,
                        'nama_mapel'  => $sub->nama_mapel,
                        'nama_rombel' => $sub->nama_rombel,
                        'avg_nilai'   => (float) $avg,
                        'kinerja'     => $this->calculateKinerja((float) $avg),
                    ];
                });

            return response()->json([
                'status' => 'success',
                'data'   => [
                    'guru'         => $guru,
                    'subjects'     => $subjects,
                    'tahun_list'   => $tahunList,
                    'tahun_dipilih' => $tahunRow->nama,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // ─── 3. Analisis per mapel — tren lintas SEMUA tahun ajaran ──────────────
    // Tidak lagi hanya "tahun ini vs tahun lalu". Chart menampilkan semua tahun
    // yang pernah ada data nilai untuk guru + mapel + rombel tersebut.
    public function getAnalysis(Request $request, $id)
    {
        try {
            $mapelId  = $request->query('mapel_id');
            $rombelId = $request->query('rombel_id');

            // Tahun yang sedang ditampilkan (untuk stat cards kanan)
            $tahunParam = trim($request->query('tahun_ajaran', ''));
            if ($tahunParam) {
                $tahunRow = TahunAjaran::where('nama', $tahunParam)->first();
            } else {
                $tahunRow = TahunAjaran::where('aktif', 1)->first()
                    ?? TahunAjaran::orderByDesc('nama')->first();
            }

            if (!$tahunRow) {
                return response()->json(['status' => 'error', 'message' => 'Tahun ajaran tidak ditemukan'], 404);
            }

            $semesterAktif = (strtolower($tahunRow->semester_aktif) === 'ganjil') ? 1 : 2;
            $sqlNilai      = $this->sqlNilaiAkhir();

            $namaKelas = DB::table('rombel')
                ->where('id', $rombelId)
                ->selectRaw("CONCAT('Kelas ', tingkat_kelas, ' ', sub_nama) as full_name")
                ->value('full_name');

            // ── Tren lintas semua tahun (untuk chart) ────────────────────────
            // Ambil semua tahun_ajaran yang pernah ada nilai untuk guru + mapel ini,
            // lalu hitung rata-rata per tahun → data untuk LineChart
            $trenData = DB::table('nilai_siswa')
                ->join('tahun_ajaran', 'nilai_siswa.tahun_ajaran', '=', 'tahun_ajaran.nama')
                ->join('siswa_tahun', function ($join) use ($rombelId) {
                    $join->on('nilai_siswa.siswa_id', '=', 'siswa_tahun.siswa_id')
                         ->on('siswa_tahun.rombel_id', '=', DB::raw((int) $rombelId));
                })
                ->where('nilai_siswa.guru_id',  $id)
                ->where('nilai_siswa.mapel_id', $mapelId)
                ->select(
                    'nilai_siswa.tahun_ajaran as tahun',
                    'nilai_siswa.semester',
                    DB::raw("ROUND(AVG($sqlNilai), 1) as rata_rata"),
                    DB::raw("COUNT(DISTINCT nilai_siswa.siswa_id) as total_siswa"),
                    DB::raw("SUM(CASE WHEN ($sqlNilai) >= " . self::KKM . " THEN 1 ELSE 0 END) as atas_kkm")
                )
                ->groupBy('nilai_siswa.tahun_ajaran', 'nilai_siswa.semester', 'tahun_ajaran.id')
                ->orderBy('tahun_ajaran.id')
                ->orderBy('nilai_siswa.semester')
                ->get()
                ->map(fn($row) => [
                    'periode'     => $row->tahun . ' (Sem ' . $row->semester . ')',
                    'rata_rata'   => (float) $row->rata_rata,
                    'total_siswa' => (int)   $row->total_siswa,
                    'atas_kkm'    => (int)   $row->atas_kkm,
                ]);

            // ── Stat untuk tahun yang dipilih ────────────────────────────────
            $queryTahunIni = NilaiSiswa::where([
                    'guru_id'  => $id,
                    'mapel_id' => $mapelId,
                    'semester' => $semesterAktif,
                ])
                ->where('tahun_ajaran', $tahunRow->nama);

            $avgNow     = (float) ($queryTahunIni->clone()->selectRaw("ROUND(AVG($sqlNilai), 1) as rata")->value('rata') ?? 0);
            $totalSiswa = $queryTahunIni->clone()->distinct('siswa_id')->count('siswa_id');
            $atasKkm    = $queryTahunIni->clone()->selectRaw("COUNT(CASE WHEN ($sqlNilai) >= " . self::KKM . " THEN 1 END) as jumlah")->value('jumlah') ?? 0;
            $pctKkm     = $totalSiswa > 0 ? round(($atasKkm / $totalSiswa) * 100) : 0;

            return response()->json([
                'status' => 'success',
                'data'   => [
                    'nama'          => User::where('id', $id)->value('name'),
                    'mapel'         => Mapel::where('id', $mapelId)->value('nama'),
                    'kelas'         => $namaKelas ?? '-',
                    'tahun_dipilih' => $tahunRow->nama,
                    'avgNow'        => $avgNow,
                    'pct_atas_kkm'  => $pctKkm,
                    'total_dinilai' => $totalSiswa,
                    'kinerja'       => $this->calculateKinerja($avgNow),
                    'tren'          => $trenData,   // array untuk chart tren
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}