import axios from 'axios';

// Determine the API base URL based on environment
const getApiBaseUrl = () => {
  // Check if we're in browser environment
  if (typeof window !== 'undefined') {
    // In production (deployed), use the same domain
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return `${window.location.origin}/api`;
    }
    // In development, use localhost:5000
    return 'http://localhost:5000/api';
  }
  
  // Server-side fallback
  return 'http://localhost:5000/api';
};

// Create axios instance with proper configuration
const baseURL = getApiBaseUrl();
console.log('API Base URL:', baseURL); // Debug log

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on unauthorized
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
