// PERBAIKAN #1 (lanjutan): tugas terjadwal node-cron.
// 1. Batalkan otomatis reservasi pending > 48 jam dan kembalikan kuotanya
//    (turis yang tidak konfirmasi/bayar tidak boleh menyandera slot).
// 2. Tutup baris ketersediaan yang tanggalnya sudah lewat.
const cron = require('node-cron');
const { Op } = require('sequelize');
const { Reservasi, PaketKetersediaan } = require('../models');
const reservasiService = require('../services/reservasi.service');
const logger = require('../utils/logger');

const BATAS_PENDING_JAM = 48;

const batalkanPendingKedaluwarsa = async () => {
  const batas = new Date(Date.now() - BATAS_PENDING_JAM * 60 * 60 * 1000);
  const daftar = await Reservasi.findAll({
    where: { status: 'pending', created_at: { [Op.lt]: batas } },
  });
  for (const r of daftar) {
    try {
      await reservasiService.updateStatus(r.id, 'batal'); // kuota otomatis dikembalikan
      logger.info(`[CRON] Reservasi #${r.id} dibatalkan otomatis (pending > ${BATAS_PENDING_JAM} jam).`);
    } catch (err) {
      logger.error(`[CRON] Gagal membatalkan reservasi #${r.id}: ${err.message}`);
    }
  }
};

const tutupTanggalLewat = async () => {
  const [jumlah] = await PaketKetersediaan.update(
    { status: 'ditutup' },
    { where: { tanggal: { [Op.lt]: new Date() }, status: { [Op.ne]: 'ditutup' } } }
  );
  if (jumlah > 0) logger.info(`[CRON] ${jumlah} tanggal ketersediaan yang sudah lewat ditutup.`);
};

exports.startCronJobs = () => {
  // Setiap hari pukul 01.00 WIT
  cron.schedule('0 1 * * *', async () => {
    logger.info('[CRON] Menjalankan tugas harian...');
    await batalkanPendingKedaluwarsa();
    await tutupTanggalLewat();
  }, { timezone: 'Asia/Jayapura' });

  logger.info('Cron jobs terjadwal (harian 01.00 WIT).');
};
