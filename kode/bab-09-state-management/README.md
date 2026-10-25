# Bab 9 — State Management

Slide: [`slides/bab-09-state-management.md`](../../slides/bab-09-state-management.md)

Bab 8 berhenti pada dua tab yang tidak saling bicara. Bab 9 menambah state global pertama:
keranjang KRS di `context/KrsContext.js`, dibaca lewat `hooks/useKrs.js`. Tab KRS memilih
mata kuliah, tab Beranda menampilkan jumlah SKS yang sama, dan tidak satu pun props dikirim
di antara keduanya. Semua masih di memori — tidak ada server, tidak ada penyimpanan.

## Tujuan pembelajaran

- Menjelaskan perbedaan state lokal dan state global beserta trade-off-nya
- Mengimplementasikan Context API dengan JavaScript polos
- Merancang custom hook `useCart` dan mengevaluasi Zustand serta Redux Toolkit

## Isi folder

| Berkas | Isi |
| --- | --- |
| `context/KrsContext.js` | `KrsProvider`, `BATAS_SKS = 24`, `tambah`/`hapus`/`ubahKelas`/`bersihkan`, `useKrs` |
| `hooks/useKrs.js` | Re-export tipis: `export { useKrs, KrsProvider, BATAS_SKS }` |
| `app/(tabs)/krs/index.js` | Katalog 8 mata kuliah + ringkasan keranjang + tombol Ambil/Batalkan |
| `app/(tabs)/krs/ringkasan.js` | Baris terpilih, pemilih kelas A/B/C, "Kirim KRS", keadaan kosong |
| `app/(tabs)/krs/_layout.js` | Menambah `<Stack.Screen name="ringkasan">` |
| `app/(tabs)/beranda/index.js` | Kotak "SKS di KRS" dari `useKrs()` |
| `app/_layout.js` | `KrsProvider` dipasang **di dalam** `AuthProvider` |
| `app/login.js`, `app/registrasi.js`, `components/FormField.js` | Dari bab 8, tidak berubah |

## Mengapa keranjang harus global

Tab KRS dan tab Beranda sama-sama butuh `totalSks`, tetapi keduanya bersaudara di pohon
rute. Kalau state tinggal di KRS, satu-satunya jalan adalah mengangkatnya ke
`app/_layout.js` lalu menurunkannya lewat props — dan setiap layar baru di antaranya harus
ikut meneruskan props yang tidak ia pakai. Context memotong rantai itu.

| State lokal (`useState` di layar) | State global (Context) |
| --- | --- |
| Cukup untuk satu layar: `pesan`, `sedangUbah` | Dibutuhkan lintas tab: `pilihan`, `totalSks` |
| Tidak ada provider, tidak ada urutan pemasangan | Provider harus dipasang sebelum layar pertama |

Yang disimpan hanya **pilihan** (`kode`, `sks`, `kelas`, `status`). Objek mata kuliah lengkap
tetap tinggal di `data/matakuliah.js`; menyalinnya berarti dua salinan data yang lambat laun
berbeda. `hooks/useKrs.js` sengaja hanya re-export, sehingga `KrsContext` bisa diganti
Zustand tanpa menyentuh satu layar pun.

## Pembaruan immutable, dan penolakan yang bukan error

`tambah` melakukan tiga pemeriksaan sebelum menulis: sudah ada di keranjang, kuota habis
(`sisaKuota(mk) === 0`), dan `totalSksAktif(sekarang) + mk.sks > BATAS_SKS`. Kegagalan aturan
bisnis dikembalikan sebagai `{ ok: false, pesan }` — layar menampilkannya tanpa `try/catch`.

Setiap perubahan membuat array baru:

| Operasi | Bentuk |
| --- | --- |
| Tambah | `setPilihan([...sekarang, { kode, sks, kelas: 'A', status: 'terdaftar' }])` |
| Hapus | `setPilihan((lama) => lama.filter((baris) => baris.kode !== kode))` |
| Ubah kelas | `lama.map((baris) => (baris.kode === kode ? { ...baris, kelas } : baris))` |

`baris.kelas = 'B'` tidak ada di mana pun. Kalau ditulis begitu, React menerima referensi
array yang sama dan tidak merender ulang — tombol kelas tidak berpindah walau datanya
berubah.

## Menjalankan

```bash
cd kode/bab-09-state-management
npm install
npx expo start
```

Masuk dengan NIM `20230001` / password `rahasia123`. Tambahkan beberapa mata kuliah di tab
KRS, buka "Lihat ringkasan KRS", ubah kelas, lalu kembali ke Beranda dan perhatikan kotak
"SKS di KRS" — angkanya sudah berubah tanpa memuat ulang apa pun.

## Langkah praktikum

1. Sebelum menekan apa pun, cari cara memunculkan pesan "Batas 24 SKS terlampaui". Katalog
   semester 5 berisi 8 mata kuliah (22 SKS) dan dua di antaranya penuh (`SI502`, `SI507`).
   Berapa SKS terbanyak yang bisa dipilih, dan mengapa pesan 24 SKS tidak pernah muncul?
2. Di `context/KrsContext.js`, ganti isi `tambah` menjadi `sekarang.push({...});
   setPilihan(sekarang)`. Tekan "Ambil" beberapa kali dan jelaskan mengapa layar berhenti
   berubah.
3. Hapus `KrsProvider` dari `app/_layout.js`, lalu buka tab KRS. Catat pesan yang muncul
   (`useKrs harus dipakai di dalam <KrsProvider>.`) dan jelaskan mengapa pesan itu lebih
   berguna daripada `Cannot read properties of undefined`.
4. Di `context/KrsContext.js`, ubah `ubahKelas` agar memutasi baris di tempat lalu
   mengembalikan array lama (`lama.forEach((b) => Object.assign(b, { kelas })); return lama;`).
   Tekan kelas "B": sorotan tombol tidak berpindah walau objeknya sudah berubah.
5. Ubah `BATAS_SKS` menjadi `12`. Tambahkan mata kuliah sampai pesannya muncul, lalu periksa
   label "/ 24" dan lebar bilah di `krs/index.js`. Angka 24 mana yang tidak ikut berubah?
6. Di Beranda, catat "SKS di KRS". Tambah dua mata kuliah di tab KRS, kembali ke Beranda
   tanpa reload: angkanya sudah benar. Jelaskan komponen mana yang dirender ulang.
7. Buka `ringkasan.js`, tekan "Kirim KRS", lalu tekan Back (bukan "Kembali ke katalog").
   Periksa isi keranjang setelahnya dan jelaskan di mana `bersihkan()` sebenarnya dipanggil.

## Checkpoint

1. Menambah `SI501` menampilkan "SKS dipilih 3 / 24", bilah terisi sebagian, dan
   "1 mata kuliah · sisa 21 SKS".
2. Mata kuliah yang sama tidak bisa masuk dua kali: pesannya "… sudah ada di KRS."
3. `SI502` dan `SI507` berlabel "Kuota penuh"; menekan "Ambil" tidak menambah SKS.
4. Kotak "SKS di KRS" di Beranda menampilkan angka yang sama dengan tab KRS tanpa reload.
5. Ringkasan menampilkan setiap baris dengan pilihan kelas A/B/C, dan layar sukses "KRS
   tercatat" menyatakan datanya masih di memori.

## Troubleshooting

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| `useKrs harus dipakai di dalam <KrsProvider>.` | Provider hilang, atau dipasang di bawah `<Stack>` sehingga layar tidak berada di dalamnya | Pasang `KrsProvider` di `app/_layout.js`, membungkus `<Stack>` |
| Angka di Beranda tidak ikut berubah | Layar membaca salinan `pilihan` sendiri, atau `useMemo` di context lupa mencantumkan `pilihan` di dependencies | Baca `totalSks` dari `useKrs()` dan jaga daftar dependencies |
| Keranjang kosong setiap aplikasi dimuat ulang | State hanya di memori, memang perilaku bab 9 | Draf persisten ditambahkan di bab 11 (`utils/cache.js`) |
| Sorotan kelas tetap di "A" setelah ditekan | Baris diubah di tempat (`baris.kelas = ...`) sehingga referensi array tidak berubah | Buat objek baru: `{ ...baris, kelas }` |
| "Kosongkan keranjang" tidak mengosongkan layar | `pilihan.length = 0` alih-alih `setPilihan([])` | Ganti state dengan array baru |

## Yang berubah dibanding bab 8

| Berkas | Perubahan |
| --- | --- |
| `context/KrsContext.js` | Baru — keranjang KRS sebagai state global |
| `hooks/useKrs.js` | Baru — pintu masuk tunggal ke context |
| `app/(tabs)/krs/index.js` | Ditulis ulang — katalog + keranjang + bilah SKS |
| `app/(tabs)/krs/ringkasan.js` | Baru — baris terpilih, kelas A/B/C, "Kirim KRS" |
| `app/(tabs)/krs/_layout.js` | Tambah layar `ringkasan` |
| `app/(tabs)/beranda/index.js` | Baca `totalSks` dan `jumlahMk` dari `useKrs()` |
| `app/_layout.js` | Tambah `KrsProvider` di dalam `AuthProvider` |
| `package.json` | Hanya `description`; tidak ada dependensi baru |
