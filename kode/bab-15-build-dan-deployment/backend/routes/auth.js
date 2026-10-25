/**
 * Route autentikasi.
 *
 * POST /api/auth/login → { token, expiresIn, data: mahasiswa }
 *
 * Password diperiksa apa adanya karena data praktikum disimpan sebagai teks biasa.
 * Di slide bab 13 ini disebut eksplisit sebagai batasan: produksi wajib memakai
 * hash (bcrypt/argon2) dan HTTPS.
 */
import express from 'express';
import { muat } from '../lib/store.js';
import { buatToken, MASA_BERLAKU } from '../lib/token.js';

const router = express.Router();

router.post('/login', (req, res) => {
  const { nim, password } = req.body ?? {};

  if (!nim || !password) {
    return res.status(400).json({ pesan: 'NIM dan password wajib diisi.' });
  }

  const mhs = muat().mahasiswa.find((baris) => baris.nim === String(nim));

  // Pesan gagal sengaja sama untuk NIM salah maupun password salah,
  // supaya penyerang tidak bisa menebak NIM mana yang terdaftar.
  if (!mhs || mhs.password !== password) {
    return res.status(401).json({ pesan: 'NIM atau password salah.' });
  }

  const { password: _, ...tanpaPassword } = mhs;

  return res.json({
    token: buatToken(mhs),
    expiresIn: MASA_BERLAKU,
    data: tanpaPassword,
  });
});

export default router;
