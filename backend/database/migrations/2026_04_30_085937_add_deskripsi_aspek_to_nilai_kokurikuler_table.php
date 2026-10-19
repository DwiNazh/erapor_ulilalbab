<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('nilai_kokurikuler', function (Blueprint $table) {
            //$table->json('deskripsi_aspek')->nullable()->after('deskripsi');
        });
    }

    public function down(): void
    {
        Schema::table('nilai_kokurikuler', function (Blueprint $table) {
            $table->dropColumn('deskripsi_aspek');
        });
    }
};