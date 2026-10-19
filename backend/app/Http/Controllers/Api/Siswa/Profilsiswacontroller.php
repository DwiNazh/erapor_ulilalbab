<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ProfilSiswaController extends Controller
{
public function index(Request $request)
{
    $siswa = $request->user();

    if (!$siswa) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthenticated'
        ], 401);
    }

    // Ambil data siswa_tahun terbaru (urutan id desc)
    $st = DB::table('siswa_tahun as st')
        ->join('tahun_ajaran as ta', 'st.tahun_ajaran_id', '=', 'ta.id')
        ->leftJoin('rombel as r', 'st.rombel_id', '=', 'r.id')
        ->where('st.siswa_id', $siswa->id)
        ->where('st.status', 'AKTIF')
        ->orderByDesc('st.id')
        ->select(
            'st.rombel_id',
            'r.tingkat_kelas',
            'r.sub_nama',
            'ta.nama as tahun_ajaran',
            'st.status'
        )
        ->first();

    $tingkat = $st?->tingkat_kelas ?? $siswa->kelas;
    $sub = $st?->sub_nama ?? $siswa->sub;
    $kelasLabel = $tingkat ? trim($tingkat . ' ' . ($sub ?? '')) : null;

    $data = [
        'id'           => $siswa->id,
        'nama'         => $siswa->nama,
        'nis'          => $siswa->nis,
        'nisn'         => $siswa->nisn,
        'rombel_id'    => $st?->rombel_id,
        'kelas'        => $kelasLabel,
        'sub_kelas'    => $sub,
        'tahun_ajaran' => $st?->tahun_ajaran,
        'status'       => $st?->status ?? 'AKTIF',
    ];

    return response()->json([
        'success' => true,
        'data'    => $data
    ]);
}

public function gantiPassword(Request $request)
{
    // 1. Ambil instance model user yang sedang login (Eloquent)
    $siswa = $request->user();

    // 2. Validasi input dengan pesan kustom (opsional)
    $validator = Validator::make($request->all(), [
        'password_lama' => 'required',
        'password_baru' => 'required|min:6',
        'konfirmasi'    => 'required|same:password_baru',
    ], [
        'password_baru.min' => 'Password baru minimal 6 karakter.',
        'konfirmasi.same'   => 'Konfirmasi password tidak cocok dengan password baru.',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => $validator->errors()->first()
        ], 422);
    }

    // 3. Verifikasi apakah password lama cocok dengan yang di database
    if (!Hash::check($request->password_lama, $siswa->password)) {
        return response()->json([
            'success' => false,
            'message' => 'Password lama yang kamu masukkan salah.'
        ], 422);
    }

    // 4. Update password menggunakan Eloquent agar lebih aman dan 'updated_at' terisi
    // Kita panggil model Siswa secara langsung atau lewat instance $siswa
    try {
        $siswa->update([
            'password' => Hash::make($request->password_baru)
        ]);

        return response()->json([
            'success' => true, 
            'message' => 'Password berhasil diperbarui!'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Gagal memperbarui password, coba lagi nanti.'
        ], 500);
    }
}
}