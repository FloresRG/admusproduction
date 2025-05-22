<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Tipo;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tarea>
 */
class TareaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'titulo' => $this->faker->sentence,
            'prioridad' => $this->faker->randomElement(['alta', 'media', 'baja']),
            'descripcion' => $this->faker->paragraph,
            'empresa' => $this->faker->company,
            'fecha' => $this->faker->date(),
            'tipo_id' => Tipo::factory(),
            'company_id' => Company::factory(), // asegúrate de tener ese modelo y factory
        ];
    }
}
