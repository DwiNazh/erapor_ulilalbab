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

class KenaikanKelasController extends Controller
{
    public function tahunAjaranAktif()
    {
        $tahun = TahunAjaran::where('aktif', 1)->first();

        if (!$tahun) {
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran aktif tidak ditemukan',
                'data' => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Tahun ajaran aktif ditemukan',
            'data' => $tahun
        ]);
    }

    public function siswaPerKelas(Request $request)
    {
        $tahunAktif = TahunAjaran::where('aktif', 1)->first();

        if (!$tahunAktif) {
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran aktif tidak ditemukan',
                'data' => []
            ], 404);
        }

        $user = $request->user();
        $ids = $user ? $user->jenjangIds() : null;
        $range = $user ? $user->kelasRange() : ['min' => 1, 'max' => 6];

        $siswa = SiswaTahun::with(['siswa', 'rombel'])
            ->where('tahun_ajaran_id', $tahunAktif->id)
            ->whereHas('rombel', function ($q) use ($ids, $range) {
                if ($ids !== null) {
                    $q->whereIn('jenjang_id', $ids);
                } else {
                    $q->whereBetween('tingkat_kelas', [$range['min'], $range['max']]);
                }
            })
            ->get()
            ->groupBy('rombel.tingkat_kelas')
            ->map(function ($group) {
                return $group->map(fn($st) => [
                    'id' => $st->siswa?->id,
                    'nama' => $st->siswa?->nama ?? 'Nama tidak ditemukan',
                ])->values();
            });

        return response()->json([
            'success' => true,
            'message' => 'Data siswa per kelas berhasil dimuat',
            'data' => $siswa
        ]);
    }

    /**
     * Mengambil daftar siswa untuk proses kenaikan kelas / promosi
     * Mengembalikan siswa yang aktif di tahun berjalan (dari siswa_tahun atau fallback ke master siswa)
     */
    public function dataSiswa(Request $request)
    {
        try {
            $tahunAktif = TahunAjaran::where('aktif', 1)->first();

            if (!$tahunAktif) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tahun ajaran aktif tidak ditemukan',
                    'data' => []
                ], 404);
            }

            $user = $request->user();
            $ids = $user ? $user->jenjangIds() : null;
            $range = $user ? $user->kelasRange() : ['min' => 1, 'max' => 6];

            // 🔥 ambil siswa_tahun + rombel sesuai jenjang
            $siswaTahun = SiswaTahun::with(['siswa', 'rombel'])
                ->where('tahun_ajaran_id', $tahunAktif->id)
                ->where('is_processed', 0)
                ->whereHas('rombel', function ($q) use ($ids, $range) {
                    if ($ids !== null) {
                        $q->whereIn('jenjang_id', $ids);
                    } else {
                        $q->whereBetween('tingkat_kelas', [$range['min'], $range['max']]);
                    }
                })
                ->get();

            // 🔥 kalau kosong fallback ke master siswa
            if ($siswaTahun->isEmpty()) {
                Log::info("Fallback ke tabel siswa");

                $siswa = Siswa::where('status', 'aktif')
                    ->whereBetween('kelas', [$range['min'], $range['max']])
                    ->get()
                    ->map(function ($s) use ($tahunAktif) {
                        return [
                            'id' => $s->id,
                            'siswa_id' => $s->id,
                            'nama' => $s->nama,
                            'nis' => $s->nis,
                            'nisn' => $s->nisn,
                            'kelas' => $s->kelas,
                            'tingkat_kelas' => $s->kelas,
                            'tahun_ajaran' => $tahunAktif->nama,
                            'is_processed' => 0,
                        ];
                    });

                return response()->json([
                    'success' => true,
                    'message' => 'Data siswa (fallback)',
                    'data' => $siswa
                ]);
            }

            // 🔥 mapping dari siswa_tahun
            $data = $siswaTahun->map(function ($item) use ($tahunAktif) {

                return [
                    'id' => $item->siswa?->id,
                    'siswa_id' => $item->siswa?->id,
                    'nama' => $item->siswa?->nama,
                    'nis' => $item->siswa?->nis,
                    'nisn' => $item->siswa?->nisn,

                    // 🔥 INI FIX UTAMA
                    'kelas' => $item->rombel?->tingkat_kelas ?? 0,
                    'tingkat_kelas' => $item->rombel?->tingkat_kelas ?? 0,

                    'tahun_ajaran' => $tahunAktif->nama,
                    'is_processed' => $item->is_processed,
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Data siswa berhasil dimuat',
                'data' => $data
            ]);

        } catch (\Exception $e) {
            Log::error("Error dataSiswa: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data siswa'
            ], 500);
        }
    }

    public function promosi(Request $request)
    {
        Log::info('=== PROMOSI REQUEST DITERIMA ===', $request->all());

        $validated = $request->validate([
            'naik' => 'nullable|array',
            'naik.*.id' => 'required|integer|exists:siswa,id',
            'tinggal' => 'nullable|array',
            'tinggal.*.id' => 'required_with:tinggal|integer|exists:siswa,id',
            'lulus' => 'nullable|array',
            'lulus.*.id' => 'required_with:lulus|integer|exists:siswa,id',
            'tahun_ajaran_target_id' => 'required|integer|exists:tahun_ajaran,id',
        ]);

        $tahunTargetId = $validated['tahun_ajaran_target_id'];
        $naik = $validated['naik'] ?? [];
        $tinggal = $validated['tinggal'] ?? [];
        $lulus = $validated['lulus'] ?? [];
        $perluKategori = [];

        $tahunAktif = TahunAjaran::where('aktif', 1)->first();
        if (!$tahunAktif) {
            return response()->json(['success' => false, 'message' => 'Tahun ajaran aktif tidak ditemukan'], 422);
        }

        $user = $request->user();
        if ($user && !$user->isSuperadmin()) {
            $range = $user->kelasRange();
            $allIds = collect($naik)->pluck('id')
                ->merge(collect($tinggal)->pluck('id'))
                ->merge(collect($lulus)->pluck('id'))
                ->unique();

            $adaDiLuarJenjang = Siswa::whereIn('id', $allIds)
                ->where(function ($q) use ($range) {
                    $q->where('kelas', '<', $range['min'])
                        ->orWhere('kelas', '>', $range['max']);
                })->exists();

            if ($adaDiLuarJenjang) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ada siswa di luar jenjang sekolah Anda yang coba diproses.'
                ], 403);
            }
        }

        DB::beginTransaction();
        try {
            $diproses = 0;

            // ====================== NAIK KELAS (1-5) ======================
            foreach ($naik as $item) {
                $siswaId = $item['id'];

                // Ambil data siswa saat ini untuk mengetahui kelasnya
                $current = SiswaTahun::where('siswa_id', $siswaId)
                    ->where('tahun_ajaran_id', $tahunAktif->id)
                    ->first();

                $kelasSekarang = $current?->rombel?->tingkat_kelas ?? $current?->tingkat_kelas ?? 0;
                $kelasBaru = $kelasSekarang + 1;

                if (
                    SiswaTahun::where('siswa_id', $siswaId)
                        ->where('tahun_ajaran_id', $tahunTargetId)->exists()
                ) {
                    continue;
                }

                SiswaTahun::create([
                    'siswa_id' => $siswaId,
                    'tahun_ajaran_id' => $tahunTargetId,
                    'rombel_id' => null,
                    'tingkat_kelas' => $kelasBaru,           // ← Penting!
                    'status' => 'AKTIF',
                    'is_processed' => 1,
                ]);

                if ($kelasBaru >= RombelController::TINGKAT_MULAI_PISAH_GENDER) {
                    $perluKategori[] = $siswaId;
                }

                if ($kelasSekarang >= RombelController::TINGKAT_MULAI_PISAH_GENDER) {
                    $perluKategori[] = $siswaId;
                }

                // Tandai sudah diproses di tahun aktif
                SiswaTahun::where('siswa_id', $siswaId)
                    ->where('tahun_ajaran_id', $tahunAktif->id)
                    ->update(['is_processed' => 1]);

                // Sinkronkan ke master siswa
                Siswa::where('id', $siswaId)->update([
                    'kelas' => $kelasBaru,
                    'tahun_ajaran_id' => $tahunTargetId,
                ]);

                $diproses++;
            }

            // ====================== TINGGAL KELAS ======================
            foreach ($tinggal as $item) {
                $siswaId = $item['id'];

                $current = SiswaTahun::where('siswa_id', $siswaId)
                    ->where('tahun_ajaran_id', $tahunAktif->id)
                    ->first();

                $kelasSekarang = $current?->rombel?->tingkat_kelas ?? $current?->tingkat_kelas ?? 0;

                if (
                    SiswaTahun::where('siswa_id', $siswaId)
                        ->where('tahun_ajaran_id', $tahunTargetId)->exists()
                ) {
                    continue;
                }

                SiswaTahun::create([
                    'siswa_id' => $siswaId,
                    'tahun_ajaran_id' => $tahunTargetId,
                    'rombel_id' => null,
                    'tingkat_kelas' => $kelasSekarang,   // tetap di kelas yang sama
                    'status' => 'AKTIF',
                    'is_processed' => 1,
                ]);

                SiswaTahun::where('siswa_id', $siswaId)
                    ->where('tahun_ajaran_id', $tahunAktif->id)
                    ->update(['is_processed' => 1]);

                Siswa::where('id', $siswaId)->update([
                    'tahun_ajaran_id' => $tahunTargetId,
                ]);

                $diproses++;
            }

            // ====================== LULUS (Kelas 6) ======================
            foreach ($lulus as $item) {
                $siswaId = $item['id'];

                SiswaTahun::where('siswa_id', $siswaId)
                    ->where('tahun_ajaran_id', $tahunAktif->id)
                    ->update([
                        'status' => 'LULUS',
                        'is_processed' => 1
                    ]);

                Siswa::where('id', $siswaId)->update([
                    'is_graduated' => 1,
                ]);

                $diproses++;
            }

            DB::commit();

            $tanpaKategori = $perluKategori
                ? Siswa::whereIn('id', $perluKategori)->whereNull('kategori')->pluck('nama')->values()
                : collect();

            return response()->json([
                'success' => true,
                'message' => "Promosi berhasil. {$diproses} siswa diproses.",
                'detail' => [
                    'naik' => count($naik),
                    'tinggal' => count($tinggal),
                    'lulus' => count($lulus),
                ],
                'peringatan_kategori' => [
                    'jumlah' => $tanpaKategori->count(),
                    'nama' => $tanpaKategori->take(20)->all(),
                ],
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error promosi: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan promosi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function daftarGuru(Request $request)
    {
        $user = $request->user();
        $ids = $user ? $user->jenjangIds() : null;

        $gurus = User::select('id', 'name', 'nipy', 'role', 'jenjang_id')
            ->where('role', 'guru')
            ->when($ids !== null, fn($q) => $q->whereIn('jenjang_id', $ids))
            ->orderBy('name')
            ->get()
            ->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name . ($u->nipy ? " ({$u->nipy})" : ''),
                ];
            });

        return response()->json([
            'success' => true,
            'message' => 'Daftar guru berhasil dimuat',
            'data' => $gurus
        ]);
    }

    public function waliKelas(Request $request)
    {
        $validated = $request->validate([
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
            'wali_kelas' => 'required|array',
            'wali_kelas.*' => 'nullable|exists:users,id',
        ]);

        $tahunId = $validated['tahun_ajaran_id'];
        $assignments = $validated['wali_kelas'];

        DB::beginTransaction();
        try {
            foreach ($assignments as $rombelId => $guruId) {
                Rombel::where('id', $rombelId)
                    ->where('tahun_ajaran_id', $tahunId)
                    ->update(['guru_id' => $guruId]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Penetapan wali kelas berhasil disimpan'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error simpan wali kelas: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getWaliKelas(Request $request)
    {
        $request->validate([
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
        ]);

        $tahunId = $request->tahun_ajaran_id;

        $rombels = Rombel::where('tahun_ajaran_id', $tahunId)
            ->select('id', 'guru_id')   // cukup id & guru_id
            ->get()
            ->map(function ($rombel) {
                return [
                    'rombel_id' => $rombel->id,
                    'guru_id' => $rombel->guru_id,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $rombels   // sekarang array [{rombel_id:1, guru_id:45}, ...]
        ]);
    }

    public function finalisasi(Request $request)
    {
        $tahunAktif = TahunAjaran::where('aktif', 1)->first();

        if (!$tahunAktif) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada tahun ajaran aktif'
            ], 422);
        }

        if ($tahunAktif->kenaikan_kelas_finalized_at) {  // Ubah ke nama field ini jika cocok dengan DB
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran ini sudah difinalisasi sebelumnya'
            ], 422);
        }


        $tahunAktif->update(['kenaikan_kelas_finalized_at' => now()]);

        Log::info('Finalisasi berhasil untuk tahun: ' . $tahunAktif->nama);

        return response()->json([
            'success' => true,
            'message' => 'Kenaikan kelas berhasil difinalisasi pada ' . now()->format('d M Y H:i'),
            'kenaikan_kelas_finalized_at' => $tahunAktif->fresh()->kenaikan_kelas_finalized_at
        ]);
    }

    public function finalisasiTotal(Request $request)
    {
        $user = $request->user();
        $tahunAktif = TahunAjaran::where('aktif', 1)->first();

        if (!$tahunAktif) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada tahun ajaran aktif'
            ], 422);
        }

        $jenjangId = $user->isSuperadmin()
            ? ($request->jenjang_id ?: null)
            : $user->jenjang_id;

        if ($jenjangId) {
            if ($tahunAktif->isFinalizedForJenjang($jenjangId)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Proses untuk jenjang ini sudah difinalisasi sebelumnya'
                ], 422);
            }

            // Cek apakah ada siswa baru PPDB di jenjang ini yang belum diproses
            $siswaBaruBelumDiproses = DB::table('siswas')
                ->where('jenjang_id', $jenjangId)
                ->where('is_processed', 0)
                ->count();

            if ($siswaBaruBelumDiproses > 0) {
                return response()->json([
                    'success' => false,
                    'message' => "Masih ada {$siswaBaruBelumDiproses} siswa baru pada jenjang ini yang belum dibagikan rombel/NIS. Selesaikan dulu di menu Siswa Baru sebelum finalisasi."
                ], 422);
            }

            // Cek apakah ada siswa di jenjang ini yang belum diproses kenaikannya
            $siswaBelumDiproses = SiswaTahun::where('tahun_ajaran_id', $tahunAktif->id)
                ->untukUser($user)
                ->where('is_processed', 0)
                ->count();

            if ($siswaBelumDiproses > 0) {
                return response()->json([
                    'success' => false,
                    'message' => "Masih ada {$siswaBelumDiproses} siswa pada jenjang ini yang belum diproses kenaikan kelasnya."
                ], 422);
            }

            \App\Models\FinalisasiJenjang::updateOrCreate(
                [
                    'tahun_ajaran_id' => $tahunAktif->id,
                    'jenjang_id'      => $jenjangId,
                ],
                [
                    'finalized_at' => now(),
                    'finalized_by' => $user->id,
                ]
            );

            // Jika semua jenjang sudah difinalisasi, tandai juga tahun_ajaran->finalized_at
            $totalJenjangCount = \App\Models\Jenjang::count();
            $finalizedJenjangCount = \App\Models\FinalisasiJenjang::where('tahun_ajaran_id', $tahunAktif->id)
                ->whereNotNull('finalized_at')
                ->count();

            if ($totalJenjangCount > 0 && $finalizedJenjangCount >= $totalJenjangCount) {
                $tahunAktif->finalized_at = now();
                $tahunAktif->save();
            }

            Log::info("Finalisasi jenjang ID {$jenjangId} berhasil untuk tahun ID {$tahunAktif->id} ({$tahunAktif->nama}) oleh user {$user->id}");

            return response()->json([
                'success' => true,
                'message' => 'Proses kenaikan kelas jenjang ini berhasil dikunci permanen',
                'finalized_at' => now()->toDateTimeString(),
                'tahun_ajaran' => $tahunAktif->nama
            ]);
        }

        // Jika superadmin tanpa jenjang spesifik (Finalisasi Global)
        if ($tahunAktif->finalized_at) {
            return response()->json([
                'success' => false,
                'message' => 'Proses sudah difinalisasi sebelumnya secara global'
            ], 422);
        }

        $siswaBaruBelumDiproses = DB::table('siswas')->where('is_processed', 0)->count();
        if ($siswaBaruBelumDiproses > 0) {
            return response()->json([
                'success' => false,
                'message' => "Masih ada {$siswaBaruBelumDiproses} siswa baru yang belum dibagikan rombel/NIS. Selesaikan dulu di menu Siswa Baru sebelum finalisasi total."
            ], 422);
        }

        $siswaBelumDiproses = SiswaTahun::where('tahun_ajaran_id', $tahunAktif->id)
            ->where('is_processed', 0)
            ->count();
        if ($siswaBelumDiproses > 0) {
            return response()->json([
                'success' => false,
                'message' => "Masih ada {$siswaBelumDiproses} siswa yang belum diproses kenaikan kelasnya."
            ], 422);
        }

        $tahunAktif->finalized_at = now();
        $tahunAktif->save();

        $jenjangs = \App\Models\Jenjang::all();
        foreach ($jenjangs as $j) {
            \App\Models\FinalisasiJenjang::updateOrCreate(
                [
                    'tahun_ajaran_id' => $tahunAktif->id,
                    'jenjang_id'      => $j->id,
                ],
                [
                    'finalized_at' => now(),
                    'finalized_by' => $user->id,
                ]
            );
        }

        Log::info("Finalisasi total global berhasil untuk tahun ID {$tahunAktif->id} ({$tahunAktif->nama}) pada {$tahunAktif->finalized_at}");

        return response()->json([
            'success' => true,
            'message' => 'Seluruh proses kenaikan kelas berhasil dikunci permanen',
            'finalized_at' => $tahunAktif->finalized_at->toDateTimeString(),
            'tahun_ajaran' => $tahunAktif->nama
        ]);
    }

    public function statusKeseluruhan(Request $request)
    {
        $user = $request->user();
        $tahunAktif = TahunAjaran::where('aktif', 1)->first();

        if (!$tahunAktif) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada tahun ajaran aktif',
                'data' => null
            ], 404);
        }

        $targetNama = null;
        if (preg_match('/^(\d{4})\/(\d{4})$/', $tahunAktif->nama, $matches)) {
            $targetNama = ($matches[1] + 1) . '/' . ($matches[2] + 1);
        }

        $tahunTarget = $targetNama
            ? TahunAjaran::where('nama', $targetNama)->first()
            : null;

        if (!$tahunTarget) {
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran target (' . $targetNama . ') tidak ditemukan',
                'data' => null
            ], 404);
        }

        $targetJenjangId = $user->isSuperadmin()
            ? ($request->query('jenjang_id') ?: null)
            : $user->jenjang_id;

        $siswaBelumDiproses = SiswaTahun::where('tahun_ajaran_id', $tahunAktif->id)
            ->untukUser($user)
            ->where('is_processed', 0)
            ->exists();
        $promosiSelesai = !$siswaBelumDiproses;

        $siswaTanpaRombel = SiswaTahun::where('tahun_ajaran_id', $tahunTarget->id)
            ->untukUser($user)
            ->whereNull('rombel_id')
            ->exists();
        $penempatanSelesai = !$siswaTanpaRombel;

        $rombelsTanpaWali = Rombel::where('tahun_ajaran_id', $tahunTarget->id)
            ->untukUser($user)
            ->whereNull('guru_id')
            ->exists();
        $waliLengkap = !$rombelsTanpaWali;

        $siswaBaruQuery = DB::table('siswas')->where('is_processed', 0);
        if ($targetJenjangId) {
            $siswaBaruQuery->where('jenjang_id', $targetJenjangId);
        } elseif ($user && $user->jenjangIds() !== null) {
            $siswaBaruQuery->whereIn('jenjang_id', $user->jenjangIds());
        }
        $siswaBaruBelumDiproses = $siswaBaruQuery->exists();
        $siswaBaruSelesai = !$siswaBaruBelumDiproses;

        $detail = [
            'siswa_belum_diproses' => SiswaTahun::where('tahun_ajaran_id', $tahunAktif->id)
                ->untukUser($user)
                ->where('is_processed', 0)
                ->count(),
            'siswa_tanpa_rombel' => SiswaTahun::where('tahun_ajaran_id', $tahunTarget->id)
                ->untukUser($user)
                ->whereNull('rombel_id')
                ->count(),
            'rombel_tanpa_wali' => Rombel::where('tahun_ajaran_id', $tahunTarget->id)
                ->untukUser($user)
                ->whereNull('guru_id')
                ->count(),
            'siswa_baru_belum_diproses' => (clone $siswaBaruQuery)->count(),
        ];

        $sudahFinalized = $targetJenjangId
            ? $tahunAktif->isFinalizedForJenjang($targetJenjangId)
            : !is_null($tahunAktif->finalized_at);

        $finalizedAt = $targetJenjangId
            ? $tahunAktif->finalizedAtForJenjang($targetJenjangId)
            : $tahunAktif->finalized_at;

        return response()->json([
            'success' => true,
            'data' => [
                'tahun_aktif' => $tahunAktif->nama,
                'tahun_target' => $tahunTarget->nama,
                'jenjang_id' => $targetJenjangId,
                'promosi_selesai' => $promosiSelesai,
                'penempatan_selesai' => $penempatanSelesai,
                'wali_lengkap' => $waliLengkap,
                'siswa_baru_selesai' => $siswaBaruSelesai,
                'semua_selesai' => $promosiSelesai && $penempatanSelesai && $waliLengkap && $siswaBaruSelesai,
                'detail' => $detail,
                'sudah_finalized' => (bool) $sudahFinalized,
                'finalized_at' => $finalizedAt,
            ]
        ]);
    }
}