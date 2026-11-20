// Kepala halaman yang seragam untuk semua halaman publik (selain Beranda).
import GarisKontur from './GarisKontur';
import ImgFallback from './ImgFallback';

export default function PageHero({ eyebrow, judul, teks, gambar, children, tengah = true }) {
  return (
    <section className="relative isolate overflow-hidden bg-hutan-950 pb-16 pt-32 text-kabut sm:pb-20 sm:pt-40">
      {gambar && (
        <>
          <ImgFallback src={gambar} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-hutan-950/70 via-hutan-950/80 to-hutan-950" />
        </>
      )}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_0%,rgba(201,134,44,.18),transparent_55%),radial-gradient(ellipse_at_0%_100%,rgba(61,125,92,.35),transparent_60%)]" />
      <GarisKontur className="absolute inset-x-0 bottom-0 -z-10 h-40 w-full text-emas/60" />
      <div className={`wadah ${tengah ? 'text-center' : ''}`}>
        <div className={`max-w-3xl animate-muncul ${tengah ? 'mx-auto' : ''}`}>
          {eyebrow && <p className={`eyebrow !text-emas-light ${tengah ? 'justify-center' : ''}`}>{eyebrow}</p>}
          <h1 className="mt-5 text-4xl font-medium leading-[1.08] sm:text-5xl lg:text-6xl">{judul}</h1>
          {teks && <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-kabut/70 sm:text-lg">{teks}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
