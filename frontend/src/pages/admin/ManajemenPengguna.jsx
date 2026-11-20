// V3 KEAMANAN:
// - Superadmin hanya bisa dibuat dari server (seed) — tidak ada opsi superadmin di form.
// - Akun sendiri & akun superadmin tidak bisa diubah/di-reset dari halaman ini.
// - Semua pembuatan/reset password wajib konfirmasi password.
import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { adminApi } from '../../services/api';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import InputPassword from '../../components/common/InputPassword';
import { useToast } from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABEL } from '../../constants';

const ROLE_OPSI = Object.entries(ROLE_LABEL)
  .filter(([value]) => value !== 'superadmin') // superadmin tidak bisa dibuat dari dashboard
  .map(([value, label]) => ({ value, label }));

const FORM_KOSONG = { nama: '', username: '', email: '', password: '', konfirmasi: '', role: 'admin_konten' };

export default function ManajemenPengguna() {
  const toast = useToast();
  const { admin: saya } = useAuth();
  const { data, loading, refetch } = useFetch(() => adminApi.list(), []);
  const [bukaForm, setBukaForm] = useState(false);
  const [edit, setEdit] = useState(null);
  const [reset, setReset] = useState(null);
  const [pw, setPw] = useState({ baru: '', konfirmasi: '' });
  const [form, setForm] = useState(FORM_KOSONG);
  const [proses, setProses] = useState(false);

  const bolehKelola = (a) => a.role !== 'superadmin' && a.id !== saya?.id;

  const simpan = async (e) => {
    e.preventDefault();
    if (!edit && form.password !== form.konfirmasi) {
      return toast('Konfirmasi password tidak sama.', 'error');
    }
    setProses(true);
    try {
      if (edit) {
        await adminApi.update(edit.id, { nama: form.nama, email: form.email, role: form.role });
        toast('Data admin diperbarui.');
      } else {
        await adminApi.create({ nama: form.nama, username: form.username, email: form.email, password: form.password, role: form.role });
        toast('Admin baru berhasil dibuat.');
      }
      setBukaForm(false); setEdit(null); setForm(FORM_KOSONG);
      refetch();
    } catch (err) {
      const errors = err.response?.data?.errors;
      toast(errors?.[0]?.pesan || err.response?.data?.message || 'Gagal menyimpan.', 'error');
    } finally { setProses(false); }
  };

  const bukaEdit = (a) => {
    setEdit(a);
    setForm({ ...FORM_KOSONG, nama: a.nama, email: a.email, role: a.role });
    setBukaForm(true);
  };

  const toggleAktif = async (a) => {
    try {
      await adminApi.update(a.id, { is_active: !a.is_active });
      toast(a.is_active ? 'Akun dinonaktifkan.' : 'Akun diaktifkan.');
      refetch();
    } catch (err) { toast(err.response?.data?.message || 'Gagal.', 'error'); }
  };

  const kirimReset = async (e) => {
    e.preventDefault();
    if (pw.baru !== pw.konfirmasi) return toast('Konfirmasi password tidak sama.', 'error');
    setProses(true);
    try {
      await adminApi.resetPassword(reset.id, pw.baru);
      toast(`Password ${reset.nama} berhasil di-reset.`);
      setReset(null); setPw({ baru: '', konfirmasi: '' });
    } catch (err) { toast(err.response?.data?.message || 'Gagal reset password.', 'error'); }
    finally { setProses(false); }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="admin-judul">Pengguna Admin</h1>
          <p className="admin-sub">
            Khusus Superadmin. Setiap role hanya melihat menu sesuai tanggung jawabnya. Akun superadmin hanya dapat dibuat dari server.
          </p>
        </div>
        <button onClick={() => { setEdit(null); setForm(FORM_KOSONG); setBukaForm(true); }} className="btn-hutan !px-5 !py-2.5 !text-xs">+ Tambah Admin</button>
      </div>

      {loading ? <Loader /> : (
        <div className="admin-panel mt-5 overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-hutan-900/10 text-left text-[11px] font-bold uppercase tracking-wider text-tinta/50">
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {(data || []).map((a) => (
                <tr key={a.id} className="border-b border-hutan-900/5 last:border-0 hover:bg-hutan-50/60">
                  <td className="px-4 py-3">
                    <p className="font-bold text-hutan-950">
                      {a.nama} {a.id === saya?.id && <span className="ml-1 rounded-full bg-emas/20 px-2 py-0.5 text-[10px] font-bold text-emas-dark">Anda</span>}
                    </p>
                    <p className="text-xs text-tinta/50">{a.email}</p>
                  </td>
                  <td className="px-4 py-3 text-tinta/75">{a.username}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-hutan-100 px-3 py-1 text-[11px] font-bold text-hutan-800">{ROLE_LABEL[a.role]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${a.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'}`}>
                      {a.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {bolehKelola(a) ? (
                      <div className="inline-flex flex-wrap justify-end gap-1.5">
                        <button onClick={() => bukaEdit(a)} className="rounded-full bg-hutan-100 px-3.5 py-1.5 text-xs font-bold text-hutan-800 hover:bg-hutan-200">Edit</button>
                        <button onClick={() => setReset(a)} className="rounded-full bg-sky-100 px-3.5 py-1.5 text-xs font-bold text-sky-800 hover:bg-sky-200">Reset Password</button>
                        <button onClick={() => toggleAktif(a)} className="rounded-full bg-amber-100 px-3.5 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-200">
                          {a.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] font-semibold text-tinta/35">Dilindungi</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form tambah / edit */}
      <Modal buka={bukaForm} onTutup={() => setBukaForm(false)} judul={edit ? `Edit: ${edit.nama}` : 'Tambah Admin Baru'}>
        <form onSubmit={simpan} className="space-y-4">
          <div><label className="label" htmlFor="mp-nama">Nama Lengkap</label>
            <input id="mp-nama" required className="input" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            {!edit && (
              <div><label className="label" htmlFor="mp-user">Username</label>
                <input id="mp-user" required minLength={4} className="input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></div>
            )}
            <div className={edit ? 'col-span-2' : ''}><label className="label" htmlFor="mp-role">Role / Tanggung Jawab</label>
              <select id="mp-role" className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {ROLE_OPSI.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select></div>
          </div>
          <div><label className="label" htmlFor="mp-email">Email</label>
            <input id="mp-email" type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          {!edit && (
            <>
              <div><label className="label" htmlFor="mp-pw">Password (min. 8 karakter)</label>
                <InputPassword id="mp-pw" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
              <div><label className="label" htmlFor="mp-pw2">Konfirmasi Password</label>
                <InputPassword id="mp-pw2" value={form.konfirmasi} onChange={(e) => setForm({ ...form, konfirmasi: e.target.value })} />
                {form.konfirmasi && form.password !== form.konfirmasi && (
                  <p className="mt-1 text-xs font-semibold text-rose-600">Konfirmasi password belum sama.</p>
                )}</div>
            </>
          )}
          <button disabled={proses} className="btn-emas w-full">{proses ? 'Menyimpan...' : edit ? 'Simpan Perubahan' : 'Buat Akun'}</button>
        </form>
      </Modal>

      {/* Reset password */}
      <Modal buka={!!reset} onTutup={() => setReset(null)} judul={`Reset Password: ${reset?.nama}`}>
        <form onSubmit={kirimReset} className="space-y-4">
          <div><label className="label" htmlFor="rp-1">Password Baru (min. 8 karakter)</label>
            <InputPassword id="rp-1" value={pw.baru} onChange={(e) => setPw({ ...pw, baru: e.target.value })} /></div>
          <div><label className="label" htmlFor="rp-2">Konfirmasi Password Baru</label>
            <InputPassword id="rp-2" value={pw.konfirmasi} onChange={(e) => setPw({ ...pw, konfirmasi: e.target.value })} />
            {pw.konfirmasi && pw.baru !== pw.konfirmasi && (
              <p className="mt-1 text-xs font-semibold text-rose-600">Konfirmasi password belum sama.</p>
            )}</div>
          <button disabled={proses} className="btn-emas w-full">{proses ? 'Memproses...' : 'Reset Password'}</button>
        </form>
      </Modal>
    </div>
  );
}
