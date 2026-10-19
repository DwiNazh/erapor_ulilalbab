<?php

// database/migrations/..._rename_id_and_nama_in_siswas_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('siswas', function (Blueprint $table) {
            // Ubah 'id' menjadi 'id_user'
            // CATATAN: Mengubah nama kolom 'id' bawaan Laravel memerlukan langkah tambahan
            // Anda harus memastikan kolom 'id' yang Anda maksud BUKAN primary key bawaan Laravel.
            // Jika Anda ingin mengubah primary key, Anda harus men-drop dan menambahkannya lagi.
            // Jika 'id' yang Anda maksud adalah KOLOM BIASA, gunakan:
            // $table->renameColumn('id', 'id_user'); 
            
            // --- JIKA ANDA TIDAK YAKIN, HINDARI MENGUBAH PRIMARY KEY ID ---
            
            // Kolom 'nama' menjadi 'nama_user' (Ini aman dilakukan)
            $table->renameColumn('nama', 'nama_user');
        });
    }

    public function down(): void
    {
        Schema::table('siswas', function (Blueprint $table) {
            // Logika rollback (mengembalikan nama kolom)
            $table->renameColumn('nama_user', 'nama');
            // $table->renameColumn('id_user', 'id'); // Hanya jika Anda mengubah 'id' di atas
        });
    }
};