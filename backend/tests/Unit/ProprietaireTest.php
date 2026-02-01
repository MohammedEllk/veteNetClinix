<?php

namespace Tests\Unit;

use App\Models\Proprietaire;
use App\Models\Animal;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProprietaireTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_create_a_proprietaire()
    {
        $proprietaire = Proprietaire::create([
            'nom' => 'Martin',
            'prenom' => 'Sophie',
            'telephone' => '0601020304',
            'email' => 'sophie.martin@example.com',
            'adresse' => '123 Rue de la Paix',
        ]);

        $this->assertInstanceOf(Proprietaire::class, $proprietaire);
        $this->assertEquals('Martin', $proprietaire->nom);
        $this->assertEquals('Sophie', $proprietaire->prenom);
        $this->assertEquals('sophie.martin@example.com', $proprietaire->email);
        $this->assertDatabaseHas('proprietaires', [
            'email' => 'sophie.martin@example.com',
        ]);
    }

    /** @test */
    public function it_can_have_many_animaux()
    {
        $proprietaire = Proprietaire::factory()->create();

        $animal1 = Animal::factory()->create(['proprietaire_id' => $proprietaire->id]);
        $animal2 = Animal::factory()->create(['proprietaire_id' => $proprietaire->id]);
        $animal3 = Animal::factory()->create(['proprietaire_id' => $proprietaire->id]);

        $this->assertCount(3, $proprietaire->animaux);
        $this->assertTrue($proprietaire->animaux->contains($animal1));
        $this->assertTrue($proprietaire->animaux->contains($animal2));
        $this->assertTrue($proprietaire->animaux->contains($animal3));
    }

    /** @test */
    public function it_can_be_updated()
    {
        $proprietaire = Proprietaire::factory()->create([
            'email' => 'old@example.com',
            'telephone' => '0601020304',
        ]);

        $proprietaire->update([
            'email' => 'new@example.com',
            'telephone' => '0612345678',
        ]);

        $this->assertEquals('new@example.com', $proprietaire->email);
        $this->assertEquals('0612345678', $proprietaire->telephone);
        $this->assertDatabaseHas('proprietaires', [
            'email' => 'new@example.com',
            'telephone' => '0612345678',
        ]);
    }

    /** @test */
    public function it_can_be_deleted()
    {
        $proprietaire = Proprietaire::factory()->create();
        $proprietaireId = $proprietaire->id;

        $proprietaire->delete();

        $this->assertDatabaseMissing('proprietaires', [
            'id' => $proprietaireId,
        ]);
    }
}
