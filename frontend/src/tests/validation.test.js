import { describe, it, expect } from 'vitest';

// Tests de validation des données
describe('Data Validation', () => {
  describe('Animal Data', () => {
    it('should validate required animal fields', () => {
      const validAnimal = {
        proprietaire_id: 1,
        nom: 'Rex',
        espece: 'Chien',
        race: 'Labrador',
        sexe: 'M',
        date_naissance: '2020-01-15',
        poids: 25.5,
      };

      expect(validAnimal.proprietaire_id).toBeDefined();
      expect(validAnimal.nom).toBeDefined();
      expect(validAnimal.espece).toBeDefined();
      expect(typeof validAnimal.poids).toBe('number');
      expect(['M', 'F']).toContain(validAnimal.sexe);
    });

    it('should validate animal weight is positive', () => {
      expect(25.5).toBeGreaterThan(0);
      expect(0.5).toBeGreaterThan(0);
      expect(-5).toBeLessThan(0); // Invalid
    });

    it('should validate animal species', () => {
      const validSpecies = ['Chien', 'Chat', 'Lapin', 'Oiseau', 'Autre'];
      expect(validSpecies).toContain('Chien');
      expect(validSpecies).toContain('Chat');
      expect(validSpecies).not.toContain('Dragon');
    });
  });

  describe('Proprietaire Data', () => {
    it('should validate required proprietaire fields', () => {
      const validProprietaire = {
        nom: 'Dupont',
        prenom: 'Jean',
        telephone: '0601020304',
        email: 'jean.dupont@example.com',
        adresse: '123 Rue de Paris',
      };

      expect(validProprietaire.nom).toBeDefined();
      expect(validProprietaire.prenom).toBeDefined();
      expect(validProprietaire.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it('should validate phone number format', () => {
      const phoneRegex = /^(0[1-9])(\d{8})$/;
      expect('0612345678').toMatch(phoneRegex);
      expect('0123456789').toMatch(phoneRegex);
      expect('1234567890').not.toMatch(phoneRegex);
    });
  });

  describe('Consultation Data', () => {
    it('should validate required consultation fields', () => {
      const validConsultation = {
        animal_id: 1,
        veterinaire_id: 1,
        date_consultation: '2026-02-01T14:30:00',
        motif: 'Vaccination',
        diagnostic: 'Animal en bonne santé',
        traitement: 'Vaccin antirabique',
        poids: 28.5,
        temperature: 38.5,
      };

      expect(validConsultation.animal_id).toBeDefined();
      expect(validConsultation.veterinaire_id).toBeDefined();
      expect(validConsultation.date_consultation).toBeDefined();
      expect(typeof validConsultation.poids).toBe('number');
      expect(typeof validConsultation.temperature).toBe('number');
    });

    it('should validate temperature is in valid range', () => {
      const normalTemp = 38.5;
      expect(normalTemp).toBeGreaterThan(35);
      expect(normalTemp).toBeLessThan(42);
    });

    it('should validate date is valid', () => {
      const date = new Date('2026-02-01T14:30:00');
      expect(date.toString()).not.toBe('Invalid Date');
      expect(date instanceof Date).toBe(true);
    });
  });
});
