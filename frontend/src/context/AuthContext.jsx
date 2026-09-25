import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    async function initAuth() {
      const storedToken = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('auth_user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setTokens({
            access: storedToken,
            refresh: localStorage.getItem('refresh_token'),
          });

          // Verify token validity with backend
          const res = await api.get('/auth/me');
          if (res?.user) {
            setUser(res.user);
            localStorage.setItem('auth_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err);
          logout();
        }
      }
      setLoading(false);
    }

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    if (data.tokens && data.user) {
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      setTokens(data.tokens);
      setUser(data.user);
      return data.user;
    }
    throw new Error('Invalid response from server');
  };

  const register = async (name, email, password) => {
    const data = await api.post('/auth/register', { name, email, password });
    if (data.tokens && data.user) {
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      setTokens(data.tokens);
      setUser(data.user);
      return data.user;
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
    setUser(null);
    setTokens(null);
  };

  const value = {
    user,
    tokens,
    loading,
    isAuthenticated: !!user,
    isCustomer: user?.role === 'customer',
    isAgent: user?.role === 'agent',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
