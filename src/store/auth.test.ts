import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useAuthStore } from './auth';
import { useIsAdmin } from '../hooks/useIsAdmin';

beforeEach(() => {
  useAuthStore.setState({ token: null, authenticatedUser: null });
  localStorage.clear();
});

describe('Auth Store', () => {
  it('should start with no user authenticated', () => {
    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().authenticatedUser).toBeNull();
    expect(useAuthStore.getState().isAuthenticated()).toBe(false);
  });

  it('should login and set token and user', () => {
    act(() => {
      useAuthStore.getState().setAuth('test-token', { id: 1, username: 'admin', role: 'admin' });
    });
    expect(useAuthStore.getState().token).toBe('test-token');
    expect(useAuthStore.getState().authenticatedUser).toEqual({ id: 1, username: 'admin', role: 'admin' });
    expect(useAuthStore.getState().isAuthenticated()).toBe(true);
  });

  it('should logout and clear token and user', () => {
    act(() => {
      useAuthStore.getState().setAuth('test-token', { id: 1, username: 'admin', role: 'admin' });
      useAuthStore.getState().logout();
    });
    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().authenticatedUser).toBeNull();
    expect(useAuthStore.getState().isAuthenticated()).toBe(false);
  });

  it('should persist auth state to localStorage', () => {
    act(() => {
      useAuthStore.getState().setAuth('persist-token', { id: 2, username: 'user', role: 'user' });
    });
    const persisted = JSON.parse(localStorage.getItem('auth-storage')!);
    expect(persisted.state.token).toBe('persist-token');
    expect(persisted.state.authenticatedUser).toEqual({ id: 2, username: 'user', role: 'user' });
  });
});

describe('useIsAdmin hook', () => {
  it('should return true if authenticated user is admin', () => {
    act(() => {
      useAuthStore.getState().setAuth('admin-token', { id: 1, username: 'admin', role: 'admin' });
    });
    const { result } = renderHook(() => useIsAdmin());
    expect(result.current).toBe(true);
  });

  it('should return false if authenticated user is not admin', () => {
    act(() => {
      useAuthStore.getState().setAuth('user-token', { id: 2, username: 'user', role: 'user' });
    });
    const { result } = renderHook(() => useIsAdmin());
    expect(result.current).toBe(false);
  });

  it('should return false if no user is authenticated', () => {
    act(() => {
      useAuthStore.getState().logout();
    });
    const { result } = renderHook(() => useIsAdmin());
    expect(result.current).toBe(false);
  });
}); 