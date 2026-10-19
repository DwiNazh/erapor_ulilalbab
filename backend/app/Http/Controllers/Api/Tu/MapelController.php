<?php

namespace App\Http\Controllers\Api\Tu;

use App\Http\Controllers\Controller;
use App\Models\Mapel;
use Illuminate\Http\Request;

class MapelController extends Controller
{
    public function index()
    {
        $mapels = Mapel::all(['id', 'nama', 'kode', 'deskripsi', 'jenis']);

        return response()->json([
            'success' => true,
            'data' => $mapels
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama'      => 'required|string|max:255',
            'kode'      => 'required|string|max:20|unique:mapel,kode',
            'deskripsi' => 'nullable|string',
            'jenis'     => 'required|in:wajib,pilihan',
        ]);

        $mapel = Mapel::create($validated);

        return response()->json([
            'success' => true,
            'data' => $mapel
        ]);
    }

    public function update(Request $request, $id)
    {
        $mapel = Mapel::findOrFail($id);

        $validated = $request->validate([
            'nama'      => 'required|string|max:255',
            'kode'      => 'required|string|max:20|unique:mapel,kode,' . $id,
            'deskripsi' => 'nullable|string',
            'jenis'     => 'required|in:wajib,pilihan',
        ]);

        $mapel->update($validated);

        return response()->json([
            'success' => true,
            'data' => $mapel
        ]);
    }

    public function destroy($id)
    {
        Mapel::destroy($id);

        return response()->json(['success' => true]);
    }
}