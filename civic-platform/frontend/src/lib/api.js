import axios from 'axios';
import { io } from 'socket.io-client';

const BASE_URL = '/api';

// Axios instance
export const api = axios.create({ baseURL: BASE_URL });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally (token expired)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Socket connection
let socket;
export const getSocket = () => {
  if (!socket) {
    socket = io('http://localhost:5000', { autoConnect: false });
  }
  return socket;
};

export const connectSocket = (userId) => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
    s.emit('join_user', userId);
  }
  return s;
};

// ─── API helpers ─────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const reportsAPI = {
  create: (data) => api.post('/reports', data),
  getAll: (params) => api.get('/reports', { params }),
  getById: (id) => api.get(`/reports/${id}`),
  updateStatus: (id, data) => api.put(`/reports/${id}/status`, data),
  upvote: (id) => api.post(`/reports/${id}/upvote`),
  getMessages: (id) => api.get(`/reports/${id}/messages`),
  sendMessage: (id, content) => api.post(`/reports/${id}/messages`, { content }),
};

export const analyticsAPI = {
  overview: () => api.get('/analytics/overview'),
  byCategory: () => api.get('/analytics/by-category'),
  byStatus: () => api.get('/analytics/by-status'),
  trend: () => api.get('/analytics/trend'),
  hotspots: () => api.get('/analytics/hotspots'),
  leaderboard: () => api.get('/analytics/leaderboard'),
  deptPerformance: () => api.get('/analytics/dept-performance'),
};
