<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('siswa_tahun', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('siswa_id');
            $table->unsignedBigInteger('tahun_ajaran_id');
            $table->unsignedBigInteger('rombel_id')->nullable();

            $table->boolean('is_processed')->default(false);

            $table->timestamps();

            // Foreign Key
            $table->foreign('siswa_id')->references('id')->on('siswa')->onDelete('cascade');
            $table->foreign('tahun_ajaran_id')->references('id')->on('tahun_ajaran')->onDelete('cascade');
            $table->foreign('rombel_id')->references('id')->on('rombel')->onDelete('set null');

            // supaya tidak ada siswa yang sama di tahun ajaran yang sama
            $table->unique(['siswa_id', 'tahun_ajaran_id'], 'unique_siswa_tahun');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('siswa_tahun');
    }
};