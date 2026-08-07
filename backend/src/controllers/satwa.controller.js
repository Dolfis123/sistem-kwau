const { Satwa } = require('../models');
const { ok, fail } = require('../utils/apiResponse');
const { getPagination, buildMeta } = require('../utils/pagination');
const { saveImage, deleteImage } = require('../utils/imageProcessor');

exports.listPublik = async (req, res, next) => {
  try {
    // V5: pagination opsional — aktif hanya bila ada ?page=
    if (req.query.page) {
      const { page, limit, offset } = getPagination(req, 9);
      const { rows, count } = await Satwa.findAndCountAll({ limit, offset, order: [['nama_lokal', 'ASC']] });
      return ok(res, rows, 'Berhasil', 200, buildMeta(count, page, limit));
    }
    return ok(res, await Satwa.findAll({ order: [['nama_lokal', 'ASC']] }));
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.foto = await saveImage(req.file, 'satwa');
    return ok(res, await Satwa.create(data), 'Data satwa berhasil dibuat.', 201);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const satwa = await Satwa.findByPk(req.params.id);
    if (!satwa) return fail(res, 'Satwa tidak ditemukan.', 404);
    const data = { ...req.body };
    if (req.file) { await deleteImage(satwa.foto); data.foto = await saveImage(req.file, 'satwa'); }
    await satwa.update(data);
    return ok(res, satwa, 'Data satwa berhasil diperbarui.');
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const satwa = await Satwa.findByPk(req.params.id);
    if (!satwa) return fail(res, 'Satwa tidak ditemukan.', 404);
    await deleteImage(satwa.foto);
    await satwa.destroy();
    return ok(res, null, 'Data satwa dihapus.');
  } catch (err) { next(err); }
};
