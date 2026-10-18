# BAB 10 — REST API dan Backend Integration

## Deskripsi Singkat

Bab ini membangun jembatan antara aplikasi mobile dan data: **REST API** (Application Programming Interface — antarmuka pemrograman aplikasi berbasis gaya arsitektur REST). Mahasiswa akan memahami arsitektur **client–server** (pengguna layanan–penyedia layanan), protokol **HTTP** (Hypertext Transfer Protocol — protokol transfer data web), metode **GET/POST/PUT/DELETE**, **status code** (kode status), serta cara memakai **fetch** untuk bertukar data berformat **JSON**. Praktikum bab ini menghubungkan Aplikasi Manajemen Data Mahasiswa (Bab 6–8) dengan server Express bawaan buku di folder `backend/`, sehingga data mahasiswa benar-benar dikelola di server, bukan sekadar data statis di dalam komponen. Materi ini menjadi fondasi Bab 11 (penyimpanan lokal), Bab 13 (autentikasi dan keamanan), dan Project Akhir (Sistem Informasi Akademik Mobile).

## Tujuan Pembelajaran

Setelah mempelajari bab ini, mahasiswa diharapkan mampu:

1. Menjelaskan arsitektur client–server serta peran API di dalamnya.
2. Mengidentifikasi peran HTTP, REST, dan JSON dalam pertukaran data aplikasi mobile.
3. Menganalisis pemilihan metode HTTP (GET, POST, PUT/PATCH, DELETE) untuk setiap operasi data.
4. Menafsirkan status code respons server, baik yang menandakan sukses maupun kegagalan.
5. Mengimplementasikan permintaan API menggunakan fetch, termasuk header `Content-Type` dan serialisasi JSON.
6. Merancang tiga keadaan antarmuka saat berkomunikasi dengan server: loading, error, dan empty state.
7. Mengintegrasikan aplikasi dengan server backend buku (membaca daftar, menambah, mengubah, dan menghapus data mahasiswa).

## Peta Konsep

```text
┌─────────────────────┐    request HTTP berisi JSON   ┌─────────────────────┐
│  APLIKASI MOBILE    │ ─────────────────────────────► │   SERVER API        │
│  (client)           │ ◄───────────────────────────── │   (Express)         │
│  React Native Expo  │    respons: data + status code │   backend/, :3000   │
└──────────┬──────────┘                                └──────────┬──────────┘
           │                                                      │
           │ fetch: GET · POST · PUT · DELETE                     │ data mahasiswa
           ▼                                                      ▼
┌─────────────────────┐                                ┌─────────────────────┐
│ 3 keadaan UI:       │                                │  DATA MAHASISWA     │
│ loading · error ·   │                                │  (5 data baku buku) │
│ empty               │                                └─────────────────────┘
└─────────────────────┘
```

Konsep kunci bab ini: aplikasi (client) meminta data melalui HTTP, server merespons dengan data JSON dan status code, lalu aplikasi menampilkan data itu dalam tiga keadaan antarmuka (loading, error, empty) agar pengalaman pengguna tetap baik.

## Materi

### 10.1 Konsep Client–Server

Di bab-bab sebelumnya, seluruh data aplikasi ditulis langsung di dalam kode. Data itu disebut **data statis** (data tetap): daftar mahasiswa yang kamu ketik di file JavaScript akan sama untuk semua pengguna, di semua waktu, sampai kamu mengubah kodenya. Padahal aplikasi nyata di dunia Sistem Informasi membutuhkan data yang **dinamis** (berubah-ubah): mahasiswa baru ditambahkan, IPK diperbarui, data dihapus. Dari mana data dinamis itu berasal? Jawabannya adalah arsitektur **client–server** (klien–server), yaitu pemisahan tegas antara pihak yang meminta layanan (client) dan pihak yang menyediakan layanan (server).

Dalam konteks aplikasi mobile, **client** adalah aplikasi React Native Expo yang berjalan di ponsel, sedangkan **server** adalah program lain (biasanya dijalankan di komputer/server pusat) yang menyimpan dan mengelola data. Di buku ini server tersebut adalah **API server** (server antarmuka pemrograman aplikasi) berbasis Express yang berada di folder `backend/` proyek buku. Keduanya terhubung melalui jaringan, seperti ilustrasi berikut: kamu (client) memesan makanan lewat pelayan (API) di restoran; pelayan menyampaikan pesanan ke dapur (server), lalu membawakan hidangannya kembali. Kamu tidak perlu tahu cara dapur bekerja — kamu cukup tahu cara memesan dan menerima hidangan.

Mengapa teknologi ini ada? Mengapa data tidak disimpan langsung di aplikasi mobile saja? Ada beberapa alasan yang saling terkait. Pertama, **satu sumber kebenaran** (single source of truth): jika data disimpan di server, semua pengguna aplikasi melihat data yang sama dan konsisten; tidak ada versi data yang berbeda-beda di tiap ponsel. Kedua, **keamanan dan kontrol**: data sensitif (misalnya nilai mahasiswa) tetap berada di server yang bisa dijaga, dibackup, dan diatur aksesnya, sedangkan ponsel cukup menerima hasil yang diizinkan. Ketiga, **pembaruan tanpa instal ulang**: aturan bisnis (misalnya perhitungan IPK) cukup diubah sekali di server, dan semua aplikasi langsung mendapat perilaku baru tanpa pengguna mengunduh versi baru. Namun arsitektur ini punya harga (trade-off): aplikasi **bergantung pada jaringan** — tanpa internet atau server mati, aplikasi kehilangan data (inilah yang nantinya memotivasi penyimpanan lokal di Bab 11 sebagai cadangan), dan ada **latensi** (waktu tunggu) karena setiap data harus menempuh perjalanan jaringan. Desainer sistem harus menyeimbangkan keduanya, misalnya dengan menampilkan UI yang jujur soal kondisi jaringan — topik yang dibahas di subbab 10.6.

### 10.2 HTTP, REST, dan JSON

**HTTP** (Hypertext Transfer Protocol — protokol transfer hiperteks) adalah bahasa komunikasi antara client dan server di web. HTTP bekerja dengan pola **request–response** (permintaan–tanggapan): client mengirim permintaan, server membalas dengan tanggapan. Permintaan berisi tiga bagian utama: **method** (metode — apa yang ingin dilakukan), **URL** (Uniform Resource Locator — alamat sumber yang dituju), serta **headers** (kepala pesan) dan **body** (isi pesan) sebagai keterangan tambahan. Tanggapan server berisi **status code** (kode status — hasil permintaan) dan body berisi data yang diminta. Bayangkan HTTP seperti formulir pengajuan: kamu menulis maksud permintaan di formulir (method dan URL), melampirkan keterangan (headers) dan berkas (body), lalu biro layanan membalas dengan stempel hasil (status code) dan dokumen yang kamu butuhkan.

Di atas HTTP berdiri **REST** (Representational State Transfer — pemindahan keadaan melalui representasi), gaya arsitektur API yang paling umum digunakan aplikasi mobile saat ini. REST mengajak kita memandang data sebagai **resource** (sumber daya) — misalnya "mahasiswa", "mata kuliah", "prodi" — yang masing-masing memiliki alamat unik. Alamat itu disebut **endpoint** (titik akhir): `GET /api/mahasiswa` berarti "kirimkan semua data mahasiswa", sedangkan `GET /api/mahasiswa/1` berarti "kirimkan satu mahasiswa dengan id 1". Operasi terhadap resource dipetakan ke metode HTTP dengan makna yang sudah disepakati: membaca → GET, menambah → POST, mengubah → PUT/PATCH, menghapus → DELETE (rinciannya di subbab 10.3). Prinsip penting REST adalah **stateless** (tanpa keadaan): setiap permintaan berdiri sendiri dan membawa semua informasi yang dibutuhkan server; server tidak menyimpan ingatan percakapan di antara dua permintaan. Ini membuat server sederhana, mudah diskalakan (ditambah kapasitasnya) dengan menambah komputer lain, dan setiap permintaan bisa di-cache (disimpan sementara) secara mandiri.

Mengapa REST menjadi standar? Sebelum REST populer, integrasi sistem banyak memakai **SOAP** (Simple Object Access Protocol), protokol berbasis XML yang kaku dan berat: setiap pesan harus dibungkus amplop XML dengan aturan ketat. REST lahir sebagai reaksi: cukup HTTP biasa, data dalam format ringan, aturan yang mudah dimengerti, dan hasilnya API yang sederhana serta cepat dikembangkan. Perkembangan terbaru seperti GraphQL menawarkan fleksibilitas memilih field data, tetapi REST tetap paling banyak dipakai industri karena kesederhanaan dan kematangannya — mahasiswa perlu menguasai REST terlebih dahulu sebelum mengevaluasi alternatif tersebut.

Data yang dipertukarkan REST umumnya berformat **JSON** (JavaScript Object Notation — notasi objek JavaScript). JSON adalah teks yang strukturnya persis objek JavaScript: pasangan kunci–nilai, array, angka, dan string. Data mahasiswa dari dataset baku buku ini misalnya direpresentasikan seperti berikut:

```json
[
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
]
```

Mengapa JSON dan bukan XML? JSON jauh lebih ringkas (sedikit karakter untuk data yang sama), mudah dibaca manusia, dan — keuntungan terbesar bagi pemrogram JavaScript — JSON adalah "bahasa ibu" JavaScript: objek JavaScript dapat diubah menjadi JSON dengan `JSON.stringify` dan diubah kembali menjadi objek dengan `response.json()`. Kamu sudah mengenal kedua fungsi ini di Bab 3; bab ini memakainya untuk kebutuhan nyata.

### 10.3 Metode HTTP: GET, POST, PUT/PATCH, DELETE

Empat metode HTTP berikut mencakup seluruh operasi dasar pengelolaan data. Operasi dasar ini dikenal sebagai **CRUD** (Create, Read, Update, Delete — cipta, baca, ubah, hapus). Setiap metode dipilih berdasarkan maknanya, bukan asal memakai:

| Metode | Makna | Operasi CRUD | Contoh endpoint | Idempoten? |
|--------|-------|--------------|-----------------|------------|
| GET | Membaca data | Read | `GET /api/mahasiswa` | Ya |
| POST | Membuat data baru | Create | `POST /api/mahasiswa` | Tidak |
| PUT | Mengganti seluruh data | Update | `PUT /api/mahasiswa/1` | Ya |
| PATCH | Mengubah sebagian data | Update | `PATCH /api/mahasiswa/1` | Ya |
| DELETE | Menghapus data | Delete | `DELETE /api/mahasiswa/1` | Ya |

**GET** membaca data tanpa mengubah apa pun di server; permintaan ini dianggap **aman** (safe — tidak menimbulkan efek samping) dan **idempoten** (idempotent — diulang seratus kali pun hasilnya sama). Karena itu GET aman dijalankan ulang, misalnya saat pengguna menarik layar untuk memuat ulang. Data dikirim server sebagai body tanggapan, sedangkan permintaan GET sendiri umumnya tidak membawa body.

**POST** menciptakan resource baru: client mengirim data mahasiswa baru pada body permintaan, server menyimpan dan mengembalikan data itu lengkap dengan `id` yang baru diberikan, ditandai status code `201 Created`. POST bersifat tidak idempoten: permintaan yang sama dikirim dua kali akan menciptakan dua data (bayangkan menekan tombol "Simpan" dua kali — ini sebabnya aplikasi harus menonaktifkan tombol saat permintaan sedang berjalan, seperti pada praktikum bab ini).

**PUT** mengganti seluruh resource: client mengirim versi lengkap data mahasiswa ke `PUT /api/mahasiswa/1`, dan server mengganti seluruh isi mahasiswa id 1 dengan data baru. **PATCH** mengubah sebagian: client hanya mengirim field yang berubah, misalnya `{ "ipk": 3.50 }`. PUT idempoten (mengirim data sama dua kali menghasilkan keadaan sama), sedangkan PATCH tidak selalu. Buku server menggunakan PUT untuk kesederhanaan; dalam sistem nyata, PATCH lebih hemat bandwidth saat hanya satu field yang berubah.

**DELETE** menghapus resource. Permintaan `DELETE /api/mahasiswa/1` menghapus mahasiswa id 1; respons yang umum adalah `204 No Content` (sukses tanpa body) atau `200` dengan pesan singkat. Karena idempoten, menghapus data yang sudah tidak ada sering kali tetap direspons sukses atau `404` — tergantung kebijakan server.

Mengapa metode perlu dibedakan? Karena metode adalah **kontrak semantik** (perjanjian makna) antara client dan server. Dengan membaca metode saja, server, sistem cache, atau firewall sudah tahu apa efek sebuah permintaan dan bagaimana memperlakukannya. Pemilihan metode yang salah (misalnya menghapus data lewat GET) menghasilkan desain API yang membingungkan dan berbahaya — tautan atau prefetch yang mengeksekusi GET bisa tanpa sengaja menghapus data.

### 10.4 Status Code dan Struktur Request–Response

**Status code** (kode status) adalah angka tiga digit pada tanggapan server yang menyatakan hasil permintaan. Kode ini adalah "bahasa bersama" industri: siapa pun yang membaca log atau pesan error langsung paham apa yang terjadi. Status code dikelompokkan berdasarkan digit pertamanya:

| Kelompok | Makna | Contoh |
|----------|-------|--------|
| 1xx | Informasional (sedang diproses) | 100 Continue |
| 2xx | Sukses | 200, 201, 204 |
| 3xx | Pengalihan (redirect) | 301, 304 |
| 4xx | Kesalahan dari sisi client | 400, 401, 404 |
| 5xx | Kesalahan dari sisi server | 500, 503 |

Status code yang paling sering kamu temui pada bab ini:

- **200 OK** — permintaan berhasil; data ada pada body tanggapan. Dipakai hampir semua GET dan PUT yang sukses.
- **201 Created** — resource baru berhasil dibuat (dipakai POST yang sukses).
- **204 No Content** — sukses tanpa isi tanggapan (umum pada DELETE; kadang pada PUT).
- **400 Bad Request** — permintaan cacat; misalnya body bukan JSON yang valid, atau field wajib tidak diisi.
- **401 Unauthorized** — client belum/ tidak terautentikasi; misalnya token hilang atau kadaluarsa (dibahas di subbab 10.8 dan Bab 13).
- **404 Not Found** — resource tidak ditemukan; misalnya `GET /api/mahasiswa/999` saat mahasiswa id 999 tidak ada, atau path endpoint salah ketik.
- **500 Internal Server Error** — server mengalami kegagalan internal; bukan kesalahan client, melainkan bug atau kondisi tak terduga di server.

Struktur lengkap request dan response dapat kamu lihat pada contoh pertukaran HTTP berikut (permintaan menambah mahasiswa baru dan tanggapan server):

```text
REQUEST: POST /api/mahasiswa HTTP/1.1
Host: 10.0.2.2:3000
Content-Type: application/json

{ "nim": "2201001", "nama": "Budi Santoso", "prodi": "Sistem Informasi",
  "angkatan": 2022, "ipk": 3.45,
  "email": "budi.santoso@students.univ.ac.id", "telepon": "081234567890" }

RESPONSE: HTTP/1.1 201 Created
Content-Type: application/json

{ "id": 1, "nim": "2201001", "nama": "Budi Santoso", "prodi": "Sistem Informasi",
  "angkatan": 2022, "ipk": 3.45,
  "email": "budi.santoso@students.univ.ac.id", "telepon": "081234567890" }
```

Perhatikan tiga hal pada contoh di atas. Pertama, **header** menyampaikan metadata (keterangan tentang data itu sendiri): `Content-Type: application/json` memberi tahu penerima bahwa isi pesan berformat JSON. Kedua, **body** request dan response berisi data nyata; pada contoh ini keduanya nyaris sama, bedanya respons menambahkan `id` yang baru diterbitkan server. Ketiga, **status code** menandakan hasil: `201 Created` berarti proses berhasil dan data sudah tersimpan. Dalam kode aplikasi nanti, kita membaca status code lewat properti `response.ok` dan `response.status` untuk memutuskan apakah data boleh dipakai atau harus ditampilkan sebagai error.

### 10.5 Menggunakan fetch

**fetch** adalah fungsi bawaan JavaScript (web API) untuk mengirim permintaan HTTP. Karena React Native dibangun di atas JavaScript, fetch tersedia langsung di aplikasi Expo tanpa menginstal paket apa pun — keunggulan utama dibanding pustaka eksternal seperti **Axios** (dibahas sebentar di akhir subbab ini). fetch mengembalikan **Promise** (janji — objek hasil operasi asinkron), sehingga kita memprosesnya dengan `async/await` yang sudah kamu pelajari di Bab 3. Bentuk paling sederhana memuat daftar mahasiswa:

File: api/mahasiswa.js
```js
const API_URL = 'http://10.0.2.2:3000/api/mahasiswa';

async function muatDaftarMahasiswa() {
  const response = await fetch(API_URL);   // 1. kirim permintaan GET
  if (!response.ok) {                      // 2. periksa status code
    throw new Error(`Permintaan gagal (HTTP ${response.status})`);
  }
  return await response.json();            // 3. ubah teks JSON menjadi objek
}
```

Penjelasan: baris pertama menyimpan alamat endpoint pada konstanta `API_URL` agar mudah diubah satu kali saja (penting karena alamat server berbeda-beda tergantung tempat aplikasi dijalankan — dibahas di subbab 10.7). `fetch(API_URL)` tanpa opsi berarti permintaan GET. Kembalinya, `response` adalah objek tanggapan; `response.ok` bernilai `true` hanya untuk status code 2xx, sehingga cara ini lebih baik daripada membandingkan `response.status === 200` satu per satu. Terakhir, `response.json()` membaca body tanggapan sebagai teks lalu mengurainya menjadi objek atau array JavaScript.

Untuk mengirim data, misalnya menambah mahasiswa, fetch diberi opsi kedua: metode, header, dan body:

File: api/mahasiswa.js
```js
async function tambahMahasiswa(dataBaru) {
  const response = await fetch(API_URL, {
    method: 'POST',                                  // 1. jenis operasi
    headers: { 'Content-Type': 'application/json' }, // 2. jenis isi pesan
    body: JSON.stringify(dataBaru),                  // 3. data → teks JSON
  });
  if (!response.ok) {
    throw new Error(`Gagal menyimpan mahasiswa (HTTP ${response.status})`);
  }
  return await response.json();
}
```

Penjelasan: ada tiga hal yang wajib dipahami di sini. Pertama, `method: 'POST'` mengubah sifat permintaan dari membaca menjadi mencipta. Kedua, header `Content-Type: application/json` memberi tahu server bahwa body berformat JSON — tanpa header ini banyak server yang menolak atau salah mengartikan body. Ketiga, `JSON.stringify(dataBaru)` melakukan **serialisasi** (mengubah objek JavaScript menjadi teks), karena body HTTP hanya bisa berupa teks, bukan objek. Perhatikan juga bahwa kode melempar `Error` saat `response.ok` salah — kesalahan ini nantinya ditangkap oleh pemanggil (lihat subbab 10.6).

Satu kehalusan yang sering mengecoh pemula: **fetch hanya melempar error untuk kegagalan jaringan** (misalnya server mati, WiFi putus), sedangkan status code 4xx/5xx tetap dianggap "berhasil" oleh fetch dan hanya terlihat lewat `response.ok`. Karena itu pola `if (!response.ok) throw` adalah keharusan, bukan pelengkap. Kesalahan jaringan muncul sebagai `TypeError: Network request failed` yang juga harus ditangkap dengan `try/catch` di pemanggil.

Sebagai alternatif, pustaka **Axios** sering dipakai di proyek produksi. Perbandingannya singkat: Axios menawarkan sintaks yang sedikit lebih ringkas (data otomatis diserialisasi, error HTTP otomatis dilempar), interceptor (pemintas) untuk menyisipkan header token secara global, dan dukungan pembatalan permintaan; sebaliknya, fetch adalah bawaan (tanpa dependency tambahan), lebih ringan, dan cukup untuk kebutuhan buku ini. Trade-off-nya: fetch lebih "telanjang" sehingga kamu harus menulis pola `!response.ok` berulang kali — tetapi justru dengan fetch kamu memahami apa yang sebenarnya terjadi di balik layar, dan kode fetch mudah dipindahkan ke proyek berbasis Axios nanti. Bab ini konsisten memakai fetch; Axios bisa kamu evaluasi sendiri setelah menguasai konsepnya.

### 10.6 Loading, Error, dan Empty State

Permintaan jaringan tidak instan: data butuh waktu menempuh jaringan, dan bisa gagal kapan saja. Aplikasi yang jujur menampilkan kondisi nyata ini lewat tiga keadaan antarmuka (UI state): **loading state** (keadaan memuat), **error state** (keadaan gagal), dan **empty state** (keadaan kosong). Mengapa tiga keadaan ini penting? Karena pengguna yang tidak diberi umpan balik akan mengira aplikasi macet (saat data sedang dimuat) atau kehilangan data (saat permintaan gagal) — dan aplikasi yang menampilkan `TypeError: Network request failed` mentah-mentah membuat pengguna panik. Tiga keadaan ini adalah bentuk profesionalisme antarmuka: aplikasi menyampaikan apa yang terjadi dan apa yang bisa dilakukan pengguna selanjutnya.

**Loading state** ditampilkan selama permintaan belum selesai. Komponen yang dipakai adalah **ActivityIndicator** (indikator aktivitas — lingkaran berputar) yang sudah kamu kenal di Bab 5, biasanya ditemani teks seperti "Memuat data…". Pola umumnya: satu variabel state `loading` diatur `true` sebelum permintaan dan `false` sesudahnya (di blok `finally` agar selalu berjalan, sukses maupun gagal).

**Error state** muncul saat permintaan gagal, baik karena jaringan maupun status code non-2xx. Pola yang benar adalah `try/catch`: di blok `try` jalankan permintaan; di blok `catch` tangkap error dan tampilkan **pesan ramah** (friendly message) — bahasa manusia, bukan pesan teknis mentah — sambil tetap mencatat detail teknis ke `console.error` untuk kepentingan developer. Sertakan tombol aksi, misalnya "Coba Lagi", agar pengguna punya jalan keluar tanpa menutup aplikasi.

**Empty state** tampil ketika permintaan sukses tetapi tidak ada data sama sekali, misalnya daftar mahasiswa kosong. Tampilkan teks penjelasan dan ajakan bertindak, misalnya "Belum ada data mahasiswa. Tambahkan lewat tombol Tambah." — jangan biarkan layar tampak seperti aplikasi rusak hanya karena daftarnya kosong. Satu keluarga keadaan yang mirip adalah **pull-to-refresh** (tarik layar untuk memuat ulang): pengguna menarik daftar ke bawah untuk menjalankan permintaan baru, memakai komponen `RefreshControl` — praktik yang menyenangkan dan sudah menjadi kebiasaan pengguna aplikasi modern. Ketiga keadaan inilah yang akan kamu implementasikan penuh pada praktikum bab ini.

### 10.7 Studi Kasus: Data Mahasiswa Berbasis REST API

Sekarang mari kita petakan seluruh konsep di atas ke aplikasi nyata: Aplikasi Manajemen Data Mahasiswa (Bab 6–8) yang dihubungkan dengan server buku. Server ini adalah program Express di folder `backend/` — server yang sama akan dipakai lagi di Bab 13 (autentikasi) dan Project Akhir. Cara menjalankannya sederhana: buka terminal di folder `backend/`, jalankan `cd backend && npm install && npm start`, dan server berjalan di port 3000. *⚠ version-sensitive: folder backend/ sedang disusun bersamaan dengan buku ini; detail endpoint dan bentuk respons resmi tetap mengacu pada `backend/README.md` — bab ini memakai desain REST baku yang konsisten dengan dataset buku.*

Resource yang dikelola adalah mahasiswa dengan field `{ id, nim, nama, prodi, angkatan, ipk, email, telepon }` — dataset baku buku. Pemetaan endpoint-nya:

| Operasi | Metode + Endpoint | Kegunaan di aplikasi |
|---------|-------------------|----------------------|
| Baca daftar | `GET /api/mahasiswa` | Layar Daftar Mahasiswa (FlatList) |
| Baca satu | `GET /api/mahasiswa/:id` | Layar Detail / mengisi form edit |
| Tambah | `POST /api/mahasiswa` | Form Tambah Mahasiswa |
| Ubah | `PUT /api/mahasiswa/:id` | Form Edit Mahasiswa |
| Hapus | `DELETE /api/mahasiswa/:id` | Tombol hapus dengan konfirmasi |

Bagian yang paling sering salah pada tahap ini adalah **base URL** (alamat dasar server) — bukan karena konsepnya sulit, melainkan karena jawabannya berbeda di setiap tempat aplikasi dijalankan:

- **Emulator Android**: gunakan `http://10.0.2.2:3000`. Alamat `10.0.2.2` adalah alias khusus yang disediakan emulator Android untuk menunjuk ke komputer host (komputermu sendiri) dari dalam jaringan virtual emulator. `localhost` di dalam emulator akan merujuk ke emulator itu sendiri, bukan ke komputermu — inilah penyebab error "Network request failed" yang paling umum.
- **Device fisik (HP sungguhan)**: gunakan `http://<IP-LAN-komputer>:3000`, misalnya `http://192.168.1.10:3000`. Ponselmu adalah perangkat terpisah di jaringan Wi-Fi, jadi ia tidak mengenal `localhost` maupun `10.0.2.2`; ia harus diarahkan ke alamat IP komputer di jaringan lokal (LAN) — pastikan HP dan komputer berada di Wi-Fi yang sama, dan cari IP komputer lewat pengaturan jaringan atau perintah `ipconfig`.
- **iOS Simulator**: gunakan `http://localhost:3000`, karena simulator berbagi jaringan dan alamat dengan Mac tempat ia berjalan.

Perbedaan ketiganya meringkas satu prinsip: **base URL harus menunjuk ke mesin tempat server berjalan, dilihat dari sudut pandang mesin yang menjalankan aplikasi**. Emulator dan simulator adalah "penyewa" di dalam komputer host, sedangkan HP fisik adalah mesin tersendiri. Untuk memudahkan pergantian, simpan base URL pada satu konstanta di `api/mahasiswa.js` (seperti `API_URL` pada subbab 10.5) dan beri komentar pilihan untuk ketiga kasus.

Satu keputusan desain lain yang perlu dipahami: pemisahan file menjadi `api/mahasiswa.js` (semua urusan jaringan) dan folder `screens/` (komponen antarmuka). Mengapa dipisah? Karena pemisahan ini membuat (1) komponen tetap bersih dan fokus pada tampilan, (2) logika permintaan bisa dipakai ulang oleh banyak layar (daftar, form, detail), dan (3) jika server berubah, cukup satu file yang disesuaikan, bukan banyak layar. Pola inilah yang disebut **separation of concerns** (pemisahan tanggung jawab) — prinsip yang sama sudah kamu lihat dalam struktur folder aplikasi di Bab 2.

### 10.8 API Authentication (Pengantar)

Server pada praktikum bab ini berjalan tanpa autentikasi agar kamu fokus pada mekanisme HTTP. Namun API produksi yang menyimpan data pribadi — nilai, email, data mahasiswa — hampir selalu melindungi diri: tidak semua orang boleh membaca apalagi mengubah data. Mekanismenya disebut **API authentication** (autentikasi antarmuka pemrograman aplikasi - verifikasi identitas pemanggil API).

Pola yang paling umum adalah **token**: setelah pengguna login (memasukkan nama pengguna dan kata sandi), server menerbitkan **token** (rangkaian karakter unik semacam tanda pengenal). Permintaan berikutnya menyertakan token pada header `Authorization` dengan format **Bearer token** (token pembawa — "pembawa kartu ini berhak atas akses berikut"):

```text
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Jika token tidak ada, salah, atau kadaluarsa, server menjawab `401 Unauthorized` — status code yang kamu kenal dari subbab 10.4 — dan aplikasi seharusnya mengarahkan pengguna kembali ke layar login. Pemahaman penuh tentang siklus login → token → permintaan terlindungi → logout dibahas di Bab 13, termasuk cara menyimpan token dengan aman dan melindungi rute aplikasi. Untuk sekarang, cukup pahami dua hal: header `Authorization` adalah tempat token disampaikan, dan `401` adalah bahasa server untuk "siapa kamu?". Pola fetch dengan header token tidak berbeda dari POST yang sudah kamu pelajari — hanya menambah satu entri pada headers — sehingga modalitas (kemampuan) yang kamu bangun di bab ini langsung terpakai di Bab 13 dan Project Akhir.

## Contoh

### Contoh 10.1 — Membaca Daftar dengan GET dan Parsing JSON

File: api/mahasiswa.js
```js
async function muatDaftarMahasiswa() {
  const response = await fetch(API_URL);       // GET -> daftar mahasiswa
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const json = await response.json();
  // Server buku membungkus daftar pada properti data; kode ini menyesuaikan
  // bentuk respons yang juga bisa berupa array langsung.
  return Array.isArray(json) ? json : json.data;
}
```

Penjelasan: contoh ini memperlihatkan pola GET yang aman. `response.json()` mengembalikan data; karena server yang berbeda mengemas daftar dengan bentuk berbeda (array langsung atau objek berisi properti `data`), operasi `Array.isArray(json) ? json : json.data` menormalkan keduanya menjadi array. Bentuk normalisasi seperti ini membuat aplikasi tahan terhadap perbedaan kecil antar server tanpa harus mengubah seluruh layar.

### Contoh 10.2 — Mengirim Data Baru dengan POST, Header, dan Body

File: api/mahasiswa.js
```js
async function tambahMahasiswa(dataBaru) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataBaru),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json(); // data baru lengkap dengan id dari server
}
```

Penjelasan: ketiga opsi fetch — `method`, `headers`, `body` — bekerja bersama. Nilai yang dikembalikan adalah data mahasiswa yang baru tersimpan, kini disertai `id` yang diterbitkan server; inilah bukti bahwa data benar-benar disimpan di server, bukan hanya dikirim lalu dilupakan.

### Contoh 10.3 — Menghapus dan Memahami 204

File: api/mahasiswa.js
```js
async function hapusMahasiswa(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return true; // DELETE sukses: server umumnya membalas 204 (tanpa isi)
}
```

Penjelasan: perhatikan bahwa setelah sukses kita tidak memanggil `response.json()`. Server yang menjawab `204 No Content` sengaja tidak mengirim body — memanggil `response.json()` pada respons kosong justru akan melempar error. Mengembalikan nilai boolean `true` adalah pilihan yang tepat karena pemanggil hanya butuh tahu "berhasil atau tidak".

## Praktikum

### Tujuan Praktikum

Menghubungkan Aplikasi Manajemen Data Mahasiswa dengan server backend buku sehingga daftar mahasiswa bersumber dari API (ditampilkan pada FlatList), dan operasi tambah, edit, dan hapus benar-benar mengubah data di server. Praktikum ini memadukan seluruh materi bab: client–server, metode HTTP, status code, fetch, serta loading/error/empty state.

### Kebutuhan

1. Project Expo SDK 57 hasil Bab 2 (template `blank`, JavaScript) yang sudah memiliki rute Expo Router dari Bab 7 — khususnya `app/(app)/mahasiswa/index.js` (Daftar) dan `app/(app)/mahasiswa/tambah.js` (Form).
2. Node.js LTS (minimal 22) untuk menjalankan server.
3. Server backend buku di folder `backend/` (disediakan repo buku).
4. Tempat menjalankan aplikasi: emulator Android, device fisik, atau iOS Simulator — base URL menyesuaikan (subbab 10.7).
5. Tidak ada dependency tambahan: fetch, ActivityIndicator, FlatList, RefreshControl, dan Alert semuanya bagian dari React Native.

### Persiapan

1. Bukalah terminal di folder `backend/` lalu jalankan `cd backend && npm install && npm start`. Tunggu hingga muncul keterangan server berjalan di port 3000.
2. Uji server lewat browser atau aplikasi semacam Postman: buka `http://localhost:3000/api/mahasiswa`. Kamu akan melihat daftar 5 mahasiswa baku buku dalam format JSON.
3. Tentukan target penjalanan aplikasi (emulator/device/simulator) dan catat base URL yang sesuai.
4. Buka project aplikasi dari Bab 7 di editor; pastikan `npx expo start` tidak sedang berjalan agar bebas dari konflik.

*⚠ version-sensitive: path endpoint (`/api/mahasiswa`) dan bentuk respons di bab ini mengikuti desain REST baku; jika `backend/README.md` yang tiba di repo menentukan hal lain, sesuaikan konstanta `API_URL` dan normalisasi respons di `api/mahasiswa.js` — hanya dua titik yang perlu diubah.*

### Langkah Kerja

1. Buat folder `api/` di root project, lalu buat file `api/mahasiswa.js` berisi klien fetch lengkap (blok kode di bagian Kode). Sesuaikan `API_URL` dengan targetmu.
2. Buat folder `screens/`, lalu buat `screens/DaftarMahasiswa.js` berisi layar daftar yang membaca data dari API (blok kode di bagian Kode).
3. Buka `app/(app)/mahasiswa/index.js` dari Bab 7 dan ganti isinya dengan versi perute yang memuat komponen `DaftarMahasiswa` (lihat blok "Perute" di bagian Kode).
4. Jalankan `npx expo start`, buka aplikasi di emulator/device, dan amati daftar mahasiswa yang muncul dari server. Uji pull-to-refresh dengan menarik daftar ke bawah.
5. Buat `screens/FormMahasiswa.js` yang mendukung dua mode: tambah (tanpa parameter `id`) dan edit (dengan parameter `id`, data diambil dari server lalu mengisi form).
6. Buka `app/(app)/mahasiswa/tambah.js` dan ganti isinya agar memuat `FormMahasiswa`.
7. Uji alur lengkap: tambah satu mahasiswa → kembali ke daftar (data baru muncul), ketuk Edit pada data tersebut → ubah nama → Simpan → amati perubahannya, lalu Hapus dengan konfirmasi.
8. Uji keadaan error: matikan server, tarik daftar (atau muat ulang), dan amati pesan ramah serta tombol "Coba Lagi". Nyalakan kembali server, ketuk "Coba Lagi", dan pastikan daftar pulih.

### Kode

File: api/mahasiswa.js
```js
// api/mahasiswa.js — klien fetch untuk resource mahasiswa.
// Ganti API_URL sesuai tempat aplikasi dijalankan:
//   Emulator Android : http://10.0.2.2:3000/api/mahasiswa
//   Device fisik     : http://<IP-LAN-komputer>:3000/api/mahasiswa
//   iOS Simulator    : http://localhost:3000/api/mahasiswa
const API_URL = 'http://10.0.2.2:3000/api/mahasiswa';

async function ambilSemuaMahasiswa() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Gagal memuat data mahasiswa (HTTP ${response.status})`);
  }
  const json = await response.json();
  // Beberapa server membungkus daftar pada properti `data`; kode ini menyesuaikan.
  return Array.isArray(json) ? json : json.data;
}

async function ambilMahasiswaById(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Mahasiswa tidak ditemukan (HTTP ${response.status})`);
  }
  return response.json();
}

async function tambahMahasiswa(dataMahasiswa) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataMahasiswa),
  });
  if (!response.ok) {
    throw new Error(`Gagal menyimpan mahasiswa (HTTP ${response.status})`);
  }
  return response.json();
}

async function ubahMahasiswa(id, dataMahasiswa) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataMahasiswa),
  });
  if (!response.ok) {
    throw new Error(`Gagal memperbarui mahasiswa (HTTP ${response.status})`);
  }
  // 204 No Content: server sukses tanpa mengirim isi respons.
  if (response.status === 204) return dataMahasiswa;
  return response.json();
}

async function hapusMahasiswa(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(`Gagal menghapus mahasiswa (HTTP ${response.status})`);
  }
  return true;
}

export { ambilSemuaMahasiswa, ambilMahasiswaById, tambahMahasiswa, ubahMahasiswa, hapusMahasiswa };
```

File: screens/DaftarMahasiswa.js
```js
// screens/DaftarMahasiswa.js — layar daftar mahasiswa dari API.
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, Pressable, RefreshControl,
  StyleSheet, Text, View,
} from 'react-native';
import { ambilSemuaMahasiswa, hapusMahasiswa } from '../api/mahasiswa';

export default function DaftarMahasiswa() {
  const router = useRouter();
  const [mahasiswa, setMahasiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [memuatUlang, setMemuatUlang] = useState(false);

  const muatData = useCallback(async () => {
    try {
      const data = await ambilSemuaMahasiswa();
      setMahasiswa(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setMemuatUlang(false);
    }
  }, []);

  // Muat ulang setiap kali layar kembali menjadi fokus (mis. selesai tambah data).
  useFocusEffect(muatData);

  function saatMenarik() {
    setMemuatUlang(true);
    muatData();
  }

  function cobaLagi() {
    setLoading(true);
    setError(null);
    muatData();
  }

  function kirimKeFormEdit(item) {
    router.push({ pathname: '/mahasiswa/tambah', params: { id: item.id } });
  }

  function konfirmasiHapus(item) {
    Alert.alert('Hapus Data', `Yakin ingin menghapus ${item.nama}?`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => hapusData(item) },
    ]);
  }

  async function hapusData(item) {
    try {
      await hapusMahasiswa(item.id);
      setMahasiswa((sebelum) => sebelum.filter((m) => m.id !== item.id));
    } catch (e) {
      Alert.alert('Gagal Menghapus', e.message);
    }
  }

  if (loading) {
    return (
      <View style={styles.pusat}>
        <ActivityIndicator size="large" color="#1f6feb" />
        <Text style={styles.teksStatus}>Memuat data mahasiswa…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.pusat}>
        <Text style={styles.teksError}>Data tidak dapat dimuat.</Text>
        <Text style={styles.teksStatus}>{error}</Text>
        <Pressable style={styles.tombol} onPress={cobaLagi}>
          <Text style={styles.teksTombol}>Coba Lagi</Text>
        </Pressable>
      </View>
    );
  }

  if (mahasiswa.length === 0) {
    return (
      <View style={styles.pusat}>
        <Text style={styles.teksStatus}>Belum ada data mahasiswa.</Text>
        <Text style={styles.teksStatus}>Gunakan tombol Tambah untuk mengisinya.</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.daftar}
      data={mahasiswa}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.kartu}>
          <View style={styles.barisKartu}>
            <Text style={styles.nama}>{item.nama}</Text>
            <Text style={styles.nim}>{item.nim}</Text>
          </View>
          <Text style={styles.detail}>{item.prodi} · {item.angkatan} · IPK {item.ipk}</Text>
          <View style={styles.barisTombol}>
            <Pressable style={styles.tombolEdit} onPress={() => kirimKeFormEdit(item)}>
              <Text style={styles.teksTombol}>Edit</Text>
            </Pressable>
            <Pressable style={styles.tombolHapus} onPress={() => konfirmasiHapus(item)}>
              <Text style={styles.teksTombol}>Hapus</Text>
            </Pressable>
          </View>
        </View>
      )}
      refreshControl={
        <RefreshControl refreshing={memuatUlang} onRefresh={saatMenarik} />
      }
    />
  );
}

const styles = StyleSheet.create({
  pusat: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  daftar: { flex: 1, padding: 16 },
  kartu: {
    backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  barisKartu: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nama: { fontSize: 16, fontWeight: 'bold', color: '#1c1c1e' },
  nim: { fontSize: 13, color: '#6b7280' },
  detail: { fontSize: 13, color: '#374151', marginTop: 4 },
  barisTombol: { flexDirection: 'row', marginTop: 12, gap: 8 },
  tombolEdit: { backgroundColor: '#1f6feb', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16 },
  tombolHapus: { backgroundColor: '#d93838', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16 },
  tombol: { backgroundColor: '#1f6feb', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24, marginTop: 16 },
  teksTombol: { color: '#ffffff', fontWeight: '600' },
  teksError: { fontSize: 16, fontWeight: '600', color: '#d93838', marginBottom: 8 },
  teksStatus: { fontSize: 14, color: '#6b7280', marginTop: 8, textAlign: 'center' },
});
```

File: screens/FormMahasiswa.js
```js
// screens/FormMahasiswa.js — form tambah/edit mahasiswa terhubung API.
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ambilMahasiswaById, tambahMahasiswa, ubahMahasiswa } from '../api/mahasiswa';

const FORM_AWAL = {
  nim: '', nama: '', prodi: '', angkatan: '', ipk: '', email: '', telepon: '',
};

export default function FormMahasiswa() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const modeEdit = id !== undefined;
  const [form, setForm] = useState(FORM_AWAL);
  const [menyimpan, setMenyimpan] = useState(false);

  // Mode edit: ambil data mahasiswa dari server untuk mengisi form.
  useEffect(() => {
    if (!modeEdit) return;
    (async () => {
      try {
        const data = await ambilMahasiswaById(id);
        setForm({ ...data, angkatan: String(data.angkatan), ipk: String(data.ipk) });
      } catch (e) {
        Alert.alert('Gagal Memuat Data', e.message);
        router.back();
      }
    })();
  }, [modeEdit, id]);

  function ubahField(kunci, nilai) {
    setForm((sebelum) => ({ ...sebelum, [kunci]: nilai }));
  }

  async function simpan() {
    // Validasi minimum; validasi lengkap (format email, panjang NIM, dll.) ada di Bab 8.
    if (Object.values(form).some((nilai) => String(nilai).trim() === '')) {
      Alert.alert('Form Belum Lengkap', 'Semua field wajib diisi sebelum disimpan.');
      return;
    }
    setMenyimpan(true);
    try {
      const payload = { ...form, angkatan: Number(form.angkatan), ipk: Number(form.ipk) };
      if (modeEdit) {
        await ubahMahasiswa(id, payload);
      } else {
        await tambahMahasiswa(payload);
      }
      router.back(); // kembali ke daftar; layar daftar memuat ulang otomatis
    } catch (e) {
      Alert.alert('Gagal Menyimpan', e.message);
    } finally {
      setMenyimpan(false);
    }
  }

  const fieldForm = [
    { kunci: 'nim', label: 'NIM', placeholder: '2201001', keyboard: 'number-pad' },
    { kunci: 'nama', label: 'Nama Lengkap', placeholder: 'Budi Santoso' },
    { kunci: 'prodi', label: 'Program Studi', placeholder: 'Sistem Informasi' },
    { kunci: 'angkatan', label: 'Angkatan', placeholder: '2022', keyboard: 'number-pad' },
    { kunci: 'ipk', label: 'IPK', placeholder: '3.45', keyboard: 'decimal-pad' },
    { kunci: 'email', label: 'Email', placeholder: 'nama@students.univ.ac.id', keyboard: 'email-address' },
    { kunci: 'telepon', label: 'Telepon', placeholder: '08xxxxxxxxxx', keyboard: 'phone-pad' },
  ];

  return (
    <ScrollView style={styles.layar} contentContainerStyle={styles.konten}>
      <Text style={styles.judul}>{modeEdit ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}</Text>
      {fieldForm.map((field) => (
        <View key={field.kunci} style={styles.grupField}>
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            style={styles.input}
            value={form[field.kunci]}
            onChangeText={(nilai) => ubahField(field.kunci, nilai)}
            placeholder={field.placeholder}
            placeholderTextColor="#9ca3af"
            keyboardType={field.keyboard}
          />
        </View>
      ))}
      <Pressable
        style={[styles.tombolSimpan, menyimpan && styles.tombolNonaktif]}
        onPress={simpan}
        disabled={menyimpan}
      >
        <Text style={styles.teksTombol}>{menyimpan ? 'Menyimpan…' : 'Simpan'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f5f7' },
  konten: { padding: 16, paddingBottom: 40 },
  judul: { fontSize: 20, fontWeight: 'bold', color: '#1c1c1e', marginBottom: 16 },
  grupField: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    backgroundColor: '#ffffff', borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db',
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 15,
  },
  tombolSimpan: {
    backgroundColor: '#1f6feb', borderRadius: 8, paddingVertical: 14,
    alignItems: 'center', marginTop: 16,
  },
  tombolNonaktif: { opacity: 0.6 },
  teksTombol: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
});
```

File: app/(app)/mahasiswa/index.js
```js
// Rute Daftar Mahasiswa — memuat komponen layar dari folder screens/.
import DaftarMahasiswa from '../../screens/DaftarMahasiswa';
export default DaftarMahasiswa;
```

File: app/(app)/mahasiswa/tambah.js
```js
// Rute Form Tambah/Edit — parameter `id` (opsional) menjadikannya mode edit.
import FormMahasiswa from '../../screens/FormMahasiswa';
export default FormMahasiswa;
```

### Penjelasan Kode

**`api/mahasiswa.js`** adalah satu-satunya tempat aplikasi berbicara dengan server. Setiap fungsi mengikuti pola yang konsisten: kirim permintaan, periksa `response.ok`, lempar `Error` bila gagal, lalu kembalikan data. Fungsi `tambahMahasiswa` dan `ubahMahasiswa` menyertakan header `Content-Type: application/json` dan body hasil `JSON.stringify` — tanpa keduanya server tidak akan menerima data (400 Bad Request). `hapusMahasiswa` sengaja tidak membaca body karena server umumnya menjawab `204 No Content`; `ubahMahasiswa` menanganinya dengan aman lewat pengecekan `response.status === 204`. Perhatikan juga normalisasi `Array.isArray(json) ? json : json.data` pada `ambilSemuaMahasiswa`, dan alamat server yang hanya hidup di satu konstanta.

**`screens/DaftarMahasiswa.js`** mempraktikkan ketiga keadaan antarmuka dari subbab 10.6. Keadaan loading ditangani variabel `loading` dengan `ActivityIndicator`; keadaan error dengan variabel `error` berisi pesan ramah (pesan teknis dari exception tetap tersimpan di variabel itu untuk dibaca developer) plus tombol "Coba Lagi" yang mengulang permintaan; keadaan empty dengan cek `mahasiswa.length === 0`. `useFocusEffect` dari Expo Router memuat ulang data setiap kali layar kembali menjadi fokus — inilah yang membuat daftar otomatis segar setelah form menyimpan data dan kembali ke daftar. Operasi hapus memakai `Alert.alert` dengan tombol `destructive` sebagai konfirmasi, lalu memperbarui state secara lokal (`filter`) tanpa perlu memuat ulang seluruh daftar.

**`screens/FormMahasiswa.js`** menggunakan parameter rute: `useLocalSearchParams` membaca `id` dari URL; jika `id` ada, komponen masuk mode edit, mengambil data dari server via `ambilMahasiswaById`, dan mengisi form. Angkatan dan IPK dikonversi dengan `String()` saat mengisi form (karena input bertipe teks) dan `Number()` saat menyimpan (karena server menyimpannya sebagai angka). Tombol Simpan dinonaktifkan (`disabled`) dan teksnya berubah selama proses berjalan untuk mencegah permintaan ganda — kebiasaan yang mencegah duplikasi data karena POST tidak idempoten. Validasi di komponen ini sengaja dijaga minimal (field wajib terisi) karena validasi lengkap sudah dibangun di Bab 8.

### Hasil yang Diharapkan

1. Saat aplikasi dibuka pada halaman Daftar Mahasiswa, tampil 5 kartu mahasiswa baku (Budi Santoso, Siti Aminah, Agus Wijaya, Dewi Lestari, Rizky Pratama) lengkap dengan NIM, prodi, angkatan, dan IPK — data berasal dari server, bukan dari kode aplikasi.
2. Terminal server mencatat setiap permintaan masuk: `GET /api/mahasiswa` saat daftar dibuka, `POST /api/mahasiswa` setelah form tambah disimpan, `PUT /api/mahasiswa/<id>` saat edit disimpan, dan `DELETE /api/mahasiswa/<id>` saat hapus dikonfirmasi.
3. Setelah menambah mahasiswa baru, layar daftar (yang kembali menjadi fokus) menampilkan data baru itu. Setelah edit, nama/IPK berubah di daftar. Setelah hapus, kartu yang bersangkutan hilang dari daftar.
4. Saat server dimatikan lalu daftar dimuat ulang, muncul teks "Data tidak dapat dimuat." beserta keterangan dan tombol "Coba Lagi"; setelah server dinyalakan kembali dan tombol ditekan, daftar tampil seperti semula.
5. Pull-to-refresh (menarik daftar ke bawah) menampilkan indikator pemuatan ulang dan menyegarkan data dari server.

### Troubleshooting

**Masalah:** Aplikasi di emulator Android menampilkan "Network request failed" saat membuka daftar.
**Penyebab:** Base URL masih memakai `http://localhost:3000`. Di dalam emulator, `localhost` merujuk ke emulator itu sendiri, bukan ke komputer host tempat server berjalan.
**Solusi:** Ganti `API_URL` menjadi `http://10.0.2.2:3000/api/mahasiswa` pada `api/mahasiswa.js`, lalu muat ulang aplikasi.
**Pencegahan:** Tulis ketiga opsi base URL sebagai komentar di atas konstanta `API_URL` (seperti pada kode praktikum) agar tidak perlu mengingatnya.

**Masalah:** Aplikasi di device fisik tidak dapat mengakses server, padahal emulator bisa.
**Penyebab:** Device fisik adalah mesin terpisah; `10.0.2.2` tidak berlaku, IP yang dipakai salah, atau HP dan komputer tidak berada di jaringan yang sama (atau firewall komputer memblokir port 3000).
**Solusi:** Gunakan `http://<IP-LAN-komputer>:3000` (mis. `http://192.168.1.10:3000`); pastikan keduanya satu Wi-Fi; uji dulu dengan membuka alamat itu di browser HP. Bila perlu, izinkan port 3000 lewat firewall untuk pengujian lokal.
**Pencegahan:** Periksa IP komputer lewat pengaturan jaringan (atau `ipconfig`) sebelum menulis `API_URL`, dan uji alamat dengan browser HP terlebih dahulu.

**Masalah:** Server tidak mau berjalan: muncul keterangan port 3000 sudah dipakai.
**Penyebab:** Ada proses lain (aplikasi atau server lama) yang menempati port 3000.
**Solusi:** Hentikan proses pemakai port tersebut, atau jalankan server pada port lain sesuai dokumentasi backend; jika port diubah, sesuaikan `API_URL`.
**Pencegahan:** Selalu hentikan server buku dengan benar (Ctrl+C) setelah praktikum selesai.

**Masalah:** Aplikasi mendapat respons 404 saat memuat daftar mahasiswa.
**Penyebab:** Path endpoint tidak cocok, misalnya `http://10.0.2.2:3000/mahasiswa` tanpa segmen `/api`, atau penamaan endpoint berbeda.
**Solusi:** Bandingkan path pada `API_URL` dengan `backend/README.md`; verifikasi dengan membuka path langsung di browser (harus tampil JSON, bukan "Cannot GET").
**Pencegahan:** Selalu uji endpoint dengan browser/Postman sebelum menuliskannya di aplikasi, dan simpan path pada satu konstanta saja.

**Masalah:** Permintaan sukses (200) tetapi daftar di aplikasi tetap kosong.
**Penyebab:** Bentuk respons berbeda dari dugaan: server mengembalikan array langsung, sementara aplikasi mengharapkan properti `data` (atau sebaliknya), sehingga hasil parsing salah.
**Solusi:** Tambahkan sementara `console.log(json)` pada `ambilSemuaMahasiswa` untuk melihat bentuk asli respons; kode normalisasi `Array.isArray(json) ? json : json.data` pada praktikum ini sudah mengakomodasi kedua bentuk.
**Pencegahan:** Tetapkan kontrak bentuk respons di `backend/README.md` dan patuhi saat menulis klien API.

**Masalah:** Saat menguji lewat `npx expo start --web`, permintaan diblokir dengan pesan CORS.
**Penyebab:** Browser membatasi permintaan lintas asal (cross-origin); aplikasi mobile asli (emulator/device) tidak menerapkan pembatasan ini.
**Solusi:** Aktifkan middleware CORS pada server (lihat keterangan di `backend/README.md`), atau lakukan pengujian utama di emulator/device, bukan di browser.
**Pencegahan:** Jadikan emulator/device sebagai target utama praktikum bab ini; gunakan mode web hanya jika backend sudah mengizinkan CORS.

## Studi Kasus

Sebuah kampus menengah memiliki tiga sistem yang berjalan terpisah: aplikasi web akademik berbasis PHP, aplikasi mobile untuk mahasiswa, dan sistem informasi kepegawaian untuk dosen. Setiap kali data mahasiswa berubah — misalnya pembaruan IPK — ketiga sistem itu menolak sinkron: mahasiswa melihat nilai berbeda di aplikasi mobile dan web. Analisis menunjukkan akar masalahnya adalah data yang terduplikasi di tiga tempat tanpa satu sumber kebenaran. Solusi yang dipilih pihak kampus adalah membangun satu REST API pusat (serupa `backend/` buku ini, tetapi dengan database sungguhan) yang menjadi satu-satunya pintu data; aplikasi web, mobile, dan kepegawaian semuanya menjadi client dari API tersebut.

Kasus ini menunjukkan keterkaitan langsung antara materi bab dan dunia Sistem Informasi. Pemisahan client–server (subbab 10.1) mewujudkan satu sumber kebenaran: siapa pun yang mengubah data harus lewat API, sehingga tidak ada lagi versi data yang berbeda. Pemilihan REST (subbab 10.2) memungkinkan tiga client berbeda teknologi (PHP, React Native, dan sistem lain) berbicara dengan satu bahasa HTTP/JSON. Namun kasus ini juga memperlihatkan trade-off yang harus dikelola: API pusat menjadi **titik kegagalan tunggal** (single point of failure) — jika mati, semua sistem kehilangan data sekaligus. Mitigasi yang dipraktikkan pada bab ini ada dua sisi: sisi server menjaga ketersediaan (status code 5xx yang jujur, pengawasan log), dan sisi aplikasi menjaga pengalaman pengguna lewat loading/error/empty state (subbab 10.6) serta retry yang sopan. Kampus itu juga belajar bahwa kontrak API harus didokumentasikan — itulah fungsi `backend/README.md` — dan bahwa API versi mendatang sebaiknya diberi nomor versi (misalnya `/api/v1/`) agar perubahan tidak memutus client lama. Keterampilan menganalisis kebutuhan integrasi semacam ini adalah bekal untuk tahap selanjutnya buku ini, termasuk Project Akhir: Sistem Informasi Akademik Mobile yang memakai REST API dengan pola yang sama.

## Latihan

### Soal Pemahaman

1. Jelaskan perbedaan peran client dan server dalam arsitektur aplikasi mobile, dan beri satu alasan mengapa data tidak disimpan langsung di aplikasi saja.
2. Apa yang dimaksud dengan resource dalam REST? Berikan dua contoh resource beserta endpoint-nya dalam konteks sistem akademik.
3. Mengapa POST bersifat tidak idempoten, sedangkan GET idempoten? Apa implikasinya terhadap desain tombol Simpan pada form?
4. Apa perbedaan makna status code 400, 401, dan 404? Berikan satu skenario nyata untuk masing-masing.
5. Mengapa body permintaan POST harus diserialisasi dengan `JSON.stringify`? Apa yang terjadi jika header `Content-Type` tidak disertakan?
6. Mengapa fetch tidak melempar error saat server menjawab 500? Bagaimana cara yang benar menangani situasi tersebut?

### Soal Praktik

1. Ubah `api/mahasiswa.js` agar fungsi `ubahMahasiswa` memakai `PATCH` yang hanya mengirim field `ipk`. Uji hasilnya dan catat perbedaan perilaku dengan `PUT` pada server buku.
2. Tambahkan parameter `q` (query) pada fungsi `ambilSemuaMahasiswa` sehingga URL menjadi `GET /api/mahasiswa?q=...` untuk pencarian sederhana, jika server mendukungnya (lihat `backend/README.md`).
3. Buat layar `screens/DetailMahasiswa.js` yang memanggil `ambilMahasiswaById` dan menampilkan seluruh field mahasiswa; sambungkan tombol pada kartu daftar ke layar tersebut.
4. Ganti tombol "Coba Lagi" dengan `RefreshControl` pada keadaan error sehingga pengguna bisa menarik layar untuk mengulang permintaan.

### Soal Analisis

1. Analisis aplikasi mobile favoritmu: manakah data yang menurutmu diambil dari API (dinamis) dan mana yang statis di aplikasi? Bagaimana kamu bisa membedakannya dari perilaku aplikasi? Kaitkan jawabanmu dengan konsep client–server dan status code.
2. Bandingkan biaya desain (trade-off) antara memisahkan seluruh logika jaringan ke satu file `api/mahasiswa.js` versus menulis fetch langsung di tiap layar, jika aplikasi tumbuh menjadi 20 layar dan 4 resource data.

## Tantangan

1. **Integrasi menyeluruh:** sambungkan halaman Detail Mahasiswa (`app/(app)/mahasiswa/[id].js`) ke `ambilMahasiswaById` dengan tiga keadaan UI: loading, error (termasuk 404 "Mahasiswa tidak ditemukan"), dan sukses. Bandingkan pengalaman pengguna sebelum dan sesudah.
2. **Cache offline sederhana:** gunakan AsyncStorage (pengantar di Bab 11) untuk menyimpan daftar mahasiswa terakhir yang berhasil dimuat; saat permintaan gagal, tampilkan data cadangan itu bersama keterangan "Data mungkin tidak terbaru". Ini mensimulasikan mode offline yang dibahas di Bab 11.
3. **State bersama:** pindahkan data mahasiswa dan fungsi pemuatannya ke Context (Bab 9) sehingga layar Daftar dan Detail berbagi satu sumber data tanpa memuat ulang berulang kali, lalu evaluasi kapan pendekatan ini justru menyulitkan.

## Rangkuman

1. Arsitektur client–server memisahkan aplikasi (client) dari data (server) demi satu sumber kebenaran, keamanan, dan kontrol; harga yang harus dibayar adalah ketergantungan pada jaringan dan latensi.
2. REST memandang data sebagai resource dengan endpoint unik, dipetakan ke metode HTTP: GET (baca), POST (cipta), PUT/PATCH (ubah), DELETE (hapus).
3. GET aman dan idempoten; POST tidak idempoten sehingga tombol simpan perlu dinonaktifkan saat proses berjalan.
4. Status code adalah bahasa bersama client–server: 2xx sukses, 4xx kesalahan client (400, 401, 404), 5xx kesalahan server (500).
5. JSON adalah format pertukaran data utama REST; objek JavaScript diserialisasi dengan `JSON.stringify` dan diurai kembali dengan `response.json()`.
6. fetch adalah API bawaan JavaScript: hanya melempar error pada kegagalan jaringan, sehingga pola `if (!response.ok) throw` wajib dipakai untuk status code non-2xx.
7. Tiga keadaan antarmuka — loading (ActivityIndicator), error (pesan ramah + aksi), dan empty — menjaga pengalaman pengguna saat komunikasi jaringan berlangsung.
8. Base URL bergantung pada tempat aplikasi berjalan: `10.0.2.2` untuk emulator Android, IP LAN untuk device fisik, `localhost` untuk iOS Simulator.
9. API produksi melindungi diri dengan autentikasi token melalui header `Authorization: Bearer <token>`; detailnya ada di Bab 13.
10. Pola fetch + tiga keadaan UI di bab ini dipakai kembali di Bab 11 (penyimpanan lokal) dan menjadi fondasi integrasi Project Akhir.

## Refleksi

1. Pernahkah kamu menggunakan aplikasi yang membeku tanpa tanda pemuatan, atau menampilkan pesan error mentah? Apa perasaanmu sebagai pengguna, dan bagaimana bab ini mengubah cara kamu merancang aplikasi sendiri?
2. Dari ketiga base URL (emulator, device, simulator), mana yang paling membingungkan bagimu dan mengapa? Strategi apa yang akan kamu pakai agar tidak salah lagi?
3. Menurutmu, keterampilan apa dari bab ini yang paling berguna di dunia kerja — membaca status code, merancang klien API, atau menangani keadaan error? Mengapa?
4. Jika kamu harus menjelaskan REST kepada teman non-programmer dengan analogi restoran dari subbab 10.1, bagaimana versimu?

## Evaluasi Bab

### Pilihan Ganda

1. Peran utama server dalam arsitektur client–server adalah…
   A. Menampilkan antarmuka pengguna
   B. Menyimpan dan mengelola data sebagai satu sumber kebenaran
   C. Menggantikan kebutuhan jaringan internet
   D. Menjalankan aplikasi di ponsel pengguna

2. Karakteristik utama REST yang membuat server mudah diskalakan adalah…
   A. Stateless — setiap permintaan berdiri sendiri
   B. Selalu memakai XML sebagai format data
   C. Wajib memakai database relasional
   D. Stateful — server mengingat percakapan sebelumnya

3. Operasi CRUD "mencipta data baru" dipetakan ke metode HTTP…
   A. GET
   B. PUT
   C. POST
   D. DELETE

4. Status code 401 berarti…
   A. Permintaan berhasil
   B. Resource tidak ditemukan
   C. Client tidak terautentikasi
   D. Server mengalami kegagalan internal

5. Sebuah permintaan `PUT /api/mahasiswa/1` yang dikirim dua kali dengan body sama menghasilkan keadaan yang sama. Sifat ini disebut…
   A. Stateful
   B. Idempoten
   C. Asinkron
   D. Normalisasi

6. Fungsi `JSON.stringify` pada permintaan POST berfungsi untuk…
   A. Mengubah teks JSON menjadi objek JavaScript
   B. Menambah header Content-Type
   C. Mengubah objek JavaScript menjadi teks JSON
   D. Memeriksa status code respons

7. fetch tidak melempar error ketika server menjawab 500. Pernyataan yang benar adalah…
   A. Status 500 dianggap sukses oleh fetch
   B. Kita harus memeriksa `response.ok` dan melempar error sendiri
   C. Error 500 hanya bisa dideteksi lewat `console.log`
   D. fetch memang mendesain ulang error 500 menjadi `null`

8. Base URL yang tepat untuk mengakses server buku dari emulator Android adalah…
   A. `http://localhost:3000`
   B. `http://10.0.2.2:3000`
   C. `http://192.168.1.10:3000`
   D. `http://server-buku:3000`

### Soal Uraian

1. Gambarkan alur lengkap sebuah permintaan POST (dari form tambah mahasiswa) hingga data muncul kembali di layar daftar, dengan menyebutkan: bagian request, status code yang mungkin diterima, dan peran `useFocusEffect`. Minimal 3 paragraf.
2. Jelaskan bagaimana ketiga keadaan UI (loading, error, empty) diterapkan pada layar daftar mahasiswa praktikum: kapan masing-masing muncul, komponen apa yang dipakai, dan apa yang terjadi saat pengguna menekan "Coba Lagi".
3. Bandingkan `PUT` dan `PATCH` dalam konteks mengubah IPK mahasiswa: data apa yang dikirim untuk masing-masing metode, bagaimana sifat idempotensinya, dan kapan kita memilih salah satunya berdasarkan kebutuhan API.

### Kunci Jawaban

<details>
<summary>Klik untuk membuka kunci jawaban Pilihan Ganda</summary>

1. B — Server menyimpan dan mengelola data sebagai satu sumber kebenaran.
2. A — Semua permintaan REST berdiri sendiri (stateless) sehingga server mudah diskalakan.
3. C — Create dipetakan ke POST.
4. C — 401 Unauthorized berarti client belum/ tidak terautentikasi.
5. B — Mengulang permintaan dengan data sama menghasilkan keadaan yang sama (idempoten).
6. C — `JSON.stringify` mengubah objek JavaScript menjadi teks JSON untuk body HTTP.
7. B — fetch hanya melempar error untuk kegagalan jaringan; status non-2xx harus diperiksa lewat `response.ok`.
8. B — `10.0.2.2` adalah alias host dari dalam emulator Android.
</details>