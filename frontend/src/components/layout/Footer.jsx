import { Link } from 'react-router-dom';
import { MapPin, Clock, Mail } from 'lucide-react';
import GarisKontur from '../common/GarisKontur';
import Logo from '../common/Logo';
import SosmedIcons from '../common/SosmedIcons';
import { IkonWA } from '../common/Ikon';
import LangSwitch from './LangSwitch';
import usePengaturan, { linkWa } from '../../hooks/usePengaturan';
import { useLang } from '../../i18n/LanguageContext';

export default function Footer() {
  const { t } = useLang();
  const pengaturan = usePengaturan();
  const wa = linkWa(pengaturan.wa_utama, t('wa.sapaan'));

  const kolom = [
    ['footer.jelajahi', [['/', 'nav.beranda'], ['/tentang', 'nav.tentang'], ['/peta', 'nav.peta'], ['/jejak-wisatawan', 'nav.jejak'], ['/informasi', 'nav.informasi']]],
    ['footer.rencana', [['/paket-wisata', 'nav.paket'], ['/pertanian', 'nav.pertanian'], ['/faq', 'nav.faq'], ['/tentang#peraturan-kampung', 'footer.peraturan'], ['/kontak', 'nav.kontak']]],
  ];

  return (
    <footer className="relative overflow-hidden bg-hutan-950 text-kabut">
      <GarisKontur className="absolute inset-x-0 top-0 h-32 w-full text-emas/50" />
      <div className="wadah relative pb-10 pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <div className="flex items-center gap-3">
              <Logo ukuran="h-11 w-11" />
              <div>
                <p className="font-display text-xl font-medium">Kampung Wisata Kwau</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-kabut/50">Manokwari · Papua Barat</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-kabut/60">{t('footer.misi')}</p>
            <SosmedIcons pengaturan={pengaturan} className="mt-6" />
          </div>

          {kolom.map(([judul, daftar]) => (
            <div key={judul}>
              <p className="text-xs font-bold uppercase tracking-lebar text-emas-light">{t(judul)}</p>
              <ul className="mt-5 space-y-3 text-sm">
                {daftar.map(([to, kunci]) => (
                  <li key={to}><Link to={to} className="text-kabut/65 transition hover:text-kabut">{t(kunci)}</Link></li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-xs font-bold uppercase tracking-lebar text-emas-light">{t('footer.hubungi')}</p>
            <ul className="mt-5 space-y-4 text-sm text-kabut/65">
              <li className="flex gap-3"><MapPin size={18} className="mt-0.5 shrink-0 text-emas-light/80" aria-hidden="true" />{t('footer.alamat')}</li>
              {pengaturan.jam_operasional && (
                <li className="flex gap-3"><Clock size={18} className="mt-0.5 shrink-0 text-emas-light/80" aria-hidden="true" />{pengaturan.jam_operasional}</li>
              )}
              {pengaturan.email_kontak && (
                <li className="flex gap-3"><Mail size={18} className="mt-0.5 shrink-0 text-emas-light/80" aria-hidden="true" />
                  <a href={`mailto:${pengaturan.email_kontak}`} className="hover:text-kabut">{pengaturan.email_kontak}</a></li>
              )}
            </ul>
            {wa && (
              <a href={wa} target="_blank" rel="noreferrer" className="btn-wa mt-6 !px-5 !py-2.5 !text-xs">
                <IkonWA size={16} /> {t('footer.waPokdarwis')}
              </a>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 text-xs text-kabut/45 md:flex-row">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} {t('footer.hak')} · {t('footer.kredit')}
          </p>
          <div className="flex items-center gap-4">
            <LangSwitch />
            <Link to="/admin/login" className="hover:text-kabut/80">{t('footer.login')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
