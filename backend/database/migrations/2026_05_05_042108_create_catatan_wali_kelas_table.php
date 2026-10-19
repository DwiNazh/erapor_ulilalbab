<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('catatan_wali_kelas', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('siswa_id');
            $table->string('semester', 2);
            $table->string('tahun_ajaran');
            $table->text('catatan')->nullable();

            $table->unsignedBigInteger('guru_id')->nullable();

            $table->timestamps();

            $table->index(['siswa_id', 'semester', 'tahun_ajaran']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('catatan_wali_kelas');
    }
};