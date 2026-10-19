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
        Schema::create('template_deskripsi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guru_id')->constrained('users')->onDelete('cascade');
            $table->enum('jenis', ['kokurikuler', 'ekstrakurikuler']);
            $table->string('aspek'); // fleksibel, tidak di-enum agar ekstra bisa dinamis
            $table->enum('grade', ['A', 'B', 'C', 'D', 'E']);
            $table->text('deskripsi');
            $table->timestamps();

            $table->unique(['guru_id', 'jenis', 'aspek', 'grade']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('template_deskripsi');
    }
};
