import { useState } from 'react';
import { MapPin, Clock, Mail, ArrowUpRight } from 'lucide-react';
import usePengaturan, { linkWa } from '../../../hooks/usePengaturan';
import { kontakApi } from '../../../services/api';
import PageHero from '../../../components/common/PageHero';
import { IkonWA } from '../../../components/common/Ikon';
import { useToast } from '../../../components/common/Toast';
import { useLang } from '../../../i18n/LanguageContext';

export default function Kontak() {
  const toast = useToast();
  const { t } = useLang();
  const pengaturan = usePengaturan();
  const [form, setForm] = useState({ nama: '', email: '', pesan: '', website: '' });
  const [kirim, setKirim] = useState(false);
  const wa = linkWa(pengaturan.wa_utama, t('wa.sapaan'));

  const ubah = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const kirimPesan = async (e) => {
    e.preventDefault();
    setKirim(true);
    try {
      await kontakApi.create(form);
      toast(t('kontak.berhasil'));
      setForm({ nama: '', email: '', pesan: '', website: '' });
    } catch (err) {
      const errors = err.response?.data?.errors;
      toast(errors?.[0]?.pesan || err.response?.data?.message || t('kontak.gagal'), 'error');
    } finally { setKirim(false); }
  };

  return (
    <div>
      <PageHero eyebrow={t('kontak.eyebrow')} judul={t('kontak.judul')} teks={t('kontak.teks')} />

      <section className="wadah py-14 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-4">
            {wa && (
              <a href={wa} target="_blank" rel="noreferrer"
                className="group flex items-center justify-between gap-4 rounded-3xl bg-[#1f9d55] p-7 text-white shadow-kartu transition hover:-translate-y-0.5">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><IkonWA size={26} /></span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/75">{t('kontak.waResmi')}</p>
                    <p className="mt-0.5 font-display text-2xl font-medium">+{String(pengaturan.wa_utama).replace(/\D/g, '')}</p>
                  </div>
                </div>
                <ArrowUpRight size={22} className="opacity-70 transition group-hover:opacity-100" aria-label={t('kontak.ketukChat')} />
              </a>
            )}
            <div className="kartu divide-y divide-hutan-900/[.07]">
              <div className="flex gap-4 p-6">
                <MapPin size={20} className="mt-0.5 shrink-0 text-emas-dark" aria-hidden="true" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-tinta/45">{t('kontak.alamat')}</p>
                  <p className="mt-1 text-sm leading-relaxed text-tinta/80">{t('footer.alamat')}</p>
                </div>
              </div>
              <div className="flex gap-4 p-6">
                <Clock size={20} className="mt-0.5 shrink-0 text-emas-dark" aria-hidden="true" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-tinta/45">{t('kontak.jam')}</p>
                  <p className="mt-1 text-sm text-tinta/80">{pengaturan.jam_operasional || t('kontak.jamBawaan')}</p>
                </div>
              </div>
              {pengaturan.email_kontak && (
                <div className="flex gap-4 p-6">
                  <Mail size={20} className="mt-0.5 shrink-0 text-emas-dark" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-tinta/45">{t('kontak.email')}</p>
                    <a href={`mailto:${pengaturan.email_kontak}`} className="mt-1 block text-sm text-tinta/80 hover:text-hutan-700">{pengaturan.email_kontak}</a>
                  </div>
                </div>
              )}
            </div>
            <div className="overflow-hidden rounded-3xl shadow-kartu ring-1 ring-hutan-900/10">
              <iframe
                title={t('kontak.petaJudul')}
                src="https://www.openstreetmap.org/export/embed.html?bbox=133.85%2C-1.15%2C134.05%2C-0.95&layer=mapnik&marker=-1.05%2C133.95"
                className="h-64 w-full" loading="lazy" />
            </div>
          </div>

          <form onSubmit={kirimPesan} className="kartu h-fit p-7 sm:p-10">
            <h2 className="font-display text-3xl font-medium text-hutan-950">{t('kontak.formJudul')}</h2>
            <div className="mt-7 space-y-5">
              <div>
                <label className="label" htmlFor="k-nama">{t('kontak.nama')}</label>
                <input id="k-nama" name="nama" required minLength={2} autoComplete="name" className="input" value={form.nama} onChange={ubah} />
              </div>
              <div>
                <label className="label" htmlFor="k-email">{t('kontak.email')} <span className="normal-case tracking-normal text-tinta/40">({t('umum.opsional')})</span></label>
                <input id="k-email" name="email" type="email" autoComplete="email" className="input" value={form.email} onChange={ubah} />
              </div>
              <div>
                <label className="label" htmlFor="k-pesan">{t('kontak.pesan')}</label>
                <textarea id="k-pesan" name="pesan" required minLength={5} rows={7} className="input resize-none" value={form.pesan} onChange={ubah} />
              </div>
              <input type="text" name="website" value={form.website} onChange={ubah} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <button type="submit" disabled={kirim} className="btn-emas w-full !py-3.5">{kirim ? t('kontak.mengirim') : t('kontak.kirim')}</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
