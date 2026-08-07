// PERBAIKAN #5b: batas ukuran & tipe file upload
const multer = require('multer');

const storage = multer.memoryStorage(); // file ditahan di memori, lalu dikompres sharp

const fileFilter = (req, file, cb) => {
  const izin = ['image/jpeg', 'image/png', 'image/webp'];
  if (izin.includes(file.mimetype)) return cb(null, true);
  cb(new Error('Tipe file tidak diizinkan. Gunakan JPG, PNG, atau WebP.'));
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 }, // maks 8 MB per file (sebelum dikompres)
});
