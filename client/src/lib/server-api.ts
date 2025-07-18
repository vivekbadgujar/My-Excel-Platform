// Dynamic API configuration based on environment
// In production on Vercel, API routes are available at /api/*
// In development, we use the local server

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: Check if we're in production
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return `${window.location.origin}/api`;
    }
  }
  // Development or server-side
  return 'http://localhost:5000/api';
};

export const api = getApiBaseUrl();
