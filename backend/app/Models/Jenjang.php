<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jenjang extends Model
{
    use HasFactory;

    protected $table = 'jenjang';

    protected $fillable = [
        'kode',
        'nama',
        'kelas_min',
        'kelas_max',
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'jenjang_id');
    }

    public function rombels()
    {
        return $this->hasMany(Rombel::class, 'jenjang_id');
    }
}
