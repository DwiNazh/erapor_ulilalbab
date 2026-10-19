<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rombel', function (Blueprint $table) {
        // Hapus foreign key lama
        $table->dropForeign(['guru_id']);

        // Buat ulang foreign key dengan ON DELETE SET NULL
        $table->foreign('guru_id')
              ->references('id')
              ->on('users')
              ->nullOnDelete(); // atau ->onDelete('set null')

        });
    }

    public function down(): void
    {
        Schema::table('rombel', function (Blueprint $table) {
            $table->dropForeign(['guru_id']);
            $table->dropColumn('guru_id');
        });
    }
};