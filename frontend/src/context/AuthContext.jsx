import React, { createContext, useState, useEffect, useContext } from 'react';
import accessService from '../services/accessService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check access session status on app load
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await accessService.getStatus();
        if (res.success && res.authenticated) {
          setIsAuthenticated(true);
          try {
            const profileRes = await accessService.getProfile();
            if (profileRes.success) setUser(profileRes.data);
          } catch (e) {
            // Profile fetch optional
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
        localStorage.removeItem('genai_session_token');
      } finally {
        setLoading(false);
      }
    };

    checkAccess();

    const handleSessionExpired = () => {
      setIsAuthenticated(false);
      setUser(null);
    };

    window.addEventListener('genai_session_expired', handleSessionExpired);
    return () => window.removeEventListener('genai_session_expired', handleSessionExpired);
  }, []);

  const verifyAccess = async (code) => {
    const response = await accessService.verifyAccess(code);
    if (response.success) {
      if (response.token) {
        localStorage.setItem('genai_session_token', response.token);
      }
      setIsAuthenticated(true);
      try {
        const profileRes = await accessService.getProfile();
        if (profileRes.success) setUser(profileRes.data);
      } catch (e) {}
    }
    return response;
  };

  const logout = async () => {
    try {
      await accessService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('genai_session_token');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        verifyAccess,
        login: (credentials) => verifyAccess(credentials.code || credentials.password),
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
