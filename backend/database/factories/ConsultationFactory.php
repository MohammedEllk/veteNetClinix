<?php

namespace Database\Factories;

use App\Models\Consultation;
use App\Models\Animal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConsultationFactory extends Factory
{
    protected $model = Consultation::class;

    public function definition(): array
    {
        return [
            'animal_id' => Animal::factory(),
            'veterinaire_id' => User::factory(),
            'date_consultation' => fake()->dateTimeBetween('-1 year', 'now'),
            'motif' => fake()->sentence(),
            'diagnostic' => fake()->paragraph(),
            'traitement' => fake()->paragraph(),
            'poids' => fake()->randomFloat(1, 0.5, 50),
            'temperature' => fake()->randomFloat(1, 37, 40),
            'recommandations' => fake()->optional()->paragraph(),
        ];
    }
}
