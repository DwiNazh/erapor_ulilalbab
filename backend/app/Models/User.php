<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name', 'nipy', 'password', 'role', 'jenjang_id'];

    public function isSuperadmin(): bool { return $this->role === 'superadmin'; }
    public function jenjangIds(): ?array {
        if ($this->isSuperadmin()) {
            $requested = request()->header('X-Jenjang-Id') ?? request()->query('jenjang_id');
            if ($requested && is_numeric($requested)) {
                return [(int) $requested];
            }
            return null;
        }
        return $this->jenjang_id ? [(int) $this->jenjang_id] : [];
    }
    public function bolehJenjang($jenjangId): bool {
        if ($this->isSuperadmin()) return true;
        $ids = $this->jenjangIds();
        return $ids === null || ($jenjangId !== null && in_array((int) $jenjangId, $ids, true));
    }
    public function kodeJenjang(): ?string {
        $id = $this->jenjang_id;
        if ($this->isSuperadmin()) {
            $requested = request()->header('X-Jenjang-Id') ?? request()->query('jenjang_id');
            if ($requested && is_numeric($requested)) {
                $id = (int) $requested;
            }
        }
        return $id ? \Illuminate\Support\Facades\DB::table('jenjang')->where('id', $id)->value('kode') : null;
    }
    public function kelasRange(): array {
        $tidakAda = ['min' => 0, 'max' => 0]; // tidak cocok dengan kelas mana pun
        $id = $this->jenjang_id;
        if ($this->isSuperadmin()) {
            $requested = request()->header('X-Jenjang-Id') ?? request()->query('jenjang_id');
            if ($requested && is_numeric($requested)) { $id = (int) $requested; }
            else { return ['min' => 1, 'max' => 12]; }
        }
        if (!$id) { return $tidakAda; }
        $j = \Illuminate\Support\Facades\DB::table('jenjang')->where('id', $id)->first();
        return $j ? ['min' => (int) $j->kelas_min, 'max' => (int) $j->kelas_max] : $tidakAda;
    }

    public function jenjang()
    {
        return $this->belongsTo(Jenjang::class, 'jenjang_id');
    }

    protected $hidden = ['password', 'remember_token'];

    // Cast role agar konsisten
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function rombels()
    {
        return $this->hasMany(Rombel::class, 'guru_id', 'id');
    }

    public function scopeGuru($query)
    {
        return $query->where('role', 'guru');
    }
    public function mapel()
    {
        // Menggunakan belongsToMany karena satu guru bisa punya banyak penugasan mapel
        return $this->belongsToMany(
            Mapel::class, 
            'penugasan_guru', // Nama tabel pivot sesuai gambar
            'guru_id',        // Foreign key di tabel penugasan_guru untuk User
            'mapel_id'        // Foreign key di tabel penugasan_guru untuk Mapel
        )->withPivot('rombel_id', 'kelas', 'tahun_ajaran_id'); // Mengambil data tambahan jika perlu
    }
    public function kelompokQuran()
    {
        return $this->hasMany(KelompokQuran::class, 'guru_id');
    }
}