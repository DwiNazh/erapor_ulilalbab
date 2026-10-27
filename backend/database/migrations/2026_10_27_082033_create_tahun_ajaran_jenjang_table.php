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
        Schema::create('tahun_ajaran_jenjang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tahun_ajaran_id')->constrained('tahun_ajaran')->restrictOnDelete();
            $table->foreignId('jenjang_id')->constrained('jenjang')->restrictOnDelete();
            $table->boolean('aktif')->default(false);
            $table->string('status', 20)->default('draft');
            $table->string('semester_aktif', 10)->nullable();
            $table->timestamps();

            $table->unique(['tahun_ajaran_id', 'jenjang_id']);
        });

        $now = now();

        // a) untuk jenjang dengan kode 'SD': insert satu baris untuk SETIAP baris tahun_ajaran, dengan aktif, status, semester_aktif disalin dari tahun_ajaran.
        $sdJenjang = DB::table('jenjang')->where('kode', 'SD')->first();
        if ($sdJenjang) {
            $semuaTahun = DB::table('tahun_ajaran')->get();
            $sdRows = [];
            foreach ($semuaTahun as $t) {
                $sdRows[] = [
                    'tahun_ajaran_id' => $t->id,
                    'jenjang_id'      => $sdJenjang->id,
                    'aktif'           => (bool) $t->aktif,
                    'status'          => $t->status ?? 'draft',
                    'semester_aktif'  => $t->semester_aktif ?? null,
                    'created_at'      => $now,
                    'updated_at'      => $now,
                ];
            }
            if (!empty($sdRows)) {
                DB::table('tahun_ajaran_jenjang')->insertOrIgnore($sdRows);
            }
        }

        // b) untuk jenjang lain: insert baris (aktif 0, status 'draft') hanya untuk pasangan (tahun, jenjang) yang punya rombel: SELECT DISTINCT tahun_ajaran_id, jenjang_id FROM rombel WHERE jenjang_id IS NOT NULL. Gunakan insertOrIgnore.
        $rombelPasangan = DB::table('rombel')
            ->select('tahun_ajaran_id', 'jenjang_id')
            ->whereNotNull('jenjang_id')
            ->distinct()
            ->get();

        $otherRows = [];
        foreach ($rombelPasangan as $rp) {
            if ($sdJenjang && (int) $rp->jenjang_id === (int) $sdJenjang->id) {
                continue;
            }
            $otherRows[] = [
                'tahun_ajaran_id' => $rp->tahun_ajaran_id,
                'jenjang_id'      => $rp->jenjang_id,
                'aktif'           => 0,
                'status'          => 'draft',
                'semester_aktif'  => null,
                'created_at'      => $now,
                'updated_at'      => $now,
            ];
        }
        if (!empty($otherRows)) {
            DB::table('tahun_ajaran_jenjang')->insertOrIgnore($otherRows);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tahun_ajaran_jenjang');
    }
};
