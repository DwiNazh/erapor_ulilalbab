<?php

namespace App\Http\Controllers\Api\Tu;

use App\Http\Controllers\Controller;
use App\Models\SiswaTahun;
use Illuminate\Http\Request;

class AkademikController extends Controller
{
public function getSiswaByRombel(Request $request, $rombelId)
{
    $rombel = \App\Models\Rombel::findOrFail($rombelId);
    if (!$request->user()->bolehJenjang($rombel->jenjang_id)) {
        return response()->json([
            'success' => false,
            'message' => 'Anda tidak memiliki hak akses ke rombel ini'
        ], 403);
    }

    $data = SiswaTahun::with('siswa')
        ->where('rombel_id', $rombelId)
        ->whereHas('tahunAjaran', function ($q) {
            $q->where('aktif', true);
        })
        ->get()
        ->pluck('siswa');

    return response()->json([
        'success' => true,
        'data' => $data
    ]);
}
}
