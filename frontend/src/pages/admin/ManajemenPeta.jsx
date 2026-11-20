import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { petaApi, tokohApi } from '../../services/api';
import AdminCrud from '../../components/common/AdminCrud';
import { useToast } from '../../components/common/Toast';
import { KATEGORI_TITIK } from '../../constants';
import { BAGIAN_INGGRIS } from '../../constants/bahasaInggris';

export default function ManajemenPeta() {
  const toast = useToast();
  const [tab, setTab] = useState('titik');
  const titik = useFetch(() => petaApi.listAdmin(), []);
  const tokoh = useFetch(() => tokohApi.list(), []);

  const toggleTokoh = async (item, refetch) => {
    await tokohApi.toggleAktif(item.id);
    toast(item.status_aktif ? 'Tokoh dinonaktifkan (soft delete).' : 'Tokoh diaktifkan kembali.');
    refetch();
  };

  return (
    <div>
      <h1 className="admin-judul">Manajemen Peta & Tokoh</h1>
      <p className="admin-sub">Titik peta dan profil pemandu yang tampil di halaman Peta Interaktif.</p>

      <div className="admin-tabs mb-6 mt-5">
        {[['titik', 'Titik Peta'], ['tokoh', 'Tokoh / Pemandu']].map(([v, label]) => (
          <button key={v} onClick={() => setTab(v)}
            className={`admin-tab ${tab === v ? 'admin-tab-aktif' : 'admin-tab-pasif'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'titik' ? (
        <AdminCrud
          judul="Titik Peta"
          deskripsi="Koordinat bisa disalin dari Google Maps (klik kanan lokasi → salin angka lat, lng)."
          api={petaApi}
          data={titik.data} loading={titik.loading} refetch={titik.refetch}
          kolom={[
            { label: 'Nama Titik', kuat: true, render: (t) => t.nama },
            { label: 'Kategori', render: (t) => KATEGORI_TITIK.find((k) => k.value === t.kategori)?.label },
            { label: 'Koordinat', render: (t) => `${t.latitude}, ${t.longitude}` },
            { label: 'Status', render: (t) => (t.status_aktif ? 'Aktif' : 'Nonaktif') },
          ]}
          fields={[
            { name: 'nama', label: 'Nama Titik' },
            { name: 'kategori', label: 'Kategori', type: 'select', options: KATEGORI_TITIK },
            { name: 'latitude', label: 'Latitude', type: 'number', step: 'any', setengah: true },
            { name: 'longitude', label: 'Longitude', type: 'number', step: 'any', setengah: true },
            { name: 'deskripsi', label: 'Deskripsi', type: 'textarea', opsional: true, keterangan: 'Untuk pos satwa: jenis satwa & waktu terbaik berkunjung.' },
            { name: 'foto', label: 'Foto', type: 'file', opsional: true },
            BAGIAN_INGGRIS,
            { name: 'nama_en', label: 'Nama Titik (English)', opsional: true },
            { name: 'deskripsi_en', label: 'Deskripsi (English)', type: 'textarea', opsional: true },
          ]}
        />
      ) : (
        <AdminCrud
          judul="Tokoh / Pemandu"
          deskripsi="Tokoh yang dinonaktifkan tidak tampil di publik namun datanya tetap tersimpan."
          api={tokohApi}
          data={tokoh.data} loading={tokoh.loading} refetch={tokoh.refetch}
          kolom={[
            { label: 'Foto', foto: true, render: (t) => t.foto },
            { label: 'Nama', kuat: true, render: (t) => t.nama },
            { label: 'Jabatan', render: (t) => t.jabatan || '-' },
            { label: 'No. WA', render: (t) => t.no_wa || '-' },
            { label: 'Status', render: (t) => (t.status_aktif ? 'Aktif' : 'Nonaktif') },
          ]}
          fields={[
            { name: 'nama', label: 'Nama' },
            { name: 'jabatan', label: 'Jabatan', opsional: true, keterangan: 'Contoh: Pemandu Burung Pintar' },
            { name: 'spesialisasi', label: 'Spesialisasi', opsional: true },
            { name: 'bio', label: 'Biodata Singkat', type: 'textarea', rows: 3, opsional: true, keterangan: 'Tampil di halaman Tentang Kwau bagian "Orang-orang di balik Kwau".' },
            { name: 'no_wa', label: 'Nomor WhatsApp', opsional: true },
            { name: 'bahasa', label: 'Bahasa yang Dikuasai', opsional: true, keterangan: 'Penting bagi turis asing. Contoh: Indonesia, Arfak, English (dasar)' },
            { name: 'peta_titik_id', label: 'Titik Peta Terkait', type: 'select', opsional: true, options: (titik.data || []).map((t) => ({ value: t.id, label: t.nama })) },
            { name: 'foto', label: 'Foto Profil', type: 'file', opsional: true },
            BAGIAN_INGGRIS,
            { name: 'jabatan_en', label: 'Jabatan (English)', opsional: true, keterangan: 'Contoh: Bowerbird Guide' },
            { name: 'spesialisasi_en', label: 'Spesialisasi (English)', opsional: true },
            { name: 'bio_en', label: 'Biodata Singkat (English)', type: 'textarea', rows: 3, opsional: true },
          ]}
          aksiEkstra={(item, refetch) => (
            <button onClick={() => toggleTokoh(item, refetch)}
              className="rounded-full bg-amber-100 px-3.5 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-200">
              {item.status_aktif ? 'Nonaktifkan' : 'Aktifkan'}
            </button>
          )}
        />
      )}
    </div>
  );
}
