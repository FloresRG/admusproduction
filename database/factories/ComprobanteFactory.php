<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Comprobante>
 */
class ComprobanteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
         return [
        'comprobante' => $this->faker->uuid,
        'detalle' => $this->faker->sentence,
        'glosa' => $this->faker->sentence,
        'tipo' => $this->faker->randomElement(['Factura', 'Boleta', 'Recibo']),
    ];
    }
}
