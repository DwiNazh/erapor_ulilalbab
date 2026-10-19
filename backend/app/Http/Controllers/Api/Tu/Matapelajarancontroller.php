<?php

namespace App\Http\Controllers\Api\Tu;

use App\Http\Controllers\Controller;
use App\Models\Mapel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MataPelajaranController extends Controller
{
    // GET /api/tu/mapel
    public function index()
    {
        $mapel = Mapel::orderBy('nama')->get();

        return response()->json([
            'success' => true,
            'data'    => $mapel,
        ]);
    }

    // POST /api/tu/mapel
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama'      => 'required|string|max:100',
            'kode'      => 'required|string|max:20|unique:mapel,kode',
            'deskripsi' => 'nullable|string',
        ], [
            'nama.required' => 'Nama mata pelajaran wajib diisi.',
            'kode.required' => 'Kode mata pelajaran wajib diisi.',
            'kode.unique'   => 'Kode sudah digunakan oleh mata pelajaran lain.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        $mapel = Mapel::create([
            'nama'      => $request->nama,
            'kode'      => strtoupper($request->kode),
            'deskripsi' => $request->deskripsi,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Mata pelajaran berhasil ditambahkan.',
            'data'    => $mapel,
        ], 201);
    }

    // PUT /api/tu/mapel/{id}
    public function update(Request $request, $id)
    {
        $mapel = Mapel::find($id);

        if (!$mapel) {
            return response()->json([
                'success' => false,
                'message' => 'Mata pelajaran tidak ditemukan.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama'      => 'required|string|max:100',
            'kode'      => 'required|string|max:20|unique:mapel,kode,' . $id,
            'deskripsi' => 'nullable|string',
        ], [
            'nama.required' => 'Nama mata pelajaran wajib diisi.',
            'kode.required' => 'Kode mata pelajaran wajib diisi.',
            'kode.unique'   => 'Kode sudah digunakan oleh mata pelajaran lain.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        $mapel->update([
            'nama'      => $request->nama,
            'kode'      => strtoupper($request->kode),
            'deskripsi' => $request->deskripsi,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Mata pelajaran berhasil diperbarui.',
            'data'    => $mapel,
        ]);
    }

    // DELETE /api/tu/mapel/{id}
    public function destroy($id)
    {
        $mapel = Mapel::find($id);

        if (!$mapel) {
            return response()->json([
                'success' => false,
                'message' => 'Mata pelajaran tidak ditemukan.',
            ], 404);
        }

        $mapel->delete();

        return response()->json([
            'success' => true,
            'message' => 'Mata pelajaran berhasil dihapus.',
        ]);
    }
}