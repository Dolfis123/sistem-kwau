import { useCallback, useEffect, useState } from 'react';

// Hook sederhana: jalankan fungsi API, kembalikan data + loading + refetch
export default function useFetch(fn, deps = []) {
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fn();
      setData(res.data.data);
      setMeta(res.data.meta || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data. Periksa koneksi Anda.');
    } finally { setLoading(false); }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { refetch(); }, [refetch]);
  return { data, meta, loading, error, refetch };
}
