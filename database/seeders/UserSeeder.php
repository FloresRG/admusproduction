<?php
// database/seeders/UserSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Usuario influencer
        $influencer = User::firstOrCreate(
            ['email' => 'influencer@test.com'],
            [
                'name'     => 'Usuario Influencer',
                'password' => Hash::make('secret123'),
            ]
        );
        $influencer->assignRole('influencer');

        // Usuario admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name'     => 'Usuario Admin',
                'password' => Hash::make('secret123'),
            ]
        );
        $admin->assignRole('admin');
    }
}
