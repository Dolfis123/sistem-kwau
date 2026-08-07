import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import { faqApi } from '../../../services/api';
import SectionHeading from '../../../components/common/SectionHeading';
import Loader from '../../../components/common/Loader';
import EmptyState from '../../../components/common/EmptyState';

export default function Faq() {
  const { data: faq, loading } = useFetch(() => faqApi.list(), []);
  const [terbuka, setTerbuka] = useState(null);

  const perKategori = useMemo(() => {
    const grup = {};
    (faq || []).forEach((f) => {
      (grup[f.kategori] = grup[f.kategori] || []).push(f);
    });
    return grup;
  }, [faq]);

  return (
    <div className="pt-16">
      <section className="bg-hutan-950 py-14 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <SectionHeading tengah gelap eyebrow="Pusat Informasi & FAQ" judul="Siapkan perjalanan Anda"
            teks="Jawaban untuk pertanyaan yang paling sering diajukan — dari perlengkapan sampai cara pembayaran." />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* Kartu musim terbaik */}
        <div className="mb-10 flex items-start gap-4 rounded-2xl bg-emas/10 p-6">
          <span className="text-3xl" aria-hidden="true">🌤</span>
          <div>
            <p className="font-display font-semibold text-hutan-950">Musim terbaik berkunjung</p>
            <p className="mt-1 text-sm leading-relaxed text-tinta/70">
              Pengamatan burung paling baik dilakukan pagi hari (05.30–09.00 WIT). Musim kemarau (Juni–Oktober) umumnya
              lebih bersahabat untuk trekking, namun hutan Arfak bisa hujan kapan saja — selalu bawa jas hujan.
            </p>
          </div>
        </div>

        {loading ? <Loader /> : Object.keys(perKategori).length ? (
          Object.entries(perKategori).map(([kategori, daftar]) => (
            <div key={kategori} className="mb-8">
              <p className="eyebrow">{kategori}</p>
              <div className="mt-3 space-y-2.5">
                {daftar.map((f) => {
                  const buka = terbuka === f.id;
                  return (
                    <div key={f.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                      <button
                        onClick={() => setTerbuka(buka ? null : f.id)}
                        aria-expanded={buka}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-bold text-hutan-950"
                      >
                        {f.pertanyaan}
                        <span className={`shrink-0 text-emas-dark transition-transform ${buka ? 'rotate-45' : ''}`} aria-hidden="true">＋</span>
                      </button>
                      {buka && (
                        <p className="whitespace-pre-line border-t border-hutan-900/8 px-5 py-4 text-sm leading-relaxed text-tinta/75">
                          {f.jawaban}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <EmptyState judul="FAQ belum tersedia" />
        )}

        <div className="mt-6 rounded-2xl bg-hutan-100/60 p-5 text-center text-sm text-tinta/70">
          Ingin tahu aturan saat berada di dalam kampung dan hutan?{' '}
          <Link to="/tentang" className="font-bold text-hutan-800 underline decoration-emas decoration-2 underline-offset-2">
            Baca Aturan Berkunjung
          </Link>
        </div>
      </section>
    </div>
  );
}
