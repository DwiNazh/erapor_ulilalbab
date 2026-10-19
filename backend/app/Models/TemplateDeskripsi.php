<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TemplateDeskripsi extends Model
{
    protected $table = 'template_deskripsi';

    protected $fillable = [
        'guru_id',
        'jenis',   // 'kokurikuler' atau 'ekstrakurikuler'
        'aspek',
        'grade',
        'deskripsi',
    ];
}