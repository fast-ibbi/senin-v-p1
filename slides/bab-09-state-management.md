---
marp: true
theme: academic
paginate: true
title: "Bab 9 — State Management"
description: "Kuliah Pemrograman Mobile, pertemuan 9: state lokal vs state global, lifting state up, prop drilling, Context API, custom hook, kapan data layak menjadi global, Zustand dan Redux Toolkit, serta praktikum keranjang belanja."
author: "Dosen Mata Kuliah — Program Studi Sistem Informasi / Teknik Informatika"
footer: "Pemrograman Mobile · Bab 9 — State Management"
size: 16:9
---

<!-- _class: lead -->
<!-- _paginate: skip -->
<!-- _footer: "" -->

# Bab 9 — State Management

State lokal dan global, Context API, custom hook · Pertemuan 9 · Sub-CPMK 4.2

<!--
Buka dengan satu kalimat: "Bab 4 mengajari satu komponen mengingat datanya sendiri; hari ini
data itu harus dipakai bersama oleh banyak layar."

Kaitan RPS: pertemuan 9 mencakup Bab 8 (Sub-CPMK 4.3) dan Bab 9 (Sub-CPMK 4.2). Deck ini
hanya membahas Bab 9, dan praktikumnya adalah keranjang belanja yang berdiri di atas project
Bab 7.
-->

---

## Tujuan Pembelajaran

Setelah bab ini, kamu bisa:

- Menjelaskan perbedaan state lokal dan state global beserta trade-off-nya
- Mengidentifikasi kondisi yang membutuhkan lifting state up atau Context API
- Mengevaluasi kapan data tetap lokal dan kapan layak menjadi global
- Mengimplementasikan Context API dengan JavaScript polos
- Merancang custom hook `useCart` serta mengevaluasi Zustand dan Redux Toolkit

<!--
Bacakan hanya kata kerjanya. Butir 4 dan 5 adalah inti praktikum dan bahan penilaian rubrik:
pemahaman konsep 15% dan implementasi 25% (Lampiran A).

Tegaskan bahwa butir 3 adalah pertanyaan rekayasa yang paling sering dijawab keliru: menaruh
semua data ke global state sejak awal bukan solusi, melainkan utang.

Catatan untuk pengajar: RPS pertemuan 9 menulis tiga butir untuk Bab 9, sedangkan deck ini
memecahnya menjadi lima supaya ujung yang berbeda tidak digabung dalam satu butir. Jangan
dibacakan kecuali ada yang bertanya.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Bagian 1 — Dari State Lokal ke State Global

subbab 9.1 state lokal vs global · 9.2 lifting state up

<!--
Bagian ini konseptual dan menjadi dasar seluruh bab. Kalau waktu sempit, subbab 9.1 tetap
tidak boleh dilewati karena istilahnya dipakai sampai Bab 13.
-->

---

## Cakupan State Menentukan di Mana Ia Disimpan

![w:1120](assets/diagrams/bab-09-state-management-06.svg)

**State** adalah data yang berubah karena interaksi pengguna dan memengaruhi tampilan (Bab 4). Bab ini memisahkannya menurut cakupan pemakaian.

| Cakupan | Ciri pemakaian | Contoh |
|---|---|---|
| **Lokal** | Satu komponen dan anak-anaknya | Status panel, pilihan satu tombol |
| **Global** | Banyak komponen, biasanya lintas layar | Keranjang: badge, daftar, pembayaran |

> Kalau setiap layar menyimpan salinannya sendiri, data bisa tidak sinkron.

<!--
Dipotong ke gambar (diagram yang mengatakan ini):
- Contoh: teks yang sedang diketik di kolom pencarian
- Contoh: isi keranjang di badge, layar daftar, dan layar pembayaran

Dua butir itu adalah satu baris gambar, satu contoh per cakupan. Yang tinggal di bawahnya
adalah prosa yang tidak digambar: contoh lokal kedua, aturan siapa yang boleh melihat state
sebuah komponen, dan mode kegagalan yang membuat keranjang harus global.

Analogi dari buku: state lokal seperti catatan kecil di mejamu sendiri, state global seperti
papan pengumuman kantor. Papan menolong banyak orang, tetapi isinya harus dirawat dan
penulisnya harus disiplin.

Tanya: "Kalau dua layar masing-masing menyimpan salinan keranjang, layar mana yang benar?"
(Jawaban: tidak ada yang bisa memastikan; di situlah bug dimulai.)

Peringatan salah paham: global state bukan soal "datanya besar", melainkan soal luas cakupan
pemakainya.
-->

---

<!-- _class: center -->

## Latihan: Lokal atau Global?

- **A.** Teks yang sedang diketik di kolom pencarian produk
- **B.** Isi keranjang yang dibaca layar produk dan layar keranjang
- **C.** Pilihan ukuran minuman yang dipakai dua komponen di satu layar
- **D.** Total harga keranjang

Tentukan tingkat state yang tepat untuk setiap kasus, lalu sebutkan alasannya.

<!--
Think-pair-share 3 menit, lalu tampung 2–3 jawaban. Jawabannya tidak ada di slide ini;
pembahasannya di slide berikutnya.

Pancing kalau kelas ragu di kasus D: "Total harga perlu disimpan, atau bisa dihitung ulang
kapan saja dari daftar item?"
-->

---

<!-- _class: compact -->

## Kuncinya: Lokal, Global, atau Diangkat ke Induk

| Kasus | Tingkat state | Alasan |
|---|---|---|
| A. Teks pencarian | Lokal (`useState`) | Satu komponen saja |
| B. Isi keranjang | Global (Context API) | Dibaca lintas layar; induk bersama layout akar |
| C. Pilihan ukuran | Diangkat ke induk | Dua komponen bersaudara di satu layar |
| D. Total harga | Nilai turunan | Dihitung dari `items`, tidak disimpan |

> Praktikum 9 memakai pola yang sama: keranjang menjadi global state, sedangkan total harga selalu dihitung.

<!--
Hubungkan jawaban kelas dengan praktikum: kasus B melahirkan CartProvider, kasus C muncul di
Contoh 1 (pemesanan minuman), dan kasus D menjelaskan kenapa totalHarga bukan state.

Kesalahan paling sering: menjadikan total harga state terpisah, lalu lupa memperbaruinya pada
salah satu operasi.
-->

---

## Lifting State Up: State Naik, Data Turun

**Lifting state up** adalah memindahkan state ke induk terdekat yang menjadi nenek moyang bersama semua komponen yang membutuhkannya.

![w:1120](assets/diagrams/bab-09-state-management-02.svg)

> Induk memegang state, menurunkannya lewat **props**, dan setiap perubahan dikirim balik lewat fungsi **callback**.

<!--
Aliran data React satu arah: dari induk ke anak. Untuk menaikkan data, React memakai pola
callback, dan lifting state up adalah penerapan paling sederhananya.

Tanya: "Kalau state ukuran tinggal di dalam PilihUkuran, bagaimana RingkasanPesanan tahu
pilihan pengguna?" (Jawaban: tidak akan pernah tahu; karena itulah state dinaikkan.)

Tegaskan istilah single source of truth: satu penyimpanan, banyak pembaca.
-->

---

## Lifting State Up Punya Batas: Prop Drilling

![w:1120](assets/diagrams/bab-09-state-management-07.svg)

**Prop drilling** adalah mengoper props berantai lewat komponen perantara yang sama sekali tidak memakai data itu.

- Menambah satu data baru berarti mengubah seluruh deret perantara
- Kode menjadi berisik dan sulit dirawat

> Munculnya prop drilling adalah tanda untuk beralih ke mekanisme berikutnya: Context API.

<!--
Dipotong ke gambar (diagram yang mengatakan ini):
- Terjadi saat data harus melewati banyak tingkat komponen

Seluruh bentuk gambar adalah butir itu: nilai berangkat dari pemiliknya, melewati dua
komponen yang tidak pernah membacanya, baru sampai ke komponen yang memakainya. Yang tinggal
di slide adalah yang tidak bisa ditunjukkan rantai: satu field baru menulis ulang seluruh
deret, dan deret itu berisik untuk dirawat.

Cara menjelaskan: bayangkan menyampaikan pesan lewat lima orang, empat di antaranya tidak
peduli. Lifting state up cukup untuk dua sampai tiga tingkat komponen.

Tanya: "Gejala apa di kode yang menandakan kita sudah kena prop drilling?" (Jawaban: props
yang sama muncul di komponen yang tidak memakainya.)

Peringatan: jangan buru-buru menyimpulkan setiap prop adalah prop drilling; props eksplisit
tetap yang paling mudah dibaca untuk dua atau tiga tingkat.
-->

---

<!-- _class: compact -->

## Contoh 1: Induk Menyimpan Ukuran, Dua Anak Membacanya

`screens/LayarPesan.js` — pemilik state `ukuran`

```js
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PilihUkuran from '../components/PilihUkuran';
import RingkasanPesanan from '../components/RingkasanPesanan';
export default function LayarPesan() {
  const [ukuran, setUkuran] = useState('M');
  return (
    <View style={styles.layar}>
      <PilihUkuran ukuran={ukuran} onPilihUkuran={setUkuran} />
      <RingkasanPesanan ukuran={ukuran} />
    </View>
  );
}
const styles = StyleSheet.create({ layar: { flex: 1, padding: 16 } });
```

<!--
Dipotong ke catatan (tidak muat di slide):
> `PilihUkuran` mengirim pilihan lewat callback; `RingkasanPesanan` membacanya lewat props.

Contoh lengkapnya tiga file: components/PilihUkuran.js (tombol S/M/L),
components/RingkasanPesanan.js (tabel HARGA: S 8000, M 10000, L 12000), dan LayarPesan.js di
slide ini. Hanya baris judul <Text style={styles.judul}> dan kunci judul di
StyleSheet.create yang dipotong; sisanya bisa diketik apa adanya, dan versi utuhnya ada di
buku, Contoh 1. Berkas praktikum keranjang ada di kode/bab-09-state-management/.

Tegaskan baris onPilihUkuran={setUkuran}: setter dari useState dipakai langsung sebagai
callback karena bentuknya (nilaiBaru) => void.

Salah paham yang sering: mahasiswa menaruh state di komponen anak lalu "mengirim nilainya ke
atas" lewat props. Aliran seperti itu tidak ada di React.
-->

---

## Studi Kasus: Satu Keranjang KRS yang Harus Sama di Dua Layar

**Kasus fiktif dengan pola nyata.** Aplikasi Manajemen Data Mahasiswa (`siakad-mobile`) yang kamu bangun sejak Bab 5.

- Layar KRS memilih mata kuliah; layar ringkasan menjumlahkan SKS
- Keduanya bukan saudara — induk bersamanya adalah layout akar aplikasi
- Disimpan lokal di layar KRS, pilihan itu tidak pernah sampai ke layar ringkasan
- Diangkat ke layout akar lewat props, setiap layar harus meneruskan props yang sama

> Jawabannya Context API: satu sumber kebenaran, dua pembaca.

<!--
Bacakan sebagai cerita, bukan sebagai daftar. Tujuannya agar mahasiswa melihat bahwa masalah
bab ini muncul di aplikasi yang mereka bangun sendiri, bukan di aplikasi orang lain.

Sebutkan sekali di sini: pada project mata kuliah ini keranjang belanja adalah pilihan KRS,
sehingga context-nya bernama KrsContext dan hook-nya useKrs. Polanya sama persis, hanya nama
domainnya yang berbeda.

Pertanyaan sebelum bagian berikutnya: "Kalau layout akar yang memegang state, bagaimana
prop drilling bisa dihindari?" Biarkan mereka menebak dulu.

Kaitkan dengan Project Akhir: keputusan yang sama akan mereka ambil untuk fitur lain, misalnya
sesi pengguna di Bab 13.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Bagian 2 — Context API & Custom Hook

subbab 9.3 Context API · 9.4 custom hook · 9.5 kapan global · 9.6 pustaka modern

<!--
Bagian ini inti bab dan bagian yang paling mungkin keluar di ujian. Kalau waktu menipis,
subbab 9.6 (Zustand dan Redux Toolkit) boleh dibacakan sekilas karena sifatnya konseptual.
-->

---

## Context API Bekerja Lewat Tiga Bagian

**Context API** adalah mekanisme bawaan React untuk membagikan data ke seluruh cabang pohon komponen tanpa menurunkannya satu per satu lewat props.

| Bagian | Perannya |
|---|---|
| `createContext` | Membuat objek context beserta nilai awalnya |
| `Provider` | Memasok nilai ke seluruh subtree lewat prop `value` |
| `useContext` | Hook untuk membaca nilai dari dalam subtree |

<!--
Isi nilai awal dengan null supaya komponen di luar provider mudah dideteksi; itulah pola yang
nanti dipakai useCart.

Pertanyaan penuntun: "Kalau context mengubah cara data didistribusikan, apakah cara state
disimpan ikut berubah?" (Jawaban: tidak, state tetap dideklarasikan dengan useState.)

Peringatan salah paham: context bukan pengganti props secara umum, melainkan jalur langsung
untuk data yang benar-benar lintas wilayah.
-->

---

## Polanya Cuma Tiga Baris: Wadah, Provider, Nilai Awal

`context/BahasaContext.js` — wadah, provider, dan nilai awalnya

```js
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

> `value={{ bahasa, setBahasa }}` membagikan nilai **dan** fungsi pengubahnya dalam satu objek.

<!--
Bacakan hanya tiga baris: createContext(null), useState, dan value={{ ... }}.

Cara menjelaskan: provider itu seperti papan pengumuman yang dipasang di satu lantai; setiap
ruangan di lantai itu (children, sedalam apa pun) bisa membacanya tanpa props dioper.

Salah paham: mahasiswa sering menulis useMemo atau state di luar provider. Ingatkan bahwa
context mengubah distribusi, bukan tempat penyimpanan.
-->

---

## Kapan Context Dipakai, Kapan Justru Dihindari

![w:1120](assets/diagrams/bab-09-state-management-08.svg)

| Pakai Context kalau | Hindari Context kalau |
|---|---|
| Prop drilling sudah terasa menyakitkan | Komponen sulit dipakai ulang karena nilainya tersembunyi |

> Saat nilai context berubah, **setiap** komponen yang memanggil `useContext` ikut di-render ulang.

<!--
Dipotong ke gambar (diagram yang mengatakan ini):
- Data dipakai banyak komponen yang berjauhan (tema, bahasa, keranjang)
- Data berubah lintas layar
- Data dipakai hanya satu atau dua komponen bertetangga

Gambar mengambil satu sumbu yang benar-benar dipakai kedua kolom — seberapa jauh pembacanya —
plus satu sinyal tambahan di sisi pemakaian. Butir yang tinggal adalah yang tidak bisa dibawa
gambar: rasa sakit yang membuat orang beralih, dan harga karena menyembunyikan nilai. Baris di
bawah slide tetap memuat peringatan re-render, jadi gambar tidak mengulanginya.

Sebutkan pemakaian nyata context: tema terang/gelap, bahasa antarmuka, profil pengguna yang
sudah masuk (Bab 13), dan keranjang belanja.

Tegaskan kalimat di bawah slide: render ulang seluruh cabang tidak masalah untuk data yang
jarang berubah, seperti tema atau bahasa, tetapi berat untuk data yang sering berubah.

Tanya: "Kalau seluruh aplikasi dibungkus satu provider raksasa, apa risikonya?" (Jawaban:
setiap perubahan memicu render ulang semua pembacanya.)
-->

---

## Custom Hook Membungkus State agar Bisa Dipakai Ulang

**Custom hook** adalah fungsi JavaScript yang namanya diawali `use` dan memanggil satu atau lebih hook bawaan di dalamnya.

`hooks/useTampilSembunyi.js` — hook terkecil yang berguna

```js
import { useState } from 'react';

export function useTampilSembunyi(awal = false) {
  const [tampil, setTampil] = useState(awal);
  const ubah = () => setTampil((n) => !n);
  return { tampil, ubah };
}
```

- Nama fungsi wajib diawali kata `use`
- Hook bawaan hanya dipanggil di tingkat atas fungsi
- Tidak boleh dipanggil di dalam percabangan atau perulangan

<!--
Tiga manfaat yang harus disebut: komponen menjadi lebih pendek dan fokus pada tampilan, logika
bisa dipakai ulang tanpa menyalin kode, dan logika yang terisolasi lebih mudah diuji (dipakai
lagi di Bab 14).

Aturan hook di butir 2 dan 3 sama dengan Bab 4 §4.8; sebutkan bahwa React melacak urutan
pemanggilan hook, sehingga urutannya tidak boleh berubah.

Pertanyaan lanjutan: "Apakah custom hook menyimpan state-nya sendiri?" (Jawaban: state itu
milik komponen yang memanggilnya; setiap pemanggil mendapat salinan sendiri.)
-->

---

## useCart: Satu Pintu ke Context, Layar Tak Perlu Tahu Namanya

`hooks/useCart.js` — membungkus akses context sekaligus memeriksa error

```js
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

> Komponen tidak perlu tahu nama context, cukup memanggil `useCart()`.

<!--
Jelaskan pemeriksaan ctx === null: nilai awal context memang null, sehingga pemanggilan di luar
provider terdeteksi dan pesan errornya menyebut perbaikannya. Pesan itu jauh lebih mudah
ditelusuri daripada "cannot read null".

Bandingkan dengan Contoh 2 di buku (mode gelap): di sana komponen memanggil useContext
langsung. Keduanya sah; custom hook dipilih ketika pemakaiannya berulang dan pesan error
seragam dibutuhkan.

Peringatan: hook ini harus dipakai di dalam subtree CartProvider, bukan di sampingnya.
-->

---

## Tiga Pertanyaan Menyaring Data yang Layak Global

- Berapa pemakainya? Satu komponen berarti lokal sudah cukup
- Dipakai lintas layar? Ditulis di satu layar dan dibaca di layar lain — data itu layak global
- Banyak pihak menulis data yang sama? Satu tempat mencegah salinan bertabrakan

> Kalau pemakainya beberapa komponen bertetangga, coba lifting state up lebih dulu; keranjang baru butuh Context karena dibaca lintas layar.

<!--
Urutkan sebagai penyaring, bukan daftar hafalan: pertanyaan pertama menyaring sebagian besar
kasus, dan hanya yang lolos sampai ke pertanyaan ketiga.

Kaitkan dengan keranjang: induk bersama dua layar adalah layout akar, jadi menaikkan state
lewat props berarti setiap layar harus meneruskan props yang sama.
-->

---

## Tiga Tanda Data Tidak Perlu Global

![w:1120](assets/diagrams/bab-09-state-management-09.svg)

- Data milik server — lebih baik diambil dan di-cache oleh satu lapisan khusus (Bab 10 dan 11)
- Data sementara satu layar — isi formulir sebelum disimpan cukup menjadi state lokal

> Menyimpan nilai turunan membuka pintu ketidaksinkronan: satu operasi yang lupa memperbaruinya sudah cukup merusak tampilan.

<!--
Dipotong ke gambar (diagram yang mengatakan ini):
- Data yang bisa dihitung ulang — nilai turunan seperti `totalHarga` dan `jumlahItem`

Baris pertama gambar adalah butir itu beserta rumah yang tidak disebut di slide: nilai turunan
dihitung dari `items` pada setiap render, jadi tidak mungkin tertinggal. Dua tanda lain juga
tetap di slide di samping gambar yang sama — tujuan masing-masing hanya mengulang kalimatnya
sendiri, dan itulah sebabnya pasangannya enak dibaca.

Contoh nyata dari buku: total harga keranjang tidak perlu disimpan karena selalu bisa dihitung
dari daftar item.

Sebutkan bahwa pemula sering menyalin data server mentah-mentah ke global state, padahal
sumber kebenarannya tetap di server (Bab 10).

Pertanyaan penuntun: "Kalau total harga dihitung pada setiap render, apakah aplikasi jadi
lambat?" (Jawaban: tidak untuk daftar sependek keranjang; optimasi dini belum perlu.)
-->

---

## Tangga Keputusan: Berhenti di Tingkat Paling Sederhana

![w:1120](assets/diagrams/bab-09-state-management-03.svg)

> Berhenti di tingkat paling sederhana yang masih memenuhi kebutuhan, dan naik hanya ketika ada pemakai baru.

<!--
Bacakan tangga ini dari kiri ke kanan dan tegaskan arahnya: dari sederhana ke rumit, bukan dari
canggih ke ketinggalan. Di sinilah "tangga keputusan" bab ini berada.

Analogi penutup dari buku: menaruh semua data ke global state sejak awal sama dengan membuat
papan pengumuman begitu penuh tempelan sehingga tidak ada yang mau membacanya.

Salah paham yang harus diberantas: "aplikasi profesional selalu memakai Redux".
-->

---

<!-- _class: compact -->

## Zustand dan Redux Toolkit: Bukan untuk Skala Kuliah

| Aspek | Zustand | Redux Toolkit |
|---|---|---|
| Bentuk store | Dibuat dengan fungsi `create` | Satu store global, action dan reducer |
| Cara pakai | Lewat hook, tanpa provider | `createSlice` dan `configureStore` |
| Keunggulan | Ringkas, kode minim | Devtools matang, alur terprediksi |
| Biaya | Pola di luar pohon komponen | Kurva belajar curam, kode lebih banyak |

> **Keduanya tidak dipakai buku ini** — Context API plus custom hook sudah cukup untuk project kuliah.

<!--
⚠ sensitif versi: sintaks kedua pustaka bisa berubah antarversi; bab ini menandainya dan
meminta mahasiswa memeriksa dokumentasi resmi zustand dan Redux Toolkit sebelum memakainya.

Memilih pustaka bukan soal "mana yang terbaik", melainkan mencocokkan dengan kompleksitas
aplikasi dan ukuran tim: Context untuk skala kecil-menengah, Zustand untuk tim yang ingin
ringkas, Redux Toolkit untuk aplikasi besar dengan banyak kolaborator.

Pertanyaan penuntun: "Untuk satu layar yang hanya butuh satu toggle, apakah Redux Toolkit
sepadan?" (Jawaban: tidak; buku ini menyebutnya kanon untuk menembak nyamuk.)
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Bagian 3 — Merancang State dan Membangun Keranjang

subbab 9.7 merancang state · Praktikum 9 aplikasi TokoKu

<!--
Bagian ini praktikum penuh. Kalau pertemuan punya dua sesi, kerjakan Praktikum 9 di sesi kedua
dan pakai slide rancangan state untuk membuka kerja kelompok.
-->

---

## Rancang Dulu State-nya, Baru Menulis Kode

Lima pertanyaan yang harus dijawab sebelum menulis kode:

![w:1000](assets/diagrams/bab-09-state-management-10.svg)

- Di mana state harus hidup? Di `CartProvider` dalam `app/_layout.js`, membungkus setiap rute
- Bagaimana penyimpanan permanennya? Masih di memori; ada TODO untuk Bab 11

<!--
Dipotong ke gambar (diagram yang mengatakan ini):
- Data apa yang disimpan? Daftar item `{ id, nama, harga, qty }`
- Operasi apa yang dibutuhkan? Tambah, kurangi qty, hapus, dan kosongkan
- Nilai apa yang dihitung, bukan disimpan? `jumlahItem` dan `totalHarga`

Gambar menjawab tiga dari lima pertanyaan: apa yang disimpan, operasi apa yang dibutuhkan, dan
apa yang dihitung alih-alih disimpan. Dua pertanyaan yang tinggal di slide adalah dua yang
tidak bisa dimuat gambar — di mana state hidup adalah pohon provider, dan penyimpanan permanen
adalah rencana untuk Bab 11.

Tegaskan bahwa merancang state lebih dulu adalah latihan berpikir yang membedakan pengembang
dari penyalin kode.

Sebutkan keputusan penting: katalog produk (data/produk.js) adalah data statis, bukan state,
karena isinya tidak berubah selama aplikasi berjalan.

Beri 5 menit berpasangan untuk menjawab kelima pertanyaan sebelum kode dibuka.
-->

---

<!-- _class: compact -->

## Tambah Item Menyalin Daftar, Bukan Mengubahnya

`context/CartContext.js` — sumber kebenaran tunggal keranjang

```js
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
```

> Pembaruan fungsional `setItems((sekarang) => …)` menghitung dari nilai terbaru.

<!--
File ini juga mengimpor createContext dan useState dari react; baris impornya dipotong dari
slide supaya kode tetap pendek, dan blok return provider ada dua slide setelah ini. Versi utuhnya
ada di kode/bab-09-state-management/context/KrsContext.js — pada project mata kuliah ini
keranjang adalah pilihan KRS, jadi context-nya bernama KrsContext dan hook-nya useKrs (pola
sama, nama domain berbeda).

Tiga keputusan yang harus disebut: pembaruan fungsional supaya aman ketika beberapa pembaruan
datang berurutan, find + map untuk menaikkan qty item yang sudah ada, dan spread
{ ...produk, qty: 1 } untuk item baru.

Pertanyaan penuntun: "Kenapa pencarian item harus memakai id, bukan nama?" (Jawaban: id unik dan
stabil, sedangkan nama bisa berubah.)
-->

---

## Kurangi dan Hapus Menjaga Qty Tetap Positif

`context/CartContext.js` — potongan lanjutan: operasi dan nilai turunan

```js
  const kurangiItem = (id) => {
    setItems((sekarang) =>
      sekarang
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  };
  const hapusItem = (id) =>
    setItems((sekarang) => sekarang.filter((i) => i.id !== id));
  const jumlahItem = items.reduce((total, i) => total + i.qty, 0);
  const totalHarga = items.reduce((total, i) => total + i.qty * i.harga, 0);
```

> `jumlahItem` dan `totalHarga` dihitung ulang dari `items` pada setiap render — tidak ada nilai turunan yang bisa tertinggal.

<!--
Tegaskan urutan map lalu filter di kurangiItem: map menurunkan qty, filter membuang item yang
qty-nya menjadi 0, sehingga qty tidak pernah nol atau negatif.

hapusItem hanya satu baris filter; jumlahItem dan totalHarga dihitung dengan reduce langsung
dari items pada setiap render, jadi tidak mungkin tertinggal dari isi keranjang.

Pertanyaan penuntun: "Kalau totalHarga dihitung pada setiap render, bisakah nilainya tidak
sinkron dengan items?" (Jawaban: tidak; nilainya selalu berasal dari items yang sama.)
-->

---

## Tanpa `value`, Keranjang Tidak Sampai ke Layar

`context/CartContext.js` — penutup provider, komentar TODO, dan prop `value`

```js
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

> `value` adalah satu-satunya jalan agar layar bisa membaca isi keranjang.

<!--
Blok return inilah yang membuat keranjang benar-benar dibagikan: tanpa prop value, state items
hanya hidup di dalam fungsi provider dan tidak ada layar yang bisa membacanya.

Tunjukkan bentuk value sebagai objek dengan enam kunci — items, tambahItem, kurangiItem,
hapusItem, jumlahItem, dan totalHarga — lalu bandingkan dengan slide dua layar: setiap layar
hanya mengambil bagian yang dibutuhkannya lewat useCart().

Komentar TODO menandai titik penyisipan penyimpanan di Bab 11: muat items dari AsyncStorage
saat provider dibuat, dan simpan setiap kali berubah.
-->

---

## Satu Provider di Akar Membungkus Setiap Rute

`app/_layout.js` — satu provider membungkus setiap rute (struktur rute di Bab 7)

```js
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

> Karena provider membungkus `<Stack>`, setiap rute berada di dalam subtree-nya.

<!--
Inilah yang membuat keranjang sah menjadi global state: bukan karena datanya besar, melainkan
karena cakupan pemakainya mencakup semua layar.

Sebutkan kesinambungannya dengan Bab 7: file ini adalah layout akar aplikasi Expo Router, dan
<Stack> mendaftarkan setiap rute dari folder app/ secara otomatis.

Pertanyaan penuntun: "Kalau nanti ada halaman bantuan yang tidak membutuhkan keranjang, apa
yang bisa dilakukan?" (Jawaban: memindahkan provider lebih ke dalam supaya render ulang tidak
berlebihan.)

⚠ sensitif versi: paket pendukung dan langkah konfigurasi Expo Router bisa berubah antarversi
Expo SDK; pakai daftar yang tertulis di Bab 7 §7.2 sampai 7.3.
-->

---

## Dua Layar Membaca Satu Sumber Data

| Layar | Membaca dari `useCart()` | Menulis lewat |
|---|---|---|
| `app/index.js` | `jumlahItem` | `tambahItem` |
| `app/keranjang.js` | `items`, `jumlahItem`, `totalHarga` | `tambahItem`, `kurangiItem`, `hapusItem` |

**Penjelasan tambahan:** tidak ada layar yang memanggil `setItems`; setiap perubahan lewat fungsi milik provider, jadi perilaku keranjang mudah diprediksi dan diuji.

> Layar ketiga, misalnya layar pembayaran, cukup memanggil `useCart()` tanpa mengubah provider.

<!--
Tabel ini merangkum kode praktikum, bukan materi baru; buka file app/index.js dan
app/keranjang.js di layar supaya mahasiswa melihat pemanggilan useCart langsung.

Layar produk hanya butuh dua nilai (satu pembaca, satu penulis), sedangkan layar keranjang
butuh enam. Bandingkan keduanya agar mahasiswa melihat manfaat hook.

Salah paham: mahasiswa sering menyalin items ke state lokal layar. Ingatkan bahwa salinan
itulah yang menciptakan dua keranjang yang berbeda.
-->

---

## Cakupan Provider Menentukan Banyaknya Re-render

![w:1120](assets/diagrams/bab-09-state-management-04.svg)

> Cakupan provider yang tepat mengurangi render ulang yang tidak perlu.

<!--
Jelaskan gambar dari kiri ke kanan: layout akar memasang CartProvider, provider memegang state
items, kedua layar membaca lewat useCart(), dan CartContext adalah wadah yang menyatukan
keduanya.

Tegaskan bahwa tidak ada panah dari layar langsung ke CartContext: satu-satunya pintu adalah
useCart(), dan itulah sebabnya nama context bisa diganti tanpa menyentuh layar.

Tanya: "Kalau CartContext.js dibuat ulang dengan huruf besar-kecil yang berbeda, apa
gejalanya?" (Jawaban: badge tidak bertambah dan tidak ada error; itu topik troubleshooting
berikutnya.)
-->

---

## Satu Ketukan "Tambah", Satu Rantai Sampai Badge

![w:1120](assets/diagrams/bab-09-state-management-05.svg)

> Setelah 2 Buku dan 1 Tipe-X: badge "Keranjang (3)" dan total "Rp 102.000".

<!--
Bacakan alur satu arah ini sebagai cerita: ketukan memanggil tambahItem, provider memperbarui
state, nilai context berubah, lalu React me-render ulang komponen yang memakai useCart().
Badge dan daftar keranjang ikut berubah.

Hasil yang diharapkan di praktikum: badge "(0)" menjadi "(2)" setelah tombol Tambah ditekan
dua kali; baris keranjang menampilkan "Rp 45.000 x 2 = Rp 90.000" dan "Rp 12.000 x 1 =
Rp 12.000"; menekan "-" pada qty 1 menghapus barisnya; keranjang kosong menampilkan
"Keranjang masih kosong."

Ingatkan bahwa menutup lalu membuka aplikasi mengembalikan keranjang ke keadaan kosong, dan itu
wajar karena penyimpanannya masih di memori (Bab 11).
-->

---

<!-- _class: center -->

## Apa yang Terjadi Jika…?

- Badge "Keranjang (0)" tidak bertambah padahal tombol "Tambah" ditekan berkali-kali
- Tidak ada pesan error, baik di layar maupun di terminal

Apa penyebab paling mungkin, dan bagaimana kamu membuktikannya?

<!--
Kasus ini diambil dari Troubleshooting 9 dan sering muncul di praktikum. Beri 3 menit
berpasangan untuk menyusun dugaan dan cara membuktikannya.

Arahkan penalarannya: tidak ada error berarti kode berjalan, tetapi menulis ke context yang
berbeda. Minta mahasiswa menyebut alat buktinya, bukan hanya dugaannya.

Jangan bocorkan jawabannya; pembahasannya di slide berikutnya.
-->

---

## Jawabannya: Badge Kosong Tanpa Pesan Error

| Kemungkinan penyebab | Cara membuktikannya |
|---|---|
| Ada dua salinan `CartContext` di file berbeda | Pastikan hanya ada satu `context/CartContext.js` |
| Layar memakai context yang berbeda dari provider | Bandingkan path dan huruf besar-kecil setiap `import` |
| Bundle lama masih dimuat Metro | Tekan `r`, lalu mulai ulang dengan `npx expo start --clear` |

> Pencegahan: satu lokasi dan satu kebiasaan penamaan untuk setiap file project.

<!--
Baris 1 dan 3 adalah dua penyebab dari satu entri Troubleshooting 9 yang gejalanya badge tidak
bertambah tanpa pesan error (dua salinan CartContext, atau bundle lama yang masih dimuat Metro).
Cara membuktikan baris 2 berasal dari entri "Unable to resolve ../hooks/useCart": bandingkan
path dan huruf besar-kecil setiap import dengan nama file di disk.

Error provider-missing yang dilempar useCart muncul ketika provider dipasang di satu layar,
bukan di app/_layout.js. Error itu pertolongan, bukan gangguan.

Kebiasaan yang harus ditanamkan: buat file lewat VS Code supaya path import terselesaikan
otomatis, dan uji kasus batas (qty 1 lalu dikurangi) setiap kali menulis ulang sebuah fungsi.
-->

---

<!-- _class: compact -->

## Antrean Kasir Primadona Lahir dari Total yang Dihitung Tangan

**Kasus fiktif dengan pola nyata.** Koperasi alat tulis kampus melayani ribuan mahasiswa.

| Gejala | Akar masalah |
|---|---|
| Antrean kasir 15–20 menit | Total belanja dihitung manual dengan kalkulator |
| Uang kas tidak cocok | Salah hitung atau salah ketik |
| Stok diam-diam menipis | Penjualan dicatat di buku, tidak terekam rapi |
| Laporan bulanan terlambat | Rekap manual dari buku harian |

> Solusinya aplikasi kasir mobile: pilih produk, aplikasi menghitung total, transaksi dikirim ke server.

<!--
Bacakan sebagai cerita, bukan sebagai tabel. Tujuannya agar mahasiswa melihat bahwa keranjang
adalah jembatan antara interaksi kasir dan data transaksi.

Petakan ke materi: total yang dihitung otomatis menghapus salah hitung (akar masalah kedua),
dan useCart memisahkan logikanya sehingga bisa diuji dan dipakai ulang di tempat lain.

Pertanyaan sebelum slide berikutnya: "Keranjang sebaiknya disimpan di perangkat atau di server?"
Biarkan mahasiswa menebak dulu.

Ingatkan bahwa Primadona adalah kasus koperasi, berbeda dari Aplikasi Manajemen Data Mahasiswa
yang mereka bangun sendiri.
-->

---

<!-- _class: compact -->

## Keranjang di HP atau di Server?

| Pertimbangan | Keranjang di HP | Keranjang di server |
|---|---|---|
| Kecepatan respons | Cepat, tanpa menunggu jaringan | Bergantung koneksi |
| Saat jaringan putus | Tetap berjalan | Tidak bisa dipakai |
| Risiko data | Hilang bila perangkat rusak | Tersimpan terpusat |
| Pindah perangkat | Keranjang tidak ikut pindah | Pelanggan menemukan keranjang yang sama |

> Praktikum memilih keranjang di HP dan di memori; pindah ke penyimpanan permanen (Bab 11) dan sinkronisasi server (Bab 10) tidak mengubah rancangan state-nya.

<!--
Keputusan arsitektur paling menarik di kasus ini: toko dengan jaringan tidak stabil dan
perangkat murah diuntungkan keranjang di HP, sedangkan toko daring besar memilih sisi server
supaya pelanggan berganti perangkat tanpa kehilangan keranjang.

Tegaskan inti perancangan state: bukan memilih satu teknologi selamanya, melainkan memahami
trade-off dan merancang agar keputusan itu bisa diubah dengan biaya murah.

Pertanyaan penuntun: "Kalau kasir A membuat keranjang dan dilanjutkan kasir B, apakah Context
API masih cukup?" (Jawaban: tidak; perlu draf di server, dan itu soal analisis.)
-->

---

## Praktikum: Yang Dibangun Pertemuan Ini

- `context/CartContext.js` — context, provider, dan seluruh operasi keranjang
- `hooks/useCart.js` — satu pintu masuk ke context
- `app/_layout.js` — `CartProvider` membungkus setiap rute
- `app/index.js` — daftar produk, tombol "Tambah", dan badge keranjang
- `app/keranjang.js` — isi keranjang, kendali qty, dan total harga
- Fitur "Kosongkan Keranjang" beserta kondisi keranjang kosong sebagai latihan

> Jalankan `npx expo start`, lalu ikuti langkah kerja Praktikum 9 di buku satu per satu.

<!--
Sebutkan prasyaratnya dengan suara keras: project Expo berbasis JavaScript dengan Expo Router
terpasang, seperti yang dikerjakan di Bab 7 §7.2–7.3.

Ingatkan bahwa katalog produk (data/produk.js) adalah data statis, bukan state — isinya tidak
berubah selama aplikasi berjalan.

Beri tenggat pengumpulan tangkapan layar secara eksplisit dan kaitkan dengan rubrik praktikum
(Lampiran A): pemahaman konsep 15%, implementasi 25%, kualitas kode 15%, UI/UX 15%, debugging
10%, dokumentasi 20%.
-->

---

## Yang Harus Teramati

- Badge "Keranjang (0)" menjadi "(2)" setelah tombol "Tambah" ditekan dua kali pada Buku
- Rincian baris: "Rp 45.000 x 2 = Rp 90.000" dan "Rp 12.000 x 1 = Rp 12.000"
- Ringkasan bawah: "Total (3 item): Rp 102.000"
- Qty tidak pernah menjadi 0 atau negatif saat tombol "-" ditekan
- Setelah semua item dihapus, pesan "Keranjang masih kosong." muncul

> Laporan yang baik menyertakan tangkapan layar setiap butir, bukan hanya tulisan "berhasil".

<!--
Jadikan slide ini lembar centang: minta mahasiswa mencentang butir satu per satu dan mengambil
tangkapan layar sebagai bukti penilaian rubrik.

Langkah 8 pada Langkah Kerja buku memuat skenario uji yang sama, termasuk mengosongkan
keranjang sebagai latihan tambahan (Soal Latihan 1).

Ingatkan bahwa hasil ini diamati pada alur aplikasinya; jangan menjanjikan apa pun yang belum
diuji mahasiswa sendiri.
-->

---

<!-- _class: center -->

## Kuis Kilat

- Kalau state hanya dipakai satu komponen, bagaimana sebaiknya disimpan?
- Bagaimana urutan pemakaian Context API yang benar?
- Mana yang merupakan nilai turunan (derived state) pada keranjang?
- Kenapa `CartProvider` diletakkan di `app/_layout.js`?

<!--
Kuis lisan 4 menit: tampilkan pertanyaan, minta kelas menjawab serempak atau mengangkat tangan,
lalu lanjut ke slide kunci. Jangan bocorkan jawaban di slide ini.

Keempat butir diambil dari bagian pilihan ganda Evaluasi Bab 9 (nomor 1, 3, 5, dan 8), jadi bisa
juga dipakai sebagai pemanasan sebelum soal uraian.
-->

---

<!-- _class: center -->

## Kunci Kuis Kilat

- State lokal dengan `useState` — hanya satu komponen yang memakainya
- `createContext` → `Provider` → `useContext` — wadah, penyedia, lalu pembaca
- `totalHarga` — dihitung dari `items`, jadi tidak perlu disimpan
- Agar setiap rute berada di dalam subtree provider dan bisa memanggil `useCart()`

<!--
Ulangi pembedaan yang paling sering tertukar: nilai turunan (dihitung) versus state (disimpan).

Kalau banyak yang salah di butir keempat, ulangi slide app/_layout.js dan diagram cakupan
provider sebelum menutup pertemuan.

Koreksi cepat untuk jawaban "supaya aplikasi lebih cepat": kecepatan bukan alasannya, cakupan
pemakaianlah alasannya.
-->

---

## Ringkasan

1. Mulai dari state lokal; angkat hanya ketika ada pemakai lain yang benar-benar membutuhkannya
2. Lifting state up menciptakan sumber kebenaran tunggal lewat props dan callback
3. Prop drilling yang menyakitkan adalah tanda untuk beralih ke Context API
4. Context API memakai `createContext`, `Provider`, dan `useContext`, dibungkus custom hook `useCart`
5. Nilai turunan dihitung, bukan disimpan; Zustand dan Redux untuk skala besar

> Keranjang di bab ini hidup di memori; membuatnya bertahan setelah aplikasi ditutup adalah materi Bab 11.

<!--
Jangan dibacakan. Minta mahasiswa memilih satu nomor dan menjelaskannya dengan kata-kata
sendiri; ini bekerja lebih baik daripada mengulang bacaan.

Pesan penutup bab: hierarki state lokal, lifting state up, Context API, lalu pustaka adalah
urutan kedisiplinan, bukan tangga gengsi.
-->

---

<!-- _class: compact -->

## Diskusi: Di Mana Keranjang Seharusnya Tinggal?

![w:1120](assets/diagrams/bab-09-state-management-11.svg)

**Pertanyaan**

- Di mana keranjang toko kampus sebaiknya disimpan, dan apa risikonya?
- Tanda apa di kode bahwa Context API sudah dipakai berlebihan?

**Yang dinilai**

- Ketepatan menghubungkan pilihan penyimpanan dengan jaringan dan perangkat
- Kemampuan mengenali gejala di kode, bukan sekadar mengutip teori

<!--
Dipotong ke gambar (diagram yang mengatakan ini):

> Rancangan state yang baik bertahan saat kebutuhan berubah: dari memori ke penyimpanan lokal, lalu ke server.

Gambar itulah kalimat tersebut beserta risiko di setiap panah: memori hilang saat aplikasi
ditutup, penyimpanan lokal tidak berpindah perangkat, dan server yang membuat kasir B bisa
membuka keranjang yang dimulai kasir A. Gambar itu di slide menggantikan kutipan karena tangga
di gambar memberi kosakata untuk diskusi — kelas bisa menunjuk satu tingkat, bukan berdebat
dalam gagasan abstrak. Ucapkan kalimat itu dengan suara saat menutup diskusi.

Beri 3 menit berpasangan, lalu tampung 2–3 jawaban. Jawaban kuat menyebut kombinasi:
keranjang lokal yang disinkronkan saat online.

Kalau jawaban berhenti di "pakai server saja", arahkan ke jaringan koperasi yang tidak stabil
dan perangkat kasirnya yang murah.

Ini juga saat yang tepat menyebut Refleksi 3: bagaimana menjelaskan keputusan teknis kepada
pemilik toko yang tidak paham teknologi.
-->

---

<!-- _class: compact -->

## Referensi

| Sumber | Link |
|---|---|
| Dokumentasi React (2026) — Context dan hook | react.dev |
| Dokumentasi React Native (2026) | reactnative.dev |
| Dokumentasi Expo (2026) | docs.expo.dev |
| Banks & Porcello, *Learning React* (2020) | O'Reilly Media |
| JavaScript, MDN Web Docs (2026) | developer.mozilla.org |

**Bacaan lanjutan:** Bab 4 — `useState` dan aturan hook · Bab 10–11 — data server dan penyimpanan lokal

**Versi teknologi:** Expo SDK 57 · React Native 0.86 · React 19.2 · Node.js ≥ 22

<!--
Rujukan lengkap ada di Lampiran D; istilah seperti Context API, state, dan hook dijelaskan di
Lampiran C (glosarium).

Ingatkan penanda sensitif versi: sintaks Zustand dan Redux Toolkit bisa berubah, jadi selalu
cocokkan dengan dokumentasi resmi sebelum dipakai sungguhan.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Siap ke Bab 10

**Tugas:** selesaikan Bab 8 dan Bab 9, termasuk fitur "Kosongkan Keranjang" dan skenario uji 2 Buku + 1 Tipe-X.

Pertemuan 10: Bab 10 — REST API (konsep dan GET) dengan server `backend/` buku. Kelompok Project Akhir mulai terbentuk pada pertemuan 9.

<!--
Tutup dengan satu kalimat: "Bab ini mengajari aplikasi mengingat data; bab berikutnya mengajari
aplikasi mengambil data dari tempat lain."

Sebutkan tenggat praktikum dan pengumpulan bukti tangkapan layar secara eksplisit, lalu kaitkan
dengan rubrik praktikum (Lampiran A): pemahaman konsep 15%, implementasi 25%, kualitas kode
15%, UI/UX 15%, debugging 10%, dokumentasi 20%.
-->
