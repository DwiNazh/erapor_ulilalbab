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
     * Helper untuk mengambil tahun ajaran aktif dengan fallback
     */
    public static function getAktif(): ?self
    {
        return static::where('aktif', 1)->first()
            ?? static::where('status', 'aktif')->first()
            ?? static::orderByDesc('id')->first();
    }

    /**
     * Helper untuk mengambil tahun ajaran berikutnya yang valid (tidak boleh sama dengan tahun aktif)
     */
    public function getNextTahunAjaran(): ?self
    {
        $targetNama = null;
        if (preg_match('/^(\d{4})\/(\d{4})$/', $this->nama, $matches)) {
            $targetNama = ((int)$matches[1] + 1) . '/' . ((int)$matches[2] + 1);
        }

        $tahunTarget = $targetNama
            ? static::where('nama', $targetNama)->first()
            : null;

        if (!$tahunTarget) {
            $tahunTarget = static::where('id', '>', $this->id)
                ->orderBy('id', 'asc')
                ->first();
        }

        if ($tahunTarget && (int) $tahunTarget->id !== (int) $this->id) {
            return $tahunTarget;
        }

        return null;
    }

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

    public static function aktifUntuk($user = null) {
        $user = $user ?? request()->user();
        if (!$user) return null;
        $ids = $user->jenjangIds();
        if ($ids === null) return static::where('aktif', 1)->first();
        if (count($ids) !== 1) return null;
        $row = \Illuminate\Support\Facades\DB::table('tahun_ajaran_jenjang')->where('jenjang_id', $ids[0])->where('aktif', 1)->first();
        return $row ? static::find($row->tahun_ajaran_id) : null;
    }

    public function barisJenjang($jenjangId) {
        return \Illuminate\Support\Facades\DB::table('tahun_ajaran_jenjang')->where('tahun_ajaran_id', $this->id)->where('jenjang_id', $jenjangId)->first();
    }
}