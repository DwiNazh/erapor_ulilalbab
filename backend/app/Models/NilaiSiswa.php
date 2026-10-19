<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NilaiSiswa extends Model
{
    use HasFactory;

    protected $table = 'nilai_siswa';

    protected $fillable = [
        'siswa_id',
        'mapel_id',
        'semester',
        'tahun_ajaran',
        'uh1', 'uh2', 'uh3', 'uh4', 'uh5',
        'guru_id',
        'pts',
        'pas',
    ];

    protected $casts = [
        'uh1' => 'integer',
        'uh2' => 'integer',
        'uh3' => 'integer',
        'uh4' => 'integer',
        'uh5' => 'integer',
        'pts' => 'integer',
        'pas' => 'integer',
    ];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    public function mapel()
    {
        return $this->belongsTo(Mapel::class);
    }
    public function guru()
    {
        return $this->belongsTo(User::class, 'guru_id');
    }
}