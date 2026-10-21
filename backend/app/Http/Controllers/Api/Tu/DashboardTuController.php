<?php

namespace App\Http\Controllers\Api\Tu;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\TahunAjaran;
use App\Models\SiswaTahun;
use App\Models\Rombel;
use App\Models\Siswa;
use App\Models\User;

class DashboardTuController extends Controller
{
    /**
     * GET /api/tu/dashboard
     * Mengembalikan semua data yang dibutuhkan dashboard sekaligus (single request).
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();

            $tahunDipilih = null;
            if ($request->filled('tahun_ajaran_id')) {
                $tahunDipilih = TahunAjaran::find($request->query('tahun_ajaran_id'));
            }

            if (!$tahunDipilih) {
                $tahunDipilih = TahunAjaran::where('aktif', 1)->first() ?? TahunAjaran::orderByDesc('id')->first();
            }

            $allTahun = TahunAjaran::orderByDesc('id')->get()->map(fn($t) => [
                'id'             => $t->id,
                'nama'           => $t->nama,
                'aktif'          => (bool) $t->aktif,
                'semester_aktif' => $t->semester_aktif,
                'status'         => $t->status,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Data dashboard berhasil dimuat',
                'data'    => [
                    'tahun_ajaran'        => $this->getTahunAjaran($tahunDipilih),
                    'daftar_tahun_ajaran' => $allTahun,
                    'statistik'           => $this->getStatistik($tahunDipilih, $user),
                    'distribusi_kelas'    => $this->getDistribusiKelas($tahunDipilih, $user),
                    'status_kenaikan'     => $this->getStatusKenaikan($tahunDipilih, $user),
                    'siswa_baru'          => $this->getSiswaBaru($tahunDipilih, $user),
                    'finalisasi'          => $this->getStatusFinalisasi($tahunDipilih, $user),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Dashboard TU Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data dashboard',
            ], 500);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE HELPERS (Mendukung parameter nullable ?TahunAjaran)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Info tahun ajaran aktif.
     */
    private function getTahunAjaran(?TahunAjaran $tahun): ?array
    {
        if (!$tahun) return null;

        return [
            'id'             => $tahun->id,
            'nama'           => $tahun->nama,
            'semester_aktif' => $tahun->semester_aktif,
            'status'         => $tahun->status,
        ];
    }

    /**
     * 4 kartu statistik utama
     */
    private function getStatistik(?TahunAjaran $tahun, $user = null): array
    {
        $jenjangIds = $user ? $user->jenjangIds() : null;

        // Default jika tahun tidak ada
        if (!$tahun) {
            $totalGuru = User::where('role', 'guru')
                ->when($jenjangIds !== null, fn($q) => $q->whereIn('jenjang_id', $jenjangIds))
                ->count();
            $totalStaf = User::whereNotIn('role', ['siswa', 'guru'])
                ->when($jenjangIds !== null, fn($q) => $q->whereIn('jenjang_id', $jenjangIds))
                ->count();
            $totalSiswaBaru = DB::table('siswas')
                ->whereYear('created_at', now()->year)
                ->when($jenjangIds !== null, fn($q) => $q->whereIn('jenjang_id', $jenjangIds))
                ->count();
            $belumDitempatkan = DB::table('siswas')
                ->whereYear('created_at', now()->year)
                ->where('is_processed', 0)
                ->when($jenjangIds !== null, fn($q) => $q->whereIn('jenjang_id', $jenjangIds))
                ->count();

            return [
                'total_siswa_aktif'   => 0,
                'delta_siswa'         => 0,
                'total_guru'          => $totalGuru,
                'total_staf'          => $totalStaf,
                'total_rombel'        => 0,
                'total_siswa_baru'    => $totalSiswaBaru,
                'belum_ditempatkan'   => $belumDitempatkan,
            ];
        }

        // Total siswa aktif di tahun ini
        $totalSiswa = SiswaTahun::where('tahun_ajaran_id', $tahun->id)
            ->untukUser($user)
            ->where('status', 'AKTIF')
            ->count();

        // Siswa aktif tahun lalu (untuk delta)
        $tahunLalu = TahunAjaran::where('id', '<', $tahun->id)
            ->orderByDesc('id')
            ->first();

        $totalSiswaTahunLalu = $tahunLalu
            ? SiswaTahun::where('tahun_ajaran_id', $tahunLalu->id)
                ->untukUser($user)
                ->where('status', 'AKTIF')
                ->count()
            : 0;

        $deltaSiswa = $totalSiswa - $totalSiswaTahunLalu;

        $totalGuru  = User::where('role', 'guru')
            ->when($jenjangIds !== null, fn($q) => $q->whereIn('jenjang_id', $jenjangIds))
            ->count();
        $totalStaf  = User::whereNotIn('role', ['siswa', 'guru'])
            ->when($jenjangIds !== null, fn($q) => $q->whereIn('jenjang_id', $jenjangIds))
            ->count();
        $totalRombel = Rombel::where('tahun_ajaran_id', $tahun->id)
            ->untukUser($user)
            ->count();

        // Hitung rombel di tahun ajaran berikutnya (yang sedang dipersiapkan)
        $tahunBerikutnya = TahunAjaran::where('id', '>', $tahun->id)
            ->orderBy('id', 'asc')
            ->first();
        $totalRombelBerikutnya = $tahunBerikutnya
            ? Rombel::where('tahun_ajaran_id', $tahunBerikutnya->id)->untukUser($user)->count()
            : 0;

        $totalSiswaBaru    = DB::table('siswas')
            ->when($jenjangIds !== null, fn($q) => $q->whereIn('jenjang_id', $jenjangIds))
            ->count();
        $belumDitempatkan  = DB::table('siswas')
            ->where('is_processed', 0)
            ->when($jenjangIds !== null, fn($q) => $q->whereIn('jenjang_id', $jenjangIds))
            ->count();

        return [
            'total_siswa_aktif'        => $totalSiswa,
            'delta_siswa'              => $deltaSiswa,
            'total_guru'               => $totalGuru,
            'total_staf'               => $totalStaf,
            'total_rombel'             => $totalRombel,
            'total_rombel_berikutnya'  => $totalRombelBerikutnya,
            'nama_tahun_berikutnya'    => $tahunBerikutnya?->nama,
            'total_siswa_baru'         => $totalSiswaBaru,
            'belum_ditempatkan'        => $belumDitempatkan,
        ];
    }

    /**
     * Distribusi jumlah siswa per tingkat kelas.
     */
    private function getDistribusiKelas(?TahunAjaran $tahun, $user = null): array
    {
        $range = $user ? $user->kelasRange() : ['min' => 1, 'max' => 6];
        $minKelas = $range['min'];
        $maxKelas = $range['max'];

        $result = [];
        for ($k = $minKelas; $k <= $maxKelas; $k++) {
            $result[] = [
                'kelas' => 'Kelas ' . $k,
                'total' => 0,
            ];
        }

        if (!$tahun) return $result;

        $rows = SiswaTahun::where('siswa_tahun.tahun_ajaran_id', $tahun->id)
            ->where('siswa_tahun.status', 'AKTIF')
            ->untukUser($user)
            ->join('rombel', 'siswa_tahun.rombel_id', '=', 'rombel.id')
            ->select(
                DB::raw('CAST(rombel.tingkat_kelas AS UNSIGNED) as tingkat'),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('tingkat')
            ->orderBy('tingkat')
            ->get();

        $map = $rows->pluck('total', 'tingkat')->toArray();

        $result = [];
        for ($k = $minKelas; $k <= $maxKelas; $k++) {
            $result[] = [
                'kelas' => 'Kelas ' . $k,
                'total' => (int) ($map[$k] ?? 0),
            ];
        }

        return $result;
    }

    /**
     * Status kenaikan kelas
     */
    private function getStatusKenaikan(?TahunAjaran $tahun, $user = null): array
    {
        $emptyResponse = [
            'total' => 0, 'naik' => 0, 'tinggal' => 0, 'lulus' => 0, 'dalam_proses' => 0,
            'pct_naik' => 0, 'pct_tinggal' => 0, 'pct_lulus' => 0, 'pct_proses' => 0,
        ];

        if (!$tahun) return $emptyResponse;

        $total = SiswaTahun::where('tahun_ajaran_id', $tahun->id)->untukUser($user)->count();
        if ($total === 0) return $emptyResponse;

        $targetNama = null;
        if (preg_match('/^(\d{4})\/(\d{4})$/', $tahun->nama, $m)) {
            $targetNama = ($m[1] + 1) . '/' . ($m[2] + 1);
        }

        $tahunTarget = $targetNama ? TahunAjaran::where('nama', $targetNama)->first() : null;

        $naik = 0;
        if ($tahunTarget) {
            $naik = SiswaTahun::where('siswa_tahun.tahun_ajaran_id', $tahunTarget->id)
                ->where('siswa_tahun.status', 'AKTIF')
                ->untukUser($user)
                ->join('rombel as r_target', 'siswa_tahun.rombel_id', '=', 'r_target.id')
                ->join('siswa_tahun as st_asal', function ($join) use ($tahun) {
                    $join->on('st_asal.siswa_id', '=', 'siswa_tahun.siswa_id')
                        ->where('st_asal.tahun_ajaran_id', $tahun->id);
                })
                ->join('rombel as r_asal', 'st_asal.rombel_id', '=', 'r_asal.id')
                ->whereRaw('r_target.tingkat_kelas > r_asal.tingkat_kelas')
                ->count();
        }

        $tinggal = 0;
        if ($tahunTarget) {
            $tinggal = SiswaTahun::where('siswa_tahun.tahun_ajaran_id', $tahunTarget->id)
                ->where('siswa_tahun.status', 'AKTIF')
                ->untukUser($user)
                ->join('rombel as r_target', 'siswa_tahun.rombel_id', '=', 'r_target.id')
                ->join('siswa_tahun as st_asal', function ($join) use ($tahun) {
                    $join->on('st_asal.siswa_id', '=', 'siswa_tahun.siswa_id')
                        ->where('st_asal.tahun_ajaran_id', $tahun->id);
                })
                ->join('rombel as r_asal', 'st_asal.rombel_id', '=', 'r_asal.id')
                ->whereRaw('r_target.tingkat_kelas = r_asal.tingkat_kelas')
                ->count();
        }

        $lulus = SiswaTahun::where('tahun_ajaran_id', $tahun->id)->where('status', 'LULUS')->untukUser($user)->count();
        $dalamProses = SiswaTahun::where('tahun_ajaran_id', $tahun->id)->where('is_processed', 0)->where('status', 'AKTIF')->untukUser($user)->count();

        $pct = fn($v) => $total > 0 ? round(($v / $total) * 100) : 0;

        return [
            'total'         => $total,
            'naik'          => $naik,
            'tinggal'       => $tinggal,
            'lulus'         => $lulus,
            'dalam_proses'  => $dalamProses,
            'pct_naik'      => $pct($naik),
            'pct_tinggal'   => $pct($tinggal),
            'pct_lulus'     => $pct($lulus),
            'pct_proses'    => $pct($dalamProses),
        ];
    }

    /**
     * Daftar 10 siswa baru terbaru dari tabel siswas (PPDB).
     */
    private function getSiswaBaru(?TahunAjaran $tahun, $user = null): array
    {
        $query = DB::table('siswas');

        $jenjangIds = $user ? $user->jenjangIds() : null;
        if ($jenjangIds !== null) {
            $query->whereIn('siswas.jenjang_id', $jenjangIds);
        }

        $rows = $query->select(
                'siswas.id',
                'siswas.nama_user as nama',
                'siswas.kelas',
                'siswas.sub_kelas',
                'siswas.nis',
                'siswas.nisn',
                'siswas.is_processed',
                'siswas.created_at',
                DB::raw("CONCAT(COALESCE(siswas.kelas,''), COALESCE(siswas.sub_kelas,'')) as rombel_label")
            )
            ->orderByDesc('siswas.created_at')
            ->limit(10)
            ->get();

        return $rows->map(function ($row) {
            $statusMap = [0 => 'Menunggu', 1 => 'Ditempatkan'];
            return [
                'id'           => $row->id,
                'nama'         => $row->nama,
                'kelas'        => $row->kelas,
                'sub_kelas'    => $row->sub_kelas,
                'nis'          => $row->nis,
                'nisn'         => $row->nisn,
                'is_processed' => $row->is_processed,
                'status'       => $statusMap[$row->is_processed] ?? 'Menunggu',
                'rombel'       => $row->rombel_label ?: '—',
                'created_at'   => $row->created_at,
            ];
        })->toArray();
    }

    /**
     * Status finalisasi kenaikan kelas & finalisasi total
     */
    private function getStatusFinalisasi(?TahunAjaran $tahun, $user = null): array
    {
        if (!$tahun) {
            return [
                'kenaikan_finalized'    => false,
                'kenaikan_finalized_at' => null,
                'total_finalized'       => false,
                'total_finalized_at'    => null,
            ];
        }

        $jenjangId = ($user && !$user->isSuperadmin()) ? $user->jenjang_id : null;
        $isFinalized = $jenjangId ? $tahun->isFinalizedForJenjang($jenjangId) : !is_null($tahun->finalized_at);
        $finalizedAt = $jenjangId ? $tahun->finalizedAtForJenjang($jenjangId) : $tahun->finalized_at;

        return [
            'kenaikan_finalized'       => (bool) $isFinalized,
            'kenaikan_finalized_at'    => $finalizedAt,
            'total_finalized'          => (bool) $isFinalized,
            'total_finalized_at'       => $finalizedAt,
        ];
    }
}