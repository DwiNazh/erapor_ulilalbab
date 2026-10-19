<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pjbl_judul', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rombel_id')->constrained('rombel')->onDelete('cascade');
            $table->foreignId('tahun_ajaran_id')->constrained('tahun_ajaran')->onDelete('cascade');
            $table->enum('semester', ['ganjil', 'genap']);
            $table->string('judul', 255);
            $table->text('deskripsi')->nullable();
            $table->timestamps();

            // Satu rombel hanya boleh punya 1 judul PJBL per semester per tahun ajaran
            $table->unique(['rombel_id', 'tahun_ajaran_id', 'semester'], 'unique_pjbl_per_rombel');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pjbl_judul');
    }
};