<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('finalisasi_rapor', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('siswa_id');
            $table->unsignedBigInteger('guru_id')->nullable(); // wali kelas yang finalisasi

            $table->string('semester', 1);       // '1' atau '2'
            $table->string('jenis_rapor', 10);   // 'PTS' atau 'PAS'
            $table->string('tahun_ajaran', 20);  // '2024/2025'

            $table->boolean('finalisasi')->default(false);
            $table->timestamp('tgl_finalisasi')->nullable();

            $table->timestamps();

            // Satu siswa hanya boleh punya 1 record per rapor per tahun
            $table->unique(
                ['siswa_id', 'semester', 'jenis_rapor', 'tahun_ajaran'],
                'unique_finalisasi_rapor'
            );

            $table->foreign('siswa_id')->references('id')->on('siswa')->onDelete('cascade');
            $table->foreign('guru_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('finalisasi_rapor');
    }
};