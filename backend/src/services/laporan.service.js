const ExcelJS = require('exceljs');
const { Op } = require('sequelize');
const { Reservasi, PaketWisata } = require('../models');

// Export Excel reservasi (filter rentang tanggal & status) — untuk laporan
// ke Dinas Pariwisata / BPS / BKSDA.
exports.exportReservasiExcel = async ({ dari, sampai, status }) => {
  const where = {};
  if (dari && sampai) where.tanggal_kunjungan = { [Op.between]: [dari, sampai] };
  else if (dari) where.tanggal_kunjungan = { [Op.gte]: dari };
  else if (sampai) where.tanggal_kunjungan = { [Op.lte]: sampai };
  if (status) where.status = status;

  const rows = await Reservasi.findAll({
    where,
    include: [{ model: PaketWisata, as: 'paket', attributes: ['nama', 'kategori'] }],
    order: [['tanggal_kunjungan', 'ASC']],
  });

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Reservasi');
  ws.columns = [
    { header: 'No', key: 'no', width: 6 },
    { header: 'Nama Turis', key: 'nama', width: 25 },
    { header: 'No. WhatsApp', key: 'wa', width: 18 },
    { header: 'Paket', key: 'paket', width: 30 },
    { header: 'Kategori', key: 'kategori', width: 15 },
    { header: 'Tanggal Kunjungan', key: 'tanggal', width: 18 },
    { header: 'Jumlah Peserta', key: 'peserta', width: 15 },
    { header: 'Bahasa', key: 'bahasa', width: 10 },
    { header: 'Negara Asal', key: 'negara', width: 18 },
    { header: 'Status', key: 'status', width: 12 },
    { header: 'Dibuat', key: 'dibuat', width: 20 },
  ];
  ws.getRow(1).font = { bold: true };

  rows.forEach((r, i) => ws.addRow({
    no: i + 1,
    nama: r.nama_turis,
    wa: r.no_wa,
    paket: r.paket ? r.paket.nama : '-',
    kategori: r.paket ? r.paket.kategori : '-',
    tanggal: r.tanggal_kunjungan,
    peserta: r.jumlah_peserta,
    bahasa: r.bahasa === 'en' ? 'Inggris' : 'Indonesia',
    negara: r.negara || '-',
    status: r.status,
    dibuat: r.created_at ? new Date(r.created_at).toLocaleString('id-ID') : '',
  }));

  return wb;
};
