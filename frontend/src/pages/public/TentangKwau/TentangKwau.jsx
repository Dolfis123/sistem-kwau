import { Link } from 'react-router-dom';
import { useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import { kontenApi, satwaApi, tokohApi } from '../../../services/api';
import SectionHeading from '../../../components/common/SectionHeading';
import ImgFallback from '../../../components/common/ImgFallback';
import GarisKontur from '../../../components/common/GarisKontur';
import Pagination from '../../../components/common/Pagination';

const ATURAN_IKON = ['🚫', '🤫', '🗑', '📷', '👣', '🌱'];

export default function TentangKwau() {
  const { data: sejarah } = useFetch(() => kontenApi.getBySlug('sejarah-kampung').catch(() => ({ data: { data: null } })), []);
  const { data: aturan } = useFetch(() => kontenApi.getBySlug('aturan-berkunjung').catch(() => ({ data: { data: null } })), []);
  const [pageSatwa, setPageSatwa] = useState(1);
  const { data: satwa, meta: metaSatwa } = useFetch(() => satwaApi.list({ page: pageSatwa, limit: 9 }), [pageSatwa]);
  const { data: tokoh } = useFetch(() => tokohApi.listPublik(), []);
  const { data: marga } = useFetch(() => kontenApi.getBySlug('marga-kampung').catch(() => ({ data: { data: null } })), []);
  const { data: struktur } = useFetch(() => kontenApi.getBySlug('struktur-kampung').catch(() => ({ data: { data: null } })), []);
  const { data: peraturan } = useFetch(() => kontenApi.getBySlug('peraturan-kampung').catch(() => ({ data: { data: null } })), []);

  const daftarAturan = (aturan?.isi || '').split(/\.|\n/).map((s) => s.trim()).filter((s) => s.length > 3);

  return (
    <div className="pt-16">
      <section className="relative overflow-hidden bg-hutan-950 py-16">
        <GarisKontur className="absolute inset-x-0 bottom-0 h-32 w-full text-emas" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <SectionHeading tengah gelap eyebrow="Tentang Kwau" judul="Sejarah, ekologi, dan orang-orangnya"
            teks="Memahami Kwau berarti memahami hubungan panjang antara masyarakat Arfak dan hutannya." />
        </div>
      </section>

      {/* Sejarah */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <SectionHeading eyebrow="Profil Kampung" judul={sejarah?.judul || 'Sejarah Kampung'} />
        <p className="mt-5 whitespace-pre-line leading-relaxed text-tinta/80">
          {sejarah?.isi || 'Profil dan sejarah kampung akan segera ditampilkan di sini.'}
        </p>
        <div className="mt-8 overflow-hidden rounded-3xl border border-hutan-900/10">
          <iframe
            title="Peta lokasi Kampung Kwau"
            src="https://www.openstreetmap.org/export/embed.html?bbox=133.85%2C-1.15%2C134.05%2C-0.95&layer=mapnik&marker=-1.05%2C133.95"
            className="h-72 w-full"
            loading="lazy"
          />
        </div>
        <p className="mt-2 text-xs text-tinta/45">Posisi Kwau relatif terhadap Kota Manokwari — buka halaman Peta Interaktif untuk detail titik di dalam kampung.</p>
      </section>

      {/* V3: Marga & Struktur Pemerintahan Kampung */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Marga" judul="Marga di Kampung Kwau" />
            <div className="mt-5 flex flex-wrap gap-2">
              {(marga?.isi || '').split('\n').map((m) => m.trim()).filter(Boolean).map((m, i) =>
                m.startsWith('(') ? (
                  <p key={i} className="mt-2 w-full text-xs text-tinta/45">{m}</p>
                ) : (
                  <span key={i} className="rounded-full bg-hutan-800 px-5 py-2 text-sm font-bold text-kabut">{m}</span>
                )
              )}
              {!marga?.isi && <p className="text-sm text-tinta/50">Daftar marga akan segera ditampilkan.</p>}
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Pemerintahan" judul="Struktur Kampung" />
            <div className="mt-5 space-y-2">
              {(struktur?.isi || '').split('\n').map((b) => b.trim()).filter(Boolean).map((b, i) => {
                const [jabatan, nama] = b.split(':').map((x) => x?.trim());
                return (
                  <div key={i} className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wide text-emas-dark">{jabatan}</span>
                    <span className="text-sm font-semibold text-hutan-950">{nama || '-'}</span>
                  </div>
                );
              })}
              {!struktur?.isi && <p className="text-sm text-tinta/50">Struktur kampung akan segera ditampilkan.</p>}
            </div>
          </div>
        </div>
      </section>

      {/* Katalog satwa */}
      <section className="bg-hutan-100/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Katalog Satwa Endemik" judul="Tetangga kami di hutan Arfak"
            teks="Setiap spesies di bawah ini hidup bebas di sekitar kampung — dan menjadi alasan utama kampung ini menjaga hutannya." />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(satwa || []).map((s) => (
              <article key={s.id} className="kartu">
                <div className="aspect-[4/3]"><ImgFallback src={s.foto} alt={s.nama_lokal} className="h-full w-full object-cover" /></div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-hutan-950">{s.nama_lokal}</h3>
                      {s.nama_ilmiah && <p className="text-xs italic text-tinta/50">{s.nama_ilmiah}</p>}
                    </div>
                    {s.status_konservasi && (
                      <span className="shrink-0 rounded-full bg-emas/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-emas-dark">{s.status_konservasi}</span>
                    )}
                  </div>
                  {s.deskripsi && <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-tinta/70">{s.deskripsi}</p>}
                </div>
              </article>
            ))}
            {(!satwa || satwa.length === 0) && <p className="text-sm text-tinta/50">Katalog satwa akan segera ditampilkan.</p>}
          </div>
          <Pagination meta={metaSatwa} page={pageSatwa} onPage={setPageSatwa} />
        </div>
      </section>

      {/* Aturan berkunjung */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <SectionHeading tengah eyebrow="Aturan Berkunjung" judul="Datang sebagai tamu hutan"
          teks="Beberapa hal sederhana yang menjaga satwa tetap liar dan kampung tetap nyaman." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {(daftarAturan.length ? daftarAturan : ['Dilarang memberi makan satwa liar', 'Jaga jarak dari sarang dan arena tari burung', 'Bawa kembali sampah Anda']).map((a, i) => (
            <div key={i} className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm">
              <span className="text-2xl" aria-hidden="true">{ATURAN_IKON[i % ATURAN_IKON.length]}</span>
              <p className="pt-0.5 text-sm font-medium leading-relaxed text-tinta/80">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* V4: Peraturan Kampung (dengan anchor agar bisa ditautkan dari halaman lain) */}
      <section id="peraturan-kampung" className="mx-auto max-w-5xl scroll-mt-24 px-4 pb-16 sm:px-6">
        <SectionHeading tengah eyebrow="Peraturan Kampung" judul="Kesepakatan yang kami pegang bersama"
          teks="Selain aturan di dalam hutan, kampung memiliki peraturan yang berlaku bagi setiap tamu selama berada di wilayah Kwau." />
        {peraturan?.isi ? (
          <ol className="mx-auto mt-10 max-w-3xl space-y-3">
            {peraturan.isi.split('\n').map((a) => a.trim()).filter(Boolean).map((a, i) => (
              <li key={i} className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-hutan-800 font-display text-sm font-bold text-emas-light" aria-hidden="true">{i + 1}</span>
                <p className="pt-1 text-sm font-medium leading-relaxed text-tinta/80">{a}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-8 text-center text-sm text-tinta/50">
            Peraturan kampung belum diisi. (Admin: jalankan "npm run seed" di backend, lalu edit melalui menu Informasi Kampung → Profil Kampung.)
          </p>
        )}
      </section>

      {/* V2: Pemandu & Pengelola Kampung */}
      <section className="bg-hutan-950 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading gelap eyebrow="Pemandu dan Pengelola" judul="Orang-orang di balik Kwau"
            teks="Mereka yang paling mengenal hutan ini — dan yang akan menemani setiap langkah Anda." />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(tokoh || []).map((t) => (
              <article key={t.id} className="kartu p-6">
                <div className="flex items-center gap-4">
                  <ImgFallback src={t.foto} alt={t.nama} className="h-16 w-16 shrink-0 rounded-full object-cover" />
                  <div>
                    <h3 className="font-display text-lg font-semibold leading-snug text-hutan-950">{t.nama}</h3>
                    <p className="text-xs font-bold uppercase tracking-wide text-emas-dark">{t.jabatan}</p>
                  </div>
                </div>
                {t.bio && <p className="mt-4 text-sm leading-relaxed text-tinta/70">{t.bio}</p>}
                {t.spesialisasi && <p className="mt-2 text-xs font-semibold text-tinta/50">Spesialisasi: {t.spesialisasi}</p>}
                {t.no_wa && (
                  <a href={`https://wa.me/${t.no_wa.replace(/^0/, '62').replace('+', '')}`} target="_blank" rel="noreferrer"
                    className="btn mt-4 w-full bg-emerald-600 !py-2.5 !text-xs text-white hover:bg-emerald-700">
                    💬 Chat WhatsApp
                  </a>
                )}
              </article>
            ))}
            {(!tokoh || tokoh.length === 0) && <p className="text-kabut/60">Profil pemandu akan segera ditampilkan.</p>}
          </div>
        </div>
      </section>

      {/* Tautan ke halaman Informasi */}
      <section className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6">
        <p className="font-display text-2xl font-semibold text-hutan-950">Ingin tahu kegiatan terbaru kampung?</p>
        <Link to="/informasi" className="btn-garis mt-5">Buka Halaman Informasi</Link>
      </section>
    </div>
  );
}
