<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AbsensiMapel extends Model
{
    protected $table = 'absensi_mapel';
    protected $fillable = [
        'siswa_tahun_id',
        'rombel_id',
        'guru_id',
        'mata_pelajaran_id',
        'semester',
        'tanggal',
        'pertemuan_ke',
        'status',
        'keterangan',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    public function siswaTahun()
    {
        return $this->belongsTo(SiswaTahun::class, 'siswa_tahun_id');
    }

    public function rombel()
    {
        return $this->belongsTo(Rombel::class);
    }

    public function guru()
    {
        return $this->belongsTo(User::class, 'guru_id');
    }

    public function mataPelajaran()
    {
        return $this->belongsTo(Mapel::class, 'mata_pelajaran_id');
    }
}