// V2: CRUD foto keindahan kampung untuk section "Pesona Kwau" di Beranda
const { GaleriKampung } = require('../models');
const { ok, fail } = require('../utils/apiResponse');
const { getPagination, buildMeta } = require('../utils/pagination');
const { saveImage, deleteImage } = require('../utils/imageProcessor');

exports.listPublik = async (req, res, next) => {
  try {
    if (req.query.page) {
      const { page, limit, offset } = getPagination(req, 12);
      const { rows, count } = await GaleriKampung.findAndCountAll({ limit, offset, order: [['urutan', 'ASC'], ['created_at', 'DESC']] });
      return ok(res, rows, 'Berhasil', 200, buildMeta(count, page, limit));
    }
    return ok(res, await GaleriKampung.findAll({ order: [['urutan', 'ASC'], ['created_at', 'DESC']] }));
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    if (!req.file) return fail(res, 'Foto wajib diupload.', 422);
    const url = await saveImage(req.file, 'kampung');
    const item = await GaleriKampung.create({ judul: req.body.judul, urutan: req.body.urutan || 0, url_foto: url });
    return ok(res, item, 'Foto berhasil ditambahkan.', 201);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await GaleriKampung.findByPk(req.params.id);
    if (!item) return fail(res, 'Data tidak ditemukan.', 404);
    const data = { judul: req.body.judul, urutan: req.body.urutan };
    if (req.file) { await deleteImage(item.url_foto); data.url_foto = await saveImage(req.file, 'kampung'); }
    await item.update(data);
    return ok(res, item, 'Foto berhasil diperbarui.');
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await GaleriKampung.findByPk(req.params.id);
    if (!item) return fail(res, 'Data tidak ditemukan.', 404);
    await deleteImage(item.url_foto);
    await item.destroy();
    return ok(res, null, 'Foto dihapus.');
  } catch (err) { next(err); }
};
