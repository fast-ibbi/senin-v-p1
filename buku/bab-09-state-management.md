# BAB 9 — State Management

## Deskripsi Singkat

Bab ini membahas cara mengelola **state** (keadaan) aplikasi ketika data harus dipakai bersama oleh banyak komponen, bahkan lintas layar. Anda akan mempelajari perbedaan **state lokal** dan **state global**, teknik **lifting state up** (menaikkan state ke komponen induk), **Context API**, serta **custom hooks**. Materi ditutup dengan praktikum membangun keranjang belanja (shopping cart) yang memakai global state, dan pengantar pustaka state management modern (Zustand dan Redux Toolkit) yang hanya dibahas secara konseptual. Bab ini bertumpu pada `useState` dan konsep props dari Bab 4, serta menjadi fondasi untuk Bab 10 (data dari server), Bab 11 (penyimpanan lokal), dan Bab 13 (sesi pengguna).

## Tujuan Pembelajaran

Setelah mempelajari bab ini, mahasiswa diharapkan mampu:

1. Menjelaskan perbedaan state lokal dan state global beserta kelebihan serta keterbatasan masing-masing.
2. Mengidentifikasi kondisi yang membutuhkan lifting state up dan Context API.
3. Mengimplementasikan Context API (`createContext`, `Provider`, `useContext`) dengan JavaScript polos di aplikasi React Native.
4. Merancang custom hooks untuk membungkus logika state, misalnya `useCart`.
5. Menganalisis kapan suatu data sebaiknya dijadikan global state dan kapan tidak.
6. Mengevaluasi keunggulan dan keterbatasan Context API dibandingkan pustaka state management modern (Zustand, Redux Toolkit).

## Peta Konsep

```text
┌────────────────────────── STATE MANAGEMENT ──────────────────────────┐
│                                                                      │
│  State lokal          Lifting state up           Global state        │
│  (useState,           (state naik via props,     (Context API:       │
│   satu komponen)       induk terdekat)            createContext →    │
│        │                     │                   Provider →          │
│        └─────────┬───────────┘                   useContext)         │
│                  ▼                                                   │
│    Butuh dibagikan? ──ya──► Banyak layar/komponen berjauhan?         │
│                  │                    │                              │
│                  ▼                    ▼                              │
│             Tetap lokal     Custom hook (useCart): bungkus           │
│                             logika + context                         │
│                                             │                        │
│                                             ▼                        │
│                              Skala besar? Library: Zustand,          │
│                              Redux Toolkit (tinjauan konseptual)     │
└──────────────────────────────────────────────────────────────────────┘
```

## Materi

### 9.1 Local State vs Global State

Anda telah mengenal **state** di Bab 4 sebagai data yang berubah seiring interaksi pengguna dan memengaruhi tampilan komponen. Pada bab ini kita membedakan state berdasarkan **cakupan pemakaiannya**: siapa saja yang perlu membaca dan mengubah data tersebut.

**Local state** (state lokal) adalah state yang hidup di dalam satu komponen dan tidak dibutuhkan komponen lain. Contoh sederhana: teks yang sedang diketik di dalam `TextInput` pencarian, status buka/tutup sebuah panel, atau pilihan ukuran pada satu tombol. State lokal ditulis persis seperti yang Anda pelajari di Bab 4 — `const [teks, setTeks] = useState('')` — dan nilainya hanya dikenal oleh komponen tempat ia dideklarasikan beserta anak-anaknya.

**Global state** (state global) adalah state yang harus dapat diakses oleh banyak komponen di berbagai cabang pohon komponen, biasanya lintas layar. Contoh klasik: isi keranjang belanja yang tampil di layar daftar produk (sebagai badge jumlah item), di layar keranjang (sebagai daftar), dan nantinya di layar pembayaran. Bila setiap layar menyimpan salinan keranjangnya sendiri, kedua layar dapat menampilkan data yang berbeda — inilah sumber bug yang paling sering muncul pada aplikasi yang baru mulai berkembang.

Mengapa perlu dua kategori ini? Alasan utamanya adalah **trade-off** (pertukaran) antara kesederhanaan dan jangkauan. State lokal sederhana, mudah ditelusuri, dan perubahan di dalamnya hanya memicu render ulang (re-render) satu komponen; tetapi ia tidak dapat dibagikan. State global dapat dibagikan ke mana saja, tetapi membawa biaya: kode lebih sulit dilacak (siapa yang mengubah data tidak selalu jelas), perubahan nilai memicu render ulang semua komponen yang membacanya, dan komponen menjadi bergantung pada lingkungan di sekitarnya. Analogi sederhana: state lokal seperti catatan kecil di meja kerja sendiri, sedangkan state global seperti papan pengumuman kantor — lebih banyak orang terbantu, tetapi isinya harus dijaga agar tetap relevan dan siapa pun yang menulis di sana harus disiplin.

Prinsip yang dianut ekosistem React adalah **memulai dari yang paling lokal**: simpan state sedekat mungkin dengan komponen yang memakainya, lalu "naikkan" hanya jika ada komponen lain yang benar-benar membutuhkan. Subbab berikut menjelaskan bagaimana cara menaikkannya.

### 9.2 Lifting State Up

**Lifting state up** (menaikkan state) adalah teknik memindahkan state dari sebuah komponen anak ke komponen induk terdekat yang menjadi "nenek moyang bersama" dari semua komponen yang membutuhkan data tersebut. State dipegang oleh induk, diturunkan kepada anak-anak melalui **props**, dan setiap perubahan dikirim kembali ke induk melalui fungsi **callback** (fungsi yang dipanggil balik oleh anak saat terjadi peristiwa).

Perhatikan alur berikut pada aplikasi pemesanan minuman: layar `LayarPesan` memiliki dua komponen anak — `PilihUkuran` yang menampilkan tombol ukuran S/M/L, dan `RingkasanPesanan` yang menampilkan harga berdasarkan ukuran terpilih.

```text
LayarPesan (induk — state ukuran disimpan di sini)
   │  props: ukuran + onPilihUkuran
   ▼
PilihUkuran ──panggil onPilihUkuran("L")──► LayarPesan (setUkuran)
RingkasanPesanan ◄──props: ukuran──  harga dihitung dari props
```

Bila state ukuran disimpan di dalam `PilihUkuran`, `RingkasanPesanan` tidak akan pernah tahu ukuran yang dipilih. Dengan menaikkannya ke `LayarPesan`, kedua anak membaca sumber data yang sama — inilah yang disebut **single source of truth** (sumber kebenaran tunggal): satu penyimpanan data, banyak pembaca, sehingga data tidak mungkin tidak sinkron.

Mengapa teknik ini ada? Karena aliran data pada React bersifat satu arah (one-way data flow): dari induk ke anak melalui props. Untuk membuat data "naik", React menawarkan pola callback; lifting state up adalah penerapan paling sederhana dari pola tersebut dan cukup untuk kebutuhan dua hingga tiga tingkat komponen. Contoh lengkapnya dapat Anda lihat pada bagian Contoh bab ini.

Lifting state up memiliki keterbatasan jelas: bila data harus diteruskan melalui banyak tingkat komponen yang perantaranya sama sekali tidak memakai data tersebut, props harus "dioper" berantai — pola ini disebut **prop drilling** (pengeboran prop). Kode menjadi berisik dan sulit dipelihara: menambah satu data baru berarti mengubah deretan komponen perantara. Pada kondisi itulah kita beralih ke mekanisme yang dibahas berikutnya.

### 9.3 Context API

**Context API** adalah mekanisme bawaan React untuk membagikan data ke seluruh cabang pohon komponen tanpa menurunkannya satu per satu melalui props. Ia menjawab masalah prop drilling dengan memberikan "jalur langsung" dari penyedia data ke setiap komponen yang membutuhkannya.

Context API bekerja melalui tiga bagian yang saling berkaitan:

1. **createContext** — membuat objek context beserta nilai awalnya. Nilai awal berguna sebagai petunjuk: bila kita mengisinya `null`, komponen di luar penyedia dapat dengan mudah mendeteksi bahwa context belum tersedia.
2. **Provider** — komponen yang "menyediakan" nilai context untuk seluruh subtree (cabang pohon komponen) di bawahnya. Nilai diberikan melalui prop `value`.
3. **useContext** — hook yang dipakai komponen mana pun di dalam subtree untuk membaca nilai tersebut.

Perhatikan pola dasar berikut:

```js
File: context/BahasaContext.js

import { createContext, useContext, useState } from 'react';

export const BahasaContext = createContext(null);

export function BahasaProvider({ children }) {
  const [bahasa, setBahasa] = useState('id');
  return (
    <BahasaContext.Provider value={{ bahasa, setBahasa }}>
      {children}
    </BahasaContext.Provider>
  );
}
```

Penjelasan: `createContext(null)` membuat wadah data bernama `BahasaContext`. Komponen `BahasaProvider` memegang state `bahasa` dan memasoknya melalui `value={{ bahasa, setBahasa }}`; seluruh anak (`children`) — berapa pun kedalamannya — dapat membaca nilai tersebut dengan `useContext(BahasaContext)` tanpa menerima props tambahan. Perhatikan bahwa state tetap dideklarasikan normal dengan `useState`; context hanya mengubah **cara distribusi**, bukan cara penyimpanannya.

Kapan Context API diperlukan? Secara umum, ketika (1) data dipakai banyak komponen yang berjauhan di pohon komponen, (2) data berubah lintas layar, dan (3) prop drilling sudah terasa menyakitkan — misalnya tema tampilan (mode terang/gelap), bahasa antarmuka, profil pengguna yang sudah masuk (lihat Bab 13), atau keranjang belanja. Sebaliknya, Context API sebaiknya dihindari untuk data yang hanya dipakai satu-dua komponen bertetangga; menyimpan data ke context terlalu dini membuat komponen sulit dipakai ulang karena nilainya "tersembunyi" di lingkungan, bukan lewat props yang eksplisit. Trade-off inilah yang harus selalu dipertimbangkan: props eksplisit lebih mudah dibaca, sedangkan context lebih praktis untuk data yang benar-benar lintas wilayah.

Satu catatan perilaku penting: ketika nilai context berubah, **semua** komponen yang memanggil `useContext` pada context tersebut akan ikut di-render ulang, tanpa pandang bulu. Untuk data yang jarang berubah (tema, bahasa) ini tidak masalah; untuk data yang sangat sering berubah dengan konsumen sangat banyak, aplikasi besar biasanya memecah provider menjadi beberapa context kecil atau beralih ke pustaka yang dibahas di subbab 9.6.

### 9.4 Custom Hooks

**Custom hook** (kait buatan sendiri) adalah fungsi JavaScript biasa yang namanya diawali kata `use`, memanggil satu atau lebih hook bawaan di dalamnya, dan mengembalikan data serta fungsi yang dibutuhkan pemakainya. Ia bukan fitur baru React melainkan pola organisasi kode: logika yang memakai state dibungkus dalam satu fungsi sehingga dapat dipakai ulang dari banyak komponen dan dibaca seperti hook biasa.

Aturannya sama dengan aturan hook pada umumnya (lihat Bab 4 §4.8): nama harus diawali `use`, hook bawaan hanya boleh dipanggil di tingkat atas fungsi, dan pemakaiannya tidak boleh berada di dalam percabangan atau perulangan. Dengan mematuhi aturan ini, React dapat melacak urutan pemanggilan hook dengan benar.

Contoh custom hook yang paling kecil:

```js
File: hooks/useTampilSembunyi.js

import { useState } from 'react';

export function useTampilSembunyi(awal = false) {
  const [tampil, setTampil] = useState(awal);
  const ubah = () => setTampil((n) => !n);
  return { tampil, ubah };
}
```

Penjelasan: hook `useTampilSembunyi` membungkus sebuah state boolean beserta fungsi pengubahnya. Komponen pemakai cukup menulis `const { tampil, ubah } = useTampilSembunyi()` — ia tidak perlu tahu bahwa di baliknya ada `useState` dan logika toggle. Manfaatnya tiga kali lipat: (1) komponen menjadi lebih pendek dan fokus pada tampilan, (2) logika dapat dipakai ulang di banyak komponen tanpa menyalin kode, dan (3) logika yang terisolasi lebih mudah diuji (prinsip yang akan Anda gunakan di Bab 14).

Pada buku ini, custom hook berperan sebagai **jembatan** antara komponen dan Context API. Alih-alih setiap komponen memanggil `useContext(CartContext)` sendiri, kita menyediakan satu hook `useCart()` yang membungkus akses tersebut sekaligus memberikan pesan kesalahan yang jelas bila hook dipakai di luar provider. Komponen pun tidak perlu tahu nama context, cukup memanggil `useCart()`. Pola inilah yang dipakai seluruh praktikum bab ini, dan pola yang sama akan Anda temui kembali pada bab-bab berikutnya (misalnya akses sesi pengguna di Bab 13).

### 9.5 Kapan Menggunakan Global State

Pertanyaan paling praktis setelah memahami semua teknik di atas: kapan sebuah data layak menjadi global state? Gunakan tiga pengujian berikut secara berurutan.

**Pengujian pertama: berapa banyak pemakai?** Jika data hanya dipakai oleh satu komponen, biarkan ia menjadi state lokal. Jika dipakai beberapa komponen yang berdekatan di pohon komponen, coba lifting state up lebih dulu — kebutuhan context biasanya dimulai setelah data harus melewati komponen perantara yang tidak memakainya.

**Pengujian kedua: apakah data dipakai lintas layar atau berubah di satu layar tetapi dibaca di layar lain?** Keranjang belanja adalah contoh sempurna: pengguna menambah item di layar daftar produk, lalu membaca hasilnya di layar keranjang. Kedua layar bukan saudara dalam satu induk — induk bersama mereka adalah layout akar aplikasi. Menaikkan state ke layout akar lewat props berarti setiap layar harus menerima dan meneruskan props yang sama; di sinilah Context API menjadi pilihan yang wajar.

**Pengujian ketiga: apakah banyak komponen menulis data yang sama?** Jika dua layar sama-sama mengubah (bukan sekadar membaca) satu data, menyimpannya di satu tempat (sumber kebenaran tunggal) mencegah dua salinan yang saling bertabrakan.

Sebaliknya, ada beberapa situasi yang justru menandakan global state **tidak** diperlukan, dan ini sama pentingnya untuk dikenali. Pertama, data yang dapat **dihitung ulang** dari data lain (nilai turunan atau **derived state**) — total harga keranjang tidak perlu disimpan sebagai state karena selalu dapat dihitung dari daftar item; menyimpannya sebagai state terpisah hanya membuka peluang tidak sinkron. Kedua, data milik **server** (server state), seperti daftar mahasiswa yang diambil dari API; data semacam itu sebaiknya diambil dan di-cache oleh satu lapisan khusus (akan dibahas di Bab 10 dan 11), bukan disalin mentah ke global state setiap layar. Ketiga, data sementara yang hanya hidup selama satu layar terbuka (misalnya isi formulir sebelum disimpan — lihat Bab 8), yang cukup menjadi state lokal.

Hierarki keputusan yang disarankan: **state lokal → lifting state up → Context API → pustaka state management**, dengan berhenti di tingkat paling sederhana yang masih memenuhi kebutuhan. Disiplin ini menjaga aplikasi tetap mudah dipahami; menaruh semua data ke global state sejak awal sama saja dengan membuat "papan pengumuman" penuh tempelan yang tidak ada yang mau membaca.

### 9.6 Pengantar Library State Management Modern

Context API menyelesaikan masalah distribusi data, tetapi untuk aplikasi berskala besar — banyak modul, banyak layar, tim pengembang besar — muncul kebutuhan tambahan: melacak dengan mudah siapa mengubah state dan kapan (devtools), membatasi render ulang hanya pada komponen yang benar-benar memakai sebagian data (selector), memisahkan logika bisnis dari komponen agar dapat diuji berdiri sendiri, serta mempersistensikan state. Dari kebutuhan inilah lahir pustaka state management modern. Dua yang paling populer saat ini adalah **Zustand** dan **Redux Toolkit**. Keduanya **tidak dipakai pada buku ini** — Context API plus custom hooks sudah memadai untuk skala project kuliah Anda — tetapi memahami konsep dan trade-off-nya penting agar Anda tahu kapan harus berpindah.

**Zustand** (nama dari bahasa Jerman, artinya "keadaan") menawarkan store (gudang state) global yang dibuat dengan fungsi `create`. Store diakses lewat hook, dan konsumen dapat memilih hanya bagian data yang dibutuhkannya. Karakteristik utamanya: kode sangat ringkas, tidak wajib membungkus aplikasi dengan provider, dan target audiensnya aplikasi yang menginginkan state global tanpa banyak aturan. Ilustrasi konseptualnya:

```js
File: store/keranjangStore.js (ILUSTRASI — tidak dipakai pada buku ini)

import { create } from 'zustand';

export const useKeranjangStore = create((set) => ({
  items: [],
  tambahItem: (produk) =>
    set((sekarang) => ({ items: [...sekarang.items, produk] })),
}));
```
*⚠ version-sensitive: sintaks pustaka dapat berubah antarversi — periksa dokumentasi resmi zustand saat akan menggunakannya.*

Penjelasan: `create((set) => ({ ... }))` membentuk store sekaligus hook `useKeranjangStore`. Komponen membaca state dengan memanggil hook tersebut — misalnya `useKeranjangStore((s) => s.items)` — tanpa provider. Trade-off Zustand: cepat dipelajari dan minim kode, tetapi karena polanya berada "di luar" pohon komponen, tim yang belum terbiasa dapat kesulitan menelusuri aliran data; pemilihan data (selector) juga perlu disiplin agar tidak memicu render berlebihan.

**Redux Toolkit** adalah evolusi resmi dari Redux, pustaka state management tertua dan paling banyak dipakai di aplikasi besar. Konsep intinya: satu store global, data diubah hanya melalui **action** (aksi, objek deskripsi perubahan) yang diproses **reducer** (pereduksi, fungsi murni yang menghasilkan state baru), sehingga alur perubahan data bersifat satu arah dan dapat diprediksi. Redux Toolkit merangkum boilerplate (kode pengulangan) Redux klasik melalui `createSlice` dan `configureStore`. Ilustrasi konseptualnya:

```js
File: store/keranjangSlice.js (ILUSTRASI — tidak dipakai pada buku ini)

import { createSlice } from '@reduxjs/toolkit';

const keranjangSlice = createSlice({
  name: 'keranjang',
  initialState: { items: [] },
  reducers: {
    tambahItem(state, aksi) {
      state.items.push(aksi.payload);
    },
  },
});
```
*⚠ version-sensitive: sintaks pustaka dapat berubah antarversi — periksa dokumentasi resmi Redux Toolkit saat akan menggunakannya.*

Penjelasan: `createSlice` menggabungkan state awal, reducer, dan pembuat action dalam satu objek — `keranjangSlice.actions.tambahItem` otomatis tersedia tanpa ditulis manual. Trade-off Redux Toolkit: keunggulannya adalah prediktabilitas, devtools yang sangat matang (termasuk time travel debugging, menelusuri riwayat perubahan state), ekosistem besar, dan standar yang sama untuk semua anggota tim; kekurangannya adalah kurva belajar yang lebih curam dan lebih banyak kode untuk kasus kecil — untuk satu layar yang hanya butuh satu toggle, Redux Toolkit adalah kanon untuk menembak nyamuk.

Keputusan memilih pustaka bukan soal "mana yang terbaik", melainkan soal mencocokkan dengan **kompleksitas aplikasi dan ukuran tim**: Context + custom hooks untuk aplikasi kecil-menengah, Zustand untuk tim yang menginginkan ringkas, Redux Toolkit untuk aplikasi besar dengan banyak kolaborator yang menuntut keterlacakan. Buku ini sengaja menunda pengenalan pustaka sampai Anda benar-benar merasakan keterbatasan Context API — pengalaman itulah yang membuat pilihan teknologi berikutnya menjadi keputusan yang matang, bukan sekadar ikut tren.

### 9.7 Studi Kasus: Shopping Cart

Untuk mengikat seluruh konsep di atas, buku ini menggunakan satu studi kasus yang dibangun penuh pada Praktikum 9: **keranjang belanja** (shopping cart) aplikasi toko alat tulis. Sebelum menulis kode, mari rancang state-nya — inilah latihan berpikir yang membedakan pengembang aplikasi dari sekadar penyalin kode.

**Data apa yang harus disimpan?** Daftar item yang dipilih pengguna. Setiap item menyimpan data produk (id, nama, harga) ditambah jumlah yang dipesan (qty). Data produk itu sendiri (katalog) tidak berubah selama aplikasi berjalan, sehingga cukup disimpan sebagai data statis, bukan state.

**Operasi apa yang dibutuhkan?** Menambah produk ke keranjang, mengurangi qty, menghapus item, dan — pada praktikum — mengosongkan keranjang. Perhatikan bahwa setiap operasi ini mengubah daftar item; inilah yang disebut **menulis** state.

**Nilai apa yang bisa dihitung, bukan disimpan?** Jumlah total item (penjumlahan seluruh qty) dan total harga (penjumlahan qty × harga). Keduanya adalah derived state: jika disimpan sebagai state terpisah, Anda harus mengingat memperbaruinya di setiap operasi — satu lupa, data tidak sinkron. Menghitungnya langsung dari `items` setiap render lebih aman dan lebih sederhana.

**Di mana state harus hidup?** Keranjang dibaca dan ditulis oleh dua layar yang berbeda (daftar produk dan layar keranjang). Lifting state up tidak praktis karena induk bersama kedua layar adalah layout akar aplikasi. Maka keranjang menjadi global state: `CartProvider` membungkus seluruh aplikasi di `app/_layout.js` (rute akar — lihat Bab 7 untuk struktur rute), dan kedua layar mengaksesnya melalui custom hook `useCart()`.

**Bagaimana dengan penyimpanan permanen?** Pada bab ini keranjang hanya hidup di memori: saat aplikasi ditutup, isinya hilang. Rencana perbaikannya — menyimpan keranjang ke penyimpanan lokal perangkat dan memuatnya kembali saat aplikasi dibuka — dibahas utuh di Bab 11 (Penyimpanan Data Lokal). Anda akan melihat titik penyisipannya pada kode praktikum berupa komentar TODO.

Rancangan inilah yang diimplementasikan langkah demi langkah pada Praktikum 9.

## Contoh

### Contoh 1: Lifting State Up pada Pemesanan Minuman

Contoh berikut menerjemahkan alur subbab 9.2 menjadi tiga berkas. Perhatikan bagaimana state `ukuran` hidup di `LayarPesan` dan mengalir ke bawah lewat props serta naik lewat callback.

```js
File: components/PilihUkuran.js

import { Pressable, StyleSheet, Text, View } from 'react-native';

const DAFTAR_UKURAN = ['S', 'M', 'L'];

export default function PilihUkuran({ ukuran, onPilihUkuran }) {
  return (
    <View style={styles.baris}>
      {DAFTAR_UKURAN.map((u) => (
        <Pressable
          key={u}
          onPress={() => onPilihUkuran(u)}
          style={[styles.tombol, ukuran === u && styles.tombolAktif]}
        >
          <Text style={styles.teks}>{u}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  baris: { flexDirection: 'row', gap: 8 },
  tombol: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 8, backgroundColor: '#dfe4ea' },
  tombolAktif: { backgroundColor: '#3742fa' },
  teks: { fontWeight: '600', color: '#2f3542' },
});
```

Penjelasan: `PilihUkuran` menerima dua props — `ukuran` (nilai saat ini) dan `onPilihUkuran` (callback). Ketika tombol ditekan, komponen **tidak** mengubah state sendiri; ia hanya memanggil `onPilihUkuran(u)` dan menyerahkan keputusan kepada induk. Gaya `tombolAktif` diterapkan bersyarat memakai operator `&&`, pola yang sudah Anda kenal dari Bab 5. Komponen ini buta terhadap dari mana nilai berasal — ia murni "presentasi".

```js
File: components/RingkasanPesanan.js

import { StyleSheet, Text, View } from 'react-native';

const HARGA = { S: 8000, M: 10000, L: 12000 };

export default function RingkasanPesanan({ ukuran }) {
  return (
    <View style={styles.kartu}>
      <Text style={styles.teks}>Ukuran: {ukuran}</Text>
      <Text style={styles.teks}>Harga: Rp {HARGA[ukuran]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: { padding: 12, borderRadius: 8, backgroundColor: '#f1f2f6', marginTop: 12 },
  teks: { fontSize: 15, color: '#2f3542' },
});
```

Penjelasan: `RingkasanPesanan` hanya menerima `ukuran` sebagai props dan menghitung harga dari tabel `HARGA`. Karena pilihan ukuran disimpan di induk, komponen ini selalu menampilkan nilai terbaru tanpa perlu tahu bagaimana pilihan itu berubah.

```js
File: screens/LayarPesan.js

import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PilihUkuran from '../components/PilihUkuran';
import RingkasanPesanan from '../components/RingkasanPesanan';

export default function LayarPesan() {
  const [ukuran, setUkuran] = useState('M');

  return (
    <View style={styles.layar}>
      <Text style={styles.judul}>Pilih ukuran minuman</Text>
      <PilihUkuran ukuran={ukuran} onPilihUkuran={setUkuran} />
      <RingkasanPesanan ukuran={ukuran} />
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, padding: 16, backgroundColor: '#fff' },
  judul: { fontSize: 17, fontWeight: '600', marginBottom: 12, color: '#2f3542' },
});
```

Penjelasan: `LayarPesan` adalah pemilik sesungguhnya dari state `ukuran`. Ia menurunkan nilai lewat prop `ukuran` dan fungsi pengubah lewat prop `onPilihUkuran={setUkuran}` — perhatikan bahwa `setUkuran` dari `useState` siap dipakai langsung sebagai callback karena bentuknya `(nilaiBaru) => void`, sama dengan kontrak prop. Dengan pola ini, setiap perubahan pilihan otomatis menyegarkan `RingkasanPesanan`, dan tidak ada salinan data yang bertabrakan.

### Contoh 2: Context API untuk Mode Gelap

Contoh berikut menunjukkan pemakaian Context API yang paling umum di aplikasi nyata: tema tampilan. Provider dipasang sekali di akar, lalu komponen mana pun membaca palet warna tanpa menerima props.

```js
File: context/TemaContext.js

import { createContext, useContext, useState } from 'react';

export const TemaContext = createContext(null);

export function TemaProvider({ children }) {
  const [mode, setMode] = useState('terang');

  const palet =
    mode === 'gelap'
      ? { latar: '#1e272e', teks: '#f5f6fa' }
      : { latar: '#ffffff', teks: '#2f3542' };

  return (
    <TemaContext.Provider value={{ mode, setMode, palet }}>
      {children}
    </TemaContext.Provider>
  );
}
```

Penjelasan: `TemaProvider` menyimpan mode tema dan menghitung palet warna sebagai nilai turunan dari mode tersebut. Nilai yang disediakan (`value`) berisi tiga hal: mode saat ini, fungsi pengubah, dan palet. Seluruh aplikasi yang dibungkus `TemaProvider` dapat membaca ketiganya; menghitung `palet` di sini (bukan di setiap komponen) membuat aturan warna hidup di satu tempat.

```js
File: screens/ProfilSaya.js

import { useContext } from 'react';
import { Pressable, Text, View } from 'react-native';
import { TemaContext } from '../context/TemaContext';

export default function ProfilSaya() {
  const { mode, setMode, palet } = useContext(TemaContext);

  return (
    <View style={{ backgroundColor: palet.latar, padding: 16, flex: 1 }}>
      <Text style={{ color: palet.teks, fontSize: 16 }}>Mode saat ini: {mode}</Text>
      <Pressable onPress={() => setMode(mode === 'gelap' ? 'terang' : 'gelap')}>
        <Text style={{ color: palet.teks, marginTop: 12 }}>Ganti mode</Text>
      </Pressable>
    </View>
  );
}
```

Penjelasan: `ProfilSaya` memanggil `useContext(TemaContext)` dan mengambil tiga nilai sekaligus lewat destructuring. Ia menggunakan `palet` untuk mewarnai latar dan teks, tanpa tahu dari mana nilai itu berasal. Bandingkan dengan Contoh 1: di sana data mengalir eksplisit lewat props (lebih mudah dilacak), di sini data diambil langsung dari context (lebih ringkas untuk data lintas wilayah) — perbedaan inilah inti keputusan desain yang Anda pelajari pada subbab 9.5.

## Praktikum

### Tujuan Praktikum

1. Mengimplementasikan global state keranjang belanja dengan Context API dan `useState`.
2. Membungkus akses context dalam custom hook `useCart` agar komponen tidak bergantung pada detail context.
3. Membangun dua layar yang membaca dan menulis state yang sama: daftar produk dan layar keranjang.
4. Menampilkan badge jumlah item yang selalu sinkron dengan isi keranjang.
5. Menghitung total harga sebagai nilai turunan (derived state).
6. Mengidentifikasi titik penyisipan persistensi yang akan diimplementasikan di Bab 11.

### Kebutuhan

- Project Expo berbasis JavaScript (template `blank`) dengan Expo Router terpasang — cara pemasangan dan konfigurasinya sudah Anda lakukan di Bab 7.
- Expo Go atau emulator Android (lihat Bab 2).
- Rasa ingin tahu: semua konsep state pada bab ini akan hidup dalam satu aplikasi kecil bernama `TokoKu`.

### Persiapan

1. Pastikan Node.js LTS terpasang (Bab 2 §2.1).
2. Buat project baru dengan perintah berikut:

```bash
npx create-expo-app TokoKu --template blank
cd TokoKu
```

3. Pasang Expo Router beserta dependensi pendukungnya — ikuti langkah pemasangan dan konfigurasi (entri utama `expo-router/entry`, `scheme`, dan plugin di `app.json`) persis seperti pada Bab 7 §7.2–7.3. *⚠ version-sensitive: daftar paket pendukung dapat berubah antarversi Expo SDK — gunakan daftar yang tertulis di Bab 7.*
4. Buat struktur folder di dalam `TokoKu`: `app/`, `context/`, `hooks/`, `data/`.
5. Buka VS Code dan pastikan Anda berada di folder `TokoKu`.

### Langkah Kerja

1. Buat berkas `data/produk.js` berisi katalog empat produk (Buku 45000, Bolpoin 5000, Tinta 25000, Tipe-X 12000).
2. Buat berkas `context/CartContext.js` — inilah jantung praktikum: context keranjang, provider, dan seluruh operasi keranjang.
3. Buat berkas `hooks/useCart.js` — custom hook yang membungkus akses ke context.
4. Buat berkas `app/_layout.js` — layout akar yang membungkus seluruh rute dengan `CartProvider`.
5. Buat berkas `app/index.js` — layar daftar produk dengan tombol "Tambah" dan badge keranjang.
6. Buat berkas `app/keranjang.js` — layar isi keranjang dengan kendali tambah/kurang/hapus dan total harga.
7. Jalankan `npx expo start`, buka aplikasi di Expo Go.
8. Uji skenario berikut: tambah 2 Buku dan 1 Tipe-X dari layar produk → badge menunjukkan angka 3 → buka layar keranjang → periksa rincian dan total (2 × 45.000 + 1 × 12.000 = Rp 102.000) → kurangi dan hapus item → pastikan ringkasan berubah → kosongkan keranjang (latihan) hingga muncul kondisi keranjang kosong.
9. Tutup aplikasi lalu buka kembali; amati bahwa keranjang kosong — catat bahwa ini adalah batas penyimpanan di memori, dan rencana perbaikannya dibahas di Bab 11.

### Kode

```js
File: data/produk.js

export const PRODUK = [
  { id: 'p1', nama: 'Buku', harga: 45000 },
  { id: 'p2', nama: 'Bolpoin', harga: 5000 },
  { id: 'p3', nama: 'Tinta', harga: 25000 },
  { id: 'p4', nama: 'Tipe-X', harga: 12000 },
];
```

Penjelasan: berkas ini menyimpan katalog produk sebagai **data statis**, bukan state — isinya tidak pernah berubah selama aplikasi berjalan. Id dipakai sebagai kunci item di keranjang; harga disimpan dalam satuan Rupiah tanpa tanda baca agar mudah dihitung. (Pemformatan "Rp 45.000" dilakukan di layar, bukan di data.)

```js
File: context/CartContext.js

import { createContext, useState } from 'react';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const tambahItem = (produk) => {
    setItems((sekarang) => {
      const ada = sekarang.find((i) => i.id === produk.id);
      if (ada) {
        return sekarang.map((i) =>
          i.id === produk.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...sekarang, { ...produk, qty: 1 }];
    });
  };

  const kurangiItem = (id) => {
    setItems((sekarang) =>
      sekarang
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const hapusItem = (id) => {
    setItems((sekarang) => sekarang.filter((i) => i.id !== id));
  };

  const jumlahItem = items.reduce((total, i) => total + i.qty, 0);
  const totalHarga = items.reduce((total, i) => total + i.qty * i.harga, 0);

  // TODO (Bab 11): muat items dari AsyncStorage saat provider dibuat,
  // dan simpan items setiap kali berubah, agar keranjang bertahan
  // setelah aplikasi ditutup.

  return (
    <CartContext.Provider
      value={{ items, tambahItem, kurangiItem, hapusItem, jumlahItem, totalHarga }}
    >
      {children}
    </CartContext.Provider>
  );
}
```

Penjelasan: `CartProvider` adalah sumber kebenaran tunggal keranjang. State `items` adalah larik objek `{ id, nama, harga, qty }`. Perhatikan tiga keputusan penting. Pertama, setiap operasi memakai **functional update** — `setItems((sekarang) => ...)` — sehingga pembaruan selalu dihitung dari nilai terbaru dan aman meski ada beberapa pembaruan beruntun. Kedua, `tambahItem` mencari item yang sudah ada dengan `find`; jika ada, qty dinaikkan melalui `map` (mengganti hanya item yang cocok), jika belum, item baru ditambahkan dengan spread `{ ...produk, qty: 1 }`. Ketiga, `kurangiItem` menggabungkan `map` untuk menurunkan qty dan `filter` untuk membuang item yang qty-nya menjadi 0 — sehingga qty tidak pernah bisa negatif. Nilai `jumlahItem` dan `totalHarga` dihitung dengan `reduce` langsung dari `items` setiap render; karena tidak disimpan sebagai state, keduanya tidak mungkin tertinggal dari isi keranjang. Komentar TODO menandai titik penyisipan persistensi Bab 11.

```js
File: hooks/useCart.js

import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export function useCart() {
  const ctx = useContext(CartContext);
  if (ctx === null) {
    throw new Error('useCart harus dipakai di dalam <CartProvider>.');
  }
  return ctx;
}
```

Penjelasan: `useCart` adalah satu-satunya pintu masuk komponen ke keranjang. Ia membaca context dengan `useContext` dan, sebelum mengembalikan nilainya, memeriksa apakah context bernilai `null` — tanda bahwa pemanggilan terjadi di luar `CartProvider`. Jika demikian, hook melempar error dengan pesan yang menjelaskan perbaikannya; error seperti ini jauh lebih mudah ditelusuri daripada "null tidak bisa dibaca" yang samar. Dengan pola ini, komponen tidak pernah menyentuh `CartContext` secara langsung, sehingga nama dan struktur context bebas diubah di masa depan tanpa menyentuh layar.

```js
File: app/_layout.js

import { Stack } from 'expo-router';
import { CartProvider } from '../context/CartContext';

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerTitleAlign: 'center' }} />
    </CartProvider>
  );
}
```

Penjelasan: berkas ini adalah layout akar aplikasi Expo Router (lihat Bab 7). `<Stack>` mendaftarkan semua rute dari folder `app/` secara otomatis. Dengan membungkus `<Stack>` di dalam `<CartProvider>`, seluruh rute — daftar produk maupun keranjang — berada di dalam subtree provider, sehingga keduanya dapat memanggil `useCart()`. Penempatan provider di akar inilah yang membuat keranjang menjadi state global yang sah: bukan karena datanya "besar", tetapi karena cakupan pemakaiannya mencakup semua layar.

```js
File: app/index.js

import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { PRODUK } from '../data/produk';
import { useCart } from '../hooks/useCart';

function formatRupiah(nilai) {
  return 'Rp ' + String(nilai).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function DaftarProduk() {
  const { tambahItem, jumlahItem } = useCart();

  const renderProduk = ({ item }) => (
    <View style={styles.kartu}>
      <View style={styles.info}>
        <Text style={styles.nama}>{item.nama}</Text>
        <Text style={styles.harga}>{formatRupiah(item.harga)}</Text>
      </View>
      <Pressable
        style={({ pressed }) => [styles.tombol, pressed && styles.tombolDitekan]}
        onPress={() => tambahItem(item)}
      >
        <Text style={styles.teksTombol}>Tambah</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.layar}>
      <Link href="/keranjang" style={styles.badge}>
        <Text style={styles.teksBadge}>Keranjang ({jumlahItem})</Text>
      </Link>
      <FlatList
        data={PRODUK}
        keyExtractor={(item) => item.id}
        renderItem={renderProduk}
        contentContainerStyle={styles.daftar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f6fa' },
  badge: {
    alignSelf: 'flex-end',
    marginRight: 16,
    marginTop: 8,
    backgroundColor: '#2f3542',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  teksBadge: { color: 'white', fontWeight: '600' },
  daftar: { paddingHorizontal: 16, paddingBottom: 24 },
  kartu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  info: { flex: 1 },
  nama: { fontSize: 16, fontWeight: '600', color: '#2f3542' },
  harga: { marginTop: 4, fontSize: 14, color: '#57606f' },
  tombol: {
    backgroundColor: '#3742fa',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginLeft: 12,
  },
  tombolDitekan: { opacity: 0.7 },
  teksTombol: { color: 'white', fontWeight: '600' },
});
```

Penjelasan: layar pertama ini membuktikan bahwa global state bekerja: komponen hanya membutuhkan **dua** nilai dari `useCart()` — `tambahItem` untuk menulis dan `jumlahItem` untuk badge. Fungsi `formatRupiah` memakai ekspresi reguler untuk menyisipkan tanda titik ribuan; pendekatan ini dipilih agar hasilnya konsisten di semua perangkat tanpa tergantung dukungan internasionalisasi (i18n) mesin JavaScript. `<Link href="/keranjang">` adalah rute Expo Router ke layar keranjang (Bab 7), dan badge yang menempel padanya membaca `jumlahItem` secara langsung — setiap kali `tambahItem` dipanggil, nilai context berubah dan badge ikut di-render ulang. Tombol "Tambah" menggunakan `Pressable` dengan gaya yang bereaksi saat ditekan (`pressed && styles.tombolDitekan`), pola interaksi standar React Native sejak Bab 5.

```js
File: app/keranjang.js

import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { useCart } from '../hooks/useCart';

function formatRupiah(nilai) {
  return 'Rp ' + String(nilai).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function Keranjang() {
  const { items, tambahItem, kurangiItem, hapusItem, totalHarga, jumlahItem } =
    useCart();

  const renderItem = ({ item }) => (
    <View style={styles.baris}>
      <View style={styles.info}>
        <Text style={styles.nama}>{item.nama}</Text>
        <Text style={styles.sub}>
          {formatRupiah(item.harga)} x {item.qty} ={' '}
          {formatRupiah(item.harga * item.qty)}
        </Text>
      </View>
      <View style={styles.kendali}>
        <Pressable style={styles.tombolKecil} onPress={() => kurangiItem(item.id)}>
          <Text style={styles.teksTombol}>-</Text>
        </Pressable>
        <Text style={styles.qty}>{item.qty}</Text>
        <Pressable style={styles.tombolKecil} onPress={() => tambahItem(item)}>
          <Text style={styles.teksTombol}>+</Text>
        </Pressable>
        <Pressable style={styles.tombolHapus} onPress={() => hapusItem(item.id)}>
          <Text style={styles.teksHapus}>Hapus</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.layar}>
      {items.length === 0 ? (
        <View style={styles.kosong}>
          <Text style={styles.teksKosong}>Keranjang masih kosong.</Text>
          <Link href="/" style={styles.tombolBelanja}>
            <Text style={styles.teksBelanja}>Mulai Belanja</Text>
          </Link>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.daftar}
          />
          <View style={styles.ringkasan}>
            <Text style={styles.teksRingkasan}>
              Total ({jumlahItem} item): {formatRupiah(totalHarga)}
            </Text>
            <Pressable style={styles.tombolBeli}>
              <Text style={styles.teksBeli}>Beli Sekarang</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f6fa' },
  daftar: { paddingHorizontal: 16, paddingBottom: 16 },
  baris: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  info: { flex: 1 },
  nama: { fontSize: 16, fontWeight: '600', color: '#2f3542' },
  sub: { marginTop: 4, fontSize: 13, color: '#57606f' },
  kendali: { flexDirection: 'row', alignItems: 'center' },
  tombolKecil: {
    backgroundColor: '#3742fa',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  qty: {
    marginHorizontal: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#2f3542',
  },
  tombolHapus: { marginLeft: 10, paddingHorizontal: 6, paddingVertical: 6 },
  teksTombol: { color: 'white', fontWeight: '700', fontSize: 15 },
  teksHapus: { color: '#e84118', fontWeight: '600', fontSize: 13 },
  ringkasan: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  teksRingkasan: { fontSize: 15, fontWeight: '600', color: '#2f3542' },
  tombolBeli: {
    backgroundColor: '#2f3542',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  teksBeli: { color: 'white', fontWeight: '700' },
  kosong: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  teksKosong: { fontSize: 16, color: '#57606f', marginBottom: 16 },
  tombolBelanja: {
    backgroundColor: '#3742fa',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  teksBelanja: { color: 'white', fontWeight: '700' },
});
```

Penjelasan: layar keranjang membaca **enam** nilai dari `useCart()` — isi keranjang dan seluruh operasinya. Baris item menampilkan nama, harga satuan dikali qty, dan tiga kendali: `-` memanggil `kurangiItem(item.id)` (qty 1 akan membuang item karena filter di provider), `+` memanggil `tambahItem(item)` (item yang sudah di keranjang otomatis hanya menaikkan qty), dan "Hapus" memanggil `hapusItem(item.id)`. Bagian bawah menampilkan total sebagai derived state. Perhatikan juga **empty state** (kondisi kosong): bila `items.length === 0`, layar menampilkan pesan dan tautan "Mulai Belanja" alih-alih daftar kosong — pola penanganan kondisi yang akan Anda temui lagi di Bab 10 (empty state saat data kosong dari server). Fragmen `<>...</>` dipakai agar `FlatList` dan ringkasan menjadi satu grup tanpa menambah node layout.

### Penjelasan Kode

Keempat berkas inti (context, hook, dan dua layar) membentuk satu alur yang perlu Anda pahami sebagai satu kesatuan:

1. **context/CartContext.js** adalah satu-satunya tempat state keranjang disimpan dan diubah. Tidak ada layar yang memanggil `setItems` — seluruh perubahan terjadi lewat tiga fungsi yang diekspos provider. Inilah penerapan **sumber kebenaran tunggal**: siapa pun ingin mengubah keranjang harus melewati satu pintu, sehingga perilaku keranjang mudah diprediksi dan diuji.
2. **hooks/useCart.js** adalah jembatan konsumsi. Ia memisahkan dua tanggung jawab: komponen tidak perlu tahu detail context (nama, nilai awal, cara deteksi error), dan logika pembacaan dapat ditingkatkan di satu tempat — misalnya menambahkan pemantauan (logging) tanpa mengubah layar.
3. **app/_layout.js** menentukan cakupan global. Karena provider membungkus seluruh rute, keranjang dapat diakses dari mana pun di aplikasi. Apabila suatu saat aplikasi memiliki area yang tidak membutuhkan keranjang (misalnya halaman bantuan), provider dapat dipindah lebih rendah — cakupan provider yang tepat mengurangi render ulang yang tidak perlu.
4. **Dua layar** adalah konsumen murni: mereka membaca nilai, memanggil fungsi, dan menampilkan hasil. Layar tidak menyimpan salinan keranjang, sehingga tidak mungkin ada dua keranjang yang berbeda isinya.

Alur sebuah penekanan tombol "Tambah": `onPress` di `app/index.js` memanggil `tambahItem(item)` → `setItems` di provider memperbarui state → nilai context berubah → React me-render ulang semua komponen yang memakai `useCart()` → badge di layar produk dan (bila terbuka) daftar di layar keranjang diperbarui. Keseluruhan alur ini satu arah dan mudah ditelusuri — justru alasan mengapa pola Context + custom hook menjadi standar untuk aplikasi skala kecil-menengah.

### Hasil yang Diharapkan

Setelah semua berkas ditulis dan aplikasi dijalankan, Anda akan mengamati perilaku berikut:

- Layar awal menampilkan empat kartu produk (Buku Rp 45.000, Bolpoin Rp 5.000, Tinta Rp 25.000, Tipe-X Rp 12.000) dan badge "Keranjang (0)" di kanan atas.
- Setiap penekanan "Tambah" menaikkan badge; menekan "Tambah" dua kali pada Buku menjadikan badge "Keranjang (2)".
- Layar keranjang menampilkan satu baris per produk dengan qty yang benar; untuk 2 Buku dan 1 Tipe-X, baris Buku menampilkan "Rp 45.000 x 2 = Rp 90.000", Tipe-X "Rp 12.000 x 1 = Rp 12.000", dan ringkasan "Total (3 item): Rp 102.000".
- Menekan "-" pada item ber-qty 1 menghapus barisnya; menekan "-" pada qty 2 menurunkannya menjadi 1 tanpa pernah menjadi 0 atau negatif; "Hapus" langsung menghilangkan baris.
- Setelah semua item dihapus, layar menampilkan "Keranjang masih kosong." beserta tombol "Mulai Belanja" yang kembali ke daftar produk.
- Menutup lalu membuka kembali aplikasi mengembalikan keranjang ke keadaan kosong — wajar, karena penyimpanan masih di memori; perbaikan disiapkan pada Bab 11.

### Troubleshooting

**Masalah:** Muncul pesan "Unable to resolve module expo-router" saat aplikasi dimuat, atau layar hanya menampilkan latar kosong.

**Penyebab:** Expo Router belum diinstal, atau entri utama (field `main`) pada `package.json` belum diarahkan ke `expo-router/entry`, sehingga aplikasi tidak menemukan berkas rute.

**Solusi:** Jalankan `npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar`, setel `"main": "expo-router/entry"` di `package.json`, tambahkan `scheme` dan plugin router di `app.json`, lalu muat ulang dengan `npx expo start --clear`.

**Pencegahan:** Selesaikan pemasangan dan konfigurasi Expo Router pada Bab 7 sebelum mengerjakan praktikum bab ini; periksa ulang kedua berkas konfigurasi tersebut setiap kali membuat project baru.

**Masalah:** Muncul error "useCart harus dipakai di dalam <CartProvider>." saat aplikasi dijalankan, atau keranjang tidak pernah berubah setelah tombol ditekan.

**Penyebab:** Komponen memanggil `useCart()` tetapi tidak berada di dalam subtree `CartProvider` — misalnya provider baru ditambahkan di satu layar, bukan di `app/_layout.js`, atau berkas layout belum tersimpan.

**Solusi:** Pastikan `app/_layout.js` membungkus `<Stack>` dengan `<CartProvider>` persis seperti pada Kode, lalu muat ulang aplikasi (tekan `r` pada terminal Metro).

**Pencegahan:** Biasakan menempatkan provider yang bersifat global di layout akar. Jika suatu layar perlu diuji tanpa provider, beri tahu lewat pesan error hook — bukan dengan menghapus pemanggilan provider.

**Masalah:** Badge "Keranjang (0)" tidak bertambah meskipun tombol "Tambah" sudah ditekan berkali-kali, tanpa ada pesan error.

**Penyebab:** Terdapat dua salinan `CartContext` — misalnya berkas context dibuat dua kali dengan nama berbeda (`CartContext.js` dan `cartContext.js` di folder berbeda) sehingga layar dan provider masing-masing memakai context yang berbeda; atau sisa bundel lama masih dimuat oleh Metro.

**Solusi:** Pastikan hanya ada satu berkas `context/CartContext.js` dan seluruh `import` di `hooks/useCart.js`, `app/_layout.js`, dan layar memakai path serta penulisan huruf yang sama persis; tekan `r`, dan bila perlu mulai ulang bundler dengan `npx expo start --clear`.

**Pencegahan:** Tetapkan satu lokasi dan satu konvensi penulisan nama (misalnya huruf kecil untuk folder, `PascalCase` untuk komponen provider) untuk seluruh berkas project.

**Masalah:** Saat tombol "-" ditekan pada item ber-qty 1, baris tetap tampil dengan qty 0, atau qty menjadi bilangan negatif.

**Penyebab:** Logika `kurangiItem` tidak membuang item yang qty-nya menjadi 0 — misalnya `filter` terlewat atau filter membandingkan sebelum pengurangan.

**Solusi:** Terapkan urutan `map` lalu `filter` seperti pada Kode: `map` menurunkan qty, `filter` membuang item dengan `qty <= 0`, dan selalu uji kasus tepi (qty 1 lalu kurangi) setelah menulis ulang fungsi.

**Pencegahan:** Untuk setiap operasi state, tuliskan di selembar kertas tiga kasus: nilai awal kosong, nilai normal, dan nilai batas; uji ketiganya sebelum melanjutkan.

**Masalah:** Metro menampilkan error "Unable to resolve ../hooks/useCart" atau "../context/CartContext" ketika aplikasi dibuka di perangkat.

**Penyebab:** Nama berkas atau path import tidak sama persis — termasuk perbedaan huruf besar/kecil — antara pernyataan `import` dan nama file di disk.

**Solusi:** Periksa penulisan `import` di setiap berkas yang bermasalah dan samakan dengan nama file aktual; gunakan huruf kecil konsisten untuk nama folder dan nama file non-komponen.

**Pencegahan:** Buat berkas melalui VS Code (yang menawarkan penyelesaian path otomatis) alih-alih mengetik path manual; jalankan aplikasi pada emulator berbasis Linux yang memaksa penulisan path konsisten.

## Studi Kasus

Koperasi mahasiswa "Primadona" di sebuah perguruan tinggi mengelola toko alat tulis yang melayani ribuan mahasiswa. Setiap jam istirahat, antrean di kasir mencapai 15–20 menit. Kasir menghitung total belanja dengan kalkulator, kemudian mencatat penjualan pada buku harian; setiap akhir bulan, pengurus merekapitulasi penjualan dari buku tersebut untuk laporan keuangan dan pembelian stok. Masalah yang muncul klasik untuk sistem informasi (SI) sederhana yang belum terdorong digitalisasi: (1) antrean panjang karena perhitungan manual, (2) selisih kas akibat salah hitung atau salah input, (3) data penjualan yang tidak terekam terstruktur sehingga stok sering menipis tanpa disadari, dan (4) laporan bulanan yang baru selesai berminggu-minggu setelah periode berakhir.

Solusi yang dirancang adalah aplikasi kasir mobile: petugas memilih produk dari katalog, aplikasi menghitung total secara otomatis, dan setelah pembayaran data transaksi dikirim ke server pusat koperasi untuk pemrosesan stok dan laporan. Di sinilah studi kasus bab ini — keranjang belanja — memegang peran sentral sebagai jembatan antara interaksi kasir dan data transaksi.

Mari petakan kebutuhan tersebut ke materi bab ini. Keranjang adalah **global state** karena dibaca dan ditulis lintas layar: layar katalog (menambah item), layar keranjang (memeriksa, mengubah qty, menghapus), dan kelak layar pembayaran (membaca total). Dengan Context API, ketiga layar berbagi satu sumber kebenaran tanpa prop drilling melalui layout akar. Dengan custom hook `useCart`, logika keranjang terisolasi dari tampilan — logika yang sama nantinya dapat diuji otomatis (Bab 14) dan dipakai ulang ketika aplikasi memiliki modul kasir kedua (misalnya gerai fotokopi). Nilai total yang dihitung otomatis menghilangkan kesalahan hitung manual kasir — akar masalah kedua koperasi tersebut. Sementara itu, rangkaian berikutnya — mengirim transaksi ke server, memperbarui stok, dan menyusun laporan — memakai pola yang akan Anda pelajari di Bab 10 (REST API) dan Bab 13 (autentikasi kasir), sedangkan penyimpanan lokal keranjang saat sinyal hilang menjadi topik Bab 11.

Keputusan arsitektur yang paling menarik dari kasus ini adalah: haruskah keranjang disimpan di **perangkat** (client-side) atau di **server** (server-side)? Toko yang jaringannya tidak stabil dan perangkat kasirnya murah akan diuntungkan keranjang client-side — respons cepat dan tetap berfungsi saat offline — dengan konsekuensi data hilang bila perangkat rusak. Toko daring besar justru menyimpan keranjang di server agar pelanggan yang berpindah perangkat (dari telepon ke laptop) menemukan keranjang yang sama. Pola yang dipilih pada praktikum bab ini — keranjang client-side di memori — adalah titik awal yang tepat, dan migrasi ke penyimpanan permanen (Bab 11) maupun sinkronisasi server (Bab 10) dapat dilakukan tanpa mengubah desain state yang sudah dibangun. Inilah esensi perancangan state: bukan memilih satu teknologi untuk selamanya, melainkan memahami trade-off dan merancang agar keputusan dapat berubah dengan biaya rendah.

## Latihan

### Soal Pemahaman

1. Jelaskan perbedaan state lokal dan state global, lalu berikan satu contoh nyata untuk masing-masing pada aplikasi keranjang belanja.
2. Apa yang dimaksud dengan lifting state up? Kapankah teknik ini mulai tidak praktis, dan apa solusi yang ditawarkan bab ini untuk kondisi tersebut?
3. Sebutkan tiga bagian utama Context API dan peran masing-masing.
4. Mengapa penggunaan custom hook (misalnya `useCart`) lebih disarankan daripada memanggil `useContext` langsung di setiap komponen?
5. Mengapa `jumlahItem` dan `totalHarga` dihitung langsung dari `items` (derived state) dan bukan disimpan sebagai state terpisah?
6. Sebutkan dua kondisi yang menunjukkan sebuah data sebaiknya menjadi global state, dan dua kondisi yang menunjukkan sebaiknya tidak.

### Soal Praktik

1. Tambahkan fitur "Kosongkan Keranjang": buat fungsi `kosongkanKeranjang` pada `CartContext.js` (cukup `setItems([])`), lalu tambahkan tombol pada `app/keranjang.js` yang memanggilnya.
2. Batasi qty maksimal 5 item per produk: pada `tambahItem`, jika qty produk sudah 5, tampilkan pesan "Maksimal 5 item per produk" menggunakan `Alert.alert` dari React Native dan jangan ubah state.
3. Pindahkan fungsi `formatRupiah` ke berkas terpisah `utils/format.js`, ekspor dengan `export`, lalu impor dan pakai di kedua layar. Amati bagaimana pemindahan ini mengurangi duplikasi kode.

### Soal Analisis

1. Jaringan toko "Primadona" berencana membuka fitur keranjang lintas perangkat: keranjang dibuat di kasir A, dilanjutkan di kasir B. Analisislah apakah Context API pada perangkat masih menjadi solusi yang tepat; bandingkan dengan opsi menyimpan draft keranjang di server (Bab 10) dan berikan rekomendasi beserta alasannya.
2. Bandingkan Context API, Zustand, dan Redux Toolkit untuk tiga skenario: aplikasi tugas kuliah satu layar, aplikasi e-commerce yang dikerjakan tim lima orang, dan aplikasi perbankan dengan tim tiga puluh orang. Tentukan pilihan terbaik per skenario dan jelaskan trade-off yang mendasarinya.

## Tantangan

1. **Diskon otomatis.** Tambahkan nilai turunan `diskon` pada `CartContext.js`: potongan 10% bila `totalHarga` lebih dari Rp 100.000. Ubah layar keranjang menampilkan tiga baris ringkasan: Subtotal, Diskon, dan Total Bayar. Pertahankan prinsip derived state — jangan menyimpan nilai-nilai tersebut sebagai state.
2. **Keranjang berlanjut ke server.** Setelah menyelesaikan Bab 10, tambahkan tombol "Beli Sekarang" yang mengirim isi keranjang sebagai permintaan POST ke server, lalu tampilkan status sukses atau gagal tanpa menghapus isi keranjang. Catat perubahan desain yang diperlukan pada `CartContext`.
3. **Menuju Project Akhir.** Rancanglah (tanpa menulis kode penuh) dua global state untuk "Sistem Informasi Akademik Mobile": sesi pengguna (nama, peran, token) dan daftar mata kuliah yang sedang dipilih. Tentukan provider, hook, nilai turunan, dan di mana titik persistensinya — lalu bandingkan rancangan Anda dengan Bab 13 (sesi) setelah Anda mempelajarinya.

## Rangkuman

1. State adalah data yang berubah dan memengaruhi tampilan; state lokal cukup jika data hanya dipakai satu komponen.
2. Global state diperlukan ketika data dipakai banyak komponen yang berjauhan, berubah lintas layar, atau ditulis oleh banyak pihak sekaligus.
3. Lifting state up menaikkan state ke induk terdekat dan menurunkannya melalui props serta callback, menciptakan sumber kebenaran tunggal.
4. Prop drilling — meneruskan props melalui komponen perantara — adalah tanda untuk mempertimbangkan Context API.
5. Context API bekerja melalui tiga bagian: `createContext`, `Provider`, dan `useContext`; seluruh komponen dalam subtree provider dapat membaca nilainya tanpa props.
6. Context cocok untuk data yang benar-benar lintas wilayah (tema, bahasa, sesi, keranjang) dan sebaiknya dihindari untuk data yang hanya dipakai satu-dua komponen.
7. Custom hook adalah fungsi berawalan `use` yang membungkus logika state; `useCart` memisahkan komponen dari detail context dan memungkinkan logika diuji.
8. Nilai turunan (derived state), seperti total harga, dihitung ulang dari sumber data alih-alih disimpan terpisah agar tidak pernah tidak sinkron.
9. Zustand dan Redux Toolkit menyelesaikan masalah skala besar (selector, devtools, keterlacakan) dengan trade-off berupa kurva belajar dan kode tambahan; keduanya hanya dibahas konseptual pada buku ini.
10. Keranjang pada bab ini berada di memori; membuatnya bertahan setelah aplikasi ditutup adalah materi Bab 11.

## Refleksi

1. Pernahkah Anda mengalami data yang "tidak sinkron" — misalnya catatan stok atau daftar hadir yang ditulis di dua tempat dan berbeda isinya? Bagaimana prinsip sumber kebenaran tunggal membantu menyelesaikan masalah tersebut?
2. Bandingkan pengalaman Anda menata state pada project kuliah dengan gambaran kerja tim yang memakai Redux Toolkit: aspek mana yang menurut Anda lebih mudah dan lebih sulit dipelihara?
3. Sebagai calon analis sistem, bagaimana Anda menjelaskan keputusan "keranjang disimpan di perangkat atau di server" kepada pemilik toko yang tidak memahami teknologi?
4. Apa risiko penggunaan Context API secara berlebihan, dan bagaimana Anda akan mendeteksi tanda-tandanya pada kode yang Anda tulis?

## Evaluasi Bab

### Pilihan Ganda

1. State yang hanya digunakan oleh satu komponen sebaiknya disimpan sebagai ...
   A. global state melalui Context API
   B. state lokal dengan `useState`
   C. state di server
   D. state di storage perangkat

2. Teknik memindahkan state ke komponen induk terdekat yang menjadi nenek moyang bersama para pemakainya disebut ...
   A. prop drilling
   B. lifting state up
   C. derived state
   D. server state

3. Urutan pemakaian Context API yang benar adalah ...
   A. createContext → useContext → Provider
   B. Provider → createContext → useContext
   C. createContext → Provider → useContext
   D. useContext → createContext → Provider

4. Perhatikan kode berikut: `const ctx = useContext(CartContext); if (ctx === null) throw new Error(...)`. Tujuan pemeriksaan `ctx === null` adalah ...
   A. mencegah komponen memakai `useCart` di luar `CartProvider`
   B. membatasi jumlah komponen yang boleh membaca keranjang
   C. mempercepat render ulang komponen
   D. mengaktifkan mode pengembangan (development mode)

5. Manakah yang termasuk nilai turunan (derived state) pada keranjang belanja?
   A. `items`
   B. `qty`
   C. `totalHarga`
   D. `id` produk

6. Kelemahan utama Context API pada aplikasi berskala besar adalah ...
   A. tidak dapat membagikan data antar komponen
   B. seluruh komponen konsumen ikut render ulang saat nilai berubah dan sulit dibatasi cakupannya
   C. hanya mendukung class component
   D. hanya dapat dipakai pada aplikasi web

7. Keunggulan utama Redux Toolkit dibanding Context API adalah ...
   A. devtools yang matang dan alur perubahan data yang dapat diprediksi
   B. ukuran aplikasi lebih kecil
   C. tidak membutuhkan JavaScript modern
   D. dapat berjalan tanpa instalasi

8. Mengapa `CartProvider` ditempatkan pada `app/_layout.js` pada praktikum bab ini?
   A. karena berkas layout wajib memuat provider
   B. agar seluruh rute (layar) berada dalam subtree provider dan dapat memanggil `useCart()`
   C. agar isi keranjang otomatis tersimpan permanen di perangkat
   D. agar aplikasi lebih cepat dimuat

9. Aturan penamaan custom hook yang benar adalah ...
   A. diawali kata `use`
   B. diawali huruf kapital
   C. bebas, asalkan diekspor
   D. diawali kata `get`

### Soal Uraian

1. Jelaskan langkah-langkah migrasi state pada fitur keranjang mulai dari state lokal, lifting state up, hingga Context API; pada setiap langkah, sebutkan indikator yang membuat Anda memutuskan untuk berpindah.
2. Bandingkan penyimpanan keranjang di sisi perangkat (client-side) dan di sisi server (server-side) untuk toko kampus yang jaringannya tidak stabil; kaitkan jawaban Anda dengan materi Bab 10 dan Bab 11.
3. Rancanglah kerangka custom hook `useAntreanKasir` untuk kasir yang melayani beberapa antrean sekaligus: sebutkan state yang disimpan, operasi yang disediakan, dan nilai turunan yang dihitung, tanpa menulis kode penuh.

### Kunci Jawaban

<details>
<summary>Klik untuk melihat kunci jawaban</summary>

**Pilihan Ganda:** 1-B, 2-B, 3-C, 4-A, 5-C, 6-B, 7-A, 8-B, 9-A

**Soal Uraian (pedoman):**

1. Migrasi dimulai dari state lokal (`useState` di satu komponen) ketika data hanya dipakai satu layar. Berpindah ke lifting state up ketika komponen kedua membutuhkan data dan induk bersama masih dekat (misalnya dua komponen dalam satu layar). Berpindah ke Context API ketika data harus melintasi banyak layar atau melewati komponen perantara yang tidak memakainya (badge di layar produk dan daftar di layar keranjang). Indikatornya: munculnya prop drilling, kebutuhan membaca di layar lain, dan banyaknya penulis data yang sama.
2. Client-side (Bab 11: penyimpanan lokal) unggul saat jaringan tidak stabil: kasir tetap dapat bekerja offline, keranjang tersimpan di perangkat; risikonya data hilang bila perangkat rusak dan keranjang tidak berpindah perangkat. Server-side (Bab 10: REST API) unggul untuk sinkronisasi lintas perangkat dan rekapitulasi langsung, tetapi bergantung pada koneksi. Untuk toko kampus dengan jaringan tidak stabil, kombinasi keduanya — keranjang lokal yang sinkron ke server saat online — adalah rekomendasi yang wajar.
3. `useAntreanKasir` menyimpan state misalnya `antreanAktif` (id antrean yang sedang dilayani) dan daftar pesanan per antrean; operasi: `mulaiAntrean`, `tutupAntrean`, `tambahItemKeAntrean`, `batalkanAntrean`; nilai turunan: jumlah antrean aktif, total nominal antrean yang sedang dilayani. Alternatif jawaban lain yang logis dan konsisten dengan pola context + custom hook diterima.
</details>