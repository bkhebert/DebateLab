
import React, { createContext, useContext, useEffect, useState } from 'react';
import baseURL from '../constants/constant';
import { tokenManager } from '../utils/tokenManager';

interface User {
  id: string;
  email: string;
  [key: string]: unknown;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (email: string, password: string, username: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

const NETWORK_ERROR_MESSAGE = 'Unable to reach the server. Check your connection and try again.';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on app start
  useEffect(() => {
    const checkAuth = async () => {
    const token = tokenManager.getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${baseURL}/jwt/auth/verify`, {
        headers: tokenManager.getAuthHeader() // Add this!
      });
      
      const data = await response.json();
      if (data?.user) {
        setUser(data.user);
      } else {
        tokenManager.removeToken();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      tokenManager.removeToken();
    } finally {
      setIsLoading(false);
    }
  };

  checkAuth();
}, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const response = await fetch(`${baseURL}/jwt/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {

        const data = await response.json();
        tokenManager.setToken(data.accessToken);
        setUser(data.user);
        return { success: true };
      } else {
        const error = await response.json().catch(() => ({}));
        console.error(error);
        return { success: false, error: error?.error || 'Invalid email or password.' };
      }
    } catch (error) {
      console.error(error);
      return { success: false, error: NETWORK_ERROR_MESSAGE };
    }
  };

  const signup = async (email: string, password: string, username: string): Promise<AuthResult> => {
    try {
      const response = await fetch(`${baseURL}/jwt/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });

      if (response.ok) {

        const data = await response.json();
        tokenManager.setToken(data.accessToken);
        setUser(data.user);

        return { success: true };
      } else {
        const error = await response.json().catch(() => ({}));
        console.error('Signup failed:', error);
        return { success: false, error: error?.error || 'Failed to create account.' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: NETWORK_ERROR_MESSAGE };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const token = tokenManager.getToken();
      if (token) {
        await fetch(`${baseURL}/jwt/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...tokenManager.getAuthHeader()
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenManager.removeToken();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
