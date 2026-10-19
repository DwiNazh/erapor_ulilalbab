<?php

namespace App\Http\Controllers\Api\gurusd;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class RaporGuruController extends Controller
{
    // ================================================================
    // HELPER: ambil nilai akhir per siswa per mapel
    // ================================================================
    private function hitungNilaiAkhir($siswaId, $semester, $tahunAjaran, $jenisRapor)
    {
        $nilaiMapel = DB::table('nilai_siswa as ns')
            ->join('mapel as m', 'm.id', '=', 'ns.mapel_id')
            ->where('ns.siswa_id', $siswaId)
            ->where('ns.semester', $semester)
            ->where(function($query) use ($tahunAjaran) {
                $query->where('ns.tahun_ajaran', $tahunAjaran)
                      ->orWhere('ns.tahun_ajaran', str_replace('/', '\/', $tahunAjaran));
            })
            ->select([
                'm.id as mapel_id',
                'm.nama',
                'ns.uh1', 'ns.uh2', 'ns.uh3', 'ns.uh4', 'ns.uh5',
                'ns.pts',
                'ns.pas',
            ])
            ->get();

        $mapelResult   = [];
        $nilaiAkhirAll = [];

        foreach ($nilaiMapel as $n) {
            if (strtoupper($jenisRapor) === 'PTS') {
                $nilaiAkhir = $n->pts !== null ? round($n->pts) : null;
            } else {
                $uhArr = [];
                foreach ([$n->uh1, $n->uh2, $n->uh3, $n->uh4, $n->uh5] as $v) {
                    if ($v !== null && $v !== '' && is_numeric($v)) {
                        $uhArr[] = (float)$v;
                    }
                }

                $rataUH = count($uhArr) > 0 ? (array_sum($uhArr) / count($uhArr)) : null;
                $ptsVal = is_numeric($n->pts) ? (float)$n->pts : 0;
                $pasVal = is_numeric($n->pas) ? (float)$n->pas : 0;

                if ($rataUH === null && $ptsVal == 0 && $pasVal == 0) {
                    $nilaiAkhir = null;
                } else {
                    $nilaiAkhir = round(($rataUH * 0.4) + ($ptsVal * 0.3) + ($pasVal * 0.3));
                }
            }

            $mapelResult[] = [
                'mapel_id' => $n->mapel_id,
                'nama'     => $n->nama,
                'nilai'    => $nilaiAkhir,
            ];

            if ($nilaiAkhir !== null) {
                $nilaiAkhirAll[] = $nilaiAkhir;
            }
        }

        $rataRata = count($nilaiAkhirAll)
            ? round(array_sum($nilaiAkhirAll) / count($nilaiAkhirAll), 1)
            : null;

        return [$mapelResult, $rataRata];
    }

    // ================================================================
    // HELPER: AMBIL NILAI AL-QUR'AN (TAHFIDZ & TILAWAH) - UPDATED
    // ================================================================
    private function getNilaiQuranPecahan($siswaId, $semester, $tahunAjaran, $jenisRapor)
    {
        $rows = DB::table('nilai_quran')
            ->where('siswa_id', $siswaId)
            ->where('semester', $semester)
            ->where(function($query) use ($tahunAjaran) {
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
                        $uhArr[] = (float)$v;
                    }
                }

                $rataUH = count($uhArr) > 0 ? (array_sum($uhArr) / count($uhArr)) : null;
                $ptsVal = is_numeric($row->pts) ? (float)$row->pts : 0;
                $pasVal = is_numeric($row->pas) ? (float)$row->pas : 0;

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
        $guruId = Auth::id();

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

        $templates = DB::table('template_deskripsi')
            ->where('guru_id', $guruId)
            ->where('jenis', 'kokurikuler')
            ->get()
            ->groupBy(fn($t) => $t->aspek . '_' . $t->grade);

        $getDesc = function ($aspek, $grade) use ($templates) {
            $key = $aspek . '_' . $grade;
            return $templates[$key][0]->deskripsi ?? null;
        };

        $konversiSkalaKeGrade = function ($nilaiSkala) {
            if ($nilaiSkala === null || !is_numeric($nilaiSkala)) return null;
            $n = (float) $nilaiSkala;
            if ($n >= 3.5) return 'A';
            if ($n >= 2.8) return 'B';
            if ($n >= 2.0) return 'C';
            if ($n >= 1.0) return 'D';
            return 'E';
        };

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
                    'nilai'     => $gradeMutabaah, 
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
                    'nama'      => 'Mata Pelajaran PJBL',
                    'nilai'     => $row->pjbl,
                    'deskripsi' => $getDesc('pjbl', $row->pjbl),
                ],
            ],
        ];
    }

    // ================================================================
    // HELPER: ekstrakurikuler
    // ================================================================
    private function getEkstrakurikuler($siswaId, $semester, $tahunAjaran)
    {
        return DB::table('ekstrakurikuler_siswa as es')
            ->join('ekstrakurikuler as e', 'e.id', '=', 'es.ekstrakurikuler_id')
            ->where('es.siswa_id', $siswaId)
            ->where('es.semester', $semester)
            ->where(function($query) use ($tahunAjaran) {
                $query->where('es.tahun_ajaran', $tahunAjaran)
                      ->orWhere('es.tahun_ajaran', str_replace('/', '\/', $tahunAjaran));
            })
            ->select('e.id', 'e.nama', 'e.wajib', 'es.nilai', 'es.deskripsi')
            ->get()
            ->map(fn($r) => [
                'id'        => $r->id,
                'nama'      => $r->nama,
                'wajib'     => (bool) $r->wajib,
                'nilai'     => $r->nilai,
                'deskripsi' => $r->deskripsi,
            ])
            ->toArray();
    }

    // ================================================================
    // HELPER: rekap kehadiran
    // ================================================================
    private function getRekapKehadiran($siswaId, $rombelId, $semester, $tahunAjaran)
    {
        $siswaTahun = DB::table('siswa_tahun as st')
            ->join('tahun_ajaran as ta', 'ta.id', '=', 'st.tahun_ajaran_id')
            ->where('st.siswa_id', $siswaId)
            ->where('st.rombel_id', $rombelId)
            ->where('ta.nama', $tahunAjaran)
            ->select('st.id')
            ->first();

        if (!$siswaTahun) {
            return ['sakit' => 0, 'izin' => 0, 'alpha' => 0];
        }

        $rekap = DB::table('absensi_mapel')
            ->where('siswa_tahun_id', $siswaTahun->id)
            ->where('semester', 'semester' . $semester)
            ->selectRaw("COUNT(CASE WHEN status = 'S' THEN 1 END) as sakit")
            ->selectRaw("COUNT(CASE WHEN status = 'I' THEN 1 END) as izin")
            ->selectRaw("COUNT(CASE WHEN status = 'A' THEN 1 END) as alpha")
            ->first();

        return [
            'sakit' => (int) ($rekap->sakit ?? 0),
            'izin'  => (int) ($rekap->izin  ?? 0),
            'alpha' => (int) ($rekap->alpha  ?? 0),
        ];
    }

    // ================================================================
    // GET /api/guru/rapor/preview
    // ================================================================
    public function preview(Request $request)
    {
        $request->validate([
            'rombel_id'    => 'required|integer',
            'semester'     => 'required|in:1,2',
            'jenis_rapor'  => 'required|in:PTS,PAS',
            'tahun_ajaran' => 'required|string',
        ]);

        $rombelId    = $request->rombel_id;
        $semester    = $request->semester;
        $jenisRapor  = strtoupper($request->jenis_rapor);
        $tahunAjaran = trim($request->tahun_ajaran);

        $siswaExistingQuery = DB::table('siswa_tahun as st')
            ->join('siswa as s', 's.id', '=', 'st.siswa_id')
            ->join('tahun_ajaran as ta', 'ta.id', '=', 'st.tahun_ajaran_id')
            ->where('st.rombel_id', $rombelId)
            ->where('ta.nama', $tahunAjaran)
            ->select('s.id as siswa_id', 's.nama', 's.nis');

        $siswaBaruQuery = DB::table('siswa_tahun as st')
            ->join('siswas as s', 's.id', '=', 'st.siswa_id')
            ->join('tahun_ajaran as ta', 'ta.id', '=', 'st.tahun_ajaran_id')
            ->where('st.rombel_id', $rombelId)
            ->where('ta.nama', $tahunAjaran)
            ->select('s.id as siswa_id', 's.nama_user as nama', 's.nis');

        $siswaList = $siswaExistingQuery->union($siswaBaruQuery)
            ->orderBy('nama', 'asc')
            ->get();

        $result         = [];
        $rekapKehadiran = [];

        foreach ($siswaList as $siswa) {
            [$mapelResult, $rataRata] = $this->hitungNilaiAkhir(
                $siswa->siswa_id,
                $semester,
                $tahunAjaran,
                $jenisRapor
            );

            $kokurikuler     = $this->getKokurikuler($siswa->siswa_id, $rombelId, $semester, $tahunAjaran);
            $ekstrakurikuler = $this->getEkstrakurikuler($siswa->siswa_id, $semester, $tahunAjaran);

            // Ambil format pecahan Tahfidz & Tilawah
            $nilaiQuran = $this->getNilaiQuranPecahan(
                $siswa->siswa_id,
                $semester,
                $tahunAjaran,
                $jenisRapor
            );

            $finalRow = DB::table('finalisasi_rapor')
                ->where('siswa_id', $siswa->siswa_id)
                ->where('semester', $semester)
                ->where('jenis_rapor', $jenisRapor)
                ->where(function($query) use ($tahunAjaran) {
                    $query->where('tahun_ajaran', $tahunAjaran)
                          ->orWhere('tahun_ajaran', str_replace('/', '\/', $tahunAjaran));
                })
                ->select('catatan_wali_kelas', 'approval_status', 'rejection_reason')
                ->first();

            $rekap = $this->getRekapKehadiran($siswa->siswa_id, $rombelId, $semester, $tahunAjaran);
            $rekapKehadiran[$siswa->siswa_id] = $rekap;

            $result[] = [
                'siswa_id'           => $siswa->siswa_id,
                'nama'               => $siswa->nama,
                'nis'                => $siswa->nis,
                'mapel'              => $mapelResult,
                'rata_rata'          => $rataRata,
                'kokurikuler'        => $kokurikuler,
                'ekstrakurikuler'    => $ekstrakurikuler,
                'nilai_quran'        => $nilaiQuran,        // Output data pecahan terstruktur
                'catatan_wali_kelas' => $finalRow?->catatan_wali_kelas ?? '',
                'approval_status'    => $finalRow?->approval_status ?? 'draft',
                'rejection_reason'   => $finalRow?->rejection_reason ?? null,
            ];
        }

        return response()->json([
            'success'         => true,
            'data'            => $result,
            'rekap_kehadiran' => $rekapKehadiran,
        ]);
    }

    public function updateCatatanIndividu(Request $request)
    {
        $request->validate([
            'siswa_id'     => 'required|integer',
            'catatan'      => 'nullable|string',
            'semester'     => 'required|in:1,2',
            'jenis_rapor'  => 'required|in:PTS,PAS',
            'tahun_ajaran' => 'required|string',
        ]);

        $siswaId     = $request->siswa_id;
        $semester    = $request->semester;
        $jenisRapor  = strtoupper($request->jenis_rapor);
        $tahunAjaran = trim($request->tahun_ajaran);

        $existing = DB::table('finalisasi_rapor')
            ->where('siswa_id', $siswaId)
            ->where('semester', $semester)
            ->where('jenis_rapor', $jenisRapor)
            ->where('tahun_ajaran', $tahunAjaran)
            ->first();

        if ($existing && !in_array($existing->approval_status, ['draft', 'rejected', null])) {
            return response()->json([
                'success' => false,
                'message' => 'Catatan tidak dapat diubah. Rapor sedang menunggu persetujuan atau sudah disetujui.',
            ], 422);
        }

        DB::table('finalisasi_rapor')->updateOrInsert(
            [
                'siswa_id'     => $siswaId,
                'semester'     => $semester,
                'jenis_rapor'  => $jenisRapor,
                'tahun_ajaran' => $tahunAjaran,
            ],
            [
                'catatan_wali_kelas' => $request->catatan,
                'approval_status'    => $existing?->approval_status ?? 'draft',
                'updated_at'         => now(),
                'created_at'         => $existing ? $existing->created_at : now(),
            ]
        );

        return response()->json(['success' => true, 'message' => 'Catatan berhasil disimpan']);
    }

    public function ajukanKepsek(Request $request)
    {
        $request->validate([
            'rombel_id'    => 'required|integer',
            'semester'     => 'required|in:1,2',
            'jenis_rapor'  => 'required|in:PTS,PAS',
            'tahun_ajaran' => 'required|string',
        ]);

        $rombelId    = $request->rombel_id;
        $semester    = $request->semester;
        $jenisRapor  = strtoupper($request->jenis_rapor);
        $tahunAjaran = trim($request->tahun_ajaran);
        $guruId      = Auth::id();

        $siswaList = DB::table('siswa_tahun as st')
            ->join('tahun_ajaran as ta', 'ta.id', '=', 'st.tahun_ajaran_id')
            ->where('st.rombel_id', $rombelId)
            ->where('ta.nama', $tahunAjaran)
            ->pluck('st.siswa_id');

        if ($siswaList->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada siswa di kelas ini.',
            ], 422);
        }

        $sudahDiajukan = DB::table('finalisasi_rapor')
            ->whereIn('siswa_id', $siswaList)
            ->where('semester', $semester)
            ->where('jenis_rapor', $jenisRapor)
            ->where('tahun_ajaran', $tahunAjaran)
            ->whereIn('approval_status', ['pending_approval', 'approved'])
            ->exists();

        if ($sudahDiajukan) {
            return response()->json([
                'success' => false,
                'message' => 'Rapor sudah diajukan atau sudah disetujui sebelumnya.',
            ], 422);
        }

        DB::beginTransaction();
        try {
            foreach ($siswaList as $siswaId) {
                $existing = DB::table('finalisasi_rapor')
                    ->where('siswa_id', $siswaId)
                    ->where('semester', $semester)
                    ->where('jenis_rapor', $jenisRapor)
                    ->where('tahun_ajaran', $tahunAjaran)
                    ->first();

                DB::table('finalisasi_rapor')->updateOrInsert(
                    [
                        'siswa_id'     => $siswaId,
                        'semester'     => $semester,
                        'jenis_rapor'  => $jenisRapor,
                        'tahun_ajaran' => $tahunAjaran,
                    ],
                    [
                        'approval_status'  => 'pending_approval',
                        'rejection_reason' => null,
                        'diajukan_oleh'    => $guruId,
                        'diajukan_at'      => now(),
                        'finalisasi'       => 0,
                        'updated_at'       => now(),
                        'created_at'       => $existing ? $existing->created_at : now(),
                    ]
                );
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengajukan rapor: ' . $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Rapor berhasil diajukan ke Kepala Sekolah.',
        ]);
    }

    public function raporFinal(Request $request)
    {
        $request->validate([
            'rombel_id'    => 'required|integer',
            'semester'     => 'required|in:1,2',
            'jenis_rapor'  => 'required|in:PTS,PAS',
            'tahun_ajaran' => 'required|string',
        ]);

        $rombelId    = $request->rombel_id;
        $semester    = $request->semester;
        $jenisRapor  = strtoupper($request->jenis_rapor);
        $tahunAjaran = trim($request->tahun_ajaran);

        $siswaExisting = DB::table('finalisasi_rapor as fr')
            ->join('siswa as s', 's.id', '=', 'fr.siswa_id')
            ->join('siswa_tahun as st', 'st.siswa_id', '=', 's.id')
            ->join('tahun_ajaran as ta', 'ta.id', '=', 'st.tahun_ajaran_id')
            ->where('fr.semester', $semester)
            ->where('fr.jenis_rapor', $jenisRapor)
            ->where('fr.tahun_ajaran', $tahunAjaran)
            ->where('st.rombel_id', $rombelId)
            ->where('ta.nama', $tahunAjaran)
            ->select('s.nama', 's.nis', 'fr.approval_status', 'fr.diajukan_at');

        $siswaBaru = DB::table('finalisasi_rapor as fr')
            ->join('siswas as s', 's.id', '=', 'fr.siswa_id')
            ->join('siswa_tahun as st', 'st.siswa_id', '=', 's.id')
            ->join('tahun_ajaran as ta', 'ta.id', '=', 'st.tahun_ajaran_id')
            ->where('fr.semester', $semester)
            ->where('fr.jenis_rapor', $jenisRapor)
            ->where('fr.tahun_ajaran', $tahunAjaran)
            ->where('st.rombel_id', $rombelId)
            ->where('ta.nama', $tahunAjaran)
            ->select('s.nama_user as nama', 's.nis', 'fr.approval_status', 'fr.diajukan_at');

        $data = $siswaExisting->union($siswaBaru)
            ->orderBy('nama', 'asc')
            ->get();

        return response()->json(['success' => true, 'data' => $data]);
    }
}