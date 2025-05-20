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

        // Usuario fidel
        $fidel = User::firstOrCreate(
            ['email' => 'fidel4@gmail.com'],
            [
                'name'     => 'Fidel',
                'password' => Hash::make('fidel4@gmail.com'),
            ]
        );
        $fidel->assignRole('admin');

        // Usuario ronald
        $ronald = User::firstOrCreate(
            ['email' => 'ronald@gmail.com'],
            [
                'name'     => 'Ronald',
                'password' => Hash::make('ronald@gmail.com'),
            ]
        );
        $ronald->assignRole('admin');

        // Usuario guadalupe
        $guadalupe = User::firstOrCreate(
            ['email' => 'guadalupe@gmail.com'],
            [
                'name'     => 'Guadalupe',
                'password' => Hash::make('guadalupe@gmail.com'),
            ]
        );
        $guadalupe->assignRole('admin');
    }
}
