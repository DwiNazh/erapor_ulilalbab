<?php

namespace App\Http\Controllers\Api\gurusd;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\AbsensiMapel;
use App\Models\Rombel;
use App\Models\Jadwal;

class AbsensiMapelController extends Controller
{
    public function getRombelSaya()
    {
        $guruId = Auth::id();

        $rombels = Rombel::where('guru_id', $guruId)
            ->orWhereHas('jadwal', fn($q) => $q->where('guru_id', $guruId))
            ->with('tahunAjaran')
            ->get();

        if ($rombels->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Anda belum ditugaskan sebagai wali kelas atau pengampu di rombel manapun'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $rombels
        ]);
    }

    public function getPenugasanSaya()
    {
        $guruId = Auth::id();
        $tahunAjaranAktif = \App\Models\TahunAjaran::where('aktif', 1)->first();

        if (!$tahunAjaranAktif) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada tahun ajaran aktif'
            ], 422);
        }

        $penugasan = DB::table('penugasan_guru')
            ->join('mapel', 'penugasan_guru.mapel_id', '=', 'mapel.id')
            ->join('rombel', 'penugasan_guru.rombel_id', '=', 'rombel.id')
            ->leftJoin('siswa_tahun', function($join) use ($tahunAjaranAktif) {
                $join->on('rombel.id', '=', 'siswa_tahun.rombel_id')
                     ->where('siswa_tahun.tahun_ajaran_id', '=', $tahunAjaranAktif->id);
            })
            ->where('penugasan_guru.guru_id', $guruId)
            ->select(
                'penugasan_guru.id',
                'penugasan_guru.mapel_id',
                'penugasan_guru.rombel_id',
                'mapel.nama as nama_mapel',
                'mapel.kode as kode_mapel',
                'rombel.tingkat_kelas',
                'rombel.sub_nama',
                DB::raw('COUNT(DISTINCT siswa_tahun.siswa_id) as jumlah_siswa'),
                'penugasan_guru.updated_at'
            )
            ->groupBy(
                'penugasan_guru.id',
                'penugasan_guru.mapel_id',
                'penugasan_guru.rombel_id',
                'mapel.nama',
                'mapel.kode',
                'rombel.tingkat_kelas',
                'rombel.sub_nama',
                'penugasan_guru.updated_at'
            )
            ->get()
            ->map(function($item) {
                return [
                    'id' => $item->id,
                    'mapel_id' => $item->mapel_id,
                    'rombel_id' => $item->rombel_id,
                    'jumlah_siswa' => (int) $item->jumlah_siswa,
                    'updated_at' => $item->updated_at,
                    'mapel' => [
                        'id' => $item->mapel_id,
                        'nama' => $item->nama_mapel,
                        'kode' => $item->kode_mapel,
                    ],
                    'rombel' => [
                        'id' => $item->rombel_id,
                        'tingkat_kelas' => $item->tingkat_kelas,
                        'sub_nama' => $item->sub_nama,
                    ]
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $penugasan
        ]);
    }

    public function getPenugasanRombel($rombelId)
    {
        $tahunAjaranAktif = \App\Models\TahunAjaran::where('aktif', 1)->first();

        if (!$tahunAjaranAktif) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada tahun ajaran aktif'
            ], 422);
        }

        $penugasan = DB::table('penugasan_guru')
            ->join('mapel', 'penugasan_guru.mapel_id', '=', 'mapel.id')
            ->join('rombel', 'penugasan_guru.rombel_id', '=', 'rombel.id')
            ->leftJoin('siswa_tahun', function($join) use ($tahunAjaranAktif) {
                $join->on('rombel.id', '=', 'siswa_tahun.rombel_id')
                     ->where('siswa_tahun.tahun_ajaran_id', '=', $tahunAjaranAktif->id);
            })
            ->where('penugasan_guru.rombel_id', $rombelId)
            ->select(
                'penugasan_guru.id',
                'penugasan_guru.mapel_id',
                'penugasan_guru.rombel_id',
                'mapel.nama as nama_mapel',
                'mapel.kode as kode_mapel',
                'rombel.tingkat_kelas',
                'rombel.sub_nama',
                DB::raw('COUNT(DISTINCT siswa_tahun.siswa_id) as jumlah_siswa'),
                'penugasan_guru.updated_at'
            )
            ->groupBy(
                'penugasan_guru.id',
                'penugasan_guru.mapel_id',
                'penugasan_guru.rombel_id',
                'mapel.nama',
                'mapel.kode',
                'rombel.tingkat_kelas',
                'rombel.sub_nama',
                'penugasan_guru.updated_at'
            )
            ->get()
            ->map(function($item) {
                return [
                    'id' => $item->id,
                    'mapel_id' => $item->mapel_id,
                    'rombel_id' => $item->rombel_id,
                    'jumlah_siswa' => (int) $item->jumlah_siswa,
                    'updated_at' => $item->updated_at,
                    'mapel' => [
                        'id' => $item->mapel_id,
                        'nama' => $item->nama_mapel,
                        'kode' => $item->kode_mapel,
                    ],
                    'rombel' => [
                        'id' => $item->rombel_id,
                        'tingkat_kelas' => $item->tingkat_kelas,
                        'sub_nama' => $item->sub_nama,
                    ]
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $penugasan
        ]);
    }

    public function getMapelDiampu(Request $request)
    {
        $request->validate([
            'rombel_id' => 'required|exists:rombel,id',
        ]);

        $guruId = Auth::id();
        $rombelId = $request->rombel_id;

        $penugasan = DB::table('penugasan_guru')
            ->join('mapel', 'penugasan_guru.mapel_id', '=', 'mapel.id')
            ->where('penugasan_guru.guru_id', $guruId)
            ->where('penugasan_guru.rombel_id', $rombelId)
            ->select('mapel.id', 'mapel.nama', 'mapel.kode')
            ->distinct()
            ->get();

        if ($penugasan->isEmpty()) {
            $mapelFromJadwal = Jadwal::where('rombel_id', $rombelId)
                ->where('guru_id', $guruId)
                ->with('mapel')
                ->distinct('mapel_id')
                ->get()
                ->pluck('mapel')
                ->unique('id')
                ->values();

            return response()->json([
                'success' => true,
                'data' => $mapelFromJadwal
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $penugasan->values()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'rombel_id'     => 'required|exists:rombel,id',
            'mapel_id'      => 'required|exists:mapel,id',
            'semester'      => 'required|in:semester1,semester2',
            'pertemuan_ke'  => 'required|integer|min:1|max:50',
            'tanggal'       => 'required|date', // <--- Tambahkan validasi tanggal
            'absensi'       => 'required|array|min:1',
            'absensi.*.siswa_id'    => 'required|integer',
            'absensi.*.status'      => 'required|in:H,S,I,A',
            'absensi.*.keterangan'  => 'nullable|string|max:255',
        ]);

        $guruId = Auth::id();
        $rombelId = $validated['rombel_id'];

        $tahunAjaranAktif = \App\Models\TahunAjaran::where('aktif', 1)->first();
        if (!$tahunAjaranAktif) {
            return response()->json(['success' => false, 'message' => 'Tidak ada tahun ajaran aktif'], 422);
        }

        DB::beginTransaction();
        try {
            foreach ($validated['absensi'] as $entry) {
                $siswaTahun = \App\Models\SiswaTahun::where('siswa_id', $entry['siswa_id'])
                    ->where('rombel_id', $rombelId)
                    ->where('tahun_ajaran_id', $tahunAjaranAktif->id)
                    ->first(['id']);

                if (!$siswaTahun) {
                    \Log::warning("Siswa ID {$entry['siswa_id']} tidak ditemukan di rombel {$rombelId}");
                    continue;
                }

                AbsensiMapel::updateOrCreate(
                    [
                        'siswa_tahun_id'    => $siswaTahun->id,
                        'rombel_id'         => $rombelId,
                        'mata_pelajaran_id' => $validated['mapel_id'],
                        'semester'          => $validated['semester'],
                        'pertemuan_ke'      => $validated['pertemuan_ke'],
                        // Kita jadikan tanggal sebagai bagian dari identitas unik jika satu pertemuan 
                        // harus di tanggal yang sama, atau sekedar data tambahan.
                    ],
                    [
                        'status'     => $entry['status'],
                        'keterangan' => $entry['keterangan'] ?? null,
                        'guru_id'    => $guruId,
                        'tanggal'    => $validated['tanggal'], // <--- Simpan tanggal di sini
                    ]
                );
            }

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => "Absensi Pertemuan {$validated['pertemuan_ke']} tanggal {$validated['tanggal']} berhasil disimpan"
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error simpan absensi: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan absensi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getPertemuanTerakhir(Request $request)
    {
        try {
            $validated = $request->validate([
                'rombel_id' => 'required|integer|exists:rombel,id',
                'mapel'     => 'required|integer|exists:mapel,id',
                'semester'  => 'required|in:semester1,semester2',
            ]);

            $maxPertemuan = AbsensiMapel::where('rombel_id', $validated['rombel_id'])
                ->where('mata_pelajaran_id', $validated['mapel'])
                ->where('semester', $validated['semester'])
                ->max('pertemuan_ke');

            return response()->json([
                'success' => true,
                'data' => [
                    'pertemuan_terakhir'   => (int) ($maxPertemuan ?? 0),
                    'pertemuan_berikutnya' => (int) ($maxPertemuan ?? 0) + 1,
                ]
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data yang dikirim tidak valid',
                'errors'  => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data pertemuan terakhir',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function getAbsensiPertemuan(Request $request)
    {
        $validated = $request->validate([
            'rombel_id'     => 'required|exists:rombel,id',
            'mapel'         => 'required|integer|exists:mapel,id',
            'semester'      => 'required|in:semester1,semester2',
            'pertemuan_ke'  => 'required|integer|min:1',
        ]);

        $dataAbsensi = AbsensiMapel::where('rombel_id', $validated['rombel_id'])
            ->where('mata_pelajaran_id', $validated['mapel'])
            ->where('semester', $validated['semester'])
            ->where('pertemuan_ke', $validated['pertemuan_ke'])
            ->get();

        // Ambil tanggal dari data pertama (karena satu pertemuan satu tanggal)
        $tanggal = $dataAbsensi->first()?->tanggal;

        $absensi = $dataAbsensi->map(function ($item) {
            return [
                'siswa_id'   => $item->siswa_tahun_id,
                'status'     => $item->status,
                'keterangan' => $item->keterangan ?? '',
            ];
        });

        return response()->json([
            'success' => true,
            'tanggal' => $tanggal, // <--- Kirim balik tanggalnya
            'data' => $absensi->values(),
        ]);
    }

    // =============================================
    // ✅ REKAP ABSENSI (MODE LAMA: rombel + mapel + semester)
    // =============================================
public function rekapAbsensi(Request $request)
    {
        $request->validate([
            'rombel_id' => 'required|integer',
            'mapel_id'  => 'required|integer',
            'semester'  => 'required|string',
        ]);

        $tahunAjaranAktif = \App\Models\TahunAjaran::where('aktif', 1)->first();
        if (!$tahunAjaranAktif) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada tahun ajaran aktif'
            ], 422);
        }

        /**
         * Kueri 1: Hitung rekap absensi untuk Siswa Lama (tabel siswa)
         */
        $queryExisting = DB::table('siswa_tahun')
            ->join('siswa', 'siswa.id', '=', 'siswa_tahun.siswa_id')
            ->leftJoin('absensi_mapel', function ($join) use ($request) {
                $join->on('absensi_mapel.siswa_tahun_id', '=', 'siswa_tahun.id')
                    ->where('absensi_mapel.rombel_id', '=', $request->rombel_id)
                    ->where('absensi_mapel.mata_pelajaran_id', '=', $request->mapel_id)
                    ->where('absensi_mapel.semester', '=', $request->semester);
            })
            ->where('siswa_tahun.rombel_id', $request->rombel_id)
            ->where('siswa_tahun.tahun_ajaran_id', $tahunAjaranAktif->id)
            ->select(
                'siswa_tahun.id as siswa_tahun_id',
                'siswa.nama as nama',
                'siswa.nis as nis',
                DB::raw("COUNT(DISTINCT absensi_mapel.pertemuan_ke) as total_pertemuan"),
                DB::raw("SUM(CASE WHEN absensi_mapel.status = 'H' THEN 1 ELSE 0 END) as hadir"),
                DB::raw("SUM(CASE WHEN absensi_mapel.status = 'S' THEN 1 ELSE 0 END) as sakit"),
                DB::raw("SUM(CASE WHEN absensi_mapel.status = 'I' THEN 1 ELSE 0 END) as izin"),
                DB::raw("SUM(CASE WHEN absensi_mapel.status = 'A' THEN 1 ELSE 0 END) as alfa")
            )
            ->groupBy('siswa_tahun.id', 'siswa.nama', 'siswa.nis');

        /**
         * Kueri 2: Hitung rekap absensi untuk Siswa Baru Kelas 1 (tabel siswas)
         */
        $queryBaru = DB::table('siswa_tahun')
            ->join('siswas', 'siswas.id', '=', 'siswa_tahun.siswa_id')
            ->leftJoin('absensi_mapel', function ($join) use ($request) {
                $join->on('absensi_mapel.siswa_tahun_id', '=', 'siswa_tahun.id')
                    ->where('absensi_mapel.rombel_id', '=', $request->rombel_id)
                    ->where('absensi_mapel.mata_pelajaran_id', '=', $request->mapel_id)
                    ->where('absensi_mapel.semester', '=', $request->semester);
            })
            ->where('siswa_tahun.rombel_id', $request->rombel_id)
            ->where('siswa_tahun.tahun_ajaran_id', $tahunAjaranAktif->id)
            ->select(
                'siswa_tahun.id as siswa_tahun_id',
                'siswas.nama_user as nama',
                'siswas.nis as nis',
                DB::raw("COUNT(DISTINCT absensi_mapel.pertemuan_ke) as total_pertemuan"),
                DB::raw("SUM(CASE WHEN absensi_mapel.status = 'H' THEN 1 ELSE 0 END) as hadir"),
                DB::raw("SUM(CASE WHEN absensi_mapel.status = 'S' THEN 1 ELSE 0 END) as sakit"),
                DB::raw("SUM(CASE WHEN absensi_mapel.status = 'I' THEN 1 ELSE 0 END) as izin"),
                DB::raw("SUM(CASE WHEN absensi_mapel.status = 'A' THEN 1 ELSE 0 END) as alfa")
            )
            ->groupBy('siswa_tahun.id', 'siswas.nama_user', 'siswas.nis');

        // Satukan data dengan UNION dan urutkan berdasarkan Nama dari A ke Z
        $data = $queryExisting->union($queryBaru)
            ->orderBy('nama', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $data
        ]);
    }


}