const { KontakPesan } = require('../models');
const { ok, fail } = require('../utils/apiResponse');
const { getPagination, buildMeta } = require('../utils/pagination');
const { pesan: teks } = require('../utils/bahasa');

exports.create = async (req, res, next) => {
  try {
    await KontakPesan.create({ nama: req.body.nama, email: req.body.email || null, pesan: req.body.pesan });
    return ok(res, null, teks(req, 'Pesan Anda telah terkirim. Terima kasih!', 'Your message has been sent. Thank you!'), 201);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req, 20);
    const { rows, count } = await KontakPesan.findAndCountAll({ limit, offset, order: [['created_at', 'DESC']] });
    return ok(res, rows, 'Berhasil', 200, buildMeta(count, page, limit));
  } catch (err) { next(err); }
};

exports.tandaiDibaca = async (req, res, next) => {
  try {
    const pesan = await KontakPesan.findByPk(req.params.id);
    if (!pesan) return fail(res, 'Pesan tidak ditemukan.', 404);
    await pesan.update({ status: 'dibaca' });
    return ok(res, pesan, 'Pesan ditandai dibaca.');
  } catch (err) { next(err); }
};
