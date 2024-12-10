import { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  foodPreferences?: string[];
  dietaryRestrictions?: string[];
  healthHistory?: any[];
  savedRecipes?: string[];
  savedWorkouts?: string[];
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  setAuthData: (token: string, userData: User) => void;
  clearAuth: () => void;
  isAuthenticated: boolean;
  updateUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const updateUserData = async () => {
    if (token) {
      try {
        const response = await getProfile(token);
        if (response.success && response.data) {
          const updatedUser = response.data;
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    }
  };

  const setAuthData = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      token,
      user,
      setAuthData,
      clearAuth,
      isAuthenticated: !!token,
      updateUserData,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}