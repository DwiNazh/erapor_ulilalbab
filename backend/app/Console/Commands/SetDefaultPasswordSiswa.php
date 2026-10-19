<?php

namespace App\Console\Commands;

use App\Models\Siswa;
use App\Models\SiswaBaru;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class SetDefaultPasswordSiswa extends Command
{
    protected $signature = 'siswa:set-default-password';
    protected $description = 'Set password default = NIS untuk siswa (tabel siswa & siswas) yang belum punya password';

    public function handle()
    {
        // Tabel siswa (lama)
        $this->info('Memproses tabel siswa...');
        $siswaLama = Siswa::whereNull('password')
            ->orWhere('password', '')
            ->whereNotNull('nis')
            ->get();

        $bar = $this->output->createProgressBar($siswaLama->count());
        $bar->start();
        foreach ($siswaLama as $s) {
            $s->password = $s->nis; // cast 'hashed' otomatis hash saat save
            $s->save();
            $bar->advance();
        }
        $bar->finish();
        $this->newLine();
        $this->info("Selesai: {$siswaLama->count()} siswa (tabel siswa) diupdate.");

        // Tabel siswas (baru)
        $this->info('Memproses tabel siswas...');
        $siswaBaru = SiswaBaru::whereNull('password')
            ->orWhere('password', '')
            ->whereNotNull('nis')
            ->get();

        $bar2 = $this->output->createProgressBar($siswaBaru->count());
        $bar2->start();
        foreach ($siswaBaru as $s) {
            $s->password = $s->nis;
            $s->save();
            $bar2->advance();
        }
        $bar2->finish();
        $this->newLine();
        $this->info("Selesai: {$siswaBaru->count()} siswa (tabel siswas) diupdate.");
    }
}