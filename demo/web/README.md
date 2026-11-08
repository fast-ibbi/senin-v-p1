# Demo Web — Pemrograman Mobile

Situs demo interaktif kuliah **Pemrograman Mobile** (React Native + Expo): aplikasi React
(SPA) yang menjelaskan isi `slides/` bab per bab, lengkap dengan snippet kode verbatim dan
perbandingan **sebelum/sesudah** (cara lama yang salah/naif vs cara yang benar).

URL produksi (GitHub Pages): `/<base>/demo/` — mis.
`https://fast-ibbi.github.io/senin-v-p1/demo/`.

## Status

Lihat tabel status terkini di halaman muka situs (`#/`). **Seluruh 15 bab sudah lengkap**
(81 berkas konten: ikhtisar, bagian, dan praktikum per bab). Status di `src/data/bab.js`
**tidak diedit tangan** — semuanya diturunkan dari isi `konten/` oleh
`npm run update:demo-manifest`.

Bab dianggap `lengkap` hanya bila punya `index.html` **dan** `praktikum.html`; bab yang
masih setengah jadi tetap bisa dibuka halamannya, tetapi ditandai “ditunda” di halaman muka.

## Alur kerja wajib setiap menambah/mengubah konten

```bash
npm run update:demo-manifest   # 1. turunkan berkas & status dari disk ke bab.js
npm run verify:demo-konten     # 2. periksa struktur + kontrak bahasa
npm run build                  # 3. build produksi (gagal bila konten cacat)
```

Tanpa langkah 1, halaman baru tidak akan muncul walau berkasnya sudah benar — manifest
adalah satu-satunya sumber daftar halaman.

## Struktur

```
demo/web/
  index.html                 entri Vite
  vite.config.js             base './', outDir ../../dist/demo
  src/
    App.jsx                  rute (HashRouter): /, /bab/:slug, /bab/:slug/:berkas
    tema.css                 token tema academic (slides/theme/academic.css)
    penyorot.js              highlight.js (jsx, js, json, bash, css, xml)
    data/
      bab.js                 manifest 15 bab (judul, pertemuan, daftar berkas, status)
      konten.js              import.meta.glob malas konten/**/*.html (?raw)
    komponen/
      Kerangka.jsx           kepala, bilah sisi, langkah sebelum/sesudah, kaki
      SisiSubbab.jsx         bilah sisi kanan: daftar subbab + scrollspy
      NodeKonten.jsx         perender rekursif DOMParser → React
      Banding.jsx            toggle perbandingan sebelum/sesudah
      KendaliLebar.jsx       penggeser lebar bingkai ponsel
    halaman/
      Muka.jsx               daftar 15 bab
      HalamanKonten.jsx      memuat & merender berkas konten satu bab
    gaya/                    CSS warisan demo bab-05 lama (tiruan RN, layout, praktikum)
  konten/
    bab-04-dasar-react/      ikhtisar + bagian-1..3 + praktikum (HTML fragmen)
    bab-05-dasar-react-native/  ikhtisar + bagian-1..5 + praktikum (dimigrasi)
```

Tiap bab punya **folder sendiri sesuai judul bab** di `konten/`. Situs lama
`demo/web/bab-05/` masih ada sebagai sumber arsip; isinya sudah dimigrasi ke
`konten/bab-05-dasar-react-native/` (script sekali-pakai: `scripts/migrate-demo-bab05.mjs`).

## Konvensi berkas konten

Berkas konten adalah **fragmen HTML** (tanpa `<!DOCTYPE>`/`<head>`; judul `<h1>` ditulis
langsung di berkas). Kerangka SPA menyediakan kepala, navigasi, bilah sisi, dan kaki.
Primitif yang dikenali:

- `<section class="subbab" id="…">` — kartu subbab; `<p class="label-subbab">` untuk label
  sumber (`· deck: “…” · buku §…`). Semua kartu subbab otomatis masuk **bilah sisi
  kanan** (daftar isi halaman + scrollspy); bagian tanpa `id` diberi id urut otomatis.
  Bilah kanan hanya tampil di layar ≥ 1280 px dan hilang bila halaman tidak punya subbab.
- `<figure class="kode">` — blok kode; `<figcaption class="kode-kepala">` berisi
  `<span class="kode-berkas">` (nama berkas) dan `<span class="kode-sumber">` (sumber).
  `<code class="language-jsx|js|json|bash|css">` disorot otomatis.
- `<div class="banding" data-label-lama="…" data-label-benar="…" data-petunjuk="…">` —
  perbandingan sebelum/sesudah; dua anak pertama menjadi panel lama/benar. Tombol
  “Cara benar / Cara lama / Keduanya” dirender komponen `Banding`.
- `<div class="kotak kotak-salah|kotak-tanya|kotak-tiruan|kotak-jawab">` — kotak salah
  paham, pertanyaan penuntun, catatan, dan kunci (pakai `<details>`).
- `<div class="bingkai">…<div class="bingkai-layar">…` — bingkai ponsel; lebar diatur
  variabel CSS `--lebar-bingkai` oleh penggeser `KendaliLebar` (muncul otomatis bila
  halaman memuat bingkai).
- Tautan: `href="#id"` (anchor dalam halaman), `href="berkas.html#id"` (halaman lain di
  bab yang sama — diubah jadi navigasi router), tautan luar dibuka di tab baru.

Aturan isi mengikuti kontrak repo: bahasa Indonesia formal (`kamu`/`kita`), tanpa slang,
kode disalin verbatim dari deck, `buku/`, atau `praktikum/`, dengan label sumbernya.

## Menambah bab baru

1. Buat folder `demo/web/konten/<slug-bab>/` dengan `index.html` (ikhtisar) plus
   `bagian-N.html` dan `praktikum.html` sesuai konvensi di atas.
2. Di `src/data/bab.js`, isi `berkas` bab itu (urutan menentukan navigasi + langkah
   sebelum/sesudah) dan ubah `status` menjadi `'lengkap'`.
3. Jalankan `npm run dev` (dari folder ini) untuk meninjau; `npm run build` untuk
   produksi.

Berkas konten ter-code-split otomatis oleh `import.meta.glob` — tiap berkas jadi chunk
sendiri, halaman muka tidak ikut memuat seluruh konten.

## Skrip

Dari folder ini:

- `npm run dev` — server pengembangan Vite
- `npm run build` — build produksi ke `dist/demo/`
- `npm run preview` — pratinjau hasil build

Dari repo root:

- `npm run update:demo-manifest` — sinkronkan `src/data/bab.js` dengan isi `konten/`
  (judul dari `<h1>`, `index.html` → “Ikhtisar”, urut berkas alami, status dari kelengkapan)
- `npm run verify:demo-konten` — periksa struktur semua berkas konten tanpa browser:
  tag seimbang, id subbab unik, `banding` punya dua panel kode, `figure.kode` punya
  `pre>code`, dan pindai kasar kontrak bahasa (slang/partikel/“Anda”)
- `npm run build` — rantai penuh: marp (deck) → build demo web → `build-pages.mjs`
- `npm run serve:demo` — dev server demo web
- `npm run build:demo` — hanya build demo web

## Catatan teknis

- **HashRouter** dipakai supaya situs bekerja di GitHub Pages tanpa rewrite server; base
  `'./'` membuat asset relatif terhadap lokasi hosting.
- Berkas konten dirender lewat perender rekursif dari `DOMParser` — konten ditulis sendiri
  oleh repo ini (bukan masukan pengguna), jadi aman dirender apa adanya.
- Token warna/font disalin dari `slides/theme/academic.css`: aksen `#1d4ed8`, font sistem,
  tanpa unduhan — situs tetap utuh dibuka tanpa internet.
- Panel “React Native” di halaman bab 5 adalah **tiruan HTML/CSS**, bukan React Native
  sungguhan (sesuai dokumen situs lama); React web dirender jujur oleh peramban.
