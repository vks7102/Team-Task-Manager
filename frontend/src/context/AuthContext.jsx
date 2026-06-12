import { createContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/index';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      const response = await authService.getProfile();
      setUser(response.data);
    } catch (err) {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    fetchProfile().finally(() => setInitialized(true));
  }, [fetchProfile]);

  const register = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(formData);
      setToken(response.data.token);
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(formData);
      setToken(response.data.token);
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, error, register, login, logout, initialized }}>
      {children}
    </AuthContext.Provider>
  );
};
