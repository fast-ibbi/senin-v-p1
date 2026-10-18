# BAB 14 — Debugging, Testing, dan Quality Assurance

## Deskripsi Singkat

Bab ini membekali Anda dengan tiga keterampilan yang membedakan programmer pemula dari programmer profesional: **debugging** (penelusuran dan perbaikan kesalahan), **testing** (pengujian perangkat lunak), dan **quality assurance/QA** (jaminan kualitas). Anda akan mempelajari cara memakai console dan React Native DevTools, mengenali error umum React Native beserta artinya, menelusuri masalah jaringan, menulis unit test sederhana untuk fungsi murni dari Bab 8, serta menyusun checklist pengujian aplikasi mobile. Bab ini memanfaatkan fungsi validasi yang Anda bangun di Bab 8, komponen dari Bab 5, dan pola komunikasi API dari Bab 10; hasilnya berupa produk khas seorang penguji: checklist QA dan unit test yang dapat dijalankan.

## Tujuan Pembelajaran

Setelah mempelajari bab ini, mahasiswa mampu:

1. Menjelaskan peran debugging, testing, dan QA dalam siklus hidup pengembangan aplikasi mobile.
2. Mengidentifikasi fungsi console (log, warn, table) dan fitur React Native DevTools untuk menelusuri kesalahan.
3. Menganalisis error umum React Native (Unable to resolve module, Invalid hook call, undefined is not an object, dan lainnya) beserta penyebab dan solusinya.
4. Mengimplementasikan unit test untuk fungsi murni menggunakan `node:test` dan menjelaskan peran Jest/jest-expo dalam ekosistem React Native.
5. Membedakan unit testing, integration testing, manual testing, dan usability testing berdasarkan tujuan dan tingkat cakupannya.
6. Mengevaluasi hasil pengujian melalui checklist testing yang memuat area, kasus uji, hasil, dan status.

## Peta Konsep

```text
                      BAB 14 — KUALITAS PERANGKAT LUNAK
┌───────────────────────────────┬────────────────────────────────┐
│        DEBUGGING              │           TESTING              │
│ 14.1 Console + DevTools       │ 14.4 Unit testing (fungsi      │
│ 14.2 Error umum React Native  │     murni, node:test, Jest)    │
│ 14.3 Network debugging        │ 14.5 Integration testing       │
│                               │ 14.6 Manual + usability        │
└───────────────┬───────────────┴───────────────┬────────────────┘
                └───────────────┬───────────────┘
                      14.7 Checklist Testing Aplikasi Mobile
                      (produk bab: checklist QA + unit test)
```

## Materi

Sebuah aplikasi yang "hanya berjalan" belum tentu aplikasi yang benar. Di sinilah debugging, testing, dan QA masuk: keempat istilah ini saling melengkapi. **Debugging** adalah proses menemukan dan memperbaiki kesalahan (bug) pada kode; **testing** adalah kegiatan memeriksa perilaku perangkat lunak secara terencana untuk menemukan kesalahan; sedangkan **quality assurance (QA)** (jaminan kualitas) adalah proses sistematis yang memastikan produk memenuhi kebutuhan pengguna — QA tidak hanya mencari bug, tetapi mencegahnya sejak awal melalui standar, checklist, dan prosedur. Bab 15 akan menunjukkan bahwa jaminan kualitas menjadi syarat mutlak sebelum aplikasi Anda dirilis ke toko aplikasi; bab ini menyiapkan alat-alatnya.

Mengapa teknologi ini ada? Semakin banyak fitur yang Anda tumpuk (navigasi di Bab 7, form di Bab 8, API di Bab 10, autentikasi di Bab 13), semakin besar pula kemungkinan satu perubahan kecil merusak bagian lain yang tampaknya tidak berhubungan. Kondisi ini disebut **regression** (kemunduran kualitas). Tanpa cara menelusuri kesalahan dan menguji perilaku, tim pengembang menghabiskan waktunya menebak-nebak — dan aplikasi yang rusak di tangan pengguna jauh lebih mahal daripada bug yang tertangkap sebelum rilis. Karena itu, bab ini mengajarkan kebiasaan yang murah tetapi berdampak besar: memburu bug dengan alat yang tepat, dan menguji dengan cara yang terencana.

### 14.1 Debugging: Console dan DevTools

Cara paling sederhana (dan sering kali paling efektif) untuk menelusuri kesalahan adalah mencetak nilai ke **console** (konsol, tempat pesan teks dari program ditampilkan). Di React Native, panggilan `console.log` dari kode aplikasi tampil pada terminal tempat `npx expo start` berjalan, dan juga pada React Native DevTools. Kebiasaan yang baik: beri label pada setiap baris log agar mudah ditemukan saat banyak pesan bercampur, dan gunakan jenis pesan yang sesuai dengan tingkat kepentingannya.

- `console.log` — pesan biasa untuk melihat nilai variabel atau alur eksekusi.
- `console.warn` — peringatan: nilai di luar dugaan, tetapi aplikasi masih berjalan.
- `console.table` — mencetak array objek dalam bentuk tabel kolom yang rapi, sangat berguna untuk data daftar (misalnya daftar mahasiswa).

Contoh berikut menunjukkan ketiganya pada data mahasiswa baku yang dipakai seluruh buku ini (lihat Bab 4–10), dan dapat Anda jalankan langsung di Node tanpa perlu emulator:

File: console-demo.js

```js
// Demo penggunaan console untuk debugging data mahasiswa.
// Menjalankan: node console-demo.js

const mahasiswa = [
  { nim: '2201001', nama: 'Budi Santoso', prodi: 'Sistem Informasi', ipk: 3.45 },
  { nim: '2201002', nama: 'Siti Aminah', prodi: 'Teknik Informatika', ipk: 3.82 },
  { nim: '2201003', nama: 'Agus Wijaya', prodi: 'Informatika', ipk: 3.2 },
  { nim: '2201004', nama: 'Dewi Lestari', prodi: 'Rekayasa Perangkat Lunak', ipk: 3.61 },
  { nim: '2201005', nama: 'Rizky Pratama', prodi: 'Sistem Informasi', ipk: 2.95 },
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

Penjelasan: baris pertama mendefinisikan array `mahasiswa` berisi lima data baku buku ini. `console.log` pertama memberi tahu berapa banyak data yang dimuat — inilah penggunaan paling dasar: memastikan data sampai di tempat yang Anda duga. `console.log` kedua memakai operator spread `...` (Bab 3) untuk meneruskan semua IPK ke `Math.max`. Perhatikan `console.warn`: pesan peringatan tidak menghentikan program, tetapi tampil mencolok di terminal sehingga Anda sadar ada kondisi yang perlu diperhatikan (IPK di bawah 3.0). Terakhir, `console.table` menyusun ulang data menjadi tabel berkolom NIM, Nama, Prodi, dan IPK — jauh lebih mudah dibaca daripada lima baris objek polos. Kebiasaan menambahkan label teks pada setiap log ("Jumlah data mahasiswa:") adalah perbedaan utama antara log yang berguna dan log yang membingungkan.

Selain console, React Native menyediakan **React Native DevTools** — antarmuka penganalisis berbasis DevTools Chrome yang terhubung ke aplikasi yang berjalan. Untuk membukanya: pastikan aplikasi berjalan (`npx expo start` lalu buka di emulator atau perangkat), tekan `m` pada terminal Expo untuk membuka menu developer di aplikasi, lalu pilih opsi debugger sesuai versi SDK 57. *⚠ version-sensitive: menu dan kombinasi tombol dapat berubah antars versi Expo; periksa petunjuk yang dicetak terminal saat `npx expo start` dijalankan.* Beberapa tombol penting pada emulator: `r` untuk me-reload aplikasi (memuat ulang kode terbaru), `m` untuk membuka/menutup menu developer, dan `j` untuk membuka debugger JavaScript. Pada emulator Android Anda juga dapat menggoyang-goyangkan (shake) perangkat untuk memunculkan menu developer; di emulator Windows kombinasi `Ctrl+M` umum dipakai. *⚠ version-sensitive: konfirmasi kombinasi tombol pada dokumentasi Expo untuk SDK 57.*

Di dalam React Native DevTools, tab berisi sumber kode, **breakpoint** (titik henti: baris tempat eksekusi dijeda agar Anda dapat memeriksa nilai variabel), dan tab Network untuk memantau permintaan jaringan (dibahas di subbab 14.3). Selain itu, **React DevTools** (alat khusus ekosistem React, bukan bagian dari DevTools Chrome) menampilkan pohon komponen dan nilai **state** (keadaan) tiap komponen secara langsung. Alat ini dijalankan terpisah:

File: terminal

```bash
npm install --save-dev react-devtools
npx react-devtools
```

Penjelasan: perintah pertama menambahkan `react-devtools` sebagai dependency pengembangan (devDependency) — alat yang hanya dibutuhkan saat menulis kode, bukan saat aplikasi dirilis. Perintah kedua meluncurkan jendela React DevTools yang menampilkan pohon komponen aplikasi Anda secara real-time. *⚠ version-sensitive: nama paket dan cara menjalankannya dapat berubah; pastikan mengikuti petunjuk resmi (docs.expo.dev) untuk SDK 57.*

Strategi men-debug state dapat diringkas menjadi dua lapis. Lapis pertama: cetak log pada titik perubahan state — misalnya di dalam `useEffect` (Bab 4) yang berjalan setiap state berubah, tulis `console.log('state berubah:', nilai)`. Lapis kedua: jika log tidak cukup (misalnya state berbentuk objek besar), gunakan React DevTools untuk memeriksa pohon komponen dan mengubah nilai state secara langsung tanpa menulis kode. Keduanya saling melengkapi: log menjawab "kapan dan dalam urutan apa", React DevTools menjawab "apa isinya sekarang". Detail pemakaian `useState` dan `useEffect` sudah dibahas di Bab 4; di bab ini Anda memakainya sebagai alat, bukan mempelajari ulang cara kerjanya.

### 14.2 Error Umum React Native

Error yang sama dapat muncul berulang pada semua project React Native. Mengenali pesan error sama pentingnya dengan mengenali sintaks bahasa: pesan itu adalah petunjuk arah, bukan sekadar pengumuman kegagalan. Berikut enam error paling umum, beserta arti, penyebab tipikal, dan solusi singkatnya.

**Error 1 — "Unable to resolve module './components/KartuMahasiswa' from 'app/index.js'"**

Pesan ini berarti modul yang Anda import tidak ditemukan oleh **Metro** (bundler React Native, alat yang menggabungkan semua file JavaScript menjadi satu bundel). Penyebab: path salah, nama file salah ketik, atau — sering terjadi di Windows — perbedaan huruf kapital (`KartuMahasiswa.js` vs `kartumahasiswa.js`). Solusi: periksa kembali path pada perintah `import`, pastikan ekstensi file cocok, dan samakan huruf kapital persis. Untuk paket npm, pesan serupa ("Unable to resolve module react-native-xyz") berarti paket belum diinstal: gunakan `npx expo install react-native-xyz` (pola dari Bab 2) lalu restart Metro dengan menekan `r`. Pencegahan: buka folder project di editor dan biarkan editor melengkapi path secara otomatis.

**Error 2 — "Invalid hook call. Hooks can only be called inside of the body of a function component."**

Hook (`useState`, `useEffect`, dan lainnya) hanya boleh dipanggil di tingkat atas fungsi komponen, tanpa syarat. Penyebab paling umum: memanggil hook di dalam percabangan `if`, di dalam callback event, atau di dalam fungsi biasa yang bukan komponen. Solusi: pindahkan panggilan hook ke tingkat atas komponen; jika perlu nilai kondisional, hitung di dalam hook atau setelah hook dipanggil. Pencegahan: ingat aturan emas — jangan pernah memanggil hook di dalam `if`, `for`, atau fungsi bersarang.

**Error 3 — "'undefined' is not an object (evaluating 'mahasiswa.nama')"**

Anda mencoba membaca properti dari nilai yang belum ada (bernilai `undefined`) — biasanya karena data belum dimuat dari API saat komponen pertama dirender. Penyebab: tidak ada kondisi pemuatan (loading state), salah menulis nama properti (misalnya `nama` vs `name`), atau respons API tidak berbentuk seperti dugaan (lihat Bab 10 untuk struktur respons `{ data: [...] }`). Solusi: beri default nilai `[]` atau `null` pada state awal, tampilkan indikator pemuatan sebelum data datang, atau gunakan operator opsional `mahasiswa?.nama` agar akses aman saat objek belum ada. Pencegahan: cetak respons API dengan `console.log` sebelum memetakannya ke tampilan (kebiasaan di subbab 14.3).

**Error 4 — "Text strings must be rendered within a <Text> component."**

React Native tidak mengizinkan teks polos berada langsung di dalam `View` — seluruh teks harus dibungkus komponen `<Text>` (aturan yang diperkenalkan Bab 5). Penyebab: string literal tertulis sebagai anak `View` (`<View>Halo</View>`). Solusi: bungkus dengan `<Text>Halo</Text>`. Pencegahan: sejak awal biasakan setiap tulisan tampak di layar selalu berada di dalam `<Text>`.

**Error 5 — "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation"**

`FlatList` (Bab 5) di dalam `ScrollView` dengan arah gulir yang sama membuat React Native tidak dapat menghitung tinggi konten dengan benar, sehingga performa menurun dan perilaku gulir aneh. Solusi: gunakan properti `ListHeaderComponent` dan `ListFooterComponent` untuk bagian atas/bawah daftar, atau ganti `FlatList` dengan `ScrollView` + `map` bila data sedikit (pola Bab 5). Pencegahan: rancang halaman dengan satu komponen daftar utama; jangan menumpuk dua komponen bergulir searah.

**Error 6 — "Warning: Each child in a list should have a unique 'key' prop."**

Ini peringatan, bukan error fatal: daftar hasil `map` tidak diberi properti `key` unik (Bab 4). Tanpa `key`, React tidak dapat melacak elemen mana yang berubah saat data diperbarui, sehingga bisa merender data salah atau kehilangan state baris. Solusi: beri `key={item.nim}` (atau `id` unik lainnya) pada elemen pertama dalam `map`. Pencegahan: jadikan key sebagai kebiasaan otomatis setiap menulis `map`, dan jangan memakai indeks array sebagai key bila datanya bisa berubah urutan.

Empat error pertama menghentikan aplikasi (error fatal); dua terakhir muncul sebagai peringatan (warning) namun tetap harus ditangani karena menandakan desain yang rawan bug. Kapan Anda melihat pesan-pesan ini? Saat aplikasi dijalankan, error fatal ditampilkan pada layar merah penuh yang disebut **RedBox** (layar merah berisi pesan error dan lokasi baris); peringatan tampil di terminal. RedBox adalah fitur bantuan, bukan hukuman: pesan di dalamnya selalu memuat nama file dan nomor baris tempat kesalahan terjadi — bacalah bagian itu lebih dulu sebelum menebak.

### 14.3 Network Debugging

Aplikasi yang memakai API (Bab 10) memiliki satu lagi sumber kesalahan: jaringan. Prinsip pertama network debugging: **uji endpoint sebelum mengintegrasikannya ke aplikasi**. Jika server backend buku sudah berjalan (`cd backend && npm install && npm start` — lihat Bab 10), Anda dapat memeriksa endpoint langsung dari browser dengan membuka `http://localhost:3000/api/mahasiswa`, atau dari terminal:

File: terminal

```bash
curl http://localhost:3000/api/mahasiswa
```

Penjelasan: `curl` adalah program baris perintah untuk mengirim permintaan HTTP. Perintah di atas mengirim **GET** (Bab 10) ke endpoint daftar mahasiswa dan mencetak respons mentahnya. Membiasakan uji endpoint terlebih dahulu memisahkan dua kemungkinan sumber masalah: jika `curl` berhasil tetapi aplikasi gagal, berarti masalahnya di sisi aplikasi (kode, konfigurasi, atau alamat); jika `curl` pun gagal, berarti masalahnya di server (belum berjalan, port salah, atau error status 404/500). Alternatif tanpa `curl` di Windows: buka alamat tersebut di browser, atau gunakan `fetch` bawaan Node.js versi 22 — seperti pada Contoh Bab ini.

Perhatikan bahwa alamat yang dipakai perangkat berbeda dengan alamat di komputer developer. Emulator Android mengakses komputer host melalui `10.0.2.2`, bukan `localhost`; perangkat fisik membutuhkan alamat IP komputer pada jaringan lokal (LAN). Detail perbedaan ini sudah dibahas di Bab 10 — ketika aplikasi menampilkan **"Network request failed"**, periksa lebih dulu alamat yang benar untuk target Anda, lalu pastikan server berjalan dan perangkat serta komputer berada pada jaringan yang sama.

Ketika aplikasi sudah terhubung, cara paling praktis memantau lalu lintas jaringan adalah tab Network pada React Native DevTools: Anda dapat melihat setiap permintaan `fetch`, status responsnya (200, 404, 500), dan isi JSON yang dikembalikan. *⚠ version-sensitive: ketersediaan dan tata letak tab Network bergantung pada versi DevTools yang menyertai SDK 57; alternatif yang selalu tersedia adalah mencetak sendiri respons di kode.* Pola yang dianjurkan di Bab 10 — `try/catch` + pemeriksaan `response.ok` + state loading/error/empty — sekaligus berfungsi sebagai alat debugging: letakkan `console.warn` pada blok `catch` dan pada cabang `!response.ok` agar setiap kegagalan jaringan meninggalkan jejak di terminal. Kesalahan yang paling sering menyesatkan adalah respons JSON yang tidak sesuai struktur harapan; mencetak `JSON.stringify(data)` sekali saat pertama kali mengintegrasikan endpoint menyelamatkan Anda dari berjam-jam menebak.

### 14.4 Unit Testing (Pengantar)

**Unit testing** (pengujian unit) adalah pengujian satu unit kode — biasanya satu fungsi — secara terisolasi, dengan masukan tertentu, lalu membandingkan hasilnya dengan harapan yang sudah ditulis. Mengapa teknologi ini ada? Karena uji manual tidak dapat diulang dengan konsisten: manusia lupa langkah, terburu-buru, dan cenderung menguji alur yang "berhasil" saja. Unit test yang ditulis sekali dapat dijalankan ribuan kali dengan kecepatan tinggi, sehingga setiap perubahan kode dapat segera diperiksa apakah merusak perilaku yang sudah benar — inilah senjata utama melawan regression. Trade-off-nya: menulis unit test memakan waktu di awal, dan test yang buruk (misalnya hanya menguji implementasi, bukan perilaku) menjadi beban perawatan. Karena itu, target termudah dan paling bernilai adalah **pure function** (fungsi murni): fungsi yang hasilnya hanya ditentukan oleh argumennya dan tidak menyentuh hal di luar dirinya (tidak membaca file, tidak memanggil API). Fungsi murni bersifat deterministik: masukan sama, keluaran pasti sama — properti yang membuat test mudah ditulis dan tidak pernah "kadang lulus, kadang gagal".

Contoh nyata ada di project Anda: `utils/validators.js` yang dibangun di Bab 8 untuk validasi form (required, NIM, nama, email, telepon, password — lihat Bab 8 untuk pembuatan dan pemakaiannya di form). File ini adalah kandidat unit test ideal. Berikut isinya, sama persis dengan yang dipakai di Bab 8:

File: utils/validators.js

```js
// Fungsi validasi form — JavaScript polos, tanpa dependensi.
// Dibangun di Bab 8, diuji di Bab 14.

function required(value) {
  const teks = value === null || value === undefined ? '' : String(value).trim();
  return teks === '' ? 'Wajib diisi' : '';
}

function validateNim(nim) {
  const pesanWajib = required(nim);
  if (pesanWajib) return pesanWajib;
  return /^\d{7}$/.test(String(nim).trim()) ? '' : 'NIM harus terdiri dari tepat 7 digit angka';
}

function validateNama(nama) {
  const pesanWajib = required(nama);
  if (pesanWajib) return pesanWajib;
  return String(nama).trim().length >= 3 ? '' : 'Nama minimal 3 karakter';
}

function validateEmail(email) {
  const pesanWajib = required(email);
  if (pesanWajib) return pesanWajib;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim()) ? '' : 'Format email tidak valid';
}

function validateTelepon(telepon) {
  const pesanWajib = required(telepon);
  if (pesanWajib) return pesanWajib;
  return /^08\d{8,11}$/.test(String(telepon).trim()) ? '' : 'Telepon harus diawali 08 dan terdiri dari 10-13 digit';
}

function validatePassword(password) {
  const pesanWajib = required(password);
  if (pesanWajib) return pesanWajib;
  return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(String(password)) ? '' : 'Password minimal 6 karakter, mengandung huruf dan angka';
}

function validateFormMahasiswa({ nim, nama, email, telepon } = {}) {
  const errors = {};
  const pesanNim = validateNim(nim);
  if (pesanNim) errors.nim = pesanNim;
  const pesanNama = validateNama(nama);
  if (pesanNama) errors.nama = pesanNama;
  const pesanEmail = validateEmail(email);
  if (pesanEmail) errors.email = pesanEmail;
  const pesanTelepon = validateTelepon(telepon);
  if (pesanTelepon) errors.telepon = pesanTelepon;
  return { valid: Object.keys(errors).length === 0, errors };
}

module.exports = {
  required,
  validateNim,
  validateNama,
  validateEmail,
  validateTelepon,
  validatePassword,
  validateFormMahasiswa,
};
```

Penjelasan: setiap fungsi validasi mengikuti pola yang sama — mengembalikan string pesan error jika data tidak sah, atau string kosong `''` jika sah. Konvensi "string kosong berarti valid" membuat hasil mudah diperiksa dalam test (`assert.strictEqual(fungsi('2201001'), '')`). `validateFormMahasiswa` menggabungkan seluruh aturan: menerima satu objek data mahasiswa, mengumpulkan semua pesan error ke dalam objek `errors`, dan mengembalikan `{ valid, errors }` — bentuk nilai yang sama dengan yang dikonsumsi form di Bab 8. Perhatikan bahwa seluruh fungsi di atas murni: tidak ada akses ke state, penyimpanan, atau jaringan; hanya masukan → keluaran. Itulah sebabnya fungsi-fungsi ini dapat diuji dengan mudah — bahkan tanpa menjalankan aplikasi.

Framework unit testing paling populer di ekosistem JavaScript adalah **Jest**. Untuk project React Native berbasis Expo, preset resmi bernama **jest-expo** yang menyesuaikan Jest dengan lingkungan React Native. Instalasinya mengikuti pola Expo: `npx expo install jest-expo jest`, lalu menambahkan preset pada `package.json` dan skrip `"test": "jest"`. *⚠ version-sensitive: versi jest-expo selalu dikaitkan dengan SDK; periksa dokumentasi resmi (docs.expo.dev, bagian "Unit testing") untuk SDK 57 agar preset dan konfigurasi cocok.* Jest sangat kuat untuk menguji komponen React (misalnya komponen dari Bab 5) karena dapat "membayangkan" proses render tanpa perangkat.

Namun untuk fungsi murni seperti `validators.js`, Anda tidak memerlukan framework sama sekali. Node.js menyediakan **`node:test`** — modul pengujian bawaan yang stabil sejak Node.js 20 (versi minimum buku ini: 22 LTS) — dengan sintaks yang mirip Jest tetapi tanpa satu pun dependency tambahan. Buku ini memilih `node:test` sebagai jalan utama agar Anda dapat menulis dan menjalankan test pertama hari ini juga; pengetahuan yang Anda peroleh (struktur test, assertion, cara membaca hasil) berlaku sama ketika nanti berpindah ke Jest. Berikut file test untuk `validators.js`:

File: __tests__/validators.test.js

```js
// Unit test untuk utils/validators.js menggunakan node:test bawaan Node.js.
// Menjalankan:
//   node --test                          (deteksi otomatis dari root project)
//   node __tests__/validators.test.js    (menjalankan file ini langsung)

const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  validateNim,
  validateNama,
  validateEmail,
  validateTelepon,
  validatePassword,
  validateFormMahasiswa,
} = require('../utils/validators.js');

test('validateNim menerima NIM 7 digit', () => {
  assert.strictEqual(validateNim('2201001'), '');
});

test('validateNim menolak NIM bukan 7 digit', () => {
  assert.notStrictEqual(validateNim('22010'), '');
});

test('validateNim menolak NIM kosong', () => {
  assert.notStrictEqual(validateNim(''), '');
});

test('validateNama menerima nama minimal 3 karakter', () => {
  assert.strictEqual(validateNama('Budi Santoso'), '');
});

test('validateNama menolak nama terlalu pendek', () => {
  assert.notStrictEqual(validateNama('Bu'), '');
});

test('validateEmail menerima alamat yang valid', () => {
  assert.strictEqual(validateEmail('budi.santoso@students.univ.ac.id'), '');
});

test('validateEmail menolak alamat tanpa @', () => {
  assert.notStrictEqual(validateEmail('budi.santoso'), '');
});

test('validateTelepon menerima nomor 08 berdigit 10-13', () => {
  assert.strictEqual(validateTelepon('081234567890'), '');
});

test('validateTelepon menolak nomor tidak diawali 08', () => {
  assert.notStrictEqual(validateTelepon('123456789012'), '');
});

test('validatePassword menerima kombinasi huruf dan angka', () => {
  assert.strictEqual(validatePassword('rahasia123'), '');
});

test('validatePassword menolak tanpa angka', () => {
  assert.notStrictEqual(validatePassword('rahasia'), '');
});

test('validateFormMahasiswa mengembalikan valid saat semua benar', () => {
  const hasil = validateFormMahasiswa({
    nim: '2201001',
    nama: 'Budi Santoso',
    email: 'budi.santoso@students.univ.ac.id',
    telepon: '081234567890',
  });
  assert.strictEqual(hasil.valid, true);
  assert.deepStrictEqual(hasil.errors, {});
});

test('validateFormMahasiswa mengumpulkan semua error sekaligus', () => {
  const hasil = validateFormMahasiswa({
    nim: 'abc',
    nama: '',
    email: 'budi',
    telepon: '081',
  });
  assert.strictEqual(hasil.valid, false);
  assert.deepStrictEqual(Object.keys(hasil.errors).sort(), ['email', 'nama', 'nim', 'telepon']);
});
```

Penjelasan: baris pertama mengambil `test` dari modul bawaan `node:test` dan `assert` versi ketat dari `node:assert/strict` — keduanya tersedia tanpa instalasi apa pun. Setiap `test('deskripsi', () => {...})` adalah satu kasus uji; deskripsi dalam bahasa Indonesia yang jelas membuat laporan kegagalan mudah dibaca. `assert.strictEqual(nilaiAktual, nilaiHarapan)` memeriksa kesetaraan nilai, sedangkan `assert.notStrictEqual` memeriksa ketidaksamaan — perhatikan pola "satu test, satu perilaku": kita tidak mencampur banyak pemeriksaan dalam satu test agar kegagalan langsung menunjuk ke aturan yang dilanggar. Dua test terakhir memakai `assert.deepStrictEqual` untuk membandingkan struktur objek secara menyeluruh. Perhatikan juga test untuk `validateFormMahasiswa` yang memastikan semua error dikumpulkan sekaligus (`['email', 'nama', 'nim', 'telepon']`) — perilaku penting saat form menampilkan semua kesalahan sekaligus (Bab 8), bukan satu per satu.

Cara menjalankan test: dari folder project, `node --test` akan mencari otomatis semua file bernama `*.test.js` di bawah folder saat ini dan melaporkan hasilnya; atau jalankan file tertentu dengan `node __tests__/validators.test.js`. Kedua perintah memakai Node.js saja, tanpa `npm install`. Hasil yang benar adalah seluruh test lulus dengan ringkasan seperti "pass 13" dan "fail 0". Jika sebuah test gagal, pesan kesalahan memuat deskripsi test, nilai aktual, dan nilai harapan — gunakan itu untuk memperbaiki fungsi (`validators.js`) ATAU test itu sendiri, sesuai mana yang salah; menentukan mana yang salah adalah bagian dari keterampilan debugging.

### 14.5 Integration Testing (Pengantar)

**Integration testing** (pengujian integrasi) memeriksa kerja sama antarbagian — bukan satu fungsi dalam isolasi. Jika unit test bertanya "apakah `validateFormMahasiswa` menolak NIM salah?", integration test bertanya "apakah menekan tombol Simpan pada form benar-benar mengirim data ke API dan menampilkan daftar yang diperbarui?". Perbedaan keduanya terletak pada tingkat cakupan: unit test memisahkan satu unit dari sekelilingnya (persis alasan fungsi murni mudah diuji), sedangkan integration test menghubungkan unit-unit itu — komponen dengan state, state dengan `fetch`, `fetch` dengan tampilan — untuk memverifikasi bahwa **kontrak antarmuka** antarbagian terpenuhi.

Mengapa keduanya dibutuhkan? Unit test yang semuanya lulus tidak menjamin aplikasi berfungsi: kesalahan justru sering muncul pada sambungan — format data yang dikirim form tidak sama dengan yang dibaca daftar, atau token autentikasi (Bab 13) tidak ikut terkirim pada permintaan berikutnya. Integration test menutup celah ini, dengan trade-off: test menjadi lebih lambat, lebih rapuh (perubahan kecil pada struktur data membuat banyak test gagal), dan lebih sulit disiapkan karena perlu menyimulasikan lingkungan nyata — misalnya memalsukan (mock) respons API. Inilah sebabnya praktik industri mengikuti bentuk **testing pyramid** (piramida pengujian): banyak unit test di dasar, lebih sedikit integration test di tengah, dan paling sedikit pengujian ujung-ke-ujung di puncak.

Di ekosistem React Native, integration test umumnya memakai pustaka seperti React Native Testing Library yang merender komponen nyata di lingkungan uji lalu berinteraksi dengannya (menekan `Pressable`, mengetik ke `TextInput`) sambil memalsukan jaringan. *⚠ version-sensitive: pustaka dan konfigurasinya berkembang cepat; untuk SDK 57 ikuti dokumentasi resmi.* Bab ini sengaja tidak mengimplementasikan integration test secara mendalam — tujuannya adalah Anda memahami kedudukan integration test dalam strategi pengujian dan dapat menjelaskan perbedaannya dengan unit test, karena project Expo dari Bab 2 dan seterusnya dapat dibangun dengan konfigurasi Jest yang disiapkan `jest-expo` bila Anda ingin mendalaminya kemudian.

### 14.6 Manual Testing dan Usability Testing

Kendati otomatis berharga, pengujian manual tetap tak tergantikan — dan hampir semua tim melakukannya. **Manual testing** (pengujian manual) adalah pengujian oleh manusia yang menjalankan aplikasi sungguhan, mengikuti kasus uji yang terencana, dan mencatat hasilnya. Kekuatannya: menangkap masalah yang tidak terpikirkan oleh test otomatis — animasi yang tersendat, teks terpotong di layar kecil, tombol yang sulit ditekan. Kelemahannya: butuh waktu dan bergantung pada ketelitian manusia, sehingga manual testing harus dipandu **checklist** agar tidak melompat-lompat tanpa rencana.

Kasus uji manual untuk aplikasi mobile dikelompokkan menjadi tiga kategori. Pertama, **kasus fungsional**: alur utama yang sudah dirancang — login berhasil, daftar mahasiswa tampil, form menyimpan data. Kedua, **edge case** (kasus batas): masukan yang tidak biasa — form kosong, email tanpa `@`, NIM dengan huruf, data API kosong, koneksi dimatikan di tengah permintaan. Ketiga, **kasus platform**: perilaku yang berbeda menurut perangkat — tombol kembali Android, ukuran layar kecil/besar, rotasi layar, perbedaan iOS/Android pada komponen (Bab 5), serta izin akses fitur perangkat (Bab 12) yang ditolak. Pengujian sebaiknya dilakukan pada minimal satu emulator dan satu perangkat fisik, karena emulator tidak selalu mereproduksi perilaku perangkat sungguhan (memori, jaringan, sensor).

Terpisah dari manual testing ada **usability testing** (pengujian kegunaan): mengamati pengguna nyata saat menggunakan aplikasi untuk menilai seberapa mudah aplikasi dipakai, bukan seberapa benar fungsinya. Keduanya sering tertukar: manual testing bertanya "apakah fiturnya bekerja?", usability testing bertanya "apakah pengguna bisa menemukan dan memakai fiturnya dengan mudah?" — aplikasi yang benar secara teknis bisa saja membingungkan secara kegunaan. Prinsip klasik yang dianjurkan: uji dengan sekitar **5 pengguna** — pada jumlah itu, mayoritas masalah kegunaan yang paling sering ditemui sudah terungkap, dan menambah pengguna lagi hanya sedikit menambah temuan (trade-off biaya versus informasi). Sesi usability testing sederhana terdiri dari tiga bagian: (1) siapkan 3–5 **tugas** nyata ("daftarkan mahasiswa baru bernama Dewi Lestari tanpa melihat manual apa pun"), (2) minta pengguna mengerjakan sambil **berpikir keras** (mengungkapkan apa yang dipikirkannya), dan (3) **observasi** — catat keberhasilan tugas, waktu pengerjaan, tempat pengguna ragu, dan kesalahan yang dibuat, tanpa membantu kecuali pengguna benar-benar macet (bantuan dicatat sebagai temuan). Hasil observasi diprioritaskan menjadi perbaikan UI yang akan diterapkan di Bab 6 berikutnya dalam siklus pengembangan Anda.

### 14.7 Checklist Testing Aplikasi Mobile

Produk bab ini adalah sebuah **checklist testing** (daftar periksa pengujian): dokumen kerja yang memuat daftar kasus uji, kolom untuk mencatat hasil aktual, dan kolom status. Checklist mengubah pengujian dari kegiatan "coba-coba" menjadi kegiatan tercatat: setiap kasus uji dijalankan satu per satu, hasilnya ditulis, dan statusnya jelas — sehingga (1) tidak ada fitur yang terlupakan, (2) hasil dapat dipertanggungjawabkan kepada tim, dan (3) pada rilis berikutnya checklist yang sama dijalankan ulang untuk mendeteksi regression (lihat Bab 15 yang membahas persiapan rilis). Tabel berikut adalah contoh checklist untuk aplikasi contoh buku ini, Aplikasi Manajemen Data Mahasiswa (Bab 6–8, 10):

| Area | Kasus uji (test case) | Hasil aktual | Status |
|------|------------------------|--------------|--------|
| Login | Email terdaftar + password benar → masuk ke Beranda | — | ☐ Lulus ☐ Gagal |
| Login | Password salah → muncul pesan error, tidak redirect | — | ☐ Lulus ☐ Gagal |
| Daftar Mahasiswa | Data dari API tampil lengkap (NIM, nama, prodi, IPK) | — | ☐ Lulus ☐ Gagal |
| Daftar Mahasiswa | API dimatikan → muncul pesan error, aplikasi tidak crash | — | ☐ Lulus ☐ Gagal |
| Form Mahasiswa | Simpan data valid → data muncul di daftar | — | ☐ Lulus ☐ Gagal |
| Form Mahasiswa | NIM 6 digit → ditolak dengan pesan validasi | — | ☐ Lulus ☐ Gagal |
| Form Mahasiswa | Telepon tidak diawali 08 → ditolak dengan pesan validasi | — | ☐ Lulus ☐ Gagal |
| Navigasi | Tombol kembali Android keluar dari form tanpa menyimpan | — | ☐ Lulus ☐ Gagal |
| Perangkat | Tampilan masih rapi di layar kecil (mis. 360 dp lebar) | — | ☐ Lulus ☐ Gagal |
| Jaringan | Aplikasi menampilkan loading state saat respons lambat | — | ☐ Lulus ☐ Gagal |

Cara mengisi: kolom "Hasil aktual" diisi apa yang benar-benar Anda amati (misalnya "muncul pesan 'NIM harus terdiri dari tepat 7 digit angka'"), bukan apa yang Anda harapkan; kolom "Status" ditandai setelah hasil diverifikasi. Kasus uji yang gagal tidak dihapus — dicatat dan diperbaiki, lalu diuji ulang. Checklist yang baik adalah milik tim yang hidup: berkembang setiap kali ditemukan bug baru, karena bug yang lolos berarti ada kasus uji yang seharusnya ada (prinsip **test case regression**: setiap bug yang diperbaiki menjadi kasus uji permanen).

Melengkapi checklist, hasil pengujian fungsi validasi dari subbab 14.4 menjadi bukti otomatis yang menyertainya: 13 kasus uji lulus dengan `node --test` berarti aturan validasi (NIM 7 digit, email, telepon 08, password, dan agregasi error) terverifikasi dapat diulang kapan pun — bukti yang tidak bisa diberikan oleh pengujian manual sekalipun. Gabungan keduanya — checklist manual untuk perilaku aplikasi, unit test untuk logika murni — adalah bentuk QA paling realistis untuk project skala mahasiswa dan tim kecil: otomatis di tempat yang murah, manual di tempat yang sulit diotomatisasi.

## Contoh

**Contoh 1 — Men-debug state dengan log berlabel.** Saat state tidak berubah seperti dugaan, log pada setiap titik perubahan memberi tahu urutan kejadian. Contoh berikut memakai pola dari Bab 4 (state + useEffect) pada project Anda sendiri:

File: app/TampilkanIPK.js

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

  return (
    <View>
      <Text>IPK: {ipk === null ? 'memuat...' : ipk}</Text>
    </View>
  );
}
```

Penjelasan: state `ipk` diawali `null` — inilah penyebab paling umum error "undefined is not an object" bila kita lupa menyediakan kondisi "belum ada data". `useEffect` mencetak nilai `ipk` setiap kali berubah, sehingga terminal menunjukkan urutan: `null`, lalu `3.45`. Baris log menyebut nama komponen dan variabel yang diamati ("useEffect berjalan, ipk saat ini:"), pola penamaan yang membuat pencarian log lebih mudah saat banyak komponen mencetak pesan. Jika nilai yang tercetak tidak sesuai harapan, Anda sudah tahu persis titik penyimpangannya. Cleanup `clearTimeout` mencegah pembaruan state setelah komponen dilepas.

**Contoh 2 — Menguji endpoint dari Node sebelum menyentuh aplikasi.** Node.js versi 22 memiliki `fetch` bawaan, sehingga Anda dapat memeriksa endpoint backend (Bab 10) tanpa browser:

File: terminal

```bash
node -e "fetch('http://localhost:3000/api/mahasiswa').then(r => { console.log('Status:', r.status); return r.json(); }).then(d => console.table(d.data)).catch(err => console.warn('Gagal:', err.message))"
```

Penjelasan: satu baris perintah ini menjalankan `fetch` ke endpoint yang sama yang dipakai aplikasi. `r.status` mencetak kode status HTTP (200 sukses, 404 tidak ditemukan, 500 error server — arti kode ini dijelaskan di Bab 10). Jika respons sukses, `console.table` menampilkan data dalam bentuk tabel; jika server mati atau alamat salah, blok `catch` mencetak penyebabnya. Dengan cara ini Anda memverifikasi sisi server dulu (server hidup, endpoint benar, data sesuai struktur), baru kemudian menelusuri sisi aplikasi — urutan yang menghemat waktu seperti dibahas di subbab 14.3. Jalankan dari folder mana pun, selama server backend berjalan di port 3000.

## Praktikum

### Tujuan Praktikum

Setelah menyelesaikan praktikum ini, mahasiswa mampu: (1) menjalankan unit test fungsi validasi dengan `node:test` dan membaca laporannya; (2) menggunakan `console.log`, `console.warn`, dan `console.table` untuk menelusuri data; (3) memeriksa endpoint API dari terminal; dan (4) mengisi checklist testing berdasarkan hasil pengujian aplikasi sendiri.

### Kebutuhan

- Node.js LTS versi 22 atau lebih baru (cek dengan `node --version`; jika di bawah 18, `node:test` belum tersedia — lihat Troubleshooting).
- Project hasil Bab 10 (sudah terhubung API) atau project Bab 8 (form + validasi); jika keduanya belum ada, cukup folder kerja kosong dengan dua file dari subbab 14.4.
- Backend buku berjalan: `cd backend && npm install && npm start` (lihat Bab 10).
- Terminal/Command Prompt dan editor teks.

### Persiapan

1. Buat folder `praktikum14` di lokasi kerja Anda.
2. Di dalamnya buat struktur folder: `utils/` dan `__tests__/` (folder `__tests__` diawali dua garis bawah — konvensi yang dikenali banyak alat pengujian).
3. Salin `utils/validators.js` dari subbab 14.4 ke `praktikum14/utils/validators.js`, dan `__tests__/validators.test.js` ke `praktikum14/__tests__/validators.test.js`.
4. Pastikan terminal berada di dalam `praktikum14` (bukan di `__tests__`), karena path relatif `../utils/validators.js` dihitung dari folder `__tests__`.

### Langkah Kerja

1. Jalankan test lewat eksekusi langsung: `node __tests__/validators.test.js`. Amati output TAP yang tercetak.
2. Jalankan mode deteksi otomatis: `node --test`. Bandingkan ringkasannya dengan langkah 1.
3. Buat file `console-demo.js` (kode di bagian Kode), jalankan `node console-demo.js`, dan amati perbedaan tampilan `console.log`, `console.warn`, serta `console.table`.
4. Uji endpoint dari terminal: pastikan backend berjalan, lalu jalankan perintah `node -e "fetch(...)"` dari Contoh 2. Catat status yang tercetak.
5. Simulasikan kegagalan: hentikan server backend, ulangi langkah 4, lalu perhatikan pesan error dari blok `catch` — ini latihan membaca kegagalan jaringan sebelum menyentuh aplikasi (subbab 14.3).
6. Bukalah project Expo Anda (hasil Bab 8 atau Bab 10), lalu pada terminal `npx expo start` tekan `m` untuk membuka menu developer di emulator, `r` untuk reload, dan `j` untuk membuka debugger. Temukan pesan `console.log` aplikasi Anda di sana. *⚠ version-sensitive: kombinasi tombol dapat berbeda pada versi Expo lain.*
7. Dengan project yang sama, buka React Native DevTools dan tab Network, lalu lakukan satu operasi yang memanggil API (misalnya memuat daftar mahasiswa). Amati satu permintaan `fetch`, statusnya, dan isi responsnya.
8. Terakhir, isi checklist pada subbab 14.7 untuk aplikasi Anda: jalankan minimal 5 kasus uji, tulis hasil aktual, dan beri status.

### Kode

File: console-demo.js

```js
// Demo penggunaan console untuk debugging data mahasiswa.
// Menjalankan: node console-demo.js

const mahasiswa = [
  { nim: '2201001', nama: 'Budi Santoso', prodi: 'Sistem Informasi', ipk: 3.45 },
  { nim: '2201002', nama: 'Siti Aminah', prodi: 'Teknik Informatika', ipk: 3.82 },
  { nim: '2201003', nama: 'Agus Wijaya', prodi: 'Informatika', ipk: 3.2 },
  { nim: '2201004', nama: 'Dewi Lestari', prodi: 'Rekayasa Perangkat Lunak', ipk: 3.61 },
  { nim: '2201005', nama: 'Rizky Pratama', prodi: 'Sistem Informasi', ipk: 2.95 },
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

(Tidak ditampilkan ulang di sini: `utils/validators.js` dan `__tests__/validators.test.js` — gunakan isi persis subbab 14.4.)

### Penjelasan Kode

Penjelasan: file `console-demo.js` memakai kelima data mahasiswa baku buku ini (Bab 4–10). Tiga hal yang perlu diperhatikan: pertama, setiap panggilan console diberi label teks, misalnya `'Jumlah data mahasiswa:'`, sehingga saat banyak log bercampur di terminal Anda tetap tahu arti tiap baris; kedua, `console.warn` dipakai untuk kondisi abnormal (ada mahasiswa ber-IPK di bawah 3.0) — secara visual mencolok sehingga tidak terlewat; ketiga, `console.table` mengubah larik objek menjadi tabel dengan kolom NIM, Nama, Prodi, IPK — cara tercepat memverifikasi "apakah datanya benar-benar sampai dan berbentuk seperti dugaan". Sementara itu, file test dari subbab 14.4 bekerja dengan pola satu test satu perilaku: desain ini membuat laporan kegagalan langsung menunjuk aturan validasi yang dilanggar, baik aturan itu memang salah maupun test-nya yang salah menduga — membedakan keduanya adalah latihan debugging itu sendiri.

### Hasil yang Diharapkan

1. Langkah 1–2: seluruh 13 test lulus; output diakhiri ringkasan seperti di bawah (format TAP dari `node:test`):

```text
✔ validateNim menerima NIM 7 digit
✔ validateNim menolak NIM bukan 7 digit
...
ℹ tests 13
ℹ pass 13
ℹ fail 0
```

2. Langkah 3: terminal menampilkan tiga jenis pesan — dua baris `console.log`, satu baris peringatan `console.warn`, dan satu tabel 5 baris × 4 kolom dari `console.table` (tampilan tabel bergantung pada lebar terminal; bila berantakan, perbesar jendela terminal).
3. Langkah 4: tercetak `Status: 200` dan tabel data mahasiswa; langkah 5 (server dimatikan) mencetak pesan kegagalan dari blok `catch`, dan aplikasi Anda tetap aman karena tidak ikut dijalankan.
4. Langkah 6–7: menu developer muncul di emulator, `r` me-reload aplikasi, dan tab Network menampilkan permintaan `fetch` beserta statusnya.
5. Langkah 8: checklist terisi minimal 5 baris dengan hasil aktual dan status; jika ada kasus gagal, perbaiki dan uji ulang hingga lulus.

### Troubleshooting

**Masalah:** Perintah `node __tests__/validators.test.js` mencetak error seperti "Unknown file extension" atau tidak mencetak hasil test sama sekali.
**Penyebab:** Versi Node.js terlalu tua — modul `node:test` stabil sejak Node 20 dan butuh sintaks modern; di bawah Node 18 modul ini belum ada.
**Solusi:** Cek `node --version`; instal Node.js LTS 22 atau lebih baru (lihat Bab 2), lalu jalankan ulang.
**Pencegahan:** Selalu cek versi Node di awal sesi kerja; simpan versi yang dibutuhkan pada dokumentasi project.

**Masalah:** Test gagal dengan "Cannot find module '../utils/validators.js'".
**Penyebab:** Path relatif salah — file `validators.js` tidak ada di `utils/`, nama file tidak sama persis (perbedaan huruf kapital), atau terminal berada di folder yang salah.
**Solusi:** Pastikan struktur `praktikum14/utils/validators.js` dan `praktikum14/__tests__/validators.test.js` ada, nama file sama, dan perintah dijalankan dari `praktikum14`.
**Pencegahan:** Buat struktur folder lebih dulu (Persiapan langkah 2) sebelum menulis file; biarkan editor melengkapi path.

**Masalah:** Test gagal dengan "AssertionError: Expected values to be strictly equal" pada salah satu test.
**Penyebab:** Fungsi validasi mengembalikan nilai berbeda dari harapan test — bisa karena aturan validasi memang berubah, atau test menuliskan harapan yang keliru.
**Solusi:** Baca pesan error: nama test yang gagal, nilai aktual, dan nilai harapan; periksa baris fungsi terkait di `validators.js`, putuskan mana yang salah (fungsi atau test), lalu perbaiki satu di antaranya.
**Pencegahan:** Tulis test setelah memahami spesifikasi aturan validasi; saat aturan berubah, perbarui test di saat yang sama.

**Masalah:** Menu developer tidak muncul saat menekan `m` di emulator, atau `r`/`j` tidak merespons.
**Penyebab:** Jendela terminal Expo tidak dalam keadaan fokus; atau kombinasi tombol berbeda pada versi Expo SDK yang Anda pakai. *⚠ version-sensitive.*
**Solusi:** Fokuskan terminal `npx expo start` lalu tekan `m`; alternatif: goyangkan emulator (shake), tekan `Ctrl+M` di emulator Windows, atau kirim perintah `adb shell input keyevent 82`. Baca daftar tombol yang dicetak terminal saat `npx expo start` dijalankan.
**Pencegahan:** Gunakan tombol bantuan terminal Expo sebagai sumber kebenaran kombinasi tombol versi Anda, bukan hafalan dari buku.

**Masalah:** Contoh `fetch` di Node mencetak "TypeError: fetch is not defined".
**Penyebab:** `fetch` bawaan hanya tersedia di Node.js 18 ke atas; Node lama tidak memilikinya.
**Solusi:** Perbarui ke Node.js LTS 22 (bab ini meminimumkan 22 sesuai kontrak buku).
**Pencegahan:** Cek `node --version` sebelum menjalankan contoh jaringan dari terminal.

## Studi Kasus

**Insiden "KRS Online": ketika validasi yang lemah menggagalkan pendaftaran semester.** Sebuah perguruan tinggi di Jawa Tengah meluncurkan aplikasi mobile SIAKAD untuk pengisian Kartu Rencana Studi (KRS) — aplikasi dengan alur yang mirip Aplikasi Manajemen Data Mahasiswa pada buku ini: login, daftar, dan form isian yang terhubung API. Pada hari pertama pendaftaran, tim helpdesk kewalahan: mahasiswa melaporkan tiga gejala. Pertama, form menerima NIM 6 digit sehingga data mahasiswa yang tidak dikenal tersimpan sebagai "mahasiswa baru"; kedua, banyak mahasiswa melihat layar kosong saat membuka daftar KRS, dengan pesan "undefined is not an object" di log; ketiga, beberapa pengguna iOS tidak bisa menyelesaikan pengisian karena tombol simpan tertutup papan ketik layar. Akar masalahnya ditemukan setelah audit: tim pengembang (dua orang, satu mahasiswa magang) menguji hanya alur "jalan senang" — form diisi data benar, server hidup, perangkat Android emulator saja. Tidak ada unit test untuk fungsi validasi, tidak ada uji dengan server mati, dan tidak ada pengujian di perangkat nyata atau platform kedua.

Insiden ini adalah studi kasus dunia Sistem Informasi yang memetakan langsung ke materi bab ini. Gejala pertama adalah kegagalan validasi — kasus yang dicegah oleh unit test `validators.js` (subbab 14.4): NIM 6 digit akan ditolak 13 kasus uji yang dapat dijalankan kapan pun. Gejala kedua adalah error "undefined is not an object" (subbab 14.2) yang bersumber dari tidak adanya loading state dan pengecekan struktur respons sebelum render (Bab 10) — ditangkap oleh kasus uji manual "API dimatikan → muncul pesan error" pada checklist (subbab 14.7). Gejala ketiga adalah masalah kegunaan dan platform yang hanya muncul pada uji perangkat nyata (subbab 14.6): emulator tidak mereproduksi papan ketik layar iOS. Pelajaran kuncinya: biaya tiga hari helpdesk jauh lebih mahal daripada biaya menulis 13 unit test dan satu halaman checklist — itulah argumen ekonomi di balik QA. Aplikasi yang sama persis dengan studi kasus ini akan Anda bangun pada Project Akhir "Sistem Informasi Akademik Mobile"; bab ini memberi Anda perlengkapan pengujiannya.

## Latihan

### Soal Pemahaman

1. Jelaskan perbedaan antara debugging, testing, dan quality assurance (QA) dengan contoh kegiatan masing-masing.
2. Apa kelebihan `console.table` dibanding `console.log` saat menampilkan daftar mahasiswa? Kapan Anda memilih `console.warn`?
3. Sebutkan tiga error umum React Native dan, untuk masing-masing, satu penyebab serta satu solusi.
4. Mengapa pure function adalah target unit test yang paling mudah? Beri alasan berdasarkan sifat deterministiknya.
5. Apa perbedaan tujuan unit testing dan integration testing? Berikan satu pertanyaan penelitian yang khas untuk masing-masing.
6. Apa perbedaan manual testing dan usability testing, dan mengapa keduanya tidak bisa digantikan unit test?

### Soal Praktik

1. Tambahkan ke `__tests__/validators.test.js` tiga kasus uji baru: `validateTelepon` menolak nomor 14 digit; `validateEmail` menolak alamat dengan dua tanda `@`; `validateFormMahasiswa` mengembalikan `valid: false` saat NIM kosong. Jalankan `node --test` hingga seluruhnya lulus.
2. Uji salah satu perilaku validasi secara manual: jalankan `node` di terminal, panggil `require('./utils/validators.js').validateNim('22AB01')`, dan bandingkan hasilnya dengan hasil unit test. Mana yang lebih mudah diulang?
3. Buat checklist pengujian 5 kasus uji untuk aplikasi Anda (lihat tabel subbab 14.7), jalankan di emulator, dan isi kolom hasil serta status. Laporkan satu temuan yang tidak terduga.

### Soal Analisis

1. Analisislah insiden "KRS Online" pada Studi Kasus: untuk setiap gejala, tentukan tahap materi bab ini yang seharusnya menangkapnya (unit test, error umum, network debugging, manual/usability testing, atau checklist), dan jelaskan mengapa tahap tersebut mampu menangkapnya. Manakah urutan penerapan QA yang paling murah jika tim hanya punya waktu satu hari?

## Tantangan

1. Tulis unit test untuk satu fungsi murni lain dari project Anda — misalnya fungsi perhitungan total keranjang belanja pada project Bab 9 (jika berbentuk fungsi murni) — lengkap dengan kasus batas: keranjang kosong, satu item, item dengan harga nol.
2. Susun sesi usability testing mini: ajak 3–5 teman, beri satu tugas nyata pada aplikasi Anda (misalnya "tambahkan mahasiswa baru"), amati tanpa membantu, dan tulis 3 temuan paling penting beserta perbaikan UI yang Anda usulkan.
3. Buat "jurnal bug": selama satu minggu mengerjakan project, catat setiap bug yang ditemukan beserta error message, penyebab, solusi, dan kasus uji pencegahannya — lalu tambahkan kasus uji tersebut ke checklist Anda (prinsip test case regression).

## Rangkuman

1. Debugging adalah menemukan dan memperbaiki bug; testing memeriksa perilaku secara terencana; QA memastikan kualitas secara sistematis, termasuk mencegah bug sejak awal.
2. `console.log` untuk nilai biasa, `console.warn` untuk kondisi mencurigakan, `console.table` untuk data tabel; label pada setiap log membuat pesan mudah ditelusuri.
3. React Native DevTools menyediakan breakpoint, tab Network, dan akses ke menu developer; React DevTools menampilkan pohon komponen dan state. Kombinasi tombol `j`, `r`, `m` pada emulator bersifat version-sensitive. *⚠*
4. Error umum React Native — Unable to resolve module, Invalid hook call, undefined is not an object, teks di luar `<Text>`, VirtualizedList dalam ScrollView, dan peringatan `key` — masing-masing punya penyebab dan solusi yang khas; RedBox selalu memuat lokasi baris kesalahan.
5. Uji endpoint dengan `curl`, browser, atau `fetch` Node sebelum mengintegrasikannya ke aplikasi; perhatikan perbedaan alamat `localhost`, `10.0.2.2`, dan IP LAN (Bab 10).
6. Unit test menguji satu fungsi secara terisolasi; pure function adalah target termudah karena deterministik.
7. `node:test` memungkinkan unit test tanpa dependency tambahan; Jest + `jest-expo` adalah standar industri untuk project React Native (*⚠ version-sensitive*).
8. Integration testing memverifikasi kerja sama antarbagian; manual testing dipandu checklist; usability testing mengamati pengguna nyata — sekitar 5 pengguna cukup untuk menemukan mayoritas masalah.
9. Checklist testing (area, kasus uji, hasil, status) adalah produk QA yang hidup: setiap bug yang diperbaiki menjadi kasus uji permanen (test case regression).

## Refleksi

1. Pernahkah Anda menghabiskan waktu lama mencari bug yang ternyata hanya salah ketik path atau huruf kapital? Bagaimana kebiasaan dari Bab 14 ini akan mengubah cara Anda menulis kode berikutnya?
2. Dari insiden "KRS Online", sikap atau kebiasaan apa yang paling mungkin Anda tiru saat mengerjakan project kelompok agar kegagalan serupa tidak terjadi?
3. Unit test dan checklist terasa "memakan waktu" di awal. Menurut Anda, pada kondisi project seperti apa biaya itu terbayar — dan kapan justru berlebihan?
4. Dalam karier Anda (pengembang, analis SI, atau QA), mana dari keterampilan bab ini yang paling mungkin Anda pakai setiap hari, dan mengapa?

## Evaluasi Bab

### Pilihan Ganda

1. Kegiatan menemukan dan memperbaiki kesalahan pada kode disebut...
   A. Testing
   B. Debugging
   C. Quality assurance
   D. Regression

2. Fungsi console yang paling tepat untuk menampilkan daftar mahasiswa agar mudah dibaca kolom per kolom adalah...
   A. `console.log`
   B. `console.error`
   C. `console.table`
   D. `console.info`

3. Pesan "Unable to resolve module './components/KartuMahasiswa'" umumnya berarti...
   A. Komponen mengalami error saat render
   B. Modul yang diimport tidak ditemukan oleh bundler (path/penamaan salah)
   C. Hook dipanggil di luar komponen
   D. Data API belum dimuat

4. Error "'undefined' is not an object (evaluating 'mahasiswa.nama')" paling sering muncul karena...
   A. Nama file salah huruf kapital
   B. Teks polos di dalam View
   C. Data belum dimuat saat komponen mencoba membaca propertinya
   D. Dua komponen gulir ditumpuk searah

5. Sifat pure function yang membuatnya ideal untuk unit test adalah...
   A. Berjalan cepat di emulator
   B. Hasilnya hanya ditentukan oleh argumennya (deterministik)
   C. Tidak memerlukan Node.js
   D. Selalu mengembalikan objek

6. Pernyataan yang benar tentang `node:test` adalah...
   A. Framework pengujian khusus React Native
   B. Modul pengujian bawaan Node.js tanpa dependency tambahan
   C. Pengganti React Native DevTools
   D. Alat untuk menguji endpoint dari browser

7. Perbedaan utama integration testing dan unit testing terletak pada...
   A. Biaya lisensi
   B. Tingkat cakupan: kerja sama antarbagian versus satu unit terisolasi
   C. Bahasa pemrograman yang dipakai
   D. Jumlah pengguna yang dibutuhkan

8. Prinsip jumlah pengguna pada usability testing yang disarankan buku ini adalah sekitar...
   A. 1 pengguna
   B. 5 pengguna
   C. 50 pengguna
   D. Semakin banyak semakin baik tanpa batas

9. Tujuan utama menuliskan "hasil aktual" pada checklist testing adalah...
   A. Mempercepat proses render aplikasi
   B. Mencatat apa yang benar-benar diamati, bukan yang diharapkan, agar hasil dapat diverifikasi
   C. Menggantikan kebutuhan unit test
   D. Memenuhi syarat publish ke toko aplikasi

10. Perintah yang menjalankan semua file `*.test.js` secara otomatis dengan modul bawaan Node adalah...
    A. `node --test`
    B. `npm run emulator`
    C. `npx expo install jest`
    D. `node reload`

### Soal Uraian

1. Jelaskan langkah-langkah Anda ketika aplikasi menampilkan "Network request failed": dari memeriksa server, alamat yang benar untuk target (emulator/perangkat), hingga cara memastikan masalah ada di sisi aplikasi atau sisi server. Kaitkan dengan subbab 14.3 dan Bab 10.
2. Rancang tiga unit test untuk fungsi `validatePassword` (dari subbab 14.4) yang belum ada di file test, beserta alasan memilih ketiga kasus tersebut — apa perilaku yang ingin Anda kunci agar tidak berubah di masa depan?
3. Analisislah: sebuah tim hanya punya waktu satu hari untuk menguji sebelum rilis. Urutkan prioritas Anda di antara: unit test fungsi validasi, checklist manual fungsional, usability testing, dan integration testing. Berikan justifikasi berdasarkan biaya, risiko, dan cakupan tiap kegiatan.

### Kunci Jawaban

<details>
<summary>Kunci jawaban pilihan ganda (klik untuk membuka)</summary>

1. B — Debugging adalah proses menemukan dan memperbaiki kesalahan (subbab 14.1).
2. C — `console.table` menampilkan array objek sebagai tabel berkolom (subbab 14.1).
3. B — "Unable to resolve module" berarti bundler tidak menemukan modul; periksa path, penamaan, dan huruf kapital (subbab 14.2).
4. C — Membaca properti dari state/data yang belum dimuat; solusinya loading state atau operator opsional (subbab 14.2).
5. B — Fungsi murni deterministik: masukan sama, keluaran sama, sehingga hasil uji konsisten (subbab 14.4).
6. B — `node:test` adalah modul pengujian bawaan Node.js (subbab 14.4).
7. B — Unit mengisolasi satu unit; integration memverifikasi kontrak antarbagian (subbab 14.5).
8. B — Sekitar 5 pengguna mengungkap mayoritas masalah kegunaan dengan biaya wajar (subbab 14.6).
9. B — "Hasil aktual" mencatat observasi nyata agar dapat diverifikasi dan dipertanggungjawabkan (subbab 14.7).
10. A — `node --test` mendeteksi otomatis file `*.test.js` (subbab 14.4, Praktikum).

</details>