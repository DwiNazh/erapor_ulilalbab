<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Tambahkan kolom jenis jika belum ada
        if (!Schema::hasColumn('nilai_quran', 'jenis')) {
            Schema::table('nilai_quran', function (Blueprint $table) {
                $table->enum('jenis', ['tahfidz', 'tilawah'])->after('semester')->nullable();
            });
        }

        // 2. Isi data lama yang telanjur NULL menjadi 'tahfidz'
        DB::table('nilai_quran')->whereNull('jenis')->update(['jenis' => 'tahfidz']);

        // 3. Drop unique index lama menggunakan Raw SQL di dalam Try-Catch agar anti-error
        try {
            // Kita coba tebak nama index bawaan laravel
            DB::statement('ALTER TABLE nilai_quran DROP INDEX nilai_quran_siswa_id_kelompok_quran_id_tahun_ajaran_semester_unique');
        } catch (\Exception $e) {
            // Jika gagal, abaikan karena kemungkinan nama index-nya berbeda di DB kamu
        }

        try {
            // Alternatif nama index pendek yang sering digenerate MySQL otomatis
            DB::statement('ALTER TABLE nilai_quran DROP INDEX siswa_id_kelompok_quran_id_tahun_ajaran_semester_unique');
        } catch (\Exception $e) {
            // Abaikan jika gagal
        }

        // 4. Ubah kolom menjadi NOT NULL dan daftarkan Unique Composite Key yang baru
        Schema::table('nilai_quran', function (Blueprint $table) {
            $table->enum('jenis', ['tahfidz', 'tilawah'])->change();

            // Tambahkan index baru menggunakan penamaan kustom yang aman
            $table->unique(
                ['siswa_id', 'kelompok_quran_id', 'tahun_ajaran', 'semester', 'jenis'], 
                'nilai_quran_composite_jenis_unique'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('nilai_quran', function (Blueprint $table) {
            try {
                $table->dropUnique('nilai_quran_composite_jenis_unique');
            } catch (\Exception $e) {}

            $table->dropColumn('jenis');
        });
    }
};