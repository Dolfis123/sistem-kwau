const { BeritaKonservasi, Admin } = require('../models');
const { ok, fail } = require('../utils/apiResponse');
const { getPagination, buildMeta } = require('../utils/pagination');
const { saveImage, deleteImage } = require('../utils/imageProcessor');

exports.listPublik = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req, 9);
    const where = {};
    if (req.query.kategori) where.kategori = req.query.kategori;
    const { rows, count } = await BeritaKonservasi.findAndCountAll({
      where, limit, offset, order: [['tanggal_terbit', 'DESC']],
      attributes: ['id', 'judul', 'kategori', 'foto_sampul', 'tanggal_terbit'],
    });
    return ok(res, rows, 'Berhasil', 200, buildMeta(count, page, limit));
  } catch (err) { next(err); }
};

exports.detailPublik = async (req, res, next) => {
  try {
    const berita = await BeritaKonservasi.findByPk(req.params.id, {
      include: [{ model: Admin, as: 'penulis', attributes: ['nama'] }],
    });
    if (!berita) return fail(res, 'Berita tidak ditemukan.', 404);
    return ok(res, berita);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body, admin_id: req.admin.id };
    if (req.file) data.foto_sampul = await saveImage(req.file, 'berita');
    return ok(res, await BeritaKonservasi.create(data), 'Berita berhasil dibuat.', 201);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const berita = await BeritaKonservasi.findByPk(req.params.id);
    if (!berita) return fail(res, 'Berita tidak ditemukan.', 404);
    const data = { ...req.body };
    if (req.file) { await deleteImage(berita.foto_sampul); data.foto_sampul = await saveImage(req.file, 'berita'); }
    await berita.update(data);
    return ok(res, berita, 'Berita berhasil diperbarui.');
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const berita = await BeritaKonservasi.findByPk(req.params.id);
    if (!berita) return fail(res, 'Berita tidak ditemukan.', 404);
    await deleteImage(berita.foto_sampul);
    await berita.destroy();
    return ok(res, null, 'Berita dihapus.');
  } catch (err) { next(err); }
};
