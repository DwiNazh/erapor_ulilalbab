<?php

namespace App\Http\Controllers\Api\Tu;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Siswa;
use App\Models\SiswaTahun;
use App\Models\TahunAjaran;
use App\Models\Rombel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PenempatanSiswaController extends Controller
{
    public function siswaBelumTerdaftar(Request $request)
    {
        $validated = $request->validate([
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
            'search' => 'nullable|string',
        ]);

        $tahunId = $validated['tahun_ajaran_id'];
        $search = $validated['search'] ?? '';

        try {
            // Ambil tahun ajaran tepat sebelum tahun tujuan
            $tahunAktif = TahunAjaran::where('id', '<', $tahunId)->orderBy('id', 'desc')->first();

            $query = SiswaTahun::with(['siswa'])
                ->untukUser($request->user())
                ->where('tahun_ajaran_id', $tahunId)
                ->whereNull('rombel_id')
                ->where('status', 'AKTIF');

            if (!empty($search)) {
                $query->whereHas('siswa', function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('nis', 'like', "%{$search}%")
                        ->orWhere('nisn', 'like', "%{$search}%");
                });
            }

            $siswaList = $query->get()->map(function ($st) use ($tahunAktif) {
                $siswa = $st->siswa;
                if (!$siswa)
                    return null;

                $dataTahunLalu = null;
                if ($tahunAktif) {
                    $dataTahunLalu = SiswaTahun::with('rombel')
                        ->where('siswa_id', $siswa->id)
                        ->where('tahun_ajaran_id', $tahunAktif->id)
                        ->first();
                }

                return [
                    'id' => $st->id,
                    'siswa_id' => $siswa->id,
                    'nama' => $siswa->nama,
                    'nis' => $siswa->nis,
                    'nisn' => $siswa->nisn,
                    'kategori' => $siswa->kategori,

                    'kelas_sebelumnya' => $dataTahunLalu && $dataTahunLalu->rombel
                        ? $dataTahunLalu->rombel->tingkat_kelas .
                        $dataTahunLalu->rombel->sub_nama
                        : null,
                ];
            })->filter()->values();

            Log::info("siswaBelumTerdaftar: {$siswaList->count()} siswa ditemukan untuk tahun {$tahunId}");

            return response()->json([
                'success' => true,
                'message' => 'Data siswa berhasil dimuat',
                'data' => $siswaList
            ]);

        } catch (\Exception $e) {
            Log::error('Error siswaBelumTerdaftar: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data siswa: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getRombelCount($id)
    {
        try {
            $rombel = Rombel::untukUser(request()->user())->find($id);
            if (!$rombel) {
                return response()->json([
                    'success' => false,
                    'message' => 'Rombel tidak ditemukan atau di luar jenjang Anda.'
                ], 403);
            }

            $count = SiswaTahun::where('rombel_id', $id)->count();
            return response()->json([
                'success' => true,
                'current_count' => $count
            ]);
        } catch (\Exception $e) {
            Log::error("Error getRombelCount rombel {$id}: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghitung jumlah siswa di rombel'
            ], 500);
        }
    }

    public function tempatkanSiswa(Request $request)
    {
        $validated = $request->validate([
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
            'rombel_id' => 'required|exists:rombel,id',
            'siswa_ids' => 'required|array',
            'siswa_ids.*' => 'required|integer|exists:siswa_tahun,id',
        ]);

        $tahunId = $validated['tahun_ajaran_id'];
        $rombelId = $validated['rombel_id'];
        $siswaIds = array_values(array_unique($validated['siswa_ids']));

        // Validasi rombel milik jenjang pengguna
        $rombel = Rombel::untukUser($request->user())
            ->where('id', $rombelId)
            ->where('tahun_ajaran_id', $tahunId)
            ->first();

        if (!$rombel) {
            return response()->json([
                'success' => false,
                'message' => 'Rombel tidak ditemukan atau di luar jenjang yang Anda kelola.'
            ], 403);
        }

        // ATURAN KATEGORI: rombel ikhwan hanya untuk siswa ikhwan, rombel akhwat hanya untuk siswa akhwat
        if (in_array($rombel->kelompok_gender, ['ikhwan', 'akhwat'], true)) {
            $tidakSesuai = SiswaTahun::with('siswa:id,nama,kategori')
                ->where('tahun_ajaran_id', $tahunId)
                ->whereIn('id', $siswaIds)
                ->whereHas('siswa', function ($q) use ($rombel) {
                    $q->where(function ($q2) use ($rombel) {
                        $q2->whereNull('kategori')
                            ->orWhere('kategori', '!=', $rombel->kelompok_gender);
                    });
                })
                ->get();

            if ($tidakSesuai->isNotEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => "Ada {$tidakSesuai->count()} siswa yang tidak sesuai dengan rombel "
                        . ucfirst($rombel->kelompok_gender)
                        . " (kategori berbeda atau belum diisi). Penempatan dibatalkan.",
                    'siswa_ditolak' => $tidakSesuai->map(fn($st) => [
                        'id' => $st->id,
                        'nama' => $st->siswa?->nama,
                        'kategori' => $st->siswa?->kategori,
                    ])->values(),
                ], 422);
            }
        }

        DB::beginTransaction();
        try {
            // Ambil data siswa_tahun yang memang belum punya rombel_id
            $targetSt = SiswaTahun::where('tahun_ajaran_id', $tahunId)
                ->whereIn('id', $siswaIds)
                ->whereNull('rombel_id')
                ->get();

            $updated = SiswaTahun::where('tahun_ajaran_id', $tahunId)
                ->whereIn('id', $targetSt->pluck('id'))
                ->update(['rombel_id' => $rombelId]);

            // Sinkronkan ke tabel master siswa
            if ($updated > 0 && $rombel) {
                Siswa::whereIn('id', $targetSt->pluck('siswa_id'))->update([
                    'kelas' => $rombel->tingkat_kelas,
                    'sub' => $rombel->sub_nama,
                    'tahun_ajaran_id' => $tahunId,
                ]);
            }

            DB::commit();

            $dilewati = count($siswaIds) - $updated;
            Log::info("Berhasil menempatkan {$updated} siswa ke rombel ID {$rombelId}");

            return response()->json([
                'success' => true,
                'message' => "Berhasil menempatkan {$updated} siswa ke rombel {$rombel->nama_rombel}"
                    . ($dilewati > 0 ? " ({$dilewati} siswa dilewati karena sudah punya rombel)" : ''),
                'jumlah_ditempatkan' => $updated,
                'jumlah_dilewati' => $dilewati,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error tempatkan: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menempatkan siswa. Silakan coba lagi.'
            ], 500);
        }
    }
}