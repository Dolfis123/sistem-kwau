import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import useFetch from '../../../hooks/useFetch';
import { petaApi } from '../../../services/api';
import SectionHeading from '../../../components/common/SectionHeading';
import Loader from '../../../components/common/Loader';
import ImgFallback from '../../../components/common/ImgFallback';
import { KATEGORI_TITIK } from '../../../constants';

// Marker berwarna per kategori (tanpa file gambar eksternal)
const buatIkon = (warna) =>
  L.divIcon({
    className: '',
    html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${warna};border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 24],
    popupAnchor: [0, -22],
  });

const PUSAT_KWAU = [-1.05, 133.95]; // ganti dengan koordinat resmi jika sudah ada titik

export default function PetaInteraktif() {
  const { data: titik, loading } = useFetch(() => petaApi.list(), []);
  const [aktif, setAktif] = useState(KATEGORI_TITIK.map((k) => k.value));

  const tampil = useMemo(() => (titik || []).filter((t) => aktif.includes(t.kategori)), [titik, aktif]);
  const pusat = tampil.length ? [Number(tampil[0].latitude), Number(tampil[0].longitude)] : PUSAT_KWAU;

  const toggle = (v) => setAktif((a) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v]));

  return (
    <div className="pt-16">
      <section className="bg-hutan-950 py-14 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <SectionHeading tengah gelap eyebrow="Peta Interaktif" judul="Menyusuri Kwau dari layar Anda"
            teks="Ketuk penanda di peta untuk melihat pos pengamatan satwa, homestay, batas hutan lindung, dan menghubungi pemandu langsung via WhatsApp." />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Filter + legenda */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {KATEGORI_TITIK.map((k) => (
            <button
              key={k.value}
              onClick={() => toggle(k.value)}
              aria-pressed={aktif.includes(k.value)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
                aktif.includes(k.value) ? 'bg-white shadow-sm' : 'bg-hutan-900/5 opacity-50'
              }`}
            >
              <span className="h-3 w-3 rounded-full" style={{ background: k.warna }} />
              {k.label}
            </button>
          ))}
        </div>

        {loading ? <Loader teks="Memuat peta..." /> : (
          <div className="overflow-hidden rounded-3xl border border-hutan-900/10 shadow-kartu">
            <MapContainer center={pusat} zoom={14} scrollWheelZoom className="h-[65vh] min-h-[420px] w-full">
              {/* V2: pengunjung bisa memilih tampilan Peta Jalan / Satelit / Topografi */}
              <LayersControl position="topright">
                <LayersControl.BaseLayer name="Peta Jalan">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer checked name="Satelit">
                  <TileLayer
                    attribution='Tiles &copy; Esri — Maxar, Earthstar Geographics'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Topografi">
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors, SRTM | &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
                    url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                  />
                </LayersControl.BaseLayer>
              </LayersControl>
              {tampil.map((t) => {
                const kat = KATEGORI_TITIK.find((k) => k.value === t.kategori);
                return (
                  <Marker key={t.id} position={[Number(t.latitude), Number(t.longitude)]} icon={buatIkon(kat?.warna || '#c9862c')}>
                    <Popup minWidth={230}>
                      <div className="font-sans">
                        {t.foto && <ImgFallback src={t.foto} alt={t.nama} className="mb-2 h-28 w-full rounded-lg object-cover" />}
                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: kat?.warna }}>{kat?.label}</p>
                        <p className="font-display text-base font-semibold text-hutan-950">{t.nama}</p>
                        {t.deskripsi && <p className="mt-1 text-xs leading-relaxed text-tinta/70">{t.deskripsi}</p>}
                        {(t.tokoh || []).map((p) => (
                          <div key={p.id} className="mt-2 rounded-lg bg-hutan-100/70 p-2.5">
                            <p className="text-sm font-bold text-hutan-950">{p.nama}</p>
                            <p className="text-[11px] text-tinta/60">{p.jabatan}{p.spesialisasi ? ` · ${p.spesialisasi}` : ''}</p>
                            {p.no_wa && (
                              <a href={`https://wa.me/${p.no_wa.replace(/^0/, '62').replace('+', '')}`} target="_blank" rel="noreferrer"
                                className="mt-1.5 inline-block rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white">
                                Chat WhatsApp
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

        {/* Panduan untuk turis awam */}
        <div className="mt-6 grid gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['👆', 'Ketuk penanda berwarna untuk melihat informasi lokasi.'],
            ['🛰', 'Gunakan kotak layer di pojok kanan atas untuk berganti tampilan Satelit, Peta Jalan, atau Topografi.'],
            ['🔍', 'Cubit layar (atau tombol +/−) untuk memperbesar peta.'],
            ['💬', 'Pada penanda tokoh, tombol hijau membuka WhatsApp pemandu.'],
          ].map(([ikon, teks]) => (
            <div key={teks} className="flex items-start gap-3">
              <span className="text-xl" aria-hidden="true">{ikon}</span>
              <p className="text-sm leading-relaxed text-tinta/70">{teks}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
