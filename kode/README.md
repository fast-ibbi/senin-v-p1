# Kode Praktikum — SIAKAD Mobile

Satu project, lima belas bab. Setiap folder di sini adalah **aplikasi yang bisa dijalankan
sendiri**, berisi kondisi project pada akhir bab tersebut. Folder bab berikutnya selalu
merupakan folder sebelumnya ditambah satu kemampuan baru.

Use case: **SIAKAD Mobile** — aplikasi akademik untuk satu mahasiswa.
Login, lihat jadwal, ambil mata kuliah (KRS), lihat nilai, kelola profil.

## Peta folder

| Bab | Folder | Yang ditambahkan |
| --- | --- | --- |
| 1 | `bab-01-pengantar-pemrograman-mobile/` | `cek-lingkungan.js` — skrip pemeriksa Node/npm/Expo |
| 2 | `bab-02-persiapan-lingkungan-pengembangan/` | scaffold `create-expo-app` (template blank) bernama `siakad-mobile` |
| 3 | `bab-03-javascript-modern-untuk-react-native/` | `utils/` JavaScript modern di atas data SIAKAD, layar Playground |
| 4 | `bab-04-dasar-react/` | komponen + props + state (`KartuMahasiswa`, `TombolSKS`) |
| 5 | `bab-05-dasar-react-native/` | StyleSheet, Flexbox, `FlatList`, `useWindowDimensions`, `Platform` |
| 6 | `bab-06-membangun-user-interface-mobile/` | design token 8pt/tipografi/warna + Card, Button, FormField, List, wireframe |
| 7 | `bab-07-navigasi-aplikasi/` | migrasi ke **expo-router**: tab, stack bersarang, `[kode]`, protected screen |
| 8 | `bab-08-form-input-dan-validasi/` | form login & registrasi, `utils/validators.js`, penanganan keyboard |
| 9 | `bab-09-state-management/` | keranjang KRS: `context/KrsContext.js` + `hooks/useKrs.js` (masih lokal) |
| 10 | `bab-10-rest-api-dan-backend-integration/` | `api/client.js`, GET lalu POST/PATCH/DELETE ke `/api/krs` + **backend** |
| 11 | `bab-11-penyimpanan-data-lokal/` | AsyncStorage: snapshot + timestamp + TTL, draf KRS, hapus saat logout |
| 12 | `bab-12-mengakses-fitur-perangkat/` | foto profil (`expo-image-picker`), presensi GPS (`expo-location`), izin runtime |
| 13 | `bab-13-autentikasi-dan-keamanan-aplikasi/` | JWT asli, SecureStore, `AuthContext`, 401 → logout |
| 14 | `bab-14-debugging-testing-dan-quality-assurance/` | `node:test` untuk fungsi murni + checklist QA |
| 15 | `bab-15-build-dan-deployment/` | `app.json` final, `eas.json` 3 profil, `EXPO_PUBLIC_`, `LAPORAN-BUILD.md` |

## Menjalankan satu bab

```bash
cd kode/bab-07-navigasi-aplikasi
npm install
npx expo start
```

Bab 10 ke atas juga butuh API. Di terminal kedua, dari folder bab yang sama:

```bash
npm run api          # http://localhost:3000
npm run api:reset     # kembalikan data seed ke kondisi awal
```

Satu `npm install` sudah mencakup aplikasi dan API, karena dependensi backend dideklarasikan
di `package.json` bab tersebut.

## Konvensi yang dipakai semua folder

- **Versi terkunci** mengikuti buku ajar: Expo SDK 57 (`expo ~57.0.31`),
  React Native 0.86.3, React 19.2.3, Node.js ≥ 22.
- **Struktur aplikasi**: `App.js` + `index.js` (template blank) sampai bab 6,
  lalu `app/` (expo-router) mulai bab 7.
- **Bahasa**: dokumentasi dan nama file dalam bahasa Inggris; teks antarmuka dan komentar
  kode dalam bahasa Indonesia, sama seperti contoh kode di slide.
- **Nomor bab pada nama folder** mengikuti nama deck di `slides/`, sehingga
  `bab-10-rest-api-dan-backend-integration` cocok dengan
  `slides/bab-10-rest-api-dan-backend-integration.md`.

## Alamat API dari dalam aplikasi

Emulator Android tidak bisa memanggil `localhost` mesin host, jadi `api/client.js`
memilih alamat secara otomatis:

| Target | Base URL |
| --- | --- |
| Android emulator | `http://10.0.2.2:3000` |
| iOS simulator / web | `http://localhost:3000` |
| Perangkat fisik (Expo Go) | nilai `EXPO_PUBLIC_API_URL` di `.env` |

## Akun demo

| NIM | Password | Nama |
| --- | --- | --- |
| `20230001` | `rahasia123` | Nadia Putri Ramadhani |
| `20230002` | `rahasia123` | Bagas Prasetyo |

## Backend

Sumber tunggal backend ada di `_backend/`, dengan dua varian:

- `_backend/shared/` — data seed, lapisan store, dan seluruh route CRUD.
- `_backend/pre-auth/` — `server.js` tanpa autentikasi (dipakai bab 10–12).
- `_backend/jwt/` — `server.js` + login, token, dan middleware `requireAuth` (bab 13–15).

Salinannya dibuat oleh skrip, jangan diedit di dalam folder bab:

```bash
node scripts/sync-backend.mjs
```

Skrip yang sama dijalankan di CI untuk memastikan enam salinan backend tidak pernah
menyimpang dari sumbernya.

## Verifikasi

```bash
npm run verify:kode    # gerbang statis untuk 15 folder
```

Gerbang statis memeriksa: setiap `.js` lolos `node --check`, setiap `package.json` /
`app.json` / `eas.json` adalah JSON valid, setiap import relatif menunjuk file yang ada,
dan setiap salinan backend identik dengan sumbernya. Pemasangan dependensi sungguhan
dilakukan di CI untuk lima folder sentinel: bab 2, 7, 10, 13, dan 15.
