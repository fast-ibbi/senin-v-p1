# Bab 14 — Debugging, Testing, dan Quality Assurance

Slide: [`slides/bab-14-debugging-testing-dan-quality-assurance.md`](../../slides/bab-14-debugging-testing-dan-quality-assurance.md)

Bab ini tidak menambah layar. Yang ditambahkan adalah cara membuktikan bahwa layar-layar
sebelumnya benar: unit test untuk fungsi murni, daftar periksa QA manual, dan kebiasaan
membaca pesan galat.

## Tujuan pembelajaran

- Menjelaskan peran debugging, testing, dan QA dalam siklus hidup aplikasi
- Mengidentifikasi fungsi console dan fitur React Native DevTools
- Menganalisis error umum React Native beserta penyebab dan solusinya
- Menerapkan unit test fungsi murni dengan `node:test`
- Membedakan unit, integration, manual, dan usability testing

## Isi folder

| Berkas | Isi |
| --- | --- |
| `__tests__/validators.test.js` | 11 test aturan validasi, termasuk batas panjang password |
| `__tests__/akademik.test.js` | Perhitungan SKS/IPK, ambang predikat, dan sifat `sort` |
| `__tests__/jwt-dan-waktu.test.js` | Membaca payload JWT tanpa verifikasi + format umur cache |
| `utils/waktu.js` | Fungsi murni yang dipindahkan dari `cache.js` supaya bisa diuji |

## Mengapa hanya fungsi murni yang diuji di sini

| Yang diuji | Bisa di `node --test`? | Alasan |
| --- | --- | --- |
| `utils/validators.js` | ya | tidak mengimpor apa pun |
| `utils/akademik.js` | ya | hanya JavaScript biasa |
| `utils/pemeriksaJwt.js` | ya | hanya `atob` |
| `utils/cache.js` | **tidak** | mengimpor `AsyncStorage` (modul native) |
| Layar (`app/**`) | tidak langsung | butuh renderer dan perangkat |

Itu sebabnya `umurTerbaca` dipindahkan ke `utils/waktu.js` di bab ini. Memisahkan logika
murni dari lapisan I/O adalah langkah pertama agar bisa diuji — bukan pekerjaan tambahan
setelah kode selesai.

## Menjalankan

```bash
cd kode/bab-14-debugging-testing-dan-quality-assurance
npm install
npm test              # 30 test, selesai < 1 detik
npm run test:watch    # untuk pengembangan
npm run api           # bila ingin menguji manual (terminal kedua)
npx expo start
```

## Langkah praktikum

1. Jalankan `npm test`. Catat jumlah test dan waktu totalnya.
2. Rusak satu aturan: ubah `MIN_PANJANG_PASSWORD` dari 8 menjadi 6. Jalankan `npm test`
   lagi, dan baca test mana yang gagal beserta pesannya.
3. Tambah satu test baru: NIM dengan spasi di tengah (`'2023 0001'`) harus ditolak.
4. Ubah `tentukanPredikat(3.5)` di `utils/akademik.js` menjadi `> 3.5`, lalu jalankan test.
   Perhatikan bahwa test menangkap perubahan satu karakter.
5. Tambah test untuk `hitungIpk` dengan satu nilai `E` dan jelaskan hasilnya.
6. Buka React Native DevTools (tekan `j` di terminal Expo). Cari satu `console.log` dari
   bab sebelumnya dan telusuri dari mana nilainya berasal.
7. Isi tabel QA manual di bawah untuk aplikasi ini, dengan tanda ✓/✗.

## Checklist QA manual

Cek di emulator/ponsel, bukan di browser, untuk butir bertanda (D) — device.

| # | Butir | D | Harapan |
| --- | --- | --- | --- |
| 1 | Login password salah | | pesan dari server, bukan crash |
| 2 | Login benar | | masuk ke Beranda, sesi bertahan setelah aplikasi ditutup |
| 3 | Ambil MK sampai 24 SKS | | penambahan berikutnya ditolak dengan sisa SKS |
| 4 | Mata kuliah kuota penuh | | tidak bisa dipilih |
| 5 | Kirim keranjang | | semua baris menjadi `POST`, hasil per baris tampil |
| 6 | Ubah kelas KRS | | daftar tersimpan berubah, bukan hanya di layar |
| 7 | Batalkan KRS | | baris hilang dari daftar server |
| 8 | Matikan server, buka Nilai | | data cache tampil + lencana umur |
| 9 | Logout lalu login lagi | | snapshot perangkat dibersihkan |
| 10 | Ambil foto profil (D) | | foto tampil dan bertahan |
| 11 | Presensi di dalam area (D) | | jarak < 500 m, tercatat |
| 12 | Presensi di luar area (D) | | 422 dengan pesan jarak |
| 13 | Putar layar / ubah lebar | | tata letak tidak rusak |
| 14 | Token kedaluwarsa | | kembali ke login tanpa crash |

## Pesan galat React Native dan penyebabnya

| Pesan | Penyebab paling sering | Cara memeriksa |
| --- | --- | --- |
| `Cannot read property 'x' of undefined` | data API belum tiba, tetapi layar langsung mengakses | pastikan ada keadaan `memuat` sebelum render |
| `Objects are not valid as a React child` | merender objek, bukan string/elemen | cetak nilai dengan `console.log` |
| `Each child in a list should have a unique "key"` | `map` tanpa `key` stabil | pakai id, bukan indeks |
| `Text strings must be rendered within a <Text>` | teks langsung di dalam `<View>` | bungkus dengan `<Text>` |
| `Unable to resolve module` | path salah, ekstensi lupa, paket belum dipasang | bandingkan huruf besar-kecil path |
| `Network request failed` | server mati / alamat salah | `npm run api`, cek `BASE_URL` |

## Checkpoint

1. `npm test` melaporkan 30 test lulus.
2. Kamu bisa menunjuk test mana yang akan gagal bila `MIN_PANJANG_PASSWORD` diubah.
3. Checklist QA terisi lengkap; butir yang gagal punya catatan penyebab.
4. Kamu bisa menjelaskan bedanya unit test, integration test, dan usability test.
5. Kamu bisa membaca sebuah galat React Native dan menebak penyebabnya sebelum membaca
   Stack Overflow.

## Troubleshooting

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| `npm test` tidak menemukan file | dijalankan dari folder lain | Jalankan dari folder bab 14 |
| `Cannot find module '.../utils/cache.js'` di test | mengimpor modul yang butuh AsyncStorage | Uji fungsi murninya (`utils/waktu.js`), bukan `cache.js` |
| Test gagal karena tanggal | memakai `Date.now()` di dalam test | Beri parameter waktu eksplisit seperti `sudahKedaluwarsa(token, 1700000000)` |
| `ERR_REQUIRE_ESM` | `package.json` tanpa `"type": "module"` | Tambahkan baris itu |

## Yang berubah dibanding bab 13

| Berkas | Perubahan |
| --- | --- |
| `__tests__/` | Baru — tiga berkas test, 30 kasus |
| `utils/waktu.js` | Baru — `umurTerbaca` dipindahkan dari `cache.js` |
| `utils/cache.js` | Mengekspor ulang `umurTerbaca` agar pemanggil lama tetap bekerja |
| `package.json` | Tambah skrip `test` dan `test:watch` |
