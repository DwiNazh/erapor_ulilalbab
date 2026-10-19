<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NilaiKokurikuler extends Model
{
    use HasFactory;

    protected $table = 'nilai_kokurikuler';


    protected $fillable = [
        'siswa_id',
        'guru_id',
        'rombel_id',
        'tahun_ajaran',
        'semester',
        'mutabaah_yaumiyah',
        'bina_pribadi_islam',
        'pjbl',
        'literasi',
        'deskripsi',
        'deskripsi_aspek',
        'nilai_mingguan_mutabaah',
    ];

    protected $casts = [
        'nilai_mingguan_mutabaah' => 'array',
        'deskripsi_aspek' => 'array',
        'mutabaah_yaumiyah' => 'decimal:1',

    ];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);  // sesuaikan nama model Siswa kamu
    }

    public function rombel()
    {
        return $this->belongsTo(Rombel::class);  // sesuaikan nama model Rombel
    }
}