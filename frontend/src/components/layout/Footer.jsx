import { Link } from 'react-router-dom';
import GarisKontur from '../common/GarisKontur';
import Logo from '../common/Logo';
import SosmedIcons from '../common/SosmedIcons';
import useFetch from '../../hooks/useFetch';
import { kontenApi } from '../../services/api';

export default function Footer() {
  const { data: pengaturan } = useFetch(() => kontenApi.getPengaturan(), []);

  return (
    <footer className="relative overflow-hidden bg-hutan-950 text-kabut">
      <GarisKontur className="absolute inset-x-0 top-0 h-32 w-full text-emas" />
      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-20 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo ukuran="h-10 w-10" />
              <div>
                <p className="font-display text-lg font-semibold">Kampung Wisata Kwau</p>
                <p className="text-[10px] uppercase tracking-[0.22em] text-kabut/50">Distrik Mokwam · Manokwari</p>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-kabut/60">
              Rumah bagi Cenderawasih dan Burung Pintar di kaki Pegunungan Arfak, Papua Barat. Dikelola oleh masyarakat, untuk konservasi.
            </p>
            <SosmedIcons pengaturan={pengaturan} className="mt-5" />
          </div>

          <div>
            <p className="eyebrow !text-emas-light">Tautan Cepat</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
              {[['/', 'Beranda'], ['/tentang', 'Tentang Kwau'], ['/tentang#peraturan-kampung', 'Peraturan Kampung'], ['/paket-wisata', 'Paket Wisata'], ['/peta', 'Peta Interaktif'], ['/pertanian', 'Hasil Pertanian'], ['/informasi', 'Informasi'], ['/jejak-wisatawan', 'Jejak Wisatawan'], ['/faq', 'FAQ'], ['/kontak', 'Kontak'], ['/admin/login', 'Login Pengelola']].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-kabut/70 transition hover:text-emas-light">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow !text-emas-light">Hubungi Kami</p>
            <ul className="mt-4 space-y-2.5 text-sm text-kabut/70">
              <li>Kampung Kwau, Distrik Mokwam,<br />Kabupaten Manokwari, Papua Barat</li>
              {pengaturan?.wa_utama && (
                <li>
                  <a href={`https://wa.me/${pengaturan.wa_utama}`} target="_blank" rel="noreferrer" className="font-semibold text-emas-light hover:underline">
                    WhatsApp Pokdarwis →
                  </a>
                </li>
              )}
              {pengaturan?.jam_operasional && <li>{pengaturan.jam_operasional}</li>}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-kabut/10 pt-6 text-center text-xs text-kabut/40">
          © {new Date().getFullYear()} Pokdarwis Kampung Kwau · Dikembangkan bersama KKN Teknik Informatika UNIPA
        </div>
      </div>
    </footer>
  );
}
