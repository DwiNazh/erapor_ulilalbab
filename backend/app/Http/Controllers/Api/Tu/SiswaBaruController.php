<?php

namespace App\Http\Controllers\Api\Tu;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Siswa;           // Model Siswa Master
use App\Models\SiswaTahun;      // Model Posisi Siswa per Tahun
use App\Models\TahunAjaran;
use App\Models\Rombel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class SiswaBaruController extends Controller
{
    /**
     * GET /api/tu/siswa-baru
     * Ambil semua siswa baru yang belum diproses (is_processed = 0)
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $jenjangIds = $user ? $user->jenjangIds() : null;

            $data = DB::table('siswas')  // atau SiswaBaru:: jika pakai model
                ->where('is_processed', 0)
                ->when($jenjangIds !== null, function ($q) use ($jenjangIds) {
                    $q->whereIn('jenjang_id', $jenjangIds);
                })
                ->select('id', 'nama_user', 'nis', 'nisn', 'kelas', 'sub_kelas', 'kategori', 'jenjang_id', 'is_processed')
                ->orderBy('nama_user', 'asc')
                ->get();

            return response()->json($data, 200);
        } catch (\Exception $e) {
            Log::error('Gagal mengambil data siswa baru: ' . $e->getMessage());
            return response()->json([
                'message' => 'Gagal memuat data siswa baru.'
            ], 500);
        }
    }

    /**
     * POST /api/tu/siswa-baru/bagikan-sub-kelas
     * Bagikan siswa ke kelas & sub kelas (massal)
     */
    public function bagikanSubKelasMassal(Request $request)
    {
        $request->validate([
            'rombel_id' => 'required|exists:rombel,id',
            'siswa_ids' => 'required|array|min:1',
            'siswa_ids.*' => 'integer|exists:siswas,id',
        ]);

        try {
            $rombel = DB::table('rombel')->where('id', $request->rombel_id)->first();

            if (!$rombel || !$request->user()->bolehJenjang($rombel->jenjang_id)) {
                return response()->json(['message' => 'Rombel tidak ditemukan atau di luar jenjang Anda.'], 403);
            }

            $userJenjang = $request->user()->jenjangIds();
            if ($userJenjang !== null) {
                $adaBedaJenjang = DB::table('siswas')
                    ->whereIn('id', $request->siswa_ids)
                    ->whereNotIn('jenjang_id', $userJenjang)
                    ->exists();
                if ($adaBedaJenjang) {
                    return response()->json(['message' => 'Ada siswa yang berada di luar jenjang yang Anda kelola.'], 403);
                }
            }

            // Validasi jenjang siswa vs jenjang rombel
            $adaBedaJenjangRombel = DB::table('siswas')
                ->whereIn('id', $request->siswa_ids)
                ->where('is_processed', 0)
                ->whereNotNull('jenjang_id')
                ->where('jenjang_id', '!=', $rombel->jenjang_id)
                ->exists();
            if ($adaBedaJenjangRombel) {
                return response()->json(['message' => 'Jenjang siswa tidak sesuai dengan jenjang rombel tujuan.'], 422);
            }

            // Validasi siswa baru hanya boleh masuk ke kelas awal jenjang
            $kelasAwal = DB::table('jenjang')->where('id', $rombel->jenjang_id)->value('kelas_min') ?? 1;
            if ((int) $rombel->tingkat_kelas !== (int) $kelasAwal) {
                return response()->json(['message' => "Siswa baru hanya dapat dibagikan ke kelas awal ({$kelasAwal}), bukan kelas {$rombel->tingkat_kelas}."], 422);
            }

            if (in_array($rombel->kelompok_gender ?? 'campuran', ['ikhwan', 'akhwat'], true)) {
                $salah = DB::table('siswas')
                    ->whereIn('id', $request->siswa_ids)
                    ->where('is_processed', 0)
                    ->where(function ($q) use ($rombel) {
                        $q->whereNull('kategori')->orWhere('kategori', '!=', $rombel->kelompok_gender);
                    })
                    ->pluck('nama_user');

                if ($salah->isNotEmpty()) {
                    return response()->json([
                        'message' => 'Kategori tidak sesuai atau belum terisi untuk: ' . $salah->implode(', '),
                    ], 422);
                }
            }

            // PERBAIKAN: jangan timpa siswa yang sudah is_processed = 1
            // (mencegah siswa yang sudah resmi jadi master ikut ter-update kelasnya di tabel staging)
            $affected = DB::table('siswas')
                ->whereIn('id', $request->siswa_ids)
                ->where('is_processed', 0)
                ->update([
                    'kelas' => $rombel->tingkat_kelas,
                    'sub_kelas' => $rombel->sub_nama,
                    'updated_at' => now(),
                ]);

            return response()->json([
                'message' => "Berhasil membagikan {$affected} siswa ke Kelas {$rombel->tingkat_kelas}{$rombel->sub_nama}"
            ], 200);

        } catch (\Exception $e) {
            Log::error('Gagal bagikan sub kelas: ' . $e->getMessage());
            return response()->json([
                'message' => 'Gagal memproses pembagian kelas.'
            ], 500);
        }
    }

    /**
     * POST /api/tu/siswa-baru/bagikan-sub-kelas-batch
     * Bagikan banyak siswa ke banyak rombel sekaligus dalam satu request.
     * Body: { assignments: [{ rombel_id: X, siswa_ids: [1, 2, 3] }, ...] }
     */
    public function bagikanSubKelasBatch(Request $request)
    {
        $request->validate([
            'assignments'              => 'required|array|min:1',
            'assignments.*.rombel_id'  => 'required|exists:rombel,id',
            'assignments.*.siswa_ids'  => 'required|array|min:1',
            'assignments.*.siswa_ids.*' => 'integer|exists:siswas,id',
        ]);

        $totalAffected = 0;
        $errors = [];

        DB::beginTransaction();
        try {
            foreach ($request->assignments as $idx => $assignment) {
                $rombel = DB::table('rombel')->where('id', $assignment['rombel_id'])->first();

                if (!$rombel || !$request->user()->bolehJenjang($rombel->jenjang_id)) {
                    $errors[] = "Assignment #{$idx}: Rombel tidak ditemukan atau di luar jenjang Anda.";
                    continue;
                }

                $siswaIds = $assignment['siswa_ids'];

                // Validasi jenjang siswa
                $userJenjang = $request->user()->jenjangIds();
                if ($userJenjang !== null) {
                    $adaBedaJenjang = DB::table('siswas')
                        ->whereIn('id', $siswaIds)
                        ->whereNotIn('jenjang_id', $userJenjang)
                        ->exists();
                    if ($adaBedaJenjang) {
                        $errors[] = "Assignment #{$idx}: Ada siswa di luar jenjang yang Anda kelola.";
                        continue;
                    }
                }

                // Validasi jenjang siswa vs jenjang rombel
                $adaBedaJenjangRombel = DB::table('siswas')
                    ->whereIn('id', $siswaIds)
                    ->where('is_processed', 0)
                    ->whereNotNull('jenjang_id')
                    ->where('jenjang_id', '!=', $rombel->jenjang_id)
                    ->exists();
                if ($adaBedaJenjangRombel) {
                    $errors[] = "Assignment #{$idx}: Ada siswa yang jenjangnya tidak sesuai dengan rombel.";
                    continue;
                }

                // Validasi rombel harus kelas awal jenjang
                $kelasAwal = DB::table('jenjang')->where('id', $rombel->jenjang_id)->value('kelas_min') ?? 1;
                if ((int) $rombel->tingkat_kelas !== (int) $kelasAwal) {
                    $errors[] = "Assignment #{$idx}: Siswa baru hanya dapat dibagikan ke kelas awal ({$kelasAwal}).";
                    continue;
                }

                // Validasi kategori gender
                if (in_array($rombel->kelompok_gender ?? 'campuran', ['ikhwan', 'akhwat'], true)) {
                    $salah = DB::table('siswas')
                        ->whereIn('id', $siswaIds)
                        ->where('is_processed', 0)
                        ->where(function ($q) use ($rombel) {
                            $q->whereNull('kategori')->orWhere('kategori', '!=', $rombel->kelompok_gender);
                        })
                        ->pluck('nama_user');

                    if ($salah->isNotEmpty()) {
                        $errors[] = "Assignment #{$idx}: Kategori tidak sesuai untuk: " . $salah->implode(', ');
                        continue;
                    }
                }

                $affected = DB::table('siswas')
                    ->whereIn('id', $siswaIds)
                    ->where('is_processed', 0)
                    ->update([
                        'kelas'      => $rombel->tingkat_kelas,
                        'sub_kelas'  => $rombel->sub_nama,
                        'updated_at' => now(),
                    ]);

                $totalAffected += $affected;
            }

            DB::commit();

            return response()->json([
                'message'        => "Berhasil membagikan {$totalAffected} siswa secara batch.",
                'total_affected' => $totalAffected,
                'errors'         => $errors,
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Gagal bagikan sub kelas batch: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal memproses pembagian kelas batch.'], 500);
        }
    }


    //  Migrasi siswa dari tabel staging (siswas) ke master (siswa) + siswa_tahun

    public function simpanNis(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:siswas,id',
            'nis' => [
                'required',
                'string',
                'max:20',
                Rule::unique('siswas', 'nis')->ignore($request->id),
                'unique:siswa,nis',
            ],
            'nisn' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('siswas', 'nisn')->ignore($request->id),
                'unique:siswa,nisn',
            ],
        ], [
            'nis.unique' => 'NIS sudah terdaftar (baik di data pendaftar maupun siswa master), silakan gunakan NIS lain.',
            'nisn.unique' => 'NISN sudah terdaftar, silakan gunakan NISN lain.',
        ]);

        DB::beginTransaction();

        try {
            // PERBAIKAN 1: lock baris supaya tidak ada race condition kalau
            // tombol simpan ke-klik dua kali dengan sangat cepat / dari 2 tab.
            $siswaPPDB = DB::table('siswas')
                ->where('id', $request->id)
                ->lockForUpdate()
                ->first();

            // PERBAIKAN 2: guard null — jangan langsung akses properti kalau data tidak ada
            if (!$siswaPPDB) {
                throw new \Exception('Data pendaftar tidak ditemukan. Mungkin sudah dihapus.');
            }

            // PERBAIKAN 3: cegah proses ganda untuk siswa yang sama
            if ((int) $siswaPPDB->is_processed === 1) {
                throw new \Exception('Siswa ini sudah diproses sebelumnya, tidak bisa diproses ulang.');
            }

            // PERBAIKAN 4: pastikan siswa sudah punya kelas/sub_kelas
            // (mencegah proses NIS untuk siswa yang belum dibagikan ke rombel)
            if (empty($siswaPPDB->kelas) || empty($siswaPPDB->sub_kelas)) {
                throw new \Exception('Siswa belum dibagikan ke rombel. Bagikan ke rombel terlebih dahulu.');
            }

            if ($siswaPPDB->jenjang_id && !$request->user()->bolehJenjang($siswaPPDB->jenjang_id)) {
                throw new \Exception('Siswa ini berada di luar jenjang yang Anda kelola.');
            }

            // 1. Cari Tahun Ajaran Aktif saat ini
            $tahunSekarang = TahunAjaran::getAktif();
            if (!$tahunSekarang) {
                throw new \Exception('Tahun ajaran aktif belum ditentukan. Silakan aktifkan tahun ajaran terlebih dahulu.');
            }

            // 2. Cari Tahun Ajaran Berikutnya (Target) - WAJIB tahun berikutnya, JANGAN fallback ke tahun aktif
            $tahunTarget = $tahunSekarang->getNextTahunAjaran();

            if (!$tahunTarget || (int) $tahunTarget->id === (int) $tahunSekarang->id) {
                throw new \Exception('Tahun ajaran berikutnya belum dibuat atau tidak ditemukan. Siswa baru hanya dapat didaftarkan ke tahun ajaran berikutnya, bukan tahun ajaran aktif.');
            }

            // 3. Tentukan kategori rombel (kelas 4 ke atas wajib ikhwan/akhwat)
            $tingkat = (int) $siswaPPDB->kelas;
            $sub = strtoupper($siswaPPDB->sub_kelas);
            $kategori = $siswaPPDB->kategori ?? null;

            $kelompok = 'campuran';
            if ($tingkat >= RombelController::TINGKAT_MULAI_PISAH_GENDER) {
                if (!in_array($kategori, ['ikhwan', 'akhwat'], true)) {
                    throw new \Exception('Kategori Ikhwan/Akhwat siswa belum terisi. Isi dulu sebelum didaftarkan ke kelas 4 ke atas.');
                }
                $kelompok = $kategori;
            }

            $jenjangId = DB::table('jenjang')
                ->where('kelas_min', '<=', $tingkat)
                ->where('kelas_max', '>=', $tingkat)
                ->value('id');

            $label = $tingkat . $sub . ($kelompok === 'campuran' ? '' : ' ' . ucfirst($kelompok));

            $rombel = Rombel::firstOrCreate(
                [
                    'tingkat_kelas' => $tingkat,
                    'sub_nama' => $sub,
                    'tahun_ajaran_id' => $tahunTarget->id,
                    'kelompok_gender' => $kelompok,
                ],
                [
                    'jenjang_id' => $jenjangId,
                    'nama_rombel' => $label,
                ]
            );

            // 4. Buat Master Siswa di tabel siswa
            $siswaMaster = Siswa::create([
                'nama'     => $siswaPPDB->nama_user,
                'nis'      => $request->nis,
                'nisn'     => $request->nisn ?? $siswaPPDB->nisn,
                'kelas'    => $siswaPPDB->kelas,
                'kategori' => in_array($kategori, ['ikhwan', 'akhwat'], true) ? $kategori : null,
            ]);

            // 5. Masukkan ke SiswaTahun di TAHUN TARGET, pakai id dari siswa master
            SiswaTahun::create([
                'siswa_id' => $siswaMaster->id,
                'tahun_ajaran_id' => $tahunTarget->id,
                'rombel_id' => $rombel->id,
                'jenjang_id' => $jenjangId,
                'status' => 'AKTIF',
                'is_processed' => 0, // belum diproses karena baru akan mulai sekolah
            ]);

            // 6. Update status di siswas (baris lama TETAP ADA sebagai arsip pendaftaran)
            DB::table('siswas')->where('id', $request->id)->update([
                'is_processed' => 1,
                'nis' => $request->nis,
                'updated_at' => now(),
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Siswa berhasil didaftarkan untuk tahun ajaran ' . $tahunTarget->nama
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Gagal simpan NIS siswa baru: ' . $e->getMessage(), [
                'siswa_id' => $request->id,
            ]);
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    /**
     * POST /api/tu/siswa-baru/import-sementara
     * Import data siswa baru sementara untuk keperluan pengujian awal
     */
    public function importSementara(Request $request)
    {
        $request->validate([
            'siswa'             => 'required|array|min:1',
            'siswa.*.nama_user' => 'required|string|max:150',
            'siswa.*.nisn'      => 'nullable|string|max:30',
            'siswa.*.kategori'  => 'nullable|string|max:20',
            'siswa.*.ppdb_id'   => 'nullable|string|max:50',
            'jenjang_id'        => 'nullable|integer|exists:jenjang,id',
            'kelas'             => 'nullable',
        ], [
            'siswa.required'             => 'Data siswa tidak boleh kosong.',
            'siswa.*.nama_user.required' => 'Nama siswa wajib diisi.',
        ]);

        $user = $request->user();
        $userJenjang = $user ? $user->jenjangIds() : null;

        // Tentukan jenjang_id
        $targetJenjangId = null;
        if ($request->filled('jenjang_id')) {
            $targetJenjangId = (int) $request->jenjang_id;
        } elseif ($userJenjang && count($userJenjang) > 0) {
            $targetJenjangId = $userJenjang[0];
        } else {
            $targetJenjangId = DB::table('jenjang')->where('kode', 'SD')->value('id') ?? 1;
        }

        if ($user && !$user->bolehJenjang($targetJenjangId)) {
            return response()->json(['message' => 'Anda tidak memiliki hak akses untuk jenjang ini.'], 403);
        }

        // Tentukan kelas target (kolom 'kelas' di tabel siswas NOT NULL)
        $targetKelas = null;
        if ($request->filled('kelas') && !empty($request->kelas)) {
            $targetKelas = (string) $request->kelas;
        } else {
            $targetKelas = (string) (DB::table('jenjang')->where('id', $targetJenjangId)->value('kelas_min') ?? '1');
        }

        DB::beginTransaction();
        try {
            $importedCount = 0;
            $skippedCount = 0;

            foreach ($request->siswa as $item) {
                $nama = trim($item['nama_user'] ?? '');
                if (!$nama) {
                    $skippedCount++;
                    continue;
                }

                $nisn = !empty($item['nisn']) ? trim((string) $item['nisn']) : null;
                $kategori = !empty($item['kategori']) ? strtolower(trim($item['kategori'])) : null;
                if (!in_array($kategori, ['ikhwan', 'akhwat'], true)) {
                    $kategori = null;
                }

                // Cek apakah NISN sudah ada di antrean siswa baru
                if ($nisn) {
                    $adaNisn = DB::table('siswas')
                        ->where('nisn', $nisn)
                        ->where('is_processed', 0)
                        ->exists();
                    if ($adaNisn) {
                        $skippedCount++;
                        continue;
                    }
                }

                $ppdbId = !empty($item['ppdb_id'])
                    ? trim((string) $item['ppdb_id'])
                    : ('TEST-' . date('Ymd') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 6)));

                while (DB::table('siswas')->where('ppdb_id', $ppdbId)->exists()) {
                    $ppdbId = 'TEST-' . date('Ymd') . '-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));
                }

                DB::table('siswas')->insert([
                    'nama_user'    => $nama,
                    'ppdb_id'      => $ppdbId,
                    'nisn'         => $nisn,
                    'nis'          => null,
                    'kelas'        => $targetKelas,
                    'sub_kelas'    => null,
                    'kategori'     => $kategori,
                    'jenjang_id'   => $targetJenjangId,
                    'is_processed' => 0,
                    'created_at'   => now(),
                    'updated_at'   => now(),
                ]);

                $importedCount++;
            }

            DB::commit();

            return response()->json([
                'success'        => true,
                'message'        => "Berhasil mengimpor {$importedCount} data siswa baru sementara." . ($skippedCount > 0 ? " ({$skippedCount} duplikat dilewati)" : ""),
                'total_imported' => $importedCount,
                'total_skipped'  => $skippedCount,
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Gagal import sementara siswa baru: ' . $e->getMessage());
            return response()->json([
                'message' => 'Terjadi kesalahan saat mengimpor data: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * DELETE /api/tu/siswa-baru/{id}
     * Hapus data siswa baru sementara yang belum diproses
     */
    public function hapusSementara(Request $request, $id)
    {
        try {
            $siswa = DB::table('siswas')->where('id', $id)->first();
            if (!$siswa) {
                return response()->json(['message' => 'Data siswa tidak ditemukan.'], 404);
            }

            if ((int) $siswa->is_processed !== 0) {
                return response()->json(['message' => 'Siswa yang sudah diproses menjadi siswa master tidak dapat dihapus di sini.'], 400);
            }

            if ($siswa->jenjang_id && !$request->user()->bolehJenjang($siswa->jenjang_id)) {
                return response()->json(['message' => 'Anda tidak memiliki akses ke data siswa ini.'], 403);
            }

            DB::table('siswas')->where('id', $id)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Data siswa baru sementara berhasil dihapus.',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Gagal menghapus siswa baru sementara: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal menghapus data siswa.'], 500);
        }
    }
}