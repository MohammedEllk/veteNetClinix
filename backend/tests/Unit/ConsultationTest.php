<?php

namespace Tests\Unit;

use App\Models\Consultation;
use App\Models\Animal;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConsultationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_create_a_consultation()
    {
        $animal = Animal::factory()->create();
        $veterinaire = User::factory()->create();

        $consultation = Consultation::create([
            'animal_id' => $animal->id,
            'veterinaire_id' => $veterinaire->id,
            'date_consultation' => now(),
            'motif' => 'Vaccination annuelle',
            'diagnostic' => 'Animal en bonne santé',
            'traitement' => 'Vaccin antirabique',
            'poids' => 28.5,
            'temperature' => 38.5,
            'recommandations' => 'Revenir dans 1 an',
        ]);

        $this->assertInstanceOf(Consultation::class, $consultation);
        $this->assertEquals('Vaccination annuelle', $consultation->motif);
        $this->assertEquals(28.5, $consultation->poids);
        $this->assertDatabaseHas('consultations', [
            'motif' => 'Vaccination annuelle',
            'animal_id' => $animal->id,
        ]);
    }

    /** @test */
    public function it_belongs_to_an_animal()
    {
        $animal = Animal::factory()->create(['nom' => 'Max']);
        $consultation = Consultation::factory()->create(['animal_id' => $animal->id]);

        $this->assertInstanceOf(Animal::class, $consultation->animal);
        $this->assertEquals('Max', $consultation->animal->nom);
        $this->assertEquals($animal->id, $consultation->animal->id);
    }

    /** @test */
    public function it_belongs_to_a_veterinaire()
    {
        $veterinaire = User::factory()->create(['name' => 'Dr. Leblanc']);
        $consultation = Consultation::factory()->create(['veterinaire_id' => $veterinaire->id]);

        $this->assertInstanceOf(User::class, $consultation->veterinaire);
        $this->assertEquals('Dr. Leblanc', $consultation->veterinaire->name);
        $this->assertEquals($veterinaire->id, $consultation->veterinaire->id);
    }

    /** @test */
    public function it_casts_date_consultation_to_datetime()
    {
        $consultation = Consultation::factory()->create([
            'date_consultation' => '2026-02-01 14:30:00',
        ]);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $consultation->date_consultation);
        $this->assertEquals('2026-02-01 14:30:00', $consultation->date_consultation->format('Y-m-d H:i:s'));
    }

    /** @test */
    public function it_can_have_documents()
    {
        $consultation = Consultation::factory()->create();

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Collection::class, $consultation->documents);
    }

    /** @test */
    public function it_requires_required_fields()
    {
        $this->expectException(\Illuminate\Database\QueryException::class);

        Consultation::create([
            'motif' => 'Checkup',
            // Manque animal_id et veterinaire_id obligatoires
        ]);
    }
}
