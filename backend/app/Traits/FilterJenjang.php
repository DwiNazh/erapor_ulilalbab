<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

trait FilterJenjang
{
    /**
     * Dapatkan daftar jenjang_id yang boleh diakses pengguna:
     * - null jika superadmin (semua jenjang diizinkan)
     * - array ID (contoh: [1]) jika pengguna reguler
     */
    public function getJenjangIds($user = null): ?array
    {
        $user = $user ?? request()->user();
        if (!$user) {
            return [];
        }
        return $user->jenjangIds();
    }

    /**
     * Rentang tingkat kelas berdasarkan jenjang user.
     * Contoh: SD [1, 6], SMP [7, 9], SMA [10, 12], Superadmin [1, 12]
     */
    public function getKelasRange($user = null): array
    {
        $user = $user ?? request()->user();
        if (!$user) { return ['min' => 0, 'max' => 0]; }
        return $user->kelasRange();
    }

    /**
     * Periksa apakah pengguna boleh mengakses suatu jenjang_id.
     */
    public function userBolehJenjang($jenjangId, $user = null): bool
    {
        $user = $user ?? request()->user();
        if (!$user) {
            return false;
        }
        return $user->bolehJenjang($jenjangId);
    }
}
