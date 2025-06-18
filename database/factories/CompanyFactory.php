<?php

namespace Database\Factories;

use App\Models\CompanyCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class CompanyFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->company,
            'company_category_id' => \App\Models\CompanyCategory::inRandomOrder()->first()->id ?? 1,
            'contract_duration' => $this->faker->numberBetween(6, 24),
            'description' => $this->faker->sentence,
            'ubicacion' => $this->faker->city,
            'direccion' => $this->faker->address,
            'start_date' => $this->faker->date(),
            'end_date' => $this->faker->date(),
            'contrato' => $this->faker->word,
            'monto_mensual' => $this->faker->randomFloat(2, 1000, 5000),
            'celular' => $this->faker->phoneNumber,
        ];
    }
}
