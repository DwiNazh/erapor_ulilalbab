<?php

namespace App\Http\Controllers\Api\gurusd;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\NilaiQuran;
use App\Models\KelompokQuran;

class KelompokQuranGuruController extends Controller
{
    public function kelompokSaya(Request $request)
    {
        $request->validate([
            'tahun_ajaran_id' => 'required',
            'semester'        => 'required'
        ]);

        $guruId   = auth()->id();
        $tahunId  = $request->tahun_ajaran_id;
        $semester = ucfirst(strtolower(trim($request->semester)));

        $kelompok = KelompokQuran::where('guru_id', $guruId)
            ->where('tahun_ajaran_id', $tahunId)
            ->where('semester', $semester)
            ->orderBy('label')
            ->get()
            ->map(fn($k) => [
                'id'    => $k->id,
                'label' => $k->label,
            ]);

        return response()->json(['success' => true, 'data' => $kelompok]);
    }

    /**
     * GET /api/guru/quran/kelompok/{kelompokId}/siswa
     *
     * PERUBAHAN: sekarang join lewat siswa_tahun, bukan langsung ke siswa.
     * Ini memastikan siswa yang ditampilkan memang benar-benar terdaftar
     * aktif di tahun_ajaran_id milik kelompok tersebut. Kalau ada anggota
     * kelompok yang siswanya sudah pindah/keluar/belum diproses ke
     * siswa_tahun, dia tidak akan muncul di daftar penilaian.
     */
    public function siswaKelompok($kelompokId)
    {
        $kelompok = $this->otorisasiGuru($kelompokId);

        $siswa = DB::table('anggota_kelompok_quran')
            ->join('siswa_tahun', function ($join) use ($kelompok) {
                $join->on('siswa_tahun.siswa_id', '=', 'anggota_kelompok_quran.siswa_id')
                     ->where('siswa_tahun.tahun_ajaran_id', '=', $kelompok->tahun_ajaran_id)
                     ->whereIn('siswa_tahun.status', ['AKTIF', 'SELESAI']);
            })
            ->join('siswa', 'siswa.id', '=', 'siswa_tahun.siswa_id')
            ->where('anggota_kelompok_quran.kelompok_quran_id', $kelompokId)
            ->select('siswa.id', 'siswa.nama', 'siswa.nis')
            ->distinct()
            ->orderBy('siswa.nama')
            ->get();

        return response()->json(['success' => true, 'data' => $siswa]);
    }

    public function getNilaiKelompok(Request $request)
    {
        $request->validate([
            'kelompok_id'  => 'required|integer',
            'semester'     => 'required|string',
            'tahun_ajaran' => 'required|string',
            'jenis'        => 'required|in:tahfidz,tilawah',
        ]);

        $this->otorisasiGuru($request->kelompok_id);

        $nilai = NilaiQuran::where('kelompok_quran_id', $request->kelompok_id)
            ->where('semester', $request->semester)
            ->where('tahun_ajaran', $request->tahun_ajaran)
            ->where('jenis', $request->jenis)
            ->get()
            ->map(function ($n) {
                return [
                    'siswa_id'  => $n->siswa_id,
                    'nilai'     => [
                        $n->uh1 ?? '',
                        $n->uh2 ?? '',
                        $n->uh3 ?? '',
                        $n->uh4 ?? '',
                        $n->uh5 ?? '',
                        $n->pts ?? '',
                        $n->pas ?? '',
                    ],
                    'deskripsi' => $n->deskripsi,
                ];
            });

        return response()->json(['success' => true, 'data' => $nilai]);
    }

    /**
     * POST /api/guru/quran/nilai
     *
     * PERUBAHAN: sebelum menyimpan, siswa_id yang dikirim frontend
     * divalidasi dulu terhadap siswa_tahun (harus terdaftar aktif di
     * tahun_ajaran_id milik kelompok ini). Kalau ada siswa_id yang tidak
     * valid (mis. sudah pindah kelas/keluar), baris itu DILEWATI, bukan
     * membatalkan seluruh proses simpan.
     */
    public function simpanNilaiErapor(Request $request)
    {
        $request->validate([
            'kelompok_id'      => 'required|integer',
            'semester'         => 'required|string',
            'tahun_ajaran'     => 'required|string',
            'jenis'            => 'required|in:tahfidz,tilawah',
            'nilai'            => 'required|array',
            'nilai.*.siswa_id' => 'required',
            'nilai.*.uh1'      => 'nullable|integer|min:0|max:100',
            'nilai.*.uh2'      => 'nullable|integer|min:0|max:100',
            'nilai.*.uh3'      => 'nullable|integer|min:0|max:100',
            'nilai.*.uh4'      => 'nullable|integer|min:0|max:100',
            'nilai.*.uh5'      => 'nullable|integer|min:0|max:100',
            'nilai.*.pts'      => 'nullable|integer|min:0|max:100',
            'nilai.*.pas'      => 'nullable|integer|min:0|max:100',
        ]);

        $kelompok = $this->otorisasiGuru($request->kelompok_id);

        // Ambil daftar siswa_id yang SAH untuk kelompok ini, berdasarkan
        // keanggotaan di anggota_kelompok_quran DAN keaktifan di siswa_tahun
        // pada tahun_ajaran_id milik kelompok tersebut.
        $siswaIdsValid = DB::table('anggota_kelompok_quran')
            ->join('siswa_tahun', function ($join) use ($kelompok) {
                $join->on('siswa_tahun.siswa_id', '=', 'anggota_kelompok_quran.siswa_id')
                     ->where('siswa_tahun.tahun_ajaran_id', '=', $kelompok->tahun_ajaran_id)
                     ->whereIn('siswa_tahun.status', ['AKTIF', 'SELESAI']);
            })
            ->where('anggota_kelompok_quran.kelompok_quran_id', $request->kelompok_id)
            ->pluck('anggota_kelompok_quran.siswa_id')
            ->unique()
            ->toArray();

        $disimpan = 0;
        $dilewati = 0;

        DB::beginTransaction();
        try {
            foreach ($request->nilai as $row) {
                if (!in_array($row['siswa_id'], $siswaIdsValid)) {
                    Log::warning('Siswa tidak valid/tidak aktif di siswa_tahun untuk kelompok ini', [
                        'siswa_id'        => $row['siswa_id'],
                        'kelompok_id'     => $request->kelompok_id,
                        'tahun_ajaran_id' => $kelompok->tahun_ajaran_id,
                    ]);
                    $dilewati++;
                    continue;
                }

                NilaiQuran::updateOrCreate(
                    [
                        'kelompok_quran_id' => $request->kelompok_id,
                        'siswa_id'          => $row['siswa_id'],
                        'semester'          => $request->semester,
                        'tahun_ajaran'      => $request->tahun_ajaran,
                        'jenis'             => $request->jenis, // Kunci filter unik
                    ],
                    [
                        'uh1'       => $row['uh1'] ?? null,
                        'uh2'       => $row['uh2'] ?? null,
                        'uh3'       => $row['uh3'] ?? null,
                        'uh4'       => $row['uh4'] ?? null,
                        'uh5'       => $row['uh5'] ?? null,
                        'pts'       => $row['pts'] ?? null,
                        'pas'       => $row['pas'] ?? null,
                        'deskripsi' => $row['deskripsi'] ?? null,
                    ]
                );

                $disimpan++;
            }
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Nilai " . ucfirst($request->jenis) . " kelompok berhasil disimpan "
                    . "({$disimpan} siswa" . ($dilewati > 0 ? ", {$dilewati} dilewati karena tidak terdaftar aktif" : "") . ")",
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal: ' . $e->getMessage(),
            ], 500);
        }
    }

    private function otorisasiGuru($kelompokId)
    {
        $kelompok = KelompokQuran::where('id', $kelompokId)
            ->where('guru_id', auth()->id())
            ->first();

        if (! $kelompok) {
            abort(403, 'Anda tidak memiliki akses ke kelompok ini.');
        }

        return $kelompok;
    }
}