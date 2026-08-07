import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || ''}/api`,
});

// Sisipkan token JWT otomatis di setiap request admin
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kwau_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Jika token kedaluwarsa saat berada di dashboard, arahkan ke login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('login')) {
      localStorage.removeItem('kwau_token');
      localStorage.removeItem('kwau_admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default api;
