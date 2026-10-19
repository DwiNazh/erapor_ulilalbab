<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Siswa;

class Ekstrakurikuler extends Model
{
    protected $table = 'ekstrakurikuler';

    protected $fillable = [
        'nama',
        'wajib'
    ];

    public function siswa()
    {
        return $this->belongsToMany(
            Siswa::class,
            'ekstrakurikuler_siswa'
        )
        ->withPivot('nilai')
        ->withTimestamps();
    }
}