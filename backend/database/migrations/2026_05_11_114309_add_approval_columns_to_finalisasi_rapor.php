<?php
 
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
 
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('finalisasi_rapor', function (Blueprint $table) {
 
            // Status approval (menggantikan kolom boolean finalisasi lama)
            // draft | pending_approval | approved | rejected
            $table->string('approval_status', 30)
                  ->default('draft')
                  ->after('finalisasi');
 
            // Alasan penolakan dari kepsek
            $table->text('rejection_reason')
                  ->nullable()
                  ->after('approval_status');
 
            // Siapa yang mengajukan (guru)
            $table->unsignedBigInteger('diajukan_oleh')
                  ->nullable()
                  ->after('rejection_reason');
 
            $table->timestamp('diajukan_at')
                  ->nullable()
                  ->after('diajukan_oleh');
 
            // Siapa yang menyetujui (kepsek)
            $table->unsignedBigInteger('disetujui_oleh')
                  ->nullable()
                  ->after('diajukan_at');
 
            $table->timestamp('disetujui_at')
                  ->nullable()
                  ->after('disetujui_oleh');
 
            // Foreign keys (opsional)
            $table->foreign('diajukan_oleh')->references('id')->on('users')->nullOnDelete();
            $table->foreign('disetujui_oleh')->references('id')->on('users')->nullOnDelete();
        });
    }
 
    public function down(): void
    {
        Schema::table('finalisasi_rapor', function (Blueprint $table) {
            $table->dropForeign(['diajukan_oleh']);
            $table->dropForeign(['disetujui_oleh']);
            $table->dropColumn([
                'approval_status',
                'rejection_reason',
                'diajukan_oleh',
                'diajukan_at',
                'disetujui_oleh',
                'disetujui_at',
            ]);
        });
    }
};