<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    protected $table = 'kelas';
    protected $fillable = ['tingkat', 'sub', 'label'];

    public function siswa()
    {
        return $this->hasMany(Siswa::class, 'kelas', 'tingkat'); // optional, depends on you
    }
}
