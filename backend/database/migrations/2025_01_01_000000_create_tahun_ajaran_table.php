<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
    Schema::create('tahun_ajaran', function (Blueprint $table) {
    $table->id();
    $table->string('nama')->unique(); // contoh: 2025/2026
    $table->enum('status', ['draft', 'aktif', 'dikunci'])->default('draft');
    $table->enum('semester_aktif', ['ganjil', 'genap'])->nullable();
    $table->boolean('aktif')->default(false);
    $table->timestamp('finalized_at')->nullable();
    $table->timestamps();
    });

    }

    public function down(): void
    {
        Schema::dropIfExists('tahun_ajaran');
    }
};
