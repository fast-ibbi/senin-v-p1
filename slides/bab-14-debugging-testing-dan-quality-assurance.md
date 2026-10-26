---
marp: true
theme: academic
paginate: true
title: "Bab 14 — Debugging, Testing, dan Quality Assurance"
description: "Slide kuliah Pemrograman Mobile, pertemuan 15: console dan React Native DevTools, error React Native yang umum, debugging jaringan, unit testing dengan node:test, integration testing, pengujian manual dan usability, serta checklist QA."
author: "Dosen Mata Kuliah — Program Studi Sistem Informasi / Teknik Informatika"
footer: "Pemrograman Mobile · Bab 14 — Debugging, Testing, dan Quality Assurance"
size: 16:9
---

<!-- _class: lead -->
<!-- _paginate: skip -->
<!-- _footer: "" -->

# Bab 14 — Debugging, Testing, dan Quality Assurance

Dari aplikasi yang "jalan" ke aplikasi yang benar · Pertemuan 15

<!--
Buka dengan satu kalimat: "Bab ini tidak menambah fitur satu pun, tetapi ia yang menentukan
apakah fitur yang sudah kamu bangun layak dipercaya."

Pertanyaan pembuka: "Kalau aplikasimu lancar di emulatormu sendiri, apakah itu berarti
aplikasinya benar?" Tampung dua sampai tiga jawaban tanpa dikoreksi dulu — jawabannya ada di
subbab 14.6 dan 14.7.

Peringatan waktu: pertemuan 15 memuat dua bab sekaligus (Bab 14 dan Bab 15). Jaga bab ini
selesai dalam separuh waktu pertama, karena praktikumnya yang paling banyak memakan menit.
-->

---

## Tujuan Pembelajaran

Setelah bab ini, kamu bisa:

- Menjelaskan peran debugging, testing, dan QA dalam siklus hidup aplikasi
- Mengidentifikasi fungsi console dan fitur React Native DevTools
- Menganalisis error umum React Native beserta penyebab dan solusinya
- Menerapkan unit test fungsi murni dengan `node:test`
- Membedakan unit, integration, manual, dan usability testing

<!--
Bacakan hanya verbanya, dengan tempo cepat. Tegaskan bahwa tujuan keenam di buku (mengevaluasi
hasil pengujian lewat checklist) adalah produk nyata pertemuan ini: checklist QA yang terisi
dan unit test yang benar-benar bisa dijalankan.

Kaitkan dengan penilaian: aspek debugging berbobot 10% dan dokumentasi 20% di rubrik praktikum
(Lampiran A) bersumber dari bab ini.

Pertanyaan penuntun: "Bedanya butir keempat dan kelima apa?" (Jawaban: keempat soal menulis
test, kelima soal memilih jenis test yang tepat untuk masalah yang dihadapi.)
-->

---

## Bug yang Sampai ke Pengguna Lebih Mahal daripada yang Tertangkap Lebih Awal

![w:1120](assets/diagrams/bab-14-debugging-testing-dan-quality-assurance-06.svg)

- Tanpa cara menelusuri dan menguji, tim menghabiskan waktunya menduga-duga
- Bug yang tertangkap sebelum rilis jauh lebih murah daripada bug yang sampai ke pengguna

<!--
Dipotong ke gambar (diagram yang mengatakan ini):
- Setiap fitur baru menambah peluang satu perubahan merusak bagian lain
- Keadaan itu bernama **regression** (penurunan kualitas)

Baca tiga keping gambar dari kiri ke kanan: fitur baru, bagian yang rusak, lalu nama yang
disandang keadaan itu. Keping terakhir berwarna merah karena regression adalah hal yang dibuat
bab ini untuk ditangkap, bukan kesalahan fitur yang memperkenalkannya.

Tegaskan bahwa regression bukan bug baru: fitur lama yang tadinya benar ikut rusak karena
perubahan di tempat lain. Analogi: seperti menambah lantai pada rumah tanpa memeriksa fondasi
lama — yang runtuh bukan lantai barunya.

Pertanyaan penuntun: "Pernahkah aplikasimu gagal setelah kamu menambah kode di file lain?"
(Jawaban: itulah regression, dan bab ini memberi cara menangkapnya lebih awal.)
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Bagian 1 — Debugging

subbab 14.1 console & DevTools · 14.2 error umum · 14.3 debugging jaringan

<!--
Bagian ini paling praktis dan paling sering dipakai di dunia kerja: menelusuri masalah pada
kode yang sudah ada, bukan menulis fitur baru.

Kalau waktu menipis, subbab 14.3 boleh dipadatkan; subbab 14.1 dan 14.2 tidak boleh
dilewati, karena keduanya menjadi alat untuk setiap praktikum sesudah ini.
-->

---

## Tiga Kegiatan, Satu Tujuan: Kode yang Bisa Dipercaya

| Istilah | Yang dikerjakan | Sifat kegiatan |
|---|---|---|
| **Debugging** | Mencari dan memperbaiki bug di kode | Bereaksi pada bug yang sudah muncul |
| **Testing** | Memeriksa perilaku perangkat lunak dengan rencana | Terencana: kasus uji disiapkan lebih dulu |
| **Quality assurance (QA)** | Memastikan produk memenuhi kebutuhan pengguna | Sistematis: mencegah bug sejak awal |

> QA tidak hanya berburu bug, tetapi mencegahnya lewat standar, checklist, dan prosedur.

<!--
Pisahkan ketiganya dengan satu pertanyaan: "siapa yang bekerja paling awal?" Debugging paling
akhir, testing di tengah, QA paling awal — itulah sebabnya QA disebut jaminan, bukan reparasi.

Cek pemahaman cepat: "Menyusun checklist sebelum menulis kode termasuk kegiatan apa?"
(Jawaban: QA, karena mencegah dan bukan memperbaiki.)

Peringatkan salah paham tersering: QA bukan "tim lain". Di proyek kecil, QA adalah sikap
pengembangnya sendiri.
-->

---

<!-- _class: compact -->

## Console: Tiga Jenis Pesan, Tiga Kegunaan

| Pemanggilan | Untuk apa | Contoh di bab ini |
|---|---|---|
| `console.log` | Melihat nilai variabel atau alur eksekusi | Mencetak jumlah data mahasiswa |
| `console.warn` | Nilai di luar dugaan; aplikasi tetap jalan | Mahasiswa dengan IPK di bawah 3.0 |
| `console.table` | Array objek sebagai tabel berkolom | Daftar mahasiswa: NIM, nama, prodi, IPK |

> Setiap pesan diberi label teks, misalnya "Jumlah data mahasiswa:", supaya mudah ditemukan saat log bercampur.

<!--
Tekankan kebiasaan memberi label: satu label yang baik menghemat berjam-jam mencari baris log
yang tepat di antara puluhan pesan.

Tanya: "Kalau kamu ingin memeriksa lima mahasiswa sekaligus, pakai yang mana?" (Jawaban:
console.table, karena kolomnya lurus sehingga nilai yang salah langsung terlihat.)
-->

---

## Empat Pemanggilan Console di Satu File Membaca Satu Layar Data

`console-demo.js` — bisa dijalankan langsung dengan Node, tanpa emulator

```js
const mahasiswa = [
  { nim: '2201001', nama: 'Budi Santoso', prodi: 'Sistem Informasi', ipk: 3.45 },
  // … empat data baku lainnya (lihat Bab 4–10)
];
console.log('Jumlah data mahasiswa:', mahasiswa.length);
console.log('IPK tertinggi:', Math.max(...mahasiswa.map((m) => m.ipk)));
console.warn('Mahasiswa dengan IPK di bawah 3.0:', mahasiswa
  .filter((m) => m.ipk < 3.0)
  .map((m) => m.nama));
console.table(mahasiswa.map((m) => ({
  NIM: m.nim, Nama: m.nama, Prodi: m.prodi, IPK: m.ipk,
})));
```

> File lengkapnya ada di bab ini; di slide, empat data baku lainnya diringkas dengan komentar.

<!--
Tunjukkan tiga hal saja: label pada setiap log, console.warn untuk keadaan tidak normal, dan
console.table yang mengubah array objek menjadi kolom rapi.

Sebutkan operator spread `...` dari Bab 3 yang menyalurkan setiap IPK ke Math.max.

Pertanyaan penuntun: "Apa gunanya mencetak jumlah data lebih dulu?" (Jawaban: memastikan
datanya benar-benar datang sebelum mencurigai bagian lain.)
-->

---

<!-- _class: compact -->

## Tiga Tombol Terminal yang Mempercepat Setiap Percobaan

| Tombol | Fungsi |
|---|---|
| `m` | Membuka atau menutup menu developer di aplikasi |
| `r` | Memuat ulang aplikasi dengan kode terbaru |
| `j` | Membuka debugger JavaScript |

> Sensitif versi: kombinasi tombol bisa berubah antarversi SDK; ikuti daftar yang dicetak terminal `npx expo start`.

<!--
Susun sebagai satu prosedur: jalankan npx expo start, tekan m, buka menu developer, pilih
debugger untuk SDK 57.

Ingatkan isi React Native DevTools: kode sumber, breakpoint (titik henti tempat eksekusi
berhenti), dan tab Network. React DevTools terpisah dan menampilkan pohon component beserta
nilai state.

Peringatan sensitif versi harus diucapkan: jangan menghafal kombinasi tombol dari buku —
terminal Expo adalah sumber kebenaran untuk versi yang kamu pakai.
-->

---

## Dua Lapisan untuk Melihat State, Dua Pertanyaan Berbeda

![w:1120](assets/diagrams/bab-14-debugging-testing-dan-quality-assurance-05.svg)

- DevTools bisa mengubah state tanpa menulis kode
- Kedua lapisan saling melengkapi, tidak saling menggantikan

<!--
Dipotong ke gambar (diagram yang mengatakan ini):
- Tulis `console.log('state berubah:', nilai)` di dalam `useEffect`
- Menjawab pertanyaan "kapan dan dalam urutan apa"
- Periksa pohon component dan nilai state setiap component
- Menjawab pertanyaan "sekarang isinya apa"

Bacalah gambar sebagai satu tabel: baris pertama adalah mekanisme tiap lapisan, baris kedua
adalah pertanyaan yang hanya bisa dijawab lapisan itu. Pasangan pertanyaannya itulah intinya —
log memberi tahu urutan kejadian, DevTools memberi tahu isi state saat ini. Tidak ada kolom
yang menggantikan kolom lain.

Yang tinggal di slide adalah dua hal yang tidak digambar: kemampuan DevTools mengubah state
langsung, dan kesimpulan bahwa keduanya melengkapi.

Analogi: log seperti rekaman kamera lalu lintas, React DevTools seperti foto kondisi sekarang.

Ingatkan bahwa useState dan useEffect sudah dibahas di Bab 4; di sini keduanya dipakai sebagai
alat, bukan dipelajari ulang.
-->

---

<!-- _class: compact -->

## Log Berlabel Menunjukkan Kapan State Berubah

`app/TampilkanIPK.js` — pola state dan `useEffect` dari Bab 4

```js
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function TampilkanIPK() {
  const [ipk, setIpk] = useState(null);

  useEffect(() => {
    console.log('useEffect berjalan, ipk saat ini:', ipk);
    // Simulasi pemuatan data; ganti dengan fetch dari Bab 10.
    const idTimeout = setTimeout(() => setIpk(3.45), 1000);
    return () => clearTimeout(idTimeout);
  }, [ipk]);
  return <View><Text>IPK: {ipk === null ? 'memuat...' : ipk}</Text></View>;
}
```

<!--
Dipotong ke catatan (tidak muat di slide): State dimulai sebagai `null` — ini penyebab paling
sering error `'undefined' is not an object`.

Bacakan urutan yang tercetak di terminal: null, lalu 3.45. Itulah gunanya log di titik
perubahan.

Tunjukkan bahwa label log menyebut component dan variabelnya, sehingga log mudah ditemukan saat
banyak component aktif sekaligus.

Peringatkan bahwa cleanup clearTimeout mencegah pembaruan state setelah component dilepas.
-->

---

<!-- _class: compact -->

## Enam Error React Native yang Paling Sering Muncul

| # | Pesan error (disingkat) | Sifat |
|---|---|---|
| 1 | `Unable to resolve module` | Fatal |
| 2 | `Invalid hook call` | Fatal |
| 3 | `'undefined' is not an object` | Fatal |
| 4 | `Text strings must be rendered within a <Text>` | Fatal |
| 5 | `VirtualizedLists should never be nested inside plain ScrollViews` | Peringatan |
| 6 | `Each child in a list should have a unique 'key' prop` | Peringatan |

> Error fatal tampil sebagai layar merah penuh bernama RedBox, yang selalu memuat nama file dan nomor baris. Baca bagian itu lebih dulu.

<!--
Pesan utamanya: mengenali pesan error sama pentingnya dengan mengenali sintaksis bahasa. Pesan
error adalah penunjuk arah, bukan pengumuman kegagalan.

Minta kelas menebak sifat tiap error sebelum kolom kanan dibahas: empat pertama menghentikan
aplikasi, dua terakhir hanya peringatan tetapi menandakan rancangan yang rawan bug.

Kebiasaan yang harus ditekankan: baca lokasi baris di RedBox sebelum menebak penyebabnya.
-->

---

## Dua Error Fatal: Module dan Hook

| Error | Penyebab lazim | Solusi |
|---|---|---|
| **`Unable to resolve module`** | Path atau nama file salah; beda huruf besar-kecil | Perbaiki path; untuk paket npm jalankan `npx expo install`, lalu tekan `r` |
| **`Invalid hook call`** | Hook dipanggil di dalam `if`, callback, atau fungsi biasa | Pindahkan pemanggilan hook ke level teratas component |

> Aturan emas: jangan pernah memanggil hook di dalam `if`, `for`, atau fungsi bersarang.

<!--
Error pertama sering muncul di Windows karena beda huruf besar-kecil: KartuMahasiswa.js versus
kartumahasiswa.js, sehingga Metro tidak menemukannya. Metro adalah bundler React Native.

Error kedua adalah kesalahan pemula yang paling umum: hook yang menyelinap ke dalam cabang
terlihat wajar, tetapi melanggar aturan urutan hook.

Tanya: "Kenapa React peduli di mana hook dipanggil?" (Jawaban: React memasangkan state menurut
urutan pemanggilan hook, dan urutan itu harus sama di setiap render.)
-->

---

## Error Ketiga: Properti Dibaca Sebelum Datanya Tiba

![w:1120](assets/diagrams/bab-14-debugging-testing-dan-quality-assurance-07.svg)

- Kamu membaca properti dari nilai yang belum ada, biasanya data yang belum selesai dimuat
- Operator opsional `mahasiswa?.nama` membuat akses aman selama objeknya belum ada

> Cetak jawaban API dengan `console.log` sebelum memetakannya ke tampilan.

<!--
Dipotong ke gambar (diagram yang mengatakan ini):
- Beri state nilai awal `[]` atau `null`, lalu tampilkan penanda loading
- Periksa juga struktur jawaban API: buku ini memakai bentuk `{ data: [...] }` (Bab 10)

Gambar menumpuk tiga pertahanan pada tiga kedalaman satu jalur data, dan ia memuat kedua butir
itu lengkap. Dua butir yang tinggal di slide adalah yang tidak dikatakan gambar: penyebabnya
(membaca properti dari nilai yang belum ada) dan alasan operator opsional bekerja (akses tetap
aman selama objeknya absen).

Hubungkan dengan slide "Log Berlabel Menunjukkan Kapan State Berubah" tiga slide sebelumnya:
state ipk dimulai sebagai null dan layarnya menampilkan "memuat..." — pola yang mencegah error
ini.

Peringatkan dua penyebab tersembunyi: salah menulis nama properti (nama versus name) dan
jawaban API yang bentuknya tidak seperti dugaanmu.

Pertanyaan penuntun: "Bagaimana kamu tahu struktur jawaban API sebelum menuliskannya?"
(Jawaban: dengan mencetak jawabannya sekali saat integrasi pertama.)
-->

---

<!-- _class: compact -->

## Error Keempat dan Dua Peringatan yang Sering Diabaikan

| Error | Arti dan solusi |
|---|---|
| **`Text strings must be rendered within a <Text>`** | Teks polos di dalam `View`; bungkus dengan `<Text>Halo</Text>` (aturan Bab 5) |
| **`VirtualizedLists should never be nested inside plain ScrollViews`** | `FlatList` di dalam `ScrollView` searah; pakai `ListHeaderComponent` atau `map` |
| **`Each child in a list should have a unique 'key' prop`** | Beri `key={item.nim}` pada elemen pertama hasil `map`; jangan pakai indeks array |

<!--
Error keempat adalah aturan Bab 5 yang terlupa: semua teks yang tampil di layar harus berada di
dalam Text.

Peringatan kelima menandakan rancangan yang rapuh: React Native tidak bisa menghitung tinggi isi
saat dua component yang menggulir searah ditumpuk. Solusi termurah adalah satu component daftar
utama per halaman.

Peringatan keenam tidak menghentikan aplikasi, tetapi React bisa menggambar data yang salah atau
kehilangan state baris saat datanya diperbarui.
-->

---

<!-- _class: center -->

## Apa yang Terjadi Jika…?

- …`useState` dipanggil di dalam cabang `if`?
- …`FlatList` diletakkan di dalam `ScrollView` yang searah?
- …hasil `map` tidak diberi properti `key`?

<!--
Jangan dijawab. Minta tiga mahasiswa menebak lebih dulu, lalu tegaskan bahwa jawabannya ada di
slide berikutnya.

Tujuannya melatih penalaran dari gejala ke penyebab, bukan menghafal nama error.
-->

---

<!-- _class: center -->

## Urutan Hook Berubah, React Pun Melempar Error

- React melaporkan `Invalid hook call` karena urutan hook berbeda di setiap render
- Tinggi isi tidak bisa dihitung; gulir jadi aneh dan performa turun
- React sulit melacak elemen mana yang berubah, sehingga data bisa tergambar keliru

<!--
Ulangi aturan emas: hook hanya di level teratas component. Kalau sebuah nilai perlu bersyarat,
hitung sesudah hook dipanggil, bukan di dalam cabangnya.

Tegaskan bahwa dua jawaban terakhir hanya peringatan: aplikasi tetap berjalan, tetapi gejalanya
muncul kemudian sebagai bug yang sulit ditelusuri.
-->

---

## Uji Endpoint Dulu Sebelum Menyalahkan Aplikasi

- Periksa endpoint dari browser, `curl`, atau `fetch` bawaan Node.js 22
- Pastikan server backend buku ini berjalan lebih dulu (lihat Bab 10)
- Hasil uji memisahkan dua sumber masalah: server atau aplikasi

```bash
curl http://localhost:3000/api/mahasiswa
```

<!--
Analogi: periksa keran lebih dulu sebelum membongkar pipa di dalam rumah.

Pola pembuktiannya: kalau curl berhasil tetapi aplikasi gagal, masalahnya di sisi aplikasi
(kode, konfigurasi, alamat); kalau curl juga gagal, masalahnya di server — tidak berjalan, port
salah, atau status 404/500.

Sebutkan bahwa curl adalah program baris perintah yang mengirim permintaan HTTP. Alternatif di
Windows: buka alamat itu di browser, atau jalankan fetch bawaan Node.js 22 dari Contoh 2 di bab.
-->

---

## Server atau Aplikasi? Satu Perintah, Dua Kesimpulan

![w:1120](assets/diagrams/bab-14-debugging-testing-dan-quality-assurance-02.svg)

> Menguji endpoint lebih dulu memisahkan dua sumber masalah sebelum kamu mulai menduga.

<!--
Baca gambar sebagai prosedur: satu perintah, dua kesimpulan berbeda.

Tekankan syarat di cabang kiri: kesimpulan "masalahnya di sisi aplikasi" hanya sah bila endpoint
berhasil TETAPI aplikasi tetap gagal. Endpoint yang menjawab 200 sementara aplikasi berjalan
normal bukan masalah sama sekali.

Hubungkan dengan "Network request failed" di slide berikutnya: pesan itu muncul di aplikasi,
tetapi belum tentu berarti servernya mati.
-->

---

## Alamat Berbeda untuk Tiap Target

| Target | Alamat server backend |
|---|---|
| Komputer pengembang | `http://localhost:3000` |
| Emulator Android | `http://10.0.2.2:3000` |
| Perangkat fisik | IP komputer di jaringan lokal (LAN) |

> Pesan "Network request failed" paling sering berarti alamatnya salah untuk target itu, server mati, atau perangkat dan komputer berada di jaringan berbeda.

<!--
Rincian alamat ini sudah dibahas di Bab 10; di sini dipakai sebagai langkah pertama debugging
jaringan, bukan materi baru.

Tab Network di React Native DevTools menampilkan setiap permintaan fetch, status jawabannya
(200, 404, 500), dan body JSON yang dikembalikan. Tandai sensitif versi: ketersediaan dan tata
letak tab Network bergantung pada DevTools yang menyertai SDK 57, sehingga mencetak jawabannya
sendiri di kode selalu menjadi alternatif yang aman.

Tanamkan kebiasaan: taruh console.warn di blok catch dan di cabang !response.ok supaya setiap
kegagalan meninggalkan jejak, lalu cetak JSON.stringify(data) sekali saat integrasi pertama.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Bagian 2 — Testing dan QA

subbab 14.4 unit testing · 14.5 integration · 14.6 manual & usability · 14.7 checklist

<!--
Bagian ini menjawab bantahan yang paling sering muncul: "kenapa diuji, kodenya sudah jalan di
emulatorku?".

Kalau waktu menipis, subbab 14.5 cukup dijelaskan konsepnya; subbab 14.4 dan 14.7 tidak boleh
dilewati, karena keduanya menghasilkan artefak yang dinilai di praktikum.
-->

---

## Unit Testing Menembak Fungsi Terkecil, Berulang Kali

- Unit testing menguji satu unit kode, biasanya satu fungsi, secara terpisah
- Pengujian manual tidak bisa diulang konsisten: orang lupa langkah dan terburu-buru
- Unit test bisa dijalankan berulang dan cepat — senjata utama melawan regression
- Trade-off: menulis test memakan waktu di awal dan harus dirawat
- Target termudah adalah **fungsi murni**, yang hasilnya hanya ditentukan argumennya

> Buku ini memakai `node:test`, modul bawaan Node.js. Jest dengan preset `jest-expo` adalah standar industri React Native.

<!--
Tekankan sifat deterministik fungsi murni: masukan yang sama selalu memberi keluaran yang sama,
sehingga test tidak "kadang lulus, kadang gagal". Fungsi murni juga tidak membaca file dan tidak
memanggil API.

Peringatan sensitif versi: versi jest-expo selalu terikat pada SDK; periksa halaman Unit
testing di docs.expo.dev untuk SDK 57 sebelum memasangnya.

Pertanyaan penuntun: "Kenapa test yang menguji implementasi, bukan perilaku, dianggap buruk?"
(Jawaban: perubahan implementasi yang tidak mengubah perilaku membuat test gagal palsu,
sehingga biaya perawatannya lebih besar daripada manfaatnya.)
-->

---

## Fungsi Murni dari Bab 8 adalah Kandidat Terbaik

`utils/validators.js` — fungsi murni tanpa dependency, kandidat ideal untuk unit test

```js
function validateNim(nim) {
  const pesanWajib = required(nim);
  if (pesanWajib) return pesanWajib;
  return /^\d{7}$/.test(String(nim).trim()) ? '' : 'NIM harus terdiri dari tepat 7 digit angka';
}
function validateEmail(email) {
  const pesanWajib = required(email);
  if (pesanWajib) return pesanWajib;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim()) ? '' : 'Format email tidak valid';
}
// … validateNama, validateTelepon, validatePassword: pola yang sama
```

> Setiap fungsi mengembalikan pesan error sebagai string, atau string kosong `''` saat datanya valid.

<!--
Jelaskan kesepakatan "string kosong berarti valid": itulah yang membuat hasilnya mudah diperiksa
di test, misalnya assert.strictEqual(fungsi('2201001'), '').

Peringatan: slide ini dan slide berikutnya hanya menampilkan sebagian dari tujuh fungsi (masih
ada required, validateNama, validateTelepon, dan validatePassword). File lengkapnya ada di Bab 8
dan diulang utuh di bab ini.

Tanya: "Kenapa fungsi ini tidak menyentuh state, penyimpanan, atau jaringan?" (Jawaban: itulah
sebabnya ia murni, sehingga bisa diuji tanpa menjalankan aplikasi.)
-->

---

## validateFormMahasiswa Mengumpulkan Semua Error Sekaligus

`utils/validators.js` — memvalidasi seluruh formulir dengan memakai ulang fungsi di atas

```js
function validateFormMahasiswa({ nim, nama, email, telepon } = {}) {
  const errors = {};
  const pesanNim = validateNim(nim);
  if (pesanNim) errors.nim = pesanNim;
  const pesanNama = validateNama(nama);
  if (pesanNama) errors.nama = pesanNama;
  // … email dan telepon: pola yang sama
  return { valid: Object.keys(errors).length === 0, errors };
}
```

> `valid` bernilai `true` hanya saat `errors` kosong; bentuk `{ valid, errors }` inilah yang dipakai formulir di Bab 8.

<!--
Tekankan bahwa fungsi ini tidak menyalin aturan validasi: ia memanggil validateNim, validateNama,
dan seterusnya, lalu mengumpulkan setiap pesan ke dalam objek errors.

Analogi: seperti petugas loket yang memeriksa empat dokumen satu per satu dan menempelkan catatan
di setiap dokumen yang kurang — pemeriksaannya tidak berhenti di dokumen pertama.

Pertanyaan penuntun: "Kenapa semua pesan dikumpulkan, bukan dikembalikan satu per satu?"
(Jawaban: formulir harus menampilkan semua kesalahan sekaligus, bukan meminta pengguna
memperbaiki satu kolom setiap kali.)

Dua baris untuk email dan telepon diringkas dengan komentar; polanya persis sama dengan baris nim
dan nama yang tampak. Kode di layar tetap harus menunjukkan bahwa errors terisi, supaya mahasiswa
tidak menyalin fungsi yang selalu mengembalikan valid: true.
-->

---

<!-- _class: compact -->

## Uji Pertama: Satu Test, Satu Perilaku

`__tests__/validators.test.js` — satu test untuk satu perilaku

```js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateNim, validateFormMahasiswa } = require('../utils/validators.js');
test('validateNim menerima NIM 7 digit', () => {
  assert.strictEqual(validateNim('2201001'), '');
});
test('validateNim menolak NIM bukan 7 digit', () => {
  assert.notStrictEqual(validateNim('22010'), '');
});
test('validateFormMahasiswa mengumpulkan semua error sekaligus', () => {
  const hasil = validateFormMahasiswa({ nim: 'abc', nama: '', email: 'budi', telepon: '081' });
  assert.strictEqual(hasil.valid, false);
  assert.deepStrictEqual(Object.keys(hasil.errors).sort(), ['email', 'nama', 'nim', 'telepon']);
});
```

> Jalankan `node --test` dari folder proyek, atau `node __tests__/validators.test.js` untuk file ini saja.

<!--
Tunjukkan tiga hal: node:test dan node:assert/strict tersedia tanpa pemasangan apa pun, deskripsi
test yang ditulis dalam bahasa Indonesia membuat laporan kegagalan mudah dibaca, dan
assert.strictEqual memeriksa nilai sedangkan deepStrictEqual memeriksa struktur objek.

Sebutkan hasil yang benar: ketiga belas test lulus dengan ringkasan pass 13 dan fail 0. File
lengkap di bab memuat 13 kasus uji; di slide hanya tiga yang tampak.

Tekankan pola satu test satu perilaku: kegagalan langsung menunjuk aturan yang dilanggar. Kalau
sebuah test gagal, putuskan mana yang salah — fungsinya atau testnya; itu bagian dari keterampilan
debugging.
-->

---

<!-- _class: compact -->

## Unit Menguji Fungsi, Integration Menguji Sambungan

| Aspek | Unit testing | Integration testing |
|---|---|---|
| Yang diperiksa | Satu fungsi secara terpisah | Kerja sama antarbagian |
| Pertanyaan khas | Apakah `validateNim` menolak NIM salah? | Apakah tombol Simpan benar-benar mengirim data ke API? |
| Cakupan dan biaya | Cepat, murah, mudah disiapkan | Lebih lambat, rapuh, sulit disiapkan |
| Kesalahan yang tertangkap | Aturan logika yang keliru | Kontrak antarmuka yang tidak cocok |

<!--
Beda intinya ada di tingkat cakupan: unit memisahkan satu unit dari sekitarnya, integration
menyambungkan unit itu dengan state, fetch, dan tampilan.

Contoh sambungan yang rapuh: format data yang dikirim formulir tidak sama dengan yang dibaca
daftar, atau token autentikasi Bab 13 tidak ikut terkirim pada permintaan berikutnya.

Peringatan sensitif versi: integration test React Native umumnya memakai library seperti React
Native Testing Library, yang menggambar component sungguhan sambil memalsukan jaringan; library
dan konfigurasinya cepat berubah, jadi ikuti dokumentasi resmi untuk SDK 57. Bab ini sengaja tidak
menerapkannya secara mendalam.
-->

---

## Piramida Testing: Banyak di Bawah, Sedikit di Atas

![w:1120](assets/diagrams/bab-14-debugging-testing-dan-quality-assurance-03.svg)

> Unit test yang semuanya lulus tidak menjamin aplikasi berjalan: kesalahan justru sering muncul di sambungan antarbagian.

<!--
Baca piramida dari bawah: banyak unit test sebagai alas, lebih sedikit integration test di tengah,
dan paling sedikit end-to-end test di puncak — itulah praktik industri karena biaya dan kerapuhan
naik ke atas.

Tegaskan bahwa jumlahnya bukan soal gaya: test yang lambat dan rapuh akan ditinggalkan tim kalau
terlalu banyak.

Pertanyaan penuntun: "Kenapa end-to-end test tidak dijadikan andalan?" (Jawaban: paling mahal,
paling rapuh, dan kegagalannya sulit ditunjuk ke satu penyebab.)
-->

---

<!-- _class: compact -->

## Manual Testing: Tiga Kategori Kasus

| Kategori | Isi | Contoh di aplikasi buku ini |
|---|---|---|
| **Fungsional** | Alur utama yang dirancang | Login berhasil, daftar mahasiswa muncul, formulir menyimpan data |
| **Edge case** | Masukan yang tidak biasa | Formulir kosong, email tanpa `@`, NIM berisi huruf, API kosong, koneksi mati |
| **Platform** | Perilaku yang berbeda antarperangkat | Tombol back Android, layar kecil, rotasi, izin perangkat ditolak |

> Uji di minimal satu emulator dan satu perangkat fisik: emulator tidak mereproduksi memori, jaringan, dan sensor perangkat sungguhan.

<!--
Kekuatan pengujian manual adalah menangkap masalah yang tidak pernah terpikirkan oleh test
otomatis: animasi tersendat, teks terpotong di layar kecil, tombol yang sulit ditekan.

Kelemahannya: memakan waktu dan bergantung pada ketelitian manusia, sehingga pengujian manual harus
dipandu checklist agar tidak melompat tanpa rencana.

Pertanyaan penuntun: "Kasus mana yang paling sering dilupakan mahasiswa?" (Jawaban: edge case —
terutama mematikan koneksi di tengah permintaan.)
-->

---

## Usability Testing Cukup dengan Sekitar 5 Pengguna

- Pengujian manual menilai kebenaran; usability testing menilai kemudahan pemakaian
- Prinsip klasik: uji dengan sekitar 5 pengguna untuk menemukan mayoritas masalah
- Satu sesi tiga bagian: 3–5 tugas nyata, berpikir keras saat bekerja, lalu pengamatan
- Catat keberhasilan tugas, waktu, tempat pengguna ragu, dan kesalahan yang dibuat
- Bantu hanya saat pengguna benar-benar macet, dan catat itu sebagai temuan

<!--
Tekankan pembedaan yang paling sering tertukar: pengujian manual bertanya "apakah fiturnya
bekerja?", usability testing bertanya "apakah pengguna mudah menemukannya dan memakainya?".
Aplikasi yang benar secara teknis bisa tetap membingungkan.

Contoh tugas nyata dari bab: "daftarkan mahasiswa baru bernama Dewi Lestari tanpa melihat panduan
apa pun".

Sebutkan trade-off-nya: menambah pengguna di atas lima hanya menambah sedikit temuan, sehingga
biayanya tidak sepadan. Hasil pengamatan diprioritaskan menjadi perbaikan antarmuka di siklus
pengembangan berikutnya.
-->

---

<!-- _class: compact -->

## Checklist: Enam Kasus Uji Paling Mewakili

| Area | Kasus uji | Hasil nyata | Status |
|---|---|---|---|
| Login | Password salah memunculkan pesan error, tanpa pindah layar | — | ☐ Lulus ☐ Gagal |
| Daftar Mahasiswa | Data dari API muncul lengkap (NIM, nama, prodi, IPK) | — | ☐ Lulus ☐ Gagal |
| Daftar Mahasiswa | API dimatikan memunculkan pesan error, aplikasi tidak berhenti | — | ☐ Lulus ☐ Gagal |
| Formulir Mahasiswa | NIM 6 digit ditolak dengan pesan validasi | — | ☐ Lulus ☐ Gagal |
| Navigasi | Tombol back Android meninggalkan formulir tanpa menyimpan | — | ☐ Lulus ☐ Gagal |
| Jaringan | Status loading muncul saat jawaban server lambat | — | ☐ Lulus ☐ Gagal |

<!--
Tabel lengkap di bab memuat sepuluh kasus uji, termasuk login berhasil, nomor telepon yang tidak
diawali 08, dan tampilan di layar kecil sekitar 360 dp; di slide ini ada enam kasus paling
mewakili.

Aturan pengisian yang harus ditekankan: kolom hasil nyata diisi dengan yang benar-benar kamu
amati, bukan yang kamu harapkan, dan status ditandai hanya setelah hasilnya diperiksa.

Kasus uji yang gagal tidak dihapus: dicatat, diperbaiki, lalu diuji lagi.
-->

---

## Checklist yang Hidup Menjadi Penjaga Regresi

![w:1120](assets/diagrams/bab-14-debugging-testing-dan-quality-assurance-04.svg)

> Checklist adalah dokumen kerja tim: bug yang lolos berarti ada kasus uji yang seharusnya sudah ada.

<!--
Jelaskan nilai ekonomi siklus ini: setiap bug yang pernah lolos menjadi penjaga permanen, sehingga
kesalahan yang sama tidak terulang di rilis berikutnya.

Ingatkan bahwa checklist ini dipakai ulang saat persiapan rilis di Bab 15.

Tegaskan pembagian kerja QA yang realistis untuk proyek mahasiswa: unit test untuk logika murni
yang murah diotomatiskan, dan checklist manual untuk perilaku aplikasi yang sulit diotomatiskan.
-->

---

## Praktikum: Yang Dibangun Pertemuan Ini

- Fungsi yang diuji milik **Aplikasi Manajemen Data Mahasiswa** dari praktikum Bab 8
- Pastikan Node.js LTS versi 22 atau lebih baru lewat `node --version`
- Salin `utils/validators.js` dan `__tests__/validators.test.js` ke folder `praktikum14`
- Jalankan `node --test` sampai ketiga belas test lulus
- Uji endpoint dari terminal, lalu matikan server dan ulangi untuk membaca kegagalannya
- Isi checklist pengujian minimal 5 kasus uji untuk aplikasimu sendiri

<!--
Ingatkan urutan folder yang benar: utils/ dan __tests__/ dibuat lebih dulu, dan perintahnya
dijalankan dari dalam praktikum14 karena path ../utils/validators.js diselesaikan dari folder
__tests__.

Peringatan waktu: langkah praktikum ini menuntut menyalin dua file, menjalankan test, dan mengisi
checklist sekaligus; siapkan file dasarnya sebelum pertemuan supaya tidak ada yang menyalin dari
nol.

Bila ada langkah yang gagal, arahkan mahasiswa ke bagian Troubleshooting di bab: versi Node yang
terlalu tua, path relatif yang salah, AssertionError, menu developer yang tidak muncul, dan fetch
yang tidak dikenali.
-->

---

## Yang Harus Teramati

Untuk praktikum ini, catat lima hal:

- `node --test` menutup dengan ringkasan pass 13 dan fail 0
- `console.table` mencetak tabel lima baris untuk data mahasiswa
- `curl` menjawab status 200 selama server backend hidup
- Server dimatikan: blok `catch` mencetak pesan kegagalan, bukan aplikasi berhenti
- Checklist pengujianmu sendiri terisi minimal 5 kasus uji

> Laporan yang baik melampirkan keluaran terminal dan tabel checklist, bukan hanya tulisan "berhasil".

<!--
Jadikan daftar ini lembar centang: mahasiswa mencentang setiap butir lalu melampirkan tangkapan
layar sebagai bukti sesuai rubrik praktikum.

Butir kedua dan keempat sengaja berpasangan: yang satu menunjukkan data benar-benar sampai, yang
lain menunjukkan kegagalan tertangkap dan tidak menjatuhkan aplikasi. Pasangan itulah inti bab ini
dalam dua baris terminal.

Pertanyaan penuntun: "Kenapa ringkasan pass 13 fail 0 lebih penting daripada tangkapan layar
aplikasi yang tampak normal?" (Jawaban: ringkasan itu bukti terukur bahwa seluruh kasus uji
pernah dijalankan.)
-->

---

<!-- _class: compact -->

## Studi Kasus: Insiden KRS Online

**Contoh ilustratif** — aplikasi SIAKAD mobile untuk mengisi KRS gagal di hari pertama pendaftaran.

![w:1120](assets/diagrams/bab-14-debugging-testing-dan-quality-assurance-08.svg)

| Gejala di lapangan | Akar masalah setelah audit |
|---|---|
| Formulir menerima NIM 6 digit, sehingga data orang lain ikut tersimpan | Tidak ada unit test untuk fungsi validasi aplikasi itu |

<!--
Dipotong ke gambar (diagram yang mengatakan ini):
- Tim hanya menguji alur berhasil di satu emulator Android, tanpa uji perangkat fisik
- Banyak mahasiswa melihat layar kosong saat membuka daftar KRS
- Pengguna iOS tidak bisa menyimpan karena tombolnya tertutup keyboard

Gambar menggambar kedua kolom kasus ini — tiga gejala di lapangan dan dua akar masalah temuan
audit — sebagai baris bernomor yang berdampingan. Di bawahnya, satu baris tabel memuat satu
butir dari tiap kolom: gejala pertama, dan akar masalah kedua yang lebih pendek. Keduanya
memang mengulang satu baris gambar masing-masing — itu harga dari keharusan menyisakan teks di
slide, dan dibayar, bukan dihapus.

Bacakan sebagai cerita, bukan sebagai daftar. Tujuannya membuat mahasiswa mengenali pola
kegagalan ini di proyeknya sendiri.

Sebutkan bahwa aplikasi pada kasus ini mengikuti alur yang sama dengan Aplikasi Manajemen Data
Mahasiswa yang dibangun di Bab 6–10: login, daftar, dan formulir input — aplikasi yang sama persis
dengan Project Akhir yang kamu bangun sendiri.

Pertanyaan sebelum slide berikutnya: "Dari ketiga gejala itu, mana yang paling mungkin terjadi di
proyek kelompokmu?" Biarkan mereka menebak lebih dulu.
-->

---

<!-- _class: compact -->

## Insiden Itu Seharusnya Tertangkap di Tahap Ini

| Gejala | Tahap dari materi bab ini | Kenapa bisa menangkapnya |
|---|---|---|
| NIM 6 digit diterima | Unit test untuk `validators.js` | Aturan NIM 7 digit diuji berulang tanpa menjalankan aplikasi |
| Layar kosong dan `'undefined' is not an object` | Error umum 14.2 dan checklist manual | Tidak ada status loading dan tidak ada pemeriksaan struktur jawaban |
| Tombol simpan tertutup keyboard iOS | Manual dan usability testing | Emulator Android tidak mereproduksi keyboard iOS |

> Biaya tiga hari helpdesk jauh lebih mahal daripada biaya menulis sejumlah unit test dan checklist satu halaman.

<!--
Minta mahasiswa menilai urutan QA termurah bila tim hanya punya satu hari: unit test untuk
validasi lebih dulu karena paling murah dan paling cepat dijalankan, lalu checklist manual
fungsional, lalu usability testing.

Hubungkan dengan aplikasi kita: aplikasi pada studi kasus ini persis Project Akhir yang dibangun
di Bab 6–10, sehingga tiga gejala di tabel ini bisa menimpanya bila praktikum Bab 8 disalin tanpa
test dan tanpa checklist. Peralatan pengujian di bab ini akan dipakai lagi di sana.

Pesan penutup slide ini: kebanyakan insiden bukan kegagalan kode, melainkan kegagalan proses
pengujian.
-->

---

<!-- _class: center -->

## Kuis Kilat

- Kegiatan mencari dan memperbaiki kesalahan di kode disebut apa?
- Fungsi console mana yang paling tepat untuk daftar mahasiswa berkolom?
- Sifat apa pada fungsi murni yang membuatnya ideal untuk unit test?
- Apa beda utama unit testing dan integration testing?

<!--
Kuis lisan lima menit: tampilkan pertanyaan, minta kelas menjawab bersama atau mengangkat tangan,
lalu lanjut ke slide kunci. Jangan membocorkan jawaban di slide ini.

Kalau jawaban kelas beragam, catat nomornya dan ulangi pembedaannya sebelum pertemuan ditutup.
-->

---

<!-- _class: center -->

## Kunci Kuis Kilat

- Debugging — bukan testing, dan bukan quality assurance
- `console.table` — menyusun array objek menjadi kolom rapi
- Deterministik: hasilnya hanya ditentukan argumennya
- Tingkat cakupannya: satu unit terpisah versus kerja sama antarbagian

<!--
Ulangi kalimat kunci nomor empat karena inilah konsep yang paling sering tertukar di ujian.

Kalau banyak yang salah di nomor dua, ulangi tabel tiga jenis pesan console sebelum menutup
pertemuan.
-->

---

## Satu Hari untuk Menguji Memaksa Kita Memilih Urutan

**Diskusi kelas**

- Gejala mana dari insiden KRS Online yang paling mungkin muncul di proyekmu?
- Kalau tim hanya punya satu hari untuk menguji, urutan QA mana yang paling murah?

**Latihan dan tantangan**

- Tambah tiga kasus uji baru untuk NIM, email, dan telepon
- Tulis unit test untuk satu fungsi murni dari proyek Bab 9
- Simpan jurnal bug satu minggu: error, penyebab, solusi, kasus uji pencegahnya

> Soal diskusi dan latihan bab ini menjadi bahan Latihan Bab 14, dinilai lewat rubrik praktikum di Lampiran A.

<!--
Beri 5 menit berpasangan untuk dua pertanyaan diskusi, lalu tampung dua sampai tiga jawaban.
Jawaban yang kuat menyebut alasan biaya dan risiko, bukan hanya urutan kegiatannya.

Untuk tantangan jurnal bug, jelaskan bahwa keluarannya adalah penambahan kasus uji ke checklist —
itulah prinsip kasus uji regresi yang dibahas di slide checklist.

Pengingat penilaian: checklist pengujian minimal lima kasus uji adalah bagian Tugas 3 di RPS
pertemuan ini.
-->

---

## Ringkasan

1. Debugging mencari dan memperbaiki; testing memeriksa terencana; QA mencegah sejak awal
2. `console.log`, `console.warn`, dan `console.table` berguna bila setiap pesan diberi label
3. Enam error React Native yang umum punya penyebab dan solusi khas masing-masing
4. Uji endpoint lebih dulu; perhatikan alamat `localhost`, `10.0.2.2`, dan IP LAN (Bab 10)
5. `node:test` menjalankan unit test tanpa dependency; checklist QA adalah produk bab ini

<!--
Jangan dibacakan. Minta lima mahasiswa menjelaskan satu nomor dengan kata-kata sendiri; bila
keliru, perbaiki saat itu juga sebelum pertemuan ditutup.

Yang belum tertulis di slide dan perlu diucapkan: piramida testing, beda pengujian manual dan
usability testing, serta prinsip sekitar lima pengguna.

Pesan penutup: kebiasaan profesional dimulai dari membaca pesan error dan mencatat hasil uji,
bukan dari menghafal alat.
-->

---

<!-- _class: compact -->

## Referensi

| Sumber | Link |
|---|---|
| Dokumentasi React Native (2026) | reactnative.dev |
| Dokumentasi Expo (2026) | docs.expo.dev |
| Dokumentasi Node.js — `node:test` (2026) | nodejs.org |
| MDN Web Docs — HTTP dan JavaScript (2026) | developer.mozilla.org |

**Bab terkait:** Bab 8 (validasi formulir yang diuji di sini) · Bab 10 (REST API, status code, dan backend buku ini)

**Bacaan lanjutan:** Bab 15 — Build dan Deployment

**Versi teknologi:** Expo SDK 57 · React Native 0.86 · React 19.2 · Node.js ≥ 22

<!--
Rujukan lengkap ada di Lampiran D; istilah seperti Metro Bundler, Debugging, dan Status Code
dijelaskan di glosarium Lampiran C.

Ingatkan bahwa halaman dokumentasi bersifat sensitif versi: periksa ulang perilaku DevTools,
jest-expo, dan React Native Testing Library untuk SDK 57 sebelum memakainya di kode produksi.

Dua bab terkait itu sudah dibahas sebelumnya dan hanya dipakai ulang di sini: Bab 8 untuk fungsi
validasi yang menjadi bahan test, dan Bab 10 untuk endpoint serta status code yang diuji dengan
curl.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Siap ke Bab 15

**Tugas 3 (RPS pertemuan 15):** laporan QA — checklist minimal 5 kasus uji terisi plus bukti `node --test`.

Laporan build menyusul di Bab 15.

Pertemuan 15 (lanjutan): Bab 15 — Build dan Deployment.

<!--
Tutup dengan satu kalimat: "Bab ini mengajari kita memeriksa rumah sebelum diserahkan; bab
berikutnya mengajari kita menyerahkannya kepada penghuninya."

Sebutkan tenggat pengumpulan Tugas 3 secara eksplisit, lalu kaitkan dengan rubrik praktikum
(Lampiran A): pemahaman konsep 15%, implementasi 25%, kualitas kode 15%, UI/UX 15%, debugging
10%, dokumentasi 20%.

Ingatkan bahwa Tugas 3 mencakup dua laporan — laporan QA dari pertemuan ini dan laporan build
yang menyusul di Bab 15 — karena pertemuan 15 memuat kedua bab itu sekaligus.
-->
