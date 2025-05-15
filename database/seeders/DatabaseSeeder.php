<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call([
            PermissionSeeder::class,
            RoleSeeder::class,
            UserSeeder::class,
        ]);
         // Crear algunas semanas
        \App\Models\Week::factory(10)->create();

        // Crear algunas compañías
        \App\Models\Company::factory(10)->create();

        // Crear algunos usuarios
        \App\Models\User::factory(10)->create();

        // Crear algunas reservas
        \App\Models\Booking::factory(10)->create();
        /* User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]); */
    }
    
}
