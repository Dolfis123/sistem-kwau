// Seluruh pemetaan endpoint backend dalam satu tempat.
import api from './axiosInstance';

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  gantiPassword: (data) => api.put('/auth/ganti-password', data),
};

export const paketApi = {
  list: (params) => api.get('/paket-wisata', { params }),
  detail: (id) => api.get(`/paket-wisata/${id}`),
  listAdmin: (params) => api.get('/paket-wisata/admin/semua', { params }),
  create: (fd) => api.post('/paket-wisata', fd),
  update: (id, fd) => api.put(`/paket-wisata/${id}`, fd),
  remove: (id) => api.delete(`/paket-wisata/${id}`),
  tambahFoto: (id, fd) => api.post(`/paket-wisata/${id}/foto`, fd),
  hapusFoto: (id, fotoId) => api.delete(`/paket-wisata/${id}/foto/${fotoId}`),
  aturKetersediaan: (id, data) => api.put(`/paket-wisata/${id}/ketersediaan`, data),
};

export const reservasiApi = {
  create: (data) => api.post('/reservasi', data),
  list: (params) => api.get('/reservasi', { params }),
  detail: (id) => api.get(`/reservasi/${id}`),
  updateStatus: (id, status) => api.put(`/reservasi/${id}/status`, { status }),
  kalender: (bulan) => api.get('/reservasi/kalender', { params: { bulan } }),
  exportExcel: (params) => api.get('/reservasi/export/excel', { params, responseType: 'blob' }),
};

export const galeriApi = {
  list: (params) => api.get('/galeri', { params }),
  create: (fd) => api.post('/galeri', fd),
  antrean: (params) => api.get('/galeri/admin/antrean', { params }),
  detail: (id) => api.get(`/galeri/admin/${id}`),
  approve: (id, catatan) => api.put(`/galeri/admin/${id}/approve`, { catatan }),
  reject: (id, catatan) => api.put(`/galeri/admin/${id}/reject`, { catatan }),
  remove: (id) => api.delete(`/galeri/admin/${id}`),
  riwayat: (params) => api.get('/galeri/admin/riwayat', { params }),
};

export const petaApi = {
  list: (params) => api.get('/peta', { params }),
  listAdmin: () => api.get('/peta/admin/semua'),
  create: (fd) => api.post('/peta', fd),
  update: (id, fd) => api.put(`/peta/${id}`, fd),
  remove: (id) => api.delete(`/peta/${id}`),
};

export const tokohApi = {
  listPublik: () => api.get('/tokoh/publik'),
  list: () => api.get('/tokoh'),
  create: (fd) => api.post('/tokoh', fd),
  update: (id, fd) => api.put(`/tokoh/${id}`, fd),
  toggleAktif: (id) => api.put(`/tokoh/${id}/toggle-aktif`),
  remove: (id) => api.delete(`/tokoh/${id}`),
};

export const galeriKampungApi = {
  list: () => api.get('/galeri-kampung'),
  create: (fd) => api.post('/galeri-kampung', fd),
  update: (id, fd) => api.put(`/galeri-kampung/${id}`, fd),
  remove: (id) => api.delete(`/galeri-kampung/${id}`),
};

export const homestayApi = {
  list: () => api.get('/homestay'),
  create: (fd) => api.post('/homestay', fd),
  update: (id, fd) => api.put(`/homestay/${id}`, fd),
  remove: (id) => api.delete(`/homestay/${id}`),
  hapusFoto: (id, fotoId) => api.delete(`/homestay/${id}/foto/${fotoId}`),
};

export const satwaApi = {
  list: () => api.get('/satwa'),
  create: (fd) => api.post('/satwa', fd),
  update: (id, fd) => api.put(`/satwa/${id}`, fd),
  remove: (id) => api.delete(`/satwa/${id}`),
};

export const beritaApi = {
  list: (params) => api.get('/berita', { params }),
  detail: (id) => api.get(`/berita/${id}`),
  create: (fd) => api.post('/berita', fd),
  update: (id, fd) => api.put(`/berita/${id}`, fd),
  remove: (id) => api.delete(`/berita/${id}`),
};

export const faqApi = {
  list: (params) => api.get('/faq', { params }),
  create: (data) => api.post('/faq', data),
  update: (id, data) => api.put(`/faq/${id}`, data),
  remove: (id) => api.delete(`/faq/${id}`),
};

export const kontenApi = {
  getBySlug: (slug) => api.get(`/konten/${slug}`),
  listAdmin: () => api.get('/konten/admin/semua'),
  upsert: (data) => api.put('/konten', data),
  getPengaturan: () => api.get('/konten/pengaturan'),
  setPengaturan: (data) => api.put('/konten/pengaturan', data),
};

export const kontakApi = {
  create: (data) => api.post('/kontak', data),
  list: (params) => api.get('/kontak', { params }),
  tandaiDibaca: (id) => api.put(`/kontak/${id}/dibaca`),
};

export const pertanianApi = {
  list: (params) => api.get('/pertanian', { params }),
  create: (fd) => api.post('/pertanian', fd),
  update: (id, fd) => api.put(`/pertanian/${id}`, fd),
  remove: (id) => api.delete(`/pertanian/${id}`),
};

export const dashboardApi = {
  ringkasan: () => api.get('/dashboard/ringkasan'),
};

export const adminApi = {
  list: () => api.get('/admin'),
  create: (data) => api.post('/admin', data),
  update: (id, data) => api.put(`/admin/${id}`, data),
  resetPassword: (id, password_baru) => api.put(`/admin/${id}/reset-password`, { password_baru }),
};
