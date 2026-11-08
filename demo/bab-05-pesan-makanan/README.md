# pesan-makanan — demo kelas Bab 5 (Dasar React Native)

Aplikasi pesan-antar makanan satu layar: katalog masakan dengan pencarian dan filter
kategori, keranjang, dan halaman "pesanan diterima". Seluruh isinya hanya memakai bahan
Bab 5 — tanpa pustaka navigasi, tanpa API, tanpa penyimpanan lokal.

> Nomor bagian di README ini mengikuti **buku** (`buku/bab-05-dasar-react-native.md`,
> bagian 5.1–5.10). Jangan tertukar dengan "Bagian 1–5" pada slide, yang memakai
> penomoran lain.

## Menjalankan

```bash
cd demo/bab-05-pesan-makanan
npm install
npm start          # lalu pindai QR dengan Expo Go, atau tekan a / i / w
```

Lewat web (tanpa ponsel, enak untuk mengajar dengan proyektor):

```bash
cd demo/bab-05-pesan-makanan
npm run export:web
python3 -m http.server 8139 -d dist
# buka http://localhost:8139
```

Dari akar repo, tiga perintah itu sudah dibungkus:

```bash
npm run export:demo-pesan     # bangun dist/
npm run serve:demo-pesan      # sajikan di http://localhost:8139
npm run capture:demo-pesan    # tangkapan layar + pemeriksaan alur
```

## Struktur

```
App.js                      state keranjang; memilih katalog atau keranjang
theme/warna.js              warna, jarak, radius, huruf, breakpoint
data/menu.js                12 masakan · 4 warung · 4 kategori, dan ongkir
utils/rupiah.js             rupiah(15000) -> "Rp15.000"
components/
  KartuMenu.js              satu kartu, dua bentuk: mendatar (ponsel) / petak (lebar)
  ChipKategori.js           Pressable yang berubah wajah saat aktif
  BarisKeranjang.js         satu baris keranjang dengan tombol − dan +
  BilahRingkas.js           bilah bawah: jumlah item, total, "Lihat Keranjang"
screens/
  KatalogScreen.js          FlatList + pencarian + chip + kolom mengikuti lebar
  KeranjangScreen.js        keranjang, ringkasan biaya, dan keadaan "terkirim"
assets/produk/m01–m12.jpg   foto masakan (512×512, dipanggil dengan require())
docs/tangkapan-layar/       hasil `npm run capture:demo-pesan`
scripts/tangkapan-layar.mjs verifikasi Playwright + tangkapan layar
```

## Peta bagian buku → berkas

| Bagian buku | Di mana melihatnya |
|---|---|
| 5.1 React untuk Web vs React Native | Seluruh berkas: tidak ada `<div>` atau `<p>`; semua huruf lewat `Text`, semua kotak lewat `View` |
| 5.2 `View` dan `Text` | `components/KartuMenu.js`, `screens/KatalogScreen.js` (kepala layar dan keadaan kosong) |
| 5.3 `Image` | `data/menu.js` (`require()`, bukan `uri`) dan `components/KartuMenu.js` (ukuran eksplisit + `resizeMode`) |
| 5.4 `Pressable` dan `Button` | `components/ChipKategori.js`, `components/BarisKeranjang.js`, `components/BilahRingkas.js`, `screens/KeranjangScreen.js`. Tidak ada `Button` satu pun — semua tombol butuh bentuk sendiri |
| 5.5 `TextInput` | `screens/KatalogScreen.js`: `value={kataKunci}` + `onChangeText`, contoh komponen terkendali |
| 5.6 `ScrollView` dan `FlatList` | `screens/KatalogScreen.js` — `FlatList` sebagai penggulir utama, satu `ScrollView` **mendatar** untuk baris chip (beda sumbu, jadi tidak berebut kendali gulir); `screens/KeranjangScreen.js` — `FlatList` kedua |
| 5.7 `SafeAreaView` | `App.js`. Perhatikan komentar di sana: `SafeAreaView` bawaan hanya bekerja di iOS, jadi Android diberi `StatusBar.currentHeight` |
| 5.8 `StyleSheet` dan gaya | `theme/warna.js` (token), `StyleSheet.create` di setiap berkas, dan **array style** di `KartuMenu` (`[gaya.kartu, bayangan, mendatar ? … : …]`) serta `ChipKategori` (`[gaya.chip, aktif && gaya.chipAktif]`) |
| 5.9 Flexbox dan layout responsif | `screens/KatalogScreen.js`: `useWindowDimensions()`, `numColumns` (1/2/3), `key={kolom}`, dan `lebarKartu` yang dihitung dari lebar jendela. `KartuMenu.js`: `flexDirection` berganti mendatar ↔ kolom. `BilahRingkas.js`: `row` + `space-between` |
| 5.10 Perbedaan platform | `components/KartuMenu.js`: `Platform.select` untuk bayangan (`shadow*` di iOS/web, `elevation` di Android). `App.js`: `Platform.OS` untuk jarak status bar |
| Props dan komposisi (slide bagian 2.10) | `App.js` menurunkan data dan callback ke `KatalogScreen`/`KeranjangScreen`; layar menurunkannya lagi ke empat komponen. Tidak ada satu berkas pun yang memegang seluruh antarmuka |

## Alur

1. **Katalog** — cari, pilih kategori, tekan `Tambah`. Bilah bawah muncul begitu keranjang berisi.
2. **Keranjang** — `−` / `+` mengubah jumlah; jumlah 0 membuang barisnya. Ringkasan menghitung subtotal + ongkir tetap Rp8.000.
3. **Pesanan diterima** — total yang dibayar dikunci saat menekan "Pesan sekarang", lalu keranjang dikosongkan. "Pesan lagi" kembali ke katalog.

Keranjang disimpan di `App.js` sebagai `[{ id, jumlah }]`, bukan salinan objek menu — kalau
harga di `data/menu.js` berubah, keranjang ikut menyesuaikan.

## Yang sengaja tidak dipakai

| Tidak ada | Alasan |
|---|---|
| Pustaka navigasi | Materi Bab 6. Perpindahan layar di sini memakai `keranjangTerbuka ? … : …` |
| `fetch` / REST API | Materi Bab 10. Datanya `data/menu.js` |
| `AsyncStorage` | Materi Bab 12. Keranjang hilang saat aplikasi ditutup — itu memang disengaja |
| `SectionList` | Tidak diperkenalkan di Bab 5 |
| `Modal` | Tidak diperkenalkan di Bab 5; panel keranjang dirender biasa, bukan ditumpuk |
| `Alert.alert` | Tidak melakukan apa pun di `react-native-web`, jadi keadaan sukses harus benar-benar dirender |
| `toLocaleString('id-ID')` | Dukungan `Intl` di Hermes berbeda antar versi/platform; lihat `utils/rupiah.js` |

## Verifikasi

`npm run capture:demo-pesan` menjalankan Expo Web lalu Playwright Chromium di tiga ukuran
layar (390, 834, 1280 piksel). Skrip itu **gagal** kalau:

- jumlah kartu bukan 12;
- bilah bawah tidak menulis "3 item" setelah dua geprek dan satu es teh ditambahkan;
- total yang tertulis di layar pesanan bukan `Rp44.000` (subtotal Rp36.000 + ongkir Rp8.000);
- bilah keranjang masih muncul setelah pesanan selesai;
- ada galat di console peramban.

Hasil tangkapan layar: `docs/tangkapan-layar/{ponsel,tablet,lebar}/{1-katalog,2-keranjang,3-pesanan}.png`.

Yang tidak bisa diperiksa lewat web: `Platform.select` di `KartuMenu.js` memilih cabang
`default` saat berjalan di peramban, jadi bayangan versi iOS dan `elevation` versi Android
hanya terbaca lewat kode — bukan lewat tangkapan layar.

## Catatan foto

Foto di `assets/produk/` dibuat dengan model gambar (bukan foto asli), lalu diperkecil ke
512×512 dan dikompresi agar seluruhnya ~620 KB. Foto hanya alat peraga; tidak ada yang
bergantung pada isi gambarnya.
