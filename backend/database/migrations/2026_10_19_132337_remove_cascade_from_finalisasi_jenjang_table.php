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
        Schema::table('finalisasi_jenjang', function (Blueprint $table) {
            $table->dropForeign(['tahun_ajaran_id']);
            $table->dropForeign(['jenjang_id']);
        });

        Schema::table('finalisasi_jenjang', function (Blueprint $table) {
            $table->foreign('tahun_ajaran_id')->references('id')->on('tahun_ajaran')->restrictOnDelete();
            $table->foreign('jenjang_id')->references('id')->on('jenjang')->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('finalisasi_jenjang', function (Blueprint $table) {
            $table->dropForeign(['tahun_ajaran_id']);
            $table->dropForeign(['jenjang_id']);
        });

        Schema::table('finalisasi_jenjang', function (Blueprint $table) {
            $table->foreign('tahun_ajaran_id')->references('id')->on('tahun_ajaran')->cascadeOnDelete();
            $table->foreign('jenjang_id')->references('id')->on('jenjang')->cascadeOnDelete();
        });
    }
};
