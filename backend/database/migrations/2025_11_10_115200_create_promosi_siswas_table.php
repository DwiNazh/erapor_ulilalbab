<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('promosi_siswa', function (Blueprint $table) {
            $table->id();

            // FK ke siswas
            $table->foreignId('siswa_id')
                  ->constrained('siswas')    // TABELNYA siswas
                  ->onDelete('cascade');

            // Data snapshot asal
            $table->integer('kelas_baru_id')->nullable();

            $table->unsignedTinyInteger('kelas_asal')->nullable();
            $table->string('sub_kelas_asal', 4)->nullable();
            $table->string('tahun_ajaran_asal', 20)->nullable();

            // Data tujuan
            $table->unsignedTinyInteger('kelas_tujuan')->nullable();
            $table->string('sub_kelas_tujuan', 4)->nullable();
            // FK ke tabel tahun_ajaran
            $table->foreignId('tahun_ajaran_id')
                  ->constrained('tahun_ajaran')
                  ->onDelete('cascade');

            $table->enum('status', ['promoted', 'failed'])->default('promoted');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('promosi_siswa');
    }
};
