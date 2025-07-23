import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useUsersStore } from './users';
import type { User } from './users';

const user1: User = { id: 1, username: 'moomoo', role: 'admin' };
const user2: User = { id: 2, username: 'berlin', role: 'user' };
const user3: User = { id: 3, username: 'charlie', role: 'user', deleted: true };

beforeEach(() => {
  useUsersStore.setState({ users: [] });
});

describe('Users Store', () => {
  it('should start with an empty users array', () => {
    expect(useUsersStore.getState().users).toEqual([]);
  });

  it('should add users with setUsers', () => {
    act(() => {
      useUsersStore.getState().setUsers([user1, user2]);
    });
    expect(useUsersStore.getState().users).toEqual([user1, user2]);
  });

  it('should update a user', () => {
    act(() => {
      useUsersStore.getState().setUsers([user1, user2]);
      useUsersStore.getState().setUsers([
        { ...user1, username: 'momo-updated' },
        user2,
      ]);
    });
    expect(useUsersStore.getState().users[0].username).toBe('momo-updated');
  });

  it('should delete a user by filtering out', () => {
    act(() => {
      useUsersStore.getState().setUsers([user1, user2]);
      useUsersStore.getState().setUsers([user2]);
    });
    expect(useUsersStore.getState().users).toEqual([user2]);
  });

  it('should filter out deleted users in activeUsers', () => {
    act(() => {
      useUsersStore.getState().setUsers([user1, user2, user3]);
    });
    expect(useUsersStore.getState().activeUsers()).toEqual([user1, user2]);
  });

  it('should allow marking a user as deleted', () => {
    act(() => {
      useUsersStore.getState().setUsers([user1, user2]);
      useUsersStore.getState().setUsers([
        user1,
        { ...user2, deleted: true },
      ]);
    });
    expect(useUsersStore.getState().activeUsers()).toEqual([user1]);
    expect(useUsersStore.getState().users[1].deleted).toBe(true);
  });
}); 