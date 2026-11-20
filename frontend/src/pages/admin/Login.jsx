import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn, ShieldCheck } from 'lucide-react';
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
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-hutan-950 px-4 py-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_10%,rgba(201,134,44,.2),transparent_55%),radial-gradient(ellipse_at_10%_100%,rgba(61,125,92,.35),transparent_60%)]" />
      <GarisKontur className="absolute inset-x-0 bottom-0 -z-10 h-64 w-full text-emas/50" />

      <div className="w-full max-w-sm animate-muncul">
        <div className="mb-8 text-center text-kabut">
          <span className="mx-auto inline-block"><Logo ukuran="h-16 w-16" teksUkuran="text-2xl" /></span>
          <h1 className="mt-5 font-display text-3xl font-medium">Portal Pengelola Kwau</h1>
          <p className="mt-2 text-sm text-kabut/60">Masuk untuk mengelola reservasi dan konten kampung</p>
        </div>

        <form onSubmit={masuk} className="space-y-4 rounded-3xl bg-white p-7 shadow-2xl">
          {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700" role="alert">{error}</p>}
          <div>
            <label className="label" htmlFor="username">Username</label>
            <input id="username" required autoFocus autoComplete="username" className="input" value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <InputPassword id="password" minLength={1} value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" disabled={proses} className="btn-emas w-full !py-3.5">
            <LogIn size={16} aria-hidden="true" /> {proses ? 'Memeriksa...' : 'Masuk'}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-tinta/45">
            <ShieldCheck size={13} aria-hidden="true" /> Khusus pengelola Pokdarwis & pegawai kampung
          </p>
        </form>
        <a href="/" className="mt-6 flex items-center justify-center gap-1.5 text-xs font-semibold text-kabut/50 transition hover:text-kabut">
          <ArrowLeft size={14} aria-hidden="true" /> Kembali ke situs publik
        </a>
      </div>
    </div>
  );
}
