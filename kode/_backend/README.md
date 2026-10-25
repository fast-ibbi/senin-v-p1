# Backend SIAKAD — sumber tunggal

Backend yang dipakai bab 10 sampai bab 15. Tidak ada server lain; enam salinan di dalam
folder bab dibuat dari sini oleh `scripts/sync-backend.mjs`.

## Isi

```
shared/
  data/db.json          seed: 3 mahasiswa, 12 mata kuliah, KRS, nilai, presensi
  lib/store.js          baca/tulis JSON, id berurutan
  routes/matakuliah.js  katalog (publik)
  routes/mahasiswa.js   biodata, ubah profil, registrasi
  routes/krs.js         subjek CRUD utama: GET, POST, PATCH, DELETE
  routes/nilai.js       KHS + perhitungan IPK
  routes/presensi.js    presensi GPS dengan rumus haversine
pre-auth/
  server.js             semua endpoint terbuka  → bab 10, 11, 12
jwt/
  server.js             sama + login + requireAuth → bab 13, 14, 15
  routes/auth.js        POST /api/auth/login
  middleware/requireAuth.js
  lib/token.js          buat & baca token
```

## Varian

| Varian | Bab | Perbedaan |
| --- | --- | --- |
| `pre-auth` | 10, 11, 12 | tidak ada `/api/auth/login`; NIM dikirim lewat query string |
| `jwt` | 13, 14, 15 | tambah login, `requireAuth`, dan `req.mahasiswa` diisi dari token |

Isi `shared/` identik di kedua varian. Perbedaan keduanya hanya `server.js`, `routes/auth.js`,
`middleware/requireAuth.js`, dan `lib/token.js` — itulah tepatnya materi bab 13.

## Menyalin ke folder bab

```bash
node scripts/sync-backend.mjs          # tulis ulang semua salinan
node scripts/sync-backend.mjs --check  # gagal bila salinan menyimpang (dipakai CI)
```

## Menjalankan

Dari folder bab (bukan dari folder ini), karena dependensi backend dideklarasikan
di `package.json` bab tersebut:

```bash
npm run api
npm run api:reset
```

Variabel lingkungan yang dipakai: `PORT` (default 3000), `JWT_SECRET` (varian JWT),
`JWT_EXPIRES_IN` (default `2h`).
