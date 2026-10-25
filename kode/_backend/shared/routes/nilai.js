/**
 * Route nilai (KHS).
 *
 * GET /api/nilai?nim=20230001 → daftar nilai + IPK dan total SKS terhitung
 *
 * Bab 11 menyimpan respons route ini ke AsyncStorage sebagai snapshot offline,
 * bab 12 menampilkannya tanpa perlu menunggu jaringan.
 */
import express from 'express';
import { muat } from '../lib/store.js';

const router = express.Router();

/** Bobot mutu untuk perhitungan IPK. */
const BOBOT = { A: 4, 'A-': 3.7, 'B+': 3.3, B: 3, 'B-': 2.7, 'C+': 2.3, C: 2, D: 1, E: 0 };

function hitungIpk(daftar) {
  const totalSks = daftar.reduce((jumlah, baris) => jumlah + baris.sks, 0);
  const totalMutu = daftar.reduce(
    (jumlah, baris) => jumlah + baris.sks * (BOBOT[baris.nilaiHuruf] ?? baris.nilaiAngka ?? 0),
    0,
  );
  return {
    totalSks,
    ipk: totalSks === 0 ? 0 : Number((totalMutu / totalSks).toFixed(2)),
  };
}

router.get('/', (req, res) => {
  const nim = req.mahasiswa?.nim ?? req.query?.nim;
  if (!nim) {
    return res.status(400).json({ pesan: 'Parameter nim wajib diisi.' });
  }

  const data = muat();
  const daftar = data.nilai
    .filter((baris) => baris.nim === nim)
    .map((baris) => {
      const mk = data.matakuliah.find((item) => item.kode === baris.kode);
      return { ...baris, nama: mk?.nama ?? baris.kode };
    })
    .sort((a, b) => a.semester - b.semester || a.kode.localeCompare(b.kode));

  const { totalSks, ipk } = hitungIpk(daftar);

  return res.json({ jumlah: daftar.length, totalSks, ipk, data: daftar });
});

export default router;
