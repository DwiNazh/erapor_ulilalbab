<?php

namespace App\Http\Controllers\Api\Tu;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\Rombel;
use App\Models\SiswaTahun;
use App\Models\TahunAjaran;

class RombelController extends Controller
{
    private const KELOMPOK_GENDER = ['campuran', 'ikhwan', 'akhwat'];

    // Kelas 1-3 campuran; kelas 4 ke atas (SD 4-6, SMP, SMA) wajib ikhwan/akhwat
    public const TINGKAT_MULAI_PISAH_GENDER = 4;

    /**
     * HELPER: ambil tahun ajaran berikutnya (setelah tahun yang sedang aktif)
     */
    private function getTahunBerikutnya()
    {
        $tahunAktif = TahunAjaran::where('aktif', 1)->first();

        if (!$tahunAktif) {
            return null;
        }

        return TahunAjaran::where('id', '>', $tahunAktif->id)
            ->orderBy('id', 'asc')
            ->first();
    }

    /**
     * LIST ROMBEL (filter: kelas, tahun ajaran, wali kelas, gender, jenjang)
     */
    public function index(Request $request)
    {
        $kelas      = $request->query('kelas');
        $tahunId    = $request->query('tahun_ajaran_id');
        $tahunParam = $request->query('tahun'); // 'next' -> tahun ajaran berikutnya
        $hasWali    = $request->query('has_wali');
        $gender     = $request->query('kelompok_gender');
        $jenjangId  = $request->query('jenjang_id');

        if (!$tahunId && $tahunParam === 'next') {
            $tahunBerikutnya = $this->getTahunBerikutnya();

            if (!$tahunBerikutnya) {
                return response()->json([
                    'data' => [],
                    'message' => 'Tahun ajaran berikutnya belum dibuat. Silakan buat tahun ajaran baru terlebih dahulu.',
                ]);
            }

            $tahunId = $tahunBerikutnya->id;
        }

        $rombels = Rombel::with('guru')
            ->untukUser($request->user())
            ->when($kelas, function ($q) use ($kelas) {
                if (is_array($kelas)) {
                    $q->whereIn('tingkat_kelas', $kelas);
                } else {
                    $q->where('tingkat_kelas', $kelas);
                }
            })
            ->when($tahunId, fn ($q) => $q->where('tahun_ajaran_id', $tahunId))
            ->when($gender && in_array($gender, self::KELOMPOK_GENDER, true),
                fn ($q) => $q->where('kelompok_gender', $gender))
            ->when($jenjangId, fn ($q) => $q->where('jenjang_id', $jenjangId))
            ->when($hasWali !== null, function ($q) use ($hasWali) {
                $wantHasWali = filter_var($hasWali, FILTER_VALIDATE_BOOLEAN);

                if ($wantHasWali) {
                    $q->whereNotNull('guru_id');
                } else {
                    $q->whereNull('guru_id');
                }
            })
            ->orderBy('tingkat_kelas')
            ->orderBy('sub_nama')
            ->orderBy('kelompok_gender')
            ->get()
            ->map(function ($r) {
                return [
                    'id'              => $r->id,
                    'tingkat_kelas'   => $r->tingkat_kelas,
                    'sub_nama'        => $r->sub_nama,
                    'nama_rombel'     => $r->nama_rombel,
                    'kelompok_gender' => $r->kelompok_gender,
                    'jenjang_id'      => $r->jenjang_id,
                    'guru_id'         => $r->guru_id,
                    'wali_kelas_nama' => $r->guru?->name,
                    'tahun_ajaran_id' => $r->tahun_ajaran_id,
                ];
            });

        return response()->json([
            'data' => $rombels
        ]);
    }

    /**
     * CREATE ROMBEL (selalu untuk tahun ajaran berikutnya)
     */
    public function store(Request $request)
    {
        $kelas  = $request->kelas ?? $request->tingkat_kelas;
        $sub    = $request->sub_kelas ?? $request->sub_nama;
        $gender = $request->kelompok_gender ?? $request->kategori;

        $validator = Validator::make([
            'kelas'           => $kelas,
            'sub_kelas'       => $sub,
            'kelompok_gender' => $gender,
        ], [
            'kelas'           => 'required|integer|between:1,12',
            'sub_kelas'       => 'required|string|max:1',
            'kelompok_gender' => ['nullable', Rule::in(self::KELOMPOK_GENDER)],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        $kelas = (int) $kelas;
        $sub   = strtoupper($sub);

        // ATURAN GENDER
        if ($kelas >= self::TINGKAT_MULAI_PISAH_GENDER) {
            if (!in_array($gender, ['ikhwan', 'akhwat'], true)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Rombel kelas ' . self::TINGKAT_MULAI_PISAH_GENDER . ' ke atas wajib dipilih Ikhwan atau Akhwat',
                    'errors'  => ['kelompok_gender' => ['Wajib diisi: ikhwan atau akhwat']],
                ], 422);
            }
        } else {
            $gender = 'campuran';
        }

        $tahunAktif = TahunAjaran::where('aktif', 1)->first();

        if (!$tahunAktif) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada tahun ajaran aktif'
            ], 422);
        }

        $tahunBerikutnya = $this->getTahunBerikutnya();

        if (!$tahunBerikutnya) {
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran berikutnya belum dibuat'
            ], 422);
        }

        // Jenjang ditentukan otomatis dari tingkat kelas
        $jenjangId = DB::table('jenjang')
            ->where('kelas_min', '<=', $kelas)
            ->where('kelas_max', '>=', $kelas)
            ->value('id');

        if (!$request->user()->bolehJenjang($jenjangId)) {
            return response()->json(['success' => false, 'message' => 'Kelas ini bukan bagian dari jenjang Anda.'], 403);
        }

        $label = $kelas . $sub . ($gender === 'campuran' ? '' : ' ' . ucfirst($gender));

        // CEK DUPLIKAT
        $exists = Rombel::where('tingkat_kelas', $kelas)
            ->where('sub_nama', $sub)
            ->where('kelompok_gender', $gender)
            ->where('tahun_ajaran_id', $tahunBerikutnya->id)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => "Rombel {$label} sudah ada di tahun berikutnya"
            ], 422);
        }

        $rombel = Rombel::create([
            'tahun_ajaran_id' => $tahunBerikutnya->id,
            'jenjang_id'      => $jenjangId,
            'tingkat_kelas'   => $kelas,
            'sub_nama'        => $sub,
            'kelompok_gender' => $gender,
            'nama_rombel'     => $label,
        ]);

        return response()->json([
            'success' => true,
            'message' => "Rombel {$label} berhasil dibuat untuk tahun ajaran berikutnya",
            'data' => $rombel
        ], 201);
    }

    /**
     * DELETE ROMBEL (ditolak jika sudah berisi siswa)
     */
    public function destroy($id)
    {
        $rombel = Rombel::untukUser(request()->user())->findOrFail($id);

        $jumlahSiswa = SiswaTahun::where('rombel_id', $rombel->id)->count();

        if ($jumlahSiswa > 0) {
            return response()->json([
                'success' => false,
                'message' => "Rombel tidak bisa dihapus karena masih berisi {$jumlahSiswa} siswa. Pindahkan siswa terlebih dahulu."
            ], 422);
        }

        $rombel->delete();

        return response()->json([
            'success' => true,
            'message' => 'Rombel berhasil dihapus'
        ]);
    }
}