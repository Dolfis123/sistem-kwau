const { KontenStatis, PengaturanSistem } = require('../models');
const { ok, fail } = require('../utils/apiResponse');

// PUBLIK: ambil konten per slug (mis. sekilas-kwau, aturan-berkunjung)
exports.getBySlug = async (req, res, next) => {
  try {
    const konten = await KontenStatis.findOne({ where: { slug: req.params.slug } });
    if (!konten) return fail(res, 'Konten tidak ditemukan.', 404);
    return ok(res, konten);
  } catch (err) { next(err); }
};

exports.listAdmin = async (req, res, next) => {
  try { return ok(res, await KontenStatis.findAll()); }
  catch (err) { next(err); }
};

exports.upsert = async (req, res, next) => {
  try {
    const { slug, judul, isi, judul_en, isi_en } = req.body;
    if (!slug || !judul || !isi) return fail(res, 'slug, judul, dan isi wajib diisi.', 422);
    const [konten] = await KontenStatis.upsert({
      slug, judul, isi, judul_en: judul_en || null, isi_en: isi_en || null, updated_by: req.admin.id,
    });
    return ok(res, konten, 'Konten berhasil disimpan.');
  } catch (err) { next(err); }
};

// Pengaturan sistem (key-value): wa_utama, email_kontak, jam_operasional, dll.
exports.getPengaturan = async (req, res, next) => {
  try {
    const rows = await PengaturanSistem.findAll();
    const obj = Object.fromEntries(rows.map(r => [r.key, r.value]));
    return ok(res, obj);
  } catch (err) { next(err); }
};

exports.setPengaturan = async (req, res, next) => {
  try {
    const entries = Object.entries(req.body || {});
    for (const [key, value] of entries) {
      await PengaturanSistem.upsert({ key, value: String(value) });
    }
    return ok(res, null, 'Pengaturan berhasil disimpan.');
  } catch (err) { next(err); }
};
