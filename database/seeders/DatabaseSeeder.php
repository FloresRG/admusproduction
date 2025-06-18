<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder; // ✅ ESTA LÍNEA ES LA QUE FALTABA
use App\Models\Company;
use App\Models\Link;
use App\Models\Comprobante;
use App\Models\CompanyLinkComprobante;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Crear comprobantes y links independientes
        $comprobantes = Comprobante::factory()->count(10)->create();
        $links = Link::factory()->count(10)->create();

        // Crear 10 compañías
        Company::factory()
    ->count(10)
    ->has(
        CompanyLinkComprobante::factory()
            ->count(2)
            ->state(function () use ($links, $comprobantes) {
                return [
                    'link_id' => $links->random()->id,
                    'comprobante_id' => $comprobantes->random()->id,
                ];
            }),
        'linkComprobantes' // <--- nombre correcto de la relación
    )
    ->create();


    }
}
