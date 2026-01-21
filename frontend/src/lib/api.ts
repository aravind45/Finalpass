// API Configuration
// This file centralizes API URL configuration for all environments

const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Get the full API URL for a given endpoint
 * @param endpoint - The API endpoint (e.g., '/api/auth/login')
 * @returns Full URL for the API call
 */
export const getApiUrl = (endpoint: string): string => {
  // If endpoint already starts with http, return as-is (for external APIs)
  if (endpoint.startsWith('http')) {
    return endpoint;
  }

  // In development, use proxy (empty API_URL means use relative paths)
  // In production, use the full backend URL
  return `${API_URL}${endpoint}`;
};

/**
 * Make an authenticated API request
 * @param endpoint - The API endpoint
 * @param options - Fetch options
 * @returns Fetch response
 */
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(getApiUrl(endpoint), {
    ...options,
    headers,
  });
};

/**
 * Make an authenticated API request with FormData (for file uploads)
 * @param endpoint - The API endpoint
 * @param formData - FormData object
 * @param options - Additional fetch options
 * @returns Fetch response
 */
export const apiUpload = async (endpoint: string, formData: FormData, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(getApiUrl(endpoint), {
    method: 'POST',
    ...options,
    headers,
    body: formData,
  });
};

export default {
  getApiUrl,
  apiRequest,
  apiUpload,
};
