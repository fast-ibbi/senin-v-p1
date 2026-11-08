# Tutorial Bab 5 — Membangun SIAKAD Mobile

Tutorial ini menuntun pembuatan satu aplikasi utuh bertema **data mahasiswa**, dari folder
kosong sampai siap diuji di HP. Setiap langkah menyebut subbab slide yang mendasarinya, jadi
tutorial ini bisa dipakai sebagai naskah mengajar maupun lembar kerja mandiri.

Semua blok kode di bawah **diambil langsung dari berkas project di folder ini**, bukan ditulis
ulang. Kalau kamu macet, bandingkan hasilmu dengan berkas yang disebut di atas setiap blok —
isinya harus sama persis.

---

## Apa yang akan dibangun

Aplikasi **SIAKAD Mobile** dengan lima layar:

| Layar | Berkas | Isi |
|---|---|---|
| Beranda | `screens/BerandaScreen.js` | Dashboard, dua panel responsif, peringkat IPK |
| Mahasiswa | `screens/MahasiswaScreen.js` | Daftar dengan pencarian dan pengurutan |
| Detail | `screens/DetailMahasiswaScreen.js` | Profil, ringkasan akademik, catatan bimbingan |
| Mata Kuliah | `screens/KatalogScreen.js` | Katalog grid dengan jumlah kolom mengikuti lebar |
| Info | `screens/TentangScreen.js` | Padanan React Web/Native, `Platform.OS`, tabel scroller |

Data contoh: 8 mahasiswa dan 7 mata kuliah, semuanya statis di `data/mahasiswa.js`.

---

## Sebelum mulai

**Prasyarat:** project Expo dari Bab 2 sudah pernah dibuat dan dijalankan; Node.js ≥ 22;
Expo Go di HP atau emulator Android/iOS. Tidak ada pustaka UI, navigasi, atau data tambahan —
project ini hanya memakai `react`, `react-native`, dan `expo-status-bar`.

**Perkiraan waktu:** 2 sesi × 100 menit. Pembagian yang dipakai di tutorial ini:

| Bagian | Langkah | Isi | Waktu |
|---|---|---|---|
| A | 1–3 | Project, token tampilan, data | 25 menit |
| B | 4–9 | Tujuh komponen inti | 60 menit |
| C | 10–15 | Lima layar | 90 menit |
| D | 16–19 | Perakitan, pengujian, build | 25 menit |

**Cara memakai:** bacakan bagian **Kenapa** sebagai pertanyaan ke kelas sebelum kodenya
dijalankan; bagian **Sering salah** adalah gejala yang paling sering muncul di lab.

**Tiga penanda di sepanjang tutorial:**

- **Cek** — apa yang harus terlihat di layar setelah langkah ini. Kalau tidak sesuai, jangan
  lanjut dulu.
- **Sering salah** — gejala, sebab, dan perbaikannya.
- **Kenapa** — alasan keputusan teknisnya, lengkap dengan rujukan subbab slide.

---

## Peta langkah

| Langkah | Yang dibuat | Rujukan slide |
|---|---|---|
| 1 | Project Expo dan struktur folder | Bab 2 (pengulangan) |
| 2 | `theme/warna.js` | 3.1, 3.4, 4.9 |
| 3 | `data/mahasiswa.js` | 2.10, 3.4 |
| 4 | `LabelStatus` + App sementara | 2.1–2.2, 3.1–3.3 |
| 5 | `AvatarPlaceholder` | 2.3 |
| 6 | `TombolAksi` | 2.5–2.6, 3.2 |
| 7 | `KotakPencarian` | 2.4 |
| 8 | `BarisInfo`, `KartuStatistik` | 4.3–4.7 |
| 9 | `BarisMahasiswa` | 2.10, 3.3 |
| 10 | `MahasiswaScreen` | 2.8, 5.2 |
| 11 | `DetailMahasiswaScreen` | 2.7, 5.1, 5.5 |
| 12 | Uji dua layar pertama | 2.10 |
| 13 | `BerandaScreen` | 4.1–4.9 |
| 14 | `KartuMataKuliah`, `KatalogScreen` | 5.2, 4.9 |
| 15 | `TentangScreen` | 1.1–1.4, 5.3–5.4 |
| 16 | `TabBar` | 2.6, 3.3 |
| 17 | `App.js` final | 2.9, 5.3 |
| 18 | Pengujian dan build web | 4.10, 5.4–5.5 |

---

# Bagian A — Fondasi

## Langkah 1 — Membuat project dan struktur folder

Buat project baru dengan template paling polos. Jangan pilih template `tabs`: ia sudah membawa
expo-router dan puluhan berkas yang harus dibongkar lebih dulu, padahal navigasi baru dibahas
di Bab 7.

```bash
npx create-expo-app@latest siakad-mobile --template blank
cd siakad-mobile
mkdir components data screens theme
npx expo start
```

Nama folder bebas — di repo ini folder contohnya bernama `bab-05-mahasiswa`. Yang penting
konsisten sampai akhir.

**Cek:** terminal menampilkan QR dan menu; tekan `w` untuk membuka versi web. Yang muncul
masih halaman bawaan "Open up App.js to start working on your app!".

Sekarang sesuaikan `app.json`. Empat nilai yang penting: `name`, `slug`, `orientation`, dan
`supportsTablet`. `orientation` diubah menjadi `default` supaya layar boleh diputar — tanpa itu
uji responsif di Langkah 13 tidak mungkin dilakukan.

**`app.json`**

<!-- kode: app.json -->

> Bandingkan dengan `app.json` di project ini. Kalau template Expo-mu punya kunci tambahan
> (misalnya `splash` atau `plugins`), biarkan saja; yang perlu disamakan hanya empat nilai di
> atas.

Dependensi yang dipakai sepanjang tutorial ini sengaja sedikit — tidak ada pustaka navigasi,
pustaka UI, atau pustaka data:

**`package.json`**

<!-- kode: package.json -->

`@expo/metro-runtime`, `react-dom`, dan `react-native-web` hanya dibutuhkan bila kamu ingin
membuka aplikasi di browser. Kalau kamu hanya menguji di HP atau emulator, ketiganya boleh
tidak dipasang.

Berkas `index.js` dari template Expo dibiarkan apa adanya: isinya hanya mendaftarkan `App.js`
sebagai komponen akar. Kamu tidak perlu menyentuhnya sepanjang tutorial ini.

**Sering salah:** lupa `mkdir`, lalu menyimpan berkas di folder yang belum ada sehingga Metro
mengeluh "Unable to resolve module".

**Kenapa:** struktur folder `components/`, `screens/`, `theme/`, `data/` memisahkan benda yang
berbeda peran. Satu layar boleh berisi banyak komponen kecil; komponen tidak boleh tahu layar
mana yang memakainya.

---

## Langkah 2 — Token tampilan

Sebelum menulis komponen pertama, tetapkan warna, jarak, radius, ukuran teks, dan breakpoint di
satu tempat.

**`theme/warna.js`**

<!-- kode: theme/warna.js -->

**Cek:** belum ada yang berubah di layar. Berkas ini baru terasa pengaruhnya mulai Langkah 4.

**Kenapa:** di React Native tidak ada berkas CSS dan tidak ada cascade. Gaya ditulis sebagai
objek JavaScript dengan `camelCase`, lalu dipakai per komponen (subbab 3.1). Kalau warna yang
sama ditulis di sepuluh tempat, satu perubahan desain berarti sepuluh suntingan (subbab 3.4).

---

## Langkah 3 — Data dan nilai turunan

Data statis diletakkan di luar komponen, bersama fungsi yang menghitung nilai turunannya.

**`data/mahasiswa.js`**

<!-- kode: data/mahasiswa.js -->

Perhatikan tiga hal:

1. Satu mahasiswa (`Budi Santoso`) punya `fotoUri`; sisanya `null`. Dua jalur `Image` ini
   dilatih di Langkah 5.
2. `predikatAkademik()` mengembalikan `jenis` (`baik`/`sedang`/`kurang`), bukan warna. Yang
   memilih warna adalah komponen (subbab 3.3).
3. `hitungRingkasan()`, `sebaranProdi()`, dan `peringkatIpk()` selalu dihitung dari daftar —
   tidak ada angka yang disimpan terpisah, jadi tidak mungkin basi.

**Cek:** belum ada tampilan. Fungsi-fungsi ini dipakai mulai Langkah 9 dan 13.

**Sering salah:** menyimpan hasil hitungan ke `useState`, lalu lupa memperbaruinya ketika data
berubah. Nilai turunan dihitung saat render; state hanya untuk hal yang berubah karena
interaksi pengguna (subbab 2.4 dan 3.3).

---

# Bagian B — Komponen inti

Mulai di sini, semua berkas yang dibuat akan langsung terlihat. Ganti isi `App.js` dengan
"App sementara" yang ditunjukkan di setiap langkah; berkas itu akan diganti dua kali lagi dan
akhirnya menjadi `App.js` final di Langkah 17.

## Langkah 4 — `LabelStatus`: StyleSheet dan gaya kondisional

Komponen pertama: badge status yang warnanya mengikuti `jenis`.

**`components/LabelStatus.js`**

<!-- kode: components/LabelStatus.js -->

**Cek:** ganti seluruh isi `App.js` dengan berkas sementara berikut, lalu simpan. Expo memuat
ulang otomatis.

```jsx
// App.js — versi sementara. Diganti di Langkah 12, lalu di Langkah 17.
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import LabelStatus from './components/LabelStatus';

export default function App() {
  return (
    <SafeAreaView style={styles.akar}>
      <ScrollView contentContainerStyle={styles.isi}>
        <LabelStatus label="Sangat baik" jenis="baik" />
        <LabelStatus label="Baik" jenis="sedang" />
        <LabelStatus label="Perlu perhatian" jenis="kurang" />
        <LabelStatus label="Aktif" jenis="netral" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  akar: { flex: 1, backgroundColor: '#f1f5f9' },
  isi: { padding: 16, gap: 8 },
});
```

Empat badge dengan warna berbeda, lebarnya mengikuti panjang teks (`alignSelf: 'flex-start'`).

**Sering salah:**

- Menulis `font-size` atau `background-color` di style — React Native mengabaikan nama
  bertanda hubung dan hanya menerima `fontSize`, `backgroundColor`.
- Menulis teks langsung di dalam `View`. Teks wajib dibungkus `Text`; kalau tidak, muncul
  "Text strings must be rendered within a `<Text>` component".

**Kenapa:** di sini gaya kondisional diperkenalkan dalam bentuk paling sederhana — semua
variasi warna didefinisikan sekali di `StyleSheet.create()`, lalu dipilih lewat `jenis` saat
render. Tidak ada state berisi gaya (subbab 3.3).

---

## Langkah 5 — `AvatarPlaceholder`: `Image` dan ukuran eksplisit

Avatar mahasiswa: foto kalau ada, inisial kalau tidak ada atau gagal dimuat.

**`components/AvatarPlaceholder.js`**

<!-- kode: components/AvatarPlaceholder.js -->

Tambahkan dua baris ini ke dalam `ScrollView` pada `App.js` sementara:

```jsx
        <AvatarPlaceholder nama="Budi Santoso" ukuran={64} fotoUri="https://i.pravatar.cc/160?img=12" />
        <AvatarPlaceholder nama="Dewi Lestari" ukuran={64} />
```

Jangan lupa menambahkan impornya di bagian atas:

```jsx
import AvatarPlaceholder from './components/AvatarPlaceholder';
```

**Cek:** satu foto bulat berukuran 64 piksel dan satu lingkaran biru bertuliskan "DL". Matikan
internet lalu muat ulang: foto Budi berubah menjadi inisial "BS", aplikasi tidak error.

**Sering salah:** menulis `<Image source={{ uri }} />` tanpa lebar dan tinggi. React Native
tidak menebak ukuran gambar, jadi hasilnya kotak nol piksel — tidak terlihat sama sekali, bukan
"kecil".

**Kenapa:** `source` menerima `require('...')` untuk berkas yang dibundel dan `{ uri }` untuk
gambar dari jaringan (subbab 2.3). Ukuran bergantung props, jadi lebar/tinggi/radius dihitung
saat render; objek gaya dinamis seperti ini wajar, yang dihindari adalah menulis ulang seluruh
`StyleSheet` di dalam render.

---

## Langkah 6 — `TombolAksi`: `Pressable` yang bisa ditata

**`components/TombolAksi.js`**

<!-- kode: components/TombolAksi.js -->

Tambahkan tiga tombol ke `App.js` sementara:

```jsx
        <TombolAksi label="Simpan catatan" onPress={() => {}} />
        <TombolAksi label="Batal" onPress={() => {}} jenis="kedua" />
        <TombolAksi label="Lihat semua" onPress={() => {}} jenis="hantu" />
```

**Cek:** tombol utama berlatar biru, tombol kedua berlatar putih dengan garis, tombol hantu
tanpa latar. Saat ditekan, ketiganya sedikit memudar dan mengecil.

**Sering salah:**

- Menulis `style={[styles.dasar, pressed && styles.tertekan]}` — di `Pressable`, `style` harus
  berupa fungsi `({ pressed }) => [...]`. Tanpa fungsi, `pressed` tidak pernah ada.
- Meletakkan `styles.tertekan` **sebelum** `styles.dasar`. Gaya yang ditulis belakangan menang
  (subbab 3.2), jadi urutan array adalah urutan prioritas.

**Kenapa:** `Button` bawaan mengikuti gaya platform dan tidak bisa ditata bebas. Begitu desain
meminta radius, ikon, atau warna sendiri, `Pressable` yang dipakai (subbab 2.5–2.6).
`android_ripple` hanya berefek di Android; di iOS ia diabaikan — itu sendiri sudah menjadi bahan
pengamatan perbedaan platform.

---

## Langkah 7 — `KotakPencarian`: `TextInput` controlled

**`components/KotakPencarian.js`**

<!-- kode: components/KotakPencarian.js -->

Kotak ini tidak menyimpan teksnya sendiri; nilainya dipegang induk. Untuk melihatnya, tambahkan
komponen uji kecil di `App.js` sementara:

```jsx
function UjiPencarian() {
  const [cari, setCari] = useState('');
  return (
    <>
      <KotakPencarian nilai={cari} onUbah={setCari} placeholder="Cari mahasiswa…" />
      <Text>State berisi: {cari === '' ? '(kosong)' : cari}</Text>
    </>
  );
}
```

lalu pakai `<UjiPencarian />` di dalam `ScrollView`, dan tambahkan `useState` serta `Text` pada
import:

```jsx
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
```

**Cek:** setiap ketukan langsung muncul di kotak dan di baris teks di bawahnya; tombol ✕ muncul
begitu ada isi dan mengosongkan kotak saat ditekan.

**Sering salah:** menghapus `onChangeText` tetapi mempertahankan `value`. Kotak lalu tampak
terkunci: pengguna mengetik, state tidak berubah, dan React mengembalikan tampilan ke nilai
lama.

**Kenapa:** `TextInput` hanya melaporkan ketukan; nilai sebenarnya dipegang state induk. Itulah
arti *controlled component* (subbab 2.4) — dan alasan penghitung karakter nanti bisa dihitung
dari nilai yang sama.

---

## Langkah 8 — `BarisInfo` dan `KartuStatistik`: Flexbox dasar

Dua komponen kecil untuk menyusun baris "label — nilai" dan kartu angka.

**`components/BarisInfo.js`**

<!-- kode: components/BarisInfo.js -->

**`components/KartuStatistik.js`**

<!-- kode: components/KartuStatistik.js -->

Tambahkan ke `App.js` sementara:

```jsx
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <KartuStatistik angka="8" label="Mahasiswa aktif" />
          <KartuStatistik angka="3.31" label="Rata-rata IPK" aksen="#15803d" />
          <KartuStatistik angka="3" label="IPK ≥ 3,50" aksen="#b45309" />
        </View>

        <View>
          <BarisInfo label="IPK" nilai="3.62" />
          <BarisInfo label="SKS lulus" nilai="118 SKS" />
        </View>
```

Tambahkan `View` pada import `react-native`.

**Cek:** tiga kartu berbagi lebar baris secara adil tanpa satu pun angka lebar tetap; pada baris
info, label menempel kiri dan nilai menempel kanan.

**Sering salah:** memakai `justifyContent: 'center'` untuk memusatkan secara mendatar padahal
`flexDirection` masih `column`. Di React Native arah bawaan adalah `column`, berbeda dari web
yang bawaannya `row` (subbab 4.2).

**Kenapa:** pasangan aturannya sederhana dan berlaku terus: `justifyContent` mengatur **sumbu
utama**, `alignItems` mengatur **sumbu silang**. Kalau `flexDirection` diganti, keduanya
bertukar arah (subbab 4.3–4.4). `flex: 1` pada kartu membagi ruang tersisa, bukan menetapkan
lebar (subbab 4.5).

---

## Langkah 9 — `BarisMahasiswa`: props dan komposisi

Satu baris daftar, disusun dari komponen yang sudah ada.

**`components/BarisMahasiswa.js`**

<!-- kode: components/BarisMahasiswa.js -->

Sekarang `App.js` sementara bisa dirapikan menjadi versi lengkap yang memuat semua komponen.
Ganti seluruh isinya dengan berkas berikut:

```jsx
// App.js — versi sementara. Diganti di Langkah 12, lalu di Langkah 17.
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import AvatarPlaceholder from './components/AvatarPlaceholder';
import BarisInfo from './components/BarisInfo';
import BarisMahasiswa from './components/BarisMahasiswa';
import KartuStatistik from './components/KartuStatistik';
import KotakPencarian from './components/KotakPencarian';
import LabelStatus from './components/LabelStatus';
import TombolAksi from './components/TombolAksi';
import { DAFTAR_MAHASISWA } from './data/mahasiswa';

function UjiPencarian() {
  const [cari, setCari] = useState('');
  return (
    <View style={{ gap: 6 }}>
      <KotakPencarian nilai={cari} onUbah={setCari} placeholder="Cari mahasiswa…" />
      <Text>State berisi: {cari === '' ? '(kosong)' : cari}</Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.akar}>
      <ScrollView contentContainerStyle={styles.isi}>
        <LabelStatus label="Sangat baik" jenis="baik" />
        <LabelStatus label="Baik" jenis="sedang" />
        <LabelStatus label="Perlu perhatian" jenis="kurang" />

        <AvatarPlaceholder nama="Budi Santoso" ukuran={64} fotoUri="https://i.pravatar.cc/160?img=12" />
        <AvatarPlaceholder nama="Dewi Lestari" ukuran={64} />

        <TombolAksi label="Simpan catatan" onPress={() => {}} />
        <TombolAksi label="Batal" onPress={() => {}} jenis="kedua" />

        <UjiPencarian />

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <KartuStatistik angka="8" label="Mahasiswa aktif" />
          <KartuStatistik angka="3.31" label="Rata-rata IPK" aksen="#15803d" />
          <KartuStatistik angka="3" label="IPK ≥ 3,50" aksen="#b45309" />
        </View>

        <View>
          <BarisInfo label="IPK" nilai="3.62" />
          <BarisInfo label="SKS lulus" nilai="118 SKS" />
        </View>

        {DAFTAR_MAHASISWA.slice(0, 3).map((m) => (
          <BarisMahasiswa key={m.id} mahasiswa={m} onPress={() => {}} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  akar: { flex: 1, backgroundColor: '#f1f5f9' },
  isi: { padding: 16, gap: 12 },
});
```

**Cek:** tiga baris mahasiswa muncul di bagian bawah, rapi seperti kartu: avatar, nama, NIM,
badge predikat, IPK di kanan, dan tanda `›`.

**Sering salah:** menuliskan baris satu per satu secara manual. Kalau datanya bertambah, layar
harus disunting lagi. `.map()` dengan `key` sudah cukup untuk daftar pendek; untuk daftar yang
bisa memanjang, kita pakai `FlatList` di langkah berikutnya.

**Kenapa:** `BarisMahasiswa` hanya menerima `mahasiswa` dan `onPress`. Ia tidak tahu dari mana
datanya berasal — inilah syarat supaya komponen yang sama bisa dipakai `FlatList` sebagai
`renderItem` tanpa perubahan (subbab 2.10 dan 5.2).

---

# Bagian C — Lima layar

## Langkah 10 — `MahasiswaScreen`: `FlatList`, pencarian, pengurutan

**`screens/MahasiswaScreen.js`**

<!-- kode: screens/MahasiswaScreen.js -->

Untuk melihatnya, ganti isi `App.js` sementara dengan satu layar ini:

```jsx
import MahasiswaScreen from './screens/MahasiswaScreen';

export default function App() {
  return <MahasiswaScreen onBukaDetail={() => {}} />;
}
```

**Cek:**

- 8 baris muncul; ketik `informatika` → tinggal 4 baris dan tulisan "4 dari 8 mahasiswa".
- Tekan tombol urut: daftar berpindah antara A–Z dan IPK tertinggi.
- Ketik kata yang tidak ada (misalnya `zzz`) → muncul kotak "Tidak ada mahasiswa yang cocok".
- Gulir sampai bawah → catatan kaki tentang virtualisasi terlihat.

**Sering salah:**

- `keyExtractor` memakai indeks array. Saat data difilter, indeks bergeser dan baris bisa
  tercocokkan dengan data yang salah. Pakai `item.id` (subbab 5.2).
- Membungkus `FlatList` dengan `ScrollView`. Dua scroller searah membuat virtualisasi rusak dan
  Metro menampilkan peringatan `VirtualizedLists should never be nested inside plain
  ScrollViews` (subbab 5.2).
- Mengurutkan `tersaring` tanpa menyalin lebih dulu (`[...tersaring].sort(...)`). `sort`
  mengubah array aslinya.

**Kenapa:** `FlatList` butuh tiga properti: `data`, `renderItem`, dan `keyExtractor`. Sisanya
opsional tetapi dipakai semua di sini — `ListHeaderComponent` (judul dan pencarian ikut
tergulir), `ListEmptyComponent`, `ItemSeparatorComponent`, dan `ListFooterComponent`.

---

## Langkah 11 — `DetailMahasiswaScreen`: `ScrollView` dan formulir

**`screens/DetailMahasiswaScreen.js`**

<!-- kode: screens/DetailMahasiswaScreen.js -->

Layar ini belum punya jalan masuk; itu dibuat di langkah berikutnya.

**Cek (setelah Langkah 12):**

- Buka Budi Santoso → profil, empat baris ringkasan, tujuh mata kuliah, dan kotak catatan.
- Ketik catatan → penghitung berubah dari `0/200`. Tekan Simpan → muncul konfirmasi hijau.
- Tekan tombol kembali → daftar terbuka lagi dengan pencarian kosong. State pencarian ikut
  hilang karena layar daftar dilepas saat detail dibuka; kalau ingin dipertahankan, state-nya
  harus diangkat ke `App.js` — itulah bahan Bab 9.

**Sering salah:**

- Memberi `padding` pada `style` ScrollView, bukan pada `contentContainerStyle`. Jarak di
  dalam area gulir tidak muncul seperti yang diharapkan (subbab 5.1).
- Menyimpan sisa karakter di state terpisah. `BATAS_CATATAN - catatan.length` adalah nilai
  turunan; menyimpannya berarti punya dua sumber kebenaran yang bisa berbeda.
- Lupa `keyboardShouldPersistTaps="handled"`, sehingga tombol Simpan harus ditekan dua kali
  saat papan ketik terbuka.

**Kenapa:** layar ini memakai `ScrollView`, bukan `FlatList`, karena isinya satu profil dengan
jumlah komponen tetap — seluruh anak boleh dirender sekaligus (subbab 5.1 dan 5.3).

---

## Langkah 12 — Uji dua layar pertama

Rakit daftar dan detail dengan dua state saja. Ini juga pertama kalinya aplikasi terasa
"berjalan".

```jsx
// App.js — versi sementara kedua. Diganti di Langkah 17.
import { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import DetailMahasiswaScreen from './screens/DetailMahasiswaScreen';
import MahasiswaScreen from './screens/MahasiswaScreen';

export default function App() {
  const [idDetail, setIdDetail] = useState(null);

  return (
    <SafeAreaView style={styles.akar}>
      {idDetail !== null ? (
        <DetailMahasiswaScreen mahasiswaId={idDetail} onKembali={() => setIdDetail(null)} />
      ) : (
        <MahasiswaScreen onBukaDetail={setIdDetail} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  akar: { flex: 1, backgroundColor: '#f1f5f9' },
});
```

Uji lima skenario ini sebelum lanjut:

| Skenario | Hasil yang diharapkan |
|---|---|
| Ketuk baris Dewi Lestari | Layar detail Dewi terbuka |
| Ketuk "‹ Kembali" | Kembali ke daftar; pencarian kembali kosong karena layar daftar dipasang ulang |
| Cari `22101005` lalu ketuk hasilnya | Detail Andi Wijaya |
| Ketik 200 karakter di catatan | Penghitung berhenti di `200/200` |
| Ketuk Simpan dengan catatan kosong | Tidak ada konfirmasi (fungsi berhenti lebih awal) |

**Kenapa:** navigasi di Bab 5 belum memakai pustaka apa pun. Satu state `idDetail` bernilai
`null` atau sebuah id sudah cukup; `null` berarti "tampilkan daftar".

Perhatikan konsekuensi yang baru saja kamu lihat: ketika detail dibuka, layar daftar dilepas,
jadi kata kunci pencariannya hilang. Untuk aplikasi latihan ini wajar — dan justru menjadi
contoh mengapa state kadang perlu diangkat ke komponen induk. Itu dibahas di Bab 9.

---

## Langkah 13 — `BerandaScreen`: dashboard responsif

**`screens/BerandaScreen.js`**

<!-- kode: screens/BerandaScreen.js -->

Untuk melihatnya, ganti `App.js` sementara menjadi:

```jsx
import BerandaScreen from './screens/BerandaScreen';

export default function App() {
  return (
    <BerandaScreen
      onBukaMahasiswa={() => {}}
      onBukaDetail={() => {}}
      onBukaKatalog={() => {}}
    />
  );
}
```

**Cek:**

- Di layar sempit, dua panel bertumpuk dan chip berbunyi `flexDirection: column`.
- Perbesar jendela (atau putar HP) melewati 600 piksel: panel berpindah ke samping, chip
  berubah menjadi `row`, dan angka pada chip `render` bertambah satu.
- Tiga kartu statistik berbagi lebar; angka di dalamnya dihitung dari data, bukan ditulis tetap.

**Sering salah:**

- Mengukur sekali di awal (`Dimensions.get()` lalu disimpan di `useState`). Saat perangkat
  diputar, layout tidak pernah berubah. `useWindowDimensions()` mengembalikan angka terbaru
  setiap kali jendela berubah (subbab 4.8).
- Memakai lebar tetap 375 supaya "pas di HP". Di tablet sisanya kosong; di HP kecil isinya
  terpotong.
- Menyamakan breakpoint 600 dengan "ukuran tablet". Ia hanya ambang keputusan layout (subbab
  4.9).

**Kenapa:** inilah inti Bagian 4 — satu properti (`flexDirection`) yang berubah berdasarkan
lebar, dan dua panel dengan `flex: 1` yang membagi ruang tersisa. Chip pengukur sengaja
ditampilkan supaya kelas bisa melihat hook-nya bekerja, bukan mempercayainya.

---

## Langkah 14 — `KartuMataKuliah` dan `KatalogScreen`: `numColumns`

**`components/KartuMataKuliah.js`**

<!-- kode: components/KartuMataKuliah.js -->

**`screens/KatalogScreen.js`**

<!-- kode: screens/KatalogScreen.js -->

Untuk melihatnya:

```jsx
import KatalogScreen from './screens/KatalogScreen';

export default function App() {
  return <KatalogScreen />;
}
```

**Cek:**

- Di layar sempit: satu kolom, keterangan "1 kolom".
- Di layar lebar: dua kolom, kartu berbagi lebar dengan jarak yang sama, keterangan "2 kolom".
- Tekan chip "Semester 6": tinggal 2 mata kuliah, 5 SKS.
- Ubah lebar jendela bolak-balik: jumlah kolom berubah tanpa error.

**Sering salah:**

- Lupa memberi `key` pada `FlatList` yang nilainya ikut berubah saat `numColumns` berubah.
  Tanpa itu, daftar memakai susunan lama dan kartu tampak berhimpitan.
- Lupa `columnWrapperStyle`. Tanpa `gap` di sana, dua kolom menempel.
- Memberi lebar tetap pada kartu. Kartu harus `flex: 1` di dalam kolomnya.

**Kenapa:** `numColumns` mengubah susunan internal daftar, jadi `key` pada `FlatList` adalah
satu-satunya cara memaksa daftar disusun ulang. Ini salah satu detail yang paling jarang
disebut di tutorial lain, tetapi muncul di praktikum (subbab 5.2).

---

## Langkah 15 — `TentangScreen`: perbedaan platform

**`screens/TentangScreen.js`**

<!-- kode: screens/TentangScreen.js -->

Untuk melihatnya:

```jsx
import TentangScreen from './screens/TentangScreen';

export default function App() {
  return <TentangScreen />;
}
```

**Cek:** badge `Platform.OS` berisi `web` di browser, `ios` di simulator iOS, `android` di
emulator Android. Kalimat di bawahnya menyebut nama platform dan angka padding yang berbeda
sesuai platform.

**Sering salah:** memakai `Platform.OS === 'ios' ? ... : ...` untuk hal yang bisa ditangani
`Platform.select`, atau sebaliknya: membuat berkas `.ios.js` dan `.android.js` hanya untuk
membedakan satu angka padding. Urutan keputusannya: satu kode dulu, `Platform.OS` kalau bedanya
kecil, berkas terpisah hanya kalau komponennya sendiri berbeda (subbab 5.4).

**Kenapa:** layar ini juga menjadi "halaman rujukan" kelas: padanan React Web–React Native,
tabel pemilihan scroller, dan daftar periksa akhir bab tersedia di dalam aplikasi, bukan hanya
di slide.

---

# Bagian D — Merakit dan menguji

## Langkah 16 — `TabBar`

**`components/TabBar.js`**

<!-- kode: components/TabBar.js -->

**Cek:** belum terlihat. Komponen ini dipasang di langkah berikutnya, yang langsung setelah ini.

**Kenapa:** tab aktif dibedakan lewat array style (`dipilih && styles.teksAktif`), bukan dua
salinan komponen. `accessibilityState={{ selected: dipilih }}` memberi tahu pembaca layar tab
mana yang sedang aktif.

---

## Langkah 17 — `App.js` final

Sekarang ganti `App.js` sementara dengan versi sebenarnya.

**`App.js`**

<!-- kode: App.js -->

**Cek:**

- Empat tab di bawah; tab aktif berwarna biru dengan garis di atasnya.
- Beranda → "Lihat semua mahasiswa" berpindah ke tab Mahasiswa.
- Mahasiswa → ketuk baris membuka detail; bilah tab hilang selama detail terbuka; "‹ Kembali"
  mengembalikannya.
- Isi layar tidak tertutup status bar, baik di iOS maupun Android.

**Sering salah:**

- Mengandalkan `SafeAreaView` bawaan React Native saja. Komponen itu hanya bekerja di iOS;
  di Android isi layar digambar sampai tepi. Karena itu `App.js` menambahkan `paddingTop` dari
  `StatusBar.currentHeight` ketika berjalan di Android (subbab 5.3).
- Lupa `flex: 1` pada wadah layar, sehingga bilah tab tidak menempel di bawah.

**Kenapa:** `App.js` sengaja hanya berisi dua state dan satu peta layar. Navigasi baru dibahas
di Bab 7; di sini tujuannya agar seluruh materi Bab 5 punya tempat berpijak.

---

## Langkah 18 — Pengujian dan build web

Jalankan daftar periksa akhir bab pada aplikasimu sendiri. Jangan hanya melihat tampilan — ubah
kondisinya, lalu perhatikan apa yang berubah.

| Butir | Cara menguji |
|---|---|
| Teks muncul sebagai `Text` | Hapus satu `Text` pembungkus teks, lalu lihat layar merah dan pesan Metro-nya |
| Tombol berubah saat aktif/nonaktif | Tekan dan tahan tombol; bandingkan dengan saat dilepas |
| Dua panel berubah susunan | Ubah lebar jendela melewati 600, atau putar perangkat |
| Daftar panjang tetap ringan | Tambahkan 500 mahasiswa lewat `.map()` di data, lalu gulir |
| Tidak ada konten tertutup status bar | Uji di Android dan iOS, dua orientasi |

Uji juga lima skenario dari Langkah 12 di dua ukuran layar (HP kecil dan lebar) dan dua platform.

Build web sebagai bukti terakhir bahwa project bersih:

```bash
npx expo export --platform web
npx serve dist -l 8080
```

Buka `http://localhost:8080` dan ulangi daftar periksa. Build yang gagal hampir selalu berarti
ada impor yang salah nama atau berkas yang belum disimpan.

---

## Langkah 19 — Kalau ada yang tidak berjalan

| Gejala | Sebab yang paling sering | Perbaikan |
|---|---|---|
| "Text strings must be rendered within a `<Text>`" | Teks ditulis langsung di dalam `View` | Bungkus dengan `Text` |
| Gambar tidak muncul | `Image` tanpa lebar/tinggi | Beri `style={{ width, height }}` |
| Semua komponen menumpuk ke bawah | `flexDirection` tidak disetel | Ingat: bawaan React Native adalah `column` |
| Layout tidak berubah saat diputar | Lebar disimpan sekali di `useState` | Pakai `useWindowDimensions()` |
| Peringatan `VirtualizedLists should never be nested` | `FlatList` di dalam `ScrollView` searah | Pakai `ListHeaderComponent` |
| Tombol harus ditekan dua kali | Papan ketik terbuka | `keyboardShouldPersistTaps="handled"` |
| Daftar berkedip dan urutannya kacau | `keyExtractor` memakai indeks | Pakai `item.id` |
| Perubahan berkas tidak muncul | Cache Metro | `npx expo start -c` |
| "Unable to resolve module" | Salah nama berkas atau impor | Periksa huruf besar-kecil; Linux case-sensitive |

**Eksperimen lanjutan (bisa jadi tugas rumah):**

1. Ubah `BREAKPOINT_LEBAR` menjadi `900` dan jelaskan akibatnya pada HP berukuran 800 piksel.
2. Tambahkan satu mahasiswa di `data/mahasiswa.js` tanpa menyunting layar mana pun, lalu
   periksa apakah dashboard, sebaran prodi, dan peringkat ikut berubah.
3. Hapus `onChangeText` di kotak pencarian dan jelaskan gejala yang muncul.
4. Ganti `keyExtractor` menjadi indeks array, filter daftar, lalu jelaskan mengapa baris bisa
   tercocokkan dengan data yang salah.
5. Bungkus `FlatList` di `MahasiswaScreen` dengan `ScrollView` dan cari peringatan di Metro.

---

## Setelah tutorial ini

Project ini adalah titik berangkat, bukan hasil akhir. Tiga bab berikutnya menyambung tanpa
merombak struktur komponennya:

- **Bab 6** menyusun antarmuka yang lebih rapi — jarak, warna, dan hierarki visual.
- **Bab 7** menambahkan navigasi sungguhan, menggantikan dua state di `App.js`.
- **Bab 8** melengkapi formulir dan validasi, termasuk penanganan papan ketik.

Peta lengkap subbab slide ke berkas ada di [`README.md`](README.md); kode yang sudah jadi ada di
folder yang sama dengan tutorial ini.
