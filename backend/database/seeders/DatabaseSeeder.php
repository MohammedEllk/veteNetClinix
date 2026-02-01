<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Créer un compte admin
        User::create([
            'name' => 'Admin',
            'email' => 'admin@veteclinix.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        // Créer un compte vétérinaire
        User::create([
            'name' => 'Dr. Moha',
            'email' => 'vet@veteclinix.com',
            'password' => Hash::make('vet123'),
            'role' => 'veterinaire',
        ]);
    }
}
