import axios from 'axios';
import { bahasaSaatIni } from '../i18n/LanguageContext';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || ''}/api`,
});

// Sisipkan token JWT otomatis di setiap request admin,
// dan bahasa pengunjung (X-Lang) agar pesan dari server sesuai bahasa yang dipilih
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kwau_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers['X-Lang'] = bahasaSaatIni();
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
