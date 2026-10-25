/**
 * Server SIAKAD — varian TANPA AUTENTIKASI (dipakai bab 10, 11, dan 12).
 *
 * Semua endpoint terbuka. Login belum ada di bab ini; aplikasi mengirim NIM
 * lewat query string, persis seperti yang diajarkan di slide bab 10.
 */
import express from 'express';
import cors from 'cors';

import matakuliah from './routes/matakuliah.js';
import mahasiswa from './routes/mahasiswa.js';
import krs from './routes/krs.js';
import nilai from './routes/nilai.js';
import presensi from './routes/presensi.js';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    auth: false,
    waktu: new Date().toISOString(),
  });
});

app.use('/api/matakuliah', matakuliah);
app.use('/api/mahasiswa', mahasiswa);
app.use('/api/krs', krs);
app.use('/api/nilai', nilai);
app.use('/api/presensi', presensi);

// Endpoint yang tidak dikenal harus menjawab JSON, bukan halaman HTML.
app.use((req, res) => {
  res.status(404).json({ pesan: `Endpoint ${req.method} ${req.originalUrl} tidak ada.` });
});

// Penangan error terakhir: satu tempat untuk semua error tak terduga.
app.use((err, req, res, next) => {
  console.error('[api]', err.message);
  res.status(500).json({ pesan: 'Terjadi kesalahan di server.', detail: err.message });
});

app.listen(PORT, () => {
  console.log(`SIAKAD API (tanpa auth) berjalan di http://localhost:${PORT}`);
  console.log('  GET    /api/health');
  console.log('  GET    /api/matakuliah?semester=5');
  console.log('  GET    /api/mahasiswa/20230001');
  console.log('  GET    /api/krs?nim=20230001');
  console.log('  POST   /api/krs');
  console.log('  PATCH  /api/krs/:id');
  console.log('  DELETE /api/krs/:id');
  console.log('  GET    /api/nilai?nim=20230001');
  console.log('  GET    /api/presensi?nim=20230001');
});
