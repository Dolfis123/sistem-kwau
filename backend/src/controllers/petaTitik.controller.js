const { PetaTitik, TokohPemandu } = require('../models');
const { ok, fail } = require('../utils/apiResponse');
const { saveImage, deleteImage } = require('../utils/imageProcessor');

// PUBLIK: semua titik aktif + profil tokoh terkait
exports.listPublik = async (req, res, next) => {
  try {
    const where = { status_aktif: true };
    if (req.query.kategori) where.kategori = req.query.kategori;
    const rows = await PetaTitik.findAll({
      where,
      include: [{
        model: TokohPemandu, as: 'tokoh',
        where: { status_aktif: true }, required: false,
        attributes: ['id', 'nama', 'jabatan', 'spesialisasi', 'no_wa', 'foto'],
      }],
    });
    return ok(res, rows);
  } catch (err) { next(err); }
};

// ADMIN CRUD titik
exports.listAdmin = async (req, res, next) => {
  try { return ok(res, await PetaTitik.findAll({ order: [['created_at', 'DESC']] })); }
  catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.foto = await saveImage(req.file, 'peta');
    return ok(res, await PetaTitik.create(data), 'Titik peta berhasil dibuat.', 201);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const titik = await PetaTitik.findByPk(req.params.id);
    if (!titik) return fail(res, 'Titik tidak ditemukan.', 404);
    const data = { ...req.body };
    if (req.file) { await deleteImage(titik.foto); data.foto = await saveImage(req.file, 'peta'); }
    await titik.update(data);
    return ok(res, titik, 'Titik peta berhasil diperbarui.');
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const titik = await PetaTitik.findByPk(req.params.id);
    if (!titik) return fail(res, 'Titik tidak ditemukan.', 404);
    await deleteImage(titik.foto);
    await titik.destroy();
    return ok(res, null, 'Titik peta dihapus permanen.');
  } catch (err) { next(err); }
};
