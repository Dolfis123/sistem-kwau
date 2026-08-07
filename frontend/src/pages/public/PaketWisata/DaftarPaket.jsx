import { useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import { paketApi, homestayApi, kontenApi } from '../../../services/api';
import SectionHeading from '../../../components/common/SectionHeading';
import Loader from '../../../components/common/Loader';
import EmptyState from '../../../components/common/EmptyState';
import Pagination from '../../../components/common/Pagination';
import ImgFallback from '../../../components/common/ImgFallback';
import KartuPaket from './KartuPaket';
import { KATEGORI_PAKET } from '../../../constants';

export default function DaftarPaket() {
  const [kategori, setKategori] = useState('');
  const [page, setPage] = useState(1);
  const { data: paket, meta, loading } = useFetch(
    () => paketApi.list({ kategori: kategori || undefined, page, limit: 9 }),
    [kategori, page]
  );
  const [pageHomestay, setPageHomestay] = useState(1);
  const { data: homestay, meta: metaHomestay } = useFetch(() => homestayApi.list({ page: pageHomestay, limit: 6 }), [pageHomestay]);
  const { data: layanan } = useFetch(() => kontenApi.getBySlug('fasilitas-layanan').catch(() => ({ data: { data: null } })), []);
  const { data: pengaturan } = useFetch(() => kontenApi.getPengaturan(), []);
  const IKON_LAYANAN = ['🚙', '🛖', '🥾', '🍽', '🎒', '⛑', '💧', '🥾'];

  return (
    <div className="pt-16">
      <section className="bg-hutan-950 py-16 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <SectionHeading tengah gelap eyebrow="Paket Wisata & Reservasi" judul="Rencanakan kunjungan Anda"
            teks="Pilih paket, isi form reservasi, lalu konfirmasi langsung melalui WhatsApp Pokdarwis. Tanpa pembayaran online — sederhana dan aman." />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Filter kategori */}
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter kategori paket">
          {[{ value: '', label: 'Semua' }, ...KATEGORI_PAKET].map((k) => (
            <button
              key={k.value}
              role="tab"
              aria-selected={kategori === k.value}
              onClick={() => { setKategori(k.value); setPage(1); }}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                kategori === k.value ? 'bg-hutan-900 text-kabut' : 'bg-white text-hutan-900 shadow-sm hover:bg-hutan-100'
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>

        {loading ? <Loader /> : paket?.length ? (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paket.map((p) => <KartuPaket key={p.id} paket={p} />)}
            </div>
            <Pagination meta={meta} page={page} onPage={setPage} />
          </>
        ) : (
          <div className="mt-8"><EmptyState judul="Belum ada paket di kategori ini" teks="Silakan pilih kategori lain atau kembali lagi nanti." /></div>
        )}
      </section>

      {/* V3: Fasilitas & Layanan Wisata */}
      {layanan?.isi && (
        <section className="bg-hutan-100/50 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading eyebrow="Fasilitas dan Layanan" judul="Yang kami siapkan untuk kenyamanan Anda"
              teks="Setiap paket didukung fasilitas standar kampung wisata — dari penjemputan sampai pondok pemotretan." />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {layanan.isi.split('\n').map((l) => l.trim()).filter(Boolean).map((l, i) => (
                <div key={i} className="flex items-start gap-3.5 rounded-2xl bg-white p-5 shadow-sm">
                  <span className="text-2xl" aria-hidden="true">{IKON_LAYANAN[i % IKON_LAYANAN.length]}</span>
                  <p className="pt-0.5 text-sm font-medium leading-relaxed text-tinta/80">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Homestay */}
      {homestay?.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <SectionHeading eyebrow="Menginap di Kwau" judul="Homestay milik warga"
            teks="Kamar sederhana yang hangat — setiap malam menginap adalah dukungan langsung bagi keluarga pemiliknya." />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {homestay.map((h) => (
              <div key={h.id} className="kartu">
                <div className="aspect-[4/3]">
                  <ImgFallback src={h.foto?.[0]?.url_foto} alt={h.nama_homestay} className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-hutan-950">{h.nama_homestay}</h3>
                  <p className="text-xs font-medium text-tinta/50">Pemilik: {h.nama_pemilik || '-'} · Kapasitas {h.kapasitas} orang</p>
                  {h.fasilitas && (
                    <ul className="mt-3 space-y-1">
                      {h.fasilitas.split(',').map((f) => f.trim()).filter(Boolean).map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-tinta/75">
                          <span className="mt-0.5 text-emas-dark" aria-hidden="true">✓</span>{f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-3 text-xs font-semibold leading-relaxed text-tinta/55">
                    💬 Harga per malam menyesuaikan musim — tanyakan langsung ke Pokdarwis.
                  </p>
                  {pengaturan?.wa_utama && (
                    <a href={`https://wa.me/${pengaturan.wa_utama}?text=${encodeURIComponent(`Halo Pokdarwis Kwau, saya ingin menanyakan harga menginap di ${h.nama_homestay}.`)}`}
                      target="_blank" rel="noreferrer"
                      className="mt-2 inline-block rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700">
                      Tanya Harga
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Pagination meta={metaHomestay} page={pageHomestay} onPage={setPageHomestay} />
        </section>
      )}
    </div>
  );
}
