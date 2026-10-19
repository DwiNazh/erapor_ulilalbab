<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('jadwal', function (Blueprint $table) {
            //$table->unsignedBigInteger('penugasan_id')->nullable()->after('guru_id');

            //$table->foreign('penugasan_id')
            //    ->references('id')
            //    ->on('penugasan_guru')
            //    ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('jadwal', function (Blueprint $table) {
            $table->dropForeign(['penugasan_id']);
            $table->dropColumn('penugasan_id');
        });
    }
};