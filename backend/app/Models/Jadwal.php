<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Jadwal extends Model
{
    protected $table = 'jadwal';

    protected $fillable = [
        'rombel_id',
        'mapel_id',
        'guru_id',           // ✅ BARU
        'penugasan_id',      // ✅ BARU
        'hari',
        'jam_mulai',
        'jam_selesai',
        'tahun_ajaran_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ========================================
    // RELASI
    // ========================================

    /**
     * Relasi: Jadwal belongs to Rombel
     */
    public function rombel(): BelongsTo
    {
        return $this->belongsTo(Rombel::class, 'rombel_id');
    }

    /**
     * Relasi: Jadwal belongs to Mapel
     */
    public function mapel(): BelongsTo
    {
        return $this->belongsTo(Mapel::class, 'mapel_id');
    }

    /**
     * Relasi: Jadwal belongs to User (Guru)
     * ✅ BARU: Langsung ke guru
     */
    public function guru(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guru_id');
    }

    /**
     * Relasi: Jadwal belongs to PenugasanGuru
     * ✅ BARU: Jika ingin link langsung ke penugasan
     */
    public function penugasan(): BelongsTo
    {
        return $this->belongsTo(PenugasanGuru::class, 'penugasan_id');
    }

    /**
     * Relasi: Jadwal belongs to TahunAjaran
     */
    public function tahunAjaran(): BelongsTo
    {
        return $this->belongsTo(TahunAjaran::class, 'tahun_ajaran_id');
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    /**
     * Format jam untuk display
     */
    public function getJamDisplayAttribute(): string
    {
        return "{$this->jam_mulai} - {$this->jam_selesai}";
    }

    /**
     * Get guru name
     */
    public function getGuruNameAttribute(): ?string
    {
        return $this->guru?->name;
    }

    /**
     * Get mapel name
     */
    public function getMapelNameAttribute(): ?string
    {
        return $this->mapel?->nama;
    }

    public function scopeUntukUser($query, $user)
    {
        if (!$user || $user->isSuperadmin()) {
            return $query;
        }
        $ids = $user->jenjangIds();
        return $query->whereHas('rombel', function ($q) use ($ids) {
            $q->whereIn('jenjang_id', $ids);
        });
    }
}