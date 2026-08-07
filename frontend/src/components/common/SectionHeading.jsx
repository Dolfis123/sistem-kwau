export default function SectionHeading({ eyebrow, judul, teks, tengah = false, gelap = false }) {
  return (
    <div className={`max-w-2xl ${tengah ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <p className={`eyebrow ${gelap ? '!text-emas-light' : ''}`}>{eyebrow}</p>}
      <h2 className={`mt-2 text-3xl font-semibold leading-tight sm:text-4xl ${gelap ? 'text-kabut' : 'text-hutan-950'}`}>{judul}</h2>
      {teks && <p className={`mt-3 text-base leading-relaxed ${gelap ? 'text-kabut/70' : 'text-tinta/65'}`}>{teks}</p>}
    </div>
  );
}
