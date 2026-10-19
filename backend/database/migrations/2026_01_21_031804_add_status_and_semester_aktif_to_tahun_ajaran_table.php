<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tahun_ajaran', function (Blueprint $table) {

            if (!Schema::hasColumn('tahun_ajaran', 'status')) {
                $table->string('status')->default('draft')->after('nama');
            }

            if (!Schema::hasColumn('tahun_ajaran', 'semester_aktif')) {
                $table->string('semester_aktif')->nullable()->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('tahun_ajaran', function (Blueprint $table) {

            if (Schema::hasColumn('tahun_ajaran', 'semester_aktif')) {
                $table->dropColumn('semester_aktif');
            }

            // status jangan dihapus kalau memang sudah dipakai sebelumnya
        });
    }
};