<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('siswas', function (Blueprint $table) {
            $table->foreignId('jenjang_id')->nullable()->after('kategori')->constrained('jenjang')->nullOnDelete();
        });

        // Backfill: isi jenjang_id berdasarkan kelas
        if (Schema::hasTable('jenjang')) {
            foreach (DB::table('jenjang')->get() as $j) {
                DB::table('siswas')
                    ->whereBetween('kelas', [$j->kelas_min, $j->kelas_max])
                    ->update(['jenjang_id' => $j->id]);
            }

            // Default ke SD jika masih ada yang null
            $sd = DB::table('jenjang')->where('kode', 'SD')->value('id');
            if ($sd) {
                DB::table('siswas')->whereNull('jenjang_id')->update(['jenjang_id' => $sd]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('siswas', function (Blueprint $table) {
            $table->dropConstrainedForeignId('jenjang_id');
        });
    }
};
