// V3: Informasi Kampung — dikelola role PEGAWAI KAMPUNG
// (Admin Pertanian juga dapat menulis berita, mis. kategori Pertanian)
import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { beritaApi } from '../../services/api';
import AdminCrud from '../../components/common/AdminCrud';
import EditorStatis from '../../components/common/EditorStatis';
import { formatTanggal } from '../../utils/format';
import { KATEGORI_BERITA } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { BAGIAN_INGGRIS } from '../../constants/bahasaInggris';

export default function ManajemenInformasi() {
  const { admin } = useAuth();
  const [tab, setTab] = useState('berita');
  const [page, setPage] = useState(1);
  // listAdmin memuat isi artikel lengkap agar form edit terisi penuh
  const berita = useFetch(() => beritaApi.listAdmin({ page, limit: 10 }), [page]);
  const bolehProfil = admin?.role === 'superadmin' || admin?.role === 'pegawai_kampung';

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-hutan-950">Informasi Kampung</h1>
      <p className="mt-1 text-sm text-tinta/55">Blog berita/kegiatan kampung dan profil kampung (sejarah, marga, struktur pemerintahan).</p>

      <div className="mb-6 mt-5 flex flex-wrap gap-1.5">
        <button onClick={() => setTab('berita')}
          className={`rounded-full px-4 py-2 text-xs font-bold transition ${tab === 'berita' ? 'bg-hutan-900 text-kabut' : 'bg-white text-hutan-900 shadow-sm hover:bg-hutan-100'}`}>
          Berita dan Kegiatan
        </button>
        {bolehProfil && (
          <button onClick={() => setTab('profil')}
            className={`rounded-full px-4 py-2 text-xs font-bold transition ${tab === 'profil' ? 'bg-hutan-900 text-kabut' : 'bg-white text-hutan-900 shadow-sm hover:bg-hutan-100'}`}>
            Profil Kampung
          </button>
        )}
      </div>

      {tab === 'berita' ? (
        <AdminCrud judul="Berita dan Kegiatan" api={beritaApi} namaField="judul"
          deskripsi="Tampil di halaman Informasi situs publik, terkelompok per kategori."
          data={berita.data} loading={berita.loading} refetch={berita.refetch}
          meta={berita.meta} page={page} onPage={setPage}
          kolom={[
            { label: 'Sampul', foto: true, render: (b) => b.foto_sampul },
            { label: 'Judul', kuat: true, render: (b) => b.judul },
            { label: 'Kategori', render: (b) => b.kategori },
            { label: 'Terbit', render: (b) => formatTanggal(b.tanggal_terbit) },
          ]}
          fields={[
            { name: 'judul', label: 'Judul' },
            { name: 'kategori', label: 'Kategori', type: 'select', options: KATEGORI_BERITA.map((k) => ({ value: k, label: k })), default: 'Kegiatan Kampung' },
            { name: 'tanggal_terbit', label: 'Tanggal Terbit', type: 'date' },
            { name: 'isi', label: 'Isi Artikel', type: 'textarea', rows: 8 },
            { name: 'foto_sampul', label: 'Foto Sampul', type: 'file', opsional: true },
            BAGIAN_INGGRIS,
            { name: 'judul_en', label: 'Judul (English)', opsional: true },
            { name: 'isi_en', label: 'Isi Artikel (English)', type: 'textarea', rows: 8, opsional: true },
          ]}
        />
      ) : (
        <EditorStatis
          slugs={['sejarah-kampung', 'marga-kampung', 'struktur-kampung', 'peraturan-kampung']}
          keterangan="Marga: satu marga per baris. Struktur: format 'Jabatan: Nama' per baris. Peraturan Kampung: satu peraturan per baris — tampil bernomor otomatis di halaman Tentang Kwau."
        />
      )}
    </div>
  );
}
