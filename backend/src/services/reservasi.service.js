// PERBAIKAN #1: logika kuota yang jelas & aman dari race condition.
//
// ATURAN BISNIS (sepakati juga dengan Pokdarwis):
// 1. Kuota berkurang SAAT reservasi masuk (status pending), agar tanggal
//    tidak bisa dipesan melebihi kapasitas walau belum dibayar.
// 2. Jika admin menandai "batal" (atau cron membatalkan otomatis karena
//    pending > 48 jam), kuota DIKEMBALIKAN.
// 3. Semua dijalankan dalam satu transaksi + row lock, sehingga dua turis
//    yang memesan bersamaan tidak bisa merebut slot yang sama.
const { sequelize, Reservasi, PaketWisata, PaketKetersediaan } = require('../models');
const waMessageBuilder = require('../utils/waMessageBuilder');

exports.create = async (data) => {
  return sequelize.transaction(async (t) => {
    const paket = await PaketWisata.findByPk(data.paket_wisata_id, { transaction: t });
    if (!paket || paket.status !== 'aktif') {
      const err = new Error('Paket wisata tidak ditemukan atau sedang nonaktif.'); err.status = 404; throw err;
    }

    // Ambil/buat baris ketersediaan untuk tanggal tsb, dengan lock baris
    let slot = await PaketKetersediaan.findOne({
      where: { paket_wisata_id: paket.id, tanggal: data.tanggal_kunjungan },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    if (!slot) {
      slot = await PaketKetersediaan.create({
        paket_wisata_id: paket.id,
        tanggal: data.tanggal_kunjungan,
        kuota_tersedia: paket.kapasitas,
        status: 'tersedia',
      }, { transaction: t });
    }

    if (slot.status === 'ditutup') {
      const err = new Error('Tanggal tersebut ditutup untuk reservasi.'); err.status = 409; throw err;
    }
    if (slot.kuota_tersedia < data.jumlah_peserta) {
      const err = new Error(`Kuota tanggal tersebut tidak cukup (tersisa ${slot.kuota_tersedia} slot).`);
      err.status = 409; throw err;
    }

    slot.kuota_tersedia -= data.jumlah_peserta;
    if (slot.kuota_tersedia === 0) slot.status = 'penuh';
    await slot.save({ transaction: t });

    const reservasi = await Reservasi.create({
      paket_wisata_id: paket.id,
      nama_turis: data.nama_turis,
      no_wa: data.no_wa,
      jumlah_peserta: data.jumlah_peserta,
      tanggal_kunjungan: data.tanggal_kunjungan,
      catatan: data.catatan || null,
      status: 'pending',
    }, { transaction: t });

    const waLink = waMessageBuilder({
      namaTuris: reservasi.nama_turis,
      namaPaket: paket.nama,
      tanggal: reservasi.tanggal_kunjungan,
      jumlahPeserta: reservasi.jumlah_peserta,
      kodeReservasi: reservasi.id,
    });

    return { reservasi, waLink };
  });
};

// Kembalikan kuota ketika reservasi dibatalkan
const kembalikanKuota = async (reservasi, t) => {
  const slot = await PaketKetersediaan.findOne({
    where: { paket_wisata_id: reservasi.paket_wisata_id, tanggal: reservasi.tanggal_kunjungan },
    lock: t.LOCK.UPDATE,
    transaction: t,
  });
  if (slot) {
    slot.kuota_tersedia += reservasi.jumlah_peserta;
    if (slot.status === 'penuh' && slot.kuota_tersedia > 0) slot.status = 'tersedia';
    await slot.save({ transaction: t });
  }
};

exports.updateStatus = async (id, statusBaru) => {
  return sequelize.transaction(async (t) => {
    const reservasi = await Reservasi.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!reservasi) { const err = new Error('Reservasi tidak ditemukan.'); err.status = 404; throw err; }

    const statusLama = reservasi.status;
    if (statusLama === statusBaru) return reservasi;

    // pending/lunas -> batal : kuota dikembalikan
    if (statusBaru === 'batal' && ['pending', 'lunas'].includes(statusLama)) {
      await kembalikanKuota(reservasi, t);
    }
    // batal -> diaktifkan lagi : kurangi kuota kembali (jika masih cukup)
    if (statusLama === 'batal' && ['pending', 'lunas'].includes(statusBaru)) {
      const slot = await PaketKetersediaan.findOne({
        where: { paket_wisata_id: reservasi.paket_wisata_id, tanggal: reservasi.tanggal_kunjungan },
        lock: t.LOCK.UPDATE, transaction: t,
      });
      if (slot && slot.kuota_tersedia < reservasi.jumlah_peserta) {
        const err = new Error('Kuota tanggal tersebut sudah tidak cukup untuk mengaktifkan kembali.'); err.status = 409; throw err;
      }
      if (slot) {
        slot.kuota_tersedia -= reservasi.jumlah_peserta;
        if (slot.kuota_tersedia === 0) slot.status = 'penuh';
        await slot.save({ transaction: t });
      }
    }

    reservasi.status = statusBaru;
    await reservasi.save({ transaction: t });
    return reservasi;
  });
};
