<?php

namespace Database\Factories;

use App\Models\Tarea;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AsignacionTarea>
 */
class AsignacionTareaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'tarea_id' => Tarea::factory(),
            'estado' => $this->faker->randomElement([]),
            'detalle' => $this->faker->sentence,
            'fecha' => $this->faker->date(),
        ];
    }
}
