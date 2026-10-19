<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiswaBaru extends Model
{
    use HasFactory;

    // Nama tabel sesuai database
    protected $table = 'siswas';

    // Kolom yang bisa diisi
    protected $fillable = [
        'nama_user',
        'kelas',
        'sub_kelas',
        'nis',
        'password',
        'ppdb_id',
        'nisn',
        'kategori',
        'is_processed',
        'jenjang_id',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'password' => 'hashed',
    ];

}
