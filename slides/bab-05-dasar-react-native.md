---
marp: true
theme: academic
paginate: true
title: "Bab 5 — Dasar React Native"
description: "Slide kuliah Pemrograman Mobile, pertemuan 6: perbedaan React untuk web dan React Native, komponen inti, StyleSheet dan gaya kondisional, Flexbox dan layout responsif, scroller, serta perbedaan platform Android dan iOS."
author: "Dosen Mata Kuliah — Program Studi Sistem Informasi / Teknik Informatika"
footer: "Pemrograman Mobile · Bab 5 — Dasar React Native"
size: 16:9
---

<!-- _class: lead -->
<!-- _paginate: skip -->
<!-- _footer: "" -->

# Bab 5 — Dasar React Native

Komponen, styling, layout responsif, dan scroller · Pertemuan 6

<!--
Buka dengan menyambung Bab 4: "Minggu lalu kita belajar cara berpikir React; hari ini abjad
visualnya, dan hasilnya satu layar sungguhan di HP."

Pertanyaan pembuka: "Kalau cara berpikirnya sama dengan React, kenapa kodenya harus
berbeda?" Tampung dua sampai tiga jawaban tanpa dikoreksi dulu, karena jawabannya baru
muncul di Bagian 1 pada slide berikutnya.

Sebutkan bahwa bab ini juga memuat lima praktikum kecil, satu di setiap bagian, dan
ditutup praktikum integrasi berupa halaman katalog responsif.
-->

---

## Tujuan Pembelajaran

Setelah bab ini, kamu bisa:

- Menjelaskan perbedaan React untuk web dan React Native
- Mengidentifikasi peran komponen inti React Native
- Menerapkan `StyleSheet`, array style, dan gaya kondisional
- Menyusun layout responsif dengan Flexbox dan `useWindowDimensions`
- Memilih scroller yang tepat serta menangani perbedaan platform

<!--
Bacakan verbanya saja, jangan seluruh butir; rinciannya dibahas satu per satu di lima bagian
berikutnya.

Kaitkan dengan penilaian: hasil praktikum bab ini menjadi bahan Bab 6 (membangun UI) dan
Bab 7 (navigasi), dan dinilai dengan rubrik praktikum di Lampiran A.

Salah paham yang perlu dicegah: belajar komponen bukan latihan menghafal nama properti,
tetapi tahu kapan memakai komponen yang mana.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Bagian 1 — React untuk Web dan React Native

subbab 1.1–1.4: pengertian, struktur, rendering, dan perbandingan implementasi

<!--
Bagian ini menjawab pertanyaan pembuka tadi. Jangan langsung ke kode: mahasiswa yang paham
bedanya akan lebih cepat menulis kode di praktikum.

Kalau waktu pertemuan menipis, subbab 1.3 (proses rendering) boleh dibaca mandiri, tetapi
subbab 1.1 dan 1.2 tidak boleh dilewati karena dipakai di seluruh bab.
-->

---

## Konsepnya Sama, Medianya Berbeda

- React: library JavaScript untuk membangun antarmuka pengguna
- React Native: untuk membangun aplikasi mobile
- Konsep yang sama: component, props, state, dan hooks

<!--
Tegaskan bahwa React bukan framework lengkap dan React Native bukan bahasa baru: keduanya
memakai JavaScript dan JSX yang sama seperti di Bab 3 dan Bab 4.

Pertanyaan penuntun: "Kalau konsepnya sama, apa yang berubah?" (Jawaban: mediumnya — dari
halaman web menjadi aplikasi mobile, sehingga elemen dan gayanya berganti.)

Salah paham: menganggap React Native menerjemahkan HTML menjadi aplikasi mobile. Yang
dirender bukan HTML, melainkan komponen native.
-->

---

## Elemen HTML Diganti Komponen Native

| React Web | React Native |
|---|---|
| `div` | `View` |
| `p` | `Text` |
| `button` | `Pressable` |
| CSS | `StyleSheet` |

Struktur dan komponennya berbeda, begitu pula cara menata gayanya.

<!--
Minta mahasiswa menebak padanan tiap elemen sebelum kolom kanan dibuka; biasanya `p` ke
`Text` sudah benar, `button` ke `Pressable` belum.

Ingatkan bahwa padanan ini tidak selalu satu-satu: satu `div` di web bisa menjadi dua `View`
sekaligus di React Native, tergantung kebutuhan layout.

Pertanyaan penuntun: "Kenapa CSS tidak bisa dipakai apa adanya?" (Jawaban: tidak ada
browser yang mem-parse CSS; gaya ditulis sebagai objek JavaScript dengan `StyleSheet`.)

Salah paham: mencari file CSS di dalam project Expo, lalu menyimpulkan setup-nya rusak.
-->

---

## HTML Dirender Browser, Komponen Dirender Native

- Rendering elemen HTML pada browser
- Rendering komponen menjadi antarmuka native pada perangkat mobile
- Lingkungan eksekusi, akses fitur perangkat, dan dukungan platform ikut berbeda

<!--
Jelaskan sebagai dua jalur dari satu sumber: JSX yang sama, lalu satu jalur berakhir di DOM
browser dan jalur lain berakhir di komponen native.

Analogi: resep yang sama dimasak di dua dapur berbeda — bahannya sama, alat masaknya tidak,
jadi hasil dan waktu memasaknya pun berbeda.

Pertanyaan penuntun: "Kenapa aplikasi React Native bisa mengakses kamera, sedangkan halaman
web tidak selalu bisa?" (Jawaban: kodenya berjalan di dalam aplikasi native, bukan di dalam
kotak pasir browser.)

Salah paham: menganggap aplikasi React Native berjalan di browser tersembunyi.
-->

---

## Bagian Kode yang Bisa Dipakai Ulang

- Logika component, props, dan state bisa dipakai ulang
- Yang berganti: elemen yang dirender dan cara menata gayanya
- Kapan memakai React Web, kapan memakai React Native

```jsx
import { View, Text, Pressable } from 'react-native';

export default function Halaman() {
  return (
    <View>
      <Text>Judul Halaman</Text>
      <Text>Deskripsi singkat halaman.</Text>
      <Pressable onPress={() => {}}>
        <Text>Tekan</Text>
      </Pressable>
    </View>
  );
}
```

<!--
Tunjukkan bahwa yang berubah dibanding versi web hanya nama komponen dan cara menata gaya;
struktur JSX, logika, dan penamaan state tetap sama persis.

Aturan praktis memilih: React Web untuk halaman yang dibuka lewat link dan mudah
diperbarui; React Native untuk aplikasi yang butuh fitur perangkat, notifikasi, dan
kehadiran di layar utama HP.

Pertanyaan penuntun: "Bagian mana yang kamu salin apa adanya dari project web?" (Jawaban:
fungsi component, state, dan hooks; bukan elemen dan gayanya.)

Peringatan: `Pressable` di contoh sengaja berisi fungsi kosong — di praktikum nanti isi
dengan aksi nyata.
-->

---

## Praktikum 1: Halaman Sederhana di Dua Platform

- Satu halaman berisi judul, deskripsi, dan tombol
- Kerjakan dua kali: React Web, lalu React Native
- Bandingkan bagian kode yang sama dan yang berganti

<!--
Beri 25 menit. Yang dinilai bukan hasil visualnya, melainkan catatan perbandingan: baris mana
yang identik dan baris mana yang berganti.

Kalau lab hanya menyediakan Expo, kerjakan versi web lewat Expo Web supaya keduanya bisa
dijalankan tanpa pindah project.

Pertanyaan penuntun: "Berapa baris yang benar-benar berubah?" (Jawaban: biasanya hanya
import, nama komponen, dan definisi gaya.)

Peringatkan bahwa `Text` di dalam `Text` hanya untuk teks bersarang, bukan pengganti `View`.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Bagian 2 — Komponen Inti React Native

subbab 2.1–2.10: `View`, `Text`, `Image`, `TextInput`, tombol, daftar, area aman, dan props

<!--
Bagian ini adalah abjad visual bab ini. Jangan menghafalkan sepuluh komponen sekaligus;
cukup kenali perannya, sisanya dibaca saat dibutuhkan.

Aturan yang dipegang sepanjang bagian ini: pilih komponen berdasarkan jenis isi dan
kebutuhan interaksi, bukan karena sering dipakai orang lain.
-->

---

## Empat Komponen Pertama: Container sampai Input

| Komponen | Fungsi |
|---|---|
| `View` | Container untuk mengelompokkan komponen dan menyusun layout |
| `Text` | Menampilkan teks, judul, label, dan deskripsi |
| `Image` | Menampilkan gambar lokal maupun gambar dari URL |
| `TextInput` | Menerima input teks dari pengguna dan mengelola nilainya |

subbab 2.1–2.4

<!--
Tekankan urutan perannya: `View` yang memegang, `Text` yang berbicara, `Image` yang
menunjukkan, `TextInput` yang mendengar.

Tunjukkan di layar: semua yang berbentuk huruf di aplikasi mana pun hampir pasti `Text`,
dan semua kotak yang mengelompokkan sesuatu hampir pasti `View`.

Pertanyaan penuntun: "Bolehkah `View` berisi teks langsung?" (Jawaban: tidak; teks harus
dibungkus `Text`, dan ini kesalahan pertama hampir semua pemula.)

Salah paham: memakai `Image` dengan URL tanpa memberi lebar dan tinggi, lalu bingung
gambarnya tidak muncul.
-->

---

## Tombol, Daftar, dan Area Aman

| Komponen | Fungsi |
|---|---|
| `Button` | Membuat tombol dengan aksi sederhana |
| `Pressable` | Membuat area interaktif yang merespons tekanan pengguna |
| `ScrollView` | Menampilkan konten yang dapat digulir |
| `FlatList` | Menampilkan daftar data secara efisien |
| `SafeAreaView` | Melindungi konten dari area sistem perangkat |

subbab 2.5–2.9

<!--
Beberapa komponen di tabel ini dibahas lagi di Bagian 5, jadi cukup kenalkan perannya di
sini dan jangan menghabiskan waktu pada detail optimasi.

Bedakan dua pasangan yang sering tertukar: `Button` (gaya platform, tidak bisa ditata
bebas) versus `Pressable` (bebas ditata), lalu `ScrollView` (semua anak dirender) versus
`FlatList` (item dirender bertahap).

Pertanyaan penuntun: "Untuk lima kartu statis, mana yang lebih tepat?" (Jawaban:
`ScrollView`; `FlatList` baru berguna saat datanya bisa memanjang.)

Salah paham: memakai `SafeAreaView` bawaan lalu menganggap Android sudah terlindungi juga.
-->

---

## Props Turun, Komposisi Menyusun Antarmuka

- Mengirim data melalui props
- Menyusun komponen kecil menjadi antarmuka yang lebih kompleks

```jsx
function Kartu({ nama, peran }) {
  return (
    <View>
      <Text>{nama}</Text>
      <Text>{peran}</Text>
    </View>
  );
}
```

<!--
Hubungkan ke Bab 4: props adalah satu-satunya arah data dari induk ke anak, dan komposisi
adalah cara menyusun banyak komponen kecil tanpa membuat satu file raksasa.

Analogi: komponen kecil seperti satu kartu nama yang isinya bisa diganti-ganti tanpa
mencetak ulang kartunya.

Pertanyaan penuntun: "Kalau ada tiga kartu, apakah perlu menulis tiga kali isi Kartu?"
(Jawaban: tidak; panggil `Kartu` tiga kali dengan props berbeda.)

Salah paham: mengubah props di dalam komponen anak — props bersifat hanya baca.
-->

---

## Praktikum 2: Kartu Profil Pengguna

- Isi kartu: gambar, nama, dan deskripsi singkat
- Tambahkan satu tombol interaksi di bagian bawah kartu
- Susun dari beberapa komponen kecil, bukan satu blok panjang

<!--
Ini praktikum pertama yang menghasilkan sesuatu yang layak dilihat; beri 30 menit dan minta
satu kartu ditunjukkan ke kelas sebelum sesi berakhir.

Minta mahasiswa menyebutkan komponen yang dipakai beserta perannya. Kelompok yang menyebut
`View`, `Text`, `Image`, dan `Pressable` sudah memenuhi seluruh subbab 2.1–2.6.

Pertanyaan penuntun: "Bagian mana yang kamu jadikan komponen sendiri?" (Jawaban yang
diharapkan: kartu, baris info, atau tombol.)

Peringatkan soal gambar dari URL: tanpa lebar dan tinggi yang eksplisit, kartu bisa
melompat saat gambar selesai dimuat.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Bagian 3 — StyleSheet dan Gaya Kondisional

subbab 3.1–3.4: `StyleSheet`, array style, gaya kondisional, dan konsistensi

<!--
Bagian ini yang paling sering membuat mantan pengembang web tersandung, karena tidak ada
file CSS dan tidak ada cascade.

Kalau sisa waktu sedikit, subbab 3.1 dan 3.2 tetap wajib; gaya kondisional bisa menyusul di
pertemuan berikutnya karena dipakai lagi di Bab 8.
-->

---

## Gaya Ditulis sebagai Objek, Bukan CSS

- `StyleSheet.create()` mengenali properti gaya saat aplikasi dimuat
- Kode tampilan dipisahkan dari struktur komponen
- Nama properti memakai `camelCase`, misalnya `backgroundColor`

```jsx
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Belajar React Native
      </Text>
    </View>
  );
}
```

<!--
Manfaat pertama yang paling terasa: salah ketik nama properti langsung terlihat saat
aplikasi dimuat, tidak gagal diam-diam seperti di CSS.

Analogi cascade: di web gaya menetes dari induk ke anak seperti air terjun; di React Native
setiap komponen menyatakan gayanya sendiri.

Pertanyaan penuntun: "Kenapa `font-size` akan ditolak?" (Jawaban: React Native memakai
`fontSize`; nama properti memakai `camelCase`, bukan tanda hubung.)

Salah paham: menaruh objek gaya di dalam `render` sehingga dibuat ulang setiap render.
-->

---

## Warna, Ukuran, Jarak, dan Radius di Satu Tempat

- Mengatur warna, ukuran teks, margin, padding, border, dan radius
- Definisi style yang sama dipakai beberapa komponen sekaligus
- Warna dan ukuran disimpan sebagai konstanta agar konsisten

```jsx
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
```

<!--
Tunjukkan bahwa `container` dan `title` di sini adalah nama bebas, bukan nama wajib: yang
mengikat hanya rujukan `styles.nama` di JSX.

Hubungkan ke subbab 3.4: kalau warna yang sama ditulis di sepuluh tempat, satu kali
perubahan desain berarti sepuluh kali sunting.

Pertanyaan penuntun: "Di mana konstanta warna sebaiknya diletakkan?" (Jawaban: satu file
tema atau di luar komponen, lalu diimpor.)

Salah paham: menyalin-tempel seluruh objek gaya ke tiap komponen, lalu nilai yang tadinya
sama mulai berbeda tanpa disadari.
-->

---

## Array Style: yang Ditulis Belakangan Menimpa

- Beberapa objek style digabung dalam satu properti `style`
- Gaya yang ditulis belakangan menimpa properti yang sama
- Gaya dasar tetap dipakai bersama, gaya tambahan mengubah sebagian

```jsx
<Text style={[styles.text, styles.highlight]}>
  Teks dengan style gabungan
</Text>
```

<!--
Aturan tunggalnya: urutan array adalah urutan prioritas. Gaya dasar di kiri, pengecualian di
kanan.

Pertanyaan penuntun: "Kalau `styles.highlight` tidak mengatur `fontSize`, apakah ukuran dari
`styles.text` hilang?" (Jawaban: tidak; hanya properti yang sama yang ditimpa.)

Salah paham: membalik urutan array lalu menyimpulkan React Native mengabaikan gaya pertama.

Peringatkan bahwa nilai `false` atau `null` di dalam array diabaikan, dan itu justru menjadi
dasar gaya kondisional di slide berikutnya.
-->

---

## Gaya Kondisional: Ternary dan Logika `&&`

- Operator ternary memilih satu dari dua gaya
- Logika `&&` menambahkan gaya hanya saat kondisinya benar
- Warna dan tampilan bisa berubah mengikuti props atau state
- Umpan balik visual muncul saat tombol ditekan

```jsx
<Text
  style={[
    styles.status,
    isActive && styles.active,
  ]}
>
  {isActive ? 'Aktif' : 'Tidak aktif'}
</Text>
```

<!--
Baca array dari kiri ke kanan seperti kalimat: "pakai gaya status, dan kalau aktif tambahkan
gaya aktif".

Bedakan dua peran yang sering tertukar: ternary untuk memilih di antara dua gaya, `&&` untuk
menambah satu gaya bila perlu. Contoh tombol ditekan memakai bentuk kedua.

Pertanyaan penuntun: "Apa isi array saat `isActive` bernilai `false`?" (Jawaban: `false`
diabaikan, jadi hanya `styles.status` yang berlaku.)

Salah paham: menulis `isActive ? styles.active` tanpa cabang alternatif, sehingga gaya
menjadi `undefined` saat tidak aktif.
-->

---

## Praktikum 3: Tombol yang Berubah Sesuai Status

- Tiga variasi warna tombol: utama, kedua, dan nonaktif
- Status aktif dan nonaktif diatur oleh satu state
- Tampilan berbeda muncul berdasarkan kondisi state tersebut

<!--
Beri 25 menit. Syarat minimum: satu tombol yang berubah warna saat state berubah, dengan
gaya yang tetap terbaca di kedua kondisi.

Minta mahasiswa memeriksa hasilnya dengan mata setengah tertutup: kalau kedua kondisi tidak
langsung bisa dibedakan, kontrasnya belum cukup.

Pertanyaan penuntun: "Kenapa status jangan dibedakan lewat warna saja?" (Jawaban: sebagian
pengguna tidak dapat membedakan warna; tambahkan teks atau ikon.)

Salah paham: menyimpan gaya di dalam state. Simpan kondisinya, bukan gayanya.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Bagian 4 — Layout Responsif dengan Flexbox

subbab 4.1–4.10: sumbu, perataan, pembagian ruang, `useWindowDimensions`, dan orientasi

<!--
Bagian ini paling padat istilahnya, tetapi paling terasa hasilnya: satu perubahan di sini
membuat halaman muat di HP kecil maupun tablet.

Kalau waktu menipis, subbab 4.1–4.4 dulu; subbab 4.8–4.10 bisa dibaca mandiri oleh mahasiswa
yang sudah menyelesaikan praktikum sebelumnya.
-->

---

## Flexbox: Container, Item, dan Dua Sumbu

- Container adalah induk yang mengatur posisi item di dalamnya
- Sumbu utama adalah arah susunan item; sumbu silang tegak lurus dengannya
- Semua properti perataan bekerja pada salah satu dari dua sumbu itu

<!--
Gambarkan di papan: satu kotak besar berisi tiga kotak kecil, lalu tarik garis panah ke kanan
(sumbu utama) dan garis panah ke bawah (sumbu silang).

Pertanyaan penuntun: "Kalau sumbu utama berubah arah, apakah sumbu silang ikut berubah?"
(Jawaban: ya; keduanya selalu tegak lurus, jadi perataan ikut bertukar.)

Peringatkan bahwa `column` adalah arah bawaan di React Native, berbeda dari web yang
bawaannya `row` — ini penyebab layout "tiba-tiba menumpuk ke bawah".

Salah paham: memakai istilah kiri-kanan untuk menjelaskan perataan, padahal yang benar
utama-silang.
-->

---

## Arah dan Perataan: Tiga Properti yang Menentukan

| Properti | Yang diatur |
|---|---|
| `flexDirection` | Susunan vertikal (`column`) atau horizontal (`row`) |
| `justifyContent` | Distribusi komponen pada sumbu utama |
| `alignItems`, `alignSelf` | Posisi komponen pada sumbu silang |

subbab 4.2–4.4

<!--
Ajarkan berpasangan, bukan satu per satu: `justifyContent` selalu sumbu utama,
`alignItems` selalu sumbu silang. Kalau `flexDirection` diganti, keduanya bertukar arah.

Bedakan `alignItems` (mengatur semua anak dari sisi induk) dan `alignSelf` (satu anak
mengatur dirinya sendiri). Contoh nyata: semua tombol rata tengah, satu tombol rata kanan.

Pertanyaan penuntun: "Untuk memusatkan semua isi layar, dua properti apa yang dipakai?"
(Jawaban: `justifyContent` dan `alignItems` sama-sama `center`.)

Salah paham: memakai `justifyContent` untuk mengatur posisi mendatar padahal arahnya
`column` — hasilnya tidak berubah sama sekali.
-->

---

## Pembagian Ruang dan Jarak Antar-Komponen

- `flex`, `flexGrow`, dan `flexShrink` mengatur pembagian ruang tersedia
- `gap`, margin, dan padding mengatur jarak antarkomponen dan ruang dalam container
- Lebar dan tinggi relatif dipakai agar ukuran ikut menyesuaikan

subbab 4.5–4.7

<!--
Analogi pembagian ruang: `flex` seperti membagi satu kue berdasarkan porsi; `flex: 1` pada
dua anak berarti dua porsi sama besar.

Bedakan tiga istilah jarak sekali saja supaya tidak tertukar sepanjang praktikum: `gap` di
antara anak, `padding` di dalam container, `margin` di luar container.

Pertanyaan penuntun: "Dua panel dengan `flex: 1` di layar selebar 400, berapa lebar tiap
panel?" (Jawaban: 200, dikurangi gap dan padding yang ada.)

Salah paham: memakai lebar tetap 375 lalu bingung saat aplikasi dibuka di tablet.
-->

---

## `useWindowDimensions()`: Ukuran Jendela Reaktif

- Hook ini membaca lebar, tinggi, dan skala font jendela
- Nilainya diperbarui saat ukuran jendela berubah
- Perubahan orientasi memicu render ulang, bukan sekali ukur

```jsx
import { View, Text, useWindowDimensions } from 'react-native';

export default function ResponsiveLayout() {
  const { width } = useWindowDimensions();
  const isWide = width >= 600;
  return (
    <View style={{ flexDirection: isWide ? 'row' : 'column',
                   gap: 12, padding: 16 }}>
      <View style={{ flex: 1, padding: 20 }}><Text>Panel pertama</Text></View>
      <View style={{ flex: 1, padding: 20 }}><Text>Panel kedua</Text></View>
    </View>
  );
}
```

<!--
Bedakan dengan pengukuran sekali di awal: `Dimensions.get()` memberi angka saat itu saja,
sedangkan hook ini memberi angka terbaru setiap kali jendela berubah.

Demonstrasi paling cepat: putar HP di depan kelas dan tunjukkan dua panel berpindah dari
vertikal ke horizontal tanpa memuat ulang aplikasi.

Pertanyaan penuntun: "Kenapa angka 600 disebut breakpoint, bukan ukuran tablet?" (Jawaban:
ia hanya ambang keputusan layout, bukan klasifikasi perangkat yang mutlak.)

Salah paham: memakai lebar tetap dari konstanta, lalu hook-nya dianggap tidak bekerja.
-->

---

## Breakpoint dan Orientasi: Layout Ikut Berubah

- Susunan komponen diubah berdasarkan lebar layar
- Ambang seperti 600 dipakai untuk memilih susunan, bukan menamai perangkat
- Perubahan portrait ke landscape ditangani tanpa kode tambahan

<!--
Tunjukkan bahwa orientasi tidak perlu dideteksi sendiri: kalau lebarnya berubah, hook-nya
ikut berubah, dan layout menyesuaikan.

Pertanyaan penuntun: "Berapa breakpoint yang dibutuhkan aplikasi ini?" (Jawaban: sesedikit
mungkin — dua atau tiga sudah cukup untuk sebagian besar aplikasi kampus.)

Peringatkan soal satu kesalahan umum: mengukur sekali di `useState` awal, lalu layout tidak
pernah berubah saat HP diputar.

Salah paham: menyamakan breakpoint dengan nama perangkat. Tablet kecil dan HP besar bisa
masuk ambang yang sama.
-->

---

## Hal yang Perlu Diuji Setelah Layout Jadi

- Perbedaan layout pada HP dan tablet
- Penanganan teks panjang dan ukuran konten
- `ScrollView` saat ruang layar terbatas
- Pengujian responsivitas pada beberapa ukuran layar
- Pertimbangan aksesibilitas dan skala font pengguna

<!--
Lima butir ini adalah daftar periksa, bukan bahan hafalan: minta mahasiswa mencentangnya
satu per satu pada praktikumnya sendiri.

Butir terakhir paling sering dilupakan: pengguna yang memperbesar ukuran huruf di
pengaturan HP akan melihat teks yang membesar juga, dan layout harus tetap muat.

Pertanyaan penuntun: "Apa yang terjadi kalau teks judul diperbesar 200 persen?" (Jawaban:
teks memakan dua baris, dan tinggi container harus ikut menyesuaikan.)

Saran teknis: uji minimal tiga ukuran — HP kecil, HP besar, dan tablet dalam dua orientasi.
-->

---

## Praktikum 4: Dashboard Dua Panel

- Dua panel berisi ringkasan, disusun vertikal pada layar sempit
- Pada layar lebar, kedua panel berpindah menjadi horizontal
- Layout mengikuti lebar layar tanpa memuat ulang aplikasi

<!--
Beri 30 menit. Ini praktikum yang paling sering menghasilkan pertanyaan, jadi berkeliling
dan periksa urutan properti, bukan hanya hasil akhirnya.

Syarat lulus: memutar emulator atau mengubah lebar jendela mengubah susunan panel tanpa
error merah di layar.

Pertanyaan penuntun: "Properti apa yang kamu ubah saat layar melebar?" (Jawaban:
`flexDirection` dari `column` menjadi `row`.)

Peringatkan bahwa `gap` tidak didukung pada versi React Native yang sangat lama; periksa
versi project sebelum menyalahkan kodenya.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Bagian 5 — Scroller dan Perbedaan Platform

subbab 5.1–5.5: `ScrollView`, `FlatList`, pilihan scroller, Android dan iOS, serta input

<!--
Bagian penutup ini menjawab satu pertanyaan praktis: komponen gulir mana yang dipakai untuk
data seperti ini?

Sekaligus menjadi jembatan ke Bab 6, karena hampir setiap halaman yang dibangun nanti
berisi daftar.
-->

---

## `ScrollView` untuk Konten Statis yang Panjang

- Konsep pengguliran untuk konten statis
- Cocok untuk formulir, halaman detail, dan konten panjang
- `contentContainerStyle` mengatur padding dan jarak di dalam area gulir
- Seluruh konten anak umumnya dirender sekaligus

<!--
Kunci pembedanya adalah "dirender sekaligus": semua anak sudah ada di memori sejak layar
dibuka, berapa pun yang terlihat.

Pertanyaan penuntun: "Kenapa `ScrollView` berisi seribu baris terasa berat?" (Jawaban:
seribu baris itu dirender semua, bukan hanya yang terlihat.)

Tunjukkan pemakaian `contentContainerStyle` untuk padding, karena `padding` pada `style`
tidak selalu memberi hasil yang diharapkan pada area gulir.

Salah paham: menaruh `FlatList` di dalam `ScrollView` searah — ini dibahas lagi di slide
pilihan scroller.
-->

---

## `FlatList` untuk Data yang Bisa Memanjang

- `data` dan `renderItem` menentukan sumber data dan tampilan tiap item
- `keyExtractor` memberi identitas unik untuk setiap item
- `ListHeaderComponent`, `ListEmptyComponent`, `ItemSeparatorComponent`
- Item dirender bertahap, sehingga daftar panjang tetap ringan

```jsx
import { FlatList, Text } from 'react-native';
const products = [
  { id: '1', name: 'Laptop' },
  { id: '2', name: 'Tablet' },
];
export default function App() {
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  );
}
```

<!--
Jelaskan virtualisasi sebagai gagasan intinya: `FlatList` menyimpan beberapa item cadangan di
atas dan bawah layar, membuang yang terlewati, lalu menyusun yang baru saat digulir.

Analogi: `ScrollView` seperti mencetak seluruh buku untuk membaca satu halaman; `FlatList`
seperti mencetak satu halaman saat halamannya dibutuhkan.

Pertanyaan penuntun: "Kenapa `item.id` lebih baik daripada indeks array sebagai key?"
(Jawaban: indeks bergeser saat data difilter atau diurutkan, sehingga baris tercocokkan
dengan salah.)

Salah paham: mengisi `keyExtractor` dengan nilai acak, sehingga daftar dibangun ulang terus.
-->

---

## Memilih Komponen Pengguliran

| Kebutuhan | Komponen yang disarankan |
|---|---|
| Konten halaman relatif sedikit | `ScrollView` |
| Daftar data panjang atau dinamis | `FlatList` |
| Daftar dua dimensi | `FlatList` dengan `numColumns` |
| Daftar bertingkat dengan beberapa bagian | `SectionList` |
| Daftar kecil di dalam daftar lain | Evaluasi ulang struktur; hindari scroll bersarang |

Perhatikan risiko performa, tinggi container, dan konflik pengguliran bersarang.

<!--
Bacakan tabel sebagai lima pertanyaan yang dijawab berurutan, bukan sebagai daftar hafalan.

Prinsip di balik tabel: pilih komponen berdasarkan struktur data dan jumlah item, bukan
berdasarkan kebiasaan.

Pertanyaan penuntun: "Kenapa scroll bersarang berbahaya?" (Jawaban: dua scroller berebut
kendali gulir, dan virtualisasi `FlatList` di dalamnya rusak — console Metro menampilkan
peringatan.)

Salah paham: menganggap `FlatList` selalu lebih baik, termasuk untuk lima kartu statis yang
seluruhnya muat di satu layar.
-->

---

## Android dan iOS Tidak Selalu Sama

- Perbedaan tampilan, indikator, dan perilaku scroll
- Penyesuaian padding serta area aman
- Uji sentuhan, keyboard, dan navigasi pada kedua platform

<!--
Tunjukkan dua emulator berdampingan; perbedaan paling mudah dilihat adalah indikator gulir
dan perilaku tombol kembali.

Tekankan bahwa menguji di satu platform saja bukan bukti aplikasi berjalan benar, dan bagian
inilah yang paling sering menjadi temuan saat pengujian akhir.

Pertanyaan penuntun: "Kenapa judul tertutup status bar di satu platform saja?" (Jawaban:
kebijakan area aman berbeda; Android modern menggambar isi sampai tepi layar.)

Salah paham: menambahkan `paddingTop` tetap sebagai tambal area aman — nilainya berbeda di
tiap perangkat.
-->

---

## `Platform.OS` dan File Khusus Platform

- `Platform.OS` dipakai untuk logika khusus platform
- File `.ios.js` dan `.android.js` untuk perbedaan yang lebih besar
- Utamakan komponen bersama; penyesuaian platform adalah pengecualian

```jsx
import { Platform, Text } from 'react-native';

export default function App() {
  return (
    <Text>
      {Platform.OS === 'ios'
        ? 'Berjalan di iOS'
        : 'Berjalan di Android'}
    </Text>
  );
}
```

<!--
Beri urutan keputusan: satu kode untuk dua platform dulu, `Platform.OS` kalau bedanya kecil,
dan file terpisah hanya kalau perbedaannya satu komponen utuh.

Pertanyaan penuntun: "Kapan `Platform.OS` tidak lagi cukup?" (Jawaban: saat layout atau
komponennya sendiri berbeda, bukan hanya nilainya.)

Peringatkan bahwa dua file terpisah harus dirawat dua kali: setiap perbaikan harus
disalin, dan itu sumber bug yang klasik.

Salah paham: memakai `Platform.OS` untuk menebak model perangkat atau ukuran layar.
-->

---

## Input, Keyboard, dan Gulir yang Tidak Tabrakan

- Perilaku keyboard pada formulir perlu diatur
- `keyboardShouldPersistTaps` menentukan apakah sentuhan pertama diteruskan
- `RefreshControl` untuk menyegarkan data bila diperlukan
- Uji performa pada daftar panjang

<!--
Tunjukkan dua gejala di emulator: keyboard menutupi kotak isian, dan sentuhan pertama pada
tombol hanya menutup keyboard tanpa menekan tombol. Yang kedua dijawab
`keyboardShouldPersistTaps`.

Pertanyaan penuntun: "Kenapa tombol harus ditekan dua kali saat keyboard terbuka?"
(Jawaban: sentuhan pertama dipakai untuk menutup keyboard.)

Sebutkan bahwa penanganan papan ketik yang lengkap dibahas di Bab 8; di sini cukup tahu
properti mana yang menanganinya.

Salah paham: mematikan keyboard pada semua layar, termasuk layar yang butuh input.
-->

---

## Praktikum 5: Daftar Produk dengan `FlatList`

- Daftar produk dirender dengan `FlatList`
- Tambahkan pencarian sederhana di atas daftar
- Tampilkan indikator pemuatan saat data belum siap
- Uji perilaku scroll pada Android dan iOS

<!--
Beri 40 menit. Kalau data produk tidak tersedia, ganti dengan data statis; yang dinilai
struktur komponennya, bukan sumber datanya.

Perhatikan dua kesalahan yang hampir pasti muncul: `keyExtractor` kosong, dan daftar yang
dibungkus `ScrollView` sehingga virtualisasinya rusak.

Pertanyaan penuntun: "Kalau pencarian menyaring data, apakah `keyExtractor`-nya perlu
berubah?" (Jawaban: tidak, selama nilainya memang identitas item, bukan indeks.)

Peringatkan bahwa indikator pemuatan tidak boleh dipakai untuk menutupi daftar kosong —
untuk itu ada `ListEmptyComponent`.
-->

---

## Praktikum Integrasi: Halaman Katalog Responsif

- Halaman katalog memakai komponen inti, styling, dan layout responsif
- Scroller dipilih sesuai struktur data katalog
- Diuji pada layar sempit, layar lebar, dan dua platform

<!--
Ini praktikum penutup dari rekomendasi lima sesi: satu halaman yang memakai seluruh isi bab.
Kerjakan dengan data aplikasi Manajemen Data Mahasiswa — daftar mata kuliah atau daftar
mahasiswa — supaya hasilnya bisa dipakai lagi di Bab 6 dan Bab 7.

Indikator keberhasilan akhir: halaman memakai komponen inti, styling terstruktur, layout
responsif, dan pengguliran yang sesuai kebutuhan konten dan platform.

Pertanyaan penuntun: "Bagian mana yang paling lama kamu kerjakan, dan kenapa?" (Jawaban
umumnya layout; itulah alasan subbab 4.1–4.7 mendapat porsi terbesar.)

Ingatkan tenggat dan bahwa hasilnya menjadi bahan penilaian praktikum bab ini.
-->

---

## Yang Harus Teramati

- Teks muncul sebagai `Text`, bukan sebagai isi `View`
- Tombol berubah tampilan saat status aktif dan nonaktif
- Dua panel berubah susunan saat jendela melebar atau diputar
- Daftar panjang tetap ringan saat digulir
- Tidak ada konten tertutup status bar atau home indicator

<!--
Minta mahasiswa mencentang lima butir ini pada aplikasinya sendiri sebelum sesi berakhir.
Yang tidak tercentang menjadi bahan pertanyaan di sesi berikutnya.

Pertanyaan penuntun: "Butir mana yang paling sering gagal di kelas ini?" (Jawaban: butir
kedua dan kelima, karena keduanya bergantung pada state dan area aman.)

Tekankan bahwa daftar periksa ini sama dengan indikator keberhasilan akhir bab, hanya
dipecah menjadi gejala yang bisa dilihat langsung.
-->

---

## Kuis Kilat

1. Apa yang dirender React Native: elemen HTML atau komponen native?
2. Komponen apa yang wajib membungkus teks?
3. Dalam array style, gaya mana yang dipakai saat dua gaya mengatur properti yang sama?
4. Properti apa yang mengatur distribusi komponen pada sumbu utama?
5. Kapan `FlatList` lebih tepat daripada `ScrollView`?

<!--
Beri dua menit, jawaban ditulis dulu di kertas, baru dibahas. Jangan buka slide kunci
sebelum semua menulis.

Kalau waktu habis, cukup pertanyaan 3 dan 5 — keduanya paling menentukan di praktikum.

Jangan beri petunjuk jawaban di slide ini; godaan terbesarnya adalah menyebut satu kata kunci
lalu kelas menebak sisanya.
-->

---

## Kunci Kuis Kilat

- Komponen native, bukan elemen HTML
- `Text`; `View` tidak boleh berisi teks langsung
- Gaya yang ditulis belakangan; urutan array adalah urutan prioritas
- `justifyContent`
- Saat data panjang atau dinamis dan hanya sebagian item perlu dirender

<!--
Ulangi alasan, bukan hanya jawabannya: pertanyaan ketiga dijawab dengan aturan urutan array,
dan pertanyaan kelima dengan gagasan virtualisasi.

Kalau banyak yang salah di pertanyaan ketiga, ulangi slide array style sebelum menutup bagian
ini.

Pertanyaan lanjutan untuk kelas cepat: "Kalau `FlatList` berisi lima item, apakah tetap
lebih baik?" (Jawaban: tidak salah, tetapi `ScrollView` lebih sederhana dan cukup.)
-->

---

## Ringkasan

1. React web dan React Native berbagi konsep, tetapi berbeda komponen dan rendering
2. Komponen inti dipilih sesuai jenis isi dan kebutuhan interaksi
3. `StyleSheet`, array style, dan gaya kondisional menjaga tampilan konsisten dan dinamis
4. Flexbox dan `useWindowDimensions` membuat layout beradaptasi dengan layar
5. Scroller dipilih sesuai struktur data, dengan penyesuaian platform seperlunya

<!--
Jangan dibacakan. Minta mahasiswa memilih satu nomor dan menjelaskannya dengan kata-kata
sendiri; ini bekerja lebih baik daripada mengulang bacaan.

Pesan utamanya: setiap keputusan di lima butir ini punya alasan, dan alasan itu yang dipakai
lagi saat membaca kode orang lain.

Ingatkan bahwa kelima butir ini menjadi bahan Bab 6 (membangun UI), Bab 7 (navigasi), dan
Bab 8 (formulir).
-->

---

<!-- _class: compact -->

## Referensi

| Sumber | Link |
|---|---|
| Dokumentasi React Native (2026) | reactnative.dev |
| Dokumentasi Expo (2026) | docs.expo.dev |
| Dokumentasi React (2026) | react.dev |
| JavaScript, MDN Web Docs (2026) | developer.mozilla.org |
| Buku Ajar Bab 5 — Dasar React Native | `buku/bab-05-dasar-react-native.md` |

**Bacaan lanjutan:** Bab 6 — Membangun User Interface Mobile

**Versi teknologi:** Expo SDK 57 · React Native 0.86 · React 19.2 · Node.js ≥ 22

<!--
Rujukan lengkap ada di Lampiran D; glosarium istilah di Lampiran C membantu untuk istilah
seperti Flexbox, virtualisasi, dan safe area.

Dokumentasi resmi tetap menjadi rujukan utama untuk detail API dan perilaku versi terkini;
periksa halaman versi sebelum menyimpulkan bahwa sebuah properti tidak ada.

Peringatkan bahwa contoh di internet sering memakai versi lama, sehingga sebagian properti
sudah berubah nama atau dipindahkan.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Siap ke Bab 6

**Tugas:** selesaikan Praktikum 5 dan praktikum integrasi — halaman katalog responsif.

Berikutnya: menyusun antarmuka yang rapi dan beralasan dengan komponen, jarak, dan warna.

<!--
Tutup dengan satu kalimat: "Hari ini kita belajar abjad visualnya; minggu depan kita menyusun
kata dan kalimatnya."

Sebutkan tenggat praktikum secara eksplisit dan aspek penilaiannya: rubrik praktikum di
Lampiran A mencakup pemahaman konsep 15%, implementasi 25%, kualitas kode 15%, UI/UX 15%,
debugging 10%, dan dokumentasi 20%.

Ingatkan bahwa halaman yang dibuat hari ini disimpan; Bab 6 memperhalus tampilannya, Bab 7
menambahkan navigasi, dan Bab 8 formulir, tanpa merombak struktur komponennya.
-->
