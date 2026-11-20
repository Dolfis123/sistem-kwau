import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { paketApi } from '../../services/api';
import AdminCrud from '../../components/common/AdminCrud';
import Modal from '../../components/common/Modal';
import ImgFallback from '../../components/common/ImgFallback';
import { useToast } from '../../components/common/Toast';
import { KATEGORI_PAKET } from '../../constants';
import { BAGIAN_INGGRIS } from '../../constants/bahasaInggris';


export default function ManajemenPaket() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const { data, meta, loading, refetch } = useFetch(() => paketApi.listAdmin({ page, limit: 10 }), [page]);
  const [kelola, setKelola] = useState(null); // paket yang sedang dikelola foto/kuotanya
  const [slot, setSlot] = useState({ tanggal: '', kuota_tersedia: '', status: 'tersedia' });
  const [fotoBaru, setFotoBaru] = useState([]);
  const [proses, setProses] = useState(false);

  const bukaKelola = async (item) => {
    const res = await paketApi.detail(item.id).catch(() => null);
    setKelola(res?.data?.data || item);
    setSlot({ tanggal: '', kuota_tersedia: item.kapasitas, status: 'tersedia' });
    setFotoBaru([]);
  };

  const simpanSlot = async (e) => {
    e.preventDefault();
    setProses(true);
    try {
      await paketApi.aturKetersediaan(kelola.id, slot);
      toast('Ketersediaan tanggal disimpan.');
      bukaKelola(kelola);
    } catch (err) { toast(err.response?.data?.message || 'Gagal menyimpan.', 'error'); }
    finally { setProses(false); }
  };

  const uploadFoto = async () => {
    if (!fotoBaru.length) return;
    setProses(true);
    try {
      const fd = new FormData();
      fotoBaru.forEach((f) => fd.append('foto', f));
      await paketApi.tambahFoto(kelola.id, fd);
      toast('Foto galeri ditambahkan.');
      setFotoBaru([]);
      bukaKelola(kelola);
    } catch (err) { toast(err.response?.data?.message || 'Gagal upload.', 'error'); }
    finally { setProses(false); }
  };

  const hapusFoto = async (fotoId) => {
    await paketApi.hapusFoto(kelola.id, fotoId);
    toast('Foto dihapus.');
    bukaKelola(kelola);
  };

  return (
    <div>
      <h1 className="admin-judul mb-6">Manajemen Paket Wisata</h1>
      <AdminCrud
        judul="Paket Wisata"
        deskripsi="Paket yang berstatus aktif otomatis tampil di halaman publik."
        api={paketApi}
        data={data} loading={loading} refetch={refetch}
        meta={meta} page={page} onPage={setPage}
        kolom={[
          { label: 'Cover', foto: true, render: (p) => p.foto_cover },
          { label: 'Nama Paket', kuat: true, render: (p) => p.nama },
          { label: 'Kategori', render: (p) => KATEGORI_PAKET.find((k) => k.value === p.kategori)?.label },
          { label: 'Durasi', render: (p) => p.durasi || '-' },
          { label: 'Status', render: (p) => p.status },
          { label: 'English', render: (p) => (p.deskripsi_en ? '✓ Ada' : '— Belum') },
        ]}
        fields={[
          { name: 'nama', label: 'Nama Paket' },
          { name: 'kategori', label: 'Kategori', type: 'select', options: KATEGORI_PAKET },
          { name: 'harga', label: 'Harga (Rp)', type: 'number', min: 0, opsional: true, keterangan: 'Catatan internal saja — TIDAK ditampilkan di situs publik. Turis diarahkan menanyakan harga via WhatsApp.' },
          { name: 'durasi', label: 'Durasi', opsional: true, keterangan: 'Contoh: 2 hari 1 malam' },
          { name: 'kapasitas', label: 'Kapasitas per jadwal', type: 'number', min: 1, default: 10 },
          { name: 'status', label: 'Status', type: 'select', options: [{ value: 'aktif', label: 'Aktif' }, { value: 'nonaktif', label: 'Nonaktif' }], default: 'aktif' },
          { name: 'deskripsi', label: 'Deskripsi', type: 'textarea' },
          { name: 'itinerary', label: 'Itinerary', type: 'textarea', opsional: true, keterangan: 'Khusus paket trekking/kombinasi' },
          { name: 'foto_cover', label: 'Foto Cover', type: 'file', opsional: true },
          BAGIAN_INGGRIS,
          { name: 'nama_en', label: 'Nama Paket (English)', opsional: true, keterangan: 'Contoh: Bowerbird & Birds of Paradise Watching' },
          { name: 'durasi_en', label: 'Durasi (English)', opsional: true, keterangan: 'Contoh: 2 days 1 night' },
          { name: 'deskripsi_en', label: 'Deskripsi (English)', type: 'textarea', opsional: true },
          { name: 'itinerary_en', label: 'Itinerary (English)', type: 'textarea', opsional: true },
        ]}
        aksiEkstra={(item) => (
          <button onClick={() => bukaKelola(item)} className="rounded-full bg-emas/20 px-3.5 py-1.5 text-xs font-bold text-emas-dark hover:bg-emas/30">
            Foto & Kuota
          </button>
        )}
      />

      <Modal buka={!!kelola} onTutup={() => setKelola(null)} judul={`Kelola: ${kelola?.nama}`} lebar="max-w-2xl">
        {kelola && (
          <div className="space-y-7">
            {/* Galeri foto */}
            <section>
              <p className="label">Foto galeri (carousel di halaman detail)</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {(kelola.foto || []).map((f) => (
                  <div key={f.id} className="group relative">
                    <ImgFallback src={f.url_foto} alt="" className="aspect-square w-full rounded-xl object-cover" />
                    <button onClick={() => hapusFoto(f.id)} aria-label="Hapus foto"
                      className="absolute right-1.5 top-1.5 rounded-full bg-rose-600 px-2 py-0.5 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100">✕</button>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input type="file" multiple accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setFotoBaru(Array.from(e.target.files))}
                  className="block flex-1 text-xs file:mr-3 file:rounded-full file:border-0 file:bg-hutan-100 file:px-4 file:py-2 file:text-xs file:font-bold file:text-hutan-800" />
                <button onClick={uploadFoto} disabled={proses || !fotoBaru.length} className="btn-hutan !px-5 !py-2 !text-xs">Upload</button>
              </div>
            </section>

            {/* Kalender ketersediaan */}
            <section>
              <p className="label">Kalender ketersediaan (atur kuota / tutup tanggal)</p>
              <form onSubmit={simpanSlot} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <input type="date" required className="input !py-2 !text-xs" value={slot.tanggal}
                  onChange={(e) => setSlot({ ...slot, tanggal: e.target.value })} />
                <input type="number" min={0} required placeholder="Kuota" className="input !py-2 !text-xs" value={slot.kuota_tersedia}
                  onChange={(e) => setSlot({ ...slot, kuota_tersedia: e.target.value })} />
                <select className="input !py-2 !text-xs" value={slot.status} onChange={(e) => setSlot({ ...slot, status: e.target.value })}>
                  <option value="tersedia">Tersedia</option>
                  <option value="penuh">Penuh</option>
                  <option value="ditutup">Ditutup</option>
                </select>
                <button disabled={proses} className="btn-emas !px-4 !py-2 !text-xs">Simpan</button>
              </form>
              {kelola.ketersediaan?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {kelola.ketersediaan.map((k) => (
                    <span key={k.tanggal} className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                      k.status === 'tersedia' ? 'bg-emerald-100 text-emerald-800' : k.status === 'penuh' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {k.tanggal} · sisa {k.kuota_tersedia}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-2 text-[11px] text-tinta/45">Tanggal tanpa pengaturan otomatis memakai kapasitas paket saat reservasi pertama masuk.</p>
            </section>
          </div>
        )}
      </Modal>
    </div>
  );
}
