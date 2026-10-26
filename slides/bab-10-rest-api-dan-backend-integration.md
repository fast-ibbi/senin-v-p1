---
marp: true
theme: academic
paginate: true
title: "Bab 10 — REST API dan Integrasi Backend"
description: "Kuliah Pemrograman Mobile, pertemuan 10–11: arsitektur client–server, HTTP, REST, JSON, metode GET/POST/PUT/PATCH/DELETE, status code, fetch, tiga state antarmuka, base URL, pemisahan api/ dan screens/, serta pengantar autentikasi API."
author: "Dosen Mata Kuliah — Program Studi Sistem Informasi / Teknik Informatika"
footer: "Pemrograman Mobile · Bab 10 — REST API dan Integrasi Backend"
size: 16:9

---

<!-- _class: lead -->
<!-- _paginate: skip -->
<!-- _footer: "" -->

# Bab 10 — REST API dan Integrasi Backend

Dari data statis ke data di server · Pertemuan 10–11 · Sub-CPMK 5.1 & 5.2

<!--
Buka dengan satu kalimat: "Sembilan pertemuan data aplikasimu adalah data yang kamu ketik
sendiri. Hari ini data itu pindah ke mesin lain, dan aplikasimu harus belajar memintanya
dengan sopan."

Pertanyaan pembuka: "Siapa yang pernah melihat pesan gagal memuat data di aplikasi dan tidak
tahu harus berbuat apa?" Tampung jawabannya, lalu bandingkan di akhir pertemuan saat tiga
state antarmuka dibahas.
-->

---

## Tujuan Pembelajaran

Setelah bab ini, kamu bisa:

- Menjelaskan arsitektur client–server dan peran API di dalamnya
- Mengidentifikasi peran HTTP, REST, dan JSON dalam pertukaran data
- Menganalisis pemilihan metode HTTP untuk setiap operasi data
- Menafsirkan status code respons server, baik sukses maupun gagal
- Menerapkan `fetch` dengan header `Content-Type` dan serialisasi JSON
- Merancang tiga state antarmuka: loading, error, dan empty state
- Mengintegrasikan aplikasi dengan server `backend/` bawaan buku

> **API** (*Application Programming Interface*) — antarmuka pemrograman aplikasi: perantara antara aplikasi dan server.

<!--
Bacakan hanya kata kerjanya, lalu tegaskan bahwa empat butir pertama adalah isi Kuis 2 (materi
HTTP dan REST API) menurut RPS pertemuan 10.

Butir 1–4 dipakai lagi di Bab 13: kemampuan membaca status code dan header adalah bekal untuk
menangani token autentikasi.

Butir 5–7 adalah inti praktikum pertemuan 11: CRUD penuh dengan pengalaman pengguna yang
jujur.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Bagian 1 — Konsep: Client, Server & HTTP

subbab 10.1 Client–Server · 10.2 HTTP, REST, JSON · 10.3 Metode HTTP · 10.4 Status Code

<!--
Bagian ini konseptual dan menjadi bahan Kuis 2. Kalau waktu pertemuan menipis, riwayat REST
(SOAP, GraphQL) di subbab 10.2 boleh dipadatkan, tetapi tabel metode HTTP dan kelompok status
code tidak boleh dilewati.

Materi ini dinilai lewat Kuis 2 (HTTP/REST, minggu 10 — RPS) dan menjadi bahasa dasar integrasi
API di Project Akhir.
-->

---

## Data Statis Tidak Pernah Tahu IPK Sudah Berubah

**Data statis (Bab 6–8)** — ditulis di dalam kode, sama untuk semua pengguna

**Data dinamis (kebutuhan sistem informasi)** — mahasiswa baru bertambah, IPK diperbarui, data dihapus

![w:1120](assets/diagrams/bab-10-rest-api-dan-backend-integration-07.svg)

> Pertanyaan utamanya bukan "di mana data disimpan", melainkan "siapa sumber kebenarannya".

<!--
Mulai dari yang sudah mereka punya: buka `data/mahasiswa.js` (Bab 7) dan
`app/(app)/mahasiswa/index.js` — daftar lima mahasiswa masih ditulis sebagai konstanta di dalam
file, bukan diambil dari server.

Pertanyaan penuntun: "Kalau IPK Budi diperbarui di kantor akademik, berapa lama sampai terlihat
di aplikasi?" (Jawaban: tidak pernah, karena aplikasi memegang salinannya sendiri.)

Dipotong ke gambar (diagram yang mengatakan ini):
- Berubah hanya saat kode diubah lalu aplikasi dibangun ulang
- Harus sama di setiap perangkat, sepanjang waktu
-->

---

## Dua Program Terpisah: Satu Meminta, Satu Menyimpan

**Client–server** memisahkan pihak yang meminta layanan dari pihak yang menyediakannya.

- **Client** — aplikasi React Native Expo yang berjalan di HP
- **Server** — program Express di folder `backend/`, port 3000

![w:1120](assets/diagrams/bab-10-rest-api-dan-backend-integration-08.svg)

<!--
Pakai analogi restoran di subbab 10.1: kamu memesan lewat pelayan, dapur mengerjakannya, dan
kamu tidak perlu tahu cara dapur bekerja. Pelayannya adalah API.

Peringatan salah paham: mahasiswa sering mengira server adalah "bagian dari aplikasi". Tegaskan
bahwa server adalah program terpisah yang harus dijalankan sendiri dan bisa mati sendiri.

Dipotong ke gambar (diagram yang mengatakan ini):
- Menyusun permintaan dan menampilkan hasilnya
- Menyimpan, mengelola, dan menjaga data
-->

---

<!-- _class: compact -->

## Satu Sumber Kebenaran Ditukar dengan Ketergantungan Jaringan

| Sisi | Yang didapat | Yang dibayar |
|---|---|---|
| **Sumber data** | Satu sumber kebenaran bersama | Server jadi titik gagal tunggal |
| **Keamanan** | Data sensitif tetap di server | Autentikasi dan kontrol akses wajib |
| **Pembaruan** | Aturan bisnis berubah tanpa instal ulang | Setiap perubahan data lewat API |
| **Jaringan** | Data konsisten di tiap perangkat | Bergantung jaringan, ada latensi |

> Bab 11 lahir dari baris terakhir tabel ini: penyimpanan lokal menjawabnya.

<!--
Tekankan pola pikir trade-off yang sama seperti Bab 1: bukan "server lebih baik", melainkan
"server membeli konsistensi dengan jaringan".

Pertanyaan penuntun: "Baris mana dari tabel ini yang akan menjadi masalah di kampus dengan
Wi-Fi tidak stabil?" (Jawaban: baris jaringan, dan jawaban itulah yang memotivasi Bab 11.)
-->

---

## HTTP: Satu Permintaan, Satu Tanggapan

**HTTP** (*Hypertext Transfer Protocol*) adalah protokol pertukaran data antara client dan server.

![w:1120](assets/diagrams/bab-10-rest-api-dan-backend-integration-02.svg)

<!--
Pakai analogi pengajuan formulir: metode dan URL adalah maksud dan alamat tujuan, headers
adalah keterangan, body adalah lampiran, dan status code adalah stempel hasil di lembar balasan.

Tanya: "Pada contoh di bab ini, dari mana kita tahu isi pesannya berformat JSON?" (Jawaban: dari
header Content-Type.)
-->

---

<!-- _class: compact -->

## REST Memandang Data sebagai Resource Beralamat

**REST** adalah gaya arsitektur API untuk aplikasi mobile; tiap permintaan bersifat **stateless**.

- **Resource** — data dipandang sebagai sumber daya: mahasiswa, mata kuliah, prodi
- **Endpoint** — alamat unik tiap resource, misalnya `GET /api/mahasiswa`
- **Stateless** — tiap permintaan berdiri sendiri, membawa semua informasinya
- Metode per operasi: baca GET, tambah POST, ubah PUT/PATCH, hapus DELETE

![w:1120](assets/diagrams/bab-10-rest-api-dan-backend-integration-09.svg)

> Koleksi `mahasiswa` contoh netral; praktikum memakai `krs` — Bagian 2.

<!--
Sebutkan sekali bahwa REST adalah singkatan dari *Representational State Transfer*, lalu
langsung ke tiga istilah di butir: resource, endpoint, dan stateless.

Tekankan dua alamat yang mirip tetapi berbeda: `GET /api/mahasiswa` meminta koleksi, sedangkan
`GET /api/mahasiswa/1` meminta satu anggota koleksi. Tertukar keduanya menghasilkan error 404
yang membingungkan.

Sebutkan singkat bahwa alternatif seperti SOAP berbasis XML pernah mendominasi dan GraphQL
menawarkan kebebasan memilih field; REST dipelajari lebih dulu karena paling sederhana dan
paling banyak dipakai industri.

Dipotong ke catatan (prosa; slide butuh tempatnya): tiap permintaan membawa semua informasi yang
dibutuhkan server, sehingga server mudah ditambah kapasitasnya dan tiap permintaan bisa disimpan
sementara (cache).
-->

---

<!-- _class: compact -->

## JSON: Objek JavaScript yang Dikirim sebagai Teks

**JSON** (*JavaScript Object Notation*) — format teks untuk bertukar data REST.

```json
{
  "id": 1,
  "nim": "2201001",
  "nama": "Budi Santoso",
  "prodi": "Sistem Informasi",
  "angkatan": 2022,
  "ipk": 3.45,
  "email": "budi.santoso@students.univ.ac.id",
  "telepon": "081234567890"
}
```

> JSON adalah bahasa ibu JavaScript: objek diubah dengan `JSON.stringify` dan diurai kembali dengan `response.json()`.

<!--
Tunjukkan bahwa field di JSON ini persis sama dengan dataset baku buku di Bab 4 sampai Bab 8,
supaya mahasiswa mengenali datanya sendiri.

Pertanyaan penuntun: "Kenapa nilai ipk tanpa tanda kutip, sedangkan nim bertanda kutip?"
(Jawaban: ipk angka, nim teks; salah tipe seperti ini membuat server menjawab 400.)
-->

---

<!-- _class: compact -->

## Metode HTTP Sudah Punya Arti yang Disepakati

**CRUD** (*Create, Read, Update, Delete*) — membuat, membaca, mengubah, menghapus.

| Metode | Arti | Operasi | Endpoint | Idempoten? |
|---|---|---|---|---|
| GET | Membaca data | Read | `GET /api/mahasiswa` | Ya |
| POST | Membuat data | Create | `POST /api/mahasiswa` | Tidak |
| PUT | Ganti seluruh data | Update | `PUT /api/mahasiswa/1` | Ya |
| PATCH | Ubah sebagian data | Update | `PATCH /api/mahasiswa/1` | Ya |
| DELETE | Menghapus data | Delete | `DELETE /api/mahasiswa/1` | Ya |

> Server buku memakai PUT agar sederhana; PATCH lebih hemat bandwidth saat hanya satu field berubah.

<!--
Jelaskan idempoten dengan bahasa sehari-hari: "dilakukan seratus kali, hasilnya sama dengan
sekali". GET dan DELETE memenuhi itu, POST tidak.

Peringatan penting sebelum praktikum: jangan pernah memetakan operasi hapus ke GET, karena satu
link atau satu pemuatan halaman bisa menghapus data tanpa sengaja.
-->

---

<!-- _class: compact -->

## Angka Pertama Status Code Sudah Menjawab Siapa yang Salah

| Kelompok | Arti | Contoh |
|---|---|---|
| **1xx** | Informasi, sedang diproses | 100 Continue |
| **2xx** | Sukses | 200, 201, 204 |
| **3xx** | Pengalihan | 301, 304 |
| **4xx** | Kesalahan di sisi client | 400, 401, 404 |
| **5xx** | Kesalahan di sisi server | 500, 503 |

> Status code adalah bahasa bersama industri: siapa pun yang membaca log langsung tahu apa yang terjadi.

<!--
Minta mahasiswa menebak arti kode yang pernah mereka lihat di browser (misalnya 404) sebelum
tabelnya dibuka.

Ajarkan cara membaca angka pertamanya saja: 4 berarti "permintaanmu yang bermasalah", 5 berarti
"servernya yang bermasalah". Pembedaan itu yang menentukan siapa yang harus memperbaiki.
-->

---

<!-- _class: compact -->

## Enam Kode yang Akan Sering Kamu Temui

| Kode | Arti | Muncul saat |
|---|---|---|
| **200** | OK | GET atau PUT berhasil |
| **201** | Created | POST berhasil membuat resource baru |
| **204** | No Content | DELETE berhasil, tanpa isi respons |
| **400** | Bad Request | Body bukan JSON sah atau field wajib kosong |
| **401** | Unauthorized | Token tidak ada, salah, atau kedaluwarsa |
| **404** | `Not Found` | Resource tidak ada, misalnya `GET /api/mahasiswa/999` |

> Di luar tabel: **500 Internal Server Error** berarti server sendiri yang gagal, bukan client.

<!--
Hubungkan tiap baris dengan apa yang mereka lakukan di praktikum: 400 muncul saat Content-Type
terlupa, 404 muncul saat alamat endpoint salah ketik, dan 204 muncul setelah penghapusan
berhasil.

Pertanyaan penuntun: "Server berjalan normal tetapi data mahasiswa dengan id 999 tidak ada. Kode
apa yang seharusnya dijawab server?" (Jawaban: 404, bukan 500.)
-->

---

## Satu Pertukaran HTTP Dibaca dari Atas ke Bawah

`POST /api/mahasiswa` — menambah mahasiswa dari formulir

```http
POST /api/mahasiswa HTTP/1.1
Host: 10.0.2.2:3000
Content-Type: application/json

{ "nim": "2201001", "nama": "Budi Santoso", "prodi": "Sistem Informasi",
  "angkatan": 2022, "ipk": 3.45,
  "email": "budi.santoso@students.univ.ac.id", "telepon": "081234567890" }

HTTP/1.1 201 Created
Content-Type: application/json

{ "id": 1, "nim": "2201001", "nama": "Budi Santoso", … }
```

Tiga hal dibaca dari contoh ini: header membawa metadata, body membawa data, dan status code menyatakan hasil.

<!--
Bacakan dari atas ke bawah seperti membaca kuitansi: baris pembuka menyebut metode dan
alamatnya, headers menjelaskan jenis isinya, blok pertama adalah yang dikirim aplikasi, blok
kedua adalah jawaban server.

Tunjukkan bahwa respons hampir sama dengan permintaan, dan satu-satunya tambahan penting adalah
`id` yang diterbitkan server. Itulah bukti data benar-benar tersimpan.
-->

---

<!-- _class: center -->

## Apa yang Terjadi Jika…?

- Tombol **Simpan** ditekan dua kali sebelum respons datang?
- Data dihapus lewat permintaan `GET`?
- Permintaan POST dikirim tanpa header `Content-Type: application/json`?

<!--
Bahas berurutan, satu jawaban per pertanyaan, dan tampung dugaan mahasiswa lebih dulu: POST yang
terkirim dua kali menghasilkan dua data; GET yang mengubah keadaan berbahaya karena satu link
pratinjau bisa memicunya; tanpa header, server menerima body yang tidak dikenali dan umumnya
menjawab 400.

Hubungkan jawaban pertama dengan solusi praktikum: tombol Simpan dinonaktifkan selama proses
berjalan.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Bagian 2 — Praktik: fetch, Tiga State UI & CRUD

subbab 10.5 fetch · 10.6 Loading, Error, Empty State · 10.7 Studi Kasus REST · 10.8 Autentikasi

<!--
Bagian ini memakan waktu praktikum paling banyak. Kalau waktu tersisa sedikit, prioritaskan
subbab 10.5 dan 10.6; subbab 10.8 cukup dibacakan sebagai jembatan ke Bab 13.

Ingatkan bahwa folder `backend/` disediakan repo buku dan harus dijalankan lebih dulu sebelum
aplikasi diuji.
-->

---

<!-- _class: compact -->

## Membaca Data dengan GET: Tiga Langkah

`kode/bab-10-rest-api-dan-backend-integration/api/krs.js` — membaca KRS yang tersimpan di server

```js
const BASE_URL = 'http://10.0.2.2:3000';

async function ambilKrs(nim) {
  const response = await fetch(`${BASE_URL}/api/krs?nim=${nim}`); // 1. kirim GET
  if (!response.ok) {                                             // 2. periksa status
    throw new Error(`Permintaan gagal (HTTP ${response.status})`);
  }
  const json = await response.json();                             // 3. urai JSON
  return { daftar: json.data, totalSks: json.totalSks };
}
```

> `fetch` adalah fungsi bawaan JavaScript: tidak ada paket yang perlu dipasang, dan di aplikasi Expo ia langsung tersedia.

<!--
Telusuri tiga langkah di komentar kode: kirim, periksa, urai. Tegaskan bahwa `response.ok` hanya
bernilai benar untuk status 2xx, jadi tidak perlu membandingkan status satu per satu.

Sebutkan satu jebakan: sebagian server membungkus daftar di properti `data`, sebagian mengirim
array langsung. Kode buku menormalkan keduanya dengan `Array.isArray(json) ? json : json.data`.
-->

---

<!-- _class: compact -->

## Menambah Data dengan POST Butuh Tiga Opsi

```js
async function simpanKrs({ nim, kode, kelas = 'A' }) {
  const response = await fetch(`${BASE_URL}/api/krs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nim, kode, kelas }),
  });
  if (!response.ok) {
    // Server menjawab 409 bila mata kuliah sudah ada atau kuota penuh,
    // 422 bila batas SKS terlampaui — pesannya ikut dikirim di body.
    const galat = await response.json().catch(() => ({}));
    throw new Error(galat.pesan ?? `HTTP ${response.status}`);
  }
  return await response.json();
}
```

> `api/krs.js` — nilainya data baru lengkap dengan `id` dari server.

<!--
Jelaskan tiga opsi itu berpasangan dengan pertanyaan: method mengubah sifat permintaan, headers
memberi tahu jenis isinya, body membawa datanya. Body HTTP hanya memuat teks, itulah sebabnya
`JSON.stringify` wajib dipakai.

Pertanyaan penuntun: "Apa yang terjadi kalau header Content-Type salah tulis?" (Jawaban: server
menolak atau salah membaca body, umumnya 400 Bad Request.)
-->

---

<!-- _class: compact -->

## Menghapus Data: Respons Sukses Bisa Kosong

`kode/bab-10-rest-api-dan-backend-integration/api/krs.js` — membatalkan satu baris KRS

```js
async function batalkanKrs(id) {
  const response = await fetch(`${BASE_URL}/api/krs/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json(); // server ini menjawab 200 + { pesan, id }
}
```

> Server boleh menjawab `204 No Content` dengan body kosong, dan `response.json()` pada respons itu melempar error. Periksa status atau panjang body lebih dulu.

<!--
Ini slide salah paham yang paling sering membuat kode mahasiswa gagal di praktikum hapus data.
Tunjukkan bahwa ada server yang memang tidak mengirim isi setelah sukses, sehingga body respons
harus diperiksa lebih dulu.

Tanya: "Kalau kita hanya perlu tahu berhasil atau tidak, nilai kembalian apa yang paling masuk
akal?" (Jawaban: nilai boolean, seperti di kode buku.)
-->

---

## fetch Tidak Melempar Error saat Server Menjawab 500

**Yang tidak dilakukan fetch**

- Tidak ada error otomatis saat server menjawab 500

**Yang harus kamu lakukan**

- Menangkap kegagalan jaringan dengan `try/catch` di pemanggil

![w:1120](assets/diagrams/bab-10-rest-api-dan-backend-integration-10.svg)

<!--
Beri contoh kegagalan jaringan yang mereka kenali: server belum dijalankan sehingga muncul
`TypeError: Network request failed`. Bedakan dengan tegas: kegagalan jaringan dilempar fetch,
kegagalan status code harus kamu tangkap sendiri.

Ulangi sekali lagi — kesalahan ini dan kesalahan base URL adalah dua sumber kegagalan yang
paling sering muncul di praktikum.

Dipotong ke gambar (diagram yang mengatakan ini):
- Status 4xx dan 5xx tetap dianggap permintaan berhasil
- Periksa `response.ok` lalu lempar `Error` sendiri

Dipotong ke catatan (prosa; gambar butuh tempatnya): Axios, alternatifnya, melempar error HTTP
otomatis dan punya interceptor; buku ini memakai fetch secara konsisten supaya konsepnya tetap
terlihat.
-->

---

## Tiga State Antarmuka Menjawab Dua Pertanyaan Pengguna

![w:1120](assets/diagrams/bab-10-rest-api-dan-backend-integration-03.svg)

<!--
Gambarkan percabangan ini sebagai pertanyaan jujur kepada pengguna: "sedang apa, dan apa yang
bisa saya lakukan sekarang?"

Ingatkan bahwa `ActivityIndicator` sudah dikenal sejak Bab 5, jadi tidak ada komponen baru yang
perlu dipelajari di sini.
-->

---

<!-- _class: compact -->

## Blok `finally` Menyelamatkan Layar dari Berputar Selamanya

```js
const [data, setData] = useState(null);
const [memuat, setMemuat] = useState(true);
const [galat, setGalat] = useState(null);

async function muatUlang() {
  setMemuat(true);
  try {
    setData(await pemuat());   // pemuat = () => ambilKrs(nim)
    setGalat(null);
  } catch (e) {
    setGalat({ kode: e.kode, pesan: e.message }); // pesan untuk developer
  } finally {
    setMemuat(false);           // selalu berjalan, sukses maupun gagal
  }
}
```

<!--
Berkas: `hooks/useMuat.js` (disederhanakan), pola `try/catch/finally`.

Tekankan alasan memilih blok `finally`: kalau `setMemuat(false)` diletakkan di dalam blok `try`,
layar berputar selamanya setiap kali permintaan gagal.

Versi di file praktikum membungkus fungsi ini dengan `useCallback` (syarat `useFocusEffect`,
lihat subbab 7.7) dan juga menjalankan `setMemuatUlang(false)` di blok `finally`; slide ini hanya
menonjolkan polanya.

Peringatan salah paham: menampilkan `e.message` mentah kepada pengguna membuat mereka panik.
Pesan untuk pengguna ditulis ramah, sedangkan detail teknis tetap dicatat ke console.
-->

---

<!-- _class: compact -->

## Daftar Kosong Bukan Berarti Aplikasi Rusak

- Beri ajakan bertindak, misalnya "Belum ada data mahasiswa. Tambahkan lewat tombol Tambah."
- **Pull-to-refresh** memakai `RefreshControl` di `FlatList`: tarik ke bawah untuk memuat ulang

![w:1120](assets/diagrams/bab-10-rest-api-dan-backend-integration-11.svg)

> Pesan untuk pengguna: bahasa manusia; detail teknis: `console.error`.

<!--
Tarik garis tegas antara dua keadaan yang sering tertukar: daftar kosong karena datanya memang
belum ada, dan daftar kosong karena permintaannya gagal. Keduanya butuh pesan berbeda.

Minta mahasiswa menyebut satu aplikasi favorit yang tetap enak dipakai saat datanya kosong, lalu
minta mereka menyebut alasannya.

Dipotong ke gambar (diagram yang mengatakan ini):
- **Empty state** muncul saat permintaan berhasil tetapi daftarnya memang kosong
- Layar kosong bukan berarti aplikasi rusak: beri jalan keluar, bukan jalan buntu
-->

---

## Base URL: Alamat Server Dilihat dari Tempat Aplikasi Berdiri

| Aplikasi berjalan di | Base URL yang benar | Alasannya |
|---|---|---|
| Emulator Android | `http://10.0.2.2:3000` | Alias khusus ke komputer host |
| HP fisik | `http://<IP-LAN-komputer>:3000` | HP adalah mesin terpisah di Wi-Fi yang sama |
| iOS Simulator | `http://localhost:3000` | Simulator berbagi jaringan dengan Mac |

> Prinsipnya: base URL menunjuk mesin tempat server berjalan, dilihat dari sisi mesin yang menjalankan aplikasi.

<!--
Ulangi prinsip di kutipan sebagai satu kalimat hafalan: "alamat server dilihat dari tempat
aplikasi berdiri".

Sebutkan solusi praktisnya: simpan base URL di satu konstanta dan tulis tiga pilihan itu sebagai
komentar di atasnya, supaya kesalahan hanya perlu diperbaiki di satu tempat.

Peringatan: nomor IP LAN setiap komputer berbeda; cari lewat pengaturan jaringan atau perintah
ipconfig, dan pastikan HP berada di Wi-Fi yang sama.
-->

---

<!-- _class: compact -->

## Tiap Layar Cukup Menukar Sumber Datanya

| Operasi | Metode + Endpoint | Dipakai di aplikasi |
|---|---|---|
| Baca&nbsp;daftar | `GET /api/krs?nim=` | Tab KRS "Tersimpan di server" |
| Baca&nbsp;satu | `GET /api/matakuliah/:kode` | Layar detail mata kuliah (`matakuliah/[kode]`) |
| Tambah | `POST /api/krs` | "Kirim keranjang" di ringkasan KRS |
| Ubah | `PATCH /api/krs/:id` | Chip kelas (A/B/C) tiap baris |
| Hapus | `DELETE /api/krs/:id` | "Batalkan" di tiap baris |

> Server dijalankan dari `backend/`: `npm install && npm start` (port 3000).

<!--
Tunjukkan bahwa setiap layar dari Bab 7–8 mendapat satu baris di tabel ini: Aplikasi Manajemen
Data Mahasiswa hanya perlu menukar sumber datanya, bukan menulis ulang layarnya.

Sensitif versi: folder `backend/` disusun bersamaan dengan buku ini; path endpoint dan bentuk
respons mengikuti `backend/README.md` dan desain REST baku. Kalau berbeda, cukup sesuaikan
`API_URL` dan normalisasi respons di satu file.
-->

---

<!-- _class: compact -->

## Satu File, Satu Tanggung Jawab

| Lapisan | Contoh file | Tanggung jawab |
|---|---|---|
| View | `screens/DaftarMahasiswa.js` | Menggambar daftar dan tiga state |
| API&nbsp;client | `api/mahasiswa.js` | Urusan jaringan dan `fetch` |
| Route | `app/(app)/mahasiswa/index.js` | Menyambungkan rute ke layar |
| Server | `backend/` Express port 3000 | Menyimpan dan mengelola data |

> Pemisahan ini disebut **separation of concerns**: satu file untuk satu tanggung jawab.

<!--
Tekankan tiga alasan memisahkannya: komponen tetap bersih, logika permintaan bisa dipakai banyak
layar, dan kalau alamat server berubah hanya satu file yang disentuh.

Pertanyaan lanjutan: "Kalau aplikasi tumbuh sampai dua puluh layar, apa yang terjadi bila fetch
ditulis langsung di setiap layar?" (Jawaban: satu perubahan kecil harus diperbaiki di dua puluh
tempat.)
-->

---

## Alur Integrasi: Formulir, Server, Lalu Daftar

![w:1120](assets/diagrams/bab-10-rest-api-dan-backend-integration-05.svg)

1. Formulir mengisi state, lalu tombol Simpan ditekan dan dinonaktifkan
2. `POST /api/mahasiswa` mengirim hasil `JSON.stringify(form)`
3. Server menyimpannya dan menjawab `201 Created` beserta `id` baru
4. `router.back()` mengembalikan pengguna ke layar daftar
5. `useFocusEffect` memuat ulang daftar, lalu `FlatList` menampilkan data terbaru

<!--
Bacakan sebagai kisah satu transaksi: isi formulir, simpan, kembali, dan daftar menyegarkan
dirinya sendiri. Kuncinya `useFocusEffect` dari Expo Router (lihat Bab 7), bukan pemanggilan muat
ulang manual.

Pertanyaan penuntun: "Kenapa daftar perlu dimuat ulang saat kembali mendapat fokus?" (Jawaban:
supaya perubahan dari layar lain langsung terlihat tanpa muat ulang manual.)
-->

---

## Pola Ini Bertahan Sampai Project Akhir

![w:1120](assets/diagrams/bab-10-rest-api-dan-backend-integration-04.svg)

<!--
Hubungkan ke depan, bukan ke belakang: begitu mahasiswa paham alur fetch dan tiga state
antarmuka, pola yang sama dipakai sampai Project Akhir.

Pertanyaan penuntun: "Bagian Bab 10 mana yang langsung dipakai di Bab 11?" (Jawaban: menyimpan
salinan data terakhir saat permintaan gagal, yaitu pola fetch ditambah cache lokal.)
-->

---

## Studi Kasus: Tiga Sistem, Tiga Angka IPK yang Berbeda

![w:660](assets/diagrams/bab-10-rest-api-dan-backend-integration-12.svg)

**Gejalanya** — IPK berbeda di setiap sistem: tidak ada satu sumber kebenaran

**Keputusannya** — satu REST API pusat menjadi satu-satunya pintu ke data; tiga client berbeda teknologi berbicara satu bahasa HTTP/JSON

<!--
Bacakan sebagai cerita kasus dari bagian Studi Kasus bab, bukan sebagai daftar. Tegaskan bahwa
akar masalahnya data yang terduplikasi, bukan teknologinya.

Klien mobile di gambar itu adalah Aplikasi Manajemen Data Mahasiswa yang kamu bangun sejak
Bab 6: satu-satunya bagian yang berubah nanti hanyalah sumber datanya.

Tanya: "Kalau API pusat mati pada jam pengisian KRS, siapa yang paling dirugikan, dan apa
mitigasinya?" (Jawaban: mahasiswa; mitigasinya menjaga ketersediaan di sisi server dan tiga
state antarmuka di sisi aplikasi.)

Dipotong ke gambar (diagram yang mengatakan ini):
- Website akademik, aplikasi mobile, dan HR masing-masing menyimpan salinan data

Dipotong ke catatan (prosa; gambar butuh tempatnya): risikonya, API pusat menjadi titik gagal
tunggal; kontraknya harus didokumentasikan dan kelak diberi nomor versi (`/api/v1/`).
-->

---

## API Produksi Hampir Selalu Dijaga

- Server praktikum bab ini terbuka; API produksi hampir selalu dijaga
- Alurnya: login → server menerbitkan **token** → token disertakan di setiap permintaan
- Token dikirim lewat header `Authorization: Bearer <token>`
- Tanpa token, token salah, atau kedaluwarsa → server menjawab `401 Unauthorized`

> Siklus login → token → permintaan terlindungi → logout dibahas penuh di Bab 13.

<!--
Hanya dua hal yang perlu diingat dari slide ini: di mana token disampaikan, dan apa arti status
401. Sisanya milik Bab 13.

Pertanyaan penuntun: "Kenapa nilai IPK sebaiknya tidak dibiarkan bisa dibaca siapa saja?"
(Jawaban: itu data pribadi; server harus tahu siapa yang bertanya sebelum menjawab.)
-->

---

## Token Menumpang di Header Setiap Permintaan

![w:1120](assets/diagrams/bab-10-rest-api-dan-backend-integration-06.svg)

<!--
Slide gambar saja, supaya empat butir di slide sebelumnya tetap utuh. Bacakan dari atas ke bawah:
login, token, header Bearer pada setiap permintaan berikutnya, dan dua jawaban yang mungkin
diberikan server. Panah biru adalah baris yang paling ingin diingat mahasiswa.
-->

---

<!-- _class: center -->

## Diskusi Kelas: Kapan Memisahkan `api/` Terbayar?

- Kapan pemisahan `api/mahasiswa.js` menguntungkan, kapan justru menjadi beban?
- Data mana di aplikasi favoritmu yang dinamis (dari API), mana yang statis?
- Apa yang kamu rancang sebagai pengembang saat server mati di jam sibuk?

Setiap kelompok menyampaikan **satu** klaim dan **satu** bukti dari pengalaman memakai aplikasi.

<!--
Beri 3 menit berpasangan, lalu tampung hanya dua kelompok supaya waktu tetap terkendali.

Yang dinilai adalah kualitas penalaran, bukan kesimpulannya (lihat Soal Analisis Bab 10).
Arahkan kalau pembahasannya melenceng: aplikasi bank menyimpan profil terakhir di perangkat,
sedangkan saldo selalu diambil dari server.
-->

---

## Praktikum: Yang Dibangun Pertemuan Ini

- Jalankan server buku: `cd backend && npm install && npm start`
- Hubungkan daftar mahasiswa milik Aplikasi Manajemen Data Mahasiswa ke `GET /api/mahasiswa`
- Lengkapi CRUD: `POST`, `PUT`, dan `DELETE` ke endpoint yang sama
- Tampilkan tiga state antarmuka: loading, error dengan aksi, dan empty state
- Matikan server sekali, lalu catat apa yang tampil di layar

> Hasil yang diharapkan: lima kartu mahasiswa standar muncul dari server, dan terminal server mencatat setiap permintaan GET, POST, PUT, dan DELETE.

<!--
Bacakan hanya butir praktikum dan tenggatnya; butir latihan dan tantangan ada di bab untuk
dikerjakan mandiri.

Ingatkan bahwa server harus dijalankan lebih dulu: kalau lupa, yang muncul adalah
`TypeError: Network request failed`, bukan data.
-->

---

## Latihan dan Tantangan: dari Satu Baris ke Seluruh Aplikasi

- **Latihan** — ubah `ubahMahasiswa` memakai `PATCH` yang hanya mengirim field `ipk`
- **Latihan** — buat `screens/DetailMahasiswa.js` yang memanggil `ambilMahasiswaById`
- **Tantangan** — simpan daftar terakhir dengan AsyncStorage sebagai cadangan (Bab 11)
- **Tantangan** — pindahkan data mahasiswa ke Context agar dibagi antar layar (Bab 9)

> Tonggak Project Akhir: integrasi API di aplikasi kelompokmu.

<!--
Jangan dibacakan semua. Sebutkan bahwa latihan memakai PATCH dan layar detail, sedangkan
tantangan menyambung ke Bab 9 dan Bab 11, jadi keduanya sekaligus menjadi persiapan ujian lisan.

Peringatan: tantangan AsyncStorage baru masuk akal setelah Bab 11 dibaca; kalau belum, cukup
dicatat sebagai rencana.
-->

---

## Yang Harus Teramati

Untuk praktikum ini, catat lima hal:

- Server berjalan di port 3000 dan terminal mencatat setiap permintaan
- Lima kartu mahasiswa muncul dari `GET /api/mahasiswa`, bukan dari konstanta
- State loading terlihat sebentar sebelum data datang
- Server dimatikan: muncul state error dengan tombol aksi, bukan layar kosong
- Satu data ditambahkan: `POST` tercatat dan `id` baru muncul di daftar

> Laporan yang baik menyebut status code yang kamu lihat, bukan hanya tulisan "berhasil".

<!--
Jadikan daftar ini lembar centang: mahasiswa mencentang setiap butir lalu melampirkan tangkapan
layar terminal server sebagai bukti.

Yang paling sering hilang adalah butir keempat: mematikan server adalah cara termurah
membuktikan bahwa state error benar-benar ada.

Pertanyaan penuntun: "Bukti apa yang paling sulit dipalsukan di praktikum ini?" (Jawaban: log
permintaan di terminal server.)
-->

---

<!-- _class: center -->

## Kuis Kilat

- Metode HTTP apa yang tepat untuk operasi "Create" pada CRUD?
- Status code apa yang menandakan resource baru berhasil dibuat?
- Kenapa tombol Simpan perlu dinonaktifkan selama permintaan berjalan?
- Base URL apa yang dipakai emulator Android untuk menjangkau komputer host?

<!--
Kuis lisan 5 menit: tampilkan pertanyaan, minta kelas menjawab serempak atau mengangkat tangan,
lalu lanjut ke slide kunci. Jangan bocorkan jawaban di slide ini.

Catat pertanyaan mana yang paling banyak salah; pertanyaan itu diulang di ringkasan penutup
pertemuan.
-->

---

<!-- _class: center -->

## Kunci Kuis Kilat

- `POST` — membuat resource baru di alamat koleksi
- `201 Created` — data tersimpan dan respons membawa `id` baru
- Karena POST tidak idempoten: dua permintaan berarti dua data
- `http://10.0.2.2:3000` — `localhost` menunjuk emulator itu sendiri

<!--
Tegaskan jawaban ketiga dengan kebiasaan praktis: tombol dinonaktifkan dan teksnya berubah
menjadi "Menyimpan…" sampai permintaan selesai.

Kalau banyak yang salah di jawaban keempat, langsung buka slide base URL supaya tidak tertunda
sampai praktikum.
-->

---

## Ringkasan

1. Arsitektur client–server memisahkan aplikasi dari data: satu sumber kebenaran
2. REST memandang data sebagai resource beralamat dan bersifat stateless
3. Metode HTTP memetakan CRUD: GET, POST, PUT/PATCH, dan DELETE
4. GET aman dan idempoten; POST tidak, jadi tombol Simpan perlu dinonaktifkan
5. Status code adalah bahasa bersama: 2xx sukses, 4xx kesalahan client, 5xx kesalahan server
6. JSON adalah format tukar utama: `JSON.stringify` dan `response.json()`
7. `fetch` hanya melempar error saat jaringan gagal — periksa `response.ok`
8. Tiga state antarmuka: loading, error dengan aksi, dan empty state yang menjelaskan
9. Base URL mengikuti tempat aplikasi berjalan; API produksi memakai token Bearer

<!--
Jangan dibacakan. Minta mahasiswa memilih satu nomor dan menjelaskannya dengan kata-kata
sendiri; ini bekerja lebih baik daripada mengulang bacaan.

Kalau kelas tampak ragu di nomor 4, ulangi contoh tombol Simpan yang ditekan dua kali.

Tutup ringkasan dengan menyambung ke bab berikutnya: pola fetch dan tiga state antarmuka dipakai
lagi saat penyimpanan lokal ditambahkan di Bab 11. Pola yang sama juga menjadi butir penilaian
Project Akhir pada aspek integrasi API (10%).
-->

---

<!-- _class: compact -->

## Referensi

| Sumber | Link |
|---|---|
| MDN Web Docs — HTTP, fetch, JSON (2026) | developer.mozilla.org |
| Dokumentasi Express (2026) | expressjs.com |
| Dokumentasi React Native (2026) | reactnative.dev |
| Dokumentasi Expo (2026) | docs.expo.dev |

**Bacaan lanjutan:** Bab 11 — Penyimpanan Data Lokal · Bab 13 — Autentikasi dan Keamanan Aplikasi

**Versi teknologi:** Expo SDK 57 · React Native 0.86 · React 19.2 · Node.js ≥ 22

<!--
Rujukan lengkap ada di Lampiran D; istilah seperti endpoint, status code, dan state loading
dijelaskan di Lampiran C (glosarium) beserta nomor bab rujukannya.

Kontrak endpoint server buku ada di `backend/README.md` dan wajib dibaca sebelum praktikum;
dokumentasi daring bergantung versi, jadi selalu cocokkan dengan SDK 57 seperti di buku ini.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Siap ke Bab 11

**Tugas:** jalankan `cd backend && npm install && npm start`, lalu hubungkan daftar mahasiswa ke API dengan tiga state antarmuka; kumpulkan laporan Praktikum 10.

Pertemuan berikutnya: menyimpan data di perangkat dengan AsyncStorage agar aplikasi tetap berguna saat jaringan hilang.

<!--
Tutup dengan satu kalimat: "Bab ini memberi aplikasimu sumber data; bab berikutnya memberi
aplikasimu ingatan."

Sebutkan tenggat Praktikum 10 dan tonggak Project Akhir secara eksplisit, beserta rubrik
praktikum: pemahaman konsep 15%, implementasi 25%, kualitas kode 15%, UI/UX 15%, debugging 10%,
dokumentasi 20% (Lampiran A).
-->
