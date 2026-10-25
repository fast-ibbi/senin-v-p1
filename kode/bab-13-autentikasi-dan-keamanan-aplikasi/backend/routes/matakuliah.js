/**
 * Route mata kuliah.
 *
 * GET /api/matakuliah            → daftar, bisa disaring ?semester=5&q=mobile
 * GET /api/matakuliah/:kode      → satu mata kuliah
 *
 * Tidak pernah dijaga token: katalog mata kuliah boleh dibaca siapa saja.
 * Bab 10 memakai endpoint ini untuk melatih keadaan loading, error, dan data kosong.
 */
import express from 'express';
import { muat } from '../lib/store.js';

const router = express.Router();

router.get('/', (req, res) => {
  const { semester, q } = req.query;
  let daftar = muat().matakuliah;

  if (semester) {
    const angka = Number(semester);
    if (!Number.isInteger(angka)) {
      return res.status(400).json({ pesan: 'Parameter semester harus berupa angka.' });
    }
    daftar = daftar.filter((mk) => mk.semester === angka);
  }

  if (q) {
    const kunci = String(q).toLowerCase();
    daftar = daftar.filter(
      (mk) =>
        mk.nama.toLowerCase().includes(kunci) || mk.kode.toLowerCase().includes(kunci),
    );
  }

  return res.json({ jumlah: daftar.length, data: daftar });
});

router.get('/:kode', (req, res) => {
  const mk = muat().matakuliah.find((baris) => baris.kode === req.params.kode);
  if (!mk) {
    return res.status(404).json({ pesan: `Mata kuliah ${req.params.kode} tidak ditemukan.` });
  }
  return res.json({ data: mk });
});

export default router;
