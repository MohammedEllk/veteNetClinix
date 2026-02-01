<?php

namespace Database\Factories;

use App\Models\Proprietaire;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProprietaireFactory extends Factory
{
    protected $model = Proprietaire::class;

    public function definition(): array
    {
        return [
            'nom' => fake()->lastName(),
            'prenom' => fake()->firstName(),
            'telephone' => fake()->phoneNumber(),
            'email' => fake()->unique()->safeEmail(),
            'adresse' => fake()->address(),
        ];
    }
}
