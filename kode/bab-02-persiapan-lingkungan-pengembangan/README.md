# Bab 2 — Persiapan Lingkungan Pengembangan

Slide: [`slides/bab-02-persiapan-lingkungan-pengembangan.md`](../../slides/bab-02-persiapan-lingkungan-pengembangan.md)

Folder ini adalah **project siakad-mobile yang sesungguhnya**, dibuat dengan template
`blank`. Semua bab berikutnya adalah folder ini ditambah satu kemampuan baru.

> Deck memakai `aplikasi-pertama` sebagai nama contoh. Di repo ini nama project sudah
> ditetapkan sejak awal — `siakad-mobile` — supaya `app.json` di bab 7 tidak perlu diubah
> lagi. Perintahnya sama, hanya namanya berbeda:
> `npx create-expo-app siakad-mobile --template blank`

## Tujuan pembelajaran

- Menjelaskan peran Node.js, npm, dan npx dalam ekosistem Expo
- Mengidentifikasi komponen lingkungan pengembangan beserta fungsinya
- Mengimplementasikan pembuatan project Expo pertama dan menjalankannya
- Menganalisis tiga jalur pengujian dari sisi kecepatan dan kesetiaan perilaku
- Menjelaskan struktur folder project dan mengevaluasi kendala umum

## Isi folder

| Berkas | Peran |
| --- | --- |
| `package.json` | Menyebut `index.js` sebagai `main`; mengunci Expo SDK 57 |
| `index.js` | `registerRootComponent(App)` — pintu masuk yang didaftarkan ke Expo |
| `App.js` | Layar pertama: judul, keterangan, `StatusBar` |
| `app.json` | Nama, slug, ikon, splash, konfigurasi Android/iOS/web |
| `assets/` | Ikon dan splash dari template resmi |
| `.gitignore` | `node_modules`, `.expo`, folder native hasil prebuild |

Alur pemanggilan yang perlu kamu hafal: `package.json` → `index.js` → `App.js`.

## Menjalankan

```bash
cd kode/bab-02-persiapan-lingkungan-pengembangan
npm install
npx expo start
```

Setelah Metro Bundler hidup, pilih jalur pengujian:

| Jalur | Tombol | Kelebihan | Kekurangan |
| --- | --- | --- | --- |
| Expo Go di ponsel | pindai QR | paling setia pada perangkat asli | perlu satu Wi-Fi dengan laptop |
| Emulator Android | `a` | cepat, tidak perlu ponsel | memori laptop besar, cold start lambat |
| Browser (web) | `w` | paling cepat untuk melihat tata letak | perilaku bukan perilaku native |

## Langkah praktikum

1. Jalankan `npm install`. Perhatikan `node_modules/` muncul dan `package-lock.json` dibuat.
2. Jalankan `npx expo start`, lalu buka aplikasi lewat salah satu jalur di atas.
3. Ubah teks `Halo, Dunia!` menjadi namamu sendiri, simpan, dan perhatikan **Fast Refresh**:
   layar berubah tanpa perlu build ulang.
4. Tambahkan satu `<Text>` baru di bawah `catatan`, isi dengan NIM-mu, dan atur gayanya
   sendiri di `StyleSheet.create`.
5. Hentikan server dengan `Ctrl+C`, jalankan lagi, dan pastikan aplikasi tetap sama.

## Checkpoint

1. `npx expo start` menampilkan QR code dan "Metro waiting on ...".
2. Aplikasi menampilkan "Halo, Dunia!" beserta keterangan dan catatan `siakad-mobile`.
3. Perubahan pada `App.js` terlihat dalam hitungan detik tanpa build ulang.
4. Kamu bisa menjelaskan perbedaan `npx create-expo-app` dan `npm install`.

## Troubleshooting

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| Layar putih kosong setelah `expo start` | `main` di `package.json` tidak menunjuk `index.js` | Pastikan `"main": "index.js"` |
| `Unable to resolve module ./App` | `App.js` terhapus/berpindah | Kembalikan `App.js` di akar project |
| QR tidak terbaca dari ponsel | Ponsel dan laptop berbeda jaringan | Sambungkan ke Wi-Fi yang sama, atau `npx expo start --tunnel` |
| `Port 8081 is running this app in another window` | Metro lama masih hidup | Tekan `Ctrl+C` di terminal lama, atau jawab `Y` untuk pindah port |
| `Metro error: ENOENT ... babel` | `npm install` belum selesai/gagal | Hapus `node_modules`, jalankan `npm install` lagi |
| Emulator tidak terdeteksi | Android Studio belum dijalankan / `adb` tidak ada di PATH | Jalankan emulator dulu, lalu tekan `a` |

## Yang baru dibanding bab 1

Tidak ada kode aplikasi di bab 1 — bab ini yang pertama kali menghasilkan aplikasi yang
bisa dijalankan. Bandingkan isi folder ini dengan `bab-01-pengantar-pemrograman-mobile/`:
bedanya adalah kehadiran `package.json`, `index.js`, `App.js`, dan `assets/`.
