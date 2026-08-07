// V4: ikon media sosial resmi kampung (tautan diatur Superadmin di menu Pengaturan)
const IKON = {
  sosmed_facebook: {
    label: 'Facebook',
    svg: <path d="M14 8h2.5V5H14c-2.2 0-4 1.8-4 4v2H7.5v3H10v7h3v-7h2.5l.5-3H13V9c0-.6.4-1 1-1Z" />,
  },
  sosmed_instagram: {
    label: 'Instagram',
    svg: <><rect x="4" y="4" width="16" height="16" rx="4.5" fill="none" strokeWidth="1.9" stroke="currentColor" /><circle cx="12" cy="12" r="3.4" fill="none" strokeWidth="1.9" stroke="currentColor" /><circle cx="16.6" cy="7.4" r="1.15" /></>,
  },
  sosmed_tiktok: {
    label: 'TikTok',
    svg: <path d="M15.2 4h-2.6v10.9a2.35 2.35 0 1 1-2.35-2.35c.24 0 .48.04.7.1V9.9a5.1 5.1 0 0 0-.7-.05 5.05 5.05 0 1 0 5.05 5.05V9.6a6.5 6.5 0 0 0 3.5 1.02V8a3.95 3.95 0 0 1-3.6-4Z" />,
  },
  sosmed_youtube: {
    label: 'YouTube',
    svg: <><rect x="3" y="6" width="18" height="12" rx="3.5" /><path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="#fff" /></>,
  },
};

export default function SosmedIcons({ pengaturan, className = '', tombol = 'h-9 w-9 rounded-full bg-kabut/10 text-kabut hover:bg-emas hover:text-hutan-950' }) {
  const daftar = Object.keys(IKON).filter((k) => pengaturan?.[k]);
  if (daftar.length === 0) return null;
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {daftar.map((k) => (
        <a key={k} href={pengaturan[k]} target="_blank" rel="noreferrer" aria-label={`${IKON[k].label} Kampung Kwau`}
          className={`flex items-center justify-center transition ${tombol}`}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{IKON[k].svg}</svg>
        </a>
      ))}
    </div>
  );
}
