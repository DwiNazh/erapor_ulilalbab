<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PjblJudul extends Model
{
    use HasFactory;

    protected $table = 'pjbl_judul';

    protected $fillable = [
        'rombel_id',
        'tahun_ajaran_id',
        'semester',
        'judul',
        'deskripsi',
    ];

    public function rombel()
    {
        return $this->belongsTo(Rombel::class, 'rombel_id');
    }

    public function tahunAjaran()
    {
        return $this->belongsTo(TahunAjaran::class, 'tahun_ajaran_id');
    }
}