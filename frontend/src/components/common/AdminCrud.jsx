// Komponen CRUD generik untuk dashboard admin.
// Menerima konfigurasi kolom tabel + field form, sehingga semua modul
// (satwa, berita, FAQ, homestay, tokoh, titik peta) memakai satu pola yang sama.
import { useState } from 'react';
import Loader from './Loader';
import EmptyState from './EmptyState';
import Modal from './Modal';
import ImgFallback from './ImgFallback';
import Pagination from './Pagination';
import { useToast } from './Toast';

export default function AdminCrud({
  judul, deskripsi, api, kolom, fields, refetchDeps,
  pakaiFormData = true, namaField = 'nama', aksiEkstra = null, data, loading, refetch,
  meta = null, page = 1, onPage = null, // V5: pagination opsional
}) {
  const toast = useToast();
  const [bukaForm, setBukaForm] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({});
  const [files, setFiles] = useState({});
  const [proses, setProses] = useState(false);
  const [hapusItem, setHapusItem] = useState(null);

  const bukaTambah = () => {
    const kosong = {};
    fields.forEach((f) => { kosong[f.name] = f.default ?? ''; });
    setForm(kosong); setFiles({}); setEdit(null); setBukaForm(true);
  };

  const bukaEdit = (item) => {
    const isi = {};
    fields.forEach((f) => { if (f.type !== 'file') isi[f.name] = item[f.name] ?? ''; });
    setForm(isi); setFiles({}); setEdit(item); setBukaForm(true);
  };

  const simpan = async (e) => {
    e.preventDefault();
    setProses(true);
    try {
      let payload;
      if (pakaiFormData) {
        payload = new FormData();
        Object.entries(form).forEach(([k, v]) => { if (v !== '' && v !== null) payload.append(k, v); });
        Object.entries(files).forEach(([k, v]) => {
          if (Array.isArray(v)) v.forEach((f) => payload.append(k, f));
          else if (v) payload.append(k, v);
        });
      } else {
        payload = form;
      }
      if (edit) await api.update(edit.id, payload);
      else await api.create(payload);
      toast(edit ? 'Data berhasil diperbarui.' : 'Data berhasil ditambahkan.');
      setBukaForm(false);
      refetch();
    } catch (err) {
      const errors = err.response?.data?.errors;
      toast(errors?.[0]?.pesan || err.response?.data?.message || 'Gagal menyimpan.', 'error');
    } finally { setProses(false); }
  };

  const hapus = async () => {
    setProses(true);
    try {
      await api.remove(hapusItem.id);
      toast('Data dihapus.');
      setHapusItem(null);
      refetch();
    } catch (err) {
      toast(err.response?.data?.message || 'Gagal menghapus.', 'error');
    } finally { setProses(false); }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-hutan-950">{judul}</h2>
          {deskripsi && <p className="mt-1 text-sm text-tinta/55">{deskripsi}</p>}
        </div>
        <button onClick={bukaTambah} className="btn-hutan !px-5 !py-2.5 !text-xs">+ Tambah</button>
      </div>

      {loading ? <Loader /> : data?.length ? (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-hutan-900/10 text-left text-[11px] font-bold uppercase tracking-wider text-tinta/50">
                {kolom.map((k) => <th key={k.label} className="px-4 py-3">{k.label}</th>)}
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b border-hutan-900/5 last:border-0 hover:bg-hutan-50/60">
                  {kolom.map((k) => (
                    <td key={k.label} className="px-4 py-3 align-middle">
                      {k.foto ? (
                        <ImgFallback src={k.render(item)} alt="" className="h-11 w-14 rounded-lg object-cover" />
                      ) : (
                        <span className={k.kuat ? 'font-bold text-hutan-950' : 'text-tinta/75'}>{k.render(item)}</span>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1.5">
                      {aksiEkstra && aksiEkstra(item, refetch)}
                      <button onClick={() => bukaEdit(item)} className="rounded-full bg-hutan-100 px-3.5 py-1.5 text-xs font-bold text-hutan-800 hover:bg-hutan-200">Edit</button>
                      <button onClick={() => setHapusItem(item)} className="rounded-full bg-rose-100 px-3.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-200">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState judul={`Belum ada data ${judul.toLowerCase()}`}>
          <button onClick={bukaTambah} className="btn-hutan">+ Tambah Pertama</button>
        </EmptyState>
      )}
      {onPage && <Pagination meta={meta} page={page} onPage={onPage} />}

      {/* Form tambah/edit */}
      <Modal buka={bukaForm} onTutup={() => setBukaForm(false)} judul={edit ? `Edit ${judul}` : `Tambah ${judul}`} lebar="max-w-xl">
        <form onSubmit={simpan} className="space-y-4">
          {fields.map((f) => (
            <div key={f.name} className={f.setengah ? 'inline-block w-[calc(50%-8px)] pr-2 align-top' : ''}>
              <label className="label" htmlFor={`f-${f.name}`}>{f.label}{f.opsional && <span className="normal-case text-tinta/40"> (opsional)</span>}</label>
              {f.type === 'textarea' ? (
                <textarea id={`f-${f.name}`} rows={f.rows || 4} required={!f.opsional} className="input resize-none"
                  value={form[f.name] ?? ''} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
              ) : f.type === 'select' ? (
                <select id={`f-${f.name}`} required={!f.opsional} className="input"
                  value={form[f.name] ?? ''} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}>
                  <option value="">— Pilih —</option>
                  {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : f.type === 'file' ? (
                <input id={`f-${f.name}`} type="file" accept="image/jpeg,image/png,image/webp" multiple={f.multiple}
                  onChange={(e) => setFiles({ ...files, [f.name]: f.multiple ? Array.from(e.target.files) : e.target.files[0] })}
                  className="block w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-hutan-100 file:px-4 file:py-2 file:text-xs file:font-bold file:text-hutan-800" />
              ) : (
                <input id={`f-${f.name}`} type={f.type || 'text'} step={f.step} min={f.min} required={!f.opsional} className="input"
                  value={form[f.name] ?? ''} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
              )}
              {f.keterangan && <p className="mt-1 text-[11px] text-tinta/45">{f.keterangan}</p>}
            </div>
          ))}
          <button type="submit" disabled={proses} className="btn-emas w-full">{proses ? 'Menyimpan...' : 'Simpan'}</button>
        </form>
      </Modal>

      {/* Konfirmasi hapus */}
      <Modal buka={!!hapusItem} onTutup={() => setHapusItem(null)} judul="Hapus data ini?">
        <p className="text-sm text-tinta/70">
          <strong className="text-hutan-950">{hapusItem?.[namaField] || `#${hapusItem?.id}`}</strong> akan dihapus permanen dan tidak bisa dikembalikan.
        </p>
        <div className="mt-5 flex gap-3">
          <button onClick={() => setHapusItem(null)} className="btn-garis flex-1 !py-2.5 !text-xs">Batal</button>
          <button onClick={hapus} disabled={proses} className="btn flex-1 bg-rose-600 !py-2.5 !text-xs text-white hover:bg-rose-700">
            {proses ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
