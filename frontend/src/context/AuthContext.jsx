import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { authService } from '../services/auth.service';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('rac_token'));

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchMe();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchMe = async () => {
    try {
      const { data } = await authService.getMe();
      setUser(data.data.user);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email, password, role) => {
    const { data } = await authService.login({ email, password, role });
    const { user, token } = data.data;
    localStorage.setItem('rac_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setToken(token);
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('rac_token');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, token, login, logout, updateUser, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};
