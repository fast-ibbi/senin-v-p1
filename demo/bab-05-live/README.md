# Demo Live — Bab 5: Dasar React Native

Project **`kantin-kampus`**: aplikasi yang ditulis dari nol di depan kelas mengikuti
[`LIST-TUTORIAL-DEMO.md`](LIST-TUTORIAL-DEMO.md). Naskah delapan demo tetap di berkas itu — berkas
ini hanya menjelaskan isi folder dan cara menjalankannya.

Isi folder:

| Berkas / folder | Isi |
|---|---|
| [`kantin-kampus/`](kantin-kampus/) | Project Expo, state akhir (Demo 6): satu halaman katalog responsif |
| [`langkah/`](langkah/) | Snapshot berkas tiap demo, untuk dibaca atau disalin saat mengajar |
| [`NASKAH-DEMO-LIVE.md`](NASKAH-DEMO-LIVE.md) | Butir yang diucapkan, pertanyaan kelas, jebakan — per demo |
| [`CHECKLIST-TERAMATI.md`](CHECKLIST-TERAMATI.md) | Lima butir "Yang Harus Teramati" untuk dicentang di kelas |

Versi sama dengan slide penutup: **Expo SDK 57 · React Native 0.86.3 · React 19.2.3 · Node.js ≥ 22**.

---

## Cara menjalankan

```bash
cd demo/bab-05-live/kantin-kampus
npm install
npx expo start
```

Lalu tekan `i` (simulator iOS), `a` (emulator Android), atau `w` (browser). Untuk mengajar, target
yang dipakai tetap satu — ponsel potret — supaya Demo 4 punya perubahan susunan.

Periksa build web tanpa membuka simulator:

```bash
npm run export:demo-live     # dari akar repo → demo/bab-05-live/kantin-kampus/dist
npm run serve:demo-live      # http://localhost:8138
```

---

## Peta demo ke berkas

| Demo | Menit | Berkas yang ditulis di kelas | Snapshot |
|---|---|---|---|
| 0 | 5 | `App.js` | `langkah/demo-0/App.js` |
| 1 | 6 | `App.js` | `langkah/demo-1/App.js` |
| 2 | 9 | `data/menu.js`, `components/KartuMenu.js`, `App.js` | `langkah/demo-2/` |
| 3 | 7 | `theme/warna.js`, `components/KartuMenu.js` | `langkah/demo-3/` |
| 4 | 9 | `screens/BerandaScreen.js`, `App.js` | `langkah/demo-4/` |
| 5 | 7 | `data/menu.js` (+`menuPanjang`), `screens/DaftarScreen.js`, `App.js` | `langkah/demo-5/` |
| 6 | 6 | `screens/KatalogScreen.js`, `App.js` | `langkah/demo-6/` |
| 7 | 10 | — (kuis dan centang, tidak ada kode baru) | — |

Folder `langkah/` hanya memuat berkas yang **berubah** pada demo itu, sama seperti baris **Berkas**
di naskah. Berkas yang tidak berubah tidak diulang. Penjelasan tiap folder ada di
[`langkah/README.md`](langkah/README.md).

---

## Struktur project

```text
demo/bab-05-live/kantin-kampus/
├── App.js                    # Demo 6: SafeAreaView + KatalogScreen
├── index.js                  # registerRootComponent (bawaan template)
├── theme/warna.js            # Demo 3: warna, jarak, radius, huruf, breakpoint
├── data/menu.js              # Demo 2: 8 menu · Demo 5: menuPanjang 200 item
├── components/
│   └── KartuMenu.js          # Demo 2 struktur → Demo 3 status + StyleSheet
├── screens/
│   ├── BerandaScreen.js      # Demo 4: dua panel column → row
│   ├── DaftarScreen.js       # Demo 5: ScrollView ↔ FlatList + hitungan item
│   └── KatalogScreen.js      # Demo 6: pencarian, grid 2/3 kolom, keadaan kosong
└── assets/                   # ikon bawaan template Expo; dipakai KartuMenu
```

`App.js` memuat `KatalogScreen`, sesuai keadaan akhir bab. `BerandaScreen` dan `DaftarScreen`
disimpan karena keduanya artefak Demo 4 dan 5 — untuk menampilkannya, tukar satu import:

```jsx
import BerandaScreen from './screens/BerandaScreen';  // Demo 4
import DaftarScreen from './screens/DaftarScreen';    // Demo 5
import KatalogScreen from './screens/KatalogScreen';  // Demo 6 — dipakai sekarang
```

lalu ganti `<KatalogScreen />` di dalam `SafeAreaView` dengan layar yang dipilih.

---

## Yang sudah diverifikasi

Di mesin penulisan berkas ini:

- `npm install` bersih (492 paket) di `kantin-kampus/`.
- `npx expo export --platform web` berhasil: 225 modul, satu bundel 423 KB, `dist/` terbentuk.
- Halaman hasil ekspor dibuka di browser 412 px dan 900 px lebar:
  - grid **2 kolom** di 412 px dan **3 kolom** di 900 px, tanpa memuat ulang halaman;
  - pencarian `kopi` menyisakan satu kartu; pencarian `zzz` menampilkan `ListEmptyComponent`;
  - badge `tersedia` / `tipis` / `habis` muncul sesuai `stok` (0 → `habis`, ≤ 3 → `tipis`);
  - tidak ada pesan galat atau peringatan di console.

Belum diverifikasi di sesi ini: menjalankan target **native** (iOS/Android) dan mengukur performa
gulir `FlatList` di perangkat. Keduanya perlu dicoba sekali sebelum masuk kelas — lihat daftar
periksa di naskah.

Tiga snapshot juga dijalankan dengan menukar `App.js` sementara, lalu dipulihkan:

- **Demo 2** — dua kartu berbeda isi dari satu komponen, gambar 56 × 56, baris `Nilai terbaca`
  mengikuti ketikan.
- **Demo 4** — panel bertumpuk di 412 px, berdampingan di 900 px, penghitung render bergerak
  `ke-1` → `ke-2` saat lebar berubah.
- **Demo 5** — console mencetak `[scroll] item dirender: 200`, lalu `[flat] item dirender: 30`
  setelah tombol mode ditekan. Angka `flat` bergantung ukuran jendela: 30 di jendela web
  900 × 760, sekitar 10 di layar ponsel seperti tertulis di naskah.

---

## Catatan yang perlu diketahui

- **Gambar contoh memakai `assets/icon.png` bawaan template Expo**, bukan foto menu sungguhan.
  Itu disengaja oleh naskah: tidak ada demo yang gagal karena unduhan.
- **Kartu dirancang untuk daftar selebar layar.** Di sel grid dua kolom pada ponsel sempit, judul
  `huruf.judul` (20 px) membungkus ke baris kedua. Tutorial membiarkannya apa adanya — bukan bug
  yang perlu dikejar di kelas.
- **`SafeAreaView` dari `react-native` berstatus `@deprecated` di RN 0.86** (penggantinya
  `react-native-safe-area-context`), tetapi masih berjalan dan tidak memunculkan peringatan saat
  dipakai. Slide masih mengajarkan komponen ini; sebutkan statusnya hanya kalau ada yang bertanya.
- **Data demo bertema kantin kampus**, sedangkan buku dan praktikum bertema mahasiswa. Struktur
  komponennya sama; yang berganti hanya isi `data/`.
