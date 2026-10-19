<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PertemuanQuran extends Model
{
    protected $table = 'pertemuan_quran';

    protected $fillable = [
        'kelompok_quran_id',
        'tanggal',
        'pertemuan_ke',
        'catatan',
    ];

    public function kelompok()
    {
        return $this->belongsTo(KelompokQuran::class, 'kelompok_quran_id');
    }

    public function nilaiList()
    {
        return $this->hasMany(NilaiQuran::class, 'pertemuan_id');
    }
}