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
        Schema::create('nilai_quran', function (Blueprint $table) {
            $table->id();
            
            // Kolom relasi yang ingin Anda pertahankan
            $table->foreignId('siswa_id')->constrained('siswas')->onDelete('cascade');
            $table->foreignId('kelompok_quran_id')->constrained('kelompok_quran')->onDelete('cascade');
            
            // Kolom penentu periode akademik e-Rapor
            $table->string('tahun_ajaran', 9); // Contoh: 2025/2026
            $table->enum('semester', ['1', '2']);
            // Kolom Nilai Rapor Baru sesuai gambar
            $table->integer('uh1')->nullable();
            $table->integer('uh2')->nullable();
            $table->integer('uh3')->nullable();
            $table->integer('uh4')->nullable();
            $table->integer('uh5')->nullable();
            $table->integer('pts')->nullable();
            $table->integer('pas')->nullable();
            
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nilai_quran');
    }
};
