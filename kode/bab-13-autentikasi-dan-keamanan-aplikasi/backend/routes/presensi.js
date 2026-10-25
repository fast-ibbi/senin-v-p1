/**
 * Route presensi.
 *
 * GET  /api/presensi?nim=20230001            → riwayat presensi
 * POST /api/presensi                         → catat presensi dari lokasi kampus
 *      { nim, kode, latitude, longitude }
 *
 * Bab 12 memakai endpoint ini bersama expo-location: aplikasi mengirim koordinat
 * hasil GPS, server memutuskan hadir atau di luar area.
 */
import express from 'express';
import { muat, tulis, idBaru } from '../lib/store.js';

const router = express.Router();

// Titik kampus (Universitas IBBI, Medan) dan radius toleransi dalam meter.
const KAMPUS = { latitude: 3.5952, longitude: 98.6722 };
const RADIUS_METER = 500;

/** Jarak dua koordinat dengan rumus haversine, hasil dalam meter. */
function jarakMeter(a, b) {
  const R = 6371000;
  const rad = (derajat) => (derajat * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLng = rad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

router.get('/', (req, res) => {
  const nim = req.mahasiswa?.nim ?? req.query?.nim;
  if (!nim) {
    return res.status(400).json({ pesan: 'Parameter nim wajib diisi.' });
  }

  const data = muat();
  const daftar = data.presensi
    .filter((baris) => baris.nim === nim)
    .map((baris) => {
      const mk = data.matakuliah.find((item) => item.kode === baris.kode);
      return { ...baris, nama: mk?.nama ?? baris.kode };
    });

  return res.json({ jumlah: daftar.length, data: daftar });
});

router.post('/', (req, res) => {
  const nim = req.mahasiswa?.nim ?? req.body?.nim;
  const { kode, latitude, longitude } = req.body ?? {};

  if (!nim || !kode || latitude === undefined || longitude === undefined) {
    return res
      .status(400)
      .json({ pesan: 'Field nim, kode, latitude, dan longitude wajib diisi.' });
  }

  const data = muat();
  const mk = data.matakuliah.find((item) => item.kode === kode);
  if (!mk) {
    return res.status(404).json({ pesan: `Mata kuliah ${kode} tidak ditemukan.` });
  }

  const jarak = jarakMeter({ latitude: Number(latitude), longitude: Number(longitude) }, KAMPUS);
  if (jarak > RADIUS_METER) {
    return res.status(422).json({
      pesan: `Kamu berada ${jarak} m dari kampus. Maksimal ${RADIUS_METER} m.`,
    });
  }

  const hasil = tulis((basis) => {
    const baris = {
      id: idBaru('presensi', 'presensi'),
      nim,
      kode,
      tanggal: new Date().toISOString().slice(0, 10),
      jam: new Date().toISOString().slice(11, 16),
      latitude: Number(latitude),
      longitude: Number(longitude),
      status: 'hadir',
    };
    basis.presensi.push(baris);
    return baris;
  });

  return res.status(201).json({ data: hasil, jarakMeter: jarak });
});

export default router;
