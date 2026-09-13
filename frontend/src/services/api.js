import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Transmit HttpOnly session cookie across origins
});

// Interceptor to add Session Authorization Bearer token to request if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('genai_session_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for handling access expiration cleanly without refresh loops
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const requestUrl = error.config?.url || '';
      const isAccessEndpoint = requestUrl.includes('/access/verify') || requestUrl.includes('/access/status');
      
      if (!isAccessEndpoint) {
        localStorage.removeItem('genai_session_token');
        if (window.dispatchEvent) {
          window.dispatchEvent(new Event('genai_session_expired'));
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
