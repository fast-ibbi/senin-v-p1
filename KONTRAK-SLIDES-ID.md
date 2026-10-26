# Kontrak Penerjemahan Slides ke Bahasa Indonesia

Kontrak ini mengikat penulisan ulang 15 deck di `slides/` ke bahasa Indonesia. Polanya
mengikuti `kamis-iii-p1/REVISI-CASUAL.md`, tetapi dengan keputusan yang berbeda: **tanpa
slang**, dan bukan sekadar terjemahan melainkan restrukturisasi.

Disepakati sebelum berkas disentuh, supaya bab 2–15 memakai aturan yang sama.

## 1. Ruang lingkup

| Sasaran | Nada | Istilah | Struktur |
|---|---|---|---|
| `slides/bab-01…15.md` | ya | ya | ya |
| `slides/diagrams/**/*.mjs` | tidak | tidak | hanya field `slide:` |
| `slides/assets/diagrams/*.svg` | tidak | tidak | tidak disentuh |
| `buku/*.md` | tidak | tidak | tidak disentuh |
| `readme.md` | tidak | tidak | tidak disentuh |

Yang diterjemahkan di setiap deck:

1. isi slide (judul, butir, tabel, kutipan, callout);
2. **catatan penyaji** (`<!-- … -->`) — ditulis ulang sebagai naskah ucap, bukan diterjemahkan kata per kata;
3. frontmatter (kecuali kunci dan `size`).

Yang **tidak** disentuh: blok kode dan identifier di dalamnya, baris `![]()` gambar,
berkas SVG, `alt` di berkas spec.

## 2. Nada

| Aspek | Keputusan |
|---|---|
| Sapaan | `kamu` untuk instruksi, `kita` untuk kerja bersama. **Tidak pernah** `Anda` |
| Kalimat | Lengkap, bertanda baca benar, satu ide per baris |
| Slang | **Dilarang**: `nggak` `enggak` `gak` `udah` `gimana` `kayak` `banget` `pas` |
| Partikel | **Dilarang**: `sih` `deh` `nih` `dong` `kok` |
| Singkatan chat | **Dilarang**: `yg` `gak` `tp` `dgn` `krn` |
| Boleh | `tidak`, `sudah`, `bagaimana`, `seperti`, `sangat`, `saat`, `untuk`, `jika` |

Contoh benar:

> Kalau data akademik sudah ada di website kampus, kenapa kampus masih butuh aplikasi mobile?

Kalau ragu antara "lebih casual" dan "lebih jelas", pilih **lebih jelas**.

## 3. Kamus istilah

### 3.1 Diadopsi dari `REVISI-CASUAL.md` §1

| Jangan | Pakai |
|---|---|
| peramban | browser |
| pranala / tautan | link |
| berkas | file |
| situs | website |
| ponsel | HP |
| tata letak | layout |
| selektor | selector |
| galat | error |
| peladen | server |
| gawai | gadget |

Tetap Indonesia: `layar` · `halaman` · `tombol` · `pengguna` · `perangkat` · `daftar` ·
`gambar` · `judul` · `navigasi` · `unduh` · `unggah` · `kotak` · `nilai` · `properti` ·
`warna` · `jarak` · `huruf`

### 3.2 Istilah baru mata kuliah ini

Selalu bahasa Inggris: `state` · `props` · `hook` · `component` · `JSX` · `render` ·
`token` · `endpoint` · `API` · `build` · `deploy` · `testing` · `push` · `commit` ·
`dependency` · `cache` · `middleware` · `bundle` · `array` · `JSON` · `Expo` ·
`React Native` · `npm` · `Metro` · `trade-off` · `offline-first` · `hot reload`

Selalu Indonesia: `formulir` · `validasi` · `penyimpanan` · `fungsi` · `objek` ·
`variabel` · `perulangan` · `percabangan` · `pengujian` (bila bukan `testing` sebagai
istilah) · `kesalahan` (bila bukan `error` teknis)

Aturan glos: **tidak ada padanan ganda berulang**. Sebut sekali di bab yang
memperkenalkan, sesudahnya pakai satu bentuk saja. `peramban (browser)` di setiap slide
dilarang.

### 3.3 Nama kasus

| Nama | Peran |
|---|---|
| **Aplikasi Manajemen Data Mahasiswa** (slug `siakad-mobile`) | **spine**: aplikasi yang dibangun mahasiswa, Bab 1–15 |
| e-Kampus | kasus insiden kebocoran data (Bab 13) |
| SIAKAD | sistem kampus nyata sebagai pembanding |
| SehatIn | contoh aplikasi lain (diagram 08 Bab 7) |
| Primadona | studi kasus koperasi |

## 4. Kerangka baku

Setiap bab memakai urutan ini; variasi lama dilipat ke slot terdekat.

```
 1  Pembuka — hook + judul bab (lead)
 2  Tujuan Pembelajaran — butir sesuai RPS di readme.md, verba Bloom
 3  Bagian 1 — judul bagian (lead)
 4  … isi …                 judul berupa klaim/pertanyaan
 5  Studi Kasus (spine: Aplikasi Manajemen Data Mahasiswa)
 6  Bagian 2 — judul bagian (lead)
 7  … isi …
 8  Praktikum: yang dibangun
 9  Yang Harus Teramati
10  Kuis Kilat
11  Kunci Kuis Kilat
12  Ringkasan
13  Referensi
14  Siap ke Bab N+1
```

`Tujuan Pembelajaran` memakai `Setelah bab ini, kamu bisa:` + verba Bloom. Bagian formal
kurikulum (Sub-CPMK) tidak diubah.

Rentang jumlah slide: **34–42** per bab.

## 5. Judul dan rujukan

- Judul slide isi harus **klaim atau pertanyaan**, bukan frasa nomina kosong.
  - Salah: `Karakteristik Aplikasi Mobile`
  - Benar: `Tujuh Hal yang Membuat Aplikasi Mobile Berbeda (1–4)`
- Tidak ada judul berbahasa Inggris.
- `Chapter 9` → `Bab 9` · `Meeting 1` → `Pertemuan 1` · `Part 1` → `Bagian 1` ·
  `Section 1.1` → `subbab 1.1` · `Table 1.1` → `Tabel 1.1`
- `-nya` serangkai: `filenya`, `browsernya`. Tanda hubung hanya untuk pangkal
  singkatan/angka: `HP-nya`, `CSS-nya`.

## 6. Larangan teknis

- **Jangan pakai `<div class="grid2">`.** Marp tidak mem-parse markdown di dalam blok HTML
  mentah, jadi pembungkus itu tidak pernah membentuk dua kolom — lihat §8.1. Untuk
  perbandingan dua kolom pakai tabel, atau dua blok tebal berurutan.
- Jangan mengubah isi blok kode, termasuk komentar dan string.
- Jangan memindahkan, menghapus, atau menambah baris `![w:1120](assets/diagrams/…)`.
  Diagram beku: berbahasa Inggris, tidak bisa dibangun ulang (kit `slide-diagrams` tidak
  ada lagi di mesin ini).
- Jangan menyentuh berkas SVG.

## 7. Baseline dan pemeriksaan

Baseline = versi Inggris di branch `main` (`git show main:slides/<berkas>`).

Pemeriksaan tingkat **bab**, bukan tingkat slide — restrukturisasi memang memutus
kesamaan slide ke-N.

| # | Pemeriksaan | Harapan |
|---|---|---|
| 1 | Blok kode identik dan masih ada, urutan dipertahankan | 100% |
| 2 | Baris gambar identik, urutan sama | 100% |
| 3 | Total kata bab (tanpa catatan, frontmatter, kode) | ≤ versi Inggris |
| 4 | Jumlah slide | 34–42 |
| 5 | Istilah lama di prosa | 0 |
| 6 | Slang dan partikel | 0 |
| 7 | Kata Inggris tersisa di prosa | 0 |
| 8 | Sapaan `Anda` | 0 |
| 9 | Judul berbahasa Inggris | 0 |
| 10 | Slide tanpa catatan penyaji | 0 |
| 11 | Kunci frontmatter berubah | tidak ada |
| 12 | CRLF / BOM / mojibake | 0 |
| 13 | Isi menabrak footer (`check-slide-overflow.mjs`) | 0 slide ditandai |
| 14 | `<div class="grid2">` | 0 |

```bash
node scripts/verify-slides-id.mjs            # semua bab
node scripts/verify-slides-id.mjs 01 --verbose
```

Skrip hanya membuktikan **bentuk dan bahasa**, bukan tata letak. Untuk tata letak ada alat
kedua:

```bash
# render dulu, lalu pindai pita footer
npx marp slides/bab-05-*.md --images png --allow-local-files -o /tmp/ovf05/s.png
node scripts/check-slide-overflow.mjs /tmp/ovf05
```

`check-slide-overflow.mjs` (macOS, memakai `sips`) memindai baris 670–702 dari 720: bila ada
piksel bukan-latar di luar area teks footer dan nomor halaman, slide itu meluber. Ambang
`MIN_RUN = 40` hasil kalibrasi — ekor teks footer paling panjang ~18px, overflow nyata
≥55px. **Ini yang menangkap 19 slide yang lolos dari pemeriksaan mata** (§8.6). Keluaran
harus `0 ditandai` sebelum bab dianggap selesai.

Yang tidak bisa diperiksa skrip mana pun:

- **kata serapan yang wajar.** Pemeriksaan bocor-EN memakai daftar kata fungsi Inggris
  (`the`, `and`, `you`, …). Kata seperti `mobile`, `web`, `data`, `sensor`, `codebase`
  adalah bahasa Indonesia sehari-hari dan tidak ditandai. Audit terpisah (membandingkan
  kata prosa dengan baseline Inggris) menemukan sisa seperti `Reproducibility` — jenis ini
  harus ditangkap dengan mata, bukan regex;
- **membaca setiap bab** — kesalahan tingkat huruf (kata tertukar/hilang) hanya ketemu
  dengan membaca; ini pelajaran dari `REVISI-CASUAL.md` §11.9;
- **memutuskan isi mana yang boleh pindah ke catatan.** Skrip bisa memastikan tidak ada
  kata yang hilang dari bab, tetapi tidak bisa menilai apakah kalimat itu masih layak
diucapkan penyaji.

## 8. Cacat pra-ada yang ditemukan

### 8.1 `grid2` tidak pernah bekerja (44 tempat di 15 bab)

`<div class="grid2">` didefinisikan di `theme/academic.css` (grid 2 kolom), tetapi Marp
memperlakukan blok HTML mentah sebagai HTML mentah: markdown di dalamnya (termasuk
`**tebal**` dan `-` butir) tidak diparse, sehingga grid tidak pernah terbentuk dan isinya
tumpah sebagai teks biasa.

Bukti: Bab 1 versi Inggris, slide `References`, sudah menabrak footer sebelum diterjemahkan.
Sudah diperbaiki di Bab 1 dengan membuang pembungkusnya. Bab 2–15 masih memakainya dan
harus dibersihkan saat bab itu dikerjakan.

### 8.2 Tabel 6 baris menabrak footer setelah diterjemahkan

Bahasa Indonesia 10–25% lebih panjang, sehingga sel yang tadinya satu baris menjadi dua.
Perbaikannya: `<!-- _class: compact -->` (tabel 18px) **dan** memendekkan isi sel sampai
satu baris. Dilakukan pada Bab 1 slide 5 dan 20.

### 8.3 Diagram berbahasa Inggris

171 SVG memuat label Inggris; kit pembuatnya (`slide-diagrams`) sudah tidak ada di mesin
ini, jadi SVG tidak bisa dibangun ulang. Keputusan: diagram dibiarkan Inggris dan tidak
dipindahkan. Untuk 3 diagram yang menyebut nama kasus lain (Bab 4, 7, 14), teks slide
membingkainya sebagai "aplikasi lain yang melakukan hal yang sama".

### 8.4 `grid2` sudah bersih di 15 bab

Status pembersihan `<div class="grid2">` (44 tempat di 15 bab): **0 sisa**. Penggantinya
tabel atau dua blok tebal berurutan, seperti di Bab 1 slide 6 dan slide Referensi.

### 8.5 RPS dan deck tidak sinkron soal Tujuan Pembelajaran

Di `readme.md`, Pertemuan 4 mencantumkan **4** butir tujuan, sedangkan deck Bab 4
mempunyai **7** (versi Inggris 8). Selisih ini sudah ada sebelum penerjemahan, jadi tidak
diubah: RPS adalah dokumen kurikulum dan perlu keputusan pemilik, bukan editor slide.
Bab 1 sendiri sinkron (5 butir di keduanya).

### 8.6 19 slide meluber ke footer, dan mata manusia tidak menemukannya

Setelah 15 bab dinyatakan `lulus` oleh `verify-slides-id.mjs`, render 592 slide
menunjukkan **19 slide** yang isinya menabrak footer pada 9 bab: Bab 3 (2), 5 (2), 7 (4),
8 (3), 9 (1), 10 (1), 11 (3), 13 (1), 14 (1), 15 (1). Tiga di antaranya sudah ada sejak
batch 1 — termasuk **Bab 3 slide 18, yang diagramnya terpotong tepi bawah** dan tetap
lolos karena saya hanya memeriksa sebagian slide dengan mata.

Penyebabnya seragam: bahasa Indonesia 10–25% lebih panjang, sel tabel yang tadinya satu
baris menjadi dua, lalu blok berikutnya (blockquote, diagram, blok kode) terdorong keluar
bingkai. Urutan perbaikan yang dipakai: `compact` → pendekkan sel/kutipan → pindahkan
blockquote ke catatan dengan label "Dipotong ke catatan (tidak muat di slide):" → pecah
slide menjadi (1/2)(2/2) hanya bila tiga cara pertama gagal.

Pelajaran: **pemeriksaan teks tidak menggantikan pemeriksaan tampilan.** Karena itu
`check-slide-overflow.mjs` sekarang menjadi gerbang kedua, bukan opsional.

## 9. Alur kerja

```
branch slides-id
 1  docs: kontrak + glosarium
 2  chore: skrip verifikasi
 3  style(bab-01) … style(bab-15)
18  docs: laporan verifikasi 15 bab
→ merge ke main (situs GitHub Pages baru berubah di sini)
```

Tiga putaran kerja:

| Putaran | Isi | Cara |
|---|---|---|
| 1 | Bab 1 | dikerjakan sendiri, lalu dibaca pemilik sebagai baseline gaya |
| 2 | Bab 2–4 | workflow 3 tahap per bab: tulis → visual (render) → isi (bandingkan baseline) |
| 3 | Bab 5–15 | workflow yang sama, 11 bab sekaligus (33 agen) |
| 4 | Perbaikan tata letak | workflow 10 agen, satu per bab terdampak, gerbang `check-slide-overflow.mjs` + `verify-slides-id.mjs` |

Setiap tahap digerbangi perintah, bukan penilaian agen: gate gagal = agen gagal, sehingga
tidak ada bab yang dianggap selesai hanya karena agennya merasa selesai.

## 10. Laporan pelaksanaan

```
bab     status  slide  kode   gambar  kata       istilah  slang  bocor-EN  Anda
bab 01  lulus   40     1/1    15/15   1702/1784  0        0      0         0
bab 02  lulus   40     5/5    14/14   1731/1987  0        0      0         0
bab 03  lulus   35     12/12  10/10   1017/1177  0        0      0         0
bab 04  lulus   37     4/4    22/22   887/989    0        0      0         0
bab 05  lulus   42     9/9    20/20   1466/1575  0        0      0         0
bab 06  lulus   38     5/5    13/13   1624/1808  0        0      0         0
bab 07  lulus   41     10/10  8/8     1753/1918  0        0      0         0
bab 08  lulus   42     9/9    10/10   1690/1847  0        0      0         0
bab 09  lulus   41     8/8    10/10   1746/1907  0        0      0         0
bab 10  lulus   39     6/6    11/11   1621/1883  0        0      0         0
bab 11  lulus   41     9/9    12/12   1655/1904  0        0      0         0
bab 12  lulus   39     9/9    8/8     1564/1755  0        0      0         0
bab 13  lulus   40     5/5    15/15   1573/1692  0        0      0         0
bab 14  lulus   40     6/6    7/7     1763/2072  0        0      0         0
bab 15  lulus   38     2/2    13/13   1700/1915  0        0      0         0

total  15 bab · 593 slide · 100% blok kode identik · 100% baris gambar utuh
       grid2 = 0 · slide meluber = 0 · setiap bab ≤ anggaran kata Inggris
```

### 10.1 Bab 1

| Aspek | Hasil |
|---|---|
| Slide | 40 (Inggris 39) — tambah 1: `Yang Harus Teramati`; `Comprehension Check` + `Answers` menjadi `Kuis Kilat` + `Kunci Kuis Kilat` |
| Blok kode | 1/1 identik byte-per-byte |
| Gambar | 15/15, urutan sama |
| Kata | 1706 ≤ 1784 |
| Spine | `Aplikasi Manajemen Data Mahasiswa` diperkenalkan di slide studi kasus keputusan (slide 27) |
| Render | 40/40 diperiksa; 2 tabel overflow diperbaiki (`compact` + sel satu baris), slide Referensi diperbaiki (grid2 dibuang) |

### 10.3 Batch ketiga: Bab 5–15

33 agen (3 tahap × 11 bab). Temuan isi yang diperbaiki agen, contoh yang paling penting:

| Bab | Temuan isi |
|---|---|
| 05 | Tabel 5.1 salah menyebut elemen DOM (`div, span, img` → ada `p`; `View, Text` → ada `Image`), dicocokkan dengan `buku/bab-05` |
| 05 | `Ringkasan` yang memadatkan 10 butir Inggris menjadi 6 kehilangan TextInput-controlled, beda render ScrollView/FlatList, SafeAreaView-iOS, dan `Platform.OS` → dipulihkan jadi 7 butir |
| 06 | Aturan "navigasi bawah hanya untuk bagian utama" hilang padahal catatannya mengklaim ada di slide; rujukan `(6.6)` → `(6.4, 6.6)` |
| 07 | Catatan menunjuk slide yang judulnya sudah tidak ada setelah retitling |
| 08–15 | pemulihan butir yang hilang, perbaikan rujukan bab, penyelarasan istilah dengan `buku/` |

Lalu putaran perbaikan tata letak: **19 slide** di 9 bab (lihat §8.6), semuanya diperbaiki
tanpa mengubah satu pun blok kode atau baris gambar, lalu diverifikasi ulang dengan
`check-slide-overflow.mjs` (593 slide, 0 ditandai).

### 10.4 Yang tidak bisa diklaim

- Kode contoh belum pernah dijalankan terhadap `kode/` (folder `kode/bab-02` dan
  `kode/bab-03` bahkan tidak ada). Verifikasi hanya membuktikan kode **tidak berubah**,
  bukan bahwa kode itu **benar**.
- 171 diagram masih berbahasa Inggris dan tidak bisa dibangun ulang (kit hilang).
- Label `alt`/`aria` di dalam SVG tidak diterjemahkan.

Dikerjakan tiga agen per bab: tulis → periksa visual (render PNG) → baca isi terhadap
baseline Inggris. Setiap tahap digerbangi `verify-slides-id.mjs`.

| Bab | Slide | Temuan isi yang diperbaiki |
|---|---|---|
| 02 | 40 | `create-expo-app` tanpa `--template blank` bertentangan dengan baris tabelnya; "Tujuh Langkah" → "Enam Langkah" (diagram 03 punya enam); satu butir EN hilang → dipulihkan ke catatan |
| 03 | 35 | blockquote Praktikum hilang → dipulihkan; label `reduce`/`sort` hilang; catatan Bagian 2 lenyap; "lebih pendek" → "lebih pendek atau sama panjang"; dua kata rusak; satu perintah yang tidak ada di EN dihapus |
| 04 | 37 | tujuan 5–8 yang digabung satu butir → dipisah lagi (siklus hidup `useEffect` dan evaluasi `useMemo` kembali berdiri sendiri) |

Pemeriksaan manual setelah workflow (tidak ditemukan agen): **overflow tabel** di Bab 2
slide 25 (`Enam Perintah`) dan Bab 4 slide 27 (`Kebiasaan Bab Ini Dipakai`) — keduanya
diperbaiki dengan memendekkan sel. Frase versi teknologi diseragamkan lintas empat bab.

## 11. Yang masih terbuka

1. **`slide:` di 171 spec diagram** sudah diselaraskan untuk 15 bab lewat
   `scripts/sync-diagram-slides.mjs` (0 judul Inggris tersisa).
2. **README 15 subfolder diagram** dibiarkan sebagai catatan sejarah; judul di dalamnya
   merujuk versi Inggris.
3. **`buku/` tidak diselaraskan.** Slides memakai `Aplikasi Manajemen Data Mahasiswa`;
   buku menyebut hal yang sama dengan nama itu juga, tetapi nadanya tetap formal.
4. **`kode/bab-02/` dan `kode/bab-03/` tidak ada**, padahal slide merujuk path di dalamnya
   (Bab 2: 2 rujukan; Bab 3: 4 rujukan). Sudah begitu di `main` — bukan akibat
   penerjemahan, tetapi membuat praktikum tidak bisa diikuti apa adanya.
5. **Skrip penghasil `hasil-rekap.json`** (Bab 3) tidak ada di repo.
6. **RPS vs deck soal Tujuan Pembelajaran** — lihat §8.5; butuh keputusan pemilik.
7. **`Ringkasan` tidak seragam jumlah butirnya** (5–7 antar bab), karena jumlah butir
   mengikuti isi bab, bukan kerangka baku.
8. **Label Inggris di dalam diagram** membuat: slide Indonesia + gambar Inggris. Bila kit
   `slide-diagrams` dibangun ulang, ini pekerjaan terpisah yang layak.
