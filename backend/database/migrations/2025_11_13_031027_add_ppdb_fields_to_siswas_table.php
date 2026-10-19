<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('siswas', function (Blueprint $table) {
    // Tambahkan ID dari PPDB sebagai referensi unik
    $table->unsignedBigInteger('ppdb_id')->nullable()->unique();
    
    // Tambahkan kolom NISN
    $table->string('nisn', 20)->nullable(); 
    
    // Jika Anda ingin mengubah kolom 'kelas' agar boleh NULL:
    // $table->integer('kelas')->nullable()->change(); 
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('siswas', function (Blueprint $table) {
            //
        });
    }
};
