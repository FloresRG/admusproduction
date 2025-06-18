<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class LinkFactory extends Factory
{
    public function definition(): array
    {
        return [
            'link' => $this->faker->url,
            'detalle' => $this->faker->sentence,
        ];
    }
}
