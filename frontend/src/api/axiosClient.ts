import axios from 'axios';

let isInterceptorSet = false;

export const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || 'https://pghostelmanagement.onrender.com/api').replace(/\/+$/, '');

const uploadBaseUrl = (process.env.REACT_APP_UPLOAD_BASE_URL || '').trim();
export const BACKEND_BASE_URL = uploadBaseUrl
  ? uploadBaseUrl.replace(/\/+$/, '').replace(/\/uploads$/, '')
  : API_BASE_URL.replace(/\/api$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const setupAuthInterceptors = (logout: () => void) => {
  if (isInterceptorSet) return;

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      const url: string = error?.config?.url || '';
      const isAuthEndpoint = url.includes('/auth/');
      const currentPath = window.location.pathname;

      if (status === 401 && !isAuthEndpoint) {
        try {
          logout();
        } catch {}
        if (currentPath !== '/login') {
          window.location.href = '/login';
        }
      }

      if (status === 403) {
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );

  isInterceptorSet = true;
};

export default api;
