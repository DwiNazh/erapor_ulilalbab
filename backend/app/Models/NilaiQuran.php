<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NilaiQuran extends Model
{
    use HasFactory;

    protected $table = 'nilai_quran';

    protected $fillable = [
        'siswa_id',
        'kelompok_quran_id',
        'tahun_ajaran',
        'jenis',
        'semester',
        'uh1',
        'uh2',
        'uh3',
        'uh4',
        'uh5',
        'pts',
        'pas',
        'deskripsi'
    ];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class, 'siswa_id');
    }
}