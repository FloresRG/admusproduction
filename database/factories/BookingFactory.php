<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Company;
use App\Models\User;
use App\Models\Week;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingFactory extends Factory
{
    protected $model = Booking::class;

    public function definition()
    {
        return [
            'company_id' => Company::inRandomOrder()->first()->id,
            'user_id' => User::inRandomOrder()->first()->id,
            'start_time' => $this->faker->dateTime(),
            'end_time' => $this->faker->dateTime(),
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'completed']),
            'turno' => $this->faker->randomElement(['mañana', 'tarde']),
            'day_of_week' => $this->faker->randomElement(['monday', 'tuesday', 'wednesday', 'truesday', 'friday']),
            'week_id' => Week::inRandomOrder()->first()->id,
        ];
    }
}
