// Tombol WhatsApp mengambang di semua halaman publik — pesan pembuka
// otomatis mengikuti bahasa yang dipilih pengunjung.
import { useLocation } from 'react-router-dom';
import { IkonWA } from '../common/Ikon';
import usePengaturan, { linkWa } from '../../hooks/usePengaturan';
import { useLang } from '../../i18n/LanguageContext';

export default function TombolWA() {
  const { t } = useLang();
  const { pathname } = useLocation();
  const pengaturan = usePengaturan();
  const href = linkWa(pengaturan.wa_utama, t('wa.sapaan'));
  // Di halaman detail paket sudah ada tombol WA di form → hindari menumpuk di layar kecil
  if (!href || pathname.startsWith('/paket-wisata/')) return null;
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={t('wa.mengambang')}
      className="group fixed bottom-5 right-5 z-[1000] flex items-center gap-2 rounded-full bg-[#1f9d55] p-3.5 text-white shadow-[0_12px_32px_-8px_rgba(31,157,85,.7)] transition hover:-translate-y-0.5 hover:bg-[#178a49] sm:pr-5">
      <IkonWA size={24} />
      <span className="hidden text-sm font-bold sm:inline">{t('wa.mengambang')}</span>
    </a>
  );
}
