<?php

namespace App\Http\Controllers\Api\Tu;

use App\Http\Controllers\Controller;
use App\Models\PenugasanGuru;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PenugasanGuruController extends Controller
{
    public function index(Request $request)
    {
        // 1. UBAH: Tambahkan 'rombel' ke dalam array with() dan ubah orderBy dari kelas ke rombel_id
        $penugasan = PenugasanGuru::with(['guru', 'mapel', 'tahunAjaran', 'rombel'])
            ->untukUser($request->user())
            ->orderBy('tahun_ajaran_id', 'desc')
            ->orderBy('rombel_id') 
            ->orderBy('mapel_id')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $penugasan
        ]);
    }

    public function store(Request $request)
    {
        // 2. UBAH: Validasi 'kelas' menjadi 'rombel_id' dan pastikan data ada di tabel rombel
        $validator = Validator::make($request->all(), [
            'guru_id'         => 'required|exists:users,id',
            'mapel_id'        => 'required|exists:mapel,id',
            'rombel_id'       => 'required|exists:rombel,id', // Pastikan nama tabel di DB adalah 'rombel'
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
        ], [
            'guru_id.exists'         => 'Guru yang dipilih tidak ditemukan.',
            'mapel_id.exists'        => 'Mata pelajaran yang dipilih tidak ditemukan.',
            'rombel_id.required'     => 'Rombel wajib dipilih.',
            'rombel_id.exists'       => 'Rombel yang dipilih tidak ditemukan di database.',
            'tahun_ajaran_id.exists' => 'Tahun ajaran yang dipilih tidak ditemukan di database.',
            'tahun_ajaran_id.required' => 'Tahun ajaran wajib diisi.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        $rombel = \App\Models\Rombel::find($request->rombel_id);
        if (!$rombel || !$request->user()->bolehJenjang($rombel->jenjang_id)) {
            return response()->json([
                'success' => false,
                'message' => 'Rombel yang dipilih berada di luar jenjang sekolah Anda.'
            ], 403);
        }

        // 3. UBAH: Cek duplikat data menggunakan 'rombel_id'
        $exists = PenugasanGuru::where('guru_id', $request->guru_id)
            ->where('mapel_id', $request->mapel_id)
            ->where('rombel_id', $request->rombel_id)
            ->where('tahun_ajaran_id', $request->tahun_ajaran_id)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Penugasan ini sudah ada untuk guru, mapel, rombel, dan tahun ajaran tersebut.'
            ], 422);
        }

        // 4. UBAH: Insert data menggunakan 'rombel_id'
        $penugasan = PenugasanGuru::create($request->only([
            'guru_id', 'mapel_id', 'rombel_id', 'tahun_ajaran_id'
        ]));

        // 5. UBAH: Load relasi 'rombel' agar data utuh saat dikembalikan ke frontend
        $penugasan->load(['guru', 'mapel', 'tahunAjaran', 'rombel']);

        return response()->json([
            'success' => true,
            'message' => 'Penugasan guru berhasil ditambahkan',
            'data'    => $penugasan
        ], 201);
    }

    public function destroy($id)
    {
        $penugasan = PenugasanGuru::findOrFail($id);
        $penugasan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Penugasan berhasil dihapus'
        ]);
    }
}