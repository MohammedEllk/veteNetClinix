import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isAuthenticated } from './authService';

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('isAuthenticated', () => {
    it('should return true when accessToken exists in localStorage', () => {
      localStorage.setItem('accessToken', 'fake-token-123');
      expect(isAuthenticated()).toBe(true);
    });

    it('should return false when accessToken does not exist in localStorage', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('should return false when accessToken is null', () => {
      localStorage.setItem('accessToken', null);
      expect(isAuthenticated()).toBe(false);
    });
  });
});
