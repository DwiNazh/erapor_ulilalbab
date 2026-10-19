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
// Migration baru atau alter table
Schema::create('rombel', function (Blueprint $table) {
    $table->id();
    $table->foreignId('tahun_ajaran_id')->constrained('tahun_ajaran')->onDelete('cascade');
    $table->integer('tingkat_kelas')->default(1);     // Kelas 1
    $table->string('sub_nama', 10);                   // A, B, C, D, dst
    $table->foreignId('guru_id')->nullable()->constrained('users'); // Wali Kelas
    $table->boolean('is_active')->default(true);
    $table->timestamps();

    // Unique constraint
    $table->unique(['tahun_ajaran_id', 'tingkat_kelas', 'sub_nama']);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rombel');
    }
};
