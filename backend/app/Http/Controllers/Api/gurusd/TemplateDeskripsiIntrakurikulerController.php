<?php

namespace App\Http\Controllers\Api\gurusd;

use App\Http\Controllers\Controller;
use App\Models\TemplateDeskripsiIntrakurikuler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TemplateDeskripsiIntrakurikulerController extends Controller
{
    /**
     * GET /api/guru/template-deskripsi/intrakurikuler
     */
    public function index()
    {
        $guru = Auth::user();

        $data = TemplateDeskripsiIntrakurikuler::where('guru_id', $guru->id)
            ->orderBy('max_nilai', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $data->map(function ($item) {
                return [
                    'min' => $item->min_nilai,
                    'max' => $item->max_nilai,
                    'deskripsi' => $item->deskripsi,
                ];
            }),
        ]);
    }

    /**
     * POST /api/guru/template-deskripsi/intrakurikuler/save
     */
    public function save(Request $request)
    {
        $guru = Auth::user();

        $request->validate([
            'templates' => 'required|array',
            'templates.*.min' => 'required|integer|min:0|max:100',
            'templates.*.max' => 'required|integer|min:0|max:100',
            'templates.*.deskripsi' => 'required|string',
        ]);

        // hapus dulu biar tidak numpuk
        TemplateDeskripsiIntrakurikuler::where('guru_id', $guru->id)->delete();

        foreach ($request->templates as $item) {
            TemplateDeskripsiIntrakurikuler::create([
                'guru_id' => $guru->id,
                'min_nilai' => $item['min'],
                'max_nilai' => $item['max'],
                'deskripsi' => $item['deskripsi'],
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Template intrakurikuler berhasil disimpan.',
        ]);
    }
}