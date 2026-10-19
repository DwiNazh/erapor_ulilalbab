<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Schema::table('rombel', function (Blueprint $table) {
        //     // Coba drop unique lama kalau nama-nya persis seperti ini
        //     // Kalau nama index berbeda, sesuaikan dari output SHOW INDEX
        //     $table->dropUnique(['tingkat_kelas', 'sub_nama']); // ini akan drop kalau nama default Laravel

        //     // Tambah unique baru yang mencakup tahun_ajaran_id
        //     $table->unique(
        //         ['tahun_ajaran_id', 'tingkat_kelas', 'sub_nama'],
        //         'rombel_unique_per_tahun_ajaran'
        //     );
        // });
    }

    public function down(): void
    {
        Schema::table('rombel', function (Blueprint $table) {
            $table->dropUnique('rombel_unique_per_tahun_ajaran');

            // Opsional: restore unique lama kalau perlu
            $table->unique(['tingkat_kelas', 'sub_nama']);
        });
    }
};