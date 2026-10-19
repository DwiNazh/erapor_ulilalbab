<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('siswa_tahun', function (Blueprint $table) {
            // Drop foreign key di-skip karena tidak ada
            // $table->dropForeign(['wali_kelas_id']);

            // Tetap hapus kolom jika memang masih ada (aman dengan pengecekan)
            if (Schema::hasColumn('siswa_tahun', 'wali_kelas_id')) {
                $table->dropColumn('wali_kelas_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('siswa_tahun', function (Blueprint $table) {
            $table->unsignedBigInteger('wali_kelas_id')->nullable();
            // Jika perlu tambah foreign key kembali, bisa ditambahkan di sini
        });
    }
};