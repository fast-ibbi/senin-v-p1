# BAB 3 — JavaScript Modern untuk React Native

## Deskripsi Singkat

Bab ini membekali Anda dengan fondasi **JavaScript modern** (bahasa induk React Native) yang akan dipakai di seluruh bab berikutnya. Anda akan mempelajari variabel, tipe data, operator, percabangan, perulangan, fungsi, pengolahan array dan objek, sistem modul, hingga pemrograman asinkron dengan *Promise* dan `async`/`await`. Semua materi di bab ini murni JavaScript yang dijalankan dengan Node.js — belum ada antarmuka atau layar — sehingga Anda dapat mengasah logika pemrograman sebelum menulis komponen di Bab 4.

## Tujuan Pembelajaran

Setelah menyelesaikan bab ini, mahasiswa mampu:

1. Menjelaskan perbedaan `const` dan `let` beserta konsekuensi *scope* (ruang lingkup) masing-masing.
2. Mengidentifikasi tipe data dasar, operator aritmetika, perbandingan, dan logika yang umum dipakai dalam pengembangan aplikasi.
3. Mengimplementasikan struktur kontrol: percabangan (`if`, ternary, `switch`) dan perulangan (`for`, `while`, `for...of`).
4. Menganalisis perbedaan fungsi biasa dan **arrow function** (fungsi panah), termasuk perilaku `this`.
5. Mengimplementasikan pengolahan data dengan array dan objek: *destructuring*, *spread operator*, `map`, `filter`, dan `reduce`.
6. Mengimplementasikan pemisahan kode dengan **module** (modul) `import`/`export` dan menjalankannya di Node.js.
7. Mengevaluasi pola pemrograman asinkron: *Promise*, `async`/`await`, dan `try`/`catch` untuk menangani kegagalan.

## Peta Konsep

```text
JavaScript Modern (ES2020+)
├─ Dasar Bahasa
│   ├─ Variabel: const, let           → 3.1
│   ├─ Tipe data & operator           → 3.2
│   ├─ Percabangan & perulangan       → 3.3
│   └─ Fungsi & arrow function        → 3.4
├─ Struktur Data
│   ├─ Array & Object                 → 3.5
│   ├─ Destructuring & spread         → 3.6
│   └─ map / filter / reduce          → 3.7
├─ Sistem Modul (import/export)       → 3.8
└─ Pemrograman Asinkron
    ├─ Promise                        → 3.9
    └─ async/await + try/catch        → 3.10
        └─ Mini Project: Pengolah Nilai Mahasiswa (Praktikum 3)
```

## Materi

### 3.1 Variabel: `const` dan `let`

**Variabel** (peubah) adalah tempat menyimpan nilai di dalam program. JavaScript versi lama hanya mengenal `var`, yang bersifat *function scope* (ruang lingkup fungsi) dan mudah menimbulkan bug karena nilainya dapat diubah di mana saja tanpa disadari. Sejak ES6 (2015), JavaScript memperkenalkan dua cara deklarasi yang lebih aman: **`const`** (konstan, diisi sekali) dan **`let`** (dapat diisi ulang). Keduanya bersifat *block scope* (ruang lingkup blok), artinya hanya berlaku di dalam pasangan kurung kurawal `{ }` terdekat.

Mengapa kita perlu dua jenis deklarasi? Jawabannya adalah disiplin: `const` memberi sinyal bahwa nilai tidak boleh diubah sepanjang hidupnya — menurunkan kemungkinan salah ubah yang tidak disengaja. Sebaliknya, `let` dipakai ketika nilai memang harus diperbarui, misalnya penghitung (counter) dalam perulangan. React sendiri mendorong gaya ini: hampir semua kode komponen memakai `const`, dan `let` hanya muncul saat benar-benar diperlukan. Ingat pula bahwa `const` tidak membuat objek menjadi beku: Anda tetap dapat mengubah *properti* (atribut) dari objek yang dideklarasikan dengan `const`, hanya saja tidak dapat menunjuk objek lain.

File: praktik-js/01-variabel.js

```js
const namaAplikasi = 'Aplikasi Mahasiswa';
let jumlahMahasiswa = 5;

jumlahMahasiswa = jumlahMahasiswa + 1; // boleh: let dapat diisi ulang
console.log(namaAplikasi, jumlahMahasiswa); // Aplikasi Mahasiswa 6

// namaAplikasi = 'Nama Lain'; // ERROR: const tidak dapat diisi ulang

const mahasiswa = { nama: 'Budi Santoso', ipk: 3.45 };
mahasiswa.ipk = 3.5; // BOLEH: properti objek tetap bisa diubah
console.log(mahasiswa.ipk); // 3.5
```

Penjelasan: baris pertama dan kedua mendeklarasikan dua variabel dengan pola yang dianjurkan — `const` untuk nilai yang tidak pernah diganti, `let` untuk nilai yang berubah. Baris keempat menunjukkan bahwa `let` dapat diisi ulang, sedangkan baris yang dikomentari menunjukkan bahwa mengisi ulang `const` akan memunculkan `TypeError`. Bagian terakhir memperlihatkan sifat penting `const` terhadap objek: Anda boleh mengubah nilai properti seperti `ipk`, karena yang dijaga `const` hanyalah rujukan (alamat memori) objeknya, bukan isinya. Pola ini sangat sering Anda jumpai di React, misalnya `const [nilai, setNilai] = useState(0)` pada Bab 4: variabel `nilai` tidak pernah diisi ulang langsung, melainkan diganti melalui fungsi `setNilai`.

### 3.2 Tipe Data dan Operator

JavaScript memiliki enam tipe data dasar yang perlu Anda kuasai: **string** (teks), **number** (angka, termasuk bilangan desimal), **boolean** (logika benar/salah: `true` atau `false`), **undefined** (belum terdefinisi), **null** (sengaja kosong), dan **object** (objek), yang di dalamnya termasuk **array** (larik) dan fungsi. Operator `typeof` dipakai untuk memeriksa tipe sebuah nilai. Perlu Anda sadari sejak awal: `typeof []` dan `typeof null` sama-sama menghasilkan `"object"` — peninggalan sejarah JavaScript — sehingga jangan pernah mengandalkan `typeof` sendirian untuk membedakan array dan `null`.

Pengertian tipe data bukan sekadar pengetahuan teori: tipe menentukan perilaku operator. Misalnya `"1" + 1` menghasilkan teks `"11"` (penggabungan), sedangkan `"1" - 1` menghasilkan angka `0` (pengurangan). Perbedaan inilah yang membuat **strict equality** (kesetaraan ketat) `===` wajib dipakai dibandingkan `==`, karena `==` melakukan konversi tipe otomatis yang sering menghasilkan perbandingan yang mengecoh. Untuk menampilkan teks yang memuat nilai variabel, gunakan **template literal** (teks templat) dengan tanda kutip belakang `` ` `` dan sintaks `${ }`.

File: praktik-js/02-tipe-data.js

```js
const nim = '2201001';          // string
const ipk = 3.45;               // number
const aktif = true;             // boolean
const nilaiBelumDiketahui = undefined;
const nilaiKosong = null;

console.log(typeof nim);        // string
console.log(typeof ipk);        // number
console.log(typeof aktif);      // boolean
console.log(typeof nilaiBelumDiketahui); // undefined
console.log(typeof nilaiKosong);         // object (khas JavaScript)
console.log(typeof [1, 2, 3]);           // object

console.log('3' == 3);  // true  — konversi otomatis, hindari
console.log('3' === 3); // false — kesetaraan ketat, gunakan ini
console.log(0.1 + 0.2 === 0.3); // false — bilangan desimal tidak persis

const nama = 'Budi Santoso';
const pesan = `Selamat datang, ${nama}!`;
console.log(pesan); // Selamat datang, Budi Santoso!
```

Penjelasan: kode di atas memperlihatkan deklarasi kelima tipe dasar lalu mencetak hasil `typeof` masing-masing. Dua baris perbandingan menegaskan mengapa buku ini konsisten memakai `===`: `'3' == 3` bernilai `true` karena JavaScript mengubah teks menjadi angka sebelum membandingkan, padahal secara konsep teks `'3'` berbeda dengan angka 3. Baris `0.1 + 0.2 === 0.3` yang mencetak `false` adalah kejutan klasik bagi pemula: komputer menyimpan bilangan desimal dalam biner sehingga `0.1 + 0.2` menghasilkan `0.30000000000000004`. Implikasinya, dalam aplikasi keuangan jangan membandingkan hasil hitung desimal secara langsung dengan `===`; bandingkan dengan selisih yang sangat kecil (epsilon) atau bulatkan dengan `toFixed()`. Bagian akhir menunjukkan template literal, yang jauh lebih rapi daripada penggabungan teks secara manual.

Operator yang paling sering dipakai dalam pengembangan React Native adalah operator aritmetika (`+`, `-`, `*`, `/`, `%`), operator perbandingan (`===`, `!==`, `>`, `<`, `>=`, `<=`), operator logika (`&&`, `||`, `!`), serta dua kawan modernnya: **optional chaining** (rantai opsional) `?.` yang mengamankan akses properti yang mungkin kosong, dan **nullish coalescing** (penggabung nilai kosong) `??` yang menyediakan nilai bawaan hanya ketika nilainya `null`/`undefined`. Kedua operator ini lahir untuk mengurangi pola `if (objek && objek.profil)` yang panjang: alih-alih menyebut "benda ini ada dan punya properti itu", JavaScript kini dapat bertanya sekaligus dengan `objek?.profil`.

File: praktik-js/03-operator.js

```js
const a = 10;
const b = 3;
console.log(a + b, a - b, a * b, a / b, a % b); // 13 7 30 3.3333333333333335 1

const nilaiAkhir = 85;
const predikat = nilaiAkhir >= 80 ? 'Memuaskan' : 'Cukup';
console.log(predikat); // Memuaskan

const mahasiswa = { nama: 'Siti Aminah', alamat: null };
console.log(mahasiswa.alamat?.kota);  // undefined, tidak error
console.log(mahasiswa.alamat ?? 'Alamat tidak tercatat'); // Alamat tidak tercatat
console.log(`Lulus Cumlaude: ${mahasiswa.ipk >= 3.5}`);   // Lulus Cumlaude: false
```

Penjelasan: operator `%` (modulo) menghasilkan sisa pembagian — `10 % 3` adalah `1` — yang berguna misalnya untuk menentukan baris ganjil/genap dalam tampilan daftar. Contoh kedua memperlihatkan bahwa hasil perbandingan adalah nilai `boolean` yang dapat langsung dipakai; operator ternary `? :` (tiga operan: kondisi, nilai jika benar, nilai jika salah) adalah salah satu cara paling ringkas menulis percabangan satu baris dan akan sering Anda lihat di kode React. Contoh ketiga memakai `?.` dan `??` pada objek mahasiswa: mengakses `alamat.kota` saat `alamat` berisi `null` akan memicu error, tetapi `alamat?.kota` dengan aman menghasilkan `undefined`, dan `??` menggantinya dengan teks bawaan. Perhatikan bahwa properti `ipk` tidak terdefinisi pada objek ini, sehingga perbandingannya pun menghasilkan `false` — ini mengingatkan kita bahwa mengakses properti yang tidak ada tidak selalu error, tetapi nilainya `undefined` dan harus diperlakukan dengan hati-hati.

### 3.3 Percabangan dan Perulangan

Program tidak pernah sekadar menjalankan baris demi baris; ia harus mengambil keputusan. **Percabangan** (branching) dengan `if`/`else` memungkinkan kode berjalan hanya ketika kondisi terpenuhi. Setiap kondisi dievaluasi sebagai *truthy* (dianggap benar) atau *falsy* (dianggap salah); nilai yang tergolong *falsy* hanyalah `false`, `0`, `''` (teks kosong), `null`, `undefined`, dan `NaN`, sedangkan semua nilai lain — termasuk array kosong `[]` dan objek kosong `{}` — dianggap *truthy*. Kesalahpahaman umum adalah menganggap "kosong" itu `false`; padahal `if ([])` selalu masuk cabang benar, jadi tulis kondisi eksplisit seperti `daftar.length > 0`.

Percabangan di JavaScript hadir dalam tiga gaya dengan tujuan berbeda: `if`/`else` untuk kondisi kompleks, **ternary operator** (operator tiga operan) untuk memilih di antara dua nilai sederhana, dan `switch` untuk membandingkan satu nilai dengan banyak kasus. Untuk perulangan (loop), JavaScript menyediakan `for` (saat jumlah perulangan sudah diketahui), `while` (saat berhenti bergantung kondisi), dan `for...of` (menelusuri nilai setiap elemen array) — `for...of` adalah pilihan yang paling aman dan terbaca untuk array, dan sebaiknya diutamakan dibandingkan `for (let i = 0; ...)` yang rawan salah batas indeks, atau `for...in` yang justru mengembalikan nama properti, bukan nilai, dan tidak cocok untuk array.

File: praktik-js/04-percabangan.js

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
console.log(statusKelulusan); // Lulus

const kodeProdi = 'SI';
switch (kodeProdi) {
  case 'SI':
    console.log('Sistem Informasi');
    break;
  case 'TI':
    console.log('Teknik Informatika');
    break;
  default:
    console.log('Prodi lain');
}
```

Penjelasan: rantai `if`/`else if`/`else` di atas mengevaluasi kondisi dari atas ke bawah dan berhenti pada cabang pertama yang benar — urutan ini penting: jika `ipk >= 3.0` ditulis lebih dulu, mahasiswa ber-IPK 3.45 akan salah dikategorikan sebagai "Sangat Memuaskan" padahal berhak "Cumlaude". Pernyataan `switch` membandingkan `kodeProdi` dengan setiap `case`; kata kunci `break` menghentikan pengecekan agar eksekusi tidak "jatuh" (fall-through) ke kasus berikutnya. Cara kerja `switch` inilah alasan ia lebih cocok untuk banyak kemungkinan nilai dari satu variabel (misalnya kode hari atau status pesanan) daripada rantai `if` yang panjang.

File: praktik-js/05-perulangan.js

```js
for (let i = 1; i <= 3; i++) {
  console.log(`Perulangan ke-${i}`);
}

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

Penjelasan: blok `for` klasik terdiri dari tiga bagian — inisialisasi penghitung, kondisi berhenti, dan pembaruan penghitung; bagian-bagian ini rawan salah tulis (misalnya lupa `i++` yang mengakibatkan perulangan tak berujung). Perulangan `while` cocok ketika jumlah putaran tidak diketahui sebelumnya: contoh di atas menghentikan percobaan login setelah tiga kali gagal — pola yang biasa dipakai untuk membatasi percobaan autentikasi (lihat Bab 13). Yang terpenting, `for...of` menelusuri isi `daftarNilai` tanpa perlu tahu indeks sama sekali, sehingga menghilangkan seluruh kelas kesalahan "di luar batas array". Pola `for...of` juga menjadi dasar pemahaman iterasi yang dipakai React untuk merender daftar komponen di Bab 4.

### 3.4 Fungsi dan Arrow Function

**Fungsi** (function) adalah blok kode bernama yang dapat dipanggil berulang kali — inilah unit dasar penataan logika aplikasi. JavaScript modern mengenal dua gaya penulisan fungsi: deklarasi fungsi klasik dan **arrow function** (fungsi panah) yang diperkenalkan ES6. Keduanya dapat dipakai untuk tujuan yang sama, tetapi arrow function lebih ringkas dan, yang lebih penting, tidak memiliki `this` sendiri. Konsekuensinya: di dalam arrow function, kata kunci `this` merujuk ke *lingkup di luar* fungsi tersebut. Inilah alasan mengapa ekosistem React (termasuk React Native) nyaris selalu memakai arrow function untuk *event handler* (penangan peristiwa) — kita tidak ingin `this` berubah ketika fungsi dipanggil sebagai tanggapan atas sentuhan pengguna.

Perbedaan praktis lainnya: arrow function dengan tubuh satu ekspresi dapat mengembalikan nilai secara implisit (tanpa kata kunci `return`), sedangkan deklarasi fungsi klasik "diangkat" (*hoisting*) sehingga dapat dipanggil sebelum baris deklarasinya — nyaman tetapi kadang menyembunyikan alur program yang sebenarnya. Fungsi juga dapat menerima **parameter default** (nilai bawaan) yang dipakai bila argumen tidak diberikan, dan **rest parameter** (parameter sisa) `...args` untuk menampung argumen sebanyak apa pun menjadi array.

File: praktik-js/06-fungsi.js

```js
function tentukanPredikat(ipk = 0) {
  if (ipk >= 3.5) return 'Cumlaude';
  if (ipk >= 3.0) return 'Sangat Memuaskan';
  return 'Memuaskan';
}

const tentukanStatus = (ipk) => (ipk >= 2.0 ? 'Lulus' : 'Tidak Lulus');

const jumlahkan = (...angka) => angka.reduce((total, nilai) => total + nilai, 0);

console.log(tentukanPredikat(3.82)); // Cumlaude
console.log(tentukanPredikat());     // Memuaskan (parameter default 0)
console.log(tentukanStatus(2.95));   // Lulus
console.log(jumlahkan(1, 2, 3, 4));  // 10
```

Penjelasan: keempat fungsi di atas menunjukkan spektrum gaya penulisan. `tentukanPredikat` adalah deklarasi fungsi klasik dengan pola *early return* (pengembalian lebih awal) — setiap cabang mengembalikan nilai dan mengakhiri fungsi, menghindari rantai `else if` yang bertingkat. `tentukanStatus` ditulis sebagai arrow function satu baris: tanpa kurung kurawal, ekspresi `ipk >= 2.0 ? 'Lulus' : 'Tidak Lulus'` otomatis menjadi nilai kembalian. `jumlahkan` memperlihatkan rest parameter: semua argumen masuk ke array `angka` dan dijumlahkan dengan `reduce` (akan dibahas di Subbab 3.7). Pola "fungsi kecil yang melakukan satu hal dengan jelas" ini adalah fondasi **pure function** (fungsi murni) yang akan diuji di Bab 14: fungsi yang selalu memberi keluaran sama untuk masukan sama dan tidak mengubah data di luarnya.

### 3.5 Array dan Object

**Array** (larik) menyimpan sekumpulan nilai berurutan, sedangkan **object** (objek) menyimpan pasangan nama–nilai yang disebut properti. Keduanya adalah tipe *reference* (rujukan): variabel menyimpan alamat (rujukan) ke data, bukan salinan nilai. Konsekuensi yang sering menjerat pemula: `const a = [1, 2]; const b = a; b.push(3);` akan mengubah `a` juga, karena `a` dan `b` menunjuk array yang sama. Jika kita ingin salinan yang benar-benar terpisah, kita perlu *spread operator* (Subbab 3.6) atau `slice()` — pola yang wajib dipahami karena React menekankan pembaruan data secara *immutable* (tidak mengubah data lama, melainkan membuat data baru).

Objek adalah tulang punggung data aplikasi. Seluruh buku ini memakai satu bentuk data mahasiswa yang konsisten: `{ id, nim, nama, prodi, angkatan, ipk, email, telepon }` — lima contohnya disajikan utuh di Praktikum 3. Objek dibaca dengan notasi titik (`mahasiswa.nama`) atau notasi kurung (`mahasiswa['nama']`) yang berguna saat nama properti disimpan dalam variabel. JavaScript juga menyediakan singkatan deklarasi: jika nama variabel sama dengan nama properti, cukup tulis `{ nama }`. Untuk penelusuran cepat di dalam array, kenali juga `includes` (mengecek keberadaan nilai), `findIndex` (posisi elemen), dan `slice` (memotong salinan bagian array).

File: praktik-js/07-array-object.js

```js
const daftarNama = ['Budi', 'Siti', 'Agus'];
daftarNama.push('Dewi');
console.log(daftarNama.length);        // 4
console.log(daftarNama.includes('Siti')); // true
console.log(daftarNama.slice(1, 3));   // [ 'Siti', 'Agus' ]

const namaProdi = 'Sistem Informasi';
const mahasiswa = {
  id: 1,
  nim: '2201001',
  nama: 'Budi Santoso',
  prodi: namaProdi,   // singkatan: sama dengan { prodi: namaProdi }
  ipk: 3.45,
};
console.log(mahasiswa.nama);   // Budi Santoso
const kunciYangDicari = 'ipk';
console.log(mahasiswa[kunciYangDicari]); // 3.45

const salinan = mahasiswa;        // SALAH jika ingin data terpisah
salinan.ipk = 4.0;
console.log(mahasiswa.ipk);       // 4.0 — objek asli ikut berubah!
```

Penjelasan: bagian array memperlihatkan tiga operasi dasar — menambah elemen di belakang dengan `push`, memeriksa keberadaan dengan `includes`, dan memotong salinan dengan `slice` (perhatikan bahwa `slice(1, 3)` mengambil indeks 1 sampai sebelum 3, sehingga hasilnya dua elemen). Bagian terakhir adalah peringatan terpenting subbab ini: menyalin objek dengan tanda sama dengan hanya menyalin rujukannya. Perubahan `salinan.ipk` tampak juga pada `mahasiswa` — inilah bahaya *aliasing* (satu data, dua nama) yang menjadi sumber banyak bug di dunia nyata. Kebiasaan baiknya: perlakukan data sebagai sesuatu yang "dipinjam", dan ketika perlu versi baru, salin dulu dengan spread seperti pada Subbab 3.6.

### 3.6 Destructuring dan Spread Operator

**Destructuring** (penguraian struktur) adalah cara mengambil nilai dari objek atau array langsung ke dalam variabel, dalam satu baris. Sebelum ES6, cara lama adalah `const nama = mahasiswa.nama; const ipk = mahasiswa.ipk;` satu per satu — banyak baris, banyak pengulangan. Destructuring menjawab pertanyaan "mengapa teknologi ini ada": kode yang lebih pendek, lebih terbaca, dan lebih sedikit tempat untuk salah ketik. Destructuring array juga menjadi dasar pemakaian hook `useState` di React (Bab 4): fungsi tersebut mengembalikan array dua elemen `[nilai, fungsiPengubah]` yang langsung kita beri nama dalam satu baris.

**Spread operator** (operator sebaran) ditulis dengan tiga titik `...` dan "menyebarkan" isi array atau properti objek ke tempat tujuan. Ia dipakai untuk menyalin array/objek, menggabungkan dua array, dan — pola terpenting untuk React — membuat objek baru dari objek lama dengan beberapa properti diperbarui, tanpa mengubah objek asli (immutable update). Perhatikan kemiripan penulisannya dengan rest parameter di Subbab 3.4: keduanya memakai `...`, tetapi rest *mengumpulkan* sisa nilai menjadi satu wadah, sedangkan spread *menyebarkan* isi wadah.

File: praktik-js/08-destructuring.js

```js
const mahasiswa = { nim: '2201002', nama: 'Siti Aminah', ipk: 3.82 };

// Destructuring objek + nama lain + nilai bawaan
const { nama, nim: nomorInduk, prodi = 'Belum diketahui' } = mahasiswa;
console.log(nama, nomorInduk, prodi);
// Siti Aminah 2201002 Belum diketahui

// Destructuring array: dua elemen pertama + sisa
const nilaiUjian = [80, 90, 75, 88];
const [pertama, kedua, ...sisaNilai] = nilaiUjian;
console.log(pertama, kedua, sisaNilai); // 80 90 [ 75, 88 ]

// Spread: salinan terpisah + pembaruan tanpa mengubah asli
const dataLama = { nim: '2201003', nama: 'Agus Wijaya', ipk: 3.2 };
const dataBaru = { ...dataLama, ipk: 3.35 };
console.log(dataLama.ipk); // 3.2 (tidak berubah)
console.log(dataBaru.ipk); // 3.35 (objek baru)
```

Penjelasan: blok destructuring objek mengambil `nama` dan `ipk` langsung menjadi variabel; sintaks `nim: nomorInduk` memberi nama variabel baru, dan `prodi = 'Belum diketahui'` menyediakan nilai bawaan karena properti itu tidak ada di objek. Destructuring array bekerja berdasarkan urutan: `pertama` dan `kedua` mengambil elemen indeks 0 dan 1, dan `...sisaNilai` (rest) mengumpulkan sisanya menjadi array `[75, 88]` — pola yang identik dengan cara kerja `useState` pada Bab 4. Bagian ketiga adalah pola pembaruan immutable: `{ ...dataLama, ipk: 3.35 }` menyalin seluruh properti `dataLama` lalu menimpa `ipk`; objek `dataLama` tetap utuh, dan kita mendapatkan objek baru untuk ditampilkan. Kebiasaan inilah yang akan menjaga keandalan state React Anda.

### 3.7 `map`, `filter`, dan `reduce`

Ketiga metode ini adalah "jalan utama" pengolahan data di JavaScript modern, lahir dari filosofi *functional programming* (pemrograman fungsional): alih-alih menulis perulangan manual yang memberitahu komputer *bagaimana* memproses, kita menyatakan *apa* yang diinginkan, dan biarkan metode melakukan sisanya. Kode menjadi deklaratif: mudah dibaca, mudah diuji, dan bebas dari kesalahan indeks. Seluruh bab berikutnya — mulai dari perenderan daftar di Bab 4 hingga pengolahan data dari server di Bab 10 — akan memakai ketiga metode ini.

- **`map`** (pemetaan) mengubah setiap elemen array menjadi elemen baru, satu per satu, dan mengembalikan array baru berukuran sama. Cocok untuk mengubah bentuk data, misalnya mengubah objek mahasiswa menjadi baris tabel.
- **`filter`** (penyaringan) memilih elemen yang memenuhi kondisi dan mengembalikan array baru yang lebih pendek atau sama panjang. Kondisi ditulis sebagai fungsi yang mengembalikan `true`/`false`.
- **`reduce`** (pereduksi) menggabungkan seluruh elemen menjadi satu nilai, misalnya menjumlahkan IPK. Ia menerima dua argumen: fungsi penggabung dan nilai awal.

Selain ketiganya, kenali `find` (mengembalikan elemen pertama yang cocok), `some` (minimal satu elemen memenuhi kondisi), dan `every` (semua elemen memenuhi kondisi). Ketiganya saling melengkapi: `find` untuk pencarian satu data (misalnya menurut NIM), `some` untuk pemeriksaan cepat seperti "apakah ada mahasiswa ber-IPK di bawah 3.0?", dan `every` untuk penjaminan seperti "apakah semua IPK valid?".

File: praktik-js/09-map-filter-reduce.js

```js
const daftarMahasiswa = [
  { nim: '2201001', nama: 'Budi Santoso', prodi: 'Sistem Informasi', ipk: 3.45 },
  { nim: '2201002', nama: 'Siti Aminah', prodi: 'Teknik Informatika', ipk: 3.82 },
  { nim: '2201003', nama: 'Agus Wijaya', prodi: 'Informatika', ipk: 3.2 },
  { nim: '2201004', nama: 'Dewi Lestari', prodi: 'Rekayasa Perangkat Lunak', ipk: 3.61 },
  { nim: '2201005', nama: 'Rizky Pratama', prodi: 'Sistem Informasi', ipk: 2.95 },
];

// map: proyeksi sederhana
const daftarNama = daftarMahasiswa.map((m) => m.nama);
console.log(daftarNama);
// [ 'Budi Santoso', 'Siti Aminah', 'Agus Wijaya', 'Dewi Lestari', 'Rizky Pratama' ]

// filter: hanya mahasiswa berprestasi
const berprestasi = daftarMahasiswa.filter((m) => m.ipk >= 3.5);
console.log(berprestasi.map((m) => `${m.nama} (${m.ipk})`));
// [ 'Siti Aminah (3.82)', 'Dewi Lestari (3.61)' ]

// reduce: total IPK seluruh mahasiswa, lalu rata-rata
const totalIpk = daftarMahasiswa.reduce((total, m) => total + m.ipk, 0);
const rataRata = totalIpk / daftarMahasiswa.length;
console.log(`Rata-rata IPK: ${rataRata.toFixed(2)}`); // Rata-rata IPK: 3.41

// rantai: filter dulu, lalu map
const namaBerprestasi = daftarMahasiswa
  .filter((m) => m.ipk >= 3.5)
  .map((m) => m.nama);
console.log(namaBerprestasi); // [ 'Siti Aminah', 'Dewi Lestari' ]

// find: pencarian satu data
const budi = daftarMahasiswa.find((m) => m.nim === '2201001');
console.log(budi?.nama); // Budi Santoso
```

Penjelasan: perhatikan pola argumen setiap fungsi: sebuah *callback* (fungsi panggil-balik) yang menerima elemen array sebagai parameter pertama — di sini diberi nama `m` singkatan dari mahasiswa. `map` mengembalikan array baru lima elemen berisi nama saja, tanpa mengubah data asli; `filter` mengembalikan dua mahasiswa yang memenuhi ambang; sedangkan `reduce` menerima akumulator `total` dan elemen `m`, dengan nilai awal `0` — tanpa nilai awal tersebut, `reduce` akan menjadikan elemen pertama sebagai akumulator dan gagal untuk array kosong. Bagian "rantai" menunjukkan kekuatan sebenarnya: `filter(...).map(...)` dibaca alami dari kiri ke kanan — "saring dulu, petakan setelahnya" — dan hasilnya setara dengan menampilkan daftar nama berprestasi. Terakhir, `find` mengembalikan objek (bukan array), dan `budi?.nama` memakai optional chaining dari Subbab 3.2 agar aman jika NIM tidak ditemukan. Seluruh pola ini akan Anda pakai setiap hari untuk mengubah data mentah menjadi data tampilan di Bab 4–10.

### 3.8 Module: `import` dan `export`

Ketika program membesar, menyimpan semua kode dalam satu file menjadi tidak terkelola. **Module** (modul) adalah cara memecah kode menjadi beberapa file yang saling berbagi fungsi dan data melalui `export` (mengekspor/mengeluarkan) dan `import` (mengimpor/memasukkan). Mengapa ini penting? Di masa awal, JavaScript dimuat lewat tag `<script>` sehingga semua variabel berbagi satu ruang nama global — dua file yang mendeklarasikan `daftarMahasiswa` akan saling menimpa tanpa peringatan. Sistem modul menjawab kebutuhan ini: setiap file memiliki ruang lingkup sendiri; hanya apa yang diekspor yang dapat dipakai file lain. Sejak ES6, JavaScript memiliki standar resmi bernama **ESM** (*ECMAScript Modules*, sistem modul ECMAScript) dengan sintaks `import`/`export`; Node.js modern mendukungnya penuh, dan React Native juga memakainya untuk mengimpor komponen antar-file.

Ada dua jenis ekspor: **named export** (ekspor bernama) untuk nilai yang diekspor satu per satu dengan nama, dan **default export** (ekspor bawaan) untuk nilai utama sebuah file yang diimpor tanpa kurung kurawal. Aturan praktisnya: file data memakai named export jika memuat beberapa hal, sedangkan komponen utama (nanti di Bab 4) lazim memakai default export.

Satu catatan penting tentang menjalankan kode di Node.js: secara bawaan, file berekstensi `.js` diperlakukan sebagai modul CommonJS (gaya lama `require`), sehingga menulis `import` di dalamnya akan memicu error. Ada dua cara sederhana mengaktifkan ESM: mengubah ekstensi file menjadi **`.mjs`** (modul JavaScript), atau menambahkan baris `"type": "module"` ke `package.json` di folder project. Cara pertama paling cepat untuk praktikum bab ini; cara kedua lebih tepat untuk project sungguhan.

File: praktik-js/data-mahasiswa.mjs

```js
export const daftarMahasiswa = [
  { nim: '2201001', nama: 'Budi Santoso', prodi: 'Sistem Informasi', ipk: 3.45 },
  { nim: '2201002', nama: 'Siti Aminah', prodi: 'Teknik Informatika', ipk: 3.82 },
];

export const namaAplikasi = 'Aplikasi Manajemen Data Mahasiswa';
```

File: praktik-js/cetak-data.mjs

```js
import { daftarMahasiswa, namaAplikasi } from './data-mahasiswa.mjs';

console.log(namaAplikasi); // Aplikasi Manajemen Data Mahasiswa
daftarMahasiswa.forEach((m) => console.log(m.nim, m.nama));
// 2201001 Budi Santoso
// 2201002 Siti Aminah
```

Penjelasan: `data-mahasiswa.mjs` mengekspor dua nilai bernama. File kedua mengimpornya dengan kurung kurawal — nama di dalam kurung harus sama persis dengan nama ekspor, dan path-nya relatif (`'./data-mahasiswa.mjs'` berarti "di folder yang sama"). Jalankan dengan perintah `node cetak-data.mjs` dari folder `praktik-js`; di sinilah ekstensi `.mjs` berperan: tanpa ekstensi tersebut, Node akan menolak sintaks `import`. Jika Anda lebih suka tetap memakai `.js`, buat file `package.json` berisi `{ "type": "module" }` di folder yang sama — setelah itu seluruh file `.js` di folder tersebut diperlakukan sebagai ESM. Bacalah kembali struktur folder project Expo yang Anda lihat di Bab 2: pola `import` dari satu file ke file lain persis seperti ini, hanya saja targetnya komponen React.

### 3.9 Pemrograman Asinkron: Promise

Aplikasi modern harus menunggu banyak hal yang tidak instan: membaca file, meminta data dari server, menunggu sentuhan pengguna. JavaScript berjalan pada satu utas (single-threaded); jika sebuah operasi lambat memblokir utas tersebut, seluruh aplikasi membeku. Jawabannya adalah pemrograman **asynchronous** (asinkron): operasi lambat dijalankan "di latar belakang", dan ketika selesai, kode tertentu dipanggil. Cara tradisional melakukannya adalah **callback** (fungsi panggil-balik) — fungsi yang dipanggil setelah operasi selesai. Masalahnya, operasi asinkron yang berlapis menghasilkan *callback hell* (neraka panggil-balik): kode bersarang makin dalam, makin sulit dibaca dan diperbaiki.

**Promise** (janji) diperkenalkan ES6 untuk merapikan kekacauan tersebut. Sebuah *promise* adalah objek yang mewakili hasil operasi asinkron yang "belum tentu selesai": ia berstatus *pending* (menunggu), lalu berubah menjadi *fulfilled* (berhasil, membawa nilai) atau *rejected* (gagal, membawa alasan kegagalan). Alih-alih menumpuk callback, kita merantai perilaku dengan `.then` (setelah berhasil) dan `.catch` (bila gagal) — alur yang rata dan terbaca. Anda tidak perlu sering membuat promise sendiri, tetapi wajib memahami cara mengonsumsinya, karena seluruh komunikasi jaringan aplikasi (fungsi `fetch` di Bab 10) mengembalikan *promise*.

File: praktik-js/10-promise.js

```js
// Simulasi pengambilan data dari server: selesai setelah 1 detik.
function ambilDataMahasiswa() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ nim: '2201001', nama: 'Budi Santoso', ipk: 3.45 });
    }, 1000);
  });
}

console.log('Mengambil data...');
ambilDataMahasiswa()
  .then((data) => {
    console.log(`Data diterima: ${data.nama} (IPK ${data.ipk})`);
  })
  .catch((error) => {
    console.error('Gagal mengambil data:', error.message);
  })
  .finally(() => {
    console.log('Proses selesai.');
  });
```

Penjelasan: `ambilDataMahasiswa` mengembalikan *promise* baru; fungsi pelaksana menerima dua parameter — `resolve` untuk menandai keberhasilan dengan membawa data, dan `reject` untuk kegagalan. `setTimeout` hanya alat bantu agar kita bisa merasakan jeda 1 detik seperti latensi jaringan sungguhan; pada Bab 10, fungsi ini digantikan oleh `fetch`. Perhatikan alur pemakaiannya: setelah `ambilDataMahasiswa()`, kita merantai `.then` yang menerima hasil `resolve`, lalu `.catch` yang menangkap kegagalan, dan `.finally` yang selalu dijalankan apa pun hasilnya (cocok untuk menutup indikator "memuat…"). Kode ini rata — tidak ada lagi nesting callback — dan itulah tujuan hadirnya *promise*. Bila Anda ingin menjalankan beberapa *promise* sekaligus dan menunggu seluruhnya, gunakan `Promise.all([...])`; ia mengembalikan satu *promise* yang berisi array hasil.

### 3.10 `async`/`await` dan `try`/`catch`

Rantai `.then` sudah jauh lebih baik daripada callback, tetapi untuk operasi berurutan yang panjang, kode tetap terlihat "melompat-lompat". Sintaks **`async`/`await`** (asinkron/menunggu) — diperkenalkan ES2017 — membuat kode asinkron ditulis seperti kode sinkron biasa, tanpa mengorbankan sifat tidak memblokir. Sebuah fungsi yang dideklarasikan dengan kata kunci `async` selalu mengembalikan *promise*; di dalamnya, kata kunci `await` menghentikan sementara fungsi (bukan seluruh program!) hingga *promise* yang ditunggu selesai, lalu melanjutkan dengan hasilnya — proses lain tetap berjalan selama penantian itu, itulah sebabnya aplikasi tidak membeku.

Untuk kegagalan, `async`/`await` memakai **`try`/`catch`** (coba/tangkap): blok `try` berisi operasi yang berisiko, dan bila salah satunya melempar *exception* (pengecualian), eksekusi langsung melompat ke blok `catch` yang menerima objek error. Mengapa model ini penting? Karena aplikasi yang baik tidak diam membisu saat jaringan putus, melainkan memberi tahu pengguna dengan pesan yang jelas. Bab 10 akan memakai persis pola ini untuk menampilkan pesan "Gagal memuat data" di layar.

File: praktik-js/11-async-await.js

```js
function ambilDataMahasiswa() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve({ nim: '2201004', nama: 'Dewi Lestari', ipk: 3.61 }), 500);
  });
}

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
```

Penjelasan: perhatikan bahwa `tampilkanData` ditandai `async`, dan satu-satunya baris yang berbeda dari kode sinkron adalah `const data = await ambilDataMahasiswa();` — fungsi menunggu *promise* selesai, lalu `data` berisi objek hasilnya. Bilamana *promise* gagal (misalnya server mengembalikan error di Bab 10), eksekusi melompat ke `catch` dan `error.message` memuat keterangan penyebabnya. Bandingkan dengan versi `.then`/`.catch` di Subbab 3.9: keduanya setara, tetapi `async`/`await` lebih mudah dibaca terutama ketika ada tiga langkah berurutan seperti "ambil data → olah → simpan". Kata kunci `await` hanya sah di dalam fungsi `async` (atau di *top-level module* modern); memakainya di luar konteks itu akan memicu *SyntaxError*. Kombinasi `async`/`await` + `try`/`catch` inilah pola baku yang akan Anda temui di setiap bab berikutnya, mulai dari penyimpanan lokal (Bab 11) hingga autentikasi (Bab 13).

## Contoh

Contoh berikut merangkai konsep Subbab 3.5–3.10 dalam tiga program kecil yang lengkap dan dapat Anda jalankan langsung. Semuanya mandiri — tanpa file lain — sehingga cukup disalin ke folder `praktik-js/` lalu dijalankan dengan `node <nama-file>.js`.

File: praktik-js/contoh-rekap.js

```js
// Contoh 1: rantai filter → map → reduce untuk rekap sederhana.
const ipkMahasiswa = [3.45, 3.82, 3.2, 3.61, 2.95];

const berprestasi = ipkMahasiswa.filter((ipk) => ipk >= 3.5);
const daftarBerprestasi = berprestasi.map((ipk) => `IPK ${ipk.toFixed(2)}`);
const rataRataBerprestasi =
  berprestasi.reduce((total, ipk) => total + ipk, 0) / berprestasi.length;

console.log(daftarBerprestasi);
// [ 'IPK 3.82', 'IPK 3.61' ]
console.log(`Rata-rata IPK mahasiswa berprestasi: ${rataRataBerprestasi.toFixed(2)}`);
// Rata-rata IPK mahasiswa berprestasi: 3.72
```

Penjelasan: contoh ini memperlihatkan rantai tiga metode pada satu array. `filter` menyisakan dua nilai di atas ambang, `map` mengubahnya menjadi teks yang siap ditampilkan, dan `reduce` menjumlahkan keduanya sebelum dibagi banyaknya data. Perhatikan bahwa `berprestasi` dapat dipakai ulang untuk dua keperluan berbeda — inilah keuntungan memisahkan setiap langkah ke variabel: mudah dibaca dan mudah diuji. Hasil `daftarBerprestasi` berupa `['IPK 3.82', 'IPK 3.61']` dengan rata-rata `3.72`.

File: praktik-js/contoh-format.js

```js
// Contoh 2: destructuring + spread + template literal untuk memformat data.
const mahasiswa = { nim: '2201005', nama: 'Rizky Pratama', prodi: 'Sistem Informasi', ipk: 2.95 };

const { nama, nim, prodi, angkatan = 2024 } = mahasiswa;
const info = `${nama} (${nim}) adalah mahasiswa ${prodi} angkatan ${angkatan}.`;
console.log(info);
// Rizky Pratama (2201005) adalah mahasiswa Sistem Informasi angkatan 2024.

const versiPerbarui = { ...mahasiswa, ipk: 3.0 };
console.log(`IPK lama: ${mahasiswa.ipk} -> IPK baru: ${versiPerbarui.ipk}`);
// IPK lama: 2.95 -> IPK baru: 3.0
```

Penjelasan: contoh ini menunjukkan tiga alat dari Subbab 3.6 yang bekerja sama. Destructuring mengekstrak empat properti sekaligus — dengan nilai bawaan `2024` untuk `angkatan` yang tidak tercatat pada objek — lalu template literal merangkainya menjadi kalimat laporan yang rapi tanpa penggabungan teks yang rumit. Bagian kedua memakai spread untuk membuat objek baru dengan IPK diperbarui dari `2.95` menjadi `3.0`, sementara objek asli tetap utuh. Pola "salin lalu perbarui" ini adalah cara Anda akan memperbarui data tampilan di seluruh buku.

File: praktik-js/contoh-asinkron.mjs

```js
// Contoh 3: Promise + async/await + try/catch menyimulasikan proses bertahap.
function prosesBerjangka(label, durasiMs) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`${label} selesai`), durasiMs);
  });
}

async function jalankanAlur() {
  try {
    const langkah1 = await prosesBerjangka('Validasi data', 300);
    const langkah2 = await prosesBerjangka('Simpan ke file', 500);
    const langkah3 = await prosesBerjangka('Kirim notifikasi', 400);
    console.log(langkah1);
    console.log(langkah2);
    console.log(langkah3);
    console.log('Semua proses selesai secara berurutan.');
  } catch (error) {
    console.error('Alur gagal:', error.message);
  }
}

await jalankanAlur();
```

Penjelasan: `prosesBerjangka` adalah *promise* generik yang menandakan selesainya satu tahap setelah jeda tertentu — bayangkan setiap tahap adalah operasi nyata seperti validasi, penulisan file, atau pengiriman notifikasi (semua akan Anda implementasikan di bab-bab berikutnya). Fungsi `jalankanAlur` menunggu ketiga tahap satu per satu dengan `await`, sehingga keluarannya selalu berurutan: `Validasi data selesai`, `Simpan ke file selesai`, `Kirim notifikasi selesai`, lalu baris penutup. Karena file ini memakai `await` langsung di tingkat teratas, file disimpan dengan ekstensi `.mjs` — salah satu dari dua cara mengaktifkan ESM yang dibahas di Subbab 3.8.

## Praktikum

### Tujuan Praktikum

1. Mengimplementasikan deklarasi variabel `const`/`let` dan tipe data pada data nyata.
2. Membuat modul data 5 mahasiswa baku dengan `export`.
3. Mengolah array dengan `map`, `filter`, `reduce`, dan `find`: daftar ringkas, mahasiswa berprestasi, serta rata-rata IPK per prodi.
4. Menyusun program asinkron dengan `async`/`await` dan `try`/`catch` untuk menyimpan rekap hasil ke file JSON.
5. Memverifikasi sintaks dengan `node --check` dan menjalankan program dengan `node <file>`.

### Kebutuhan

- Node.js LTS versi 22 atau lebih baru (lihat Bab 2 untuk cara memasangnya).
- Terminal (Command Prompt/PowerShell di Windows, atau Terminal di macOS/Linux).
- Editor teks apa pun; Visual Studio Code disarankan (Bab 2).
- Tidak ada dependency yang perlu diinstal — praktikum ini murni JavaScript bawaan Node.js.

### Persiapan

1. Buka terminal, lalu pastikan Node.js terpasang dengan perintah `node --version`. Versi yang tampil harus 22 atau lebih tinggi.
2. Buat folder kerja baru bernama `praktik-js` dan jadikan folder tersebut direktori aktif:

```bash
mkdir praktik-js
cd praktik-js
```

3. Buka folder tersebut di Visual Studio Code (menu *File → Open Folder*) agar penulisan kode lebih nyaman.

### Langkah Kerja

1. Buat file `data-mahasiswa.mjs` berisi lima data mahasiswa baku (subbab Kode di bawah) — file ini menjadi modul data yang diekspor.
2. Buat file `pengolah-nilai.mjs` berisi program utama: ringkasan dengan `map`, daftar berprestasi dengan `filter`, rata-rata per prodi dengan `filter`+`reduce`, pencarian dengan `find`, dan penyimpanan hasil dengan `async`/`await`.
3. Periksa sintaks kedua file dengan `node --check data-mahasiswa.mjs` dan `node --check pengolah-nilai.mjs`. Bila tidak ada keluaran apa pun, sintaks dinyatakan benar (keberhasilan ditandai dengan diamnya terminal).
4. Jalankan program dengan `node pengolah-nilai.mjs` dari dalam folder `praktik-js`.
5. Buka file `hasil-rekap.json` yang terbentuk di folder yang sama, dan bandingkan isinya dengan penjelasan di subbab Hasil yang Diharapkan.
6. *(Opsional)* Ketik file `package.json` berisi `"type": "module"` (lihat kode di bawah), ganti ekstensi kedua file dari `.mjs` menjadi `.js`, lalu jalankan kembali — hasilnya harus sama.

### Kode

File: praktik-js/data-mahasiswa.mjs

```js
// Lima data mahasiswa baku yang dipakai konsisten di seluruh bab buku.

export const daftarMahasiswa = [
  {
    id: 1,
    nim: '2201001',
    nama: 'Budi Santoso',
    prodi: 'Sistem Informasi',
    angkatan: 2022,
    ipk: 3.45,
    email: 'budi.santoso@students.univ.ac.id',
    telepon: '081234567890',
  },
  {
    id: 2,
    nim: '2201002',
    nama: 'Siti Aminah',
    prodi: 'Teknik Informatika',
    angkatan: 2022,
    ipk: 3.82,
    email: 'siti.aminah@students.univ.ac.id',
    telepon: '081298765432',
  },
  {
    id: 3,
    nim: '2201003',
    nama: 'Agus Wijaya',
    prodi: 'Informatika',
    angkatan: 2023,
    ipk: 3.2,
    email: 'agus.wijaya@students.univ.ac.id',
    telepon: '081345678901',
  },
  {
    id: 4,
    nim: '2201004',
    nama: 'Dewi Lestari',
    prodi: 'Rekayasa Perangkat Lunak',
    angkatan: 2023,
    ipk: 3.61,
    email: 'dewi.lestari@students.univ.ac.id',
    telepon: '081356789012',
  },
  {
    id: 5,
    nim: '2201005',
    nama: 'Rizky Pratama',
    prodi: 'Sistem Informasi',
    angkatan: 2024,
    ipk: 2.95,
    email: 'rizky.pratama@students.univ.ac.id',
    telepon: '081367890123',
  },
];
```

File: praktik-js/pengolah-nilai.mjs

```js
// Program utama: ringkas, saring, hitung rata-rata, cari, dan simpan hasil.

import { daftarMahasiswa } from './data-mahasiswa.mjs';
import { writeFile } from 'node:fs/promises';

// 1) map: ubah tiap objek mahasiswa menjadi baris ringkas.
function buatDaftarRingkas() {
  return daftarMahasiswa.map((m) => ({
    nim: m.nim,
    nama: m.nama,
    prodi: m.prodi,
    ipk: m.ipk,
  }));
}

// 2) filter: pilih mahasiswa ber-IPK di atas ambang.
function cariBerprestasi(ambang) {
  return daftarMahasiswa.filter((m) => m.ipk >= ambang);
}

// 3) reduce: jumlahkan seluruh IPK, lalu bagi banyaknya data.
function hitungRataRata(prodi) {
  const dataProdi = daftarMahasiswa.filter((m) => m.prodi === prodi);
  if (dataProdi.length === 0) {
    return 0;
  }
  const totalIpk = dataProdi.reduce((jumlah, m) => jumlah + m.ipk, 0);
  return totalIpk / dataProdi.length;
}

// 4) find: cari satu mahasiswa berdasarkan NIM.
function cariMahasiswa(nim) {
  return daftarMahasiswa.find((m) => m.nim === nim);
}

// 5) Set + spread: ambil daftar prodi unik dari seluruh data.
function daftarProdiUnik() {
  return [...new Set(daftarMahasiswa.map((m) => m.prodi))];
}

// 6) async/await + try/catch: simpan hasil ke file JSON.
async function simpanHasil(namaFile, data) {
  try {
    const isiJson = JSON.stringify(data, null, 2);
    await writeFile(namaFile, isiJson, 'utf8');
    console.log(`Hasil tersimpan di ${namaFile}`);
  } catch (error) {
    console.error('Gagal menyimpan hasil:', error.message);
  }
}

async function main() {
  console.log('=== DATA MAHASISWA (diringkas dengan map) ===');
  const daftarRingkas = buatDaftarRingkas();
  daftarRingkas.forEach((m) => console.log(`${m.nim} | ${m.nama} | ${m.prodi} | IPK ${m.ipk}`));

  console.log('\n=== MAHASISWA BERPRESTASI, IPK >= 3.5 (filter) ===');
  const berprestasi = cariBerprestasi(3.5);
  berprestasi.forEach((m) => console.log(`${m.nama} (${m.prodi}) - IPK ${m.ipk}`));

  console.log('\n=== RATA-RATA IPK PER PRODI (filter + reduce) ===');
  const prodiList = daftarProdiUnik();
  prodiList.forEach((prodi) => {
    const rataRata = hitungRataRata(prodi).toFixed(2);
    console.log(`${prodi}: ${rataRata}`);
  });

  console.log('\n=== CARI MAHASISWA BERDASARKAN NIM (find) ===');
  const ditemukan = cariMahasiswa('2201004');
  if (ditemukan) {
    console.log(`NIM 2201004: ${ditemukan.nama}, ${ditemukan.prodi}, IPK ${ditemukan.ipk}`);
  } else {
    console.log('NIM 2201004: tidak ditemukan');
  }
  const tidakAda = cariMahasiswa('9999999');
  console.log(`NIM 9999999: ${tidakAda ? tidakAda.nama : 'tidak ditemukan'}`);

  console.log('\n=== MENYIMPAN REKAP KE FILE (async/await) ===');
  const rekap = {
    jumlahMahasiswa: daftarMahasiswa.length,
    daftarRingkas: daftarRingkas,
    berprestasi: berprestasi.map((m) => `${m.nama} (${m.prodi})`),
    rataRataIpkPerProdi: prodiList.map((prodi) => ({
      prodi: prodi,
      rataRata: Number(hitungRataRata(prodi).toFixed(2)),
    })),
    disimpanPada: new Date().toISOString(),
  };
  await simpanHasil('hasil-rekap.json', rekap);
}

main();
```

File: praktik-js/package.json

```json
{
  "name": "praktik-javascript-bab3",
  "version": "1.0.0",
  "private": true,
  "description": "Praktikum Bab 3: JavaScript Modern untuk React Native",
  "type": "module"
}
```

### Penjelasan Kode

File `data-mahasiswa.mjs` adalah modul murni: ia hanya mendeklarasikan dan mengekspor satu nilai bernama `daftarMahasiswa` — array lima objek mengikuti struktur `{ id, nim, nama, prodi, angkatan, ipk, email, telepon }` yang sama persis dengan data baku buku ini, sehingga praktikum Anda di bab-bab berikutnya (Bab 4 hingga Project Akhir) akan selalu memakai data yang konsisten. Perhatikan bahwa file ini tidak mencetak apa pun; tugasnya hanya menyediakan data. Inilah pembagian kerja sistem modul (Subbab 3.8): file data terpisah dari file logika, dan keduanya dapat diuji serta diubah secara mandiri.

Program utama `pengolah-nilai.mjs` dibuka dengan dua baris `import`: baris pertama mengambil data dari modul tetangga, baris kedua mengambil `writeFile` — fungsi bawaan Node.js untuk menulis file secara asinkron — dari namespace `node:fs/promises`. Enam fungsi berikutnya mewakili satu teknik per fungsi, sebagaimana dirancang Subbab 3.4: `buatDaftarRingkas` memakai `map` untuk memproyeksikan hanya empat kolom penting; `cariBerprestasi` memakai `filter` dengan ambang IPK; `hitungRataRata` menggabungkan `filter` (ambil satu prodi) dan `reduce` (jumlahkan IPK) lalu membaginya dengan banyaknya data — perhatikan penjagaan `dataProdi.length === 0` agar tidak membagi dengan nol; `cariMahasiswa` memakai `find`; dan `daftarProdiUnik` memanfaatkan `Set` (himpunan yang menolak duplikat) yang disebar dengan spread. Setiap fungsi kecil, satu tujuan, dan dapat diuji sendiri — persis pola pure function Subbab 3.4 yang kelak diuji di Bab 14.

Fungsi `simpanHasil` menunjukkan pola asinkron baku: ia bertanda `async`, memakai `await writeFile(...)`, dan membungkus seluruh operasi dalam `try`/`catch`. Bila folder tujuan tidak ada atau hak akses ditolak, `writeFile` melempar error dan `catch` mencetak `error.message` tanpa menghentikan program. Fungsi `main` merangkai semuanya secara berurutan dan, pada bagian akhir, membangun objek `rekap` dengan bantuan `map` — setiap prodi dipetakan menjadi `{ prodi, rataRata }` — lalu menyimpannya ke `hasil-rekap.json` dengan `JSON.stringify(data, null, 2)`; argumen `null, 2` membuat JSON ditulis dengan indentasi dua spasi agar mudah dibaca manusia. Baris terakhir `main()` menjalankan seluruh alur yang sudah `async` tanpa memblokir proses.

### Hasil yang Diharapkan

Setelah menjalankan `node pengolah-nilai.mjs` dari dalam folder `praktik-js`, terminal menampilkan keluaran berikut secara berurutan:

```text
=== DATA MAHASISWA (diringkas dengan map) ===
2201001 | Budi Santoso | Sistem Informasi | IPK 3.45
2201002 | Siti Aminah | Teknik Informatika | IPK 3.82
2201003 | Agus Wijaya | Informatika | IPK 3.2
2201004 | Dewi Lestari | Rekayasa Perangkat Lunak | IPK 3.61
2201005 | Rizky Pratama | Sistem Informasi | IPK 2.95

=== MAHASISWA BERPRESTASI, IPK >= 3.5 (filter) ===
Siti Aminah (Teknik Informatika) - IPK 3.82
Dewi Lestari (Rekayasa Perangkat Lunak) - IPK 3.61

=== RATA-RATA IPK PER PRODI (filter + reduce) ===
Sistem Informasi: 3.20
Teknik Informatika: 3.82
Informatika: 3.20
Rekayasa Perangkat Lunak: 3.61

=== CARI MAHASISWA BERDASARKAN NIM (find) ===
NIM 2201004: Dewi Lestari, Rekayasa Perangkat Lunak, IPK 3.61
NIM 9999999: tidak ditemukan

=== MENYIMPAN REKAP KE FILE (async/await) ===
Hasil tersimpan di hasil-rekap.json
```

Selain keluaran di atas, sebuah file baru `hasil-rekap.json` terbentuk di folder yang sama. Bukalah file tersebut: di dalamnya terdapat `jumlahMahasiswa: 5`, array `daftarRingkas` (lima baris), `berprestasi` (dua nama), `rataRataIpkPerProdi` (empat objek, dibulatkan dua angka desimal), dan `disimpanPada` (waktu penyimpanan). Perhatikan bahwa keberhasilan praktikum diukur dari tiga penanda: (1) tidak ada error di terminal, (2) urutan dan angka keluaran sesuai contoh di atas, dan (3) isi `hasil-rekap.json` sesuai struktur yang dijelaskan. Keluaran contoh di atas ditulis berdasarkan eksekusi nyata dengan Node.js versi 24 pada komputer penulis, sehingga selisih yang mungkin Anda lihat hanyalah nilai `disimpanPada` (waktu).

### Troubleshooting

**Masalah:** Terminal menampilkan `'node' is not recognized ...` atau `node: command not found` ketika perintah `node --version` dijalankan.
**Penyebab:** Node.js belum terpasang, atau berkas instalasinya tidak terdaftar pada *environment variable* PATH sehingga terminal tidak menemukan perintah `node`.
**Solusi:** Pasang Node.js LTS (versi 22 atau lebih baru) dari situs resmi nodejs.org, lalu ulangi langkah Persiapan. Bila Node.js sudah terpasang tetapi masih gagal, jalankan kembali terminal (instalasi baru sering memerlukan terminal dibuka ulang), atau periksa pengaturan PATH sistem.
**Pencegahan:** Sebelum memulai praktikum, selalu verifikasi dengan `node --version` — dua detik pengecekan menghemat puluhan menit penyelidikan.

**Masalah:** Saat menjalankan `node pengolah-nilai.mjs`, muncul `SyntaxError: Cannot use import statement outside a module`.
**Penyebab:** File disimpan dengan ekstensi `.js` (bukan `.mjs`) dan tidak ada `package.json` dengan `"type": "module"` di folder yang sama, sehingga Node memperlakukan file sebagai CommonJS yang tidak mengenal `import`.
**Solusi:** Ganti nama file menjadi `data-mahasiswa.mjs` dan `pengolah-nilai.mjs`, atau buat `package.json` berisi `"type": "module"` seperti pada subbab Kode. Jalankan ulang perintahnya.
**Pencegahan:** Biasakan memeriksa ekstensi file yang tercantum pada penanda `File:` di setiap blok kode — ekstensi adalah bagian dari konfigurasi, bukan sekadar nama.

**Masalah:** Error `ERR_MODULE_NOT_FOUND: Cannot find module 'D:\...\data-mahasiswa.mjs'` muncul saat program dijalankan.
**Penyebab:** Nama file tujuan tidak cocok dengan nama pada baris `import` — misalnya `Data-Mahasiswa.mjs` atau `data_mahasiswa.mjs` — atau folder tempat file berbeda dengan folder tempat program dijalankan; penulisan path di Node bersifat peka huruf besar/kecil.
**Solusi:** Samakan nama dan path secara persis: import `'./data-mahasiswa.mjs'` harus merujuk ke file `data-mahasiswa.mjs` di folder yang sama, lalu jalankan `node pengolah-nilai.mjs` dari dalam folder tersebut.
**Pencegahan:** Letakkan kedua file dalam satu folder dan gunakan huruf kecil konsisten untuk semua nama file, sesuai pola rute dan file pada buku ini.

**Masalah:** `node --check nama-file.mjs` tidak menampilkan keluaran apa pun, dan mahasiswa mengira perintahnya gagal.
**Penyebab:** `node --check` memang dirancang untuk memeriksa sintaks tanpa menjalankan program; keberhasilan ditandai dengan tidak ada keluaran sama sekali (kode keluar 0), bukan dengan pesan sukses.
**Solusi:** Tidak perlu perbaikan — lanjutkan ke langkah `node pengolah-nilai.mjs`. Untuk meyakinkan diri, periksa kode keluar dengan mengetik `echo %errorlevel%` (Windows) atau `echo $?` (macOS/Linux) segera setelah perintah; angka `0` berarti valid.
**Pencegahan:** Pahami perbedaan dua perintah ini sejak awal: `--check` hanya memeriksa tata tulis, sedangkan menjalankan file tanpa `--check` mengeksekusi logika sesungguhnya.

**Masalah:** Program berjalan tanpa error, tetapi file `hasil-rekap.json` tidak ditemukan.
**Penyebab:** Program dijalankan dari folder yang berbeda, sehingga file disimpan di direktori aktif saat perintah dieksekusi, bukan di folder berisi `pengolah-nilai.mjs`.
**Solusi:** Cari file di folder tempat terminal berada (lihat baris prompt), atau jalankan ulang dengan `cd` ke folder `praktik-js` terlebih dahulu sebelum `node pengolah-nilai.mjs`.
**Pencegahan:** Jadikan folder project sebagai direktori aktif setiap kali menjalankan perintah Node — kebiasaan yang juga berlaku saat `npx expo start` di bab-bab berikutnya.

## Studi Kasus

**Konteks.** Bagian Akademik sebuah universitas menerima permintaan rutin dari pimpinan fakultas: "Berapa rata-rata IPK per program studi tahun ini? Siapa saja yang memenuhi syarat beasiswa (IPK minimal 3,5)? Siapa mahasiswa dengan NIM X?" Selama ini staf menjawab dengan membuka berkas Excel, menyaring data secara manual, dan menyalin angka ke dalam laporan. Cara tersebut bekerja, tetapi lambat, rawan salah salin, dan tidak dapat diulang konsisten: dua staf yang mengerjakan permintaan sama bisa menghasilkan angka berbeda.

**Analisis.** Masalah di atas adalah masalah pengolahan data yang berulang dan membutuhkan keterulangan (reproducibility) — persis masalah yang dijawab oleh *script* (naskah program) berbasis JavaScript modern. Perhatikan pemetaan kebutuhan ke materi bab ini: "rata-rata IPK per prodi" diterjemahkan menjadi `filter` (kelompokkan per prodi) + `reduce` (jumlahkan) seperti pada `hitungRataRata`; "siapa yang memenuhi syarat beasiswa" menjadi `filter` dengan ambang 3,5; "cari NIM X" menjadi `find`. Output laporan dapat dibakukan sebagai file JSON — format data terstruktur yang juga menjadi bahasa pertukaran data aplikasi web di Bab 10. Program pengolah nilai pada Praktikum 3 pada dasarnya adalah versi kecil dari otomatisasi ini, dan seluruh teknik yang sama akan dipakai pada **Project Akhir: Sistem Informasi Akademik Mobile**, di mana daftar mahasiswa diambil dari server, disaring, dihitung, dan ditampilkan di layar perangkat.

**Keterkaitan materi.** Dari kasus ini kita dapat menarik tiga pelajaran umum. Pertama, *script* batch seperti ini unggul atas manipulasi manual karena hasilnya dapat diuji: dengan `node --check` dan keluaran yang deterministik, kesalahan logika dapat ditemukan sebelum laporan dikirim. Kedua, pemisahan modul (data di `data-mahasiswa.mjs`, logika di `pengolah-nilai.mjs`) mencerminkan pemisahan data dari presentasi yang akan menjadi arsitektur aplikasi Anda di Bab 5–6. Ketiga, ketika data menjadi besar, mahasiswa akan melihat mengapa pemrograman deklaratif (`map`/`filter`/`reduce`) lebih mudah dijaga daripada perulangan manual ribuan baris — pola yang sama akan tampil sebagai layar aplikasi mobile pada bab-bab berikutnya.

## Latihan

### Soal Pemahaman

1. Jelaskan perbedaan `const` dan `let`, serta berikan satu contoh situasi di mana masing-masing tepat digunakan. Mengapa `var` tidak disarankan?
2. Apa hasil dari ekspresi berikut dan mengapa: `'5' == 5`, `'5' === 5`, dan `typeof []`? Jelaskan mengapa buku ini mewajibkan `===`.
3. Sebutkan nilai-nilai *falsy* dalam JavaScript. Mengapa `if ([])` dievaluasi sebagai benar walaupun array-nya kosong?
4. Tuliskan tiga macam perulangan yang Anda pelajari dan kapan masing-masing paling tepat dipakai.
5. Apa perbedaan utama arrow function dengan deklarasi fungsi klasik dalam hal `this` dan sintaks pengembalian nilai?
6. Jelaskan dengan kata-kata Anda sendiri perbedaan kerja `map`, `filter`, dan `reduce`. Kapan kita memakai `find` alih-alih `filter`?

### Soal Praktik

1. Buat file `latihan-predikat.js`: gunakan data 5 mahasiswa baku dari Praktikum 3 (salin array-nya), lalu dengan `map` ubah setiap mahasiswa menjadi teks `"<nama> (<nim>): predikat <X>"` menggunakan fungsi `tentukanPredikat` dari Subbab 3.4. Jalankan dengan `node latihan-predikat.js`.
2. Buat file `latihan-cari.js` untuk mencari mahasiswa berdasarkan NIM. Karena Node.js tidak menyediakan fungsi `prompt` seperti di peramban, gunakan variabel `const nimDicari = '2201002';`, lalu tampilkan nama dan prodi mahasiswa tersebut dengan `find`, dan tampilkan pesan "tidak ditemukan" bila hasilnya `undefined`. Verifikasi sintaks dengan `node --check`.
3. Buat fungsi `hitungRataRataAngkatan(angkatan)` yang memakai `filter` lalu `reduce` untuk menghitung rata-rata IPK mahasiswa angkatan tertentu, dan panggil untuk angkatan 2022 dan 2023 menggunakan data baku.
4. Tulis file `latihan-simpan.mjs` yang menyimpan hasil `hitungRataRataAngkatan` ke file `rata-rata-angkatan.json` memakai pola `async`/`await` + `try`/`catch` dari `simpanHasil`, lengkap dengan pesan sukses dan pesan kegagalan.

### Soal Analisis

1. Bandingkan dua cara berikut untuk mencari mahasiswa ber-IPK tertinggi dari data baku: (a) perulangan `for` dengan variabel penampung, (b) `reduce` dengan fungsi `(tertinggi, m) => (m.ipk > tertinggi.ipk ? m : tertinggi)`. Analisislah perbedaan keterbacaan, kemungkinan salah, dan kemudahan pengujian kedua pendekatan, lalu nyatakan mana yang Anda pilih untuk digunakan dalam tim dan alasannya.
2. Amati fungsi `simpanHasil` pada Praktikum 3: mengapa pola `try`/`catch` di sana lebih baik daripada membiarkan error menghentikan program? Apa yang terjadi pada pengguna aplikasi mobile bila error penyimpanan tidak ditangani? Kaitkan dengan pengalaman Anda menggunakan aplikasi yang sering berhenti mendadak.

## Tantangan

1. **Laporan tahunan per angkatan.** Perluas program praktikum: kelompokkan mahasiswa berdasarkan angkatan dengan `filter`, hitung rata-rata IPK tiap angkatan, lalu gabungkan semua hasil ke dalam satu berkas `laporan-tahunan.json` yang memuat bagian "per prodi" dan "per angkatan". Gunakan `Promise.all` untuk menyimpan dua berkas sekaligus.
2. **Predikat nilai.** Buat fungsi `tentukanHuruf(nilai)` yang mengembalikan huruf A (≥ 85), B (≥ 70), C (≥ 55), D (≥ 40), dan E (di bawah 40) memakai rantai `if`. Gunakan `map` untuk menambahkan properti `predikatHuruf` pada salinan setiap mahasiswa (jangan ubah data asli), lalu `filter` untuk menampilkan hanya mahasiswa berpredikat A atau B. Simpulkan sendiri mengapa pembaruan immutable penting.
3. **Simulasi pengambilan data.** Tulis ulang `ambilDataMahasiswa` dari Subbab 3.9 agar kadang gagal: acak dengan `Math.random()` sehingga sekitar satu dari tiga pemanggilan memanggil `reject`. Jalankan fungsi tersebut 10 kali berturut-turut dengan `await` di dalam perulangan, dan hitung berapa kali berhasil dan berapa kali gagal — program Anda harus tetap hidup sampai akhir (tidak ada crash).

## Rangkuman

1. `const` untuk nilai yang tidak diisi ulang dan `let` untuk nilai yang berubah; keduanya ber-*block scope*, dan `const` tidak membekukan isi objek.
2. Tipe data dasar: string, number, boolean, undefined, null, dan object — periksa dengan `typeof`, tetapi ingat bahwa `typeof []` dan `typeof null` sama-sama `"object"`.
3. Selalu gunakan kesetaraan ketat `===`/`!==`; `==` melakukan konversi tipe otomatis yang mengecoh.
4. Percabangan memakai `if`/`else`, ternary untuk dua pilihan sederhana, dan `switch` untuk banyak kasus; perulangan memakai `for`, `while`, dan `for...of` untuk array.
5. Arrow function lebih ringkas dan tidak memiliki `this` sendiri — alasan utama ia mendominasi kode React; dukung dengan parameter default dan rest parameter.
6. Array dan objek adalah tipe rujukan: menyalin dengan `=` tidak menyalin datanya; gunakan spread untuk salinan terpisah.
7. Destructuring mengekstrak nilai objek/array ke variabel; spread menyalin dan menggabungkan; keduanya fondasi pola immutable update di React.
8. `map` mengubah setiap elemen, `filter` memilih elemen yang memenuhi kondisi, `reduce` menggabungkan menjadi satu nilai, dan `find` mengembalikan elemen pertama yang cocok; ketiganya dapat dirantai.
9. Sistem modul `import`/`export` memecah kode menjadi file; di Node gunakan ekstensi `.mjs` atau `"type": "module"` di `package.json`.
10. Operasi asinkron ditangani dengan *Promise*; `async`/`await` menuliskannya seperti kode sinkron, dan `try`/`catch` menangkap kegagalan secara eksplisit — pola baku komunikasi jaringan pada Bab 10.

## Refleksi

1. Dari seluruh materi bab ini, konsep manakah yang paling sulit Anda pahami? Tuliskan dengan bahasa Anda sendiri, lalu jelaskan kembali kepada teman satu kelompok — jika teman Anda paham, berarti Anda telah menguasainya.
2. Pernahkah Anda mengalami aplikasi yang "macet" atau diam saja ketika gagal memuat data? Setelah mempelajari `try`/`catch`, bagaimana seharusnya aplikasi tersebut berperilaku?
3. Di mana Anda melihat pola `map` dan `filter` dapat menggantikan pekerjaan manual Anda sehari-hari (misalnya mengolah nilai, mengelompokkan data, membuat rekap)? Sebutkan satu contoh konkret.
4. Bagaimana pemahaman JavaScript modern ini akan memengaruhi kecepatan Anda menguasai bab-bab berikutnya — khususnya komponen React di Bab 4 dan pengambilan data dari server di Bab 10?

## Evaluasi Bab

### Pilihan Ganda

Pilih satu jawaban yang paling tepat.

1. Pernyataan yang benar tentang `const` adalah ...
   A. Nilainya dapat diisi ulang selama masih dalam blok yang sama
   B. Nilainya tidak dapat diisi ulang, tetapi properti objek yang dirujuknya tetap dapat diubah
   C. Sama perilakunya dengan `var`, hanya namanya yang berbeda
   D. Hanya dapat dipakai untuk tipe data number

2. Hasil dari ekspresi `'3' === 3` adalah ...
   A. `true`
   B. `false`
   C. `"33"`
   D. `undefined`

3. Untuk memeriksa tipe sebuah nilai, operator yang dipakai adalah ...
   A. `instanceof`
   B. `typeof`
   C. `type`
   D. `isType`

4. Hasil dari `[1, 2, 3].map((x) => x * 2)` adalah ...
   A. `[1, 2, 3]`
   B. `[2, 4, 6]`
   C. `6`
   D. `[1, 4, 9]`

5. Hasil dari `[5, 8, 3, 9].filter((x) => x > 4)` adalah ...
   A. `[5, 8, 9]`
   B. `[5, 8, 3, 9]`
   C. `[3]`
   D. `[8, 3, 9]`

6. Hasil dari `[1, 2, 3, 4].reduce((total, x) => total + x, 0)` adalah ...
   A. `[1, 2, 3, 4]`
   B. `10`
   C. `24`
   D. `0`

7. Agar sintaks `import`/`export` berjalan di Node.js tanpa berkas konfigurasi tambahan, file harus disimpan dengan ekstensi ...
   A. `.js`
   B. `.json`
   C. `.mjs`
   D. `.node`

8. Pernyataan yang benar tentang arrow function adalah ...
   A. Ia memiliki `this` sendiri yang mengacu pada objek pemanggilnya
   B. Ia tidak dapat menerima parameter
   C. Ia tidak memiliki `this` sendiri, sehingga `this` merujuk ke lingkup di luarnya
   D. Ia hanya dapat dipakai untuk satu baris kode

### Soal Uraian

1. Tuliskan kode untuk menghitung rata-rata IPK mahasiswa angkatan 2022 dari data baku lima mahasiswa (gunakan `filter` dan `reduce`), lalu jelaskan setiap langkahnya dalam 3–5 kalimat.
2. Jelaskan perbedaan antara `map` dan `forEach`, dan mengapa pada Praktikum 3 kita memakai `map` untuk membentuk `daftarRingkas` tetapi `forEach` untuk mencetak ke terminal.
3. Sebuah fungsi `async` memanggil dua operasi: membaca data dari file lalu mengirim data tersebut ke server (dalam simulasi: dua `Promise`). Tuliskan pola `async`/`await` + `try`/`catch` yang tepat untuk alur tersebut dan jelaskan mengapa setiap operasi ditulis dengan `await`.

### Kunci Jawaban

<details>
<summary>Klik untuk melihat kunci jawaban Pilihan Ganda</summary>

1. **B** — `const` menjaga rujukan, bukan isi objek; properti objek tetap dapat diubah (Subbab 3.1).
2. **B** — `===` membandingkan nilai dan tipe; `'3'` (string) tidak sama dengan `3` (number). Nilai `true` hanya dihasilkan oleh `==` yang melakukan konversi (Subbab 3.2).
3. **B** — `typeof` mengembalikan nama tipe seperti `"string"`, `"number"`, `"boolean"`, atau `"object"` (Subbab 3.2).
4. **B** — `map` mengalikan setiap elemen dengan 2, menghasilkan array baru berukuran sama `[2, 4, 6]` (Subbab 3.7).
5. **A** — `filter` menyisakan elemen yang memenuhi kondisi `x > 4`, yaitu 5, 8, dan 9; elemen 3 gugur (Subbab 3.7).
6. **B** — `reduce` menjumlahkan seluruh elemen dengan nilai awal 0: 1+2+3+4 = 10 (Subbab 3.7).
7. **C** — ekstensi `.mjs` langsung mengaktifkan ESM; alternatifnya `"type": "module"` pada `package.json` (Subbab 3.8).
8. **C** — arrow function tidak mengikat `this` sendiri; inilah alasan ia dominan pada event handler React (Subbab 3.4).

</details>