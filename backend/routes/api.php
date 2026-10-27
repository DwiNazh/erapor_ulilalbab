<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\Tu\KenaikanKelasController;
use App\Http\Controllers\Api\Tu\SiswaBaruController;
use App\Http\Controllers\Api\Tu\DataSiswaController;
use App\Http\Controllers\Api\Tu\TahunAjaranController;
use App\Http\Controllers\Api\Tu\PenempatanSiswaController;
use App\Http\Controllers\Api\Tu\RombelController;
use App\Http\Controllers\Api\Tu\JadwalController;
use App\Http\Controllers\Api\Tu\MapelController;
use App\Http\Controllers\Api\Tu\PenugasanGuruController;
use App\Http\Controllers\Api\Tu\WaliKelasController;
use App\Http\Controllers\Api\Tu\PengaturanController;
use App\Http\Controllers\Api\Tu\GuruController as TuGuruController;
use App\Http\Controllers\Api\Tu\MutasiController;
use App\Http\Controllers\Api\Tu\DashboardTuController;
use App\Http\Controllers\Api\Tu\RekapRaporController;
use App\Http\Controllers\Api\Tu\EkstrakurikulerController;
use App\Http\Controllers\Api\Tu\PjblJudulController;
use App\Http\Controllers\Api\Tu\KelompokQuranController;
// use App\Http\Controllers\Api\Tu\MataPelajaranController;
// use App\Http\Controllers\Api\Tu\RombelsController;

use App\Http\Controllers\Api\gurusd\GuruController;
use App\Http\Controllers\Api\gurusd\AbsensiMapelController;
use App\Http\Controllers\Api\gurusd\AbsensiHarianController;
use App\Http\Controllers\Api\gurusd\NilaiController;
use App\Http\Controllers\Api\gurusd\NilaiKoKurikulerController;
use App\Http\Controllers\Api\gurusd\NilaiEkstrakurikulerController;
use App\Http\Controllers\Api\gurusd\GuruPenugasanController;
use App\Http\Controllers\Api\gurusd\JadwalSayaController;
use App\Http\Controllers\Api\gurusd\TemplateDeskripsiController;
use App\Http\Controllers\Api\gurusd\TemplateDeskripsiIntrakurikulerController;
use App\Http\Controllers\Api\gurusd\RaporGuruController;
use App\Http\Controllers\Api\gurusd\DashboardGuruController;
use App\Http\Controllers\Api\gurusd\KelompokQuranGuruController;
use App\Http\Controllers\Api\gurusd\PenilaianQuranController; // ← TAMBAHAN


use App\Http\Controllers\Api\Superadmin\StatistikController;
use App\Http\Controllers\Api\Superadmin\UserController;
use App\Http\Controllers\Api\Superadmin\Pengaturansuperadmincontroller as SuperadminPengaturanController;
use App\Http\Controllers\Api\Superadmin\DashboardSAController;
use App\Http\Controllers\Api\Superadmin\ResetPasswordController;

use App\Http\Controllers\Api\Siswa\AuthSiswaController;
use App\Http\Controllers\Api\Siswa\DashboardSiswaController;
use App\Http\Controllers\Api\Siswa\SiswaNilaiController;
use App\Http\Controllers\Api\Siswa\JadwalSiswaController;
use App\Http\Controllers\Api\Siswa\ProfilSiswaController;
use App\Http\Controllers\Api\Siswa\RaporSiswaController;
use App\Http\Controllers\Api\Siswa\AbsensiSiswaController;

use App\Http\Controllers\Api\Kepsek\DashboardKepsekController;
use App\Http\Controllers\Api\Kepsek\MonitoringGuruController;
use App\Http\Controllers\Api\Kepsek\ApprovalRaporController;


// ==================== AUTH (public) ====================
Route::post('/login', [AuthController::class, 'login']);
Route::post('/siswa/login', [AuthSiswaController::class, 'login']);


// ==================== PROTECTED SISWA ====================
Route::middleware('auth:sanctum')->prefix('siswa')->group(function () {

    Route::get('/me', [AuthSiswaController::class, 'me']);
    Route::get('/dashboard', [DashboardSiswaController::class, 'index']);
    Route::get('/jadwal', [JadwalSiswaController::class, 'index']);
    Route::get('/profil', [ProfilSiswaController::class, 'index']);
    Route::post('/profil/ganti-password', [ProfilSiswaController::class, 'gantiPassword']);

    Route::get('/nilai', [SiswaNilaiController::class, 'index']);
    Route::get('/nilai/kokurikuler', [SiswaNilaiController::class, 'kokurikuler']);
    Route::get('/nilai/ekstrakurikuler', [SiswaNilaiController::class, 'ekstrakurikuler']);

    Route::get('/absensi', [AbsensiSiswaController::class, 'index']);

    Route::get('/rapor', [RaporSiswaController::class, 'index']);
    Route::get('/tahunajaran/aktif', [RaporSiswaController::class, 'tahunAktif']);
});

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');


// ==================== PROTECTED (semua role) ====================
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/update', [AuthController::class, 'update']);
    Route::post('/user/change-password', [AuthController::class, 'changePassword']);


    // ==============================================================
    // TU (admintu)
    // ==============================================================
    Route::middleware('role:admintu')->prefix('tu')->group(function () {

        Route::get('/dashboard', [DashboardTuController::class, 'index']);

        Route::prefix('tahunajaran')->group(function () {
            Route::get('/', [TahunAjaranController::class, 'index']);
            Route::post('/', [TahunAjaranController::class, 'store']);
            Route::put('/{id}/aktifkan', [TahunAjaranController::class, 'aktifkan']);
            Route::put('/{id}/tutup', [TahunAjaranController::class, 'tutup']);
            Route::put('/{id}/semester', [TahunAjaranController::class, 'gantiSemester']);
            Route::get('aktif', [TahunAjaranController::class, 'aktif']);
            Route::post('promosi', [TahunAjaranController::class, 'promosiMassal']);
        });

        Route::get('/rombel', [RombelController::class, 'index']);
        Route::post('/rombel', [RombelController::class, 'store']);
        Route::delete('/rombel/{id}', [RombelController::class, 'destroy']);
        Route::get('/rombel/{id}/count', [PenempatanSiswaController::class, 'getRombelCount']);

        Route::prefix('penempatan-siswa')->group(function () {
            Route::get('/siswa-belum-terdaftar', [PenempatanSiswaController::class, 'siswaBelumTerdaftar']);
            Route::post('/tempatkan', [PenempatanSiswaController::class, 'tempatkanSiswa'])->middleware('check.finalisasi');
        });

        Route::prefix('kenaikan-kelas')->group(function () {
            Route::get('/siswa-per-kelas', [KenaikanKelasController::class, 'siswaPerKelas']);
            Route::post('/promosi', [KenaikanKelasController::class, 'promosi'])->middleware('check.finalisasi');
            Route::post('/finalisasi', [KenaikanKelasController::class, 'finalisasi']);
            Route::get('/status-keseluruhan', [KenaikanKelasController::class, 'statusKeseluruhan']);
            Route::post('/finalisasi-total', [KenaikanKelasController::class, 'finalisasiTotal']);
        });

        Route::prefix('wali-kelas')->group(function () {
            Route::get('/', [WaliKelasController::class, 'index']);
            Route::post('/', [WaliKelasController::class, 'store'])->middleware('check.finalisasi');
            Route::get('/guru-tersedia', [WaliKelasController::class, 'guruTersedia']);
            Route::post('/siswa-baru', [WaliKelasController::class, 'storeSiswaBaru'])->middleware('check.finalisasi');
            Route::put('/{rombelId}', [WaliKelasController::class, 'update'])->middleware('check.finalisasi');
            Route::delete('/{rombelId}', [WaliKelasController::class, 'destroy'])->middleware('check.finalisasi');
        });

        Route::get('/guru', [KenaikanKelasController::class, 'daftarGuru']);
        Route::get('/pengaturan', [PengaturanController::class, 'index']);
        Route::post('/pengaturan/update', [PengaturanController::class, 'update']);

        Route::prefix('siswa-baru')->group(function () {
            Route::get('/', [SiswaBaruController::class, 'index']);
            Route::post('/bagikan-sub-kelas', [SiswaBaruController::class, 'bagikanSubKelasMassal'])->middleware('check.finalisasi');
            Route::post('/bagikan-sub-kelas-batch', [SiswaBaruController::class, 'bagikanSubKelasBatch'])->middleware('check.finalisasi');
            Route::post('/simpan-nis', [SiswaBaruController::class, 'simpanNis'])->middleware('check.finalisasi');
            Route::post('/import-sementara', [SiswaBaruController::class, 'importSementara'])->middleware('check.finalisasi');
            Route::delete('/{id}', [SiswaBaruController::class, 'hapusSementara'])->middleware('check.finalisasi');
        });

        Route::prefix('data-siswa')->group(function () {
            Route::get('/', [DataSiswaController::class, 'index']);
            Route::get('/{id}', [DataSiswaController::class, 'show']);
            Route::put('/{id}/kategori', [DataSiswaController::class, 'updateKategori']);
            Route::post('/kategori-bulk', [DataSiswaController::class, 'updateKategoriBulk']);
        });

        Route::prefix('data-guru')->group(function () {
            Route::get('/', [TuGuruController::class, 'index']);
            Route::post('/', [TuGuruController::class, 'store']);
            Route::put('/{id}', [TuGuruController::class, 'update']);
            Route::delete('/{id}', [TuGuruController::class, 'destroy']);
        });

        Route::prefix('jadwal')->group(function () {
            Route::get('/', [JadwalController::class, 'index']);
            Route::get('rombel/{rombelId}', [JadwalController::class, 'byRombel']);
            Route::get('mapel', [JadwalController::class, 'getMapel']);
            Route::post('/', [JadwalController::class, 'store']);
            Route::delete('{id}', [JadwalController::class, 'destroy']);
        });

        Route::prefix('penugasan-guru')->group(function () {
            Route::get('/', [PenugasanGuruController::class, 'index']);
            Route::post('/', [PenugasanGuruController::class, 'store']);
            Route::delete('{id}', [PenugasanGuruController::class, 'destroy']);
        });

        Route::prefix('rekap-rapor')->group(function () {
            Route::get('/kelas', [RekapRaporController::class, 'getKelas']);
            Route::get('/', [RekapRaporController::class, 'index']);
            Route::get('/detail', [RekapRaporController::class, 'detail']);
            Route::get('/cetak', [RekapRaporController::class, 'cetak']);
            Route::get('/export-excel', [RekapRaporController::class, 'exportExcel']);
        });

        Route::get('/rombel-aktif', [MutasiController::class, 'rombelAktif']);

        Route::prefix('mutasi')->group(function () {
            Route::get('/', [MutasiController::class, 'index']);
            Route::post('/siswa', [MutasiController::class, 'mutasiSiswa']);
            Route::post('/guru', [MutasiController::class, 'mutasiGuru']);
        });

        Route::prefix('ekskul')->group(function () {
            Route::get('/', [EkstrakurikulerController::class, 'index']);
            Route::post('/', [EkstrakurikulerController::class, 'store']);
            Route::put('/{id}', [EkstrakurikulerController::class, 'update']);
            Route::delete('/{id}', [EkstrakurikulerController::class, 'destroy']);
        });

        Route::prefix('pjbl-judul')->middleware(['auth:sanctum'])->group(function () {
            Route::get('/', [PjblJudulController::class, 'index']);
            Route::post('/', [PjblJudulController::class, 'store']);
            Route::post('/bulk', [PjblJudulController::class, 'bulkStore']);
            Route::delete('/{id}', [PjblJudulController::class, 'destroy']);
        });

        Route::prefix('mapel')->group(function () {
            Route::get('/', [MapelController::class, 'index']);
            Route::post('/', [MapelController::class, 'store']);
            Route::put('/{id}', [MapelController::class, 'update']);
            Route::delete('/{id}', [MapelController::class, 'destroy']);
        });

        Route::get('/siswa-list', function (\Illuminate\Http\Request $request) {
            // 1. Ambil ID Tahun Ajaran yang sedang aktif atau yang dipilih
            $tahunId = $request->query('tahun_ajaran_id');
            if (!$tahunId) {
                $tahunId = \DB::table('tahun_ajaran')->where('aktif', 1)->value('id')
                    ?? \DB::table('tahun_ajaran')->orderByDesc('id')->value('id');
            }

            if (!$tahunId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak ada tahun ajaran yang aktif saat ini.',
                    'data' => []
                ]);
            }

            // 2. Ambil data siswa berdasarkan siswa_tahun sesuai jenjang admin
            $user = $request->user();
            $jenjangIds = $user ? $user->jenjangIds() : null;

            $data = \DB::table('siswa_tahun')
                ->join('siswa', 'siswa_tahun.siswa_id', '=', 'siswa.id')
                ->join('rombel', 'siswa_tahun.rombel_id', '=', 'rombel.id')
                ->where('siswa_tahun.tahun_ajaran_id', $tahunId)
                ->when($jenjangIds !== null, function ($q) use ($jenjangIds) {
                    $q->whereIn('rombel.jenjang_id', $jenjangIds);
                })
                ->select(
                    'siswa.id',
                    'siswa.nama',
                    'siswa.nis',
                    \DB::raw("CONCAT('Kelas ', rombel.tingkat_kelas, ' ', rombel.sub_nama) as rombel_sekarang")
                )
                ->orderBy('siswa.nama')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        });

        Route::get('/guru-list', function (\Illuminate\Http\Request $request) {
            $user = $request->user();
            $jenjangIds = $user ? $user->jenjangIds() : null;

            $data = \App\Models\User::where('role', 'guru')
                ->when($jenjangIds !== null, function ($q) use ($jenjangIds) {
                    $q->where(function ($sub) use ($jenjangIds) {
                        $sub->whereIn('jenjang_id', $jenjangIds)
                            ->orWhereNull('jenjang_id');
                    });
                })
                ->select('id', 'name as nama')
                ->orderBy('name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        });

        Route::get('/mata-pelajaran', fn() => response()->json([
            'success' => true,
            'data' => \App\Models\Mapel::select('id', 'nama as nama_mapel')->get(),
        ]));

        Route::get('/kelas', fn() => response()->json([
            'success' => true,
            'data' => [
                '1A',
                '1B',
                '1C',
                '2A',
                '2B',
                '2C',
                '3A',
                '3B',
                '3C',
                '4A',
                '4B',
                '4C',
                '5A',
                '5B',
                '5C',
                '6A',
                '6B',
                '6C'
            ],
        ]));

        Route::prefix('quran')->group(function () {
            Route::get('/aktif', [KelompokQuranController::class, 'aktif']);
            Route::get('/kelompok', [KelompokQuranController::class, 'index']);
            Route::post('/kelompok', [KelompokQuranController::class, 'store']);
            Route::delete('/kelompok/{id}', [KelompokQuranController::class, 'destroy']);
            Route::get('/siswa-belum-plot', [KelompokQuranController::class, 'siswaBelumPlot']);
            Route::post('/kelompok/{id}/tambah-anggota', [KelompokQuranController::class, 'tambahAnggota']);
            Route::delete('/kelompok/{kelompokId}/hapus-anggota/{siswaId}', [KelompokQuranController::class, 'hapusAnggota']);
            Route::post('/kelompok/pindah', [KelompokQuranController::class, 'pindahKelompok']);
            Route::post('/kelompok/aktifkan', [KelompokQuranController::class, 'aktifkan']);
        });
    }); // akhir group TU


    // ==============================================================
    // KEPALA SEKOLAH
    // ==============================================================
    Route::middleware('role:kepala_sekolah')->prefix('kepsek')->group(function () {

        Route::get('/dashboard', [DashboardKepsekController::class, 'index']);
        Route::get('/monitoring-guru', [MonitoringGuruController::class, 'index']);
        Route::get('monitoring-guru/{id}/subjects', [MonitoringGuruController::class, 'getSubjects']);
        Route::get('monitoring-guru/{id}/analysis', [MonitoringGuruController::class, 'getAnalysis']);
        Route::get('/monitoring-guru/{id}', [MonitoringGuruController::class, 'show']);

        Route::prefix('rapor')->group(function () {
            Route::get('/list-approval', [ApprovalRaporController::class, 'listApproval']);
            Route::post('/approve', [ApprovalRaporController::class, 'approve']);
            Route::post('/reject', [ApprovalRaporController::class, 'reject']);
        });

    }); // akhir group kepsek


    // ==============================================================
    // GURU
    // ==============================================================
    Route::middleware('role:guru')->prefix('guru')->group(function () {

        Route::get('/dashboard-guru', [DashboardGuruController::class, 'getDashboardData']);
        Route::get('tahunajaran/aktif', [TahunAjaranController::class, 'aktif']);
        Route::get('tahunajaran', [TahunAjaranController::class, 'index']);

        Route::get('/rombel', [GuruController::class, 'rombelDiampu']);
        Route::get('rombel/{rombelId}/siswa', [GuruController::class, 'daftarSiswaRombel']);
        Route::get('jadwal/rombel/{rombelId}', [GuruController::class, 'jadwalRombel']);
        Route::get('jadwal-saya', [JadwalSayaController::class, 'index']);

        Route::get('/penugasan-saya', [GuruPenugasanController::class, 'penugasanSaya']);
        Route::get('penugasan-rombel/{rombel_id}', [GuruPenugasanController::class, 'penugasanByRombel']);

        Route::prefix('nilai')->group(function () {
            Route::get('{mapel_id}/{semester}/{tahun_ajaran}', [NilaiController::class, 'index'])
                ->where('tahun_ajaran', '.*')
                ->name('nilai.index');
            Route::get('per-mapel/{mapel_id}', [NilaiController::class, 'indexPerMapel']);
            Route::post('/', [NilaiController::class, 'storeBulk']);

            // ── Wali kelas: lihat rekap nilai quran rombel-nya ────────
            Route::get('quran', [PenilaianQuranController::class, 'getNilai']);
            // ──────────────────────────────────────────────────────────
        });

        Route::prefix('quran')->group(function () {
            // Kelompok & data siswa bimbingan
            Route::get('/kelompok-saya', [KelompokQuranGuruController::class, 'kelompokSaya']);
            Route::get('/kelompok/{kelompokId}/siswa', [KelompokQuranGuruController::class, 'siswaKelompok']);

            // Nilai e-Rapor (Ambil & Simpan dinamis per Jenis)
            Route::get('/nilai', [KelompokQuranGuruController::class, 'getNilaiKelompok']);
            Route::post('/nilai', [KelompokQuranGuruController::class, 'simpanNilaiErapor']);
        });

        Route::prefix('absensi')->group(function () {
            // Dipertahankan — dipakai NilaiAkademik.jsx, BUKAN untuk absensi
            Route::get('mapel-diampu', [AbsensiMapelController::class, 'getMapelDiampu']);

            // Absensi harian (pengganti absensi per-mapel)
            Route::prefix('harian')->group(function () {
                Route::get('rombel-wali', [AbsensiHarianController::class, 'getRombelWali']);
                Route::get('siswa/{rombelId}', [AbsensiHarianController::class, 'getSiswaRombel']);
                Route::get('by-tanggal', [AbsensiHarianController::class, 'getAbsensiTanggal']);
                Route::post('/', [AbsensiHarianController::class, 'store']);
                Route::get('rekap', [AbsensiHarianController::class, 'rekapBulanan']);
            });
        });

        Route::prefix('rapor')->group(function () {
            Route::get('/preview', [RaporGuruController::class, 'preview']);
            Route::post('/update-catatan-individu', [RaporGuruController::class, 'updateCatatanIndividu']);
            Route::post('/ajukan-kepsek', [RaporGuruController::class, 'ajukanKepsek']);
            Route::get('/final', [RaporGuruController::class, 'raporFinal']);
        });

        Route::prefix('template-deskripsi')->group(function () {
            Route::get('/intrakurikuler', [TemplateDeskripsiIntrakurikulerController::class, 'index']);
            Route::post('/intrakurikuler/save', [TemplateDeskripsiIntrakurikulerController::class, 'save']);

            // ── TAMBAHAN: Template deskripsi Al-Qur'an ────────────────
            Route::get('/quran', [PenilaianQuranController::class, 'getTemplateQuran']);
            // ──────────────────────────────────────────────────────────

            Route::get('/{jenis}', [TemplateDeskripsiController::class, 'index'])
                ->where('jenis', 'kokurikuler|ekstrakurikuler');
            Route::post('/save-bulk', [TemplateDeskripsiController::class, 'saveBulk']);
        });

        Route::prefix('nilai-kokurikuler')->group(function () {
            Route::get('{semester}', [NilaiKoKurikulerController::class, 'index']);
            Route::post('bulk', [NilaiKoKurikulerController::class, 'storeBulk']);
        });

        Route::prefix('ekstrakurikuler')->group(function () {
            Route::get('/', [NilaiEkstrakurikulerController::class, 'index']);
            Route::post('save-bulk', [NilaiEkstrakurikulerController::class, 'saveBulk']);
        });

    }); // akhir group guru


    // ==============================================================
    // SUPERADMIN
    // ==============================================================
    Route::middleware('role:superadmin')->prefix('superadmin')->group(function () {

        Route::get('dashboard', [DashboardSAController::class, 'index']);

        Route::get('statistik', [StatistikController::class, 'index']);

        Route::get('users', [UserController::class, 'index']);
        Route::get('jenjang', [UserController::class, 'getJenjang']);
        Route::post('users', [UserController::class, 'store']);
        Route::get('users/{id}', [UserController::class, 'show']);
        Route::put('users/{id}', [UserController::class, 'update']);
        Route::delete('users/{id}', [UserController::class, 'destroy']);
        Route::post('users/{id}/reset-password', [ResetPasswordController::class, 'resetUserPassword']);
        Route::post('siswa/{id}/reset-password', [ResetPasswordController::class, 'resetSiswaPassword']);

        Route::get('pengaturan/sekolah', [SuperadminPengaturanController::class, 'getSekolah']);
        Route::post('pengaturan/sekolah', [SuperadminPengaturanController::class, 'saveSekolah']);

        Route::get('pengaturan/tahun-ajaran', [SuperadminPengaturanController::class, 'getTahunAjaran']);
        Route::post('pengaturan/tahun-ajaran', [SuperadminPengaturanController::class, 'storeTahunAjaran']);
        Route::put('pengaturan/tahun-ajaran/{id}/aktifkan', [SuperadminPengaturanController::class, 'aktifkanTahunAjaran']);
        Route::delete('pengaturan/tahun-ajaran/{id}', [SuperadminPengaturanController::class, 'deleteTahunAjaran']);

        Route::get('pengaturan/notifikasi', [SuperadminPengaturanController::class, 'getNotifikasi']);
        Route::put('pengaturan/notifikasi', [SuperadminPengaturanController::class, 'saveNotifikasi']);

        Route::get('pengaturan/sistem', [SuperadminPengaturanController::class, 'getSistem']);
        Route::post('pengaturan/backup', [SuperadminPengaturanController::class, 'backup']);

    }); // akhir group superadmin

}); // akhir group auth:sanctum