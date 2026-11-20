import { useState } from 'react';
import { Check, Users } from 'lucide-react';
import useFetch from '../../../hooks/useFetch';
import useKonten, { baris } from '../../../hooks/useKonten';
import usePengaturan, { linkWa } from '../../../hooks/usePengaturan';
import { paketApi, homestayApi } from '../../../services/api';
import SectionHeading from '../../../components/common/SectionHeading';
import PageHero from '../../../components/common/PageHero';
import Loader from '../../../components/common/Loader';
import EmptyState from '../../../components/common/EmptyState';
import Pagination from '../../../components/common/Pagination';
import ImgFallback from '../../../components/common/ImgFallback';
import Ikon, { IkonWA, IKON_FASILITAS } from '../../../components/common/Ikon';
import KartuPaket from './KartuPaket';
import { KATEGORI_PAKET } from '../../../constants';
import { useLang } from '../../../i18n/LanguageContext';

export default function DaftarPaket() {
  const { t, pick, lang } = useLang();
  const [kategori, setKategori] = useState('');
  const [page, setPage] = useState(1);
  const { data: paket, meta, loading } = useFetch(
    () => paketApi.list({ kategori: kategori || undefined, page, limit: 9 }),
    [kategori, page]
  );
  const [pageHomestay, setPageHomestay] = useState(1);
  const { data: homestay, meta: metaHomestay } = useFetch(() => homestayApi.list({ page: pageHomestay, limit: 6 }), [pageHomestay]);
  const layanan = useKonten('fasilitas-layanan');
  const pengaturan = usePengaturan();

  // Fasilitas: versi EN bila ada; jika belum diterjemahkan tetap tampil versi ID
  const daftarLayanan = baris((lang === 'en' && layanan?.isi_en) || layanan?.isi);

  return (
    <div>
      <PageHero eyebrow={t('paket.eyebrow')} judul={t('paket.judul')} teks={t('paket.teks')}>
        {/* 3 langkah reservasi */}
        <ol className="mx-auto mt-12 grid max-w-4xl gap-3 text-left sm:grid-cols-3">
          {t('paket.langkah').map(([judul, teks], i) => (
            <li key={judul} className="flex gap-4 rounded-2xl bg-white/[.06] p-5 ring-1 ring-white/10">
              <span className="font-display text-3xl font-medium leading-none text-emas-light">{i + 1}</span>
              <div>
                <p className="text-sm font-bold text-kabut">{judul}</p>
                <p className="mt-1 text-xs leading-relaxed text-kabut/60">{teks}</p>
              </div>
            </li>
          ))}
        </ol>
      </PageHero>

      <section className="wadah py-14 lg:py-20">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={t('paket.filter')}>
          {[{ value: '' }, ...KATEGORI_PAKET].map((k) => (
            <button
              key={k.value}
              role="tab"
              aria-selected={kategori === k.value}
              onClick={() => { setKategori(k.value); setPage(1); }}
              className={`filter-pil ${kategori === k.value ? 'filter-aktif' : 'filter-pasif'}`}
            >
              {k.value ? t(`kategoriPaket.${k.value}`) : t('umum.semua')}
            </button>
          ))}
        </div>

        {loading ? <Loader /> : paket?.length ? (
          <>
            <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {paket.map((p) => <KartuPaket key={p.id} paket={p} />)}
            </div>
            <Pagination meta={meta} page={page} onPage={setPage} />
          </>
        ) : (
          <div className="mt-10"><EmptyState judul={t('paket.kosongJudul')} teks={t('paket.kosongTeks')} /></div>
        )}
      </section>

      {/* Fasilitas & layanan */}
      {daftarLayanan.length > 0 && (
        <section className="bg-white py-20 lg:py-24">
          <div className="wadah">
            <SectionHeading eyebrow={t('paket.fasilitasEyebrow')} judul={t('paket.fasilitasJudul')} teks={t('paket.fasilitasTeks')} />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {daftarLayanan.map((l, i) => (
                <div key={i} className="flex items-start gap-4 rounded-3xl bg-kabut p-6 ring-1 ring-hutan-900/[.06]">
                  <span className="ikon-bulat !h-11 !w-11 !bg-white"><Ikon nama={IKON_FASILITAS[i % IKON_FASILITAS.length]} size={20} /></span>
                  <p className="pt-1 text-sm font-medium leading-relaxed text-tinta/80">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Homestay */}
      {homestay?.length > 0 && (
        <section className="wadah bagian">
          <SectionHeading eyebrow={t('paket.homestayEyebrow')} judul={t('paket.homestayJudul')} teks={t('paket.homestayTeks')} />
          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {homestay.map((h) => {
              const fasilitas = baris(pick(h, 'fasilitas'), ',');
              const wa = linkWa(pengaturan.wa_utama, t('wa.tanyaHomestay', { nama: h.nama_homestay }));
              return (
                <article key={h.id} className="kartu flex flex-col">
                  <div className="aspect-[4/3] overflow-hidden">
                    <ImgFallback src={h.foto?.[0]?.url_foto} alt={h.nama_homestay} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-xl font-medium text-hutan-950">{h.nama_homestay}</h3>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 text-xs font-medium text-tinta/50">
                      {h.nama_pemilik && <span>{t('paket.pemilik')}: {h.nama_pemilik}</span>}
                      <span className="inline-flex items-center gap-1"><Users size={13} aria-hidden="true" /> {t('paket.kapasitas', { n: h.kapasitas })}</span>
                    </p>
                    {pick(h, 'deskripsi') && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-tinta/70">{pick(h, 'deskripsi')}</p>}
                    {fasilitas.length > 0 && (
                      <ul className="mt-4 space-y-1.5">
                        {fasilitas.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-tinta/75">
                            <Check size={16} className="mt-0.5 shrink-0 text-emas-dark" aria-hidden="true" />{f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-auto pt-5">
                      <p className="text-xs leading-relaxed text-tinta/50">{t('paket.hargaMusim')}</p>
                      {wa && (
                        <a href={wa} target="_blank" rel="noreferrer" className="btn-wa mt-3 !px-4 !py-2 !text-xs">
                          <IkonWA size={15} /> {t('paket.tanyaHarga')}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <Pagination meta={metaHomestay} page={pageHomestay} onPage={setPageHomestay} />
        </section>
      )}
    </div>
  );
}
