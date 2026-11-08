# SIAKAD Mobile — Project Contoh Bab 5

Project Expo bertema **data mahasiswa** untuk mempraktikkan seluruh isi
[`slides/bab-05-dasar-react-native.md`](../../slides/bab-05-dasar-react-native.md).

Berbeda dari [`demo/bab-05`](../bab-05/) yang berpindah layar per bagian slide, project ini
adalah **satu aplikasi utuh** dengan lima layar. Setiap keputusan di dalamnya diambil karena
materi bab, bukan karena kebiasaan — dan alasannya ditulis sebagai komentar di berkas yang
bersangkutan, lengkap dengan nomor subbab.

Project ini juga menjawab anjuran praktikum integrasi di akhir bab: *"Kerjakan dengan data
aplikasi Manajemen Data Mahasiswa — daftar mata kuliah atau daftar mahasiswa — supaya hasilnya
bisa dipakai lagi di Bab 6 dan Bab 7."*

**Tutorial langkah demi langkah:** [`TUTORIAL.md`](TUTORIAL.md) — 19 langkah dari folder kosong
sampai aplikasi siap diuji, lengkap dengan titik periksa, kesalahan yang sering muncul, dan
alasan tiap keputusan. Cocok dipakai sebagai naskah mengajar atau lembar kerja mahasiswa.

---

## Cara menjalankan

```bash
cd demo/bab-05-mahasiswa
npm install
npx expo start
```

Tekan `i` (iOS), `a` (Android), atau `w` (web). Untuk Expo Go, pindai QR yang muncul.

Versi yang dipakai sama dengan slide penutup bab:
**Expo SDK 57.0.31 · React Native 0.86.3 · React 19.2.3 · Node.js ≥ 22**.

Build web statis (opsional, untuk memeriksa tanpa emulator):

```bash
npm run export:web   # hasil di dist/
```

---

## Lima layar

| Layar | Berkas | Isi |
|---|---|---|
| Beranda | `screens/BerandaScreen.js` | Dashboard: kartu statistik, dua panel responsif, peringkat IPK |
| Mahasiswa | `screens/MahasiswaScreen.js` | `FlatList` + pencarian + pengurutan |
| Detail | `screens/DetailMahasiswaScreen.js` | Profil, ringkasan akademik, mata kuliah, catatan bimbingan |
| Mata Kuliah | `screens/KatalogScreen.js` | Katalog grid dengan `numColumns` |
| Info | `screens/TentangScreen.js` | Padanan React Web/Native, `Platform.OS`, tabel scroller, daftar periksa |

Navigasi antar layar hanya memakai dua state di `App.js` (`tabAktif` dan `idDetail`) — pustaka
navigasi baru dibahas di Bab 7, jadi sengaja tidak dipakai di sini.

---

## Peta materi slide → kode

| Slide Bab 5 | Di project ini | Yang bisa ditunjukkan |
|---|---|---|
| 1.1–1.2 Konsep sama, medium berbeda | `screens/TentangScreen.js` (bagian 1) | Tabel padanan `div`→`View`, `p`→`Text`, `button`→`Pressable`, CSS→`StyleSheet` |
| 1.3 HTML dirender browser, komponen dirender native | `screens/TentangScreen.js` | Satu contoh JSX utuh + catatan bahwa yang berganti hanya import, nama komponen, dan gaya |
| 1.4 Bagian kode yang bisa dipakai ulang | `data/mahasiswa.js` | Data dan fungsi turunan tidak bergantung pada komponen |
| 2.1–2.2 `View` dan `Text` | semua layar | Tidak ada teks yang ditulis langsung di dalam `View` |
| 2.3 `Image` | `components/AvatarPlaceholder.js`, kepala Beranda | `require('../assets/icon.png')` vs `{ uri }`, ukuran eksplisit, `onError` jatuh ke inisial |
| 2.4 `TextInput` | `components/KotakPencarian.js`, catatan di Detail | Controlled component: `value` + `onChangeText`, nilai turunan `54/200` |
| 2.5–2.6 `Button` vs `Pressable` | `components/TombolAksi.js` | `style` sebagai fungsi, `pressed`, `hitSlop`, `android_ripple` (hanya Android) |
| 2.7–2.8 `ScrollView` dan `FlatList` | Mahasiswa, Katalog, Detail | Dua scroller dipakai sesuai struktur data, bukan kebiasaan |
| 2.9 `SafeAreaView` | `App.js` | `SafeAreaView` + padding `StatusBar.currentHeight` untuk Android |
| 2.10 Props dan komposisi | `BarisMahasiswa`, `KartuStatistik`, `Panel` | Data turun lewat props; layar disusun dari komponen kecil |
| 3.1–3.2 `StyleSheet`, `camelCase`, array style | semua komponen | Tidak ada berkas CSS; `padding`, `fontSize`, `backgroundColor` |
| 3.3 Gaya kondisional | `LabelStatus`, `TombolAksi`, chip semester, tombol urut | `&&` untuk menambah gaya, ternary untuk memilih; `false` diabaikan |
| 3.4 Konsistensi lewat konstanta | `theme/warna.js` | Satu sumber warna, jarak, radius, ukuran teks |
| 4.1–4.4 Sumbu utama/silang | `BarisInfo`, `BarisMahasiswa`, `TabBar` | `justifyContent` (utama) vs `alignItems` (silang) |
| 4.5–4.7 Pembagian ruang dan jarak | Beranda, Katalog | `flex: 1`, `gap`, tanpa lebar tetap |
| 4.8 `useWindowDimensions()` | `BerandaScreen`, `KatalogScreen` | Angka lebar ditampilkan langsung; chip "render" membuktikan render ulang |
| 4.9 Breakpoint dan orientasi | `theme/warna.js` → `BREAKPOINT_LEBAR` | 600 dipakai sebagai ambang susunan, bukan nama perangkat |
| 4.10 Yang perlu diuji | Info (daftar periksa) | Lima butir pengujian setelah layout jadi |
| 5.1 `ScrollView` untuk konten statis | `DetailMahasiswaScreen` | `contentContainerStyle` untuk padding di dalam area gulir |
| 5.2 `FlatList` dan virtualisasi | `MahasiswaScreen`, `KatalogScreen` | Tiga properti wajib, `keyExtractor` dari `item.id`, `ListHeader/Empty/Footer/ItemSeparator`, `numColumns` + `key` yang ikut berubah |
| 5.3 Memilih scroller | Info (tabel) + pilihan di tiap layar | `ScrollView` untuk satu profil; `FlatList` untuk daftar yang bisa memanjang |
| 5.4 Android vs iOS | Info (bagian 2) + `App.js` | `Platform.OS`, `Platform.select`, catatan area aman |
| 5.5 Keyboard dan gulir | Kotak pencarian, catatan bimbingan | `keyboardShouldPersistTaps="handled"` |

---

## Struktur folder

```text
bab-05-mahasiswa/
├── App.js                      # akar aplikasi + navigasi berbasis state
├── TUTORIAL.md                 # tutorial 19 langkah (dihasilkan otomatis)
├── TUTORIAL.src.md             # sumber tutorial; sunting ini, bukan TUTORIAL.md
├── index.js
├── app.json
├── theme/warna.js              # warna, jarak, radius, ukuran teks, breakpoint
├── data/mahasiswa.js           # 8 mahasiswa, 7 mata kuliah, fungsi turunan
├── components/
│   ├── AvatarPlaceholder.js    # Image + inisial (subbab 2.3)
│   ├── BarisInfo.js            # baris label–nilai (subbab 4.3)
│   ├── BarisMahasiswa.js       # item FlatList (subbab 2.10, 5.2)
│   ├── KartuMataKuliah.js      # kartu grid (subbab 5.2)
│   ├── KartuStatistik.js       # kartu angka (subbab 4.5)
│   ├── KotakPencarian.js       # TextInput controlled (subbab 2.4)
│   ├── LabelStatus.js          # gaya kondisional (subbab 3.3)
│   ├── TabBar.js               # navigasi bawah (subbab 2.6)
│   └── TombolAksi.js           # Pressable (subbab 2.5–2.6)
├── screens/                    # lima layar
└── assets/                     # ikon aplikasi (dipakai lewat require)
```

Catatan: `TUTORIAL.md` dihasilkan dari `TUTORIAL.src.md` oleh
`scripts/build-tutorial-bab05-mahasiswa.mjs`. Blok kode di tutorial disalin langsung dari berkas
project, jadi tidak bisa menyimpang. Setelah mengubah kode atau template, jalankan
`npm run build:tutorial`; `npm run verify:tutorial` memeriksa apakah tutorial masih mutakhir.

---

## Yang sengaja tidak dipakai

| Hal | Alasan |
|---|---|
| Pustaka navigasi (`expo-router`, React Navigation) | Dibahas di Bab 7; di sini cukup dua state |
| Penyimpanan permanen | Catatan bimbingan hanya bertahan selama layar terbuka — bahan Bab 11 |
| `Button` bawaan | Hanya untuk perbandingan; semua tombol memakai `Pressable` agar bisa ditata (subbab 2.5–2.6) |
| `react-native-safe-area-context` | Alternatif modern `SafeAreaView` dibahas di praktikum dan Bab 8 |
| `fetch` ke server | Data statis dulu; API baru di Bab 10 |

---

## Latihan cepat (bisa dipakai di kelas)

1. Ubah `BREAKPOINT_LEBAR` menjadi `900`, lalu putar perangkat pada lebar di antaranya.
   Apakah susunan panel berubah lebih cepat atau lebih lambat?
2. Tambahkan satu mahasiswa baru di `data/mahasiswa.js`, lalu periksa apakah kartu statistik,
   sebaran prodi, dan peringkat ikut berubah tanpa menyunting layar mana pun.
3. Hapus `onChangeText` pada kotak pencarian. Ketik sesuatu, dan jelaskan mengapa kotaknya
   tampak terkunci (subbab 2.4).
4. Bungkus `FlatList` di `MahasiswaScreen` dengan `ScrollView`, lalu buka Metro console.
   Cari kata kunci `VirtualizedLists` (subbab 5.2).
5. Ganti `keyExtractor` menjadi indeks array, filter daftar, lalu jelaskan mengapa baris bisa
   tercocokkan dengan data yang salah (subbab 5.2).

---

## Daftar periksa "yang harus teramati"

Sama dengan daftar di akhir bab; kelimanya bisa diperiksa langsung di project ini.

- [x] Teks muncul sebagai `Text`, bukan sebagai isi `View`
- [x] Tombol berubah tampilan saat status aktif dan nonaktif
- [x] Dua panel berubah susunan saat jendela melebar atau diputar
- [x] Daftar panjang tetap ringan saat digulir
- [x] Tidak ada konten tertutup status bar atau home indicator

---

## Hasil pengukuran

Angka di bawah diukur dari hasil render di Expo Web, bukan diklaim.

| Yang diuji | Hasil |
|---|---|
| Beranda pada lebar 390 | `flexDirection: column`, dua panel bertumpuk |
| Beranda pada 720 dan 1280 | `flexDirection: row`, penghitung render 1 → 2 saat lebar diubah |
| Mahasiswa, kata kunci `informatika` | 4 dari 8 mahasiswa, urut A–Z |
| Detail, catatan 54 karakter | penghitung `54/200`, konfirmasi muncul setelah Simpan |
| Katalog pada 720 dan 1280 | 2 kolom |
| Katalog pada 390 dan 320 | 1 kolom, tanpa memuat ulang |
| Katalog, chip Semester 6 | 2 mata kuliah · 5 SKS |
| Semua layar pada lebar 320 | `scrollWidth` = `clientWidth` (tidak ada overflow mendatar) |
| Console sepanjang penjelajahan | 0 galat, 0 peringatan |

Pengujian di perangkat fisik tetap perlu untuk perilaku yang tidak terlihat di web:
`android_ripple`, area aman, dan papan ketik (subbab 5.3–5.5). `SafeAreaView` bawaan juga
hanya bekerja di iOS — karena itu `App.js` menambahkan `paddingTop` dari
`StatusBar.currentHeight` ketika berjalan di Android.
