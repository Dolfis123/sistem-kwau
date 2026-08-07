import { Link, useParams } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import { beritaApi } from '../../../services/api';
import Loader from '../../../components/common/Loader';
import ImgFallback from '../../../components/common/ImgFallback';
import { formatTanggal } from '../../../utils/format';

export default function DetailInformasi() {
  const { id } = useParams();
  const { data: berita, loading } = useFetch(() => beritaApi.detail(id), [id]);

  if (loading) return <div className="pt-24"><Loader /></div>;
  if (!berita) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-16">
      <p className="text-tinta/60">Artikel tidak ditemukan.</p>
      <Link to="/informasi" className="btn-hutan">Kembali ke Informasi</Link>
    </div>
  );

  return (
    <div className="pt-16">
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link to="/informasi" className="text-sm font-bold text-hutan-700 hover:text-emas-dark">← Semua Informasi</Link>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {berita.kategori && <span className="rounded-full bg-emas px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-hutan-950">{berita.kategori}</span>}
          <p className="eyebrow !mt-0">{formatTanggal(berita.tanggal_terbit)}{berita.penulis ? ` · ${berita.penulis.nama}` : ''}</p>
        </div>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-hutan-950 sm:text-4xl">{berita.judul}</h1>
        <div className="mt-7 overflow-hidden rounded-3xl">
          <ImgFallback src={berita.foto_sampul} alt={berita.judul} className="max-h-[420px] w-full object-cover" />
        </div>
        <div className="mt-8 whitespace-pre-line text-[15px] leading-relaxed text-tinta/85">{berita.isi}</div>
        <div className="mt-12 rounded-2xl bg-hutan-100/60 p-6 text-center">
          <p className="font-display text-lg font-semibold text-hutan-950">Tertarik berkunjung ke Kwau?</p>
          <Link to="/paket-wisata" className="btn-emas mt-4">Lihat Paket Wisata</Link>
        </div>
      </article>
    </div>
  );
}
