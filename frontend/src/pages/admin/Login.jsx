import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GarisKontur from '../../components/common/GarisKontur';
import Logo from '../../components/common/Logo';
import InputPassword from '../../components/common/InputPassword';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [proses, setProses] = useState(false);

  const masuk = async (e) => {
    e.preventDefault();
    setError(''); setProses(true);
    try {
      await login(form.username, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa koneksi Anda.');
    } finally { setProses(false); }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-hutan-950 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(201,134,44,.14),transparent_55%)]" />
      <GarisKontur className="absolute inset-x-0 bottom-0 h-56 w-full text-emas" />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center text-kabut">
          <span className="mx-auto inline-block"><Logo ukuran="h-14 w-14" teksUkuran="text-2xl" /></span>
          <h1 className="mt-4 font-display text-2xl font-semibold">Portal Pengelola Kwau</h1>
          <p className="mt-1 text-sm text-kabut/60">Masuk untuk mengelola reservasi & konten</p>
        </div>

        <form onSubmit={masuk} className="rounded-3xl bg-white p-7 shadow-2xl">
          {error && <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
          <label className="label" htmlFor="username">Username</label>
          <input id="username" required autoFocus className="input" value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <label className="label mt-4" htmlFor="password">Password</label>
          <InputPassword id="password" minLength={1} value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="submit" disabled={proses} className="btn-emas mt-6 w-full">
            {proses ? 'Memeriksa...' : 'Masuk'}
          </button>
        </form>
        <a href="/" className="mt-6 block text-center text-xs font-semibold text-kabut/50 hover:text-kabut">← Kembali ke situs publik</a>
      </div>
    </div>
  );
}
