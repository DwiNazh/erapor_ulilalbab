<?php

namespace App\Models;

use App\Models\PjblJudul;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rombel extends Model
{
    use HasFactory;

    protected $table = 'rombel';

    protected $fillable = [
        'tahun_ajaran_id',     // wajib untuk filter tahun
        'tingkat_kelas',
        'sub_nama',
        'guru_id',             // untuk wali kelas (sudah benar)
        'jenjang_id',          // untuk jenjang pendidikan
        'kelompok_gender',     // untuk kelompok gender
        'nama_rombel',         
        // tambahkan kolom lain jika ada di tabel, misal:
        // 'kapasitas',
        // 'nama_lengkap',
        // 'lokasi_kelas',
    ];

    protected $casts = [
        'id'              => 'integer',
        'tahun_ajaran_id' => 'integer',
        'tingkat_kelas'   => 'integer',   // ← ini penting
        'guru_id'         => 'integer',
    ];

    protected static function booted(): void {
        static::creating(function ($rombel) {
            if (!$rombel->jenjang_id && $rombel->tingkat_kelas) {
                $rombel->jenjang_id = \Illuminate\Support\Facades\DB::table('jenjang')
                    ->where('kelas_min', '<=', $rombel->tingkat_kelas)
                    ->where('kelas_max', '>=', $rombel->tingkat_kelas)->value('id');
            }
        });
    }

    public function scopeUntukUser($query, $user) {
        if (!$user) { return $query->whereRaw('1 = 0'); }
        $ids = $user->jenjangIds();
        return $ids === null ? $query : $query->whereIn('jenjang_id', $ids);
    }

    // Relasi ke tahun ajaran (opsional, tapi bagus untuk dimiliki)
    public function tahunAjaran()
    {
        return $this->belongsTo(TahunAjaran::class, 'tahun_ajaran_id');
    }

    // Relasi ke wali kelas (guru)
    public function guru()
    {
        return $this->belongsTo(User::class, 'guru_id');
    }

    // RELASI YANG DIBUTUHKAN UNTUK FIX ERROR 500
    // Satu rombel punya banyak entri siswa di tahun tertentu (tabel siswa_tahun)
    public function siswaTahun()
    {
        return $this->hasMany(SiswaTahun::class, 'rombel_id', 'id');
    }

    // Opsional: relasi langsung ke siswa (lewat siswa_tahun)
    // Berguna jika ingin ambil data siswa tanpa siswa_tahun
    public function siswa()
    {
        return $this->hasManyThrough(
            Siswa::class,
            SiswaTahun::class,
            'rombel_id',     // foreign key di siswa_tahun
            'id',            // foreign key di siswa
            'id',            // local key di rombel
            'siswa_id'       // local key di siswa_tahun
        );
    }
        public function pjblJudul(): HasMany
    {
        return $this->hasMany(PjblJudul::class, 'rombel_id', 'id');
    }
}