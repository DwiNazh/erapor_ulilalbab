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
        Schema::create('nilai_siswa_detail', function (Blueprint $table) {
            $table->id();

            $table->foreignId('nilai_siswa_id')
                ->constrained('nilai_siswa')
                ->cascadeOnDelete();

            $table->string('jenis');

            $table->integer('urutan')
                ->default(1);

            $table->decimal('nilai', 5, 2)
                ->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nilai_siswa_detail');
    }
};
