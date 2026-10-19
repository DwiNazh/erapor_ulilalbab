<?php

namespace App\Http\Controllers\Api\gurusd;

use App\Http\Controllers\Controller;
use App\Models\Ekstrakurikuler;
use App\Models\Rombel;
use App\Models\Siswa;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class NilaiEkstraKurikulerController extends Controller
{
    // ============================================================
    // HELPER BARU: ambil rombel guru sesuai tahun ajaran tertentu
    // ============================================================
    private function getRombelGuru($guruId, $tahunAjaranId)
    {
        return Rombel::where('guru_id', $guruId)
            ->where('tahun_ajaran_id', $tahunAjaranId)
            ->first();
    }

    /**
     * GET /api/guru/ekstrakurikuler
     * query: semester, tahun_ajaran_id (opsional, fallback ke tahun aktif)
     */
    public function index(Request $request)
    {
        try {
            $semester = $request->query('semester', '1');
            $tahunAjaranId = $request->query('tahun_ajaran_id');

            $user = Auth::user();

            // ===== FIX: tahun ajaran tidak dikunci aktif =====
            if ($tahunAjaranId) {
                $tahun = TahunAjaran::find($tahunAjaranId);
            } else {
                $tahun = TahunAjaran::where('aktif', 1)->first();
            }

            if (!$tahun) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tahun ajaran tidak ditemukan.'
                ], 404);
            }

            $tahunAjaranNama = trim($tahun->nama);

            // ===== FIX: rombel diambil sesuai tahun ajaran yang dipilih =====
            $rombel = $this->getRombelGuru($user->id, $tahun->id);

            if (!$rombel) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda belum ditugaskan sebagai wali kelas di rombel manapun pada tahun ajaran ini.'
                ], 403);
            }

            // Ambil daftar master ekskul
            $ekskulList = Ekstrakurikuler::orderByRaw('wajib DESC, nama ASC')->get(['id', 'nama', 'wajib']);

            // Query siswa dengan filter pivot Semester & Tahun Ajaran
            $siswa = Siswa::whereHas('siswaTahun', function ($q) use ($rombel, $tahun) {
                    $q->where('rombel_id', $rombel->id)
                      ->where('tahun_ajaran_id', $tahun->id);
                })
                ->with(['ekstrakurikuler' => function ($q) use ($semester, $tahunAjaranNama) {
                    $q->wherePivot('semester', $semester);
                    $q->wherePivot('tahun_ajaran', $tahunAjaranNama);
                    $q->withPivot('nilai', 'deskripsi', 'tahun_ajaran');
                }])
                ->get(['id', 'nama', 'nis']);

            $siswaFormatted = $siswa->map(function ($s) {
                return [
                    'id'     => $s->id,
                    'nama'   => $s->nama,
                    'nis'    => $s->nis ?? '—',
                    'ekskul' => $s->ekstrakurikuler->map(fn($e) => [
                        'id'        => $e->id,
                        'nama'      => $e->nama,
                        'nilai'     => $e->pivot->nilai ?? '',
                        'deskripsi' => $e->pivot->deskripsi ?? '',
                        'tahun_ajaran' => $e->pivot->tahun_ajaran ?? '',
                    ])->toArray(),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'ekskul_list'     => $ekskulList,
                    'siswa'           => $siswaFormatted,
                    'rombel'          => $rombel,
                    'tahun_ajaran'    => $tahunAjaranNama,
                    'tahun_ajaran_id' => $tahun->id,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error Ekstrakurikuler Index: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Server Error'], 500);
        }
    }

    /**
     * POST /api/guru/ekstrakurikuler/save-bulk
     */
    public function saveBulk(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'semester'     => 'required|in:1,2',
            'tahun_ajaran' => 'required|string|max:20',
            'siswa'        => 'required|array|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $user = Auth::user();

        // ===== FIX: validasi rombel sesuai tahun ajaran yang dikirim, bukan rombel asal =====
        $tahun = TahunAjaran::where('nama', trim($request->tahun_ajaran))->first();
        if (!$tahun) {
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran tidak ditemukan.'
            ], 404);
        }

        $rombel = $this->getRombelGuru($user->id, $tahun->id);
        if (!$rombel) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak ditugaskan sebagai wali kelas pada tahun ajaran ini.'
            ], 403);
        }

        try {
            DB::beginTransaction();
            $semester = $request->semester;
            $tahunAjaran = $request->tahun_ajaran;

            foreach ($request->siswa as $dataSiswa) {
                $siswa = Siswa::findOrFail($dataSiswa['id']);

                $ekskulSyncData = [];
                foreach ($dataSiswa['ekskul'] ?? [] as $item) {
                    $ekskul = Ekstrakurikuler::where('nama', $item['nama'])->first();
                    if ($ekskul) {
                        $ekskulSyncData[$ekskul->id] = [
                            'nilai'        => $item['nilai'] ?? null,
                            'deskripsi'    => $item['deskripsi'] ?? null,
                            'semester'     => $semester,
                            'tahun_ajaran' => $tahunAjaran,
                        ];
                    }
                }

                $siswa->ekstrakurikuler()
                      ->wherePivot('semester', $semester)
                      ->wherePivot('tahun_ajaran', $tahunAjaran)
                      ->detach();

                $siswa->ekstrakurikuler()->attach($ekskulSyncData);
            }

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Data berhasil disimpan']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * POST /api/guru/ekstrakurikuler
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama'  => 'required|string|unique:ekstrakurikuler,nama',
            'wajib' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $ekskul = Ekstrakurikuler::create([
            'nama' => trim($request->nama),
            'wajib' => $request->input('wajib', false),
        ]);

        return response()->json(['success' => true, 'data' => $ekskul]);
    }
}