<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KelompokQuran extends Model
{
    use HasFactory;

    protected $table = 'kelompok_quran';

    protected $fillable = [
        'guru_id',
        'tahun_ajaran_id',
        'semester',
        'label',
        'aktif',
    ];

    protected $casts = [
        'aktif' => 'boolean',
    ];

    // Guru
    public function guru()
    {
        return $this->belongsTo(User::class, 'guru_id');
    }

    // Siswa anggota
// App\Models\KelompokQuran.php

    public function anggota()
    {
        return $this->belongsToMany(
            Siswa::class,              // ← model Siswa, bukan SiswaBaru
            'anggota_kelompok_quran',
            'kelompok_quran_id',
            'siswa_id'
        )->withTimestamps();
    }
    // Tahun ajaran
    public function tahunAjaran()
    {
        return $this->belongsTo(TahunAjaran::class, 'tahun_ajaran_id');
    }
}