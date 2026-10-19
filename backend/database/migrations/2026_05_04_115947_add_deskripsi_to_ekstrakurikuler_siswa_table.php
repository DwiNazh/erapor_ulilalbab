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
        Schema::table('ekstrakurikuler_siswa', function (Blueprint $table) {
            $table->text('tahun_ajaran')->nullable()->after('nilai');
            $table->int('semester')->nullable();
            $table->text('deskripsi')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('ekstrakurikuler_siswa', function (Blueprint $table) {
            $table->dropColumn('deskripsi');
        });
    }
};
