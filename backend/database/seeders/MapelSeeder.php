<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Mapel;  // ← TAMBAHKAN BARIS INI

class MapelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mapels = [
            ['nama' => 'Matematika', 'kode' => 'MTK'],
            ['nama' => 'Bahasa Indonesia', 'kode' => 'B.IND'],
            ['nama' => 'Ilmu Pengetahuan Alam', 'kode' => 'IPA'],
            ['nama' => 'Ilmu Pengetahuan Sosial', 'kode' => 'IPS'],
            ['nama' => 'Pendidikan Agama dan Budi Pekerti', 'kode' => 'PA'],
            ['nama' => 'Pendidikan Pancasila dan Kewargaanegaraan', 'kode' => 'PKn'],
            ['nama' => 'Pendidikan Jasmani, Olahraga, dan Kesehatan', 'kode' => 'PJOK'],
            ['nama' => 'Seni Budaya dan Prakarya', 'kode' => 'SBdP'],
            ['nama' => 'Bahasa Inggris', 'kode' => 'B.ING'],
            ['nama' => 'Muatan Lokal', 'kode' => 'MULOK'],
        ];

        foreach ($mapels as $mapel) {
            Mapel::create($mapel);
        }
    }
}