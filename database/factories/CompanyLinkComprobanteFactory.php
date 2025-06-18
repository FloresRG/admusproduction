<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Link;
use App\Models\Comprobante;
use Illuminate\Database\Eloquent\Factories\Factory;

class CompanyLinkComprobanteFactory extends Factory
{
    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'link_id' => Link::factory(),
            'comprobante_id' => Comprobante::factory(),
            'mes' => $this->faker->monthName,
            'fecha' => $this->faker->date(),
        ];
    }
}
