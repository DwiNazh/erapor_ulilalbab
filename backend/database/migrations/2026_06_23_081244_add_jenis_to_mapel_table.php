<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mapel', function (Blueprint $table) {
            $table->enum('jenis', ['wajib', 'pilihan'])->default('wajib')->after('kode');
        });
    }

    public function down(): void
    {
        Schema::table('mapel', function (Blueprint $table) {
            $table->dropColumn('jenis');
        });
    }
};