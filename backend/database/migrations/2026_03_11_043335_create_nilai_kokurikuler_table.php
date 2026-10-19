<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nilai_kokurikuler', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('siswa_id')
                  ->constrained('siswa')
                  ->onDelete('cascade');
            
            // Opsional tapi sangat berguna untuk filtering cepat
            $table->foreignId('rombel_id')
                  ->nullable()
                  ->constrained('rombel')  // sesuaikan nama tabel rombel kamu jika beda
                  ->onDelete('set null');
            
            $table->string('semester', 1)->default('1');     // '1' atau '2'
            $table->string('tahun_ajaran', 9);               // contoh: '2025/2026'
            
            // Nilai per aspek (grade A/B/C/D/E atau null)
            $table->string('mutabaah_yaumiyah', 1)->nullable();
            $table->string('bina_pribadi_islam', 1)->nullable();
            $table->string('pjbl', 1)->nullable();
            $table->string('literasi', 1)->nullable();
            
            $table->timestamps();

            // Pastikan tidak ada duplikat untuk siswa yang sama di periode yang sama
            $table->unique(['siswa_id', 'semester', 'tahun_ajaran']);
            
            // Index supaya query lebih cepat
            $table->index(['semester', 'tahun_ajaran']);
            $table->index('rombel_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nilai_kokurikuler');
    }
};