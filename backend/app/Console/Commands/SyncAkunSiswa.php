<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SyncAkunSiswa extends Command
{
    protected $signature = 'siswa:sync-akun';
    protected $description = 'Sync data siswa dan siswas ke tabel users';

    public function handle()
    {
        // Sync dari tabel siswa (existing)
        $siswaList = DB::table('siswa')
            ->whereNotNull('nis')
            ->get();

        $buatBaru = 0;
        $skip = 0;

        foreach ($siswaList as $siswa) {
            // Cek apakah sudah ada akun
            $sudahAda = DB::table('users')
                ->where('nis', $siswa->nis)
                ->exists();

            if ($sudahAda) { $skip++; continue; }

            DB::table('users')->insert([
                'name'         => $siswa->nama,
                'nipy'         => 'SISWA-' . $siswa->id, // ✅ unik per siswa
                'nis'          => $siswa->nis,
                'siswa_id'     => $siswa->id,
                'sumber_siswa' => 'siswa',
                'password'     => Hash::make($siswa->nis),
                'role'         => 'siswa',
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);
            $buatBaru++;
        }

        // Sync dari tabel siswas (ppdb baru)
        $siswasBaru = DB::table('siswas')
            ->whereNotNull('nis')
            ->get();

        foreach ($siswasBaru as $siswa) {
            $sudahAda = DB::table('users')
                ->where('nis', $siswa->nis)
                ->exists();

            if ($sudahAda) { $skip++; continue; }
DB::table('users')->insert([
    'name'         => $siswa->nama_user,
    'nipy'         => 'SISWAS-' . $siswa->id, // ✅ unik per siswa
    'nis'          => $siswa->nis,
    'siswa_id'     => $siswa->id,
    'sumber_siswa' => 'siswas',
    'password'     => Hash::make($siswa->nis),
    'role'         => 'siswa',
    'created_at'   => now(),
    'updated_at'   => now(),
]);
            $buatBaru++;
        }

        $this->info("Selesai! Dibuat: {$buatBaru} akun, Dilewati: {$skip} akun.");
    }
}