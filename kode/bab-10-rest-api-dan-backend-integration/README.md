# Bab 10 — REST API dan Backend Integration

Slide: [`slides/bab-10-rest-api-dan-backend-integration.md`](../../slides/bab-10-rest-api-dan-backend-integration.md)

Bab 9 menyimpan keranjang di memori, jadi menutup aplikasi berarti kehilangan semuanya. Bab
10 memindahkan data akademik ke server: lapisan `api/` berbicara HTTP, folder `backend/`
menyediakannya, dan tab KRS akhirnya membedakan "yang tersimpan di server" dari "yang baru
dipilih di keranjang". Sesi masih tiruan — tidak ada token di bab ini.

## Tujuan pembelajaran

- Menjelaskan arsitektur client–server dan peran API di dalamnya
- Mengidentifikasi peran HTTP, REST, dan JSON dalam pertukaran data
- Menganalisis pemilihan metode HTTP untuk setiap operasi data
- Menafsirkan status code respons server, baik sukses maupun gagal
- Menerapkan `fetch` GET dengan keadaan loading, error, dan data kosong
- Mengimplementasikan POST, PUT/PATCH, dan DELETE ke server
- Mengelola `base URL` dan memisahkan lapisan `api/` dari `screens/`
- Menangani error jaringan serta validasi respons server
- Menerapkan pola autentikasi API pada permintaan terproteksi

## Isi folder

| Berkas | Isi |
| --- | --- |
| `api/client.js` | `BASE_URL`, `permintaan()`, `KesalahanApi`, batas waktu 8 detik |
| `api/krs.js` | `ambilKrs` (GET), `simpanKrs` (POST), `ubahKelasKrs` (PATCH), `batalkanKrs` (DELETE) |
| `api/mahasiswa.js` | `ambilProfil` (GET), `simpanProfil` (PUT), `daftarMahasiswa` (POST) |
| `api/matakuliah.js` | `ambilMatakuliah({ semester, q })`, `ambilMatakuliahSatu` |
| `hooks/useMuat.js` | `data`, `memuat`, `galat`, `muatUlang` — satu pola untuk semua GET |
| `app/(tabs)/krs/index.js` | Dua bagian: "Tersimpan di server" dan "Katalog semester 5" |
| `app/(tabs)/profil/index.js` | GET saat dibuka, PUT saat "Simpan profil" |
| `backend/` | `server.js`, lima route, `lib/store.js`, `data/db.seed.json` |

## Satu tempat untuk alamat server

`localhost` tidak bisa dipakai di emulator Android: di dalam emulator alamat itu menunjuk
emulator sendiri, bukan laptopmu.

| Target | Base URL |
| --- | --- |
| Emulator Android | `http://10.0.2.2:3000` |
| iOS simulator / web | `http://localhost:3000` |
| Perangkat fisik (Expo Go) | `EXPO_PUBLIC_API_URL` di berkas `.env` |

Semua kegagalan diseragamkan menjadi `KesalahanApi` dengan tiga field: `kode`, `pesan`,
`status` — jaringan (`JARINGAN`), batas waktu (`BATAS_WAKTU`), balasan bukan JSON
(`JAWABAN_BUKAN_JSON`), atau status 4xx semuanya berbentuk sama.

## GET dulu, CRUD kemudian

Satu tab KRS memuat dua sumber data yang sengaja dipisah:

| Bagian | Sumber | Apa yang ditulis |
| --- | --- | --- |
| "Tersimpan di server" | `GET /api/krs?nim=20230001` | PATCH kelas dan DELETE langsung dikirim, lalu daftar dimuat ulang |
| "Katalog semester 5" | `GET /api/matakuliah?semester=5` | "Ambil" hanya menambah keranjang lokal dari bab 9 |

Itulah alasan tombol di katalog tidak menyentuh server: keranjang adalah draf, dan draf baru
menjadi kenyataan saat "Kirim keranjang ke server" ditekan. Pengiriman memakai `for...of` +
`await` sehingga berurutan; server bisa menerima satu mata kuliah dan menolak yang lain, dan
satu kegagalan tidak membatalkan seluruh keranjang.

`useMuat` menangani tiga jebakan yang sama di semua layar: permintaan dibatalkan saat layar
dibongkar, hanya jawaban terbaru yang boleh menulis state (`terakhir`), dan `memuat` selalu
kembali `false` lewat `finally`.

## Menjalankan

```bash
cd kode/bab-10-rest-api-dan-backend-integration
npm install
npm run api         # terminal kedua — http://localhost:3000
npm run api:reset   # salin db.seed.json ke db.json
npx expo start
```

Masuk dengan NIM `20230001` / password `rahasia123`, lalu buka tab KRS. `server.js` membaca
dan menulis `backend/data/db.json` lewat `lib/store.js`; `db.seed.json` tidak pernah diubah
route mana pun. Cek server dengan `curl localhost:3000/api/health`.

## Langkah praktikum

1. Sebelum menjalankan `npm run api`, buka tab KRS dan tebak pesan mana yang muncul lebih
   dulu: `JARINGAN` (koneksi ditolak, hampir seketika) atau `BATAS_WAKTU` (8 detik).
2. Tanpa membuka aplikasi, baca `backend/data/db.seed.json` dan tebak berapa baris
   "Tersimpan di server" untuk `20230001` beserta total SKS-nya. Cocokkan dengan tab KRS.
3. Tambahkan `SI501` ke keranjang (sudah ada di seed), kirim, lalu baca layar hasil: satu
   baris `×` dengan pesan dari server. Status code dan baris mana di `backend/routes/krs.js`
   yang memutuskan itu?
4. Ubah kelas `SI503` menjadi "C", periksa `backend/data/db.json`, muat ulang tab, lalu
   jalankan `npm run api:reset` dan jelaskan mengapa nilainya kembali ke "A".
5. Katalog hanya menawarkan semester 5, sehingga `422` tidak bisa dipicu dari layar. Buktikan
   route tidak memeriksa semester: `curl -s -X POST localhost:3000/api/krs -H 'Content-Type: application/json' -d '{"nim":"20230001","kode":"SI302"}'`,
   lalu ulangi sampai batas 24 SKS terlampaui.
6. Di `app/(tabs)/profil/index.js`, `simpanProfil` hanya mengirim `{ telepon, alamat }`. Ubah
   menjadi `{ nim: '20230002' }` dan jelaskan mengapa jawabannya `400` (`bolehDiubah`).

## Checkpoint

1. Tab KRS menampilkan dua bagian: 3 baris tersimpan dari server dan 8 baris katalog.
2. Dengan API dimatikan, muncul kotak "Gagal memuat KRS" berisi alamat `BASE_URL` dan tombol
   "Coba lagi"; setelah API hidup, tombol itu mengisi daftar tanpa reload.
3. Mengirim keranjang berisi `SI502` menampilkan `×` dengan pesan kuota penuh, sementara baris
   lain `✓` dan hilang dari keranjang.
4. Perubahan kelas bertahan setelah tab dan aplikasi dimuat ulang; `npm run api:reset`
   mengembalikannya ke "A", dan Profil menampilkan `telepon`/`alamat` dari `db.json`.

## Troubleshooting

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| "Tidak bisa menghubungi http://10.0.2.2:3000…" | `npm run api` belum jalan, atau port bukan 3000 | Jalankan di terminal kedua; cek `curl localhost:3000/api/health` |
| Berhasil di browser, gagal di ponsel | Ponsel tidak bisa menjangkau `localhost` laptop | Isi `EXPO_PUBLIC_API_URL=http://<IP-LAN>:3000` di `.env`, mulai ulang Expo |
| "Server mengirim jawaban yang bukan JSON." | Permintaan mengenai server lain (mis. Metro di 8081) yang membalas HTML | Periksa `BASE_URL` dan port API |
| `EADDRINUSE: address already in use :3000` | Instance API lain masih hidup | Hentikan yang lama, atau `PORT=3001 npm run api` + sesuaikan `BASE_URL` |
| Daftar "Tersimpan di server" tetap kosong | POST ditolak server (409/404/422) | Baca pesan per baris di layar hasil, lalu cek `backend/data/db.json` |

## Yang berubah dibanding bab 9

| Berkas | Perubahan |
| --- | --- |
| `api/client.js`, `api/krs.js`, `api/mahasiswa.js`, `api/matakuliah.js` | Baru — seluruh komunikasi HTTP |
| `hooks/useMuat.js` | Baru — loading, error, kosong, dan `muatUlang` |
| `app/(tabs)/krs/index.js` | Ditulis ulang — dua bagian, PATCH/DELETE langsung ke server |
| `app/(tabs)/krs/ringkasan.js` | Kirim per mata kuliah, hasil `✓`/`×` per baris |
| `app/(tabs)/profil/index.js` | GET + form PUT menggantikan data statis |
| `backend/` | Baru — salinan `_backend/pre-auth/` |
