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
        Schema::create('penugasan_guru', function (Blueprint $table) {
            $table->id();

            // Relasi ke tabel users (guru)
            $table->foreignId('guru_id')
                  ->constrained('users')
                  ->cascadeOnDelete();

            // Relasi ke tabel mata_pelajaran
            $table->foreignId('mapel_id')
                  ->constrained('mapel')
                  ->cascadeOnDelete();

            // Kelas yang diajar
            $table->string('kelas', 20);

            // Relasi ke tabel tahun_ajaran
            $table->foreignId('tahun_ajaran_id')
                  ->constrained('tahun_ajaran')
                  ->cascadeOnDelete();

            $table->timestamps();

            // Mencegah data penugasan ganda
            $table->unique([
                'guru_id',
                'mapel_id',
                'kelas',
                'tahun_ajaran_id'
            ], 'penugasan_guru_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penugasan_guru');
    }
};