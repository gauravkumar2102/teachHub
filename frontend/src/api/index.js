import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ────────────────────────────────────────────────
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser    = (data) => api.post('/auth/login', data);
export const getMe        = ()     => api.get('/auth/me');

// ── Teachers ─────────────────────────────────────────────
export const getTeachers    = ()       => api.get('/teachers');
export const getTeacher     = (id)     => api.get(`/teachers/${id}`);
export const createTeacher  = (data)   => api.post('/teachers', data);
export const updateTeacher  = (id, data) => api.put(`/teachers/${id}`, data);
export const deleteTeacher  = (id)     => api.delete(`/teachers/${id}`);

export default api;
