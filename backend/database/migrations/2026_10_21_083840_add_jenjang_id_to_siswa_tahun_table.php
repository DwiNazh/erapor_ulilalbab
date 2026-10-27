<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('siswa_tahun', function (Blueprint $table) {
            $table->foreignId('jenjang_id')->nullable()->after('rombel_id')->constrained('jenjang')->restrictOnDelete();
        });
        DB::statement("UPDATE siswa_tahun st JOIN rombel r ON r.id = st.rombel_id SET st.jenjang_id = r.jenjang_id WHERE st.jenjang_id IS NULL AND r.jenjang_id IS NOT NULL");
        DB::statement("UPDATE siswa_tahun st JOIN siswa s ON s.id = st.siswa_id JOIN jenjang j ON s.kelas BETWEEN j.kelas_min AND j.kelas_max SET st.jenjang_id = j.id WHERE st.jenjang_id IS NULL AND st.rombel_id IS NULL AND s.kelas IS NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('siswa_tahun', function (Blueprint $table) {
            $table->dropConstrainedForeignId('jenjang_id');
        });
    }
};
