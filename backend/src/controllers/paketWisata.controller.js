const { Op } = require('sequelize');
const { PaketWisata, PaketFoto, PaketKetersediaan } = require('../models');
const { ok, fail } = require('../utils/apiResponse');
const { getPagination, buildMeta } = require('../utils/pagination');
const { saveImage, deleteImage } = require('../utils/imageProcessor');

// ===== PUBLIK =====
exports.listPublik = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req);
    const where = { status: 'aktif' };
    if (req.query.kategori) where.kategori = req.query.kategori;
    if (req.query.q) where.nama = { [Op.like]: `%${req.query.q}%` };

    const { rows, count } = await PaketWisata.findAndCountAll({
      where, limit, offset, order: [['created_at', 'DESC']],
      attributes: ['id', 'nama', 'kategori', 'harga', 'durasi', 'kapasitas', 'foto_cover'],
    });
    return ok(res, rows, 'Berhasil', 200, buildMeta(count, page, limit));
  } catch (err) { next(err); }
};

exports.detailPublik = async (req, res, next) => {
  try {
    const paket = await PaketWisata.findOne({
      where: { id: req.params.id, status: 'aktif' },
      include: [
        { model: PaketFoto, as: 'foto', attributes: ['id', 'url_foto', 'urutan'] },
        {
          model: PaketKetersediaan, as: 'ketersediaan',
          attributes: ['tanggal', 'kuota_tersedia', 'status'],
          where: { tanggal: { [Op.gte]: new Date() } },
          required: false,
        },
      ],
      order: [[{ model: PaketFoto, as: 'foto' }, 'urutan', 'ASC']],
    });
    if (!paket) return fail(res, 'Paket tidak ditemukan.', 404);
    return ok(res, paket);
  } catch (err) { next(err); }
};

// ===== ADMIN =====
exports.listAdmin = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req, 20);
    const where = {};
    if (req.query.status) where.status = req.query.status;
    const { rows, count } = await PaketWisata.findAndCountAll({ where, limit, offset, order: [['created_at', 'DESC']] });
    return ok(res, rows, 'Berhasil', 200, buildMeta(count, page, limit));
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body, admin_id: req.admin.id };
    if (req.file) data.foto_cover = await saveImage(req.file, 'paket');
    const paket = await PaketWisata.create(data);
    return ok(res, paket, 'Paket berhasil dibuat.', 201);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const paket = await PaketWisata.findByPk(req.params.id);
    if (!paket) return fail(res, 'Paket tidak ditemukan.', 404);
    const data = { ...req.body };
    if (req.file) {
      await deleteImage(paket.foto_cover);
      data.foto_cover = await saveImage(req.file, 'paket');
    }
    await paket.update(data);
    return ok(res, paket, 'Paket berhasil diperbarui.');
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const paket = await PaketWisata.findByPk(req.params.id, { include: [{ model: PaketFoto, as: 'foto' }] });
    if (!paket) return fail(res, 'Paket tidak ditemukan.', 404);
    await deleteImage(paket.foto_cover);
    for (const f of paket.foto) await deleteImage(f.url_foto);
    await paket.destroy();
    return ok(res, null, 'Paket berhasil dihapus.');
  } catch (err) { next(err); }
};

// Foto galeri paket (carousel)
exports.tambahFoto = async (req, res, next) => {
  try {
    const paket = await PaketWisata.findByPk(req.params.id);
    if (!paket) return fail(res, 'Paket tidak ditemukan.', 404);
    if (!req.files || req.files.length === 0) return fail(res, 'Tidak ada file yang diupload.', 422);

    const hasil = [];
    for (const [i, file] of req.files.entries()) {
      const url = await saveImage(file, 'paket');
      hasil.push(await PaketFoto.create({ paket_wisata_id: paket.id, url_foto: url, urutan: i }));
    }
    return ok(res, hasil, 'Foto berhasil ditambahkan.', 201);
  } catch (err) { next(err); }
};

exports.hapusFoto = async (req, res, next) => {
  try {
    const foto = await PaketFoto.findByPk(req.params.fotoId);
    if (!foto) return fail(res, 'Foto tidak ditemukan.', 404);
    await deleteImage(foto.url_foto);
    await foto.destroy();
    return ok(res, null, 'Foto berhasil dihapus.');
  } catch (err) { next(err); }
};

// Kalender ketersediaan (atur kuota/tutup tanggal manual)
exports.aturKetersediaan = async (req, res, next) => {
  try {
    const paket = await PaketWisata.findByPk(req.params.id);
    if (!paket) return fail(res, 'Paket tidak ditemukan.', 404);
    const { tanggal, kuota_tersedia, status } = req.body;
    const [slot] = await PaketKetersediaan.upsert({
      paket_wisata_id: paket.id, tanggal, kuota_tersedia,
      status: status || (kuota_tersedia > 0 ? 'tersedia' : 'penuh'),
    });
    return ok(res, slot, 'Ketersediaan berhasil diatur.');
  } catch (err) { next(err); }
};
