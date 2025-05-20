<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\CompanyCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class CompanyFactory extends Factory
{
    protected $model = Company::class;

    public function definition()
    {
        return [
            'name' => $this->faker->company(),
            'company_category_id' => CompanyCategory::inRandomOrder()->first()->id,
            'contract_duration' => $this->faker->numberBetween(1, 5),
            'description' => $this->faker->text(),
            'ubicacion' => $this->faker->text(),
            'direccion' => $this->faker->text(),
            'start_date' => $this->faker->date(),
            'end_date' => $this->faker->date(),
        ];
    }
}
