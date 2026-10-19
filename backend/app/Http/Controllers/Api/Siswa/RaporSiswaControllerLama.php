<?php

namespace App\Http\Controllers\Api\siswa;

use App\Http\Controllers\Controller;
use App\Models\NilaiSiswa;
use App\Models\NilaiKokurikuler;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RaporSiswaController extends Controller
{
    /**
     * ============================================
     * HELPER: KETERANGAN KETERCAPAIAN
     * ============================================
     */
    private function ketercapaian($nilai)
    {
        if ($nilai === null) return "-";

        if ($nilai >= 88) return "Sangat Baik";
        if ($nilai >= 75) return "Baik";
        if ($nilai >= 60) return "Cukup";
        return "Perlu Bimbingan";
    }

    /**
     * ============================================
     * HITUNG NILAI PER MAPEL
     * ============================================
     */
    private function hitungNilaiMapel($nilai, $jenisRapor)
    {
        $jenisRapor = strtoupper($jenisRapor);

        if ($jenisRapor === "PTS") {
            return $nilai->pts !== null ? round($nilai->pts) : null;
        }

        $uh = collect([
            $nilai->uh1,
            $nilai->uh2,
            $nilai->uh3,
            $nilai->uh4,
            $nilai->uh5,
        ])->filter(fn($v) => $v !== null && $v !== '');

        $rataUH = $uh->count() > 0 ? $uh->avg() : 0;

        $ptsVal = $nilai->pts !== null ? (float)$nilai->pts : 0;
        $pasVal = $nilai->pas !== null ? (float)$nilai->pas : 0;

        if ($uh->count() === 0 && $ptsVal == 0 && $pasVal == 0) {
            return null;
        }

        return round(($rataUH * 0.4) + ($ptsVal * 0.3) + ($pasVal * 0.3));
    }

    /**
     * ============================================
     * HELPER: Rekap kehadiran PER HARI
     * Prioritas: A > I > S
     * ============================================
     */
    private function rekapKehadiranPerHari($siswa_tahun_id, $semesterDb)
    {
        $rows = DB::table('absensi_mapel')
            ->where('siswa_tahun_id', $siswa_tahun_id)
            ->where('semester', $semesterDb)
            ->whereIn('status', ['S', 'I', 'A'])
            ->select('tanggal', 'status')
            ->get();

        $perHari = $rows->groupBy('tanggal')->map(function ($items) {
            $statuses = $items->pluck('status')->unique();

            if ($statuses->contains('A')) return 'A';
            if ($statuses->contains('I')) return 'I';
            return 'S';
        });

        return [
            'sakit' => $perHari->filter(fn($s) => $s === 'S')->count(),
            'izin'  => $perHari->filter(fn($s) => $s === 'I')->count(),
            'alpha' => $perHari->filter(fn($s) => $s === 'A')->count(),
        ];
    }

    /**
     * ============================================
     * HELPER: Ambil ekstrakurikuler siswa
     * ============================================
     */
    private function getEkstrakurikuler($siswa_id, $semester, $tahun_ajaran)
    {
        $siswa = Siswa::find($siswa_id);
        if (!$siswa) return [];

        return $siswa->ekstrakurikuler()
            ->wherePivot('semester', $semester)
            ->wherePivot('tahun_ajaran', $tahun_ajaran)
            ->withPivot('nilai', 'deskripsi')
            ->orderByRaw('wajib DESC, nama ASC')
            ->get()
            ->map(fn($e) => [
                'id'        => $e->id,
                'nama'      => $e->nama,
                'wajib'     => (bool) $e->wajib,
                'nilai'     => $e->pivot->nilai     ?? null,
                'deskripsi' => $e->pivot->deskripsi ?? null,
            ])
            ->toArray();
    }

    /**
     * ============================================
     * HELPER: Ambil kokurikuler siswa + JUDUL PJBL DINAMIS
     * ============================================
     */
    private function getKokurikuler($siswa_id, $rombelId, $semester, $tahun_ajaran)
    {
        $data = NilaiKokurikuler::where('siswa_id', $siswa_id)
            ->where('semester', $semester)
            ->where('tahun_ajaran', $tahun_ajaran)
            ->first();

        if (!$data) return null;

        $semesterString = ($semester == "1") ? "ganjil" : "genap";
        $pjblData = DB::table('pjbl_judul')
            ->where('rombel_id', $rombelId)
            ->where('semester', $semesterString)
            ->first();

        $namaPjblWithJudul = $pjblData ? "PJBL ({$pjblData->judul})" : "PJBL";

        $aspekKeys = [
            'Mutabaah Yaumiyah'  => $data->mutabaah_yaumiyah,
            'Bina Pribadi Islam' => $data->bina_pribadi_islam,
            'Literasi'           => $data->literasi,
            $namaPjblWithJudul   => $data->pjbl,
        ];

        $deskripsiAspek = $data->deskripsi_aspek ?? [];

        if (is_string($deskripsiAspek)) {
            $deskripsiAspek = json_decode($deskripsiAspek, true) ?? [];
        }

        $aspek = [];
        $i = 0;

        foreach ($aspekKeys as $label => $nilai) {
            $deskripsi = $deskripsiAspek[$i] ?? null;

            $aspek[] = [
                'nama'      => $label,
                'nilai'     => $nilai,
                'deskripsi' => $deskripsi,
            ];
            $i++;
        }

        return [
            'aspek'           => $aspek,
            'deskripsi_aspek' => $deskripsiAspek,
        ];
    }

    /**
     * ============================================
     * GET /api/siswa/rapor
     * ============================================
     */
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

            $semester     = $request->query('semester', '1');
            $jenis_rapor  = strtoupper($request->query('jenis_rapor', 'PTS'));
            $tahun_ajaran = trim($request->query('tahun_ajaran', ''));

            if (!$tahun_ajaran) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tahun ajaran wajib diisi.'
                ], 422);
            }

            if (!in_array($jenis_rapor, ['PTS', 'PAS'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'jenis_rapor harus PTS atau PAS'
                ], 422);
            }

            if (!in_array($semester, ['1', '2'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'semester harus 1 atau 2'
                ], 422);
            }

            $tahunAjaranAktif = DB::table('tahun_ajaran')
                ->where('aktif', 1)
                ->first();

            if (!$tahunAjaranAktif) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak ada tahun ajaran aktif.'
                ], 422);
            }

            $siswaTahun = DB::table('siswa_tahun')
                ->leftJoin('siswa', 'siswa.id', '=', 'siswa_tahun.siswa_id')
                ->leftJoin('siswas', 'siswas.id', '=', 'siswa_tahun.siswa_id')
                ->where('siswa_tahun.tahun_ajaran_id', $tahunAjaranAktif->id)
                ->where(function ($q) use ($nis) {
                    $q->where('siswa.nis', $nis)
                      ->orWhere('siswas.nis', $nis);
                })
                ->select(
                    'siswa_tahun.id as siswa_tahun_id',
                    'siswa_tahun.rombel_id',
                    DB::raw("COALESCE(siswa.id, siswas.id) as siswa_id"),
                    DB::raw("COALESCE(siswa.nama, siswas.nama_user) as nama"),
                    DB::raw("COALESCE(siswa.nis, siswas.nis) as nis")
                )
                ->first();

            if (!$siswaTahun) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data siswa_tahun tidak ditemukan untuk NIS ini.'
                ], 404);
            }

            $rombel = DB::table('rombel')
                ->where('id', $siswaTahun->rombel_id)
                ->first();

            $kelasText = "-";
            if ($rombel) {
                $kelasText = trim(($rombel->tingkat_kelas ?? '') . ' ' . ($rombel->sub_nama ?? ''));
            }

            $final = DB::table('finalisasi_rapor')
                ->where('siswa_id', $siswaTahun->siswa_id)
                ->where('semester', $semester)
                ->where('jenis_rapor', $jenis_rapor)
                ->where('tahun_ajaran', $tahun_ajaran)
                ->where('finalisasi', 1)
                ->exists();

            if (!$final) {
                return response()->json([
                    'success' => true,
                    'message' => 'Rapor belum difinalisasi.',
                    'data' => null
                ], 200);
            }

            $nilaiMapel = NilaiSiswa::where('siswa_id', $siswaTahun->siswa_id)
                ->where('semester', $semester)
                ->where('tahun_ajaran', $tahun_ajaran)
                ->with('mapel:id,nama')
                ->get();

            $mapel = [];
            $total = [];

            foreach ($nilaiMapel as $n) {
                $nilaiAkhir = $this->hitungNilaiMapel($n, $jenis_rapor);

                $mapel[] = [
                    'mapel_id'     => $n->mapel_id,
                    'nama'         => $n->mapel->nama ?? '-',
                    'nilai'        => $nilaiAkhir,
                    'ketercapaian' => $this->ketercapaian($nilaiAkhir),
                ];

                if ($nilaiAkhir !== null) {
                    $total[] = $nilaiAkhir;
                }
            }

            $rataRata = count($total)
                ? round(array_sum($total) / count($total))
                : null;

            $semesterDb = "semester" . $semester;

            $rekapKehadiran = $this->rekapKehadiranPerHari(
                $siswaTahun->siswa_tahun_id,
                $semesterDb
            );

            $catatan = DB::table('finalisasi_rapor')
                ->where('siswa_id', $siswaTahun->siswa_id)
                ->where('semester', $semester)
                ->where('jenis_rapor', $jenis_rapor)
                ->where('tahun_ajaran', $tahun_ajaran)
                ->value('catatan_wali_kelas');

            $kokurikuler = $this->getKokurikuler(
                $siswaTahun->siswa_id,
                $siswaTahun->rombel_id,
                $semester,
                $tahun_ajaran
            );

            $ekstrakurikuler = $this->getEkstrakurikuler(
                $siswaTahun->siswa_id,
                $semester,
                $tahun_ajaran
            );

            /**
             * FIX COLUMN SELECT: Mengembalikan pemanggilan field users.nipy (bukan users.nip)
             * agar sesuai dengan skema database asli Anda.
             */
            $guruFinal = DB::table('finalisasi_rapor')
                ->join('users', 'users.id', '=', 'finalisasi_rapor.diajukan_oleh')
                ->where('finalisasi_rapor.siswa_id', $siswaTahun->siswa_id)
                ->where('finalisasi_rapor.semester', $semester)
                ->where('finalisasi_rapor.jenis_rapor', $jenis_rapor)
                ->where('finalisasi_rapor.tahun_ajaran', $tahun_ajaran)
                ->select('users.name', 'users.nipy') // 👈 Menggunakan nipy
                ->first();

            $response = [
                'siswa_id'               => $siswaTahun->siswa_id,
                'nama'                   => $siswaTahun->nama,
                'nis'                    => $siswaTahun->nis,
                'kelas'                  => $kelasText,
                'rata_rata'              => $rataRata,
                'ketercapaian_rata_rata' => $this->ketercapaian($rataRata),
                'finalisasi'             => true,
                'catatan_wali_kelas'     => $catatan ?? '',
                'mapel'                  => $mapel,
                'kokurikuler'            => $kokurikuler,
                'ekstrakurikuler'        => $ekstrakurikuler,
                'rekap_kehadiran'        => $rekapKehadiran,
                'tahun_ajaran'           => $tahun_ajaran,
                'semester'               => $semester,
                'jenis_rapor'            => $jenis_rapor,
                'nama_guru'              => $guruFinal->name ?? "-",
                'nip_guru'               => $guruFinal->nipy ?? null, // dialiaskan aman ke frontend
            ];

            return response()->json([
                'success' => true,
                'message' => 'Rapor siswa berhasil diambil.',
                'data' => $response
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error RaporSiswaController@index: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan server.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ============================================
     * GET /api/siswa/tahunajaran/aktif
     * ============================================
     */
    public function tahunAktif()
    {
        $data = DB::table('tahun_ajaran')
            ->where('aktif', 1)
            ->first();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}