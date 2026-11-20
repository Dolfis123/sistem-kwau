import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Languages } from 'lucide-react';
import useFetch from '../../../hooks/useFetch';
import useKonten, { baris } from '../../../hooks/useKonten';
import { satwaApi, tokohApi } from '../../../services/api';
import SectionHeading from '../../../components/common/SectionHeading';
import PageHero from '../../../components/common/PageHero';
import ImgFallback from '../../../components/common/ImgFallback';
import Pagination from '../../../components/common/Pagination';
import Ikon, { IkonWA, IKON_ATURAN } from '../../../components/common/Ikon';
import { linkWa } from '../../../hooks/usePengaturan';
import { nomorWaMe } from '../../../utils/format';
import { useLang } from '../../../i18n/LanguageContext';

// Label kecil bila konten dari admin belum punya versi bahasa Inggris
function CatatanBahasa({ tampil }) {
  const { t } = useLang();
  if (!tampil) return null;
  return (
    <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emas/10 px-3 py-1 text-[11px] font-semibold text-emas-dark">
      <Languages size={13} aria-hidden="true" /> {t('umum.hanyaIndonesia')}
    </p>
  );
}

export default function TentangKwau() {
  const { t, pick, lang, belumDiterjemahkan } = useLang();
  const sejarah = useKonten('sejarah-kampung');
  const aturan = useKonten('aturan-berkunjung');
  const marga = useKonten('marga-kampung');
  const struktur = useKonten('struktur-kampung');
  const peraturan = useKonten('peraturan-kampung');
  const [pageSatwa, setPageSatwa] = useState(1);
  const { data: satwa, meta: metaSatwa } = useFetch(() => satwaApi.list({ page: pageSatwa, limit: 9 }), [pageSatwa]);
  const { data: tokoh } = useFetch(() => tokohApi.listPublik(), []);

  // Aturan berkunjung: versi EN dari admin → bawaan EN; versi ID dari admin → bawaan ID
  const teksAturan = lang === 'en' ? aturan?.isi_en : aturan?.isi;
  const daftarAturan = baris(teksAturan, /\.|\n/).filter((s) => s.length > 3);
  const aturanTampil = daftarAturan.length ? daftarAturan : t('tentang.aturanBawaan');

  return (
    <div>
      <PageHero eyebrow={t('tentang.eyebrow')} judul={t('tentang.judul')} teks={t('tentang.teks')} />

      {/* Sejarah + peta lokasi */}
      <section className="wadah bagian">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <div>
            <SectionHeading eyebrow={t('tentang.profil')} judul={pick(sejarah, 'judul') || t('tentang.sejarahBawaan')} />
            <CatatanBahasa tampil={belumDiterjemahkan(sejarah, 'isi')} />
            <p className="mt-6 whitespace-pre-line text-[17px] leading-relaxed text-tinta/80">
              {pick(sejarah, 'isi') || t('tentang.sejarahKosong')}
            </p>
          </div>
          <div className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-3xl shadow-kartu ring-1 ring-hutan-900/10">
              <iframe
                title={t('tentang.petaJudul')}
                src="https://www.openstreetmap.org/export/embed.html?bbox=133.85%2C-1.15%2C134.05%2C-0.95&layer=mapnik&marker=-1.05%2C133.95"
                className="h-80 w-full"
                loading="lazy"
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-tinta/50">{t('tentang.petaKet')}</p>
          </div>
        </div>
      </section>

      {/* Marga & struktur kampung */}
      <section className="bg-white py-20">
        <div className="wadah grid gap-14 md:grid-cols-2">
          <div>
            <SectionHeading eyebrow={t('tentang.marga')} judul={t('tentang.margaJudul')} />
            <div className="mt-7 flex flex-wrap gap-2.5">
              {baris(marga?.isi).map((m, i) =>
                m.startsWith('(') ? (
                  <p key={i} className="mt-2 w-full text-xs text-tinta/45">{m}</p>
                ) : (
                  <span key={i} className="rounded-full bg-hutan-900 px-5 py-2.5 font-display text-[15px] text-kabut">{m}</span>
                )
              )}
              {!marga?.isi && <p className="text-sm text-tinta/50">{t('tentang.margaKosong')}</p>}
            </div>
          </div>
          <div>
            <SectionHeading eyebrow={t('tentang.pemerintahan')} judul={t('tentang.strukturJudul')} />
            <div className="mt-7 divide-y divide-hutan-900/[.08] overflow-hidden rounded-3xl bg-kabut ring-1 ring-hutan-900/[.06]">
              {baris(struktur?.isi).map((b, i) => {
                const [jabatan, nama] = b.split(':').map((x) => x?.trim());
                return (
                  <div key={i} className="flex items-center justify-between gap-4 px-5 py-4">
                    <span className="text-xs font-bold uppercase tracking-wide text-emas-dark">{jabatan}</span>
                    <span className="text-right text-sm font-semibold text-hutan-950">{nama || '-'}</span>
                  </div>
                );
              })}
              {!struktur?.isi && <p className="p-5 text-sm text-tinta/50">{t('tentang.strukturKosong')}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* Katalog satwa */}
      <section className="wadah bagian">
        <SectionHeading eyebrow={t('tentang.satwaEyebrow')} judul={t('tentang.satwaJudul')} teks={t('tentang.satwaTeks')} />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(satwa || []).map((s) => {
            const namaUtama = lang === 'en' && s.nama_en ? s.nama_en : s.nama_lokal;
            const namaKedua = lang === 'en' && s.nama_en ? s.nama_lokal : null;
            return (
              <article key={s.id} className="kartu kartu-hover flex flex-col">
                <div className="aspect-[4/3] overflow-hidden"><ImgFallback src={s.foto} alt={namaUtama} className="h-full w-full object-cover" /></div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl font-medium text-hutan-950">{namaUtama}</h3>
                      <p className="mt-0.5 text-xs text-tinta/50">
                        {s.nama_ilmiah && <em>{s.nama_ilmiah}</em>}
                        {namaKedua && <span> · {namaKedua}</span>}
                      </p>
                    </div>
                    {s.status_konservasi && (
                      <span className="chip shrink-0 bg-emas/15 text-emas-dark">{s.status_konservasi}</span>
                    )}
                  </div>
                  {pick(s, 'deskripsi') && <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-tinta/70">{pick(s, 'deskripsi')}</p>}
                </div>
              </article>
            );
          })}
          {(!satwa || satwa.length === 0) && <p className="text-sm text-tinta/50">{t('tentang.satwaKosong')}</p>}
        </div>
        <Pagination meta={metaSatwa} page={pageSatwa} onPage={setPageSatwa} />
      </section>

      {/* Aturan berkunjung */}
      <section className="bg-krem/60 py-20 lg:py-28">
        <div className="wadah">
          <SectionHeading tengah eyebrow={t('tentang.aturanEyebrow')} judul={t('tentang.aturanJudul')} teks={t('tentang.aturanTeks')} />
          <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {aturanTampil.map((a, i) => (
              <div key={i} className="flex items-start gap-4 rounded-3xl bg-white p-6 shadow-kartu">
                <span className="ikon-bulat !h-11 !w-11"><Ikon nama={IKON_ATURAN[i % IKON_ATURAN.length]} size={20} /></span>
                <p className="pt-1 text-sm font-medium leading-relaxed text-tinta/80">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Peraturan kampung (anchor dipakai dari halaman lain) */}
      <section id="peraturan-kampung" className="wadah bagian scroll-mt-24">
        <SectionHeading tengah eyebrow={t('tentang.peraturanEyebrow')} judul={t('tentang.peraturanJudul')} teks={t('tentang.peraturanTeks')} />
        <div className="text-center"><CatatanBahasa tampil={belumDiterjemahkan(peraturan, 'isi')} /></div>
        {peraturan?.isi ? (
          <ol className="mx-auto mt-10 max-w-3xl divide-y divide-hutan-900/[.08] overflow-hidden rounded-3xl bg-white shadow-kartu">
            {baris(pick(peraturan, 'isi')).map((a, i) => (
              <li key={i} className="flex items-start gap-5 p-6">
                <span className="font-display text-2xl font-medium leading-none text-emas" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-[15px] leading-relaxed text-tinta/80">{a}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-8 text-center text-sm text-tinta/50">{t('tentang.peraturanKosong')}</p>
        )}
      </section>

      {/* Pemandu & pengelola */}
      <section className="relative isolate overflow-hidden bg-hutan-950 py-20 lg:py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_90%_0%,rgba(201,134,44,.15),transparent_55%)]" />
        <div className="wadah">
          <SectionHeading gelap eyebrow={t('tentang.tokohEyebrow')} judul={t('tentang.tokohJudul')} teks={t('tentang.tokohTeks')} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(tokoh || []).map((p) => {
              const wa = p.no_wa ? linkWa(nomorWaMe(p.no_wa), t('wa.pemandu', { nama: p.nama })) : null;
              return (
                <article key={p.id} className="flex flex-col rounded-3xl bg-white/[.04] p-7 ring-1 ring-white/10">
                  <div className="flex items-center gap-4">
                    <ImgFallback src={p.foto} alt={p.nama} className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-emas/40" />
                    <div>
                      <h3 className="font-display text-xl font-medium leading-snug text-kabut">{p.nama}</h3>
                      <p className="text-xs font-bold uppercase tracking-wide text-emas-light">{pick(p, 'jabatan')}</p>
                    </div>
                  </div>
                  {pick(p, 'bio') && <p className="mt-5 text-sm leading-relaxed text-kabut/70">{pick(p, 'bio')}</p>}
                  <dl className="mt-4 space-y-1 text-xs text-kabut/55">
                    {pick(p, 'spesialisasi') && <div><dt className="inline font-bold text-kabut/70">{t('tentang.spesialisasi')}: </dt><dd className="inline">{pick(p, 'spesialisasi')}</dd></div>}
                    {p.bahasa && <div><dt className="inline font-bold text-kabut/70">{t('tentang.bahasa')}: </dt><dd className="inline">{p.bahasa}</dd></div>}
                  </dl>
                  {wa && (
                    <a href={wa} target="_blank" rel="noreferrer" className="btn-wa mt-6 !py-2.5 !text-xs">
                      <IkonWA size={16} /> {t('umum.chatWa')}
                    </a>
                  )}
                </article>
              );
            })}
            {(!tokoh || tokoh.length === 0) && <p className="text-kabut/60">{t('tentang.tokohKosong')}</p>}
          </div>
        </div>
      </section>

      <section className="wadah py-20 text-center">
        <p className="font-display text-3xl font-medium text-hutan-950">{t('tentang.infoJudul')}</p>
        <Link to="/informasi" className="btn-garis mt-7">{t('tentang.infoTombol')}</Link>
      </section>
    </div>
  );
}
