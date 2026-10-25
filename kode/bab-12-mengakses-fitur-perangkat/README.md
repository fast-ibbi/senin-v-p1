# Bab 12 — Mengakses Fitur Perangkat

Slide: [`slides/bab-12-mengakses-fitur-perangkat.md`](../../slides/bab-12-mengakses-fitur-perangkat.md)

Bab ini membuka dua pintu ke perangkat: **kamera/galeri** untuk foto profil dan **GPS**
untuk presensi. Keduanya punya hal yang sama — izin runtime — dan hal yang sama pula
sering dilupakan: keadaan "ditolak permanen".

## Tujuan pembelajaran

- Menjelaskan API perangkat dan model izin runtime Android dan iOS
- Mengidentifikasi peran enam paket Expo untuk fitur perangkat
- Mengimplementasikan permintaan izin dan penanganan penolakannya
- Mengambil foto serta membaca koordinat beserta nilai akurasinya
- Menganalisis privasi data perangkat dan membangun Aplikasi Profil Mahasiswa

## Isi folder

| Berkas | Peran |
| --- | --- |
| `components/KartuPresensi.js` | Alur izin → `getCurrentPositionAsync` → `POST /api/presensi` |
| `utils/polaIzin.js` | Normalisasi tiga keadaan izin + jalan ke pengaturan aplikasi |
| `api/presensi.js` | `POST`/`GET` presensi; keputusan radius di server |
| `app/(tabs)/profil/index.js` | Tombol Kamera & Galeri, `ImagePicker`, kirim foto sebagai data URI |
| `app/(tabs)/beranda/index.js` | Menampilkan kartu presensi |
| `app.json` | `plugins`: teks izin kamera, galeri, dan lokasi |

## Tiga keadaan izin, bukan dua

| Keadaan | Arti | Yang harus dilakukan aplikasi |
| --- | --- | --- |
| `granted` | sudah diizinkan | langsung pakai |
| `denied` | belum diizinkan, masih bisa ditanya | minta lagi dengan penjelasan |
| `denied` + `canAskAgain: false` | ditolak permanen | arahkan ke pengaturan; meminta lagi tidak memunculkan dialog |

Tanpa baris ketiga, tombol "Presensi sekarang" terlihat rusak: ditekan berkali-kali, tidak
ada apa pun terjadi. `pastikanIzin` mengembalikan `perluPengaturan` untuk kasus ini, dan
`bukaPengaturan()` memakai `Linking.openSettings()`.

## Siapa yang memutuskan presensi sah?

Aplikasi hanya mengirim koordinat. Server (`backend/routes/presensi.js`) menghitung jarak
dengan rumus haversine dan menolak bila lebih dari 500 m dari titik kampus.

Alasannya keamanan: aplikasi berjalan di perangkat mahasiswa. Kalau aplikasi yang
memutuskan "sah", siapa pun bisa mengubah satu baris kode dan presensi selalu berhasil.

## Menjalankan

```bash
cd kode/bab-12-mengakses-fitur-perangkat
npm install
npm run api          # terminal kedua
npx expo start
```

Izin kamera dan lokasi **tidak** berfungsi di browser (`w`). Pakai emulator Android atau
Expo Go di ponsel.

## Langkah praktikum

1. Jalankan presensi sekali. Perhatikan bahwa perangkat meminta izin lebih dulu, dan
   tombol berubah menjadi "Meminta izin lokasi…" — bukan diam.
2. Tolak izin, lalu tekan tombol lagi. Baca pesan yang muncul, dan jelaskan bedanya dengan
   kasus "ditolak permanen".
3. Di Android, buka Settings → Apps → siakad → Permissions, matikan Location, lalu kembali
   ke aplikasi. Tekan presensi: `perluPengaturan` harus muncul beserta tombol pengaturan.
4. Pindahkan titik kampus di `backend/routes/presensi.js` (`KAMPUS`) ke koordinat lain,
   jalankan `npm run api` lagi, dan buktikan presensi ditolak dengan pesan jarak.
5. Ambil foto profil lewat kamera, lalu periksa `backend/data/db.json`: field `foto` berisi
   data URI. Perkirakan ukurannya dan jelaskan mengapa `quality: 0.4` penting.
6. Ubah `quality` menjadi `1.0` dan `base64` tetap `true`. Bandingkan ukuran data URI.
7. Hapus `expo-location` dari `plugins` di `app.json`, lalu baca ulang teks izin yang
   muncul di perangkat. Jelaskan mengapa teks izin harus spesifik.

## Checkpoint

1. Presensi berhasil dari dalam radius dan menampilkan jarak (mis. "Jarak dari kampus: 16 m").
2. Presensi dari luar radius ditolak server dengan pesan yang menyebut jaraknya.
3. Foto profil tampil setelah diambil dan tetap ada setelah aplikasi ditutup.
4. Menolak izin tidak membuat aplikasi crash; ada pesan dan jalan keluar ke pengaturan.
5. Kamu bisa menjelaskan mengapa keputusan radius berada di server, bukan di aplikasi.

## Troubleshooting

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| Dialog izin tidak muncul | Izin sudah "ditolak permanen" | Buka pengaturan aplikasi, atau hapus & pasang ulang aplikasi |
| `Location services are disabled` | GPS perangkat mati | Aktifkan lokasi pada perangkat/emulator |
| Presensi selalu "di luar area" | Emulator memakai koordinat default Googleplex | Set lokasi emulator (Extended controls → Location) ke 3.5952, 98.6722 |
| `ImagePicker` tidak tersedia | Dijalankan di browser | Uji di emulator atau ponsel |
| Foto tidak tersimpan | `PUT /api/mahasiswa/:nim` gagal 401/403 | Periksa token dan NIM; lihat pesan galat di layar Profil |

## Yang berubah dibanding bab 11

| Berkas | Perubahan |
| --- | --- |
| `components/KartuPresensi.js` | Baru — alur izin, GPS, dan pengiriman presensi |
| `utils/polaIzin.js` | Baru — normalisasi izin dan jalan ke pengaturan |
| `api/presensi.js` | Baru — `POST` dan `GET` presensi |
| `app/(tabs)/profil/index.js` | Tambah foto profil (kamera/galeri) dan penyimpanan ke server |
| `app.json` | Tambah `plugins` untuk `expo-image-picker` dan `expo-location` |
| `package.json` | Tambah `expo-image-picker`, `expo-location` |
