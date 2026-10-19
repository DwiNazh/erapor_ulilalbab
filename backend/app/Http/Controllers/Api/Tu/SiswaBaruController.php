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
     * POST /api/tu/siswa-baru/simpan-nis
     * Migrasi siswa dari tabel staging (siswas) ke master (siswa) + siswa_tahun
     */
    public function simpanNis(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:siswas,id',
            // PERBAIKAN: NIS & NISN dicek unik di KEDUA tabel (siswas & siswa),
            // supaya tidak ada siswa lama & siswa baru bentrok NIS/NISN.
            'nis' => 'required|string|max:20|unique:siswas,nis|unique:siswa,nis',
            'nisn' => 'nullable|string|max:20|unique:siswas,nisn|unique:siswa,nisn',
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
            $tahunSekarang = TahunAjaran::where('aktif', 1)->firstOrFail();

            // 2. Cari Tahun Ajaran Berikutnya (Target)
            //    CATATAN: masih mengandalkan urutan id. Kalau tabel tahun_ajaran
            //    punya kolom eksplisit untuk urutan/tanggal_mulai, sebaiknya
            //    ->orderBy('tanggal_mulai') dipakai supaya tidak salah kalau
            //    ada tahun ajaran yang dibuat belakangan tapi urutannya di masa lalu.
            $tahunTarget = TahunAjaran::where('id', '>', $tahunSekarang->id)
                ->orderBy('id', 'asc')
                ->first();

            if (!$tahunTarget) {
                throw new \Exception('Tahun ajaran berikutnya belum dibuat/tidak ditemukan. Silakan buat tahun ajaran baru terlebih dahulu.');
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
}