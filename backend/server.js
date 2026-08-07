require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');
const { startCronJobs } = require('./src/cron/jobs');
const logger = require('./src/utils/logger');
const env = require('./src/config/env');

(async () => {
  try {
    await sequelize.authenticate();
    logger.info('Koneksi database berhasil.');

    // PENGGANTI MIGRATIONS:
    // sync() membuat semua tabel dari definisi model jika belum ada.
    // JANGAN pernah ganti menjadi sync({ force: true }) di produksi
    // karena akan MENGHAPUS semua tabel beserta datanya.
    await sequelize.sync();
    logger.info('Sinkronisasi tabel selesai.');

    startCronJobs();

    app.listen(env.PORT, () => {
      logger.info(`Server berjalan di port ${env.PORT} (${env.NODE_ENV})`);
    });
  } catch (err) {
    logger.error(`Gagal menjalankan server: ${err.message}`);
    process.exit(1);
  }
})();
