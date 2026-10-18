# BAB 4 — Dasar React

## Deskripsi Singkat

Bab ini mengenalkan pola pikir React: antarmuka pengguna dipandang sebagai hasil fungsi dari data (state), bukan sekadar kumpulan perintah mengubah layar. Anda akan belajar membangun **komponen** (component) dengan JSX, mengalirkan data lewat **props**, mengelola data internal lewat **state**, menangani interaksi pengguna (event), serta merender daftar secara kondisional. Bab ini ditutup dengan pengenalan hooks `useState`, `useEffect`, `useMemo`, dan `useCallback`. Materi Bab 3 (JavaScript modern) menjadi prasyaratnya, sedangkan Bab 5 akan memakai fondasi ini untuk mengenalkan komponen tampilan React Native secara utuh.

## Tujuan Pembelajaran

Setelah mempelajari bab ini, mahasiswa mampu:

1. menjelaskan konsep UI deklaratif dan mengapa React memandang antarmuka sebagai fungsi dari state;
2. mengidentifikasi aturan-aturan penulisan JSX dan membedakan komponen dengan elemen;
3. mengimplementasikan komponen reusable yang menerima props beserta nilai default-nya;
4. menganalisis perbedaan props dan state serta menerapkan pembaruan state secara immutable (tak berubah langsung);
5. menerapkan event handling, conditional rendering, dan list rendering dengan key yang benar;
6. mengimplementasikan lifecycle sederhana dengan `useEffect` termasuk pembersihan efek (cleanup);
7. mengevaluasi kapan penggunaan `useMemo` dan `useCallback` benar-benar diperlukan.

## Peta Konsep

```text
┌──────────────────────────────────────────────────────┐
│                    DASAR REACT                        │
│  Konsep: UI = f(state) → pendekatan deklaratif       │
│        │                                              │
│        ├── Komponen & JSX (blok tampilan, aturan)     │
│        │      ├── Props  → data masuk, read-only      │
│        │      └── State  → data internal, berubah     │
│        │             └── Event handling (interaksi)   │
│        │                                              │
│        ├── Rendering: conditional + list (key)        │
│        │                                              │
│        └── Hooks                                      │
│              ├── useState   → menyimpan state         │
│              ├── useEffect  → efek samping            │
│              │               (mount/update/unmount)   │
│              ├── useMemo    → nilai hasil kalkulasi   │
│              └── useCallback → fungsi yang stabil     │
└──────────────────────────────────────────────────────┘
```

## Materi

### 4.1 Konsep React

**React** adalah pustaka (library) JavaScript untuk membangun antarmuka pengguna (user interface, UI). Sebelum React, pengembang web menulis UI secara **imperatif** (imperative): serangkaian perintah "ambil elemen ini, ubah teksnya, tambahkan baris itu" yang menebar di banyak tempat. Makin besar aplikasi, makin sulit melacak kondisi layar: satu data berubah tetapi lima bagian layar tidak ikut diperbarui karena perintahnya terlewat. React lahir (2013, dikembangkan Meta) justru untuk menyelesaikan masalah ini dengan pendekatan sebaliknya, yaitu **deklaratif** (declarative): Anda cukup mendeskripsikan *apa yang tampil* berdasarkan data, dan React yang memutuskan *bagaimana memperbaruinya*.

Prinsip intinya dirumuskan sebagai `UI = f(state)`: tampilan adalah fungsi dari state (keadaan). Setiap kali state berubah, React menghitung tampilan baru secara otomatis dan memperbarui bagian layar yang benar-benar berubah saja. Mekanisme pembandingan ini disebut **reconciliation** (rekonsiliasi/pencocokan) — konsepnya cukup dipahami sebagai: React menyimpan gambaran tampilan (virtual), membandingkannya dengan gambaran sebelumnya, lalu menerapkan perbedaan (diff) yang minimal ke layar. Dalam pengembangan mobile, gambaran "layar" ini adalah pohon komponen React Native; detail teknisnya tidak perlu dihafal, yang penting: *ketika state berubah, UI mengikuti — Anda tidak lagi menulis perintah "perbarui teks ini" satu per satu*.

Mengapa teknologi ini ada adalah pertanyaan yang pantas diajukan. Tawar-menawar (trade-off) yang ditawarkan React: Anda membayar biaya mempelajari konsep baru (komponen, JSX, hooks) dan sedikit overhead kinerja untuk pembandingan, tetapi mendapatkan konsistensi UI yang tinggi, kode yang lebih mudah diprediksi, dan satu pola pikir yang sama untuk web maupun mobile. React Native (lihat Bab 1 Subbab 1.5 dan Bab 5 Subbab 5.1) memakai inti React yang sama, hanya "penerjemah" tampilannya (renderer) yang berbeda: alih-alih elemen HTML, ia menghasilkan komponen native seperti `View` dan `Text`.

Dalam sebuah project Expo (dibuat dengan `npx create-expo-app nama-proyek --template blank`, lihat Bab 2), React sudah terpasang sebagai bagian dari template. File `App.js` di root project adalah **komponen akar** (root component): komponen paling atas yang menjadi pintu masuk seluruh tampilan aplikasi. Semua yang Anda lihat di layar, dari judul hingga daftar, adalah hasil render komponen ini beserta komponen turunannya.

### 4.2 Component dan JSX

**Komponen** (component) adalah unit terkecil UI yang dapat dipakai ulang: sebuah fungsi JavaScript yang menerima data (props) dan mengembalikan deskripsi tampilan. Komponen adalah "bahan baku" aplikasi React — aplikasi besar tersusun dari puluhan komponen kecil yang saling disusun. React modern hanya mengenal **functional component** (komponen fungsi): komponen ditulis sebagai fungsi biasa atau fungsi panah. Komponen kelas (class component) memang pernah menjadi standar, tetapi sudah tidak dianjurkan dan tidak dipakai dalam buku ini.

Tampilan yang dikembalikan komponen ditulis dengan **JSX** (JavaScript XML): ekstensi sintaks yang memungkinkan Anda menulis struktur tampilan mirip markup di dalam kode JavaScript. Contoh komponen paling sederhana:

File: components/Sapaan.jsx

```jsx
export default function Sapaan() {
  return <Text>Halo, mahasiswa!</Text>;
}
```

Penjelasan: komponen `Sapaan` adalah fungsi yang mengembalikan elemen JSX `<Text>Halo, mahasiswa!</Text>`. `Text` adalah komponen bawaan React Native untuk menampilkan teks (akan dibahas di Bab 5); untuk sekarang anggap saja ia padanan `<span>`/`<p>` di dunia mobile. Perhatikan bahwa JSX di atas tampak seperti HTML, tetapi sebenarnya adalah gula sintaks yang dikompilasi menjadi pemanggilan fungsi JavaScript. Itulah sebabnya ada aturan-aturan berikut:

1. **Satu elemen akar.** Sebuah komponen harus mengembalikan satu elemen pembungkus saja. Jika ingin mengembalikan beberapa elemen tanpa membungkusnya dengan elemen visual, gunakan **fragment** `<>...</>` (tag kosong pembuka-penutup).
2. **Semua tag harus ditutup**, termasuk tag yang "sendiri" seperti `<Image />` — JSX tidak mengenal tag tanpa penutup ala HTML (`<br>` tidak berlaku; semuanya `<br />`).
3. **Atribut ditulis camelCase.** Tidak ada atribut `class` atau `for`; padanannya di React Native adalah `style`, `onPress`, dan seterusnya. Penamaan gaya unta (camelCase) berlaku untuk semua properti.
4. **Ekspresi JavaScript ditulis di dalam kurung kurawal** `{...}`. String statis boleh langsung, tetapi variabel, pemanggilan fungsi, dan operasi harus dibungkus `{ }`.
5. **Komentar ditulis `{/* ... */}`** di dalam JSX.
6. **Teks harus berada di dalam komponen teks.** Di React Native, string telanjang di luar `<Text>` akan memicu error "Text strings must be rendered within a <Text> component" (detail di Bab 5).

Karena JSX dievaluasi sebagai ekspresi JavaScript, ia dapat disimpan dalam variabel, dikembalikan oleh fungsi, dan bahkan dipetakan dalam perulangan — inilah yang membuat list rendering menjadi mungkin, sebagaimana akan Anda lihat di Subbab 4.6.

### 4.3 Props

**Props** (kependekan dari properties, properti/atribut) adalah cara mengalirkan data dari komponen induk ke komponen anak. Bayangkan props sebagai "parameter fungsi" untuk komponen: komponen `KartuMahasiswa` tidak perlu tahu dari mana data mahasiswa berasal; ia cukup menerima satu objek `mahasiswa` lewat props dan menampilkannya. Dengan cara ini satu komponen yang sama dapat dipakai untuk menampilkan data yang berbeda-beda — inilah kunci keterpakai-ulangan (reusability).

File: components/KartuMahasiswa.jsx

```jsx
export default function KartuMahasiswa({ mahasiswa }) {
  return (
    <View>
      <Text>{mahasiswa.nama}</Text>
      <Text>NIM {mahasiswa.nim}</Text>
    </View>
  );
}
```

Penjelasan: parameter fungsi ditulis dalam kurung kurawal `{ mahasiswa }` — ini teknik **destructuring** yang sudah Anda pelajari di Bab 3 Subbab 3.6, cara singkat untuk "membuka bungkusan" objek props dan mengambil properti `mahasiswa`. Pemakaian komponen ini dari komponen induk pun terlihat seperti memakai elemen HTML biasa:

File: App.jsx

```jsx
<KartuMahasiswa
  mahasiswa={mahasiswaBudi}
/>
```

Ada dua sifat penting props. **Pertama, props bersifat read-only (hanya-baca):** komponen anak dilarang mengubah nilai props yang diterimanya; jika data perlu berubah, perubahan harus berasal dari komponen pemilik data tersebut (konsep ini disebut *lifting state up*, akan dibahas di Bab 9). **Kedua, props boleh memiliki nilai default.** Di React modern (termasuk React 19.2 yang dipakai buku ini), properti `defaultProps` pada functional component tidak diperlukan lagi; cukup gunakan nilai default parameter JavaScript, misalnya `function KartuMahasiswa({ mahasiswa = {} })`. Gaya ini lebih sederhana dan memanfaatkan fitur bahasa yang sudah Anda kuasai dari Bab 3.

Props juga memiliki bentuk khusus bernama **children** (anak): isi yang ditulis di antara tag pembuka dan penutup komponen otomatis menjadi prop `children`. Bentuk ini menjadi dasar komposisi komponen (Subbab 4.7) dan dipakai untuk membangun komponen *container* seperti kartu atau panel.

### 4.4 State

Jika props adalah data yang *masuk* dari luar dan tidak boleh diubah, **state** (keadaan) adalah data *internal* yang dimiliki komponen dan boleh berubah seiring waktu. Perubahan state inilah yang memicu re-render: setiap kali state berubah, React menjalankan ulang fungsi komponen dan menghitung tampilan baru. Inilah wujud nyata `UI = f(state)` — ubah state, layar mengikuti.

State dideklarasikan dengan hook **`useState`**. Hook (kait) adalah fungsi bawaan React berawalan `use` yang "mengaitkan" fitur React ke komponen fungsi. Bentuk pemakaiannya:

File: App.jsx

```jsx
const [kategoriProdi, setKategoriProdi] = useState('Semua');
```

Penjelasan: `useState('Semua')` menerima nilai awal `'Semua'` dan mengembalikan sepasang nilai: state itu sendiri (`kategoriProdi`) dan fungsi pengubahnya (**setter**) `setKategoriProdi`. Penamaan dengan `const [x, setX] = useState(...)` adalah konvensi destructuring array yang sudah Anda kenali di Bab 3. Ketika `setKategoriProdi('Informatika')` dipanggil, React menyimpan nilai baru, menjalankan ulang komponen, dan seluruh JSX yang bergantung pada `kategoriProdi` otomatis menyesuaikan.

Aturan emas state adalah **immutability** (ketidakberubahan): jangan pernah mengubah state secara langsung (`kategoriProdi = 'X'` atau `data.push(...)`), karena React tidak akan mendeteksi perubahan tersebut sehingga layar tidak diperbarui. Selalu buat nilai baru dan serahkan ke setter — misalnya `setData([...data, mahasiswaBaru])` menggunakan spread operator (Bab 3 Subbab 3.6) untuk membuat salinan array. Aturan ini berlaku untuk seluruh sisa buku ini dan menjadi salah satu sumber bug tersering di kalangan pemula.

Perbedaan props dan state dapat diringkas sebagai berikut:

| Aspek | Props | State |
|---|---|---|
| Asal data | dari komponen induk | internal komponen itu sendiri |
| Boleh berubah? | tidak (read-only) | ya, lewat setter |
| Memicu re-render? | ya, jika induk mengirim nilai baru | ya, jika setter dipanggil |
| Pemilik | komponen induk | komponen yang mendeklarasikannya |

Baik props maupun state pada akhirnya berujung pada hal yang sama: keduanya adalah data yang menentukan tampilan. Perbedaannya hanya siapa yang memiliki dan siapa yang boleh mengubah. Bab 8 dan Bab 9 akan menunjukkan bagaimana pola ini diperluas untuk form (data input) dan state yang dibagikan antar komponen (Context API).### 4.5 Event Handling

Aplikasi yang hanya menampilkan data belum berguna; pengguna harus bisa berinteraksi — menekan tombol, memilih kategori, membuka detail. **Event** (peristiwa) adalah sinyal bahwa sesuatu terjadi pada komponen (sentuhan, perubahan teks, dan sebagainya), dan **event handling** (penanganan peristiwa) adalah cara komponen merespons sinyal tersebut dengan memanggil fungsi tertentu.

Di React Native, event disampaikan lewat prop khusus berawalan `on` — yang paling umum adalah `onPress` (untuk sentuhan; setara `onClick` di web). Anda menyerahkan **referensi fungsi** (bukan hasil pemanggilannya) kepada prop tersebut:

File: components/KartuMahasiswa.jsx

```jsx
const ubahTampilDetail = () => {
  setDetailTampil((tampilSebelumnya) => !tampilSebelumnya);
};

<Pressable onPress={ubahTampilDetail}>
  <Text>Tampilkan Detail</Text>
</Pressable>
```

Penjelasan: `onPress={ubahTampilDetail}` menyerahkan fungsi tanpa tanda kurung pemanggil. Kesalahan klasik pemula adalah menulis `onPress={ubahTampilDetail()}` — dengan tanda kurung, fungsi justru *dijalankan seketika saat render* dan hasilnya (bukan fungsinya) yang diserahkan, sehingga tombol tidak berfungsi seperti diharapkan. Jika handler perlu membawa data, gunakan fungsi panah inline, misalnya `onPress={() => ubahKategoriProdi(prodi)}`. `Pressable` adalah komponen sentuh modern React Native yang menggantikan `TouchableOpacity` (dibahas penuh di Bab 5 Subbab 5.4); untuk bab ini kita langsung memakainya, dan pola `onPress`-nya identik untuk semua komponen sentuh.

Perhatikan bahwa handler di atas memakai **functional update**: `setDetailTampil((tampilSebelumnya) => !tampilSebelumnya)`. Bentuk ini menerima fungsi yang diberi nilai state lama dan mengembalikan nilai baru. Ia aman dipakai ketika nilai baru dihitung dari nilai lama dan state bisa saja diubah beberapa kali dalam satu gelombang pembaruan — pola yang akan Anda temui lagi di Bab 9.

### 4.6 Conditional dan List Rendering

Tidak semua bagian UI selalu tampil. Sering kali Anda perlu menampilkan sesuatu *jika* kondisi terpenuhi (misalnya pesan "Tidak ada data" saat daftar kosong) atau menampilkan *banyak* elemen serupa dari sebuah array (misalnya lima kartu mahasiswa). Dua kebutuhan ini disebut **conditional rendering** (rendering bersyarat) dan **list rendering** (rendering daftar).

Conditional rendering memanfaatkan ekspresi JavaScript yang mengembalikan nilai truthy/falsy (Bab 3 Subbab 3.2). Pola yang umum:

File: App.jsx

```jsx
{sedangMemuat ? (
  <Text>Memuat data mahasiswa...</Text>
) : (
  <DaftarMahasiswa data={dataTampil} />
)}
```

Penjelasan: operator ternary `? :` memilih salah satu tampilan; jika `sedangMemuat` bernilai `true`, tampil teks "Memuat data mahasiswa...", selain itu tampil daftar. Pola kedua memakai operator logika `&&` untuk menampilkan elemen hanya jika kondisi benar:

File: components/KartuMahasiswa.jsx

```jsx
{detailTampil && (
  <View style={styles.detail}>
    <Text>IPK: {mahasiswa.ipk.toFixed(2)}</Text>
  </View>
)}
```

Penjelasan: jika `detailTampil` bernilai `true`, ekspresi mengembalikan sisi kanan (`<View>` detail); jika `false`, ia mengembalikan `false` dan React tidak merender apa pun. Pilihan ketiga adalah mengembalikan `null` secara eksplisit dari dalam komponen — cara paling eksplisit untuk "jangan tampilkan apa pun".

Adapun list rendering dilakukan dengan `map` (Bab 3 Subbab 3.7): ubah sebuah array data menjadi array elemen JSX.

File: components/DaftarMahasiswa.jsx

```jsx
{data.map((mahasiswa) => (
  <KartuMahasiswa key={mahasiswa.id} mahasiswa={mahasiswa} />
))}
```

Penjelasan: untuk setiap anggota `data`, `map` menghasilkan satu elemen `<KartuMahasiswa>`. Dua hal patut dicermati. Pertama, `data` tidak pernah dimutasi — `map` mengembalikan array baru, konsisten dengan prinsip immutability. Kedua, setiap elemen daftar wajib diberi **key** (`key` kunci): identitas unik yang dipakai React untuk mencocokkan elemen lama dan baru ketika daftar berubah.

**Peringatan key:** key harus unik di antara saudara kandungnya dan **stabil** — nilainya tidak berubah-ubah antar render. Jika key hilang, React menampilkan peringatan di konsol: *"Each child in a list should have a unique key prop"*. Lebih berbahaya lagi jika key *berubah*: React bisa salah mencocokkan elemen, sehingga state internal komponen (misalnya `detailTampil` pada kartu) ikut tersangkut ke kartu yang salah. Praktik terbaik: pakai identitas data yang memang unik, seperti `mahasiswa.id`. **Jangan** memakai indeks array (`key={index}`) bila urutan daftar dapat berubah (penambahan, pengurutan, penghapusan) — indeks akan bergeser dan React kesulitan melacak komponen. Indeks baru dapat ditoleransi untuk daftar statis yang tidak pernah berubah, tetapi karena kebiasaan yang baik lebih murah daripada perbaikan di kemudian hari, buku ini konsisten memakai `id` sebagai key. Daftar dengan ribuan item dan performa scrolling akan ditangani `FlatList` di Bab 5 Subbab 5.6; untuk bab ini `View` + `map` sudah memadai karena jumlah data kecil.

### 4.7 Component Composition dan Reusable Component

**Component composition** (komposisi komponen) adalah praktik menyusun komponen besar dari komponen-komponen kecil: `App` memuat `DaftarMahasiswa`, `DaftarMahasiswa` memuat beberapa `KartuMahasiswa`. Setiap komponen punya satu tanggung jawab yang jelas, sehingga aplikasi menjadi kumpulan blok yang rapi, bukan satu file raksasa. Struktur folder menjadi kebiasaan sejak dini: komponen yang dipakai ulang ditaruh di folder `components/`, sementara `App.js` di akar project berperan sebagai perakit utama.

Keuntungan komposisi bukan hanya kerapian. Komponen kecil lebih mudah dipahami, diuji (lihat Bab 14), dan diganti tanpa menyentuh bagian lain. Ini juga sumber utama keterpakai-ulangan: satu komponen `KartuMahasiswa` yang sama dapat muncul di daftar mahasiswa, di detail, bahkan di layar lain pada project akhir, cukup dengan props yang berbeda — data berbeda, tampilan sama.

Ada dua pola penyaluran tampilan antar komponen: (1) lewat props biasa untuk data, dan (2) lewat **children** untuk "slot" antarkomponen. Pola children memungkinkan komponen menjadi wadah (container):

File: components/KartuInfo.jsx

```jsx
export default function KartuInfo({ judul, children }) {
  return (
    <View>
      <Text>{judul}</Text>
      {children}
    </View>
  );
}
```

Penjelasan: komponen `KartuInfo` menerima `judul` sebagai props dan `children` sebagai isi yang disisipkan pemakainya. Pemakaiannya di komponen lain: `<KartuInfo judul="Data Akademik">...isi bebas...</KartuInfo>` — isi di dalam tag menjadi `children`. Pola ini sangat lazim untuk kartu, panel, modal, dan halaman (layout), dan akan terlihat lagi di Bab 6 ketika menyusun UI halaman-halaman aplikasi.

Perlu disadari bahwa memecah komponen terlalu halus juga membawa ongkos: file bertambah banyak, dan alur data tersebar di banyak lapisan. Trade-off-nya adalah keseimbangan — pecah komponen ketika ia (a) dipakai ulang lebih dari satu tempat, atau (b) mulai terlalu panjang untuk dipahami sekilas. Aturan praktis ini lebih berguna daripada aturan jumlah baris yang kaku.

### 4.8 Hooks: `useState` dan `useEffect`

Hooks adalah jalan masuk ke fitur React dari komponen fungsi. Dua aturan yang tidak boleh dilanggar: **hooks hanya dipanggil di dalam fungsi komponen** (atau custom hook — Bab 9), dan **selalu dipanggil di tingkat atas komponen** — tidak di dalam percabangan (`if`), perulangan, atau fungsi bersarang. React mengandalkan urutan pemanggilan hooks yang sama di setiap render; melanggar aturan ini membuat React kehilangan jejak state. ESLint bawaan project Expo akan menegur Anda jika aturan ini dilanggar.

`useState` sudah dibahas di Subbab 4.4; dua hal yang pantas diperdalam. Pertama, nilai awal useState dapat berupa fungsi (`useState(() => hitungMahal())`) jika perhitungan awalnya mahal — fungsi hanya dijalankan sekali. Kedua, pada komponen dengan banyak state, lebih baik mendeklarasikan beberapa `useState` terpisah (misal `sedangMemuat` dan `kategoriProdi`) daripada satu objek besar, kecuali state-state itu memang selalu berubah bersamaan.

**`useEffect`** adalah hook untuk *efek samping* (side effect): pekerjaan yang terjadi di luar proses render, seperti membaca data, mengatur pengatur waktu (timer), atau berlangganan event. Render seharusnya murni — hanya menghitung tampilan dari props dan state; segala sesuatu yang "menyentuh dunia luar" ditempatkan di `useEffect`. Bentuknya:

File: App.js

```jsx
useEffect(() => {
  const timer = setTimeout(() => {
    setSedangMemuat(false);
  }, 2000);

  return () => clearTimeout(timer);
}, []);
```

Penjelasan: `useEffect` menerima dua argumen — fungsi efek dan **dependency array** (daftar ketergantungan). Fungsi efek dijalankan setelah komponen dirender. Array `[]` (kosong) berarti efek hanya dijalankan sekali setelah render pertama — momen ini disebut **mount** (komponen terpasang ke layar). Fungsi yang dikembalikan (`return () => clearTimeout(timer)`) adalah **cleanup** (pembersih): dipanggil ketika komponen dilepas dari layar (**unmount**) atau sebelum efek dijalankan ulang, untuk merapikan sumber daya — di sini membatalkan timer agar tidak memicu setState setelah komponen hilang. Tanpa cleanup, timer akan terus berjalan dan bisa menyebabkan peringatan serta kebocoran sumber daya.

Lifecycle (siklus hidup) komponen fungsi diringkas dalam tiga momen:

| Momen | Kapan terjadi | Cara menangkap |
|---|---|---|
| Mount (terpasang) | render pertama selesai | `useEffect(fn, [])` |
| Update (diperbarui) | ada dependency yang berubah | `useEffect(fn, [dep])` — efek dijalankan ulang |
| Unmount (dilepas) | komponen dihapus dari layar | fungsi cleanup dari efek |

Jika dependency array dihilangkan sama sekali (`useEffect(fn)`), efek dijalankan setiap render — jarang diinginkan dan sering menjadi sumber masalah performa. Jika dependency berisi state tertentu, efek dijalankan ulang setiap state itu berubah — seperti contoh peringatan pada Subbab Praktikum nanti. Catatan: di mode pengembangan, React sengaja menjalankan efek dua kali (fitur Strict Mode) untuk membantu menemukan efek yang tidak bersih; ini perilaku normal development, bukan bug kode Anda.

### 4.9 Pengantar `useMemo` dan `useCallback`

Setiap kali state berubah, seluruh komponen dijalankan ulang — termasuk semua perhitungan di dalamnya, meskipun hasilnya tidak berubah. Untuk daftar lima mahasiswa, menghitung ulang filter setiap render tidak terasa; tetapi untuk daftar ribuan data atau perhitungan berat, ini membuang waktu. **`useMemo`** (dari *memoization*, penembak-cache/penyimpanan hasil) menyimpan hasil perhitungan dan hanya menghitung ulang ketika dependency-nya berubah:

File: App.js

```jsx
const dataTampil = useMemo(() => {
  if (kategoriProdi === 'Semua') {
    return DATA_MAHASISWA;
  }
  return DATA_MAHASISWA.filter((m) => m.prodi === kategoriProdi);
}, [kategoriProdi]);
```

Penjelasan: fungsi di dalam `useMemo` dijalankan pada render pertama, lalu hasilnya dicache. Selama `kategoriProdi` tidak berubah, render berikutnya langsung memakai hasil cache — `filter` tidak dijalankan ulang. Ini berguna untuk komputasi yang memang mahal: agregasi data, pencarian, atau transformasi array besar.

**`useCallback`** adalah saudara `useMemo` untuk fungsi: ia mengembalikan fungsi yang *sama* (referensi stabil) selama dependency-nya tidak berubah, alih-alih membuat fungsi baru di tiap render. Kapan ini penting? Ketika fungsi tersebut diteruskan sebagai props ke komponen anak, dan anaknya dibungkus pembanding referensi (misalnya `React.memo` yang hanya merender ulang jika props berubah). Tanpa `useCallback`, fungsi baru setiap render membuat anak ikut di-render ulang secara percuma. Contoh:

File: App.js

```jsx
const ubahKategoriProdi = useCallback((kategori) => {
  setKategoriProdi(kategori);
}, []);
```

Penjelasan: fungsi `ubahKategoriProdi` dibuat sekali (dependency `[]`) dan referensinya stabil untuk semua render berikutnya, sehingga aman diteruskan ke komponen anak yang sensitif referensi.

Peringatan yang sama pentingnya: **jangan memakai `useMemo`/`useCallback` secara berlebihan.** Keduanya menyimpan data di memori dan menambah kompleksitas membaca kode; untuk komputasi ringan dan daftar kecil, biayanya lebih besar daripada manfaatnya. Gunakan `useCallback` hanya ketika fungsinya benar-benar diteruskan ke anak yang dibungkus `React.memo`; gunakan `useMemo` hanya ketika perhitungannya terukur mahal. Optimasi prematur (premature optimization) yang menebak-nebak tanpa data kinerja justru membuat kode lebih sulit dipelihara. Buku ini menerapkan aturan itu: pada Contoh dan Praktikum, `useMemo` dipakai untuk filter dan rata-rata IPK sebagai ilustrasi pola, dengan kesadaran bahwa pada data sekecil ini manfaatnya baru terasa bila jumlah data membesar.

## Contoh

**Contoh 1 — Komponen dengan props dan nilai default.** Komponen menerima props dan menampilkan data; nilai default disiapkan dengan sintaks parameter, bukan `defaultProps`.

File: components/KartuMahasiswa.jsx

```jsx
export default function KartuMahasiswa({ mahasiswa = { nama: 'Tanpa Nama' } }) {
  return (
    <View>
      <Text>{mahasiswa.nama}</Text>
      <Text>NIM {mahasiswa.nim}</Text>
    </View>
  );
}
```

Penjelasan: jika pemakai lupa mengirim props `mahasiswa`, komponen tetap berjalan dengan nilai default `{ nama: 'Tanpa Nama' }`. Perhatikan juga bahwa komponen ini murni: untuk props yang sama, tampilan yang dihasilkan selalu sama — sifat ini yang membuat komponen mudah diuji di Bab 14.

**Contoh 2 — Conditional rendering untuk detail.** State `detailTampil` mengendalikan kemunculan blok detail, dan teks tombol ikut berubah sesuai kondisi — contoh `UI = f(state)` dalam praktik.

File: components/KartuMahasiswa.jsx

```jsx
const [detailTampil, setDetailTampil] = useState(false);

<Pressable onPress={() => setDetailTampil((t) => !t)}>
  <Text>{detailTampil ? 'Sembunyikan Detail' : 'Tampilkan Detail'}</Text>
</Pressable>

{detailTampil && (
  <Text>Email: {mahasiswa.email}</Text>
)}
```

Penjelasan: baris ternary menentukan teks tombol; blok di bawahnya menggunakan `&&` agar detail hanya muncul saat state bernilai `true`. Satu state menggerakkan dua tampilan sekaligus — inilah daya tarik pendekatan deklaratif.

**Contoh 3 — List rendering dengan key.** Daftar lima mahasiswa (data baku buku ini, lihat Kontrak Penulisan) dirender dengan `map`; setiap elemen memakai `mahasiswa.id` sebagai key.

File: components/DaftarMahasiswa.jsx

```jsx
const DATA_MAHASISWA = [
  { id: 1, nim: '2201001', nama: 'Budi Santoso', prodi: 'Sistem Informasi' },
  { id: 2, nim: '2201002', nama: 'Siti Aminah', prodi: 'Teknik Informatika' },
  { id: 3, nim: '2201003', nama: 'Agus Wijaya', prodi: 'Informatika' },
  { id: 4, nim: '2201004', nama: 'Dewi Lestari', prodi: 'Rekayasa Perangkat Lunak' },
  { id: 5, nim: '2201005', nama: 'Rizky Pratama', prodi: 'Sistem Informasi' },
];

{DATA_MAHASISWA.map((mahasiswa) => (
  <KartuMahasiswa key={mahasiswa.id} mahasiswa={mahasiswa} />
))}
```

Penjelasan: `map` membungkus setiap objek mahasiswa menjadi elemen JSX. Key `mahasiswa.id` unik untuk kelima data dan tidak akan berubah ketika daftar diurutkan atau disaring — jauh lebih aman daripada indeks array.## Praktikum

### Tujuan Praktikum

Setelah menyelesaikan praktikum ini, mahasiswa mampu:

1. membuat komponen reusable `KartuMahasiswa` yang menerima props;
2. menerapkan state untuk menyembunyikan/menampilkan detail mahasiswa;
3. menerapkan list rendering dengan `map` + `key` pada data mahasiswa;
4. menerapkan conditional rendering (status memuat, daftar kosong, detail);
5. menerapkan `useEffect` (simulasi pemuatan data + cleanup) dan `useMemo` (filter serta rata-rata IPK).

### Kebutuhan

- Node.js LTS (minimal 22) dan npm (Bab 2 Subbab 2.1);
- project Expo SDK 57 dengan template blank (Bab 2 Subbab 2.7);
- Expo Go di perangkat fisik atau emulator (Bab 2 Subbab 2.4–2.5);
- editor kode (Buku ini mengasumsikan VS Code, Bab 2 Subbab 2.3).

### Persiapan

1. Buat project baru jika belum punya: `npx create-expo-app aplikasi-mahasiswa --template blank`, lalu `cd aplikasi-mahasiswa`.
2. Jalankan project dengan `npx expo start` dan buka aplikasi di Expo Go (lihat Bab 2 Subbab 2.9) hingga layar awal template muncul.
3. Di editor, buka file `App.js` dan pastikan struktur folder sebagai berikut:

```text
aplikasi-mahasiswa/
├── App.js
└── components/
    ├── DaftarMahasiswa.js
    └── KartuMahasiswa.js
```

4. Buat folder `components` di root project, lalu buat dua file kosong `DaftarMahasiswa.js` dan `KartuMahasiswa.js` di dalamnya (isi mengikuti Langkah Kerja).

### Langkah Kerja

1. **Tulis data mahasiswa di `App.js`.** Buat konstanta `DATA_MAHASISWA` berisi lima objek mahasiswa (data baku buku ini) dan konstanta `PILIHAN_PRODI` berisi daftar kategori program studi. Keduanya berada di luar komponen karena hanya data statis yang tidak berubah.
2. **Deklarasikan state.** Di dalam `App`, deklarasikan `kategoriProdi` (nilai awal `'Semua'`) dan `sedangMemuat` (nilai awal `true`).
3. **Simulasikan pemuatan data.** Tambahkan `useEffect` dengan `setTimeout` 2 detik yang mengubah `sedangMemuat` menjadi `false`, lengkap dengan cleanup `clearTimeout`.
4. **Siapkan data tampil.** Gunakan `useMemo` untuk memfilter `DATA_MAHASISWA` berdasarkan `kategoriProdi`, serta `useMemo` kedua untuk menghitung rata-rata IPK dari data yang tampil.
5. **Tulis komponen `KartuMahasiswa`.** Komponen menerima props `mahasiswa`, memiliki state `detailTampil`, tombol `Pressable` untuk menukar (toggle) detail, dan blok detail yang muncul bersyarat.
6. **Tulis komponen `DaftarMahasiswa`.** Komponen menerima props `data`, menampilkan pesan kosong jika `data.length === 0`, dan memetakan data menjadi kartu dengan `key={mahasiswa.id}`.
7. **Rakit semuanya di `App.js`.** Tampilkan judul, tombol-tombol kategori program studi, baris ringkasan (jumlah mahasiswa + rata-rata IPK), dan `DaftarMahasiswa`. Saat `sedangMemuat` bernilai `true`, tampilkan teks "Memuat data mahasiswa...".
8. **Simpan semua file** dan amati layar Expo Go — aplikasi hasil develop ulang secara otomatis (hot reload).

### Kode

File: App.js

```jsx
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import DaftarMahasiswa from './components/DaftarMahasiswa';

const DATA_MAHASISWA = [
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
    ipk: 3.20,
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

const PILIHAN_PRODI = [
  'Semua',
  'Sistem Informasi',
  'Teknik Informatika',
  'Informatika',
  'Rekayasa Perangkat Lunak',
];

export default function App() {
  const [kategoriProdi, setKategoriProdi] = useState('Semua');
  const [sedangMemuat, setSedangMemuat] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSedangMemuat(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const dataTampil = useMemo(() => {
    if (kategoriProdi === 'Semua') {
      return DATA_MAHASISWA;
    }
    return DATA_MAHASISWA.filter((m) => m.prodi === kategoriProdi);
  }, [kategoriProdi]);

  const rataRataIpk = useMemo(() => {
    if (dataTampil.length === 0) {
      return 0;
    }
    const total = dataTampil.reduce((jumlah, m) => jumlah + m.ipk, 0);
    return total / dataTampil.length;
  }, [dataTampil]);

  return (
    <View style={styles.kontainer}>
      <Text style={styles.judul}>Data Mahasiswa</Text>

      {sedangMemuat ? (
        <Text style={styles.info}>Memuat data mahasiswa...</Text>
      ) : (
        <>
          <View style={styles.barisTombol}>
            {PILIHAN_PRODI.map((prodi) => {
              const aktif = kategoriProdi === prodi;
              return (
                <Pressable
                  key={prodi}
                  onPress={() => setKategoriProdi(prodi)}
                  style={[styles.tombol, aktif && styles.tombolAktif]}
                >
                  <Text style={[styles.teksTombol, aktif && styles.teksTombolAktif]}>
                    {prodi}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.ringkasan}>
            Menampilkan {dataTampil.length} mahasiswa · rata-rata IPK:{' '}
            {rataRataIpk.toFixed(2)}
          </Text>

          <DaftarMahasiswa data={dataTampil} />
        </>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  kontainer: {
    flex: 1,
    backgroundColor: '#f2f4f8',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  judul: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  info: {
    fontSize: 16,
    color: '#555555',
    marginTop: 24,
  },
  barisTombol: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  tombol: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tombolAktif: {
    backgroundColor: '#1565c0',
  },
  teksTombol: {
    color: '#1565c0',
    fontSize: 13,
  },
  teksTombolAktif: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  ringkasan: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 10,
  },
});
```

File: components/DaftarMahasiswa.js

```jsx
import { StyleSheet, Text, View } from 'react-native';
import KartuMahasiswa from './KartuMahasiswa';

export default function DaftarMahasiswa({ data }) {
  if (data.length === 0) {
    return (
      <View style={styles.kontainer}>
        <Text style={styles.teksKosong}>
          Tidak ada mahasiswa pada kategori ini.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.kontainer}>
      {data.map((mahasiswa) => (
        <KartuMahasiswa key={mahasiswa.id} mahasiswa={mahasiswa} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  kontainer: {
    gap: 10,
  },
  teksKosong: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginTop: 24,
  },
});
```

File: components/KartuMahasiswa.js

```jsx
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function KartuMahasiswa({ mahasiswa }) {
  const [detailTampil, setDetailTampil] = useState(false);

  const ubahTampilDetail = () => {
    setDetailTampil((tampilSebelumnya) => !tampilSebelumnya);
  };

  return (
    <View style={styles.kartu}>
      <View style={styles.barisUtama}>
        <View style={styles.bagianKiri}>
          <Text style={styles.nama}>{mahasiswa.nama}</Text>
          <Text style={styles.nim}>NIM {mahasiswa.nim}</Text>
        </View>
        <View style={styles.bagianKanan}>
          <Text style={styles.prodi}>{mahasiswa.prodi}</Text>
          <Text style={styles.angkatan}>Angkatan {mahasiswa.angkatan}</Text>
        </View>
      </View>

      <Pressable style={styles.tombol} onPress={ubahTampilDetail}>
        <Text style={styles.teksTombol}>
          {detailTampil ? 'Sembunyikan Detail' : 'Tampilkan Detail'}
        </Text>
      </Pressable>

      {detailTampil && (
        <View style={styles.detail}>
          <Text style={styles.teksDetail}>IPK: {mahasiswa.ipk.toFixed(2)}</Text>
          <Text style={styles.teksDetail}>Email: {mahasiswa.email}</Text>
          <Text style={styles.teksDetail}>Telepon: {mahasiswa.telepon}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  barisUtama: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bagianKiri: {
    flex: 1,
  },
  bagianKanan: {
    alignItems: 'flex-end',
  },
  nama: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  nim: {
    fontSize: 13,
    color: '#555555',
    marginTop: 2,
  },
  prodi: {
    fontSize: 13,
    color: '#1565c0',
    fontWeight: '600',
  },
  angkatan: {
    fontSize: 12,
    color: '#777777',
    marginTop: 2,
  },
  tombol: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  teksTombol: {
    color: '#1565c0',
    fontWeight: '600',
  },
  detail: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 10,
  },
  teksDetail: {
    fontSize: 13,
    color: '#333333',
    marginBottom: 4,
  },
});
```

### Penjelasan Kode

**`App.js`** adalah perakit utama yang memegang seluruh state aplikasi. Konstanta `DATA_MAHASISWA` berisi lima data baku mahasiswa buku ini (`id`, `nim`, `nama`, `prodi`, `angkatan`, `ipk`, `email`, `telepon`) dan `PILIHAN_PRODI` berisi lima kategori; keduanya dideklarasikan di luar komponen karena bersifat statis dan tidak perlu dibuat ulang setiap render. Dua state dideklarasikan: `kategoriProdi` mengendalikan filter, `sedangMemuat` mengendalikan tampilan status pemuatan.

`useEffect` dengan dependency `[]` menyimulasikan pengambilan data dari server: setelah 2 detik, `sedangMemuat` menjadi `false`. Cleanup `clearTimeout(timer)` memastikan timer dibatalkan jika komponen dilepas sebelum 2 detik — ini adalah pola yang akan menjadi dasar **loading state** saat aplikasi benar-benar terhubung ke REST API di Bab 10. Dua blok `useMemo` berisi logika murni: yang pertama memfilter data berdasarkan kategori (mengembalikan array asli tanpa menyalin saat kategori `'Semua'`), yang kedua menghitung rata-rata IPK dengan `reduce` dan menanganinya jika daftar kosong (hasil `0`). Keduanya hanya dihitung ulang saat dependency-nya berubah — `kategoriProdi` untuk filter, `dataTampil` untuk rata-rata.

Bagian JSX di dalam `return` memanfaatkan seluruh materi bab ini sekaligus: ternary `sedangMemuat ? ... : ...` memilih tampilan status atau isi; fragment `<>...</>` membungkus tiga elemen saudara tanpa menambah elemen visual; `PILIHAN_PRODI.map(...)` merender tombol kategori dengan `key={prodi}` (unik karena nama kategori tidak ada duanya) dan `style={[styles.tombol, aktif && styles.tombolAktif]}` untuk menyalakan tombol yang aktif; `DaftarMahasiswa` menerima `dataTampil` sebagai props. Perhatikan bahwa handler tombol ditulis inline `onPress={() => setKategoriProdi(prodi)}` — pola tepat ketika handler perlu membawa data.

**`DaftarMahasiswa.js`** adalah komponen perantara (komposisi!) yang hanya bertanggung jawab pada satu hal: mengubah array data menjadi daftar kartu. Ia mendestructuring props `{ data }`, mengecek kosong dengan `if (data.length === 0)` dan mengembalikan teks "Tidak ada mahasiswa pada kategori ini." — contoh conditional rendering dengan cabang eksplisit, sekaligus **empty state** yang akan menjadi standar seluruh aplikasi pada bab-bab berikutnya. Jika data ada, `data.map(...)` merender satu `KartuMahasiswa` per objek dengan `key={mahasiswa.id}` — perhatikan bahwa key diberikan di sini, di titik pemetaan, bukan di dalam `KartuMahasiswa`.

**`KartuMahasiswa.js`** adalah komponen reusable terkecil namun paling "hidup": ia memiliki state sendiri (`detailTampil`), sehingga setiap kartu mengelola tampilan detailnya secara independen — menekan tombol pada kartu Budi tidak memengaruhi kartu Siti. `setDetailTampil((tampilSebelumnya) => !tampilSebelumnya)` memakai functional update karena nilai baru dihitung dari nilai lama. Teks tombol ditentukan ternary, blok detail muncul dengan `detailTampil && (...)`, dan `toFixed(2)` memformat IPK menjadi dua angka desimal. Secara visual, kartu memanfaatkan `View` dengan `flexDirection: 'row'` untuk membagi nama/NIM (kiri) dan program studi/angkatan (kanan), `justifyContent: 'space-between'` untuk merenggangkan keduanya, serta bayangan ringan (`elevation`, `shadow*`) — detail gaya ini dibahas lengkap di Bab 5.

### Hasil yang Diharapkan

Saat aplikasi dibuka, perhatikan urutan kejadian berikut:

1. Selama kurang lebih 2 detik, layar hanya menampilkan judul "Data Mahasiswa" dan teks "Memuat data mahasiswa...".
2. Setelah itu muncul lima tombol kategori (Semua, Sistem Informasi, Teknik Informatika, Informatika, Rekayasa Perangkat Lunak) dengan latar biru pada tombol aktif, baris ringkasan "Menampilkan 5 mahasiswa · rata-rata IPK: 3.41", dan lima kartu mahasiswa (Budi Santoso, Siti Aminah, Agus Wijaya, Dewi Lestari, Rizky Pratama).
3. Menekan "Tampilkan Detail" pada sebuah kartu menampilkan IPK, email, dan telepon mahasiswa tersebut; teks tombol berubah menjadi "Sembunyikan Detail"; menekan sekali lagi menyembunyikannya. Kartu lain tidak terpengaruh.
4. Menekan kategori "Sistem Informasi" menyaring daftar menjadi 2 mahasiswa (Budi Santoso dan Rizky Pratama); ringkasan berubah menjadi "Menampilkan 2 mahasiswa · rata-rata IPK: 3.20" (nilai 3.45 dan 2.95).
5. Menekan kategori "Rekayasa Perangkat Lunak" menampilkan 1 kartu (Dewi Lestari) dengan rata-rata IPK 3.61.

Verifikasi tambahan: buka konsol Metro (tekan `j` di terminal `npx expo start` atau lihat terminal) — tidak boleh ada peringatan *"Each child in a list should have a unique key prop"* maupun error merah (RedBox) di layar.

### Troubleshooting

**Masalah:** Layar menampilkan peringatan *"Each child in a list should have a unique key prop"* di konsol, atau perilaku kartu aneh (detail terbuka pada kartu yang salah setelah menyaring).
**Penyebab:** Elemen daftar tidak diberi `key`, atau key memakai indeks array (`key={index}`) sehingga identitas bergeser ketika daftar berubah.
**Solusi:** Beri `key` pada elemen hasil `map` dengan nilai yang unik dan stabil, misalnya `key={mahasiswa.id}` — dan pastikan key diletakkan pada elemen yang dihasilkan `map`, bukan di dalam `KartuMahasiswa`.
**Pencegahan:** Biasakan memakai identitas data (`id`) sebagai key sejak awal; hindari `key={index}` kecuali untuk daftar statis yang tidak pernah berubah.

**Masalah:** Tombol kategori atau tombol detail tidak bereaksi sama sekali saat ditekan.
**Penyebab:** Handler ditulis dengan tanda kurung pemanggil, misalnya `onPress={ubahTampilDetail()}` — fungsi dijalankan saat render, bukan saat ditekan; atau state diubah langsung tanpa setter.
**Solusi:** Tulis `onPress={ubahTampilDetail}` (referensi fungsi) atau `onPress={() => setKategoriProdi(prodi)}` untuk handler berparameter; pastikan semua perubahan state melalui setter.
**Pencegahan:** Setelah menulis JSX, periksa ulang semua prop `onPress`; jika fungsi butuh parameter, gunakan fungsi panah inline.

**Masalah:** Layar menampilkan error merah *"Text strings must be rendered within a `<Text>` component"*.
**Penyebab:** Ada string teks telanjang (misalnya dari `{nama}`) yang tidak dibungkus komponen `Text`.
**Solusi:** Bungkus setiap teks dengan `<Text>...</Text>`; periksa juga hasil `map` apakah ekspresi string dikembalikan langsung.
**Pencegahan:** Ingat aturan JSX React Native: teks hanya sah di dalam komponen `Text` (Bab 5 akan membahas komponen ini lebih lanjut).

**Masalah:** Teks "Memuat data mahasiswa..." tidak pernah hilang, atau sebaliknya langsung hilang tanpa jeda.
**Penyebab:** `setTimeout` tidak pernah mengeksekusi `setSedangMemuat(false)` — misalnya karena dependency array salah (efek dijalankan ulang terus) atau timer dibatalkan cleanup setiap render.
**Solusi:** Pastikan efek ditulis `useEffect(..., [])` agar berjalan sekali setelah mount, dan `setSedangMemuat(false)` berada di dalam fungsi efek.
**Pencegahan:** Untuk simulasi jeda seperti ini selalu gunakan dependency `[]`; gunakan dependency berisi state hanya jika efek memang harus mengikuti perubahan state tersebut.

**Masalah:** Aplikasi berhenti dengan pesan *"Maximum update depth exceeded"*.
**Penyebab:** Terjadi lingkaran pembaruan: ada pemanggilan setter state di dalam badan komponen atau efek tanpa dependency yang memicu render, yang memicu render lagi, dan seterusnya.
**Solusi:** Pindahkan semua pemanggilan setter ke dalam handler event atau `useEffect` dengan dependency yang tepat; jangan pernah memanggil setter langsung di badan fungsi komponen.
**Pencegahan:** Saat menambah logic baru, tanyakan: "kapan fungsi ini dipanggil?" — jika jawabannya "setiap render", kemungkinan besar itu bug.

## Studi Kasus

**Menyajikan Data Mahasiswa Secara Dinamis untuk Bagian Akademik.** Bagian administrasi akademik (BAAK) sebuah perguruan tinggi melayani puluhan pertanyaan per hari: berapa mahasiswa aktif per program studi, siapa saja angkatan tertentu, dan data kontak mana yang valid. Petugas dulu menjawabnya dengan membuka berkas spreadsheet yang harus disaring manual — lambat dan rawan salah salin. Pimpinan meminta aplikasi mobile sederhana yang *menampilkan data mahasiswa secara dinamis*: penyaringan per program studi, informasi kontak yang dapat dibuka-tutup, dan ringkasan agregat (jumlah mahasiswa, rata-rata IPK) yang selalu mutakhir.

Kasus ini dipilih karena memuat seluruh materi bab dalam satu kebutuhan nyata, dan karena ia adalah cikal bakal Aplikasi Manajemen Data Mahasiswa yang akan dibangun bertahap menuju project akhir Sistem Informasi Akademik Mobile. Analisis keterkaitannya:

- *Rendahnya kepercayaan data* (petugas salah salin) menunjukkan mengapa React memisahkan data (state) dari tampilan: satu sumber kebenaran — ubah state, semua layar yang bergantung padanya ikut berubah, mustahil ada dua versi angka. Inilah keunggulan deklaratif atas imperatif dalam konteks SI: konsistensi data lintas tampilan.
- *Penyaringan per prodi* adalah list rendering + conditional rendering. Pada bab ini data masih baku di dalam kode; ketika data datang dari server (Bab 10), struktur komponen tidak berubah — hanya sumber `DATA_MAHASISWA` yang diganti `fetch`. Pemikiran "data terpisah dari tampilan" sejak awal membuat migrasi ini hampir tanpa biaya.
- *Kartu yang dapat dibuka-tutup* menunjukkan state lokal: setiap kartu berdiri sendiri, dan kekeliruan satu kartu tidak merembet ke kartu lain — analogi penting dalam sistem informasi: isolasi kesalahan per unit.
- *Rata-rata IPK yang terhitung otomatis* adalah wujud `UI = f(state)`: agregat dihitung dari data, bukan diketik manual, sehingga mustahil tidak sinkron dengan daftar yang tampil. Logika agregat diletakkan dengan `useMemo` sebagai fungsi murni yang terpisah dari tampilan — pola yang akan diuji otomatis di Bab 14.

Trade-off yang perlu disadari: pendekatan "state di komponen induk" (seperti `App`) bekerja baik untuk satu layar, tetapi saat data dibutuhkan banyak layar (daftar, detail, form), state harus dinaikkan atau dibagikan — inilah jembatan menuju *lifting state up* dan Context API di Bab 9. Jadi, apa yang Anda bangun di bab ini bukan sekadar latihan; ia adalah fondasi arsitektur yang akan tumbuh.

## Latihan

### Soal Pemahaman

1. Jelaskan perbedaan pendekatan imperatif dan deklaratif dalam membangun antarmuka, dan berikan contoh kalimat sehari-hari untuk masing-masing.
2. Sebutkan empat aturan penulisan JSX, lalu jelaskan mengapa JSX memerlukan satu elemen akar.
3. Apa perbedaan props dan state? Mengapa props tidak boleh diubah oleh komponen penerimanya?
4. Mengapa React menampilkan peringatan ketika elemen daftar tidak diberi `key`? Apa risiko memakai indeks array sebagai `key`?
5. Apa fungsi dependency array pada `useEffect`? Jelaskan perilaku `[]`, `[dep]`, dan tanpa array sama sekali.
6. Kapan sebaiknya `useMemo` dan `useCallback` digunakan, dan mengapa keduanya tidak boleh dipakai berlebihan?

### Soal Praktik

1. Tambahkan tombol "Urutkan berdasarkan Nama" pada `App.js` praktikum yang mengurutkan daftar tampil secara alfabetis (gunakan `sort` dan `toLocaleCompare` dari Bab 3). Pastikan rata-rata IPK ikut berubah mengikuti urutan data, dan jelaskan mengapa tombol ini tidak memerlukan `key` baru pada kartu.
2. Ubah `KartuMahasiswa` sehingga IPK ditampilkan dengan warna berbeda: hijau jika ≥ 3.50, kuning jika 3.00–3.49, merah jika < 3.00 (gunakan conditional rendering pada `style`). Uji dengan data Budi (3.45), Siti (3.82), dan Rizky (2.95).
3. Buat komponen baru `RingkasanData` yang menerima props `jumlah` dan `rataRata`, menampilkan keduanya dalam satu baris, lalu pakai komponen tersebut di `App.js` menggantikan `Text` ringkasan yang ada sekarang. Bandingkan: apa keuntungan komponen ini jika ringkasan akan dipakai di dua layar berbeda?

### Soal Analisis

1. Bandingkan dua implementasi berikut untuk memfilter daftar mahasiswa: (a) menghitung `filter` langsung di badan komponen setiap render tanpa `useMemo`, dan (b) membungkusnya dengan `useMemo`. Analisislah kapan (a) lebih masuk akal digunakan, kapan (b) diperlukan, serta ongkos yang harus dibayar untuk masing-masing (kinerja, keterbacaan, memori). Kaitkan jawaban Anda dengan situasi nyata: daftar 5 mahasiswa vs daftar 10.000 mahasiswa dari server.

## Tantangan

1. **Data semester.** Kembangkan `KartuMahasiswa` agar menampilkan label "Baru" di samping nama jika mahasiswa angkatan 2024 (Rizky Pratama), menggunakan conditional rendering. Tambahkan tombol yang memfilter "Angkatan 2023" dan terapkan pola yang sama dengan filter prodi.
2. **Sinkronisasi antar kartu.** Tambahkan state di `App` bernama `mahasiswaTerpilih` yang menyimpan `id` mahasiswa yang sedang dibuka detailnya; kartu hanya menampilkan detail jika `mahasiswa.id === mahasiswaTerpilih` (bandingkan perilakunya dengan state lokal `detailTampil` sekarang — kapan masing-masing pola lebih tepat? Diskusikan dan tuliskan jawaban Anda). Ini adalah langkah awal memahami *lifting state up* yang dibahas di Bab 9.

## Rangkuman

1. React menganut pendekatan deklaratif: `UI = f(state)` — tampilan dihitung dari data, dan React memperbarui layar secara otomatis saat state berubah.
2. Komponen adalah fungsi yang mengembalikan JSX; React modern memakai functional component, bukan class component.
3. JSX memiliki aturan: satu elemen akar, semua tag ditutup, atribut camelCase, ekspresi dalam `{}`, komentar `{/* */}`.
4. Props adalah data masuk yang read-only; nilai default dibuat dengan parameter fungsi, bukan `defaultProps`.
5. State adalah data internal yang diubah lewat setter, selalu secara immutable (salin dulu, jangan mutasi).
6. Event handling menyerahkan referensi fungsi ke prop `on*`, misalnya `onPress`; hindari memanggil fungsi dengan tanda kurung pada saat render.
7. Conditional rendering memakai ternary, `&&`, atau `null`; list rendering memakai `map` dengan `key` yang unik dan stabil (pakai `id`, hindari indeks).
8. Komposisi komponen (termasuk prop `children`) menghasilkan komponen reusable dengan tanggung jawab tunggal.
9. `useEffect` menangani efek samping dengan tiga momen lifecycle (mount, update, unmount) dan wajib memiliki cleanup untuk sumber daya seperti timer.
10. `useMemo` dan `useCallback` menyimpan hasil/fungsi agar tidak dihitung ulang; gunakan hanya ketika terukur perlu, bukan sebagai kebiasaan.

## Refleksi

1. Sebelum bab ini, bagaimana Anda membayangkan cara kerja aplikasi memperbarui layar? Manakah intuisi yang berubah setelah memahami `UI = f(state)`?
2. Pernahkah Anda mengalami bug yang sulit dilacak karena "data berubah tetapi tampilan tidak"? Bagaimana konsep immutability mencegah masalah serupa?
3. Ketika membangun daftar, Anda sudah terbiasa memakai `key` yang benar. Bagaimana kebiasaan kecil semacam ini memengaruhi kualitas kode Anda di tim nyata?
4. Bagian mana dari bab ini yang paling menantang — memahami hooks, komposisi, atau optimasi? Strategi apa yang akan Anda pakai untuk menguasainya?

## Evaluasi Bab

### Pilihan Ganda

1. Pernyataan yang paling tepat tentang pendekatan deklaratif di React adalah ...
   A. pengembang menulis perintah langsung untuk mengubah elemen layar satu per satu
   B. pengembang mendeskripsikan tampilan berdasarkan state dan React yang memperbarui layar
   C. React menyimpan semua data di file terpisah dari komponen
   D. tampilan dihitung ulang hanya saat aplikasi dimulai

2. Perhatikan kode `const [kategori, setKategori] = useState('Semua');`. Pernyataan yang benar adalah ...
   A. `kategori` adalah props yang dikirim komponen induk
   B. `setKategori` dipanggil untuk membaca nilai state
   C. `setKategori` adalah fungsi untuk mengubah state dan memicu render ulang
   D. `useState` harus dipanggil di dalam percabangan agar efisien

3. Penulisan handler yang benar agar fungsi bernama `simpanData` dipanggil saat tombol ditekan adalah ...
   A. `onPress={simpanData()}`
   B. `onPress="simpanData"`
   C. `onPress={simpanData}`
   D. `onPress={() => simpanData}`

4. Jika elemen daftar tidak diberi `key`, maka ...
   A. aplikasi langsung berhenti dan tidak dapat dijalankan
   B. React menampilkan peringatan dan dapat salah mencocokkan elemen saat daftar berubah
   C. data daftar otomatis diurutkan
   D. tidak ada dampak apa pun selama data berjumlah kurang dari sepuluh

5. Cara yang disarankan untuk memberi `key` pada daftar mahasiswa adalah ...
   A. `key={index}` selalu, karena sederhana
   B. `key={Math.random()}` agar selalu unik
   C. `key={mahasiswa.id}` karena unik dan stabil
   D. key tidak perlu diberikan jika memakai `map`

6. Fungsi yang dikembalikan dari dalam `useEffect` (misalnya `return () => clearTimeout(timer)`) akan dipanggil ketika ...
   A. komponen pertama kali dirender
   B. setiap kali state apa pun berubah
   C. komponen dilepas dari layar (unmount) atau sebelum efek dijalankan ulang
   D. pengguna menekan tombol kembali di perangkat

7. `useEffect(() => {...}, [])` berarti efek ...
   A. dijalankan setelah setiap render
   B. dijalankan sekali setelah render pertama (mount)
   C. dijalankan hanya saat pengguna berinteraksi
   D. tidak pernah dijalankan

8. Pernyataan yang benar tentang `useMemo` adalah ...
   A. ia membuat komponen lebih cepat di semua kondisi tanpa biaya apa pun
   B. ia menyimpan hasil perhitungan dan menghitung ulang hanya jika dependency berubah
   C. ia menggantikan `useState` untuk semua kebutuhan state
   D. ia harus dipakai pada setiap pemanggilan `map` agar daftar cepat

### Soal Uraian

1. Jelaskan alur kejadian di React ketika pengguna menekan tombol "Tampilkan Detail" pada `KartuMahasiswa`: mulai dari event, perubahan state, hingga munculnya blok detail di layar. Sertakan peran setter, re-render, dan conditional rendering dalam penjelasan Anda.
2. Bandingkan props dan state dalam tabel serta jelaskan skenario: pada aplikasi daftar mahasiswa, data mana yang sebaiknya menjadi props dan data mana yang sebaiknya menjadi state? Berikan tiga contoh konkret dari praktikum.
3. Mengapa mutasi state secara langsung (misalnya `data.push(mahasiswaBaru)`) tidak memperbarui layar, padahal nilai array sudah berubah? Jelaskan kaitannya dengan cara React mendeteksi perubahan, lalu tuliskan perbaikan yang benar.

### Kunci Jawaban

<details>
<summary>Klik untuk melihat kunci jawaban pilihan ganda</summary>

1. **B** — React menganut deklaratif: deskripsi tampilan dari state, pembaruan ditangani React.
2. **C** — `setKategori` adalah setter yang mengubah state dan memicu render ulang.
3. **C** — serahkan referensi fungsi (`onPress={simpanData}`); tanda kurung memanggil lebih dulu.
4. **B** — tanpa key React memberi peringatan dan berisiko salah mencocokkan elemen.
5. **C** — `mahasiswa.id` unik dan stabil; `Math.random()` justru berubah setiap render.
6. **C** — cleanup dipanggil saat unmount atau sebelum efek dijalankan ulang.
7. **B** — dependency `[]` berarti efek hanya berjalan sekali setelah render pertama.
8. **B** — useMemo menyimpan hasil dan menghitung ulang hanya saat dependency berubah.

</details>