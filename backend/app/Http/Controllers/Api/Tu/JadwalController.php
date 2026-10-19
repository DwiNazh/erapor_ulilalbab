<?php

namespace App\Http\Controllers\Api\Tu;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Jadwal;
use App\Models\Mapel;
use App\Models\User;
use App\Models\Rombel;
use App\Models\PenugasanGuru;
use Illuminate\Validation\Rule;

class JadwalController extends Controller
{
    /**
     * GET: Ambil semua jadwal dengan filter
     */
    public function index(Request $request)
    {
        $tahunId = $request->query('tahun_ajaran_id');
        $rombelId = $request->query('rombel_id');

        $query = Jadwal::with(['rombel', 'mapel', 'guru'])
            ->untukUser($request->user())
            ->when($tahunId, fn($q) => $q->where('tahun_ajaran_id', $tahunId))
            ->when($rombelId, fn($q) => $q->where('rombel_id', $rombelId))
            ->orderBy('hari')
            ->orderBy('jam_mulai');

        $jadwal = $query->get();

        return response()->json([
            'success' => true,
            'data' => $jadwal
        ]);
    }

    /**
     * GET: Ambil jadwal per rombel (untuk ditampilkan di frontend)
     */
    public function byRombel($rombelId)
    {
        $rombel = Rombel::untukUser(request()->user())->find($rombelId);
        if (!$rombel) {
            return response()->json([
                'success' => false,
                'message' => 'Rombel tidak ditemukan atau di luar jenjang Anda.'
            ], 403);
        }

        $jadwal = Jadwal::with(['mapel', 'guru', 'rombel'])
            ->where('rombel_id', $rombelId)
            ->orderBy('hari')
            ->orderBy('jam_mulai')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'hari' => $item->hari,
                    'jam_mulai' => $item->jam_mulai,
                    'jam_selesai' => $item->jam_selesai,
                    'mapel' => $item->mapel,
                    'mapel_id' => $item->mapel_id,
                    'guru' => $item->guru,
                    'guru_id' => $item->guru_id,
                    'rombel' => $item->rombel,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $jadwal
        ]);
    }

    /**
     * POST: Tambah jadwal + penugasan guru (TERINTEGRASI)
     */
    public function store(Request $request)
    {
        try {
            \Log::info('📌 Jadwal store - Input raw:', $request->all());

            // ✅ VALIDASI: guru_id REQUIRED (bukan nullable lagi)
            $validated = $request->validate([
                'guru_id'         => 'required|integer|exists:users,id',
                'mapel_id'        => 'required|integer|exists:mapel,id',
                'rombel_id'       => 'required|integer|exists:rombel,id',
                'hari'            => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu',
                'jam_mulai'       => 'required|date_format:H:i',
                'jam_selesai'     => 'required|date_format:H:i|after:jam_mulai',
                'tahun_ajaran_id' => 'required|integer|exists:tahun_ajaran,id',
                'penugasan_id'    => 'nullable|integer|exists:penugasan_guru,id',
            ]);

            $rombel = Rombel::find($validated['rombel_id']);
            if (!$rombel || !$request->user()->bolehJenjang($rombel->jenjang_id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Rombel yang dipilih berada di luar jenjang yang Anda kelola.'
                ], 403);
            }

            \Log::info('✅ Validasi berhasil:', $validated);

            // ✅ STEP 1: Pastikan penugasan guru sudah ada
            $penugasanGuru = PenugasanGuru::where([
                'guru_id' => $validated['guru_id'],
                'mapel_id' => $validated['mapel_id'],
                'rombel_id' => $validated['rombel_id'],
                'tahun_ajaran_id' => $validated['tahun_ajaran_id'],
            ])->first();

            if (!$penugasanGuru) {
                // ✅ Jika belum ada, buat penugasan baru
                \Log::info('📌 Penugasan belum ada, membuat baru...');
                
                $penugasanGuru = PenugasanGuru::create([
                    'guru_id' => $validated['guru_id'],
                    'mapel_id' => $validated['mapel_id'],
                    'rombel_id' => $validated['rombel_id'],
                    'tahun_ajaran_id' => $validated['tahun_ajaran_id'],
                ]);

                \Log::info('✅ Penugasan baru dibuat dengan ID:', ['id' => $penugasanGuru->id]);
            }

            // ✅ STEP 2: Buat jadwal
            $jadwal = Jadwal::create([
                'guru_id' => $validated['guru_id'],
                'mapel_id' => $validated['mapel_id'],
                'rombel_id' => $validated['rombel_id'],
                'hari' => $validated['hari'],
                'jam_mulai' => $validated['jam_mulai'],
                'jam_selesai' => $validated['jam_selesai'],
                'tahun_ajaran_id' => $validated['tahun_ajaran_id'],
                'penugasan_id' => $penugasanGuru->id,
            ]);

            \Log::info('✅ Jadwal berhasil dibuat dengan ID:', ['id' => $jadwal->id]);

            // Load relasi
            $jadwal->load(['mapel', 'guru', 'rombel']);

            return response()->json([
                'success' => true,
                'message' => 'Jadwal + Penugasan Guru berhasil ditambahkan',
                'data' => [
                    'id' => $jadwal->id,
                    'hari' => $jadwal->hari,
                    'jam_mulai' => $jadwal->jam_mulai,
                    'jam_selesai' => $jadwal->jam_selesai,
                    'mapel' => $jadwal->mapel,
                    'guru' => $jadwal->guru,
                    'rombel' => $jadwal->rombel,
                    'penugasan_id' => $penugasanGuru->id,
                ]
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('❌ Validasi gagal:', $e->errors());

            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            \Log::error('❌ Error simpan jadwal: ' . $e->getMessage(), [
                'request' => $request->all(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan server',
                'debug' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * DELETE: Hapus jadwal (PERBAIKAN - benar-benar hapus di database)
     * 
     * ✅ DIPERBAIKI:
     * - Benar-benar menghapus jadwal di database
     * - Optionally menghapus penugasan yang terkait
     */
    public function destroy($id)
    {
        try {
            \Log::info('📌 Deleting jadwal ID:', ['id' => $id]);

            // Find jadwal
            $jadwal = Jadwal::findOrFail($id);

            // ✅ OPTION 1: Hapus jadwal saja (penugasan tetap ada)
            // $jadwal->delete();

            // ✅ OPTION 2: Hapus jadwal + penugasan yang terkait (RECOMMENDED)
            $penugasanId = $jadwal->penugasan_id;
            
            // Hapus jadwal terlebih dahulu
            $jadwal->delete();
            
            // Jika jadwal punya referensi penugasan, cek apakah penugasan ini 
            // masih digunakan oleh jadwal lain
            if ($penugasanId) {
                $penugasan = PenugasanGuru::find($penugasanId);
                
                if ($penugasan) {
                    // Cek jadwal lain yang masih pakai penugasan ini
                    $jmlJadwalLain = Jadwal::where('penugasan_id', $penugasanId)->count();
                    
                    // Jika tidak ada jadwal lain yang pakai, hapus penugasan
                    if ($jmlJadwalLain == 0) {
                        $penugasan->delete();
                        \Log::info('✅ Penugasan juga dihapus karena tidak ada jadwal lain yang menggunakannya');
                    } else {
                        \Log::info('📌 Penugasan tetap ada karena masih digunakan oleh jadwal lain');
                    }
                }
            }

            \Log::info('✅ Jadwal berhasil dihapus dari database');

            return response()->json([
                'success' => true,
                'message' => 'Jadwal berhasil dihapus'
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            \Log::error('❌ Jadwal tidak ditemukan:', ['id' => $id]);

            return response()->json([
                'success' => false,
                'message' => 'Jadwal tidak ditemukan'
            ], 404);

        } catch (\Exception $e) {
            \Log::error('❌ Error delete jadwal: ' . $e->getMessage(), [
                'id' => $id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus jadwal',
                'debug' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET: Ambil daftar mapel untuk form (optional)
     */
    public function getMapel()
    {
        $mapel = Mapel::all();

        return response()->json([
            'success' => true,
            'data' => $mapel
        ]);
    }
}