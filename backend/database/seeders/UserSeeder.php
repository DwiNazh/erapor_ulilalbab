<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Super Admin',
            'nipy' => '1001',
            'role' => 'superadmin',
            'password' => Hash::make('admin123'),
        ]);

        User::create([
            'name' => 'Admin TU SD',
            'nipy' => '200001',
            'role' => 'admintu',
            'password' => Hash::make('admin123'),
        ]);

        User::create([
            'name' => 'Guru SD',
            'nipy' => '300001',
            'role' => 'guru',
            'password' => Hash::make('admin123'),
        ]);
    }
}
