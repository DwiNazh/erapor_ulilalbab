<?php

namespace App\Http\Controllers\Api\gurusd;

use App\Http\Controllers\Controller;
use App\Models\NilaiKokurikuler;
use App\Models\Rombel;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class NilaiKoKurikulerController extends Controller
{
    public function getAspek(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'Mutabaah Yaumiyah',
                'Bina Pribadi Islam',
                'Literasi',
                'PJBL',
            ]
        ]);
    }

    // ============================================================
    // HELPER BARU: ambil rombel guru sesuai tahun ajaran tertentu
    // (bukan asal first() yang bisa kena rombel tahun lalu)
    // ============================================================
    private function getRombelGuru($guruId, $tahunAjaranId)
    {
        return Rombel::where('guru_id', $guruId)
            ->where('tahun_ajaran_id', $tahunAjaranId)
            ->first();
    }

    /**
     * GET /api/guru/nilai-kokurikuler/{semester}
     * query opsional: tahun_ajaran_id (fallback ke tahun aktif)
     */
    public function index(Request $request, $semester): JsonResponse
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'guru') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        // ===== FIX: tahun ajaran sekarang bisa dipilih, bukan dikunci aktif =====
        $tahunAjaranId = $request->query('tahun_ajaran_id');

        if ($tahunAjaranId) {
            $tahun = TahunAjaran::find($tahunAjaranId);
        } else {
            $tahun = TahunAjaran::where('aktif', 1)->first();
        }

        if (!$tahun) {
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran tidak ditemukan.',
            ], 404);
        }

        $tahun_ajaran = trim($tahun->nama);

        // ===== FIX: rombel diambil sesuai tahun ajaran yang dipilih =====
        $rombel = $this->getRombelGuru($user->id, $tahun->id);
        if (!$rombel) {
            return response()->json([
                'success' => false,
                'message' => 'Guru belum ditugaskan di rombel manapun pada tahun ajaran ini.',
            ], 404);
        }

        // Gabung siswa lama & baru via UNION
        $siswaExistingQuery = DB::table('siswa_tahun')
            ->join('siswa', 'siswa.id', '=', 'siswa_tahun.siswa_id')
            ->where('siswa_tahun.rombel_id', $rombel->id)
            ->where('siswa_tahun.tahun_ajaran_id', $tahun->id)
            ->select('siswa.id', 'siswa.nama', 'siswa.nis');

        $siswaBaruQuery = DB::table('siswa_tahun')
            ->join('siswas', 'siswas.id', '=', 'siswa_tahun.siswa_id')
            ->where('siswa_tahun.rombel_id', $rombel->id)
            ->where('siswa_tahun.tahun_ajaran_id', $tahun->id)
            ->select('siswas.id', 'siswas.nama_user as nama', 'siswas.nis');

        $siswaList = $siswaExistingQuery->union($siswaBaruQuery)
            ->orderBy('nama', 'asc')
            ->get();

        $nilaiList = NilaiKokurikuler::whereIn('siswa_id', $siswaList->pluck('id'))
            ->where('semester', (string) $semester)
            ->where(function ($query) use ($tahun_ajaran) {
                $query->where('tahun_ajaran', $tahun_ajaran)
                      ->orWhere('tahun_ajaran', str_replace('/', '\/', $tahun_ajaran));
            })
            ->get()
            ->keyBy('siswa_id');

        $data = $siswaList->map(function ($siswa) use ($nilaiList) {
            $nilai = $nilaiList->get($siswa->id);

            $mingguan = [];
            if ($nilai) {
                $raw = $nilai->nilai_mingguan_mutabaah;
                if (is_array($raw)) {
                    $mingguan = $raw;
                } elseif (is_string($raw) && $raw !== '') {
                    $mingguan = json_decode($raw, true) ?? [];
                }
            }
            if (empty($mingguan)) $mingguan = [""];

            return [
                'siswa_id'     => $siswa->id,
                'nama'         => $siswa->nama,
                'nis'          => $siswa->nis ?? '—',
                'semester'     => $nilai->semester ?? null,
                'tahun_ajaran' => $nilai->tahun_ajaran ?? null,

                'mutabaah_yaumiyah'  => $nilai->mutabaah_yaumiyah  ?? null,
                'bina_pribadi_islam' => $nilai->bina_pribadi_islam  ?? null,
                'literasi'           => $nilai->literasi            ?? null,
                'pjbl'               => $nilai->pjbl                ?? null,

                'nilai' => [
                    $nilai->mutabaah_yaumiyah  ?? "",
                    $nilai->bina_pribadi_islam ?? "",
                    $nilai->literasi           ?? "",
                    $nilai->pjbl               ?? "",
                ],

                'nilai_mingguan_mutabaah' => $mingguan,

                'deskripsi_aspek' => is_array($nilai->deskripsi_aspek ?? null)
                    ? $nilai->deskripsi_aspek
                    : (is_string($nilai->deskripsi_aspek ?? null)
                        ? json_decode($nilai->deskripsi_aspek, true)
                        : ["", "", "", ""]),
            ];
        });

        $semesterString = ($semester == "1") ? "ganjil" : "genap";
        $pjblData = DB::table('pjbl_judul')
            ->where('rombel_id', $rombel->id)
            ->where('semester', $semesterString)
            ->first();

        return response()->json([
            'success'            => true,
            'message'            => 'Data nilai ko-kurikuler berhasil diambil',
            'tahun_ajaran_aktif' => $tahun_ajaran,
            'tahun_ajaran_id'    => $tahun->id,
            'rombel_id'          => $rombel->id,
            'rombel_nama'        => $rombel->nama ?? $rombel->nama_kelas,
            'jumlah_siswa'       => $siswaList->count(),
            'pjbl_judul'         => $pjblData?->judul ?? null,
            'data'               => $data,
        ]);
    }

    /**
     * POST /api/guru/nilai-kokurikuler/bulk
     */
    public function storeBulk(Request $request): JsonResponse
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'guru') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'semester'                          => 'required|in:1,2',
            'tahun_ajaran'                      => 'required|string',
            'nilai'                             => 'required|array',
            'nilai.*.siswa_id'                  => 'required|integer',
            'nilai.*.mutabaah_yaumiyah'         => 'nullable|numeric|between:1,4',
            'nilai.*.bina_pribadi_islam'         => 'nullable|in:A,B,C,D,E',
            'nilai.*.literasi'                  => 'nullable|in:A,B,C,D,E',
            'nilai.*.pjbl'                      => 'nullable|in:A,B,C,D,E',
            'nilai.*.deskripsi_aspek'           => 'nullable|array',
            'nilai.*.nilai_mingguan_mutabaah'   => 'nullable|array',
            'nilai.*.nilai_mingguan_mutabaah.*' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors(),
            ], 422);
        }

        // ===== FIX: cari tahun ajaran & rombel berdasarkan nama yang dikirim =====
        $tahun = TahunAjaran::where('nama', trim($request->tahun_ajaran))->first();
        if (!$tahun) {
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran tidak ditemukan.',
            ], 404);
        }

        $rombel = $this->getRombelGuru($user->id, $tahun->id);
        if (!$rombel) {
            return response()->json([
                'success' => false,
                'message' => 'Rombel tidak ditemukan untuk tahun ajaran ini.'
            ], 404);
        }

        $allowedSiswaIds = DB::table('siswa_tahun')
            ->where('rombel_id', $rombel->id)
            ->where('tahun_ajaran_id', $tahun->id)
            ->pluck('siswa_id')
            ->toArray();

        DB::beginTransaction();
        try {
            foreach ($request->nilai as $row) {
                if (!in_array($row['siswa_id'], $allowedSiswaIds)) {
                    continue;
                }

                NilaiKokurikuler::updateOrCreate(
                    [
                        'siswa_id'     => $row['siswa_id'],
                        'semester'     => $request->semester,
                        'tahun_ajaran' => $request->tahun_ajaran,
                    ],
                    [
                        'mutabaah_yaumiyah'  => isset($row['mutabaah_yaumiyah']) && $row['mutabaah_yaumiyah'] !== ''
                            ? $row['mutabaah_yaumiyah']
                            : null,
                        'bina_pribadi_islam' => $row['bina_pribadi_islam'] ?? null,
                        'literasi'           => $row['literasi']           ?? null,
                        'pjbl'               => $row['pjbl']               ?? null,
                        'deskripsi_aspek'    => is_array($row['deskripsi_aspek'] ?? null)
                            ? $row['deskripsi_aspek']
                            : ["", "", "", ""],
                        'nilai_mingguan_mutabaah' => $row['nilai_mingguan_mutabaah'] ?? [],
                    ]
                );
            }

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Nilai ko-kurikuler berhasil disimpan.',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan nilai',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}