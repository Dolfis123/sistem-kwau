export default function SectionHeading({ eyebrow, judul, teks, tengah = false, gelap = false, className = '' }) {
  return (
    <div className={`max-w-2xl ${tengah ? 'mx-auto text-center' : ''} ${className}`}>
      {eyebrow && <p className={`eyebrow ${gelap ? '!text-emas-light' : ''} ${tengah ? 'justify-center' : ''}`}>{eyebrow}</p>}
      <h2 className={`judul-bagian ${gelap ? '!text-kabut' : ''}`}>{judul}</h2>
      {teks && <p className={`teks-bagian ${gelap ? '!text-kabut/70' : ''}`}>{teks}</p>}
    </div>
  );
}
