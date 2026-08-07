const { sequelize, GaleriUgc, GaleriUgcFoto, ModerasiLog } = require('../models');
const { deleteImage } = require('../utils/imageProcessor');

const proses = async (id, aksi, adminId, catatan) => {
  return sequelize.transaction(async (t) => {
    const konten = await GaleriUgc.findByPk(id, { include: [{ model: GaleriUgcFoto, as: 'foto' }], transaction: t });
    if (!konten) { const err = new Error('Konten tidak ditemukan.'); err.status = 404; throw err; }

    await ModerasiLog.create({ galeri_ugc_id: id, admin_id: adminId, aksi, catatan: catatan || null }, { transaction: t });

    if (aksi === 'delete') {
      // Hapus permanen: file fisik + baris database
      for (const f of konten.foto) await deleteImage(f.url_foto);
      await konten.destroy({ transaction: t });
      return null;
    }

    konten.status = aksi === 'approve' ? 'approved' : 'rejected';
    konten.moderated_by = adminId;
    konten.moderated_at = new Date();
    await konten.save({ transaction: t });
    return konten;
  });
};

exports.approve = (id, adminId, catatan) => proses(id, 'approve', adminId, catatan);
exports.reject = (id, adminId, catatan) => proses(id, 'reject', adminId, catatan);
exports.remove = (id, adminId, catatan) => proses(id, 'delete', adminId, catatan);
