import { Link } from 'react-router-dom';
import ImgFallback from '../../../components/common/ImgFallback';
import { KATEGORI_PAKET } from '../../../constants';

export default function KartuPaket({ paket }) {
  const kategori = KATEGORI_PAKET.find((k) => k.value === paket.kategori)?.label || paket.kategori;
  return (
    <Link to={`/paket-wisata/${paket.id}`} className="kartu group flex flex-col transition duration-300 hover:-translate-y-1.5">
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImgFallback src={paket.foto_cover} alt={paket.nama} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-hutan-950/85 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emas-light backdrop-blur">
          {kategori}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-hutan-950">{paket.nama}</h3>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-tinta/55">
          {paket.durasi && <span>⏱ {paket.durasi}</span>}
          <span>👥 Maks. {paket.kapasitas} orang</span>
        </div>
        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-tinta/45">Harga</p>
            <p className="text-sm font-bold leading-tight text-emas-dark">💬 Tanyakan via<br />WhatsApp Pokdarwis</p>
          </div>
          <span className="rounded-full bg-hutan-100 px-4 py-2 text-xs font-bold text-hutan-800 transition group-hover:bg-emas group-hover:text-hutan-950">
            Detail →
          </span>
        </div>
      </div>
    </Link>
  );
}
