// V3: Hasil Pertanian — dikelola role ADMIN PERTANIAN
import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { pertanianApi } from '../../services/api';
import AdminCrud from '../../components/common/AdminCrud';
import { KATEGORI_PERTANIAN } from '../../constants';

export default function ManajemenPertanian() {
  const [page, setPage] = useState(1);
  const { data, meta, loading, refetch } = useFetch(() => pertanianApi.list({ page, limit: 10 }), [page]);

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-semibold text-hutan-950">Manajemen Hasil Pertanian</h1>
      <p className="mb-6 text-sm text-tinta/55">Potensi kebun kampung yang tampil di halaman Hasil Pertanian — lengkap dengan kalender panen otomatis.</p>
      <AdminCrud judul="Hasil Pertanian" api={pertanianApi} namaField="nama"
        data={data} loading={loading} refetch={refetch}
        meta={meta} page={page} onPage={setPage}
        kolom={[
          { label: 'Foto', foto: true, render: (p) => p.foto },
          { label: 'Nama', kuat: true, render: (p) => p.nama },
          { label: 'Kategori', render: (p) => p.kategori },
          { label: 'Bulan Panen', render: (p) => p.bulan_panen || '-' },
          { label: 'Frekuensi', render: (p) => p.frekuensi_panen || '-' },
        ]}
        fields={[
          { name: 'nama', label: 'Nama Produk' },
          { name: 'kategori', label: 'Kategori', type: 'select', options: KATEGORI_PERTANIAN.map((k) => ({ value: k, label: k })) },
          { name: 'bulan_panen', label: 'Bulan Panen', opsional: true, keterangan: 'Tulis nama bulan agar kalender panen menyala otomatis. Contoh: "Mei – September", "Februari, Juni, Oktober", atau "Sepanjang tahun".' },
          { name: 'frekuensi_panen', label: 'Frekuensi Panen', opsional: true, keterangan: 'Contoh: 2x panen per tahun', setengah: true },
          { name: 'harga_kisaran', label: 'Kisaran Harga', opsional: true, keterangan: 'Contoh: Rp15.000–20.000 / kg', setengah: true },
          { name: 'deskripsi', label: 'Deskripsi', type: 'textarea', opsional: true },
          { name: 'foto', label: 'Foto', type: 'file', opsional: true },
        ]}
      />
    </div>
  );
}
