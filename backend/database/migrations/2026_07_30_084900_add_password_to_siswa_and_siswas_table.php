<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('siswa', 'password')) {
            Schema::table('siswa', function (Blueprint $table) {
                $table->string('password')->nullable()->after('nis');
            });
        }

        if (!Schema::hasColumn('siswas', 'password')) {
            Schema::table('siswas', function (Blueprint $table) {
                $table->string('password')->nullable()->after('nis');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('siswa', 'password')) {
            Schema::table('siswa', function (Blueprint $table) {
                $table->dropColumn('password');
            });
        }
        if (Schema::hasColumn('siswas', 'password')) {
            Schema::table('siswas', function (Blueprint $table) {
                $table->dropColumn('password');
            });
        }
    }
};