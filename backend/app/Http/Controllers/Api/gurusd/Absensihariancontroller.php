<?php

namespace App\Http\Controllers\Api\gurusd;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Rombel;

class AbsensiHarianController extends Controller
{
    /**
     * Mengambil Tahun Ajaran yang sedang Aktif (aktif = 1)
     */
    private function getTahunAjaranAktif()
    {
        return DB::table('tahun_ajaran')
            ->where('aktif', 1)
            ->first();
    }

    /**
     * Ambil rombel di mana guru yang login adalah WALI KELAS pada Tahun Ajaran Aktif.
     */
    public function getRombelWali()
    {
        $guruId = Auth::id();
        $tahunAktif = $this->getTahunAjaranAktif();
        
        if (!$tahunAktif) {
            return response()->json(['success' => false, 'message' => 'Tahun ajaran aktif tidak ditemukan.'], 400);
        }

        $rombel = Rombel::where('guru_id', $guruId)
            ->where('tahun_ajaran_id', $tahunAktif->id)
            ->first();

        if (!$rombel) {
            return response()->json([
                'success' => false,
                'message' => 'Anda bukan wali kelas di rombel manapun pada periode aktif ini.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $rombel
        ]);
    }

    /**
     * Ambil daftar siswa pada rombel terikat pada Tahun Ajaran yang Aktif saja
     */
    public function getSiswaRombel($rombelId)
    {
        $tahunAktif = $this->getTahunAjaranAktif();
        if (!$tahunAktif) {
            return response()->json(['success' => false, 'message' => 'Tahun ajaran aktif tidak ditemukan.'], 400);
        }

        $existing = DB::table('siswa_tahun')
            ->join('siswa', 'siswa.id', '=', 'siswa_tahun.siswa_id')
            ->where('siswa_tahun.rombel_id', $rombelId)
            ->where('siswa_tahun.tahun_ajaran_id', $tahunAktif->id)
            ->select('siswa_tahun.id as siswa_tahun_id', 'siswa.nama as nama', 'siswa.nis as nis');

        $baru = DB::table('siswa_tahun')
            ->join('siswas', 'siswas.id', '=', 'siswa_tahun.siswa_id')
            ->where('siswa_tahun.rombel_id', $rombelId)
            ->where('siswa_tahun.tahun_ajaran_id', $tahunAktif->id)
            ->select('siswa_tahun.id as siswa_tahun_id', 'siswas.nama_user as nama', 'siswas.nis as nis');

        $gabunganSql = $existing->toSql() . " UNION " . $baru->toSql();
        
        $data = DB::table(DB::raw("({$gabunganSql}) as hasil_gabung"))
            ->mergeBindings($existing)
            ->mergeBindings($baru)
            ->orderBy('nama')
            ->get();

        return response()->json(['success' => true, 'data' => $data]);
    }

    /**
     * Ambil absensi terinput berdasarkan tanggal, rombel, dan semester aktif
     */
    public function getAbsensiTanggal(Request $request)
    {
        $validated = $request->validate([
            'rombel_id' => 'required|exists:rombel,id',
            'tanggal'   => 'required|date',
            'semester'  => 'required|in:semester1,semester2'
        ]);

        $tahunAktif = $this->getTahunAjaranAktif();
        if (!$tahunAktif) {
            return response()->json(['success' => false, 'message' => 'Tahun ajaran aktif tidak ditemukan.'], 400);
        }

        $data = DB::table('absensi_harian')
            ->where('rombel_id', $validated['rombel_id'])
            ->where('tanggal', $validated['tanggal'])
            ->where('semester', $validated['semester'])
            ->where('tahun_ajaran_id', $tahunAktif->id)
            ->select('siswa_tahun_id', 'status', 'keterangan')
            ->get();

        return response()->json(['success' => true, 'data' => $data]);
    }

    /**
     * Simpan atau update data absensi harian siswa
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'rombel_id' => 'required|exists:rombel,id',
            'tanggal'   => 'required|date',
            'semester'  => 'required|in:semester1,semester2',
            'absensi'   => 'required|array|min:1',
            'absensi.*.siswa_tahun_id' => 'required|integer',
            'absensi.*.status'         => 'required|in:H,S,I,A',
            'absensi.*.keterangan'     => 'nullable|string|max:255',
        ]);

        $tahunAktif = $this->getTahunAjaranAktif();
        if (!$tahunAktif) {
            return response()->json(['success' => false, 'message' => 'Tahun ajaran aktif tidak ditemukan.'], 400);
        }

        $guruId = Auth::id();

        DB::beginTransaction();
        try {
            foreach ($validated['absensi'] as $entry) {
                DB::table('absensi_harian')->updateOrInsert(
                    [
                        'siswa_tahun_id'  => (int)$entry['siswa_tahun_id'],
                        'tanggal'         => $validated['tanggal'],
                        'semester'        => $validated['semester'],
                        'tahun_ajaran_id' => (int)$tahunAktif->id, // Ini dia yang ditunggu database!
                    ],
                    [
                        'rombel_id'   => (int)$validated['rombel_id'],
                        'status'      => $entry['status'],
                        'keterangan'  => $entry['keterangan'] ?? null,
                        'guru_id'     => (int)$guruId,
                        'created_at'  => now(),
                        'updated_at'  => now()
                    ]
                );
            }

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => "Absensi harian tanggal {$validated['tanggal']} berhasil disimpan."
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan absensi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Rekap bulanan absensi harian untuk satu rombel
     */
    public function rekapBulanan(Request $request)
    {
        $validated = $request->validate([
            'rombel_id' => 'required|exists:rombel,id',
            'bulan'     => 'required|integer|min:1|max:12',
            'tahun'     => 'required|integer',
        ]);

        $tahunAktif = $this->getTahunAjaranAktif();
        if (!$tahunAktif) {
            return response()->json(['success' => false, 'message' => 'Tahun ajaran aktif tidak ditemukan.'], 400);
        }

        $queryExisting = DB::table('siswa_tahun')
            ->join('siswa', 'siswa.id', '=', 'siswa_tahun.siswa_id')
            ->leftJoin('absensi_harian', function ($join) use ($validated, $tahunAktif) {
                $join->on('absensi_harian.siswa_tahun_id', '=', 'siswa_tahun.id')
                    ->whereMonth('absensi_harian.tanggal', $validated['bulan'])
                    ->whereYear('absensi_harian.tanggal', $validated['tahun'])
                    ->where('absensi_harian.tahun_ajaran_id', $tahunAktif->id);
            })
            ->where('siswa_tahun.rombel_id', $validated['rombel_id'])
            ->where('siswa_tahun.tahun_ajaran_id', $tahunAktif->id)
            ->select(
                'siswa_tahun.id as siswa_tahun_id',
                'siswa.nama as nama',
                'siswa.nis as nis',
                DB::raw("SUM(CASE WHEN absensi_harian.status = 'H' THEN 1 ELSE 0 END) as hadir"),
                DB::raw("SUM(CASE WHEN absensi_harian.status = 'S' THEN 1 ELSE 0 END) as sakit"),
                DB::raw("SUM(CASE WHEN absensi_harian.status = 'I' THEN 1 ELSE 0 END) as izin"),
                DB::raw("SUM(CASE WHEN absensi_harian.status = 'A' THEN 1 ELSE 0 END) as alfa"),
                DB::raw("COUNT(absensi_harian.id) as total_pertemuan")
            )
            ->groupBy('siswa_tahun.id', 'siswa.nama', 'siswa.nis');

        $queryBaru = DB::table('siswa_tahun')
            ->join('siswas', 'siswas.id', '=', 'siswa_tahun.siswa_id')
            ->leftJoin('absensi_harian', function ($join) use ($validated, $tahunAktif) {
                $join->on('absensi_harian.siswa_tahun_id', '=', 'siswa_tahun.id')
                    ->whereMonth('absensi_harian.tanggal', $validated['bulan'])
                    ->whereYear('absensi_harian.tanggal', $validated['tahun'])
                    ->where('absensi_harian.tahun_ajaran_id', $tahunAktif->id);
            })
            ->where('siswa_tahun.rombel_id', $validated['rombel_id'])
            ->where('siswa_tahun.tahun_ajaran_id', $tahunAktif->id)
            ->select(
                'siswa_tahun.id as siswa_tahun_id',
                'siswas.nama_user as nama',
                'siswas.nis as nis',
                DB::raw("SUM(CASE WHEN absensi_harian.status = 'H' THEN 1 ELSE 0 END) as hadir"),
                DB::raw("SUM(CASE WHEN absensi_harian.status = 'S' THEN 1 ELSE 0 END) as sakit"),
                DB::raw("SUM(CASE WHEN absensi_harian.status = 'I' THEN 1 ELSE 0 END) as izin"),
                DB::raw("SUM(CASE WHEN absensi_harian.status = 'A' THEN 1 ELSE 0 END) as alfa"),
                DB::raw("COUNT(absensi_harian.id) as total_pertemuan")
            )
            ->groupBy('siswa_tahun.id', 'siswas.nama_user', 'siswas.nis');

        $data = $queryExisting->union($queryBaru)->orderBy('nama')->get();

        return response()->json(['success' => true, 'data' => $data]);
    }
}