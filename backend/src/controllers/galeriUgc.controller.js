const { Op } = require('sequelize');
const moderasiService = require('../services/moderasi.service');
const { GaleriUgc, GaleriUgcFoto, ModerasiLog, PaketWisata, Admin } = require('../models');
const { ok, fail } = require('../utils/apiResponse');
const { getPagination, buildMeta } = require('../utils/pagination');
const { saveImage } = require('../utils/imageProcessor');

// PUBLIK: galeri approved saja; kolom "kontak" TIDAK pernah dikirim ke publik
exports.listPublik = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req);
    const where = { status: 'approved' };
    if (req.query.paket_id) where.paket_wisata_id = req.query.paket_id;

    const { rows, count } = await GaleriUgc.findAndCountAll({
      where, limit, offset,
      attributes: ['id', 'nama_pengunjung', 'asal', 'ulasan', 'rating', 'created_at'],
      include: [
        { model: GaleriUgcFoto, as: 'foto', attributes: ['url_foto'] },
        { model: PaketWisata, as: 'paket', attributes: ['id', 'nama'] },
      ],
      order: [['created_at', 'DESC']],
      distinct: true,
    });
    return ok(res, rows, 'Berhasil', 200, buildMeta(count, page, limit));
  } catch (err) { next(err); }
};

// PUBLIK: kirim pengalaman (maks 2 foto), status awal pending
exports.create = async (req, res, next) => {
  try {
    const konten = await GaleriUgc.create({
      paket_wisata_id: req.body.paket_wisata_id || null,
      nama_pengunjung: req.body.nama_pengunjung || 'Anonim',
      asal: req.body.asal || null,
      kontak: req.body.kontak || null,
      ulasan: req.body.ulasan,
      rating: req.body.rating || null,
      status: 'pending',
    });
    if (req.files && req.files.length > 0) {
      for (const file of req.files.slice(0, 2)) {
        const url = await saveImage(file, 'galeri');
        await GaleriUgcFoto.create({ galeri_ugc_id: konten.id, url_foto: url });
      }
    }
    return ok(res, { id: konten.id },
      'Terima kasih! Kiriman Anda akan tayang setelah ditinjau oleh admin.', 201);
  } catch (err) { next(err); }
};

// ADMIN: antrean moderasi / arsip
exports.listAdmin = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req, 20);
    const where = {};
    where.status = req.query.status || 'pending'; // default: antrean pending
    const { rows, count } = await GaleriUgc.findAndCountAll({
      where, limit, offset,
      include: [
        { model: GaleriUgcFoto, as: 'foto' },
        { model: PaketWisata, as: 'paket', attributes: ['id', 'nama'] },
        { model: Admin, as: 'moderator', attributes: ['id', 'nama'] },
      ],
      order: [['created_at', 'ASC']],
      distinct: true,
    });
    return ok(res, rows, 'Berhasil', 200, buildMeta(count, page, limit));
  } catch (err) { next(err); }
};

exports.detailAdmin = async (req, res, next) => {
  try {
    const konten = await GaleriUgc.findByPk(req.params.id, {
      include: [
        { model: GaleriUgcFoto, as: 'foto' },
        { model: PaketWisata, as: 'paket', attributes: ['id', 'nama'] },
        { model: ModerasiLog, as: 'riwayat', include: [{ model: Admin, as: 'admin', attributes: ['id', 'nama'] }] },
      ],
    });
    if (!konten) return fail(res, 'Konten tidak ditemukan.', 404);
    return ok(res, konten);
  } catch (err) { next(err); }
};

exports.approve = async (req, res, next) => {
  try { return ok(res, await moderasiService.approve(req.params.id, req.admin.id, req.body.catatan), 'Konten disetujui & tayang di publik.'); }
  catch (err) { next(err); }
};
exports.reject = async (req, res, next) => {
  try { return ok(res, await moderasiService.reject(req.params.id, req.admin.id, req.body.catatan), 'Konten ditolak & diarsipkan.'); }
  catch (err) { next(err); }
};
exports.remove = async (req, res, next) => {
  try { await moderasiService.remove(req.params.id, req.admin.id, req.body.catatan); return ok(res, null, 'Konten dihapus permanen.'); }
  catch (err) { next(err); }
};

// Riwayat moderasi keseluruhan (audit)
exports.riwayat = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req, 30);
    const { rows, count } = await ModerasiLog.findAndCountAll({
      limit, offset,
      include: [{ model: Admin, as: 'admin', attributes: ['id', 'nama'] }],
      order: [['created_at', 'DESC']],
    });
    return ok(res, rows, 'Berhasil', 200, buildMeta(count, page, limit));
  } catch (err) { next(err); }
};
