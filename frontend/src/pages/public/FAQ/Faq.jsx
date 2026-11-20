import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import useFetch from '../../../hooks/useFetch';
import usePengaturan, { linkWa } from '../../../hooks/usePengaturan';
import { faqApi } from '../../../services/api';
import PageHero from '../../../components/common/PageHero';
import SectionHeading from '../../../components/common/SectionHeading';
import Loader from '../../../components/common/Loader';
import EmptyState from '../../../components/common/EmptyState';
import Ikon, { IkonWA } from '../../../components/common/Ikon';
import { useLang } from '../../../i18n/LanguageContext';

export default function Faq() {
  const { t, pick } = useLang();
  const { data: faq, loading } = useFetch(() => faqApi.list(), []);
  const pengaturan = usePengaturan();
  const [terbuka, setTerbuka] = useState(null);
  const wa = linkWa(pengaturan.wa_utama, t('wa.sapaan'));

  const perKategori = useMemo(() => {
    const grup = {};
    (faq || []).forEach((f) => { (grup[f.kategori] = grup[f.kategori] || []).push(f); });
    return grup;
  }, [faq]);

  return (
    <div>
      <PageHero eyebrow={t('faq.eyebrow')} judul={t('faq.judul')} teks={t('faq.teks')} />

      {/* Hal penting untuk wisatawan (terutama mancanegara) */}
      <section className="wadah py-16 lg:py-20">
        <SectionHeading eyebrow={t('faq.esensialEyebrow')} judul={t('faq.esensialJudul')} />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t('faq.esensial').map(([ikon, judul, teks]) => (
            <div key={judul} className="rounded-3xl bg-white p-7 shadow-kartu ring-1 ring-hutan-900/[.05]">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emas/15 text-emas-dark"><Ikon nama={ikon} size={21} /></span>
              <p className="mt-5 font-display text-xl font-medium text-hutan-950">{judul}</p>
              <p className="mt-2 text-sm leading-relaxed text-tinta/65">{teks}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="eyebrow">{t('faq.pertanyaanEyebrow')}</p>
          {loading ? <Loader /> : Object.keys(perKategori).length ? (
            Object.entries(perKategori).map(([kategori, daftar]) => (
              <div key={kategori} className="mt-10">
                <h2 className="font-display text-2xl font-medium text-hutan-950">{t(`kategoriFaq.${kategori}`)}</h2>
                <div className="mt-4 divide-y divide-hutan-900/[.08] border-y border-hutan-900/[.08]">
                  {daftar.map((f) => {
                    const buka = terbuka === f.id;
                    return (
                      <div key={f.id}>
                        <button
                          onClick={() => setTerbuka(buka ? null : f.id)}
                          aria-expanded={buka}
                          className="flex w-full items-center justify-between gap-6 py-5 text-left text-[15px] font-semibold text-hutan-950 transition hover:text-hutan-700"
                        >
                          {pick(f, 'pertanyaan')}
                          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ring-hutan-900/15 transition ${buka ? 'rotate-45 bg-hutan-900 text-kabut' : 'text-hutan-800'}`} aria-hidden="true">
                            <Plus size={16} />
                          </span>
                        </button>
                        {buka && (
                          <p className="whitespace-pre-line pb-6 pr-12 text-[15px] leading-relaxed text-tinta/70">{pick(f, 'jawaban')}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="mt-8"><EmptyState judul={t('faq.kosong')} /></div>
          )}

          <p className="mt-10 text-sm text-tinta/65">
            {t('faq.aturanTanya')}{' '}
            <Link to="/tentang#peraturan-kampung" className="tautan">{t('faq.aturanLink')}</Link>
          </p>
        </div>
      </section>

      {wa && (
        <section className="wadah py-20">
          <div className="flex flex-col items-center justify-between gap-6 rounded-[2rem] bg-hutan-900 px-8 py-12 text-center md:flex-row md:text-left">
            <div>
              <p className="font-display text-3xl font-medium text-kabut">{t('faq.masihTanya')}</p>
              <p className="mt-2 text-kabut/70">{t('faq.masihTanyaTeks')}</p>
            </div>
            <a href={wa} target="_blank" rel="noreferrer" className="btn-wa shrink-0"><IkonWA size={18} /> {t('umum.chatWa')}</a>
          </div>
        </section>
      )}
    </div>
  );
}
