# Bab 11 — Penyimpanan Data Lokal

Slide: [`slides/bab-11-penyimpanan-data-lokal.md`](../../slides/bab-11-penyimpanan-data-lokal.md)

Bab 10 bergantung sepenuhnya pada jaringan: server mati, layar kosong, keranjang hilang
setiap aplikasi ditutup. Bab 11 menambahkan AsyncStorage lewat `utils/cache.js` — snapshot
nilai yang bertahan saat server mati, dan draf KRS yang dipulihkan saat aplikasi dibuka lagi.
Cache bukan pengganti server; ia hanya membuat aplikasi tidak amnesia.

## Tujuan pembelajaran

- Menjelaskan kebutuhan penyimpanan lokal dibanding state di memori
- Mengidentifikasi karakteristik AsyncStorage
- Mengimplementasikan simpan, baca, dan hapus data dengan JSON
- Menganalisis pola caching: snapshot, timestamp, dan TTL
- Mengevaluasi risiko menyimpan token di AsyncStorage
- Merancang aplikasi catatan yang persisten

## Isi folder

| Berkas | Isi |
| --- | --- |
| `utils/cache.js` | `KUNCI`, `TTL_MS`, `simpanSnapshot`, `bacaSnapshot`, `hapusSnapshot`, `hapusSemuaSnapshot`, `umurTerbaca` |
| `hooks/useNilai.js` | Cache-first: snapshot dulu, lalu server, lalu tandai sumbernya |
| `app/(tabs)/nilai/index.js` | Lencana "Dari cache · N menit lalu", kotak galat, "Muat ulang dari server" |
| `context/KrsContext.js` | Pulihkan draf sekali, simpan setiap perubahan, hapus saat dikosongkan |
| `context/AuthContext.js` | `keluar()` menunggu `hapusSemuaSnapshot()` sebelum sesi dihapus |
| `package.json` | `@react-native-async-storage/async-storage` versi `2.2.0` |

## Snapshot, timestamp, TTL

Yang disimpan selalu satu bungkus: `{ data, disimpanPada }`. Tanpa `disimpanPada`, aplikasi
tidak bisa membedakan "data kemarin" dari "data sekarang". `bacaSnapshot` mengembalikan empat
hal — `data`, `disimpanPada`, `umurMs`, `kedaluwarsa` — dan **tidak** membuang data yang
kedaluwarsa: pemanggil yang memutuskan, bukan lapisan cache.

| Bagian | Nilai |
| --- | --- |
| Kunci | `siakad:nilai:v1`, `siakad:draf-krs:v1`, `siakad:profil:v1` |
| Bentuk | `{ data, disimpanPada }` sebagai JSON |
| TTL | `6 * 60 * 60 * 1000` (6 jam) |

Akhiran `:v1` bukan hiasan: kalau bentuk data berubah, kunci baru membuat data lama tidak pernah dibaca lagi. `KUNCI.profil` sudah disiapkan tetapi belum ada yang menulisnya.

## Cache-first with fallback

`useNilai` menjalankan tiga langkah dengan urutan yang disengaja:

1. Baca snapshot → langsung tampilkan, `sumber = 'cache'`, `umur = snapshot.umurMs`.
2. Minta ke server → berhasil berarti `sumber = 'jaringan'`, `umur = 0`, snapshot diperbarui.
3. Gagal → snapshot tetap tampil, dan kotak "Gagal memperbarui dari server" muncul di atasnya.

| Network-only | Cache-first (dipakai di sini) |
| --- | --- |
| Server mati = layar kosong | Server mati = data lama + lencana umur |
| Selalu data terbaru | Bisa menampilkan data 6 jam lalu, dan mengatakannya |
| Satu keadaan | Tiga keadaan: jaringan, cache, kosong |

IPK dihitung di server (`backend/routes/nilai.js`), bukan di aplikasi — kalau dihitung di dua
tempat, cepat atau lambat angkanya berbeda.

## Draf KRS dan logout

`KrsContext` memulihkan draf satu kali saat provider dipasang, lalu menyimpan setiap
perubahan. Dua penjaga mencegah bug klasik pola ini: `siap` menahan efek penyimpanan sampai
pemulihan selesai (supaya array kosong awal tidak menimpa draf), dan `pertama` melewati
perubahan pertama setelah pemulihan karena itu hanya gema data yang baru dimuat.
`bersihkan()` menghapus kunci draf; `keluar()` di `AuthContext` memanggil
`hapusSemuaSnapshot()` dan kini `async` karena menunggu `multiRemove` selesai — data akademik
di perangkat tidak boleh tertinggal setelah logout.

## Menjalankan

```bash
cd kode/bab-11-penyimpanan-data-lokal
npm install
npm run api        # terminal kedua — http://localhost:3000
npm run api:reset  # kembalikan data seed
npx expo start
```

Masuk dengan NIM `20230001` / password `rahasia123`. Buka tab Nilai sekali dengan API hidup
(tidak ada lencana), lalu hentikan API dan tekan "Muat ulang dari server".

## Langkah praktikum

1. Buka tab Nilai dengan API hidup, matikan API, lalu tekan "Muat ulang dari server". Tebak
   lebih dulu apakah daftar hilang atau bertahan, lalu jelaskan nilai `sumber` dan `umur`.
2. Matikan API, ubah `TTL_MS` menjadi `60 * 1000`, tunggu satu menit, lalu muat ulang.
   Lencana berubah warna dan menambahkan "· sudah lewat 6 jam" — mengapa angka itu tidak
   ikut berubah?
3. Tambahkan dua mata kuliah, ubah salah satunya ke kelas "B", muat ulang aplikasi, lalu
   periksa keranjang. Setelah "Kosongkan keranjang", muat ulang lagi: kunci mana yang hilang?
4. Di `context/KrsContext.js`, hapus `if (!siap) return;` pada efek penyimpanan, tambahkan dua
   mata kuliah, lalu muat ulang. Jelaskan mengapa draf bisa tertimpa array kosong.
5. Tebak keluaran `umurTerbaca` untuk `90_000` dan `5 * 3_600_000`, lalu buktikan dengan
   `node -e "import('./utils/cache.js').then(m => console.log(m.umurTerbaca(90000)))"`.
6. Keluar lewat tab Profil, lalu buka tab Nilai **tanpa** menyalakan API. Sebutkan baris di
   `context/AuthContext.js` yang menghapus cache dan mengapa itu penting.

## Checkpoint

1. Pada pemakaian pertama dengan API hidup, tab Nilai tidak menampilkan lencana dan
   `siakad:nilai:v1` terisi.
2. API dimatikan lalu tab dimuat ulang: daftar tetap tampil bersama lencana "Dari cache · N menit lalu".
3. Keranjang KRS beserta pilihan kelasnya kembali setelah aplikasi dimuat ulang; setelah
   dikosongkan dan dimuat ulang, keranjang tetap kosong.
4. Logout lalu muat ulang: kembali ke layar login, dan tab Nilai tidak punya data cache lagi.

## Troubleshooting

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| `[@RNC/AsyncStorage]: NativeModule: AsyncStorage is null` | Paket ada di `package.json` tetapi build terpasang belum memuat modul native-nya | Pakai Expo Go SDK 57, atau pasang ulang setelah `npm install` |
| Keranjang selalu kosong saat aplikasi dibuka | Draf tersimpan sebagai array kosong, atau `bersihkan()` terpanggil | Periksa efek penyimpanan: array kosong memang menghapus kunci |
| Nilai tidak pernah lepas dari lencana cache | Permintaan ke server gagal; `sumber` hanya jadi `'jaringan'` bila berhasil | Nyalakan `npm run api`, tekan "Muat ulang dari server" |
| Lencana menulis "sudah lewat 6 jam" padahal baru disimpan | `TTL_MS` diubah atau jam perangkat tidak sinkron; teksnya ditulis tetap | Samakan teks dengan `TTL_MS`, atau biarkan sebagai peringatan tetap |

## Yang berubah dibanding bab 10

| Berkas | Perubahan |
| --- | --- |
| `utils/cache.js` | Baru — kunci, bentuk snapshot, TTL, dan `umurTerbaca` |
| `hooks/useNilai.js` | Baru — cache-first dengan fallback ke snapshot |
| `api/nilai.js` | Baru — `GET /api/nilai?nim=...` |
| `app/(tabs)/nilai/index.js` | Ditulis ulang — lencana cache, kotak galat, muat ulang |
| `context/KrsContext.js` | Pulihkan dan simpan draf KRS, hapus saat dikosongkan |
| `context/AuthContext.js` | `keluar()` menghapus seluruh snapshot sebelum menutup sesi |
| `package.json` | Tambah `@react-native-async-storage/async-storage` `2.2.0` |
