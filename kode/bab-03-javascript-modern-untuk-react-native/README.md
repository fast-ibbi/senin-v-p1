# Bab 3 — JavaScript Modern untuk React Native

Slide: [`slides/bab-03-javascript-modern-untuk-react-native.md`](../../slides/bab-03-javascript-modern-untuk-react-native.md)

Bab ini belum menambah layar baru. Yang ditambahkan adalah **cara berpikir**: seluruh data
akademik dipindahkan ke `data/`, seluruh perhitungan ke `utils/`, dan `App.js` hanya
menampilkan hasilnya. Pola ini bertahan sampai bab 15.

## Tujuan pembelajaran

- Menjelaskan `const` dan `let` beserta konsekuensi _scope_-nya
- Menerapkan tipe data, operator, percabangan, dan perulangan
- Menganalisis fungsi biasa dan arrow function, termasuk perilaku `this`
- Mengimplementasikan _destructuring_, _spread_, `map`, `filter`, `reduce`
- Mengevaluasi module `import`/`export` dan pola asinkron `async`/`await`

> Di RPS, module dan `async/await` diajarkan pada pertemuan 4 bersama bab 4. Di folder ini
> keduanya sudah tersedia supaya kamu bisa membandingkan sebelum masuk ke React.

## Isi folder

| Berkas | Gunanya |
| --- | --- |
| `data/matakuliah.js` | 12 mata kuliah — angka sama dengan seed backend |
| `data/mahasiswa.js` | Profil dan 8 nilai (IPK 3,70) |
| `utils/akademik.js` | Fungsi murni: `totalSks`, `filterSemester`, `hitungIpk`, `tentukanPredikat`, `urutkanJadwal`, `sisaKuota` |
| `latihan-predikat.js` | `map` + percabangan berantai |
| `latihan-cari.js` | `find` berdasarkan NIM dari argumen CLI |
| `latihan-async.js` | Promise, `async/await`, `try/catch/finally` |
| `App.js` | Playground: membuktikan semua fungsi di atas bekerja pada data SIAKAD |

## Menjalankan

Aplikasi:

```bash
cd kode/bab-03-javascript-modern-untuk-react-native
npm install
npx expo start
```

Latihan CLI (tidak butuh Metro, cukup Node.js):

```bash
node latihan-predikat.js
node latihan-cari.js 20230002
node latihan-cari.js 99999999     # jalur "tidak ditemukan"
node latihan-async.js
node latihan-async.js --gagal     # jalur error
```

## Langkah praktikum

1. Buka `utils/akademik.js`. Sebutkan mana yang **arrow function** dan mana yang
   **function biasa**, lalu jelaskan mengapa `hitungIpk` ditulis sebagai arrow function.
2. Jalankan `node latihan-predikat.js`. Ubah `daftarIpk` menjadi `[3.5, 3.49]` dan
   perhatikan batas predikat (`>= 3.5`).
3. Jalankan `node latihan-cari.js` tanpa argumen, lalu dengan NIM yang tidak ada.
   Perhatikan bahwa program **tidak crash** — itu tujuan pemeriksaan `undefined`.
4. Di `App.js`, ubah `filterSemester(matakuliah, 5)` menjadi `4`. Bagian mana yang berubah,
   bagian mana yang tetap? Mengapa?
5. Tambahkan satu fungsi murni baru `cariNilaiTertinggi(nilai)` di `utils/akademik.js`,
   pakai `reduce`, lalu tampilkan hasilnya di bagian 3.
6. Buka `data/matakuliah.js`, tambahkan satu mata kuliah semester 6, dan pastikan
   pengelompokan per semester di Playground ikut berubah tanpa menyentuh `App.js`.
7. Jalankan `node latihan-async.js --gagal`, lalu jelaskan mengapa `finally` tetap berjalan.

## Checkpoint

1. Aplikasi menampilkan enam bagian Playground tanpa error merah.
2. `node latihan-predikat.js` mencetak lima predikat dari 3,72 sampai 1,90.
3. `node latihan-cari.js 99999999` mencetak pesan "tidak ditemukan" dan keluar normal.
4. Kamu bisa menjelaskan mengapa `sort` di `urutkanJadwal` memakai `[...daftar]`.
5. Kamu bisa menjelaskan perbedaan `map`, `filter`, dan `reduce` tanpa membuka catatan.

## Troubleshooting

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| `SyntaxError: Cannot use import statement outside a module` | `package.json` tidak memuat `"type": "module"` | Tambahkan baris itu; seluruh folder ini memakainya |
| `await is only valid in async functions` | Sama seperti di atas — file dibaca sebagai CommonJS | Pastikan `"type": "module"` ada |
| `Cannot find module './data/matakuliah.js'` | Ekstensi `.js` tidak ditulis saat mengimpor dari Node | Node mewajibkan ekstensi lengkap; Metro tidak |
| `Cannot read properties of undefined (reading 'nama')` | Hasil `find` tidak diperiksa dulu | Periksa `undefined` sebelum mengakses properti |
| `reduce` mengembalikan `NaN` | Nilai awal reduce tidak diberi, atau bobot huruf tidak ada di `BOBOT_MUTU` | Beri nilai awal `0` dan pastikan kode huruf benar |

## Yang berubah dibanding bab 2

| Berkas | Perubahan |
| --- | --- |
| `data/` | Baru — data akademik dipisahkan dari tampilan |
| `utils/akademik.js` | Baru — semua perhitungan sebagai fungsi murni |
| `latihan-*.js` | Baru — tiga skrip CLI untuk latihan JS |
| `App.js` | Ditulis ulang menjadi Playground enam bagian |
| `package.json` | Tambah `"type": "module"` dan tiga skrip latihan |
