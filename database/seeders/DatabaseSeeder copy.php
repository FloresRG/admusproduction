<?php

namespace Database\Seeders;

use App\Models\AsignacionTarea;
use App\Models\Tarea;
use App\Models\Tipo;
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
        // Llamar a seeders específicos
        $this->call([
            PermissionSeeder::class,
            RoleSeeder::class,
            UserSeeder::class,
        ]);

        // Semillas adicionales
        \App\Models\Week::factory(10)->create();
        \App\Models\Company::factory(10)->create();
        \App\Models\User::factory(10)->create();
        \App\Models\Booking::factory(10)->create();

        // --------------------------
        // Tu código de seeding extra
        // --------------------------

        $tipos = Tipo::factory(5)->create();
        $users = User::all(); // Ya los creaste arriba

        $tipos->each(function ($tipo) use ($users) {
            $tipo->users()->attach(
                $users->random(3)->pluck('id')->toArray()
            );
        });

        $tareas = Tarea::factory(10)->create();

        $users->each(function ($user) use ($tareas) {
            AsignacionTarea::factory()->create([
                'user_id' => $user->id,
                'tarea_id' => $tareas->random()->id,
            ]);
        });
    }
    
}
