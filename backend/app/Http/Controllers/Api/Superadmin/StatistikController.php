<?php

namespace App\Http\Controllers\Api\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Siswa;

class StatistikController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'totalGuru'          => User::where('role', 'guru')->count(),
                'totalSiswa'         => \App\Models\Siswa::count(), // ← dari tabel siswa
                'totalAdminTU'       => User::where('role', 'admintu')->count(),
                'totalKepalaSekolah' => User::where('role', 'kepala_sekolah')->count(),
                'totalSuperadmin'    => User::where('role', 'superadmin')->count(),
                'totalUser'          => User::count(),
            ],
        ]);
    }
}