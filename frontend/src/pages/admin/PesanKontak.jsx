import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { kontakApi } from '../../services/api';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { useToast } from '../../components/common/Toast';
import { formatWaktu } from '../../utils/format';

export default function PesanKontak() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const { data, meta, loading, refetch } = useFetch(() => kontakApi.list({ page, limit: 15 }), [page]);

  const tandai = async (id) => {
    await kontakApi.tandaiDibaca(id);
    toast('Pesan ditandai dibaca.');
    refetch();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-hutan-950">Pesan dari Form Kontak</h1>
      <p className="mt-1 text-sm text-tinta/55">Pesan yang dikirim pengunjung melalui halaman Kontak.</p>

      {loading ? <Loader /> : data?.length ? (
        <>
          <div className="mt-5 space-y-3">
            {data.map((p) => (
              <div key={p.id} className={`kartu p-5 ${p.status === 'baru' ? 'ring-2 ring-emas/60' : ''}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-hutan-950">{p.nama} {p.email && <span className="font-normal text-tinta/50">· {p.email}</span>}</p>
                    <p className="text-[11px] text-tinta/45">{formatWaktu(p.created_at)}</p>
                  </div>
                  {p.status === 'baru' ? (
                    <button onClick={() => tandai(p.id)} className="rounded-full bg-emas px-4 py-1.5 text-xs font-bold text-hutan-950 hover:bg-emas-light">
                      Tandai Dibaca
                    </button>
                  ) : (
                    <span className="rounded-full bg-hutan-100 px-3 py-1 text-[11px] font-bold text-hutan-700">Dibaca</span>
                  )}
                </div>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-tinta/80">{p.pesan}</p>
              </div>
            ))}
          </div>
          <Pagination meta={meta} page={page} onPage={setPage} />
        </>
      ) : (
        <div className="mt-5"><EmptyState judul="Belum ada pesan masuk" /></div>
      )}
    </div>
  );
}
