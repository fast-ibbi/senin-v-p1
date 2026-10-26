---
marp: true
theme: academic
paginate: true
title: "Bab 4 — Dasar-Dasar React"
description: "Slide kuliah Pemrograman Mobile, pertemuan 4–5: konsep UI deklaratif, component dan JSX, props, state, event handling, render kondisional dan daftar, komposisi component, serta hook useState, useEffect, useMemo, dan useCallback."
author: "Dosen Mata Kuliah — Program Studi Sistem Informasi / Teknik Informatika"
footer: "Pemrograman Mobile · Bab 4 — Dasar-Dasar React"
size: 16:9
---

<!-- _class: lead -->
<!-- _paginate: skip -->
<!-- _footer: "" -->

# Bab 4 — Dasar-Dasar React

Component, JSX, props, state, dan hook · Pertemuan 4–5

<!--
Buka dengan menyambung pertemuan sebelumnya: Bab 3 sudah menyediakan alat bahasanya
(variabel, fungsi, array, objek, spread, map). Hari ini alat itu dipakai untuk membangun
antarmuka.

Pertanyaan pembuka: "Kalau data mahasiswa berubah, siapa yang seharusnya memperbarui
layar? Kode kita atau alatnya?" Tampung jawaban tanpa dikoreksi dulu, karena slide
`UI = f(state)` yang menjawabnya.
-->

---

## Tujuan Pembelajaran

Setelah bab ini, kamu bisa:

- Menjelaskan konsep UI deklaratif dan `UI = f(state)`
- Menulis JSX yang benar dan membedakan component dari elemen
- Menerapkan component yang dipakai ulang lewat props dan nilai default
- Membedakan props dari state dan memperbarui state tanpa mengubahnya langsung
- Menerapkan event, render kondisional, dan render daftar dengan `key` yang benar
- Menerapkan siklus hidup sederhana dengan `useEffect`, termasuk cleanup
- Mengevaluasi kapan `useMemo` dan `useCallback` benar-benar perlu

<!--
Bacakan verba tiap butir dengan tempo cepat, jangan dijelaskan satu per satu sekarang.
Tegaskan bahwa butir keempat yang paling sering diuji: hampir semua masalah pemula lahir
dari props dan state yang tertukar.

Butir terakhir juga sering disalahpahami: mahasiswa cenderung memakai useMemo di mana-mana
karena menganggapnya wajib. Tegaskan kata mengevaluasi.

Pertanyaan penuntun: "Butir keempat tentang apa, dan butir terakhir tentang apa?"
(Jawaban: keempat soal memperbarui state tanpa mengubahnya, terakhir soal menahan diri
supaya tidak mengoptimasi tanpa alasan.)

Kaitkan dengan penilaian: tujuan ini dinilai lewat Latihan Bab 4 dan Praktikum Bab 4
(rubrik praktikum, Lampiran A). Kuis 1 di pertemuan ini menguji materi JavaScript Bab 3,
bukan materi bab ini.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Bagian 1 — Pola Pikir, Component & Props

subbab 4.1 Konsep React · 4.2 Component dan JSX · 4.3 Props

<!--
Bagian ini konseptual dan paling menentukan. Kalau sisa waktu pertemuan 4 sempit, bagian
inilah yang harus utuh, karena subbab 4.4 dan seterusnya mengandaikan mahasiswa sudah
memegang `UI = f(state)`.

Sisa bab ini pindah ke pertemuan 5.
-->

---

## Kenapa React Perlu Ada?

![w:1120](assets/diagrams/bab-04-dasar-react-05.svg)

<!--
Analogi: imperatif itu seperti memberi sopir daftar belokan satu per satu, sedangkan
deklaratif itu seperti menulis alamat tujuan lalu membiarkan sopir memilih jalannya.

Tanya: "Aplikasi apa yang pernah kamu pakai, di mana data berubah di satu tempat tetapi
tidak berubah di tempat lain?" (Jawaban yang diharapkan: pengalaman nyata, misalnya jumlah
barang di ikon keranjang tidak cocok dengan isi keranjang.)

Salah paham yang sering muncul: deklaratif dianggap "tidak menulis logika". Yang berpindah
hanya tempat logikanya, bukan jumlahnya.
-->

---

## `UI = f(state)`: Tampilan adalah Fungsi dari State

![w:1120](assets/diagrams/bab-04-dasar-react-06.svg)

<!--
Sambungkan dengan istilah fungsi dari Bab 3: component menerima data lalu mengembalikan
tampilan, persis seperti fungsi yang menerima argumen lalu mengembalikan nilai.

Tegaskan bahwa reconciliation cukup dipahami sebagai gagasan, tidak perlu dihafal
detailnya: React menyimpan gambar lama, membandingkannya, lalu menerapkan bedanya.

Pertanyaan penuntun: "Kalau state tidak berubah tetapi layarnya berubah juga, apa yang
salah?" (Jawaban: ada yang mengubah data di luar state, misalnya isi array diubah
langsung.)
-->

---

## Component: Satuan Terkecil Antarmuka

![w:1120](assets/diagrams/bab-04-dasar-react-22.svg)

**Component** adalah fungsi JavaScript yang menerima data (props) dan mengembalikan gambaran tampilan.

- Aplikasi besar disusun dari puluhan component kecil
- React modern hanya mengenal **function component**, bukan class component

```jsx
export default function Sapaan() {
  return <p>Halo, mahasiswa!</p>;
}
```

<!--
Jelaskan bahwa component pada dasarnya fungsi biasa: bisa diberi nama, dipanggil, dan
dikembalikan oleh component lain. Mahasiswa sudah menulis fungsi seperti ini di Bab 3,
jadi hambatannya rendah.

Sebutkan bahwa `<p>` adalah elemen HTML biasa yang boleh ditulis langsung di dalam JSX;
di Bab 5 elemen seperti ini diganti component React Native seperti `<View>` dan `<Text>`.

Pertanyaan penuntun: "Apa bedanya component dan elemen?" (Jawaban: component adalah
fungsinya, elemen adalah hasil pemanggilannya, yaitu gambaran tampilan.)

Peringatan: component di atas belum muncul di layar sampai diimpor dan dipakai oleh
component induk. Itu dibahas di slide praktikum.

Sebutkan sekali bahwa `<p>Halo, mahasiswa!</p>` ditulis dengan JSX (JavaScript XML);
namanya dan aturannya baru dibahas di slide berikutnya.

Dipotong ke gambar (diagram yang mengatakan ini):
- `App.js` di akar project adalah **root component**: pintu masuk seluruh tampilan (Bab 2)

Path file yang isinya ada di bawah dipindah ke catatan ini supaya gambar dan kode muat di
satu layar:
`components/Sapaan.jsx`
-->

---

## Enam Aturan Menulis JSX

![w:1120](assets/diagrams/bab-04-dasar-react-07.svg)

<!--
Pastikan istilah JSX (JavaScript XML) mendarat lebih dulu: itu sintaks mirip markup yang
dikompilasi menjadi pemanggilan fungsi JavaScript.

Jangan dibaca berurutan. Mulai dari aturan yang paling sering membuat error di praktikum:
aturan camelCase dan aturan satu elemen akar.

Tunjukkan fragment dengan contoh cepat di editor: dua elemen bersaudara tanpa pembungkus
menghasilkan error, dan solusinya adalah tag pembuka kosong lalu tag penutup kosong.

Pertanyaan penuntun: "Kenapa di JSX tidak boleh menulis class seperti di HTML?" (Jawaban:
karena class adalah kata kunci yang sudah dipakai JavaScript; karena itu React memakai
className.)

Sebutkan bahwa di React untuk web semua elemen HTML boleh dipakai langsung, sedangkan
component React Native seperti View dan Text baru muncul di Bab 5.
-->

---

## Props: Data Turun dari Induk ke Anak

**Props** (properties) adalah cara data mengalir dari component induk ke component anak — ibarat parameter fungsi untuk sebuah component.

`components/KartuMahasiswa.jsx`

```jsx
export default function KartuMahasiswa({ mahasiswa }) {
  return (
    <div>
      <p>{mahasiswa.nama}</p>
      <p>NIM {mahasiswa.nim}</p>
    </div>
  );
}
```

<!--
Tegaskan satu hal: component anak tidak perlu tahu dari mana datanya datang. Pemakaiannya
di component induk terlihat seperti tag HTML biasa, misalnya
`<KartuMahasiswa mahasiswa={mahasiswaBudi} />`.

Kaitkan kurung kurawal di parameter dengan destructuring yang sudah dipelajari di Bab 3,
subbab 3.6: itu singkatan untuk membuka objek props.

Pertanyaan penuntun: "Kalau data yang sama ditampilkan sepuluh kali, berapa component yang
harus ditulis?" (Jawaban: satu, dipakai sepuluh kali dengan props berbeda.)

Peringatan: jangan menyebut props sebagai "variabel global"; props selalu mengalir satu
arah dari induk ke anak.
-->

---

## Props: Hanya Baca, Nilai Default, dan `children`

![w:1120](assets/diagrams/bab-04-dasar-react-08.svg)

<!--
Tekankan alasan sifat hanya baca: kalau anak boleh mengubah data milik induk, sumber
kebenaran datanya menjadi kabur. Perubahan data harus diminta kepada pemiliknya, yaitu
component induk atau setter yang diturunkan.

Jelaskan bahwa di React 19.2 nilai default cukup ditulis di parameter fungsi, seperti yang
sudah dipakai di Bab 3; defaultProps adalah cara lama.

Pertanyaan penuntun: "Kalau induk lupa mengirim props mahasiswa, apa yang terjadi?"
(Jawaban: component tetap jalan dengan nilai default, tidak ada error.)

Peringatan: pola children dibahas lagi di slide komposisi; jangan melompat ke state yang
diangkat ke induk, karena itu baru muncul di Bab 9.
-->

---

## State dan `useState`

![w:1120](assets/diagrams/bab-04-dasar-react-09.svg)

<!--
Analogi: props itu seperti paket dari luar yang isinya tidak boleh dibuka sendiri, state
itu seperti buku catatan pribadi yang pemiliknya boleh menulis ulang.

Tunjukkan di editor: tombol ditekan memanggil setter, lalu teks di layar berubah tanpa satu
pun perintah manipulasi tampilan ditulis.

Pertanyaan penuntun: "Mana yang boleh diubah component: props atau state?" (Jawaban: hanya
state miliknya sendiri, dan hanya lewat setter.)

Peringatan: useState tidak boleh dipanggil di dalam percabangan if atau di dalam
perulangan; aturan ini diulang di slide hook.
-->

---

## Aturan Emas: State Tidak Diubah, tetapi Diganti

![w:1120](assets/diagrams/bab-04-dasar-react-10.svg)

<!--
Slide ini paling layak diulang kalau waktu memungkinkan. Tunjukkan bahwa push mengubah isi
array yang sama, sehingga React tidak melihat state sebagai "berubah"; operator spread
membuat array baru sehingga React mendeteksi perubahannya.

Kaitkan dengan Bab 3: operator spread sudah dikuasai, jadi yang baru hanyalah kebiasaan
menyalin dulu sebelum diubah.

Pertanyaan penuntun: "Kalau datanya sudah benar tetapi layarnya tidak berubah, apa
tersangka pertamamu?" (Jawaban: state diubah langsung, bukan lewat setter.)

Peringatan: banyak mahasiswa menyimpulkan array tidak boleh diubah sama sekali. Yang
dilarang adalah mengubah state, bukan memakai operasi yang mengembalikan nilai baru.
-->

---

## Props dan State: Dua Sumber Data

![w:1120](assets/diagrams/bab-04-dasar-react-11.svg)

<!--
Jangan dibaca baris per baris. Bandingkan dua kolomnya lewat satu contoh: kategori program
dipilih pengguna sehingga menjadi state di App, sedangkan objek mahasiswa dikirim ke kartu
sehingga menjadi props.

Latih dengan pertanyaan cepat: "sedangMemuat itu props atau state?" (Jawaban: state,
karena dikelola dan diubah di dalam App sendiri.)

Peringatan: props tetap bisa memicu re-render, tetapi bukan anak yang mengubahnya; induk
yang mengirim nilai baru. Beda tipis ini sering tertukar di ujian.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Bagian 2 — Interaksi, Render & Komposisi

subbab 4.5 Event · 4.6 Render kondisional & daftar · 4.7 Komposisi · 4.8–4.9 Hook

<!--
Bagian ini inti praktikum dan paling padat. Kalau waktu pertemuan 5 mepet, pindahkan
subbab 4.9 (useMemo dan useCallback) ke sesi tanya jawab, karena sifatnya pengantar.

Semua kode yang dibahas di sini bertemu menjadi satu aplikasi kecil di slide praktikum.
-->

---

## Serahkan Fungsi, Bukan Hasil Pemanggilannya

![w:1120](assets/diagrams/bab-04-dasar-react-12.svg)

<!--
Inti slide ini satu kalimat: yang diserahkan ke onClick adalah fungsi itu sendiri, bukan
hasil pemanggilannya.

Kesalahan klasik yang harus ditunjukkan langsung di editor: menulis
`onClick={ubahTampilDetail()}` membuat fungsi berjalan saat render, sehingga tombol terlihat
tidak bekerja.

Jelaskan juga functional update di setDetailTampil: nilai baru dihitung dari nilai lama,
jadi aman walaupun pembaruan terjadi beberapa kali dalam satu batch.

Pertanyaan penuntun: "Bagaimana membawa data ke handler, misalnya nama program?"
(Jawaban: fungsi panah sebaris, misalnya
`onClick={() => ubahKategoriProdi(prodi)}`.)

Peringatan: `<button>` adalah elemen HTML biasa; padanannya di React Native adalah
Pressable (pengganti TouchableOpacity), yang baru dibahas di Bab 5.
-->

---

## Render Kondisional: Tiga Pola yang Cukup

![w:1120](assets/diagrams/bab-04-dasar-react-13.svg)

<!--
Tekankan bahwa ketiga pola ini memakai ekspresi JavaScript yang mengembalikan nilai truthy
dan falsy, materi Bab 3 subbab 3.2, bukan fitur baru milik React.

Tunjukkan satu state menggerakkan dua tampilan sekaligus: detailTampil menentukan teks
tombol dan memunculkan blok detail pada saat yang sama. Inilah contoh termurah untuk
menjelaskan `UI = f(state)`.

Pertanyaan penuntun: "Kalau nilainya 0 atau string kosong, apakah && masih aman?"
(Jawaban: hati-hati, karena 0 dan string kosong tetap nilai falsy yang bisa tercetak di
layar. Untuk kondisi seperti ini pakai ternary.)

Peringatan: kondisi kosong sering membuat mahasiswa menulis if di dalam JSX; ingatkan bahwa
yang dibutuhkan hanya ekspresi.
-->

---

## Render Daftar dengan `map`

![w:900](assets/diagrams/bab-04-dasar-react-14.svg)

`components/DaftarMahasiswa.jsx`

```jsx
{data.map((mahasiswa) => (
  <KartuMahasiswa key={mahasiswa.id} mahasiswa={mahasiswa} />
))}
```

<!--
Sambungkan dengan komposisi: render daftar dan component yang dipakai ulang adalah
pasangan yang tidak terpisah, karena map menghasilkan component yang sama berulang kali.

Perhatikan tempat menulis key: key ditulis pada elemen yang dihasilkan map, bukan di dalam
component KartuMahasiswa. Ini kesalahan yang paling sering.

Pertanyaan penuntun: "Kenapa data tidak boleh diubah di dalam map?" (Jawaban: karena map
sudah mengembalikan array baru; mengubah datanya justru melanggar aturan immutability.)

Peringatan: untuk daftar besar, jangan menyimpulkan map selalu cukup. FlatList dikenalkan
di Bab 5.
-->

---

## `key`: Unik, Stabil, Bukan Indeks

![w:1120](assets/diagrams/bab-04-dasar-react-15.svg)

<!--
Slide penutup rangkaian render daftar: tekankan kata stabil. Key bukan hanya unik, tetapi
juga tidak berubah antar-render.

Contoh yang paling meyakinkan: kartu yang detailnya terbuka berpindah ke kartu lain setelah
daftar difilter, karena React mengira elemen lama di indeks 2 adalah elemen baru di indeks
2.

Pertanyaan penuntun: "Kenapa Math.random() sebagai key justru lebih buruk daripada indeks?"
(Jawaban: key-nya berubah di setiap render, sehingga React membuang lalu membangun ulang
setiap elemen.)

Peringatan: key yang hilang tidak menghentikan aplikasi; peringatannya mudah diabaikan
justru karena aplikasi tetap jalan. Masalahnya baru muncul belakangan dan sulit dilacak.
-->

---

<!-- _class: center -->

## Apa yang Terjadi Jika…?

- Daftar lima mahasiswa memakai `key={index}`, lalu kamu filter per program?
- Satu kartu sedang terbuka detailnya, lalu daftar diurutkan ulang menurut nama?
- Dari mana React memberi tahu bahwa daftarmu bermasalah?

<!--
Skenario ini diambil dari praktikum bab ini. Minta mahasiswa menuliskan dugaan jawabannya di
kertas selama 2 menit sebelum slide berikutnya ditampilkan.

Jangan mengonfirmasi jawaban dari tempat duduk; cukup catat siapa yang menyebut kata
"bergeser" atau "tertukar", karena itu inti jawabannya.

Kalau kelas ragu, beri petunjuk: "React mencocokkan elemen berdasarkan apa?"
-->

---

<!-- _class: center -->

## Detail Menempel di Kartu yang Salah

- Indeks bergeser, React mencocokkan elemen lama dengan elemen yang salah
- State `detailTampil` kartu lain ikut terbuka — datanya benar, tampilannya keliru
- Peringatan di console: `Each child in a list should have a unique key prop`

> Perbaikannya: `key={mahasiswa.id}` — unik dan tidak berubah antar-render.

<!--
Tekankan bahwa gejalanya menipu: mahasiswa akan menyalahkan data mahasiswa yang tertukar,
padahal datanya benar dan yang keliru adalah pencocokan elemen oleh React.

Tunjukkan di editor: ubah key menjadi id, dan perilaku anehnya hilang tanpa mengubah satu
baris pun logika data.

Pertanyaan penuntun: "Kenapa React tidak membereskan masalah ini sendiri?" (Jawaban: React
tidak tahu identitas sebenarnya dari data; hanya pengembang yang tahu.)

Peringatan: jangan menyarankan key acak sebagai jalan pintas; itu memindahkan masalahnya,
bukan menghilangkannya.
-->

---

## Komposisi Component: Data Turun, State Tinggal

![w:1120](assets/diagrams/bab-04-dasar-react-02.svg)

<!--
Jelaskan arah panahnya sekali saja: data mengalir turun, sedangkan state berdiri di tempat
ia dideklarasikan. Jangan mengulang label yang sudah terbaca di layar.

Sebutkan pola children sebagai cara kedua menyerahkan tampilan: component induk menyiapkan
slot, pemakainya mengisi slot itu. Component KartuInfo di buku adalah contohnya.

Pertanyaan penuntun: "Kalau tombol di kartu Budi ditekan, apakah kartu Siti ikut terbuka?"
(Jawaban: tidak, karena detailTampil adalah state lokal di tiap kartu.)

Peringatan: jangan mengajak mahasiswa memecah component terlalu halus. Aturan praktis di
bab ini hanya dua: dipakai di lebih dari satu tempat, atau sudah terlalu panjang untuk
dipahami sekali lihat.
-->

---

## Dua Aturan Hook yang Tidak Boleh Dilanggar

![w:1120](assets/diagrams/bab-04-dasar-react-16.svg)

<!--
Tekankan alasan di balik aturan ini: React tidak menyimpan state berdasarkan nama variabel,
melainkan berdasarkan urutan pemanggilan. Kalau urutannya bergeser karena pemanggilan
berada di dalam percabangan, React membaca state yang salah.

Sebutkan bahwa ESLint di project Expo sudah memperingatkan saat aturan ini dilanggar, jadi
mahasiswa tidak perlu menghafalnya tanpa alat bantu.

Pertanyaan penuntun: "Kenapa useEffect di dalam if berbahaya?" (Jawaban: pada sebagian
render efeknya dipanggil dan pada sebagian lain tidak, sehingga urutan hook bergeser.)
-->

---

## `useEffect`: Efek Samping dan Cleanup

![w:1120](assets/diagrams/bab-04-dasar-react-17.svg)

<!--
Jelaskan dua argumen useEffect: fungsi efek dan array dependency. Fungsi efek berjalan
setelah component di-render, sedangkan array menentukan kapan ia dijalankan lagi.

Fungsi yang dikembalikan adalah cleanup: dipanggil saat component dilepas atau sebelum efek
berjalan lagi. Tanpa cleanup, timer terus berjalan dan bisa memperbarui state pada component
yang sudah tidak ada.

Sebutkan bahwa dalam mode pengembangan React sengaja menjalankan efek dua kali untuk
membantu menemukan efek yang tidak bersih; itu normal dan bukan kesalahan kode mahasiswa.

Pertanyaan penuntun: "Apa bedanya `[]`, `[dep]`, dan tanpa array sama sekali?" (Jawaban:
sekali saat mount, diulang saat dep berubah, dan di setiap render.)

Peringatan: efek ini hanya simulasi pemuatan data, bukan pengambilan data sungguhan. State
loading yang sebenarnya dibahas di Bab 10.
-->

---

## Siklus Hidup: Mount, Update, Unmount

![w:1120](assets/diagrams/bab-04-dasar-react-03.svg)

<!--
Ingatkan bahwa istilah mount dan unmount akan muncul lagi di siklus navigasi pada Bab 7,
jadi keduanya harus dipakai dengan makna yang konsisten.

Analogi sederhana: menyalakan lampu saat masuk ruangan, menyesuaikan terangnya saat keadaan
berubah, lalu mematikannya saat keluar ruangan.

Pertanyaan penuntun: "Kalau array dependency dihapus sama sekali, kapan efeknya berjalan?"
(Jawaban: di setiap render, hampir selalu tidak diinginkan, dan sering menjadi sumber
masalah performa.)

Peringatan: jangan menyamakan siklus hidup dengan cara kerja class component. Di React
modern semuanya dikelola lewat effect.
-->

---

## `useMemo` dan `useCallback`: Kapan Benar-Benar Perlu

![w:1120](assets/diagrams/bab-04-dasar-react-18.svg)

<!--
Tekankan kata terukur di kolom terakhir. Optimasi dilakukan karena ada bukti beban, bukan
karena kebiasaan atau karena sedang tren.

Jelaskan pembagian tugasnya dalam satu kalimat: useMemo menyimpan nilai, useCallback
menyimpan fungsi. Keduanya memakai array dependency yang bekerja sama seperti di useEffect.

Pertanyaan penuntun: "Kalau useMemo dipakai di setiap perhitungan, apa akibatnya?"
(Jawaban: bukan hanya tidak berguna, tetapi menambah pemakaian memori dan membuat kode
lebih sulit dibaca.)

Peringatan: praktikum bab ini memang memakai useMemo untuk filter dan rata-rata IPK sebagai
gambaran polanya; katakan terus terang bahwa pada data sekecil ini manfaatnya baru terasa
saat datanya membesar.
-->

---

## Satu Ketukan, Satu Re-render

![w:1120](assets/diagrams/bab-04-dasar-react-04.svg)

<!--
Slide ini merangkum bagian tengah bab. Minta mahasiswa menceritakan ulang rantai ini dengan
kalimatnya sendiri sebelum kamu menjelaskannya.

Uji dengan soal uraian di buku: jelaskan alur lengkap dari menekan tombol Tampilkan Detail
sampai blok detail muncul. Jawaban yang benar menyebut handler, setter, re-render, dan
render kondisional.

Pertanyaan penuntun: "Kenapa layar tidak bisa berubah tanpa setter?" (Jawaban: karena React
hanya tahu state berubah kalau setter dipanggil; perubahan langsung tidak terdeteksi.)
-->

---

## Studi Kasus: Data Akademik di BAAK

![w:1120](assets/diagrams/bab-04-dasar-react-23.svg)

Staf BAAK menjawab puluhan pertanyaan sehari dengan menyaring file spreadsheet secara manual — lambat dan rawan salah salin.

- Satu sumber kebenaran: data terpisah dari tampilan, tidak ada dua versi angka
- Tiap kartu berdiri sendiri, kesalahan di satu kartu tidak menular
- Rata-rata IPK dihitung otomatis dari data yang tampil, bukan diketik tangan
- Saat data datang dari server di Bab 10, susunan component tidak berubah

<!--
Ceritakan sebagai kisah kebutuhan pengguna, bukan sebagai daftar fitur. Tujuannya agar
mahasiswa melihat bahwa seluruh isi bab ini menutup satu masalah nyata.

Tegaskan dua hal: data yang terpisah dari tampilan membuat perpindahan ke server hampir
gratis, dan angka agregat yang dihitung otomatis tidak mungkin berselisih dengan daftar yang
sedang tampil.

Pertanyaan penuntun: "Apa yang berubah di component saat DATA_MAHASISWA diganti hasil
fetch?" (Jawaban: hampir tidak ada, hanya sumber datanya.)

Peringatan: kasus ini adalah pendahulu Aplikasi Manajemen Data Mahasiswa menuju Project
Akhir; jangan merancang fitur di luar lingkup bab ini.

Dipotong ke gambar (diagram yang mengatakan ini):
- Aplikasi menampilkan data mahasiswa secara **dinamis**: filter program dan ringkasan agregat
-->

---

<!-- _class: compact -->

## Kebiasaan Bab Ini Dipakai Sampai Bab Berapa

| Praktik di bab ini | Berlanjut ke |
|---|---|
| `KartuMahasiswa` untuk daftar mahasiswa | Bab 5: `FlatList` dan component native |
| State lokal untuk detail kartu | Bab 8: formulir dan controlled input |
| Data statis di dalam kode | Bab 10: `fetch` dan state loading |
| State di induk `App` | Bab 9: state diangkat ke induk |
| Filter dan rata-rata sebagai logika murni | Bab 14: pengujian fungsi |

<!--
Slide ini menjawab pertanyaan "kapan semua ini dipakai?". Setiap baris menghubungkan satu
keputusan di bab ini dengan bab tempat keputusan itu diuji atau diperluas.

Tekankan baris terakhir: logika agregat yang murni itulah yang nanti diuji otomatis, jadi
menjaga perhitungan di luar tampilan bukan sekadar kerapian.

Pertanyaan penuntun: "Kalau data mahasiswa nanti datang dari server, baris mana yang
berubah?" (Jawaban: baris ketiga, sumber datanya; component-nya tetap.)

Peringatan: state yang diangkat ke induk dan Context API adalah materi Bab 9. Di sini cukup
disebut sebagai kelanjutan, jangan dijelaskan lebih jauh.
-->

---

## Praktikum: Yang Dibangun Pertemuan Ini

![w:1120](assets/diagrams/bab-04-dasar-react-19.svg)

<!--
Sebutkan struktur folder minimalnya dengan suara keras sambil menunjuk gambar: `App.js` di
akar project, lalu folder `components` berisi `DaftarMahasiswa.js` dan `KartuMahasiswa.js`.

Ingatkan kenapa data statis diletakkan di luar component: DATA_MAHASISWA dan PILIHAN_PRODI
tidak perlu dibuat ulang di setiap render.

Pertanyaan penuntun: "Kenapa key tidak ditulis di dalam KartuMahasiswa?" (Jawaban: karena key
dibutuhkan pada elemen yang dihasilkan map, bukan di dalam component-nya.)

Peringatan: dua jam pertama biasanya habis untuk kegagalan lingkungan, bukan untuk logika.
Arahkan mahasiswa ke bagian Troubleshooting bab ini kalau aplikasi tidak mau jalan sebelum
mereka menduga-duga soal logika.
-->

---

## Kode Kunci: `KartuMahasiswa.js`

`kode/bab-04-dasar-react/components/KartuMahasiswa.js`

```jsx
export default function KartuMahasiswa({ mahasiswa }) {
  const [detailTampil, setDetailTampil] = useState(false);

  const ubahTampilDetail = () => {
    setDetailTampil((tampilSebelumnya) => !tampilSebelumnya);
  };
  return (
    <div className="kartu">
      {/* … rincian kartu: bagian kanan, tombol, dan blok detail … */}
      <p className="nama">{mahasiswa.nama}</p>
      <p className="nim">NIM {mahasiswa.nim}</p>
    </div>
  );
}
```

<!--
Kode di slide ini dipotong agar muat di layar; file lengkapnya ada di folder
kode/bab-04-dasar-react dan di dalam buku.

Tunjukkan tiga hal saja di kode: props mahasiswa masuk lewat parameter, state detailTampil
milik kartu itu sendiri, dan handler ubahTampilDetail diserahkan ke elemen tombol. Bagian
JSX lainnya ditandai elipsis dan tidak perlu dibacakan.

Pertanyaan penuntun: "Baris mana yang membuat tombol yang ditekan mengubah layar?"
(Jawaban: pemanggilan setDetailTampil di dalam handler; handler-nya sendiri hanya menerima
event.)

Peringatan: gaya tampilan (className dan CSS) serta layout sengaja tidak dibahas di sini,
karena topiknya baru muncul untuk React Native di Bab 5.
-->

---

## Praktikum: Ketika Aplikasi Tidak Mau Jalan

![w:1120](assets/diagrams/bab-04-dasar-react-20.svg)

<!--
Pilih dua baris yang paling sering terjadi di kelasmu, biasanya baris pertama dan kedua,
lalu bahas sampai tuntas.

Bacakan polanya: baca pesan error sebelum menduga. Peringatan key menyebut masalahnya dengan
tepat, sedangkan baris ketiga sering tidak menghasilkan pesan apa pun, jadi harus diperiksa
dari cara menulis nama component-nya.

Ada satu lagi yang tidak masuk tabel: "Maximum update depth exceeded", perulangan pembaruan
karena setter dipanggil di badan component atau di dalam efek tanpa dependency. Sebutkan
sebagai kasus lanjutan.

Peringatan: jangan menyarankan mahasiswa menambalnya dengan key acak atau mematikan
peringatan ESLint; itu menyembunyikan gejalanya, bukan sebabnya.
-->

---

## Yang Harus Teramati

Tiga hal yang dinilai di praktikum ini:

- **Component terpisah** — `KartuMahasiswa` dipakai ulang untuk setiap baris daftar
- **State lokal** — detail tiap kartu terbuka sendiri, tidak mengganggu kartu lain
- **`key` yang benar** — pakai `mahasiswa.id`, bukan indeks urutan

> Bukti yang bisa diperiksa, bukan kesan: "detail kartu Budi tetap terbuka setelah daftar difilter" lebih kuat daripada "aplikasinya jalan".

<!--
Tiga hal inilah yang dinilai di praktikum, jadi bacakan perlahan. Yang paling sering hilang
adalah butir ketiga: mahasiswa menulis kesan, bukan pengamatan.

Beri satu contoh buruk dan satu contoh baik di papan tulis, lalu minta mereka menilai mana
yang bisa diperiksa ulang oleh orang lain.

Kalau waktu memungkinkan, minta satu mahasiswa membuka aplikasinya di depan kelas dan
menunjukkan bukti untuk ketiga butir ini.
-->

---

<!-- _class: center -->

## Kuis Kilat

- Apa beda props dan state, dan mana yang memicu re-render?
- Kita menulis `onClick={simpanData()}`, apa yang terjadi saat aplikasi jalan?
- Kapan `useEffect(() => {...}, [])` berjalan, dan kapan cleanup-nya berjalan?
- Kapan `useMemo` benar-benar diperlukan?

<!--
Kuis lisan 5 menit: tampilkan pertanyaan, minta mahasiswa menjawab berpasangan, lalu lanjut
ke slide kunci. Jangan bocorkan jawaban di slide ini.

Kalau lebih dari separuh kelas salah di pertanyaan kedua, ulangi demonstrasi onClick di
editor sebelum menutup pertemuan.
-->

---

<!-- _class: center -->

## Kunci Kuis Kilat

- Props hanya dibaca anak dan tidak boleh diubahnya; state diubah lewat setter — keduanya memicu re-render, bedanya siapa pemiliknya dan siapa yang boleh mengubahnya
- `onClick={simpanData()}` memanggil fungsi saat render, bukan saat tombol ditekan
- `useEffect(fn, [])` berjalan sekali saat mount; cleanup saat unmount atau sebelum efek jalan lagi
- `useMemo` perlu saat perhitungan terukur mahal; `useCallback` saat fungsi dikirim ke anak berbalut `React.memo`

<!--
Ulangi pembedaan yang paling sering tertukar: onClick menerima referensi fungsi, bukan hasil
pemanggilannya.

Tegaskan bahwa jawaban pertama sengaja menegaskan keduanya memicu re-render, supaya
mahasiswa tidak menyimpulkan hanya state yang bisa mengubah layar.

Kalau banyak yang salah di pertanyaan terakhir, ingatkan kembali slide optimasi yang
terlalu dini lalu hentikan di situ.
-->

---

## Ringkasan

![w:1120](assets/diagrams/bab-04-dasar-react-21.svg)

<!--
Jangan dibacakan. Minta mahasiswa memilih satu nomor dan menjelaskannya dengan kata-kata
sendiri; ini bekerja jauh lebih baik daripada mengulang bacaan.

Tekankan nomor 1 dan 4 sebagai dua kalimat yang paling layak diingat dari bab ini.

Pesan penutup: mulai sekarang, setiap masalah "data berubah tetapi tampilan tidak" punya
daftar periksa sendiri, yaitu setter, immutability, dan key.
-->

---

## Diskusi: Data Berubah, Tampilan Tidak Berubah

- Apa yang berubah dari gambaranmu tentang cara layar diperbarui?
- Kenapa masalah "data sudah benar, tampilan tidak ikut" sulit dilacak?
- Istilah yang harus tepat: props, state, re-render, cleanup, `useMemo`

> Soal pemahaman, latihan, analisis, dan tantangan bab ini menjadi bahan Latihan Bab 4, dinilai lewat rubrik praktikum di Lampiran A.

<!--
Beri tiga menit berpasangan, lalu tampung dua sampai tiga jawaban. Pertanyaan pertama
bersifat reflektif, jadi tidak ada jawaban yang salah; yang dinilai adalah keberanian
mengakui dugaan lamanya.

Pertanyaan kedua menghubungkan refleksi dengan praktik: masalah itu sulit dilacak karena
datanya memang benar, sehingga pemeriksaan biasanya berhenti di data dan tidak pernah sampai
ke mekanisme re-render.

Minta mahasiswa menuliskan jawabannya secara singkat, karena bagian tantangan Bab 4 meminta
perbandingan pola state lokal dengan state di induk, dan itulah pintu masuk ke Bab 9.
-->

---

## Referensi

| Sumber | Link |
|---|---|
| Dokumentasi React (2026) | react.dev |
| Dokumentasi React Native (2026) | reactnative.dev |
| Dokumentasi Expo (2026) | docs.expo.dev |
| JavaScript, MDN Web Docs (2026) | developer.mozilla.org |
| Dokumentasi Node.js (2026) | nodejs.org |

**Bacaan lanjutan:** Bab 5 — Dasar-Dasar React Native

**Versi teknologi:** Expo SDK 57 · React Native 0.86 · React 19.2 · Node.js ≥ 22

<!--
Rujukan lengkap ada di Lampiran D. Glosarium Lampiran C berisi 60 entri (misalnya Hook,
Props, State, dan JSX); istilah reconciliation dan immutability dijelaskan di slide
`UI = f(state)` dan slide aturan emas, dengan padanan glosarium rekonsiliasi/pencocokan dan
ketidakberubahan.

Sumber utama bab ini tetap dokumentasi resmi di react.dev, bukan blog atau jawaban forum
yang mungkin sudah usang untuk React 19.2.

Ingatkan bahwa versi teknologi yang dipakai buku ini dipatok ke Expo SDK 57, React Native
0.86, React 19.2, dan Node.js LTS minimal 22.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Siap ke Bab 5

**Tugas:** selesaikan Praktikum 4 — component `KartuMahasiswa` yang dipakai ulang dan daftar mahasiswa statis — plus Latihan Bab 4.

Pertemuan berikutnya: component tampilan React Native — `View`, `Text`, `FlatList`, dan Flexbox.

<!--
Tutup dengan satu kalimat: "Hari ini kita belajar memasak bahannya; Bab 5 mengajarkan cara
menatanya di piring."

Sebutkan tenggat Latihan Bab 4 secara eksplisit, lalu ulangi bahwa praktikum dinilai dengan
rubrik praktikum di Lampiran A: pemahaman konsep 15%, implementasi 25%, kualitas kode 15%,
UI/UX 15%, debugging 10%, dan dokumentasi 20%.
-->
