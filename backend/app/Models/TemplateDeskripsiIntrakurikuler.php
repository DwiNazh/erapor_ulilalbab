<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemplateDeskripsiIntrakurikuler extends Model
{
    use HasFactory;

    protected $table = 'template_deskripsi_intrakurikuler';

    protected $fillable = [
        'guru_id',
        'min_nilai',
        'max_nilai',
        'deskripsi',
    ];
}