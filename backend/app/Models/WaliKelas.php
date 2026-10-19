<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WaliKelas extends Model
{
    use HasFactory;

    protected $table = 'wali_kelas';
    
    // Pastikan kolom ini dapat diisi secara massal
    protected $fillable = [
        'user_id',
        'tahun_ajaran_id',
        'kelas',
        'sub',
    ];

    // Definisikan relasi
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tahunAjaran()
    {
        return $this->belongsTo(TahunAjaran::class, 'tahun_ajaran_id');
    }
}