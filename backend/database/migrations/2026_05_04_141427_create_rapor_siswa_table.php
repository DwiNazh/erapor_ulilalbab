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
        Schema::create('rapor_siswa', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('siswa_id');
            $table->unsignedBigInteger('rombel_id');

            $table->string('tahun_ajaran', 20);
            $table->string('jenis_rapor', 255);
            
            // Nilai rapor final (snapshot)
            $table->integer('nilai_akhir')->nullable();
            $table->integer('semester')->nullable();
            
            // Deskripsi rapor final (snapshot)
            $table->text('deskripsi')->nullable();
            
            // Status finalisasi
            $table->boolean('is_final')->default(false);
            $table->timestamp('finalized_at')->nullable();
            
            $table->timestamps();
            
            // Index agar cepat
            $table->index(['rombel_id', 'tahun_ajaran', 'semester']);
            $table->index(['siswa_id', 'tahun_ajaran', 'semester']);
            
            // Unik: 1 siswa hanya boleh punya 1 rapor per semester per tahun ajaran
            $table->unique(['siswa_id', 'tahun_ajaran', 'semester'], 'unique_rapor_siswa');
            $table->unique(['siswa_id', 'tahun_ajaran', 'semester', 'jenis_rapor']);

            // Foreign key
            $table->foreign('siswa_id')->references('id')->on('siswas')->onDelete('cascade');
            $table->foreign('rombel_id')->references('id')->on('rombel')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rapor_siswa');
    }
};