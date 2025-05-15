<?php

namespace Database\Factories;

use App\Models\Week;
use Illuminate\Database\Eloquent\Factories\Factory;

class WeekFactory extends Factory
{
    protected $model = Week::class;

    public function definition()
    {
        return [
            'name' => 'Week ' . $this->faker->word(),
            'start_date' => $this->faker->date(),
            'end_date' => $this->faker->date(),
        ];
    }
}
