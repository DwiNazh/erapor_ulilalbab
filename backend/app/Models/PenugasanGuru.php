<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PenugasanGuru extends Model
{
    protected $table = 'penugasan_guru';

    protected $fillable = [
        'guru_id',
        'mapel_id',
        'rombel_id',
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
     * Relasi: PenugasanGuru belongs to User (Guru)
     */
    public function guru(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guru_id');
    }

    /**
     * Relasi: PenugasanGuru belongs to Mapel
     */
    public function mapel(): BelongsTo
    {
        return $this->belongsTo(Mapel::class, 'mapel_id');
    }

    /**
     * Relasi: PenugasanGuru belongs to Rombel
     */
    public function rombel(): BelongsTo
    {
        return $this->belongsTo(Rombel::class, 'rombel_id');
    }

    /**
     * Relasi: PenugasanGuru belongs to TahunAjaran
     */
    public function tahunAjaran(): BelongsTo
    {
        return $this->belongsTo(TahunAjaran::class, 'tahun_ajaran_id');
    }

    /**
     * ✅ RELASI BARU: PenugasanGuru has many Jadwal
     * Satu penugasan bisa memiliki banyak jadwal
     */
    public function jadwals(): HasMany
    {
        return $this->hasMany(Jadwal::class, 'penugasan_id');
    }

    // ========================================
    // HELPER METHODS
    // ========================================

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

    /**
     * Get rombel name
     */
    public function getRombelNameAttribute(): ?string
    {
        return $this->rombel ? "Kelas {$this->rombel->tingkat_kelas} {$this->rombel->sub_nama}" : null;
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