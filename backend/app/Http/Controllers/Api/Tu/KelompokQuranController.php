<?php

namespace App\Http\Controllers\Api\Tu;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\User;
use App\Models\Siswa;
use App\Models\KelompokQuran;
use App\Models\KelompokQuranAnggota;
use App\Models\TahunAjaran;
use App\Models\SiswaTahun;

class KelompokQuranController extends Controller
{
    private function guruBoleh($guruId): bool
    {
        $user = request()->user();
        $guru = User::where('id', $guruId)->where('role', 'guru')->first();
        return $guru && $user && $user->bolehJenjang($guru->jenjang_id);
    }

    private function kelompokBoleh(KelompokQuran $k): bool
    {
        return $this->guruBoleh($k->guru_id);
    }

    /*
    |--------------------------------------------------------------------------
    | LIST KELOMPOK
    |--------------------------------------------------------------------------
    |*/
    /*
        |--------------------------------------------------------------------------
        | LIST KELOMPOK (FIXED KONTINUITAS KELAS AKTIF)
        |--------------------------------------------------------------------------
        |*/
    public function index(Request $request)
    {
        $tahunId = $request->tahun_ajaran_id;
        $semester = ucfirst(strtolower(trim($request->semester)));

        $kelompok = KelompokQuran::with(['guru:id,name'])
            ->whereHas('guru', function ($q) use ($request) {
                $ids = $request->user()->jenjangIds();
                if ($ids !== null) {
                    $q->whereIn('jenjang_id', $ids);
                }
            })
            ->where('tahun_ajaran_id', $tahunId)
            ->where('semester', $semester)
            ->orderBy('label')
            ->get()
            ->map(function ($k) use ($tahunId) {
                // Ambil anggota kelompok dan gabungkan dengan tingkat kelas aktif dari siswa_tahun
                $anggotaSiswa = DB::table('anggota_kelompok_quran')
                    ->join('siswa', 'anggota_kelompok_quran.siswa_id', '=', 'siswa.id')
                    ->join('siswa_tahun', function ($join) use ($tahunId) {
                    $join->on('siswa.id', '=', 'siswa_tahun.siswa_id')
                        ->where('siswa_tahun.tahun_ajaran_id', '=', $tahunId);
                })
                    ->leftJoin('rombel', 'siswa_tahun.rombel_id', '=', 'rombel.id')
                    ->where('anggota_kelompok_quran.kelompok_quran_id', $k->id)
                    ->select([
                        'siswa.id',
                        'siswa.nama',
                        'siswa.nis',
                        'siswa.nisn',
                        DB::raw("CONCAT(rombel.tingkat_kelas, rombel.sub_nama) as kelas_aktif")
                    ])
                    ->orderBy('siswa.nama', 'asc')
                    ->get();

                return [
                    'id' => $k->id,
                    'label' => $k->label,
                    'guru_id' => $k->guru_id,
                    'guru' => $k->guru,
                    'anggota' => $anggotaSiswa->map(function ($a) {
                        return [
                            'id' => $a->id,
                            'nama' => $a->nama,
                            'kelas' => $a->kelas_aktif, // Menggunakan kelas aktif tahun ajaran berjalan
                            'nis' => $a->nis,
                            'nisn' => $a->nisn,
                        ];
                    }),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $kelompok
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | TAMBAH KELOMPOK
    |--------------------------------------------------------------------------
    |*/
    public function store(Request $request)
    {
        $request->validate([
            'guru_id' => 'required|exists:users,id',
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
            'semester' => 'required|in:Ganjil,Genap,ganjil,genap',
        ]);

        $guru = User::where('id', $request->guru_id)
            ->where('role', 'guru')
            ->first();

        if (!$guru) {
            return response()->json([
                'message' => 'User bukan guru'
            ], 422);
        }

        if (!$this->guruBoleh($request->guru_id)) {
            return response()->json(['success' => false, 'message' => 'Guru tidak ditemukan.'], 404);
        }

        // Standarkan format sebelum melakukan pengecekan data di database
        $semester = ucfirst(strtolower(trim($request->semester)));

        // Ambil label yang sudah terpakai oleh guru ini agar penentuan huruf tidak bentrok
        $labelTerpakai = KelompokQuran::where('guru_id', $request->guru_id)
            ->where('tahun_ajaran_id', $request->tahun_ajaran_id)
            ->where('semester', $semester)
            ->pluck('label')
            ->toArray();

        if (count($labelTerpakai) >= 3) {
            return response()->json([
                'message' => 'Guru maksimal mengajar 3 kelompok'
            ], 422);
        }

        // Cari label alfabet yang masih tersedia
        $labelPilihan = ['A', 'B', 'C'];
        $label = null;
        foreach ($labelPilihan as $p) {
            if (!in_array($p, $labelTerpakai)) {
                $label = $p;
                break;
            }
        }

        $kelompok = KelompokQuran::create([
            'guru_id' => $request->guru_id,
            'tahun_ajaran_id' => $request->tahun_ajaran_id,
            'semester' => $semester, // Disimpan dalam format seragam (Ganjil / Genap)
            'label' => $label,
            'aktif' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kelompok berhasil dibuat',
            'data' => $kelompok
        ]);
    }

    /*
       |--------------------------------------------------------------------------
       | HAPUS KELOMPOK
       |--------------------------------------------------------------------------
       |*/
    public function destroy($id)
    {
        // Temukan data kelompok berdasarkan ID
        $kelompok = KelompokQuran::findOrFail($id);

        if (!$this->kelompokBoleh($kelompok)) {
            return response()->json(['success' => false, 'message' => 'Kelompok tidak ditemukan.'], 404);
        }

        // Bersihkan data menggunakan DB::table untuk menghindari dependensi Model Anggota
        DB::transaction(function () use ($kelompok) {
            DB::table('anggota_kelompok_quran')->where('kelompok_quran_id', $kelompok->id)->delete();
            $kelompok->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Kelompok dan seluruh anggotanya berhasil dihapus'
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | TAMBAH ANGGOTA (PLOTTING SISWA)
    |--------------------------------------------------------------------------
    |*/
    public function tambahAnggota(Request $request, $id)
    {
        $request->validate([
            'siswa_ids' => 'required|array',
            'siswa_ids.*' => 'exists:siswa,id',
        ]);

        $kelompok = KelompokQuran::findOrFail($id);

        if (!$this->kelompokBoleh($kelompok)) {
            return response()->json(['success' => false, 'message' => 'Kelompok tidak ditemukan.'], 404);
        }

        $idsUnik = array_values(array_unique($request->siswa_ids));
        $valid = SiswaTahun::untukUser($request->user())->where('tahun_ajaran_id', $kelompok->tahun_ajaran_id)->whereIn('siswa_id', $idsUnik)->distinct()->count('siswa_id');
        if ($valid !== count($idsUnik)) {
            return response()->json(['success' => false, 'message' => 'Ada siswa di luar jenjang Anda atau tanpa data tahun ajaran ini.'], 403);
        }

        // Hitung anggota saat ini
        $jumlahSaatIni = DB::table('anggota_kelompok_quran')
            ->where('kelompok_quran_id', $kelompok->id)
            ->count();

        // Hitung siswa baru yang belum ada di kelompok manapun (yang benar-benar akan diinsert)
        $siswaBaruIds = [];
        foreach ($request->siswa_ids as $siswaId) {
            $sudahAda = DB::table('anggota_kelompok_quran')
                ->join('kelompok_quran', 'anggota_kelompok_quran.kelompok_quran_id', '=', 'kelompok_quran.id')
                ->where('anggota_kelompok_quran.siswa_id', $siswaId)
                ->where('kelompok_quran.tahun_ajaran_id', $kelompok->tahun_ajaran_id)
                ->where('kelompok_quran.semester', $kelompok->semester)
                ->exists();

            if (!$sudahAda) {
                $siswaBaruIds[] = $siswaId;
            }
        }

        // Cek apakah total melebihi batas
        $KAPASITAS_MAKS = 15;
        if (($jumlahSaatIni + count($siswaBaruIds)) > $KAPASITAS_MAKS) {
            $sisaBisa = $KAPASITAS_MAKS - $jumlahSaatIni;
            return response()->json([
                'success' => false,
                'message' => "Kelompok sudah penuh atau melebihi kapasitas. Sisa slot: {$sisaBisa} siswa."
            ], 422);
        }

        DB::transaction(function () use ($siswaBaruIds, $kelompok) {
            foreach ($siswaBaruIds as $siswaId) {
                DB::table('anggota_kelompok_quran')->insert([
                    'kelompok_quran_id' => $kelompok->id,
                    'siswa_id' => $siswaId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        });

        return response()->json([
            'success' => true,
            'message' => count($siswaBaruIds) . ' siswa berhasil dimasukkan ke dalam kelompok'
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | HAPUS ANGGOTA (DINAMIS / KELUARKAN SISWA)
    |--------------------------------------------------------------------------
    |*/
    public function hapusAnggota($kelompokId, $siswaId)
    {
        $kelompok = KelompokQuran::findOrFail($kelompokId);
        if (!$this->kelompokBoleh($kelompok)) {
            return response()->json(['success' => false, 'message' => 'Kelompok tidak ditemukan.'], 404);
        }

        // Hapus baris siswa dari tabel jembatan secara langsung
        DB::table('anggota_kelompok_quran')
            ->where('kelompok_quran_id', $kelompokId)
            ->where('siswa_id', $siswaId)
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Siswa berhasil dikeluarkan dari kelompok'
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | PINDAH KELOMPOK
    |--------------------------------------------------------------------------
    |*/
    public function pindahKelompok(Request $request)
    {
        $request->validate([
            'siswa_id' => 'required|exists:siswa,id',
            'dari_kelompok_id' => 'required|exists:kelompok_quran,id',
            'ke_kelompok_id' => 'required|exists:kelompok_quran,id|different:dari_kelompok_id',
        ]);

        $dariKelompok = KelompokQuran::find($request->dari_kelompok_id);
        $keKelompok = KelompokQuran::find($request->ke_kelompok_id);

        if (!$dariKelompok || !$this->kelompokBoleh($dariKelompok) || !$keKelompok || !$this->kelompokBoleh($keKelompok)) {
            return response()->json(['success' => false, 'message' => 'Kelompok tidak ditemukan.'], 404);
        }

        if ($dariKelompok->tahun_ajaran_id !== $keKelompok->tahun_ajaran_id || $dariKelompok->semester !== $keKelompok->semester) {
            return response()->json(['success' => false, 'message' => 'Tahun ajaran dan semester kelompok harus sama.'], 422);
        }

        $adaDiAsal = DB::table('anggota_kelompok_quran')
            ->where('kelompok_quran_id', $request->dari_kelompok_id)
            ->where('siswa_id', $request->siswa_id)
            ->exists();

        if (!$adaDiAsal) {
            return response()->json([
                'success' => false,
                'message' => 'Siswa tidak ditemukan di kelompok asal'
            ], 422);
        }

        $sudahDiTujuan = DB::table('anggota_kelompok_quran')
            ->where('kelompok_quran_id', $request->ke_kelompok_id)
            ->where('siswa_id', $request->siswa_id)
            ->exists();

        if ($sudahDiTujuan) {
            return response()->json([
                'success' => false,
                'message' => 'Siswa sudah terdaftar di kelompok tujuan'
            ], 422);
        }

        // Cek kapasitas kelompok tujuan
        $jumlahTujuan = DB::table('anggota_kelompok_quran')
            ->where('kelompok_quran_id', $request->ke_kelompok_id)
            ->count();

        if ($jumlahTujuan >= 15) {
            return response()->json([
                'success' => false,
                'message' => 'Kelompok tujuan sudah penuh (maksimal 15 siswa)'
            ], 422);
        }

        DB::transaction(function () use ($request) {
            DB::table('anggota_kelompok_quran')
                ->where('kelompok_quran_id', $request->dari_kelompok_id)
                ->where('siswa_id', $request->siswa_id)
                ->delete();

            DB::table('anggota_kelompok_quran')->insert([
                'kelompok_quran_id' => $request->ke_kelompok_id,
                'siswa_id' => $request->siswa_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Siswa berhasil dipindahkan'
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | AKTIFKAN KELOMPOK
    |--------------------------------------------------------------------------
    |*/
    public function aktifkan(Request $request)
    {
        $request->validate([
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
            'semester' => 'required|in:Ganjil,Genap,ganjil,genap',
        ]);

        $semester = ucfirst(strtolower(trim($request->semester)));

        KelompokQuran::where('tahun_ajaran_id', $request->tahun_ajaran_id)
            ->where('semester', $semester)
            ->whereHas('guru', function ($q) use ($request) {
                $ids = $request->user()->jenjangIds();
                if ($ids !== null) {
                    $q->whereIn('jenjang_id', $ids);
                }
            })
            ->update([
                'aktif' => true,
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Kelompok berhasil diaktifkan'
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | AMBIL TAHUN AJARAN AKTIF SISTEM
    |--------------------------------------------------------------------------
    |*/
    public function aktif()
    {
        $tahunAktif = TahunAjaran::where('aktif', true)->first();

        if (!$tahunAktif) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada tahun ajaran yang aktif'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $tahunAktif->id,
                'nama' => $tahunAktif->nama,
                'semester_aktif' => $tahunAktif->semester_aktif,
                'status' => $tahunAktif->status,
            ]
        ]);
    }
    /*
    |--------------------------------------------------------------------------
    | AMBIL SISWA AKTIF YANG BELUM PUNYA KELOMPOK QURAN (KELAS 1 - 5)
    |--------------------------------------------------------------------------
    |*/

    public function siswaBelumPlot(Request $request)
    {
        $user = $request->user();
        $tahunId = $request->tahun_ajaran_id;
        $semester = ucfirst(strtolower(trim($request->semester)));

        $siswaSudahPlotIds = DB::table('anggota_kelompok_quran')
            ->join('kelompok_quran', 'anggota_kelompok_quran.kelompok_quran_id', '=', 'kelompok_quran.id')
            ->where('kelompok_quran.tahun_ajaran_id', $tahunId)
            ->where('kelompok_quran.semester', $semester)
            ->pluck('anggota_kelompok_quran.siswa_id')
            ->toArray();

        $query = DB::table('siswa_tahun')
            ->join('siswa', 'siswa_tahun.siswa_id', '=', 'siswa.id') // ← tabel 'siswa', bukan 'siswas'
            ->leftJoin('rombel', 'siswa_tahun.rombel_id', '=', 'rombel.id')
            ->where('siswa_tahun.tahun_ajaran_id', $tahunId)
            ->where('siswa_tahun.status', 'AKTIF')
            ->whereNotIn('siswa_tahun.siswa_id', $siswaSudahPlotIds);

        if ($user && $user->jenjangIds() !== null) {
            $query->whereIn('rombel.jenjang_id', $user->jenjangIds());
        } else {
            $range = $user ? $user->kelasRange() : ['min' => 1, 'max' => 6];
            $query->whereBetween('rombel.tingkat_kelas', [$range['min'], $range['max']]);
        }

        $siswaBelumPlot = $query->select([
            'siswa.id as id',
            'siswa.nama',        // ← kolom nama di tabel 'siswa'
            'siswa.nis',
            'rombel.tingkat_kelas as kelas_digit',
            'rombel.sub_nama as kelas_nama'
        ])
            ->orderBy('rombel.tingkat_kelas', 'asc')
            ->orderBy('siswa.nama', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $siswaBelumPlot
        ]);
    }
}