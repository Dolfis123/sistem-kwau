const { Op } = require('sequelize');
const reservasiService = require('../services/reservasi.service');
const laporanService = require('../services/laporan.service');
const { Reservasi, PaketWisata } = require('../models');
const { ok, fail } = require('../utils/apiResponse');
const { getPagination, buildMeta } = require('../utils/pagination');
const { isEn, pesan } = require('../utils/bahasa');

// PUBLIK: turis mengirim reservasi -> tersimpan pending + dapat link WhatsApp
exports.create = async (req, res, next) => {
  try {
    const bahasa = req.body.bahasa || (isEn(req) ? 'en' : 'id');
    const { reservasi, waLink } = await reservasiService.create({ ...req.body, bahasa });
    return ok(res, { reservasi, wa_link: waLink }, pesan(req,
      'Reservasi tersimpan. Anda akan diarahkan ke WhatsApp Pokdarwis untuk konfirmasi.',
      'Booking saved. You will be redirected to WhatsApp to confirm with our team.'), 201);
  } catch (err) { next(err); }
};

// ADMIN
exports.list = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req, 20);
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.q) where.nama_turis = { [Op.like]: `%${req.query.q}%` };
    if (req.query.dari && req.query.sampai) {
      where.tanggal_kunjungan = { [Op.between]: [req.query.dari, req.query.sampai] };
    }
    const include = [{ model: PaketWisata, as: 'paket', attributes: ['id', 'nama', 'nama_en', 'kategori'] }];
    if (req.query.paket_id) where.paket_wisata_id = req.query.paket_id;
    if (req.query.bahasa) where.bahasa = req.query.bahasa;

    const { rows, count } = await Reservasi.findAndCountAll({
      where, include, limit, offset, order: [['created_at', 'DESC']],
    });
    return ok(res, rows, 'Berhasil', 200, buildMeta(count, page, limit));
  } catch (err) { next(err); }
};

exports.detail = async (req, res, next) => {
  try {
    const r = await Reservasi.findByPk(req.params.id, {
      include: [{ model: PaketWisata, as: 'paket', attributes: ['id', 'nama', 'kategori', 'harga'] }],
    });
    if (!r) return fail(res, 'Reservasi tidak ditemukan.', 404);
    return ok(res, r);
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const r = await reservasiService.updateStatus(req.params.id, req.body.status);
    return ok(res, r, 'Status reservasi berhasil diperbarui.');
  } catch (err) { next(err); }
};

// Kalender: jumlah reservasi per tanggal dalam satu bulan
exports.kalender = async (req, res, next) => {
  try {
    const bulan = req.query.bulan; // format YYYY-MM
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(bulan || '')) return fail(res, 'Parameter bulan wajib format YYYY-MM.', 422);
    // Hari terakhir bulan yang benar (28/29/30/31) — "-31" tidak valid untuk Feb/Apr/Jun/Sep/Nov
    const [th, bl] = bulan.split('-').map(Number);
    const hariTerakhir = new Date(Date.UTC(th, bl, 0)).getUTCDate();
    const rows = await Reservasi.findAll({
      where: {
        tanggal_kunjungan: { [Op.between]: [`${bulan}-01`, `${bulan}-${String(hariTerakhir).padStart(2, '0')}`] },
        status: { [Op.ne]: 'batal' },
      },
      attributes: ['tanggal_kunjungan', 'jumlah_peserta', 'status', 'id', 'nama_turis'],
      order: [['tanggal_kunjungan', 'ASC']],
    });
    return ok(res, rows);
  } catch (err) { next(err); }
};

// Export Excel
exports.exportExcel = async (req, res, next) => {
  try {
    const wb = await laporanService.exportReservasiExcel({
      dari: req.query.dari, sampai: req.query.sampai, status: req.query.status,
    });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=laporan-reservasi-kwau.xlsx`);
    await wb.xlsx.write(res);
    res.end();
  } catch (err) { next(err); }
};
