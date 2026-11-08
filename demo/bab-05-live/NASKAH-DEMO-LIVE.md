# Naskah Demo Live — Bab 5: Dasar React Native

Lembar pendamping untuk mengajar dengan `demo/bab-05-live/`. Naskah lengkap dengan kode per langkah
ada di [`LIST-TUTORIAL-DEMO.md`](LIST-TUTORIAL-DEMO.md); berkas ini hanya memuat yang perlu
**diucapkan**, ditunjuk, dan diwaspadai — supaya tidak membaca berkas naskah di depan kelas.

Deck: `slides/bab-05-dasar-react-native.md` · Pertemuan 6 · 100 menit · proyek `kantin-kampus`.

**Pertanyaan pemantik pembuka:** "Kalau cara berpikirnya sama dengan React, kenapa kodenya harus
berbeda?" Tampung dua sampai tiga jawaban tanpa dikoreksi, lalu buka terminal: "jawabannya ada di
delapan demo ini".

Sebut sekali di awal: demo memakai data **kantin kampus**, buku dan praktikum memakai data
**mahasiswa**. Struktur komponennya sama; yang berganti hanya isi `data/`.

---

## Sebelum masuk kelas

- [ ] `cd demo/bab-05-live/kantin-kampus && npm install` sudah dijalankan sekali.
- [ ] `npx expo start` sudah dicoba; Metro dan satu target sudah terbuka, lalu ditutup lagi.
- [ ] Metro console terlihat di layar kedua — Demo 1 dan Demo 5 membaca console, bukan layar ponsel.
- [ ] Emulator di **ponsel potret**, bukan tablet: Demo 4 butuh susunan yang berubah.
- [ ] Ukuran font perangkat di pengaturan bawaan.
- [ ] Folder `theme/`, `data/`, `components/`, `screens/` sudah ada di project kosong, supaya tidak
      ada delapan menit habis untuk `mkdir`.
- [ ] Tahu satu hal: Demo 2 memakai `assets/icon.png` bawaan template sebagai gambar contoh.

---

## Demo 0 — Dari folder kosong sampai layar hidup (5 menit)

**Diucapkan**

1. `--template blank`, bukan template default: template default membawa tab navigasi yang tidak
   dipakai hari ini.
2. Satu layar hidup, dan Metro tidak membundel ulang seluruh aplikasi setiap kali berkas disimpan.
3. Tiga folder dibuat sekarang walau masih kosong: `theme/`, `data/`, `components/`.

**Pertanyaan kelas:** "Kenapa `View` tidak boleh berisi teks langsung?" Tampung dulu, jawab di
Demo 2.

**Tunjuk di layar:** sunting satu teks, simpan, layar ikut berubah tanpa restart.

**Jebakan:** `-t blank` pada versi baru hanya sebagian jalan; tulis `--template blank`.

---

## Demo 1 — Halaman pertama (6 menit)

**Diucapkan**

1. Versi web di kepala berkas **dibaca, tidak dijalankan**. Satu-satunya kode yang berjalan hari ini
   versi native.
2. JSX-nya sama; yang berganti nama komponennya.
3. `onPress` mengirim `console.log` dulu — umpan baliknya di console, bukan di layar.
4. `Button` menerima prop `title`, bukan teks di dalam tag, dan tidak bisa ditata bebas.
   `Pressable` bisa.

**Pertanyaan kelas:** "Berapa baris yang benar-benar berubah?" Jawaban: import, nama komponen, dan
definisi gaya — bukan logikanya.

**Tunjuk di layar:** baris `Pesan ditekan` muncul di Metro console setiap tombol ditekan.

**Jebakan:** menjanjikan versi web dijalankan di Expo. Sebut terang-terangan bahwa itu pembanding.

---

## Demo 2 — Komponen inti (9 menit)

**Diucapkan**

1. Satu komponen, dua isi: yang berubah hanya props yang dikirim.
2. Props turun, bukan naik; `KartuMenu` tidak tahu apa-apa soal `data/menu.js`.
3. `Image` tanpa `width`/`height` menghasilkan kotak kosong — ukuran gambar native harus ditulis.
4. `TextInput` terkendali: yang diketik disimpan di state, lalu dibaca balik ke layar.
5. `contentContainerStyle` untuk padding di dalam area gulir; `style` pada `ScrollView` tidak
   memberi hasil yang diharapkan.

**Pertanyaan kelas:** "Bolehkah `View` berisi teks langsung?" — tidak. Hapus satu `View` pembungkus
teks, tunjukkan layar merahnya, lalu `Ctrl+Z`. Batasnya 30 detik.

**Tunjuk di layar:** baris "Nilai terbaca" mengikuti ketikan.

**Jebakan:** menunda `Ctrl+Z` untuk layar merah; setelah 30 detik kelas mulai mencatat pesannya,
bukan konsepnya.

---

## Demo 3 — Satu status, tiga wajah (7 menit)

**Diucapkan**

1. Yang disimpan hanya **status** — `habis`, `tipis`, `tersedia` — bukan warna, bukan objek gaya.
2. Array style: kiri gaya dasar, kanan pengecualian. Yang ditulis belakangan menimpa.
3. Entri `false` diabaikan, dan itu bukan error.
4. Properti yang tidak diatur ulang tidak ikut hilang saat urutan array dibalik.
5. Badge membawa **teks** `habis`, bukan hanya warna.

**Pertanyaan kelas:** "Kenapa status jangan dibedakan lewat warna saja?" Sebagian pengguna tidak
dapat membedakan warna.

**Tunjuk di layar:** badge `Mie Ayam Bakso` (stok 0) merah, `Nasi Rendang` (stok 3) tipis. Balik
urutan array, tunjukkan latar merahnya kalah, lalu kembalikan sambil mengucapkan aturannya.

**Jebakan:** objek gaya ditaruh di dalam badan komponen sehingga dibuat ulang setiap render; gaya
disimpan di `useState` — yang disimpan cukup statusnya.

---

## Demo 4 — Satu layar, dua susunan (9 menit)

**Diucapkan**

1. Mulai dari `flexDirection: 'column'` tetap — ini pembandingnya, jangan dilewati.
2. `useWindowDimensions()` reaktif: nilainya berubah saat jendela berubah, tanpa memuat ulang.
3. Penghitung render sengaja kasar; yang dibuktikan hanya satu hal — angkanya bergerak.
4. `justifyContent` selalu sumbu utama, `alignItems` selalu sumbu silang.

**Pertanyaan kelas:** "Properti apa yang berubah saat layar melebar?" Jawaban: `flexDirection`.

**Tunjuk di layar:** angka `render ke-N` bertambah setiap lebar berubah.

**Jebakan:** memulai di tablet sehingga panel sudah `row` sejak awal; mengukur sekali di nilai awal
`useState`, sehingga layout tidak pernah berubah.

---

## Demo 5 — Dua scroller untuk data yang sama (7 menit)

**Diucapkan**

1. 200 item, data yang sama, dua komponen berbeda.
2. `ScrollView` menyusun semuanya sekarang juga; `FlatList` hanya menyusun jendela di sekitar layar.
3. `Platform.OS` untuk perbedaan kecil; kalau perbedaannya besar, pakai berkas `.ios.js` / `.android.js`.
4. `FlatList` di dalam `ScrollView` searah merusak virtualisasi.

**Pertanyaan kelas:** "Untuk delapan menu yang semuanya muat di satu layar, mana yang lebih tepat?"
Jawaban: `ScrollView`; `FlatList` baru berguna saat datanya bisa memanjang.

**Tunjuk di layar:** dua angka di Metro console — sekitar `200` untuk `scroll`, sekitar `10` untuk
`flat`. Tekan tombol mode untuk memicu hitungan baru.

**Jebakan:** angka bisa tercetak dua kali di mode pengembangan; cukup sebut alat ukurnya kasar, yang
penting bedanya dua orde.

---

## Demo 6 — Katalog (6 menit)

**Diucapkan**

1. Penyaringan dilakukan di luar `renderItem`; `renderItem` hanya menggambar.
2. `numColumns` ditentukan lebar layar, dan `key` ikut berubah saat jumlah kolom berubah.
3. `ListEmptyComponent` untuk hasil kosong — bukan indikator pemuatan.
4. `keyboardShouldPersistTaps="handled"`: tombol cukup ditekan sekali walau papan tombol terbuka.
5. Hanya satu scroller di layar ini, dan tidak ada `ScrollView` yang membungkusnya.

**Pertanyaan kelas:** "Bagian mana yang paling lama kamu kerjakan nanti, dan kenapa?" Jawaban umumnya
layout — itulah alasan Bagian 4 mendapat porsi terbesar.

**Tunjuk di layar:** ketik kata yang tidak ada → keadaan kosong; lebarkan jendela → 3 kolom.

**Jebakan:** `numColumns` berubah tanpa `key` baru; baris terakhir yang tidak penuh melebar mengisi
ruang kosong — sebut sekali sebagai perilaku `flex: 1`, bukan bug.

---

## Demo 7 — Yang teramati, kuis, penutup (10 menit)

1. Minta kelas mencentang lima butir di [`CHECKLIST-TERAMATI.md`](CHECKLIST-TERAMATI.md) pada
   aplikasinya sendiri. Butir yang gagal ditandai, bukan dijelaskan panjang.
2. Kuis kilat dua menit: jawaban ditulis dulu, baru kunci dibuka. Sembunyikan kunci dengan `p`
   sebelum kuis mulai — jebakan terbesar di demo ini adalah membuka kunci terlalu cepat.
3. Sebut tenggat Praktikum 5 dan praktikum integrasi beserta bobot rubriknya.
4. Tutup dengan satu kalimat: "Hari ini abjad visualnya; minggu depan kata dan kalimatnya."

**Kuis kilat**

1. Apa yang dirender React Native: elemen HTML atau komponen native?
2. Komponen apa yang wajib membungkus teks?
3. Dalam array style, gaya mana yang dipakai saat dua gaya mengatur properti yang sama?
4. Properti apa yang mengatur distribusi komponen pada sumbu utama?
5. Kapan `FlatList` lebih tepat daripada `ScrollView`?

**Kunci**

1. Komponen native, bukan elemen HTML.
2. `Text`; `View` tidak boleh berisi teks langsung.
3. Gaya yang ditulis belakangan; urutan array adalah urutan prioritas.
4. `justifyContent`.
5. Saat data panjang atau dinamis dan hanya sebagian item perlu dirender.

Kalau waktu habis, cukup pertanyaan 3 dan 5 — keduanya paling menentukan di praktikum.

**Pertanyaan penutup:** "Butir mana yang paling sering gagal di kelas ini?" Jawaban yang diharapkan:
tombol yang berubah status, dan area aman.

---

## Urutan memotong kalau sesi melar

Potong dari atas daftar ini, dan katakan kepada kelas bahwa bagian itu dibaca mandiri.

1. **Demo 0** — pakai project yang sudah disiapkan, cukup tunjukkan layarnya hidup.
2. **Demo 1** — bawakan Bagian 1 langsung dari slide; isinya konsep, bukan keterampilan baru.
3. **Demo 5** — tampilkan `FlatList` saja beserta angka di Metro, serahkan `ScrollView` ke praktikum.
4. **Demo 3** — kalau ini juga terpotong, ganti satu kalimat: "yang ditulis belakangan menimpa, dan
   `false` diabaikan".

Jangan dipotong: **Demo 4** dan **Demo 6**.

---

## Empat hal yang harus dikatakan terang-terangan

1. Demo berjalan di **satu target**. Perbedaan Android dan iOS dibawakan dari slide, dikerjakan di
   praktikum.
2. **Versi web hanya dibaca.** Yang dijalankan hari ini hanya versi native.
3. **Tidak ada kode yang sengaja dibuat salah, kecuali satu**: layar merah 30 detik di Demo 2.
4. **Gambar contoh memakai aset bawaan template**, bukan foto kantin sungguhan.
