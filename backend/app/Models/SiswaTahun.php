<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiswaTahun extends Model
{
    use HasFactory;

    // Sesuaikan dengan nama tabel di database Anda (misal: siswa_tahun atau siswas_tahun)
    protected $table = 'siswa_tahun'; 

    protected $fillable = [
        'siswa_id',
        'tahun_ajaran_id',
        'rombel_id',
        'jenjang_id',
        'status',
        'is_processed',
    ];

    protected static function booted(): void {
        static::creating(function ($st) {
            if (!$st->jenjang_id && $st->rombel_id) {
                $st->jenjang_id = \Illuminate\Support\Facades\DB::table('rombel')->where('id', $st->rombel_id)->value('jenjang_id');
            }
        });
    }
    
    public function siswa()
    {
        return $this->belongsTo(Siswa::class, 'siswa_id', 'id');
        // 'siswa_id' adalah foreign key di siswa_tahun
        // 'id' adalah primary key di siswa
    }

    public function rombel()
    {
    return $this->belongsTo(Rombel::class, 'rombel_id', 'id');
    // atau jika nama kolomnya beda, misal rombel_id di SiswaTahun
    }

    public function tahunAjaran()
    {
        return $this->belongsTo(TahunAjaran::class, 'tahun_ajaran_id', 'id');
    }

    public function scopeUntukUser($query, $user) {
        if (!$user) { return $query->whereRaw('1 = 0'); }
        $ids = $user->jenjangIds(); // null = semua jenjang
        if ($ids === null) { return $query; }
        return $query->where(function ($q) use ($ids) {
            $q->whereIn('siswa_tahun.jenjang_id', $ids)
              ->orWhereHas('rombel', fn($r) => $r->whereIn('jenjang_id', $ids));
        });
    }
}