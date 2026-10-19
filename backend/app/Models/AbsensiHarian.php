<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AbsensiHarian extends Model
{
    protected $table = 'absensi_harian';

    protected $fillable = [
        'siswa_tahun_id',
        'rombel_id',
        'tahun_ajaran_id',
        'semester',
        'tanggal',
        'status',
        'keterangan',
        'guru_id',
    ];
}