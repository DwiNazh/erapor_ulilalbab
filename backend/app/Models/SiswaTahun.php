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
        'status',
    ];
    
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

    public function scopeUntukUser($query, $user)
    {
        if (!$user || $user->isSuperadmin()) {
            return $query;
        }
        $ids = $user->jenjangIds();
        $range = $user->kelasRange();

        return $query->where(function ($q) use ($ids, $range) {
            $q->whereHas('rombel', function ($rq) use ($ids) {
                $rq->whereIn('jenjang_id', $ids);
            })->orWhere(function ($oq) use ($range) {
                $oq->whereNull('siswa_tahun.rombel_id')
                   ->whereHas('siswa', function ($sq) use ($range) {
                       $sq->whereBetween('kelas', [$range['min'], $range['max']]);
                   });
            });
        });
    }
}