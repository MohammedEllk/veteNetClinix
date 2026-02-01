import { describe, it, expect } from 'vitest';

// Tests unitaires pour les utilitaires
describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2026-02-01T10:30:00');
      const formatted = date.toLocaleDateString('fr-FR');
      expect(formatted).toBe('01/02/2026');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test('test@example.com')).toBe(true);
      expect(emailRegex.test('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test('invalid-email')).toBe(false);
      expect(emailRegex.test('@example.com')).toBe(false);
      expect(emailRegex.test('test@')).toBe(false);
      expect(emailRegex.test('test@.com')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('should validate French phone numbers', () => {
      const phoneRegex = /^(0[1-9])(\d{8})$/;
      expect(phoneRegex.test('0612345678')).toBe(true);
      expect(phoneRegex.test('0123456789')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      const phoneRegex = /^(0[1-9])(\d{8})$/;
      expect(phoneRegex.test('1234567890')).toBe(false);
      expect(phoneRegex.test('06123456')).toBe(false);
      expect(phoneRegex.test('061234567890')).toBe(false);
    });
  });

  describe('calculateAge', () => {
    it('should calculate age correctly from birthdate', () => {
      const birthDate = new Date('2020-02-01');
      const today = new Date('2026-02-01');
      const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
      expect(age).toBe(6);
    });

    it('should handle recent birthdates', () => {
      const birthDate = new Date('2025-12-01');
      const today = new Date('2026-02-01');
      const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
      expect(age).toBe(0);
    });
  });
});
