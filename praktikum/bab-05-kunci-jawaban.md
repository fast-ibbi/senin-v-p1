# Kunci Jawaban & Panduan Penilaian — Praktikum Bab 5

> **Untuk asisten/dosen.** File ini memuat jawaban model dan kesalahan umum yang perlu diperhatikan saat menilai. Jangan dibagikan ke mahasiswa.
>
> **Catatan versi:** perilaku bawaan `SafeAreaView`, kebijakan *edge-to-edge* Android 15, dan default Flexbox dapat berubah antar rilis. Acuan pada kunci ini adalah Expo SDK 57 / React Native 0.86 sesuai buku; verifikasi ulang ke reactnative.dev dan docs.expo.dev bila rilis berubah.

---

## Soal 1 — Migrasi dari React Web (10 poin)

**Jawaban model:**

1. Lima perubahan dan dasar pada Tabel 5.1:

   ```jsx
   import { Image, Pressable, StyleSheet, Text, View } from "react-native";

   export default function Profil() {
     const nama = "Budi Santoso"; // sementara; sumber data nyata → Bab 10/11
     return (
       <Pressable style={styles.kartu} onPress={() => alert("Halo")}>
         <Text style={styles.judul}>Profil</Text>
         <Image source={{ uri: "https://example.com/foto.jpg" }} style={styles.foto} />
         <Text>Halo, {nama}</Text>
       </Pressable>
     );
   }

   const styles = StyleSheet.create({
     kartu: { padding: 16, backgroundColor: "#ffffff", borderRadius: 12 },
     judul: { color: "#1e3a8a", fontSize: 22, fontWeight: "bold" },
     foto: { width: 72, height: 72, borderRadius: 36 },
   });
   ```

   | Perubahan | Baris Tabel 5.1 |
   |---|---|
   | `div` → `View`/`Pressable` | Rendered element |
   | `h2`/`p` → `Text` | Rendered element |
   | `img` → `Image` + `source` | Rendered element |
   | `className`/CSS → `StyleSheet` | Styling |
   | `onClick` → `onPress` | Touch event |
   | `localStorage` → dihapus | Browser API |

2. `localStorage` adalah API **browser**. React Native tidak berjalan di dalam browser (tidak ada `document`, `window`, `localStorage`), jadi tidak ada yang bisa diganti namanya — mekanismenya tidak ada. Penggantinya adalah penyimpanan lokal perangkat pada **Bab 11** (AsyncStorage) dan data dari server pada **Bab 10**.

3. CSS hilang karena tidak ada berkas CSS di React Native: gaya adalah **objek JavaScript** melalui `StyleSheet.create`. `display: flex` tidak perlu ditulis karena seluruh layout sudah Flexbox; `borderRadius: 12` menjadi properti objek.

4. Yang tidak berubah: **komponen fungsi, props, state, dan hooks** — JSX tetap ditulis dengan cara yang sama. Alasannya, hanya *render target* yang berubah (DOM → komponen native), bukan model pemrogramannya.

**Penilaian:** 5 poin pemetaan (1 per baris benar); 2 poin jawaban `localStorage` + nama bab pengganti; 2 poin penjelasan CSS → StyleSheet; 1 poin "apa yang tetap sama".

**Kesalahan umum:** tetap memakai `className` lalu bingung gayanya tidak berlaku; menulis `<div>` dan berharap ada polyfill; menjawab "React Native adalah React versi baru" (bukan versi baru, melainkan render target berbeda).

---

## Soal 2 — Teks Hanya di Dalam `Text` (8 poin)

1. Baris `Sistem Informasi Akademik` ditulis langsung di dalam `View`. Hasilnya **red screen / error**, bukan sekadar peringatan, dengan pesan kira-kira:

   > `Text strings must be rendered within a <Text> component.`

2. Perbaikan: bungkus baris tersebut dengan `Text`.

   ```jsx
   <View style={styles.kartu}>
     <Text>Sistem Informasi Akademik</Text>
     <Text style={styles.judul}>Profil Mahasiswa</Text>
     <Text>Selamat datang di aplikasi <Text style={styles.tebal}>mobile</Text> kampus kami</Text>
     <Text numberOfLines={2}>Deskripsi panjang yang bisa memakan banyak baris…</Text>
   </View>
   ```

3. Manfaat `Text` bersarang: menebalkan **satu kata** di tengah kalimat tanpa memecah kalimat menjadi beberapa elemen. Jika diubah menjadi `View`, seluruh isi `View` tidak akan dirender sebagai teks — kembali ke error aturan pertama (dan `View` tidak mewarisi gaya teks).

4. Tanpa `numberOfLines={2}`, tinggi kartu mengikuti panjang teks sehingga kartu memanjang dan **seluruh komponen di bawahnya bergeser**. `numberOfLines` mengunci tinggi maksimum (dipotong dengan elipsis), sehingga tata letak stabil dan daftar tidak "melompat".

**Penilaian:** 3 poin reproduksi + pesan error; 2 poin perbaikan; 1 poin manfaat `Text` bersarang; 2 poin analisis `numberOfLines`.

**Kesalahan umum:** memperbaiki dengan membungkus seluruh `View` dengan `Text` (melewatkan maksud aturan); menyebut "warning" padahal ini error yang memunculkan red screen.

---

## Soal 3 — Dua Sumber Gambar & Placeholder (9 poin)

1. Tanpa `width`/`height`, gambar berukuran **0×0 piksel**. React Native tidak dapat menebak ukuran gambar yang belum selesai diunduh, dan tidak ada tata letak intrinsik seperti `<img>` di web. Perbaikan:

   ```jsx
   const styles = StyleSheet.create({
     foto: { width: 72, height: 72, borderRadius: 36 },
   });
   <Image source={{ uri: "..." }} style={styles.foto} resizeMode="cover" />
   ```

   `borderRadius: 36` = setengah lebar → lingkaran.

2. Dua cara:
   - `source={require("./assets/icon.png")}` → aset lokal, **di-bundle saat build**; selalu tersedia, tanpa jaringan, cocok untuk logo, ikon, dan ilustrasi bawaan.
   - `source={{ uri: "https://…" }}` → diunduh saat aplikasi berjalan; cocok untuk foto pengguna atau konten yang berubah-ubah, dan wajib punya `width`/`height` eksplisit.

3. Tanpa internet: kotak gambar tetap ada (karena dimensinya tertulis) tetapi **kosong**. `resizeMode="cover"` hanya mengatur cara gambar *yang sudah ada* mengisi kotak (memotong bagian berlebih); ia tidak mengunduh apa pun, jadi tidak menolong saat gambar gagal dimuat.

4. Contoh jawaban:

   ```jsx
   export default function AvatarPlaceholder({ nama, ukuran = 56 }) {
     const inisial = nama
       .split(" ")
       .slice(0, 2)
       .map((kata) => kata[0])
       .join("")
       .toUpperCase();

     return (
       <View
         style={{
           width: ukuran,
           height: ukuran,
           borderRadius: ukuran / 2,
           backgroundColor: "#2563eb",
           alignItems: "center",
           justifyContent: "center",
         }}
       >
         <Text style={{ color: "#ffffff", fontWeight: "bold" }}>{inisial}</Text>
       </View>
     );
   }
   ```

   Dipakai ketika foto belum tersedia, gagal dimuat, atau memang tidak ada — supaya kartu tidak menampilkan kotak kosong yang terlihat seperti bug.

**Penilaian:** 3 poin diagnosis nol piksel + perbaikan; 2 poin dua sumber + kapan dipakai; 2 poin penjelasan kegagalan jaringan; 2 poin komponen placeholder berfungsi (menerima props, inisial benar).

**Kesalahan umum:** menulis `src=` seperti tag `img` web; memakai `width: "100%"` tanpa tinggi sehingga gambar tetap tidak muncul; memakai `aspectRatio` tanpa menjelaskan; placeholder yang mengabaikan `nama` kosong (`nama[0]` error saat `nama` undefined — poin penuh bila ditangani).

---

## Soal 4 — `Button` vs `Pressable` (10 poin)

1. `Button` adalah tombol siap pakai bergaya platform (teks biru di iOS, tombol berwarna di Android) dengan properti terbatas: `title`, `onPress`, `color`, `disabled`. Yang **tidak bisa**: mengganti isi tombol (ikon + teks), mengatur gaya visual sepenuhnya (radius, padding, warna latar bebas), dan memakai umpan balik kustom saat ditekan. `Pressable` memberi ketiganya karena children-nya bebas dan `style` dapat berupa fungsi.

2. `pressed` bernilai `true` **hanya selama jari menekan** komponen, lalu kembali `false` saat dilepas. `styles.tombolTertekan` diletakkan **paling akhir** karena gaya di belakang **menimpa** gaya di depan; dengan begitu gaya tertekan menang atas gaya dasar, dan gaya dasar tidak perlu ditulis ulang.

3. `android_ripple={{ color: "#c9d9f8" }}` memunculkan efek riak **hanya di Android**. Di iOS tidak ada efek apa pun — `android_ripple` memang properti khusus Android, sehingga iOS tetap membutuhkan umpan balik lewat `pressed` (mis. `opacity`). Inilah contoh nyata bahwa satu properti tidak selalu lintas platform.

4. Properti: **`hitSlop`**.

   ```jsx
   <Pressable hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} … />
   ```

   `hitSlop` memperluas **area sentuh** di luar batas visual, sehingga target sentuh memenuhi ukuran nyaman (≈44×44 pt) tanpa mengubah tampilan. Alternatif yang juga diterima: `padding` pada pembungkus dengan margin negatif kompensasi — nilai penuh bila alasannya dijelaskan.

5. `Button` masih wajar untuk **prototipe cepat** atau tombol sekali pakai yang desainnya memang mengikuti gaya platform.

**Penilaian:** 3 poin perbandingan; 2 poin `pressed` + urutan array; 2 poin pengamatan ripple lintas platform; 2 poin `hitSlop`; 1 poin kapan `Button` wajar.

**Kesalahan umum:** menaruh gaya tertekan **di depan** array lalu menyimpulkan `pressed` tidak bekerja; mengharapkan ripple di iOS; menjawab "hitSlop memperbesar tombol" tanpa menyebut "tanpa mengubah tampilan".

---

## Soal 5 — `TextInput` Controlled Component (9 poin)

1. Kotak **tidak bisa diketik sama sekali** (nilai tidak berubah walau tombol ditekan). Sebab: `value={nama}` mengikat isi kotak pada state, sementara tidak ada `onChangeText` yang memperbarui state, sehingga setiap ketukan langsung "dibatalkan" oleh render berikutnya yang mengembalikan nilai lama. Ini gejala khas *controlled component* yang tidak lengkap.

2. Perbaikan kotak pertama:

   ```jsx
   <TextInput
     style={styles.input}
     value={nama}
     onChangeText={setNama}
     placeholder="Ketik nama lengkap"
   />
   ```

3. `maxLength={30}` menjamin **jumlah karakter yang dapat dimasukkan** pengguna tidak melebihi 30. Yang **tidak** dijamin: isi yang sah — bisa saja berisi 30 spasi, angka, atau karakter aneh. Validasi isi (wajib diisi, format, dsb.) adalah materi **Bab 8**.

4. Penghitung karakter:

   ```jsx
   <Text>{nama.length}/30</Text>
   ```

   `nama.length` adalah **nilai turunan** dari state `nama`; menyimpannya di `useState` terpisah berarti ada dua sumber kebenaran yang bisa berselisih (persis pelajaran Bab 4: turunan jangan dijadikan state).

5. Jika `onChangeText` dihapus tetapi `value` tetap ada, **pengguna tidak bisa mengubah isi kotak**. Gejala spesifik: kursor boleh muncul dan keyboard terbuka, tetapi setiap ketukan hilang seketika — kotak tampak "beku"/read-only.

**Penilaian:** 2 poin diagnosis; 2 poin perbaikan; 2 poin batas `maxLength`; 2 poin penghitung sebagai nilai turunan; 1 poin gejala "beku".

**Kesalahan umum:** memperbaiki dengan menghapus `value` (menjadi uncontrolled, melanggar pola buku); memakai `defaultValue` lalu menyebutnya controlled.

---

## Soal 6 — Satu Layar, Satu Scroller (12 poin)

1. Peringatan yang muncul (kurang lebih):

   > `VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.`

   Berbahaya karena `FlatList` mengandalkan pengukuran tinggi viewport dan posisi gulir untuk menentukan item mana yang dirender. `ScrollView` luar mengambil alih kendali gulir, sehingga perhitungan itu tidak lagi valid: virtualisasi rusak, memori dan waktu render membengkak, posisi gulir melompat.

2. Dua hal yang rusak: **(a) fungsional** — gulir menjadi kaku/tumpang tindih karena dua komponen berebut kendali; **(b) kinerja** — seluruh item dirender sekaligus (virtualisasi mati), sehingga daftar 1.000 baris memakan memori seperti `ScrollView`.

3. Perbaikan: `FlatList` menjadi scroller **terluar**, kartu profil dipindah ke `ListHeaderComponent`.

   ```jsx
   <FlatList
     data={DAFTAR_MAHASISWA}
     keyExtractor={(item) => item.id}
     ListHeaderComponent={
       <View style={styles.kartuProfil}>
         <Text style={styles.judul}>Profil Mahasiswa</Text>
         <Text>Total {DAFTAR_MAHASISWA.length} mahasiswa</Text>
       </View>
     }
     renderItem={({ item }) => <BarisMahasiswa mahasiswa={item} />}
   />
   ```

4. Satu `ScrollView` untuk seluruh halaman benar ketika **struktur halaman tetap dan pendek** — misalnya halaman formulir biodata, halaman detail satu mahasiswa, atau halaman pengaturan. Daftar panjang bukan kasusnya.

5. Berbahaya justru karena aplikasi **tetap berjalan**, sehingga tidak ada dorongan untuk memperbaikinya; akibatnya baru terasa saat data bertambah (gulir tersendat, memori naik, aplikasi di-*kill* OS). Cara menemukannya di proyek orang lain: membaca **Metro console** dan alat debugging pada **Bab 14** (React DevTools profiler, `console.warn`, pencarian `ScrollView` yang membungkus `FlatList`), bukan menebak dari gejala.

**Penilaian:** 4 poin reproduksi pesan + alasan; 2 poin dua kerusakan; 3 poin perbaikan berjalan dengan `ListHeaderComponent`; 1 poin kasus `ScrollView` tepat; 2 poin penalaran "warning senyap" + cara menemukan.

**Kesalahan umum:** mematikan peringatan dengan `LogBox.ignoreLogs` (menghapus gejala, bukan sebab — nilai 0 untuk butir 5); memindahkan kartu ke luar `ScrollView` tetapi tetap membungkus `FlatList` dengan `ScrollView` lain; memakai `nestedScrollEnabled` sebagai solusi.

---

## Soal 7 — Properti Wajib `FlatList` & `numColumns` (10 poin)

1. Properti yang hilang: **`keyExtractor`**. Peringatan yang muncul: `Each child in a list should have a unique "key" prop` (atau varian `VirtualizedList: missing keys for items`). Perbaikan: `keyExtractor={(item) => item.id}`.

   Dua syarat `key`/`keyExtractor`: **(a) unik** di antara saudara, dan **(b) stabil** — tidak berubah antar-render untuk entitas yang sama.

2. `index` berubah ketika data difilter atau diurutkan, sehingga React mencocokkan baris lama dengan data baru pada posisi yang sama; state lokal (mis. baris terpilih) menempel pada posisi, bukan pada mahasiswa. Ini pengulangan bug Bab 4 dalam bentuk `keyExtractor`. `item.id` tidak berubah saat urutan berubah.

3. Ketika `numColumns` berubah saat berjalan, `FlatList` tidak dapat mengubah struktur baris yang sudah terlanjur dirender (baris lama berisi 2 item, sedangkan mode baru mengharapkan 3). Hasilnya tampilan rusak/tidak konsisten. Solusi standar: beri `key` pada `FlatList` yang ikut berubah, sehingga React membuang daftar lama dan membangun yang baru.

   ```jsx
   <FlatList key={jumlahKolom} numColumns={jumlahKolom} … />
   ```

4. Empat properti lain dan situasinya:
   - `ItemSeparatorComponent` — garis/pemisah antar-baris tanpa menambah margin pada item.
   - `ListHeaderComponent` — konten tetap di atas daftar (kartu profil, judul) tanpa scroller kedua.
   - `ListEmptyComponent` — tampilan saat `data` kosong ("tidak ada mahasiswa").
   - `ListFooterComponent` — tombol "muat lebih banyak", total, atau catatan di akhir daftar.
   - (`numColumns` — grid 2/3 kolom.)

**Penilaian:** 3 poin properti hilang + perbaikan + dua syarat; 2 poin alasan `item.id`; 2 poin penjelasan `key` untuk `numColumns`; 3 poin empat properti dengan situasi tepat.

**Kesalahan umum:** mengisi `keyExtractor={(item) => Math.random()}` (menyebut "unik" tanpa "stabil"); menaruh `key` di dalam `BarisMahasiswa` alih-alih lewat `keyExtractor`.

---

## Soal 8 — Safe Area di Dua Platform (10 poin)

1. `SafeAreaView` bawaan `react-native` hanya berfungsi di **iOS**: di Android ia tidak menambahkan jarak apa pun, sehingga judul bisa tertutup status bar atau terpotong notch bila dijalankan *edge-to-edge*. Selain itu, dokumentasi React Native versi terbaru menandai `SafeAreaView` bawaan sebagai **deprecated** — inilah bagian bertanda "peka versi" yang wajib diverifikasi ke dokumentasi.

2. Perbaikan:

   ```bash
   npx expo install react-native-safe-area-context
   ```

   ```jsx
   import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

   export default function App() {
     return (
       <SafeAreaProvider>
         <SafeAreaView style={styles.layar} edges={["top", "bottom"]}>
           <Text style={styles.judul}>Profil Mahasiswa</Text>
         </SafeAreaView>
       </SafeAreaProvider>
     );
   }
   ```

   - Akar aplikasi: `SafeAreaProvider`.
   - Properti pengatur tepi: `edges` (`top`, `bottom`, `left`, `right`).

3. *Inset* adalah jarak aman (dalam piksel) yang disisakan sistem dari tepi layar. Tiga hal yang membuatnya perlu: **notch/kamera**, **status bar**, dan **home indicator** (garis geser di bawah pada iPhone).

4. Sejak Android 15 konten dirender **edge-to-edge** (menembus sampai tepi layar), sehingga tidak ada lagi jarak otomatis dari sistem. Tanpa penanganan safe area, judul/tombol bisa tertutup status bar atau gesture bar. Karena itu safe area menjadi **wajib**, bukan hiasan.

5. `paddingTop: 44` di-*hardcode* akan salah pada perangkat lain: tinggi status bar dan notch berbeda antar model (Android rendah, iPhone dengan notch, iPad), dan berubah saat rotasi atau saat keyboard muncul. Yang benar: ambil nilai nyata lewat `useSafeAreaInsets()` atau gunakan `SafeAreaView` dari pustaka.

**Penilaian:** 3 poin pengamatan iOS vs Android + status deprecated; 3 poin migrasi (perintah, `SafeAreaProvider`, `edges`); 2 poin definisi inset + tiga penyebab; 1 poin Android 15; 1 poin risiko hardcode.

**Kesalahan umum:** memasang `SafeAreaView` pustaka **tanpa** `SafeAreaProvider` di akar (nilai inset menjadi 0); menganggap `SafeAreaView` bawaan sudah lintas platform.

---

## Soal 9 — `StyleSheet`, Array Style, `Platform.select` (10 poin)

1. `StyleSheet.create` memvalidasi **nama properti** saat aplikasi dimuat, sehingga salah ketik (mis. `fontWight`) langsung memunculkan peringatan alih-alih gagal diam-diam seperti CSS. Keuntungan kedua: definisi gaya **terpusat di luar JSX**, sehingga komponen lebih mudah dibaca dan gaya dapat dipakai ulang.

   Catatan: `judulJudul` sendiri bukan salah ketik — ia hanya tidak pernah dipakai; yang dideteksi adalah kesalahan nama **properti**, bukan nama variabel style yang tidak direferensikan.

2. Satu array style:

   ```jsx
   <Pressable
     style={({ pressed }) => [
       styles.baris,
       aktif && styles.barisAktif,
       pressed && styles.barisTertekan,
     ]}
   >
     <Text>{mahasiswa.nama}</Text>
   </Pressable>
   ```

   Prioritas: **yang paling akhir menang**. `barisTertekan` menimpa `barisAktif`, yang menimpa `baris`. Nilai `false`/`null` diabaikan React Native, sehingga tidak merusak apa pun dan tidak ada kebutuhan `if/else`.

3. Tidak ada cascade karena setiap komponen **mendeklarasikan gayanya sendiri**; tidak ada pewarisan dari induk ke anak seperti air terjun di CSS. Untuk membuat tiga `Text` berwarna biru, warnanya harus dituliskan pada **gaya masing-masing** `Text` (atau dibungkus komponen kecil yang sudah membawa gaya itu). Pengecualian: sebagian properti teks memang diwarisi `Text` bersarang di iOS.

4. Bayangan dua platform:

   ```jsx
   kartu: {
     borderRadius: 12,
     ...Platform.select({
       ios: {
         shadowColor: "#000000",
         shadowOpacity: 0.15,
         shadowRadius: 6,
         shadowOffset: { width: 0, height: 2 },
       },
       android: { elevation: 3 },
       default: {},
     }),
   },
   ```

   iOS memakai empat properti `shadow*`; Android memakai `elevation`. Keduanya tidak saling menggantikan karena berasal dari sistem render yang berbeda: `elevation` juga memengaruhi urutan tumpukan (z-order) pada Android, sedangkan `shadow*` hanya menggambar bayangan. `default: {}` menjadi jaring pengaman agar objek gaya tetap sah di platform lain.

5. Aturan pemilihan:
   - `Platform.OS` — percabangan kecil dan cepat di dalam JSX/logika (satu nilai, satu baris).
   - `Platform.select` — perbedaan kecil berupa **nilai atau gaya** yang berbeda per platform (mis. bayangan, ukuran, warna) dan tetap ingin berada dalam satu objek/ekspresi.
   - Berkas `.ios.js` / `.android.js` — perbedaan **besar**: struktur komponen atau logika yang berbeda nyata, sehingga memisahkan berkas lebih jelas daripada menumpuk `if`.

**Penilaian:** 2 poin keunggulan `StyleSheet`; 3 poin array style tiga lapis; 2 poin tidak ada cascade; 2 poin `Platform.select` lengkap dua platform; 1 poin aturan pemilihan tiga alat.

**Kesalahan umum:** memakai `elevation` di iOS lalu menyimpulkan gaya bayangan tidak berfungsi; menulis `display: "flex"` (tidak diperlukan di RN); membuat dua variabel style terpisah dengan `if/else` alih-alih array.

---

## Soal 10 — Flexbox `column` & Layout Responsif (12 poin)

1. Kedua `View` **bertumpuk vertikal** (atas–bawah), bukan berdampingan. Sebab: mesin tata letak React Native adalah **Yoga**, dan default `flexDirection`-nya `column`, berbeda dari web yang default `row`. Alasannya, layar ponsel lebih alami dibaca dari atas ke bawah.

2. Per properti dalam konteks kode:
   - `justifyContent: "space-between"` pada `barisJudul` — judul di kiri, jumlah di kanan, sisa ruang di tengah.
   - `alignItems` (default `stretch`) — anak-anak meregang memenuhi tinggi baris pada sumbu silang; itulah mengapa tanpa penulisan pun elemen terlihat sejajar.
   - `flexWrap: "wrap"` pada `barisKartu` — kartu pindah ke baris baru ketika sumbu utama penuh; tanpa ini kartu meluber keluar layar.
   - `gap: 10` — jarak antar-kartu tanpa `margin` berulang pada tiap anak.
   - `flex: 1` pada `kaki` — mengisi **seluruh sisa ruang** di bawah konten, sehingga semua konten terdorong ke atas. Ini pola klasik "footer di dasar layar".

3. `"48%"` menyisakan ruang bagi `gap: 10`. Dengan dua kartu: `48 + 48 = 96%`, sisa `4%` layar menjadi ruang; bila `gap` 10 piksel dan padding layar 16 piksel tiap sisi, dua kartu 48% masih muat. Memakai `"50%"` akan membuat `50 + 50 = 100%` **ditambah** `gap` 10 px → total melebihi lebar baris, sehingga kartu kedua terdorong ke baris berikutnya (atau meluber).

4. Logika responsif:

   ```jsx
   const { width } = useWindowDimensions();
   const jumlahKolom = width >= 600 ? 3 : 2;

   <FlatList
     key={jumlahKolom}          // wajib: paksa render ulang saat numColumns berubah
     numColumns={jumlahKolom}
     data={DAFTAR_MAHASISWA}
     keyExtractor={(item) => item.id}
     renderItem={({ item }) => <BarisMahasiswa mahasiswa={item} />}
   />
   ```

   `key` diperlukan karena `FlatList` tidak mendukung perubahan `numColumns` saat berjalan; mengganti `key` membuang struktur baris lama dan membangun daftar baru yang konsisten.

5. Pada lebar 360: `360 >= 600` bernilai **false** → **2 kolom**. Bukti: tangkapan layar (atau perhitungan: 360 px < 600 px).

6. Menyimpan lebar di variabel biasa (mis. `const lebar = Dimensions.get("window").width` di luar komponen, atau `useState` yang diisi sekali) berarti nilainya **tidak pernah diperbarui** saat orientasi berubah atau layar dilipat. `useWindowDimensions` berlangganan perubahan dimensi dan **memicu re-render**, sehingga `jumlahKolom` ikut berubah tanpa intervensi manual.

**Penilaian:** 2 poin default `column` + nama Yoga; 4 poin lima properti dalam konteks; 2 poin perhitungan 48% vs 50%; 2 poin implementasi responsif dengan `key`; 1 poin bukti 360 px; 1 poin penjelasan `useWindowDimensions`.

**Kesalahan umum:** lupa `key={jumlahKolom}` (nilai 0 untuk butir 4 walau kode "jalan" dengan dua kolom tetap); memakai `Dimensions.get` sekali di dalam `useEffect`; menyebut `alignItems` sebagai "perataan horizontal" tanpa mengaitkan dengan sumbu silang.

---

## Panduan Cepat Saat Mendampingi Lab

**Jika mahasiswa berhenti lebih dari 10 menit**, arahkan ke pertanyaan pemeriksaan berikut, bukan ke jawabannya:

| Gejala | Pertanyaan pemicu |
|---|---|
| Red screen soal teks | "Apakah ada tulisan yang berdiri sendiri di dalam `View`?" |
| Gambar tidak muncul | "Berapa `width` dan `height`-nya di style?" |
| Tombol tidak bereaksi | "`Pressable` atau `Button`, dan apakah `onPress` menerima fungsi?" |
| Input tidak bisa diketik | "`value` ada, `onChangeText`-nya ada?" |
| Daftar tersendat / peringatan `VirtualizedLists` | "Ada berapa scroller searah di layar ini?" |
| Peringatan `key` | "`keyExtractor`-mu mengembalikan apa, dan apakah nilainya stabil?" |
| Judul tertutup status bar | "`SafeAreaProvider` sudah di akar aplikasi?" |
| Dua kartu tidak sejajar | "`flexDirection`-nya sudah ditulis, atau masih mengandalkan default?" |
| Gaya tidak berubah | "Barisnya berisi `className` atau `style`?" |
| Perilaku beda iOS vs Android | "Ini perbedaan platform — sudah pakai `Platform.select`?" |

**Tanda jawaban hafalan (bukan pemahaman)** — kurangi poin penjelasan meski kodenya benar:
- menyebut "default-nya column" tanpa bisa menjelaskan **mengapa**;
- menyebut `keyExtractor` wajib hanya karena "kalau tidak ada, warning";
- menghapus `ScrollView` luar hanya karena "dilarang", tanpa bisa menyebutkan kerusakan virtualisasi;
- menyebut `SafeAreaView` bawaan "sudah aman" di kedua platform.

**Ambang kelulusan praktikum:** 60/100, dengan syarat wajib **Soal 6 dan Soal 10 benar** — keduanya menjadi fondasi tampilan pada Bab 6 dan navigasi pada Bab 7. Soal 8 wajib **dijalankan di kedua platform**; jawaban yang hanya diuji pada satu platform diberi maksimal 60% dari poin butir tersebut.

**Pengingat untuk asisten:** minta mahasiswa menyimpan project `profil-mahasiswa`. Bab 6 (UI) dan Bab 7 (navigasi) melanjutkan project yang sama, sehingga praktikum berikutnya tidak perlu membangun ulang dari nol.
