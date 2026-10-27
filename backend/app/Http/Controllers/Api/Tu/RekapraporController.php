<?php

namespace App\Http\Controllers\Api\Tu;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\NilaiSiswa;
use App\Models\NilaiKokurikuler;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RekapRaporController extends Controller
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

        // PTS hanya ambil pts
        if ($jenisRapor === "PTS") {
            return $nilai->pts !== null ? round($nilai->pts) : null;
        }

        // PAS ambil rata UH + pts + pas
        $uh = collect([
            $nilai->uh1,
            $nilai->uh2,
            $nilai->uh3,
            $nilai->uh4,
            $nilai->uh5,
        ])->filter(fn($v) => $v !== null);

        $rataUH = $uh->count() > 0 ? $uh->avg() : null;

        $gabungan = collect([$rataUH, $nilai->pts, $nilai->pas])
            ->filter(fn($v) => $v !== null);

        return $gabungan->count() > 0 ? round($gabungan->avg()) : null;
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

    // ================================================================
    // HELPER: AMBIL NILAI AL-QUR'AN (TAHFIDZ & TILAWAH)
    // Disalin & disesuaikan dari RaporGuruController agar rekap TU
    // memiliki data yang sama lengkapnya dengan pratinjau guru.
    // ================================================================
    private function getNilaiQuranPecahan($siswaId, $semester, $tahunAjaran, $jenisRapor)
    {
        $rows = DB::table('nilai_quran')
            ->where('siswa_id', $siswaId)
            ->where('semester', $semester)
            ->where(function ($query) use ($tahunAjaran) {
                $query->where('tahun_ajaran', $tahunAjaran)
                      ->orWhere('tahun_ajaran', str_replace('/', '\/', $tahunAjaran));
            })
            ->get();

        $kategori = ['tahfidz', 'tilawah'];
        $result = [];

        foreach ($kategori as $kat) {
            $row = $rows->firstWhere('jenis', $kat);

            if (!$row) {
                $result[$kat] = ['nilai' => null, 'deskripsi' => null];
                continue;
            }

            if (strtoupper($jenisRapor) === 'PTS') {
                $nilaiAkhir = $row->pts !== null ? round($row->pts) : null;
            } else {
                $uhArr = [];
                foreach ([$row->uh1, $row->uh2, $row->uh3, $row->uh4, $row->uh5] as $v) {
                    if ($v !== null && $v !== '' && is_numeric($v)) {
                        $uhArr[] = (float) $v;
                    }
                }

                $rataUH = count($uhArr) > 0 ? (array_sum($uhArr) / count($uhArr)) : null;
                $ptsVal = is_numeric($row->pts) ? (float) $row->pts : 0;
                $pasVal = is_numeric($row->pas) ? (float) $row->pas : 0;

                if ($rataUH === null && $ptsVal == 0 && $pasVal == 0) {
                    $nilaiAkhir = null;
                } else {
                    $nilaiAkhir = round(($rataUH * 0.4) + ($ptsVal * 0.3) + ($pasVal * 0.3));
                }
            }

            $result[$kat] = [
                'nilai'     => $nilaiAkhir,
                'deskripsi' => $row->deskripsi,
            ];
        }

        return $result;
    }

    // ================================================================
    // HELPER: kokurikuler
    // ================================================================
    private function getKokurikuler($siswaId, $rombelId, $semester, $tahunAjaran)
    {
        $rombel = DB::table('rombel')->where('id', $rombelId)->first();
        $guruId = $rombel?->guru_id;

        $row = DB::table('nilai_kokurikuler')
            ->where('siswa_id', $siswaId)
            ->where('semester', $semester)
            ->where(function($query) use ($tahunAjaran) {
                $query->where('tahun_ajaran', $tahunAjaran)
                    ->orWhere('tahun_ajaran', str_replace('/', '\/', $tahunAjaran));
            })
            ->first();

        if (!$row) {
            return ['aspek' => []];
        }

        $templateQuery = DB::table('template_deskripsi')->where('jenis', 'kokurikuler');
        if ($guruId) {
            $templateQuery->where('guru_id', $guruId);
        }
        $templates = $templateQuery->get()->groupBy(fn($t) => $t->aspek . '_' . $t->grade);
        if ($templates->isEmpty()) {
            $templates = DB::table('template_deskripsi')->where('jenis', 'kokurikuler')->get()->groupBy(fn($t) => $t->aspek . '_' . $t->grade);
        }

        $getDesc = function ($aspek, $grade) use ($templates) {
            $key = $aspek . '_' . $grade;
            return $templates[$key][0]->deskripsi ?? null;
        };

        // ── KONVERSI SKALA ANGKA MUTABA'AH → GRADE HURUF ──────────
        $konversiSkalaKeGrade = function ($nilaiSkala) {
            if ($nilaiSkala === null || !is_numeric($nilaiSkala)) return null;
            $n = (float) $nilaiSkala;
            if ($n >= 3.5) return 'A';
            if ($n >= 2.8) return 'B';
            if ($n >= 2.0) return 'C';
            if ($n >= 1.0) return 'D';
            return 'E';
        };
        // ───────────────────────────────────────────────────────────

        $gradeMutabaah = $konversiSkalaKeGrade($row->mutabaah_yaumiyah);

        $semesterString = ($semester == "1") ? "ganjil" : "genap";
        $pjblData = DB::table('pjbl_judul')
            ->where('rombel_id', $rombelId)
            ->where('semester', $semesterString)
            ->first();

        $judulPjbl         = $pjblData ? $pjblData->judul : null;
        $namaPjblWithJudul = $judulPjbl
            ? "Projek Penguatan Profil Pelajar Pancasila (P5) - PJBL: \"{$judulPjbl}\""
            : "Projek Penguatan Profil Pelajar Pancasila (PJBL)";

        return [
            'aspek' => [
                [
                    'nama'      => 'Mutabaah Yaumiyah',
                    'nilai'     => $gradeMutabaah,  // ← Grade huruf, bukan skala angka
                    'deskripsi' => $getDesc('mutabaah_yaumiyah', $gradeMutabaah),
                ],
                [
                    'nama'      => 'Bina Pribadi Islam (BPI)',
                    'nilai'     => $row->bina_pribadi_islam,
                    'deskripsi' => $getDesc('bina_pribadi_islam', $row->bina_pribadi_islam),
                ],
                [
                    'nama'      => 'Literasi',
                    'nilai'     => $row->literasi,
                    'deskripsi' => $getDesc('literasi', $row->literasi),
                ],
                [
                    'nama'      => $namaPjblWithJudul,
                    'nilai'     => $row->pjbl,
                    'deskripsi' => $getDesc('pjbl', $row->pjbl),
                ],
            ],
        ];
    }

    /**
     * ============================================
     * GET /api/tu/rekap-rapor/kelas
     * Return list rombel berdasarkan tahun ajaran
     * ============================================
     */
    public function getKelas(Request $request)
    {
        $request->validate([
            'tahun'       => 'required|string',
            'semester'    => 'required|in:1,2',
            'jenis_rapor' => 'required|in:PTS,PAS',
        ]);

        $tahunAjaran = DB::table('tahun_ajaran')
            ->where('nama', $request->tahun)
            ->first();

        if (!$tahunAjaran) {
            return response()->json([
                'success' => true,
                'data' => []
            ]);
        }

        $user = $request->user();
        $jenjangIds = $user ? $user->jenjangIds() : null;

        $rombels = DB::table('rombel')
            ->join('siswa_tahun', 'siswa_tahun.rombel_id', '=', 'rombel.id')
            ->where('siswa_tahun.tahun_ajaran_id', $tahunAjaran->id)
            ->when($jenjangIds !== null, fn($q) => $q->whereIn('rombel.jenjang_id', $jenjangIds))
            ->select(
                'rombel.id',
                'rombel.tingkat_kelas',
                'rombel.sub_nama'
            )
            ->distinct()
            ->orderBy('rombel.tingkat_kelas')
            ->orderBy('rombel.sub_nama')
            ->get()
            ->map(function ($r) {
                return [
                    'id' => $r->id,
                    'label' => trim(($r->tingkat_kelas ?? '') . ' ' . ($r->sub_nama ?? ''))
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $rombels
        ]);
    }

    /**
     * ============================================
     * GET /api/tu/rekap-rapor
     * Semua siswa dalam rombel
     * ============================================
     */
    public function index(Request $request)
    {
        try {

            $request->validate([
                'tahun'       => 'required|string',
                'semester'    => 'required|in:1,2',
                'jenis_rapor' => 'required|in:PTS,PAS',
                'rombel_id'   => 'required|integer',
                'search'      => 'nullable|string|max:100'
            ]);

            $rombel = DB::table('rombel')->where('id', $request->rombel_id)->first();
            if (!$rombel || !$request->user()->bolehJenjang($rombel->jenjang_id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Rombel tidak ditemukan atau di luar jenjang sekolah Anda.'
                ], 403);
            }

            $tahun_ajaran = trim($request->tahun);
            $semester     = $request->semester;
            $jenis_rapor  = strtoupper($request->jenis_rapor);
            $rombel_id    = $request->rombel_id;
            $search       = $request->search;

            $tahunAjaran = DB::table('tahun_ajaran')
                ->where('nama', $tahun_ajaran)
                ->first();

            if (!$tahunAjaran) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'Tahun ajaran tidak ditemukan.'
                ]);
            }

            $rombel = DB::table('rombel')
                ->where('id', $rombel_id)
                ->first();

            if (!$rombel) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'Rombel tidak ditemukan.'
                ]);
            }

            $kelasText = trim(($rombel->tingkat_kelas ?? '') . ' ' . ($rombel->sub_nama ?? ''));

            $querySiswa = DB::table('siswa_tahun')
                ->leftJoin('siswa', 'siswa.id', '=', 'siswa_tahun.siswa_id')
                ->leftJoin('siswas', 'siswas.id', '=', 'siswa_tahun.siswa_id')
                ->where('siswa_tahun.rombel_id', $rombel_id)
                ->where('siswa_tahun.tahun_ajaran_id', $tahunAjaran->id)
                ->select(
                    'siswa_tahun.id as siswa_tahun_id',
                    DB::raw("COALESCE(siswa.id, siswas.id) as siswa_id"),
                    DB::raw("COALESCE(siswa.nama, siswas.nama_user) as nama"),
                    DB::raw("COALESCE(siswa.nis, siswas.nis) as nis")
                );

            if ($search) {
                $term = "%" . $search . "%";
                $querySiswa->where(function ($q) use ($term) {
                    $q->where('siswa.nama', 'like', $term)
                        ->orWhere('siswas.nama_user', 'like', $term)
                        ->orWhere('siswa.nis', 'like', $term)
                        ->orWhere('siswas.nis', 'like', $term);
                });
            }

            $siswaList = $querySiswa->orderBy('nama')->get();

            if ($siswaList->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'Tidak ada siswa pada rombel ini.'
                ]);
            }

            $semesterDb = "semester" . $semester;
            $result = [];

            foreach ($siswaList as $siswa) {

                // FINALISASI
                $final = DB::table('finalisasi_rapor')
                    ->where('siswa_id', $siswa->siswa_id)
                    ->where('semester', $semester)
                    ->where('jenis_rapor', $jenis_rapor)
                    ->where('tahun_ajaran', $tahun_ajaran)
                    ->where('finalisasi', 1)
                    ->exists();

                // NILAI MAPEL
                $nilaiMapel = NilaiSiswa::where('siswa_id', $siswa->siswa_id)
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

                // CATATAN WALI KELAS
                $catatan = DB::table('catatan_wali_kelas')
                    ->where('siswa_id', $siswa->siswa_id)
                    ->where('semester', $semester)
                    ->where('tahun_ajaran', $tahun_ajaran)
                    ->value('catatan');

                // KOKURIKULER
                $kokurikuler = $this->getKokurikuler(
                    $siswa->siswa_id,
                    $rombel_id,
                    $semester,
                    $tahun_ajaran
                );

                // EKSTRAKURIKULER
                $ekstrakurikuler = $this->getEkstrakurikuler(
                    $siswa->siswa_id,
                    $semester,
                    $tahun_ajaran
                );

                // NILAI AL-QUR'AN (TAHFIDZ & TILAWAH)
                $nilaiQuran = $this->getNilaiQuranPecahan(
                    $siswa->siswa_id,
                    $semester,
                    $tahun_ajaran,
                    $jenis_rapor
                );

                // REKAP KEHADIRAN
                $rekapKehadiran = $this->rekapKehadiranPerHari(
                    $siswa->siswa_tahun_id,
                    $semesterDb
                );

                // ===========================
                // AMBIL NAMA WALI KELAS DARI ROMBEL
                // (kolom finalisasi_rapor.guru_id tidak pernah diisi oleh
                // proses ajukan/approve, sehingga wali kelas diambil dari
                // rombel.guru_id — sama seperti yang dipakai ApprovalRaporController)
                // ===========================
                $guruFinal = DB::table('rombel')
                    ->join('users', 'users.id', '=', 'rombel.guru_id')
                    ->where('rombel.id', $rombel_id)
                    ->select('users.name', 'users.nipy')
                    ->first();

                $result[] = [
                    'siswa_id'               => $siswa->siswa_id,
                    'nama'                   => $siswa->nama,
                    'nis'                    => $siswa->nis,
                    'kelas'                  => $kelasText,

                    'rata_rata'              => $rataRata,
                    'ketercapaian_rata_rata' => $this->ketercapaian($rataRata),

                    'finalisasi'             => $final,
                    'catatan_wali_kelas'     => $catatan,

                    'mapel'                  => $mapel,
                    'kokurikuler'            => $kokurikuler,
                    'ekstrakurikuler'        => $ekstrakurikuler,
                    'nilai_quran'            => $nilaiQuran,
                    'rekap_kehadiran'        => $rekapKehadiran,

                    'tahun_ajaran'           => $tahun_ajaran,
                    'semester'               => $semester,
                    'jenis_rapor'            => $jenis_rapor,

                    'nama_guru'              => $guruFinal->name ?? "-",
                    'nip_guru'               => $guruFinal->nipy ?? null,
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $result,
                'kelas' => $kelasText,
                'jumlah_siswa' => count($result)
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan server.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ============================================
     * GET /api/tu/rekap-rapor/detail
     * Detail rapor 1 siswa (untuk halaman Detail TU)
     * ============================================
     */
    public function detail(Request $request)
    {
        try {

            $request->validate([
                'siswa_id'    => 'required|integer',
                'tahun'       => 'required|string',
                'semester'    => 'required|in:1,2',
                'jenis_rapor' => 'required|in:PTS,PAS',
                'rombel_id'   => 'required|integer',
            ]);

            $tahun_ajaran = trim($request->tahun);
            $semester     = $request->semester;
            $jenis_rapor  = strtoupper($request->jenis_rapor);
            $rombel_id    = $request->rombel_id;
            $siswa_id     = $request->siswa_id;

            $rombel = DB::table('rombel')->where('id', $rombel_id)->first();
            if (!$rombel) {
                return response()->json([
                    'success' => false,
                    'message' => 'Rombel tidak ditemukan.'
                ], 404);
            }

            $kelasText = trim(($rombel->tingkat_kelas ?? '') . ' ' . ($rombel->sub_nama ?? ''));

            $tahunAjaran = DB::table('tahun_ajaran')
                ->where('nama', $tahun_ajaran)
                ->first();

            if (!$tahunAjaran) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tahun ajaran tidak ditemukan.'
                ], 404);
            }

            // ambil siswa dari tabel siswa / siswas
            $siswa = DB::table('siswa')
                ->where('id', $siswa_id)
                ->select('id', 'nama', 'nis')
                ->first();

            if (!$siswa) {
                $siswa = DB::table('siswas')
                    ->where('id', $siswa_id)
                    ->select(
                        'id',
                        DB::raw("nama_user as nama"),
                        'nis'
                    )
                    ->first();
            }

            if (!$siswa) {
                return response()->json([
                    'success' => false,
                    'message' => 'Siswa tidak ditemukan.'
                ], 404);
            }

            // ambil siswa_tahun_id
            $siswaTahun = DB::table('siswa_tahun')
                ->where('siswa_id', $siswa_id)
                ->where('rombel_id', $rombel_id)
                ->where('tahun_ajaran_id', $tahunAjaran->id)
                ->first();

            $siswa_tahun_id = $siswaTahun->id ?? null;

            // cek finalisasi
            $final = DB::table('finalisasi_rapor')
                ->where('siswa_id', $siswa_id)
                ->where('semester', $semester)
                ->where('jenis_rapor', $jenis_rapor)
                ->where('tahun_ajaran', $tahun_ajaran)
                ->where('finalisasi', 1)
                ->exists();

            // ambil nilai mapel
            $nilaiMapel = NilaiSiswa::where('siswa_id', $siswa_id)
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

            $catatan = DB::table('catatan_wali_kelas')
                ->where('siswa_id', $siswa_id)
                ->where('semester', $semester)
                ->where('tahun_ajaran', $tahun_ajaran)
                ->value('catatan');

            $kokurikuler = $this->getKokurikuler(
                $siswa_id,
                $rombel_id,
                $semester,
                $tahun_ajaran
            );
            $ekstrakurikuler = $this->getEkstrakurikuler($siswa_id, $semester, $tahun_ajaran);

            // NILAI AL-QUR'AN (TAHFIDZ & TILAWAH)
            $nilaiQuran = $this->getNilaiQuranPecahan(
                $siswa_id,
                $semester,
                $tahun_ajaran,
                $jenis_rapor
            );

            $semesterDb = "semester" . $semester;

            $rekapKehadiran = [
                'sakit' => 0,
                'izin'  => 0,
                'alpha' => 0,
            ];

            if ($siswa_tahun_id) {
                $rekapKehadiran = $this->rekapKehadiranPerHari($siswa_tahun_id, $semesterDb);
            }

            // ===========================
            // AMBIL NAMA WALI KELAS DARI ROMBEL
            // (kolom finalisasi_rapor.guru_id tidak pernah diisi oleh
            // proses ajukan/approve, sehingga wali kelas diambil dari
            // rombel.guru_id — sama seperti yang dipakai ApprovalRaporController)
            // ===========================
            $guruFinal = DB::table('rombel')
                ->join('users', 'users.id', '=', 'rombel.guru_id')
                ->where('rombel.id', $rombel_id)
                ->select('users.name', 'users.nipy')
                ->first();

            return response()->json([
                'success' => true,
                'data' => [
                    'siswa_id'           => $siswa_id,
                    'nama'               => $siswa->nama,
                    'nis'                => $siswa->nis,
                    'kelas'              => $kelasText,

                    'rata_rata'          => $rataRata,
                    'ketercapaian'       => $this->ketercapaian($rataRata),

                    'finalisasi'         => $final,
                    'catatan_wali_kelas' => $catatan,

                    'mapel'              => $mapel,
                    'kokurikuler'        => $kokurikuler,
                    'ekstrakurikuler'    => $ekstrakurikuler,
                    'nilai_quran'        => $nilaiQuran,
                    'rekap_kehadiran'    => $rekapKehadiran,

                    'tahun_ajaran'       => $tahun_ajaran,
                    'semester'           => $semester,
                    'jenis_rapor'        => $jenis_rapor,

                    'nama_guru'          => $guruFinal->name ?? "-",
                    'nip_guru' => $guruFinal->nipy ?? null,
                ]
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan server.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}