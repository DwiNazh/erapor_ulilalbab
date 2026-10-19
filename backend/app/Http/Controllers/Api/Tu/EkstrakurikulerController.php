<?php

namespace App\Http\Controllers\Api\Tu;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ekstrakurikuler;

class EkstrakurikulerController extends Controller
{
    public function index()
    {
        $data = Ekstrakurikuler::orderBy('nama')->get();

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'wajib' => 'nullable|boolean'
        ]);

        $ekskul = Ekstrakurikuler::create([
            'nama' => $request->nama,
            'wajib' => $request->wajib ?? false
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Ekstrakurikuler berhasil ditambahkan',
            'data' => $ekskul
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'wajib' => 'nullable|boolean'
        ]);

        $ekskul = Ekstrakurikuler::findOrFail($id);

        $ekskul->update([
            'nama' => $request->nama,
            'wajib' => $request->wajib ?? false
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Ekstrakurikuler berhasil diupdate',
            'data' => $ekskul
        ]);
    }

    public function destroy($id)
    {
        $ekskul = Ekstrakurikuler::findOrFail($id);

        $ekskul->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ekstrakurikuler berhasil dihapus'
        ]);
    }
}