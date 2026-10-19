<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;   // ✅ penting
use Laravel\Sanctum\HasApiTokens;                         // ✅ penting

class Siswa extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $table = 'siswa';

    protected $fillable = [
        'nama',
        'kelas',
        'nis',
        'nisn',
        'password',
        'kategori', 
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'password' => 'hashed', // otomatis Hash::make() saat di-set
    ];

    public $timestamps = true;

    // Relasi ke wali kelas
    public function waliKelas()
    {
        return $this->belongsTo(WaliKelas::class, 'wali_kelas_id');
    }

    public function promosi()
    {
        return $this->hasMany(PromosiSiswa::class, 'siswa_id');
    }

    public function siswaTahun()
    {
        return $this->hasMany(SiswaTahun::class, 'siswa_id');
    }

    public function ekstrakurikuler()
    {
        return $this->belongsToMany(Ekstrakurikuler::class, 'ekstrakurikuler_siswa')
                    ->withPivot('nilai')
                    ->withTimestamps();
    }
    public function kelompokQuran()
    {
        return $this->belongsToMany(
            KelompokQuran::class,
            'anggota_kelompok_quran',
            'siswa_id',
            'kelompok_quran_id'
        );
    }

    public function scopeUntukUser($query, $user)
    {
        if (!$user || $user->isSuperadmin()) {
            return $query;
        }
        $range = $user->kelasRange();
        return $query->whereBetween('kelas', [$range['min'], $range['max']]);
    }
}