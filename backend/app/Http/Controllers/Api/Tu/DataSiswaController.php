<?php

namespace App\Http\Controllers\Api\Tu;

use App\Http\Controllers\Controller;
use App\Models\Siswa;      // tabel siswa lama
use App\Models\SiswaBaru;  // tabel siswas baru
use App\Models\SiswaTahun; // tabel relasi siswa per tahun
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;   // ← TAMBAHKAN BARIS INI
use App\Models\TahunAjaran;  // ← TAMBAHKAN BARIS INI

class DataSiswaController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $jenjangIds = $user ? $user->jenjangIds() : null;

        $query = DB::table('siswa_tahun')
            ->join('siswa', 'siswa_tahun.siswa_id', '=', 'siswa.id')
            ->leftJoin('rombel', 'siswa_tahun.rombel_id', '=', 'rombel.id')
            ->join('tahun_ajaran', 'siswa_tahun.tahun_ajaran_id', '=', 'tahun_ajaran.id')
            ->when($jenjangIds !== null, fn ($q) => $q->whereIn('siswa_tahun.jenjang_id', $jenjangIds))
            ->select(
                'siswa.id as siswa_id',
                'siswa.nama',
                'siswa.nis',
                'siswa.kategori',
                'rombel.kelompok_gender',
                'rombel.jenjang_id',
                DB::raw('COALESCE(rombel.tingkat_kelas, siswa.kelas) as kelas'),
                DB::raw('COALESCE(rombel.tingkat_kelas, siswa.kelas) as tingkat_kelas'),
                'siswa_tahun.is_processed',
                DB::raw('COALESCE(rombel.sub_nama, siswa.sub) as sub_nama'),
                'rombel.nama_rombel',
                'tahun_ajaran.id as tahun_ajaran_id',
                'tahun_ajaran.nama as tahun_ajaran',
                'tahun_ajaran.aktif as tahun_aktif'
            )
            ->orderBy('tahun_ajaran.nama', 'desc')
            ->orderBy('rombel.tingkat_kelas', 'asc')
            ->orderBy('siswa.nama', 'asc');

        $data = $query->get();

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    public function show($id)
    {
        try {
            $user = request()->user();

            // Cek siswa baru dulu
            $siswa = SiswaBaru::where('id', $id)
                ->where('is_processed', 1)
                ->first();

            if ($siswa) {
                if (!$user || !$user->bolehJenjang($siswa->jenjang_id)) {
                    return response()->json([
                        'message' => 'Data siswa tidak ditemukan'
                    ], 404);
                }
            } else {
                // Jika tidak ada, cek siswa lama
                $siswa = Siswa::where('id', $id)->first();
                if ($siswa) {
                    if (!$this->siswaBolehDiakses($siswa->id)) {
                        return response()->json([
                            'message' => 'Data siswa tidak ditemukan'
                        ], 404);
                    }

                    $latestSt = SiswaTahun::where('siswa_id', $siswa->id)
                        ->orderByDesc('id')
                        ->with('rombel')
                        ->first();
                    if ($latestSt && $latestSt->rombel) {
                        $siswa->kelas = $latestSt->rombel->tingkat_kelas ?? $siswa->kelas;
                        $siswa->sub = $latestSt->rombel->sub_nama ?? $siswa->sub;
                    }
                }
            }

            if (!$siswa) {
                return response()->json([
                    'message' => 'Data siswa tidak ditemukan'
                ], 404);
            }

            return response()->json($siswa, 200);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('DataSiswa show: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal memuat detail siswa'], 500);
        }
    }

    public function updateKategori(Request $request, $id)
    {
        $data = $request->validate([
            'kategori' => 'required|in:ikhwan,akhwat',
        ]);

        $siswa = Siswa::findOrFail($id);

        if (!$this->siswaBolehDiakses($siswa->id)) {
            return response()->json(['message' => 'Data siswa tidak ditemukan'], 404);
        }

        if ($this->bentrokDenganRombel($siswa->id, $data['kategori'])) {
            return response()->json([
                'success' => false,
                'message' => 'Siswa sudah ditempatkan di rombel dengan kategori berbeda. Pindahkan dulu dari rombel tersebut.',
            ], 422);
        }

        $siswa->kategori = $data['kategori'];
        $siswa->save();

        return response()->json([
            'success' => true,
            'message' => 'Kategori disimpan',
            'data' => ['id' => $siswa->id, 'kategori' => $siswa->kategori],
        ]);
    }


    public function updateKategoriBulk(Request $request)
    {
        $request->validate([
            'data' => 'required|array|min:1|max:500',
            'data.*.nis' => 'required',
            'data.*.kategori' => 'required|in:ikhwan,akhwat',
        ]);

        $diperbarui = 0;
        $tidakDitemukan = [];
        $ditolakBentrok = [];

        DB::transaction(function () use ($request, &$diperbarui, &$tidakDitemukan, &$ditolakBentrok) {
            foreach ($request->input('data') as $row) {
                $siswa = Siswa::where('nis', $row['nis'])->first();
                if (!$siswa) {
                    $tidakDitemukan[] = $row['nis'];
                    continue;
                }
                if (!$this->siswaBolehDiakses($siswa->id)) {
                    $tidakDitemukan[] = $row['nis'];
                    continue;
                }
                if ($this->bentrokDenganRombel($siswa->id, $row['kategori'])) {
                    $ditolakBentrok[] = $row['nis'];
                    continue;
                }
                $siswa->kategori = $row['kategori'];
                $siswa->save();
                $diperbarui++;
            }
        });

        return response()->json([
            'success' => true,
            'message' => "{$diperbarui} siswa diperbarui",
            'diperbarui' => $diperbarui,
            'tidak_ditemukan' => $tidakDitemukan,
            'ditolak_bentrok' => $ditolakBentrok,
        ]);
    }

    private function siswaBolehDiakses(int $siswaId): bool {
        $user = request()->user();
        if (!$user) return false;
        if ($user->isSuperadmin()) return true;
        return SiswaTahun::untukUser($user)->where('siswa_id', $siswaId)->exists();
    }

    private function bentrokDenganRombel(int $siswaId, string $kategori): bool
    {
        return SiswaTahun::where('siswa_id', $siswaId)
            ->whereHas('rombel', function ($q) use ($kategori) {
                $q->whereIn('kelompok_gender', ['ikhwan', 'akhwat'])
                    ->where('kelompok_gender', '!=', $kategori);
            })
            ->exists();
    }
}
