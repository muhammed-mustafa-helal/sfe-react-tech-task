import { describe, it, expect } from 'vitest';
import { loginSchema, userCreateSchema, userUpdateSchema } from './validation';

describe('loginSchema', () => {
  it('should pass with valid username and password', () => {
    expect(() => loginSchema.parse({ username: 'user', password: 'pass' })).not.toThrow();
  });
  it('should fail if username is empty', () => {
    expect(() => loginSchema.parse({ username: '', password: 'pass' })).toThrow('Username is required');
  });
  it('should fail if password is empty', () => {
    expect(() => loginSchema.parse({ username: 'user', password: '' })).toThrow('Password is required');
  });
});

describe('userCreateSchema', () => {
  it('should pass with valid data', () => {
    expect(() => userCreateSchema.parse({ username: 'momoo', password: 'password123', role: 'admin' })).not.toThrow();
  });
  it('should fail if username is too short', () => {
    expect(() => userCreateSchema.parse({ username: 'abc', password: 'password123', role: 'admin' })).toThrow('Username must be 5 characters or more');
  });
  it('should fail if username has special characters', () => {
    expect(() => userCreateSchema.parse({ username: 'momo@', password: 'password123', role: 'admin' })).toThrow("Username can't contain special characters");
  });
  it('should fail if username starts with a number', () => {
    expect(() => userCreateSchema.parse({ username: '1momo', password: 'password123', role: 'admin' })).toThrow('Username cannot start with a number');
  });
  it('should fail if username contains "test"', () => {
    expect(() => userCreateSchema.parse({ username: 'testuser', password: 'password123', role: 'admin' })).toThrow('Username must be a real name');
  });
  it('should fail if role is empty', () => {
    expect(() => userCreateSchema.parse({ username: 'momoo', password: 'password123', role: '' })).toThrow('Role is required');
  });
  it('should fail if password is too short', () => {
    expect(() => userCreateSchema.parse({ username: 'momoo', password: 'short', role: 'admin' })).toThrow('Password must be at least 8 characters long');
  });
});

describe('userUpdateSchema', () => {
  it('should pass with valid data and blank password', () => {
    expect(() => userUpdateSchema.parse({ username: 'momoo', password: '', role: 'admin' })).not.toThrow();
  });
  it('should pass with valid data and valid password', () => {
    expect(() => userUpdateSchema.parse({ username: 'momoo', password: 'password123', role: 'admin' })).not.toThrow();
  });
  it('should fail if password is too short and not blank', () => {
    expect(() => userUpdateSchema.parse({ username: 'momoo', password: 'short', role: 'admin' })).toThrow('Password must be at least 8 characters long');
  });
  it('should fail if username is invalid', () => {
    expect(() => userUpdateSchema.parse({ username: '1bad', password: '', role: 'admin' })).toThrow('Username cannot start with a number');
  });
}); 