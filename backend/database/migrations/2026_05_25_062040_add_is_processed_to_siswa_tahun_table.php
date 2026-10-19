<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('siswa_tahun', function (Blueprint $table) {
            if (!Schema::hasColumn('siswa_tahun', 'is_processed')) {
                $table->boolean('is_processed')->default(0)->after('rombel_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('siswa_tahun', function (Blueprint $table) {
            $table->dropColumn('is_processed');
        });
    }
};