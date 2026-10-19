<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('siswa', function (Blueprint $table) {
            $table->id();

            // IDENTITAS SISWA
            $table->string('nama');
            $table->string('nis')->nullable()->unique();
            $table->string('nisn')->nullable()->unique();

            // KELAS & ROMBEL
            $table->integer('kelas')->nullable();      
            $table->string('sub')->nullable();         

            // RELASI WALI KELAS
            $table->unsignedBigInteger('wali_id')->nullable();
            $table->foreign('wali_id')
                    ->references('id')
                    ->on('wali_kelas')
                    ->onDelete('set null');

            // RELASI TAHUN AJARAN
            $table->unsignedBigInteger('tahun_ajaran_id')->nullable();
            $table->foreign('tahun_ajaran_id')
                  ->references('id')
                  ->on('tahun_ajaran')
                  ->onDelete('cascade');

            // STATUS
            $table->boolean('is_processed')->default(0);
            $table->boolean('is_graduated')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('siswa');
    }
};
