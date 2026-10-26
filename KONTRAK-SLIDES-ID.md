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
 2  Tujuan Pembelajaran — 5 butir, verba Bloom
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

```bash
node scripts/verify-slides-id.mjs            # semua bab
node scripts/verify-slides-id.mjs 01 --verbose
```

Skrip hanya membuktikan **bentuk**. Yang tidak bisa diperiksa skrip:

- **membaca setiap bab** — kesalahan tingkat huruf (kata tertukar/hilang) hanya ketemu
  dengan membaca; ini pelajaran dari `REVISI-CASUAL.md` §11.9;
- **render** `npx marp <berkas> --images png --allow-local-files` untuk slide padat:
  tabel 6 baris dan slide yang selnya membungkus dua baris adalah yang paling sering
  menabrak footer.

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

## 9. Alur kerja

```
branch slides-id
 1  docs: kontrak + glosarium
 2  chore: skrip verifikasi
 3  style(bab-01) … style(bab-15)
18  docs: laporan verifikasi 15 bab
→ merge ke main (situs GitHub Pages baru berubah di sini)
```

Bab 1 dikerjakan sendiri, lalu dibaca pemilik repo sebagai baseline gaya. Bab 2–15
dikerjakan per batch 3–4 bab dengan workflow multi-agen yang memakai kontrak ini.

## 10. Laporan pelaksanaan — Bab 1

```
bab     status  slide  kode  gambar  kata       istilah  slang  bocor-EN  Anda
bab 01  lulus   40     1/1   15/15   1706/1784  0        0      0         0
```

| Aspek | Hasil |
|---|---|
| Slide | 40 (Inggris 39) — tambah 1: `Yang Harus Teramati`; `Comprehension Check` + `Answers` menjadi `Kuis Kilat` + `Kunci Kuis Kilat` |
| Blok kode | 1/1 identik byte-per-byte |
| Gambar | 15/15, urutan sama dengan aslinya |
| Kata | 1706 ≤ 1784 (−4%) |
| Judul | 5 judul isi diubah jadi klaim (mis. `React Native: Core Concepts` → `Ditulis Sekali, Digambar Native di Dua Platform`) |
| Spine | `Aplikasi Manajemen Data Mahasiswa` diperkenalkan di slide studi kasus keputusan (slide 27), bukan di pembuka |
| Render | 40/40 slide diperiksa PNG; 2 tabel overflow diperbaiki (`compact` + sel satu baris), 1 slide Referensi diperbaiki (grid2 dibuang) |

## 11. Yang masih terbuka

1. **`slide:` di 171 spec diagram** masih menyebut judul Inggris. Rencana: skrip
   `scripts/sync-diagram-slides.mjs` yang memetakan baris `![]()` ke judul terdekat di
   atasnya, lalu menulisnya ke field `slide:`. Belum dikerjakan.
2. **README 15 subfolder diagram** dibiarkan sebagai catatan sejarah; judul di dalamnya
   merujuk versi Inggris.
3. **`buku/` tidak diselaraskan.** Slides memakai `Aplikasi Manajemen Data Mahasiswa`;
   buku menyebut hal yang sama dengan nama itu juga, tetapi nada buku tetap formal.
4. **Bab 2–15 belum disentuh.** Kontrak ini yang dipakai saat mengerjakannya.
