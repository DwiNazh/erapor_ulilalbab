<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Guru;

class GuruSeeder extends Seeder
{
    public function run()
    {
        $data = [
            ['nama' => 'Budi Santoso', 'nipy' => 'G001'],
            ['nama' => 'Ani Lestari', 'nipy' => 'G002'],
            ['nama' => 'Dewi Kusuma', 'nipy' => 'G003'],
        ];

        foreach ($data as $g) Guru::create($g);
    }
}
