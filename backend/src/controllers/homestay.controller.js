const { Homestay, HomestayFoto } = require('../models');
const { ok, fail } = require('../utils/apiResponse');
const { getPagination, buildMeta } = require('../utils/pagination');
const { saveImage, deleteImage } = require('../utils/imageProcessor');

exports.listPublik = async (req, res, next) => {
  try {
    if (req.query.page) {
      const { page, limit, offset } = getPagination(req, 6);
      const { rows, count } = await Homestay.findAndCountAll({
        include: [{ model: HomestayFoto, as: 'foto' }], limit, offset, distinct: true,
      });
      return ok(res, rows, 'Berhasil', 200, buildMeta(count, page, limit));
    }
    return ok(res, await Homestay.findAll({ include: [{ model: HomestayFoto, as: 'foto' }] }));
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const homestay = await Homestay.create(req.body);
    if (req.files) {
      for (const file of req.files) {
        const url = await saveImage(file, 'homestay');
        await HomestayFoto.create({ homestay_id: homestay.id, url_foto: url });
      }
    }
    return ok(res, homestay, 'Homestay berhasil dibuat.', 201);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const homestay = await Homestay.findByPk(req.params.id);
    if (!homestay) return fail(res, 'Homestay tidak ditemukan.', 404);
    await homestay.update(req.body);
    if (req.files) {
      for (const file of req.files) {
        const url = await saveImage(file, 'homestay');
        await HomestayFoto.create({ homestay_id: homestay.id, url_foto: url });
      }
    }
    return ok(res, homestay, 'Homestay berhasil diperbarui.');
  } catch (err) { next(err); }
};

exports.hapusFoto = async (req, res, next) => {
  try {
    const foto = await HomestayFoto.findByPk(req.params.fotoId);
    if (!foto) return fail(res, 'Foto tidak ditemukan.', 404);
    await deleteImage(foto.url_foto);
    await foto.destroy();
    return ok(res, null, 'Foto dihapus.');
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const homestay = await Homestay.findByPk(req.params.id, { include: [{ model: HomestayFoto, as: 'foto' }] });
    if (!homestay) return fail(res, 'Homestay tidak ditemukan.', 404);
    for (const f of homestay.foto) await deleteImage(f.url_foto);
    await homestay.destroy();
    return ok(res, null, 'Homestay dihapus.');
  } catch (err) { next(err); }
};
