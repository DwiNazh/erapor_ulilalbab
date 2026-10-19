<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Menambah kolom nilai_mingguan_mutabaah (JSON) ke tabel nilai_kokurikuler.
     *
     * Kolom ini menyimpan array nilai mingguan Mutaba'ah Yaumiyah secara dinamis.
     * Contoh isi: ["3", "4", "2", "3", "1"]
     * Jumlah elemen bisa bertambah sesuai tombol "Tambah Minggu Pemeriksaan".
     */
    public function up(): void
    {
        Schema::table('nilai_kokurikuler', function (Blueprint $table) {
            $table->json('nilai_mingguan_mutabaah')
                  ->nullable()
                  ->after('deskripsi_aspek')
                  ->comment('Array nilai mingguan Mutabah Yaumiyah skala 1-4, disimpan sebagai JSON');
        });
    }

    public function down(): void
    {
        Schema::table('nilai_kokurikuler', function (Blueprint $table) {
            $table->dropColumn('nilai_mingguan_mutabaah');
        });
    }
};