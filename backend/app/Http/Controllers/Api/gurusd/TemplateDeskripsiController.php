<?php

namespace App\Http\Controllers\Api\gurusd;

use App\Http\Controllers\Controller;
use App\Models\TemplateDeskripsi;
use App\Models\Ekstrakurikuler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TemplateDeskripsiController extends Controller
{
    /**
     * GET /api/guru/template-deskripsi/{jenis}
     */
    public function index($jenis)
    {
        $guru = Auth::user();

        // =========================
        // KOKURIKULER → tetap per guru
        // =========================
        if ($jenis === 'kokurikuler') {

            $data = TemplateDeskripsi::where('guru_id', $guru->id)
                ->where('jenis', $jenis)
                ->get();

        } else {

            // =========================
            // EKSTRAKURIKULER → GLOBAL
            // =========================
            $data = TemplateDeskripsi::where('jenis', $jenis)
                ->get();
        }

        $formatted = [];

        foreach ($data as $item) {
            $formatted[$item->aspek][$item->grade] = $item->deskripsi;
        }

        $aspekList = [];

        if ($jenis === 'ekstrakurikuler') {

            $aspekList = Ekstrakurikuler::orderBy('nama')
                ->pluck('nama')
                ->toArray();
        }

        return response()->json([
            'success'    => true,
            'data'       => $formatted,
            'aspek_list' => $aspekList,
        ]);
    }

    /**
     * POST /api/guru/template-deskripsi/save-bulk
     */
    public function saveBulk(Request $request)
    {
        $guru = Auth::user();

        $request->validate([
            'jenis'                 => 'required|in:kokurikuler,ekstrakurikuler',
            'templates'             => 'required|array',
            'templates.*.aspek'     => 'required|string',
            'templates.*.grade'     => 'required|in:A,B,C,D,E',
            'templates.*.deskripsi' => 'required|string',
        ]);

        foreach ($request->templates as $item) {

            // =========================
            // WHERE CONDITION
            // =========================
            $where = [
                'jenis' => $request->jenis,
                'aspek' => $item['aspek'],
                'grade' => $item['grade'],
            ];

            // =========================
            // DATA UPDATE / INSERT
            // =========================
            $data = [
                'deskripsi' => $item['deskripsi'],
            ];

            // =========================
            // KOKURIKULER → PER GURU
            // =========================
            if ($request->jenis === 'kokurikuler') {

                $where['guru_id'] = $guru->id;
                $data['guru_id']  = $guru->id;
            }

            // =========================
            // EKSTRAKURIKULER → GLOBAL
            // TETAP ISI guru_id AGAR TIDAK NULL
            // =========================
            if ($request->jenis === 'ekstrakurikuler') {

                $data['guru_id'] = $guru->id;
            }

            TemplateDeskripsi::updateOrCreate(
                $where,
                $data
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Template deskripsi berhasil disimpan.',
        ]);
    }
}