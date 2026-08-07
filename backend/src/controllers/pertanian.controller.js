const { Pertanian } = require('../models');
const { ok, fail } = require('../utils/apiResponse');
const { getPagination, buildMeta } = require('../utils/pagination');
const { saveImage, deleteImage } = require('../utils/imageProcessor');

exports.listPublik = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.kategori) where.kategori = req.query.kategori;
    if (req.query.page) {
      const { page, limit, offset } = getPagination(req, 12);
      const { rows, count } = await Pertanian.findAndCountAll({ where, limit, offset, order: [['kategori', 'ASC'], ['nama', 'ASC']] });
      return ok(res, rows, 'Berhasil', 200, buildMeta(count, page, limit));
    }
    return ok(res, await Pertanian.findAll({ where, order: [['kategori', 'ASC'], ['nama', 'ASC']] }));
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.foto = await saveImage(req.file, 'pertanian');
    return ok(res, await Pertanian.create(data), 'Hasil pertanian berhasil ditambahkan.', 201);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Pertanian.findByPk(req.params.id);
    if (!item) return fail(res, 'Data tidak ditemukan.', 404);
    const data = { ...req.body };
    if (req.file) { await deleteImage(item.foto); data.foto = await saveImage(req.file, 'pertanian'); }
    await item.update(data);
    return ok(res, item, 'Data berhasil diperbarui.');
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Pertanian.findByPk(req.params.id);
    if (!item) return fail(res, 'Data tidak ditemukan.', 404);
    await deleteImage(item.foto);
    await item.destroy();
    return ok(res, null, 'Data dihapus.');
  } catch (err) { next(err); }
};
