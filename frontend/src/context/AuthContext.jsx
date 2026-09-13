import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('genai_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('genai_access_token') || null);
  const [loading, setLoading] = useState(true);

  // Persistent Auth Initialization on Startup/Refresh
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Attempt to fetch current owner profile
        const meRes = await authService.getMe();
        if (meRes.success) {
          setUser(meRes.data);
          localStorage.setItem('genai_user', JSON.stringify(meRes.data));
        }
      } catch (err) {
        // If getMe failed, attempt session refresh via HttpOnly cookie
        try {
          const refreshRes = await authService.refreshToken();
          if (refreshRes.success && refreshRes.accessToken) {
            setToken(refreshRes.accessToken);
            setUser(refreshRes.data);
            localStorage.setItem('genai_access_token', refreshRes.accessToken);
            localStorage.setItem('genai_user', JSON.stringify(refreshRes.data));
          } else {
            clearSession();
          }
        } catch (refreshErr) {
          clearSession();
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    if (response.success && response.accessToken) {
      setToken(response.accessToken);
      setUser(response.data);
      localStorage.setItem('genai_access_token', response.accessToken);
      localStorage.setItem('genai_user', JSON.stringify(response.data));
    }
    return response;
  };

  const updateProfile = async (profileData) => {
    const response = await authService.updateProfile(profileData);
    if (response.success && response.data) {
      setUser(response.data);
      localStorage.setItem('genai_user', JSON.stringify(response.data));
    }
    return response;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearSession();
    }
  };

  const clearSession = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('genai_access_token');
    localStorage.removeItem('genai_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        updateProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
