<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('jenjang', function (Blueprint $table) {
            $table->id();
            $table->string('kode', 5)->unique();   // SD, SMP, SMA
            $table->string('nama', 50);
            $table->unsignedTinyInteger('kelas_min');
            $table->unsignedTinyInteger('kelas_max');
            $table->timestamps();
        });

        $now = now();
        DB::table('jenjang')->insert([
            ['kode' => 'SD', 'nama' => 'Sekolah Dasar', 'kelas_min' => 1, 'kelas_max' => 6, 'created_at' => $now, 'updated_at' => $now],
            ['kode' => 'SMP', 'nama' => 'Sekolah Menengah Pertama', 'kelas_min' => 7, 'kelas_max' => 9, 'created_at' => $now, 'updated_at' => $now],
            ['kode' => 'SMA', 'nama' => 'Sekolah Menengah Atas', 'kelas_min' => 10, 'kelas_max' => 12, 'created_at' => $now, 'updated_at' => $now],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jenjang');
    }
};
