// V3: Halaman Hasil Pertanian — potensi kebun yang bisa dibeli wisatawan,
// lengkap dengan kalender bulan panen dan frekuensi panen per tahun.
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import { pertanianApi, kontenApi } from '../../../services/api';
import SectionHeading from '../../../components/common/SectionHeading';
import Loader from '../../../components/common/Loader';
import Pagination from '../../../components/common/Pagination';
import EmptyState from '../../../components/common/EmptyState';
import ImgFallback from '../../../components/common/ImgFallback';
import { KATEGORI_PERTANIAN, BULAN } from '../../../constants';

// Menandai bulan panen dari teks, mis. "Mei – September" atau "Februari, Juni, Oktober"
function bulanPanen(teks = '') {
  const t = teks.toLowerCase();
  if (/sepanjang|setiap|hampir/.test(t)) return BULAN.map((_, i) => i);
  const ada = BULAN.map((b, i) => (t.includes(b.toLowerCase()) ? i : -1)).filter((i) => i >= 0);
  if (ada.length === 2 && /[–-]/.test(t)) {
    const [a, b] = ada;
    return Array.from({ length: b - a + 1 }, (_, k) => a + k);
  }
  return ada;
}

export default function Pertanian() {
  const [kategori, setKategori] = useState('');
  const [page, setPage] = useState(1);
  const { data, meta, loading } = useFetch(
    () => pertanianApi.list({ page, limit: 12, kategori: kategori || undefined }), [kategori, page]
  );
  const { data: pengaturan } = useFetch(() => kontenApi.getPengaturan(), []);
  const waPertanian = pengaturan?.wa_pertanian || pengaturan?.wa_utama;

  const perKategori = useMemo(() => {
    const grup = {};
    (data || []).forEach((p) => { (grup[p.kategori] = grup[p.kategori] || []).push(p); });
    return grup;
  }, [data]);

  return (
    <div className="pt-16">
      <section className="bg-hutan-950 py-14 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <SectionHeading tengah gelap eyebrow="Hasil Pertanian Kwau" judul="Dari kebun pegunungan, langsung ke tangan Anda"
            teks="Udara sejuk Arfak menghasilkan kopi, sayur, dan buah berkualitas. Ketahui apa yang sedang panen saat Anda berkunjung — dan bawa pulang langsung dari petaninya." />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {['', ...KATEGORI_PERTANIAN].map((k) => (
            <button key={k} onClick={() => setKategori(k)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                kategori === k ? 'bg-hutan-900 text-kabut' : 'bg-white text-hutan-900 shadow-sm hover:bg-hutan-100'
              }`}>
              {k || 'Semua'}
            </button>
          ))}
        </div>

        {loading ? <Loader /> : data?.length ? (
          Object.entries(perKategori).map(([kat, daftar]) => (
            <div key={kat} className="mt-10">
              <p className="eyebrow">{kat}</p>
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {daftar.map((p) => {
                  const aktif = bulanPanen(p.bulan_panen);
                  return (
                    <article key={p.id} className="kartu flex flex-col">
                      <div className="aspect-[16/10] overflow-hidden">
                        <ImgFallback src={p.foto} alt={p.nama} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="font-display text-lg font-semibold text-hutan-950">{p.nama}</h3>
                        {p.deskripsi && <p className="mt-2 text-sm leading-relaxed text-tinta/70">{p.deskripsi}</p>}

                        {/* Kalender panen 12 bulan */}
                        <div className="mt-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-tinta/45">Kalender Panen</p>
                          <div className="mt-1.5 grid grid-cols-12 gap-1" aria-label={`Bulan panen: ${p.bulan_panen || 'belum diisi'}`}>
                            {BULAN.map((b, i) => (
                              <div key={b} title={b}
                                className={`flex h-7 items-center justify-center rounded-md text-[10px] font-bold ${
                                  aktif.includes(i) ? 'bg-emas text-hutan-950' : 'bg-hutan-100/70 text-tinta/35'
                                }`}>
                                {b[0]}
                              </div>
                            ))}
                          </div>
                          {p.bulan_panen && <p className="mt-1.5 text-xs font-semibold text-emas-dark">🌾 {p.bulan_panen}</p>}
                        </div>

                        <div className="mt-auto space-y-1.5 pt-4 text-sm">
                          {p.frekuensi_panen && (
                            <p className="flex items-center gap-2 text-tinta/75"><span aria-hidden="true">🔄</span> {p.frekuensi_panen}</p>
                          )}
                          {p.harga_kisaran && (
                            <p className="flex items-center gap-2 font-bold text-hutan-800"><span aria-hidden="true">💰</span> {p.harga_kisaran}</p>
                          )}
                          {waPertanian && (
                            <a href={`https://wa.me/${waPertanian}?text=${encodeURIComponent(`Halo Bagian Pertanian Kampung Kwau, saya ingin memesan ${p.nama}. Apakah tersedia?`)}`}
                              target="_blank" rel="noreferrer"
                              className="btn mt-2 w-full bg-emerald-600 !py-2 !text-xs text-white hover:bg-emerald-700">
                              💬 Pesan via WhatsApp Pertanian
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="mt-8"><EmptyState judul="Belum ada data pertanian di kategori ini" /></div>
        )}
        <Pagination meta={meta} page={page} onPage={setPage} />

        <div className="mt-14 rounded-3xl bg-gradient-to-br from-hutan-800 to-hutan-950 px-6 py-10 text-center sm:px-12">
          <p className="font-display text-2xl font-semibold text-kabut">Ingin membeli hasil kebun saat berkunjung?</p>
          <p className="mx-auto mt-2 max-w-lg text-sm text-kabut/70">
            Hubungi langsung Bagian Pertanian kampung — warga akan menyiapkan hasil panen terbaik untuk Anda bawa pulang.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {waPertanian && (
              <a href={`https://wa.me/${waPertanian}?text=${encodeURIComponent('Halo Bagian Pertanian Kampung Kwau, saya ingin bertanya tentang hasil pertanian yang tersedia.')}`}
                target="_blank" rel="noreferrer" className="btn bg-emerald-600 text-white hover:bg-emerald-700">
                💬 WhatsApp Bagian Pertanian
              </a>
            )}
            <Link to="/paket-wisata" className="btn-emas">Rencanakan Kunjungan</Link>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-tinta/45">Bulan panen dan harga bersifat kisaran, dapat bergeser mengikuti cuaca. Data dikelola langsung oleh Admin Pertanian kampung.</p>
      </section>
    </div>
  );
}
