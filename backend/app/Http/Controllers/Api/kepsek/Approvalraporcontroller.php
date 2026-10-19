<?php

namespace App\Http\Controllers\Api\Kepsek;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ApprovalRaporController extends Controller
{
    // ================================================================
    // HELPER: ambil tahun_ajaran_id berdasarkan nama tahun ajaran
    // ================================================================
    private function getTahunAjaranIdByNama($tahunAjaran)
    {
        return DB::table('tahun_ajaran')
            ->where('nama', $tahunAjaran)
            ->value('id');
    }

    // ================================================================
    // GET /api/kepsek/rapor/list-approval
    // ================================================================
    public function listApproval(Request $request)
    {
        $request->validate([
            'semester'     => 'required|in:1,2',
            'jenis_rapor'  => 'required|in:PTS,PAS',
            'tahun_ajaran' => 'nullable|string',
        ]);

        $semester   = $request->semester;
        $jenisRapor = strtoupper($request->jenis_rapor);

        // Ambil tahun ajaran aktif jika tidak dikirim
        $tahunAjaran = $request->filled('tahun_ajaran')
            ? trim($request->tahun_ajaran)
            : DB::table('tahun_ajaran')->where('aktif', true)->value('nama');

        if (!$tahunAjaran) {
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran aktif tidak ditemukan.',
            ], 422);
        }

        $tahunAjaranId = $this->getTahunAjaranIdByNama($tahunAjaran);

        if (!$tahunAjaranId) {
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran tidak valid.',
            ], 422);
        }

        // Ambil semua rombel yang punya siswa di tahun ajaran ini
        $rombels = DB::table('rombel as r')
            ->join('siswa_tahun as st', 'st.rombel_id', '=', 'r.id')
            ->where('st.tahun_ajaran_id', $tahunAjaranId)
            ->select(
                'r.id as rombel_id',
                DB::raw("CONCAT(r.tingkat_kelas, ' ', r.sub_nama) as nama_kelas"),
                DB::raw("COUNT(DISTINCT st.siswa_id) as jumlah_siswa"),
                'r.guru_id'
            )
            ->groupBy('r.id', 'r.tingkat_kelas', 'r.sub_nama', 'r.guru_id')
            ->orderBy('r.tingkat_kelas')
            ->orderBy('r.sub_nama')
            ->get();

        $result = [];

        foreach ($rombels as $rombel) {

            // Ambil siswa dalam rombel ini
            $siswaIds = DB::table('siswa_tahun')
                ->where('rombel_id', $rombel->rombel_id)
                ->where('tahun_ajaran_id', $tahunAjaranId)
                ->pluck('siswa_id');

            $total = $siswaIds->count();

            // Hitung distribusi status approval rapor
            $statusRows = DB::table('finalisasi_rapor')
                ->whereIn('siswa_id', $siswaIds)
                ->where('semester', $semester)
                ->where('jenis_rapor', $jenisRapor)
                ->where('tahun_ajaran', $tahunAjaran)
                ->select('approval_status', DB::raw('COUNT(*) as jumlah'))
                ->groupBy('approval_status')
                ->pluck('jumlah', 'approval_status')
                ->toArray();

            $approved = $statusRows['approved'] ?? 0;
            $pending  = $statusRows['pending_approval'] ?? 0;
            $rejected = $statusRows['rejected'] ?? 0;

            // Tentukan status kelas
            if ($total > 0 && $approved === $total) {
                $statusKelas = 'approved';
            } elseif ($pending > 0) {
                $statusKelas = 'pending_approval';
            } elseif ($rejected > 0) {
                $statusKelas = 'rejected';
            } else {
                $statusKelas = 'draft';
            }

            // Nama guru wali kelas dari rombel.guru_id
            $guru = DB::table('users')
                ->where('id', $rombel->guru_id)
                ->select('name as nama_guru', 'nipy')
                ->first();

            // Tanggal pengajuan terakhir
            $diajukanAt = DB::table('finalisasi_rapor')
                ->whereIn('siswa_id', $siswaIds)
                ->where('semester', $semester)
                ->where('jenis_rapor', $jenisRapor)
                ->where('tahun_ajaran', $tahunAjaran)
                ->whereNotNull('diajukan_at')
                ->max('diajukan_at');

            // Alasan penolakan terakhir
            $rejectionReason = DB::table('finalisasi_rapor')
                ->whereIn('siswa_id', $siswaIds)
                ->where('semester', $semester)
                ->where('jenis_rapor', $jenisRapor)
                ->where('tahun_ajaran', $tahunAjaran)
                ->where('approval_status', 'rejected')
                ->whereNotNull('rejection_reason')
                ->value('rejection_reason');

            // List siswa detail (untuk preview tabel kepsek)
            $siswaDetail = DB::table('siswa as s')
                ->join('siswa_tahun as st', 'st.siswa_id', '=', 's.id')
                ->leftJoin('finalisasi_rapor as fr', function ($join) use ($semester, $jenisRapor, $tahunAjaran) {
                    $join->on('fr.siswa_id', '=', 's.id')
                        ->where('fr.semester', $semester)
                        ->where('fr.jenis_rapor', $jenisRapor)
                        ->where('fr.tahun_ajaran', $tahunAjaran);
                })
                ->where('st.rombel_id', $rombel->rombel_id)
                ->where('st.tahun_ajaran_id', $tahunAjaranId)
                ->select(
                    's.id as siswa_id',
                    's.nama',
                    's.nis',
                    'fr.catatan_wali_kelas',
                    'fr.approval_status'
                )
                ->orderBy('s.nama')
                ->get()
                ->map(function ($s) use ($semester, $tahunAjaran, $jenisRapor) {

                    // rata-rata nilai
                    $nilaiRows = DB::table('nilai_siswa')
                        ->where('siswa_id', $s->siswa_id)
                        ->where('semester', $semester)
                        ->where('tahun_ajaran', $tahunAjaran)
                        ->select('uh1','uh2','uh3','uh4','uh5','pts','pas')
                        ->get();

                    $nilaiAkhirAll = [];

                    foreach ($nilaiRows as $n) {

                        if ($jenisRapor === 'PTS') {
                            $na = $n->pts !== null ? round($n->pts) : null;
                        } else {
                            $uh = collect([$n->uh1,$n->uh2,$n->uh3,$n->uh4,$n->uh5])
                                ->filter(fn($v) => $v !== null);

                            $rUH = $uh->count() ? $uh->avg() : null;

                            $gabungan = collect([$rUH, $n->pts, $n->pas])
                                ->filter(fn($v) => $v !== null);

                            $na = $gabungan->count() ? round($gabungan->avg()) : null;
                        }

                        if ($na !== null) {
                            $nilaiAkhirAll[] = $na;
                        }
                    }

                    $rataRata = count($nilaiAkhirAll)
                        ? round(array_sum($nilaiAkhirAll) / count($nilaiAkhirAll), 1)
                        : null;

                    return [
                        'siswa_id'           => $s->siswa_id,
                        'nama'               => $s->nama,
                        'nis'                => $s->nis,
                        'rata_rata'          => $rataRata,
                        'catatan_wali_kelas' => $s->catatan_wali_kelas,
                        'approval_status'    => $s->approval_status ?? 'draft',
                    ];
                })
                ->toArray();

            $result[] = [
                'rombel_id'        => $rombel->rombel_id,
                'nama_kelas'       => $rombel->nama_kelas,
                'jumlah_siswa'     => $rombel->jumlah_siswa,
                'nama_guru'        => $guru?->nama_guru ?? 'Belum ada wali kelas',
                'nip_guru'         => $guru?->nipy ?? null,
                'approval_status'  => $statusKelas,
                'diajukan_at'      => $diajukanAt,
                'rejection_reason' => $rejectionReason,
                'siswa'            => $siswaDetail,
            ];
        }

        return response()->json([
            'success' => true,
            'data'    => $result,
        ]);
    }

    // ================================================================
    // POST /api/kepsek/rapor/approve
    // ================================================================
    public function approve(Request $request)
    {
        $request->validate([
            'rombel_id'    => 'required|integer',
            'semester'     => 'required|in:1,2',
            'jenis_rapor'  => 'required|in:PTS,PAS',
            'tahun_ajaran' => 'nullable|string',
        ]);

        $rombelId   = $request->rombel_id;
        $semester   = $request->semester;
        $jenisRapor = strtoupper($request->jenis_rapor);

        $tahunAjaran = $request->filled('tahun_ajaran')
            ? trim($request->tahun_ajaran)
            : DB::table('tahun_ajaran')->where('aktif', true)->value('nama');

        if (!$tahunAjaran) {
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran aktif tidak ditemukan.',
            ], 422);
        }

        $tahunAjaranId = $this->getTahunAjaranIdByNama($tahunAjaran);

        if (!$tahunAjaranId) {
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran tidak valid.',
            ], 422);
        }

        $kepsekId = auth()->id();

        $siswaIds = DB::table('siswa_tahun')
            ->where('rombel_id', $rombelId)
            ->where('tahun_ajaran_id', $tahunAjaranId)
            ->pluck('siswa_id');

        if ($siswaIds->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada siswa di kelas ini.',
            ], 422);
        }

        DB::beginTransaction();
        try {
            foreach ($siswaIds as $siswaId) {

                DB::table('finalisasi_rapor')->updateOrInsert(
                    [
                        'siswa_id'     => $siswaId,
                        'semester'     => $semester,
                        'jenis_rapor'  => $jenisRapor,
                        'tahun_ajaran' => $tahunAjaran,
                    ],
                    [
                        'approval_status'  => 'approved',
                        'rejection_reason' => null,
                        'disetujui_oleh'   => $kepsekId,
                        'disetujui_at'     => now(),
                        'finalisasi'       => true,
                        'updated_at'       => now(),
                        'created_at'       => now(),
                    ]
                );
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Gagal menyetujui rapor: ' . $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Rapor berhasil disetujui dan dikunci.',
        ]);
    }

    // ================================================================
    // POST /api/kepsek/rapor/reject
    // ================================================================
    public function reject(Request $request)
    {
        $request->validate([
            'rombel_id'        => 'required|integer',
            'semester'         => 'required|in:1,2',
            'jenis_rapor'      => 'required|in:PTS,PAS',
            'rejection_reason' => 'required|string|max:500',
            'tahun_ajaran'     => 'nullable|string',
        ]);

        $rombelId        = $request->rombel_id;
        $semester        = $request->semester;
        $jenisRapor      = strtoupper($request->jenis_rapor);
        $rejectionReason = $request->rejection_reason;

        $tahunAjaran = $request->filled('tahun_ajaran')
            ? trim($request->tahun_ajaran)
            : DB::table('tahun_ajaran')->where('aktif', true)->value('nama');

        if (!$tahunAjaran) {
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran aktif tidak ditemukan.',
            ], 422);
        }

        $tahunAjaranId = $this->getTahunAjaranIdByNama($tahunAjaran);

        if (!$tahunAjaranId) {
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran tidak valid.',
            ], 422);
        }

        $siswaIds = DB::table('siswa_tahun')
            ->where('rombel_id', $rombelId)
            ->where('tahun_ajaran_id', $tahunAjaranId)
            ->pluck('siswa_id');

        if ($siswaIds->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada siswa di kelas ini.',
            ], 422);
        }

        DB::beginTransaction();
        try {
            foreach ($siswaIds as $siswaId) {

                DB::table('finalisasi_rapor')->updateOrInsert(
                    [
                        'siswa_id'     => $siswaId,
                        'semester'     => $semester,
                        'jenis_rapor'  => $jenisRapor,
                        'tahun_ajaran' => $tahunAjaran,
                    ],
                    [
                        'approval_status'  => 'rejected',
                        'rejection_reason' => $rejectionReason,
                        'finalisasi'       => false,
                        'updated_at'       => now(),
                        'created_at'       => now(),
                    ]
                );
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Gagal menolak rapor: ' . $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Rapor ditolak. Guru dapat melakukan revisi.',
        ]);
    }
}