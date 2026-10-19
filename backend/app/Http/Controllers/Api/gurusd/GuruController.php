<?php

namespace App\Http\Controllers\Api\gurusd;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rombel;
use App\Models\Jadwal;
use App\Models\SiswaTahun;
use App\Models\TahunAjaran;
use Illuminate\Support\Facades\Auth;

class GuruController extends Controller
{
    /**
     * Dashboard sederhana untuk guru
     */
    public function dashboard(Request $request)
    {
        $user = Auth::user();

        return response()->json([
            'success' => true,
            'message' => 'Selamat datang di Dashboard Guru',
            'data' => [
                'nama' => $user->name,
                'role' => $user->role,
                'nipy' => $user->nipy ?? '-',
            ]
        ]);
    }

    /**
     * Ambil daftar rombel yang diampu oleh guru yang login (wali kelas)
     *
     * FIX: sebelumnya tidak ada filter tahun_ajaran_id, sehingga
     * mengembalikan SEMUA rombel guru tersebut dari tahun manapun
     * (termasuk tahun ajaran lama). Sekarang difilter sesuai
     * tahun_ajaran_id yang dikirim dari frontend, fallback ke
     * tahun ajaran aktif kalau tidak dikirim.
     */
    public function rombelDiampu(Request $request)
    {
        $guruId = Auth::id();

        $tahunAjaranId = $request->query('tahun_ajaran_id');

        if (!$tahunAjaranId) {
            $tahunAktif = TahunAjaran::where('aktif', 1)->first();
            $tahunAjaranId = $tahunAktif?->id;
        }

        if (!$tahunAjaranId) {
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran tidak ditemukan'
            ], 404);
        }

        $rombels = Rombel::where('guru_id', $guruId)
            ->where('tahun_ajaran_id', $tahunAjaranId) // <-- FIX UTAMA
            ->withCount(['siswaTahun as jumlah_siswa'])
            ->get(['id', 'tingkat_kelas', 'sub_nama', 'tahun_ajaran_id']);

        return response()->json([
            'success' => true,
            'data' => $rombels
        ]);
    }

    /**
     * Ambil daftar siswa di rombel tertentu
     * Hanya boleh akses rombel yang diampu guru ini
     */
    public function daftarSiswaRombel(Request $request, $rombelId)
    {
        $guruId = Auth::id();

        // Cek 1: Apakah guru ini adalah wali kelas rombel tersebut?
        $adalahWaliKelas = Rombel::where('id', $rombelId)
            ->where('guru_id', $guruId)
            ->exists();

        // Cek 2: Apakah guru ini punya penugasan mengajar di rombel tersebut?
        $adalahGuruBidang = \DB::table('penugasan_guru')
            ->where('guru_id', $guruId)
            ->where('rombel_id', $rombelId)
            ->exists();

        // Tolak hanya jika bukan keduanya
        if (!$adalahWaliKelas && !$adalahGuruBidang) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak berhak mengakses rombel ini'
            ], 403);
        }

        // Ambil siswa di rombel tersebut
        $siswa = SiswaTahun::where('rombel_id', $rombelId)
            ->with('siswa:id,nama,nis,nisn')
            ->get()
            ->pluck('siswa')
            ->filter()
            ->values(); // reset index array

        return response()->json([
            'success' => true,
            'data' => $siswa
        ]);
    }

    public function jadwalRombel($rombelId)
    {
        $guru = Auth::user();
        $rombel = Rombel::findOrFail($rombelId);

        // Cek sederhana: hanya jika guru adalah wali kelas rombel ini
        if ($rombel->guru_id !== $guru->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak berhak mengakses jadwal rombel ini'
            ], 403);
        }

        $jadwal = Jadwal::with(['mapel'])
            ->where('rombel_id', $rombelId)
            ->orderBy('hari')
            ->orderBy('jam_mulai')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $jadwal
        ]);
    }
}