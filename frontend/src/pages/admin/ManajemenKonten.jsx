// Konten WISATA — dikelola role Admin Konten (Wisata)
import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { satwaApi, faqApi, homestayApi, galeriKampungApi } from '../../services/api';
import AdminCrud from '../../components/common/AdminCrud';
import EditorStatis from '../../components/common/EditorStatis';
import { BAGIAN_INGGRIS } from '../../constants/bahasaInggris';

const TAB = [
  ['satwa', 'Katalog Satwa'],
  ['homestay', 'Homestay'],
  ['galeri', 'Pesona Kwau (Beranda)'],
  ['faq', 'FAQ'],
  ['statis', 'Halaman Wisata'],
];

export default function ManajemenKonten() {
  const [tab, setTab] = useState('satwa');
  const [pageSatwa, setPageSatwa] = useState(1);
  const [pageHomestay, setPageHomestay] = useState(1);
  const [pageGaleri, setPageGaleri] = useState(1);
  const satwa = useFetch(() => satwaApi.list({ page: pageSatwa, limit: 10 }), [pageSatwa]);
  const faq = useFetch(() => faqApi.list(), []);
  const homestay = useFetch(() => homestayApi.list({ page: pageHomestay, limit: 10 }), [pageHomestay]);
  const galeri = useFetch(() => galeriKampungApi.list({ page: pageGaleri, limit: 10 }), [pageGaleri]);

  return (
    <div>
      <h1 className="admin-judul">Manajemen Konten Wisata</h1>
      <p className="admin-sub">Satwa, homestay, galeri pesona, FAQ, dan halaman statis wisata. Berita kampung dikelola oleh Pegawai Kampung di menu Informasi Kampung.</p>

      <div className="admin-tabs mb-6 mt-5">
        {TAB.map(([v, label]) => (
          <button key={v} onClick={() => setTab(v)}
            className={`admin-tab ${tab === v ? 'admin-tab-aktif' : 'admin-tab-pasif'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'satwa' && (
        <AdminCrud judul="Satwa Endemik" api={satwaApi} namaField="nama_lokal"
          data={satwa.data} loading={satwa.loading} refetch={satwa.refetch}
          meta={satwa.meta} page={pageSatwa} onPage={setPageSatwa}
          kolom={[
            { label: 'Foto', foto: true, render: (s) => s.foto },
            { label: 'Nama Lokal', kuat: true, render: (s) => s.nama_lokal },
            { label: 'Nama Ilmiah', render: (s) => s.nama_ilmiah || '-' },
            { label: 'Status Konservasi', render: (s) => s.status_konservasi || '-' },
            { label: 'English', render: (s) => (s.deskripsi_en ? '✓ Ada' : '— Belum') },
          ]}
          fields={[
            { name: 'nama_lokal', label: 'Nama Lokal' },
            { name: 'nama_ilmiah', label: 'Nama Ilmiah', opsional: true },
            { name: 'status_konservasi', label: 'Status Konservasi (IUCN)', opsional: true, keterangan: 'Contoh: Risiko Rendah (LC), Rentan (VU)' },
            { name: 'deskripsi', label: 'Deskripsi', type: 'textarea', opsional: true },
            { name: 'foto', label: 'Foto', type: 'file', opsional: true },
            BAGIAN_INGGRIS,
            { name: 'nama_en', label: 'Nama Umum (English)', opsional: true, keterangan: 'Contoh: Vogelkop Bowerbird, Western Parotia' },
            { name: 'deskripsi_en', label: 'Deskripsi (English)', type: 'textarea', opsional: true },
          ]}
        />
      )}
      {tab === 'homestay' && (
        <AdminCrud judul="Homestay" api={homestayApi} namaField="nama_homestay"
          data={homestay.data} loading={homestay.loading} refetch={homestay.refetch}
          meta={homestay.meta} page={pageHomestay} onPage={setPageHomestay}
          kolom={[
            { label: 'Foto', foto: true, render: (h) => h.foto?.[0]?.url_foto },
            { label: 'Nama Homestay', kuat: true, render: (h) => h.nama_homestay },
            { label: 'Pemilik', render: (h) => h.nama_pemilik || '-' },
            { label: 'Kapasitas', render: (h) => `${h.kapasitas} orang` },
          ]}
          fields={[
            { name: 'nama_homestay', label: 'Nama Homestay' },
            { name: 'nama_pemilik', label: 'Nama Pemilik', opsional: true },
            { name: 'harga_per_malam', label: 'Harga per Malam (Rp) — internal', type: 'number', min: 0, opsional: true, setengah: true, keterangan: 'Tidak tampil di publik.' },
            { name: 'kapasitas', label: 'Kapasitas (orang)', type: 'number', min: 1, default: 2, setengah: true },
            { name: 'fasilitas', label: 'Fasilitas', type: 'textarea', rows: 3, opsional: true, keterangan: 'Pisahkan dengan koma — di situs publik tampil sebagai daftar centang. Contoh: 2 kamar tidur, MCK dalam, makan 3x sehari' },
            { name: 'deskripsi', label: 'Deskripsi', type: 'textarea', rows: 3, opsional: true },
            { name: 'foto', label: 'Foto (bisa lebih dari satu)', type: 'file', multiple: true, opsional: true },
            BAGIAN_INGGRIS,
            { name: 'fasilitas_en', label: 'Fasilitas (English)', type: 'textarea', rows: 3, opsional: true, keterangan: 'Pisahkan dengan koma. Contoh: 2 bedrooms, private bathroom, 3 meals a day' },
            { name: 'deskripsi_en', label: 'Deskripsi (English)', type: 'textarea', rows: 3, opsional: true },
          ]}
        />
      )}
      {tab === 'galeri' && (
        <AdminCrud judul="Pesona Kwau" api={galeriKampungApi} namaField="judul"
          deskripsi="Foto keindahan kampung yang tampil di section 'Pesona Kwau' halaman Beranda."
          data={galeri.data} loading={galeri.loading} refetch={galeri.refetch}
          meta={galeri.meta} page={pageGaleri} onPage={setPageGaleri}
          kolom={[
            { label: 'Foto', foto: true, render: (g) => g.url_foto },
            { label: 'Judul', kuat: true, render: (g) => g.judul },
            { label: 'Urutan', render: (g) => g.urutan },
          ]}
          fields={[
            { name: 'judul', label: 'Judul Foto' },
            { name: 'urutan', label: 'Urutan Tampil', type: 'number', min: 0, default: 0 },
            { name: 'foto', label: 'Foto', type: 'file', opsional: true, keterangan: 'Wajib saat menambah baru; kosongkan saat edit jika tidak ganti foto.' },
            BAGIAN_INGGRIS,
            { name: 'judul_en', label: 'Judul Foto (English)', opsional: true },
          ]}
        />
      )}
      {tab === 'faq' && (
        <AdminCrud judul="FAQ" api={faqApi} pakaiFormData={false} namaField="pertanyaan"
          data={faq.data} loading={faq.loading} refetch={faq.refetch}
          kolom={[
            { label: 'Kategori', render: (f) => f.kategori },
            { label: 'Pertanyaan', kuat: true, render: (f) => f.pertanyaan },
            { label: 'English', render: (f) => (f.jawaban_en ? '✓ Ada' : '— Belum') },
            { label: 'Urutan', render: (f) => f.urutan },
          ]}
          fields={[
            { name: 'kategori', label: 'Kategori', type: 'select', options: ['Persiapan', 'Akses', 'Reservasi', 'Keamanan', 'Umum'].map((k) => ({ value: k, label: k })) },
            { name: 'urutan', label: 'Urutan Tampil', type: 'number', min: 0, default: 0 },
            { name: 'pertanyaan', label: 'Pertanyaan', type: 'textarea', rows: 2 },
            { name: 'jawaban', label: 'Jawaban', type: 'textarea' },
            BAGIAN_INGGRIS,
            { name: 'pertanyaan_en', label: 'Pertanyaan (English)', type: 'textarea', rows: 2, opsional: true },
            { name: 'jawaban_en', label: 'Jawaban (English)', type: 'textarea', opsional: true },
          ]}
        />
      )}
      {tab === 'statis' && (
        <EditorStatis
          slugs={['sekilas-kwau', 'aturan-berkunjung', 'fasilitas-layanan']}
          keterangan="Aturan Berkunjung & Fasilitas: tulis satu poin per baris — di situs publik otomatis tampil sebagai kartu berikon."
        />
      )}
    </div>
  );
}
