<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RaporFinal extends Model
{
    use HasFactory;

    protected $table = 'rapor_final';

    protected $fillable = [
        'guru_id',
        'siswa_id',
        'rombel_id',
        'semester',
        'tahun_ajaran',
        'nilai_akhir',
        'deskripsi_intrakurikuler',
        'catatan_wali',
        'is_locked',
        'locked_at',
    ];

    protected $casts = [
        'is_locked' => 'boolean',
        'locked_at' => 'datetime',
    ];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class, 'siswa_id');
    }
}