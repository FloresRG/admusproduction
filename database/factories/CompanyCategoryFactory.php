<?php

namespace Database\Factories;

use App\Models\CompanyCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class CompanyCategoryFactory extends Factory
{
    protected $model = CompanyCategory::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->word,
            // agrega aquí los campos necesarios para CompanyCategory
        ];
    }
}
