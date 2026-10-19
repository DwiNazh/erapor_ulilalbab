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
        Schema::create('nilai_siswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswa')->onDelete('cascade');
            $table->foreignId('mapel_id')->constrained('mapel')->onDelete('cascade');
            $table->enum('semester', ['1', '2'])->index();
            $table->string('tahun_ajaran', 9)->index(); // contoh: 2025/2026
            $table->integer('uh1')->nullable()->comment('Ulangan Harian 1');
            $table->integer('uh2')->nullable()->comment('Ulangan Harian 2');
            $table->integer('uh3')->nullable()->comment('Ulangan Harian 3');
            $table->integer('uh4')->nullable()->comment('Ulangan Harian 4');
            $table->integer('uh5')->nullable()->comment('Ulangan Harian 5');
            $table->integer('pts')->nullable()->comment('Penilaian Tengah Semester');
            $table->integer('pas')->nullable()->comment('Penilaian Akhir Semester');
            $table->timestamps();

            // Unique constraint agar tidak ada duplikat per siswa-mapel-semester-tahun
            $table->unique(['siswa_id', 'mapel_id', 'semester', 'tahun_ajaran'], 'unique_nilai_per_siswa_mapel');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nilai_siswa');
    }
};