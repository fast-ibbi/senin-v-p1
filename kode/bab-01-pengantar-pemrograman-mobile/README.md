# Bab 1 — Pengantar Pemrograman Mobile

Slide: [`slides/bab-01-pengantar-pemrograman-mobile.md`](../../slides/bab-01-pengantar-pemrograman-mobile.md)

Folder ini belum berisi aplikasi. Isinya satu skrip pemeriksa lingkungan, karena pertemuan
pertama adalah pertemuan konsep: sebelum menulis kode, kamu perlu tahu perkakas apa yang
harus ada di laptop dan apakah versinya sudah memenuhi syarat.

## Tujuan pembelajaran

- Menjelaskan pengertian dan karakteristik aplikasi mobile
- Membedakan native, web, hybrid, dan cross-platform
- Menjelaskan posisi Android & iOS serta evolusi teknologi mobile
- Menjelaskan konsep kerja React Native dan peran Expo
- Menganalisis trade-off React Native dan arsitektur aplikasi mobile

## Isi folder

| Berkas | Gunanya |
| --- | --- |
| `cek-lingkungan.js` | Membaca versi Node.js, npm, npx, git, dan Expo; memberi vonis siap/belum |

## Menjalankan

Tidak perlu `npm install`. Cukup Node.js:

```bash
cd kode/bab-01-pengantar-pemrograman-mobile
node cek-lingkungan.js
```

Contoh keluaran di laptop yang siap:

```
Pemeriksaan lingkungan — Pemrograman Mobile

[ok]  Node.js       v22.14.0           memenuhi syarat >= 22
[ok]  npm           10.9.2             dipakai untuk npm install
[ok]  npx           10.9.2             menjalankan paket tanpa memasang global
[ok]  git           2.43.0             untuk version control
[ok]  expo          -                  belum ada di folder ini — normal, akan terpasang saat npm install

Hasil: semua perkakas siap. Lanjut ke bab 2.
```

## Checkpoint

Kamu berhasil menyelesaikan bab ini kalau:

1. `node cek-lingkungan.js` berakhir dengan `Hasil: semua perkakas siap` (atau hanya
   catatan kuning untuk git).
2. Kamu bisa menjelaskan mengapa Expo dipilih dibanding React Native CLI murni.
3. Kamu bisa menyebutkan satu kelebihan dan satu biaya dari pendekatan cross-platform.

## Troubleshooting

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| `node: command not found` | Node.js belum terpasang atau tidak ada di PATH | Pasang Node.js LTS dari nodejs.org, lalu buka ulang terminal |
| `[!] Node.js v18.x` | Versi terlalu tua untuk SDK 57 | Pasang Node.js LTS terbaru; buku ini memakai Node.js ≥ 22 |
| `[x] npx` | npm rusak/tidak lengkap | Pasang ulang Node.js, jangan menambal satu per satu |
| `[x] expo` padahal sudah install | Skrip dijalankan dari folder lain | Jalankan dari folder project yang punya `node_modules` |

## Yang perlu kamu bawa ke pertemuan 2

- Node.js ≥ 22 sudah terpasang.
- Editor (VS Code) sudah terpasang.
- Satu jalur pengujian sudah dipilih: Expo Go di ponsel, emulator Android, atau browser.
  Trade-off ketiganya dibahas di bab 2.
