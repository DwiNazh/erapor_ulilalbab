<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('mutasi', function (Blueprint $table) {
            $table->id();
            $table->enum('jenis', ['siswa', 'guru']);
            $table->unsignedBigInteger('target_id'); // siswa_id atau guru_id (user_id)
            $table->enum('tipe_mutasi', ['pindah_rombel', 'pindah_sekolah']);
            
            // Untuk pindah rombel (siswa maupun guru)
            $table->unsignedBigInteger('rombel_asal_id')->nullable();
            $table->unsignedBigInteger('rombel_tujuan_id')->nullable();

            // Untuk pindah sekolah (keluar sistem)
            $table->string('sekolah_tujuan')->nullable();
            
            $table->text('keterangan')->nullable();
            $table->date('tanggal_mutasi');
            $table->unsignedBigInteger('dilakukan_oleh'); // user admin TU
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mutasi');
    }
};