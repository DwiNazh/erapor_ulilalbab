<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PromosiSiswa extends Model
{
    protected $table = 'promosi_siswa';

    protected $fillable = [
        'siswa_id',
        'kelas_asal',
        'sub_kelas_asal',
        'tahun_ajaran_asal',
        'kelas_tujuan',
        'sub_kelas_tujuan',
        'tahun_ajaran_id',
        'status'
    ];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    public function tahunAjaran()
    {
        return $this->belongsTo(TahunAjaran::class, 'tahun_ajaran_id');
    }
}
