---
marp: true
theme: academic
paginate: true
title: "Bab 2 — Persiapan Lingkungan Pengembangan"
description: "Kuliah Pemrograman Mobile, pertemuan 2: Node.js dan npm, pengelola paket, VS Code, Expo CLI dan Expo Go, Metro Bundler, emulator Android, iOS Simulator, proyek Expo pertama, struktur folder, dan troubleshooting."
author: "Dosen Mata Kuliah — Program Studi Sistem Informasi / Teknik Informatika"
footer: "Pemrograman Mobile · Bab 2 — Persiapan Lingkungan Pengembangan"
size: 16:9
---

<!-- _class: lead -->
<!-- _paginate: skip -->
<!-- _footer: "" -->

# Bab 2 — Persiapan Lingkungan Pengembangan

Menyiapkan meja kerja, menjalankan aplikasi pertama · Pertemuan 2

<!--
Buka dengan satu kalimat: "Di Bab 1 kita menggambar peta; hari ini kita menyiapkan alat dan
menghidupkan mesinnya."

Pertanyaan pembuka: "Apa yang kamu pasang lebih dulu saat memakai laptop baru untuk kuliah?"
Tampung dua atau tiga jawaban sebagai jembatan ke gagasan lingkungan kerja yang baku dan bisa
dibangun ulang.

Menurut RPS, pertemuan ini berbobot 3 sks (2 sks teori + 1 sks praktikum); sisipkan demo
singkat lalu langsung pindah ke praktik di komputer.
-->

---

## Tujuan Pembelajaran

Setelah bab ini, kamu bisa:

- Menjelaskan peran Node.js, npm, dan npx di ekosistem Expo
- Mengidentifikasi komponen lingkungan pengembangan beserta fungsinya
- Menerapkan pembuatan proyek Expo pertama dan menjalankannya
- Menganalisis tiga jalur pengujian dari sisi kecepatan dan kesetiaan perilaku
- Menjelaskan struktur folder proyek dan mengevaluasi kendala yang umum muncul

<!--
Bacakan hanya kata kerjanya. Butir keempat adalah inti berpikir analitis dan yang paling
sering keluar di soal ujian.

Kaitkan dengan penilaian RPS pertemuan ini: rubrik praktikum Bab 2 ditambah daftar periksa
troubleshooting yang dikumpulkan bersama laporan praktikum.

Tegaskan bahwa butir kelima bersifat diagnostik: mahasiswa harus bisa memilih solusi, bukan
sekadar menghafal pesan error.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Bagian 1 — Fondasi: Node.js, npm & VS Code

subbab 2.1 Node.js dan npm · 2.2 Pengelola Paket · 2.3 Visual Studio Code

<!--
Bagian ini konseptual, tetapi menentukan seluruh praktikum hari ini. Kalau waktu sempit,
padatkan subbab 2.2 dan 2.3; subbab 2.1 jangan dilewati.

Ingatkan bahwa mahasiswa yang gagal di Bagian 1 hampir selalu gagal juga di Bagian 2, karena
setiap alat Expo berjalan di atas Node.js.
-->

---

## Node.js Menjalankan JavaScript, Bukan Bahasa Baru

![w:1120](assets/diagrams/bab-02-persiapan-lingkungan-pengembangan-01.svg)

**Node.js** adalah *runtime* JavaScript: lingkungan eksekusi di luar browser.

- Bukan bahasa baru: JavaScript tetap JavaScript
- Bukan browser: tidak ada layar, hanya terminal
- Fondasi Expo CLI dan Metro, di atas mesin V8 yang sama dengan Chrome

<!--
Analogi: JavaScript adalah bahasa yang kamu kuasai; Node.js adalah meja kerja yang membuat
bahasa itu berguna di luar halaman web.

Pertanyaan penuntun: "Kalau Node.js hanya untuk alat, kenapa versinya perlu diurus?"
(Jawaban: versi runtime memengaruhi perilaku sintaksis dan alat, jadi selisih versi
menghasilkan error yang samar.)

Peringatan salah paham: banyak mahasiswa mengira Node.js adalah bahasa atau framework.
Tegaskan bahwa Node.js tidak menambah sintaksis apa pun; ia hanya menyediakan tempat
menjalankan.

Butir V8 sengaja tinggal di slide sebagai pasangan Indonesia dari baris bawah gambar, karena
nama mesin itu yang membuat mahasiswa percaya bahwa mesin JavaScript di browser bisa dipakai
ulang di luar browser. Baris tengah gambar yang menyebut "a JavaScript runtime outside the
browser" sudah diterjemahkan menjadi kalimat tebal di atas butir.

Sebutkan juga keuntungan ketiga yang tidak lagi ditulis di slide: satu bahasa untuk aplikasi
dan untuk alat pengembangnya, sehingga tidak perlu berpindah bahasa hanya untuk menjalankan
server pengembangan.
-->

---

## npm Mencatat Daftar Paket, Bukan Menyimpannya Sendiri

![w:1120](assets/diagrams/bab-02-persiapan-lingkungan-pengembangan-05.svg)

**npm** (*Node Package Manager*) adalah pengelola paket yang ikut terpasang otomatis bersama Node.js.

**Kalau dikerjakan manual**

- Library disalin sendiri dan rawan salah ketik
- Versi berbeda di tiap komputer dan sulit ditelusuri

<!--
Dipotong ke gambar (diagram yang mengatakan ini):
- Mengunduh paket dari registry npmjs.com
- Mengelola versi dan mencatatnya di `package.json`
- Menyimpan setiap paket di folder `node_modules/`

Dua kolom yang dulu ada di slide ini ikut pindah bersama isinya: kolom "tugasnya" adalah
gambar itu sekarang, dan pada w:1120 slide tidak punya ruang untuk menuliskan tiga tugas yang
sama dua kali tanpa baris terakhir jatuh ke nomor halaman.

Bacakan gambar dari package.json ke node_modules/: catatan versi adalah sumber kebenaran,
npm install adalah satu perintah yang membacanya, dan registry adalah toko daring tempat paket
berasal — bukan folder di komputer mahasiswa.

Analogi: npm seperti perpustakaan yang mencatat setiap buku yang dipinjam, sehingga rak kerja
kamu bisa dibangun ulang kapan saja dari satu daftar.

Tegaskan istilah registry: gudang daring npmjs.com yang menyimpan jutaan paket, bukan folder
di komputer mahasiswa.

Pertanyaan penuntun: "Apa yang terjadi kalau folder node_modules dihapus?" (Jawaban: cukup
jalankan npm install dan seluruh paket terpasang kembali sesuai catatan package.json.)
-->

---

<!-- _class: compact -->

## Kapan Memakai npm install, Kapan npx?

| Aspek | `npm install <paket>` | `npx <perintah>` |
|---|---|---|
| Peran | Memasang paket ke proyek | Menjalankan paket tanpa memasangnya permanen |
| Hasil | Tercatat di `package.json` dan `node_modules/` | Tanpa pemasangan global |
| Contoh | `npm install <nama-paket>` | `npx create-expo-app`, `npx expo start` |
| Nilai tambah | Dependency proyek lengkap | Selalu versi terbaru dari registry |

> Paket JavaScript murni dipasang dengan `npm install`; paket bawaan SDK dipasang dengan `npx expo install`.

<!--
Bandingkan dulu dua kolom di baris Peran; jangan dibaca baris per baris. Baris Contoh adalah
yang paling sering ditanyakan mahasiswa.

Pertanyaan penuntun: "Kenapa create-expo-app dijalankan dengan npx, bukan dipasang lebih
dulu?" (Jawaban: alat ini berubah dari waktu ke waktu, npx selalu mengambil versi terkini dan
tidak menumpuk program yang jarang dipakai di komputer.)

Peringatan: jangan menulis nomor versi di perintah pemasangan; biarkan npm memilih versi yang
cocok dengan SDK.
-->

---

<!-- _class: compact -->

## Tiga Pengelola Paket, Satu Pilihan untuk Kelas Ini

Sepuluh library yang saling bergantung cepat memunculkan masalah yang dikenal sebagai *dependency hell*.

- Mencatat daftar dependency supaya proyek bisa dipasang ulang di komputer lain
- Mengunduh versi yang cocok dan menyimpannya di `node_modules/`

| Pengelola | Ciri Pembeda | Kapan Cocok |
|---|---|---|
| **npm** | Ikut Node.js, paling luas dipakai | Proyek standar — buku ini |
| **yarn** | Lockfile ketat, dari Meta | Tim yang sudah memakai yarn |
| **pnpm** | Hemat disk, berbagi paket | Monorepo atau proyek besar |

<!--
Pesan utamanya: beda npm, yarn, dan pnpm bukan pada kemampuan, melainkan pada strategi
penyimpanan file dan kecepatan.

Tanya: "Kalau ada tiga pilihan, mana yang paling aman untuk kerja tim di kelas?" (Jawaban:
npm, karena ikut terpasang bersama Node.js dan dipakai bawaan oleh create-expo-app — sehingga
beda lockfile antaranggota tim tidak terjadi.)

Peringatan: mencampur pengelola paket dalam satu tim adalah penyebab konflik lockfile,
seperti pada Studi Kasus di akhir bab ini.
-->

---

## VS Code: Menulis, Menjalankan, dan Membaca Error

![w:1120](assets/diagrams/bab-02-persiapan-lingkungan-pengembangan-06.svg)

**VS Code** adalah editor kode sumber gratis buatan Microsoft.

- Penyorotan sintaksis dan pelengkapan otomatis (IntelliSense)
- Pencarian lintas file untuk proyek berisi puluhan file
- Terminal terpadu, tidak perlu berpindah aplikasi

> ESLint + Prettier + terminal Expo sudah cukup untuk seluruh buku ini.

<!--
Dipotong ke gambar (diagram yang mengatakan ini):
- **ESLint** memeriksa kualitas kode; **Prettier** merapikan format saat file disimpan
- **Error Lens** menampilkan pesan error di samping baris bermasalah

Bacakan gambar dari kiri ke kanan sebagai satu kali simpan: Prettier merapikan format, ESLint
memeriksa kode, Error Lens mencetak pesan di samping barisnya. Butir tebal "Ekstensi yang
membantu" adalah judul kolom yang dulu diisi dua butir itu; keduanya sekarang ada di gambar.

Tegaskan alasan fiturnya ada, bukan daftar fiturnya: satu proyek React Native berisi puluhan
hingga ribuan file, jadi editor teks biasa tidak realistis.

Pertanyaan penuntun: "Kenapa Prettier penting dalam kerja tim?" (Jawaban: format kode semua
anggota menjadi seragam, sehingga perubahan di Git lebih mudah dibaca.)

Peringatan versi: ekstensi di marketplace berubah dan sebagian diarsipkan pembuatnya, termasuk
yang dulu populer seperti React Native Tools. Butir ini ditandai sensitif versi di buku:
periksa nama ekstensinya di marketplace saat membaca. Material Icon Theme bersifat opsional,
murni kenyamanan visual.
-->

---

## Dua Perintah yang Membuktikan Lingkunganmu Siap

`Terminal` — dua perintah pemeriksaan wajib

```bash
node --version
npm --version
```

Kalau keduanya mencetak nomor versi, lingkunganmu siap. Buku ini memakai **Node.js LTS**, versi minimal 22.

**Pertanyaan:** apa yang terjadi kalau Node.js belum terpasang atau tidak dikenali?

<!--
Metode mengajar: minta seluruh kelas menjalankan kedua perintah sekarang, lalu angkat tangan
mereka yang tidak melihat nomor versi. Jangan lanjut sebelum persoalannya selesai.

Tegaskan pilihan LTS, bukan Current: LTS dirawat lebih lama sehingga paling stabil untuk
pengembangan, dan itulah yang dipakai buku ini.

Peringatan sensitif versi: nomor versi LTS terbaru berubah dari waktu ke waktu; pakai rilis
LTS terbaru dari website resmi nodejs.org.

Jawaban pertanyaan tadi ada di slide berikutnya — jangan dijawab sekarang.
-->

---

## Kalau Perintahnya Tidak Dikenali, Masalahnya di PATH

![w:1120](assets/diagrams/bab-02-persiapan-lingkungan-pengembangan-07.svg)

- Terminal menjawab `node: command not found` atau `'node' is not recognized`
- Solusi: pasang Node.js LTS dari nodejs.org; di Windows centang opsi "Add to PATH"
- Pencegahan: unduh hanya dari website resmi dan periksa sebelum memulai proyek

<!--
Dipotong ke gambar (diagram yang mengatakan ini):
- Penyebab: Node.js belum terpasang, atau pemasangannya tidak tercatat di PATH
- Setelah memasang, **buka terminal baru** — terminal lama belum membaca PATH yang baru

Telusuri tiga keadaannya: "perintah tidak ditemukan", lalu "PATH belum dimuat" saat LTS baru
dipasang sementara terminal lama masih terbuka, lalu "nomor versi tercetak" setelah terminal
baru dibuka. Lingkar merah adalah langkah yang justru diambil mahasiswa: memasang ulang
membawa kembali ke keadaan yang sama, karena pemasangannya memang bukan masalahnya.

PATH adalah daftar folder tempat sistem operasi mencari perintah; gambarkan sebagai "buku
alamat" milik terminal. Masalah paling sering bukan pemasangan, melainkan terminal lama yang
belum memuat PATH.

Pertanyaan penuntun: "Kenapa menutup lalu membuka terminal bisa memperbaikinya?" (Jawaban:
terminal baru membaca PATH yang sudah diperbarui; terminal lama masih memakai daftar lama.)

Peringatan: mahasiswa sering memasang ulang Node.js berkali-kali padahal cukup membuka
terminal baru.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Bagian 2 — Expo, Alat Uji & Proyek Pertama

subbab 2.4 Expo dan Expo Go · 2.5 Emulator · 2.6 iOS Simulator · 2.7–2.9 proyek pertama

<!--
Bagian ini inti praktikum hari ini: dari gagasan alat uji sampai aplikasi pertama muncul di
layar.

Kalau waktu hanya cukup untuk satu bagian, pilih bagian ini dan pindahkan pembahasan struktur
folder ke tugas mandiri.
-->

---

## Expo CLI Dijalankan Lewat npx, Tanpa Pemasangan Global

![w:660](assets/diagrams/bab-02-persiapan-lingkungan-pengembangan-08.svg)

**Expo CLI** adalah antarmuka baris perintah untuk membuat, menjalankan, dan mengelola proyek Expo.

- `npx create-expo-app` — membuat proyek baru
- `npx expo start` — menjalankan development server
- `npx expo install <paket>` — menambah paket bawaan SDK dengan versi yang cocok

<!--
Tegaskan bahwa setiap perintah dijalankan lewat npx: tidak ada pemasangan global yang harus
diurus dan versi alatnya selalu segar.

Pertanyaan penuntun: "Nanti npx expo install dipakai untuk apa?" (Jawaban: memasang paket
bawaan SDK, misalnya kamera di Bab 12, supaya versinya otomatis cocok dengan SDK.)

Peringatan: npm install tetap benar untuk paket JavaScript murni; jangan tertukar, karena
salah cara memasang adalah sumber error versi yang sulit ditelusuri.
-->

---

## Expo Go Cepat, tetapi Tidak Semua Fitur Bisa Diuji

![w:1120](assets/diagrams/bab-02-persiapan-lingkungan-pengembangan-09.svg)

- HP cukup berada di jaringan Wi-Fi yang sama dengan komputer
- Tidak membawa kode native sendiri, jadi fitur khusus butuh *development build* (Bab 15)

<!--
Dipotong ke gambar (diagram yang mengatakan ini):
- Aplikasi di HP berperan sebagai "pemutar" proyek: pindai kode QR
- Tanpa proses build, hasilnya terlihat dalam hitungan detik
- Hanya mendukung API yang tersedia di paket Expo

Bacakan gambar sebagai pertukaran: panel kiri adalah yang dibeli oleh kecepatan, panel kanan
adalah harganya. Kedua baris tidak berpasangan satu lawan satu — harga seluruh kolom kiri
adalah seluruh kolom kanan. Dua butir yang tinggal membawa rincian yang tidak muat di panel:
syarat Wi-Fi dan penunjuk ke development build di Bab 15.

Analogi: build tradisional seperti mencetak buku sebelum bisa dibaca; Expo Go seperti membaca
naskah langsung dari layar penulisnya.

Pertanyaan penuntun: "Kapan Expo Go tidak lagi cukup?" (Jawaban: saat aplikasi butuh kode
native sendiri atau pengujian yang mendekati produksi, sehingga perlu development build di
Bab 15.)

Peringatan sensitif versi: SDK 57 baru saja dirilis, jadi Expo Go di Google Play dan App Store
bisa masih menunggu persetujuan. Sementara itu, pasang lewat eas go untuk perangkat iOS atau
lewat fasilitas Expo CLI untuk Android dan emulator sesuai petunjuk resmi di docs.expo.dev;
mekanisme ini bisa berubah kapan saja.
-->

---

## Metro Membundel Kode, Perangkat Hanya Menerima Hasilnya

![w:1120](assets/diagrams/bab-02-persiapan-lingkungan-pengembangan-02.svg)

> Laptopmu menjadi "dapur"; perangkat hanya menerima hidangan yang sudah matang.

<!--
Bacakan alurnya dari kiri ke kanan: Metro membaca setiap modul yang diimpor, membundelnya, lalu
mengirimkannya ke perangkat lewat jaringan pada port bawaan 8081.

Tegaskan Fast Refresh: perubahan yang disimpan langsung terlihat tanpa kehilangan state yang
sedang berjalan, dan pengalaman itu akan terasa di Praktikum 2.

Pertanyaan penuntun: "Kenapa perangkat tidak perlu tahu kode asli aplikasinya?" (Jawaban: yang
dikirim adalah bundle hasil kerja Metro, bukan file sumbernya.)
-->

---

<!-- _class: compact -->

## Tiga Jalur Menguji Aplikasi, Tiga Trade-off

| Jalur | Persiapan | Kecepatan dan kesetiaan |
|---|---|---|
| **Expo Go** (Wi-Fi) | Satu Wi-Fi dengan komputer | Paling cepat; HP sungguhan |
| **Emulator** | Perangkat virtual dibuat dulu | Lebih lambat; sensor terbatas |
| **Perangkat fisik** | USB debugging diaktifkan | Paling meyakinkan; sensor nyata |

> Untuk pengembangan harian, jalur Wi-Fi + Expo Go lebih praktis karena tidak bergantung pada kabel.

<!--
Bandingkan kolom terakhir lebih dulu, karena itulah alasan memilih satu jalur, bukan kolom
persiapan.

Pertanyaan penuntun: "Kelompokmu akan menguji fitur kamera di Bab 12; jalur mana yang kamu
pilih?" (Jawaban: perangkat fisik, karena emulator tidak mewakili sensor sungguhan.)

Peringatan: emulator memakan memori komputer cukup besar; laptop dengan RAM 8 GB ke atas
disarankan, dan emulator dijalankan sebelum npx expo start.
-->

---

<!-- _class: center -->

## Apa yang Terjadi Jika…?

HP dan komputer berada di **jaringan berbeda** — kode QR tidak bisa tersambung.

- Yang gagal: kodenya, jaringannya, atau perangkatnya?
- Solusi apa yang tersedia tanpa mengubah pengaturan jaringan kampus?
- Kecepatan apa yang harus dibayar untuk solusi itu?

<!--
Tanya dulu, jangan dijawab: tampung dua atau tiga dugaan, lalu lanjut ke slide berikutnya.
Pertanyaan ini menguji apakah mahasiswa paham bahwa aplikasi dikirim lewat jaringan, bukan
dipasang dari kabel.

Pemicu bila kelas diam: "Wi-Fi kampus biasanya memblokir komunikasi antardevice; kalau
begitu, apa yang masih bisa kita pakai?"

Jawaban yang diharapkan ada di slide berikutnya: yang gagal adalah jaringan, dan
npx expo start --tunnel menjadi solusinya.
-->

---

<!-- _class: center -->

## Jawabannya: yang Gagal Jaringannya, Bukan Kodenya

- Yang gagal adalah **jaringan**, bukan kode: Metro dan HP tidak bisa saling menjangkau
- Hentikan server (**Ctrl+C**), lalu jalankan `npx expo start --tunnel`
- Opsi `--tunnel` menjembatani koneksi lewat server publik; jaringan tidak diubah
- Harganya: transfer lebih lambat dan butuh koneksi internet yang stabil

<!--
Hubungkan dengan slide diagnosis: baris "kode QR tidak bisa tersambung" adalah kasus yang
sama, jadi jawaban ini bukan pengetahuan baru melainkan pola diagnosis.

Tegaskan bahwa tunnel adalah jalan cadangan, bukan kebiasaan harian; untuk kerja harian,
jaringan Wi-Fi yang sama tetap lebih cepat.

Pertanyaan penutup: "Kapan kamu memilih tunnel alih-alih Wi-Fi kelas?" (Jawaban: saat jaringan
memblokir komunikasi antardevice, misalnya hotspot HP.)
-->

---

## Emulator Android: Satu Komputer, Banyak Versi Android

![w:1034](assets/diagrams/bab-02-persiapan-lingkungan-pengembangan-10.svg)

**Emulator** adalah program yang meniru perilaku HP Android di dalam komputer.

- Kelebihan: menguji banyak versi Android hampir tanpa biaya
- Batasan: lebih lambat, boros memori, sebagian sensor tidak didukung

<!--
Dipotong ke gambar (diagram yang mengatakan ini):
- **Android Studio** — IDE Android resmi, tempat emulator dikelola
- **AVD Manager** — membuat perangkat virtual: pilih model HP dan versi Android

Bacakan gambar sebagai wadah, bukan urutan: IDE memuat emulator dan AVD Manager, lalu AVD
Manager meminta dua hal — model HP dan versi Android. Dua butir yang tinggal adalah trade-off
yang tidak bisa ditunjukkan wadah.

Analogi: emulator seperti simulator penerbangan — cukup realistis untuk latihan dasar, tetapi
tidak menggantikan penerbangan sungguhan.

Pertanyaan penuntun: "Kenapa pengembang tidak membeli banyak HP untuk menguji lintas versi?"
(Jawaban: emulator memungkinkan pengujian berbagai versi Android tanpa biaya perangkat.)

Peringatan: AVD yang belum pernah dibuat membuat tombol a di terminal Expo tidak melakukan
apa pun, dan itu bukan kesalahan kode mahasiswa.
-->

---

## adb Menghubungkan Komputer ke Perangkat Android

![w:1120](assets/diagrams/bab-02-persiapan-lingkungan-pengembangan-11.svg)

- **adb** — jembatan baris perintah antara komputer dan perangkat Android
- Untuk Expo Go, sambungan USB tidak wajib — satu jaringan Wi-Fi sudah cukup

<!--
Dipotong ke gambar (diagram yang mengatakan ini):
- `adb devices` menampilkan perangkat yang dikenali komputer
- Aktifkan Opsi pengembang: ketuk *Build number* tujuh kali di *About phone*
- Aktifkan *USB debugging*, lalu izinkan autentikasi RSA saat HP meminta

Gambar adalah urutannya, dari kiri ke kanan: Opsi pengembang, lalu USB debugging, lalu
permintaan RSA, lalu `adb devices` menampilkan perangkat. Dua butir yang tinggal adalah yang
tidak bisa dimuat rantai itu — untuk apa adb, dan pengecualian bahwa kabel tidak diperlukan
untuk Expo Go.

Jelaskan urutan yang sering terbalik: Opsi pengembang dulu, lalu USB debugging, baru
menyambungkan kabel. Demonstrasikan kalau ada HP di kelas.

Pertanyaan penuntun: "Kapan adb benar-benar diperlukan?" (Jawaban: saat memastikan emulator
atau HP dikenali komputer sebelum menjalankan aplikasi, misalnya ketika tombol a tidak membuka
apa pun.)

Peringatan: kabel yang hanya mengisi daya tanpa jalur data adalah penyebab tersembunyi; status
unauthorized berarti HP belum menyetujui autentikasi komputer.
-->

---

## iOS Simulator Hanya Hidup di macOS

![w:1120](assets/diagrams/bab-02-persiapan-lingkungan-pengembangan-12.svg)

**iOS Simulator** adalah program yang meniru iPhone atau iPad di dalam komputer.

- Windows dan Linux tidak bisa menjalankannya sama sekali
- Alternatif: iPhone fisik dengan Expo Go, atau *build* awan dengan EAS Build (Bab 15)
- Di Mac, tekan **i** di terminal Expo untuk membukanya

<!--
Dipotong ke gambar (diagram yang mengatakan ini):
- Hanya berjalan di **macOS** dan menuntut **Xcode**, yang ukurannya sangat besar

Tiga pita itu adalah jawaban atas "kenapa Windows dan Linux tidak bisa menjalankannya sama
sekali": Simulator berdiri di atas Xcode, Xcode berdiri di atas macOS. Butir yang tinggal
adalah ketiadaan yang tidak bisa digambar tumpukan itu, dan dua alternatif di bawahnya adalah
jalan keluarnya.

Pesan pentingnya bukan soal alat, melainkan pola pikir: pengembangan lintas platform tidak
berarti setiap orang harus memiliki semua perangkat.

Pertanyaan penuntun: "Bagaimana mahasiswa pengguna Windows menguji tampilan di iOS?"
(Jawaban: meminjam iPhone dan memasang Expo Go di jaringan yang sama, atau menyerahkan build
ke layanan awan di Bab 15.)

Peringatan: jangan menjanjikan pengujian iOS lengkap di kelas yang tidak punya Mac.
-->

---

## Alur Membuat Proyek: Enam Langkah, Tidak Boleh Melompat

![w:1120](assets/diagrams/bab-02-persiapan-lingkungan-pengembangan-03.svg)

> Selesaikan langkah yang gagal sebelum melanjutkan ke langkah berikutnya.

<!--
Bacakan sebagai urutan kerja praktikum hari ini, lalu tuliskan urutannya di papan sebagai
daftar periksa yang dicentang satu per satu. Bacakan gambar sebagai dua baris (menyiapkan, lalu
menjalankan); tunjuk langkah 4 (`code .`) sebagai langkah yang sama dengan baris perintah di
slide berikutnya.

Pertanyaan penuntun: "Langkah mana yang boleh dilewati kalau kamu hanya ingin melihat
aplikasinya di emulator?" (Jawaban: tidak ada yang boleh dilewati, tetapi langkah 6 dijalankan
dengan menekan a, bukan memindai kode QR.)

Peringatan: melewati langkah 1 adalah kebiasaan paling sering dan penyebab error berantai di
langkah sesudahnya.
-->

---

## Empat Perintah dari Folder Kosong sampai Aplikasi Jalan

![w:1120](assets/diagrams/bab-02-persiapan-lingkungan-pengembangan-13.svg)

```bash
npx create-expo-app aplikasi-pertama --template blank
cd aplikasi-pertama
code .
npx expo start
```

- `cd` masuk ke folder proyek, `code .` membuka VS Code

<!--
Dipotong ke gambar (diagram yang mengatakan ini):
- `npx` menjalankan versi terbaru `create-expo-app` tanpa memasangnya secara global

Gambar membacakan perintahnya bagian per bagian — npx, nama proyek, template — dengan tugas
masing-masing di sebelah kanan. Hanya satu butir yang tinggal di bawah gambar, dan itu sengaja
memilih hal yang tidak digambar: cd dan code . pada dua baris perintah tengah.

Baris pembuka ikut pindah ke catatan ini, karena pada w:1120 panelnya melewati tepi bawah 60px:
- `Terminal` — dari folder kerja sampai server berjalan

Tegaskan membaca perintah, bukan menghafalnya: npx, nama proyek, lalu template. Proses
pembuatan makan waktu satu sampai beberapa menit karena npm mengunduh setiap dependency.

Jelaskan dua perintah itu secara lisan: cd memindahkan terminal ke folder proyek, dan code .
meminta VS Code membuka folder yang aktif. Kalau code . tidak dikenali, buka lewat menu File
lalu Open Folder. Sebutkan juga bahwa nama folder proyek sebaiknya huruf kecil dan tanpa spasi.

Pertanyaan penuntun: "Kenapa setiap perintah berikutnya dijalankan dari dalam folder proyek?"
(Jawaban: npm dan Expo membaca package.json di folder yang aktif.)
-->

---

<!-- _class: compact -->

## Kenapa Template blank, Bukan Template Bawaan?

| Aspek | `--template blank` | Tanpa opsi (template bawaan) |
|---|---|---|
| Bahasa | JavaScript biasa di file `.js` | TypeScript di file `.tsx` |
| Navigasi | Tanpa Expo Router | Expo Router sudah disertakan |
| Kecocokan | Sesuai keputusan buku: JavaScript biasa | Menambah konsep yang belum perlu |
| Fokus belajar | Struktur paling sederhana | Navigasi baru dibahas di Bab 7 |

> Bab 3 membahas alasan pemilihan JavaScript; navigasi berbasis file baru dipelajari di Bab 7.

<!--
Ini keputusan penulisan buku, bukan sekadar selera: setiap contoh kode di buku ini memakai
JavaScript biasa, jadi template bawaan yang berbasis TypeScript akan membuat mahasiswa
bertemu anotasi tipe yang belum diajarkan.

Pertanyaan penuntun: "Apa akibatnya kalau kita keliru memakai template bawaan?" (Jawaban:
proyek berisi file .tsx dan Expo Router yang belum diperlukan pada tahap ini, sehingga
mahasiswa belajar dua hal sekaligus.)

Peringatan sensitif versi: perilaku template bisa berubah antarversi Expo; kalau ragu,
periksa keterangan template di docs.expo.dev atau jalankan perintah bantuan create-expo-app.
-->

---

## Menjalankan Development Server dan Membaca Layarnya

![w:1120](assets/diagrams/bab-02-persiapan-lingkungan-pengembangan-14.svg)

`Terminal` — jalankan dari dalam folder proyek

```bash
npx expo start
```

- **a** Android · **i** iOS Simulator (macOS) · **w** web · **r** muat ulang manual
- **Ctrl+C** menghentikan development server

> Simpan perubahan di App.js; layar berubah dalam 1–2 detik (Fast Refresh).

<!--
Dipotong ke gambar (diagram yang mengatakan ini):
- Muncul kode QR, alamat LAN seperti `exp://192.168.x.x:8081`, dan tombol pintasan

Bacakan rantainya dari kiri ke kanan: perintah membuka terminal Expo, terminal membawa kode QR
dan alamat LAN, satu tombol memilih sasaran, dan tampilan mengikuti hasil simpan. Dua butir
yang tinggal membawa yang tidak dimuat rantai itu: tombol r dan Ctrl+C.

Demonstrasikan langsung di proyektor alih-alih menjelaskan: tunjukkan antarmuka terminal Expo
dan tunjuk setiap bagiannya, terutama alamat LAN yang membuktikan Metro bekerja.

Pertanyaan penuntun: "Kenapa alamat exp:// penting bagi mahasiswa yang memakai HP?" (Jawaban:
itulah alamat tempat Metro menyajikan aplikasi, dan HP harus berada di jaringan yang sama.)

Peringatan: jangan menutup terminal Expo selama praktikum; menutupnya mematikan Metro dan
aplikasi di HP kehilangan sambungan.
-->

---

<!-- _class: compact -->

## Enam Perintah yang Paling Sering Kamu Pakai

| Perintah | Fungsi |
|---|---|
| `node --version` / `npm --version` | Memeriksa versi Node.js/npm |
| `npx create-expo-app <nama> --template blank` | Membuat proyek Expo JavaScript |
| `npx expo start` | Menjalankan Metro Bundler |
| `npx expo start --tunnel` | Server lewat tunnel publik |
| `npx expo start --port 8082` | Port lain bila 8081 terpakai |
| `adb devices` | Menampilkan perangkat Android |

<!--
Slide ini adalah rujukan yang boleh difoto mahasiswa; jangan dibacakan satu per satu.

Yang tidak ada di tabel: tombol pintasan a, i, w, r
dan Ctrl+C di terminal Expo, perintah cd dan code ., npx expo start --android untuk langsung
membuka emulator, serta opsi pembersihan cache pada perintah start.

Pertanyaan penuntun: "Kapan opsi --tunnel dipakai?" (Jawaban: saat HP dan komputer tidak berada
di satu jaringan, misalnya Wi-Fi kampus yang memblokir komunikasi antardevice.)
-->

---

## Isi Folder Proyek: Delapan Entri, Tiga yang Sering Disentuh

`aplikasi-pertama/` — hasil `create-expo-app --template blank`

```plaintext
aplikasi-pertama/
├── assets/
├── node_modules/
├── .gitignore
├── App.js
├── app.json
├── index.js
└── package.json
```

<!--
Minta mahasiswa membuka panel Explorer di VS Code dan mencocokkan strukturnya dengan slide ini,
bukan menghafalnya.

Peringatan sensitif versi: isi template bisa berbeda antarversi SDK, misalnya nama aset ikon
atau file tambahan. Kalau struktur mahasiswa tidak sama persis, itu normal; yang harus
dipahami adalah peran file intinya.

Setelah npx expo start dijalankan, muncul folder .expo yang menyimpan pengaturan lokal dan
informasi perangkat; folder itu dibuat otomatis dan tidak perlu disentuh.
-->

---

<!-- _class: compact -->

## Peran File Inti: Identitas, Titik Masuk, Pendukung

| File / Folder | Perannya |
|---|---|
| `App.js` | Komponen utama aplikasi — file yang paling sering kamu ubah |
| `index.js` | Titik masuk; memanggil `registerRootComponent` |
| `app.json` | Konfigurasi proyek: nama, slug, versi, orientasi, ikon |
| `package.json` | Nama proyek, daftar skrip, dan dependency versi pasti |
| `assets/` | Aset statis: ikon aplikasi dan gambar bawaan template |
| `node_modules/` | Semua paket unduhan npm; tidak diedit dan tidak dilacak Git |

<!--
Kelompokkan perannya menjadi tiga fungsi: identitas proyek (app.json, package.json), titik
masuk aplikasi (index.js, App.js), dan isi pendukung (assets, node_modules).

Pertanyaan penuntun: "Kenapa node_modules tidak pernah diedit dan tidak pernah dilaporkan ke
Git?" (Jawaban: isinya bisa dipasang ulang kapan saja dengan npm install, jadi menyimpannya
hanya memperbesar repositori.)

Peringatan: jangan mengedit package.json dengan tangan kecuali paham akibatnya; pakai perintah
npm atau npx expo install.

File .gitignore memuat pola yang dikecualikan Git, misalnya node_modules dan .expo.
-->

---

## package.json Memanggil index.js, index.js Memanggil App.js

![w:1120](assets/diagrams/bab-02-persiapan-lingkungan-pengembangan-04.svg)

> Urutan pemanggilannya sederhana: `package.json` menunjuk `index.js`, `index.js` mendaftarkan `App.js`, dan `App.js` menggambar tampilan.

<!--
Tegaskan bahwa alur ini menjelaskan kenapa App.js adalah file yang paling sering diubah: ia
titik masuk tampilan.

Pertanyaan penuntun: "Kalau index.js dihapus, apa yang terjadi?" (Jawaban: Metro tidak
menemukan titik masuk, aplikasi gagal dimuat walaupun App.js masih ada.)

Peringatan: konsep import dan export baru dibahas tuntas di Bab 3; untuk sekarang cukup paham
alurnya, jangan menjelaskan modul panjang lebar di sini.
-->

---

## Tiga Komponen Sudah Cukup untuk Layar Pertama

`kode/bab-02-persiapan-lingkungan-pengembangan/App.js`

```js
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.kontainer}>
      <Text style={styles.judul}>Halo, Dunia!</Text>
      <Text style={styles.keterangan}>
        Project Expo pertama saya berhasil berjalan di perangkat.
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
```

<!--
Objek `styles` (`StyleSheet.create`) ada di file lengkap
`kode/bab-02-persiapan-lingkungan-pengembangan/App.js`; kutipan di slide ini berhenti tepat
sebelum bagian itu.

Kode ini mengikuti pola template resmi SDK 57 dan kenyataannya belum dijalankan di emulator
oleh tim penyusun; sampaikan secara netral bahwa mahasiswa perlu mengujinya sendiri.

Tunjukkan tiga hal saja: dua baris import meminjam alat dari paket, View adalah kotak wadah,
Text adalah teks yang tampil. View, Text, dan StyleSheet dibahas mendalam di Bab 5, jadi di
sini cukup meniru polanya.

Pertanyaan penuntun: "Bagian mana yang boleh kamu ubah hari ini?" (Jawaban: isi teks di dalam
Text judul dan keterangan, lalu simpan untuk melihat Fast Refresh bekerja.)
-->

---

## Studi Kasus: Tiga Mahasiswa Magang, Satu Lingkungan yang Tidak Baku

**Contoh ilustratif dengan pola nyata.** Tiga mahasiswa magang di Divisi Sistem Informasi kampus mengerjakan prototipe aplikasi pengumuman akademik.

- Satu magang memakai Node versi lama dari tutorial tahun lalu
- Satu lagi memakai yarn, sehingga lockfile-nya berbeda dari rekannya
- Aplikasi jalan di satu laptop dan gagal di laptop lain

> Versi runtime yang berbeda adalah sumber error yang samar, bukan sekadar peringatan.

<!--
Bacakan sebagai cerita, bukan sebagai daftar: seminggu terbuang untuk menyamakan versi sebelum
satu baris kode pun ditulis. Inilah bentuk masalah yang ingin dicegah bab ini.

Tegaskan istilah reproducibility: kemampuan memasang ulang proyek yang sama di komputer lain.
Itu adalah benih kebiasaan pengelolaan lingkungan yang dibutuhkan untuk Project Akhir,
Aplikasi Manajemen Data Mahasiswa.

Pertanyaan penuntun: "Apa satu langkah termurah supaya kasus ini tidak terulang?" (Jawaban:
menuliskan langkah penyiapan dan mencatat versi alat di dokumentasi tim.)

Peringatan: kasus ini ilustratif, disusun dari pola nyata di bab ini, bukan data kampus
sungguhan.
-->

---

## Studi Kasus: Tiga Masalah, Tiga Senjata dari Bab Ini

| Masalah minggu pertama | Senjata dari bab ini |
|---|---|
| Node versi lama dari tutorial tahun lalu | **Baku platform**: Node.js LTS yang sama, diperiksa dengan `node --version` |
| yarn di satu laptop, npm di laptop lain | **Satu pengelola paket**: npm seragam, hindari beda lockfile |
| Jalan di satu laptop, gagal di laptop lain | **npx, bukan pemasangan global**: versi selalu dari registry |

> **Reproducibility** berarti proyek yang sama bisa dipasang ulang di komputer lain.

<!--
Bacakan kolom masalah lebih dulu, minta kelas menebak senjata yang cocok untuk setiap masalah,
baru buka kolom kanan.

Lanjutkan dengan diskusi singkat: "Siapa yang pernah mengalami 'di laptopku jalan, di laptopmu
tidak'?" lalu "Apa yang akan kamu bakukan lebih dulu di proyek tim berikutnya?"
Kumpulkan dua atau tiga jawaban dan tuliskan usulan kebiasaan tim di papan supaya bisa dipakai
di Project Akhir.

Kalau jawaban lemah, arahkan ke tiga hal: catat versi alat, pilih satu pengelola paket, dan
jangan bergantung pada pemasangan global.

Yang dinilai bukan panjang jawaban, melainkan kemampuan menghubungkan sebab dengan pencegahan.
-->

---

## Praktikum: Yang Dibangun Pertemuan Ini

- Pasang **Node.js LTS** dari nodejs.org — pilih label LTS, bukan Current
- Pasang **Visual Studio Code** sebagai editor kode
- Buat **akun Expo** di expo.dev sebagai syarat layanan pengembangan
- Jalankan `npx create-expo-app aplikasi-pertama --template blank`, lalu `npx expo start`
- Ubah teks di `App.js` dan simpan untuk melihat Fast Refresh bekerja
- Kumpulkan tangkapan layar aplikasi sebagai bukti praktikum

> Kalau satu langkah gagal, jangan lanjut — selesaikan dulu lewat slide diagnosis di bawah.

<!--
Ingatkan memilih LTS, bukan Current: kesalahan paling umum di praktikum, karena perilaku npm
dan Expo CLI bisa berbeda dari yang dibahas buku.

Mahasiswa yang memakai komputer laboratorium kampus harus berkoordinasi dengan pengelola lab
sebelum jadwal praktikum (Node.js LTS dan VS Code wajib tersedia).

Sebutkan juga bahwa project aplikasi-pertama disimpan; ia dipakai lagi di beberapa bab
berikutnya.
-->

---

## Yang Harus Teramati

Untuk praktikum ini, catat lima hal:

- Dua nomor versi muncul saat `node --version` dan `npm --version` dijalankan
- Folder `aplikasi-pertama` terbuat tanpa error
- `npx expo start` menampilkan kode QR dan alamat `exp://...:8081`
- Teks "Halo, Dunia!" tampil di Expo Go atau emulator Android
- Perubahan di App.js mengubah layar dalam 1–2 detik (Fast Refresh)

> Laporan yang baik menyertakan tangkapan layar dan nomor versi, bukan hanya tulisan "berhasil".

<!--
Jadikan daftar ini lembar centang: mahasiswa mencentang setiap butir lalu melampirkan tangkapan
layar sebagai bukti praktikum sesuai rubrik.

Sengaja merusak kode juga latihan yang berharga: hapus satu tanda kutip, simpan, lihat layar
error merah, lalu kembalikan kodenya. Tujuannya melatih membaca pesan error.

Pertanyaan penuntun: "Apa arti layar merah itu?" (Jawaban: kesalahan pembundelan Metro, bukan
kerusakan perangkat, dan baris pertama pesannya menyebut file beserta nomornya.)
-->

---

<!-- _class: compact -->

## Empat Gejala yang Bisa Kamu Diagnosis Sendiri (1/2)

| Gejala | Penyebab | Solusi |
|---|---|---|
| `node: command not found` | Belum terpasang atau tidak di PATH | Pasang Node.js LTS, buka terminal baru |
| Port 8081 sedang dipakai | Aplikasi lain memakai port Metro | Tutup aplikasi itu atau pakai 8082 |
| Layar merah saat menyimpan | Sintaksis keliru atau modul tidak ada | Baca baris pertama error, hapus cache |
| Tombol **a** tidak bereaksi | Emulator belum berjalan | Jalankan AVD di Android Studio |

<!--
Ajarkan urutannya: baca pesan error, kenali lapisan mana yang gagal, baru bertindak. Melompat
ke solusi tanpa membaca pesan adalah kebiasaan yang paling mahal.

Pertanyaan penuntun: "Kenapa membersihkan cache Metro kadang perlu?" (Jawaban: cache bisa
menyimpan versi lama kode atau modul, sehingga perubahan tidak tampil.)

Peringatan: jangan menyarankan memasang ulang seluruh proyek sebelum memeriksa pesan error;
itu menghapus petunjuk paling berharga.
-->

---

<!-- _class: compact -->

## Empat Gejala yang Bisa Kamu Diagnosis Sendiri (2/2)

| Gejala | Penyebab | Solusi |
|---|---|---|
| `adb devices` kosong atau `unauthorized` | USB debugging belum aktif atau ditolak | Aktifkan, izinkan autentikasi, ganti kabel |
| Perubahan kode tidak muncul | Fast Refresh gagal atau cache basi | Tekan **r**; bila tetap, hapus cache |
| Proyek tidak cocok dengan Expo Go | Versi SDK dan Expo Go berbeda | Samakan versi, periksa `npx expo-doctor` |
| Kode QR tidak bisa tersambung | HP dan komputer beda jaringan | Jalankan ulang dengan `--tunnel` |

<!--
Hubungkan setiap baris dengan slide sebelumnya: masalah jaringan, masalah perangkat, dan
masalah versi SDK. Ketiganya adalah penyebab paling sering di kelas.

Pertanyaan penuntun: "Kapan npx expo-doctor dipakai?" (Jawaban: saat kamu tidak yakin apakah
proyek sehat dan paketnya cocok dengan SDK yang dipakai.)

Peringatan: opsi tunnel lebih lambat daripada jaringan lokal dan butuh koneksi internet yang
stabil; simpan sebagai cadangan, bukan kebiasaan harian.
-->

---

<!-- _class: center -->

## Kuis Kilat

- Alat apa yang wajib terpasang sebelum menjalankan `npx create-expo-app`?
- Apa beda `npm install <paket>` dengan `npx <perintah>`?
- Kenapa buku ini memilih `--template blank`?
- Apa peran Metro Bundler saat `npx expo start` dijalankan?
- Port bawaan apa yang dipakai Metro Bundler?

<!--
Kuis lisan 5 menit: tampilkan pertanyaan, minta kelas menjawab serempak atau dengan mengangkat
tangan, lalu lanjut ke slide kunci. Jangan bocorkan jawaban di slide ini.

Kelima pertanyaan ini diambil dari bagian pilihan ganda Evaluasi Bab 2; pakai sebagai
pemeriksaan cepat sebelum menutup pertemuan.

Kalau jawaban kelas beragam di pertanyaan ketiga, ulangi slide template blank sebelum menutup
pertemuan.
-->

---

<!-- _class: center -->

## Kunci Kuis Kilat

- Node.js — wajib ada sebelum alat Expo bisa dijalankan
- `npm install` memasang paket ke proyek; `npx` menjalankannya tanpa pemasangan permanen
- `blank` menghasilkan JavaScript biasa, sedangkan template bawaan memakai TypeScript
- Ia membundel modul JavaScript lalu mengirimkannya ke perangkat
- Port bawaan Metro Bundler adalah **8081**

<!--
Ulangi pembedaan yang paling sering tertukar: npm memasang, npx menjalankan.

Minta satu nomor lagi secara acak untuk memastikan kelas benar-benar mengikuti, lalu tutup
dengan menghubungkan jawaban kelima ke pesan troubleshooting tentang port 8081.
-->

---

## Ringkasan

1. Node.js adalah runtime JavaScript di luar browser — prasyarat Expo CLI dan Metro
2. npm mengelola dependency di `package.json`; `npx` menjalankan perintah tanpa memasang
3. VS Code + ESLint + Prettier adalah meja kerjanya; Expo Go menguji tanpa *build*
4. Emulator untuk uji lintas versi; perangkat fisik untuk sensor dan pengalaman nyata
5. `--template blank` = JavaScript biasa; `npx expo start` menjalankan Metro di port 8081

<!--
Jangan dibacakan. Minta mahasiswa memilih satu nomor dan menjelaskannya dengan kata-kata
sendiri — ini bekerja lebih baik daripada mengulang bacaan.

Lengkapi secara lisan: iOS Simulator hanya tersedia di macOS, dan reproducibility dicapai
dengan membakukan versi serta pengelola paket.

Pesan penutup: mulai hari ini, setiap aplikasi yang gagal dilihat sebagai pesan yang harus
dibaca, bukan kemalangan.
-->

---

## Referensi

| Sumber | Link |
|---|---|
| Dokumentasi Node.js (2026) | nodejs.org |
| Dokumentasi Expo (2026) | docs.expo.dev |
| Dokumentasi React Native (2026) | reactnative.dev |

**Bacaan lanjutan:** Bab 3 — JavaScript Modern untuk React Native

**Versi teknologi:** Expo SDK 57 · React Native 0.86 · React 19.2 · Node.js ≥ 22

<!--
Rujukan lengkap ada di Lampiran D, dan glosarium istilah di Lampiran C memuat entri seperti
Dependency, Emulator, Metro Bundler, npm, dan Node.js.

Sumber utama bab ini tetap dokumentasi resmi, bukan tutorial pihak ketiga yang versinya tidak
diketahui.

Ingatkan bahwa bagian yang ditandai sensitif versi di buku harus dicocokkan dengan dokumentasi
resmi sebelum dipakai di kelas berikutnya.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Siap ke Bab 3

**Tugas:** kumpulkan laporan Praktikum 2 — tangkapan layar aplikasi di Expo Go atau emulator, catatan versi Node.js dan npm, serta daftar periksa troubleshooting.

Pertemuan berikutnya: JavaScript modern — variabel, tipe data, dan fungsi.

<!--
Tutup dengan satu kalimat: "Hari ini kita menghidupkan mesinnya; mulai Bab 3 kita mulai
menulis bahasanya."

Sebutkan tenggat laporan praktikum secara eksplisit dan penilaiannya mengikuti rubrik
praktikum: pemahaman konsep, implementasi, kualitas kode, UI/UX, debugging, dan dokumentasi.

Pesan terakhir: simpan project aplikasi-pertama karena ia dipakai lagi di beberapa bab
berikutnya.
-->
