# BAB 5 — Dasar React Native

## Deskripsi Singkat

Bab ini memindahkan Anda dari dunia React di web (Bab 4) ke dunia aplikasi mobile sungguhan. Anda akan mengenal komponen inti pembentuk antarmuka React Native — **View**, **Text**, **Image**, **Pressable**, **Button**, **TextInput**, **ScrollView**, dan **FlatList** — beserta sistem penataan gaya (**StyleSheet**), pengaturan tata letak (**Flexbox**), penanganan area aman layar (**SafeAreaView**), dan cara memperlakukan perbedaan platform Android dan iOS. Seluruh konsep dipertemukan dalam praktikum membangun layout Profil Mahasiswa yang menjadi fondasi antarmuka untuk Bab 6 (membangun UI), Bab 7 (navigasi), dan Bab 8 (form dan input).

## Tujuan Pembelajaran

Setelah mempelajari bab ini, Anda diharapkan mampu:

1. menjelaskan perbedaan mendasar antara React untuk web dan React Native;
2. mengidentifikasi fungsi dan konteks penggunaan masing-masing komponen inti: View, Text, Image, Pressable, Button, TextInput, ScrollView, dan FlatList;
3. menerapkan StyleSheet untuk menata gaya komponen, termasuk pola style bertumpuk (array) dan style bersyarat;
4. menyusun tata letak responsif menggunakan Flexbox, `gap`, dan `useWindowDimensions`;
5. menganalisis kapan memakai ScrollView dan kapan memakai FlatList berdasarkan jumlah dan sifat data;
6. mengimplementasikan penanganan perbedaan platform dengan `Platform.OS`, `Platform.select`, dan ekstensi file khusus platform;
7. merancang layout Profil Mahasiswa lengkap dengan data baku dan daftar lima mahasiswa.

## Peta Konsep

```text
                            ┌─ React untuk Web → DOM (Bab 4)
React ──────────────────────┤
                            └─ React Native → komponen native
                                        │
        ┌───────────────────────────────┼──────────────────────────────┐
   Komponen Inti                 Tata Letak & Gaya             Perbedaan Platform
   View · Text · Image          StyleSheet · Flexbox           Platform.OS
   Pressable · Button           responsive                     Platform.select
   TextInput · ScrollView       (useWindowDimensions)          SafeAreaView ⇒
   FlatList                                                     react-native-safe-area-context
        └───────────────────────────────┴──────────────────────────────┘
                          Layout Profil Mahasiswa (Praktikum 5)
```

## Materi

### 5.1 React untuk Web vs React Native

React lahir pada 2013 sebagai pustaka untuk membangun antarmuka web: komponen ditulis dengan JSX, lalu **react-dom** merendernya menjadi elemen **DOM**. Ketika Facebook meluncurkan React Native pada 2015, ide dasarnya tidak berubah — komponen, **props**, **state**, dan **hook** tetap sama persis — tetapi target rendernya diganti: alih-alih DOM, React Native merender **komponen native** (komponen asli platform), yaitu `UIView` di iOS dan `ViewGroup` di Android. Inilah inti "mengapa teknologi ini ada": satu bahasa (JavaScript), satu cara berpikir (React), dua platform sekaligus — dengan imbalan lapisan abstraksi: fitur spesifik platform kadang memerlukan modul native tambahan, dan perilaku visual tidak pernah 100% identik antarponsel. Konsep dasar cross-platform dan arsitekturnya sudah Anda pelajari di Bab 1; di sini kita fokus pada konsekuensi praktisnya saat menulis kode.

Perbedaan praktis yang paling terasa saat menulis kode:

| Aspek | React (web) | React Native |
|---|---|---|
| Elemen yang dirender | DOM: `div`, `span`, `p`, `img`, `button` | Komponen native: `View`, `Text`, `Image`, `Pressable` |
| Styling | File CSS: selector, class, cascade | Objek JavaScript: `StyleSheet` (tidak ada selector maupun inheritance) |
| Layout | CSS Box Model + Flexbox (default `row`) | Mesin layout **Yoga** — Flexbox (default `column`) |
| Event sentuhan | `onClick`, `onMouseEnter` | `onPress`, `onLongPress` |
| Navigasi | URL browser / react-router | Tidak ada URL — pustaka navigasi (Bab 7: Expo Router) |
| API browser | `document`, `window`, `localStorage` | Tidak ada — pakai API perangkat via modul Expo (Bab 12) |

Perhatikan baris terakhir: di React Native tidak ada browser, sehingga seluruh API web yang bergantung pada `document` dan `window` tidak tersedia. Konsekuensinya, **komponen host** (host components — komponen bawaan yang diterjemahkan langsung menjadi elemen native) pun berbeda, dan pemikiran tentang teks berubah: di web, teks bisa berada langsung di dalam `div`; di React Native, teks **wajib** berada di dalam komponen `Text` — inilah topik 5.2. Yang tidak berubah sama sekali adalah cara berpikir komponensial, alur props dan state, serta penggunaan hook — jika Anda sudah menguasai Bab 4, separuh perjalanan bab ini telah Anda lalui; yang tersisa hanyalah "alfabet" visual React Native.

### 5.2 View dan Text

**View** adalah komponen wadah (container) dasar — padanan `div` di dunia React Native. Hampir semua layout disusun dari View yang saling bersarang: View luar membungkus kartu, View dalam menyusun baris, dan seterusnya. View hanya boleh menerima komponen lain sebagai anak, bukan teks mentah.

**Text** adalah satu-satunya komponen yang boleh menampilkan teks. Semua tulisan di layar — judul, paragraf, label, bahkan angka — harus dibungkus Text. Teks dapat disarangkan (nested) untuk mencampur gaya dalam satu kalimat, dan menerima properti seperti `numberOfLines` untuk membatasi jumlah baris (sisanya dipotong dengan elipsis).

File: App.js
```jsx

import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.kartu}>
      <Text style={styles.judul}>Sistem Informasi Akademik</Text>
      <Text numberOfLines={2}>
        Selamat datang di aplikasi <Text style={styles.tebal}>mobile</Text> pertama Anda.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: { backgroundColor: '#eef3fb', borderRadius: 10, padding: 16 },
  judul: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  tebal: { fontWeight: 'bold', color: '#1a56db' },
});
```

Penjelasan: komponen `App` merender satu `View` bergaya kartu yang berisi dua `Text`. Perhatikan bahwa kalimat kedua memakai Text bersarang — kata "mobile" dibungkus `Text` lagi dengan gaya tebal, sebuah pola untuk menonjolkan sebagian kalimat tanpa memecah paragraf. `numberOfLines={2}` memastikan teks panjang dipotong menjadi maksimal dua baris sehingga kartu tidak berubah tinggi. Semua gaya didefinisikan di `StyleSheet.create` (dibahas di 5.8), dan `marginBottom` dipakai alih-alih selector CSS karena di React Native setiap komponen menata dirinya sendiri.

Kesalahan paling umum mahasiswa pemula adalah menulis teks langsung di dalam `View` — `<View>Halo!</View>` ✗ (memicu error), sedangkan `<View><Text>Halo!</Text></View>` ✓ adalah bentuk yang benar. Dengan View dan Text saja Anda sebenarnya sudah bisa menggambar hampir semua struktur antarmuka non-gambar dan non-input. Bagian berikut menambahkan tiga kemampuan yang belum ada: menampilkan gambar, menerima sentuhan, dan menerima ketikan.

### 5.3 Image

**Image** menampilkan gambar — foto profil, logo, ilustrasi. Bedanya dengan `<img>` web: sumber gambar dibedakan menjadi dua tipe, dan gambar jarak jauh (remote) **wajib diberi dimensi eksplisit** karena ukurannya tidak bisa dihitung sebelum dimuat.

File: App.js
```jsx

import { Image, StyleSheet, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.baris}>
      {/* Gambar lokal: dibundel bersama aplikasi */}
      <Image source={require('./assets/icon.png')} style={styles.logo} />

      {/* Gambar jarak jauh: dimuat dari internet saat aplikasi berjalan */}
      <Image
        source={{ uri: 'https://example.com/foto/2201001.jpg' }}
        style={styles.foto}
        resizeMode="cover"
        accessibilityLabel="Foto mahasiswa"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  baris: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 48, height: 48 },
  foto: { width: 72, height: 72, borderRadius: 36 },
});
```

Penjelasan: gambar lokal memakai `source={require('./assets/icon.png')}` — file disertakan ke dalam bundel aplikasi saat build, jadi selalu tersedia meskipun tanpa internet. Gambar jarak jauh memakai `source={{ uri: '...' }}` dan dimuat saat aplikasi berjalan; karena itulah ia butuh `width` dan `height` di style — React Native tidak dapat menebak ukuran piksel gambar yang belum diunduh. `resizeMode="cover"` memerintahkan gambar memenuhi kotak dengan memotong bagian yang meluap (mirip `object-fit: cover` di CSS), cocok untuk foto profil berbentuk lingkaran. URL `example.com` sengaja dipakai sebagai placeholder — ganti dengan URL gambar sungguhan saat mencoba, dan perlu diingat bahwa gambar jaringan baru tampil jika perangkat punya koneksi internet. `accessibilityLabel` memberi nama untuk pembaca layar, praktik aksesibilitas yang dibahas lebih dalam di Bab 6.

Mengapa pola ini ada? Memisahkan sumber lokal dan jarak jauh memberi kendali atas strategi aset: gambar penting (logo, ikon) dibundel agar selalu tampil, gambar dinamis (foto profil) diambil dari server. Kelemahannya, gambar jarak jauh butuh koneksi dan memori, sehingga aplikasi produksi biasanya memakai solusi bercaching seperti `expo-image` (pemasangan: `npx expo install expo-image`). Untuk bab ini, `Image` bawaan sudah mencukupi; foto dari kamera atau galeri perangkat dibahas di Bab 12 (`expo-image-picker`).

Satu pola penting yang akan Anda pakai berulang kali: jika foto belum tersedia (misalnya data mahasiswa belum punya foto), jangan biarkan kotak kosong — tampilkan **placeholder** berupa lingkaran berisi inisial nama. Pola inilah yang dipakai praktikum bab ini.

### 5.4 Pressable dan Button

Aplikasi mobile hidup dari sentuhan. React Native menyediakan dua komponen utama untuk itu: **Button** dan **Pressable**.

**Button** adalah tombol siap pakai bergaya bawaan platform: di iOS ia tampil sebagai teks biru khas iOS, di Android sebagai tombol berwarna. Properti yang didukung sangat terbatas — `title`, `onPress`, `color`, `disabled` — dan Anda **tidak bisa** mengubah tata letak isinya atau menyisipkan ikon — `<Button title="Simpan" onPress={simpan} color="#1a56db" />` adalah satu-satunya bentuk pemakaiannya.

**Pressable** adalah pendekatan modern yang direkomendasikan: ia menerima anak (children) bebas, sehingga Anda dapat menyusun tombol dari View dan Text dengan gaya apa pun; style-nya bisa berupa fungsi yang menerima status `pressed`; dan ia punya properti `android_ripple` (efek riak khas Android), `hitSlop` (memperluas area sentuh di luar batas visual), `disabled`, dan `onLongPress`.

File: App.js
```jsx

import { Pressable, StyleSheet, Text } from 'react-native';

export default function App() {
  return (
    <Pressable
      onPress={() => console.log('Tombol ditekan')}
      style={({ pressed }) => [
        styles.tombol,
        pressed && styles.tombolTertekan,
      ]}
      android_ripple={{ color: '#c9d9f8' }}
      hitSlop={8}
    >
      <Text style={styles.labelTombol}>Simpan Data</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tombol: {
    backgroundColor: '#1a56db',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  tombolTertekan: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  labelTombol: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
```

Penjelasan: `style` sebagai fungsi menerima `{ pressed }` — bernilai `true` selama jari menekan — sehingga gaya `tombolTertekan` (sedikit transparan dan mengecil) diterapkan hanya saat ditekan. Ini contoh **style bersyarat** pertama Anda: `pressed && styles.tombolTertekan` menghasilkan `false` (diabaikan React Native) ketika tidak ditekan, persis pola array style yang dibahas di 5.8. `android_ripple` memberi umpan balik visual khas Material Design di Android, sedangkan `hitSlop={8}` menambah area sentuh 8 piksel ke segala arah — penting karena target sentuh yang terlalu kecil menyulitkan jari pengguna. Umpan balik "ditekan" ini krusial di mobile: pengguna harus *merasakan* bahwa tombolnya benar-benar merespons.

Kapan memakai yang mana? **Button** cukup untuk prototipe cepat atau tombol sekali pakai tanpa desain khusus. **Pressable** adalah pilihan default untuk aplikasi sungguhan — kemampuan mengatur gaya penuh dan umpan balik sentuh menjadikannya komponen sentuh utama di buku ini, sesuai pola modern React Native (pendahulunya, keluarga `TouchableOpacity`, masih banyak di kode lama, tetapi Pressable menggantikan perannya). Semua interaksi pada praktikum bab ini dan bab-bab berikutnya memakai Pressable.

### 5.5 TextInput

**TextInput** adalah kotak isian teks — padanan `<input>` dan `<textarea>` di web. Dasar penggunaannya sederhana: satu **state** untuk menampung nilai, dan `onChangeText` untuk memperbarui state setiap kali pengguna mengetik. Pola ini dinamakan **controlled component** (komponen terkendali) karena isi kotak sepenuhnya dikendalikan oleh state — Anda sudah mengenal konsepnya di Bab 4, dan penerapannya secara lengkap — validasi, keyboard, dan UX form — dibahas di Bab 8.

File: App.js
```jsx

import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function App() {
  const [nama, setNama] = useState('');

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Nama Mahasiswa</Text>
      <TextInput
        style={styles.input}
        value={nama}
        onChangeText={setNama}
        placeholder="Ketik nama lengkap"
        autoCapitalize="words"
      />
      <Text>Halo, {nama ? nama : 'belum ada nama'}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { padding: 16 },
  label: { marginBottom: 6, fontSize: 14, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#b9c4d6',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
});
```

Penjelasan: setiap ketukan tombol memicu `onChangeText` yang memanggil `setNama`, sehingga state diperbarui dan komponen dirender ulang — itulah sebabnya baris "Halo, ..." langsung ikut berubah. `value={nama}` membuat kotak selalu mencerminkan state; tanpa `value`, komponen menjadi tidak terkendali (uncontrolled) dan kotak tidak sinkron dengan state. Properti lain yang perlu dikenal: `keyboardType` (`"default"`, `"numeric"`, `"email-address"`, `"phone-pad"`) untuk memilih papan ketik, `secureTextEntry` untuk kata sandi (karakter tersamar), `multiline` untuk teks panjang, dan `maxLength` untuk membatasi panjang. Seluk-beluk keyboard — termasuk keyboard yang menutupi input — akan dibahas tuntas di Bab 8.

### 5.6 ScrollView dan FlatList

Konten aplikasi nyata hampir selalu lebih panjang dari layar. Dua komponen jawabannya: **ScrollView** dan **FlatList**.

**ScrollView** menggulirkan semua anaknya sekaligus: seluruh isi dirender sejak awal, dan guliran hanya menggeser pandangan. Sederhana dan cocok untuk konten yang singkat dan berukuran pasti — artikel, formulir, sekumpulan kartu yang sedikit. Kelemahannya fatal untuk data besar: merender 1.000 item sekaligus menghabiskan memori dan membuat aplikasi tersendat.

**FlatList** menjawab dengan **virtualisasi** (virtualization): hanya item yang terlihat di layar (plus beberapa item cadangan di atas dan di bawah) yang dirender. Saat Anda menggulir, item yang lewat dibuang dan yang baru dibangun — itulah "mengapa teknologi ini ada": daftar panjang tetap mulus karena kerjanya sebanding dengan layar, bukan dengan jumlah data. FlatList menerima data lewat properti `data` (array) dan menentukan tampilan tiap item lewat `renderItem`.

File: App.js
```jsx

import { FlatList, StyleSheet, Text, View } from 'react-native';

const DATA = [
  { id: '1', nama: 'Budi Santoso', nim: '2201001' },
  { id: '2', nama: 'Siti Aminah', nim: '2201002' },
];

export default function App() {
  return (
    <FlatList
      data={DATA}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.baris}>
          <Text style={styles.nama}>{item.nama}</Text>
          <Text style={styles.nim}>{item.nim}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  baris: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#e4e9f2' },
  nama: { fontSize: 16 },
  nim: { fontSize: 13, color: '#667085' },
});
```

Penjelasan: `data` adalah array objek; `renderItem` menerima `{ item }` dari destructuring dan mengembalikan JSX untuk satu baris; `keyExtractor` memberi tahu React identitas unik tiap item — wajib diisi agar proses pembaruan daftar efisien dan tidak memunculkan peringatan "unique key" (ingat konsep `key` di Bab 4). FlatList juga menyediakan `ItemSeparatorComponent` (pemisah antarbaris), `ListHeaderComponent` dan `ListFooterComponent` (konten di atas/bawah daftar), `ListEmptyComponent` (tampilan saat data kosong), serta `numColumns` untuk daftar bertingkat kolom. Dua hal yang perlu diingat untuk pemakaian profesional: jangan menaruh FlatList di dalam ScrollView dengan arah yang sama (keduanya berebut kontrol gulir dan virtualisasi rusak — solusinya, jadikan FlatList komponen luar dengan memindahkan konten lain ke `ListHeaderComponent`), dan data dari server (Bab 10) memakai `refreshing`/`onRefresh` untuk menarik ulang data. Aturan praktisnya: **ScrollView untuk konten pendek yang berstruktur tetap, FlatList untuk data apa pun yang bisa panjang** — daftar mahasiswa pada praktikum bab ini jelas masuk kategori kedua.

### 5.7 SafeAreaView

Ponsel modern tidak berbentuk persegi: bagian atas layar memiliki **notch** (tonjolan kamera) atau **status bar** (bilah status), bagian bawah memiliki **home indicator** (bilah navigasi sistem) di iPhone. Konten tanpa perhitungan akan tertutup atau tertabrak elemen-elemen sistem ini. Area yang masih aman untuk konten disebut **safe area** (area aman), dan jarak dari tepi layar ke area aman disebut **inset** (sisipan).

**SafeAreaView** bawaan React Native menambahkan padding otomatis sebesar inset tersebut — tetapi hanya di iOS; di Android ia tidak melakukan apa-apa. Keterbatasan inilah yang membuat komunitas beralih ke pustaka resmi **react-native-safe-area-context**: dapat dipasang dengan `npx expo install react-native-safe-area-context`, bekerja di kedua platform, dan menyediakan hook `useSafeAreaInsets` untuk membaca nilai inset secara terprogram.

File: App.js
```jsx

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.layar} edges={['top', 'bottom']}>
        <Text style={styles.judul}>Profil Mahasiswa</Text>
        <StatusBar style="dark" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f7fb' },
  judul: { fontSize: 20, fontWeight: 'bold', padding: 16 },
});
```

Penjelasan: `SafeAreaProvider` dipasang sekali di akar aplikasi sebagai pemberi konteks, lalu setiap `SafeAreaView` turunannya dapat membaca inset. Properti `edges` menyatakan sisi mana yang harus dihormati (`['top', 'bottom']` cukup untuk kebanyakan halaman). `expo-status-bar` adalah komponen bawaan template Expo untuk mengatur tampilan status bar (warna ikon, latar belakang).

*⚠ Version-sensitive: SafeAreaView bawaan react-native dianggap usang oleh komunitas dan posisinya diganti pustaka di atas; cek dokumentasi resmi (reactnative.dev, docs.expo.dev) untuk status terbaru.* Mengapa keputusan ini penting sekarang? Sejak Android 15, Google mewajibkan aplikasi menampilkan konten secara **edge-to-edge** (konten dirender sampai ke tepi layar, berada di balik status bar dan navigation bar), dan React Native pada versi-versi terbaru mengikuti kebijakan ini — pada React Native 0.86 perilaku edge-to-edge menjadi bawaan di Android. *⚠ Version-sensitive: detail perilaku edge-to-edge per versi React Native dapat berubah; periksa dokumentasi rilis resmi.* Konsekuensinya, di Android pun konten kini bisa "masuk" ke area status bar, sehingga menyandarkan diri pada SafeAreaView bawaan (yang tidak bekerja di Android) bukan lagi pilihan aman. Pada praktikum bab ini Anda akan melihat keduanya: memakai SafeAreaView bawaan untuk kesederhanaan, lalu menyempurnakan dengan pustaka modern pada langkah lanjutan.

### 5.8 StyleSheet dan Styling

Di React Native tidak ada file CSS. Gaya ditulis sebagai objek JavaScript, dan cara terbaik menyimpannya adalah `StyleSheet.create`:

File: App.js
```jsx

import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  kartu: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
});
```

Penjelasan: `StyleSheet.create` memvalidasi properti gaya saat aplikasi dimuat (kesalahan ketik langsung terlihat, bukan gagal diam-diam), mengoptimalkan pengiriman gaya ke native, dan — yang paling penting untuk tim — memusatkan definisi gaya keluar dari JSX sehingga komponen mudah dibaca. Objek JavaScript biasa juga sah, tetapi `create` adalah standar yang dipakai buku ini.

Ada dua pola penulisan gaya yang wajib dikuasai. **Array style** menggabungkan beberapa objek secara berurutan; gaya yang belakangan menimpa yang sebelumnya, misalnya `<View style={[styles.kartu, styles.kartuBesar]} />`.

**Style bersyarat** (conditional style) memilih gaya berdasarkan kondisi — biasanya ditulis dengan operator `&&` atau ternary di dalam array, misalnya `<View style={[styles.baris, aktif && styles.barisAktif, pressed ? styles.tertekan : null]} />`. Nilai `false` dan `null` pada array gaya diabaikan React Native, sehingga gaya hanya aktif saat kondisinya bernilai benar.

Dua pola ini akan terus muncul di seluruh buku — pada praktikum bab ini, baris mahasiswa yang sedang terpilih dicat dengan `aktif && styles.barisAktif`. Catatan penting: tidak ada "cascade" seperti CSS — gaya tidak menurun ke anak, kecuali pewarisan teks pada iOS; setiap komponen menyatakan gayanya sendiri, dan komposisi ulang (membungkus komponen dengan `style` baru) adalah cara yang benar mengubah tampilan.

### 5.9 Flexbox dan Layout Responsive

Tata letak React Native dibangun di atas **Yoga**, mesin layout yang mengimplementasikan **Flexbox** — sistem layout satu dimensi yang sama seperti di CSS, dengan satu perbedaan besar: arah defaultnya **column** (vertikal), sedangkan di web default-nya row. Mengapa? Karena layar ponsel lebih natural dipandang dari atas ke bawah — aplikasi media sosial, formulir, dan daftar semuanya berjalan vertikal. Trade-off-nya kecil namun sering membingungkan: pengembang web yang pindah ke mobile harus selalu ingat bahwa dua View yang ditumpuk akan "menumpuk ke bawah" secara otomatis.

Properti inti yang wajib dikuasai:

- **`flexDirection`** — arah sumbu utama: `"row"` (mendatar) atau `"column"` (menegak, default).
- **`justifyContent`** — penataan di sepanjang sumbu utama: `flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly`.
- **`alignItems`** — penataan di sumbu silang (tegak lurus): `stretch` (default), `flex-start`, `center`, `flex-end`.
- **`flex`** — proporsi ruang yang ditempati sebuah anak terhadap saudaranya. `flex: 1` membuat komponen mengisi seluruh sisa ruang; `flex: 2` mendapat dua kali lipat ruang `flex: 1`. Inilah rahasia layout "header tetap, konten mengisi layar".
- **`gap`** — jarak antaranak tanpa perlu margin pada tiap anak; didukung sejak React Native 0.71, sehingga meringankan banyak kode `marginTop` yang berulang.
- **`flexWrap`** — membolehkan anak "turun baris" jika sumbu utama penuh; perlu dikombinasikan dengan lebar anak (misalnya `width: '48%'` atau persentase) untuk pola grid sederhana.

File: App.js
```jsx

import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.layar}>
      <View style={styles.barisJudul}>
        <Text style={styles.judul}>Daftar Mahasiswa</Text>
        <Text style={styles.jumlah}>5 orang</Text>
      </View>
      <View style={styles.barisKartu}>
        {['Budi', 'Siti', 'Agus', 'Dewi', 'Rizky'].map((nama) => (
          <View key={nama} style={styles.kartuKecil}>
            <Text>{nama}</Text>
          </View>
        ))}
      </View>
      <View style={styles.kaki} />
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f7fb', padding: 16 },
  barisJudul: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  barisKartu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  kartuKecil: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    width: '48%',
  },
  kaki: { flex: 1 },
});
```

Penjelasan: `layar` memakai `flex: 1` agar mengisi layar penuh. `barisJudul` menyusun dua teks dalam satu baris dengan `justifyContent: 'space-between'` — judul di kiri, jumlah di kanan, keduanya rata tengah vertikal dengan `alignItems: 'center'`. `barisKartu` memakai `flexDirection: 'row'` + `flexWrap: 'wrap'` + `gap: 10` sehingga kartu-kartu kecil berukuran `48%` tersusun dua kolom dan otomatis turun baris jika layar sempit. `kaki` dengan `flex: 1` "mendorong" isi ke atas — pola klasik untuk footer di dasar layar.

**Layout responsif** berarti antarmuka menyesuaikan ukuran dan orientasi layar. Sumber kebenaran modern adalah hook `useWindowDimensions`, yang mengembalikan `{ width, height, scale, fontScale }` dan memicu render ulang saat ukuran layar berubah (misalnya saat ponsel diputar): `const { width } = useWindowDimensions(); const jumlahKolom = width >= 600 ? 3 : 2;` Nilai `jumlahKolom` itu siap dipakai untuk mengubah `numColumns` FlatList, memperbesar teks pada layar lebar, atau menyembunyikan elemen. Kombinasi `flex`, `gap`, `flexWrap`, dan `useWindowDimensions` sudah mencukupi untuk sebagian besar layout responsif buku ini; pemikiran desain responsif yang lebih utuh (tipografi, spacing, aksesibilitas) menyusul di Bab 6.

### 5.10 Perbedaan Platform

Android dan iOS adalah dua dunia yang berbeda dengan konvensi desain sendiri: tombol, gestur, bilah status, hingga bentuk kartu. Aplikasi serius hampir selalu perlu menyesuaikan sebagian kecil tampilannya per platform — bukan menulis ulang semuanya, hanya menyentuh perbedaannya. React Native menyediakan tiga alat untuk itu.

**`Platform.OS`** — string `'android'` atau `'ios'` untuk percabangan langsung, misalnya `const versi = Platform.OS === 'android' ? 'Android' : 'iOS';` — `versi` bernilai "Android" saat berjalan di Android, "iOS" selainnya.

**`Platform.select`** — memilih nilai per platform dalam satu objek:

File: App.js
```jsx

import { Platform, StyleSheet, Text } from 'react-native';

function SalamSistem() {
  const salam = Platform.select({
    ios: 'Halo pengguna iOS 👋',
    android: 'Halo pengguna Android 👋',
    default: 'Halo 👋',
  });
  return <Text style={styles.teks}>{salam}</Text>;
}

const styles = StyleSheet.create({
  teks: { fontSize: 16 },
});
```

Penjelasan: `Platform.select` mengembalikan nilai properti yang sesuai platform aktif, dengan `default` sebagai cadangan. Pola ini paling sering dipakai untuk gaya: bayangan di iOS memakai `shadowColor`/`shadowOpacity`/`shadowRadius`/`shadowOffset`, sedangkan Android memakai `elevation` — sepasang properti yang tidak saling menggantikan lintas platform. Kedua gaya dapat digabung dalam `StyleSheet.create` dengan spread: `...Platform.select({ ios: {...}, android: {...} })`, persis seperti contoh `KartuMahasiswa` di bagian Contoh bab ini.

**Ekstensi file khusus platform** — Metro (bundler React Native) memberi prioritas pada file berakhiran `.ios.js` dan `.android.js`. Jika folder berisi `pesan.js`, `pesan.ios.js`, dan `pesan.android.js`, maka saat build di iOS hanya `pesan.ios.js` yang dikompilasi, dan di Android hanya `pesan.android.js` — kode platform-spesifik yang besar (misalnya komponen grafik atau modul native) cukup ditulis **satu kali** pada file masing-masing, tanpa percabangan `if` di dalam kode. Aturan praktis: `Platform.select` untuk perbedaan kecil (nilai, gaya), ekstensi file untuk perbedaan besar (komponen utuh yang benar-benar berbeda).

Terakhir, ingat kembali isu edge-to-edge Android yang diperkenalkan di 5.7: pada React Native 0.86, konten Android dirender sampai ke tepi layar secara bawaan, sehingga penanganan inset dan `StatusBar` menjadi bagian rutin pekerjaan lintas platform — bukan lagi urusan iOS saja. *⚠ Version-sensitive: kebijakan edge-to-edge dan status deprecation SafeAreaView bawaan dapat berubah antarrilis; verifikasi di dokumentasi resmi.*

## Contoh

Tiga contoh berikut merangkum konsep bab ini dalam bentuk yang langsung dapat Anda ketik. Contoh pertama menggabungkan Image, Pressable, dan perbedaan gaya platform; contoh kedua menunjukkan layout responsif; contoh ketiga memilih perilaku per platform.

**Contoh 1 — Kartu mahasiswa dengan sentuhan dan bayangan per platform.**

File: components/KartuMahasiswa.js
```jsx

import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

function KartuMahasiswa({ mahasiswa, padaTekan }) {
  return (
    <Pressable
      onPress={padaTekan}
      style={({ pressed }) => [styles.kartu, pressed && styles.kartuTertekan]}
    >
      <Image
        source={{ uri: 'https://example.com/foto/' + mahasiswa.nim + '.jpg' }}
        style={styles.foto}
        resizeMode="cover"
        accessibilityLabel={'Foto ' + mahasiswa.nama}
      />
      <View style={styles.bagianTeks}>
        <Text style={styles.nama}>{mahasiswa.nama}</Text>
        <Text style={styles.nim}>{mahasiswa.nim}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  kartu: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 3 },
      default: {},
    }),
  },
  kartuTertekan: { opacity: 0.7, transform: [{ scale: 0.98 }] },
  foto: { width: 56, height: 56, borderRadius: 28, marginRight: 12 },
  bagianTeks: { flex: 1 },
  nama: { fontSize: 16, fontWeight: '600' },
  nim: { fontSize: 13, color: '#667085' },
});

export default KartuMahasiswa;
```

Penjelasan: komponen ini merangkum sekaligus View/Text (struktur baris), Image jarak jauh dengan `resizeMode="cover"` (foto melingkar), Pressable dengan gaya fungsi (`pressed`), array style, serta `Platform.select` untuk bayangan — iOS memakai empat properti `shadow*`, Android memakai `elevation`. `bagianTeks` dengan `flex: 1` memastikan teks mengisi sisa lebar kartu apa pun ukuran layar. URL `example.com` adalah placeholder — ganti dengan URL foto asli. Konvensi penamaan: file dan komponen diawali huruf besar serta diekspor sebagai default, mengikuti aturan penulisan JSX di Bab 4.

**Contoh 2 — Daftar dua kolom yang beradaptasi dengan lebar layar.**

File: App.js
```jsx

import { FlatList, useWindowDimensions } from 'react-native';
import KartuMahasiswa from './components/KartuMahasiswa';

const DATA = [
  { id: '1', nim: '2201001', nama: 'Budi Santoso' },
  { id: '2', nim: '2201002', nama: 'Siti Aminah' },
  { id: '3', nim: '2201003', nama: 'Agus Wijaya' },
];

function GaleriMahasiswa() {
  const { width } = useWindowDimensions();
  const jumlahKolom = width >= 600 ? 3 : 2;

  return (
    <FlatList
      key={jumlahKolom}
      data={DATA}
      keyExtractor={(item) => item.id}
      numColumns={jumlahKolom}
      renderItem={({ item }) => <KartuMahasiswa mahasiswa={item} />}
    />
  );
}
```

Penjelasan: `useWindowDimensions` membaca lebar layar saat ini dan memperbarui ulang saat layar berputar atau diubah ukurannya (misalnya di emulator). Di ponsel (lebar < 600) ditampilkan dua kolom, di tablet tiga kolom. Properti `key={jumlahKolom}` sengaja ditambahkan: ketika `numColumns` berubah, React Native perlu membangun ulang daftar dari awal, dan mengubah `key` adalah cara standar memaksakannya — tanpa ini, perubahan jumlah kolom dapat menghasilkan baris yang tidak rapi. Perhatikan bahwa data di sini hanya tiga item contoh; data lima mahasiswa baku akan dipakai di praktikum.

**Contoh 3 — Pesan sambutan yang berbeda per platform.**

File: components/SalamSistem.js
```jsx

import { Platform, StyleSheet, Text } from 'react-native';

function SalamSistem({ nama }) {
  return (
    <Text style={styles.salam}>
      {Platform.select({
        ios: 'Selamat datang di iOS, ',
        android: 'Selamat datang di Android, ',
        default: 'Selamat datang, ',
      })}
      {nama}
    </Text>
  );
}

const styles = StyleSheet.create({
  salam: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
});

export default SalamSistem;
```

Penjelasan: `Platform.select` dipakai langsung di dalam JSX untuk memilih bagian kalimat — pola ringkas untuk perbedaan kecil. Untuk perbedaan besar (seluruh struktur berbeda), ekstrak ke komponen terpisah dan gunakan ekstensi file: tulis `Statistik.ios.js` dan `Statistik.android.js` di folder yang sama, lalu impor `Statistik` tanpa ekstensi — Metro memilih file yang tepat saat build. Bandingkan dengan 5.10: keputusan "kecil vs besar" inilah kunci memilih alat yang tepat.

## Praktikum

### Tujuan Praktikum

Membangun layout **Profil Mahasiswa** yang menampilkan identitas seorang mahasiswa (dari data baku buku ini) dan daftar lima mahasiswa yang dapat dipilih dengan sentuhan. Melalui praktikum ini Anda mengimplementasikan View, Text, Image (placeholder inisial), Pressable, FlatList, StyleSheet, Flexbox, dan SafeAreaView dalam satu aplikasi utuh — sekaligus berlatih komposisi komponen dan alur props dari Bab 4.

### Kebutuhan

- Node.js LTS (versi 22 atau lebih baru) dan npm — panduan pemasangan di Bab 2.
- Visual Studio Code.
- Expo Go pada ponsel, atau emulator Android — keduanya dijelaskan di Bab 2.
- Project Expo template `blank` (JavaScript — tanpa TypeScript).
- Tidak ada dependency tambahan; pustaka `react-native-safe-area-context` hanya dibutuhkan pada langkah lanjutan (opsional).

### Persiapan

Pastikan lingkungan Bab 2 sudah berfungsi: jalankan `node --version` pada terminal dan pastikan versi yang tampil adalah 22 atau lebih baru. Buka terminal di folder tempat project akan dibuat, lalu buat project baru sesuai pola Bab 2:

`npx create-expo-app profil-mahasiswa --template blank`

Perintah di atas membuat folder `profil-mahasiswa` berisi project Expo SDK 57 dengan template JavaScript minimal. Setelah selesai, masuk ke folder project dan buka dengan VS Code:

`cd profil-mahasiswa`
`code .`

Struktur awal yang perlu Anda kenali: `App.js` (titik masuk aplikasi), `assets/` (aset bawaan template), `index.js` (pencatat komponen `App` ke native), serta `app.json` (konfigurasi aplikasi). Anda akan menambah folder `data/` dan `components/` — kebiasaan memisahkan data dan komponen ini menjadi pola standar project di bab-bab berikutnya.

### Langkah Kerja

1. Pada panel Explorer VS Code, buat folder `data` dan `components` di dalam `profil-mahasiswa`.
2. Buat file `data/mahasiswa.js` dan salin Kode 1 (data baku lima mahasiswa).
3. Buat file `components/AvatarPlaceholder.js` dan salin Kode 2 (placeholder foto berbentuk lingkaran berisi inisial).
4. Buat file `components/ProfilMahasiswa.js` dan salin Kode 3 (kartu identitas mahasiswa).
5. Buat file `components/BarisMahasiswa.js` dan salin Kode 4 (satu baris daftar yang dapat ditekan).
6. Ganti seluruh isi `App.js` dengan Kode 5 (perakitan halaman).
7. Jalankan aplikasi: `npx expo start`. Pada jendela Metro yang muncul, tekan `a` untuk membuka di emulator Android, atau scan QR code dengan Expo Go pada ponsel — perangkat dan emulator harus berada pada jaringan yang sama (lihat Bab 2 jika gagal).
8. Uji interaksi: tekan setiap baris pada daftar dan amati kartu identitas di atasnya berubah.
9. (Opsional, lanjutan) Pasang pustaka area aman modern dan sesuaikan `App.js` — detailnya pada langkah terakhir bagian Penjelasan Kode.

### Kode

**Kode 1 — Data mahasiswa baku.**

File: data/mahasiswa.js
```js

// Data baku mahasiswa — dipakai konsisten di seluruh bab buku ini
const DAFTAR_MAHASISWA = [
  {
    id: '1',
    nim: '2201001',
    nama: 'Budi Santoso',
    prodi: 'Sistem Informasi',
    angkatan: '2022',
    ipk: 3.45,
    email: 'budi.santoso@students.univ.ac.id',
    telepon: '081234567890',
  },
  {
    id: '2',
    nim: '2201002',
    nama: 'Siti Aminah',
    prodi: 'Teknik Informatika',
    angkatan: '2022',
    ipk: 3.82,
    email: 'siti.aminah@students.univ.ac.id',
    telepon: '081298765432',
  },
  {
    id: '3',
    nim: '2201003',
    nama: 'Agus Wijaya',
    prodi: 'Informatika',
    angkatan: '2023',
    ipk: 3.2,
    email: 'agus.wijaya@students.univ.ac.id',
    telepon: '081345678901',
  },
  {
    id: '4',
    nim: '2201004',
    nama: 'Dewi Lestari',
    prodi: 'Rekayasa Perangkat Lunak',
    angkatan: '2023',
    ipk: 3.61,
    email: 'dewi.lestari@students.univ.ac.id',
    telepon: '081356789012',
  },
  {
    id: '5',
    nim: '2201005',
    nama: 'Rizky Pratama',
    prodi: 'Sistem Informasi',
    angkatan: '2024',
    ipk: 2.95,
    email: 'rizky.pratama@students.univ.ac.id',
    telepon: '081367890123',
  },
];

export default DAFTAR_MAHASISWA;
```

Penjelasan: file data mengekspor satu array berisi lima objek mahasiswa dengan struktur `{ id, nim, nama, prodi, angkatan, ipk, email, telepon }` — struktur ini **sama persis di seluruh bab buku** sehingga aplikasi Anda di bab-bab berikutnya tinggal memakai ulang data yang sama. Perhatikan `ipk` ditulis sebagai angka (bukan string) agar bisa diolah, sedangkan `nim`, `angkatan`, dan `telepon` adalah string untuk mempertahankan format (misalnya angka nol di depan NIM). Memisahkan data ke file tersendiri adalah keputusan desain: komponen tidak perlu tahu dari mana data berasal — hari ini dari file statis, nanti dari server (Bab 10) tanpa mengubah komponen.

**Kode 2 — Placeholder foto mahasiswa.**

File: components/AvatarPlaceholder.js
```jsx

import { StyleSheet, Text, View } from 'react-native';

function AvatarPlaceholder({ nama, ukuran = 64 }) {
  const inisial = nama
    .split(' ')
    .map((kata) => kata[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View
      style={[
        styles.bulat,
        { width: ukuran, height: ukuran, borderRadius: ukuran / 2 },
      ]}
    >
      <Text style={[styles.inisial, { fontSize: ukuran * 0.38 }]}>
        {inisial}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bulat: {
    backgroundColor: '#2f6fed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inisial: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default AvatarPlaceholder;
```

Penjelasan: karena data mahasiswa belum memiliki foto (foto asli dari kamera/galeri baru datang di Bab 12), komponen ini menggambar lingkaran biru berisi inisial nama — pola placeholder yang profesional dan bebas dari ketergantungan internet. Urutan transformasi inisial perlu dibaca berurutan: `split(' ')` memecah nama menjadi kata, `map((kata) => kata[0])` mengambil huruf pertama tiap kata, `slice(0, 2)` membatasi dua huruf (untuk nama panjang), `join('')` menggabungkan kembali, dan `toUpperCase()` membuat "budi santoso" menjadi "BS". Ukuran bersifat dinamis melalui props `ukuran` dengan nilai baku 64; lebar, tinggi, dan radius lingkaran dihitung dari nilai itu dalam array style — satu komponen, banyak ukuran. Ini contoh composability: komponen kecil yang bersih dapat dipakai ulang di kartu besar maupun baris daftar kecil.

**Kode 3 — Kartu identitas mahasiswa.**

File: components/ProfilMahasiswa.js
```jsx

import { StyleSheet, Text, View } from 'react-native';
import AvatarPlaceholder from './AvatarPlaceholder';

function BarisInfo({ label, nilai }) {
  return (
    <View style={styles.barisInfo}>
      <Text style={styles.labelInfo}>{label}</Text>
      <Text style={styles.nilaiInfo}>{nilai}</Text>
    </View>
  );
}

function ProfilMahasiswa({ mahasiswa }) {
  return (
    <View style={styles.kartu}>
      <View style={styles.bagianAtas}>
        <AvatarPlaceholder nama={mahasiswa.nama} ukuran={72} />
        <View style={styles.bagianNama}>
          <Text style={styles.nama}>{mahasiswa.nama}</Text>
          <Text style={styles.nim}>NIM {mahasiswa.nim}</Text>
        </View>
      </View>
      <View style={styles.pemisah} />
      <BarisInfo label="Program Studi" nilai={mahasiswa.prodi} />
      <BarisInfo label="Angkatan" nilai={mahasiswa.angkatan} />
      <BarisInfo label="IPK" nilai={mahasiswa.ipk.toFixed(2)} />
      <BarisInfo label="Email" nilai={mahasiswa.email} />
      <BarisInfo label="Telepon" nilai={mahasiswa.telepon} />
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  bagianAtas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  bagianNama: { flex: 1 },
  nama: { fontSize: 20, fontWeight: 'bold' },
  nim: { fontSize: 14, color: '#667085', marginTop: 2 },
  pemisah: {
    height: 1,
    backgroundColor: '#e4e9f2',
    marginVertical: 14,
  },
  barisInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  labelInfo: { fontSize: 14, color: '#667085' },
  nilaiInfo: { fontSize: 14, fontWeight: '600' },
});

export default ProfilMahasiswa;
```

Penjelasan: `ProfilMahasiswa` menerima satu objek `mahasiswa` lewat props dan menyusunnya menjadi kartu. Bagian atas adalah baris horizontal (Flexbox `row` + `alignItems: center` + `gap`) berisi avatar 72 piksel dan blok nama; `bagianNama` ber-`flex: 1` agar teks panjang tidak mendorong avatar. Bagian bawah terdiri atas lima baris label–nilai yang dibuat oleh komponen pembantu `BarisInfo` — perhatikan komposisi: komponen kecil dipecah agar JSX tetap terbaca, dan `BarisInfo` dipakai lima kali dengan props berbeda. `ipk.toFixed(2)` memformat 3.45 menjadi "3.45". Pemisah (`height: 1`) adalah cara umum membuat garis tipis di React Native — tidak ada elemen `<hr>` di sini.

**Kode 4 — Baris daftar mahasiswa yang dapat ditekan.**

File: components/BarisMahasiswa.js
```jsx

import { Pressable, StyleSheet, Text, View } from 'react-native';
import AvatarPlaceholder from './AvatarPlaceholder';

function BarisMahasiswa({ mahasiswa, aktif, padaPilih }) {
  return (
    <Pressable
      onPress={padaPilih}
      style={({ pressed }) => [
        styles.baris,
        aktif && styles.barisAktif,
        pressed && styles.barisTertekan,
      ]}
    >
      <AvatarPlaceholder nama={mahasiswa.nama} ukuran={44} />
      <View style={styles.bagianTeks}>
        <Text style={styles.nama}>{mahasiswa.nama}</Text>
        <Text style={styles.nim}>
          {mahasiswa.nim} · {mahasiswa.prodi}
        </Text>
      </View>
      {aktif && (
        <View style={styles.lencana}>
          <Text style={styles.teksLencana}>TERPILIH</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  baris: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    gap: 12,
  },
  barisAktif: { backgroundColor: '#e3edfd', borderWidth: 1, borderColor: '#2f6fed' },
  barisTertekan: { opacity: 0.7 },
  bagianTeks: { flex: 1 },
  nama: { fontSize: 16, fontWeight: '600' },
  nim: { fontSize: 13, color: '#667085', marginTop: 2 },
  lencana: {
    backgroundColor: '#2f6fed',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  teksLencana: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },
});

export default BarisMahasiswa;
```

Penjelasan: baris daftar dibangun dari Pressable sehingga seluruh area dapat ditekan — target sentuh yang besar adalah praktik UX dasar (dibahas lanjut di Bab 6). Array style di sini menggabungkan tiga lapis: gaya dasar `baris`, gaya bersyarat `aktif && styles.barisAktif` saat baris sedang terpilih, dan `pressed && styles.barisTertekan` sebagai umpan balik jari. Lencana "TERPILIH" memakai rendering bersyarat `{aktif && ...}`, pola yang sama dengan style bersyarat — jika `aktif` bernilai `false`, React Native mengabaikan `false` pada posisi anak maupun elemen array style. Dengan memakai `gap: 12`, jarak antaranak tidak perlu margin satu per satu.

**Kode 5 — Perakitan halaman di App.js.**

File: App.js
```jsx

import { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import DAFTAR_MAHASISWA from './data/mahasiswa';
import ProfilMahasiswa from './components/ProfilMahasiswa';
import BarisMahasiswa from './components/BarisMahasiswa';

export default function App() {
  const [terpilih, setTerpilih] = useState(DAFTAR_MAHASISWA[0]);

  return (
    <SafeAreaView style={styles.layar}>
      <Text style={styles.judul}>Profil Mahasiswa</Text>
      <FlatList
        data={DAFTAR_MAHASISWA}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<ProfilMahasiswa mahasiswa={terpilih} />}
        renderItem={({ item }) => (
          <BarisMahasiswa
            mahasiswa={item}
            aktif={item.id === terpilih.id}
            padaPilih={() => setTerpilih(item)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.pemisahBaris} />}
        contentContainerStyle={styles.daftar}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f7fb' },
  judul: { fontSize: 22, fontWeight: 'bold', padding: 16, paddingBottom: 8 },
  daftar: { paddingHorizontal: 16, paddingBottom: 24 },
  pemisahBaris: { height: 8 },
});
```

Penjelasan: `App` menampung satu-satunya state halaman: `terpilih`, objek mahasiswa yang sedang ditampilkan, dengan nilai awal mahasiswa pertama (Budi Santoso). Komponen `FlatList` menjadi "kerangka" seluruh halaman: `ListHeaderComponent` menempatkan kartu profil di atas daftar — inilah pola yang benar untuk halaman berisi kartu + daftar, menghindari sarang FlatList di dalam ScrollView (lihat troubleshooting). `keyExtractor` memakai `item.id` — identitas unik yang dibutuhkan React untuk melacak baris. Saat sebuah baris ditekan, `padaPilih` memanggil `setTerpilih(item)`, state berubah, dan seluruh halaman dirender ulang: kartu profil menampilkan mahasiswa baru, dan baris yang baru terpilih mendapat latar biru serta lencana. `ItemSeparatorComponent` memberi jarak 8 piksel antarbaris, dan `contentContainerStyle` menjaga jarak tepi serta ruang bawah (agar baris terakhir tidak menempel pada home indicator).

**Langkah lanjutan (opsional): beralih ke react-native-safe-area-context.** Pada emulator Android dengan React Native 0.86, konten dirender edge-to-edge sehingga judul halaman dapat tertutup status bar. Penyempurnanya: jalankan `npx expo install react-native-safe-area-context`, lalu ubah dua baris `App.js` — impor `SafeAreaView` dari `react-native-safe-area-context` (bukan dari `react-native`) dan bungkus seluruh aplikasi dengan `SafeAreaProvider`:

File: App.js (petikan — versi lengkap tidak ditampilkan seluruhnya)
```jsx

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.layar} edges={['top', 'bottom']}>
        {/* isi halaman sama seperti Kode 5 */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
```

Petikan di atas sengaja menampilkan bagian yang berubah saja; sisanya identik dengan Kode 5. Jika langkah ini Anda kerjakan, jadikan pola ini kebiasaan untuk semua aplikasi berikutnya — Bab 7 dan seterusnya memakainya sebagai standar. *⚠ Version-sensitive: pastikan perilaku `SafeAreaView` bawaan dan kebijakan edge-to-edge sesuai dokumentasi rilis React Native yang Anda pakai.*

### Penjelasan Kode

Arsitektur aplikasi ini memisahkan tanggung jawab: **data terpisah dari tampilan** (`data/mahasiswa.js`), **komponen kecil dan khusus** (`AvatarPlaceholder` hanya menggambar lingkaran inisial; `BarisInfo` hanya sepasang label–nilai), **komponen penyusun bagian halaman** (`ProfilMahasiswa`, `BarisMahasiswa`), dan **`App` sebagai perakit** yang memegang state serta menghubungkan semuanya lewat props. Alur datanya satu arah: `App` menyimpan `terpilih` → mengirimnya ke `ProfilMahasiswa` (untuk ditampilkan) dan ke setiap `BarisMahasiswa` (untuk menentukan `aktif`) → sentuhan pada baris mengembalikan pilihan lewat `padaPilih` → `setTerpilih` memicu render ulang. Itulah inti pola "props ke bawah, event ke atas" (lifting state up) yang dibahas lebih dalam di Bab 9.

Perhatikan juga apa yang *tidak* ada di kode ini: tidak ada gaya HTML, tidak ada class CSS, tidak ada manipulasi DOM — seluruh tampilan ditentukan oleh objek gaya dan komposisi komponen. Ini konsekuensi langsung perbedaan React web vs React Native pada 5.1: cara berpikirnya sama, mediumnya berbeda. Jika Anda menulis ulang aplikasi ini sebagai situs web, komponen `BarisMahasiswa` akan berubah menjadi `<li>` dengan `onClick`, dan `AvatarPlaceholder` menjadi `<div>` berisi inisial — tetapi struktur state dan alur props pada `App` akan tetap sama persis.

### Hasil yang Diharapkan

Setelah `npx expo start` dan aplikasi terbuka di emulator atau Expo Go, Anda akan mengamati:

1. Judul "Profil Mahasiswa" di bagian atas layar.
2. Kartu putih berisi avatar lingkaran biru berinisial "BS", nama "Budi Santoso", "NIM 2201001", lalu lima baris identitas: Program Studi "Sistem Informasi", Angkatan "2022", IPK "3.45", email, dan telepon.
3. Di bawah kartu, lima baris daftar mahasiswa — masing-masing dengan avatar inisial berukuran kecil, nama, dan "NIM · Program Studi" — lengkap dengan pemisah antarbaris.
4. Saat Anda menekan baris "Siti Aminah": kartu di atas berubah menjadi data Siti (avatar "SA", IPK "3.82"), baris Siti menyala dengan latar biru muda, tepi biru, dan lencana "TERPILIH", sedangkan baris Budi kembali netral.
5. Saat baris ditekan, baris sedikit memudar (umpan balik `pressed`), dan daftar tetap mulus digulir meskipun data diperbesar hingga ratusan item (coba salin data menjadi 100+ baris).

Jika aplikasi macet pada layar merah atau daftar tidak muncul, gunakan tabel Troubleshooting berikut.

### Troubleshooting

**Masalah:** Layar merah dengan pesan bundel seperti "Unable to resolve module `./components/ProfilMahasiswa`".
**Penyebab:** Nama file atau jalur pada pernyataan `import` tidak cocok dengan file yang sebenarnya — termasuk perbedaan huruf besar/kecil, yang bersifat sensitif pada banyak sistem berkas.
**Solusi:** Periksa ejaan jalur pada setiap `import` dan bandingkan dengan nama file di panel Explorer; pastikan file benar-benar tersimpan. Jika masih gagal, hentikan server Metro dengan `Ctrl+C`, lalu jalankan kembali `npx expo start --clear` untuk membersihkan cache bundel.
**Pencegahan:** Buat folder `components` dan `data` sejak awal, dan biarkan VS Code menyelesaikan jalur import otomatis (fitur IntelliSense) alih-alih mengetik manual.

**Masalah:** Judul halaman tertutup status bar / konten menabrak bilah notifikasi di Android.
**Penyebab:** Perilaku edge-to-edge bawaan React Native 0.86 di Android, sementara `SafeAreaView` bawaan hanya menangani inset di iOS.
**Solusi:** Ikuti langkah lanjutan praktikum: pasang `react-native-safe-area-context` dengan `npx expo install`, bungkus aplikasi dengan `SafeAreaProvider`, dan pakai `SafeAreaView` dari pustaka tersebut dengan `edges={['top', 'bottom']}`.
**Pencegahan:** Untuk aplikasi produksi, gunakan `react-native-safe-area-context` sejak awal dan jangan mengandalkan `SafeAreaView` bawaan. *⚠ Version-sensitive: perilaku edge-to-edge dapat berubah antarrilis React Native.*

**Masalah:** Peringatan di konsol Metro: "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation".
**Penyebab:** `FlatList` (atau `ScrollView` lain) ditempatkan di dalam `ScrollView` dengan arah yang sama; keduanya berebut kontrol gulir, dan virtualisasi FlatList tidak berfungsi.
**Solusi:** Jangan menyusun dua penggulir bersarang. Pindahkan konten yang "ikut menggulir" ke `ListHeaderComponent` atau `ListFooterComponent` FlatList (persis pola Kode 5), atau jika seluruh halaman berstruktur tetap, gunakan satu `ScrollView` saja.
**Pencegahan:** Tentukan sejak awal: satu halaman = satu penggulir utama. FlatList untuk data yang bisa panjang, ScrollView untuk konten pendek berstruktur tetap.

**Masalah:** Gambar tidak tampil (kotak kosong atau ikon rusak) — termasuk gambar `uri`.
**Penyebab:** Untuk `uri`: URL salah, perangkat tidak terhubung internet, atau gaya tidak mencantumkan `width`/`height` sehingga gambar berukuran 0. Untuk `require`: jalur file salah atau file belum ada.
**Solusi:** Buka URL di browser untuk memastikan gambar benar-benar ada; pastikan gaya memiliki `width` dan `height`; untuk `require`, periksa jalur relatif dari folder file yang memuatnya.
**Pencegahan:** Selalu sertakan dimensi eksplisit pada gaya gambar jarak jauh, dan pertimbangkan placeholder (inisial) seperti praktikum ini agar tampilan tetap rapi saat gambar gagal dimuat.

**Masalah:** Peringatan "Each child in a list should have a unique key prop" atau baris daftar "melompat" saat digulir.
**Penyebab:** `keyExtractor` tidak diisi atau mengembalikan nilai yang tidak unik (misalnya indeks array yang berubah posisi saat data disaring).
**Solusi:** Isi `keyExtractor={(item) => item.id}` dengan field yang benar-benar unik dan stabil — di sini `id`, atau `nim` sebagai alternatif.
**Pencegahan:** Pastikan setiap entitas data memiliki field identitas permanen, dan jangan pernah memakai indeks array sebagai `key` untuk data yang dapat berubah urutan.

**Masalah:** Aplikasi tidak terbuka: Expo Go tidak menemukan project, atau emulator tidak terdeteksi saat menekan `a`.
**Penyebab:** Ponsel dan komputer tidak pada jaringan yang sama, firewall memblokir port Metro (8081), atau emulator belum selesai booting / ADB tidak dikenali.
**Solusi:** Pastikan ponsel dan komputer satu jaringan (Wi-Fi sama); coba mode tunnel pada Metro; untuk emulator, tunggu proses boot selesai lalu tekan `a` kembali. Jika terus gagal, lakukan penelusuran gejala lebih dalam dengan pola debugging Bab 14, dan ulangi panduan lingkungan Bab 2.
**Pencegahan:** Verifikasi lingkungan (Node, Expo Go, emulator) sebelum menulis kode, dan catat perintah yang pernah berhasil agar tidak mengulang pencarian dari nol.

## Studi Kasus

**"Daftar mahasiswa yang lambat saat digulir" — kasus nyata pada sistem informasi akademik.**

Sebuah universitas mengoperasikan Sistem Informasi Akademik berbasis web. Di akhir semester, Bagian Akademik harus menampilkan daftar mahasiswa per program studi kepada dosen wali — bisa ratusan hingga ribuan baris lengkap dengan foto, NIM, dan IPK. Pada kunjungan awal ke kampus, dosen wali mengeluh: halaman web dengan tabel panjang terasa berat, pengguliran tersendat di ponsel (tabel menyusut dan tidak terbaca), dan mencari satu mahasiswa memerlukan mata yang awas. Ketika rektorat memutuskan membangun versi mobile, tim pengembang menghadapi tiga keputusan yang persis memetakan materi bab ini.

*Pertama, komponen daftar.* Menggulir 1.000 baris sekaligus (pendekatan ScrollView) akan membekukan aplikasi karena semua baris dirender. Tim memilih FlatList — virtualisasi hanya merender baris yang terlihat, sehingga daftar ribuan mahasiswa tetap mulus (inti 5.6). *Kedua, tata letak responsif.* Tabel web selebar monitor tidak dapat dipaksakan masuk ke layar ponsel, sehingga tim menyusun ulang tampilan menjadi kartu per mahasiswa (avatar, nama, NIM, IPK) dengan Flexbox dan `useWindowDimensions` — satu kolom di ponsel, dua kolom di tablet (esensi 5.9). *Ketiga, perbedaan platform.* Dosen mengajar dari iPhone, mahasiswa banyak yang memakai Android; bayangan kartu, jarak aman dari status bar, dan efek sentuhan harus terasa wajar di keduanya — `Platform.select` untuk gaya, pustaka safe area untuk inset (topik 5.7 dan 5.10).

Keterkaitan dengan materi jelas: praktikum bab ini adalah miniatur kasus tersebut — FlatList di atas data baku lima mahasiswa, dengan kartu identitas yang berubah mengikuti pilihan. Bila datanya diganti sumber dari server (Bab 10) dan barisnya dikembangkan menjadi halaman detail (Bab 7), praktikum ini tumbuh menjadi modul Sistem Informasi Akademik Mobile — project akhir buku ini.

## Latihan

### Soal Pemahaman

1. Sebutkan tiga perbedaan utama antara React untuk web dan React Native, dan jelaskan mengapa perbedaan tersebut ada (alasan teknisnya).
2. Mengapa semua teks di React Native wajib berada di dalam komponen `Text`? Apa akibatnya jika aturan ini dilanggar?
3. Kapan Anda memilih `Button`, dan kapan memilih `Pressable`? Berikan satu skenario untuk masing-masing.
4. Jelaskan perbedaan cara kerja `ScrollView` dan `FlatList` dari sisi render. Mengapa `FlatList` lebih tepat untuk daftar 500 data mahasiswa?
5. Apa fungsi `keyExtractor` pada `FlatList`, dan mengapa `key` yang tidak unik dapat menyebabkan masalah?
6. Apa perbedaan perilaku `SafeAreaView` bawaan di iOS dan Android, dan mengapa `react-native-safe-area-context` menjadi pilihan modern?
7. Bagaimana cara memilih nilai berbeda untuk gaya per platform, dan kapan Anda memilih ekstensi file `.ios.js`/`.android.js` alih-alih `Platform.select`?

### Soal Praktik

1. Buat komponen `KartuInfo` yang menampilkan satu pasang label dan nilai (seperti `BarisInfo` pada praktikum), lalu pakai komponen tersebut untuk menampilkan lima identitas mahasiswa Pertama (Budi Santoso) dalam satu kartu tanpa avatar.
2. Ubah aplikasi praktikum sehingga baris yang terpilih ditandai dengan ikon centang (gunakan Text "✓" atau lencana seperti praktikum) di sisi **kiri** avatar, bukan di kanan. Jelaskan perubahan style yang Anda lakukan terhadap Flexbox.
3. Tambahkan `TextInput` di atas daftar untuk mencari mahasiswa berdasarkan nama: simpan nilai ketikan pada state `kataKunci`, lalu saring data dengan `filter` (Bab 3) sebelum dikirim ke `FlatList` — misalnya nama yang mengandung kata kunci. Amati bagaimana `keyExtractor` tetap bekerja dengan data yang berubah.
4. (Praktik gabungan) Buat komponen `AvatarPlaceholder` versi Anda sendiri yang menerima props `warnaLatar` dan `warnaTeks`, lalu tampilkan lima avatar mahasiswa dengan warna berbeda-beda.

### Soal Analisis

Manager aplikasi meminta Anda menampilkan 2.000 data mahasiswa dalam satu layar yang juga berisi kartu ringkasan statistik (jumlah mahasiswa per prodi) di bagian atas. Anda merancang dua alternatif: (a) `ScrollView` berisi kartu + FlatList di dalamnya, dan (b) satu FlatList dengan kartu sebagai `ListHeaderComponent`. Analisislah kedua alternatif dari sisi performa render, perilaku gulir, dan kesederhanaan kode; tentukan alternatif yang Anda rekomendasikan beserta alasannya, dan sebutkan risiko masing-masing.

## Tantangan

1. **Daftar dua kolom responsif.** Kembangkan aplikasi praktikum sehingga daftar mahasiswa tampil dalam dua kolom saat ponsel tegak dan tiga kolom saat perangkat lebih lebar dari 600 piksel (gunakan `useWindowDimensions` + `numColumns` + `key={jumlahKolom}` seperti Contoh 2 bab ini). Pastikan kartu mahasiswa rapi di kedua mode.
2. **Kartu profil dengan "mode ringkas".** Tambahkan tombol (Pressable) "Ringkas/Detail" pada `ProfilMahasiswa` yang menyembunyikan baris email dan telepon saat mode ringkas — latihan rendering bersyarat, state, dan composition sekaligus. Bandingkan pengalaman penggunanya sebelum dan sesudah mode ringkas ada.
3. **Perbedaan platform yang nyata.** Buat komponen `PilihanTanggal` sederhana yang menampilkan teks berbeda: di iOS berupa baris teks "Pilih tanggal" (contoh konvensi iOS yang memakai picker bawaan) dan di Android sebuah tombol "Pilih Tanggal" — implementasikan dengan ekstensi file `.ios.js`/`.android.js`. Jelaskan di komentar mengapa konvensi platform memang berbeda. (Implementasi date picker penuh menunggu Bab 12.)

## Rangkuman

1. React Native memakai ide React (komponen, props, state, hook) tetapi merender komponen native alih-alih DOM; tidak ada CSS dan API browser di dunia mobile.
2. `View` adalah wadah universal; `Text` adalah satu-satunya komponen yang boleh menampilkan teks, dan teks dapat disarangkan dengan gaya berbeda.
3. `Image` mendukung dua sumber — `require` untuk aset lokal yang dibundel, `{ uri }` untuk gambar jaringan yang wajib diberi dimensi eksplisit — dan placeholder inisial adalah pola profesional saat foto belum ada.
4. `Pressable` adalah komponen sentuh utama (style fungsi dengan `pressed`, `android_ripple`, `hitSlop`); `Button` hanya untuk prototipe cepat karena gayanya tidak dapat disesuaikan.
5. `TextInput` memakai pola controlled component (state + `onChangeText`); `keyboardType`, `secureTextEntry`, dan `multiline` adalah properti dasar yang wajib dikenal.
6. `ScrollView` merender semua anak sekaligus; `FlatList` memvirtualisasi daftar panjang lewat `data`, `renderItem`, `keyExtractor`, dan `ListHeaderComponent` — satu penggulir per arah per halaman.
7. `SafeAreaView` bawaan hanya bekerja di iOS; pustaka modern `react-native-safe-area-context` menangani kedua platform, dan makin penting sejak edge-to-edge menjadi bawaan di Android.
8. Gaya ditulis sebagai objek JavaScript dalam `StyleSheet.create`; array style dan style bersyarat (`kondisi && gaya`) adalah dua pola dasar yang dipakai di seluruh buku.
9. Flexbox di React Native berarah default `column`; kuasai `flexDirection`, `justifyContent`, `alignItems`, `flex`, `gap`, dan `flexWrap`, serta `useWindowDimensions` untuk layout responsif.
10. Perbedaan platform ditangani dengan `Platform.OS`, `Platform.select`, dan ekstensi file `.ios.js`/`.android.js` — pilih alat sesuai besarnya perbedaan.

## Refleksi

1. Konsep React mana dari Bab 4 yang terasa "berubah wujud" saat Anda pindah ke React Native, dan mana yang tetap persis sama? Mengapa?
2. Dari semua komponen pada bab ini, mana yang paling sulit Anda pahami, dan strategi apa yang Anda pakai untuk menguasainya?
3. Pernahkah Anda frustrasi menggunakan aplikasi yang daftarnya lambat atau tombolnya tidak memberi umpan balik? Bagaimana materi bab ini mengubah cara Anda menilai aplikasi tersebut?
4. Dalam proyek tim, mengapa memisahkan data (seperti `data/mahasiswa.js`) dari komponen tampilan memudahkan kerja sama, dan bagaimana Anda akan menjelaskan hal ini kepada rekan satu tim?
5. Bagaimana penguasaan tata letak dan komponen inti ini memengaruhi keyakinan Anda menghadapi project akhir (Sistem Informasi Akademik Mobile)?

## Evaluasi Bab

### Pilihan Ganda

1. Perbedaan paling mendasar antara React untuk web dan React Native adalah ...
   A. React Native tidak memakai JSX
   B. React Native merender komponen native, bukan DOM
   C. React Native tidak mengenal props dan state
   D. React Native wajib memakai TypeScript

2. Arah default `flexDirection` pada React Native adalah ...
   A. `row`
   B. `column-reverse`
   C. `column`
   D. `row-reverse`

3. Komponen yang tepat untuk menampilkan daftar 1.000 data mahasiswa adalah ...
   A. `ScrollView`
   B. `View` dengan loop `map`
   C. `FlatList`
   D. `Text` dengan `numberOfLines={1000}`

4. Properti `FlatList` yang menentukan identitas unik tiap baris adalah ...
   A. `data`
   B. `keyExtractor`
   C. `renderItem`
   D. `ListHeaderComponent`

5. Untuk menampilkan gambar yang dimuat dari internet, sumber gambar ditulis sebagai ...
   A. `source={require('./assets/foto.jpg')}`
   B. `source={{ uri: 'https://...' }}`
   C. `src="./foto.jpg"`
   D. `source="https://..."`

6. Komponen sentuh yang direkomendasikan karena gaya dan anaknya dapat disesuaikan penuh adalah ...
   A. `Button`
   B. `Text`
   C. `Pressable`
   D. `Image`

7. Fitur yang hanya dimiliki gaya iOS untuk bayangan — dan tidak berlaku di Android — adalah ...
   A. `elevation`
   B. `shadowColor`
   C. `borderRadius`
   D. `padding`

8. Konteks yang tepat untuk `Platform.select({ ios: ..., android: ... })` adalah ...
   A. mengganti seluruh file aplikasi per platform
   B. memilih nilai (gaya, teks) yang berbeda per platform
   C. memilih versi React Native saat instalasi
   D. menentukan ukuran layar emulator

9. `useWindowDimensions` paling tepat digunakan untuk ...
   A. membaca ukuran gambar sebelum dimuat
   B. membuat layout menyesuaikan lebar layar yang berubah
   C. mengukur konsumsi memori daftar
   D. menentukan versi platform

10. Cara yang benar menulis style bersyarat (saat `aktif` benar, tambahkan `styles.barisAktif`) adalah ...
    A. `style={aktif ? styles.barisAktif}`
    B. `style={styles.baris, styles.barisAktif}`
    C. `style={[styles.baris, aktif && styles.barisAktif]}`
    D. `style={aktif || styles.barisAktif}`

### Soal Uraian

1. Jelaskan alur data pada aplikasi praktikum bab ini dari saat pengguna menekan baris "Dewi Lestari" hingga kartu di atas berubah, dengan menyebutkan komponen, props, dan state yang terlibat.
2. Bandingkan pola "kartu profil sebagai `ListHeaderComponent`" dengan pola "FlatList di dalam ScrollView". Mengapa pola kedua menimbulkan masalah, dan apa yang terjadi pada virtualisasi?
3. Sebuah aplikasi harus berjalan mulus di ponsel terkecil (lebar 320 piksel) hingga tablet (lebar 800 piksel). Rancang strategi layout responsif dengan `useWindowDimensions`, `flexWrap`, dan `gap`, dan jelaskan keputusan desain Anda untuk daftar dua versus tiga kolom.

### Kunci Jawaban

<details>
<summary>Klik untuk membuka kunci jawaban</summary>

1. **B** — React Native merender komponen native (UIView/ViewGroup) melalui mesin layout Yoga, bukan DOM.
2. **C** — default `flexDirection` React Native adalah `column`, berbeda dengan web.
3. **C** — `FlatList` memvirtualisasi daftar sehingga hanya item terlihat yang dirender.
4. **B** — `keyExtractor` menentukan identitas unik tiap item untuk rekonstruksi daftar.
5. **B** — gambar jaringan memakai `source={{ uri: 'https://...' }}`; `require` khusus aset lokal.
6. **C** — `Pressable` menerima children bebas dan style berfungsi; `Button` tak dapat disesuaikan.
7. **B** — bayangan iOS memakai `shadowColor` (dengan `shadowOpacity`, `shadowRadius`, `shadowOffset`); Android memakai `elevation`.
8. **B** — `Platform.select` memilih nilai per platform; ekstensi file untuk perbedaan besar.
9. **B** — hook ini membaca lebar/tinggi layar dan memicu render ulang saat berubah.
10. **C** — array style dengan operator `&&` adalah pola standar; nilai `false` diabaikan.

</details>