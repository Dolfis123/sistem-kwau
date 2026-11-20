// Template balasan WhatsApp untuk pengelola (Pokdarwis) — membantu warga membalas
// turis mancanegara dalam bahasa Inggris yang baik, tanpa harus fasih berbahasa Inggris.
// Setiap template punya: kode, teks Inggris (en), teks Indonesia, dan "arti" (penjelasan untuk admin).
// Bagian bertanda [....] WAJIB diisi admin di WhatsApp sebelum pesan dikirim.

const tgl = (t, locale) => new Date(t).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

export const TEMPLATE_BALASAN = [
  {
    kode: 'diterima',
    judul: 'Reservasi diterima',
    arti: 'Terima kasih sudah memesan. Kode reservasi Anda #… Kami akan segera mengirim harga dan cara pembayaran.',
    en: (r) => `Hello ${r.nama_turis}, thank you for booking "${r.paket}" with Kampung Kwau for ${r.jumlah_peserta} guest(s) on ${tgl(r.tanggal_kunjungan, 'en-GB')}.\n\nYour booking code is #${r.id}. We have received your request and will send you the price and payment details shortly.\n\nWarm regards,\nPokdarwis Kampung Kwau`,
    id: (r) => `Halo ${r.nama_turis}, terima kasih telah memesan paket "${r.paket}" di Kampung Kwau untuk ${r.jumlah_peserta} orang pada ${tgl(r.tanggal_kunjungan, 'id-ID')}.\n\nKode reservasi Anda #${r.id}. Permintaan Anda sudah kami terima, dan kami akan segera mengirimkan harga serta cara pembayarannya.\n\nSalam hangat,\nPokdarwis Kampung Kwau`,
  },
  {
    kode: 'harga',
    judul: 'Kirim harga & cara bayar',
    arti: 'Harga paket untuk … orang adalah Rp [....]. Silakan bayar lewat [....]. Setelah membayar, kirim foto bukti pembayaran.',
    isian: true,
    en: (r) => `Hello ${r.nama_turis}, the price for "${r.paket}" for ${r.jumlah_peserta} guest(s) is IDR [....].\n\nThis includes: [....]\n\nPayment can be made by: [....]\nAfter paying, please send us a photo of your receipt so we can confirm your booking #${r.id}.\n\nThank you!`,
    id: (r) => `Halo ${r.nama_turis}, harga paket "${r.paket}" untuk ${r.jumlah_peserta} orang adalah Rp [....].\n\nSudah termasuk: [....]\n\nPembayaran dapat dilakukan melalui: [....]\nSetelah membayar, mohon kirimkan foto bukti pembayaran agar reservasi #${r.id} dapat kami konfirmasi.\n\nTerima kasih!`,
  },
  {
    kode: 'lunas',
    judul: 'Pembayaran diterima',
    arti: 'Pembayaran sudah kami terima. Reservasi Anda untuk tanggal … sudah pasti. Kami menantikan kedatangan Anda.',
    en: (r) => `Hello ${r.nama_turis}, we have received your payment — thank you!\n\nYour booking #${r.id} for "${r.paket}" on ${tgl(r.tanggal_kunjungan, 'en-GB')} is now confirmed. We look forward to welcoming you to Kwau!`,
    id: (r) => `Halo ${r.nama_turis}, pembayaran Anda sudah kami terima — terima kasih!\n\nReservasi #${r.id} untuk paket "${r.paket}" pada ${tgl(r.tanggal_kunjungan, 'id-ID')} sudah terkonfirmasi. Kami menantikan kedatangan Anda di Kwau!`,
  },
  {
    kode: 'arah',
    judul: 'Petunjuk perjalanan',
    arti: 'Cara ke Kwau: terbang ke Bandara Rendani Manokwari, lalu ±1,5 jam naik mobil. Kami bisa menjemput — kabari jam kedatangan. Bawa uang tunai, jas hujan, dan pakaian hangat.',
    en: (r) => `Hello ${r.nama_turis}, here is how to reach Kwau:\n\n1. Fly to Rendani Airport in Manokwari (MKW).\n2. From Manokwari it is about 1.5 hours by car to Kwau Village.\n3. We can arrange a pick-up for you — please tell us your arrival date and time.\n\nPlease bring cash in Indonesian Rupiah, a rain jacket, trekking shoes and warm clothes for the cool mountain nights.\n\nSee you soon!`,
    id: (r) => `Halo ${r.nama_turis}, berikut cara menuju Kwau:\n\n1. Terbang ke Bandara Rendani, Manokwari.\n2. Dari Manokwari sekitar 1,5 jam perjalanan mobil ke Kampung Kwau.\n3. Kami dapat menjemput Anda — mohon kabari tanggal dan jam kedatangan.\n\nMohon bawa uang tunai, jas hujan, sepatu trekking, dan pakaian hangat untuk malam di pegunungan.\n\nSampai jumpa!`,
  },
  {
    kode: 'penuh',
    judul: 'Tanggal penuh — tawarkan tanggal lain',
    arti: 'Mohon maaf, tanggal … sudah penuh. Apakah tanggal lain bisa? Kabari kami, nanti kami cek ketersediaannya.',
    en: (r) => `Hello ${r.nama_turis}, we are very sorry, but ${tgl(r.tanggal_kunjungan, 'en-GB')} is fully booked.\n\nWould another date work for you? Please let us know which dates suit you and we will check availability right away.`,
    id: (r) => `Halo ${r.nama_turis}, mohon maaf, tanggal ${tgl(r.tanggal_kunjungan, 'id-ID')} sudah penuh.\n\nApakah ada tanggal lain yang memungkinkan? Silakan kabari kami, dan kami akan segera mengecek ketersediaannya.`,
  },
  {
    kode: 'terimakasih',
    judul: 'Terima kasih & minta ulasan',
    arti: 'Terima kasih sudah berkunjung ke Kwau! Kami senang jika Anda membagikan foto dan cerita di situs kami.',
    en: (r) => `Hello ${r.nama_turis}, thank you so much for visiting Kampung Kwau! We hope you had a wonderful time with us.\n\nWe would be very happy if you shared your photos and story here — it really helps our village:\n${r.situs}/jejak-wisatawan?lang=en`,
    id: (r) => `Halo ${r.nama_turis}, terima kasih banyak telah berkunjung ke Kampung Kwau! Semoga Anda senang bersama kami.\n\nKami akan sangat senang jika Anda membagikan foto dan cerita Anda di sini — sangat membantu kampung kami:\n${r.situs}/jejak-wisatawan`,
  },
];
