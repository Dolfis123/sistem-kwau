import { Link } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import { paketApi, galeriApi, satwaApi, homestayApi, galeriKampungApi, kontenApi, beritaApi } from '../../../services/api';
import GarisKontur from '../../../components/common/GarisKontur';
import SectionHeading from '../../../components/common/SectionHeading';
import ImgFallback from '../../../components/common/ImgFallback';
import StarRating from '../../../components/common/StarRating';
import KartuPaket from '../PaketWisata/KartuPaket';
import Modal from '../../../components/common/Modal';
import { useState } from 'react';

export default function Beranda() {
  const { data: paket } = useFetch(() => paketApi.list({ limit: 3 }), []);
  const { data: galeri } = useFetch(() => galeriApi.list({ limit: 6 }), []);
  const { data: satwa } = useFetch(() => satwaApi.list(), []);
  const { data: homestay } = useFetch(() => homestayApi.list(), []);
  const { data: sekilas } = useFetch(() => kontenApi.getBySlug('sekilas-kwau').catch(() => ({ data: { data: null } })), []);
  const { data: pesona } = useFetch(() => galeriKampungApi.list({ page: 1, limit: 12 }), []); // V5: beranda cukup 12 foto teratas
  const [lightbox, setLightbox] = useState(null);
  const { data: infoWisata } = useFetch(() => beritaApi.list({ kategori: 'Wisata', limit: 3 }), []);

  const testimoni = (galeri || []).filter((g) => g.rating >= 4).slice(0, 3);

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-hutan-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(201,134,44,.16),transparent_55%),radial-gradient(ellipse_at_15%_85%,rgba(47,107,76,.35),transparent_60%)]" />
        <GarisKontur className="absolute inset-x-0 bottom-0 h-64 w-full text-emas" />
        {/* Siluet burung */}
        <svg className="absolute right-[38%] top-20 hidden w-36 text-emas/20 lg:block" viewBox="0 0 100 60" fill="currentColor" aria-hidden="true">
          <path d="M8 42c14-20 26-28 44-30-6 8-7 14-3 20 12-4 24-2 43 6-16 3-28 4-38 2 2 6 0 11-6 15-3-7-8-11-15-12-9-1-17-1-25-1z" />
        </svg>

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pb-24 pt-32 sm:px-6 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="eyebrow !text-emas-light">Distrik Warmare · Kabupaten Manokwari · Papua Barat</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.08] text-kabut sm:text-6xl lg:text-6xl">
              Hutan adalah <span className="italic text-emas-light">mesin pencetakan uang</span> bagi masyarakat 
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-kabut/70 sm:text-lg">
              Kampung Kwau di kaki Pegunungan Arfak adalah rumah bagi Burung Pintar (Vogelkop Bowerbird) dan Cenderawasih.
              Menginap di homestay warga, berjalan bersama pemandu lokal, dan menjadi bagian dari konservasi.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/paket-wisata" className="btn-emas">Lihat Paket Wisata</Link>
              <Link to="/peta" className="btn !border-2 !border-kabut/30 !text-kabut hover:!bg-kabut/10">Jelajahi Peta Kampung</Link>
            </div>
          </div>

          {/* V4: panel informasi terbaru khusus kategori Wisata */}
          {infoWisata?.length > 0 && (
            <aside className="rounded-3xl border border-kabut/12 bg-kabut/[.06] p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow !text-emas-light">Info Wisata Terbaru</p>
                <Link to="/informasi" className="text-[11px] font-bold text-kabut/60 hover:text-emas-light">Semua →</Link>
              </div>
              <div className="mt-3 space-y-2.5">
                {infoWisata.map((b) => (
                  <Link key={b.id} to={`/informasi/${b.id}`}
                    className="group flex items-center gap-3.5 rounded-2xl bg-kabut/[.07] p-3 transition hover:bg-kabut/15">
                    <ImgFallback src={b.foto_sampul} alt="" className="h-14 w-16 shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emas-light/80">
                        {new Date(b.tanggal_terbit).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="line-clamp-2 text-[13px] font-bold leading-snug text-kabut group-hover:text-emas-light">{b.judul}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </div>
      </section>

      {/* ===== SEKILAS KWAU + STATISTIK ===== */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Sekilas Kwau"
              judul="Kampung kecil yang menjaga hutan besar"
            />
            <p className="mt-5 whitespace-pre-line leading-relaxed text-tinta/75">
              {sekilas?.isi || 'Kampung Kwau terletak sekitar satu setengah jam perjalanan darat dari Manokwari, di lereng Pegunungan Arfak. Kampung ini dikenal para peneliti dan fotografer dunia sebagai salah satu tempat terbaik mengamati Burung Pintar dan Cenderawasih di habitat aslinya.'}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link to="/tentang" className="btn-garis">Kenali Kwau Lebih Dekat</Link>
              <Link to="/tentang#peraturan-kampung" className="text-sm font-bold text-hutan-700 underline decoration-emas decoration-2 underline-offset-4 hover:text-emas-dark">
                Baca Peraturan Kampung →
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              [satwa?.length || '—', 'Spesies endemik terdata'],
              [homestay?.length || '—', 'Homestay milik warga'],
              ['±1,5 jam', 'Dari Kota Manokwari'],
              ['100%', 'Dikelola masyarakat'],
            ].map(([angka, label]) => (
              <div key={label} className="kartu p-6">
                <p className="font-display text-4xl font-semibold text-hutan-800">{angka}</p>
                <p className="mt-1.5 text-sm font-medium text-tinta/60">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PAKET UNGGULAN ===== */}
      <section className="relative overflow-hidden bg-hutan-950 py-20">
        <GarisKontur className="absolute inset-x-0 top-0 h-40 w-full text-kabut/40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading gelap eyebrow="Paket Unggulan" judul="Pilih cara Anda mengenal Arfak" />
            <Link to="/paket-wisata" className="btn-emas">Semua Paket →</Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(paket || []).map((p) => <KartuPaket key={p.id} paket={p} />)}
            {(!paket || paket.length === 0) && (
              <p className="text-kabut/60">Paket wisata akan segera ditampilkan di sini.</p>
            )}
          </div>
        </div>
      </section>

      {/* ===== PESONA KWAU (V2: galeri keindahan kampung, dikelola admin) ===== */}
      {pesona?.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionHeading eyebrow="Pesona Kwau" judul="Keindahan yang menunggu Anda"
            teks="Geser untuk melihat lebih banyak — semua foto diambil di dalam dan sekitar kampung." />
          <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [-webkit-overflow-scrolling:touch]">
            {pesona.map((f) => (
              <button key={f.id} onClick={() => setLightbox(f)}
                className="group relative w-64 shrink-0 snap-start overflow-hidden rounded-2xl sm:w-72" aria-label={`Perbesar foto ${f.judul}`}>
                <ImgFallback src={f.url_foto} alt={f.judul} className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-hutan-950/85 to-transparent px-4 pb-3.5 pt-10 text-left text-sm font-bold text-kabut">
                  {f.judul}
                </span>
              </button>
            ))}
          </div>
          <Modal buka={!!lightbox} onTutup={() => setLightbox(null)} judul={lightbox?.judul || ''} lebar="max-w-3xl">
            {lightbox && <ImgFallback src={lightbox.url_foto} alt={lightbox.judul} className="max-h-[70vh] w-full rounded-2xl object-contain" />}
          </Modal>
        </section>
      )}

      {/* ===== JEJAK WISATAWAN ===== */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Jejak Wisatawan" judul="Yang mereka bawa pulang dari Kwau" teks="Foto dan cerita asli dari pengunjung — ditinjau dan ditayangkan secara transparan." />
          <Link to="/jejak-wisatawan" className="btn-garis">Lihat Semua</Link>
        </div>

        {galeri && galeri.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {galeri.slice(0, 6).map((g) => (
              <Link key={g.id} to="/jejak-wisatawan" className="group relative aspect-square overflow-hidden rounded-2xl">
                <ImgFallback src={g.foto?.[0]?.url_foto} alt={`Foto oleh ${g.nama_pengunjung}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-tinta/50">Galeri akan terisi dari kiriman para pengunjung.</p>
        )}

        {testimoni.length > 0 && (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimoni.map((t) => (
              <figure key={t.id} className="kartu p-6">
                <StarRating nilai={t.rating} />
                <blockquote className="mt-3 line-clamp-4 text-sm leading-relaxed text-tinta/75">"{t.ulasan}"</blockquote>
                <figcaption className="mt-4 text-xs font-bold uppercase tracking-wider text-hutan-700">
                  {t.nama_pengunjung}{t.asal ? ` · ${t.asal}` : ''}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>

      {/* ===== AJAKAN KONTRIBUSI ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-hutan-800 to-hutan-950 px-6 py-14 text-center sm:px-12">
          <GarisKontur className="absolute inset-x-0 bottom-0 h-32 w-full text-emas/70" />
          <h2 className="relative mx-auto max-w-xl text-3xl font-semibold text-kabut sm:text-4xl">
            Pernah berkunjung ke Kwau?
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-kabut/70">
            Bagikan foto dan cerita Anda — jadilah bagian dari jejak yang membantu kampung ini terus menjaga hutannya.
          </p>
          <Link to="/jejak-wisatawan" className="btn-emas relative mt-8">Bagikan Pengalaman Anda</Link>
        </div>
      </section>
    </>
  );
}
