import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT, APP_CONFIG } from '../constants';
import { storage } from '../utils/storage';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = storage.get(APP_CONFIG.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        storage.remove(APP_CONFIG.TOKEN_KEY);
        storage.remove(APP_CONFIG.USER_KEY);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Helper function to simulate API delay
export const simulateApiDelay = (data, delay = APP_CONFIG.MOCK_API_DELAY) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Helper function to simulate API error
export const simulateApiError = (message, delay = APP_CONFIG.MOCK_API_DELAY) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay);
  });
};
