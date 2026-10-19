<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('absensi_harian', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('siswa_tahun_id');
            $table->unsignedBigInteger('rombel_id');
            $table->date('tanggal');
            $table->enum('status', ['H', 'S', 'I', 'A']);
            $table->string('keterangan')->nullable();
            $table->unsignedBigInteger('guru_id'); // wali kelas yang input
            $table->timestamps();

            // Satu siswa hanya boleh punya 1 catatan absensi per tanggal
            $table->unique(['siswa_tahun_id', 'tanggal']);

            $table->index('rombel_id');
            $table->index('tanggal');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('absensi_harian');
    }
};