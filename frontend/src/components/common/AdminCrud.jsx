// Komponen CRUD generik untuk dashboard admin.
// Menerima konfigurasi kolom tabel + field form, sehingga semua modul
// (satwa, berita, FAQ, homestay, tokoh, titik peta) memakai satu pola yang sama.
// Tampilan: kartu di HP, tabel di layar lebar; form dua kolom di dalam modal.
import { useState } from 'react';
import { Plus, Pencil, Trash2, Languages } from 'lucide-react';
import Loader from './Loader';
import EmptyState from './EmptyState';
import Modal from './Modal';
import ImgFallback from './ImgFallback';
import Pagination from './Pagination';
import { useToast } from './Toast';

export default function AdminCrud({
  judul, deskripsi, api, kolom, fields,
  pakaiFormData = true, namaField = 'nama', aksiEkstra = null, data, loading, refetch,
  meta = null, page = 1, onPage = null, // pagination opsional
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
    fields.forEach((f) => { if (f.type !== 'bagian') kosong[f.name] = f.default ?? ''; });
    setForm(kosong); setFiles({}); setEdit(null); setBukaForm(true);
  };

  const bukaEdit = (item) => {
    const isi = {};
    fields.forEach((f) => { if (f.type !== 'file' && f.type !== 'bagian') isi[f.name] = item[f.name] ?? ''; });
    setForm(isi); setFiles({}); setEdit(item); setBukaForm(true);
  };

  const simpan = async (e) => {
    e.preventDefault();
    setProses(true);
    try {
      let payload;
      if (pakaiFormData) {
        payload = new FormData();
        // Kolom versi Inggris (_en) tetap dikirim walau kosong, agar terjemahan bisa dihapus
        Object.entries(form).forEach(([k, v]) => { if ((v !== '' && v !== null) || k.endsWith('_en')) payload.append(k, v ?? ''); });
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

  const ubah = (name) => (e) => setForm({ ...form, [name]: e.target.value });
  const kolomFoto = kolom.find((k) => k.foto);
  const kolomTeks = kolom.filter((k) => !k.foto);
  const kolomUtama = kolomTeks.find((k) => k.kuat) || kolomTeks[0];

  const tombolAksi = (item, kecil = false) => (
    <>
      {aksiEkstra && aksiEkstra(item, refetch)}
      <button onClick={() => bukaEdit(item)} className={`admin-aksi bg-hutan-100 text-hutan-800 hover:bg-hutan-200 ${kecil ? 'flex-1 justify-center !py-2' : ''}`}>
        <Pencil size={13} aria-hidden="true" /> Edit
      </button>
      <button onClick={() => setHapusItem(item)} className={`admin-aksi bg-rose-50 text-rose-700 hover:bg-rose-100 ${kecil ? 'flex-1 justify-center !py-2' : ''}`}>
        <Trash2 size={13} aria-hidden="true" /> Hapus
      </button>
    </>
  );

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-medium text-hutan-950">{judul}</h2>
          {deskripsi && <p className="mt-1 max-w-2xl text-sm text-tinta/55">{deskripsi}</p>}
        </div>
        <button onClick={bukaTambah} className="btn-hutan !px-5 !py-2.5 !text-xs"><Plus size={15} aria-hidden="true" /> Tambah</button>
      </div>

      {loading ? <Loader /> : data?.length ? (
        <>
          {/* HP, tablet, laptop kecil: kartu */}
          <div className="grid gap-3 md:grid-cols-2 xl:hidden">
            {data.map((item) => (
              <article key={item.id} className="admin-panel p-4">
                <div className="flex gap-3">
                  {kolomFoto && <ImgFallback src={kolomFoto.render(item)} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />}
                  <div className="min-w-0 flex-1">
                    <p className="font-bold leading-snug text-hutan-950">{kolomUtama?.render(item)}</p>
                    <dl className="mt-1.5 space-y-0.5 text-xs">
                      {kolomTeks.filter((k) => k !== kolomUtama).map((k) => (
                        <div key={k.label} className="flex gap-1.5">
                          <dt className="shrink-0 text-tinta/45">{k.label}:</dt>
                          <dd className="min-w-0 truncate text-tinta/75">{k.render(item)}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">{tombolAksi(item, true)}</div>
              </article>
            ))}
          </div>

          {/* Desktop: tabel */}
          <div className="admin-panel hidden overflow-x-auto xl:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-hutan-900/10 text-left">
                  {kolom.map((k) => <th key={k.label} className="admin-label whitespace-nowrap px-4 py-3">{k.label}</th>)}
                  <th className="admin-label px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-b border-hutan-900/[.05] last:border-0 hover:bg-hutan-50/50">
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
                      <div className="inline-flex flex-wrap justify-end gap-1.5">{tombolAksi(item)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <EmptyState judul={`Belum ada data ${judul.toLowerCase()}`}>
          <button onClick={bukaTambah} className="btn-hutan"><Plus size={15} aria-hidden="true" /> Tambah pertama</button>
        </EmptyState>
      )}
      {onPage && <Pagination meta={meta} page={page} onPage={onPage} />}

      {/* Form tambah/edit */}
      <Modal buka={bukaForm} onTutup={() => setBukaForm(false)} judul={edit ? `Edit ${judul}` : `Tambah ${judul}`} lebar="max-w-2xl">
        <form onSubmit={simpan} className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
          {fields.map((f) => f.type === 'bagian' ? (
            <div key={f.label} className="mt-3 flex gap-3 rounded-2xl bg-sky-50 px-4 py-3 ring-1 ring-sky-100 sm:col-span-2">
              <Languages size={18} className="mt-0.5 shrink-0 text-sky-700" aria-hidden="true" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-sky-800">{f.label}</p>
                {f.keterangan && <p className="mt-0.5 text-[11px] leading-relaxed text-sky-900/60">{f.keterangan}</p>}
              </div>
            </div>
          ) : (
            <div key={f.name} className={f.setengah ? '' : 'sm:col-span-2'}>
              <label className="label" htmlFor={`f-${f.name}`}>{f.label}{f.opsional && <span className="normal-case tracking-normal text-tinta/40"> (opsional)</span>}</label>
              {f.type === 'textarea' ? (
                <textarea id={`f-${f.name}`} rows={f.rows || 4} required={!f.opsional} className="input resize-y"
                  value={form[f.name] ?? ''} onChange={ubah(f.name)} />
              ) : f.type === 'select' ? (
                <select id={`f-${f.name}`} required={!f.opsional} className="input"
                  value={form[f.name] ?? ''} onChange={ubah(f.name)}>
                  <option value="">— Pilih —</option>
                  {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : f.type === 'file' ? (
                <input id={`f-${f.name}`} type="file" accept="image/jpeg,image/png,image/webp" multiple={f.multiple}
                  onChange={(e) => setFiles({ ...files, [f.name]: f.multiple ? Array.from(e.target.files) : e.target.files[0] })}
                  className="block w-full rounded-xl border border-dashed border-hutan-900/20 bg-hutan-50/50 p-3 text-xs file:mr-3 file:rounded-full file:border-0 file:bg-hutan-900 file:px-4 file:py-2 file:text-xs file:font-bold file:text-kabut" />
              ) : (
                <input id={`f-${f.name}`} type={f.type || 'text'} step={f.step} min={f.min} required={!f.opsional} className="input"
                  value={form[f.name] ?? ''} onChange={ubah(f.name)} />
              )}
              {f.keterangan && <p className="mt-1 text-[11px] leading-relaxed text-tinta/45">{f.keterangan}</p>}
            </div>
          ))}
          {/* Tombol simpan selalu terlihat walau form panjang */}
          <div className="sticky bottom-0 -mx-6 -mb-6 mt-2 border-t border-hutan-900/10 bg-white/95 px-6 py-4 backdrop-blur sm:col-span-2 sm:-mx-7 sm:-mb-7 sm:px-7">
            <div className="flex gap-3">
              <button type="button" onClick={() => setBukaForm(false)} className="btn-garis flex-1 !py-2.5 !text-xs">Batal</button>
              <button type="submit" disabled={proses} className="btn-emas flex-[2] !py-2.5">{proses ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </div>
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
            {proses ? 'Menghapus...' : 'Ya, hapus'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
