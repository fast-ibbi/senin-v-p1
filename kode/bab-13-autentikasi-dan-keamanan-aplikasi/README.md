# Bab 13 — Autentikasi dan Keamanan Aplikasi

Slide: [`slides/bab-13-autentikasi-dan-keamanan-aplikasi.md`](../../slides/bab-13-autentikasi-dan-keamanan-aplikasi.md)

Bab ini mengganti sesi tiruan bab 7 dengan **token sungguhan**: login ke server, token
disimpan di SecureStore, dan setiap permintaan membawa header `Authorization`.

## Tujuan pembelajaran

- Menjelaskan perbedaan autentikasi dan otorisasi pada aplikasi sistem informasi
- Membandingkan mekanisme session dan token beserta konsekuensi skalabilitasnya
- Menganalisis struktur JWT (header, payload, signature)
- Menerapkan protected route serta penyimpanan token dengan SecureStore
- Mengevaluasi prinsip keamanan API: validasi server, HTTPS, least privilege

## Isi folder

| Berkas | Peran |
| --- | --- |
| `api/auth.js` | `POST /api/auth/login`; menandai `abaikan401` agar login gagal tidak memicu logout |
| `api/client.js` | Menambahkan header `Authorization` dan penangan 401 terpusat |
| `context/AuthContext.js` | Pulihkan sesi, simpan token, sediakan `token`, bereaksi pada 401 |
| `utils/tokenStorage.js` | SecureStore: simpan, baca, hapus token |
| `utils/pemeriksaJwt.js` | Membaca payload, memeriksa `exp` — **tanpa** memverifikasi tanda tangan |
| `backend/` | Varian JWT: `routes/auth.js`, `middleware/requireAuth.js`, `lib/token.js` |

## Apa yang berubah di backend

Bandingkan `bab-12/backend/` dengan `bab-13/backend/` — inilah materi bab ini dalam bentuk
paling telanjang:

| Sebelum (bab 10–12) | Sesudah (bab 13) |
| --- | --- |
| `GET /api/krs?nim=20230001` | `GET /api/krs` + header `Authorization` |
| siapa pun bisa membaca KRS siapa pun | `requireAuth` menolak tanpa token sah |
| tidak ada `/api/auth/login` | login mengembalikan token 2 jam |
| tidak ada otorisasi | `PUT /api/mahasiswa/:nim` menolak 403 bila bukan pemilik |

Perintah untuk melihat bedanya:

```bash
diff -r kode/bab-12-mengakses-fitur-perangkat/backend kode/bab-13-autentikasi-dan-keamanan-aplikasi/backend
```

## Kenapa SecureStore, bukan AsyncStorage

| | AsyncStorage | SecureStore |
| --- | --- | --- |
| Penyimpanan | berkas biasa di sandbox aplikasi | Keychain (iOS) / Keystore (Android) |
| Enkripsi | tidak | oleh sistem |
| Ikut backup | bisa | tidak (dengan opsi `THIS_DEVICE_ONLY`) |
| Batas ukuran | besar | ~2 KB (Android) |

Karena batas itu, yang disimpan hanya token; data akademik tetap di AsyncStorage dan
dihapus saat logout.

## Membaca JWT ≠ memverifikasi JWT

`utils/pemeriksaJwt.js` hanya membaca payload untuk menampilkan masa berlaku dan membuang
token yang jelas kedaluwarsa. Tanda tangan diverifikasi **hanya** di server
(`jsonwebtoken.verify`), karena kunci rahasianya tidak boleh ada di aplikasi.

## Menjalankan

```bash
cd kode/bab-13-autentikasi-dan-keamanan-aplikasi
npm install
npm run api          # varian JWT
npx expo start
```

Login: NIM `20230001`, password `rahasia123`. Coba juga password salah untuk melihat pesan
401 dari server.

## Langkah praktikum

1. Login dengan password salah. Perhatikan pesan dari server muncul di form, bukan
   "terjadi kesalahan".
2. Login benar, tutup aplikasi sepenuhnya, lalu buka lagi. Sesi harus pulih tanpa login
   ulang — itu hasil membaca SecureStore.
3. Di terminal API, ubah `JWT_EXPIRES_IN` menjadi `10s`, jalankan ulang server, login, lalu
   tunggu 15 detik dan buka tab Nilai. Amati 401 dan kembalinya ke layar login.
4. Hapus header `Authorization` dari `api/client.js`, lalu buka tab KRS. Jelaskan mengapa
   layar menampilkan galat 401, bukan data kosong.
5. Uji `requireAuth` dengan `curl` (tanpa token, token rusak, token sah) dan catat tiga kode
   `kode` yang berbeda pada respons.
6. Jelaskan mengapa `POST /api/mahasiswa` (registrasi) sengaja dibiarkan publik, sedangkan
   `GET /api/mahasiswa/:nim` tidak.
7. Periksa `backend/lib/token.js`: apa isi payload, dan mengapa tidak ada email/alamat di
   dalamnya?

## Checkpoint

1. Login benar menyimpan token; login salah menampilkan pesan server.
2. `GET /api/krs` tanpa header mengembalikan 401 `TOKEN_TIDAK_ADA`.
3. Mengubah profil milik NIM lain menghasilkan 403.
4. Setelah `JWT_EXPIRES_IN=10s` lewat, aplikasi kembali ke layar login tanpa crash.
5. Kamu bisa menjelaskan mengapa payload JWT boleh dibaca siapa saja, tetapi tidak boleh
   dipercaya.

## Troubleshooting

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| Login selalu 401 walau password benar | Server masih varian tanpa auth / password seed berubah | Jalankan `npm run api:reset`, pastikan `backend/routes/auth.js` ada |
| Semua permintaan 401 setelah login | Token tidak terkirim | Periksa `permintaan()` menerima `token` di semua pemanggil |
| Aplikasi logout sendiri terus | Penangan 401 terpasang juga untuk login | Pastikan login memakai `abaikan401: true` |
| Token hilang setiap restart | SecureStore tidak tersedia (mis. web) | Uji di emulator/ponsel; web tidak punya SecureStore |
| `Cannot find package 'jsonwebtoken'` | Dependensi backend belum terpasang | `npm install` di folder bab ini |

## Yang berubah dibanding bab 12

| Berkas | Perubahan |
| --- | --- |
| `api/auth.js` | Baru — login dan penerimaan token |
| `api/client.js` | Header `Authorization`, `abaikan401`, penangan 401 terpusat |
| `context/AuthContext.js` | Ditulis ulang: token, pemulihan sesi, logout yang membersihkan storage |
| `utils/tokenStorage.js`, `utils/pemeriksaJwt.js` | Baru |
| `app/login.js` | Memanggil server, menampilkan galat 401 |
| Layar KRS/Nilai/Profil/Presensi | Semua mengirim `token` |
| `backend/` | Varian JWT (login, middleware, token) |
| `package.json` | Tambah `expo-secure-store`, `jsonwebtoken` |
