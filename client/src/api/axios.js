import axios from 'axios';

/**
 * One axios instance for the whole app.
 * - baseURL comes from VITE_API_URL so the deployed build talks to the deployed API
 * - every request automatically carries the JWT from localStorage
 * - a 401 clears the session so the UI can send the user back to /login
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

const storedUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

api.interceptors.request.use((config) => {
  const user = storedUser();
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const isLoginAttempt = url.includes('/users/login');
    if (error.response?.status === 401 && !isLoginAttempt) {
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(error);
  }
);

export default api;
