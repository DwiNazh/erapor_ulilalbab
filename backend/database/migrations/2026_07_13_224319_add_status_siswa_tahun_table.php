<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('siswa_tahun', function (Blueprint $table) {
            // Menambahkan kolom status, tipe varchar(50), nullable
            $table->string('status', 50)->nullable()->after('tahun_ajaran_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('siswa_tahun', function (Blueprint $table) {
            // Menghapus kolom status jika migrasi di-rollback
            $table->dropColumn('status');
        });
    }
};