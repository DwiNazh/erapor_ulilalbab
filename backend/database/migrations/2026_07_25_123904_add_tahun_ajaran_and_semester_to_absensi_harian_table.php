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
        Schema::table('absensi_harian', function (Blueprint $table) {
            $table->boolean('aktif')->default(false);
            // 1. Buat kolom sebagai nullable() dulu agar data lama tidak error
            $table->foreignId('tahun_ajaran_id')
                  ->after('rombel_id')
                  ->nullable() 
                  ->constrained('tahun_ajaran')
                  ->onDelete('cascade');

            $table->enum('semester', ['semester1', 'semester2'])
                  ->after('tahun_ajaran_id')
                  ->nullable(); // jadikan nullable dulu
        });

        // 2. Ambil ID Tahun Ajaran yang sedang aktif saat ini
        $tahunAktifId = DB::table('tahun_ajaran')->where('aktif', 1)->value('id');

        if ($tahunAktifId) {
            // 3. Update semua data absensi lama agar mengarah ke tahun ajaran aktif & semester1 (sebagai default)
            DB::table('absensi_harian')->whereNull('tahun_ajaran_id')->update([
                'tahun_ajaran_id' => $tahunAktifId,
                'semester' => 'semester1'
            ]);

            // 4. Kembalikan struktur kolom menjadi NOT NULL setelah data lama aman
            Schema::table('absensi_harian', function (Blueprint $table) {
                $table->foreignId('tahun_ajaran_id')->nullable(false)->change();
                $table->enum('semester', ['semester1', 'semester2'])->nullable(false)->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('absensi_harian', function (Blueprint $table) {
            $table->dropForeign(['tahun_ajaran_id']);
            $table->dropColumn(['tahun_ajaran_id', 'semester']);
        });
    }
};