import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import { paketApi, reservasiApi, kontenApi } from '../../../services/api';
import Loader from '../../../components/common/Loader';
import ImgFallback from '../../../components/common/ImgFallback';
import { useToast } from '../../../components/common/Toast';
import { formatTanggal } from '../../../utils/format';
import { KATEGORI_PAKET } from '../../../constants';

export default function DetailPaket() {
  const { id } = useParams();
  const toast = useToast();
  const { data: paket, loading } = useFetch(() => paketApi.detail(id), [id]);
  const { data: pengaturan } = useFetch(() => kontenApi.getPengaturan(), []);
  const [fotoAktif, setFotoAktif] = useState(0);
  const [kirim, setKirim] = useState(false);
  const [sukses, setSukses] = useState(null);
  const [form, setForm] = useState({ nama_turis: '', no_wa: '', jumlah_peserta: 1, tanggal_kunjungan: '', catatan: '', website: '' });

  const semuaFoto = useMemo(() => {
    if (!paket) return [];
    return [paket.foto_cover, ...(paket.foto || []).map((f) => f.url_foto)].filter(Boolean);
  }, [paket]);

  // Tanggal yang penuh/ditutup -> ditandai di info ketersediaan
  const slotBermasalah = useMemo(
    () => (paket?.ketersediaan || []).filter((k) => k.status !== 'tersedia' || k.kuota_tersedia === 0),
    [paket]
  );

  if (loading) return <div className="pt-24"><Loader /></div>;
  if (!paket) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-16">
      <p className="text-tinta/60">Paket tidak ditemukan.</p>
      <Link to="/paket-wisata" className="btn-hutan">Kembali ke Daftar Paket</Link>
    </div>
  );

  const ubah = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const pesan = async (e) => {
    e.preventDefault();
    setKirim(true);
    try {
      const res = await reservasiApi.create({ ...form, paket_wisata_id: paket.id });
      const waLink = res.data.data?.wa_link;
      setSukses(waLink);
      toast('Reservasi tersimpan! Lanjutkan konfirmasi via WhatsApp.');
      if (waLink) window.open(waLink, '_blank', 'noopener');
    } catch (err) {
      const errors = err.response?.data?.errors;
      toast(errors?.[0]?.pesan || err.response?.data?.message || 'Gagal mengirim reservasi.', 'error');
    } finally { setKirim(false); }
  };

  return (
    <div className="pt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Link to="/paket-wisata" className="text-sm font-bold text-hutan-700 hover:text-emas-dark">← Semua Paket</Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          {/* Kiri: galeri + deskripsi */}
          <div>
            <div className="overflow-hidden rounded-3xl">
              <div className="aspect-[16/10]">
                <ImgFallback src={semuaFoto[fotoAktif]} alt={paket.nama} className="h-full w-full object-cover" />
              </div>
            </div>
            {semuaFoto.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {semuaFoto.map((f, i) => (
                  <button key={i} onClick={() => setFotoAktif(i)} aria-label={`Foto ${i + 1}`}
                    className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${i === fotoAktif ? 'border-emas' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                    <ImgFallback src={f} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8">
              <p className="eyebrow">{KATEGORI_PAKET.find((k) => k.value === paket.kategori)?.label}</p>
              <h1 className="mt-2 text-3xl font-semibold text-hutan-950 sm:text-4xl">{paket.nama}</h1>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm font-semibold text-tinta/60">
                {paket.durasi && <span>⏱ {paket.durasi}</span>}
                <span>👥 Maksimal {paket.kapasitas} peserta / jadwal</span>
              </div>
              <p className="mt-6 whitespace-pre-line leading-relaxed text-tinta/80">{paket.deskripsi}</p>

              {paket.itinerary && (
                <div className="mt-8 rounded-2xl bg-hutan-100/60 p-6">
                  <h2 className="font-display text-lg font-semibold text-hutan-950">Itinerary Singkat</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-tinta/80">{paket.itinerary}</p>
                </div>
              )}

              {slotBermasalah.length > 0 && (
                <div className="mt-8">
                  <h2 className="font-display text-lg font-semibold text-hutan-950">Tanggal Penuh / Ditutup</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {slotBermasalah.map((k) => (
                      <span key={k.tanggal} className="rounded-full bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-700">
                        {formatTanggal(k.tanggal)}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-tinta/50">Tanggal selain di atas masih dapat dipesan.</p>
                </div>
              )}
            </div>
          </div>

          {/* Kanan: form reservasi */}
          <aside>
            <div className="kartu sticky top-24 p-6">
              {/* V4: harga tidak ditampilkan — menyesuaikan musim & jumlah peserta */}
              <div className="rounded-2xl bg-emas/10 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-emas-dark">💬 Informasi Harga</p>
                <p className="mt-1.5 text-sm leading-relaxed text-tinta/75">
                  Harga menyesuaikan musim, jumlah peserta, dan kebutuhan rombongan. Tanyakan harga terbaru langsung ke Pokdarwis.
                </p>
                {pengaturan?.wa_utama && (
                  <a href={`https://wa.me/${pengaturan.wa_utama}?text=${encodeURIComponent(`Halo Pokdarwis Kwau, saya ingin menanyakan harga paket "${paket.nama}".`)}`}
                    target="_blank" rel="noreferrer"
                    className="btn mt-3 w-full bg-emerald-600 !py-2.5 !text-xs text-white hover:bg-emerald-700">
                    Tanya Harga via WhatsApp
                  </a>
                )}
              </div>

              {sukses ? (
                <div className="mt-6 rounded-2xl bg-emerald-50 p-5 text-center">
                  <p className="text-2xl">✅</p>
                  <p className="mt-2 font-display font-semibold text-emerald-900">Reservasi tersimpan!</p>
                  <p className="mt-1 text-sm text-emerald-800/80">Jika WhatsApp belum terbuka otomatis, tekan tombol di bawah untuk konfirmasi ke Pokdarwis.</p>
                  <a href={sukses} target="_blank" rel="noreferrer" className="btn-emas mt-4 w-full">Buka WhatsApp</a>
                </div>
              ) : (
                <form onSubmit={pesan} className="mt-6 space-y-4">
                  <div>
                    <label className="label" htmlFor="nama_turis">Nama Lengkap</label>
                    <input id="nama_turis" name="nama_turis" required minLength={2} className="input" placeholder="Nama Anda" value={form.nama_turis} onChange={ubah} />
                  </div>
                  <div>
                    <label className="label" htmlFor="no_wa">Nomor WhatsApp</label>
                    <input id="no_wa" name="no_wa" required inputMode="tel" className="input" placeholder="081234567890" value={form.no_wa} onChange={ubah} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label" htmlFor="jumlah_peserta">Jumlah Peserta</label>
                      <input id="jumlah_peserta" name="jumlah_peserta" type="number" min={1} max={paket.kapasitas} required className="input" value={form.jumlah_peserta} onChange={ubah} />
                    </div>
                    <div>
                      <label className="label" htmlFor="tanggal_kunjungan">Tanggal Kunjungan</label>
                      <input id="tanggal_kunjungan" name="tanggal_kunjungan" type="date" required min={new Date().toISOString().slice(0, 10)} className="input" value={form.tanggal_kunjungan} onChange={ubah} />
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="catatan">Catatan Tambahan <span className="normal-case text-tinta/40">(opsional)</span></label>
                    <textarea id="catatan" name="catatan" rows={3} className="input resize-none" placeholder="Permintaan khusus, kondisi kesehatan, dsb." value={form.catatan} onChange={ubah} />
                  </div>
                  {/* Honeypot anti-bot: tidak terlihat oleh manusia */}
                  <input type="text" name="website" value={form.website} onChange={ubah} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                  <button type="submit" disabled={kirim} className="btn-emas w-full">
                    {kirim ? 'Mengirim...' : 'Kirim Pemesanan'}
                  </button>
                  <p className="text-center text-[11px] leading-relaxed text-tinta/45">
                    Setelah dikirim, Anda diarahkan ke WhatsApp resmi Pokdarwis untuk konfirmasi & pembayaran manual.
                    Dengan memesan, Anda menyetujui{' '}
                    <Link to="/tentang#peraturan-kampung" className="font-bold text-hutan-700 underline decoration-emas decoration-2 underline-offset-2">
                      Peraturan Kampung
                    </Link>.
                  </p>
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
