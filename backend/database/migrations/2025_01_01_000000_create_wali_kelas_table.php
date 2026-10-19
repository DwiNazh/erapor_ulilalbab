<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wali_kelas', function (Blueprint $table) {
            $table->id();

            // FK ke users.nipy
            $table->string('nipy_guru');
            $table->foreign('nipy_guru')
                ->references('nipy')
                ->on('users')
                ->onDelete('cascade');

            // FK ke tahun ajaran
            $table->foreignId('tahun_ajaran_id')
                ->constrained('tahun_ajaran')
                ->onDelete('cascade');

            // kelas & sub
            $table->integer('kelas'); 
            $table->string('sub', 1)->nullable();

            // kombinasi unik
            $table->unique(['nipy_guru', 'kelas', 'sub', 'tahun_ajaran_id']);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wali_kelas');
    }
};
