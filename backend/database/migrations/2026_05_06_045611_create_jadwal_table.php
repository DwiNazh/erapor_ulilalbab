<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jadwal', function (Blueprint $table) {

            $table->id();

            // Relasi ke rombel
            $table->foreignId('rombel_id')
                ->constrained('rombel')
                ->cascadeOnDelete();

            // Relasi ke mapel
            $table->foreignId('mapel_id')
                ->constrained('mapel')
                ->cascadeOnDelete();

            // Relasi langsung ke guru (users)
            $table->foreignId('guru_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // Relasi ke penugasan guru
            $table->foreignId('penugasan_id')
                ->nullable()
                ->constrained('penugasan_guru')
                ->nullOnDelete();

            // Hari jadwal
            $table->enum('hari', [
                'Senin',
                'Selasa',
                'Rabu',
                'Kamis',
                'Jumat',
                'Sabtu'
            ]);

            // Jam pelajaran
            $table->time('jam_mulai');

            $table->time('jam_selesai');

            // Tahun ajaran aktif
            $table->foreignId('tahun_ajaran_id')
                ->constrained('tahun_ajaran')
                ->cascadeOnDelete();


            $table->timestamps();

            // Index untuk mempercepat pencarian jadwal
            $table->index([
                'rombel_id',
                'hari',
                'tahun_ajaran_id'
            ]);

        });
    }


    public function down(): void
    {
        Schema::dropIfExists('jadwal');
    }
};