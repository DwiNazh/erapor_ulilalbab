<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NilaiSiswaDetail extends Model
{
    protected $table = 'nilai_siswa_detail';

    protected $fillable = [
        'nilai_siswa_id',
        'jenis',
        'urutan',
        'nilai'
    ];
}