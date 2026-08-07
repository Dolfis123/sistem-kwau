// PERBAIKAN #3: kompresi otomatis gambar dengan sharp.
// Foto HP 5-10 MB dikecilkan menjadi ratusan KB agar hemat disk VPS
// dan halaman tetap ringan di jaringan lambat.
const sharp = require('sharp');
const path = require('path');
const crypto = require('crypto');

const UPLOAD_ROOT = path.join(__dirname, '..', '..', 'public', 'uploads');

/**
 * Kompres & simpan satu file dari multer (memoryStorage).
 * @param {object} file  req.file / salah satu req.files
 * @param {string} folder subfolder: paket|satwa|galeri|berita|homestay|tokoh|peta
 * @returns {string} path relatif untuk disimpan di database, mis. /uploads/paket/abc.webp
 */
exports.saveImage = async (file, folder) => {
  const nama = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.webp`;
  const tujuan = path.join(UPLOAD_ROOT, folder, nama);
  require('fs').mkdirSync(path.join(UPLOAD_ROOT, folder), { recursive: true });

  await sharp(file.buffer)
    .rotate() // perbaiki orientasi foto HP
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(tujuan);

  return `/uploads/${folder}/${nama}`;
};

/** Hapus file fisik berdasarkan path DB (abaikan jika tidak ada). */
exports.deleteImage = async (dbPath) => {
  if (!dbPath) return;
  const fs = require('fs/promises');
  const full = path.join(__dirname, '..', '..', 'public', dbPath.replace(/^\//, ''));
  try { await fs.unlink(full); } catch (_) { /* file sudah tidak ada */ }
};
