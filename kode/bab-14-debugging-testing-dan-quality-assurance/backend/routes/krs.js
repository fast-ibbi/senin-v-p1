/**
 * Route KRS — subjek CRUD utama aplikasi ini.
 *
 * GET    /api/krs?nim=20230001   → daftar mata kuliah yang sudah diambil
 * POST   /api/krs                → ambil mata kuliah  { nim, kode, kelas }
 * PATCH  /api/krs/:id            → ubah kelas atau status { kelas }
 * DELETE /api/krs/:id            → batalkan pengambilan
 *
 * Bab 10 melatih empat metode HTTP di sini: GET dulu, lalu POST/PATCH/DELETE.
 * Bab 11 menyimpan hasil GET ke AsyncStorage, bab 13 menjaga route ini dengan token.
 */
import express from 'express';
import { muat, tulis, idBaru } from '../lib/store.js';

const router = express.Router();
const BATAS_SKS = 24;

/** NIM bisa datang dari token (varian JWT) atau dari query/body (varian tanpa auth). */
function nimDari(req) {
  return req.mahasiswa?.nim ?? req.query?.nim ?? req.body?.nim ?? null;
}

function totalSks(data, nim) {
  return data.krs
    .filter((baris) => baris.nim === nim && baris.status !== 'dibatalkan')
    .reduce((jumlah, baris) => {
      const mk = data.matakuliah.find((item) => item.kode === baris.kode);
      return jumlah + (mk?.sks ?? 0);
    }, 0);
}

function lengkapi(data, baris) {
  const mk = data.matakuliah.find((item) => item.kode === baris.kode);
  return {
    ...baris,
    nama: mk?.nama ?? null,
    sks: mk?.sks ?? 0,
    dosen: mk?.dosen ?? null,
    hari: mk?.hari ?? null,
    jam: mk?.jam ?? null,
    ruang: mk?.ruang ?? null,
  };
}

router.get('/', (req, res) => {
  const nim = nimDari(req);
  if (!nim) {
    return res.status(400).json({ pesan: 'Parameter nim wajib diisi.' });
  }

  const data = muat();
  const daftar = data.krs
    .filter((baris) => baris.nim === nim)
    .map((baris) => lengkapi(data, baris));

  return res.json({
    jumlah: daftar.length,
    totalSks: daftar
      .filter((baris) => baris.status !== 'dibatalkan')
      .reduce((jumlah, baris) => jumlah + baris.sks, 0),
    data: daftar,
  });
});

router.post('/', (req, res) => {
  const nim = nimDari(req);
  const { kode, kelas = 'A' } = req.body ?? {};

  if (!nim || !kode) {
    return res.status(400).json({ pesan: 'Field nim dan kode wajib diisi.' });
  }

  const data = muat();
  const mk = data.matakuliah.find((item) => item.kode === kode);
  if (!mk) {
    return res.status(404).json({ pesan: `Mata kuliah ${kode} tidak ditemukan.` });
  }

  const sudahAda = data.krs.some(
    (baris) => baris.nim === nim && baris.kode === kode && baris.status !== 'dibatalkan',
  );
  if (sudahAda) {
    return res.status(409).json({ pesan: `${mk.nama} sudah ada di KRS kamu.` });
  }

  if (mk.terisi >= mk.kuota) {
    return res.status(409).json({ pesan: `Kuota ${mk.nama} sudah penuh.` });
  }

  const sksSekarang = totalSks(data, nim);
  if (sksSekarang + mk.sks > BATAS_SKS) {
    return res.status(422).json({
      pesan: `Batas ${BATAS_SKS} SKS terlampaui. Sisa kuota SKS kamu ${BATAS_SKS - sksSekarang}.`,
    });
  }

  const hasil = tulis((basis) => {
    const baris = {
      id: idBaru('krs', 'krs'),
      nim,
      kode,
      kelas,
      status: 'terdaftar',
      createdAt: new Date().toISOString(),
    };
    basis.krs.push(baris);
    const mata = basis.matakuliah.find((item) => item.kode === kode);
    if (mata) {
      mata.terisi += 1;
    }
    return baris;
  });

  return res.status(201).json({ data: lengkapi(muat(), hasil) });
});

router.patch('/:id', (req, res) => {
  const { kelas, status } = req.body ?? {};
  if (!kelas && !status) {
    return res.status(400).json({ pesan: 'Isi minimal satu field: kelas atau status.' });
  }

  const data = muat();
  const baris = data.krs.find((item) => item.id === req.params.id);
  if (!baris) {
    return res.status(404).json({ pesan: `KRS ${req.params.id} tidak ditemukan.` });
  }

  const nim = nimDari(req);
  if (nim && baris.nim !== nim) {
    return res.status(403).json({ pesan: 'Kamu hanya boleh mengubah KRS milik sendiri.' });
  }

  const hasil = tulis((basis) => {
    const target = basis.krs.find((item) => item.id === req.params.id);
    if (kelas) {
      target.kelas = kelas;
    }
    if (status) {
      target.status = status;
    }
    return target;
  });

  return res.json({ data: lengkapi(muat(), hasil) });
});

router.delete('/:id', (req, res) => {
  const data = muat();
  const baris = data.krs.find((item) => item.id === req.params.id);
  if (!baris) {
    return res.status(404).json({ pesan: `KRS ${req.params.id} tidak ditemukan.` });
  }

  const nim = nimDari(req);
  if (nim && baris.nim !== nim) {
    return res.status(403).json({ pesan: 'Kamu hanya boleh membatalkan KRS milik sendiri.' });
  }

  tulis((basis) => {
    basis.krs = basis.krs.filter((item) => item.id !== req.params.id);
    const mata = basis.matakuliah.find((item) => item.kode === baris.kode);
    if (mata && mata.terisi > 0) {
      mata.terisi -= 1;
    }
  });

  return res.json({ pesan: `${baris.kode} dibatalkan dari KRS.`, id: req.params.id });
});

export default router;
