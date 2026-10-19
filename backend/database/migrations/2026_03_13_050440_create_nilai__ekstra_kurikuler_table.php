<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ekstrakurikuler', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 100)->unique();
            $table->boolean('wajib')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ekstrakurikuler');
    }
};

// 2. create_siswa_ekstrakurikuler_table
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('siswa_ekstrakurikuler', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswa')->onDelete('cascade');
            $table->foreignId('ekstrakurikuler_id')->constrained('ekstrakurikuler')->onDelete('cascade');
            $table->string('nilai', 2)->nullable(); // A, B, C, null
            $table->timestamps();

            $table->unique(['siswa_id', 'ekstrakurikuler_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('siswa_ekstrakurikuler');
    }
};