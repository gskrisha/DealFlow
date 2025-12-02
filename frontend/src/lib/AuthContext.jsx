/**
 * DealFlow Auth Context
 * Provides authentication state and methods throughout the app
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      if (authAPI.isAuthenticated()) {
        const userData = await authAPI.getMe();
        setUser(userData);
        setIsAuthenticated(true);
        
        // Store user data for compatibility with existing code
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userData', JSON.stringify({
          name: userData.full_name,
          email: userData.email,
          fundName: userData.company,
        }));
        
        if (userData.onboarding_complete) {
          localStorage.setItem('onboardingComplete', 'true');
          if (userData.thesis) {
            localStorage.setItem('fundThesis', JSON.stringify(userData.thesis));
          }
        }
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      await authAPI.login(email, password);
      const userData = await authAPI.getMe();
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store for compatibility
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userData', JSON.stringify({
        name: userData.full_name,
        email: userData.email,
        fundName: userData.company,
      }));
      
      // Only set onboardingComplete if user actually completed it
      if (userData.onboarding_complete && userData.thesis) {
        localStorage.setItem('onboardingComplete', 'true');
        localStorage.setItem('fundThesis', JSON.stringify(userData.thesis));
      } else {
        // Clear for users who haven't completed onboarding
        localStorage.removeItem('onboardingComplete');
        localStorage.removeItem('fundThesis');
      }
      
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const register = useCallback(async (userData) => {
    setError(null);
    try {
      await authAPI.register(userData);
      // Clear onboarding status for new users
      localStorage.removeItem('onboardingComplete');
      localStorage.removeItem('fundThesis');
      // After registration, login automatically
      return await login(userData.email, userData.password);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [login]);

  const logout = useCallback(() => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const updateThesis = useCallback(async (thesisData) => {
    try {
      const updatedUser = await authAPI.updateThesis(thesisData);
      setUser(updatedUser);
      localStorage.setItem('onboardingComplete', 'true');
      localStorage.setItem('fundThesis', JSON.stringify(thesisData));
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateThesis,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext;
