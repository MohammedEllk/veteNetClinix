<?php

namespace Tests\Unit;

use App\Models\Animal;
use App\Models\Proprietaire;
use App\Models\Consultation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnimalTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_create_an_animal()
    {
        $proprietaire = Proprietaire::factory()->create();

        $animal = Animal::create([
            'proprietaire_id' => $proprietaire->id,
            'nom' => 'Rex',
            'espece' => 'Chien',
            'race' => 'Labrador',
            'sexe' => 'M',
            'date_naissance' => '2020-01-15',
            'poids' => 25.5,
            'remarques' => 'Très gentil',
        ]);

        $this->assertInstanceOf(Animal::class, $animal);
        $this->assertEquals('Rex', $animal->nom);
        $this->assertEquals('Chien', $animal->espece);
        $this->assertEquals(25.5, $animal->poids);
        $this->assertDatabaseHas('animaux', [
            'nom' => 'Rex',
            'espece' => 'Chien',
        ]);
    }

    /** @test */
    public function it_belongs_to_a_proprietaire()
    {
        $proprietaire = Proprietaire::factory()->create([
            'nom' => 'Dupont',
            'prenom' => 'Jean',
        ]);

        $animal = Animal::factory()->create([
            'proprietaire_id' => $proprietaire->id,
        ]);

        $this->assertInstanceOf(Proprietaire::class, $animal->proprietaire);
        $this->assertEquals('Dupont', $animal->proprietaire->nom);
        $this->assertEquals($proprietaire->id, $animal->proprietaire->id);
    }

    /** @test */
    public function it_can_have_many_consultations()
    {
        $animal = Animal::factory()->create();

        $consultation1 = Consultation::factory()->create(['animal_id' => $animal->id]);
        $consultation2 = Consultation::factory()->create(['animal_id' => $animal->id]);

        $this->assertCount(2, $animal->consultations);
        $this->assertTrue($animal->consultations->contains($consultation1));
        $this->assertTrue($animal->consultations->contains($consultation2));
    }

    /** @test */
    public function it_casts_date_naissance_to_date()
    {
        $animal = Animal::factory()->create([
            'date_naissance' => '2020-05-10',
        ]);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $animal->date_naissance);
    }

    /** @test */
    public function it_casts_poids_to_float()
    {
        $animal = Animal::factory()->create([
            'poids' => '30.5',
        ]);

        $this->assertIsFloat($animal->poids);
        $this->assertEquals(30.5, $animal->poids);
    }

    /** @test */
    public function it_requires_required_fields()
    {
        $this->expectException(\Illuminate\Database\QueryException::class);

        Animal::create([
            'nom' => 'Rex',
            // Manque proprietaire_id obligatoire
        ]);
    }
}
