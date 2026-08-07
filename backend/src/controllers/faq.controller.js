const { Faq } = require('../models');
const { ok, fail } = require('../utils/apiResponse');

exports.listPublik = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.kategori) where.kategori = req.query.kategori;
    return ok(res, await Faq.findAll({ where, order: [['kategori', 'ASC'], ['urutan', 'ASC']] }));
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try { return ok(res, await Faq.create(req.body), 'FAQ berhasil dibuat.', 201); }
  catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const faq = await Faq.findByPk(req.params.id);
    if (!faq) return fail(res, 'FAQ tidak ditemukan.', 404);
    await faq.update(req.body);
    return ok(res, faq, 'FAQ berhasil diperbarui.');
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const faq = await Faq.findByPk(req.params.id);
    if (!faq) return fail(res, 'FAQ tidak ditemukan.', 404);
    await faq.destroy();
    return ok(res, null, 'FAQ dihapus.');
  } catch (err) { next(err); }
};
