<?php

namespace App\Http\Controllers\Api\Tu;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rombel;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class WaliKelasController extends Controller
{
    /**
     * Cek apakah guru valid: role guru dan bolehJenjang user.
     * null/falsy $guruId = mengosongkan wali kelas, dianggap valid.
     */
    private function guruValid($guruId): bool
    {
        if (!$guruId) return true; // null = mengosongkan wali kelas
        $guru = User::where('id', $guruId)->where('role', 'guru')->first();
        return $guru && request()->user()->bolehJenjang($guru->jenjang_id);
    }

    /**
     * Mengambil data wali kelas berdasarkan kelas tertentu
     * GET /api/tu/wali-kelas?kelas=1
     */

public function index(Request $request)
{
    try {
        $tahunId = $request->query('tahun_ajaran_id');

        // 🔥 Ambil dari tabel Rombel langsung
        $data = Rombel::with('guru')
            ->untukUser($request->user())
            ->when($tahunId, fn($q) => $q->where('tahun_ajaran_id', $tahunId))
            ->whereNotNull('guru_id') // Hanya yang sudah ada wali kelas
            ->get()
            ->map(function ($r) {
                return [
                    'id' => $r->id,
                    'rombel_id' => $r->id,
                    'guru_id' => $r->guru_id,
                    'guru_nama' => $r->guru?->name,
                    'tingkat_kelas' => $r->tingkat_kelas,
                    'sub_nama' => $r->sub_nama,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $data
        ]);

    } catch (\Throwable $e) {
        Log::error('Error index wali kelas: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Terjadi kesalahan.'
        ], 500);
    }
}

/**
 * Menyimpan penetapan wali kelas untuk kelas 2-6
 * POST /api/tu/wali-kelas
 */
public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
            'wali_kelas' => 'required|array',
        ]);

        $waliKelas = $validated['wali_kelas'];

        DB::beginTransaction();
        
        foreach ($waliKelas as $rombelId => $guruId) {
            $rombel = Rombel::untukUser($request->user())
                ->where('tahun_ajaran_id', $validated['tahun_ajaran_id'])
                ->find($rombelId);
            if (!$rombel) {
                DB::rollBack();
                return response()->json(['success' => false, 'message' => 'Rombel tidak ditemukan.'], 404);
            }
            if (!$this->guruValid($guruId)) {
                DB::rollBack();
                return response()->json(['success' => false, 'message' => 'Guru yang dipilih tidak valid atau di luar jenjang Anda.'], 422);
            }
            // 🔥 Update guru_id di tabel rombel
            $rombel->guru_id = $guruId ?: null;
            $rombel->save();
        }

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => "Penetapan wali kelas berhasil disimpan.",
        ]);

    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('Error simpan wali kelas: ' . $e->getMessage());

        return response()->json([
            'success' => false,
            'message' => 'Terjadi kesalahan.'
        ], 500);
    }
}
    /**
     * Menyimpan penetapan wali kelas untuk siswa baru (kelas 1)
     * POST /api/tu/wali-kelas/siswa-baru
     */
public function storeSiswaBaru(Request $request)
    {
        try {
            $validated = $request->validate([
                'tahun_ajaran_id' => 'required',
                'wali_kelas' => 'required|array',
            ]);

            $waliKelas = $validated['wali_kelas'];

            DB::beginTransaction();
            foreach ($waliKelas as $rombelId => $guruId) {
                $rombel = Rombel::untukUser($request->user())
                    ->where('tahun_ajaran_id', $validated['tahun_ajaran_id'])
                    ->find($rombelId);
                if (!$rombel) {
                    DB::rollBack();
                    return response()->json(['success' => false, 'message' => 'Rombel tidak ditemukan.'], 404);
                }
                if (!$this->guruValid($guruId)) {
                    DB::rollBack();
                    return response()->json(['success' => false, 'message' => 'Guru yang dipilih tidak valid atau di luar jenjang Anda.'], 422);
                }
                // 🔥 Pastikan kolomnya 'guru_id' sesuai isi database Anda
                $rombel->guru_id = $guruId ?: null;
                $rombel->save();
            }
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Berhasil memperbarui wali kelas.",
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error simpan siswa baru wali kelas: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Terjadi kesalahan.'], 500);
        }
    }

    /**
     * Update wali kelas untuk satu rombel
     * PUT /api/tu/wali-kelas/{rombelId}
     */
    public function update(Request $request, $rombelId)
    {
        try {
            $validated = $request->validate([
                'guru_id' => 'nullable|exists:users,id',
            ]);

            $guruId = $validated['guru_id'] ?? null;

            $rombel = Rombel::untukUser($request->user())->findOrFail($rombelId);

            if (!$this->guruValid($guruId)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Guru tidak valid atau di luar jenjang Anda.'
                ], 422);
            }

            $rombel->guru_id = $guruId ?: null;
            $rombel->save();

            Log::info("Wali kelas rombel {$rombelId} diupdate menjadi: " . ($validated['guru_id'] ?: 'tidak ada'));

            return response()->json([
                'success' => true,
                'message' => 'Wali kelas berhasil diperbarui',
                'data' => [
                    'rombel_id' => $rombel->id,
                    'nama_rombel' => $rombel->tingkat_kelas . $rombel->sub_nama,
                    'wali_kelas_id' => $rombel->guru_id,
                ]
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            Log::error('Error update wali kelas: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui wali kelas'
            ], 500);
        }
    }

    /**
     * Menghapus wali kelas dari rombel
     * DELETE /api/tu/wali-kelas/{rombelId}
     */
    public function destroy(Request $request, $rombelId)
    {
        try {
            $rombel = Rombel::untukUser($request->user())->findOrFail($rombelId);

            $rombel->guru_id = null;
            $rombel->save();

            Log::info("Wali kelas rombel {$rombelId} dihapus");

            return response()->json([
                'success' => true,
                'message' => 'Wali kelas berhasil dihapus dari rombel'
            ]);

        } catch (\Exception $e) {
            Log::error('Error hapus wali kelas: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus wali kelas'
            ], 500);
        }
    }

    /**
     * Mendapatkan daftar guru yang tersedia untuk jadi wali kelas
     * GET /api/tu/wali-kelas/guru-tersedia
     */
    public function guruTersedia(Request $request)
    {
        try {
            $tahunAjaranId = $request->query('tahun_ajaran_id');
            $user = $request->user();

            // Ambil guru sesuai jenjang (guru tanpa jenjang juga tampil — bisa mengajar lintas jenjang)
            $query = User::where('role', 'guru');
            if ($user && $user->jenjangIds() !== null) {
                $query->where(function ($q) use ($user) {
                    $q->whereIn('jenjang_id', $user->jenjangIds())
                      ->orWhereNull('jenjang_id');
                });
            }

            $allGurus = $query->select('id', 'name', 'nipy')
                ->orderBy('name')
                ->get();

            // Jika ada tahun ajaran, tandai guru yang sudah jadi wali kelas
            $assignedGuruIds = [];
            if ($tahunAjaranId) {
                $assignedGuruIds = Rombel::where('tahun_ajaran_id', $tahunAjaranId)
                    ->untukUser($user)
                    ->whereNotNull('guru_id')
                    ->pluck('guru_id')
                    ->filter()
                    ->toArray();
            }

            $data = $allGurus->map(function ($guru) use ($assignedGuruIds) {
                return [
                    'id' => $guru->id,
                    'nama' => $guru->name,
                    'nipy' => $guru->nipy,
                    'sudah_ditugaskan' => in_array($guru->id, $assignedGuruIds),
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Data guru tersedia berhasil diambil',
                'data' => $data
            ]);

        } catch (\Exception $e) {
            Log::error('Error get guru tersedia: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data guru'
            ], 500);
        }
    }
}