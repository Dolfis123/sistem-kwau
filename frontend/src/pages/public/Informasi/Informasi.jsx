// V3: Blog Informasi Kampung — berita dan kegiatan dengan kategori
import { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import { beritaApi } from '../../../services/api';
import SectionHeading from '../../../components/common/SectionHeading';
import Loader from '../../../components/common/Loader';
import EmptyState from '../../../components/common/EmptyState';
import Pagination from '../../../components/common/Pagination';
import ImgFallback from '../../../components/common/ImgFallback';
import { formatTanggal } from '../../../utils/format';
import { KATEGORI_BERITA } from '../../../constants';

export default function Informasi() {
  const [page, setPage] = useState(1);
  const [kategori, setKategori] = useState('');
  const { data: berita, meta, loading } = useFetch(
    () => beritaApi.list({ page, limit: 9, kategori: kategori || undefined }), [page, kategori]
  );

  const unggulan = page === 1 && berita?.length ? berita[0] : null;
  const sisanya = unggulan ? berita.slice(1) : berita || [];

  return (
    <div className="pt-16">
      <section className="bg-hutan-950 py-14 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <SectionHeading tengah gelap eyebrow="Informasi Kampung" judul="Kabar dari Kwau"
            teks="Berita, hasil musyawarah, kabar pertanian, konservasi, dan pengumuman — langsung dari kampung, dikelola oleh pegawai kampung." />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Filter kategori */}
        <div className="flex flex-wrap gap-2">
          {['', ...KATEGORI_BERITA].map((k) => (
            <button key={k} onClick={() => { setKategori(k); setPage(1); }}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                kategori === k ? 'bg-hutan-900 text-kabut' : 'bg-white text-hutan-900 shadow-sm hover:bg-hutan-100'
              }`}>
              {k || 'Semua'}
            </button>
          ))}
        </div>

        {loading ? <Loader /> : berita?.length ? (
          <>
            {/* Artikel unggulan (terbaru) */}
            {unggulan && (
              <Link to={`/informasi/${unggulan.id}`}
                className="kartu group mt-8 grid overflow-hidden transition hover:-translate-y-1 md:grid-cols-2">
                <div className="aspect-[16/10] md:aspect-auto">
                  <ImgFallback src={unggulan.foto_sampul} alt={unggulan.judul} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-col justify-center p-7 lg:p-10">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-emas px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-hutan-950">{unggulan.kategori}</span>
                    <span className="text-xs font-semibold text-tinta/45">{formatTanggal(unggulan.tanggal_terbit)}</span>
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-semibold leading-snug text-hutan-950 lg:text-3xl">{unggulan.judul}</h2>
                  <span className="mt-5 text-sm font-bold text-emas-dark">Baca artikel terbaru →</span>
                </div>
              </Link>
            )}

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sisanya.map((b) => (
                <Link key={b.id} to={`/informasi/${b.id}`} className="kartu group flex flex-col transition duration-300 hover:-translate-y-1.5">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <ImgFallback src={b.foto_sampul} alt={b.judul} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <span className="absolute left-3 top-3 rounded-full bg-hutan-950/85 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emas-light backdrop-blur">{b.kategori}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-semibold text-tinta/45">{formatTanggal(b.tanggal_terbit)}</p>
                    <h2 className="mt-1.5 font-display text-lg font-semibold leading-snug text-hutan-950">{b.judul}</h2>
                    <span className="mt-auto pt-4 text-xs font-bold text-hutan-700 group-hover:text-emas-dark">Baca selengkapnya →</span>
                  </div>
                </Link>
              ))}
            </div>
            <Pagination meta={meta} page={page} onPage={setPage} />
          </>
        ) : (
          <div className="mt-8"><EmptyState judul="Belum ada informasi di kategori ini" teks="Silakan pilih kategori lain." /></div>
        )}
      </section>
    </div>
  );
}
