// ============================================================================
// SKRIP DATA AWAL + DATA CONTOH (V2) — jalankan:  npm run seed
// Aman dijalankan berulang (tidak menduplikasi data).
//
// PENTING: Seluruh nama orang, nomor WA, harga, dan status konservasi di sini
// adalah DATA CONTOH agar sistem langsung terlihat hidup. Ganti dengan data
// asli melalui Dashboard Admin sebelum situs dipublikasikan.
// Foto contoh dibuat otomatis (gambar bermotif + judul) di /uploads/demo/.
// ============================================================================
require('dotenv').config();
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const {
  sequelize, Admin, PengaturanSistem, KontenStatis, Faq,
  PaketWisata, PaketFoto, Homestay, HomestayFoto, Satwa, BeritaKonservasi,
  PetaTitik, TokohPemandu, GaleriKampung, GaleriUgc, GaleriUgcFoto, Reservasi, Pertanian,
} = require('./models');

const DEMO_DIR = path.join(__dirname, '..', 'public', 'uploads', 'demo');

// Membuat gambar contoh (gradien hutan + garis kontur + judul) memakai sharp
async function fotoDemo(judul, namaFile, w = 1000, h = 700) {
  fs.mkdirSync(DEMO_DIR, { recursive: true });
  const file = path.join(DEMO_DIR, `${namaFile}.webp`);
  if (!fs.existsSync(file)) {
    const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#1e4534"/><stop offset="0.55" stop-color="#17352a"/><stop offset="1" stop-color="#0f241b"/>
      </linearGradient></defs>
      <rect width="${w}" height="${h}" fill="url(#g)"/>
      ${[0, 40, 80, 120].map((y, i) => `<path d="M0 ${h - 160 - y} C ${w * 0.25} ${h - 260 - y}, ${w * 0.4} ${h - 90 - y}, ${w * 0.62} ${h - 200 - y} S ${w * 0.9} ${h - 110 - y}, ${w} ${h - 190 - y}" stroke="#c9862c" stroke-width="2" fill="none" opacity="${0.45 - i * 0.09}"/>`).join('')}
      <circle cx="${w * 0.82}" cy="${h * 0.2}" r="46" fill="#c9862c" opacity="0.25"/>
      <text x="50%" y="46%" text-anchor="middle" font-family="Georgia, serif" font-size="${Math.round(w / 18)}" fill="#f7f5ef" font-weight="600">${judul}</text>
      <text x="50%" y="56%" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.round(w / 42)}" fill="#e8b45a" letter-spacing="4">FOTO CONTOH — GANTI DARI DASHBOARD ADMIN</text>
    </svg>`;
    await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile(file);
  }
  return `/uploads/demo/${namaFile}.webp`;
}

const tglPlus = (hari) => new Date(Date.now() + hari * 86400000).toISOString().slice(0, 10);

(async () => {
  try {
    await sequelize.sync();

    // ===== 1. SUPERADMIN =====
    const [admin] = await Admin.findOrCreate({
      where: { username: process.env.SEED_ADMIN_USERNAME || 'superadmin' },
      defaults: {
        nama: process.env.SEED_ADMIN_NAMA || 'Superadmin Kwau',
        email: process.env.SEED_ADMIN_EMAIL || 'admin@kwau.id',
        password_hash: await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'GantiPassword123!', 10),
        role: 'superadmin',
      },
    });
    console.log('[SEED] Superadmin siap.');

    // ===== 2. PENGATURAN =====
    for (const [key, value] of [
      ['wa_utama', process.env.WA_POKDARWIS || '6282100000000'],
      ['email_kontak', 'pokdarwis.kwau@gmail.com'],
      ['jam_operasional', 'Senin–Sabtu 08.00–17.00 WIT'],
      ['wa_pertanian', '6281200000004'], // kontak bagian pertanian (contoh)
      ['sosmed_facebook', 'https://facebook.com/kampungwisatakwau'],
      ['sosmed_instagram', 'https://instagram.com/kampungwisatakwau'],
      ['sosmed_tiktok', 'https://tiktok.com/@kampungwisatakwau'],
      ['sosmed_youtube', 'https://youtube.com/@kampungwisatakwau'],
    ]) await PengaturanSistem.findOrCreate({ where: { key }, defaults: { value } });

    // ===== 3. KONTEN STATIS =====
    const kontenIsi = {
      'sekilas-kwau': ['Sekilas Kwau',
`Kampung Kwau terletak di Distrik Warmare, Kabupaten Manokwari, Papua Barat — sekitar satu setengah jam perjalanan darat dari Kota Manokwari, di lereng Pegunungan Arfak pada ketinggian ±1.400 mdpl.

Kampung ini dikenal para peneliti dan fotografer satwa dari berbagai negara sebagai salah satu lokasi terbaik di dunia untuk mengamati Burung Pintar (Vogelkop Bowerbird) yang membangun "rumah hias" dari ranting dan bunga, serta Parotia Arfak yang menari seperti balerina di lantai hutan.

Seluruh kegiatan wisata dikelola langsung oleh masyarakat melalui Pokdarwis. Setiap kunjungan Anda adalah dukungan nyata bagi warga untuk terus menjaga hutan adatnya.`],
      'sejarah-kampung': ['Sejarah Kampung',
`Kampung Kwau dihuni oleh masyarakat suku Arfak yang telah turun-temurun hidup berdampingan dengan hutan Pegunungan Arfak. Bagi masyarakat Arfak, hutan bukan sekadar sumber kehidupan, melainkan bagian dari identitas dan adat istiadat.

Sejak dikenalnya kawasan ini sebagai habitat burung endemik pada era 1990-an, warga secara bertahap beralih dari perburuan menjadi pelindung satwa — bekas pemburu kini menjadi pemandu wisata yang paling mengenal perilaku burung di hutan ini.

Kini Kwau berkembang menjadi kampung wisata berbasis konservasi: pengamatan burung, trekking hutan, dan homestay dikelola bersama demi masa depan hutan Arfak. (Teks contoh — lengkapi dengan sejarah asli kampung melalui Dashboard Admin.)`],
      'aturan-berkunjung': ['Aturan Berkunjung',
`Dilarang memberi makan satwa liar dalam bentuk apa pun
Jaga jarak minimal 10 meter dari sarang dan arena tari burung
Berbicara dengan suara pelan selama berada di pos pengamatan
Dilarang menggunakan flash kamera saat memotret satwa
Bawa kembali seluruh sampah Anda keluar dari hutan
Selalu berjalan bersama pemandu lokal, jangan memisahkan diri
Hormati adat dan kebiasaan masyarakat kampung
Dilarang memetik tanaman atau membawa apa pun keluar dari hutan lindung`],
      'marga-kampung': ['Marga di Kampung Kwau',
`Mandacan
Ayok
Ullo
Saiba
Wonggor
Dowansiba
(Daftar contoh — ganti dengan marga asli kampung melalui Dashboard Admin)`],
      'struktur-kampung': ['Struktur Pemerintahan Kampung',
`Kepala Kampung: Bapak Yosias M. (contoh)
Sekretaris Kampung: Bapak Alberth D. (contoh)
Bendahara Kampung: Ibu Yohana W. (contoh)
Ketua BAMUSKAM: Bapak Simson A. (contoh)
Kaur Pemerintahan: Bapak Nataniel U. (contoh)
Kaur Pembangunan: Bapak Frans S. (contoh)
Ketua Pokdarwis: Ibu Martina S. (contoh)
Ketua BUMKAM: Bapak Zeth M. (contoh)`],
      'peraturan-kampung': ['Peraturan Kampung',
`Setiap tamu wajib melapor kepada Kepala Kampung atau Pokdarwis saat tiba di kampung
Kegiatan wisata hanya boleh dilakukan dengan didampingi pemandu resmi kampung
Dilarang membawa dan mengonsumsi minuman keras di seluruh wilayah kampung
Dilarang berburu, menangkap, atau memperjualbelikan satwa dari hutan
Pengambilan gambar untuk keperluan komersial wajib mendapat izin kampung
Tamu menghormati waktu ibadah dan kegiatan adat masyarakat
Jam tenang kampung berlaku pukul 22.00–05.00 WIT
Pelanggaran peraturan dapat dikenakan sanksi adat sesuai hasil musyawarah kampung`],
      'fasilitas-layanan': ['Fasilitas dan Layanan Wisata',
`Antar-jemput wisatawan dengan mobil 4WD dari dan ke Manokwari (dengan reservasi)
Pondok tunggu pemotretan (hide) di setiap pos pengamatan burung
Pemandu lokal berpengalaman untuk setiap rombongan
Makan 3x sehari dengan sayuran segar dari kebun warga
Porter untuk barang bawaan dan peralatan kamera
Kotak P3K di balai kampung dan pada setiap pemandu
Air minum isi ulang di balai kampung
Penyewaan sepatu boot dan jas hujan (jumlah terbatas)`],
    };
    for (const [slug, [judul, isi]] of Object.entries(kontenIsi)) {
      const [row, baru] = await KontenStatis.findOrCreate({ where: { slug }, defaults: { judul, isi, updated_by: admin.id } });
      if (!baru && row.isi.length < 200) await row.update({ isi }); // perbarui isi lama yang masih pendek
    }
    console.log('[SEED] Konten statis siap.');

    // ===== 4. FAQ =====
    const faqs = [
      ['Persiapan', 'Perlengkapan apa yang wajib dibawa?', 'Jaket hangat (suhu malam bisa 15°C), sepatu trekking, jas hujan, senter/headlamp, obat pribadi, dan uang tunai secukupnya. Untuk pengamatan burung, bawalah binokular jika ada.', 1],
      ['Persiapan', 'Apakah ada sinyal telepon dan listrik di kampung?', 'Sinyal seluler terbatas (umumnya Telkomsel di titik tertentu). Listrik tersedia terbatas pada malam hari. Kabari keluarga Anda sebelum berangkat.', 2],
      ['Persiapan', 'Kapan waktu terbaik untuk mengamati burung?', 'Pukul 05.30–09.00 WIT adalah waktu paling aktif. Pemandu akan mengajak Anda berangkat sebelum matahari terbit.', 3],
      ['Akses', 'Bagaimana rute dari Manokwari ke Kampung Kwau?', 'Perjalanan darat ±1,5 jam dari Kota Manokwari menuju Distrik Warmare, dilanjutkan jalan menanjak ke kampung. Sangat disarankan kendaraan 4WD, terutama saat musim hujan. Pokdarwis dapat membantu mengatur penjemputan.', 1],
      ['Akses', 'Apakah jalan bisa dilalui mobil biasa?', 'Sebagian ruas menanjak dan berbatu. Saat kering, mobil berpenggerak biasa yang tinggi masih bisa; saat hujan wajib 4WD. Konfirmasikan kondisi jalan ke Pokdarwis sebelum berangkat.', 2],
      ['Reservasi', 'Bagaimana cara memesan paket wisata?', 'Pilih paket di halaman Paket Wisata, isi form reservasi, lalu Anda otomatis diarahkan ke WhatsApp resmi Pokdarwis untuk konfirmasi jadwal dan pembayaran.', 1],
      ['Reservasi', 'Bagaimana metode pembayarannya?', 'Pembayaran dilakukan manual melalui transfer bank atau tunai saat tiba, sesuai kesepakatan di WhatsApp. Sistem ini tidak memproses pembayaran online.', 2],
      ['Reservasi', 'Bagaimana kebijakan pembatalan?', 'Reservasi yang belum dikonfirmasi dalam 2×24 jam otomatis dibatalkan sistem. Untuk pembatalan setelah konfirmasi, hubungi Pokdarwis via WhatsApp secepatnya.', 3],
      ['Keamanan', 'Apakah tersedia P3K dan kontak darurat?', 'Setiap pemandu membawa P3K dasar. Nomor WhatsApp Pokdarwis di halaman Kontak aktif pada jam layanan untuk keadaan darurat.', 1],
      ['Keamanan', 'Apakah trekking aman untuk pemula?', 'Ya, jalur pengamatan utama relatif landai dan selalu didampingi pemandu. Sampaikan kondisi kesehatan Anda pada kolom catatan saat reservasi.', 2],
    ];
    for (const [kategori, pertanyaan, jawaban, urutan] of faqs) {
      await Faq.findOrCreate({ where: { pertanyaan }, defaults: { kategori, jawaban, urutan } });
    }
    console.log('[SEED] FAQ siap (10 item).');

    // ===== 5. PAKET WISATA =====
    const paketData = [
      ['Birdwatching Burung Pintar dan Parotia', 'birdwatching', 450000, '1 hari (05.00–11.00 WIT)', 6,
        'Pengamatan dua bintang utama hutan Arfak dari pos tersembunyi: Burung Pintar (Vogelkop Bowerbird) yang menghias pondoknya dengan bunga, dan tarian Parotia Arfak di arena tanahnya. Termasuk pemandu spesialis burung, teh/kopi pagi, dan snack lokal.',
        '04.30 Berkumpul di balai kampung\n05.00 Berjalan menuju pos pengamatan (±40 menit)\n05.45–09.30 Pengamatan di pos Burung Pintar dan arena Parotia\n10.00 Sarapan kedua di kampung\n11.00 Selesai'],
      ['Trekking Hutan Lumut dan Air Terjun', 'trekking', 350000, '1 hari (08.00–15.00 WIT)', 10,
        'Menyusuri jalur hutan pegunungan yang diselimuti lumut, mengenal tanaman obat dan anggrek hutan bersama pemandu, berakhir di air terjun kecil yang jernih. Cocok untuk pecinta alam dan fotografi lanskap.',
        '08.00 Pemanasan dan pengarahan di balai kampung\n08.30 Trekking jalur hutan lumut\n11.30 Istirahat dan makan siang bekal di air terjun\n13.00 Kembali melalui jalur kebun warga\n15.00 Tiba di kampung'],
      ['Menginap di Kwau 2 Hari 1 Malam', 'homestay', 650000, '2 hari 1 malam', 8,
        'Merasakan hidup sehari sebagai warga Kwau: menginap di homestay keluarga, makan masakan lokal, api unggun malam, dan pengamatan burung singkat di pagi kedua. Harga sudah termasuk homestay, makan 3x, dan pemandu.', null],
      ['Paket Lengkap Arfak 3 Hari 2 Malam', 'kombinasi', 1600000, '3 hari 2 malam', 6,
        'Paket paling lengkap: dua sesi birdwatching (Burung Pintar, Parotia, dan Astrapia), trekking hutan lumut, air terjun, serta dua malam di homestay warga dengan seluruh makan ditanggung. Pilihan terbaik untuk fotografer dan peneliti.',
        'Hari 1: Tiba, orientasi kampung, trekking sore ke batas hutan\nHari 2: Birdwatching pagi (Burung Pintar dan Parotia), siang trekking air terjun, malam api unggun\nHari 3: Birdwatching pagi (Astrapia), pulang setelah makan siang'],
    ];
    const paketMap = {};
    for (const [nama, kategori, harga, durasi, kapasitas, deskripsi, itinerary] of paketData) {
      const [p, baru] = await PaketWisata.findOrCreate({
        where: { nama },
        defaults: {
          admin_id: admin.id, kategori, harga, durasi, kapasitas, deskripsi, itinerary,
          status: 'aktif',
          foto_cover: await fotoDemo(nama.split(' ').slice(0, 2).join(' '), `paket-${kategori}`),
        },
      });
      paketMap[kategori] = p;
      if (baru) {
        for (let i = 1; i <= 2; i++) {
          await PaketFoto.create({ paket_wisata_id: p.id, url_foto: await fotoDemo(`Dokumentasi ${i}`, `paket-${kategori}-${i}`), urutan: i });
        }
      }
    }
    console.log('[SEED] 4 paket wisata siap.');

    // ===== 6. HOMESTAY =====
    const homestayData = [
      ['Homestay Cenderawasih', 'Keluarga Bapak Zeth (contoh)', 250000, 4, '2 kamar tidur, kasur + selimut tebal dan kelambu, MCK dalam, makan 3x sehari, air panas untuk minum, teras santai, dekat balai kampung'],
      ['Homestay Arfak Lestari', 'Keluarga Ibu Naomi (contoh)', 200000, 3, '1 kamar tidur besar (cocok keluarga), kasur dan selimut tebal, MCK bersama, makan 3x sehari, kopi Arfak gratis tiap pagi'],
      ['Homestay Mokwam Indah', 'Keluarga Bapak Simson (contoh)', 275000, 5, '2 kamar tidur, teras menghadap lembah (spot foto matahari terbit), MCK dalam, makan 3x sehari, kopi Arfak, colokan listrik malam hari'],
    ];
    for (const [nama_homestay, nama_pemilik, harga, kapasitas, fasilitas] of homestayData) {
      const [h, baru] = await Homestay.findOrCreate({
        where: { nama_homestay },
        defaults: { nama_pemilik, harga_per_malam: harga, kapasitas, fasilitas, deskripsi: 'Homestay sederhana milik warga dengan suasana pegunungan yang tenang. (Data contoh)' },
      });
      if (baru) await HomestayFoto.create({ homestay_id: h.id, url_foto: await fotoDemo(nama_homestay, `homestay-${h.id}`) });
    }
    console.log('[SEED] 3 homestay siap.');

    // ===== 7. SATWA (status konservasi = contoh, mohon verifikasi IUCN terbaru) =====
    const satwaData = [
      ['Burung Pintar', 'Amblyornis inornata', 'Risiko Rendah (LC)', 'Burung namdur Vogelkop yang terkenal sebagai "arsitek hutan" — pejantan membangun pondok dari ranting setinggi hampir satu meter dan menghiasnya dengan bunga, buah, dan benda berwarna untuk menarik betina.'],
      ['Parotia Arfak', 'Parotia sefilata', 'Risiko Rendah (LC)', 'Burung cenderawasih endemik Pegunungan Arfak. Pejantan membersihkan "panggung" di lantai hutan lalu menari seperti balerina dengan bulu membentuk rok hitam mengembang.'],
      ['Cenderawasih Belah Rotan', 'Diphyllodes magnificus', 'Risiko Rendah (LC)', 'Cenderawasih kecil berbulu punggung kuning menyala dan dada hijau zamrud, dengan dua kawat ekor melingkar. Sering dijumpai di pos pengamatan bawah.'],
      ['Astrapia Arfak', 'Astrapia nigra', 'Rentan (VU)', 'Cenderawasih berekor panjang berkilau ungu-hijau yang hanya hidup di pegunungan tinggi Arfak. Pengamatan memerlukan trekking ke pos atas pada pagi buta.'],
      ['Kanguru Pohon Vogelkop', 'Dendrolagus ursinus', 'Rentan (VU)', 'Mamalia berkantung pemanjat yang semakin langka. Perjumpaan dengannya adalah keberuntungan besar — tanda hutan Kwau masih sehat.'],
    ];
    for (const [nama_lokal, nama_ilmiah, status, deskripsi] of satwaData) {
      await Satwa.findOrCreate({
        where: { nama_lokal },
        defaults: { nama_ilmiah, status_konservasi: status, deskripsi, foto: await fotoDemo(nama_lokal, `satwa-${nama_ilmiah.split(' ')[1]}`) },
      });
    }
    console.log('[SEED] 5 satwa endemik siap.');

    // ===== 8. BERITA & KEGIATAN =====
    const beritaData = [
      ['Gotong Royong Pembersihan Jalur Trekking Menyambut Musim Kunjungan', 'Kegiatan Kampung', -6,
        'Warga Kampung Kwau bergotong royong membersihkan jalur trekking utama menuju pos pengamatan burung. Kegiatan ini rutin dilakukan menjelang musim kunjungan agar jalur aman dan nyaman bagi wisatawan. Sebanyak 25 warga terlibat, termasuk para pemandu yang sekaligus memeriksa kondisi pos pengamatan. (Artikel contoh — ganti dengan berita asli kampung.)'],
      ['Pelatihan Pemandu Wisata Bersama Mahasiswa KKN UNIPA', 'Kegiatan Kampung', -14,
        'Mahasiswa KKN Teknik Informatika UNIPA mengadakan pelatihan penggunaan sistem reservasi digital bagi pengurus Pokdarwis dan para pemandu. Materi meliputi cara menerima reservasi dari website, memperbarui status pemesanan, dan mengelola konten. Kegiatan ini merupakan bagian dari program digitalisasi kampung wisata. (Artikel contoh.)'],
      ['Musim Pengamatan Burung Dimulai, Kuota Pengunjung Dibatasi', 'Pengumuman', -20,
        'Pokdarwis Kwau mengumumkan dimulainya musim pengamatan burung. Demi kenyamanan satwa, jumlah pengunjung per pos dibatasi maksimal 6 orang per sesi pagi. Wisatawan diimbau memesan jadwal lebih awal melalui website atau WhatsApp resmi. (Artikel contoh.)'],
      ['Penanaman 200 Bibit Pohon di Batas Hutan Lindung', 'Konservasi', -30,
        'Bersama sekolah dan gereja setempat, warga menanam 200 bibit pohon endemik di kawasan penyangga batas hutan lindung. Program ini bertujuan memperkuat habitat burung sekaligus mencegah erosi pada musim hujan. (Artikel contoh.)'],
      ['Hasil Musyawarah Kampung: Tarif Kontribusi Konservasi Disepakati', 'Musyawarah Kampung', -9,
        'Musyawarah kampung yang dihadiri seluruh perwakilan marga menyepakati tarif kontribusi konservasi bagi setiap pengunjung. Dana ini dikelola BUMKAM untuk perawatan jalur, honor penjaga hutan, dan kas kampung. Hasil lengkap musyawarah dapat dibaca di balai kampung. (Artikel contoh.)'],
      ['Jalur Pengamatan Astrapia di Pos Atas Resmi Dibuka', 'Wisata', -1,
        'Setelah perbaikan jalur dan pondok pengamatan, pos atas untuk mengamati Astrapia Arfak resmi dibuka kembali bagi wisatawan. Trekking menuju pos memakan waktu sekitar dua jam dan wajib didampingi pemandu. Kuota tetap dibatasi 4 orang per sesi demi kenyamanan satwa. (Artikel contoh.)'],
      ['Reservasi Wisata Kwau Kini Bisa Dilakukan Melalui Website Resmi', 'Wisata', -4,
        'Pokdarwis Kwau meluncurkan sistem reservasi online. Wisatawan cukup memilih paket, mengisi form, lalu konfirmasi otomatis tersambung ke WhatsApp resmi Pokdarwis. Pembayaran tetap dilakukan manual seperti biasa. (Artikel contoh.)'],
      ['Panen Raya Kopi Arfak Dimulai, Wisatawan Bisa Ikut Memetik', 'Pertanian', -2,
        'Kebun kopi arabika warga memasuki masa panen raya. Wisatawan yang berkunjung selama musim ini dapat mengikuti pengalaman memetik dan menyangrai kopi bersama petani, lalu membawa pulang biji kopi Arfak langsung dari sumbernya. (Artikel contoh.)'],
    ];
    for (const [judul, kategori, hariLalu, isi] of beritaData) {
      await BeritaKonservasi.findOrCreate({
        where: { judul },
        defaults: { admin_id: admin.id, kategori, isi, tanggal_terbit: tglPlus(hariLalu), foto_sampul: await fotoDemo(judul.split(' ').slice(0, 3).join(' '), `berita-${Math.abs(hariLalu)}`) },
      });
    }
    console.log('[SEED] 8 berita/kegiatan (berkategori) siap.');

    // ===== 9. PETA TITIK (koordinat CONTOH di sekitar Warmare — GANTI dengan titik asli) =====
    const titikData = [
      ['Pos Pengamatan Burung Pintar', 'pos_satwa', -1.0470, 133.9460, 'Pos utama pengamatan Vogelkop Bowerbird. Waktu terbaik: 05.30–09.00 WIT. Kapasitas 6 orang per sesi.'],
      ['Arena Tari Parotia', 'pos_satwa', -1.0495, 133.9502, 'Arena tanah tempat Parotia Arfak menari. Wajib tenang total — dilarang berbicara di dalam pos.'],
      ['Batas Hutan Lindung Arfak', 'batas_hutan', -1.0532, 133.9418, 'Titik masuk kawasan hutan lindung. Di luar titik ini seluruh aturan berkunjung berlaku ketat.'],
      ['Homestay Cenderawasih', 'homestay', -1.0448, 133.9485, 'Homestay 2 kamar milik warga, berkapasitas 4 orang. Lihat detail di halaman Paket Wisata.'],
      ['Rumah Kepala Kampung', 'tokoh', -1.0441, 133.9473, 'Kediaman Kepala Kampung Kwau. Tamu yang baru tiba dianjurkan singgah untuk melapor dan beramah-tamah.'],
      ['Balai Kampung Kwau', 'fasilitas', -1.0450, 133.9478, 'Titik kumpul seluruh kegiatan wisata: pengarahan, pembayaran, dan keberangkatan trekking dimulai dari sini.'],
    ];
    const titikMap = {};
    for (const [nama, kategori, lat, lng, deskripsi] of titikData) {
      const [t] = await PetaTitik.findOrCreate({
        where: { nama },
        defaults: { kategori, latitude: lat, longitude: lng, deskripsi, status_aktif: true, foto: await fotoDemo(nama, `titik-${nama.toLowerCase().replace(/[^a-z]+/g, '-')}`) },
      });
      titikMap[nama] = t;
    }
    console.log('[SEED] 6 titik peta siap (termasuk Rumah Kepala Kampung).');

    // ===== 10. TOKOH & PEMANDU (nama dan nomor WA = CONTOH) =====
    const tokohData = [
      ['Bapak Yosias M. (contoh)', 'Kepala Kampung Kwau', 'Pemerintahan kampung dan adat', '6281200000001',
        'Memimpin Kampung Kwau dan menjadi penjaga kesepakatan adat tentang hutan. Beliau menyambut setiap tamu yang datang melapor di kediamannya.', 'Rumah Kepala Kampung'],
      ['Bapak Hans W. (contoh)', 'Pemandu Burung Pintar', 'Birdwatching dan fotografi satwa', '6281200000002',
        'Lebih dari 15 tahun memandu peneliti dan fotografer dunia. Hafal lokasi setiap pondok Burung Pintar dan arena tari Parotia di hutan Kwau.', 'Pos Pengamatan Burung Pintar'],
      ['Ibu Martina S. (contoh)', 'Ketua Pokdarwis', 'Reservasi, homestay, dan kuliner lokal', '6281200000003',
        'Mengoordinasikan seluruh reservasi, pembagian tamu ke homestay, dan konsumsi. Hubungi beliau untuk semua urusan pemesanan.', 'Balai Kampung Kwau'],
    ];
    for (const [nama, jabatan, spesialisasi, no_wa, bio, namaTitik] of tokohData) {
      await TokohPemandu.findOrCreate({
        where: { nama },
        defaults: {
          jabatan, spesialisasi, no_wa, bio,
          peta_titik_id: titikMap[namaTitik]?.id || null,
          status_aktif: true,
          foto: await fotoDemo(nama.split(' ')[1], `tokoh-${no_wa.slice(-3)}`, 600, 600),
        },
      });
    }
    console.log('[SEED] 3 tokoh/pemandu siap (dengan tombol WhatsApp di peta).');

    // ===== 11b. HASIL PERTANIAN (bulan panen & harga = CONTOH) =====
    const pertanianData = [
      ['Kopi Arabika Arfak', 'Kopi & Rempah', 'Juni – Agustus (panen raya)', '1x panen raya per tahun', 'Rp80.000–120.000 / kg biji sangrai',
        'Kopi arabika dataran tinggi yang tumbuh di kebun agroforestri warga. Wisatawan dapat ikut memetik saat musim panen dan membeli biji sangrai langsung dari petani.'],
      ['Ubi Jalar (Petatas)', 'Umbi-umbian', 'Sepanjang tahun, puncak Maret dan Oktober', '2–3x tanam per tahun', 'Rp10.000–15.000 / kg',
        'Makanan pokok masyarakat Arfak dengan berbagai varietas lokal berwarna ungu, kuning, dan putih. Wajib dicoba dibakar langsung di bara api.'],
      ['Kentang Arfak', 'Umbi-umbian', 'April dan November', '2x panen per tahun', 'Rp15.000–20.000 / kg',
        'Kentang dataran tinggi bertekstur padat, hasil kebun lereng pegunungan. Banyak dibawa turun sebagai oleh-oleh ke Manokwari.'],
      ['Kubis (Kol)', 'Sayuran', 'Hampir sepanjang tahun', '3–4x panen per tahun', 'Rp8.000–12.000 / buah',
        'Kubis segar berukuran besar dari udara sejuk pegunungan — salah satu pemasok sayur utama untuk pasar Manokwari.'],
      ['Wortel', 'Sayuran', 'Februari, Juni, Oktober', '3x panen per tahun', 'Rp12.000–18.000 / kg',
        'Wortel manis dan renyah khas dataran tinggi. Sayur yang sama akan Anda temui di piring makan homestay.'],
      ['Daun Bawang', 'Sayuran', 'Setiap 2–3 bulan', '4–5x panen per tahun', 'Rp5.000 / ikat',
        'Ditanam hampir setiap keluarga di pekarangan. Aromanya menjadi ciri masakan kuah hangat khas kampung.'],
      ['Markisa Konyal', 'Buah', 'Mei – September', '1 musim panjang per tahun', 'Rp20.000–30.000 / kg',
        'Markisa manis khas pegunungan yang bisa dipetik langsung dari pagarnya. Segar diminum setelah trekking.'],
      ['Buah Merah', 'Buah', 'September – Desember', '1–2x panen per tahun', 'Rp50.000–100.000 / buah',
        'Buah khas Papua yang diolah menjadi minyak berkhasiat. Warga dengan senang hati menunjukkan cara pengolahan tradisionalnya.'],
    ];
    for (const [nama, kategori, bulan, frek, harga, deskripsi] of pertanianData) {
      await Pertanian.findOrCreate({
        where: { nama },
        defaults: { kategori, bulan_panen: bulan, frekuensi_panen: frek, harga_kisaran: harga, deskripsi, foto: await fotoDemo(nama, `tani-${nama.toLowerCase().replace(/[^a-z]+/g, '-')}`) },
      });
    }
    console.log('[SEED] 8 hasil pertanian siap.');

    // ===== 11. GALERI KAMPUNG (Pesona Kwau di Beranda) =====
    const pesona = [
      'Kabut Pagi di Lembah Kwau', 'Jalur Trekking Hutan Lumut', 'Pondok Hias Burung Pintar',
      'Air Terjun di Ujung Jalur', 'Senja dari Balai Kampung', 'Anggrek Hutan Arfak',
    ];
    for (const [i, judul] of pesona.entries()) {
      await GaleriKampung.findOrCreate({
        where: { judul },
        defaults: { urutan: i, url_foto: await fotoDemo(judul, `pesona-${i + 1}`, 900, 1100) },
      });
    }
    console.log('[SEED] 6 foto Pesona Kwau siap.');

    // ===== 12. JEJAK WISATAWAN (ulasan contoh, sudah approved) =====
    const ugcData = [
      ['Sarah K.', 'Jakarta', 5, 'Melihat Burung Pintar menghias pondoknya dengan bunga adalah pengalaman paling ajaib dalam hidup saya. Pemandu sangat sabar dan tahu persis kapan burungnya datang. Homestay sederhana tapi hangat sekali. (Ulasan contoh)', 'birdwatching'],
      ['Budi Santoso', 'Surabaya', 5, 'Trekking hutan lumutnya luar biasa — seperti masuk dunia dongeng. Anak saya 10 tahun kuat jalan karena jalurnya tidak terlalu berat. Makanannya enak, sayur segar dari kebun warga. (Ulasan contoh)', 'trekking'],
      ['Michael T.', 'Australia', 4, 'Tempat terbaik untuk memotret Parotia. Tiga pagi berturut-turut dan semuanya berhasil. Perjalanan ke kampung cukup menantang saat hujan, siapkan mobil 4WD. Sangat direkomendasikan. (Ulasan contoh)', 'kombinasi'],
    ];
    for (const [nama, asal, rating, ulasan, kat] of ugcData) {
      const [g, baru] = await GaleriUgc.findOrCreate({
        where: { nama_pengunjung: nama },
        defaults: {
          asal, rating, ulasan, status: 'approved',
          paket_wisata_id: paketMap[kat]?.id || null,
          moderated_by: admin.id, moderated_at: new Date(),
        },
      });
      if (baru) await GaleriUgcFoto.create({ galeri_ugc_id: g.id, url_foto: await fotoDemo(`Kiriman ${nama}`, `ugc-${g.id}`) });
    }
    console.log('[SEED] 3 ulasan wisatawan (approved) siap.');

    // ===== 13. RESERVASI CONTOH (agar dashboard & tabel admin terisi) =====
    const reservasiData = [
      ['Andi Wijaya (contoh)', '081311111111', 2, tglPlus(7), 'pending', paketMap.birdwatching],
      ['Keluarga Rahman (contoh)', '081322222222', 4, tglPlus(12), 'lunas', paketMap.homestay],
      ['Lisa Chen (contoh)', '081333333333', 1, tglPlus(-10), 'selesai', paketMap.kombinasi],
      ['Rudi H. (contoh)', '081344444444', 3, tglPlus(-3), 'batal', paketMap.trekking],
    ];
    for (const [nama_turis, no_wa, jumlah, tanggal, status, paket] of reservasiData) {
      if (!paket) continue;
      await Reservasi.findOrCreate({
        where: { nama_turis },
        defaults: { paket_wisata_id: paket.id, no_wa, jumlah_peserta: jumlah, tanggal_kunjungan: tanggal, status, catatan: 'Data contoh dari seed.' },
      });
    }
    console.log('[SEED] 4 reservasi contoh siap.');

    console.log('\n[SEED] SELESAI! Semua halaman kini berisi data contoh.');
    console.log('[SEED] Ingat: nama, nomor WA, koordinat, dan status konservasi adalah CONTOH — ganti dengan data asli via Dashboard Admin.');
    process.exit(0);
  } catch (err) {
    console.error('[SEED] Gagal:', err);
    process.exit(1);
  }
})();
