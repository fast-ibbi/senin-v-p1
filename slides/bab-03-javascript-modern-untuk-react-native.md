---
marp: true
theme: academic
paginate: true
title: "Bab 3 — JavaScript Modern untuk React Native"
description: "Kuliah Pemrograman Mobile, pertemuan 3–4: variabel, tipe data, operator, percabangan, perulangan, fungsi dan arrow function, array dan objek, destructuring, spread, map/filter/reduce, modul import/export, serta pemrograman asinkron dengan Promise, async/await, dan try/catch."
author: "Dosen Mata Kuliah — Program Studi Sistem Informasi / Teknik Informatika"
footer: "Pemrograman Mobile · Bab 3 — JavaScript Modern untuk React Native"
size: 16:9
---

<!-- _class: lead -->
<!-- _paginate: skip -->
<!-- _footer: "" -->

# Bab 3 — JavaScript Modern untuk React Native

Fondasi bahasa sebelum menulis component · Pertemuan 3–4

<!--
Buka dengan satu kalimat: "Tiga pertemuan ke depan kita belum menulis satu layar pun. Hari ini
kita bangun bahasanya dulu, karena React Native pada akhirnya adalah JavaScript."

Pertanyaan pembuka: "React Native sebenarnya memakai bahasa apa?" Tampung dulu semua tebakan.
Jawaban yang benar: JavaScript — bukan Kotlin atau Swift, karena keduanya bahasa native yang
tidak kita pakai di buku ini.

Sebutkan janji bab: seluruh kode hari ini berjalan di Node.js, belum ada antarmuka sama sekali.
Tujuannya menajamkan logika sebelum menulis component di Bab 4.
-->

---

## Tujuan Pembelajaran

Setelah bab ini, kamu bisa:

- Menjelaskan `const` dan `let` beserta akibat *scope*-nya
- Menerapkan tipe data, operator, percabangan, dan perulangan
- Menganalisis fungsi biasa dan arrow function, termasuk perilaku `this`
- Menerapkan *destructuring*, *spread*, `map`, `filter`, dan `reduce`
- Mengevaluasi modul `import`/`export` serta pola `async`/`await`

<!--
Bacakan kata kerjanya saja, jangan seluruh kalimatnya. Tegaskan bahwa tujuan 1 sampai 4 dinilai
lewat Latihan Bab 3 dan Kuis 1 di pertemuan berikutnya, sedangkan tujuan 5 baru terpakai penuh
saat kita memanggil server di Bab 10.

Kaitkan dengan janji bab: mahasiswa yang bisa menjelaskan `const` dan `map` dengan kata-kata
sendiri sudah aman masuk Bab 4, karena keduanya muncul di hampir setiap component React.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Bagian 1 — Bahasa JavaScript & Pengolahan Data

subbab 3.1 Variabel · 3.2 Tipe & Operator · 3.3 Percabangan & Perulangan · 3.4 Fungsi · 3.5–3.7 Array & Objek

<!--
Bagian ini fondasi yang wajib. Kalau waktu pertemuan menipis, percepat subbab 3.3 karena polanya
sudah dikenal dari bahasa pemrograman lain, tetapi jangan lewati subbab 3.1 dan 3.4 yang
membentuk kebiasaan menulis kode React.

Semua contoh di bagian ini ada di folder praktik-js dan dijalankan dengan node.

Subbab 3.5–3.7 yang paling sering dipakai bab-bab berikutnya: hampir semua data aplikasi
berbentuk array berisi objek, dan hampir semua tampilan daftar lahir dari `map`. Ingatkan bahwa
pola ini ikut sampai Project Akhir, jadi jangan hanya dihafalkan.

> `praktik-js/` adalah folder latihan generik buku. Di repositori praktikum, teknik yang sama ada
> di `kode/bab-03-javascript-modern-untuk-react-native/`: `utils/akademik.js` (fungsi murni) dan
> `latihan-predikat.js` / `latihan-cari.js` / `latihan-async.js` (latihan yang bisa dijalankan).
> Baca nama file di slide sebagai label teknik, bukan sebagai path yang wajib ada.
-->

---

## React Hampir Selalu Memakai `const`, Ini Sebabnya

![w:1120](assets/diagrams/bab-03-javascript-modern-untuk-react-native-05.svg)

**Variabel** adalah tempat menyimpan nilai di dalam program, dibuat dengan `const` atau `let`.

- Keduanya *block scoped*: hanya berlaku di dalam `{ }` terdekat
- `var` sudah ditinggalkan: *function scoped*, nilainya mudah berubah tanpa disadari

<!--
Dipotong ke gambar (diagram yang mengatakan ini):
- `const` untuk nilai yang diisi sekali; ini soal disiplin, bukan gaya menulis
- `let` untuk nilai yang benar-benar berubah, misalnya pencacah perulangan

Analogi: `const` seperti tulisan tinta, `let` seperti tulisan pensil.

Pertanyaan penuntun: "Kenapa React hampir selalu memakai `const`?" (Jawaban: nilai state tidak
diganti langsung, melainkan lewat fungsi pengubah dari `useState` di Bab 4.)

Peringatan salah paham: mahasiswa sering mengira `const` membekukan objeknya. Slide berikutnya
mematahkan anggapan itu.
-->

---

## `const` Menjaga Alamat Objek, Bukan Isinya

`praktik-js/01-variabel.js`

```js
const namaAplikasi = 'Aplikasi Mahasiswa';
let jumlahMahasiswa = 5;

jumlahMahasiswa = jumlahMahasiswa + 1; // boleh: let dapat diisi ulang
console.log(namaAplikasi, jumlahMahasiswa); // Aplikasi Mahasiswa 6

const mahasiswa = { nama: 'Budi Santoso', ipk: 3.45 };
mahasiswa.ipk = 3.5; // BOLEH: properti objek tetap bisa diubah
console.log(mahasiswa.ipk); // 3.5
```

> `const` menjaga rujukan ke objek, bukan isi objeknya.

<!--
Tunjukkan tiga hal saja: `let` boleh diisi ulang, `const` tidak, dan properti objek `const` masih
bisa diubah.

Peringatan salah paham paling sering: "`const` berarti datanya tidak bisa berubah sama sekali".
Yang dijaga `const` adalah alamat objek di memori, bukan nilai propertinya.

Kalau dijalankan, `namaAplikasi = 'Nama Lain'` memunculkan TypeError; tunjukkan langsung di
editor supaya kelas melihat pesannya sendiri.
-->

---

<!-- _class: compact -->

## Enam Tipe Data yang Kamu Pakai Setiap Hari

| Tipe | Contoh | Catatan |
|---|---|---|
| **string** | `'2201001'` | teks |
| **number** | `3.45` | termasuk bilangan desimal |
| **boolean** | `true` / `false` | hasil perbandingan |
| **undefined** | `nilaiBelumDiketahui` | belum ditentukan |
| **null** | `null` | sengaja dikosongkan |
| **object** | `{ nama: 'Budi' }`, `[1, 2, 3]` | mencakup array dan fungsi |

> Diperiksa dengan `typeof`; `typeof []` dan `typeof null` sama-sama `"object"`.

<!--
Jangan dibaca baris per baris. Minta mahasiswa menyebutkan tipe dari nilai yang kamu tulis di
papan, misalnya nim, ipk, dan status kelulusan.

Peringatan: `typeof` saja tidak cukup untuk membedakan array dari null. Untuk array, pakai
pemeriksaan khusus seperti `Array.isArray`.

Tanya: "Kalau properti yang tidak ada diakses, error atau undefined?" (Jawaban: undefined, dan
itu harus ditangani dengan hati-hati.)
-->

---

<!-- _class: compact -->

## Selalu `===`, Jangan Pakai `==`

| Kelompok | Operator | Contoh hasil |
|---|---|---|
| Aritmetika | `+` `-` `*` `/` `%` | `10 % 3` memberi `1` |
| Perbandingan | `===` `!==` `>` `<` `>=` `<=` | `3.45 >= 3.5` memberi `false` |
| Logika | `&&` \|\| `!` | `aktif && ipk >= 3.5` |
| Kesetaraan | pakai `===`, hindari `==` | `'3' === 3` memberi `false` |

> `'3' == 3` bernilai `true` karena JavaScript mengubah tipe otomatis — sebabnya buku ini memakai `===`.

<!--
Tekankan satu aturan saja: selalu `===`. Tunjukkan bahwa `==` "membantu" dengan mengubah teks
menjadi angka, dan bantuan itulah sumber kesalahan.

Kejutan klasik yang layak disebut: `0.1 + 0.2 === 0.3` bernilai false di JavaScript karena
bilangan desimal disimpan dalam biner. Untuk nilai uang, jangan bandingkan langsung.

Pertanyaan penuntun: "Operator apa yang dipakai untuk menentukan baris ganjil atau genap?"
(Jawaban: modulo `%`.)
-->

---

## `?.` dan `??` Menjaga Akses ke Data Kosong

![w:1120](assets/diagrams/bab-03-javascript-modern-untuk-react-native-06.svg)

```js
const mahasiswa = { nama: 'Siti Aminah', alamat: null };

console.log(mahasiswa.alamat?.kota);  // undefined, tidak error
console.log(mahasiswa.alamat ?? 'Alamat tidak tercatat');
// Alamat tidak tercatat
```

- `?.` mengamankan akses ke properti yang mungkin `null` atau `undefined`
- `??` memberi nilai bawaan hanya saat nilainya `null` atau `undefined`

<!--
Analogi: `?.` seperti sekaligus bertanya "benda ini ada dan punya properti itu?" tanpa menulis
`if (objek && objek.profil)` yang panjang. Contohnya ada di `praktik-js/03-operator.js`.

Peringatan: tanpa `?.`, mengakses `alamat.kota` saat `alamat` bernilai null melempar error.
Tunjukkan bedanya dengan mengomentari satu baris.

Kalau ada yang bertanya beda `??` dan `||`, jawab singkat bahwa `??` hanya menyala pada
null/undefined, lalu lanjut — rinciannya bukan tuntutan bab ini.
-->

---

## Urutan Kondisi Menentukan Benar atau Salahnya Hasil

`praktik-js/04-percabangan.js`

```js
const ipk = 3.45;

if (ipk >= 3.5) {
  console.log('Predikat Cumlaude');
} else if (ipk >= 3.0) {
  console.log('Predikat Sangat Memuaskan');
} else {
  console.log('Predikat Memuaskan');
}

const statusKelulusan = ipk >= 2.0 ? 'Lulus' : 'Tidak Lulus';
```

> Ternary untuk dua pilihan sederhana; `switch` untuk satu nilai dengan banyak kemungkinan.

<!--
Urutan syarat adalah inti slide ini. Tanya: "Kalau `ipk >= 3.0` ditulis lebih dulu, IPK 3.45
masuk cabang mana?" (Jawaban: cabang 'Sangat Memuaskan' — padahal seharusnya Cumlaude.)

Sebutkan bahwa `break` di `switch` mencegah eksekusi jatuh ke case berikutnya, dan bahwa ternary
akan sering mereka lihat di kode React pada Bab 4 saat syarat berada di dalam tampilan.
-->

---

## Hanya Enam Nilai yang Dianggap Salah

![w:1120](assets/diagrams/bab-03-javascript-modern-untuk-react-native-01.svg)

- Akibatnya `if ([])` selalu masuk cabang benar
- Karena itu tulis syaratnya eksplisit: `if (daftarMahasiswa.length > 0)`

<!--
Dipotong ke gambar (diagram yang mengatakan ini):
- Nilai *falsy* hanya: `false`, `0`, `''`, `null`, `undefined`, dan `NaN`
- Semua nilai lain *truthy* — termasuk array kosong `[]` dan objek kosong `{}`

Ini salah paham paling mahal di bagian ini: "kosong berarti salah". Buktikan langsung di Node.js
dengan `if ([])` dan `if (daftar.length > 0)`.

Pertanyaan penuntun: "Kalau daftar mahasiswa kosong, apakah `if (daftarMahasiswa)` dianggap
salah?" (Jawaban: tidak — nilainya selalu benar.)

Lihat ke depan: pemeriksaan panjang array seperti ini muncul saat menampilkan daftar di Bab 4.
-->

---

## Tiga Bentuk Perulangan, Satu Cara Memilih

`praktik-js/05-perulangan.js`

```js
let sisaPercobaan = 3;
while (sisaPercobaan > 0) {
  console.log(`Login gagal, sisa ${sisaPercobaan} kali`);
  sisaPercobaan--;
}

const daftarNilai = [3.45, 3.82, 3.2, 3.61, 2.95];
let total = 0;
for (const nilai of daftarNilai) {
  total = total + nilai;
}
console.log(`Total IPK: ${total}`); // Total IPK: 17.03
```

> `for` untuk putaran pasti; `while` bergantung kondisi; `for...of` menelusuri array.

<!--
Tekankan memilih alat, bukan sintaksisnya: `for` saat jumlah putaran diketahui, `while` saat
berhenti bergantung kondisi (misalnya percobaan login di Bab 13), `for...of` untuk menelusuri
array.

Peringatan: `for (const nilai in daftarNilai)` mengembalikan indeks, bukan nilai — jangan
tertukar dengan `for...of`.

Sebutkan bahwa `for...of` adalah dasar memahami perulangan yang dipakai React untuk menggambar
daftar.
-->

---

## Tiga Jebakan yang Paling Sering Terjadi

- `for (let i = 1; i <= 5; i--)` dijalankan — apa yang terjadi?
- Rantai `if` diurutkan dari syarat paling longgar — cabang mana yang salah?
- `for (const nilai in daftarNilai)` dipakai pada array — apa yang tercetak?

**Jawabannya:** perulangan tidak pernah berhenti karena syarat `i <= 5` selalu benar; IPK 3.45
masuk predikat yang salah karena syarat harus urut dari ketat ke longgar; dan yang tercetak adalah
indeks `0, 1, 2, …`, bukan nilainya — pakai `for...of`.

<!--
Beri 3 menit think-pair-share, minta alasan bukan hanya jawaban. Jawabannya sudah tercetak di
bawah slide ini, jadi tutup dulu baris **Jawabannya** (atau minta kelas memalingkan pandangan)
supaya tiap kelompok menebak lebih dulu. Kalau satu kelompok menjawab semuanya benar, minta mereka
menulis perbaikan satu baris untuk tiap kasus di papan — itulah latihan berikutnya.

Ulangi sebabnya, bukan hasilnya: ketiga kesalahan ini kesalahan "salah alat", bukan "JavaScript
sulit".

Tambahan: perulangan tanpa henti hanya membekukan terminal, tidak merusak komputer — ajarkan
Ctrl+C supaya mahasiswa tidak panik saat praktikum.
-->

---

## Arrow Function Menyingkat dan Tidak Terikat Objek Pemanggil

`praktik-js/06-fungsi.js`

```js
function tentukanPredikat(ipk = 0) {
  if (ipk >= 3.5) return 'Cumlaude';
  if (ipk >= 3.0) return 'Sangat Memuaskan';
  return 'Memuaskan';
}

const tentukanStatus = (ipk) => (ipk >= 2.0 ? 'Lulus' : 'Tidak Lulus');

const jumlahkan = (...angka) => angka.reduce((total, nilai) => total + nilai, 0);

console.log(tentukanPredikat());     // Memuaskan (parameter default 0)
console.log(jumlahkan(1, 2, 3, 4));  // 10
```

> **Arrow function** lebih ringkas dan tidak punya `this` sendiri — sebabnya ia mendominasi kode React.

<!--
Bahas tiga hal: pola *early return* (setiap cabang mengembalikan nilai), arrow function satu
ekspresi tanpa `return` eksplisit, dan parameter bawaan `ipk = 0`.

Peringatan salah paham: arrow function bukan sekadar "fungsi yang lebih pendek" — yang
membedakan adalah `this` yang menunjuk ke lingkup luar, dan itulah sebabnya React memakainya
untuk penangan peristiwa.

Sebutkan jalan ke depan: fungsi kecil satu tugas adalah dasar fungsi murni yang diuji di Bab 14.
-->

---

## Array dan Objek Disalin lewat Alamat, Bukan Isi

`praktik-js/07-array-object.js`

```js
const daftarNama = ['Budi', 'Siti', 'Agus'];
daftarNama.push('Dewi');
console.log(daftarNama.includes('Siti')); // true
console.log(daftarNama.slice(1, 3));      // [ 'Siti', 'Agus' ]

const mahasiswa = { nim: '2201001', nama: 'Budi Santoso', ipk: 3.45 };
const salinan = mahasiswa;       // SALAH jika ingin data terpisah
salinan.ipk = 4.0;
console.log(mahasiswa.ipk);      // 4.0 — objek asli ikut berubah!
```

> Array dan objek adalah tipe rujukan: menyalin dengan `=` hanya menyalin alamatnya.

<!--
Analogi: menyalin rujukan seperti memberi nama panggilan kedua pada orang yang sama — mengubah
nama panggilan tidak memunculkan orang kedua.

Tunjukkan kejutan di tiga baris terakhir, lalu tanya: "Bagaimana cara menyalin objek yang
benar?" (Jawaban: *spread* di subbab 3.6 — biarkan mahasiswa menebak dulu.)

Peringatan: kesalahan aliasing seperti ini jarang muncul di latihan kecil, tetapi sangat sering
terjadi saat mengubah state React di Bab 4.
-->

---

<!-- _class: compact -->

## Lima Data Mahasiswa yang Dipakai Sampai Project Akhir

| NIM | Nama | Prodi | IPK |
|---|---|---|---|
| 2201001 | Budi Santoso | Sistem Informasi | 3.45 |
| 2201002 | Siti Aminah | Teknik Informatika | 3.82 |
| 2201003 | Agus Wijaya | Informatika | 3.20 |
| 2201004 | Dewi Lestari | Rekayasa Perangkat Lunak | 3.61 |
| 2201005 | Rizky Pratama | Sistem Informasi | 2.95 |

> Bentuk objeknya `{ id, nim, nama, prodi, angkatan, ipk, email, telepon }`, dipakai ulang sampai Project Akhir.

<!--
Jelaskan bahwa lima data ini bukan contoh sekali pakai: struktur yang sama dipakai di Bab 4
sampai Bab 8, Bab 10, dan Project Akhir, jadi mahasiswa selalu bekerja pada data yang akrab.

Pertanyaan penuntun: "Ada berapa prodi unik di tabel ini?" (Jawaban: empat, karena Sistem
Informasi muncul dua kali.)

Peringatan: jangan mengarang data mahasiswa lain di latihan, supaya hasil antar mahasiswa bisa
dibandingkan.
-->

---

## Destructuring Mengambil Nilai dalam Satu Baris

`praktik-js/08-destructuring.js`

```js
const mahasiswa = { nim: '2201002', nama: 'Siti Aminah', ipk: 3.82 };
const { nama, nim: nomorInduk, prodi = 'Belum diketahui' } = mahasiswa;
console.log(nama, nomorInduk, prodi);
// Siti Aminah 2201002 Belum diketahui

const nilaiUjian = [80, 90, 75, 88];
const [pertama, kedua, ...sisaNilai] = nilaiUjian;
console.log(pertama, kedua, sisaNilai); // 80 90 [ 75, 88 ]
```

> **Destructuring** memindahkan nilai objek atau array ke variabel dalam satu baris.

<!--
Tunjukkan tiga kemampuan sekaligus: mengambil properti langsung ke variabel, mengganti nama
variabel dengan `nim: nomorInduk`, dan memberi nilai bawaan untuk properti yang tidak ada.

Peringatan: destructuring array bekerja menurut urutan, bukan menurut nama — menukar posisi
menukar nilainya.

Lihat ke depan: pola `const [nilai, setNilai] = useState(0)` di Bab 4 memakai mekanisme yang
sama, jadi slide ini adalah pintu masuk hook.
-->

---

## `...` Menyalin Dulu, Baru Memperbarui

![w:1120](assets/diagrams/bab-03-javascript-modern-untuk-react-native-07.svg)

```js
const dataLama = { nim: '2201003', nama: 'Agus Wijaya', ipk: 3.2 };
const dataBaru = { ...dataLama, ipk: 3.35 };

console.log(dataLama.ipk); // 3.2 (tidak berubah)
console.log(dataBaru.ipk); // 3.35 (objek baru)
```

- Pola `{ ...dataLama, ipk: 3.35 }` adalah dasar pembaruan *immutable* di React

<!--
Tekankan pola "salin dulu, baru perbarui": objek asli tetap utuh, dan kita mendapat objek baru
untuk ditampilkan. Beginilah React memperbarui state di Bab 4 dan Bab 9. Contoh di slide ini ada
di `praktik-js/08-destructuring.js` dan `praktik-js/pengolah-nilai.mjs`.

Dipotong ke gambar (diagram yang mengatakan ini):
- Simbolnya sama, tugasnya beda: *spread* menyebarkan isi, *rest* mengumpulkan sisanya

Ucapkan bedanya dengan satu contoh pendek: `...dataLama` menyebarkan, `...sisaNilai`
mengumpulkan.

Pertanyaan penuntun: "Kenapa React lebih suka membuat objek baru daripada mengubah yang lama?"
(Jawaban: agar perubahan data terdeteksi dan tidak ada component yang membaca data keliru.)

Trik `Set` dipindahkan ke catatan ini supaya gambarnya muat — tulis di papan kalau ada yang
bertanya: `const prodiUnik = [...new Set(daftarMahasiswa.map((m) => m.prodi))]`; `Set` menolak
duplikat, *spread* mengubahnya kembali menjadi array.
-->

---

<!-- _class: compact -->

## `map`, `filter`, `reduce`: Tiga Cara Mengolah Array

| Metode | Tugasnya | Hasilnya |
|---|---|---|
| `map` | mengubah tiap elemen | array baru, panjang sama |
| `filter` | memilih yang lolos syarat | array baru, sama atau lebih pendek |
| `reduce` | menggabungkan semua elemen | satu nilai, misalnya total IPK |

- Ketiganya mengembalikan nilai baru tanpa mengubah array aslinya

![w:1120](assets/diagrams/bab-03-javascript-modern-untuk-react-native-08.svg)

<!--
Bacakan kolom tengahnya saja, lalu minta mahasiswa menebak nama metode untuk tiga pekerjaan:
"ambil semua nama mahasiswa", "ambil IPK di atas 3.5", "hitung total IPK". (Jawaban: `map`,
`filter`, `reduce`.)

Peringatan: `reduce` tanpa nilai awal memakai elemen pertama sebagai akumulator dan gagal pada
array kosong — selalu tulis nilai awalnya `0`.

Dipotong ke gambar (diagram yang mengatakan ini):
- Pendampingnya: `find` mencari satu data, `some` dan `every` menguji syarat

Sebutkan bahwa `map` mengembalikan array baru, sedangkan `forEach` hanya berkeliling tanpa
mengembalikan apa pun; itulah sebabnya pencetakan di praktikum memakai `forEach`.
-->

---

## Filter Dulu, Map Kemudian

`praktik-js/09-map-filter-reduce.js`

```js
const berprestasi = daftarMahasiswa.filter((m) => m.ipk >= 3.5);
console.log(berprestasi.map((m) => `${m.nama} (${m.ipk})`));
// [ 'Siti Aminah (3.82)', 'Dewi Lestari (3.61)' ]

const totalIpk = daftarMahasiswa.reduce((total, m) => total + m.ipk, 0);
const rataRata = totalIpk / daftarMahasiswa.length;
console.log(`Rata-rata IPK: ${rataRata.toFixed(2)}`); // Rata-rata IPK: 3.41

const namaBerprestasi = daftarMahasiswa
  .filter((m) => m.ipk >= 3.5)
  .map((m) => m.nama);
console.log(namaBerprestasi); // [ 'Siti Aminah', 'Dewi Lestari' ]
```

> Rantai `filter(...).map(...)` terbaca wajar: saring dulu, ubah sesudahnya.

<!--
Tunjukkan bahwa argumen tiap metode adalah callback yang menerima satu elemen array — di sini
dinamai `m`, singkatan dari mahasiswa.

Bandingkan cara berpikirnya: perulangan manual memberi tahu komputer *bagaimana*, sedangkan
rantai ini menyatakan *apa* yang diinginkan; hasilnya tidak mungkin salah indeks.

Peringatan: pemula sering menulis `filter` untuk pekerjaan yang sebenarnya mencari satu data —
untuk itu pakai `find`, yang mengembalikan objek, bukan array.
-->

---

<!-- _class: compact -->

## Studi Kasus: Laporan yang Dulu Dikerjakan Manual

| Permintaan bagian akademik | Teknik yang dipakai |
|---|---|
| Rata-rata IPK per prodi | `filter` lalu `reduce` per prodi |
| Penerima beasiswa, IPK minimal 3.5 | `filter` dengan ambang nilai |
| Data mahasiswa dengan NIM tertentu | `find` |
| Laporan yang bisa diulang konsisten | *script* JavaScript dengan keluaran JSON |

> Dulu staf menyaring file Excel dengan tangan: lambat, rawan salah salin, dan hasil tiap staf bisa berbeda. Laporan ini kelak menjadi salah satu layar **Aplikasi Manajemen Data Mahasiswa**.

<!--
Bacakan sebagai cerita masalah kantor, bukan sebagai tabel. Intinya: masalahnya bukan datanya,
tetapi pengolahan manual yang tidak bisa diulang.

Pertanyaan penuntun: "Apa risiko terbesar kalau dua staf mengerjakan permintaan yang sama dengan
tangan?" (Jawaban: dua laporan berbeda dari data yang sama.)

Kaitkan dengan spine: laporan inilah yang kelak menjadi salah satu layar Aplikasi Manajemen Data
Mahasiswa — daftar mahasiswa diambil dari server, disaring, dihitung, lalu ditampilkan dengan
teknik yang sama seperti hari ini.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Bagian 2 — Modul & Pemrograman Asinkron

subbab 3.8 Modul · 3.9 Promise · 3.10 `async`/`await` & `try`/`catch`

<!--
Bagian ini yang membedakan "bisa menulis JavaScript" dari "siap memakai React Native": aplikasi
mobile selalu memanggil data dari luar dirinya, dan semuanya berbentuk operasi asinkron.

Menurut RPS, sistem modul (subbab 3.8) masih bagian pertemuan 3; kalau pertemuan 3 kehabisan
waktu, subbab 3.9–3.10 yang bergeser ke pertemuan 4 bersama Praktikum 3.
-->

---

## Modul Memecah Kode Menjadi File

![w:1120](assets/diagrams/bab-03-javascript-modern-untuk-react-native-02.svg)

> **Modul** memecah kode menjadi file; hanya yang di-`export` bisa dipakai file lain.

<!--
Ceritakan alasan historisnya singkat: sebelum ada modul, setiap file dimuat lewat tag script dan
berbagi satu ruang nama global, sehingga dua file yang memakai nama `daftarMahasiswa` saling
menimpa tanpa peringatan.

Pertanyaan penuntun: "Kenapa file data dipisahkan dari file logika?" (Jawaban: data dan logika
bisa diuji dan diubah sendiri-sendiri, dan itu meniru pemisahan data dari tampilan nanti.)

Peringatan: nama di dalam kurung kurawal `import` harus sama persis dengan nama yang di-`export`.
-->

---

## Menjalankan Modul di Node.js Butuh Dua Langkah

`praktik-js/cetak-data.mjs` — dijalankan dari dalam folder `praktik-js`

```bash
node cetak-data.mjs
node --check cetak-data.mjs
```

![w:1120](assets/diagrams/bab-03-javascript-modern-untuk-react-native-09.svg)

- Tanpa `.mjs` atau `"type": "module"`, `import` ditolak dengan `SyntaxError`
- `node --check` berhasil bila terminal tidak menampilkan apa pun (kode keluar 0)

<!--
Dipotong ke gambar (diagram yang mengatakan ini):

    `praktik-js/package.json` — alternatifnya kalau file tetap berekstensi `.js`

    { "type": "module" }

Panel kanan gambar memuat dua fakta yang sama dalam sekali pandang — `"type": "module"` dan tempat
menaruhnya — jadi literalnya disimpan di catatan ini, apa adanya, untuk yang ingin mengetiknya.

Tunjukkan dua cara mengaktifkan ESM, lalu sebutkan pilihan praktis bab ini: pakai ekstensi `.mjs`
karena paling cepat.

Peringatan: tidak ada keluaran dari pemeriksaan sintaksis sering disangka gagal oleh mahasiswa.
Minta mereka memeriksa kode keluar dengan `echo $?` (macOS/Linux) atau `echo %errorlevel%`
(Windows): angka 0 berarti sintaksisnya sah.

Pertanyaan penuntun: "Apa yang terjadi kalau `import` menunjuk nama file yang salah?" (Jawaban:
ERR_MODULE_NOT_FOUND, karena nama file di Node peka huruf besar-kecil.)
-->

---

## Promise Punya Tiga Keadaan

![w:1120](assets/diagrams/bab-03-javascript-modern-untuk-react-native-03.svg)

> **Promise** adalah objek yang mewakili hasil operasi asinkron yang belum tentu selesai.

<!--
Analogi: promise seperti nomor antrean layanan — barangnya belum ada, tetapi kamu sudah punya
bukti bahwa hasilnya akan ada, atau bahwa permintaannya gagal.

Tekankan alasan keberadaannya: JavaScript berjalan pada satu thread, jadi operasi lambat yang
dibiarkan memblokir akan membekukan seluruh aplikasi.

Peringatan: mahasiswa sering mengira mereka harus sering membuat Promise sendiri. Yang wajib
adalah bisa memakainya, karena `fetch` di Bab 10 mengembalikan Promise.
-->

---

<!-- _class: compact -->

## `.then`, `.catch`, `.finally`: Membaca Promise

`praktik-js/10-promise.js`

```js
function ambilDataMahasiswa() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ nim: '2201001', nama: 'Budi Santoso', ipk: 3.45 });
    }, 1000);
  });
}

console.log('Mengambil data...');
ambilDataMahasiswa()
  .then((data) => console.log(`Data diterima: ${data.nama} (IPK ${data.ipk})`))
  .catch((error) => console.error('Gagal mengambil data:', error.message))
  .finally(() => console.log('Proses selesai.'));
```

> `.finally` selalu dijalankan — tempat yang tepat menutup indikator "loading…".

<!--
Jelaskan bahwa `setTimeout` di sini hanya alat bantu supaya terasa seperti latensi jaringan; di
Bab 10 perannya digantikan `fetch`.

Tunjukkan bentuk kodenya yang datar: rantai `.then`/`.catch` menggantikan callback bersarang
yang makin dalam dan makin sulit dibaca.

Pertanyaan penuntun: "Di mana tulisan 'Mengambil data…' dipasang dan di mana dihapus?"
(Jawaban: sebelum pemanggilan, dan di dalam `.finally`.)

Sebutkan bahwa `Promise.all` dipakai saat beberapa permintaan ditunggu sekaligus.
-->

---

## `async`/`await` Membuat Asinkron Terbaca Berurutan

```js
async function tampilkanData() {
  console.log('Memuat data...');
  const data = await ambilDataMahasiswa();
  console.log(`Data diterima: ${data.nama} (IPK ${data.ipk})`);
  return data;
}

tampilkanData();
```

![w:1120](assets/diagrams/bab-03-javascript-modern-untuk-react-native-10.svg)

<!--
Dipotong untuk memberi tempat pada gambar — bukan karena diagram mengatakannya, tetapi karena
jalur `try`/`catch` adalah pokok slide berikutnya dan punya gambar sendiri. Blok kode di slide ini
tetap utuh: templat `async`/`await`, baris kemajuannya, dan pemanggilannya. Bungkus `try`/`catch`
yang dulu mengapitnya ada di catatan ini, apa adanya:

    async function tampilkanData() {
      try {
        console.log('Memuat data...');
        const data = await ambilDataMahasiswa();
        console.log(`Data diterima: ${data.nama} (IPK ${data.ipk})`);
        return data;
      } catch (error) {
        console.error('Terjadi kegagalan:', error.message);
      }
    }

    tampilkanData();

Versi lengkapnya `latihan-async.js` di `kode/bab-03-javascript-modern-untuk-react-native/`;
contoh yang bisa dijalankan ada di `praktik-js/11-async-await.js`.

Tunjukkan bahwa satu-satunya baris yang berbeda dari kode sinkron adalah `await` di depan
pemanggilan — itulah daya tarik sintaksis ini untuk tiga langkah berurutan seperti "ambil data,
olah, simpan".

Dipotong ke gambar (diagram yang mengatakan ini):
- Fungsi `async` selalu mengembalikan *promise*
- `await` menunggu satu Promise tanpa membekukan seluruh aplikasi

Peringatan: `await` hanya sah di dalam fungsi `async` atau di tingkat teratas sebuah modul;
memakainya di tempat lain memunculkan SyntaxError.

Lihat ke depan: pola `async`/`await` dengan `try`/`catch` inilah yang dipakai setiap kali kita
memanggil server di Bab 10, menyimpan lokal di Bab 11, dan melakukan autentikasi di Bab 13.
-->

---

## `try`/`catch`: Aplikasi Tidak Boleh Diam Saja

![w:1120](assets/diagrams/bab-03-javascript-modern-untuk-react-native-04.svg)

> Blok `catch` adalah tempat aplikasi memilih bereaksi, bukan tempat menyembunyikan error.

<!--
Bacakan alurnya sebagai cerita satu permintaan data: berhasil sampai pengguna melihat datanya,
gagal sampai pengguna melihat pesan yang jelas.

Pertanyaan penuntun: "Aplikasi apa yang pernah kamu pakai dan diam saja saat gagal memuat?"
(Arahkan ke kesimpulan bahwa diam adalah pilihan desain yang buruk.)

Tambahan: blok `catch` kosong membuat error lenyap tanpa jejak — selalu tampilkan atau catat
pesan kegagalannya.
-->

---

## Kerjakan Tiga Latihan Ini Sebelum Kuis 1

**Latihan di kelas**

- `latihan-predikat.js`: `map` digabung `tentukanPredikat`
- `latihan-cari.js`: `find` berdasarkan NIM
- `hitungRataRataAngkatan(angkatan)`: `filter` lalu `reduce`

**Diskusi kelas**

- Perulangan biasa atau `reduce` untuk mencari IPK tertinggi?
- Kenapa `try`/`catch` lebih baik daripada membiarkan program berhenti?

<!--
Latihan pertama dan kedua dikerjakan di kelas kalau waktu masih ada; latihan ketiga menjadi
pekerjaan rumah bersama soal 1–5 di Latihan Bab 3, sesuai RPS pertemuan 3.

Untuk diskusi, beri 3 menit berpasangan lalu tampung 2–3 jawaban. Jawaban yang diharapkan untuk
butir kedua: aplikasi tetap hidup dan pengguna menerima pesan yang jelas, bukan layar yang
membeku.

Nilai diskusi dari kualitas alasannya, bukan dari pilihan jawabannya; catat partisipasi untuk
komponen partisipasi.
-->

---

<!-- _class: compact -->

## Praktikum: Yang Dibangun Pertemuan Ini

- Buka `kode/bab-03-javascript-modern-untuk-react-native/`; `node --version` menampilkan 22 atau lebih
- `utils/akademik.js` memuat satu fungsi murni per teknik: `totalSks` dan `hitungIpk` (`reduce`), `filterSemester` (`filter`), `cariMatakuliah` (`find`), `kelompokkanPerSemester` (`reduce`), `urutkanJadwal` (`sort` pada salinan)
- `data/matakuliah.js` dan `data/mahasiswa.js` mengekspor data dengan `export` — tanpa `require`
- Jalankan tiga latihan CLI: `node latihan-predikat.js`, `node latihan-cari.js 20230002`, `node latihan-async.js`
- `latihan-async.js` memperlihatkan `async`/`await` + `try`/`catch`/`finally`; tambahkan `--gagal` untuk melihat jalur gagal

<!--
Dipotong ke catatan (tidak muat di slide):

> File lengkapnya ada di `kode/bab-03-javascript-modern-untuk-react-native/`. Semuanya modul ES, karena proyek itu menyetel `"type": "module"` di `package.json`; itu sebabnya `node latihan-cari.js` berjalan tanpa `.mjs`.

Bacakan kutipan itu sebelum menutup slide: seluruh praktikum ini modul ES, dan `"type": "module"`
adalah yang membuat `node latihan-cari.js` berjalan tanpa ekstensi `.mjs`.

Tekankan bahwa latihan ini versi kecil dari otomatisasi laporan: satu script yang bisa dijalankan
ulang dengan hasil yang konsisten.

Tambahkan satu pertanyaan penuntun: "Apa yang terjadi kalau perintah dijalankan dari folder lain?"
(Jawaban: program tetap jalan, tetapi `hasil-rekap.json` muncul di folder tempat terminal berada.)

Peringatan: praktikum ini tanpa dependency, jadi kegagalan hampir selalu berasal dari ekstensi
file atau folder kerja yang salah, bukan dari package yang belum dipasang.
-->

---

## Yang Harus Teramati

Cocokkan tiga hal berikut:

- **Rata-rata per prodi** — Sistem Informasi 3.20, Teknik Informatika 3.82, Informatika 3.20, Rekayasa Perangkat Lunak 3.61
- **Mahasiswa berprestasi** (IPK minimal 3.5) — Siti Aminah 3.82 dan Dewi Lestari 3.61
- **File keluaran** — `hasil-rekap.json` terbentuk dan memuat `jumlahMahasiswa` 5

> Satu-satunya nilai yang boleh berbeda di komputer kamu adalah `disimpanPada`, yaitu waktu penyimpanan.

<!--
Tegaskan tiga penanda berhasil, bukan hanya "tidak ada error": keluarannya cocok, filenya
terbentuk, dan isi filenya memuat `jumlahMahasiswa` 5.

Anggap wajar kalau ada yang berbeda: angka di slide berasal dari hasil eksekusi nyata penulis buku, jadi
satu-satunya nilai yang boleh berbeda di komputer mahasiswa adalah `disimpanPada`, yaitu waktu
penyimpanan.

Pertanyaan penuntun: "Kenapa rata-rata Sistem Informasi dan Informatika sama-sama 3.20?"
(Jawaban: tiap prodi hanya punya satu mahasiswa di data statis itu.)
-->

---

<!-- _class: center -->

## Kuis Kilat

- Hasil `[5, 8, 3, 9].filter((x) => x > 4)` adalah…
- Hasil `[1, 2, 3, 4].reduce((total, x) => total + x, 0)` adalah…
- Agar `import` berjalan di Node.js tanpa konfigurasi tambahan, ekstensi filenya…
- Pernyataan yang benar tentang arrow function adalah…

<!--
Kuis lisan 5 menit: tampilkan pertanyaan, minta kelas menjawab serempak atau dengan mengangkat
tangan, lalu lanjut ke slide kunci. Jangan bocorkan jawaban di slide ini.

Butir ketiga dan keempat paling sering terlewat; kalau itu terjadi, ulangi subbab 3.8 dan 3.4
sebelum menutup pertemuan. Soal-soal ini juga pemanasan Kuis 1 di pertemuan berikutnya.
-->

---

<!-- _class: center -->

## Kunci Kuis Kilat

- `[5, 8, 9]` — `filter` menyimpan elemen yang memenuhi syarat
- `10` — `reduce` menjumlahkan semua elemen dengan nilai awal `0`
- `.mjs` — alternatifnya `"type": "module"` di `package.json`
- Arrow function tidak punya `this` sendiri — sebabnya ia mendominasi React

<!--
Ulangi dua pembedaan yang paling sering tertukar: `filter` mengembalikan array, sedangkan `find`
mengembalikan satu elemen; dan ekstensi `.mjs` mengubah cara Node membaca file, bukan isi
kodenya.

Kalau jawaban kelas beragam pada butir keempat, tulis ulang contoh penangan peristiwa di papan
dan tanya nilai `this` di dalamnya.
-->

---

## Ringkasan

1. `const` untuk nilai tetap dan `let` untuk nilai yang berubah; keduanya *block scoped*
2. Pakai `===`, tambah `?.` dan `??`; ingat nilai *falsy* saat menulis syarat
3. Arrow function lebih ringkas dan tanpa `this` sendiri — dasar kode React
4. `map`, `filter`, `reduce`, *destructuring*, dan *spread* mengolah data tanpa mengubah aslinya
5. Modul memecah kode; `async`/`await` dengan `try`/`catch` adalah pola baku memanggil data

<!--
Jangan dibacakan. Minta lima mahasiswa berbeda menjelaskan satu nomor dengan kata-kata sendiri —
ini jauh lebih bekerja daripada mengulang bacaan.

Pesan penutup: dua kebiasaan yang dibawa dari bab ini sampai akhir buku adalah memakai `===` dan
memperlakukan data sebagai sesuatu yang disalin, bukan diubah.
-->

---

## Referensi

| Sumber | Link |
|---|---|
| JavaScript, MDN Web Docs (2026) | developer.mozilla.org |
| Dokumentasi Node.js (2026) | nodejs.org |
| Dokumentasi React (2026) | react.dev |
| Dokumentasi React Native (2026) | reactnative.dev |
| Dokumentasi Expo (2026) | docs.expo.dev |

**Bacaan lanjutan:** Bab 4 — Dasar React; Lampiran C — Glosarium (*Promise*, *hook*, *JSX*)

**Versi teknologi:** Expo SDK 57 · React Native 0.86 · React 19.2 · Node.js ≥ 22

<!--
Sebutkan bahwa glosarium Lampiran C memuat istilah yang dipakai hari ini — destructuring, spread
operator, Promise, async/await — sehingga mahasiswa tidak perlu mencari artinya di blog asing.

Sumber utama bab ini adalah dokumentasi resmi MDN dan Node.js; semua contoh berjalan dengan
Node.js di folder praktik-js tanpa dependency tambahan.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Siap ke Bab 4

**Tugas:** selesaikan Praktikum 3, kerjakan Latihan Bab 3, dan siapkan diri untuk Kuis 1.

Pertemuan berikutnya: Dasar React — component, JSX, props, dan state.

<!--
Tutup dengan satu kalimat: "Hari ini kita belajar berbicara; pertemuan berikutnya kita mulai
menggambar di layar." Tegaskan bahwa semua yang dipelajari hari ini akan muncul lagi di setiap
bab sesudahnya.

Sebutkan tenggat secara eksplisit: kapan Latihan Bab 3 dikumpulkan, dalam format apa, dan
bagaimana dinilainya lewat rubrik praktikum Lampiran A (pemahaman konsep 15%, implementasi 25%,
kualitas kode 15%, UI/UX 15%, debugging 10%, dokumentasi 20%).
-->
