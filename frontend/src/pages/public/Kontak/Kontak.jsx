import { useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import { kontakApi, kontenApi } from '../../../services/api';
import SectionHeading from '../../../components/common/SectionHeading';
import { useToast } from '../../../components/common/Toast';

export default function Kontak() {
  const toast = useToast();
  const { data: pengaturan } = useFetch(() => kontenApi.getPengaturan(), []);
  const [form, setForm] = useState({ nama: '', email: '', pesan: '', website: '' });
  const [kirim, setKirim] = useState(false);

  const ubah = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const kirimPesan = async (e) => {
    e.preventDefault();
    setKirim(true);
    try {
      await kontakApi.create(form);
      toast('Pesan Anda telah terkirim. Terima kasih!');
      setForm({ nama: '', email: '', pesan: '', website: '' });
    } catch (err) {
      const errors = err.response?.data?.errors;
      toast(errors?.[0]?.pesan || err.response?.data?.message || 'Gagal mengirim pesan.', 'error');
    } finally { setKirim(false); }
  };

  return (
    <div className="pt-16">
      <section className="bg-hutan-950 py-14 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <SectionHeading tengah gelap eyebrow="Kontak" judul="Hubungi Pokdarwis Kwau"
            teks="Untuk reservasi cepat, gunakan WhatsApp. Untuk pertanyaan lain, silakan kirim pesan melalui form." />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-5">
            <div className="kartu p-6">
              <p className="eyebrow">Alamat</p>
              <p className="mt-2 text-sm leading-relaxed text-tinta/75">
                Kampung Kwau, Distrik Warmare,<br />Kabupaten Manokwari, Papua Barat
              </p>
            </div>
            {pengaturan?.wa_utama && (
              <a href={`https://wa.me/${pengaturan.wa_utama}`} target="_blank" rel="noreferrer"
                className="kartu block p-6 transition hover:-translate-y-0.5">
                <p className="eyebrow">WhatsApp Resmi</p>
                <p className="mt-2 font-display text-xl font-semibold text-hutan-950">+{pengaturan.wa_utama}</p>
                <p className="mt-1 text-xs font-bold text-emerald-700">Ketuk untuk membuka chat →</p>
              </a>
            )}
            <div className="kartu p-6">
              <p className="eyebrow">Jam Layanan Reservasi</p>
              <p className="mt-2 text-sm text-tinta/75">{pengaturan?.jam_operasional || 'Senin–Sabtu, 08.00–17.00 WIT'}</p>
              {pengaturan?.email_kontak && <p className="mt-1 text-sm text-tinta/75">Email: {pengaturan.email_kontak}</p>}
            </div>
            <div className="overflow-hidden rounded-2xl border border-hutan-900/10">
              <iframe
                title="Peta lokasi Kampung Kwau"
                src="https://www.openstreetmap.org/export/embed.html?bbox=133.85%2C-1.15%2C134.05%2C-0.95&layer=mapnik&marker=-1.05%2C133.95"
                className="h-56 w-full" loading="lazy" />
            </div>
          </div>

          <form onSubmit={kirimPesan} className="kartu h-fit p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-hutan-950">Kirim Pesan</h2>
            <div className="mt-5 space-y-4">
              <div>
                <label className="label" htmlFor="k-nama">Nama</label>
                <input id="k-nama" name="nama" required minLength={2} className="input" value={form.nama} onChange={ubah} />
              </div>
              <div>
                <label className="label" htmlFor="k-email">Email <span className="normal-case text-tinta/40">(opsional)</span></label>
                <input id="k-email" name="email" type="email" className="input" value={form.email} onChange={ubah} />
              </div>
              <div>
                <label className="label" htmlFor="k-pesan">Pesan</label>
                <textarea id="k-pesan" name="pesan" required minLength={5} rows={6} className="input resize-none" value={form.pesan} onChange={ubah} />
              </div>
              <input type="text" name="website" value={form.website} onChange={ubah} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <button type="submit" disabled={kirim} className="btn-emas w-full">{kirim ? 'Mengirim...' : 'Kirim Pesan'}</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
