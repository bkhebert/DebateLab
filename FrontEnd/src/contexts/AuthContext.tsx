
import React, { createContext, useContext, useEffect, useState } from 'react';
import baseURL from '../constants/constant';
import { tokenManager } from '../utils/tokenManager';

interface User {
  id: string;
  email: string;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${baseURL}/jwt/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        console.log('response is ok for login');
        const data = await response.json();
        tokenManager.setToken(data.accessToken);
        setUser(data.user);
        console.log(data.user)
        return true;
      } else {
        const error = await response.json();
        console.error('Login failed:', error);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${baseURL}/jwt/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        console.log('response is ok for signup user')
        const data = await response.json();
        tokenManager.setToken(data.accessToken);
        setUser(data.user);
        console.log(data.user);
        return true;
      } else {
        const error = await response.json();
        console.error('Signup failed:', error);
        return false;
      }
    } catch (error) {
      console.error('Signup error:', error);
      return false;
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
