<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KelompokQuranAnggota extends Model
{
    use HasFactory;

    protected $table = 'anggota_kelompok_quran';

    protected $fillable = [
        'kelompok_quran_id',
        'siswa_id',
    ];

    public function kelompok()
    {
        return $this->belongsTo(KelompokQuran::class, 'kelompok_quran_id');
    }

    public function siswa()
    {
        return $this->belongsTo(Siswa::class, 'siswa_id');
    }
}