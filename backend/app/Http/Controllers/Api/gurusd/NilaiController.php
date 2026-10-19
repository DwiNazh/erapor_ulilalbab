<?php

namespace App\Http\Controllers\Api\gurusd;

use App\Http\Controllers\Controller;
use App\Models\NilaiSiswa;
use App\Models\TahunAjaran;
use App\Models\TemplateDeskripsiIntrakurikuler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class NilaiController extends Controller
{
    // ============================================================
    // HELPER: Hitung Rata-rata UH
    // ============================================================
    private function hitungRataUH($nilai)
    {
        $uh = array_slice($nilai, 0, 5);

        $angka = [];
        foreach ($uh as $v) {
            if ($v !== null && $v !== '' && is_numeric($v)) {
                $angka[] = (float)$v;
            }
        }

        if (count($angka) == 0) return null;

        return round(array_sum($angka) / count($angka));
    }

    // ============================================================
    // HELPER: Hitung Nilai Raport
    // Rumus: (Rata UH × 0.4) + (PTS × 0.3) + (PAS × 0.3)
    // ============================================================
    private function hitungNilaiRaport($uh1, $uh2, $uh3, $uh4, $uh5, $pts, $pas)
    {
        $nilaiArr = [$uh1, $uh2, $uh3, $uh4, $uh5, $pts, $pas];

        $rataUH = $this->hitungRataUH($nilaiArr);

        $ptsVal = is_numeric($pts) ? (float)$pts : 0;
        $pasVal = is_numeric($pas) ? (float)$pas : 0;

        if ($rataUH === null && $ptsVal == 0 && $pasVal == 0) {
            return null;
        }

        return round(($rataUH * 0.4) + ($ptsVal * 0.3) + ($pasVal * 0.3));
    }

    // ============================================================
    // HELPER: Ambil Deskripsi dari Template Intrakurikuler
    // ============================================================
    private function getDeskripsiIntrakurikuler($guru_id, $nilaiRapor)
    {
        if (!$nilaiRapor || !is_numeric($nilaiRapor)) return "—";

        $template = TemplateDeskripsiIntrakurikuler::where('guru_id', $guru_id)
            ->where('min_nilai', '<=', $nilaiRapor)
            ->where('max_nilai', '>=', $nilaiRapor)
            ->first();

        return $template ? $template->deskripsi : "—";
    }

    // ============================================================
    // GET Tahun Ajaran Aktif
    // ============================================================
    public function getTahunAjaranAktif()
    {
        try {
            $tahun = TahunAjaran::where('aktif', 1)->first();

            if (!$tahun) {
                return response()->json([
                    'success' => false,
                    'message' => 'Belum ada tahun ajaran aktif'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data'    => $tahun
            ]);
        } catch (\Exception $e) {
            Log::error('Error getTahunAjaranAktif: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat tahun ajaran aktif'
            ], 500);
        }
    }

    // ============================================================
    // GET /api/guru/penugasan-rombel/{rombel_id}
    // ============================================================
public function getPenugasanByRombel($rombel_id)
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

        // CATATAN: tidak lagi filter guru_id = Auth::id()
        // karena mode "Guru Bidang" dipakai WALI KELAS untuk memantau
        // SEMUA mapel (terutama yang diajar guru lain) di kelasnya sendiri,
        // bukan hanya mapel yang diajar oleh dirinya sendiri.
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
                    'mapel_id'  => $p->mapel_id,
                    'guru_id'   => $p->guru_id, // dikirim juga, untuk ditampilkan "diajar oleh siapa" kalau perlu
                    'mapel'     => [
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
        Log::error('Error getPenugasanByRombel', ['message' => $e->getMessage()]);
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
}

    // ============================================================
    // GET /api/guru/nilai/{mapel_id}/{semester}/{tahun_ajaran}
    // ============================================================
    public function index($mapel_id, $semester, $tahun_ajaran)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'guru') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $rombel = $user->rombels()->first();
            if (!$rombel) {
                return response()->json(['success' => false, 'message' => 'Tidak ada rombel'], 404);
            }

            $tahun_ajaran = trim($tahun_ajaran);

            /**
             * 1. Teknik UNION ID Siswa: Ambil semua ID siswa aktif di rombel ini,
             * baik dari tabel siswa (lama) maupun siswas (baru)
             */
            $siswaExistingQuery = DB::table('siswa_tahun')
                ->join('siswa', 'siswa.id', '=', 'siswa_tahun.siswa_id')
                ->where('siswa_tahun.rombel_id', $rombel->id)
                ->select('siswa.id');

            $siswaBaruQuery = DB::table('siswa_tahun')
                ->join('siswas', 'siswas.id', '=', 'siswa_tahun.siswa_id')
                ->where('siswa_tahun.rombel_id', $rombel->id)
                ->select('siswas.id');

            $siswaIds = $siswaExistingQuery->union($siswaBaruQuery)
                ->pluck('id')
                ->toArray();

            /**
             * 2. Ambil nilai akademik eksisting untuk daftar ID tersebut
             */
            $nilai = NilaiSiswa::where('mapel_id', $mapel_id)
                ->where('semester', $semester)
                ->where('tahun_ajaran', $tahun_ajaran)
                ->where('guru_id', $user->id)
                ->whereIn('siswa_id', $siswaIds)
                ->get()
                ->keyBy('siswa_id');

            /**
             * 3. Teknik UNION Profil Lengkap: Ambil nama dan nis dari kedua tabel,
             * lalu satukan dan urutkan secara alfabetis (A-Z)
             */
            $profilExisting = DB::table('siswa_tahun')
                ->join('siswa', 'siswa.id', '=', 'siswa_tahun.siswa_id')
                ->where('siswa_tahun.rombel_id', $rombel->id)
                ->select('siswa.id as siswa_id', 'siswa.nama', 'siswa.nis');

            $profilBaru = DB::table('siswa_tahun')
                ->join('siswas', 'siswas.id', '=', 'siswa_tahun.siswa_id')
                ->where('siswa_tahun.rombel_id', $rombel->id)
                ->select('siswas.id as siswa_id', 'siswas.nama_user as nama', 'siswas.nis');

            $siswaList = $profilExisting->union($profilBaru)
                ->orderBy('nama', 'asc')
                ->get();

            /**
             * 4. Pemetaan Akhir Data Nilai + Profil untuk dikirim ke Frontend
             */
            $result = $siswaList->map(function ($s) use ($nilai, $user) {
                $n = $nilai->get($s->siswa_id);

                $nilaiRapor = $n ? $this->hitungNilaiRaport(
                    $n->uh1, $n->uh2, $n->uh3, $n->uh4, $n->uh5,
                    $n->pts, $n->pas
                ) : null;

                return [
                    'siswa_id'    => $s->siswa_id,
                    'nama'        => $s->nama ?? 'Nama tidak ditemukan',
                    'nis'         => $s->nis ?? '—',
                    'nilai'       => [
                        $n->uh1 ?? '',
                        $n->uh2 ?? '',
                        $n->uh3 ?? '',
                        $n->uh4 ?? '',
                        $n->uh5 ?? '',
                        $n->pts ?? '',
                        $n->pas ?? '',
                    ],
                    'nilai_rapor' => $nilaiRapor,
                    'deskripsi'   => $this->getDeskripsiIntrakurikuler($user->id, $nilaiRapor),
                ];
            });

            return response()->json(['success' => true, 'data' => $result]);
        } catch (\Exception $e) {
            Log::error('Error NilaiController@index: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // ============================================================
    // GET /api/guru/nilai/per-mapel/{mapel_id}
    // query: semester, tahun_ajaran, rombel_id
    // ============================================================
    public function indexPerMapel(Request $request, $mapel_id)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'guru') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $semester     = $request->query('semester', '1');
            $tahun_ajaran = trim($request->query('tahun_ajaran', ''));
            $rombel_id    = $request->query('rombel_id');
            $mode         = $request->query('mode', 'guruKelas');

            if (empty($tahun_ajaran) || empty($rombel_id)) {
                return response()->json(['success' => true, 'data' => []]);
            }

            $query = NilaiSiswa::where('mapel_id', $mapel_id)
                ->where('semester', $semester)
                ->where('tahun_ajaran', $tahun_ajaran)
                ->whereHas('siswa.siswaTahun', function ($q) use ($rombel_id) {
                    $q->where('rombel_id', $rombel_id);
                });

            if ($mode === 'guruKelas') {
                $query->where('guru_id', $user->id);
            }

            $nilaiExisting = $query->get();

            $result = $nilaiExisting->map(function ($nilai) use ($user) {
                $nilaiRapor = $this->hitungNilaiRaport(
                    $nilai->uh1, $nilai->uh2, $nilai->uh3, $nilai->uh4, $nilai->uh5,
                    $nilai->pts, $nilai->pas
                );

                return [
                    'siswa_id'    => $nilai->siswa_id,
                    'nilai'       => [
                        $nilai->uh1 ?? '',
                        $nilai->uh2 ?? '',
                        $nilai->uh3 ?? '',
                        $nilai->uh4 ?? '',
                        $nilai->uh5 ?? '',
                        $nilai->pts ?? '',
                        $nilai->pas ?? '',
                    ],
                    'nilai_rapor' => $nilaiRapor,
                    'deskripsi'   => $this->getDeskripsiIntrakurikuler($user->id, $nilaiRapor),
                ];
            });

            return response()->json(['success' => true, 'data' => $result]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // ============================================================
    // POST /api/guru/nilai
    // ============================================================
    public function storeBulk(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'mapel_id'         => 'required|exists:mapel,id',
                'semester'         => 'required|in:1,2',
                'tahun_ajaran'     => 'required|string|max:20',
                'nilai'            => 'required|array|min:1',
                'nilai.*.siswa_id' => 'required|integer',
                'nilai.*.uh1'      => 'nullable|numeric|min:0|max:100',
                'nilai.*.uh2'      => 'nullable|numeric|min:0|max:100',
                'nilai.*.uh3'      => 'nullable|numeric|min:0|max:100',
                'nilai.*.uh4'      => 'nullable|numeric|min:0|max:100',
                'nilai.*.uh5'      => 'nullable|numeric|min:0|max:100',
                'nilai.*.pts'      => 'nullable|numeric|min:0|max:100',
                'nilai.*.pas'      => 'nullable|numeric|min:0|max:100',
            ]);

            if ($validator->fails()) {
                Log::warning('storeBulk validasi gagal', ['errors' => $validator->errors()]);
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors'  => $validator->errors()
                ], 422);
            }

            $user = Auth::user();
            if (!$user || $user->role !== 'guru') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            // Cek penugasan rombel
            $penugasan = DB::table('penugasan_guru')
                ->where('guru_id', $user->id)
                ->where('mapel_id', $request->mapel_id)
                ->first();

            if (!$penugasan) {
                $rombelGuru = $user->rombels()->first();
                if (!$rombelGuru) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Anda tidak memiliki penugasan untuk mapel ini'
                    ], 403);
                }
                $rombelId = $rombelGuru->id;
            } else {
                $rombelId = $penugasan->rombel_id;
            }

            // Validasi ID siswa harus terdaftar di siswa_tahun pada rombel ini
            $siswaIdsValid = DB::table('siswa_tahun')
                ->where('rombel_id', $rombelId)
                ->pluck('siswa_id')
                ->toArray();

            $disimpan = 0;
            $dilewati = 0;

            foreach ($request->nilai as $item) {
                $adaNilai = !empty($item['uh1']) || !empty($item['uh2']) ||
                            !empty($item['uh3']) || !empty($item['uh4']) ||
                            !empty($item['uh5']) || !empty($item['pts']) ||
                            !empty($item['pas']);

                if (!$adaNilai) {
                    $dilewati++;
                    continue;
                }

                if (!empty($siswaIdsValid) && !in_array($item['siswa_id'], $siswaIdsValid)) {
                    Log::warning('Siswa tidak di rombel', [
                        'siswa_id'  => $item['siswa_id'],
                        'rombel_id' => $rombelId,
                    ]);
                    continue;
                }

                NilaiSiswa::updateOrCreate(
                    [
                        'siswa_id'     => $item['siswa_id'],
                        'mapel_id'     => $request->mapel_id,
                        'semester'     => $request->semester,
                        'tahun_ajaran' => $request->tahun_ajaran,
                        'guru_id'      => $user->id,
                    ],
                    [
                        'uh1' => isset($item['uh1']) && $item['uh1'] !== '' ? $item['uh1'] : null,
                        'uh2' => isset($item['uh2']) && $item['uh2'] !== '' ? $item['uh2'] : null,
                        'uh3' => isset($item['uh3']) && $item['uh3'] !== '' ? $item['uh3'] : null,
                        'uh4' => isset($item['uh4']) && $item['uh4'] !== '' ? $item['uh4'] : null,
                        'uh5' => isset($item['uh5']) && $item['uh5'] !== '' ? $item['uh5'] : null,
                        'pts' => isset($item['pts']) && $item['pts'] !== '' ? $item['pts'] : null,
                        'pas' => isset($item['pas']) && $item['pas'] !== '' ? $item['pas'] : null,
                    ]
                );

                $disimpan++;
            }

            return response()->json([
                'success' => true,
                'message' => "Nilai berhasil disimpan ($disimpan siswa, $dilewati dilewati karena kosong)"
            ]);

        } catch (\Exception $e) {
            Log::error('Error storeBulk: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}