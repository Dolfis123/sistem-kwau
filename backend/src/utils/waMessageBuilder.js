const env = require('../config/env');

// Membuat link wa.me berisi pesan template reservasi.
// Turis yang memesan dalam bahasa Inggris mengirim pesan berbahasa Inggris
// (di admin tersedia template balasan bahasa Inggris untuk pengelola).
// nomorWa: nomor dari menu Pengaturan (wa_utama); jika kosong pakai WA_POKDARWIS di .env
module.exports = ({ namaTuris, namaPaket, tanggal, jumlahPeserta, kodeReservasi, nomorWa, negara, bahasa = 'id' }) => {
  const teks = bahasa === 'en'
    ? `Hello Pokdarwis Kampung Kwau, I would like to confirm my booking:\n` +
      `Code: #${kodeReservasi}\n` +
      `Name: ${namaTuris}${negara ? ` (${negara})` : ''}\n` +
      `Package: ${namaPaket}\n` +
      `Date: ${tanggal}\n` +
      `Guests: ${jumlahPeserta}\n` +
      `Could you please tell me the price and how to pay? Thank you.`
    : `Halo Pokdarwis Kampung Kwau, saya ingin konfirmasi reservasi:\n` +
      `Kode: #${kodeReservasi}\n` +
      `Nama: ${namaTuris}\n` +
      `Paket: ${namaPaket}\n` +
      `Tanggal: ${tanggal}\n` +
      `Jumlah peserta: ${jumlahPeserta}\n` +
      `Mohon informasi cara pembayarannya. Terima kasih.`;
  const nomor = String(nomorWa || env.WA_POKDARWIS || '').replace(/\D/g, '');
  return `https://wa.me/${nomor}?text=${encodeURIComponent(teks)}`;
};
