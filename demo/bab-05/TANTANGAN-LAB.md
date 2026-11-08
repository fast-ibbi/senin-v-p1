# Tantangan Lab — Bab 5: Dasar React Native

Enam tantangan yang menempel pada enam layar `demo/bab-05`. Satu tantangan per layar yang
didemokan di kelas, masing-masing satu tingkat di atas soal praktikum yang setara.

Sifatnya **formatif dan tidak dinilai**. Tidak ada poin, tidak ada tenggat pengumpulan. Yang
diharapkan: dikerjakan selama sisa waktu lab, lalu dua di antaranya dibahas 5 menit di awal
pertemuan berikutnya (lihat `NASKAH-DEMO.md`).

Kunci jawaban ada di `KUNCI-TANTANGAN.md` — berkas itu untuk dosen, jangan dibagikan.

Rujukan deck: `slides/bab-05-dasar-react-native.md`.

---

## Kenapa mengubah demo, bukan membuat project baru

Soal praktikum 1–10 sudah meminta mahasiswa membangun dari nol. Tantangan ini meminta hal lain:
**membaca kode orang lain, mengubahnya, lalu mempertanggungjawabkan akibatnya.** Itu keterampilan
yang dipakai terus setelah lulus, dan tidak terlatih oleh soal yang dimulai dari folder kosong.

Konsekuensinya: tantangan dikerjakan pada **salinan** demo, bukan pada demo aslinya. Demo asli
dipakai untuk mengajar dan harus tetap utuh.

---

## Persiapan (sekali saja)

```bash
# 1. salinan repo kuliah, supaya demo asli tetap bersih
git clone <url-repo-kuliah> latihan
cd latihan

# 2. salin demo ke folder kerja sendiri
cp -r demo/bab-05 tantangan-<nim>
cd tantangan-<nim>

# 3. pasang dependensi dan jalankan
npm install
npx expo start
```

`node_modules/` dan `.expo/` di dalam salinan sudah diabaikan `.gitignore` yang ikut tersalin,
jadi folder kerja tidak mengotori repo. Kalau ingin menyimpan hasilnya di git, tambahkan
`demo/tantangan-*/` ke `.gitignore` akar repo.

Target uji minimum untuk semua tantangan: **Expo Web** (`npx expo start` lalu tekan `w`). Kalau
lab-mu punya perangkat atau emulator, jalankan juga di sana — beberapa tantangan menyebut
perbedaan hasil di keduanya.

---

## Enam tantangan

| # | Layar | Yang ditantang | Waktu |
|---|---|---|---|
| T1 | `screens/PadananScreen.js` | Menambah baris padanan yang belum ada di tabel | 15–20 menit |
| T2 | `screens/KomponenScreen.js` | Menyusun satu kartu profil utuh dari komponen kecil | 25–30 menit |
| T3 | `screens/GayaScreen.js` | Membuat kotak "array gaya" berkata jujur | 20–25 menit |
| T4 | `screens/ResponsifScreen.js` | Menambah susunan ketiga pada breakpoint baru | 20–25 menit |
| T5 | `screens/ScrollerScreen.js` | Membuktikan virtualisasi dengan angka | 20–25 menit |
| T6 | `screens/KatalogScreen.js` | Katalog yang ingat pencarian dan mengurutkan | 30–40 menit |

Aturan yang berlaku untuk keenamnya:

1. Jangan menambah dependensi baru. Semua bisa diselesaikan dengan `react-native` saja.
2. Jangan menyunting `components/BingkaiLayar.js` dan `components/KartuCatatan.js` — kerangka itu
   dipakai semua layar.
3. Setiap perubahan diberi satu komentar satu baris berisi **alasannya**, bukan isinya.
4. Kalau sebuah langkah terasa mustahil, kemungkinan besar kamu sedang menyelesaikan masalah yang
   salah. Tulis di catatan: langkah mana, dan kenapa terasa mustahil.

---

## Kalau waktu lab tinggal sedikit

| Sisa waktu | Kerjakan | Alasan |
|---|---|---|
| 40 menit | T4 (20') lalu T3 langkah 1–3 (15') | Keduanya paling sering salah di praktikum |
| 25 menit | T4 saja | Layout adalah bagian yang paling banyak menyita waktu praktikum |
| 15 menit | T3 langkah 1–2, tanpa mengubah kotak kode | Satu kali melihat `false` sudah cukup |
| Di rumah | T1, T2, T5, T6 | Tidak butuh teman diskusi |

---

### T1 — Baris padanan yang belum ada

**Layar:** 1 · `screens/PadananScreen.js` · **Slide:** Bagian 1, Tabel 5.1 · **Waktu:** 15–20 menit

**Konteks.** Layar ini membuktikan tabel padanan di slide: kolom kanan bukan tulisan, melainkan
komponen yang benar-benar dirender. Tabel itu baru memuat lima baris — `div`, `p`, `img`,
`button`, dan `CSS`. Elemen web yang paling sering dipakai mahasiswa justru belum ada di sana.

**Tugas**

1. Buka `screens/PadananScreen.js`. Setiap baris dirender lewat komponen `BarisPadanan` dengan
   tiga props: `kode`, `keterangan`, dan `children` (komponen native yang ditampilkan).
2. Tambahkan dua baris baru setelah baris `button`:
   - `ul` / `li` → daftar tiga butir nama produk.
   - `section` + `h2` → satu judul bagian dengan satu kalimat isi di bawahnya.
3. Isi `keterangan` masing-masing dengan satu kalimat: bagian mana yang setara, dan bagian mana
   yang harus dipecah menjadi lebih dari satu komponen.
4. Buka `theme/warna.js` sebelum menulis gaya apa pun. Warna, jarak, radius, dan ukuran teks sudah
   tersedia sebagai konstanta.

**Lulus kalau**

- [ ] Dua baris baru memakai `BarisPadanan`, bukan `View` buatan sendiri
- [ ] Tidak ada teks yang ditulis langsung di dalam `View`
- [ ] Kelima baris lama tampil sama persis seperti sebelumnya
- [ ] Kedua `keterangan` menyebut satu hal yang tidak bisa dipetakan satu-satu

**Jebakan**

- Menulis `<Text>` di dalam `<Text>` untuk membuat daftar. `Text` bersarang hanya untuk gaya teks,
  bukan pengganti `View`.
- Memakai warna hex langsung (`'#1d4ed8'`) padahal `WARNA.utama` sudah ada. Satu warna yang
  ditulis ulang di tempat kedua adalah awal dari tema yang tidak lagi konsisten.
- Lupa bahwa `keterangan` wajib. Kalau props itu kosong, tidak ada galat — kalimatnya sekadar
  hilang dan barisnya jadi teka-teki.

---

### T2 — Satu kartu profil dari empat komponen

**Layar:** 2 · `screens/KomponenScreen.js` · **Slide:** Bagian 2, subbab 2.1–2.6 · **Waktu:** 25–30 menit

**Konteks.** Layar ini memperlihatkan enam komponen **satu per satu**, masing-masing di kartu
sendiri. Yang belum diperlihatkan adalah hal yang sebenarnya dilakukan sehari-hari: menyusun
beberapa komponen kecil menjadi satu bagian antarmuka yang utuh, lalu memakainya berulang dengan
data berbeda.

**Tugas**

1. Buat `components/KartuProfil.js`. Komponen ini menerima props `nama`, `peran`, dan `foto`, lalu
   menampilkan `Image`, dua `Text`, dan satu `Pressable`.
2. `Image` wajib diberi lebar dan tinggi eksplisit. Kalau hanya `flex: 1`, gambarnya tidak muncul.
3. Tampilkan kartu itu di `screens/KomponenScreen.js` sebagai kartu **paling bawah**, memakai
   pembungkus `Contoh` yang sudah ada: `<Contoh judul="Kartu profil" subbab="subbab 2.7" catatan="…">`.
   Isi `catatan` dengan satu kalimat tentang apa yang baru dibuktikan kartu ini.
4. Panggil `KartuProfil` **dua kali** dengan data berbeda. Tombolnya berganti tulisan dari `Ikuti`
   menjadi `Diikuti` saat ditekan, dan keadaan itu harus berdiri sendiri di tiap kartu.

**Lulus kalau**

- [ ] `Image` punya lebar dan tinggi eksplisit, bukan hasil warisan dari induk
- [ ] Tidak ada teks langsung di dalam `View`
- [ ] `KartuProfil` hanya membaca props; tidak ada `props.nama = …` di mana pun
- [ ] Dua pemanggilan menghasilkan dua kartu berbeda dari satu komponen yang sama
- [ ] Tombol memakai gaya kondisional, bukan dua komponen berbeda untuk dua keadaan
- [ ] Menekan kartu pertama tidak mengubah tulisan tombol di kartu kedua

**Jebakan**

- Mencoba memberi `source={require(produk.gambar)}` dari props. `require` harus berupa literal;
  kalau gambarnya datang lewat props, pakai `source={foto}` dan kirim objek `require(...)` dari
  pemanggilnya.
- Menyimpan `diikuti` di `KomponenScreen` untuk dua kartu sekaligus. Tiap kartu butuh keadaannya
  sendiri — itulah gunanya state di dalam komponen.
- Menyalin gaya dari `KartuProduk.js` tanpa membaca: kartu itu untuk grid katalog, lebarnya
  mengikuti sel, sedangkan kartu profil lebarnya mengikuti isinya.

---

### T3 — Kotak kode yang berkata jujur

**Layar:** 3 · `screens/GayaScreen.js` · **Slide:** Bagian 3, subbab 3.2–3.3 · **Waktu:** 20–25 menit

**Konteks.** Di bawah tombol ada kotak berjudul **"Array gaya yang sedang dipakai"**. Kotak itu
mengaku menampilkan array yang benar-benar dipakai, padahal isinya disusun dari dua nama tetap
(`namaGayaAktif`), bukan dari array `gayaTombol` itu sendiri. Selama tiga status, kebetulan tidak
ada yang salah. Begitu ada status keempat, kotaknya mulai berbohong — dan kelas tidak akan tahu
kalau tidak ada yang menambahkan status.

**Tugas**

1. Buka `screens/GayaScreen.js`. Tambahkan status keempat `peringatan`:
   tambahkan `{ nilai: 'peringatan', label: 'Peringatan' }` ke `PILIHAN_STATUS`, tambahkan gaya
   `tombolPeringatan`, dan tambahkan satu entri kondisional di `gayaTombol`.
2. Tekan status baru itu. Bandingkan isi kotak kode dengan `gayaTombol` yang sebenarnya dipakai.
   Catat bedanya dalam satu kalimat.
3. Buat kotak itu jujur: tampilkan **semua** entri `gayaTombol` apa adanya, termasuk entri yang
   bernilai `false`. Jangan mengubah urutan `gayaTombol` — yang berubah hanya cara menampilkannya.
4. Tulis satu kalimat: kenapa `false` lebih aman di dalam array gaya daripada `undefined`.

**Lulus kalau**

- [ ] Status `peringatan` mengubah warna tombol saat ditekan
- [ ] Kotak kode menampilkan seluruh entri, dan entri yang tidak berlaku terlihat sebagai `false`
- [ ] Urutan `gayaTombol` tidak disentuh
- [ ] Status `nonaktif` masih menyetel `disabled` dan labelnya tetap terbaca
- [ ] Ada satu kalimat di dalam kode atau catatan tentang `false` versus `undefined`

**Jebakan**

- Menyimpan warna di state (`useState(WARNA.peringatan)`). State harus tetap menyimpan **nama**
  status; warna adalah akibat, bukan sebab.
- Menulis `status === 'peringatan' ? styles.tombolPeringatan` tanpa cabang alternatif. Ekspresinya
  menjadi `undefined`, dan `undefined` di dalam array gaya bukan `false` — keduanya diabaikan
  React Native, tetapi hanya `false` yang bisa dibaca sebagai "belum berlaku".
- Memberi `key` dari nama gaya saat menampilkan semua entri. Entri `false` akan berulang, dan
  React akan mengeluh soal kunci kembar.
- Membuang `disabled` pada tombol contoh saat menambah status, lalu menganggap "nonaktif" hanya
  soal warna.

---

### T4 — Susunan ketiga

**Layar:** 4 · `screens/ResponsifScreen.js` · **Slide:** Bagian 4, subbab 4.8–4.9 · **Waktu:** 20–25 menit

**Konteks.** Layar ini punya tepat satu breakpoint: 600, dan hanya dua susunan — `column` dan
`row`. Kenyataannya aplikasi nyata hampir selalu butuh susunan ketiga, dan setiap susunan baru
memaksa satu keputusan: urutan pemeriksaan. Tantangan ini menambahkan susunan ketiga di 900, lalu
meminta kamu mempertahankan dua yang lama tanpa perubahan.

**Tugas**

1. Buka `screens/ResponsifScreen.js`. Tetapkan ambang kedua `900` sebagai konstanta lokal bernama
   `BREAKPOINT_LEBAR_TABEL`, di samping pemakaian `BREAKPOINT_LEBAR` yang sudah ada.
2. Saat `lebar >= 900`, kedua panel berubah menjadi **tabel**: satu baris judul (`Panel`, `Nilai`)
   di atas, lalu kedua panel menjadi baris tabel dengan label di kiri dan angka di kanan.
3. Tambahkan satu baris di `kartuUkur` yang menampilkan ambang kedua, supaya kelas tahu susunan
   mana yang sedang berlaku.
4. Jangan mengubah perilaku di bawah 600 dan antara 600–899.

**Lulus kalau**

- [ ] Di bawah 600 tetap `column`, 600–899 tetap `row`, persis seperti demo
- [ ] 900 ke atas memunculkan susunan ketiga, lengkap dengan baris judul tabel
- [ ] `kartuUkur` menampilkan kedua ambang dan `jumlah render` tetap bertambah saat lebar diubah
- [ ] Tidak ada lebar tetap (`width: 375`) di mana pun
- [ ] Tidak memakai `Dimensions.get()` — cukup `useWindowDimensions`

**Jebakan**

- Menguji di HP. Layar HP dalam posisi landscape biasanya 700–850 px, jadi ambang 900 **tidak
  pernah tercapai**. Untuk HP, uji dengan ambang sementara 700, lalu kembalikan ke 900 sebelum
  selesai — dan tulis di catatan bahwa kamu melakukannya.
- Menulis tiga `if/else` bertingkat padahal satu ekspresi bersarang sudah cukup, lalu salah urutan
  sehingga 900 tidak pernah dievaluasi.
- Menghapus `flex: 1` dari `styles.panel` saat membuat versi tabel, sehingga lebar panel kembali
  tetap dan layar sempit jadi rusak.
- Lupa `flexDirection: 'row'` pada baris tabel sehingga label dan nilainya bertumpuk ke bawah —
  `column` adalah arah bawaan di React Native, bukan `row` seperti di web.
- Memakai `justifyContent: 'space-between'` tanpa memberi lebar pada `Text`, lalu heran karena
  yang berubah hanya jarak, bukan posisi kolom.

---

### T5 — Angka yang membuktikan virtualisasi

**Layar:** 5 · `screens/ScrollerScreen.js` · **Slide:** Bagian 5, subbab 5.1–5.2 · **Waktu:** 20–25 menit

**Konteks.** Angka **"item dirender"** adalah bukti demo ini, dan bukti yang tidak dirawat akan
berbohong. Dua hal perlu diketahui sebelum mulai: penghitungnya menambah satu setiap kali baris
dirender (bukan setiap baris unik), dan angkanya disalin ke layar sekali per pergantian mode.
Gulir daftar `FlatList` dan angkanya tidak akan bergerak, walaupun baris baru jelas muncul.

**Tugas**

1. Buka `screens/ScrollerScreen.js`. Di mode `FlatList`, gulir sekitar 40 baris lalu kembali ke
   atas. Apakah angka berubah? Jelaskan sebabnya dalam satu kalimat.
2. Ubah penghitungnya supaya jujur: hitung **id unik** yang pernah dirender, dan perbarui angkanya
   saat daftar digulir — bukan sekali per pergantian mode.
3. Ubah `initialNumToRender` dari `10` menjadi `50`, dan `windowSize` dari `5` menjadi `1`.
   Catat angka yang muncul sesudah perpindahan mode di ketiga keadaan: `10/5`, `50/5`, `50/1`.
   Kembalikan nilainya seperti semula sebelum selesai.
4. Tulis dua kalimat: kenapa angka di Expo Web bisa berbeda dari perangkat, dan bagian mana dari
   kode ini yang menjelaskannya.

**Lulus kalau**

- [ ] Angka yang ditampilkan berasal dari id unik, bukan jumlah pemanggilan render
- [ ] Angka berubah saat daftar digulir (di perangkat atau emulator; di Expo Web boleh tetap penuh
      asal dijelaskan sebabnya)
- [ ] Ada catatan hasil percobaan `10/5` → `50/5` → `50/1`, bukan hanya "sudah dicoba"
- [ ] Kedua mode masih bisa dipilih, dan tidak ada `FlatList` di dalam `ScrollView` searah
- [ ] Penjelasan menyebut perbedaan pengukuran tinggi baris di web dan di perangkat

**Jebakan**

- Memanggil pengubah state dari dalam `BarisPanjang`. Itu setara memperbarui state saat render:
  peringatan di console, render berulang, dan angka yang kacau.
- Membuat `new Set()` di dalam badan komponen lalu menghitung ulang setiap render. Set-nya kosong
  lagi setiap kali, jadi angkanya selalu nol atau satu.
- Menyimpulkan "`FlatList` tidak bekerja" hanya dari angka di browser. Ada catatan jujur soal ini
  di kepala berkas — bacalah sebelum menyalahkan komponennya.
- Memberi `onViewableItemsChanged` berupa fungsi anonim biasa. React Native menolak fungsi yang
  identitasnya berubah setiap render; bungkus dengan `useRef`.

---

### T6 — Katalog yang ingat dan mengurutkan

**Layar:** 6 · `screens/KatalogScreen.js` · **Slide:** Praktikum Integrasi · **Waktu:** 30–40 menit

**Konteks.** Katalog ini sudah punya pencarian, grid responsif, `ListEmptyComponent`, dan satu
scroller saja. Yang belum ada adalah hal-hal yang membuatnya terasa seperti aplikasi: pencarian
yang tidak hilang saat kamu keluar-masuk layar, tombol untuk membatalkannya, dan urutan yang
berguna — barang tersedia lebih dulu, barang habis di belakang.

**Tugas**

1. Buka `screens/KatalogScreen.js`. Tambahkan tombol **Hapus pencarian** yang hanya muncul saat
   kata kunci tidak kosong, dan mengosongkan `kataKunci` saat ditekan.
2. Urutkan hasil: stok tersedia lebih dulu, stok habis paling akhir. Jangan menyunting
   `DAFTAR_PRODUK`. Tambahkan penanda urutan pada baris ringkasan (`· urut: tersedia dulu`)
   supaya pengguna tahu kenapa barang habis selalu di belakang, bukan mengira daftarnya acak.
3. Buat kata kunci **bertahan** saat mahasiswa kembali ke menu lalu membuka katalog lagi. Layar
   ini dilepas dari pohon komponen setiap kali kembali ke menu, jadi state-nya harus diangkat ke
   `App.js` dan diturunkan lagi lewat props.
4. Pastikan keadaan kosong tetap muncul lewat `ListEmptyComponent`, dan grid tetap 2/3 kolom saat
   lebar berubah.

**Lulus kalau**

- [ ] Tombol hapus hanya tampil saat ada kata kunci, dan mengosongkan input saat ditekan
- [ ] `DAFTAR_PRODUK` tidak berubah setelah pengurutan (buka ulang katalog untuk memastikan)
- [ ] Kata kunci masih ada setelah kembali ke menu lalu membuka katalog lagi
- [ ] `key={jumlahKolom}`, `numColumns`, dan `columnWrapperStyle` masih bekerja
- [ ] Tidak ada `ScrollView` baru di layar ini, dan tidak ada peringatan `VirtualizedLists`
- [ ] Ringkasan menyebut jumlah hasil yang benar dan penanda urutannya

**Jebakan**

- Mengurutkan sumbernya, bukan hasilnya. `filter` mengembalikan array baru sehingga
  `hasilSaring.sort(...)` aman; `DAFTAR_PRODUK.sort(...)` mengubah data milik seluruh layar, dan
  kerusakannya baru terlihat setelah katalog dibuka ulang.
- Menyimpan `kataKunci` di `KatalogScreen` lalu berharap bertahan. Komponennya dilepas saat
  kembali ke menu — tidak ada state yang bertahan di sana.
- Menaruh `TextInput` di dalam dua cabang `if` yang berbeda. Setiap kali cabangnya berganti,
  inputnya dibuat ulang dan fokus keyboard hilang di tengah mengetik.
- Membungkus `FlatList` dengan `ScrollView` supaya tombol hapus ikut tergulir. Itu mematikan
  virtualisasi dan memunculkan peringatan di console — persis larangan di Bagian 5.

---

## Pemetaan ke soal praktikum

Tantangan ini tidak menggantikan soal. Yang dinilai tetap soal 1–10; tantangan hanya menambah satu
lapis cara berpikir.

| Tantangan | Soal yang mirip | Bedanya |
|---|---|---|
| T1 | Soal 1, Soal 2 | Bekerja di dalam tabel padanan demo, bukan memindahkan seluruh halaman |
| T2 | Soal 3, 4, 5 | Satu komponen dengan props dan dua pemanggilan, bukan enam demo terpisah |
| T3 | Soal 9 | Kotak kode harus jujur soal `false`, bukan sekadar mengganti gaya |
| T4 | Soal 10 | Tiga susunan sekaligus, bukan dua |
| T5 | Soal 6, Soal 7 | Mengukur dan menjelaskan, bukan menulis ulang daftar |
| T6 | Soal 7 | Mengangkat state ke induk dan mengurutkan tanpa merusak data bersama |

---

## Berkas terkait

- `KUNCI-TANTANGAN.md` — kunci jawaban dan gejala jawaban salah (untuk dosen)
- `NASKAH-DEMO.md` — skrip demo kelas, termasuk blok pembahasan tantangan
- `README.md` — cara menjalankan demo dan daftar batas yang disengaja
- `praktikum/bab-05-soal-praktikum.md` — soal yang dinilai
