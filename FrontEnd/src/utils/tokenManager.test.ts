import { tokenManager } from './tokenManager';

describe('tokenManager', () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it('has no token by default', () => {
    expect(tokenManager.getToken()).toBeNull();
    expect(tokenManager.hasToken()).toBe(false);
    expect(tokenManager.getAuthHeader()).toEqual({});
  });

  it('stores and retrieves a token', () => {
    tokenManager.setToken('abc123');

    expect(tokenManager.getToken()).toBe('abc123');
    expect(tokenManager.hasToken()).toBe(true);
    expect(tokenManager.getAuthHeader()).toEqual({ Authorization: 'Bearer abc123' });
  });

  it('removes a token', () => {
    tokenManager.setToken('abc123');
    tokenManager.removeToken();

    expect(tokenManager.getToken()).toBeNull();
    expect(tokenManager.hasToken()).toBe(false);
  });
});
