/**
 * Server SIAKAD — varian DENGAN AUTENTIKASI JWT (dipakai bab 13, 14, dan 15).
 *
 * Bedanya dengan varian bab 10 hanya tiga baris pemasangan middleware di bawah,
 * ditambah route login. Perbandingan kedua folder ini adalah materi bab 13:
 * endpoint yang sama, tetapi sekarang butuh token.
 */
import express from 'express';
import cors from 'cors';

import matakuliah from './routes/matakuliah.js';
import mahasiswa from './routes/mahasiswa.js';
import krs from './routes/krs.js';
import nilai from './routes/nilai.js';
import presensi from './routes/presensi.js';
import auth from './routes/auth.js';
import { requireAuth } from './middleware/requireAuth.js';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    auth: true,
    waktu: new Date().toISOString(),
  });
});

// Publik: katalog mata kuliah dan pendaftaran akun baru.
app.use('/api/auth', auth);
app.use('/api/matakuliah', matakuliah);

// Publik untuk POST (registrasi), terjaga untuk GET dan PUT (biodata profil).
app.use('/api/mahasiswa', (req, res, next) =>
  req.method === 'POST' ? next() : requireAuth(req, res, next),
  mahasiswa,
);

// Terjaga semua: data akademik milik mahasiswa.
app.use('/api/krs', requireAuth, krs);
app.use('/api/nilai', requireAuth, nilai);
app.use('/api/presensi', requireAuth, presensi);

app.use((req, res) => {
  res.status(404).json({ pesan: `Endpoint ${req.method} ${req.originalUrl} tidak ada.` });
});

app.use((err, req, res, next) => {
  console.error('[api]', err.message);
  res.status(500).json({ pesan: 'Terjadi kesalahan di server.', detail: err.message });
});

app.listen(PORT, () => {
  console.log(`SIAKAD API (JWT) berjalan di http://localhost:${PORT}`);
  console.log('  GET    /api/health');
  console.log('  POST   /api/auth/login          ← token di sini');
  console.log('  POST   /api/mahasiswa           (registrasi, publik)');
  console.log('  GET    /api/matakuliah?semester=5 (publik)');
  console.log('  GET    /api/mahasiswa/20230001  butuh token');
  console.log('  GET    /api/krs                 butuh token');
  console.log('  GET    /api/nilai               butuh token');
  console.log('  POST   /api/presensi            butuh token');
});
