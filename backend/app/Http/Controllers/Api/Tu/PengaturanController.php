<?php

namespace App\Http\Controllers\Api\Tu;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pengaturan;

class PengaturanController extends Controller
{
    // ✅ GET pengaturan
    public function index()
    {
        $data = Pengaturan::first();

        // kalau belum ada, bikin default
        if (!$data) {
            $data = Pengaturan::create([]);
        }

        return response()->json($data);
    }

    // ✅ UPDATE pengaturan
    public function update(Request $request)
    {
        $request->validate([
            'nama_sekolah' => 'nullable|string|max:255',
            'npsn' => 'nullable|string|max:50',
            'alamat' => 'nullable|string',
            'telepon' => 'nullable|string|max:50',
            'website' => 'nullable|url',
            'email_sekolah' => 'nullable|email',
        ]);

        $data = Pengaturan::first();

        if (!$data) {
            $data = Pengaturan::create([]);
        }

        $data->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Pengaturan berhasil disimpan',
            'data' => $data
        ]);
    }
}