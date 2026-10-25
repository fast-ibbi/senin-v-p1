/**
 * Route mahasiswa.
 *
 * GET  /api/mahasiswa/:nim   → biodata (tanpa password)
 * PUT  /api/mahasiswa/:nim   → ubah profil { telepon, alamat, foto }
 * POST /api/mahasiswa        → registrasi akun baru { nim, nama, email, prodi, password }
 *
 * Di bab 10 route ini dipakai layar Profil (GET + PUT) dan form registrasi (POST).
 */
import express from 'express';
import { muat, tulis, idBaru } from '../lib/store.js';

const router = express.Router();

/** Password tidak pernah ikut terkirim ke aplikasi. */
function tanpaPassword({ password, ...sisa }) {
  return sisa;
}

router.get('/:nim', (req, res) => {
  const mhs = muat().mahasiswa.find((baris) => baris.nim === req.params.nim);
  if (!mhs) {
    return res.status(404).json({ pesan: `Mahasiswa ${req.params.nim} tidak ditemukan.` });
  }
  return res.json({ data: tanpaPassword(mhs) });
});

router.put('/:nim', (req, res) => {
  const mhs = muat().mahasiswa.find((baris) => baris.nim === req.params.nim);
  if (!mhs) {
    return res.status(404).json({ pesan: `Mahasiswa ${req.params.nim} tidak ditemukan.` });
  }

  if (req.mahasiswa && req.mahasiswa.nim !== req.params.nim) {
    return res.status(403).json({ pesan: 'Kamu hanya boleh mengubah profil sendiri.' });
  }

  const bolehDiubah = ['telepon', 'alamat', 'email', 'foto'];
  const kiriman = Object.fromEntries(
    Object.entries(req.body ?? {}).filter(([kunci]) => bolehDiubah.includes(kunci)),
  );

  if (Object.keys(kiriman).length === 0) {
    return res.status(400).json({ pesan: 'Tidak ada field yang boleh diubah.' });
  }

  const hasil = tulis((basis) => {
    const target = basis.mahasiswa.find((baris) => baris.nim === req.params.nim);
    Object.assign(target, kiriman);
    return target;
  });

  return res.json({ data: tanpaPassword(hasil) });
});

router.post('/', (req, res) => {
  const { nim, nama, email, prodi, password } = req.body ?? {};
  const kosong = Object.entries({ nim, nama, email, prodi, password })
    .filter(([, nilai]) => !nilai)
    .map(([kunci]) => kunci);

  if (kosong.length > 0) {
    return res.status(400).json({ pesan: `Field wajib belum diisi: ${kosong.join(', ')}.` });
  }

  if (!/^\d{8}$/.test(String(nim))) {
    return res.status(400).json({ pesan: 'NIM harus terdiri dari 8 angka.' });
  }

  if (String(password).length < 8) {
    return res.status(400).json({ pesan: 'Password minimal 8 karakter.' });
  }

  const data = muat();
  if (data.mahasiswa.some((baris) => baris.nim === String(nim))) {
    return res.status(409).json({ pesan: `NIM ${nim} sudah terdaftar.` });
  }

  const hasil = tulis((basis) => {
    const baris = {
      id: idBaru('mahasiswa', 'mhs'),
      nim: String(nim),
      nama,
      email,
      prodi,
      angkatan: Number(String(nim).slice(0, 4)),
      semester: 1,
      kelas: null,
      password,
      telepon: null,
      alamat: null,
      foto: null,
    };
    basis.mahasiswa.push(baris);
    return baris;
  });

  return res.status(201).json({ data: tanpaPassword(hasil) });
});

export default router;
