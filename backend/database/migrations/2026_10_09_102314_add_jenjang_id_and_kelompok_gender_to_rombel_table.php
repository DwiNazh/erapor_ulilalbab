<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('rombel', function (Blueprint $table) {
            $table->foreignId('jenjang_id')->nullable()->after('tahun_ajaran_id')->constrained('jenjang');
            $table->string('kelompok_gender', 10)->default('campuran')->after('sub_nama'); // campuran|ikhwan|akhwat
        });

        // Controller menulis nama_rombel; tambahkan hanya jika belum ada
        if (!Schema::hasColumn('rombel', 'nama_rombel')) {
            Schema::table('rombel', function (Blueprint $table) {
                $table->string('nama_rombel', 30)->nullable()->after('sub_nama');
            });
        }

        // Backfill: rombel lama diberi jenjang sesuai tingkat, gender tetap 'campuran'
        foreach (DB::table('jenjang')->get() as $j) {
            DB::table('rombel')
                ->whereBetween('tingkat_kelas', [$j->kelas_min, $j->kelas_max])
                ->update(['jenjang_id' => $j->id]);
        }

        // Unique baru dibuat DULU; yang lama dihapus di step 4
        Schema::table('rombel', function (Blueprint $table) {
            $table->unique(
                ['tahun_ajaran_id', 'tingkat_kelas', 'sub_nama', 'kelompok_gender'],
                'rombel_unik_per_tahun_gender'
            );
        });
    }

    public function down(): void
    {
        Schema::table('rombel', function (Blueprint $table) {
            $table->dropUnique('rombel_unik_per_tahun_gender');
        });
        Schema::table('rombel', function (Blueprint $table) {
            $table->dropConstrainedForeignId('jenjang_id');
            $table->dropColumn('kelompok_gender');
        });
    }
};
