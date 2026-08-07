// Editor konten statis yang dipakai bersama:
// - Admin Konten (wisata): sekilas-kwau, aturan-berkunjung, fasilitas-layanan
// - Pegawai Kampung: sejarah-kampung, marga-kampung, struktur-kampung
import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { kontenApi } from '../../services/api';
import Loader from './Loader';
import { useToast } from './Toast';

export default function EditorStatis({ slugs, keterangan }) {
  const toast = useToast();
  const { data, loading, refetch } = useFetch(() => kontenApi.listAdmin(), []);
  const [aktif, setAktif] = useState(null);
  const [isi, setIsi] = useState('');
  const [judul, setJudul] = useState('');
  const [proses, setProses] = useState(false);

  const daftar = (data || []).filter((k) => slugs.includes(k.slug));

  const pilih = (k) => { setAktif(k); setJudul(k.judul); setIsi(k.isi); };

  const simpan = async (e) => {
    e.preventDefault();
    setProses(true);
    try {
      await kontenApi.upsert({ slug: aktif.slug, judul, isi });
      toast('Konten berhasil disimpan.');
      refetch();
    } catch (err) { toast(err.response?.data?.message || 'Gagal menyimpan.', 'error'); }
    finally { setProses(false); }
  };

  if (loading) return <Loader />;
  return (
    <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
      <div className="space-y-1.5">
        {daftar.map((k) => (
          <button key={k.slug} onClick={() => pilih(k)}
            className={`block w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition ${aktif?.slug === k.slug ? 'bg-hutan-900 text-kabut' : 'bg-white text-hutan-900 shadow-sm hover:bg-hutan-100'}`}>
            {k.judul}
            <span className="block text-[10px] font-medium opacity-60">/{k.slug}</span>
          </button>
        ))}
      </div>
      {aktif ? (
        <form onSubmit={simpan} className="kartu space-y-4 p-6">
          <div>
            <label className="label" htmlFor="ks-judul">Judul</label>
            <input id="ks-judul" required className="input" value={judul} onChange={(e) => setJudul(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="ks-isi">Isi Konten</label>
            <textarea id="ks-isi" required rows={12} className="input resize-y" value={isi} onChange={(e) => setIsi(e.target.value)} />
            {keterangan && <p className="mt-1 text-[11px] leading-relaxed text-tinta/45">{keterangan}</p>}
          </div>
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
