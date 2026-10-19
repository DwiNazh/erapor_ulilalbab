<?php

namespace App\Http\Controllers\Api\Tu;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TahunAjaran;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TahunAjaranController extends Controller
{
    public function index()
    {
        $query = TahunAjaran::orderBy('nama', 'desc');
        $allYears = $query->get();

        Log::info('TahunAjaranController@index', [
            'returned_count' => $allYears->count(),
            'years' => $allYears->pluck('nama', 'id', 'aktif')->toArray(),
            'user_id' => auth()->id() ?? 'guest',
            'request_url' => request()->fullUrl(),
        ]);

        return response()->json([
            'success' => true,
            'data'    => $allYears,
        ]);
    }

public function store(Request $request)
{
    $request->merge(['nama' => trim($request->nama ?? '')]);

    $validated = $request->validate([
        'nama' => [
            'required',
            'string',
            'regex:/^\d{4}\/\d{4}$/',           // contoh: 2026/2027
            'unique:tahun_ajaran,nama',         // pastikan nama tabel benar
        ],
    ]);

    $tahun = TahunAjaran::create([
        'nama'           => $validated['nama'],
        'status'         => 'draft',
        'aktif'          => 0,
        'semester_aktif' => null,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Tahun ajaran berhasil dibuat',
        'data'    => $tahun
    ], 201);
}

    public function aktifkan($id)
    {
        $tahunTarget = TahunAjaran::findOrFail($id);

        DB::transaction(function () use ($id) {
            TahunAjaran::where('aktif', 1)
                ->where('id', '!=', $id)
                ->update([
                    'aktif'  => 0,
                    'status' => 'dikunci'
                ]);

            $tahun = TahunAjaran::findOrFail($id);
            $tahun->update([
                'aktif'          => 1,
                'status'         => 'aktif',
                'semester_aktif' => 'ganjil'
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Tahun ajaran berhasil diaktifkan',
            'data' => $tahunTarget->fresh()
        ]);
    }

    public function tutup($id)
    {
        $tahun = TahunAjaran::findOrFail($id);

        if ($tahun->status === 'dikunci') {
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran ini sudah dikunci'
            ], 422);
        }

        if (!$tahun->aktif) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya tahun ajaran aktif yang dapat ditutup'
            ], 422);
        }

        // Validasi proses kenaikan kelas selesai
        if (!$tahun->finalized_at) {
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran ini belum difinalisasi. Selesaikan proses kenaikan kelas terlebih dahulu.'
            ], 422);
        }

        $tahun->update([
            'aktif'  => 0,
            'status' => 'dikunci'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tahun ajaran berhasil ditutup dan dikunci'
        ]);
    }

    public function aktif(Request $request)
    {
        $tahun = TahunAjaran::where('aktif', 1)->first();

        if ($tahun) {
            $user = $request->user();
            $jenjangId = ($user && !$user->isSuperadmin()) ? $user->jenjang_id : null;
            if ($jenjangId) {
                $isFinalizedJenjang = $tahun->isFinalizedForJenjang($jenjangId);
                $finalizedAtJenjang = $tahun->finalizedAtForJenjang($jenjangId);
                $tahun->is_finalized = $isFinalizedJenjang;
                $tahun->finalized_at = $finalizedAtJenjang;
                $tahun->kenaikan_kelas_finalized_at = $finalizedAtJenjang;
            }
        }

        return response()->json([
            'success' => true,
            'data' => $tahun,
            'message' => $tahun ? null : 'Belum ada tahun ajaran aktif'
        ]);
    }

    public function gantiSemester(Request $request, $id)
    {
        $request->validate([
            'semester' => 'required|in:ganjil,genap'
        ]);

        $tahun = TahunAjaran::findOrFail($id);

        if (!$tahun->aktif) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya tahun ajaran aktif yang dapat mengganti semester'
            ], 422);
        }

        $tahun->update(['semester_aktif' => $request->semester]);

        return response()->json([
            'success' => true,
            'message' => 'Semester berhasil diubah'
        ]);
    }
}