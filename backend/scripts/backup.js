// PERBAIKAN #4: backup otomatis database dengan mysqldump.
// Jalankan manual:  npm run backup
// Otomatis harian:  tambahkan ke crontab VPS (lihat README.md).
// File backup disimpan di folder backups/ dan hanya 14 terakhir yang disimpan.
require('dotenv').config();
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '..', 'backups');
const MAKS_FILE = 14;

if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

const tanggal = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
const namaFile = path.join(BACKUP_DIR, `kwau-${tanggal}.sql`);

const args = [
  `-h${process.env.DB_HOST || 'localhost'}`,
  `-P${process.env.DB_PORT || 3306}`,
  `-u${process.env.DB_USER}`,
];
if (process.env.DB_PASS) args.push(`-p${process.env.DB_PASS}`);
args.push('--single-transaction', '--routines', process.env.DB_NAME);

const out = fs.createWriteStream(namaFile);
const dump = spawn('mysqldump', args);

dump.stdout.pipe(out);
dump.stderr.on('data', (d) => process.stderr.write(d));

dump.on('close', (code) => {
  if (code !== 0) {
    console.error(`[BACKUP] Gagal (kode ${code}). Pastikan mysqldump terpasang & kredensial .env benar.`);
    try { fs.unlinkSync(namaFile); } catch (_) {}
    process.exit(1);
  }
  console.log(`[BACKUP] Berhasil: ${namaFile}`);

  // Hapus backup lama, sisakan MAKS_FILE terbaru
  const files = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort()
    .reverse();
  files.slice(MAKS_FILE).forEach(f => {
    fs.unlinkSync(path.join(BACKUP_DIR, f));
    console.log(`[BACKUP] Backup lama dihapus: ${f}`);
  });
  process.exit(0);
});
