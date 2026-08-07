import { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { kontenApi, authApi } from '../../services/api';
import { useToast } from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import InputPassword from '../../components/common/InputPassword';

export default function Pengaturan() {
  const toast = useToast();
  const { admin } = useAuth();
  const { data, loading } = useFetch(() => kontenApi.getPengaturan(), []);
  const [form, setForm] = useState({ wa_utama: '', wa_pertanian: '', email_kontak: '', jam_operasional: '', sosmed_facebook: '', sosmed_instagram: '', sosmed_tiktok: '', sosmed_youtube: '' });
  const [pw, setPw] = useState({ password_lama: '', password_baru: '', konfirmasi: '' });
  const [proses, setProses] = useState(false);

  useEffect(() => { if (data) setForm((f) => ({ ...f, ...data })); }, [data]);

  const simpanPengaturan = async (e) => {
    e.preventDefault();
    setProses(true);
    try {
      await kontenApi.setPengaturan(form);
      toast('Pengaturan sistem disimpan.');
    } catch (err) { toast(err.response?.data?.message || 'Gagal menyimpan (hanya Superadmin).', 'error'); }
    finally { setProses(false); }
  };

  const gantiPassword = async (e) => {
    e.preventDefault();
    if (pw.password_baru !== pw.konfirmasi) return toast('Konfirmasi password tidak sama.', 'error');
    setProses(true);
    try {
      await authApi.gantiPassword({ password_lama: pw.password_lama, password_baru: pw.password_baru });
      toast('Password Anda berhasil diganti.');
      setPw({ password_lama: '', password_baru: '', konfirmasi: '' });
    } catch (err) {
      const errors = err.response?.data?.errors;
      toast(errors?.[0]?.pesan || err.response?.data?.message || 'Gagal mengganti password.', 'error');
    } finally { setProses(false); }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-hutan-950">Pengaturan</h1>

      {admin?.role === 'superadmin' && (
        <form onSubmit={simpanPengaturan} className="kartu mt-6 space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold text-hutan-950">Info Kontak Resmi Sistem</h2>
          <div>
            <label className="label" htmlFor="p-wa">Nomor WhatsApp Utama Pokdarwis</label>
            <input id="p-wa" className="input" placeholder="6282100000000" value={form.wa_utama}
              onChange={(e) => setForm({ ...form, wa_utama: e.target.value })} />
            <p className="mt-1 text-[11px] text-tinta/45">Format 62xxx tanpa tanda +. Dipakai di footer, halaman kontak, dan tautan reservasi.</p>
          </div>
          <div>
            <label className="label" htmlFor="p-wa-tani">Nomor WhatsApp Bagian Pertanian</label>
            <input id="p-wa-tani" className="input" placeholder="6281200000004" value={form.wa_pertanian}
              onChange={(e) => setForm({ ...form, wa_pertanian: e.target.value })} />
            <p className="mt-1 text-[11px] text-tinta/45">Dipakai pada tombol pemesanan di halaman Hasil Pertanian. Kosongkan untuk memakai WA utama.</p>
          </div>
          <div>
            <label className="label" htmlFor="p-email">Email Kontak</label>
            <input id="p-email" type="email" className="input" value={form.email_kontak}
              onChange={(e) => setForm({ ...form, email_kontak: e.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="p-jam">Jam Operasional Layanan Reservasi</label>
            <input id="p-jam" className="input" value={form.jam_operasional}
              onChange={(e) => setForm({ ...form, jam_operasional: e.target.value })} />
          </div>
          <div className="border-t border-hutan-900/10 pt-4">
            <p className="label !mb-3">Media Sosial Resmi (tampil di navbar dan footer — kosongkan jika belum ada)</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[['sosmed_facebook', 'Facebook'], ['sosmed_instagram', 'Instagram'], ['sosmed_tiktok', 'TikTok'], ['sosmed_youtube', 'YouTube']].map(([key, label]) => (
                <div key={key}>
                  <label className="label" htmlFor={`p-${key}`}>{label}</label>
                  <input id={`p-${key}`} className="input" placeholder={`https://...`} value={form[key] || ''}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
            </div>
          </div>
          <button disabled={proses} className="btn-emas">Simpan Pengaturan</button>
        </form>
      )}

      <form onSubmit={gantiPassword} className="kartu mt-6 space-y-4 p-6">
        <h2 className="font-display text-lg font-semibold text-hutan-950">Ganti Password Akun Saya</h2>
        <div>
          <label className="label" htmlFor="pw-lama">Password Lama</label>
          <InputPassword id="pw-lama" minLength={1} value={pw.password_lama}
            onChange={(e) => setPw({ ...pw, password_lama: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="pw-baru2">Password Baru (min. 8 karakter)</label>
          <InputPassword id="pw-baru2" value={pw.password_baru}
            onChange={(e) => setPw({ ...pw, password_baru: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="pw-konf">Konfirmasi Password Baru</label>
          <InputPassword id="pw-konf" value={pw.konfirmasi}
            onChange={(e) => setPw({ ...pw, konfirmasi: e.target.value })} />
          {pw.konfirmasi && pw.password_baru !== pw.konfirmasi && (
            <p className="mt-1 text-xs font-semibold text-rose-600">Konfirmasi password belum sama.</p>
          )}
        </div>
        <button disabled={proses} className="btn-hutan">Ganti Password</button>
      </form>
    </div>
  );
}
