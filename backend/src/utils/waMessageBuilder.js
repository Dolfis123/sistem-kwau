const env = require('../config/env');

// Membuat link wa.me berisi pesan template reservasi
module.exports = ({ namaTuris, namaPaket, tanggal, jumlahPeserta, kodeReservasi }) => {
  const teks =
    `Halo Pokdarwis Kampung Kwau, saya ingin konfirmasi reservasi:\n` +
    `Kode: #${kodeReservasi}\n` +
    `Nama: ${namaTuris}\n` +
    `Paket: ${namaPaket}\n` +
    `Tanggal: ${tanggal}\n` +
    `Jumlah peserta: ${jumlahPeserta}\n` +
    `Mohon informasi cara pembayarannya. Terima kasih.`;
  return `https://wa.me/${env.WA_POKDARWIS}?text=${encodeURIComponent(teks)}`;
};
