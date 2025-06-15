
// Token management utilities for JWT authentication
const TOKEN_KEY = 'debatelab_jwt_token';

export const tokenManager = {
  // Store token in sessionStorage
  setToken: (token: string): void => {
    sessionStorage.setItem(TOKEN_KEY, token);
  },

  // Get token from sessionStorage
  getToken: (): string | null => {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  // Remove token from sessionStorage
  removeToken: (): void => {
    sessionStorage.removeItem(TOKEN_KEY);
  },

  // Check if token exists
  hasToken: (): boolean => {
    return !!sessionStorage.getItem(TOKEN_KEY);
  },

  // Get Authorization header with Bearer token
  getAuthHeader: (): Record<string, string> => {
    const token = tokenManager.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};
