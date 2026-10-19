<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tambahkan kolom sub_kelas dan nis ke tabel siswas
     */
    public function up(): void
    {
        Schema::table('siswas', function (Blueprint $table) {
            // sesuaikan posisi "after" dengan kolom terakhir yang kamu punya
            $table->string('sub_kelas', 10)->nullable()->after('kelas'); 
            $table->string('nis', 50)->nullable()->after('sub_kelas');
        });
    }

    /**
     * Hapus kolom jika rollback
     */
    public function down(): void
    {
        Schema::table('siswas', function (Blueprint $table) {
            $table->dropColumn(['sub_kelas', 'nis']);
        });
    }
};
