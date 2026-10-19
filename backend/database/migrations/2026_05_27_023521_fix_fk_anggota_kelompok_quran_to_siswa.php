<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('anggota_kelompok_quran', function (Blueprint $table) {
            $table->dropForeign(['siswa_id']);
            $table->foreign('siswa_id')
                ->references('id')
                ->on('siswa')        // ← arahkan ke tabel 'siswa'
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('siswa', function (Blueprint $table) {
            //
        });
    }
};
