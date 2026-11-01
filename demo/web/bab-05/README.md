# Demo Web — Bab 5: Dasar React Native

Halaman statis untuk mengajar `slides/bab-05-dasar-react-native.md`. Tiap subbab disajikan
sebagai satu kartu berurutan: **penjelasan → kode → hasil yang diharapkan → salah paham dan
pertanyaan penuntun**. Kode disalin verbatim dari deck, buku, atau praktikum, dan hasilnya
ditampilkan di dalam bingkai ponsel yang lebarnya bisa digeser.

Bedanya dengan [`demo/bab-05`](../../bab-05/README.md): yang itu aplikasi Expo yang dijalankan
dengan `npx expo start`; yang ini halaman HTML yang bisa dibuka tanpa memasang apa pun.

> **Status: 7 dari 7 halaman.** `index.html`, `bagian-1`–`bagian-5`, dan `praktikum.html`.
> Seluruhnya lulus `npm run verify:demo-web` (0 galat) dan `npm run capture:demo-web`
> (105 asersi: 96 lulus, 0 gagal, 9 dilewati karena halaman itu tidak punya bingkai atau kode).

---

## Cara membuka

**Langsung, tanpa server dan tanpa internet:**

```bash
open index.html             # macOS
xdg-open index.html         # Linux
```

Halaman ini sengaja dibuat agar berfungsi lewat `file://`: tidak ada `fetch`, tidak ada modul ES,
tidak ada font atau skrip dari CDN. Prism disalin ke `aset/prism/`, dan seluruh tautan relatif.
Diuji sungguhan — `scripts/screenshot-demo-web.mjs` membuka tiap halaman lewat `file://` dan
memastikan tidak ada galat di konsol.

**Lewat server lokal** (kalau ingin mirip keadaan setelah dipublikasikan):

```bash
npm run serve:demo          # http://localhost:8137/index.html
```

**Setelah build**, seluruh halaman ikut tersalin ke `dist/bab-05-demo/` oleh
`scripts/build-pages.mjs` dan terbit di
`https://fast-ibbi.github.io/senin-v-p1/bab-05-demo/`.

---

## Peta isi

| Halaman | Isi | Kartu | Blok kode | Keluaran |
|---|---|---|---|---|
| `index.html` | peta bab, cara membaca, versi | 6 | — | — |
| `bagian-1.html` | React untuk web vs native, padanan elemen, tempat render, kode yang dipakai ulang | 5 | 4 | 3 bingkai + 1 bagan |
| `bagian-2.html` | `View`, `Text`, `Image`, `TextInput`, tombol, daftar, area aman, props | 5 | 7 | 8 bingkai |
| `bagian-3.html` | `StyleSheet`, konstanta gaya, array style, gaya kondisional | 5 | 8 | 6 bingkai |
| `bagian-4.html` | Flexbox, perataan, pembagian ruang, `useWindowDimensions`, breakpoint 600 | 6 | 5 | 4 bingkai + 1 bagan |
| `bagian-5.html` | `ScrollView`, `FlatList`, memilih scroller, Android/iOS, `Platform.OS`, keyboard | 7 | 5 | 9 bingkai + 1 bagan |
| `praktikum.html` | soal 1–10 + praktikum integrasi, kunci terlipat, rubrik | 13 | 30 | 10 bingkai |

Jumlah kartu mengikuti subbab deck (1.1–1.4, 2.1–2.10, 3.1–3.4, 4.1–4.10, 5.1–5.5); beberapa
subbab digabung menjadi satu kartu bila deck membahasnya pada satu slide.

Setiap `data-tanpa-kode` dan `data-tanpa-output` pada halaman menyebut alasannya, dan gerbang
menolak alasan yang kosong atau kurang dari 20 karakter. Halaman `praktikum.html` menaruh kunci
jawaban di dalam `<details>` berlabel “Kunci jawaban — buka hanya saat pembahasan”.

---

## Dua kolom: satu tiruan, satu asli

Di halaman bagian, kolom kiri dan kanan tidak setara — dan itu memang tujuannya:

| Kolom | Apa yang dirender | Bisa dipercaya untuk |
|---|---|---|
| React Web | Browser sungguhan memakai aturan CSS yang ditampilkan | Perilaku sebenarnya, termasuk hal yang tidak diharapkan (mis. `display: flex` menjadi baris) |
| React Native | HTML + CSS yang meniru hasil akhir React Native | Perbandingan visual; **bukan** bukti perilaku native |

Lima aturan Yoga yang ditiru, karena kelimanya mudah dibuktikan dan paling sering menjebak
pemula:

1. `flexDirection` bawaan `column` (CSS: `row`)
2. `alignItems` bawaan `stretch`
3. `flexShrink` bawaan `0` (CSS: `1`)
4. `box-sizing: border-box` pada semua komponen
5. Tidak ada margin collapse

Nilai gaya (warna, jarak, radius) tidak ditulis di `aset/tiruan.css`, melainkan inline pada markup
tiruan — persis seperti objek `StyleSheet` pada kode yang ditampilkan. Mengubah satu angka di kode
berarti mengubah satu angka di tiruan. Tiga invarian ini diperiksa mesin, bukan dipercaya:
teks tiruan tanpa `style` harus 14 px, gambar tidak boleh runtuh 0×0 tanpa penanda, dan tidak boleh
ada teks yang ditaruh langsung di dalam `View`/`Pressable`.

Karena bingkai bisa selebar 390 px di layar 1600 px, `.bingkai-layar` dipasang sebagai
**container** (`container-type: inline-size; container-name: layar`). Aturan responsif di dalam
bingkai memakai `@container layar (min-width: 600px)`, bukan media query — media query membaca
lebar jendela, bukan lebar bingkai. Bagian 4 memakai ini untuk memperagakan breakpoint 600:
`.rn-600` wajib `column` pada bingkai 390 px dan `row` pada 700 px, dan itu diuji setiap kali
`npm run capture:demo-web` dijalankan.

---

## Batas yang disengaja

| Hal | Keputusan | Alasan |
|---|---|---|
| Interaksi | Semua contoh statis; hanya penggeser lebar yang hidup | Keadaan lain ditampilkan sebagai bingkai terpisah, jadi bisa dibandingkan tanpa mengklik |
| Tombol salin kode | Tidak ada | Ikut keputusan “semua statis”; kode dipilih dari berkas sumber, bukan diketik |
| `FlatList` 300 item | Tiruan menggambar sebagian baris dan menyebutkan jumlahnya | Virtualisasi tidak bisa ditiru dengan CSS; angka asli ditampilkan sebagai keterangan |
| Kode yang sengaja salah (red screen) | Tidak ditiru | Tetap milik praktikum; halaman hanya menampilkan hasil dari kode yang benar |
| Data mahasiswa | Dari `praktikum/`, bukan data produk | Supaya sama dengan buku dan lembar kerja; `demo/bab-05` tetap memakai data produk |
| Perbedaan Android dan iOS | Diperlihatkan sebagai dua bingkai berlabel | Satu halaman tidak bisa menjalankan dua sistem operasi |
| Kunci praktikum | Terlipat di `<details>` | Supaya tidak terbuka saat kelas dimulai; ada peringatan di awal halaman |

---

## Hasil pengukuran

Angka di bawah keluar dari Chromium sungguhan lewat `npm run capture:demo-web`, bukan diketik
dengan tangan. Skrip yang sama menyimpan tangkapan layar ke `docs/tangkapan-layar/`
(`ponsel-potret` 390×844, `ponsel-lanskap` 844×390, `tablet` 834×1112).

**Ringkasan per halaman**

| Halaman | Asersi | Lulus | Gagal | Dilewati |
|---|---|---|---|---|
| bagian-1 | 15 | 15 | 0 | 0 |
| bagian-2 | 15 | 14 | 0 | 1 |
| bagian-3 | 15 | 14 | 0 | 1 |
| bagian-4 | 18 | 17 | 0 | 1 |
| bagian-5 | 15 | 14 | 0 | 1 |
| index | 12 | 8 | 0 | 4 |
| praktikum | 15 | 14 | 0 | 1 |
| **total** | **105** | **96** | **0** | **9** |

**Asersi kunci** (nilai sesungguhnya, dikutip dari keluaran skrip)

| Yang diuji | Hasil |
|---|---|
| Blok kode = `figure.kode` di tiap halaman | `4 · 7 · 8 · 5 · 5 · 0 · 30` |
| Layar bingkai pertama 390 px (bawaan penggeser) | `390` di semua halaman berbingkai |
| `.rn-600` pada bingkai 390 px → 700 px (Bagian 4) | `column` → `row` |
| Teks tiruan tanpa `style` berukuran 14 px | `0` salah ukuran |
| Gambar runtuh 0×0 tanpa penanda | `0` |
| Teks ditaruh langsung di dalam `View`/`Pressable` | `0` |
| Gulir mendatar pada 390 / 844 / 834 / 1280 px | `0` di semua halaman |
| Galat di konsol | `0` di semua halaman |

Sembilan asersi yang dilewati bukan kegagalan: halaman tanpa bingkai ponsel tidak punya ukuran
layar untuk diuji, dan halaman tanpa blok kode tidak punya sintaks untuk disorot.

---

## Menambah halaman berikutnya

Gerbangnya ada di `scripts/verify-demo-web.mjs` (`npm run verify:demo-web`). Yang perlu diikuti:

1. **Blok kode** selalu berbentuk

   ```html
   <figure class="kode">
     <figcaption class="kode-kepala">
       <span class="kode-berkas">NamaBerkas.js</span>
       <span class="kode-sumber">buku · §5.2</span>
     </figcaption>
     <pre><code class="language-jsx">…verbatim…</code></pre>
   </figure>
   ```

   Awalan `.kode-sumber` harus salah satu dari `deck` / `buku` / `soal` / `kunci`, dan isi bloknya
   harus sama persis (setelah spasi dinormalkan) dengan salah satu **blok kode** di berkas itu —
   cocok dengan prosa saja tidak cukup.

2. **Blok kode yang ditulis khusus halaman** wajib didaftarkan di `PENGECUALIAN` beserta alasannya.
   Daftar itu kosong sekarang, dan sebaiknya tetap begitu.

3. **Setiap `<section class="subbab">`** harus punya blok kode atau `data-tanpa-kode="alasan"`,
   dan `.keluaran`/`.bagan` atau `data-tanpa-output="alasan"`.

4. **Semua tautan dan aset relatif harus ada**, termasuk setiap `#anchor` yang ditautkan.

5. Halaman baru otomatis diperiksa (skrip memindai `*.html`), tetapi tambahkan juga ke objek
   `HALAMAN` supaya berkas yang terhapus terdeteksi. Skrip bisa difilter:
   `node scripts/verify-demo-web.mjs bagian-3`.

6. Gaya yang hanya dipakai satu halaman tinggal di `aset/<halaman>.css` (mis. `bagian-4.css`),
   ditautkan setelah `halaman.css`. Berkas bersama jangan disunting untuk kepentingan satu halaman.

Sesudah menulis: `npm run verify:demo-web && npm run capture:demo-web`, lalu tempel ulang tabel
hasil pengukuran ke README ini.

---

## Struktur

```text
demo/web/bab-05/
├── index.html                 # peta bab, cara membaca, versi
├── bagian-1.html              # React untuk web dan native
├── bagian-2.html              # komponen inti
├── bagian-3.html              # StyleSheet dan gaya kondisional
├── bagian-4.html              # Flexbox dan layout responsif
├── bagian-5.html              # scroller dan perbedaan platform
├── praktikum.html             # 10 soal + integrasi katalog, kunci terlipat
├── aset/
│   ├── akademik.css           # token dari slides/theme/academic.css + tipografi halaman
│   ├── halaman.css            # kendali lebar, kartu subbab, blok kode, bingkai ponsel
│   ├── tiruan.css             # tiruan React Native (lima aturan Yoga)
│   ├── halaman.js             # penggeser lebar + preset; tanpa fetch, tanpa modul
│   ├── index.css              # gaya khusus halaman peta
│   ├── bagian-2.css           # gaya khusus halaman bagian (pola yang sama untuk 4, 5, praktikum)
│   ├── bagian-4.css           # berisi @container layar untuk breakpoint 600
│   ├── bagian-5.css
│   ├── praktikum.css
│   ├── contoh-foto.svg        # gambar contoh untuk kolom web
│   └── prism/                 # Prism 1.30.0 (MIT), disalin lokal supaya jalan offline
├── docs/tangkapan-layar/      # hasil npm run capture:demo-web (tidak ikut dipublikasikan)
└── README.md
```

---

## Berkas terkait

- `slides/bab-05-dasar-react-native.md` — deck yang dilayani halaman ini
- `buku/bab-05-dasar-react-native.md` — materi cetak; sumber penjelasan mendalam
- `praktikum/bab-05-soal-praktikum.md` dan `praktikum/bab-05-kunci-jawaban.md` — soal dan kunci
- `demo/bab-05/` — aplikasi Expo untuk demo kelas (tetap dipakai; tidak digantikan halaman ini)
- `slides/theme/academic.css` — tema deck; sumber token warna dan tipografi halaman
