<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('template_deskripsi_intrakurikuler', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('guru_id');
            $table->integer('min_nilai');
            $table->integer('max_nilai');
            $table->text('deskripsi');
            $table->timestamps();

            $table->foreign('guru_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('template_deskripsi_intrakurikuler');
    }
};