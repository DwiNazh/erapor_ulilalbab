<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CatatanWaliKelas extends Model
{
    protected $table = 'catatan_wali_kelas';

    protected $fillable = [
        'siswa_id',
        'semester',
        'tahun_ajaran',
        'catatan',
        'guru_id',
    ];
}
