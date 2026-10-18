# BAB 7 — Navigasi Aplikasi

## Deskripsi Singkat

Bab ini membahas **navigasi** (navigation) — mekanisme berpindah antar layar dalam aplikasi mobile — menggunakan **Expo Router**, kerangka navigasi berbasis berkas yang menjadi bawaan ekosistem Expo. Anda akan mempelajari konsep navigasi mobile (stack, tab, drawer), cara mengonfigurasi Expo Router pada project template blank, meneruskan **parameter** antar halaman, menyusun **nested navigation** (navigasi bersarang), memakai siklus hidup layar, hingga melindungi layar yang hanya boleh diakses pengguna yang sudah masuk. Bab ini juga menyatukan hasil Bab 5–6 (komponen dan UI) menjadi aplikasi multi-layar utuh: Login, Beranda, Daftar Mahasiswa, Detail Mahasiswa, dan Form Tambah/Edit — fondasi navigasi yang akan dipakai Bab 8 (form), Bab 10 (API), dan Bab 13 (autentikasi penuh).

## Tujuan Pembelajaran

Setelah mempelajari bab ini, mahasiswa mampu:

1. Menjelaskan konsep dasar navigasi mobile serta perbedaan pola stack, tab, dan drawer beserta kapan masing-masing digunakan.
2. Mengimplementasikan setup Expo Router pada project Expo template blank, termasuk perubahan entry point pada `package.json` dan struktur folder `app/`.
3. Mengidentifikasi perbedaan navigasi deklaratif (`<Link>`) dan imperatif (`router.push`), serta memilih yang tepat untuk kebutuhan tertentu.
4. Mengimplementasikan dynamic route (rute dinamis) dan pengiriman parameter antar halaman dengan `useLocalSearchParams`.
5. Merancang nested navigation (navigasi bersarang) yang menggabungkan tab dan stack dengan struktur folder `app/` yang rapi.
6. Menganalisis siklus hidup layar (navigation lifecycle) dengan `useFocusEffect` untuk memicu proses saat layar mendapat fokus.
7. Mengimplementasikan protected screen (layar terlindungi) sederhana dengan pola `Redirect` berbasis kondisi autentikasi.

## Peta Konsep

```text
Navigasi Aplikasi dengan Expo Router (file-based routing)
┌──────────────────────────────────────────────────────────┐
│ app/                               (folder = struktur rute)│
│   _layout.js   ──► Stack root (login, (app))              │
│   index.js     ──► pengarah: login / (app)                │
│   login.js     ──► layar Masuk                            │
│   (app)/       ──► route group (tersembunyi dari URL)     │
│     _layout.js ──► [pelindung] + Tabs (Beranda, Mahasiswa)│
│     index.js   ──► Beranda                                │
│     mahasiswa/ ──► Stack nested (Daftar, Detail, Form)    │
│       index.js ──► Daftar Mahasiswa                       │
│       [id].js  ──► Detail (parameter id)                  │
│       tambah.js ─► Form (parameter edit)                  │
│ Navigasi: <Link> deklaratif │ router.push imperatif       │
│ Lifecycle: useFocusEffect │ Amankan: <Redirect>           │
└──────────────────────────────────────────────────────────┘
```

## Materi

### 7.1 Konsep Navigasi Mobile

Sebuah aplikasi mobile nyata hampir selalu memiliki lebih dari satu layar: layar masuk (login), beranda, daftar data, detail, dan formulir. Pertanyaan mendasarnya adalah: *bagaimana pengguna berpindah antar layar tersebut, dan bagaimana kita sebagai pengembang mengelola perpindahannya?* Jawabannya adalah **navigasi** (navigation) — sistem yang mengatur tumpukan layar yang sedang aktif, riwayat kunjungan, serta cara layar menerima data dari layar lain. Navigasi adalah keputusan arsitektur paling awal yang harus diambil: hampir semua fitur bergantung padanya, dan kesalahan di sini terasa langsung oleh pengguna.

Untuk memahami navigasi mobile, analogi paling dekat adalah **peramban web**. Di peramban, setiap halaman memiliki alamat (URL), ada tombol maju/mundur yang menjaga riwayat, dan halaman dapat saling melempar data melalui query string (misalnya `?id=2201001`). Aplikasi mobile modern mengadopsi pola yang sama, hanya saja alamatnya berupa **rute** (route) internal, dan riwayatnya dijaga oleh navigator. Di Android, riwayat ini terhubung langsung dengan tombol fisik/gesture "kembali" perangkat; di iOS, terdapat gesture geser dari tepi kiri layar. Keputusan navigasi yang buruk terasa langsung — tombol kembali yang salah sasaran adalah salah satu keluhan paling umum pengguna.

Terdapat tiga pola navigasi utama yang perlu Anda kenali sejak awal:

| Pola | Bentuk | Karakteristik | Contoh penggunaan |
|------|--------|---------------|-------------------|
| **Stack** (tumpukan) | Layar ditumpuk di atas layar lain | Ada hierarki: layar baru menutupi layar lama; tombol kembali membuka layar sebelumnya | Daftar → Detail → Form |
| **Tab** | Beberapa layar "sejajar" | Tidak ada hierarki; perpindahan cepat lewat bar tab; layar tetap hidup saat berpindah | Beranda, Daftar, Profil |
| **Drawer** (laci) | Menu tersembunyi di sisi layar | Hemat ruang; cocok untuk menu banyak; digeser dari tepi kiri | Pengaturan, menu admin |

Ketiga pola ini tidak saling meniadakan — aplikasi profesional biasanya menggabungkannya: tab sebagai kerangka tingkat atas, stack di dalam setiap tab untuk alur detail, dan drawer untuk menu sekunder. Cara mengombinasikannya dibahas pada Subbab 7.6.

Mengapa teknologi ini ada? Sebelum ada pustaka navigasi yang matang (misalnya React Navigation dan turunannya Expo Router), pengembang React Native memba-ngun perpindahan layar secara manual: menyimpan nama layar aktif di dalam state, merender satu layar secara kondisional, dan menulis sendiri logika tombol kembali. Pendekatan itu cepat kacau saat aplikasi tumbuh — state layar bercampur dengan state data, riwayat tidak akurat, dan transisi antar layar tidak konsisten. Pustaka navigasi lahir justru untuk menyeragamkan masalah yang berulang ini: manajemen riwayat, gestur kembali, transisi, dan pengiriman parameter. Expo Router menambahkan satu tingkat abstraksi lagi: rute didefinisikan lewat struktur folder, bukan lewat kode, sehingga alur aplikasi bisa "dibaca" dari pohon folder dan setiap layar memiliki alamat yang sebenarnya (hal ini memungkinkan deep linking — tautan langsung yang membuka layar tertentu dari luar aplikasi, misalnya dari notifikasi; akan terkait erat dengan Bab 12). Trade-offnya: kebebasan navigasi sepenuhnya dinamis (membuat layar "on the fly" dari kode) menjadi lebih terbatas, karena setiap layar harus ada sebagai berkas. Untuk buku ini dan mayoritas aplikasi bisnis, keterbatasan itu justru menjadi keuntungan: struktur yang tegas, mudah dirawat tim besar, dan sulit berantakan.

### 7.2 Stack Navigation dengan Expo Router

**Expo Router** adalah pustaka navigasi resmi ekosistem Expo yang menerapkan **file-based routing** (penataan rute berbasis berkas): setiap berkas di dalam folder `app/` secara otomatis menjadi satu layar (rute), dan nama berkas menjadi alamat layar tersebut. Konsep ini berbeda dari pendekatan lama (React Navigation langsung) yang mendaftarkan layar satu per satu di dalam kode: dengan Expo Router, struktur aplikasi *terlihat* dari struktur folder — alasan utama pendekatan ini dipilih untuk buku ini.

Setiap layar pada pola **stack** (tumpukan) diatur oleh satu navigator: layar yang dibuka diletakkan di atas tumpukan, tombol kembali mengeluarkan layar teratas. Di Expo Router, navigator stack direpresentasikan komponen `<Stack />` yang biasanya ditempatkan di berkas `app/_layout.js` — berkas **layout** (tata letak) membungkus seluruh rute di folder yang sama, semacam "panggung" tempat layar-layar di bawahnya ditampilkan.

Untuk memakai Expo Router, project dari Bab 2 (template blank) perlu tiga penyesuaian:

1. **Pasang paket.** Jalankan perintah berikut di terminal project:

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

Paket `react-native-screens` menggantikan render layar dengan komponen native untuk performa, `react-native-safe-area-context` menangani area aman layar (notch/kamera), sedangkan `expo-linking` dan `expo-constants` dipakai Expo Router untuk mendukung deep linking dan konfigurasi.

2. **Ubah entry point.** Buka `package.json`, lalu ubah nilai properti `main`:

File: package.json (cuplikan — hanya properti yang relevan)
```json
{
  "main": "expo-router/entry"
}
```

*⚠ version-sensitive: pada versi terdahulu dokumentasi menuliskan `"main": "node_modules/expo-router/entry"`, sedangkan dokumentasi terbaru menuliskan `"expo-router/entry"`. Periksa dokumentasi resmi docs.expo.dev saat Anda menulis bab ini agar tidak salah menyalin.*

Mengapa ini penting? Properti `main` memberi tahu Metro (bundler) berkas mana yang menjadi titik masuk (entry) aplikasi. Template blank memakai `node_modules/expo/AppEntry.js` yang memuat `App.js`; nilai `expo-router/entry` menggantikannya dengan *bootstrap* Expo Router: berkas ini yang membuat navigation container, membaca folder `app/`, mendaftarkan semua rute, dan menyiapkan deep linking. Setelah perubahan ini, `App.js` tidak lagi dimuat dan boleh dihapus.

3. **Tambahkan scheme.** Di `app.json`, tambahkan properti `scheme` — identitas "alamat" aplikasi untuk deep linking (misalnya `siakad-mobile://...`):

File: app.json (cuplikan — tambahkan "scheme" di dalam objek "expo")
```json
{
  "expo": {
    "name": "siakad-mobile",
    "slug": "siakad-mobile",
    "version": "1.0.0",
    "scheme": "siakad-mobile"
  }
}
```

*⚠ version-sensitive: nilai `scheme` bebas ditentukan, tetapi harus konsisten di seluruh project dan didokumentasikan; format konfigurasi `app.json` dapat berubah antar versi Expo.*

Setelah setup selesai, struktur folder project menjadi:

```text
project/
├── app/
│   ├── _layout.js      ← layout root: Stack
│   ├── index.js        ← layar pertama
│   └── login.js        ← layar masuk
├── assets/
├── app.json
└── package.json
```

Setiap berkas di `app/` adalah satu rute: `app/index.js` beralamat `/`, `app/login.js` beralamat `/login`. Folder berkas menjadi segmen alamat: `app/mahasiswa/index.js` beralamat `/mahasiswa`. Konvensi inilah yang disebut file-based routing, dan akan menjadi bahasa kerja kita di seluruh bab ini.

### 7.3 Tab Navigation

Pola **tab** menampilkan beberapa layar "sejajar" yang tidak saling menutupi — pengguna berpindah dengan menekan ikon pada bar tab, biasanya di bagian bawah layar (polemik desainnya dibahas di Bab 6 sebagai bottom navigation). Di Expo Router, tab dibangun dengan komponen `<Tabs />` yang diimpor langsung dari `expo-router`:

File: app/(app)/_layout.js (contoh bentuk umum)
```js
import { Tabs } from 'expo-router';

export default function LayoutTab() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Beranda' }} />
      <Tabs.Screen name="profil" options={{ title: 'Profil' }} />
    </Tabs>
  );
}
```

Apa perbedaan mendasar dengan Stack? Ada tiga hal penting. **Pertama**, hierarki: stack memiliki "ayah-anak" (layar baru menutupi layar lama), sedangkan tab bersifat "saudara" — tidak ada layar yang menutupi layar lain. **Kedua**, kondisi layar: pada stack, layar yang tertutup bisa dilepas dari memori; pada tab, semua layar tab tetap terpasang (mounted) dan hanya kehilangan **fokus** (focus) saat pindah tab — konsekuensinya, `useEffect` biasa tidak otomatis berjalan ulang saat tab kembali difokuskan, dan kita memerlukan `useFocusEffect` (Subbab 7.7). **Ketiga**, cara berpindah: tab berpindah secara instan antar layar sejajar, sedangkan stack melakukan push/pop dengan transisi bertumpuk.

Bagaimana memilih? Aturan praktis yang lazim di industri: tab untuk **fungsi utama yang selalu butuh diakses cepat** (beranda, daftar, profil) — idealnya dua hingga lima; stack untuk **alur detail** (daftar → detail → form) yang berjenjang dan sementara. Terlalu banyak tab membuat layar sempit dan menurunkan keterbacaan; memaksa alur detail menjadi tab membuat riwayat kembali tidak natural. Kombinasi keduanya dibahas di Subbab 7.6.

### 7.4 Drawer Navigation (Pengenalan)

Pola **drawer** (laci) menyembunyikan menu di sisi kiri layar: pengguna menggeser dari tepi kiri atau menekan ikon hamburger untuk membuka panel menu. Keunggulannya: tidak memakan ruang bar di bawah/atas layar, sehingga cocok untuk aplikasi dengan banyak menu sekunder (pengaturan, bantuan, laporan). Kelemahannya: menu tidak terlihat langsung, sehingga kurang tepat untuk fungsi yang dipakai setiap saat.

Di Expo Router, drawer tersedia melalui `expo-router/drawer` yang membungkus pustaka `@react-navigation/drawer`:

File: app/_layout.js (variasi drawer — hanya pengenalan)
```js
import { Drawer } from 'expo-router/drawer';

export default function LayoutDrawer() {
  return (
    <Drawer screenOptions={{ drawerPosition: 'left' }}>
      <Drawer.Screen name="index" options={{ title: 'Beranda' }} />
      <Drawer.Screen name="pengaturan" options={{ title: 'Pengaturan' }} />
    </Drawer>
  );
}
```

*⚠ version-sensitive: dukungan drawer pada Expo Router bergantung pada paket `@react-navigation/drawer`; periksa dokumentasi resmi (docs.expo.dev/router) untuk langkah instalasi dan nama impor yang berlaku pada versi SDK Anda.*

Bab ini hanya memperkenalkan konsepnya; praktikum kita memakai stack dan tab karena keduanya mencakup sebagian besar kebutuhan aplikasi bisnis, termasuk aplikasi manajemen data mahasiswa. Jika Anda ingin mendalami drawer, jadikan sebagai tugas pengembangan mandiri (lihat subbab Tantangan).

### 7.5 Parameter Antar Halaman

Layar jarang berdiri sendiri: layar Detail harus tahu mahasiswa mana yang akan ditampilkan. Di Expo Router, data "siapa yang dibuka" dikirim sebagai **parameter** — nilai yang menempel pada alamat rute, persis seperti query string di web (`/mahasiswa/2201001` atau `/mahasiswa/tambah?edit=2201001`). Ada dua bentuk parameter:

1. **Dynamic route (rute dinamis):** sebagian alamat diisi nilai, ditandai dengan kurung siku pada nama berkas. Berkas `app/mahasiswa/[id].js` menjadi rute `/mahasiswa/<nilai>` — nilai apa pun di segmen itu (misal `2201001`) akan membuka berkas yang sama. Di dalam layar, nilai dibaca dengan hook `useLocalSearchParams()`:

File: app/mahasiswa/[id].js (pola pembacaan parameter)
```js
import { useLocalSearchParams } from 'expo-router';

export default function LayarDetail() {
  const { id } = useLocalSearchParams();
  return <Text>Detail mahasiswa dengan id: {String(id)}</Text>;
}
```

2. **Query parameter:** nilai tambahan di belakang tanda tanya, berguna untuk parameter opsional — misalnya mode edit pada form. Berkas `app/mahasiswa/tambah.js` dapat dibuka dengan `/mahasiswa/tambah` (mode tambah) atau `/mahasiswa/tambah?edit=2201001` (mode edit). Nilai dibaca dengan hook yang sama: `const { edit } = useLocalSearchParams();`. Jika parameter tidak ada, nilainya `undefined` — di sinilah pola "periksa dulu sebelum memakai" (`edit ? ... : ...`) menjadi penting.

Mengapa parameter, bukan state global? Parameter membuat setiap layar **self-contained** (dapat dibuka dari mana saja asalkan alamatnya diketahui) dan tercatat pada riwayat: pengguna yang menekan kembali dari Detail kembali ke Daftar, dan tautan langsung `siakad-mobile:///mahasiswa/2201001` tetap membuka Detail yang benar tanpa bergantung pada urutan kunjungan. Sebaliknya, state global (Bab 9) lebih cocok untuk data yang benar-benar lintas layar (misal keranjang belanja) dan tidak "bocor" lewat alamat. Konsekuensi teknis yang sering mengejutkan pemula: **semua nilai `useLocalSearchParams` bertipe string** (karena berasal dari alamat), sehingga `angkatan` atau `ipk` perlu dikonversi sebelum dihitung. `String(id)` juga mengamankan kasus parameter tiba sebagai array (saat segmen sama dipakai dua kali dalam satu alamat).

Untuk membuka layar sambil membawa parameter, ada dua gaya yang setara hasilnya — deklaratif dengan `<Link>` dan imperatif dengan `router` (perbandingan keduanya dibahas pada Contoh 7.2):

File: app/mahasiswa/index.js (pola tautan dengan parameter)
```js
import { Link } from 'expo-router';

<Link href={{ pathname: '/mahasiswa/[id]', params: { id: '2201001' } }}>
  Lihat detail Budi Santoso
</Link>
```

Perhatikan bentuk objek `href`: `pathname` memakai pola rute literal dengan kurung siku, dan `params` menyediakan nilainya. Gaya ini lebih aman daripada menyusun string secara manual (`/mahasiswa/${id}`), karena struktur rute diperiksa lebih ketat.

### 7.6 Nested Navigation

Aplikasi sungguhan hampir selalu membutuhkan **nested navigation** (navigasi bersarang): navigator di dalam navigator. Pola yang paling lazim adalah tab di tingkat atas, dan di dalam setiap tab terdapat stack untuk alur detail:

```text
Tabs (kerangka aplikasi)
├── tab Beranda      (satu layar)
└── tab Mahasiswa ── Stack (nested)
    ├── Daftar Mahasiswa
    ├── Detail Mahasiswa
    └── Form Tambah/Edit
```

Di Expo Router, bersarang berarti bersarang pada folder: stack "Mahasiswa" hidup di `app/(app)/mahasiswa/` yang memiliki `_layout.js` sendiri berisi `<Stack />`, sedangkan lapisan atasnya (`app/(app)/_layout.js`) berisi `<Tabs />`. Dengan demikian setiap tab punya riwayat sendiri: berpindah dari tab Mahasiswa ke tab Beranda tidak menghapus posisi pengguna di stack Mahasiswa — perilaku yang diharapkan pengguna aplikasi profesional, dan alasan struktural mengapa folder dibentuk berlapis.

Di sinilah istilah **route group** (grup rute) berperan. Folder yang namanya diberi tanda kurung — `(app)` — adalah grup rute: folder ini **tidak ikut menjadi bagian alamat**. Berkas `app/(app)/mahasiswa/index.js` tetap beralamat `/mahasiswa`, bukan `/(app)/mahasiswa`. Grup dipakai untuk mengelompokkan layar yang berbagi layout tanpa mengubah URL mereka. Kegunaan lain yang sangat praktis: kita bisa menempatkan layar Login (`app/login.js`) dan seluruh layar "dalam aplikasi" (`app/(app)/`) pada tingkatan yang sama, sehingga layout pelindung (Subbab 7.8) cukup membungkus grup `(app)` saja.

Satu hal yang perlu diwaspadai saat menggabungkan Tabs dan Stack: **header ganda** (dua batang judul bertumpuk), karena keduanya sama-sama dapat menampilkan header. Aturan praktisnya: satu navigator saja yang menampilkan header — umumnya stack terdalam (judul "Daftar Mahasiswa", "Detail Mahasiswa"), sedangkan Tabs menyembunyikannya lewat `screenOptions={{ headerShown: false }}`. Pola ini dipraktikkan pada Praktikum bab ini.

### 7.7 Navigation Lifecycle

Layar tab tidak dilepas dari memori saat berpindah — layar tetap terpasang, hanya kehilangan fokus. Konsekuensinya, `useEffect` biasa (Bab 4) yang berjalan saat komponen terpasang **tidak otomatis berjalan ulang** setiap layar mendapat fokus kembali, padahal banyak proses justru harus dipicu fokus: memuat ulang daftar setelah form menyimpan, memperbarui waktu terakhir dilihat, atau menjeda/melanjutkan pemutar media.

Untuk kebutuhan ini, Expo Router menyediakan **useFocusEffect** — hook yang menjalankan efek setiap kali layar mendapat fokus, dan membersihkannya setiap kali layar kehilangan fokus:

File: app/(app)/index.js (pola pemantauan fokus)
```js
import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

useFocusEffect(
  useCallback(() => {
    // berjalan setiap layar mendapat fokus
    return () => {
      // pembersihan setiap layar kehilangan fokus
    };
  }, [])
);
```

Dua detil sintaks. **Pertama**, `useFocusEffect` mengharuskan argumennya dibungkus `useCallback` — jika tidak, efek terpicu ulang terus-menerus karena fungsi baru dibuat pada setiap render (kesalahan pemula yang paling sering ditemui; lihat Troubleshooting). **Kedua**, daftar dependensi `useCallback` menentukan kapan efek dianggap "berubah": efek yang bergantung parameter (misal `id`) harus memuat `id` pada daftarnya agar fokus ulang dengan nilai berbeda tetap dihitung ulang.

Kapan memakai yang mana? `useEffect` untuk proses sekali jalan saat komponen terpasang (misal mengambil data awal); `useFocusEffect` untuk proses yang harus diulang setiap layar terlihat (misal menyegarkan daftar setelah kembali dari layar lain). Praktikum bab ini memakai `useFocusEffect` pada Beranda untuk menyimulasikan penyegaran data — pola yang sama dipakai Bab 10 saat data datang dari API.

### 7.8 Protected Screen (Pengenalan)

Tidak semua layar boleh diakses siapa saja — halaman detail data mahasiswa, misalnya, hanya terbuka setelah pengguna masuk. Pola untuk ini disebut **protected screen** (layar terlindungi): sebelum merender isi navigator, layout memeriksa status autentikasi; jika belum masuk, layout mengalihkan ke layar login dengan komponen `<Redirect />`:

File: app/(app)/_layout.js (pola pelindung sederhana)
```js
import { Redirect, Tabs } from 'expo-router';
import { isLoggedIn } from '../../lib/session';

export default function LayoutAplikasi() {
  if (!isLoggedIn()) {
    return <Redirect href="/login" />;
  }
  return <Tabs>...</Tabs>;
}
```

Mengapa pola ini kuat? Perlindungan ditempatkan pada **satu titik** — layout grup `(app)` — dan berlaku otomatis untuk **semua** layar di dalamnya, apa pun yang ditambahkan kemudian. Ini prinsip *single point of control*: pengembang tidak perlu memasang pemeriksaan di tiap layar (yang rawan terlewat). `<Redirect />` juga lebih disukai daripada navigasi manual karena deklaratif dan aman dalam kondisi render apa pun.

Perlu dua catatan. **Pertama**, contoh ini memakai status masuk di memori (`lib/session.js`) — cukup untuk memahami pola, tetapi hilang saat aplikasi ditutup; implementasi sungguhan (token, penyimpanan aman, masa berlaku sesi) dibahas di **Bab 13** dan penyimpanannya di **Bab 11**. **Kedua**, waspadai **redirect loop** (perpindahan berulang tak berujung): layar login tidak boleh berada di dalam grup yang dilindungi, karena pengguna yang belum masuk akan dilempar ke login yang justru memeriksa autentikasi lagi. Karena itu login selalu di luar grup `(app)` — pada buku ini, langsung di `app/login.js`.

### 7.9 Latihan: Login, Home, Daftar, Detail, dan Form Mahasiswa

Bagian ini memetakan kebutuhan fungsional Aplikasi Manajemen Data Mahasiswa (Bab 6) menjadi struktur rute, sekaligus menjadi peta kerja Praktikum bab ini. Aplikasi memiliki lima alur utama; setiap alur dipetakan ke satu rute baku seperti tabel berikut:

| Alur | Rute (berkas di folder `app/`) | Alamat | Materi terkait |
|------|--------------------------------|--------|----------------|
| Pengarah awal | `index.js` | `/` | Redirect (7.8) |
| Login | `login.js` | `/login` | Pemisahan dari grup terlindungi (7.8) |
| Beranda | `(app)/index.js` | `/` (dalam grup) | Tabs (7.3) |
| Daftar Mahasiswa | `(app)/mahasiswa/index.js` | `/mahasiswa` | Stack nested + Link (7.2, 7.6) |
| Detail Mahasiswa | `(app)/mahasiswa/[id].js` | `/mahasiswa/:id` | Dynamic route (7.5) |
| Form Tambah/Edit | `(app)/mahasiswa/tambah.js` | `/mahasiswa/tambah?edit=...` | Query parameter (7.5) |

Ada dua keputusan desain. Pertama, Detail dan Form tidak dijadikan tab, melainkan layar stack di dalam tab Mahasiswa — keduanya *bergantung* pada layar Daftar (harus kembali ke sana), dan tab tidak dirancang untuk hubungan berjenjang. Kedua, layar Login berada di luar grup `(app)` agar tidak ikut terlindungi — jika tidak, login menjadi "layar yang hanya bisa dibuka setelah login", sebuah kontradiksi. Struktur ini diimplementasikan pada Praktikum berikut dengan data statis (pengganti sementara data dari API — Bab 10).

## Contoh

### Contoh 7.1: Stack minimal dengan dua layar

File: app/_layout.js (contoh singkat — versi akhir ada di Praktikum)
```js
import { Stack } from 'expo-router';

export default function LayoutRoot() {
  return (
    <Stack screenOptions={{ headerTitleAlign: 'center' }}>
      <Stack.Screen name="index" options={{ title: 'Beranda' }} />
      <Stack.Screen name="profil" options={{ title: 'Profil Saya' }} />
    </Stack>
  );
}
```

Penjelasan: `<Stack />` mendefinisikan tumpukan layar untuk seluruh rute di folder `app/`. Daftar `<Stack.Screen>` di dalamnya bersifat opsional — gunakan untuk mengatur judul (title) atau menyembunyikan header per layar. Layar yang tidak disebutkan tetap menjadi bagian stack dengan pengaturan default; ini berarti Anda tidak wajib mendaftarkan semua layar, cukup yang butuh penyesuaian.

### Contoh 7.2: Membuka layar dengan parameter (deklaratif vs imperatif)

File: app/index.js (contoh — versi akhir ada di Praktikum)
```js
import { View, Text, Pressable } from 'react-native';
import { Link, router } from 'expo-router';

export default function HalamanAwal() {
  return (
    <View>
      <Link href={{ pathname: '/profil', params: { id: '2201001' } }} asChild>
        <Pressable>
          <Text>Buka profil (deklaratif)</Text>
        </Pressable>
      </Link>
      <Pressable
        onPress={() => router.push({ pathname: '/profil', params: { id: '2201002' } })}
      >
        <Text>Buka profil (imperatif)</Text>
      </Pressable>
    </View>
  );
}
```

Penjelasan: dua gaya ini setara hasilnya. Gaya **deklaratif** (`<Link>`) memberi tahu antarmuka "ini tautan", sehingga aksesibilitas, klik tengah/kanan pada web, dan pratinjau tautan tetap berfungsi; `asChild` membuat komponen anak (`Pressable`) yang menerima perilaku tautan sehingga gaya sentuh tetap milik komponen anak. Gaya **imperatif** (`router.push`) dipanggil dari dalam kode — misalnya setelah formulir tersimpan, aplikasi memanggil `router.back()`, bukan menunggu pengguna menekan tautan. Aturan praktisnya: `<Link>` untuk tautan yang terlihat pengguna, `router` untuk perpindahan yang digerakkan logika.

### Contoh 7.3: Memantau fokus layar dengan useFocusEffect

File: app/(app)/index.js (contoh — versi akhir ada di Praktikum)
```js
import { useCallback, useState } from 'react';
import { Text } from 'react-native';
import { useFocusEffect } from 'expo-router';

export default function BerandaDemo() {
  const [jumlahFokus, setJumlahFokus] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setJumlahFokus((n) => n + 1);
    }, [])
  );

  return <Text>Layar ini difokuskan {jumlahFokus} kali.</Text>;
}
```

Penjelasan: setiap kali layar mendapat fokus (termasuk saat kembali dari tab lain atau layar stack), penghitung bertambah — sesuatu yang tidak akan terjadi dengan `useEffect` biasa karena komponen tidak pernah dilepas dari memori. Pola ini menjadi dasar penyegaran data pada aplikasi nyata: saat pengguna kembali dari Form ke Beranda, `useFocusEffect` dapat memicu pengambilan ulang data, sehingga informasi yang baru disimpan langsung terlihat.

## Praktikum

### Tujuan Praktikum

1. Mengonfigurasi Expo Router pada project template blank: instalasi paket, perubahan `main` pada `package.json`, penambahan `scheme`, dan penghapusan `App.js`.
2. Membangun struktur folder `app/` sesuai peta rute Subbab 7.9: pengarah, login, grup `(app)` berisi tabs dan stack nested.
3. Mengimplementasikan perpindahan layar deklaratif (`<Link>`) dan imperatif (`router`) beserta pengiriman parameter (dynamic route dan query parameter).
4. Mengimplementasikan protected screen dengan pola `Redirect` berbasis status masuk sederhana.
5. Menguji seluruh alur: masuk → beranda → daftar → detail → tambah/edit → keluar.

### Kebutuhan

- Project Expo template blank (dibuat di Bab 2 dengan `npx create-expo-app`) — pada praktikum ini dinamai `siakad-mobile`.
- Node.js LTS minimal versi 22 (lihat Bab 2) dan aplikasi Expo Go pada ponsel, atau emulator Android (Bab 2).
- Paket navigasi: `expo-router`, `react-native-safe-area-context`, `react-native-screens`, `expo-linking`, `expo-constants`, `expo-status-bar` (diinstal lewat `npx expo install`), ditambah `@expo/vector-icons` untuk ikon tab.

### Persiapan

1. Buka terminal, lalu buat project baru berisi template blank (perintah lengkap dan penjelasannya ada di Bab 2; jangan gunakan template default karena berbasis TypeScript):

```bash
npx create-expo-app siakad-mobile --template blank
cd siakad-mobile
```

2. Instal paket navigasi sekaligus paket pendukungnya:

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
npx expo install @expo/vector-icons
```

3. Buka `package.json` dengan editor, ubah nilai `"main"` menjadi `"expo-router/entry"` (*⚠ version-sensitive: lihat catatan pada Subbab 7.2*), lalu simpan.
4. Buka `app.json`, tambahkan `"scheme": "siakad-mobile"` di dalam objek `"expo"`, lalu simpan.
5. Hapus berkas `App.js` (tidak lagi dipakai; entry point sekarang milik Expo Router).
6. Buat struktur folder berikut di dalam folder project (dengan editor berkas, karena folder baru perlu dibuat):

```text
app/
├── _layout.js
├── index.js
├── login.js
├── (app)/
│   ├── _layout.js
│   ├── index.js
│   └── mahasiswa/
│       ├── _layout.js
│       ├── index.js
│       ├── [id].js
│       └── tambah.js
data/
└── mahasiswa.js
lib/
└── session.js
```

### Langkah Kerja

1. **Siapkan data.** Tulis `data/mahasiswa.js` berisi lima data mahasiswa baku buku ini dan fungsi pencarian berdasarkan `id`.
2. **Siapkan status masuk sederhana.** Tulis `lib/session.js` berisi status login di memori dengan pola subscribe (daftar pendengar).
3. **Tulis layout root** (`app/_layout.js`) berisi `<Stack />` dengan dua layar bernama: `login` (judul "Masuk") dan `(app)` (header disembunyikan, karena grup ini menampilkan tab-nya sendiri).
4. **Tulis pengarah** (`app/index.js`): jika sudah masuk, alihkan ke `/(app)`; jika belum, alihkan ke `/login`.
5. **Tulis layar login** (`app/login.js`): dua `TextInput` (email dan sandi) dan satu `Pressable`; saat ditekan, set status masuk lalu `router.replace('/(app)')`. Form lengkap dengan validasi dibahas di Bab 8 — di sini cukup alur navigasinya.
6. **Tulis layout grup `(app)`** (`app/(app)/_layout.js`): pemeriksaan status masuk dengan `Redirect` ke `/login` bila belum masuk; bila sudah, tampilkan `<Tabs />` dengan dua screen: `index` (Beranda) dan `mahasiswa` (Daftar). Sembunyikan header Tabs dengan `headerShown: false` agar tidak ganda dengan header stack.
7. **Tulis Beranda** (`app/(app)/index.js`): sapaan singkat, dua tautan ke Daftar dan Form, tombol Keluar yang mengosongkan status masuk lalu `router.replace('/login')`.
8. **Tulis layout stack Mahasiswa** (`app/(app)/mahasiswa/_layout.js`): `<Stack />` dengan judul "Daftar Mahasiswa" untuk `index`, "Detail Mahasiswa" untuk `[id]`, dan "Tambah Mahasiswa" untuk `tambah`.
9. **Tulis Daftar Mahasiswa** (`app/(app)/mahasiswa/index.js`): `FlatList` dari `daftarMahasiswa`, setiap baris dibungkus `<Link asChild>` menuju `/mahasiswa/[id]` dengan parameter `id`.
10. **Tulis Detail Mahasiswa** (`app/(app)/mahasiswa/[id].js`): baca `id` dengan `useLocalSearchParams`, cari data dengan `cariMahasiswa`, tampilkan seluruh field; jika tidak ditemukan, tampilkan pesan dan tautan kembali. Sertakan tautan "Edit Data ini" menuju `/mahasiswa/tambah` dengan parameter `edit`.
11. **Tulis Form Tambah/Edit** (`app/(app)/mahasiswa/tambah.js`): baca parameter `edit`; jika ada, ambil data lama sebagai nilai awal dan ubah judul layar menjadi "Edit Mahasiswa" (pakai `<Stack.Screen>` di dalam komponen). Tombol simpan cukup memeriksa kelengkapan isian lalu menampilkan `Alert` dan `router.back()` — penyimpanan nyata ke API ada di Bab 10, validasi lengkap di Bab 8.
12. **Jalankan dan uji.** Dari root project, jalankan `npx expo start`, buka aplikasi di Expo Go (Bab 2), lalu telusuri alur pada subbab Hasil yang Diharapkan.

### Kode

File: data/mahasiswa.js
```js
export const daftarMahasiswa = [
  { id: '2201001', nim: '2201001', nama: 'Budi Santoso', prodi: 'Sistem Informasi', angkatan: 2022, ipk: 3.45, email: 'budi.santoso@students.univ.ac.id', telepon: '081234567890' },
  { id: '2201002', nim: '2201002', nama: 'Siti Aminah', prodi: 'Teknik Informatika', angkatan: 2022, ipk: 3.82, email: 'siti.aminah@students.univ.ac.id', telepon: '081298765432' },
  { id: '2201003', nim: '2201003', nama: 'Agus Wijaya', prodi: 'Informatika', angkatan: 2023, ipk: 3.20, email: 'agus.wijaya@students.univ.ac.id', telepon: '081345678901' },
  { id: '2201004', nim: '2201004', nama: 'Dewi Lestari', prodi: 'Rekayasa Perangkat Lunak', angkatan: 2023, ipk: 3.61, email: 'dewi.lestari@students.univ.ac.id', telepon: '081356789012' },
  { id: '2201005', nim: '2201005', nama: 'Rizky Pratama', prodi: 'Sistem Informasi', angkatan: 2024, ipk: 2.95, email: 'rizky.pratama@students.univ.ac.id', telepon: '081367890123' },
];

export function cariMahasiswa(id) {
  return daftarMahasiswa.find((m) => m.id === id);
}
```

File: lib/session.js
```js
let statusMasuk = false;
const pendengar = new Set();

export function isLoggedIn() {
  return statusMasuk;
}

export function setLoggedIn(nilai) {
  statusMasuk = nilai;
  pendengar.forEach((fn) => fn(nilai));
}

export function subscribe(fn) {
  pendengar.add(fn);
  return () => pendengar.delete(fn);
}
```

File: app/_layout.js
```js
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function LayoutRoot() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1e3a8a' },
          headerTintColor: '#ffffff',
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: 'Masuk' }} />
      </Stack>
    </>
  );
}
```

File: app/index.js
```js
import { Redirect } from 'expo-router';
import { isLoggedIn } from '../lib/session';

export default function Pengarah() {
  if (isLoggedIn()) {
    return <Redirect href="/(app)" />;
  }
  return <Redirect href="/login" />;
}
```

File: app/login.js
```js
import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { setLoggedIn } from '../lib/session';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function masuk() {
    setLoggedIn(true);
    router.replace('/(app)');
  }

  return (
    <View style={styles.kontainer}>
      <Text style={styles.judul}>SIAKAD Mobile</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Sandi"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable style={styles.tombol} onPress={masuk}>
        <Text style={styles.teksTombol}>Masuk</Text>
      </Pressable>
      <Text style={styles.catatan}>
        Login demo: sandi tidak diperiksa. Validasi di Bab 8, autentikasi sungguhan di Bab 13.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  kontainer: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f8fafc' },
  judul: { fontSize: 28, fontWeight: 'bold', color: '#1e3a8a', textAlign: 'center', marginBottom: 32 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, marginBottom: 16, backgroundColor: '#ffffff' },
  tombol: { backgroundColor: '#1e3a8a', borderRadius: 8, padding: 14, alignItems: 'center' },
  teksTombol: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  catatan: { marginTop: 16, color: '#64748b', fontSize: 12, textAlign: 'center' },
});
```

File: app/(app)/_layout.js
```js
import { useEffect, useState } from 'react';
import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { isLoggedIn, subscribe } from '../../lib/session';

export default function LayoutAplikasi() {
  const [masuk, setMasuk] = useState(isLoggedIn);

  useEffect(() => subscribe(setMasuk), []);

  if (!masuk) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#1e3a8a', headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mahasiswa"
        options={{
          title: 'Mahasiswa',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'people' : 'people-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

File: app/(app)/index.js
```js
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import { setLoggedIn } from '../../lib/session';

export default function Beranda() {
  function keluar() {
    setLoggedIn(false);
    router.replace('/login');
  }

  return (
    <View style={styles.kontainer}>
      <Text style={styles.sapaan}>Halo, Admin 👋</Text>
      <Text style={styles.subjudul}>Aplikasi Manajemen Data Mahasiswa</Text>
      <Link href="/mahasiswa" asChild>
        <Pressable style={styles.tautan}>
          <Text style={styles.teksTautan}>Buka Daftar Mahasiswa</Text>
        </Pressable>
      </Link>
      <Link href="/mahasiswa/tambah" asChild>
        <Pressable style={styles.tautan}>
          <Text style={styles.teksTautan}>Tambah Mahasiswa Baru</Text>
        </Pressable>
      </Link>
      <Pressable style={styles.tombol} onPress={keluar}>
        <Text style={styles.teksTombol}>Keluar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  kontainer: { flex: 1, padding: 24, backgroundColor: '#f8fafc' },
  sapaan: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginTop: 16 },
  subjudul: { fontSize: 14, color: '#64748b', marginBottom: 24 },
  tautan: { backgroundColor: '#e0e7ff', borderRadius: 8, padding: 14, marginBottom: 12 },
  teksTautan: { color: '#1e3a8a', fontWeight: 'bold' },
  tombol: { backgroundColor: '#dc2626', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 12 },
  teksTombol: { color: '#ffffff', fontWeight: 'bold' },
});
```

File: app/(app)/mahasiswa/_layout.js
```js
import { Stack } from 'expo-router';

export default function LayoutMahasiswa() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Daftar Mahasiswa' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detail Mahasiswa' }} />
      <Stack.Screen name="tambah" options={{ title: 'Tambah Mahasiswa' }} />
    </Stack>
  );
}
```

File: app/(app)/mahasiswa/index.js
```js
import { FlatList, Pressable, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { daftarMahasiswa } from '../../../data/mahasiswa';

export default function DaftarMahasiswa() {
  return (
    <FlatList
      data={daftarMahasiswa}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.daftar}
      renderItem={({ item }) => (
        <Link href={{ pathname: '/mahasiswa/[id]', params: { id: item.id } }} asChild>
          <Pressable style={styles.kartu}>
            <Text style={styles.nama}>{item.nama}</Text>
            <Text style={styles.info}>
              {item.nim} • {item.prodi}
            </Text>
          </Pressable>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  daftar: { padding: 16, gap: 12 },
  kartu: { backgroundColor: '#ffffff', borderRadius: 10, padding: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  nama: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  info: { fontSize: 13, color: '#64748b', marginTop: 4 },
});
```

File: app/(app)/mahasiswa/[id].js
```js
import { View, Text, StyleSheet } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { cariMahasiswa } from '../../../data/mahasiswa';

export default function DetailMahasiswa() {
  const { id } = useLocalSearchParams();
  const mhs = cariMahasiswa(String(id));

  if (!mhs) {
    return (
      <View style={styles.kontainer}>
        <Text style={styles.tidakAda}>Data mahasiswa tidak ditemukan.</Text>
        <Link href="/mahasiswa" asChild>
          <Text style={styles.tautan}>Kembali ke Daftar</Text>
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.kontainer}>
      <Text style={styles.nama}>{mhs.nama}</Text>
      <Text style={styles.info}>NIM: {mhs.nim}</Text>
      <Text style={styles.info}>Program Studi: {mhs.prodi}</Text>
      <Text style={styles.info}>Angkatan: {mhs.angkatan}</Text>
      <Text style={styles.info}>IPK: {mhs.ipk}</Text>
      <Text style={styles.info}>Email: {mhs.email}</Text>
      <Text style={styles.info}>Telepon: {mhs.telepon}</Text>
      <Link href={{ pathname: '/mahasiswa/tambah', params: { edit: mhs.id } }} asChild>
        <Text style={styles.tautan}>Edit Data ini</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  kontainer: { flex: 1, padding: 24, backgroundColor: '#f8fafc', gap: 8 },
  nama: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  info: { fontSize: 15, color: '#334155' },
  tidakAda: { fontSize: 16, color: '#dc2626', marginBottom: 12 },
  tautan: { marginTop: 16, color: '#1e3a8a', fontWeight: 'bold', textDecorationLine: 'underline' },
});
```

File: app/(app)/mahasiswa/tambah.js
```js
import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { cariMahasiswa } from '../../../data/mahasiswa';

export default function FormMahasiswa() {
  const { edit } = useLocalSearchParams();
  const [nama, setNama] = useState('');
  const [prodi, setProdi] = useState('');
  const [ipk, setIpk] = useState('');

  useEffect(() => {
    const data = edit ? cariMahasiswa(String(edit)) : null;
    setNama(data?.nama ?? '');
    setProdi(data?.prodi ?? '');
    setIpk(data ? String(data.ipk) : '');
  }, [edit]);

  function simpan() {
    if (!nama.trim() || !prodi.trim() || !ipk.trim()) {
      Alert.alert('Data belum lengkap', 'Isi nama, prodi, dan IPK terlebih dahulu.');
      return;
    }
    Alert.alert(
      'Berhasil',
      edit ? 'Data mahasiswa diperbarui.' : 'Data mahasiswa baru ditambahkan.'
    );
    router.back();
  }

  return (
    <ScrollView style={styles.halaman} contentContainerStyle={styles.kontainer}>
      <Stack.Screen options={{ title: edit ? 'Edit Mahasiswa' : 'Tambah Mahasiswa' }} />
      <Text style={styles.label}>Nama Lengkap</Text>
      <TextInput style={styles.input} value={nama} onChangeText={setNama} placeholder="Nama lengkap mahasiswa" />
      <Text style={styles.label}>Program Studi</Text>
      <TextInput style={styles.input} value={prodi} onChangeText={setProdi} placeholder="mis. Sistem Informasi" />
      <Text style={styles.label}>IPK</Text>
      <TextInput style={styles.input} value={ipk} onChangeText={setIpk} placeholder="mis. 3.45" keyboardType="decimal-pad" />
      <Pressable style={styles.tombol} onPress={simpan}>
        <Text style={styles.teksTombol}>{edit ? 'Simpan Perubahan' : 'Tambah Mahasiswa'}</Text>
      </Pressable>
      {edit ? (
        <Text style={styles.catatan}>Mode edit untuk NIM {String(edit)}.</Text>
      ) : (
        <Text style={styles.catatan}>Validasi lengkap dan penyimpanan ke API dibahas di Bab 8 dan Bab 10.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  halaman: { flex: 1, backgroundColor: '#f8fafc' },
  kontainer: { padding: 24 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#334155', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, marginBottom: 16, backgroundColor: '#ffffff' },
  tombol: { backgroundColor: '#1e3a8a', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  teksTombol: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  catatan: { marginTop: 12, color: '#64748b', fontSize: 12, textAlign: 'center' },
});
```

### Penjelasan Kode

**`data/mahasiswa.js`** — Modul ini memegang lima data baku yang sama persis dengan bab-bab lain (Bab 6 dan Bab 10 memakai data identik). `cariMahasiswa` memanfaatkan `find` (Bab 3) untuk mencocokkan `id`; fungsi ini dipakai oleh layar Detail dan Form. Pada Bab 10, isi modul ini diganti oleh hasil `fetch` dari API — struktur modul terpisah membuat penggantian itu hanya menyentuh satu berkas.

**`lib/session.js`** — Status masuk di memori dengan tiga fungsi: membaca status (`isLoggedIn`), mengubahnya (`setLoggedIn`) sekaligus memberi tahu pendengar (`pendengar` — himpunan fungsi yang didaftarkan lewat `subscribe`). Pola subscribe inilah yang membuat layout `(app)` ikut ter-render ulang saat status berubah. Modul ini sengaja kecil karena akan "dibuang" di Bab 9 (diganti Context) dan Bab 13 (diganti token sungguhan) — tujuannya hanya membuat pola protected screen dapat dicoba tanpa infrastruktur tambahan.

**`app/_layout.js`** — Layout root membungkus seluruh aplikasi dalam satu stack. Dua layar didaftarkan: `(app)` — grup berisi seluruh aplikasi setelah login, dengan header disembunyikan karena grup itu menampilkan tab-nya sendiri — dan `login` dengan judul "Masuk". Atribut `screenOptions` memberi gaya seragam: latar biru tua, teks putih, judul di tengah. `StatusBar` mengatur warna bilah status (Bab 2 dan 6), jadi tidak diulang di sini.

**`app/index.js`** — Halaman pertama yang dibuka aplikasi. Tugasnya satu: **mengarahkan** (redirect) — jika sudah masuk ke grup `(app)`, jika belum ke `/login`. Logika "ke mana pertama kali" yang terpusat di satu berkas membuat aplikasi mudah dipahami; pola yang sama dipakai Project Akhir.

**`app/login.js`** — Layar masuk yang sengaja disederhanakan: dua `TextInput` dan satu `Pressable`. Yang penting di sini adalah alurnya — `setLoggedIn(true)` lalu `router.replace('/(app)')`. Perhatikan `replace`, bukan `push`: pengguna yang sudah masuk tidak boleh bisa menekan kembali dan "mundur" ke layar login; `replace` mengganti login dengan beranda pada riwayat. Ini contoh awal keputusan navigasi yang berdampak pada keamanan pengalaman pengguna (UX). Validasi isian di Bab 8, autentikasi sungguhan di Bab 13.

**`app/(app)/_layout.js`** — Jantung protected screen pada praktikum ini. Komponen membaca status masuk lewat `useState` yang diinisialisasi dari `isLoggedIn`, lalu berlangganan perubahan lewat `useEffect(() => subscribe(setMasuk), [])` — nilai balik `subscribe` (fungsi pembatalan) otomatis dipakai React sebagai pembersih efek. Jika belum masuk, layout mengembalikan `<Redirect href="/login" />` — pengguna tidak akan pernah melihat konten tab. Jika sudah masuk, ditampilkan `<Tabs />` dengan dua layar: `index` (Beranda) dan `mahasiswa` (grup folder berisi stack). `tabBarIcon` memakai `Ionicons` dengan varian terisi/kosong (`focused`); `headerShown: false` mencegah header ganda dengan stack Mahasiswa.

**`app/(app)/index.js`** — Beranda memadukan dua pola dalam satu layar: `<Link asChild>` untuk tautan yang terlihat (ke Daftar dan Form), dan `router.replace('/login')` di dalam fungsi `keluar` — perpindahan yang digerakkan logika setelah status dikosongkan. Inilah demonstrasi bahwa gaya deklaratif dan imperatif hidup berdampingan sesuai perannya.

**`app/(app)/mahasiswa/_layout.js`** — Stack kedua (nested) yang hanya berlaku untuk layar di folder `mahasiswa/`. Tiga layar didaftarkan dengan judul masing-masing; dengan struktur ini tab Mahasiswa memiliki riwayat sendiri — Daftar → Detail → Form — dan tombol kembali Android bekerja alami di dalam stack.

**`app/(app)/mahasiswa/index.js`** — Daftar Mahasiswa memakai `FlatList` (Bab 5) dan setiap kartu dibungkus `Link` dengan `href` berbentuk objek: `pathname` menunjuk pola rute dinamis `/mahasiswa/[id]`, `params` mengisi nilai `id`. `asChild` memindahkan perilaku tautan ke `Pressable`, sehingga seluruh kartu dapat ditekan; alamat layar menjadi `/mahasiswa/2201001` — dynamic route dalam tindakan.

**`app/(app)/mahasiswa/[id].js`** — Detail membaca `id` lewat `useLocalSearchParams`. Nilai dari alamat selalu bertipe string, karena itu `cariMahasiswa(String(id))` memastikan perbandingan aman. Jika data tidak ditemukan (misal alamat diketik manual dengan `id` salah), layar menampilkan pesan dan tautan kembali — pola empty state yang dibahas lebih dalam di Bab 10. Tautan "Edit Data ini" menuju `/mahasiswa/tambah` dengan parameter `edit`.

**`app/(app)/mahasiswa/tambah.js`** — Form ini melayani dua mode lewat parameter `edit`: tanpa parameter ia mode tambah; dengan parameter ia mode edit. `useEffect` dengan dependensi `[edit]` mengisi nilai awal dari data lama saat mode edit (dan meresetnya saat berpindah mode). `<Stack.Screen>` di dalam komponen mengubah judul layar secara dinamis — pola yang diizinkan Expo Router untuk menyesuaikan header dari dalam layar. Tombol simpan memeriksa kelengkapan isian (validasi penuh di Bab 8) lalu `Alert` dan `router.back()` — kembali ke Detail atau Daftar.

### Hasil yang Diharapkan

Setelah mengikuti langkah kerja, amati perilaku berikut (bandingkan dengan layar ponsel Anda):

- Saat pertama dibuka, aplikasi langsung menampilkan layar **Masuk** (karena `index.js` mengarahkan pengguna yang belum masuk ke `/login`).
- Isi email dan sandi apa pun (misal `admin@univ.ac.id` dengan sandi `••••••••`), tekan **Masuk**: aplikasi berpindah ke Beranda dengan bar **dua tab** di bawah ("Beranda" dan "Mahasiswa").
- Tab **Mahasiswa** menampilkan daftar **5 kartu** mahasiswa (Budi Santoso, Siti Aminah, Agus Wijaya, Dewi Lestari, Rizky Pratama) lengkap dengan NIM dan program studi.
- Menekan kartu membuka **Detail Mahasiswa** dengan judul header "Detail Mahasiswa" dan seluruh field data (NIM, prodi, angkatan, IPK, email, telepon). Tombol kembali Android (atau gesture) mengembalikan ke Daftar.
- Menekan "Edit Data ini" membuka form dengan judul **"Edit Mahasiswa"** dan isian nama/prodi/IPK yang **sudah terisi** data lama.
- Dari Beranda, "Tambah Mahasiswa Baru" membuka form berjudul **"Tambah Mahasiswa"** dengan isian kosong; menekan **Tambah Mahasiswa** saat semua kosong memunculkan `Alert` "Data belum lengkap".
- Menekan **Keluar** di Beranda mengembalikan ke layar Masuk — dan menekan tombol kembali pada saat itu **tidak** mengembalikan ke Beranda (karena memakai `replace`).
- Melalui emulator Android, uji juga perilaku kembali saat aplikasi dibuka ulang: Anda berada di layar terakhir yang dibuka, bukan di layar pertama (riwayat stack tersimpan selama sesi).

### Troubleshooting

**Masalah:** Proyek menampilkan layar kosong atau pesan kesalahan "main" tidak dikenal setelah mengganti `package.json`.
**Penyebab:** Nilai `"main"` salah ketik, atau nilai lama (`node_modules/expo/AppEntry.js`) belum diganti — Metro masih mencari `App.js` yang sudah dihapus.
**Solusi:** Pastikan nilai persis `"expo-router/entry"` pada properti `main` (*⚠ version-sensitive — verifikasi format pada dokumentasi resmi untuk SDK Anda*), lalu mulai ulang bundler dengan `npx expo start -c` (tanda `-c` membersihkan cache).
**Pencegahan:** Ubah `main` sebelum menghapus `App.js`, dan biasakan menjalankan `npx expo start -c` setiap kali mengubah konfigurasi entry/route.

**Masalah:** Saat menekan kartu mahasiswa, layar tidak berpindah atau `Pressable` terasa "mati".
**Penyebab:** `Link` dipakai tanpa `asChild` sambil membungkus `Pressable` — dua komponen sentuh saling berebut gestur, atau tautan dirender sebagai teks tanpa gaya sentuh.
**Solusi:** Gunakan pola `<Link href={...} asChild><Pressable>...</Pressable></Link>`; pastikan `href` memakai bentuk objek `{ pathname: '/mahasiswa/[id]', params: { id: ... } }` — bukan string `/mahasiswa/${id}` yang disusun manual.
**Pencegahan:** Tetapkan aturan tim: semua tautan berisi elemen UI buatan memakai `asChild`; biasakan menulis `href` objek untuk rute berparameter sejak awal.

**Masalah:** Layar Detail menampilkan "Data mahasiswa tidak ditemukan" padahal datanya ada.
**Penyebab:** Parameter yang diterima `useLocalSearchParams` tidak cocok dengan `id` data — biasanya karena perbandingan dilakukan terhadap nilai non-string (parameter selalu string, sedangkan `id` di data bisa bertipe lain), atau segmen rute salah (misal `[nim]` saat data memakai `id`).
**Solusi:** Normalisasi dengan `String(id)` sebelum pencarian, dan pastikan nama berkas dinamis (`[id].js`) konsisten dengan kunci objek data serta `pathname` pada `href`.
**Pencegahan:** Jadikan konversi `String(...)` sebagai kebiasaan tetap untuk semua parameter alamat; tulis nama segmen dinamis mengikuti kunci data yang sesungguhnya.

**Masalah:** Muncul dua batang judul bertumpuk (header ganda) di layar Detail atau Form.
**Penyebab:** Tabs dan Stack sama-sama menampilkan header: `headerShown` bawaan keduanya bernilai `true`, sehingga layar di dalam stack Mahasiswa mendapat header dari stack sekaligus dari tab.
**Solusi:** Sembunyikan header tab dengan `headerShown: false` pada `screenOptions` komponen `<Tabs />` di `app/(app)/_layout.js`; biarkan stack terdalam yang menampilkan judul.
**Pencegahan:** Tentukan "pemilik header" sejak merancang struktur: satu navigator menampilkan header per layar; catat keputusan ini pada dokumentasi struktur folder project.

**Masalah:** Data Beranda tidak "segar" setelah kembali dari layar lain — misalnya daftar tidak memperbarui tampilannya.
**Penyebab:** Layar tab tetap terpasang di memori; `useEffect` biasa hanya berjalan saat komponen terpasang pertama kali, sehingga proses penyegaran tidak terpicu saat layar kembali difokuskan.
**Solusi:** Pindahkan proses penyegaran ke `useFocusEffect` (dengan `useCallback` yang dependensinya tepat) agar berjalan setiap layar mendapat fokus.
**Pencegahan:** Sejak awal, bedakan dua jenis proses: pengambilan data sekali jalan memakai `useEffect`, penyegaran saat fokus memakai `useFocusEffect`; pakai `useFocusEffect` tanpa `useCallback` akan menyebabkan efek berjalan terus-menerus — perhatikan peringatan konsol.

## Studi Kasus

**Kasus: Aplikasi Layanan Klinik "SehatIn" — bagaimana struktur navigasi menentukan kualitas layanan.**

Sebuah klinik pratama di kota Semarang sedang membangun aplikasi mobile bernama SehatIn agar pasien dapat membuat janji temu, melihat riwayat kunjungan, dan menerima pengumuman klinik. Tim pengembang — tiga orang, belum berpengalaman mobile — harus memutuskan struktur navigasi sebelum menulis satu baris kode. Mereka mempertimbangkan dua alternatif: (1) layar berurutan seperti buku (hanya stack), atau (2) campuran tab dan stack (Subbab 7.3 dan 7.6).

Mari kita analisis keputusan itu dengan materi bab ini. Alternatif pertama (stack murni) tampak sederhana tetapi gagal pada satu pertanyaan: *layar mana yang "rumah" pasien?* Tanpa tab, pasien yang ingin melihat jadwal harus menekan kembali berkali-kali dari layar terdalam — kunjungan ke fungsi utama menjadi perjalanan bolak-balik yang melelahkan. Hierarki stack dirancang untuk alur sementara (detail, formulir), bukan fungsi yang diakses setiap hari. Karena itu dipilih tiga tab tingkat atas — **Beranda** (pengumuman dan ringkasan), **Janji Temu** (jadwal), dan **Profil** — dengan stack di dalam setiap tab untuk alur seperti *Daftar Janji → Detail Janji → Form Pembatalan*.

Keputusan kedua menyangkut **protected screen**. Klinik menangani data medis: pasien hanya boleh melihat riwayatnya sendiri, staf administrasi memiliki layar tambahan untuk mengelola jadwal dokter. Alih-alih memeriksa hak akses di setiap layar (rentan terlewat), tim menempatkan pemeriksaan pada layout grup yang melindungi seluruh layar "dalam aplikasi" (Subbab 7.8) — satu titik kontrol yang berlaku untuk semua layar baru. Keputusan ketiga adalah **deep linking**: saat dokter membatalkan jadwal, aplikasi mengirim notifikasi (Bab 12) yang membuka *Detail Janji* tertentu. Tanpa URL nyata per layar (keunggulan file-based routing), fitur ini harus dibangun manual dengan pencatatan state yang rapuh; dengan Expo Router, alamat `sehatin://janji/415` tersedia secara alami dari struktur folder.

Pelajaran dari kasus ini menegaskan isi bab: **struktur navigasi adalah keputusan arsitektur, bukan sekadar hiasan**. Pilihan yang salah membuat aplikasi membingungkan (pengguna tersesat, tombol kembali tidak bisa ditebak), sulit dirawat (logika perpindahan tersebar), dan mahal dirombak. Struktur yang benar — tab untuk fungsi utama, stack untuk alur detail, satu titik pelindung, alamat nyata per layar — membuat aplikasi tumbuh tanpa kehilangan arah. Pola yang sama Anda terapkan pada Project Akhir "Sistem Informasi Akademik Mobile": tab untuk beranda/jadwal/profil, stack untuk detail mata kuliah, dan protected screen untuk seluruh layar akademik.

## Latihan

### Soal Pemahaman

1. Jelaskan perbedaan mendasar antara navigasi pola stack dan pola tab, serta berikan satu contoh fitur aplikasi yang lebih tepat memakai masing-masing pola.
2. Apa fungsi properti `"main"` pada `package.json` setelah Expo Router dipasang? Mengapa `App.js` tidak lagi dimuat setelah properti ini diubah?
3. Apa yang dimaksud dynamic route pada Expo Router? Bagaimana cara membaca nilai parameter pada layar yang dibuka melalui rute dinamis?
4. Mengapa layar yang dilindungi (protected screen) ditempatkan pada layout grup, bukan diperiksa satu per satu di setiap layar? Sebutkan satu risiko bila pemeriksaan dilakukan per layar.
5. Apa perbedaan perilaku `useEffect` dan `useFocusEffect` pada layar yang menjadi bagian dari tab? Kapan Anda memilih yang kedua?

### Soal Praktik

1. Tambahkan layar **Profil** sebagai tab ketiga pada aplikasi praktikum (buat berkas `app/(app)/profil.js` dan daftarkan pada `<Tabs />` di `(app)/_layout.js`). Isi layar dengan data statis sederhana, lalu uji perpindahan tab dan perilaku tombol kembali.
2. Ubah layar Daftar Mahasiswa agar setiap kartu juga menampilkan IPK, dan tambahkan tautan "Kembali ke Beranda" pada layar Detail dengan `router.back()` — amati perbedaannya jika memakai `router.push` (tuliskan hasil pengamatan Anda).
3. Pada Form Tambah/Edit, tambahkan satu `TextInput` untuk **telepon** yang ikut terisi saat mode edit dan diperiksa kelengkapan saat menyimpan (ikuti pola tiga field yang sudah ada).

### Soal Analisis

Sebuah aplikasi e-commerce menempatkan layar "Rincian Pesanan", "Pembayaran", dan "Status Pengiriman" sebagai tiga tab terpisah, karena tim pemasaran ingin pengguna berpindah cepat di antara ketiganya. Evaluasi keputusan tersebut: apa kelemahan tab untuk alur yang sebenarnya berjenjang (pesanan → pembayaran → pengiriman), bagaimana perilaku tombol kembali pengguna, dan struktur seperti apa yang Anda sarankan (gambar skema folder `app/`-nya)? Kaitkan jawaban Anda dengan konsep hierarki stack, riwayat, dan nested navigation pada Subbab 7.2, 7.5, dan 7.6.

## Tantangan

1. **Pelindung yang lebih hidup:** pada `lib/session.js`, tambahkan fungsi `keluar()` yang mengosongkan status; ganti pemanggilan di Beranda, lalu tambahkan penghitung waktu otomatis keluar (misal setelah 10 menit) memakai `useFocusEffect` di layout `(app)` — perhatikan cara membersihkan penghitung saat layout kehilangan fokus.
2. **Deep linking sungguhan:** coba buka aplikasi langsung pada layar Detail tanpa menelusuri menu — pada emulator, jalankan `npx uri-scheme open "siakad-mobile:///mahasiswa/2201003"` (*⚠ version-sensitive: periksa perintah yang berlaku untuk versi Expo Anda*), lalu amati layar yang terbuka dan jelaskan mengapa ini berguna untuk notifikasi (Bab 12).
3. **Drawer mandiri:** buat cabang eksperimen project, pasang drawer (Subbab 7.4), dan pindahkan menu "Pengaturan" sederhana ke drawer. Bandingkan pengalaman pengguna dengan versi tab, lalu tuliskan kesimpulan satu paragraf tentang kapan drawer lebih unggul.

## Rangkuman

1. Navigasi mobile mengatur perpindahan layar, riwayat, dan pengiriman data antar layar; pola utamanya adalah stack (berjenjang), tab (sejajar), dan drawer (laci).
2. Expo Router menerapkan file-based routing: setiap berkas di folder `app/` menjadi satu rute, dan nama berkas menjadi alamatnya.
3. Setup Expo Router pada project blank memerlukan instalasi paket (termasuk `react-native-screens` dan `react-native-safe-area-context`), perubahan `"main"` menjadi `"expo-router/entry"`, dan penambahan `"scheme"` pada `app.json`.
4. Komponen `<Stack />` dan `<Tabs />` (dari `expo-router`) membangun navigator; perbedaan utamanya adalah hierarki layar, kondisi layar yang tetap terpasang pada tab, dan perilaku kembali.
5. Navigasi deklaratif (`<Link>`, dengan `asChild` untuk membungkus `Pressable`) cocok untuk tautan yang terlihat; imperatif (`router.push`, `router.replace`, `router.back`) untuk perpindahan yang digerakkan logika.
6. Parameter dikirim lewat dynamic route (`[id]`) dan query parameter (`?edit=...`), dibaca dengan `useLocalSearchParams`, dan selalu bertipe string.
7. Nested navigation (tab berisi stack) diwujudkan dengan layout berlapis; folder bernama `(app)` adalah route group yang tidak ikut dalam alamat.
8. `useFocusEffect` (dengan `useCallback`) memicu proses setiap layar mendapat fokus — untuk penyegaran data, bukan pengganti `useEffect` pada proses sekali jalan.
9. Protected screen dilakukan pada satu titik — layout grup — dengan pola `<Redirect href="/login" />`, dan layar login harus berada di luar grup yang dilindungi agar tidak terjadi redirect loop.

## Refleksi

1. Apakah Anda pernah tersesat di dalam sebuah aplikasi (tidak tahu cara kembali atau kehilangan posisi)? Pola navigasi mana pada bab ini yang menurut Anda dapat mencegah pengalaman tersebut, dan bagaimana Anda mengujinya?
2. Manakah yang lebih Anda pahami dengan cepat: berpikir dalam "folder dan berkas" (file-based routing) atau dalam "objek dan registrasi"? Bagaimana preferensi ini memengaruhi cara Anda menjelaskan arsitektur aplikasi kepada rekan tim?
3. Ketika aplikasi Anda tumbuh (jumlah layar mencapai puluhan), keputusan struktur apa dari bab ini yang paling berisiko jika salah sejak awal? Mengapa?
4. Bagaimana pemahaman tentang navigation lifecycle mengubah cara Anda merencanakan fitur "daftar harus selalu segar saat dibuka"?

## Evaluasi Bab

### Pilihan Ganda

1. Pola navigasi yang paling tepat untuk alur "Daftar → Detail → Formulir" adalah …
   A. Tab, karena perpindahan antar layar instan.
   B. Stack, karena layar berjenjang dan saling menutupi.
   C. Drawer, karena menghemat ruang layar.
   D. Deep link, karena memakai alamat URL.

2. Fungsi properti `"main": "expo-router/entry"` pada `package.json` adalah …
   A. Menentukan nama aplikasi pada layar beranda perangkat.
   B. Mengganti titik masuk aplikasi menjadi bootstrap Expo Router yang membaca folder `app/`.
   C. Memaksa semua rute ditulis dalam satu berkas `entry.js`.
   D. Mengaktifkan mode produksi Metro bundler.

3. Perbedaan utama komponen `<Tabs />` dan `<Stack />` pada Expo Router adalah …
   A. Tabs membutuhkan `@react-navigation/drawer`, Stack tidak.
   B. Tabs menampilkan layar sejajar yang tetap terpasang, Stack menyusun layar berjenjang yang saling menutupi.
   C. Stack tidak mendukung header, Tabs selalu menampilkan header.
   D. Tabs hanya bisa dipakai pada folder `(app)`.

4. Berkas `app/mahasiswa/[id].js` akan membuka alamat …
   A. `/mahasiswa/[id]` saja.
   B. `/mahasiswa/{id}`.
   C. `/mahasiswa/<nilai>` untuk nilai apa pun, misal `/mahasiswa/2201001`.
   D. `/mahasiswa?detail=true`.

5. Nilai yang dibaca dari `useLocalSearchParams()` memiliki tipe …
   A. Selalu angka (number).
   B. Selalu string (atau array string bila segmen diulang).
   C. Bergantung pada tipe data asli di state.
   D. Objek JSON.

6. Mengapa `useFocusEffect` lebih tepat daripada `useEffect` untuk menyegarkan daftar saat layar tab kembali difokuskan?
   A. Karena `useEffect` tidak tersedia pada ekspor `expo-router`.
   B. Karena layar tab tetap terpasang di memori, sehingga efek sekali jalan tidak terpicu ulang oleh fokus.
   C. Karena `useFocusEffect` berjalan lebih cepat daripada `useEffect`.
   D. Karena `useEffect` hanya berjalan di perangkat Android.

7. Pada pola protected screen, `<Redirect href="/login" />` ditempatkan di …
   A. Setiap layar yang dilindungi, satu per satu.
   B. Layout grup yang membungkus seluruh layar yang dilindungi.
   C. Berkas `app/login.js`.
   D. `lib/session.js`.

8. Mengapa layar Login pada praktikum buku ini berada di luar grup `(app)`?
   A. Agar mudah ditemukan oleh pengguna.
   B. Karena grup `(app)` adalah tab, dan login tidak boleh menjadi tab.
   C. Agar layar login tidak ikut dilindungi, yang akan menyebabkan redirect loop.
   D. Karena `useLocalSearchParams` tidak tersedia di dalam grup.

### Soal Uraian

1. Jelaskan perbedaan navigasi deklaratif (`<Link>`) dan imperatif (`router`) dengan satu contoh kasus masing-masing pada aplikasi manajemen data mahasiswa, serta alasan pemilihan gaya untuk setiap contoh.
2. Gambarkan struktur folder `app/` untuk aplikasi dengan tiga tab (Beranda, Transaksi, Profil) di mana tab Transaksi memiliki alur berjenjang "Daftar → Detail → Bukti". Tunjukkan di mana `_layout.js` diletakkan dan apa isi ringkas setiap layout tersebut.
3. Sebuah bug dilaporkan: "setelah kembali dari Form ke Daftar, daftar tidak menampilkan perubahan yang baru disimpan". Identifikasi kemungkinan penyebab berdasarkan navigation lifecycle dan parameter antar layar, lalu usulkan perbaikan — termasuk implikasi jika perbaikan dilakukan dengan state global (Bab 9).

### Kunci Jawaban

<details>
<summary>Klik untuk melihat kunci jawaban pilihan ganda</summary>

1. **B** — Alur daftar→detail→form bersifat berjenjang; stack menjaga riwayat kembali yang natural.
2. **B** — `expo-router/entry` adalah titik masuk yang membaca struktur folder `app/` dan menyiapkan navigator.
3. **B** — Tab menampilkan layar sejajar yang tetap terpasang; stack menyusun layar berjenjang yang saling menutupi.
4. **C** — Kurung siku pada nama berkas menandakan segmen dinamis yang menerima nilai apa pun.
5. **B** — Nilai berasal dari alamat sehingga selalu string; segmen yang diulang menghasilkan array.
6. **B** — Layar tab tidak dilepas dari memori, sehingga efek yang hanya berjalan saat pemasangan tidak terpicu oleh fokus ulang.
7. **B** — Pelindung ditempatkan pada layout grup agar berlaku untuk semua layar di dalamnya (satu titik kontrol).
8. **C** — Login di dalam grup yang dilindungi akan dilempar ke dirinya sendiri (redirect loop).

**Pedoman jawaban uraian:** (1) nilai bobot pada ketepatan memilih gaya deklaratif untuk tautan yang terlihat dan imperatif untuk perpindahan hasil-proses (mis. `router.replace` setelah login, `router.back` setelah simpan), serta alasan yang menyebutkan keterbacaan/aksesibilitas vs kontrol logika; (2) struktur harus memuat `_layout.js` root (Stack), `(app)/_layout.js` (Tabs dengan tiga screen) dan `(app)/transaksi/_layout.js` (Stack berisi index, [id], bukti) — skor penuh bila route group dan nested stack benar; (3) penyebab utama adalah proses penyegaran tidak dipicu fokus (perlu `useFocusEffect`) atau parameternya tidak dipertahankan; perbaikan dengan state global sah secara konsep tetapi harus mempertimbangkan trade-off riwayat/alamat (Subbab 7.5).
</details>