<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinalisasiJenjang extends Model
{
    protected $table = 'finalisasi_jenjang';

    protected $fillable = [
        'tahun_ajaran_id',
        'jenjang_id',
        'finalized_at',
        'finalized_by',
    ];

    protected $casts = [
        'finalized_at' => 'datetime',
    ];

    public function tahunAjaran()
    {
        return $this->belongsTo(TahunAjaran::class, 'tahun_ajaran_id');
    }

    public function jenjang()
    {
        return $this->belongsTo(Jenjang::class, 'jenjang_id');
    }

    public function finalizedByUser()
    {
        return $this->belongsTo(User::class, 'finalized_by');
    }
}
