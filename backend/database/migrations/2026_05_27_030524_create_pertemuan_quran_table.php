<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('pertemuan_quran', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kelompok_quran_id')->constrained('kelompok_quran')->onDelete('cascade');
            $table->date('tanggal');
            $table->integer('pertemuan_ke');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pertemuan_quran');
    }
};
