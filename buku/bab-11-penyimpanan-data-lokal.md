# BAB 11 — Penyimpanan Data Lokal

## Deskripsi Singkat

Pada bab-bab sebelumnya, seluruh data aplikasi hidup hanya di dalam memori melalui state React — nilainya lenyap begitu aplikasi ditutup. Bab ini mengajarkan penyimpanan data lokal (local storage): cara menyimpan data secara persisten di perangkat pengguna menggunakan **AsyncStorage**, menangani serialisasi **JSON**, menerapkan caching sederhana, serta memahami mengapa data sensitif seperti token tidak boleh disimpan di penyimpanan biasa. Praktikum bab ini membangun **Aplikasi Catatan** yang lengkap: tambah, edit, hapus, dan pencarian catatan yang tetap tersimpan setelah aplikasi di-restart. Materi ini menjadi fondasi penting bagi Bab 12 (profil mahasiswa yang tersimpan) dan Bab 13 (autentikasi dengan penyimpanan aman).

## Tujuan Pembelajaran

Setelah mempelajari bab ini, mahasiswa diharapkan mampu:

1. Menjelaskan kebutuhan penyimpanan lokal beserta perbedaannya dengan state yang hidup di memori.
2. Mengidentifikasi karakteristik AsyncStorage: asinkron, berbentuk pasangan kunci–nilai (key–value), hanya menerima string, dan persisten lintas restart.
3. Mengimplementasikan operasi simpan, baca, dan hapus data dengan serialisasi JSON yang aman terhadap kegagalan parsing.
4. Menganalisis pola caching sederhana (snapshot data + timestamp) beserta trade-off antara kesegaran dan ketersediaan data.
5. Mengevaluasi risiko menyimpan token di AsyncStorage dan menjelaskan alternatif penyimpanan aman yang akan dibahas di Bab 13.
6. Merancang dan membangun aplikasi catatan persisten dengan fitur tambah, edit, hapus, dan pencarian.

## Peta Konsep

```text
Penyimpanan Data Lokal
│
├─ Kebutuhan: offline · preferensi · cache · draf
│
├─ AsyncStorage — key-value · asinkron · string-only
│   ├─ setItem / getItem / removeItem
│   ├─ multiGet / multiSet / getAllKeys / clear
│   └─ persisten lintas restart · tidak terenkripsi
│
├─ Serialisasi JSON — JSON.stringify ⇄ JSON.parse
│   └─ try/catch + validasi bentuk data
│
├─ Caching — snapshot data API + timestamp + TTL
│   └─ fallback saat offline dengan penanda
│
└─ Token — ⚠ bukan untuk AsyncStorage
    └─ secure storage (Keychain/Keystore) → Bab 13
```

## Materi

### 11.1 Kebutuhan Penyimpanan Lokal

Pada Bab 4 hingga Bab 10, seluruh data aplikasi kita disimpan di dalam state React, yaitu variabel yang hidup di memori (RAM) perangkat. Memori bersifat **volatil** (mudah menguap): begitu aplikasi ditutup, proses aplikasi dimatikan sistem operasi karena kekurangan RAM, atau pengguna memuat ulang (reload) aplikasi, semua nilai yang tersimpan di state lenyap tanpa jejak. Pengalaman ini sangat familier — menulis draf panjang di suatu aplikasi, aplikasi tiba-tiba tertutup, dan draf itu hilang.

Padahal, sejumlah data justru harus **bertahan** (persist) melewati siklus hidup proses aplikasi. Jenis data tersebut antara lain:

1. **Preferensi pengguna** — tema gelap (dark mode), bahasa antarmuka, atau pengaturan ukuran huruf. Pengguna tidak akan rela mengatur ulang setiap kali membuka aplikasi.
2. **Draf formulir** — isian form yang belum selesai (Bab 8) sebaiknya disimpan agar tidak hilang bila aplikasi tertutup di tengah jalan.
3. **Cache konten dari server** — salinan data API (Bab 10) agar aplikasi tetap bisa menampilkan informasi saat jaringan tidak tersedia dan hemat kuota.
4. **Data operasional offline** — catatan transaksi, pesanan, atau entri data yang dibuat di daerah tanpa sinyal, untuk disinkronkan ke server belakangan.
5. **Kredensial sesi** — token autentikasi (Bab 10.8) agar pengguna tidak perlu login setiap kali membuka aplikasi.

Tempat yang tepat untuk data semacam ini adalah **penyimpanan lokal** (local storage): data yang disimpan di dalam perangkat pengguna, bukan di server. Untuk memahami mengapa teknologi ini ada, perhatikan tiga kenyataan yang mendorongnya. Pertama, RAM itu cepat tetapi mahal dan terbatas; sistem operasi sewaktu-waktu membunuh proses aplikasi untuk merebut kembali memorinya. Kedua, jaringan tidak selalu tersedia — sinyal buruk, kuota habis, atau server sedang bermasalah — sehingga aplikasi yang bergantung penuh pada server menjadi tidak berguna di saat paling dibutuhkan. Ketiga, tidak semua data perlu (atau layak) dikirim ke server; menyimpan data secara lokal membuat aplikasi lebih cepat, lebih hemat baterai dan kuota, serta lebih menghargai privasi pengguna.

Setiap platform mobile menyediakan mekanisme penyimpanan lokalnya sendiri: Android memiliki SharedPreferences dan SQLite, iOS memiliki UserDefaults dan Core Data. React Native menyatukan perbedaan itu lewat pustaka lintas platform. Dalam ekosistem React Native/Expo, terdapat tiga pilihan utama dengan karakteristik berbeda: **AsyncStorage** (penyimpanan kunci–nilai sederhana, cocok untuk data kecil), **SQLite** (database relasional, cocok untuk data terstruktur dalam jumlah besar dengan pencarian kompleks), dan **expo-file-system** (penyimpanan berkas, cocok untuk gambar dan media — dibahas di Bab 12). Prinsip pemilihannya sederhana: "gunakan alat yang paling sederhana namun memadai." Untuk preferensi, cache, dan daftar data pendek, AsyncStorage adalah pilihan tepat; menggunakan SQLite untuk keperluan semacam itu sama borosnya dengan membawa truk untuk mengangkut satu kardus.

### 11.2 AsyncStorage: Menyimpan, Membaca, Menghapus

**AsyncStorage** adalah pustaka penyimpanan **kunci–nilai** (key–value storage) yang asinkron untuk React Native. Konsepnya sama dengan laci arsip: setiap data disimpan pada sebuah **kunci** (key), yaitu nama unik, dan dibaca kembali menggunakan kunci tersebut. Pustaka ini dikelola komunitas React Native, didukung penuh oleh Expo, dan berfungsi di Android, iOS, maupun web. Pemasangannya menggunakan perintah khusus Expo agar versi pustaka otomatis cocok dengan SDK:

```bash
npx expo install @react-native-async-storage/async-storage
```

Perintah `npx expo install` berbeda dari `npm install`: Expo memilihkan versi pustaka yang sudah teruji kompatibel dengan SDK project (SDK 57 pada buku ini). Bila memakai `npm install` dengan versi bebas, bisa terjadi ketidakcocokan yang menyebabkan aplikasi gagal dijalankan — keluhan yang paling sering muncul di forum mahasiswa.

Setelah terpasang, pustaka diimpor dan langsung digunakan:

File: App.js (contoh penggunaan sederhana)

```js
import AsyncStorage from '@react-native-async-storage/async-storage';

async function simpanNamaPengguna(nama) {
  try {
    await AsyncStorage.setItem('preferensi:nama', nama);
    console.log('Nama berhasil disimpan');
  } catch (error) {
    console.warn('Gagal menyimpan:', error);
  }
}

async function bacaNamaPengguna() {
  try {
    const nama = await AsyncStorage.getItem('preferensi:nama');
    if (nama === null) {
      console.log('Belum ada nama tersimpan');
    } else {
      console.log('Nama tersimpan:', nama);
    }
  } catch (error) {
    console.warn('Gagal membaca:', error);
  }
}
```

Penjelasan: `setItem` menyimpan pasangan kunci–nilai, sedangkan `getItem` membaca nilai berdasarkan kunci. Perhatikan penggunaan `await` — kedua fungsi ini asinkron (diperkenalkan di Bab 3), artinya proses baca–tulis dilakukan di luar alur utama antarmuka agar layar tidak membeku. Yang juga penting: `getItem` mengembalikan `null` bila kunci belum pernah disimpan, bukan string kosong. Memeriksa `null` sebelum memakai nilai adalah kebiasaan yang mencegah bug halus.

Seluruh API AsyncStorage dirangkum dalam tabel berikut.

| Metode | Fungsi | Nilai Kembalian |
|---|---|---|
| `setItem(kunci, nilai)` | Menyimpan satu pasangan kunci–nilai | `Promise<void>` |
| `getItem(kunci)` | Membaca nilai sebuah kunci | `Promise<string \| null>` |
| `removeItem(kunci)` | Menghapus satu kunci beserta nilainya | `Promise<void>` |
| `multiGet([k1, k2, ...])` | Membaca beberapa kunci sekaligus | `Promise<[string, string \| null][]>` |
| `multiSet([[k1, v1], [k2, v2], ...])` | Menyimpan beberapa pasangan sekaligus | `Promise<void>` |
| `getAllKeys()` | Mendapatkan daftar semua kunci yang ada | `Promise<string[]>` |
| `clear()` | Menghapus seluruh data aplikasi | `Promise<void>` |

`multiGet` berguna saat aplikasi perlu membaca banyak kunci dalam satu kali operasi, misalnya kunci preferensi dan kunci sesi sekaligus:

File: App.js (contoh penggunaan multiGet)

```js
const pasangan = await AsyncStorage.multiGet(['preferensi:nama', 'sesi:aktif']);
const namaPengguna = pasangan[0][1];
const sesiAktif = pasangan[1][1];
```

Pola kembalian `multiGet` adalah array berisi pasangan `[kunci, nilai]`; nilai `null` menandakan kunci tidak ditemukan. Metode ini lebih efisien daripada memanggil `getItem` berulang-ulang, dan menjadi dasar pola "baca banyak data dalam satu waktu" pada aplikasi nyata.

Ada lima prinsip penting yang harus dipahami agar AsyncStorage dipakai dengan benar:

1. **Asinkron.** Semua metode mengembalikan Promise; panggilan harus menunggu dengan `await` atau `.then()`. Mengabaikan `await` berarti kode lanjutan berjalan sebelum data benar-benar tertulis — sumber bug klasik "data tidak tersimpan".
2. **Hanya menerima string.** Kunci dan nilai keduanya harus bertipe string. Menyimpan angka, boolean, atau objek langsung akan menghasilkan nilai yang salah, seperti `"[object Object]"`.
3. **`null` berarti belum ada.** `getItem` mengembalikan `null` untuk kunci yang belum pernah disimpan — gunakan pemeriksaan ini, jangan membandingkan dengan `''`.
4. **Tidak terenkripsi.** Data disimpan polos (plain text) di dalam area penyimpanan aplikasi. Implikasi keamanannya dibahas pada subbab 11.5.
5. **Bukan untuk data besar.** AsyncStorage ditujukan untuk data kecil — preferensi, pengaturan, daftar pendek. *⚠ version-sensitive: dokumentasi resmi menyebutkan batas ukuran per entri di Android (±6 MB, dibatasi implementasi SQLite di balik layar); nilai pastinya dapat berubah antar versi — periksa halaman dokumentasi resmi pustaka.* Data biner seperti foto sebaiknya disimpan sebagai berkas dengan expo-file-system (Bab 12).

Dari mana asal sifat-sifat tersebut? Di balik layar, implementasi AsyncStorage berbeda antarplatform untuk memanfaatkan mekanisme bawaan sistem: di Android data disimpan dalam database SQLite di dalam area sandbox aplikasi, di iOS dalam berkas-berkas kecil di direktori aplikasi, dan di web memakai `localStorage` peramban. Karena berada di dalam sandbox, data ini bertahan saat aplikasi ditutup, tetapi ikut terhapus ketika aplikasi di-uninstall atau datanya dibersihkan pengguna. Desain "hanya string" pun bukan tanpa alasan: protokol kunci–nilai yang sesederhana mungkin mudah diimplementasikan konsisten di semua platform; konsekuensinya, tanggung jawab mengubah bentuk data (objek, array) menjadi string diserahkan kepada pengembang — inilah yang dibahas pada subbab berikutnya.

### 11.3 Serialisasi JSON

Konsekuensi langsung dari aturan "nilai harus string" adalah: setiap data yang bukan string — angka, boolean, objek, array — harus dikonversi secara eksplisit. Jembatan konversinya adalah **JSON** (JavaScript Object Notation), format pertukaran data yang sudah diperkenalkan di Bab 3. Dua fungsinya yang bekerja berpasangan:

- `JSON.stringify(data)` — mengubah objek atau array menjadi string JSON.
- `JSON.parse(teks)` — mengubah string JSON kembali menjadi objek atau array.

Proses mengubah bentuk data menjadi string agar bisa disimpan disebut **serialisasi** (serialization); proses kebalikannya disebut **deserialisasi**. Keduanya adalah keterampilan inti penyimpanan lokal — hampir semua data yang disimpan di AsyncStorage melewati proses ini.

Sebagai contoh, aplikasi catatan pada bab ini menyimpan daftar catatan — array berisi objek `{ id, judul, isi, createdAt }`. Pola penyimpanannya sebagai berikut:

File: storage/notesStorage.js (pola serialisasi)

```js
const daftarCatatan = [
  { id: '1', judul: 'Belanja mingguan', isi: 'Beras 5 kg, minyak 2 botol', createdAt: '2026-09-02T08:30:00.000Z' },
  { id: '2', judul: 'Ide tugas akhir', isi: 'Aplikasi presensi berbasis lokasi', createdAt: '2026-09-02T09:00:00.000Z' },
];

// Menyimpan: ubah array menjadi string JSON
const teks = JSON.stringify(daftarCatatan);
await AsyncStorage.setItem('catatan:v1', teks);

// Membaca: ubah string JSON kembali menjadi array
const tersimpan = await AsyncStorage.getItem('catatan:v1');
const daftarLagi = tersimpan === null ? [] : JSON.parse(tersimpan);
```

Penjelasan: `JSON.stringify(daftarCatatan)` menghasilkan satu string panjang berisi semua objek catatan, lalu string itu disimpan pada kunci `catatan:v1`. Saat dibaca kembali, `JSON.parse` mengembalikan array objek yang siap dipakai komponen. Perhatikan dua detail penting pada pola ini. Pertama, nama kunci diberi akhiran versi (`v1`) — praktik baik yang disebut **versi kunci** (key versioning): bila struktur data berubah pada versi aplikasi berikutnya, pengembang dapat membuat kunci baru (`catatan:v2`) sambil menyediakan logika migrasi dari versi lama. Kedua, nilai kembalian `getItem` bisa `null`, sehingga perlu nilai bawaan `[]` — inilah cikal bakal penanganan kegagalan yang dibahas berikut.

**Kegagalan parsing** adalah musuh utama pola di atas. `JSON.parse` melempar error `SyntaxError` bila teks yang diberikan bukan JSON yang sah — misalnya data yang tersimpan rusak, terpotong karena proses penyimpanan terhenti, atau berasal dari versi aplikasi lama dengan struktur berbeda. Tanpa penanganan, aplikasi akan crash saat dibuka. Pola aman yang selalu dipakai adalah membungkus parsing dengan `try/catch` (Bab 3) dan memvalidasi bentuk hasilnya:

File: storage/notesStorage.js (pola aman membaca)

```js
export async function muatCatatan() {
  try {
    const teks = await AsyncStorage.getItem('catatan:v1');
    if (teks === null) return [];
    const data = JSON.parse(teks);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn('Gagal membaca catatan:', error);
    return [];
  }
}
```

Penjelasan: tiga lapis pengamanan bekerja berurutan — (1) `null` dikembalikan sebagai `[]`; (2) `JSON.parse` yang melempar error ditangkap blok `catch`, dicatat lewat `console.warn` (alat debugging, lihat Bab 14), lalu fungsi mengembalikan `[]` sehingga aplikasi tetap berjalan; (3) hasil parsing dicek dengan `Array.isArray` karena data dengan bentuk tak terduga (misalnya tersimpan objek tunggal, bukan array) juga harus ditolak. Prinsipnya: **membaca data lokal tidak boleh pernah membuat aplikasi crash** — penyimpanan lokal adalah sumber yang tak selalu bisa dipercaya, dan aplikasi harus anggun (gracefully) menghadapi datanya sendiri yang rusak.

Satu detail lagi soal tanggal: pada entitas catatan, `createdAt` disimpan sebagai string ISO 8601, misalnya `"2026-09-02T08:30:00.000Z"` (dihasilkan `new Date().toISOString()`). Menyimpan tanggal sebagai string ISO aman untuk JSON (tidak perlu dikonversi tambahan) dan urutannya kronologis, sehingga mudah diurutkan. Pemformatan untuk tampilan — misalnya menjadi "02/09/2026 08:30" — dilakukan saat render dengan fungsi bantu, bukan saat penyimpanan; contohnya `formatTanggal` pada praktikum bab ini, yang memformat manual agar hasilnya konsisten di semua perangkat.

Terakhir, batasan yang perlu disadari: JSON dan AsyncStorage hanya tepat untuk data berbentuk teks dan berukuran kecil. Menyimpan foto sebagai string base64 akan menggelembungkan ukuran data ±33% dan cepat menghabiskan kapasitas; untuk media, gunakan sistem berkas (Bab 12). Pahami posisi AsyncStorage sebagai "lemari kecil", bukan gudang.

### 11.4 Caching Sederhana

**Cache** adalah salinan data yang disimpan di tempat yang lebih dekat dengan pemakainya agar bisa diakses lebih cepat atau tanpa sumber aslinya. Di aplikasi mobile, pola caching paling umum adalah menyimpan salinan jawaban API (Bab 10) ke penyimpanan lokal: saat aplikasi berhasil mengambil data dari server, salinannya disimpan; saat jaringan bermasalah, aplikasi menampilkan salinan itu alih-alih layar kosong atau pesan error.

Mengapa pola ini penting? Data dari server (katalog produk, jadwal, daftar mahasiswa) biasanya jarang berubah dalam hitungan menit. Mengambilnya lagi setiap kali aplikasi dibuka membuang kuota, memperlambat tampilan, dan membuat aplikasi tidak berguna di daerah tanpa sinyal. Cache memberi tiga keuntungan sekaligus: **ketersediaan** (aplikasi tetap berfungsi offline), **kecepatan** (data lokal langsung tampil), dan **penghematan kuota**. Trade-off-nya adalah **kesegaran** (freshness): data yang ditampilkan bisa saja bukan yang terbaru.

Cache paling sederhana terdiri dari tiga bagian: **snapshot** (salinan data), **timestamp** (waktu penyimpanan), dan **kebijakan kedaluwarsa** (expiry policy) — sering disebut **TTL** (time to live), yaitu batas umur cache sebelum dianggap basi (stale). Bentuk paketnya:

File: storage/apiCache.js (bentuk paket cache)

```js
const paket = {
  data: [...] ,             // snapshot jawaban API
  timestamp: '2026-09-02T08:30:00.000Z', // kapan disimpan
};
```

Alur kerjanya: saat `fetch` sukses, simpan paket baru. Saat `fetch` gagal (tidak ada jaringan, server error), baca paket tersimpan; bila belum melewati TTL, tampilkan dengan penanda "data tersimpan (offline)". Bila tidak ada cache atau sudah basi, baru tampilkan pesan error. Implementasi lengkapnya ada di bagian Contoh bab ini (Contoh 3). Dua keputusan desain yang perlu dipertimbangkan saat menerapkan cache:

1. **Berapa TTL yang tepat?** Data yang berubah cepat (harga saham) butuh TTL pendek atau tanpa cache; data yang stabil (daftar mata kuliah per semester) bisa bercache berjam-jam. Trade-off: TTL pendek membuat data segar tetapi sering gagal offline; TTL panjang membuat aplikasi andal offline tetapi berisiko menampilkan data basi.
2. **Apa yang tampil ke pengguna?** Aplikasi profesional tidak pernah diam-diam menampilkan data basi. Selalu beri penanda, misalnya spanduk kecil "Menampilkan data tersimpan (mode offline) — perbarui saat koneksi pulih", plus tombol untuk mencoba memuat ulang.

Ada satu larangan tegas terkait caching: **jangan pernah me-cache data yang sensitif.** Token autentikasi, data pribadi, atau informasi keuangan tidak boleh disimpan sebagai cache di AsyncStorage dengan alasan apa pun — lihat pembahasan keamanan pada subbab berikut.

### 11.5 Menyimpan Token (Pengantar)

Pada Bab 10.8 kita berkenalan dengan **token** — sepotong data yang diberikan server setelah login, berfungsi sebagai "kartu identitas" yang ditunjukkan aplikasi pada setiap permintaan API berikutnya. Karena token harus dikirim ulang setiap kali aplikasi memanggil API, wajar jika terpikir untuk menyimpannya di AsyncStorage agar pengguna tidak perlu login berulang kali. **Jangan lakukan itu** — dan bab ini harus menjelaskan alasannya sebelum Bab 13 membahas solusinya.

Masalahnya bukan pada mekanisme AsyncStorage itu sendiri, melainkan pada tingkat perlindungan datanya. Data di AsyncStorage **tidak dienkripsi**: nilai tersimpan sebagai teks polos di dalam sandbox aplikasi. Siapa pun atau apa pun yang berhasil menjalankan kode di dalam aplikasi — modul pihak ketiga, kode yang disisipkan lewat celah, atau aplikasi lain pada perangkat yang sudah di-root (Android) / jailbreak (iOS) — dapat membaca isinya. Token yang dicuri berarti penyerang dapat memanggil API seolah-olah pengguna: membaca data pribadi, atau melakukan aksi atas nama pengguna. Risiko ini tidak sebanding dengan kenyamanan "tidak perlu login ulang".

**Secure storage** adalah jawabannya: penyimpanan yang memanfaatkan fasilitas keamanan perangkat keras sistem operasi — **Keychain** di iOS dan **Android Keystore** di Android. Data di dalamnya dienkripsi dengan kunci yang disimpan di area perangkat keras yang terlindungi, sehingga jauh lebih sulit dibaca pihak lain. Di ekosistem Expo, pustakanya adalah `expo-secure-store`, dan kita akan mengimplementasikannya secara penuh di Bab 13 bersama alur login, penyimpanan token, dan logout. Pada bab ini cukup diingat dua prinsip:

1. **Pisahkan berdasarkan sensitivitas:** data biasa (preferensi, cache, catatan) → AsyncStorage; data rahasia (token, kata sandi, kunci API) → secure storage.
2. **Saat ragu, jangan simpan.** Data yang tidak pernah disimpan tidak bisa dicuri dari perangkat.

Ringkasnya, keputusan "menyimpan apa di mana" adalah keputusan keamanan, bukan sekadar teknis. Trade-off antara kenyamanan (otomatis login) dan keamanan (proteksi kredensial) harus selalu dimenangkan keamanan — Bab 13 akan menunjukkan bahwa keduanya bisa didapat sekaligus dengan memakai secure storage untuk token.

### 11.6 Project: Aplikasi Catatan

Seluruh konsep bab ini akan kita rakit menjadi satu aplikasi utuh: **Aplikasi Catatan** — aplikasi catatan teks sederhana dengan entitas `{ id, judul, isi, createdAt }` sesuai kontrak data buku ini. Fungsionalitasnya: menambah catatan, mengedit catatan, menghapus dengan konfirmasi, mencari catatan berdasarkan judul atau isi, dan — yang paling penting — seluruh data bertahan setelah aplikasi ditutup dan dibuka kembali.

Desain arsitekturnya menekankan satu praktik yang menjadi ciri aplikasi profesional: **memisahkan logika penyimpanan dari antarmuka**. Seluruh urusan AsyncStorage dan JSON dikurung di dalam satu modul `storage/notesStorage.js` yang berperan sebagai **API kecil** (small API) — serangkaian fungsi yang dipakai layar tanpa perlu tahu detail penyimpanan. Layar cukup memanggil `muatCatatan()`, `simpanCatatan(list)`, atau `hapusCatatan(id)`. Keuntungannya: (1) bila format data berubah, hanya satu file yang diubah; (2) logika penyimpanan bisa diuji terpisah (Bab 14); (3) layar tetap fokus pada tampilan dan interaksi. Pola ini analog dengan cara aplikasi memisahkan lapisan data dari lapisan UI pada proyek berskala lebih besar.

Struktur project yang akan dibangun:

```text
aplikasi-catatan/
├─ app/
│  ├─ _layout.js            (Navigator Stack — lihat Bab 7)
│  ├─ index.js              (Rute "/": daftar catatan)
│  └─ catatan/
│     ├─ buat.js            (Rute "/catatan/buat": form catatan baru)
│     └─ [id].js            (Rute "/catatan/[id]": form edit)
├─ storage/
│  └─ notesStorage.js       (API kecil penyimpanan catatan)
├─ screens/
│  ├─ DaftarCatatan.js      (Layar daftar + pencarian)
│  └─ FormCatatan.js        (Layar form tambah/edit)
└─ utils/
   └─ formatTanggal.js      (Pemformat tanggal tampilan)
```

Navigasi memakai **Expo Router** (file-based routing) yang sudah dipelajari di Bab 7; bab ini tidak mengulang konsepnya, hanya memakai polanya. Alur datanya mengikuti strategi **tulis-ulang seluruh daftar** (write-through): setiap perubahan (tambah, edit, hapus) membaca seluruh daftar dari penyimpanan, mengubah daftar di memori, lalu menyimpan kembali seluruhnya. Untuk data sekecil daftar catatan, strategi ini paling sederhana dan paling mudah dipahami pemula — trade-off-nya, pada data ribuan baris, menulis ulang seluruh daftar tidak efisien dan baru perlu diganti database (SQLite) atau penyimpanan per-baris. Identifier catatan dibuat dari `Date.now().toString()` — cukup untuk praktikum; pada produksi, pertimbangkan UUID agar tidak berbenturan (collision) bila dua catatan dibuat dalam milidetik yang sama.

Praktikum berikut memandu pembangunan aplikasi ini langkah demi langkah.

## Contoh

Tiga contoh berikut memakai API AsyncStorage untuk kebutuhan nyata yang berbeda: preferensi pengguna, keranjang belanja dari Bab 9, dan cache data API dari Bab 10. Contoh 1 dan 2 adalah berkas lengkap yang bisa langsung ditambahkan ke project; Contoh 3 adalah modul cache yang juga menjadi salah satu berkas kunci bab ini.

**Contoh 1 — Menyimpan dan membaca preferensi pengguna.** Kebanyakan aplikasi menyimpan pengaturan seperti nama pengguna dan pilihan tema. Karena bentuk datanya objek, wajib diserialisasi:

File: utils/preferensi.js

```js
import AsyncStorage from '@react-native-async-storage/async-storage';

const KUNCI_PREFERENSI = 'preferensi:pengguna';

export async function ambilPreferensi() {
  try {
    const teks = await AsyncStorage.getItem(KUNCI_PREFERENSI);
    if (teks === null) {
      return { nama: '', temaGelap: false };
    }
    return JSON.parse(teks);
  } catch (error) {
    console.warn('Gagal membaca preferensi:', error);
    return { nama: '', temaGelap: false };
  }
}

export async function simpanPreferensi(preferensi) {
  try {
    await AsyncStorage.setItem(KUNCI_PREFERENSI, JSON.stringify(preferensi));
  } catch (error) {
    console.warn('Gagal menyimpan preferensi:', error);
  }
}

// Pemakaian di dalam komponen (pola useEffect, lihat Bab 4):
// const [preferensi, setPreferensi] = useState({ nama: '', temaGelap: false });
// useEffect(() => { ambilPreferensi().then(setPreferensi); }, []);
// function gantiNama(nama) {
//   const baru = { ...preferensi, nama };
//   setPreferensi(baru);
//   simpanPreferensi(baru);
// }
```

Penjelasan: fungsi `ambilPreferensi` mengembalikan objek preferensi dengan nilai bawaan bila belum ada data — termasuk bila parsing gagal. Fungsi `simpanPreferensi` menerima objek utuh dan menulisnya sebagai string JSON. Pola pemakaiannya memanfaatkan `useEffect` untuk memuat data sekali saat komponen pertama kali dirender, lalu menyimpan kembali setiap kali pengguna mengubah pengaturan. Perhatikan bahwa `simpanPreferensi(baru)` dipanggil tanpa `await` — sengaja (fire-and-forget): antarmuka tidak perlu menunggu penyimpanan selesai karena tidak ada langkah berikutnya yang bergantung padanya; kegagalan penyimpanan tetap tertangkap `try/catch` dan dicatat.

**Contoh 2 — Menyimpan keranjang belanja dari Bab 9.** Pada Bab 9 keranjang belanja hidup sebagai state global memakai Context. Dengan AsyncStorage, isi keranjang — array objek produk `{ id, nama, harga }` — dapat dipertahankan lintas restart sehingga pengguna tidak kehilangan pilihannya:

File: utils/keranjangStorage.js

```js
import AsyncStorage from '@react-native-async-storage/async-storage';

const KUNCI_KERANJANG = 'keranjang:belanja';

export async function ambilKeranjang() {
  try {
    const teks = await AsyncStorage.getItem(KUNCI_KERANJANG);
    if (teks === null) return [];
    const data = JSON.parse(teks);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn('Gagal membaca keranjang:', error);
    return [];
  }
}

export async function simpanKeranjang(keranjang) {
  try {
    await AsyncStorage.setItem(KUNCI_KERANJANG, JSON.stringify(keranjang));
  } catch (error) {
    console.warn('Gagal menyimpan keranjang:', error);
  }
}

// Pemakaian pada komponen CartProvider (Bab 9):
// const [keranjang, setKeranjang] = useState([]);
// useEffect(() => { ambilKeranjang().then(setKeranjang); }, []);
// useEffect(() => { simpanKeranjang(keranjang); }, [keranjang]);
```

Penjelasan: pola "dua `useEffect`" ini elegan — yang pertama memuat keranjang dari penyimpanan saat aplikasi dibuka; yang kedua **menyimpan otomatis setiap kali state keranjang berubah** (karena `keranjang` didaftarkan sebagai dependensi efek). Perhatikan bahwa yang dipertahankan hanyalah isi keranjang; total harga tidak perlu disimpan karena selalu bisa dihitung ulang dari isi — prinsip **jangan menyimpan data yang bisa dihitung** (derived data), menghindari dua sumber kebenaran yang bisa saling tidak konsisten. Detail lengkap `CartProvider` tetap seperti di Bab 9; modul ini hanya menambah lapisan persistensinya.

**Contoh 3 — Cache data API dengan snapshot dan timestamp.** Contoh ini menggabungkan Bab 10 (fetch) dengan materi subbab 11.4. Modul `storage/apiCache.js` menyimpan paket `{ data, timestamp }`; modul pemakai (`utils/apiMahasiswa.js`) memutuskan kapan paket dipakai:

File: storage/apiCache.js

```js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Menyimpan snapshot data di bawah kunci "cache:<nama>"
export async function simpanCache(nama, data) {
  const paket = {
    data,
    timestamp: new Date().toISOString(),
  };
  try {
    await AsyncStorage.setItem(`cache:${nama}`, JSON.stringify(paket));
  } catch (error) {
    console.warn('Gagal menyimpan cache:', error);
  }
}

// Membaca paket cache; null bila belum pernah disimpan
export async function ambilCache(nama) {
  try {
    const teks = await AsyncStorage.getItem(`cache:${nama}`);
    if (teks === null) return null;
    return JSON.parse(teks);
  } catch (error) {
    console.warn('Gagal membaca cache:', error);
    return null;
  }
}

// Memeriksa apakah cache melewati batas umur (TTL)
export function cacheKadaluarsa(paket, batasMs) {
  if (!paket) return true;
  const umur = Date.now() - new Date(paket.timestamp).getTime();
  return umur > batasMs;
}
```

File: utils/apiMahasiswa.js

```js
import { simpanCache, ambilCache, cacheKadaluarsa } from '../storage/apiCache';

// Alamat backend buku (lihat Bab 10; ganti sesuai lingkungan, mis.
// alamat IP komputer bila memakai perangkat fisik) *⚠ version-sensitive*
const BASE_URL = 'http://10.0.2.2:3000/api';
const BATAS_CACHE_MS = 5 * 60 * 1000; // cache dianggap basi setelah 5 menit

export async function ambilDataMahasiswa() {
  try {
    const respons = await fetch(`${BASE_URL}/mahasiswa`);
    if (!respons.ok) throw new Error('Respons server tidak normal');
    const data = await respons.json();
    await simpanCache('mahasiswa', data); // simpan snapshot terbaru
    return { data, dariCache: false };
  } catch (error) {
    const paket = await ambilCache('mahasiswa');
    if (paket && !cacheKadaluarsa(paket, BATAS_CACHE_MS)) {
      return { data: paket.data, dariCache: true }; // fallback offline
    }
    throw error; // tidak ada koneksi dan tidak ada cache yang layak
  }
}
```

File: screens/DaftarMahasiswa.js (cuplikan pemakaian)

```jsx
const hasil = await ambilDataMahasiswa();
setData(hasil.data);
setDariCache(hasil.dariCache);
// pada area render:
{/* {dariCache && (
  <Text style={styles.penandaOffline}>
    Menampilkan data tersimpan (mode offline)
  </Text>
)} */}
```

Penjelasan: `simpanCache` dan `ambilCache` bersifat generik (nama cache menjadi bagian kunci), sehingga satu modul melayani banyak cache sekaligus — katalog, jadwal, daftar mahasiswa — masing-masing dengan kunci berbeda. `cacheKadaluarsa` membandingkan umur paket dengan batas TTL; paket tanpa timestamp atau dengan umur melebihi batas dianggap basi. Fungsi `ambilDataMahasiswa` menerapkan alur lengkap: sukses → simpan snapshot lalu kembalikan data segar; gagal → coba cache yang belum basi; semuanya gagal → error dilempar dan layar menampilkan pesan kegagalan (pola loading/error/empty state, lihat Bab 10). Cuplikan terakhir menunjukkan penanda "mode offline" yang wajib ditampilkan demi kejujuran data kepada pengguna.

## Praktikum

### Tujuan Praktikum

1. Menginstal dan memakai `@react-native-async-storage/async-storage` dalam project Expo.
2. Menerapkan pola modul penyimpanan terpisah (API kecil) dengan serialisasi JSON yang aman.
3. Membangun aplikasi catatan fungsional: tambah, edit, hapus dengan konfirmasi, dan pencarian.
4. Memverifikasi persistensi data lintas restart aplikasi.

### Kebutuhan

- Project Expo berbasis SDK 57 dengan Expo Router aktif (pola navigasi Bab 7).
- Node.js LTS minimal versi 22 (pengaturan awalnya di Bab 2).
- Expo Go di perangkat, atau emulator Android/iOS (Bab 2).
- Editor teks seperti VS Code.

### Persiapan

Dari terminal, buat project baru dengan template blank (JavaScript, sesuai kontrak buku ini):

```bash
npx create-expo-app aplikasi-catatan --template blank
cd aplikasi-catatan
npx expo install @react-native-async-storage/async-storage
```

Karena template blank tidak menyertakan Expo Router, aktifkan router mengikuti langkah resmi instalasi (detail konsepnya di Bab 7) *⚠ version-sensitive: periksa kembali docs.expo.dev/router/installation untuk SDK 57*:

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

Lalu dua penyesuaian: pada `package.json`, ubah nilai `"main"` menjadi `"expo-router/entry"`, dan pada `app.json` tambahkan properti `"scheme": "aplikasi-catatan"` di dalam objek `expo`. Hapus `App.js` yang tidak lagi dipakai. Contoh kode pada bab ini mengikuti pola yang didokumentasikan resmi untuk SDK 57; bila ada perbedaan dengan versi terbaru pustaka, dokumentasi resmi (docs.expo.dev) adalah sumber kebenaran.

### Langkah Kerja

1. **Siapkan struktur folder.** Buat folder `storage/`, `screens/`, `utils/`, dan `app/catatan/` di dalam project.
2. **Tulis `app/_layout.js`** — navigator Stack dengan tiga layar: daftar, form baru, dan form edit.
3. **Tulis `storage/notesStorage.js`** — API kecil penyimpanan: `muatCatatan`, `simpanCatatan`, `hapusCatatan`.
4. **Tulis `utils/formatTanggal.js`** — pemformat timestamp ISO menjadi teks "tanggal jam".
5. **Tulis `screens/DaftarCatatan.js`** — daftar catatan, kolom pencarian, tombol tambah, dan hapus dengan konfirmasi.
6. **Tulis `screens/FormCatatan.js`** — form tambah dan edit (satu komponen untuk dua mode).
7. **Tulis tiga rute:** `app/index.js`, `app/catatan/buat.js`, dan `app/catatan/[id].js` — masing-masing hanya merender komponen layar terkait.
8. **Jalankan dan uji** dengan `npx expo start`, lalu ikuti alur uji pada "Hasil yang Diharapkan".

### Kode

Mulai dari navigator. Ketiga layar didaftarkan dengan judul masing-masing:

File: app/_layout.js

```jsx
import { Stack } from 'expo-router';

export default function LayoutAplikasi() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Catatan Saya' }} />
      <Stack.Screen name="catatan/buat" options={{ title: 'Catatan Baru' }} />
      <Stack.Screen name="catatan/[id]" options={{ title: 'Edit Catatan' }} />
    </Stack>
  );
}
```

Penjelasan: `Stack` dari `expo-router` menyediakan navigasi bertumpuk (Bab 7) sekaligus menangani judul layar dan area aman (safe area), sehingga kita tidak perlu khawatir detail tersebut. Nama `name` harus cocok dengan nama berkas rute, termasuk tanda kurung pada rute dinamis `[id]`.

Berikutnya, jantung aplikasi: modul penyimpanan. Semua urusan AsyncStorage dan JSON berada di sini saja.

File: storage/notesStorage.js

```js
import AsyncStorage from '@react-native-async-storage/async-storage';

const KUNCI_CATATAN = 'catatan:v1';

// Membaca seluruh daftar catatan. Mengembalikan array (kosong jika belum ada).
export async function muatCatatan() {
  try {
    const teks = await AsyncStorage.getItem(KUNCI_CATATAN);
    if (teks === null) return [];
    const data = JSON.parse(teks);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn('Gagal membaca catatan:', error);
    return [];
  }
}

// Menyimpan seluruh daftar catatan (strategi tulis-ulang).
export async function simpanCatatan(daftarCatatan) {
  try {
    const teks = JSON.stringify(daftarCatatan);
    await AsyncStorage.setItem(KUNCI_CATATAN, teks);
  } catch (error) {
    console.warn('Gagal menyimpan catatan:', error);
  }
}

// Menghapus satu catatan berdasarkan id, lalu mengembalikan daftar terbaru.
export async function hapusCatatan(id) {
  const daftar = await muatCatatan();
  const tersaring = daftar.filter((catatan) => catatan.id !== id);
  await simpanCatatan(tersaring);
  return tersaring;
}
```

Penjelasan: `muatCatatan` menerapkan tiga lapis pengamanan dari subbab 11.3 — cek `null`, `try/catch` untuk parsing, dan `Array.isArray` untuk bentuk data — sehingga aplikasi tidak pernah crash karena data rusak. `simpanCatatan` menerima array utuh, menyerialisasinya, dan menuliskannya; memakai strategi tulis-ulang karena daftar catatan berukuran kecil. `hapusCatatan` memakai `filter` (Bab 3) untuk membuang elemen yang id-nya cocok, lalu menyimpan daftar tersaring; nilai kembaliannya (daftar terbaru) memudahkan layar memperbarui state seketika tanpa membaca ulang.

Fungsi bantu pemformat tanggal:

File: utils/formatTanggal.js

```js
export function formatTanggal(iso) {
  const tanggal = new Date(iso);
  const hari = String(tanggal.getDate()).padStart(2, '0');
  const bulan = String(tanggal.getMonth() + 1).padStart(2, '0');
  const tahun = tanggal.getFullYear();
  const jam = String(tanggal.getHours()).padStart(2, '0');
  const menit = String(tanggal.getMinutes()).padStart(2, '0');
  return `${hari}/${bulan}/${tahun} ${jam}:${menit}`;
}
```

Penjelasan: fungsi ini mengubah string ISO menjadi teks seperti `02/09/2026 08:30`. `new Date(iso)` mem-parsing string ISO, lalu tiap komponen diambil dan dirapikan dengan `padStart(2, '0')` agar bulan/menit satu digit tampil sebagai dua digit (`8` menjadi `08`). Pemformatan manual dipilih agar hasilnya konsisten dan dapat diprediksi di semua perangkat.

Layar daftar — layar utama aplikasi:

File: screens/DaftarCatatan.js

```jsx
import { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { muatCatatan, hapusCatatan } from '../storage/notesStorage';
import { formatTanggal } from '../utils/formatTanggal';

export default function DaftarCatatan() {
  const router = useRouter();
  const [daftar, setDaftar] = useState([]);
  const [kataKunci, setKataKunci] = useState('');

  useFocusEffect(
    useCallback(() => {
      muatCatatan().then(setDaftar);
    }, [])
  );

  const daftarTersaring = daftar.filter((catatan) => {
    const kunci = kataKunci.trim().toLowerCase();
    if (kunci === '') return true;
    return (
      catatan.judul.toLowerCase().includes(kunci) ||
      catatan.isi.toLowerCase().includes(kunci)
    );
  });

  const konfirmasiHapus = (catatan) => {
    Alert.alert('Hapus catatan', `Hapus "${catatan.judul}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          const hasil = await hapusCatatan(catatan.id);
          setDaftar(hasil);
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.kartu}>
      <Pressable
        style={styles.bagianEdit}
        onPress={() => router.push(`/catatan/${item.id}`)}
      >
        <Text style={styles.judulKartu}>{item.judul}</Text>
        <Text style={styles.isiKartu} numberOfLines={2}>{item.isi}</Text>
        <Text style={styles.tanggalKartu}>{formatTanggal(item.createdAt)}</Text>
      </Pressable>
      <Pressable style={styles.tombolHapus} onPress={() => konfirmasiHapus(item)}>
        <Text style={styles.teksTombolHapus}>Hapus</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.layar}>
      <TextInput
        style={styles.kolomCari}
        placeholder="Cari catatan…"
        value={kataKunci}
        onChangeText={setKataKunci}
      />
      <FlatList
        data={daftarTersaring}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.daftar}
        ListEmptyComponent={
          <Text style={styles.teksKosong}>
            {kataKunci.trim() === ''
              ? 'Belum ada catatan. Ketuk tombol di bawah untuk membuat.'
              : 'Tidak ada catatan yang cocok dengan pencarian.'}
          </Text>
        }
      />
      <Pressable
        style={styles.tombolTambah}
        onPress={() => router.push('/catatan/buat')}
      >
        <Text style={styles.teksTombolTambah}>+ Tambah Catatan</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#F5F6F8', padding: 16 },
  kolomCari: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  daftar: { paddingBottom: 80 },
  kartu: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  bagianEdit: { flex: 1, padding: 14 },
  judulKartu: { fontSize: 16, fontWeight: '700', color: '#1B1F27' },
  isiKartu: { fontSize: 14, color: '#5A6270', marginTop: 4 },
  tanggalKartu: { fontSize: 12, color: '#9AA0AA', marginTop: 8 },
  tombolHapus: {
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FDECEC',
  },
  teksTombolHapus: { color: '#C0392B', fontWeight: '600' },
  tombolTambah: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 20,
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  teksTombolTambah: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  teksKosong: { textAlign: 'center', color: '#9AA0AA', marginTop: 40 },
});
```

Penjelasan: `useFocusEffect` (dari `expo-router`) menjalankan pemuatan data setiap kali layar mendapatkan fokus kembali — bukan hanya saat pertama kali dirender. Inilah kunci korektif atas bug klasik yang akan dibahas pada Troubleshooting: saat kembali dari layar form, daftar otomatis dimuat ulang sehingga catatan baru langsung tampil. Pencarian bekerja dengan memfilter daftar menggunakan `includes` setelah kedua sisi disamakan huruf kecilnya (`toLowerCase`) dan spasi tepi dibuang (`trim`) — bandingkan dengan kasus pada Troubleshooting. Penghapusan selalu melalui `Alert.alert` agar tidak terjadi hapus tidak sengaja; `style: 'destructive'` memberi isyarat visual tombol berbahaya pada iOS. Tampilan memakai `FlatList` dan `Pressable` (Bab 5); tombol "Hapus" ditempatkan terpisah dari area tekan untuk membuka edit agar dua aksi tidak saling tumpang tindih.

Layar form — satu komponen untuk dua mode:

File: screens/FormCatatan.js

```jsx
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { muatCatatan, simpanCatatan } from '../storage/notesStorage';

export default function FormCatatan() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const idCatatan = typeof params.id === 'string' ? params.id : null;
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [memuat, setMemuat] = useState(idCatatan !== null);

  useEffect(() => {
    if (idCatatan === null) return;
    let aktif = true;
    (async () => {
      const daftar = await muatCatatan();
      const catatan = daftar.find((item) => item.id === idCatatan);
      if (aktif && catatan) {
        setJudul(catatan.judul);
        setIsi(catatan.isi);
      }
      if (aktif) setMemuat(false);
    })();
    return () => {
      aktif = false;
    };
  }, [idCatatan]);

  const simpan = async () => {
    const judulBersih = judul.trim();
    if (judulBersih === '') {
      Alert.alert('Judul wajib diisi', 'Beri judul sebelum menyimpan catatan.');
      return;
    }
    const daftar = await muatCatatan();
    const sekarang = new Date().toISOString();
    if (idCatatan === null) {
      const catatanBaru = {
        id: Date.now().toString(),
        judul: judulBersih,
        isi: isi.trim(),
        createdAt: sekarang,
      };
      await simpanCatatan([...daftar, catatanBaru]);
    } else {
      const daftarBaru = daftar.map((item) =>
        item.id === idCatatan
          ? { ...item, judul: judulBersih, isi: isi.trim() }
          : item
      );
      await simpanCatatan(daftarBaru);
    }
    router.back();
  };

  return (
    <ScrollView style={styles.layar} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <Text style={styles.label}>Judul</Text>
        <TextInput
          style={styles.kolomJudul}
          placeholder="Judul catatan"
          value={judul}
          onChangeText={setJudul}
        />
        <Text style={styles.label}>Isi</Text>
        <TextInput
          style={styles.kolomIsi}
          placeholder="Tulis isi catatan di sini…"
          value={isi}
          onChangeText={setIsi}
          multiline
          textAlignVertical="top"
        />
        <Pressable style={styles.tombolSimpan} onPress={simpan}>
          <Text style={styles.teksSimpan}>Simpan</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#F5F6F8' },
  form: { padding: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#1B1F27', marginBottom: 6 },
  kolomJudul: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  kolomIsi: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 180,
    marginBottom: 20,
  },
  tombolSimpan: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  teksSimpan: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
```

Penjelasan: `useLocalSearchParams` mengambil parameter rute (Bab 7); pada rute `/catatan/buat` tidak ada parameter sehingga `idCatatan` bernilai `null` (mode tambah), sedangkan pada `/catatan/[id]` parameter `id` ada (mode edit). Efek pemuatan memakai pola `let aktif = true` — penjaga yang memastikan pembaruan state hanya terjadi bila layar masih terpasang (mount); ini mencegah peringatan "set state pada komponen yang sudah tidak aktif" bila pengguna cepat menekan kembali. Fungsi `simpan` memvalidasi judul, lalu memuat daftar, menyisipkan catatan baru atau memperbarui catatan yang cocok dengan `map` (Bab 3), menyimpan, dan kembali ke daftar. `ScrollView` dengan `keyboardShouldPersistTaps="handled"` membuat ketukan pada tombol Simpan tetap berfungsi saat keyboard terbuka (topik keyboard ada di Bab 8).

Tiga berkas rute — masing-masing hanya meneruskan ke komponen layar:

File: app/index.js

```jsx
import DaftarCatatan from '../screens/DaftarCatatan';

export default function HalamanDaftar() {
  return <DaftarCatatan />;
}
```

File: app/catatan/buat.js

```jsx
import FormCatatan from '../../screens/FormCatatan';

export default function HalamanBuat() {
  return <FormCatatan />;
}
```

File: app/catatan/[id].js

```jsx
import FormCatatan from '../../screens/FormCatatan';

export default function HalamanEdit() {
  return <FormCatatan />;
}
```

Penjelasan: pola ini menunjukkan pemisahan yang bersih — rute (berkas di `app/`) hanya bertugas memetakan URL ke komponen, sedangkan logika ada di `screens/`. Dua rute berbeda memakai komponen `FormCatatan` yang sama; perbedaan mode ditentukan oleh ada-tidaknya parameter `id` yang diberikan Expo Router secara otomatis. Rute `[id]` mengikuti konvensi berkas dinamis Expo Router (Bab 7).

Semua berkas inti praktikum ini tersedia juga pada folder `kode/bab-11/` di repositori buku, identik dengan kode di atas, sehingga mahasiswa dapat membandingkan bila ragu saat mengetik ulang.

### Penjelasan Kode

Perhatikan **alur data** aplikasi ini secara keseluruhan, karena pola inilah yang akan dipakai lagi pada aplikasi-aplikasi berikutnya. Saat aplikasi dibuka, `DaftarCatatan` memuat seluruh daftar dari penyimpanan lewat `muatCatatan()` dan menyimpannya ke state `daftar`. State inilah satu-satunya "jendela" data untuk tampilan; `FlatList` sekadar menggambar isi state. Setiap perubahan (tambah, edit, hapus) mengikuti urutan yang sama: ubah data di penyimpanan dulu (melalui API kecil), lalu perbarui state agar tampilan ikut berubah. Urutan "simpan dulu, tampilkan kemudian" memastikan tampilan tidak pernah menampilkan data yang sebenarnya gagal disimpan.

Keputusan memuat data dengan `useFocusEffect` — bukan `useEffect` biasa — layak dipahami sebagai pola. `useEffect` dengan dependensi kosong hanya berjalan sekali saat komponen terpasang; karena layar daftar tetap terpasang saat layar form menimpa di atasnya (navigasi Stack, Bab 7), sekembalinya dari form efek tersebut tidak akan berjalan lagi, dan daftar tidak akan memuat catatan yang baru ditambahkan. `useFocusEffect` memicu ulang setiap kali layar menjadi fokus — persis perilaku yang diinginkan — dengan `useCallback` agar efek tidak dibuat ulang setiap render.

Modul `notesStorage.js` juga memperlihatkan pola **API kecil** yang konsisten: tiga fungsi dengan tanggung jawab tunggal, semuanya asinkron, semuanya aman dari kegagalan, dan tidak ada satu pun yang berurusan dengan tampilan. Bila besok struktur catatan berubah (misalnya menambah kolom `penting`), cukup edit modul ini dan mungkin versi kuncinya — layar tidak berubah. Inilah pembeda kualitas antara "aplikasi yang berjalan" dan "aplikasi yang terpelihara" (maintainable).

Terakhir, perhatikan identitas data: setiap catatan membawa `id` unik (dari `Date.now()`) dan `createdAt` (string ISO). `id` dipakai untuk operasi per-baris (hapus, edit) dan sebagai `keyExtractor` `FlatList` (Bab 4–5); `createdAt` dipakai untuk menampilkan waktu pembuatan. Dua `TextInput` pada form memakai pola controlled component dengan `value` dan `onChangeText` — persis pendekatan form dari Bab 8 yang tidak akan diulang di sini.

### Hasil yang Diharapkan

1. Aplikasi terbuka pada rute "/" menampilkan kolom pencarian dan pesan "Belum ada catatan. Ketuk tombol di bawah untuk membuat."
2. Mengetuk "+ Tambah Catatan" membuka form; mengisi judul dan isi lalu menekan Simpan kembali ke daftar dengan kartu catatan baru yang menampilkan judul, dua baris isi, dan waktu pembuatan.
3. Mengetuk kartu membuka form dengan judul dan isi terisi; mengubah lalu menyimpan memperbarui kartu di daftar.
4. Mengetuk "Hapus" memunculkan dialog konfirmasi; setelah dikonfirmasi kartu hilang dari daftar.
5. Mengetik kata di kolom pencarian memfilter daftar secara langsung; mencocokkan judul maupun isi, tidak peka huruf besar/kecil; menampilkan "Tidak ada catatan yang cocok dengan pencarian." bila tak ada yang cocok.
6. **Uji persistensi:** tutup aplikasi sepenuhnya (atau tekan "r" untuk reload di Metro, atau tutup Expo Go lalu buka lagi) — seluruh catatan tetap ada. Ini bukti data tersimpan di penyimpanan lokal, bukan di memory.
7. Reload aplikasi tidak pernah menampilkan layar error meskipun penyimpanan belum berisi data — lapisan pengaman `notesStorage` bekerja.

### Troubleshooting

**Masalah:** Setelah menambah catatan lalu kembali ke daftar, catatan baru tidak muncul, meskipun aplikasi tidak error.
**Penyebab:** Daftar hanya dimuat saat layar pertama kali dirender (`useEffect` sekali jalan); layar daftar tidak di-render ulang saat kembali dari layar form karena komponennya masih terpasang (navigasi Stack menimpa, bukan mengganti).
**Solusi:** Ganti pemuatan data menjadi `useFocusEffect` agar dimuat ulang setiap kali layar mendapatkan fokus, atau pindahkan pemuatan ke navigasi ulang; pada kode praktikum, `useFocusEffect` sudah dipakai.
**Pencegahan:** Sejak awal rancang "kapan data harus dimuat ulang" sebagai keputusan eksplisit — saat fokus, bukan hanya saat mount; pelajari siklus hidup navigasi di Bab 7.

**Masalah:** Catatan tersimpan tetapi tampil sebagai teks aneh, misalnya `[object Object]`, atau aplikasi error saat dibuka dengan pesan `JSON Parse error: Unexpected token`.
**Penyebab:** Nilai objek/array disimpan tanpa `JSON.stringify`, atau data lama dengan struktur berbeda dibaca dengan `JSON.parse` tanpa penanganan kegagalan.
**Solusi:** Pastikan penyimpanan selalu lewat modul `notesStorage` (yang menyerialisasi); jika sudah terlanjur menyimpan data korup, bersihkan data aplikasi (hapus install) atau naikkan versi kunci menjadi `catatan:v2` untuk memulai bersih.
**Pencegahan:** Jangan pernah memanggil `AsyncStorage.setItem` langsung dari layar dengan nilai non-string; selalu lewat modul pembungkus yang sudah mengurusi serialisasi dan `try/catch`.

**Masalah:** Aplikasi gagal dimulai dengan `Module not found: Can't resolve '@react-native-async-storage/async-storage'`.
**Penyebab:** Pustaka tidak terpasang atau terpasang dengan versi yang tidak cocok dengan SDK (misalnya dipasang lewat `npm install` dengan versi bebas, bukan `npx expo install`).
**Solusi:** Jalankan `npx expo install @react-native-async-storage/async-storage`, lalu jalankan kembali `npx expo start`; bila perlu bersihkan cache Metro dengan menekan `c` di terminal Metro atau `npx expo start --clear`.
**Pencegahan:** Selalu pasang pustaka berisi kode native dengan `npx expo install` agar versinya dicocokkan otomatis dengan SDK 57.

**Masalah:** Pencarian tidak menemukan catatan yang jelas-jelas ada, misalnya mencari "belanja" padahal judulnya "Belanja mingguan".
**Penyebab:** Perbandingan string bersifat peka huruf besar/kecil (case-sensitive); `"belanja"` tidak sama dengan `"Belanja"`, dan spasi tepi pada kata kunci ikut dibandingkan.
**Solusi:** Normalisasi kedua sisi perbandingan dengan `.toLowerCase()` (dan idealnya `.trim()` pada kata kunci) sebelum `includes`, seperti pada `daftarTersaring` di kode praktikum.
**Pencegahan:** Tentukan aturan "bagaimana pencarian memperlakukan huruf besar/kecil" sejak awal dan konsisten; normalisasi data di satu titik, bukan tersebar di banyak tempat.

**Masalah:** Data catatan "hilang" setelah beberapa saat, padahal tidak pernah dihapus.
**Penyebab:** Kemungkinan besar aplikasi di-uninstall, data aplikasi dibersihkan lewat pengaturan perangkat, atau (pada web) penyimpanan peramban dibersihkan — AsyncStorage berada di sandbox aplikasi dan ikut terhapus. Kasus lain: kode menyimpan ke kunci berbeda dari kunci yang dibaca (salah ketik nama kunci).
**Solusi:** Periksa konsistensi nama kunci — praktikum memakai satu konstanta `KUNCI_CATATAN` sehingga tidak mungkin salah ketik; verifikasi dengan `console.log` pada hasil `getItem` (alat debugging, Bab 14).
**Pencegahan:** Pusatkan seluruh akses penyimpanan pada satu modul dengan konstanta kunci, dan dokumentasikan bahwa data lokal tidak dijamin bertahan dari uninstall — untuk data bernilai tinggi, rancang cadangan (backup) atau sinkronisasi ke server (Bab 10).

## Studi Kasus

**Aplikasi Penjualan Lapangan yang Tetap Bekerja Tanpa Sinyal.** Sebuah perusahaan distribusi barang konsumsi menugaskan para tenaga penjualan (sales) mengunjungi toko-toko di kota dan kabupaten, termasuk daerah pegunungan yang jaringannya sering hilang. Awalnya mereka memakai aplikasi berbasis web yang harus selalu terhubung server; akibatnya, di daerah tanpa sinyal para sales tidak bisa melihat katalog produk maupun mencatat pesanan, dan harus menunggu kembali ke kota — kehilangan penjualan dan mengecewakan pemilik toko. Perusahaan memutuskan membangun ulang aplikasinya dengan pendekatan *offline-first*: aplikasi harus berfungsi penuh tanpa koneksi, lalu menyinkronkan data saat jaringan pulih.

Materi bab ini menjawab hampir seluruh kebutuhan teknis kasus tersebut. **Katalog produk** (daftar barang, harga, stok) adalah data yang jarang berubah — salinannya di-cache dengan pola snapshot + timestamp (subbab 11.4) saat aplikasi pertama kali tersambung, sehingga tampil instan dan tetap tersedia offline. **Pesanan baru** dicatat sebagai objek JSON (subbab 11.3) dan disimpan ke penyimpanan lokal (subbab 11.2) dalam antrean (queue) yang belum terkirim; aplikasi menampilkan status "menunggu sinkronisasi" per pesanan. Saat koneksi pulih, antrean dikirim ke server dengan `fetch` (Bab 10). **Identitas sales** dan token autentikasi disimpan di secure storage — bukan AsyncStorage (subbab 11.5) — karena token adalah kunci gerbang ke server perusahaan; pembahasannya di Bab 13.

Analisis atas kasus ini mengungkap tiga trade-off yang harus dikelola desainernya. Pertama, **ketersediaan vs konsistensi**: selama offline, aplikasi mengutamakan ketersediaan (pesanan tetap bisa dibuat), tetapi data lokal dan server bisa berbeda sementara; saat sinkronisasi, konflik muncul bila dua perangkat mengubah data yang sama — solusi umum adalah aturan "yang terakhir mengubah menang" (last-write-wins) memakai timestamp, atau meminta konfirmasi pengguna. Kedua, **kesegaran vs keandalan katalog**: TTL cache yang panjang membuat katalog andal offline tetapi berisiko menampilkan harga usang; aplikasi menanggulanginya dengan menampilkan penanda "data tersimpan" dan memperbarui setiap kali tersambung. Ketiga, **kenyamanan vs keamanan**: menyimpan token di AsyncStorage lebih mudah (subbab 11.5), tetapi risiko akun dibajak tidak sebanding; perusahaan wajib memakai secure storage. Belum lagi risiko terbesar pendekatan ini — kehilangan data saat aplikasi di-uninstall atau perangkat rusak — sehingga perusahaan membutuhkan strategi cadangan dan sinkronisasi sedini mungkin.

Kasus ini juga mengingatkan bahwa keputusan penyimpanan adalah keputusan desain produk, bukan sekadar pemilihan pustaka. Pendekatan yang sama — data lokal agar aplikasi tetap berguna saat koneksi bermasalah — akan dipakai pula pada Project Akhir buku ini, Sistem Informasi Akademik Mobile, misalnya agar daftar mata kuliah dan jadwal mahasiswa tetap terbaca sekalipun jaringan kampus sedang tidak stabil.

## Latihan

### Soal Pemahaman

1. Jelaskan perbedaan mendasar antara data pada state React dan data pada penyimpanan lokal ditinjau dari siklus hidup proses aplikasi.
2. Mengapa seluruh metode AsyncStorage bersifat asinkron, dan apa akibatnya bila pengembang lupa menulis `await`?
3. Apa nilai kembalian `getItem` untuk kunci yang belum pernah disimpan? Mengapa pemeriksaan `null` lebih tepat daripada perbandingan dengan `''`?
4. Apa fungsi `multiGet`, dan apa bentuk data yang dikembalikannya?
5. Jelaskan dua lapis penanganan yang dilakukan `muatCatatan()` ketika string JSON yang dibaca tidak dapat di-parsing atau bentuknya bukan array.
6. Mengapa token autentikasi tidak boleh disimpan di AsyncStorage, dan ke mana sebaiknya token disimpan?

### Soal Praktik

1. Tambahkan fitur **penghitung catatan yang persisten**: simpan satu kunci `statistik:jumlah` yang bertambah setiap kali catatan baru dibuat, dan tampilkan jumlahnya pada layar daftar. Tulis fungsi penyimpanan dan pemakaiannya.
2. Tambahkan kolom `penting` (boolean) pada entitas catatan. Ubah format penyimpanan dengan **versi kunci** `catatan:v2`, sediakan tombol "★" per kartu untuk menandai catatan penting, dan pastikan daftar catatan lama tetap terbaca tanpa error (perhatikan lapisan pengaman pada `muatCatatan`).
3. Ubah pengurutan daftar: catatan dengan `createdAt` terbaru tampil paling atas. Gunakan `sort` (Bab 3) yang membandingkan dua string ISO, lalu simpan pilihan urutan (terbaru/terlama) sebagai preferensi pengguna.

### Soal Analisis

1. Bandingkan tiga opsi penyimpanan lokal di ekosistem React Native/Expo — AsyncStorage, SQLite, dan expo-file-system — untuk tiga skenario: (a) daftar 100 kontak sederhana, (b) 50 foto produk, (c) 10.000 baris transaksi yang harus dicari berdasarkan rentang tanggal. Untuk tiap skenario, berikan justifikasi pilihan Anda beserta kelemahan opsi yang tidak dipilih.
2. Rancang strategi cache untuk data "kalender akademik" yang diperbarui server setiap semester. Tentukan apa yang disimpan, berapa TTL yang masuk akal, apa yang tampil ke pengguna saat offline, dan apa yang terjadi saat TTL habis dalam keadaan offline.

## Tantangan

1. **Fitur arsip:** ubah perilaku hapus — catatan yang "dihapus" dipindahkan ke koleksi `arsip` (struktur data dua daftar) dan dapat dipulihkan kembali ke daftar utama. Rancang versi kunci baru (`catatan:v3`) untuk dua koleksi tersebut.
2. **Sinkronisasi sederhana:** bila koneksi tersedia (uji dengan `fetch` ke backend buku, Bab 10), kirim seluruh catatan ke endpoint yang disediakan dan tandai catatan yang sudah tersinkron; saat offline, tampilkan indikator "belum tersinkron" pada kartu. Pikirkan apa yang terjadi bila server menolak — bagaimana aplikasi menjaga antrean tetap utuh.
3. **Statistik penggunaan:** simpan waktu setiap aplikasi dibuka (gunakan `useFocusEffect` pada layar pertama) dan tampilkan "terakhir dibuka" pada daftar — perhatikan bahwa menulis penyimpanan setiap fokus bisa memboroskan operasi I/O; rancang kapan waktu penyimpanan yang wajar.

## Rangkuman

1. State React hidup di memori yang volatil; data yang harus bertahan melintasi restart aplikasi ditempatkan di penyimpanan lokal.
2. Tiga pilihan penyimpanan lokal utama di ekosistem Expo: AsyncStorage (kunci–nilai), SQLite (relasional), dan expo-file-system (berkas); pilih yang paling sederhana namun memadai.
3. AsyncStorage bersifat asinkron, berbentuk pasangan kunci–nilai, hanya menerima string, persisten lintas restart, dan tidak terenkripsi.
4. Pasangan metode inti: `setItem`/`getItem` untuk simpan/baca, `removeItem` untuk hapus, `multiGet`/`multiSet` untuk operasi banyak kunci, `getAllKeys` dan `clear` untuk pengelolaan menyeluruh.
5. Nilai non-string wajib diserialisasi dengan `JSON.stringify` saat menyimpan dan di-deserialisasi dengan `JSON.parse` saat membaca.
6. Pembacaan data lokal harus aman dari kegagalan: tangani `null`, bungkus parsing dengan `try/catch`, dan validasi bentuk data dengan `Array.isArray` agar aplikasi tidak pernah crash karena data rusak.
7. Cache sederhana terdiri dari snapshot data, timestamp penyimpanan, dan aturan TTL; tampilkan penanda saat data yang ditampilkan berasal dari cache.
8. Token dan data sensitif lain tidak boleh disimpan di AsyncStorage karena tidak terenkripsi; gunakan secure storage (Keychain/Android Keystore) yang dibahas di Bab 13.
9. Pisahkan logika penyimpanan dari antarmuka dalam satu modul (API kecil) agar aplikasi mudah dipelihara dan diuji.
10. Strategi tulis-ulang seluruh daftar cocok untuk data kecil; untuk data besar, gunakan penyimpanan per-baris atau database.

## Refleksi

1. Pernahkah Anda kehilangan data — draf, pengaturan, atau progres — karena aplikasi tertutup atau perangkat di-restart? Bagaimana perasaan Anda sebagai pengguna, dan apa artinya bagi Anda sebagai pengembang?
2. Dalam aplikasi yang Anda pakai sehari-hari, fitur apa saja yang menurut Anda memanfaatkan penyimpanan lokal dan cache? Bagaimana Anda bisa membuktikannya dari perilaku aplikasi (misalnya fitur yang tetap berfungsi saat pesawat mode)?
3. Ketika merancang aplikasi sendiri, bagaimana Anda memutuskan apakah suatu data layak disimpan lokal, dan seberapa sering data itu harus diperbarui?
4. "Mudah diimplementasikan" sering menggoda pengembang — seperti menyimpan token di AsyncStorage. Bagaimana Anda akan membiasakan diri mempertimbangkan keamanan sejak awal, bukan setelah aplikasi dipakai?

## Evaluasi Bab

### Pilihan Ganda

1. Pernyataan yang **benar** tentang AsyncStorage adalah …
   A. Nilai yang disimpan harus bertipe string.
   B. Operasi penyimpanannya bersifat sinkron dan memblokir antarmuka.
   C. Data yang disimpannya otomatis terenkripsi.
   D. Pustaka ini hanya tersedia untuk platform Android.

2. `AsyncStorage.getItem('kunciYangBelumAda')` akan mengembalikan …
   A. String kosong `''`.
   B. `null`.
   C. `undefined`.
   D. Error yang di-lempar langsung.

3. Jika sebuah objek `{ nama: 'Budi' }` dikirim langsung ke `setItem` tanpa serialisasi, nilai yang tersimpan adalah …
   A. `{ nama: 'Budi' }` (objek utuh).
   B. `"[object Object]"`.
   C. Error bertipe data.
   D. `null`.

4. Metode yang tepat untuk menghapus satu kunci beserta nilainya adalah …
   A. `removeItem(kunci)`.
   B. `clear()`.
   C. `deleteItem(kunci)`.
   D. `setItem(kunci, '')`.

5. `AsyncStorage.multiGet(['a', 'b'])` mengembalikan …
   A. Dua string nilai.
   B. Array berisi pasangan `[kunci, nilai]` untuk tiap kunci.
   C. Satu string berisi kedua nilai yang digabung.
   D. Objek dengan properti `a` dan `b`.

6. Alasan utama token autentikasi tidak boleh disimpan di AsyncStorage adalah …
   A. Nilainya disimpan tanpa enkripsi sehingga mudah dibaca pihak yang menjalankan kode di perangkat.
   B. AsyncStorage hanya mampu menyimpan 1 kilobyte data.
   C. Token tidak dapat dikonversi menjadi string JSON.
   D. `getItem` tidak dapat membaca nilai token.

7. Peran TTL (time to live) pada pola caching adalah …
   A. Menentukan jumlah data maksimum yang boleh di-cache.
   B. Mengatur lama waktu tunggu permintaan ke server.
   C. Menentukan batas umur cache sebelum dianggap basi.
   D. Menentukan ukuran maksimum satu entri cache.

8. Keuntungan utama memisahkan logika penyimpanan ke modul seperti `notesStorage.js` adalah …
   A. Kode aplikasi menjadi lebih panjang dan lengkap.
   B. Perubahan format data cukup di satu tempat, dan layar tidak bergantung pada detail penyimpanan.
   C. AsyncStorage tidak perlu diimpor lagi di project.
   D. Data otomatis terenkripsi.

9. Cara aman menangani `JSON.parse` yang gagal karena data rusak adalah …
   A. Membiarkan error muncul agar pengembang segera tahu.
   B. Menampilkan teks error mentah kepada pengguna.
   C. Menghapus penyimpanan aplikasi secara otomatis.
   D. Menangkap error dengan `try/catch` dan mengembalikan nilai bawaan.

10. Data pada AsyncStorage ikut terhapus permanen ketika …
    A. Aplikasi ditutup pengguna.
    B. Perangkat dimatikan.
    C. Aplikasi di-uninstall atau datanya dibersihkan pengguna.
    D. Aplikasi dimuat ulang (reload).

### Soal Uraian

1. Jelaskan langkah-langkah menyimpan daftar catatan (array objek) ke AsyncStorage beserta dua skenario kegagalan yang ditangani fungsi `muatCatatan()`, dan bagaimana setiap skenario ditangani.
2. Rancang pola cache untuk data jadwal kuliah yang diperbarui server setiap awal semester: apa yang disimpan, berapa TTL yang Anda pilih beserta alasannya, apa yang ditampilkan ke pengguna saat offline, dan apa yang terjadi bila TTL habis dalam keadaan offline.
3. Sebutkan tiga alasan mengapa AsyncStorage dianggap kurang aman untuk menyimpan token, lalu jelaskan karakteristik secure storage (Keychain/Android Keystore) yang menjadi solusinya — tanpa menulis kode.

### Kunci Jawaban

<details>
<summary>Klik untuk membuka kunci jawaban</summary>

Pilihan Ganda: 1-A, 2-B, 3-B, 4-A, 5-B, 6-A, 7-C, 8-B, 9-D, 10-C.

Catatan: jawaban soal uraian dinilai dosen berdasarkan kelengkapan konsep — lapisan pengaman membaca data (null, try/catch, validasi bentuk) pada soal 1; komponen cache (snapshot, timestamp, TTL), penanda offline, dan perilaku saat TTL habis pada soal 2; serta tiga alasan keamanan (tidak terenkripsi, mudah dibaca kode dalam aplikasi, rentan pada perangkat di-root) dan ciri secure storage (enkripsi berbasis perangkat keras, Keychain/Keystore) pada soal 3.

</details>