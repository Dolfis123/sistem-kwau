const { TokohPemandu, PetaTitik } = require('../models');
const { ok, fail } = require('../utils/apiResponse');
const { saveImage, deleteImage } = require('../utils/imageProcessor');

// V2 PUBLIK: profil pemandu & pengelola aktif (tanpa login)
exports.listPublik = async (req, res, next) => {
  try {
    return ok(res, await TokohPemandu.findAll({
      where: { status_aktif: true },
      attributes: ['id', 'nama', 'jabatan', 'jabatan_en', 'spesialisasi', 'spesialisasi_en', 'bio', 'bio_en', 'bahasa', 'no_wa', 'foto'],
      order: [['created_at', 'ASC']],
    }));
  } catch (err) { next(err); }
};

exports.listAdmin = async (req, res, next) => {
  try {
    return ok(res, await TokohPemandu.findAll({
      include: [{ model: PetaTitik, as: 'titik', attributes: ['id', 'nama'] }],
      order: [['created_at', 'DESC']],
    }));
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.foto = await saveImage(req.file, 'tokoh');
    return ok(res, await TokohPemandu.create(data), 'Tokoh/pemandu berhasil ditambahkan.', 201);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const tokoh = await TokohPemandu.findByPk(req.params.id);
    if (!tokoh) return fail(res, 'Tokoh tidak ditemukan.', 404);
    const data = { ...req.body };
    if (req.file) { await deleteImage(tokoh.foto); data.foto = await saveImage(req.file, 'tokoh'); }
    await tokoh.update(data);
    return ok(res, tokoh, 'Data tokoh berhasil diperbarui.');
  } catch (err) { next(err); }
};

// Soft delete (nonaktifkan) sesuai blueprint
exports.nonaktifkan = async (req, res, next) => {
  try {
    const tokoh = await TokohPemandu.findByPk(req.params.id);
    if (!tokoh) return fail(res, 'Tokoh tidak ditemukan.', 404);
    await tokoh.update({ status_aktif: !tokoh.status_aktif });
    return ok(res, tokoh, `Tokoh ${tokoh.status_aktif ? 'diaktifkan' : 'dinonaktifkan'}.`);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const tokoh = await TokohPemandu.findByPk(req.params.id);
    if (!tokoh) return fail(res, 'Tokoh tidak ditemukan.', 404);
    await deleteImage(tokoh.foto);
    await tokoh.destroy();
    return ok(res, null, 'Tokoh dihapus permanen.');
  } catch (err) { next(err); }
};
