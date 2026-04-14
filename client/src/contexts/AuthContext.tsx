import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import { AuthContextType, User, Profile } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('careerai_token'));
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      setProfile(data.profile);
    } catch {
      setUser(null);
      setProfile(null);
      setToken(null);
      localStorage.removeItem('careerai_token');
    }
  }, []);

  useEffect(() => {
    if (token) {
      refreshUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token, refreshUser]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('careerai_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const signup = async (email: string, password: string, role: string, full_name: string) => {
  const { data } = await api.post('/auth/signup', {
    email,
    password,
    role, // frontend sends jobseeker
    full_name
  });

  localStorage.setItem('careerai_token', data.token);
  setToken(data.token);
  setUser(data.user);
};

  const googleAuth = async (credential: string, role?: string) => {
    const { data } = await api.post('/auth/google', { credential, role });
    if (data.needsRole) return { needsRole: true };
    localStorage.setItem('careerai_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return {};
  };

  const logout = () => {
    localStorage.removeItem('careerai_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, token, loading, login, signup, googleAuth, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
