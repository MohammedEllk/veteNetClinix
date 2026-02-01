<?php

namespace Database\Factories;

use App\Models\Animal;
use App\Models\Proprietaire;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnimalFactory extends Factory
{
    protected $model = Animal::class;

    public function definition(): array
    {
        return [
            'proprietaire_id' => Proprietaire::factory(),
            'nom' => fake()->firstName(),
            'espece' => fake()->randomElement(['Chien', 'Chat', 'Lapin', 'Oiseau']),
            'race' => fake()->randomElement(['Labrador', 'Berger Allemand', 'Siamois', 'Persan', 'Bélier', 'Canari']),
            'sexe' => fake()->randomElement(['M', 'F']),
            'date_naissance' => fake()->date('Y-m-d', '-5 years'),
            'poids' => fake()->randomFloat(1, 0.5, 50),
            'remarques' => fake()->optional()->sentence(),
        ];
    }
}
