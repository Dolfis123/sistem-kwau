// Editor konten statis yang dipakai bersama:
// - Admin Konten (wisata): sekilas-kwau, aturan-berkunjung, fasilitas-layanan
// - Pegawai Kampung: sejarah-kampung, marga-kampung, struktur-kampung, peraturan-kampung
// Setiap konten punya versi Bahasa Indonesia (wajib) dan Bahasa Inggris (opsional).
import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { kontenApi } from '../../services/api';
import Loader from './Loader';
import { useToast } from './Toast';

export default function EditorStatis({ slugs, keterangan }) {
  const toast = useToast();
  const { data, loading, refetch } = useFetch(() => kontenApi.listAdmin(), []);
  const [aktif, setAktif] = useState(null);
  const [form, setForm] = useState({ judul: '', isi: '', judul_en: '', isi_en: '' });
  const [tab, setTab] = useState('id');
  const [proses, setProses] = useState(false);

  const daftar = (data || []).filter((k) => slugs.includes(k.slug));

  const pilih = (k) => {
    setAktif(k);
    setTab('id');
    setForm({ judul: k.judul || '', isi: k.isi || '', judul_en: k.judul_en || '', isi_en: k.isi_en || '' });
  };
  const ubah = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const simpan = async (e) => {
    e.preventDefault();
    setProses(true);
    try {
      await kontenApi.upsert({ slug: aktif.slug, ...form });
      toast('Konten berhasil disimpan.');
      refetch();
    } catch (err) { toast(err.response?.data?.message || 'Gagal menyimpan.', 'error'); }
    finally { setProses(false); }
  };

  if (loading) return <Loader />;
  return (
    <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
      <div className="space-y-1.5">
        {daftar.map((k) => (
          <button key={k.slug} onClick={() => pilih(k)}
            className={`block w-full rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${aktif?.slug === k.slug ? 'bg-hutan-900 text-kabut' : 'bg-white text-hutan-900 shadow-sm hover:bg-hutan-100'}`}>
            {k.judul}
            <span className="mt-0.5 flex items-center justify-between text-[10px] font-medium opacity-60">
              /{k.slug}
              <span>{k.isi_en ? 'EN ✓' : 'EN —'}</span>
            </span>
          </button>
        ))}
      </div>
      {aktif ? (
        <form onSubmit={simpan} className="kartu space-y-4 p-6">
          <div className="flex gap-1.5">
            {[['id', 'Bahasa Indonesia'], ['en', 'English (opsional)']].map(([v, label]) => (
              <button key={v} type="button" onClick={() => setTab(v)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${tab === v ? 'bg-hutan-900 text-kabut' : 'bg-hutan-100/60 text-hutan-900 hover:bg-hutan-100'}`}>
                {label}
              </button>
            ))}
          </div>
          {tab === 'id' ? (
            <>
              <div>
                <label className="label" htmlFor="ks-judul">Judul</label>
                <input id="ks-judul" name="judul" required className="input" value={form.judul} onChange={ubah} />
              </div>
              <div>
                <label className="label" htmlFor="ks-isi">Isi Konten</label>
                <textarea id="ks-isi" name="isi" required rows={12} className="input resize-y" value={form.isi} onChange={ubah} />
                {keterangan && <p className="mt-1 text-[11px] leading-relaxed text-tinta/45">{keterangan}</p>}
              </div>
            </>
          ) : (
            <>
              <p className="rounded-xl bg-sky-50 px-4 py-3 text-xs leading-relaxed text-sky-900/70">
                Tampil saat pengunjung memilih bahasa English. Gunakan format yang sama dengan versi Indonesia
                (mis. satu poin per baris). Jika dikosongkan, versi Bahasa Indonesia yang ditampilkan.
              </p>
              <div>
                <label className="label" htmlFor="ks-judul-en">Title (English)</label>
                <input id="ks-judul-en" name="judul_en" className="input" value={form.judul_en} onChange={ubah} />
              </div>
              <div>
                <label className="label" htmlFor="ks-isi-en">Content (English)</label>
                <textarea id="ks-isi-en" name="isi_en" rows={12} className="input resize-y" value={form.isi_en} onChange={ubah} />
              </div>
            </>
          )}
          <button disabled={proses} className="btn-emas">{proses ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
        </form>
      ) : (
        <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-hutan-900/15 p-10 text-sm text-tinta/50">
          ← Pilih konten yang ingin diedit
        </div>
      )}
    </div>
  );
}
