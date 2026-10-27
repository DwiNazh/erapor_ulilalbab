<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use App\Models\User;
use App\Models\TahunAjaran;
use App\Models\Jenjang;
use App\Models\Rombel;
use App\Models\Siswa;
use App\Models\SiswaTahun;
use App\Models\FinalisasiJenjang;
use Illuminate\Support\Facades\DB;

class AcademicWorkflowAuditTest extends TestCase
{
    protected $adminUser;
    protected $tahunAktif;
    protected $tahunTarget;
    protected $jenjangSd;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setUpDatabase();

        // Seed basic master data
        $this->jenjangSd = Jenjang::create([
            'id' => 1,
            'nama' => 'SD',
            'kode' => 'sd',
            'kelas_min' => 1,
            'kelas_max' => 6,
        ]);

        $this->adminUser = User::create([
            'id' => 1,
            'name' => 'Admin TU SD',
            'nipy' => 'admintu_sd',
            'password' => bcrypt('password'),
            'role' => 'admintu',
            'jenjang_id' => 1,
        ]);

        $this->tahunAktif = TahunAjaran::create([
            'id' => 1,
            'nama' => '2024/2025',
            'status' => 'aktif',
            'aktif' => 1,
            'semester_aktif' => 2,
        ]);

        $this->tahunTarget = TahunAjaran::create([
            'id' => 2,
            'nama' => '2025/2026',
            'status' => 'nonaktif',
            'aktif' => 0,
            'semester_aktif' => 1,
        ]);
    }

    protected function setUpDatabase(): void
    {
        Schema::dropIfExists('siswa_tahun');
        Schema::dropIfExists('finalisasi_jenjang');
        Schema::dropIfExists('rombel');
        Schema::dropIfExists('siswas');
        Schema::dropIfExists('siswa');
        Schema::dropIfExists('tahun_ajaran');
        Schema::dropIfExists('jenjang');
        Schema::dropIfExists('users');

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('nipy')->nullable();
            $table->string('password');
            $table->string('role')->default('guru');
            $table->unsignedBigInteger('jenjang_id')->nullable();
            $table->timestamps();
        });

        Schema::create('jenjang', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('kode')->unique();
            $table->integer('kelas_min');
            $table->integer('kelas_max');
            $table->timestamps();
        });

        Schema::create('tahun_ajaran', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('status')->default('nonaktif');
            $table->boolean('aktif')->default(false);
            $table->integer('semester_aktif')->default(1);
            $table->timestamp('finalized_at')->nullable();
            $table->timestamps();
        });

        Schema::create('finalisasi_jenjang', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tahun_ajaran_id');
            $table->unsignedBigInteger('jenjang_id');
            $table->timestamp('finalized_at')->nullable();
            $table->unsignedBigInteger('finalized_by')->nullable();
            $table->timestamps();
        });

        Schema::create('rombel', function (Blueprint $table) {
            $table->id();
            $table->string('nama_rombel');
            $table->integer('tingkat_kelas');
            $table->string('sub_nama')->nullable();
            $table->unsignedBigInteger('tahun_ajaran_id');
            $table->unsignedBigInteger('guru_id')->nullable();
            $table->unsignedBigInteger('jenjang_id')->nullable();
            $table->string('kelompok_gender')->default('campuran');
            $table->timestamps();
        });

        Schema::create('siswa', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('nis')->nullable();
            $table->string('nisn')->nullable();
            $table->integer('kelas')->default(1);
            $table->string('sub')->nullable();
            $table->string('kategori')->nullable();
            $table->unsignedBigInteger('tahun_ajaran_id')->nullable();
            $table->boolean('is_graduated')->default(false);
            $table->string('status')->default('aktif');
            $table->timestamps();
        });

        Schema::create('siswas', function (Blueprint $table) {
            $table->id();
            $table->string('ppdb_id')->unique();
            $table->string('nama_user');
            $table->string('nama')->nullable();
            $table->string('nis')->nullable();
            $table->string('nisn')->nullable();
            $table->integer('kelas')->default(1);
            $table->string('sub_kelas')->nullable();
            $table->string('kategori')->nullable();
            $table->unsignedBigInteger('jenjang_id')->nullable();
            $table->tinyInteger('is_processed')->default(0);
            $table->string('status')->default('aktif');
            $table->timestamps();
        });

        Schema::create('siswa_tahun', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('siswa_id');
            $table->unsignedBigInteger('tahun_ajaran_id');
            $table->unsignedBigInteger('rombel_id')->nullable();
            $table->unsignedBigInteger('jenjang_id')->nullable();
            $table->string('status')->default('AKTIF');
            $table->tinyInteger('is_processed')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Fokus 1: Validasi promosi menolak tahun ajaran aktif dan tahun target yang tidak valid.
     */
    public function test_promosi_rejects_active_year_and_invalid_target_year(): void
    {
        $siswa = Siswa::create(['nama' => 'Budi', 'kelas' => 1]);
        SiswaTahun::create([
            'siswa_id' => $siswa->id,
            'tahun_ajaran_id' => $this->tahunAktif->id,
            'jenjang_id' => 1,
            'is_processed' => 0,
        ]);

        // Coba promosi ke tahun aktif sendiri -> harus 422
        $responseTargetAktif = $this->actingAs($this->adminUser)->postJson('/api/tu/kenaikan-kelas/promosi', [
            'tahun_ajaran_target_id' => $this->tahunAktif->id,
            'naik' => [['id' => $siswa->id]],
        ]);
        $responseTargetAktif->assertStatus(422);

        // Coba promosi ke tahun masa depan yang salah / bukan tahun berikutnya langsung -> harus 422
        $tahunLompat = TahunAjaran::create([
            'id' => 99,
            'nama' => '2030/2031',
            'status' => 'nonaktif',
            'aktif' => 0,
        ]);
        $responseTargetLompat = $this->actingAs($this->adminUser)->postJson('/api/tu/kenaikan-kelas/promosi', [
            'tahun_ajaran_target_id' => $tahunLompat->id,
            'naik' => [['id' => $siswa->id]],
        ]);
        $responseTargetLompat->assertStatus(422);

        // Promosi ke tahun target yang valid (2025/2026) -> harus berhasil
        $responseSukses = $this->actingAs($this->adminUser)->postJson('/api/tu/kenaikan-kelas/promosi', [
            'tahun_ajaran_target_id' => $this->tahunTarget->id,
            'naik' => [['id' => $siswa->id]],
        ]);
        $responseSukses->assertStatus(200);
        $this->assertDatabaseHas('siswa_tahun', [
            'siswa_id' => $siswa->id,
            'tahun_ajaran_id' => $this->tahunTarget->id,
            'status' => 'AKTIF',
        ]);
    }

    /**
     * Fokus 2: Penempatan siswa ke rombel harus memvalidasi kelas siswa, jenjang, dan kategori.
     */
    public function test_penempatan_validates_class_grade_jenjang_and_gender_category(): void
    {
        $siswa = Siswa::create([
            'nama' => 'Ahmad',
            'kelas' => 4,
            'kategori' => 'ikhwan',
        ]);

        $stTarget = SiswaTahun::create([
            'siswa_id' => $siswa->id,
            'tahun_ajaran_id' => $this->tahunTarget->id,
            'jenjang_id' => 1,
            'status' => 'AKTIF',
            'rombel_id' => null,
        ]);

        // Rombel kelas 5 (tidak cocok karena siswa kelas 4)
        $rombelBedaKelas = Rombel::create([
            'nama_rombel' => '5A Ikhwan',
            'tingkat_kelas' => 5,
            'sub_nama' => 'A',
            'tahun_ajaran_id' => $this->tahunTarget->id,
            'jenjang_id' => 1,
            'kelompok_gender' => 'ikhwan',
        ]);

        $resBedaKelas = $this->actingAs($this->adminUser)->postJson('/api/tu/penempatan-siswa/tempatkan', [
            'siswa_ids' => [$stTarget->id],
            'rombel_id' => $rombelBedaKelas->id,
            'tahun_ajaran_id' => $this->tahunTarget->id,
        ]);
        $resBedaKelas->assertStatus(422);

        // Rombel kelas 4 tapi kategori akhwat (tidak cocok karena siswa ikhwan)
        $rombelBedaKategori = Rombel::create([
            'nama_rombel' => '4A Akhwat',
            'tingkat_kelas' => 4,
            'sub_nama' => 'A',
            'tahun_ajaran_id' => $this->tahunTarget->id,
            'jenjang_id' => 1,
            'kelompok_gender' => 'akhwat',
        ]);

        $resBedaKategori = $this->actingAs($this->adminUser)->postJson('/api/tu/penempatan-siswa/tempatkan', [
            'siswa_ids' => [$stTarget->id],
            'rombel_id' => $rombelBedaKategori->id,
            'tahun_ajaran_id' => $this->tahunTarget->id,
        ]);
        $resBedaKategori->assertStatus(422);

        // Rombel kelas 4 ikhwan cocok
        $rombelCocok = Rombel::create([
            'nama_rombel' => '4A Ikhwan',
            'tingkat_kelas' => 4,
            'sub_nama' => 'A',
            'tahun_ajaran_id' => $this->tahunTarget->id,
            'jenjang_id' => 1,
            'kelompok_gender' => 'ikhwan',
        ]);

        $resCocok = $this->actingAs($this->adminUser)->postJson('/api/tu/penempatan-siswa/tempatkan', [
            'siswa_ids' => [$stTarget->id],
            'rombel_id' => $rombelCocok->id,
            'tahun_ajaran_id' => $this->tahunTarget->id,
        ]);
        $resCocok->assertStatus(200);
        $this->assertEquals($rombelCocok->id, $stTarget->fresh()->rombel_id);
    }

    /**
     * Fokus 3: Finalisasi memeriksa semua 4 prasyarat:
     * 1. promosi selesai
     * 2. penempatan selesai
     * 3. wali kelas lengkap
     * 4. siswa baru selesai
     */
    public function test_finalisasi_enforces_all_four_prerequisites(): void
    {
        // Kondisi A: Siswa aktif belum diproses kenaikan kelasnya
        $siswa1 = Siswa::create(['nama' => 'Siswa 1', 'kelas' => 1]);
        $stAktif = SiswaTahun::create([
            'siswa_id' => $siswa1->id,
            'tahun_ajaran_id' => $this->tahunAktif->id,
            'jenjang_id' => 1,
            'is_processed' => 0,
        ]);

        $resGagal1 = $this->actingAs($this->adminUser)->postJson('/api/tu/kenaikan-kelas/finalisasi', [
            'jenjang_id' => 1,
        ]);
        $resGagal1->assertStatus(422);
        $this->assertStringContainsString('belum diproses kenaikan', $resGagal1->json('message'));

        // Selesaikan promosi
        $stAktif->update(['is_processed' => 1]);
        $stTarget = SiswaTahun::create([
            'siswa_id' => $siswa1->id,
            'tahun_ajaran_id' => $this->tahunTarget->id,
            'jenjang_id' => 1,
            'status' => 'AKTIF',
            'rombel_id' => null, // Belum ditempatkan
        ]);

        // Kondisi B: Siswa baru ada yang belum diproses
        DB::table('siswas')->insert([
            'id' => 10,
            'ppdb_id' => 'PPDB001',
            'nama_user' => 'Calon Siswa',
            'kelas' => 1,
            'jenjang_id' => 1,
            'is_processed' => 0,
        ]);

        $resGagal2 = $this->actingAs($this->adminUser)->postJson('/api/tu/kenaikan-kelas/finalisasi', [
            'jenjang_id' => 1,
        ]);
        $resGagal2->assertStatus(422);
        $this->assertStringContainsString('siswa baru', $resGagal2->json('message'));

        // Selesaikan siswa baru
        DB::table('siswas')->where('id', 10)->update(['is_processed' => 1]);

        // Kondisi C: Penempatan belum selesai (siswa target belum punya rombel)
        $resGagal3 = $this->actingAs($this->adminUser)->postJson('/api/tu/kenaikan-kelas/finalisasi', [
            'jenjang_id' => 1,
        ]);
        $resGagal3->assertStatus(422);
        $this->assertStringContainsString('belum ditempatkan ke dalam rombel', $resGagal3->json('message'));

        // Buat rombel tanpa wali kelas
        $rombel = Rombel::create([
            'nama_rombel' => '2A',
            'tingkat_kelas' => 2,
            'tahun_ajaran_id' => $this->tahunTarget->id,
            'jenjang_id' => 1,
            'guru_id' => null, // Belum ada wali kelas
        ]);
        $stTarget->update(['rombel_id' => $rombel->id]);

        // Kondisi D: Wali kelas belum lengkap
        $resGagal4 = $this->actingAs($this->adminUser)->postJson('/api/tu/kenaikan-kelas/finalisasi', [
            'jenjang_id' => 1,
        ]);
        $resGagal4->assertStatus(422);
        $this->assertStringContainsString('belum ditentukan wali kelasnya', $resGagal4->json('message'));

        // Berikan wali kelas
        $guru = User::create([
            'id' => 2,
            'name' => 'Guru Wali',
            'nipy' => 'guru1',
            'password' => bcrypt('password'),
            'role' => 'guru',
            'jenjang_id' => 1,
        ]);
        $rombel->update(['guru_id' => $guru->id]);

        // Semua prasyarat lengkap -> finalisasi harus berhasil
        $resSukses = $this->actingAs($this->adminUser)->postJson('/api/tu/kenaikan-kelas/finalisasi', [
            'jenjang_id' => 1,
        ]);
        $resSukses->assertStatus(200);
        $this->assertTrue($this->tahunAktif->fresh()->isFinalizedForJenjang(1));
    }

    /**
     * Fokus 4: Middleware penguncian (check.finalisasi) menolak mutasi setelah finalisasi.
     */
    public function test_post_finalisasi_middleware_rejects_mutations(): void
    {
        // Kunci finalisasi untuk jenjang SD
        FinalisasiJenjang::create([
            'tahun_ajaran_id' => $this->tahunAktif->id,
            'jenjang_id' => 1,
            'finalized_at' => now(),
            'finalized_by' => $this->adminUser->id,
        ]);

        $siswa = Siswa::create(['nama' => 'Test Mutasi', 'kelas' => 1]);

        // Coba panggil promosi -> ditolak 403 oleh middleware
        $resPromosi = $this->actingAs($this->adminUser)->postJson('/api/tu/kenaikan-kelas/promosi', [
            'tahun_ajaran_target_id' => $this->tahunTarget->id,
            'naik' => [['id' => $siswa->id]],
        ]);
        $resPromosi->assertStatus(403);
        $this->assertStringContainsString('difinalisasi', $resPromosi->json('message'));

        // Coba panggil penempatan -> ditolak 403 oleh middleware
        $resPenempatan = $this->actingAs($this->adminUser)->postJson('/api/tu/penempatan-siswa/tempatkan', [
            'siswa_id' => $siswa->id,
            'rombel_id' => 1,
            'tahun_ajaran_id' => $this->tahunTarget->id,
        ]);
        $resPenempatan->assertStatus(403);
    }

    /**
     * Fokus 5: Validasi NISN pada simpanNis tidak menolak NISN milik baris pendaftar yang sedang diproses.
     */
    public function test_simpan_nis_allows_updating_with_same_applicant_nisn(): void
    {
        // Buat baris di siswas (pendaftar PPDB) yang sudah memiliki NISN
        $ppdbId = DB::table('siswas')->insertGetId([
            'ppdb_id' => 'PPDB999',
            'nama_user' => 'Calon Siswa Baru',
            'nisn' => '0012345678',
            'kelas' => 1,
            'sub_kelas' => 'A',
            'kategori' => 'ikhwan',
            'jenjang_id' => 1,
            'is_processed' => 0,
        ]);

        // Panggil simpanNis menggunakan NIS baru dan NISN yang sama dengan baris pendaftar ini
        $response = $this->actingAs($this->adminUser)->postJson('/api/tu/siswa-baru/simpan-nis', [
            'id' => $ppdbId,
            'nis' => '10001',
            'nisn' => '0012345678',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('siswa', [
            'nama' => 'Calon Siswa Baru',
            'nis' => '10001',
            'nisn' => '0012345678',
        ]);
    }

    /**
     * Fokus 6: Promosi ulang aman/idempoten dan menandai is_processed = 1 di tahun aktif.
     */
    public function test_promosi_ulang_is_idempotent_and_ensures_active_year_is_processed(): void
    {
        $siswa = Siswa::create(['nama' => 'Siswa Idempoten', 'kelas' => 2]);
        $rombelAktif = Rombel::create([
            'nama_rombel' => '2A',
            'tingkat_kelas' => 2,
            'tahun_ajaran_id' => $this->tahunAktif->id,
            'jenjang_id' => 1,
        ]);
        $stAktif = SiswaTahun::create([
            'siswa_id' => $siswa->id,
            'tahun_ajaran_id' => $this->tahunAktif->id,
            'rombel_id' => $rombelAktif->id,
            'jenjang_id' => 1,
            'is_processed' => 0,
        ]);

        // Promosi pertama: Naik kelas ke kelas 3
        $res1 = $this->actingAs($this->adminUser)->postJson('/api/tu/kenaikan-kelas/promosi', [
            'tahun_ajaran_target_id' => $this->tahunTarget->id,
            'naik' => [['id' => $siswa->id]],
        ]);
        $res1->assertStatus(200);

        $this->assertEquals(1, $stAktif->fresh()->is_processed);
        $this->assertDatabaseHas('siswa_tahun', [
            'siswa_id' => $siswa->id,
            'tahun_ajaran_id' => $this->tahunTarget->id,
            'status' => 'AKTIF',
        ]);
        $this->assertEquals(3, $siswa->fresh()->kelas);

        // Promosi ulang (keputusan diubah menjadi tinggal di kelas 2)
        $res2 = $this->actingAs($this->adminUser)->postJson('/api/tu/kenaikan-kelas/promosi', [
            'tahun_ajaran_target_id' => $this->tahunTarget->id,
            'tinggal' => [['id' => $siswa->id]],
        ]);
        $res2->assertStatus(200);

        // Harus tetap idempoten: tidak ada duplikat baris di tahun target
        $countTarget = SiswaTahun::where('siswa_id', $siswa->id)
            ->where('tahun_ajaran_id', $this->tahunTarget->id)
            ->count();
        $this->assertEquals(1, $countTarget);
        $this->assertEquals(1, $stAktif->fresh()->is_processed);
        $this->assertEquals(2, $siswa->fresh()->kelas);

        // Ubah keputusan ke LULUS (untuk kelas 6)
        $siswa6 = Siswa::create(['nama' => 'Siswa Kelas 6', 'kelas' => 6]);
        $rombel6 = Rombel::create([
            'nama_rombel' => '6A',
            'tingkat_kelas' => 6,
            'tahun_ajaran_id' => $this->tahunAktif->id,
            'jenjang_id' => 1,
        ]);
        $stAktif6 = SiswaTahun::create([
            'siswa_id' => $siswa6->id,
            'tahun_ajaran_id' => $this->tahunAktif->id,
            'rombel_id' => $rombel6->id,
            'jenjang_id' => 1,
            'is_processed' => 0,
        ]);

        // Buat dummy target record sebelumnya
        SiswaTahun::create([
            'siswa_id' => $siswa6->id,
            'tahun_ajaran_id' => $this->tahunTarget->id,
            'status' => 'AKTIF',
        ]);

        $resLulus = $this->actingAs($this->adminUser)->postJson('/api/tu/kenaikan-kelas/promosi', [
            'tahun_ajaran_target_id' => $this->tahunTarget->id,
            'lulus' => [['id' => $siswa6->id]],
        ]);
        $resLulus->assertStatus(200);

        // Record di target year harus terhapus, status di tahun aktif jadi LULUS
        $this->assertDatabaseMissing('siswa_tahun', [
            'siswa_id' => $siswa6->id,
            'tahun_ajaran_id' => $this->tahunTarget->id,
        ]);
        $this->assertEquals('LULUS', $stAktif6->fresh()->status);
        $this->assertEquals(1, $stAktif6->fresh()->is_processed);
    }

    /**
     * Siswa baru menolak fallback ke tahun aktif jika tahun target belum dibuat.
     */
    public function test_siswa_baru_never_falls_back_to_active_year(): void
    {
        // Hapus tahun target sehingga hanya tersisa tahun aktif
        TahunAjaran::where('id', $this->tahunTarget->id)->delete();

        $ppdbId = DB::table('siswas')->insertGetId([
            'ppdb_id' => 'PPDB_NO_TARGET',
            'nama_user' => 'Calon Siswa No Target',
            'kelas' => 1,
            'sub_kelas' => 'A',
            'kategori' => 'ikhwan',
            'jenjang_id' => 1,
            'is_processed' => 0,
        ]);

        $response = $this->actingAs($this->adminUser)->postJson('/api/tu/siswa-baru/simpan-nis', [
            'id' => $ppdbId,
            'nis' => '10002',
        ]);

        // Harus gagal dan tidak boleh masuk ke tahun aktif
        $response->assertStatus(500);
        $this->assertStringContainsString('Tahun ajaran berikutnya belum dibuat', $response->json('message'));
        $this->assertDatabaseMissing('siswa_tahun', [
            'tahun_ajaran_id' => $this->tahunAktif->id,
        ]);
    }
}
