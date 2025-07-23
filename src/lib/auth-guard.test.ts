import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Mock } from 'vitest';
import { requireAuth, requireAdmin, isAuthenticated } from './auth-guard';
import { useAuthStore } from '../store/auth';

vi.mock('../store/auth', () => ({
  useAuthStore: {
    getState: vi.fn(),
  },
}));

const mockGetState = useAuthStore.getState as Mock;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('requireAuth', () => {
  it('should not throw if authenticated', () => {
    mockGetState.mockReturnValue({ isAuthenticated: () => true });
    expect(() => requireAuth({ href: '/protected' })).not.toThrow();
  });
  it('should throw redirect if not authenticated', () => {
    mockGetState.mockReturnValue({ isAuthenticated: () => false });
    try {
      requireAuth({ href: '/protected' });
      throw new Error('Did not throw');
    } catch (e: any) {
      expect(e).toBeInstanceOf(Response);
      expect(e.options.to).toBe('/login');
      expect(e.options.search.redirect).toBe('/protected');
    }
  });
});

describe('isAuthenticated', () => {
  it('should return true if authenticated', () => {
    mockGetState.mockReturnValue({ isAuthenticated: () => true });
    expect(isAuthenticated()).toBe(true);
  });
  it('should return false if not authenticated', () => {
    mockGetState.mockReturnValue({ isAuthenticated: () => false });
    expect(isAuthenticated()).toBe(false);
  });
});

describe('requireAdmin', () => {
  it('should not throw if user is admin', () => {
    mockGetState.mockReturnValue({ authenticatedUser: { id: 1, username: 'admin', role: 'admin' } });
    expect(() => requireAdmin()).not.toThrow();
  });
  it('should throw redirect if user is not admin', () => {
    mockGetState.mockReturnValue({ authenticatedUser: { id: 2, username: 'user', role: 'user' } });
    try {
      requireAdmin();
      throw new Error('Did not throw');
    } catch (e: any) {
      expect(e).toBeInstanceOf(Response);
      expect(e.options.to).toBe('/');
    }
  });
  it('should throw redirect if no user', () => {
    mockGetState.mockReturnValue({ authenticatedUser: null });
    try {
      requireAdmin();
      throw new Error('Did not throw');
    } catch (e: any) {
      expect(e).toBeInstanceOf(Response);
      expect(e.options.to).toBe('/');
    }
  });
}); 