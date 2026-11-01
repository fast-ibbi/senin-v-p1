# Demo Kelas — Bab 5: Dasar React Native

Aplikasi demo untuk mengajar `slides/bab-05-dasar-react-native.md` secara langsung di kelas.

Enam berhenti, satu per bagian slide, ditutup dengan halaman katalog yang memakai seluruh isi
bab. Setiap layar menampilkan kartu catatan **"Yang perlu diperhatikan"** di bagian atas, jadi
kelas tetap tahu apa yang harus dilihat walaupun narasi dosen terlewat.

Panduan mengajar langkah demi langkah ada di [`NASKAH-DEMO.md`](NASKAH-DEMO.md).

---

## Cara menjalankan

```bash
cd demo/bab-05
npm install
npx expo start
```

Lalu tekan `i` untuk simulator iOS, `w` untuk browser, atau pindai QR dengan Expo Go.

Versi yang dipakai sama dengan yang tertulis di slide penutup bab:
**Expo SDK 57.0.31 · React Native 0.86.3 · React 19.2.3**.

---

## Peta layar ke slide

| Layar | Isi demo | Slide yang dilayani | Subbab |
|---|---|---|---|
| 0 | Menu bagian (dirender dengan `FlatList`) | Pembuka bagian | — |
| 1 | Padanan `div`/`p`/`img`/`button`/CSS di sebelah komponen native yang benar-benar dirender | Bagian 1 — "Elemen HTML Diganti Komponen Native" | 1.1–1.4 |
| 2 | Enam komponen inti berlabel: `View`, `Text`, `Image`, `TextInput`, `Button`, `Pressable` | Bagian 2 — "Empat Komponen Pertama", "Tombol, Daftar, dan Area Aman" | 2.1–2.6 |
| 3 | Satu tombol, satu state, tiga wajah; kotak kode menampilkan array gaya yang sedang dipakai | Bagian 3 — "Array Style", "Gaya Kondisional" | 3.1–3.4 |
| 4 | Dua panel `column` → `row` pada lebar 600, plus penghitung render | Bagian 4 — "`useWindowDimensions()`", "Breakpoint dan Orientasi" | 4.7–4.10 |
| 5 | Daftar 300 item yang sama, dirender `ScrollView` lalu `FlatList`, dengan penghitung item | Bagian 5 — "`ScrollView`", "`FlatList`", "Memilih Komponen Pengguliran" | 5.1–5.3 |
| 6 | Katalog produk: pencarian, grid 2/3 kolom, `ListEmptyComponent` | Praktikum Integrasi | penutup bab |

Data produk ada di satu tempat (`data/produk.js`) dan dipakai keenam layar.

---

## Struktur

```text
demo/bab-05/
├── App.js                    # shell: satu state untuk berpindah layar, tanpa pustaka navigasi
├── theme/warna.js            # konstanta warna, jarak, radius, ukuran teks, dan breakpoint
├── data/produk.js            # 8 produk + status stok turunan + daftar panjang layar 5
├── components/
│   ├── BingkaiLayar.js       # kerangka seragam: catatan atas, isi, tombol kembali
│   ├── KartuCatatan.js       # kartu "Yang perlu diperhatikan"
│   └── KartuProduk.js        # kartu katalog + gaya kondisional status stok
├── screens/
│   ├── MenuScreen.js         # layar 0
│   ├── PadananScreen.js      # layar 1
│   ├── KomponenScreen.js     # layar 2
│   ├── GayaScreen.js         # layar 3
│   ├── ResponsifScreen.js    # layar 4
│   ├── ScrollerScreen.js     # layar 5
│   └── KatalogScreen.js      # layar 6
├── assets/produk/            # 7 gambar produk yang di-bundle (require)
├── scripts/tangkapan-layar.mjs
└── docs/tangkapan-layar/     # 24 tangkapan layar: menu + 6 layar × 3 ukuran
```

Navigasi sengaja hanya memakai satu `useState` di `App.js`. Navigasi baru dibahas di Bab 7, dan
menu sendiri sudah menjadi contoh `FlatList`.

---

## Batas yang disengaja

Demo ini dirancang untuk demo langsung berdurasi satu sesi, jadi ada hal yang **sengaja tidak**
dikerjakan. Sebutkan batas ini di kelas supaya tidak menjadi kesalahpahaman.

| Hal | Keputusan | Alasan |
|---|---|---|
| Perbedaan Android dan iOS | Tidak didemokan | Demo dijalankan pada satu target. Slide "Android dan iOS Tidak Selalu Sama" dan "`Platform.OS`" dibawakan dari deck; praktiknya ada di Praktikum Soal 8 dan 9. |
| `react-native-safe-area-context` | Tidak dipakai | Hanya `SafeAreaView` bawaan. Pelajaran "bawaan tidak menolong di Android" tetap milik Praktikum Soal 8. |
| Kode yang sengaja salah | Tidak ada | Layar hanya menampilkan kode yang benar; kesalahan umum disebut di kartu catatan, dan red screen-nya dikerjakan di praktikum (Soal 2, 3, 6). |
| Data mahasiswa | Diganti data produk | Bagian 5 pada slide memakai contoh produk. Akibatnya demo ini **tidak** melanjutkan aplikasi `profil-mahasiswa` di buku dan praktikum; sampaikan hal ini di kelas. |
| Pustaka navigasi, form, state global | Tidak dipakai | Semua itu materi Bab 7–9. |

---

## Tangkapan layar

24 berkas di `docs/tangkapan-layar/`, tiga ukuran: `ponsel-potret` (390×844),
`ponsel-lanskap` (844×390), dan `tablet` (834×1112). Layar 5 punya dua berkas karena kedua mode
ditangkap.

Berguna sebagai cadangan kalau demo langsung gagal, dan sebagai bahan kalau Bab 5 ingin diberi
slide tambahan nanti.

Membuat ulang:

```bash
cd demo/bab-05
npx expo export --platform web
npx serve dist -l 8137          # atau: python3 -m http.server 8137 -d dist
node scripts/tangkapan-layar.mjs
```

`tools` web dan Playwright ada di `devDependencies` — keduanya **hanya** untuk verifikasi dan
tangkapan layar, bukan bagian materi. Kode aplikasi sendiri hanya mengimpor `react-native` dan
`expo-status-bar`.

---

## Hasil pengukuran

Angka di bawah diukur dari hasil render, bukan diklaim. Semuanya lolos tanpa galat di console.

| Yang diuji | Hasil |
|---|---|
| Layar 4 pada lebar 390 | `flexDirection: column`, dua panel bertumpuk |
| Layar 4 pada 844 dan 834 | `flexDirection: row`, panel 400/400 dan 395/395 |
| Layar 4 saat lebar diubah 390 → 700 | `flexDirection` berubah, penghitung render 1 → 2 |
| Layar 3 status `utama` / `kedua` / `nonaktif` | latar `#1d4ed8` / putih dengan garis `#1d4ed8` / `#d7dee8`, radius dan padding tetap |
| Layar 5 mode `ScrollView` | 300 item dirender dari 300 |
| Layar 5 mode `FlatList` | 10 item dirender dari 300 |
| Layar 6 pada lebar 390 | 2 kolom |
| Layar 6 pada 844 dan 834 | 3 kolom |
| Layar 6 kata kunci tanpa hasil | `ListEmptyComponent` tampil |
| Semua gambar katalog | 8 dari 8 termuat, tidak ada yang kosong |

Catatan: pengukuran `FlatList` di atas dilakukan di Expo Web. Di perangkat native angkanya juga
kecil, tetapi jendela render mengikuti tinggi layar, jadi angka pastinya berbeda.

---

## Berkas terkait

- `slides/bab-05-dasar-react-native.md` — deck yang didemokan (tidak diubah oleh demo ini)
- `praktikum/bab-05-soal-praktikum.md` — soal mahasiswa; demo ini bukan kunci jawabannya
- `buku/bab-05-dasar-react-native.md` — materi cetak, memakai data mahasiswa
