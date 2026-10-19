<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pengaturans', function (Blueprint $table) {
            $table->id();
            // Profil Sekolah
            $table->string('nama_sekolah')->nullable();
            $table->string('npsn', 20)->nullable();
            $table->text('alamat')->nullable();
            $table->string('kota', 100)->nullable();
            $table->string('provinsi', 100)->nullable();
            $table->string('kode_pos', 10)->nullable();
            $table->string('telepon', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('website', 100)->nullable();
            $table->string('kepala_sekolah')->nullable();
            $table->string('nip_kepala', 30)->nullable();
            $table->string('logo')->nullable();
            // Notifikasi
            $table->string('email_notifikasi', 100)->nullable();
            $table->boolean('notif_akun_baru')->default(false);
            $table->boolean('notif_rapor')->default(false);
            $table->boolean('notif_login')->default(false);
            $table->timestamps();
        });

        // Tabel log backup tetap terpisah
        Schema::create('system_backups', function (Blueprint $table) {
            $table->id();
            $table->string('filename');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengaturans');
        Schema::dropIfExists('system_backups');
    }
};