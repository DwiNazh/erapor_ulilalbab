<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TahunAjaran extends Model
{
    use HasFactory;

    protected $table = 'tahun_ajaran';

    protected $fillable = [
        'nama',
        'status',
        'aktif',
        'semester_aktif',
        'finalized_at',       // ← tambahkan ini agar bisa mass assignment jika perlu
    ];

    /**
     * Cast attributes ke tipe data yang benar
     */
    protected $casts = [
        'aktif'         => 'boolean',          // agar aktif jadi true/false, bukan 0/1 string
        'finalized_at'  => 'datetime',         // agar jadi Carbon instance otomatis
        'created_at'    => 'datetime',
        'updated_at'    => 'datetime',
    ];

    /**
     * Scope untuk query tahun aktif
     */
    public function scopeAktif($query)
    {
        return $query->where('aktif', true);
    }

    /**
     * Scope untuk tahun yang sudah dikunci/finalized
     */
    public function scopeTerkunci($query)
    {
        return $query->where('status', 'dikunci')
                     ->orWhereNotNull('finalized_at');
    }

    /**
     * Accessor: cek apakah tahun ini sudah difinalisasi
     */
    public function getIsFinalizedAttribute(): bool
    {
        return $this->finalized_at !== null;
    }

    public function finalisasiJenjang()
    {
        return $this->hasMany(FinalisasiJenjang::class, 'tahun_ajaran_id');
    }

    public function isFinalizedForJenjang($jenjangId): bool
    {
        if ($this->finalized_at !== null) {
            return true;
        }

        if (!$jenjangId) {
            return false;
        }

        return $this->finalisasiJenjang()
            ->where('jenjang_id', $jenjangId)
            ->whereNotNull('finalized_at')
            ->exists();
    }

    public function finalizedAtForJenjang($jenjangId)
    {
        if ($this->finalized_at !== null) {
            return $this->finalized_at;
        }

        if (!$jenjangId) {
            return null;
        }

        return $this->finalisasiJenjang()
            ->where('jenjang_id', $jenjangId)
            ->value('finalized_at');
    }
}