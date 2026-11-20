import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import useFetch from '../../../hooks/useFetch';
import { petaApi } from '../../../services/api';
import PageHero from '../../../components/common/PageHero';
import Loader from '../../../components/common/Loader';
import ImgFallback from '../../../components/common/ImgFallback';
import Ikon from '../../../components/common/Ikon';
import { KATEGORI_TITIK } from '../../../constants';
import { linkWa } from '../../../hooks/usePengaturan';
import { nomorWaMe } from '../../../utils/format';
import { useLang } from '../../../i18n/LanguageContext';

// Marker berwarna per kategori (tanpa file gambar eksternal)
const buatIkon = (warna) =>
  L.divIcon({
    className: '',
    html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${warna};border:3px solid #fff;box-shadow:0 4px 10px rgba(0,0,0,.35)"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 26],
    popupAnchor: [0, -24],
  });

const PUSAT_KWAU = [-1.05, 133.95]; // ganti dengan koordinat resmi jika sudah ada titik

export default function PetaInteraktif() {
  const { t, pick } = useLang();
  const { data: titik, loading } = useFetch(() => petaApi.list(), []);
  const [aktif, setAktif] = useState(KATEGORI_TITIK.map((k) => k.value));

  const tampil = useMemo(() => (titik || []).filter((p) => aktif.includes(p.kategori)), [titik, aktif]);
  const pusat = tampil.length ? [Number(tampil[0].latitude), Number(tampil[0].longitude)] : PUSAT_KWAU;
  const toggle = (v) => setAktif((a) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v]));

  return (
    <div>
      <PageHero eyebrow={t('peta.eyebrow')} judul={t('peta.judul')} teks={t('peta.teks')} />

      <section className="wadah py-12 lg:py-16">
        {/* Filter + legenda */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {KATEGORI_TITIK.map((k) => (
            <button
              key={k.value}
              onClick={() => toggle(k.value)}
              aria-pressed={aktif.includes(k.value)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
                aktif.includes(k.value) ? 'bg-white text-hutan-950 shadow-sm ring-1 ring-hutan-900/10' : 'bg-hutan-900/5 text-tinta/40 line-through'
              }`}
            >
              <span className="h-3 w-3 rounded-full" style={{ background: k.warna }} />
              {t(`kategoriTitik.${k.value}`)}
            </button>
          ))}
        </div>

        {loading ? <Loader teks={t('peta.memuat')} /> : (
          <div className="overflow-hidden rounded-3xl shadow-angkat ring-1 ring-hutan-900/10">
            <MapContainer center={pusat} zoom={14} scrollWheelZoom className="h-[68vh] min-h-[440px] w-full">
              {/* Pengunjung bisa memilih tampilan Peta Jalan / Satelit / Topografi */}
              <LayersControl position="topright">
                <LayersControl.BaseLayer name={t('peta.lapisan.jalan')}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer checked name={t('peta.lapisan.satelit')}>
                  <TileLayer
                    attribution='Tiles &copy; Esri — Maxar, Earthstar Geographics'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name={t('peta.lapisan.topo')}>
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors, SRTM | &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
                    url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                  />
                </LayersControl.BaseLayer>
              </LayersControl>
              {tampil.map((p) => {
                const kat = KATEGORI_TITIK.find((k) => k.value === p.kategori);
                const nama = pick(p, 'nama');
                return (
                  <Marker key={p.id} position={[Number(p.latitude), Number(p.longitude)]} icon={buatIkon(kat?.warna || '#c9862c')}>
                    <Popup minWidth={240}>
                      <div className="font-sans">
                        {p.foto && <ImgFallback src={p.foto} alt={nama} className="mb-2.5 h-32 w-full rounded-xl object-cover" />}
                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: kat?.warna }}>{t(`kategoriTitik.${p.kategori}`)}</p>
                        <p className="font-display text-base font-semibold text-hutan-950">{nama}</p>
                        {pick(p, 'deskripsi') && <p className="mt-1 text-xs leading-relaxed text-tinta/70">{pick(p, 'deskripsi')}</p>}
                        {(p.tokoh || []).map((g) => (
                          <div key={g.id} className="mt-2 rounded-xl bg-hutan-100/70 p-2.5">
                            <p className="text-sm font-bold text-hutan-950">{g.nama}</p>
                            <p className="text-[11px] text-tinta/60">
                              {pick(g, 'jabatan')}{pick(g, 'spesialisasi') ? ` · ${pick(g, 'spesialisasi')}` : ''}{g.bahasa ? ` · ${g.bahasa}` : ''}
                            </p>
                            {g.no_wa && (
                              <a href={linkWa(nomorWaMe(g.no_wa), t('wa.pemandu', { nama: g.nama }))} target="_blank" rel="noreferrer"
                                className="mt-1.5 inline-block rounded-full bg-[#1f9d55] px-3 py-1 text-[11px] font-bold !text-white">
                                {t('umum.chatWa')}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        )}

        {/* Panduan untuk pengunjung awam */}
        <div className="mt-8 grid gap-6 rounded-3xl bg-white p-7 shadow-kartu sm:grid-cols-2 lg:grid-cols-4">
          {t('peta.panduan').map(([ikon, teks]) => (
            <div key={teks} className="flex items-start gap-3.5">
              <span className="ikon-bulat !h-10 !w-10 !rounded-xl"><Ikon nama={ikon} size={18} /></span>
              <p className="text-sm leading-relaxed text-tinta/70">{teks}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
