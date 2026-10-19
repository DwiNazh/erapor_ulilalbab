<?php

namespace App\Http\Controllers\Api\gurusd;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PenilaianQuranController extends Controller
{
    // Ambil template deskripsi berdasarkan jenis (tahfidz / tilawah)
    public function getTemplateQuran(Request $request)
    {
        $request->validate([
            'jenis' => 'required|in:tahfidz,tilawah'
        ]);

        $templates = DB::table('template_deskripsi')
            ->where('jenis', $request->jenis) // dinamis berdasarkan jenis
            ->orderBy('min')
            ->get(['id', 'min', 'max', 'deskripsi']);

        return response()->json(['success' => true, 'data' => $templates]);
    }

    // Dipakai wali kelas — lihat rekap nilai (di-filter per jenis)
    public function getNilai(Request $request)
    {
        $request->validate([
            'semester'     => 'required|in:1,2',
            'tahun_ajaran' => 'required|string',
            'rombel_id'    => 'required|integer',
            'jenis'        => 'required|in:tahfidz,tilawah', // Tambihan parameter jenis
        ]);

        $guruId   = Auth::id();
        $rombelId = (int) $request->rombel_id;
        $semester = $request->semester;
        $tahun    = $request->tahun_ajaran;
        $jenis    = $request->jenis;

        $this->otorisasiWaliKelas($rombelId, $guruId);

        $tahunAjaran = DB::table('tahun_ajaran')->where('nama', $tahun)->first();
        if (!$tahunAjaran) {
            return response()->json(['success' => true, 'data' => []]);
        }

        $siswaIds = DB::table('siswa_tahun')
            ->where('rombel_id', $rombelId)
            ->where('tahun_ajaran_id', $tahunAjaran->id)
            ->whereIn('status', ['AKTIF', 'SELESAI'])
            ->pluck('siswa_id');

        if ($siswaIds->isEmpty()) {
            return response()->json(['success' => true, 'data' => []]);
        }

        $nilaiList = DB::table('nilai_quran')
            ->whereIn('siswa_id', $siswaIds)
            ->where('semester', $semester)
            ->where('tahun_ajaran', $tahun)
            ->where('jenis', $jenis) // Filter jenis di DB jika ada kolomnya
            ->get(['siswa_id','uh1','uh2','uh3','uh4','uh5','pts','pas','deskripsi']);

        $formatted = $nilaiList->map(fn($n) => [
            'siswa_id'  => $n->siswa_id,
            'deskripsi' => $n->deskripsi ?? null,
            'nilai'     => [
                $n->uh1 ?? "",
                $n->uh2 ?? "",
                $n->uh3 ?? "",
                $n->uh4 ?? "",
                $n->uh5 ?? "",
                $n->pts ?? "",
                $n->pas ?? "",
            ],
        ]);

        return response()->json(['success' => true, 'data' => $formatted]);
    }

    // Dipakai guru quran — input nilai kelompok per jenis
    public function simpanNilaiKelompok(Request $request)
    {
        $validated = $request->validate([
            'kelompok_quran_id'  => 'required|integer|exists:kelompok_quran,id',
            'semester'           => 'required|in:1,2',
            'tahun_ajaran'       => 'required|string|max:20',
            'jenis'              => 'required|in:tahfidz,tilawah', // Validasi jenis pecahan
            'nilai'              => 'required|array|min:1',
            'nilai.*.siswa_id'   => 'required|integer|exists:siswa,id',
            'nilai.*.uh1'        => 'nullable|integer|min:0|max:100',
            'nilai.*.uh2'        => 'nullable|integer|min:0|max:100',
            'nilai.*.uh3'        => 'nullable|integer|min:0|max:100',
            'nilai.*.uh4'        => 'nullable|integer|min:0|max:100',
            'nilai.*.uh5'        => 'nullable|integer|min:0|max:100',
            'nilai.*.pts'        => 'nullable|integer|min:0|max:100',
            'nilai.*.pas'        => 'nullable|integer|min:0|max:100',
        ]);

        $isGuru = DB::table('kelompok_quran')
            ->where('id', $validated['kelompok_quran_id'])
            ->where('guru_id', Auth::id())
            ->exists();

        if (!$isGuru) abort(403, 'Kelompok ini bukan milik Anda.');

        $now = now();

        DB::transaction(function () use ($validated, $now) {
            foreach ($validated['nilai'] as $item) {
                DB::table('nilai_quran')->updateOrInsert(
                    [
                        'siswa_id'          => $item['siswa_id'],
                        'kelompok_quran_id' => $validated['kelompok_quran_id'],
                        'semester'          => $validated['semester'],
                        'tahun_ajaran'      => $validated['tahun_ajaran'],
                        'jenis'             => $validated['jenis'], // Kunci pembeda baris data
                    ],
                    [
                        'uh1'        => $item['uh1'] ?? null,
                        'uh2'        => $item['uh2'] ?? null,
                        'uh3'        => $item['uh3'] ?? null,
                        'uh4'        => $item['uh4'] ?? null,
                        'uh5'        => $item['uh5'] ?? null,
                        'pts'        => $item['pts'] ?? null,
                        'pas'        => $item['pas'] ?? null,
                        'updated_at' => $now,
                        'created_at' => $now,
                    ]
                );
            }
        });

        return response()->json([
            'success' => true,
            'message' => "Nilai " . ucfirst($validated['jenis']) . " kelompok berhasil disimpan.",
        ]);
    }

    private function otorisasiWaliKelas(int $rombelId, int $guruId): void
    {
        $isWali = DB::table('rombel')
            ->where('id', $rombelId)
            ->where('guru_id', $guruId)
            ->exists();

        if (!$isWali) abort(403, 'Anda bukan wali kelas dari rombel ini.');
    }
}