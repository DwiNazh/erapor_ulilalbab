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
        Schema::create('kelompok_quran', function (Blueprint $table) {
            $table->id();

            // Guru dari tabel users
            $table->foreignId('guru_id')
                ->constrained('users')
                ->onDelete('cascade');

            // Tahun ajaran
            $table->foreignId('tahun_ajaran_id')
                ->constrained('tahun_ajaran')
                ->onDelete('cascade');

            // Semester aktif
            $table->enum('semester', ['Ganjil', 'Genap']);

            // Label kelompok A/B/C
            $table->string('label', 1);

            // Status aktif
            $table->boolean('aktif')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelompok_quran');
    }
};