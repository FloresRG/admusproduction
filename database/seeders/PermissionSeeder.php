<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // Permisos para usuarios
            'users.view',
            'users.create',
            'users.edit',
            'users.delete',

            // Permisos para roles
            'roles.view',
            'roles.create',
            'roles.edit',
            'roles.delete',

      //  Permiso para influencers
            'influencers.view',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }
    $admin = Role::firstOrCreate(['name' => 'admin']);
    $infl = Role::firstOrCreate(['name' => 'influencer']);

    // Todos los permisos (ya sembrados por PermissionSeeder)
    $allPermissions = \Spatie\Permission\Models\Permission::all();
    $admin->syncPermissions($allPermissions);

    // Sólo el permiso “influencers.view” (o el que quieras)
    // Asegúrate de que exista en PermissionSeeder
    $infl->syncPermissions(['influencers.view']);
    }
}
