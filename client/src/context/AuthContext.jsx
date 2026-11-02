import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

/**
 * Global authentication state (Context API).
 * Stores { token, _id, username, email } in state and localStorage so a page
 * refresh keeps the user logged in. The token is re-validated against
 * GET /api/users/me on start-up; an expired token just logs the user out.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [validating, setValidating] = useState(Boolean(readStoredUser()?.token));

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const login = useCallback((data) => {
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  }, []);

  // Validate a stored token once on mount
  useEffect(() => {
    if (!readStoredUser()?.token) return;

    api
      .get('/users/me')
      .then(({ data }) => {
        setUser((current) => (current ? { ...current, ...data.user } : current));
      })
      .catch((err) => {
        // Only a rejected/expired token should log the user out; network errors are ignored
        if (err.response?.status === 401) logout();
      })
      .finally(() => setValidating(false));
  }, [logout]);

  // The axios interceptor fires this event when any request comes back 401
  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
    };
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, validating }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
