// Ambil konten statis per slug (sekilas-kwau, aturan-berkunjung, dst.).
// Mengembalikan null bila belum ada — halaman memakai teks bawaan dari kamus.
import useFetch from './useFetch';
import { kontenApi } from '../services/api';

export default function useKonten(slug) {
  const { data } = useFetch(
    () => kontenApi.getBySlug(slug).catch(() => ({ data: { data: null } })),
    [slug]
  );
  return data;
}

// Pecah isi konten menjadi daftar baris (satu poin per baris)
export const baris = (teks = '', pemisah = '\n') =>
  String(teks || '').split(pemisah).map((s) => s.trim()).filter(Boolean);
