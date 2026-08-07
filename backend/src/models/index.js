// Inisialisasi seluruh model + relasi antar tabel (sesuai ERD blueprint 5.2)
const sequelize = require('../config/database');

const Admin = require('./admin.model');
const PaketWisata = require('./paketWisata.model');
const PaketFoto = require('./paketFoto.model');
const PaketKetersediaan = require('./paketKetersediaan.model');
const Reservasi = require('./reservasi.model');
const Homestay = require('./homestay.model');
const HomestayFoto = require('./homestayFoto.model');
const Satwa = require('./satwa.model');
const BeritaKonservasi = require('./beritaKonservasi.model');
const GaleriUgc = require('./galeriUgc.model');
const GaleriUgcFoto = require('./galeriUgcFoto.model');
const ModerasiLog = require('./moderasiLog.model');
const PetaTitik = require('./petaTitik.model');
const TokohPemandu = require('./tokohPemandu.model');
const Faq = require('./faq.model');
const KontenStatis = require('./kontenStatis.model');
const PengaturanSistem = require('./pengaturanSistem.model');
const KontakPesan = require('./kontakPesan.model');
const GaleriKampung = require('./galeriKampung.model');
const Pertanian = require('./pertanian.model');

// admins 1:N ...
Admin.hasMany(PaketWisata, { foreignKey: 'admin_id' });
PaketWisata.belongsTo(Admin, { foreignKey: 'admin_id', as: 'pembuat' });

Admin.hasMany(BeritaKonservasi, { foreignKey: 'admin_id' });
BeritaKonservasi.belongsTo(Admin, { foreignKey: 'admin_id', as: 'penulis' });

Admin.hasMany(ModerasiLog, { foreignKey: 'admin_id' });
ModerasiLog.belongsTo(Admin, { foreignKey: 'admin_id', as: 'admin' });

KontenStatis.belongsTo(Admin, { foreignKey: 'updated_by', as: 'editor' });

// paket_wisata 1:N ...
PaketWisata.hasMany(PaketFoto, { foreignKey: 'paket_wisata_id', as: 'foto', onDelete: 'CASCADE' });
PaketFoto.belongsTo(PaketWisata, { foreignKey: 'paket_wisata_id' });

PaketWisata.hasMany(PaketKetersediaan, { foreignKey: 'paket_wisata_id', as: 'ketersediaan', onDelete: 'CASCADE' });
PaketKetersediaan.belongsTo(PaketWisata, { foreignKey: 'paket_wisata_id' });

PaketWisata.hasMany(Reservasi, { foreignKey: 'paket_wisata_id' });
Reservasi.belongsTo(PaketWisata, { foreignKey: 'paket_wisata_id', as: 'paket' });

PaketWisata.hasMany(GaleriUgc, { foreignKey: 'paket_wisata_id' });
GaleriUgc.belongsTo(PaketWisata, { foreignKey: 'paket_wisata_id', as: 'paket' });

// homestay 1:N foto
Homestay.hasMany(HomestayFoto, { foreignKey: 'homestay_id', as: 'foto', onDelete: 'CASCADE' });
HomestayFoto.belongsTo(Homestay, { foreignKey: 'homestay_id' });

// galeri_ugc 1:N ...
GaleriUgc.hasMany(GaleriUgcFoto, { foreignKey: 'galeri_ugc_id', as: 'foto', onDelete: 'CASCADE' });
GaleriUgcFoto.belongsTo(GaleriUgc, { foreignKey: 'galeri_ugc_id' });

GaleriUgc.hasMany(ModerasiLog, { foreignKey: 'galeri_ugc_id', as: 'riwayat', onDelete: 'CASCADE' });
ModerasiLog.belongsTo(GaleriUgc, { foreignKey: 'galeri_ugc_id' });

GaleriUgc.belongsTo(Admin, { foreignKey: 'moderated_by', as: 'moderator' });

// peta_titik 1:N tokoh
PetaTitik.hasMany(TokohPemandu, { foreignKey: 'peta_titik_id', as: 'tokoh' });
TokohPemandu.belongsTo(PetaTitik, { foreignKey: 'peta_titik_id', as: 'titik' });

module.exports = {
  sequelize,
  Admin, PaketWisata, PaketFoto, PaketKetersediaan, Reservasi,
  Homestay, HomestayFoto, Satwa, BeritaKonservasi,
  GaleriUgc, GaleriUgcFoto, ModerasiLog,
  PetaTitik, TokohPemandu, Faq, KontenStatis, PengaturanSistem, KontakPesan, GaleriKampung, Pertanian,
};
