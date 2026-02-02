/**
 * API Service Helper
 * Centralized API communication
 */

// Auto-detect API URL based on environment
const getApiBaseUrl = () => {
  // In production (Vercel), use relative URLs
  if (import.meta.env.PROD) {
    return '/api';
  }
  // In development, use local server
  return import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Get auth token from localStorage (uses 'token' key to match AuthContext)
const getToken = () => localStorage.getItem('token');

// Set auth token
export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove auth token
export const clearAuthToken = () => {
  localStorage.removeItem('token');
};

// Generic fetch wrapper
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: (username, password) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }),
  
  logout: () => apiCall('/auth/logout', { method: 'POST' }),
};

// User API
export const userAPI = {
  getProfile: () => apiCall('/user/profile'),
  
  updateProfile: (updates) => apiCall('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(updates),
  }),
  
  updateLearningStyle: (learningStyle) => apiCall('/user/learning-style', {
    method: 'PUT',
    body: JSON.stringify({ learningStyle }),
  }),
};

// Course API
export const courseAPI = {
  getAll: () => apiCall('/courses'),
  
  getCourse: (courseId) => apiCall(`/courses/${courseId}`),
};

// Progress API
export const progressAPI = {
  get: () => apiCall('/progress'),
  
  completeModule: (nodeId) => apiCall(`/progress/complete/${nodeId}`, {
    method: 'POST',
  }),
  
  updateTheta: (theta, answers) => apiCall('/progress/theta', {
    method: 'POST',
    body: JSON.stringify({ theta, answers }),
  }),
};

// Quest API
export const questAPI = {
  getAll: () => apiCall('/quests'),
  
  updateProgress: (questId, progress) => apiCall(`/quests/${questId}`, {
    method: 'PUT',
    body: JSON.stringify({ progress }),
  }),
};
// Coding Challenge API
export const challengeAPI = {
  // Complete a coding challenge and earn XP
  complete: (challengeId, topicId, points) => apiCall('/auth/complete-challenge', {
    method: 'POST',
    body: JSON.stringify({ challengeId, topicId, points }),
  }),
  
  // Get all challenge progress for the current user
  getProgress: () => apiCall('/auth/challenge-progress'),
  
  // Get challenge progress for a specific topic
  getTopicProgress: (topicId) => apiCall(`/auth/challenge-progress/${topicId}`),
};