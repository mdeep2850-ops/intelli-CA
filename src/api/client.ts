import axios from 'axios';

// Ensure baseURL handles same-origin relative paths or remote full-stack URLs
// Normalizes inputs like:
// - '/api/v1' -> '/api/v1'
// - 'https://my-backend.onrender.com' -> 'https://my-backend.onrender.com/api/v1'
// - 'https://my-backend.onrender.com/api/v1/' -> 'https://my-backend.onrender.com/api/v1'
const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl || envUrl.includes('localhost:8000') || envUrl.includes('127.0.0.1:8000')) {
    return '/api/v1';
  }

  const trimmed = envUrl.trim().replace(/\/+$/, '');
  if (!trimmed.endsWith('/api/v1')) {
    return `${trimmed}/api/v1`;
  }
  return trimmed;
};

// Centralized axios instance configured with normalized base URL
export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
