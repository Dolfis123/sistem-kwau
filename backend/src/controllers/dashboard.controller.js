const { Op, fn, col, literal } = require('sequelize');
const { Reservasi, GaleriUgc, ModerasiLog, Admin, PaketWisata, Faq, Satwa, KontenStatis } = require('../models');
const { ok } = require('../utils/apiResponse');

exports.ringkasan = async (req, res, next) => {
  try {
    const awalBulan = new Date(); awalBulan.setDate(1); awalBulan.setHours(0, 0, 0, 0);

    const [pendingBulanIni, lunasBulanIni, antreanModerasi] = await Promise.all([
      Reservasi.count({ where: { status: 'pending', created_at: { [Op.gte]: awalBulan } } }),
      Reservasi.count({ where: { status: 'lunas', created_at: { [Op.gte]: awalBulan } } }),
      GaleriUgc.count({ where: { status: 'pending' } }),
    ]);

    // Grafik 6 bulan terakhir: jumlah reservasi per bulan
    const enamBulanLalu = new Date(); enamBulanLalu.setMonth(enamBulanLalu.getMonth() - 5); enamBulanLalu.setDate(1);
    const grafik = await Reservasi.findAll({
      where: { created_at: { [Op.gte]: enamBulanLalu } },
      attributes: [
        [fn('DATE_FORMAT', col('created_at'), '%Y-%m'), 'bulan'],
        [fn('COUNT', col('id')), 'jumlah'],
      ],
      group: [literal('bulan')],
      order: [literal('bulan ASC')],
      raw: true,
    });

    // 5 aktivitas terbaru (reservasi & moderasi digabung)
    const [reservasiTerbaru, moderasiTerbaru] = await Promise.all([
      Reservasi.findAll({
        limit: 5, order: [['created_at', 'DESC']],
        attributes: ['id', 'nama_turis', 'status', 'created_at'],
        include: [{ model: PaketWisata, as: 'paket', attributes: ['nama'] }],
      }),
      ModerasiLog.findAll({
        limit: 5, order: [['created_at', 'DESC']],
        include: [{ model: Admin, as: 'admin', attributes: ['nama'] }],
      }),
    ]);

    const aktivitas = [
      ...reservasiTerbaru.map(r => ({
        tipe: 'reservasi', waktu: r.created_at,
        teks: `Reservasi baru dari ${r.nama_turis} (${r.paket ? r.paket.nama : '-'}) — ${r.status}`,
      })),
      ...moderasiTerbaru.map(m => ({
        tipe: 'moderasi', waktu: m.created_at,
        teks: `${m.admin ? m.admin.nama : 'Admin'} melakukan ${m.aksi} pada konten #${m.galeri_ugc_id}`,
      })),
    ].sort((a, b) => new Date(b.waktu) - new Date(a.waktu)).slice(0, 5);

    // Turis berbahasa Inggris bulan ini (tidak termasuk yang batal)
    const inggrisBulanIni = await Reservasi.count({
      where: { bahasa: 'en', status: { [Op.ne]: 'batal' }, created_at: { [Op.gte]: awalBulan } },
    });

    // Kelengkapan terjemahan Inggris konten utama (agar admin tahu apa yang perlu diisi)
    const belumEn = (field) => ({ [Op.or]: [{ [field]: null }, { [field]: '' }] });
    const [paketTotal, paketBelum, faqTotal, faqBelum, satwaTotal, satwaBelum, kontenTotal, kontenBelum] = await Promise.all([
      PaketWisata.count({ where: { status: 'aktif' } }),
      PaketWisata.count({ where: { status: 'aktif', ...belumEn('deskripsi_en') } }),
      Faq.count(), Faq.count({ where: belumEn('jawaban_en') }),
      Satwa.count(), Satwa.count({ where: belumEn('deskripsi_en') }),
      KontenStatis.count(), KontenStatis.count({ where: belumEn('isi_en') }),
    ]);

    return ok(res, {
      reservasi_bulan_ini: { pending: pendingBulanIni, lunas: lunasBulanIni, bahasa_inggris: inggrisBulanIni },
      terjemahan: [
        { nama: 'Paket wisata (aktif)', total: paketTotal, belum: paketBelum, menu: '/admin/paket' },
        { nama: 'FAQ', total: faqTotal, belum: faqBelum, menu: '/admin/konten' },
        { nama: 'Katalog satwa', total: satwaTotal, belum: satwaBelum, menu: '/admin/konten' },
        { nama: 'Halaman statis', total: kontenTotal, belum: kontenBelum, menu: '/admin/konten' },
      ],
      antrean_moderasi: antreanModerasi,
      grafik_bulanan: grafik,
      aktivitas_terbaru: aktivitas,
    });
  } catch (err) { next(err); }
};
