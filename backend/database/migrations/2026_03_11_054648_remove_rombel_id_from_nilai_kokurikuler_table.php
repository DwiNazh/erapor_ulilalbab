<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('nilai_kokurikuler', function (Blueprint $table) {
            // Hapus foreign key dulu
            $table->dropForeign(['rombel_id']);
            // Lalu hapus kolomnya
            $table->dropColumn('rombel_id');
        });
    }

    public function down(): void
    {
        Schema::table('nilai_kokurikuler', function (Blueprint $table) {
            // Jika rollback, tambah kembali kolom (opsional)
            $table->foreignId('rombel_id')->nullable()->constrained('rombels')->onDelete('set null');
        });
    }
};