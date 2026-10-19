<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('absensi_mapel', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('siswa_tahun_id');
            $table->unsignedBigInteger('rombel_id');
            $table->unsignedBigInteger('guru_id')->nullable();
            $table->unsignedBigInteger('mata_pelajaran_id');
            $table->string('semester');
            $table->date('tanggal')->nullable();  // sudah ada di tabel lama kamu, jadi dipertahankan
            $table->integer('pertemuan_ke')->nullable();  // kolom baru untuk sistem dinamis
            $table->enum('status', ['H', 'S', 'I', 'A'])->default('H');
            $table->text('keterangan')->nullable();
            $table->timestamps();

            // Foreign keys manual sesuai tabel existing kamu
            $table->foreign('siswa_tahun_id')
                  ->references('id')
                  ->on('siswa_tahun')
                  ->onDelete('cascade');

            $table->foreign('rombel_id')
                  ->references('id')
                  ->on('rombel')
                  ->onDelete('cascade');

            $table->foreign('guru_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('set null');

            $table->foreign('mata_pelajaran_id')
                  ->references('id')
                  ->on('mata_pelajaran')
                  ->onDelete('cascade');

            // Unique index dengan nama pendek (untuk hindari error nama terlalu panjang)
            $table->unique(
                ['siswa_tahun_id', 'mata_pelajaran_id', 'tanggal', 'pertemuan_ke'],
                'abs_unique_siswa_mapel_tgl_pertemuan'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('absensi_mapel');
    }
};