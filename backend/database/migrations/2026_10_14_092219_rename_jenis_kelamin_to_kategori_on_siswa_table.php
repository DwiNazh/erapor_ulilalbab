<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // lebarkan dulu supaya muat 'ikhwan' / 'akhwat'
        Schema::table('siswa', function (Blueprint $table) {
            $table->string('jenis_kelamin', 10)->nullable()->change();
        });

        DB::table('siswa')->where('jenis_kelamin', 'L')->update(['jenis_kelamin' => 'ikhwan']);
        DB::table('siswa')->where('jenis_kelamin', 'P')->update(['jenis_kelamin' => 'akhwat']);

        Schema::table('siswa', function (Blueprint $table) {
            $table->renameColumn('jenis_kelamin', 'kategori');
        });
    }

    public function down(): void
    {
        Schema::table('siswa', function (Blueprint $table) {
            $table->renameColumn('kategori', 'jenis_kelamin');
        });

        DB::table('siswa')->where('jenis_kelamin', 'ikhwan')->update(['jenis_kelamin' => 'L']);
        DB::table('siswa')->where('jenis_kelamin', 'akhwat')->update(['jenis_kelamin' => 'P']);

        Schema::table('siswa', function (Blueprint $table) {
            $table->string('jenis_kelamin', 1)->nullable()->change();
        });
    }
};
