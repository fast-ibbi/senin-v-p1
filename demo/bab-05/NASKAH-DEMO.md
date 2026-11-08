# Naskah Demo Kelas — Bab 5: Dasar React Native

Lembar latihan untuk mengajar dengan `demo/bab-05`, bukan transkrip kata per kata.

Isinya: layar mana melayani slide mana, butir yang perlu diucapkan, satu pertanyaan untuk kelas,
satu hal yang harus ditunjuk di layar, dan anggaran menit. Kalau sesi melar, bagian **Urutan
memotong** di bawah memberi tahu apa yang dibuang lebih dulu.

Deck: `slides/bab-05-dasar-react-native.md` · Pertemuan 6 · total sesi 100 menit.

Enam tantangan lab yang menempel pada keenam layar ada di `TANTANGAN-LAB.md` (boleh dibagikan ke
mahasiswa), kuncinya di `KUNCI-TANTANGAN.md` (hanya dosen). Sesi kelas tidak berubah karena
keenam tantangan dikerjakan di lab, bukan di sela demo — lihat blok terakhir berkas ini.

---

## Sebelum masuk kelas

- [ ] `cd demo/bab-05 && npm install && npx expo start` sudah dijalankan sekali di mesin yang dipakai.
- [ ] Perangkat atau simulator sudah terpasang aplikasinya, dan menu demo sudah terbuka.
- [ ] Metro console dibuka di layar kedua — beberapa butir naskah meminta kelas melihat console.
- [ ] Kecerahan layar dan ukuran font perangkat ada di pengaturan bawaan (bukan font raksasa).
- [ ] Sadar satu hal: satu produk di layar 2 dan 6 memakai gambar dari URL. Kalau jaringan mati,
      gambar itu kosong — dan itu justru bahan penjelasan, bukan kegagalan demo.

---

## Anggaran menit

| Segmen | Menit | Kumulatif |
|---|---|---|
| Pembuka, pertanyaan pemantik | 5 | 5 |
| Layar 1 — padanan web dan native | 5 | 10 |
| Layar 2 — komponen inti | 8 | 18 |
| Layar 3 — gaya kondisional | 8 | 26 |
| Layar 4 — layout responsif | 10 | 36 |
| Layar 5 — scroller | 8 | 44 |
| Layar 6 — katalog | 6 | 50 |
| Praktikum di lab | 40 | 90 |
| Kuis kilat dan penutup | 10 | 100 |

---

## Pembuka (5 menit)

Sambungkan ke Bab 4, lalu ajukan pertanyaan pemantik deck: **"Kalau cara berpikirnya sama dengan
React, kenapa kodenya harus berbeda?"**

Tampung dua sampai tiga jawaban tanpa dikoreksi. Buka menu demo dan tunjukkan enam bagiannya:
"jawabannya ada di enam berhenti ini".

Kalimat yang perlu diucapkan: demo ini memakai data produk, sedangkan buku dan praktikum memakai
data mahasiswa. Alasannya sederhana — contoh `FlatList` di slide memakai produk. Struktur
komponennya sama; yang berganti hanya isi datanya.

---

## Layar 1 — React Web vs React Native (5 menit)

**Slide:** Bagian 1 — "Konsepnya Sama, Medianya Berbeda", "Elemen HTML Diganti Komponen Native",
"HTML Dirender Browser, Komponen Dirender Native", "Bagian Kode yang Bisa Dipakai Ulang" · subbab 1.1–1.4

**Butir yang diucapkan**

1. Kolom kanan bukan tulisan di slide: itu komponen yang benar-benar dirender sekarang.
2. Tekan `Pressable` di baris `button` — umpan baliknya nyata, bukan gambar.
3. Padanannya tidak selalu satu-satu; satu `div` di web bisa menjadi dua `View`.
4. Tidak ada file CSS di project ini. Semua gaya berasal dari `StyleSheet`.

**Pertanyaan untuk kelas:** "Baris mana yang paling mengejutkan, dan kenapa?"

**Tunjuk di layar:** baris `img` — gambarnya punya ukuran karena lebarnya ditulis, bukan ditebak.

**Kalau terburu-buru:** cukup baris `div`, `p`, dan `CSS`, lalu lanjut.

---

## Layar 2 — Komponen inti (8 menit)

**Slide:** Bagian 2 — "Empat Komponen Pertama: Container sampai Input", "Tombol, Daftar, dan Area
Aman", "Props Turun, Komposisi Menyusun Antarmuka" · subbab 2.1–2.6

**Butir yang diucapkan**

1. Enam komponen, enam peran: `View` memegang, `Text` berbicara, `Image` menunjukkan, `TextInput`
   mendengar, `Button` dan `Pressable` bereaksi.
2. Tidak ada teks yang ditulis langsung di dalam `View` — di layar ini pun tidak ada.
3. `Image` kiri memakai `require`, kanan memakai `uri`. Yang kanan butuh internet; kalau jaringan
   mati, kotaknya kosong.
4. Ketik di `TextInput` dan tunjukkan baris "Nilai terbaca" ikut berubah: itu *controlled component*.
5. `Button` tidak bisa ditata bebas; `Pressable` bisa.

**Pertanyaan untuk kelas:** "Bolehkah `View` berisi teks langsung?" — jawabannya tidak, dan itu
kesalahan pertama hampir semua pemula (red screen-nya dikerjakan di Praktikum Soal 2).

**Tunjuk di layar:** perbedaan visual `Button` dan `Pressable` di dua kartu terakhir.

**Kalau terburu-buru:** lewati `Button`, sisakan `Pressable`; sebut sisanya secara lisan.

---

## Layar 3 — Gaya kondisional (8 menit)

**Slide:** Bagian 3 — "Gaya Ditulis sebagai Objek, Bukan CSS", "Array Style: yang Ditulis
Belakangan Menimpa", "Gaya Kondisional: Ternary dan Logika &&" · subbab 3.1–3.4

**Butir yang diucapkan**

1. Yang disimpan di state hanya nama status: `utama`, `kedua`, `nonaktif`. Bukan warna, bukan
   objek gaya.
2. Tekan tombol pilihan status: bentuk tombol berubah, tetapi radius dan padding tidak berubah —
   itu artinya hanya properti yang sama yang ditimpa.
3. Kotak kode di bawah menampilkan array gaya yang sedang dipakai. Saat status `ketiga` tidak
   cocok, entrinya bernilai `false` dan diabaikan, bukan error.
4. Urutan array adalah urutan prioritas: kiri dasar, kanan pengecualian.

**Pertanyaan untuk kelas:** "Kenapa status jangan dibedakan lewat warna saja?" — sebagian pengguna
tidak dapat membedakan warna; tambahkan teks atau ikon. Demo ini memakai teks pada label stok.

**Tunjuk di layar:** kotak kode yang berubah isinya saat status diganti.

**Kalau terburu-buru:** cukup `utama` lalu `nonaktif`; dua keadaan sudah cukup untuk menunjukkan
aturan urutan array.

---

## Layar 4 — Layout responsif (10 menit)

**Slide:** Bagian 4 — "`useWindowDimensions()`: Ukuran Jendela Reaktif", "Breakpoint dan Orientasi:
Layout Ikut Berubah", "Hal yang Perlu Diuji Setelah Layout Jadi" · subbab 4.7–4.10

**Butir yang diucapkan**

1. Mulai dari ponsel potret: dua panel bertumpuk (`column`).
2. Putar perangkat, atau ubah lebar jendela di emulator: panel berpindah menjadi `row` tanpa
   memuat ulang aplikasi.
3. Perhatikan angka **jumlah render** bertambah. Itu bukti `useWindowDimensions` reaktif, bukan
   sekali ukur.
4. Breakpoint 600 hanya ambang keputusan layout, bukan nama perangkat.
5. `flex: 1` pada dua panel membuat lebarnya dibagi rata setelah gap dan padding dikurangi.

**Pertanyaan untuk kelas:** "Properti apa yang berubah saat layar melebar?" — `flexDirection`,
dari `column` menjadi `row`.

**Tunjuk di layar:** baris `flexDirection` dan `jumlah render` di kotak gelap atas.

**Kalau terburu-buru:** ini layar yang jangan dilewati. Kalau waktu sempit, potong layar lain.

**Perhatian:** kalau demo dijalankan di tablet sejak awal, panel sudah `row`. Mulai dari ponsel
potret supaya perubahan susunannya terlihat.

---

## Layar 5 — Scroller (8 menit)

**Slide:** Bagian 5 — "`ScrollView` untuk Konten Statis yang Panjang", "`FlatList` untuk Data yang
Bisa Memanjang", "Memilih Komponen Pengguliran" · subbab 5.1–5.3

**Butir yang diucapkan**

1. Daftarnya sama: 300 item, dua komponen berbeda.
2. Mode `ScrollView`: angka **item dirender** menunjukkan 300 dari 300. Semua masuk pohon komponen
   sejak layar dibuka.
3. Pindah ke mode `FlatList`: angkanya menjadi 10 dari 300. Itu virtualisasi — hanya jendela di
   sekitar layar yang disusun.
4. Gulir daftar `FlatList` dan tunjukkan bahwa item baru muncul saat dibutuhkan.
5. Larangan yang harus diingat: jangan menaruh `FlatList` di dalam `ScrollView` searah. Peringatan
   `VirtualizedLists` yang muncul adalah materi Praktikum Soal 6.

**Pertanyaan untuk kelas:** "Untuk lima kartu statis yang semuanya muat di satu layar, mana yang
lebih tepat?" — `ScrollView`; `FlatList` baru berguna saat datanya bisa memanjang.

**Tunjuk di layar:** dua angka di kotak gelap, sebelum dan sesudah berpindah mode.

**Kalau terburu-buru:** tampilkan `FlatList` saja beserta angkanya, lalu sebut angka `ScrollView`
secara lisan.

---

## Layar 6 — Katalog produk responsif (6 menit)

**Slide:** "Praktikum Integrasi: Halaman Katalog Responsif", "Yang Harus Teramati" · penutup bab

**Butir yang diucapkan**

1. Satu layar, seluruh isi bab: komponen inti, `StyleSheet`, gaya kondisional status stok, grid
   `FlatList`, dan layout responsif.
2. Ubah lebar jendela: kolom berubah dari 2 menjadi 3 pada lebar 600. `key={jumlahKolom}` memaksa
   daftar dibangun ulang supaya barisnya tetap rapi.
3. Ketik kata kunci yang tidak ada: `ListEmptyComponent` yang muncul, bukan indikator pemuatan.
4. Hanya ada satu scroller di layar ini — `FlatList`. Tidak ada `ScrollView` yang membungkusnya.

**Pertanyaan untuk kelas:** "Bagian mana yang paling lama kamu kerjakan nanti, dan kenapa?" —
jawaban yang umum adalah layout.

**Tunjuk di layar:** perubahan jumlah kolom saat lebar jendela digeser, lalu keadaan kosong.

---

## Kalimat penutup (bagian dari 10 menit terakhir)

"Lima bagian tadi punya alasan masing-masing. Alasan itulah yang dipakai lagi saat kamu membaca
kode orang lain."

Sebutkan tenggat Praktikum 5 dan praktikum integrasi, lalu arahkan ke Bab 6.

---

## Urutan memotong kalau sesi melar

Potong dari atas daftar ini, dan sebutkan kepada kelas bahwa bagian itu dibaca mandiri.

1. **Layar 1** — ajarkan Bagian 1 langsung dari slide; isinya konsep, bukan keterampilan baru.
2. **Layar 2** — sebut peran enam komponen secara lisan, lalu langsung ke layar 3.
3. **Layar 5** — tampilkan `FlatList` saja, atau serahkan seluruhnya ke Praktikum Soal 6 dan 7.
4. **Layar 3** — kalau ini juga terpotong, ganti dengan satu kalimat: "yang belakangan menimpa,
   dan `false` diabaikan".

Jangan dipotong: **layar 4** dan **layar 6**. Keduanya paling banyak menyita waktu praktikum kalau
tidak pernah dilihat di kelas.

---

## Pembahasan tantangan — 5 menit pertama pertemuan berikutnya

Ini satu-satunya bagian naskah yang tidak dipakai di pertemuan 6. Taruh di awal pertemuan 7,
sebelum materi Bab 6: lima menit, tanpa slide, sambil semua orang masih punya sisa perhatian.

**Yang dibahas hanya dua:** T3 (kotak kode yang berkata jujur) dan T5 (angka yang membuktikan
virtualisasi). Keduanya paling banyak salah paham, dan keduanya bisa dibahas tanpa membuka laptop
mahasiswa.

Kalimat pembukanya: *"Dua tantangan lab kemarin menguji satu hal yang sama: apakah bukti yang
kamu lihat di layar benar-benar bukti."*

**T3 — kotak kode yang berkata jujur.** Yang dibongkar: kotak di bawah tombol menyusun namanya
dari dua nama tetap, bukan dari array yang dipakai. Selama tiga status, kebetulan tidak ada yang
salah; status keempat yang membongkarnya. Pertanyaan untuk kelas: *"Apa lagi di aplikasimu yang
mengaku menampilkan sesuatu, padahal menyusunnya sendiri?"* (Jawaban yang diharapkan: angka
ringkasan, label status stok, apa pun yang dihitung manual alih-alih diturunkan dari data.)

**T5 — angka yang membuktikan virtualisasi.** Yang dibongkar: angka "item dirender" tidak bergerak
saat digulir, karena ia disalin sekali per pergantian mode; dan yang dihitung adalah pemanggilan
render, bukan baris unik. Pertanyaan untuk kelas: *"Kalau angkanya tidak berubah saat kamu
gulir, apakah itu berarti virtualisasi tidak bekerja — atau berarti alat ukurnya yang salah?"*
Arahkan ke jawaban kedua, lalu sebut bahwa mengganti `10` menjadi `50` pada `initialNumToRender`
memindahkan angkanya: parameternya benar, alat ukurnya yang perlu diperbaiki.

**Yang tidak perlu dibahas:** T1, T2, T4, T6. Keempatnya soal keterampilan, bukan kesalahpahaman;
pekerjaannya bisa dilihat langsung di layar kalau ada yang bertanya setelah kelas.

---

## Empat hal yang harus dikatakan terang-terangan

Demo ini sengaja tidak mengerjakan empat hal. Sebutkan supaya tidak menjadi kesalahpahaman.

1. **Perbedaan Android dan iOS tidak didemokan.** Demo berjalan di satu target. Slide "Android dan
   iOS Tidak Selalu Sama" dan "`Platform.OS`" dibawakan dari deck, praktiknya di Praktikum Soal 8
   dan 9.
2. **Area aman memakai `SafeAreaView` bawaan.** Pelajaran bahwa komponen bawaan tidak menolong di
   Android tetap milik Praktikum Soal 8.
3. **Tidak ada kode yang sengaja dibuat salah.** Red screen, peringatan `VirtualizedLists`, dan
   gambar tanpa ukuran dikerjakan mahasiswa sendiri di praktikum, bukan ditunjukkan di kelas.
4. **Tantangan tidak dikerjakan di atas demo ini.** Mahasiswa menyalin foldernya lebih dulu
   (`TANTANGAN-LAB.md`, bagian Persiapan) supaya demo kelas tetap utuh untuk pertemuan berikutnya.
