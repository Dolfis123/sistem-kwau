import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from '../components/common/Toast';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';

// Halaman publik
import Beranda from '../pages/public/Beranda/Beranda';
import TentangKwau from '../pages/public/TentangKwau/TentangKwau';
import DaftarPaket from '../pages/public/PaketWisata/DaftarPaket';
import DetailPaket from '../pages/public/PaketWisata/DetailPaket';
import PetaInteraktif from '../pages/public/PetaInteraktif/PetaInteraktif';
import Pertanian from '../pages/public/Pertanian/Pertanian';
import Informasi from '../pages/public/Informasi/Informasi';
import DetailInformasi from '../pages/public/Informasi/DetailInformasi';
import JejakWisatawan from '../pages/public/JejakWisatawan/JejakWisatawan';
import Faq from '../pages/public/FAQ/Faq';
import Kontak from '../pages/public/Kontak/Kontak';
import TidakDitemukan from '../pages/public/TidakDitemukan';

// Dashboard admin
import Login from '../pages/admin/Login';
import Dashboard from '../pages/admin/Dashboard';
import ManajemenReservasi from '../pages/admin/ManajemenReservasi';
import ModerasiGaleri from '../pages/admin/ModerasiGaleri';
import ManajemenPaket from '../pages/admin/ManajemenPaket';
import ManajemenKonten from '../pages/admin/ManajemenKonten';
import ManajemenPeta from '../pages/admin/ManajemenPeta';
import ManajemenInformasi from '../pages/admin/ManajemenInformasi';
import ManajemenPertanian from '../pages/admin/ManajemenPertanian';
import PesanKontak from '../pages/admin/PesanKontak';
import ManajemenPengguna from '../pages/admin/ManajemenPengguna';
import Pengaturan from '../pages/admin/Pengaturan';

export default function AppRouter() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Beranda />} />
          <Route path="/tentang" element={<TentangKwau />} />
          <Route path="/paket-wisata" element={<DaftarPaket />} />
          <Route path="/paket-wisata/:id" element={<DetailPaket />} />
          <Route path="/peta" element={<PetaInteraktif />} />
          <Route path="/pertanian" element={<Pertanian />} />
          <Route path="/informasi" element={<Informasi />} />
          <Route path="/informasi/:id" element={<DetailInformasi />} />
          <Route path="/jejak-wisatawan" element={<JejakWisatawan />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/kontak" element={<Kontak />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            {/* Wisata */}
            <Route element={<ProtectedRoute roles={['admin_reservasi']} />}>
              <Route path="reservasi" element={<ManajemenReservasi />} />
            </Route>
            <Route element={<ProtectedRoute roles={['admin_konten']} />}>
              <Route path="moderasi" element={<ModerasiGaleri />} />
              <Route path="paket" element={<ManajemenPaket />} />
              <Route path="konten" element={<ManajemenKonten />} />
              <Route path="peta" element={<ManajemenPeta />} />
            </Route>
            {/* Kampung & Pertanian */}
            <Route element={<ProtectedRoute roles={['pegawai_kampung', 'admin_pertanian']} />}>
              <Route path="informasi" element={<ManajemenInformasi />} />
            </Route>
            <Route element={<ProtectedRoute roles={['admin_pertanian']} />}>
              <Route path="pertanian" element={<ManajemenPertanian />} />
            </Route>
            {/* Umum */}
            <Route element={<ProtectedRoute roles={['admin_reservasi', 'admin_konten', 'pegawai_kampung']} />}>
              <Route path="pesan" element={<PesanKontak />} />
            </Route>
            <Route element={<ProtectedRoute roles={[]} />}>
              <Route path="pengguna" element={<ManajemenPengguna />} />
            </Route>
            <Route path="pengaturan" element={<Pengaturan />} />
          </Route>
        </Route>

        <Route path="*" element={<TidakDitemukan />} />
      </Routes>
    </ToastProvider>
  );
}
