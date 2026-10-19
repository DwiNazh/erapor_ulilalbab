<?php

// app/Models/SiswaEkstrakurikuler.php
namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class SiswaEkstrakurikuler extends Pivot
{
    protected $table = 'ekstrakurikuler_siswa';

    protected $fillable = ['siswa_id', 'ekstrakurikuler_id', 'nilai'];

    // Contoh: mutator untuk nilai
    public function setNilaiAttribute($value)
    {
        $this->attributes['nilai'] = in_array($value, ['A', 'B', 'C']) ? $value : null;
    }

    // Contoh: accessor
    public function getNilaiLabelAttribute()
    {
        return match ($this->nilai) {
            'A' => 'Sangat Baik',
            'B' => 'Baik',
            'C' => 'Cukup',
            default => 'Belum Dinilai',
        };
    }

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    public function ekstrakurikuler()
    {
        return $this->belongsTo(Ekstrakurikuler::class);
    }
}
