<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guru extends Model
{
    use HasFactory;

    protected $table = 'guru';

    protected $fillable = [
        'nama',
        'nipy',
        'user_id',
        'wali_kelas',
        'sub_kelas',
        // tambahkan kalau ada: 'status', 'no_hp', 'email', dll
    ];

    protected $casts = [
        'wali_kelas' => 'boolean',
        'user_id'    => 'integer',
    ];

    /**
     * Relasi ke User (akun login)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relasi ke Rombel yang diwali (jika guru_id di rombel)
     */
    public function rombels()
    {
        return $this->hasMany(Rombel::class, 'guru_id');
    }

    /**
     * Accessor: Info lengkap untuk dropdown/UI
     */
    public function getFullInfoAttribute(): string
    {
        $nip = $this->nipy ? " ({$this->nipy})" : '';
        return trim("{$this->nama}{$nip}");
    }

    /**
     * Scope: Guru aktif / potensial wali
     */
    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif'); // sesuaikan kalau pakai kolom status
    }

    public function scopeBisaJadiWali($query)
    {
        return $query->aktif(); // bisa ditambah filter lain nanti
    }
}