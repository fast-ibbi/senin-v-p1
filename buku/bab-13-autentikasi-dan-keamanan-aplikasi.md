# BAB 13 — Autentikasi dan Keamanan Aplikasi

## Deskripsi Singkat

Bab ini membahas cara mengamankan aplikasi mobile dengan **autentikasi** (pembuktian identitas pengguna) dan **otorisasi** (pemberian hak akses). Anda akan membangun alur lengkap login → terima token → simpan token secara aman → akses API dengan token → logout, memakai backend buku (endpoint `/api/auth/login` dan `/api/auth/register`). Bab ini menyempurnakan materi navigasi Bab 7 (protected screen), API Bab 10, penyimpanan lokal Bab 11, serta privasi perangkat Bab 12, sekaligus menjadi bekal prinsip keamanan yang dibutuhkan pada Project Akhir.

## Tujuan Pembelajaran

Setelah mempelajari bab ini, mahasiswa mampu:

1. Menjelaskan perbedaan autentikasi dan otorisasi beserta contoh penerapannya pada aplikasi sistem informasi.
2. Mengidentifikasi alur login dan register pada REST API serta membandingkan mekanisme session dan token.
3. Menganalisis struktur JWT (header, payload, signature) dan alasan mengapa token membuat server stateless.
4. Mengimplementasikan protected route dengan `Redirect` untuk menjaga halaman yang memerlukan login.
5. Menerapkan penyimpanan token dengan `expo-secure-store` dan menjelaskan alasan SecureStore lebih aman daripada AsyncStorage.
6. Mengevaluasi prinsip keamanan API: validasi input sisi server, larangan menyimpan secret di aplikasi, HTTPS, dan least privilege.

## Peta Konsep

```text
Autentikasi dan Keamanan Aplikasi
│
├─ 13.1 Authentication vs Authorization
│     siapa kamu (auth)  →  boleh apa (authorization)
├─ 13.2 Login, Register, dan Session
│     kredensial → verifikasi → hak akses; session (state server) vs token
├─ 13.3 Token dan JWT
│     header . payload . signature → stateless, tidak terenkripsi
├─ 13.4 Protected Route
│     lapis klien (Redirect) + lapis server (middleware)
├─ 13.5 Penyimpanan Token
│     AsyncStorage (teks biasa) vs SecureStore (enkripsi keystore)
├─ 13.6 API Security
│     validasi server, tanpa secret di klien, HTTPS, least privilege
└─ 13.7 Alur Lengkap: login → token → akses API → logout
```

## Materi

### 13.1 Authentication vs Authorization

Dua istilah yang sering tertukar tetapi memiliki makna dan peran yang berbeda. **Authentication** (autentikasi) adalah proses pembuktian bahwa pengguna benar-benar pihak yang ia klaim, sedangkan **authorization** (otorisasi) adalah proses penentuan hak akses apa saja yang boleh dilakukan oleh pengguna yang sudah terbukti identitasnya. Urutannya selalu tetap: autentikasi dulu, otorisasi kemudian. Autentikasi menjawab pertanyaan "siapa kamu?", sedangkan otorisasi menjawab "apa yang boleh kamu lakukan?".

Contoh sederhana di dunia nyata: saat masuk gedung perkantoran, Anda menunjukkan kartu identitas kepada petugas keamanan — inilah autentikasi. Setelah identitas Anda terbukti, petugas memeriksa lencana akses Anda untuk menentukan lantai mana saja yang boleh dimasuki — inilah otorisasi. Kartu KTP membuktikan siapa Anda, tetapi tidak otomatis memberi Anda izin memasuki ruang server.

Pada sistem informasi akademik (SIAKAD), perbedaannya terlihat jelas. Saat mahasiswa mengetik email dan kata sandi lalu menekan tombol Masuk, sistem melakukan autentikasi: mencocokkan **credential** (kredensial, yaitu identitas pengguna) dengan data yang tersimpan. Setelah terbukti, sistem membaca **role** (peran) pengguna, misalnya `mahasiswa`, `dosen`, atau `admin`, lalu menentukan otorisasi: mahasiswa hanya boleh melihat nilai miliknya sendiri, dosen boleh menginput nilai mata kuliah yang diampunya, dan admin boleh mengelola data seluruh pengguna. Peran yang sama tetap menjalani autentikasi yang sama; yang membedakan adalah hasil otorisasinya.

Dalam kode aplikasi, otorisasi biasanya muncul sebagai pemeriksaan seperti "jika peran pengguna adalah admin, tampilkan tombol tambah data". Namun perlu diingat: pemeriksaan di sisi aplikasi hanyalah kenyamanan antarmuka. Keputusan otorisasi yang sesungguhnya harus dijatuhkan oleh server, karena pengguna dapat memodifikasi aplikasi klien (lihat 13.6).

### 13.2 Login, Register, dan Session

**Login** (masuk) adalah proses pengguna memberikan kredensial (biasanya email dan kata sandi) untuk dibuktikan kebenarannya oleh server. **Register** (pendaftaran) adalah proses pembuatan akun baru. Pada backend buku (folder `backend/`, cara menjalankannya dijelaskan di Bab 10 dan `backend/README.md`), kedua proses ini disediakan sebagai endpoint REST:

- `POST /api/auth/register` — menerima `{ nama, email, password }`, memvalidasi data, kemudian membuat akun baru. Respons sukses umumnya berstatus `201 Created`.
- `POST /api/auth/login` — menerima `{ email, password }`, mencocokkan dengan data pengguna, lalu mengembalikan token apabila cocok. Respons sukses berstatus `200 OK`; bila kredensial salah, server mengembalikan `401 Unauthorized`.

*⚠ version-sensitive: bentuk pasti respons (nama field, misalnya `token` dan `user`) mengikuti `backend/README.md` — sesuaikan kode pada 13.7 bila berbeda.*

Satu aturan keamanan yang tidak bisa ditawar pada sisi server: kata sandi tidak pernah disimpan sebagai teks polos. Server menyimpan hasil **hashing** (pengacakan satu arah) kata sandi, misalnya dengan algoritma seperti bcrypt, ditambah *salt* agar dua pengguna dengan kata sandi sama menghasilkan nilai hash yang berbeda. Fungsi hash bersifat satu arah: dari nilai hash tidak dapat diperoleh kembali kata sandi aslinya. Di sisi klien, kata sandi juga tidak boleh dicetak ke layar, disimpan, atau dimasukkan ke dalam log — pada buku ini kata sandi selalu ditulis sebagai placeholder `••••••••` (baca aturan pada format buku: "password tidak pernah ditampilkan polos").

Setelah login berhasil, aplikasi membutuhkan cara untuk "mengingat" bahwa pengguna sudah terautentikasi. Ada dua mekanisme utama: **session** (sesi) dan **token** (tanda akses).

**Session** bekerja dengan menyimpan state di server: server membuat catatan sesi (misalnya di memori atau basis data), memberikan sebuah **session ID** kepada klien, dan setiap permintaan klien berikutnya membawa ID tersebut agar server dapat mencocokkannya. Keunggulan utamanya adalah server dapat mencabut sesi kapan saja (misalnya saat pengguna logout atau akun dibekukan). Kelemahannya, server harus menyimpan dan mencari state pada setiap permintaan, sehingga saat aplikasi tumbuh dan server digandakan (horizontal scaling), sesi harus dibagikan di antara banyak server — ini menambah kompleksitas infrastruktur.

**Token** bekerja sebaliknya: server tidak menyimpan apa pun. Setelah autentikasi berhasil, server menerbitkan token — sebuah "surat pas" digital — dan klien menyimpannya. Setiap permintaan berikutnya klien menyertakan token tersebut, dan server cukup memverifikasi keabsahannya tanpa mencari catatan di basis data. Perbandingannya dirangkum pada Tabel 13.1.

| Aspek | Session | Token |
|-------|---------|-------|
| State di server | Disimpan (basis data/memori) | Tidak disimpan (stateless) |
| Pencabutan | Mudah: hapus sesi di server | Sulit: tunggu token kedaluwarsa |
| Skalabilitas | Perlu infrastruktur berbagi sesi | Server dapat ditambah bebas |
| Cocok untuk | Aplikasi web tradisional | REST API dan aplikasi mobile |

Pada aplikasi mobile yang berbicara dengan REST API, pola token lebih lazim: server API dirancang stateless sehingga mudah diskalakan, dan aplikasi tidak bergantung pada *cookie* browser seperti aplikasi web. Bab 10 telah memperkenalkan konsep ini secara pengantar; bab ini membahasnya secara utuh.

*Mengapa teknologi ini ada?* Token lahir dari kebutuhan merancang API yang melayani banyak klien (web, mobile, perangkat IoT) tanpa server harus mengingat siapa yang sedang masuk. Konsekuensinya, kekuatan token ada di tangannya sendiri: siapa pun yang memegang token yang sah dianggap sebagai pemiliknya. Karena itu, token yang baik harus (1) hanya bisa diterbitkan oleh server, (2) memiliki masa berlaku, dan (3) disimpan dengan aman oleh klien — tiga hal yang dibahas pada 13.3 dan 13.5.

### 13.3 Token dan JWT (Konseptual)

Ada banyak format token; yang paling populer untuk REST API adalah **JWT** (*JSON Web Token*, tanda akses berbentuk JSON yang ditandatangani). JWT adalah string panjang berisi tiga bagian yang dipisahkan titik:

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMjAxMDAxIiwibmFtYSI6IkJ1ZGkgU2FudG9zbyIsImlhdCI6MTc2NzIwMDAwMCwiZXhwIjoxNzY3MjA2MDAwfQ.4kA8xnW9yYkuz3CvQfW2n0Z4kzv3YJm8rPzFqBceLl8
```

Ketiga bagian tersebut adalah:

1. **Header** — menyatakan algoritma penandatanganan dan jenis token, misalnya `{"alg":"HS256","typ":"JWT"}`.
2. **Payload** — berisi **claim** (klaim, yaitu pernyataan tentang pengguna), misalnya `sub` (subject, subjek: identitas pengguna), `nama`, `iat` (issued at, waktu diterbitkan), dan `exp` (expiration, waktu kedaluwarsa).
3. **Signature** — hasil perhitungan kriptografis dari header dan payload menggunakan **secret key** (kunci rahasia) yang hanya diketahui server, misalnya `HMAC-SHA256(header.payload, secret)`.

Cara membaca token di atas: bagian pertama dan kedua adalah teks yang di-*encode* dengan **base64url** (penyandian agar karakter JSON aman disimpan dalam string), dan bagian ketiga adalah tanda tangan. Tanda tangan inilah yang membuat JWT tidak dapat dipalsukan: siapa pun yang mengubah satu huruf pun pada header atau payload akan membuat tanda tangan tidak cocok lagi saat diverifikasi server.

Satu kesalahpahaman yang penting diluruskan: **JWT bukan enkripsi**. Header dan payload hanya di-encode, bukan dirahasiakan — siapa pun dapat mendekode dan membacanya (contoh pada bagian Contoh bab ini). Konsekuensinya: jangan pernah menaruh kata sandi, nomor kartu, atau data rahasia lain ke dalam payload JWT. Yang dilindungi tanda tangan hanyalah *keutuhan* dan *keaslian* token, bukan *kerahasiaan* isinya.

Mengapa JWT disebut membuat server stateless? Karena verifikasi hanya memerlukan secret key dan aritmetika: server menghitung ulang tanda tangan dari header dan payload yang diterima, lalu membandingkannya dengan tanda tangan yang dikirim. Tidak ada pencarian ke basis data untuk memastikan "apakah token ini masih berlaku di sistem kami?" — yang ada hanyalah pemeriksaan tanda tangan dan klaim `exp`. Server mana pun yang mengetahui secret key dapat memverifikasi token yang sama, sehingga infrastruktur mudah digandakan.

Trade-off dari stateless ini adalah kesulitan pencabutan: server tidak punya daftar token yang "sudah dicabut", sehingga token yang dicuri tetap berlaku sampai `exp` tercapai. Pola umum untuk mengurangi risikonya: terbitkan token akses berumur pendek (misalnya 15 menit–1 jam) dan gunakan **refresh token** (token penyegar, berumur panjang) untuk menerbitkan token akses baru tanpa meminta pengguna login lagi. Dengan begitu, masa pakai token curian diperpendek tanpa mengorbankan kenyamanan pengguna. Konsep refresh token cukup dipahami sebagai gambaran umum pada bab ini; implementasinya dapat menjadi pengembangan pada bagian Tantangan.

### 13.4 Protected Route

**Protected route** (rute yang dilindungi) adalah halaman yang hanya boleh diakses oleh pengguna yang sudah login. Bab 7 telah memperkenalkan pola dasar protected screen dengan pemeriksaan kondisi statis; pada bab ini pola tersebut dihidupkan dengan state autentikasi sungguhan.

Perlu dipahami dengan jujur: proteksi di sisi aplikasi hanyalah *lapis pengalaman pengguna* (UX). Fungsinya mengarahkan pengguna yang belum login ke halaman masuk, bukan mengamankan data. Keamanan data yang sebenarnya berada di sisi server: rute API yang sensitif harus menolak permintaan tanpa token yang sah, biasanya melalui **middleware** (perantara, fungsi yang dipasang di antara permintaan dan penangan rute) yang memeriksa header `Authorization`. Pada backend buku, proteksi ini tersedia sebagai middleware opsional di folder `backend/` — cara mengaktifkannya dijelaskan pada `backend/README.md` (lihat juga praktikum bab ini). *⚠ version-sensitive: nama dan cara aktivasi middleware mengikuti `backend/README.md`.*

Dengan pola dari Bab 7, alur proteksi klien adalah: aplikasi memiliki halaman pengarah (`app/index.js`) yang memeriksa status autentikasi; kelompok rute yang dilindungi dibungkus dalam satu folder (`app/(app)/`) dengan file `_layout.js` yang memutuskan menampilkan isi rute atau mengarahkan ulang ke `/login`; dan semua rute di luar kelompok tersebut (seperti `app/login.js`) bebas diakses. Saat status autentikasi masih diperiksa (token sedang dibaca dari penyimpanan), aplikasi menampilkan indikator pemuatan agar pengguna tidak melihat layar berkedip berpindah-pindah. Detail kode pola ini ada pada bagian Contoh dan Praktikum.

### 13.5 Penyimpanan Token dan Secure Storage

Token adalah "kunci" akses pengguna: siapa pun yang memegangnya dapat berpura-pura menjadi pengguna tersebut sampai token kedaluwarsa. Oleh karena itu, tempat token disimpan menentukan tingkat keamanan aplikasi secara keseluruhan. Bab 11 memperkenalkan **AsyncStorage** — penyimpanan pasangan kunci-nilai yang sederhana dan mampu menyimpan data apa pun dalam bentuk teks. AsyncStorage sangat cocok untuk data non-sensitif seperti draft catatan (Bab 11) atau cache (Bab 11). Namun untuk token, AsyncStorage bukan pilihan yang tepat: nilainya disimpan tanpa enkripsi, mudah dibaca pada perangkat yang di-*root*/*jailbreak*, dan ikut tersalin ke cadangan (*backup*) perangkat.

Solusi yang tepat adalah **SecureStore** dari Expo (`expo-secure-store`): penyimpanan aman yang memanfaatkan mekanisme keamanan perangkat keras-*software* bawaan — di Android, nilai dienkripsi dengan kunci dari **Android Keystore**; di iOS, nilai disimpan di **Keychain**. Dengan kata lain, token disimpan dalam bentuk terenkripsi dan hanya dapat dibaca oleh aplikasi itu sendiri. Tabel 13.2 merangkum perbandingannya.

| Aspek | AsyncStorage (Bab 11) | SecureStore (bab ini) |
|-------|-----------------------|----------------------|
| Enkripsi | Tidak (teks polos) | Ya (Keystore / Keychain) |
| Ikut backup perangkat | Ya | Tidak disarankan |
| Ukuran nilai | Besar (bebas) | ±2 KB per nilai (*cek docs*) |
| Cocok untuk | Data non-sensitif, cache | Token, PIN, rahasia kecil |

*⚠ version-sensitive: batas ukuran dan perilaku platform SecureStore dapat berubah antarversi SDK — periksa docs.expo.dev saat menulis kode produksi.*

API SecureStore yang dipakai hanya tiga fungsi: `setItemAsync(kunci, nilai)` untuk menyimpan, `getItemAsync(kunci)` untuk membaca (mengembalikan `null` bila belum ada), dan `deleteItemAsync(kunci)` untuk menghapus. Pemasangannya memakai perintah khusus Expo agar versinya cocok dengan SDK:

```bash
npx expo install expo-secure-store
```

*Mengapa teknologi ini ada?* Device storage yang "biasa" (berkas, AsyncStorage) menempatkan data di area yang dapat dibaca oleh sistem dan proses lain pada kondisi tertentu; padahal token bernilai seperti uang tunai digital. Keystore dan Keychain hadir sebagai area penyimpanan khusus yang mengunci data dengan kunci kriptografis yang tidak pernah keluar dari area aman perangkat. Trade-offnya: SecureStore hanya untuk nilai kecil, sehingga data besar tetap memakai AsyncStorage — pembagian tugas inilah yang dipraktikkan pada project aplikasi mahasiswa Anda.

### 13.6 API Security, Validasi Input, HTTPS, Least Privilege

Mengamankan aplikasi tidak berhenti pada login. Empat prinsip berikut adalah minimum yang harus dipahami setiap pengembang:

**1. Validasi input di sisi server — jangan percaya payload.** Validasi yang Anda tulis di layar form (Bab 8) bertujuan kenyamanan pengguna: memberi umpan balik cepat sebelum permintaan dikirim. Akan tetapi pengirim permintaan tidak selalu aplikasi Anda — siapa pun dapat memanggil endpoint langsung dengan alat seperti curl atau aplikasi penguji API. Karena itu server wajib memvalidasi ulang setiap data yang diterima: tipe data, panjang, format email, keberadaan field, dan nilai-nilai yang diperbolehkan. Input yang tidak lolos ditolak, bukan disimpan. Begitu pula, data dari klien tidak pernah dirangkai langsung menjadi perintah basis data (rentan **SQL injection**, penyuntikan perintah SQL); server memakai kueri terparameterisasi. Prinsipnya satu kalimat: klien adalah lingkungan yang tidak dapat dipercaya, sekalipun aplikasi itu buatan Anda sendiri.

**2. Jangan menyimpan secret key di aplikasi.** Kode JavaScript aplikasi pada akhirnya dibundel menjadi berkas yang dikirim ke perangkat pengguna, dan berkas tersebut dapat dibongkar (di-unpack) dari APK. Kunci rahasia penandatangan JWT, kunci API pihak ketiga, atau kata sandi basis data tidak boleh ada di kode klien — begitu satu pengguna membongkar aplikasi, seluruh pengguna terancam. Sekret semacam itu hanya hidup di server (atau disimpan sebagai environment variable pada saat build, lihat Bab 15). Di sisi klien, yang boleh disimpan hanyalah *hasil* dari proses otentikasi (token), itupun di tempat aman (13.5).

**3. HTTPS — mengapa wajib.** Tanpa HTTPS, seluruh lalu lintas antara aplikasi dan server dikirim sebagai teks polos: email, kata sandi, dan token dapat dibaca siapa pun yang berada di jalur jaringan yang sama (misalnya Wi-Fi publik kampus) — teknik ini dikenal sebagai **man-in-the-middle** (penyadapan di tengah, sering disingkat MITM). HTTPS mengenkripsi komunikasi dengan **TLS** (*Transport Layer Security*, protokol keamanan lapisan transport), sehingga isi permintaan dan respons tidak dapat dibaca oleh penyadap. Android sejak versi 9 (API 28) memblokir lalu lintas **cleartext** (teks polos, HTTP tanpa enkripsi) pada build produksi secara bawaan. *⚠ version-sensitive: pada pengembangan lokal, Expo Go mengizinkan HTTP ke `localhost` agar praktikum di kelas tetap berjalan tanpa server HTTPS — ini pengecualian untuk pengembangan, bukan untuk produksi; kebijakan cleartext Expo Go dapat berubah antarversi.* Untuk produksi, server wajib HTTPS dengan sertifikat yang valid. Ringkasnya: HTTP hanya untuk mesin pengembangan lokal sendiri; HTTPS untuk segala hal lain.

**4. Least privilege (hak akses paling kecil).** Prinsip ini berbunyi: beri setiap pengguna, fungsi, dan aplikasi hanya hak yang benar-benar diperlukan — tidak lebih. Penerapannya di aplikasi mobile berlapis. Pada izin perangkat, Bab 12 telah menekankan pentingnya meminta izin sesedikit mungkin dan pada saat fitur benar-benar dipakai (misalnya izin kamera baru diminta ketika pengguna menekan tombol foto), bukan sekaligus saat aplikasi dibuka. Pada API, token sebaiknya membawa klaim sesedikit mungkin dan akses dibatasi per peran: aplikasi mahasiswa tidak perlu menerima hak admin hanya karena pengguna login berhasil. Least privilege mengurangi "luas permukaan serangan": bila satu hak bocor, dampaknya terbatas.

### 13.7 Contoh Alur: Login → Token → Akses API → Logout

Seluruh materi bab ini menyatu dalam satu alur yang menjadi tulang punggung praktikum:

```text
┌─────────┐  1. kirim email+password   ┌──────────┐
│  Login  │ ──────────────────────────► │  Server  │
│  (klien)│ ◄────────────────────────── │  (auth)  │
└─────────┘  2. terima token (JWT)      └──────────┘
      │
      ▼
┌──────────────┐  3. simpan token
│ SecureStore  │  (terenkripsi, bukan AsyncStorage)
└──────────────┘
      │
      ▼
┌──────────────┐  4. tiap panggilan API: header
│  API klien   │  Authorization: Bearer <token>
└──────────────┘
      │
      ▼
┌──────────────┐  5. logout: hapus token dari
│  Logout      │  SecureStore → Redirect ke /login
└──────────────┘
```

Empat keputusan desain dalam alur ini: token diterima hanya dari server yang sah (13.3), disimpan terenkripsi (13.5), dikirim ulang pada setiap permintaan melalui header `Authorization` dengan skema `Bearer <token>` (pola baku yang dipahami semua server), dan dihapus saat logout — karena logout pada arsitektur token berarti *membuang kunci di sisi klien*; server tidak memiliki sesi untuk ditutup. Bila token hilang atau kedaluwarsa, permintaan berikutnya akan ditolak server dengan status `401`, dan aplikasi harus mengarahkan pengguna kembali ke halaman login.

## Contoh

**Contoh 13.1 — Membaca bagian-bagian JWT (konseptual).** Untuk memahami bahwa JWT hanya di-encode (bukan dienkripsi), perhatikan fungsi kecil berikut yang memecah token menjadi tiga bagian:

File: utils/pemeriksaJwt.js
```js
// Memecah JWT menjadi tiga bagian untuk keperluan pembelajaran
export function periksaJwt(token) {
  const bagian = token.split('.');
  if (bagian.length !== 3) {
    return { keterangan: 'Bukan JWT yang valid' };
  }
  return {
    header: bagian[0],   // berisi algoritma
    payload: bagian[1],  // berisi klaim pengguna
    signature: bagian[2], // penanda keaslian
  };
}
```

Penjelasan: token yang valid selalu terdiri dari tepat tiga bagian yang dipisahkan titik. Fungsi ini membaginya agar Anda dapat mengamati bahwa bagian header dan payload hanyalah teks (bisa dibaca siapa pun bila didekode), sedangkan signature adalah hasil kriptografis. Fungsi ini hanya untuk pembelajaran; pada aplikasi produksi, verifikasi JWT sepenuhnya dilakukan server, dan bila klien perlu membaca klaim, gunakan pustaka yang sudah mapan (misalnya `jwt-decode`). *⚠ version-sensitive: nama dan pemakaian pustaka dekode periksa di dokumentasinya.*

**Contoh 13.2 — Protected route sederhana.** Pola pengarah pada kelompok rute terproteksi memakai `Redirect` dari Expo Router (lanjutan pola Bab 7):

File: app/(app)/_layout.js (versi ringkas)
```js
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function LayoutTerproteksi() {
  const { status } = useAuth();

  if (status === 'memuat') {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (status === 'keluar') {
    return <Redirect href="/login" />;
  }
  return <Stack />;
}
```

Penjelasan: selama status masih `memuat`, aplikasi menampilkan indikator pemuatan agar tidak terjadi perpindahan halaman yang membingungkan. Bila status `keluar` (tidak ada token), `Redirect` mengirim pengguna ke `/login`. Bila `masuk`, `<Stack />` menampilkan rute-rute di dalam kelompok `(app)`. Perhatikan bahwa proteksi ini mengatur *pengalaman navigasi*; data tetap diamankan oleh middleware di server.

**Contoh 13.3 — Menangani token kedaluwarsa.** Saat server menolak token karena kedaluwarsa (status 401), aplikasi sebaiknya keluar dari mode login secara otomatis:

File: context/AuthContext.js (tambahan fungsi)
```js
// Dipanggil ketika server menjawab 401 (token ditolak)
async function keluarKarenaKedaluwarsa() {
  await hapusToken();
  setToken(null);
  setUser(null);
  setStatus('keluar'); // protected route akan Redirect ke /login
}
```

Penjelasan: fungsi ini hampir sama dengan `signOut`, hanya tidak perlu konfirmasi pengguna. Pola pemakaiannya: pada file pemanggil API, bila `response.status === 401`, panggil `keluarKarenaKedaluwarsa()`. Dengan begitu, pengguna yang tokennya hangus tidak akan terjebak di halaman yang menampilkan kesalahan berulang.

## Praktikum

### Tujuan Praktikum

Praktikum ini membangun lapisan autentikasi pada project "Aplikasi Manajemen Data Mahasiswa" dari Bab 10: mendaftarkan akun melalui `/api/auth/register`, masuk melalui `/api/auth/login`, menyimpan token pada SecureStore, melindungi halaman daftar mahasiswa sehingga hanya tampil dengan token, dan keluar (logout) yang menghapus token lalu mengarahkan ulang ke halaman login.

### Kebutuhan

1. Project `aplikasi-mahasiswa` hasil praktikum Bab 10 (berisi rute `app/(app)/mahasiswa/`, pemanggilan API, dan `BASE_URL`).
2. Backend buku berjalan di `http://localhost:3000` (folder `backend/`; dari folder backend jalankan `npm install` sekali, lalu `npm start` — lihat Bab 10 untuk cara lengkapnya).
3. Expo Go atau emulator Android/iOS, dan Node.js LTS.
4. Paket `expo-secure-store` (pemasangan pada langkah Persiapan).

### Persiapan

1. Buka `backend/README.md`. Catat: (a) bentuk request dan respons endpoint `/api/auth/register` dan `/api/auth/login`; (b) cara mengaktifkan proteksi rute pada server (middleware opsional) — bila tersedia, aktifkan untuk rute `GET /api/mahasiswa` sesuai instruksi README, karena praktikum ini menguji bahwa halaman mahasiswa *tidak* bisa diambil tanpa token.
2. Pada folder project, pasang penyimpanan aman dengan perintah:

   ```bash
   npx expo install expo-secure-store
   ```

3. Mulai server backend dan pastikan endpoint login dapat diakses (misalnya dengan membuka alamat tersebut di peramban — respons yang ditampilkan peramban memberi gambaran struktur JSON yang dikembalikan server). *⚠ version-sensitive: bila respons server berbeda dari asumsi kode di bawah (misalnya nama field), sesuaikan kode Anda dengan `backend/README.md`.*

### Langkah Kerja

1. Buat struktur folder `utils/`, `api/`, `context/`, dan `screens/` pada folder project (bila belum ada).
2. Tulis `utils/tokenStorage.js` — pembungkus SecureStore (Kode 1).
3. Tulis `api/client.js` — pemanggil API dengan dukungan token (Kode 2). Salin nilai `BASE_URL` dari praktikum Bab 10 (emulator Android memakai `http://10.0.2.2:3000`).
4. Tulis `context/AuthContext.js` — provider autentikasi dan hook `useAuth` (Kode 3).
5. Ubah `app/_layout.js` menjadi layout akar yang membungkus seluruh aplikasi dengan `AuthProvider` (Kode 4).
6. Ubah `app/index.js` menjadi halaman pengarah berdasarkan status autentikasi (Kode 5).
7. Tulis `screens/Login.js` (Kode 6) lalu ubah `app/login.js` agar menampilkan komponen tersebut (Kode 7).
8. Ubah `app/(app)/_layout.js` menjadi protected route (Kode 8) — halaman-halaman yang sudah ada di dalam `(app)` (Beranda, Daftar Mahasiswa, Detail, Form) otomatis terlindungi.
9. Tambahkan tombol Keluar pada halaman beranda `app/(app)/index.js` (Kode 9).
10. Uji alur lengkap: daftar akun baru → masuk → buka Daftar Mahasiswa → keluar → coba akses langsung `/(app)/mahasiswa` (harus dilempar ke `/login`).

### Kode

Kode 1 — penyimpanan token:

File: utils/tokenStorage.js
```js
// utils/tokenStorage.js — bungkus penyimpanan token berbasis SecureStore
import * as SecureStore from 'expo-secure-store';

const KUNCI_TOKEN = 'token_mahasiswa_app';

export async function simpanToken(token) {
  await SecureStore.setItemAsync(KUNCI_TOKEN, token);
}

export async function bacaToken() {
  return await SecureStore.getItemAsync(KUNCI_TOKEN);
}

export async function hapusToken() {
  await SecureStore.deleteItemAsync(KUNCI_TOKEN);
}
```

Kode 2 — pemanggil API:

File: api/client.js
```js
// api/client.js — pemanggil API buku dengan dukungan token
export const BASE_URL = 'http://localhost:3000'; // emulator Android: http://10.0.2.2:3000

async function kirim(method, path, { body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error((data && data.pesan) || `Permintaan gagal (status ${response.status})`);
  }
  return data;
}

export function loginApi(email, password) {
  return kirim('POST', '/api/auth/login', { body: { email, password } });
}

export function registerApi(nama, email, password) {
  return kirim('POST', '/api/auth/register', { body: { nama, email, password } });
}

export function ambilMahasiswa(token) {
  return kirim('GET', '/api/mahasiswa', { token });
}
```

Kode 3 — state global autentikasi:

File: context/AuthContext.js
```js
// context/AuthContext.js — state global autentikasi + custom hook useAuth
import { createContext, useContext, useEffect, useState } from 'react';
import { loginApi, registerApi } from '../api/client';
import { bacaToken, hapusToken, simpanToken } from '../utils/tokenStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // status: 'memuat' (sedang cek token) | 'masuk' | 'keluar'
  const [status, setStatus] = useState('memuat');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const tersimpan = await bacaToken();
        if (tersimpan) {
          setToken(tersimpan);
          setStatus('masuk');
        } else {
          setStatus('keluar');
        }
      } catch (error) {
        setStatus('keluar');
      }
    })();
  }, []);

  async function signIn(email, password) {
    const data = await loginApi(email, password);
    await simpanToken(data.token);
    setToken(data.token);
    setUser(data.user);
    setStatus('masuk');
  }

  async function signUp(nama, email, password) {
    return registerApi(nama, email, password);
  }

  async function signOut() {
    await hapusToken();
    setToken(null);
    setUser(null);
    setStatus('keluar');
  }

  return (
    <AuthContext.Provider value={{ status, user, token, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus dipanggil di dalam AuthProvider');
  }
  return context;
}
```

Kode 4 — layout akar:

File: app/_layout.js
```js
// app/_layout.js — layout akar: semua halaman dilayani provider autentikasi
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';

export default function LayoutAkar() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
```

Kode 5 — halaman pengarah:

File: app/index.js
```js
// app/index.js — pengarah: ke kelompok (app) bila sudah masuk, selain itu ke login
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function Pengarah() {
  const { status } = useAuth();

  if (status === 'memuat') {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return <Redirect href={status === 'masuk' ? '/(app)' : '/login'} />;
}
```

Kode 6 — layar masuk dan daftar:

File: screens/Login.js
```js
// screens/Login.js — layar masuk & daftar akun (mode dapat diganti)
import { useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
  Pressable, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('masuk'); // 'masuk' | 'daftar'
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sedangMemuat, setSedangMemuat] = useState(false);

  const judul = mode === 'masuk' ? 'Masuk' : 'Daftar Akun';
  const labelTombol = mode === 'masuk' ? 'Masuk' : 'Daftar';

  function validasi() {
    if (mode === 'daftar' && nama.trim() === '') {
      Alert.alert('Validasi', 'Nama belum diisi.');
      return false;
    }
    if (email.trim() === '' || !email.includes('@')) {
      Alert.alert('Validasi', 'Isi alamat email dengan benar.');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Validasi', 'Kata sandi minimal 6 karakter.');
      return false;
    }
    return true;
  }

  async function tekanTombolUtama() {
    if (!validasi()) return;
    setSedangMemuat(true);
    try {
      if (mode === 'masuk') {
        await signIn(email.trim(), password);
        router.replace('/'); // pengarah meneruskan ke halaman beranda
      } else {
        await signUp(nama.trim(), email.trim(), password);
        Alert.alert('Berhasil', 'Pendaftaran berhasil. Silakan masuk.', [
          { text: 'OK', onPress: () => { setMode('masuk'); setPassword(''); } },
        ]);
      }
    } catch (error) {
      Alert.alert('Gagal', error.message || 'Terjadi kesalahan yang tidak diketahui.');
    } finally {
      setSedangMemuat(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.penampung}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.kartu}>
        <Text style={styles.judul}>{judul}</Text>

        <View style={styles.tabMode}>
          <Pressable
            style={[styles.tabItem, mode === 'masuk' && styles.tabAktif]}
            onPress={() => setMode('masuk')}
          >
            <Text style={[styles.tabTeks, mode === 'masuk' && styles.tabTeksAktif]}>Masuk</Text>
          </Pressable>
          <Pressable
            style={[styles.tabItem, mode === 'daftar' && styles.tabAktif]}
            onPress={() => setMode('daftar')}
          >
            <Text style={[styles.tabTeks, mode === 'daftar' && styles.tabTeksAktif]}>Daftar</Text>
          </Pressable>
        </View>

        {mode === 'daftar' && (
          <TextInput
            style={styles.input}
            placeholder="Nama lengkap"
            value={nama}
            onChangeText={setNama}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Kata sandi"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable
          style={[styles.tombol, sedangMemuat && styles.tombolNonaktif]}
          onPress={tekanTombolUtama}
          disabled={sedangMemuat}
        >
          {sedangMemuat ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.teksTombol}>{labelTombol}</Text>
          )}
        </Pressable>

        <Text style={styles.catatan}>
          {mode === 'masuk'
            ? 'Belum punya akun? Tekan tab Daftar untuk mendaftar.'
            : 'Data Anda hanya dipakai untuk autentikasi.'}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  penampung: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f2f4f7' },
  kartu: { backgroundColor: '#ffffff', borderRadius: 12, padding: 24, elevation: 2 },
  judul: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  tabMode: { flexDirection: 'row', backgroundColor: '#e9edf3', borderRadius: 8, marginBottom: 16 },
  tabItem: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  tabAktif: { backgroundColor: '#2563eb' },
  tabTeks: { color: '#4b5563', fontWeight: '600' },
  tabTeksAktif: { color: '#ffffff' },
  input: {
    borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12, fontSize: 16,
  },
  tombol: {
    backgroundColor: '#2563eb', borderRadius: 8,
    paddingVertical: 12, alignItems: 'center', marginTop: 4,
  },
  tombolNonaktif: { opacity: 0.6 },
  teksTombol: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  catatan: { textAlign: 'center', color: '#6b7280', fontSize: 13, marginTop: 14 },
});
```

Kode 7 — rute login:

File: app/login.js
```js
// app/login.js — rute login; layar sesungguhnya ada di screens/Login.js
import Login from '../screens/Login';

export default function RuteLogin() {
  return <Login />;
}
```

Kode 8 — protected route:

File: app/(app)/_layout.js
```js
// app/(app)/_layout.js — semua rute di kelompok ini hanya untuk pengguna masuk
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function LayoutTerproteksi() {
  const { status } = useAuth();

  if (status === 'memuat') {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (status === 'keluar') {
    return <Redirect href="/login" />;
  }
  return <Stack />;
}
```

Kode 9 — tombol keluar pada beranda:

File: app/(app)/index.js (tambahan pada Beranda)
```js
import { Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function Beranda() {
  const { user, signOut } = useAuth();

  async function keluar() {
    await signOut();           // hapus token dari SecureStore
    router.replace('/login');  // arahkan ulang ke halaman login
  }

  return (
    <>
      <Text style={styles.sapa}>Selamat datang, {user ? user.nama : 'pengguna'}</Text>
      <Pressable style={styles.tombolKeluar} onPress={keluar}>
        <Text style={styles.teksKeluar}>Keluar</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  sapa: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  tombolKeluar: {
    backgroundColor: '#dc2626', borderRadius: 8,
    paddingVertical: 10, alignItems: 'center',
  },
  teksKeluar: { color: '#ffffff', fontWeight: 'bold' },
});
```

### Penjelasan Kode

**Kode 1** membungkus tiga fungsi SecureStore agar pemakaiannya seragam di seluruh aplikasi. Kunci penyimpanan dibuat konstan (`token_mahasiswa_app`) supaya tidak salah ketik di tempat lain; modul ini satu-satunya tempat yang mengenal nama kunci tersebut. Dengan pembungkusan seperti ini, bila suatu saat kebijakan penyimpanan berubah (misalnya pindah ke pustaka lain), cukup satu file yang diubah.

**Kode 2** adalah pemanggil API tunggal: fungsi `kirim` menyusun header, mengirim `fetch`, membaca JSON, dan melemparkan error berisi pesan dari server bila status bukan sukses. Perhatikan baris `headers.Authorization = \`Bearer ${token}\`` — inilah titik di mana token disisipkan ke setiap permintaan yang membutuhkannya. Memusatkan logika ini menghindari pengulangan kode pada setiap layar, sekaligus memudahkan penanganan error terpusat (misalnya mendeteksi status 401, lihat Contoh 13.3).

**Kode 3** memegang tiga status autentikasi. `memuat` berarti aplikasi sedang membaca token dari SecureStore saat dibuka — penting agar halaman pengarah tidak mengambil keputusan sebelum data dibaca (mencegah layar berkedip). `signIn` memanggil API, menyimpan token, lalu memperbarui state; `signUp` hanya mendaftarkan akun; `signOut` menghapus token dan mengosongkan state. Hook `useAuth` melempar error bila dipakai di luar provider — perilaku yang membantu debugging sedini mungkin.

**Kode 4–5** membentuk pintu masuk aplikasi. Provider dibungkus di layout akar sehingga semua halaman dapat memanggil `useAuth`. Halaman pengarah memutuskan arah: status `masuk` menuju `/(app)`, selain itu ke `/login`. Keputusan arah hanya di satu tempat — pola "single source of truth" yang menghindari inkonsistensi navigasi.

**Kode 6** menyatukan dua mode pada satu layar. Validasi di sini tujuannya umpan balik cepat; validasi lengkap (format email ketat, panjang kata sandi, dsb.) dibahas di Bab 8 dan server tetap memvalidasi ulang (13.6). `router.replace('/')` dipakai (bukan `push`) agar layar login tidak tertinggal di tumpukan navigasi — pengguna tidak dapat kembali ke login dengan tombol kembali. Pada mode daftar, setelah sukses aplikasi beralih ke mode masuk; keputusan ini menghindari asumsi bahwa endpoint register langsung menerbitkan token.

**Kode 7** menunjukkan pola pemisahan rute (file tipis) dan layar (komponen lengkap): file rute hanya meneruskan ke `screens/Login.js`. Pola ini menjaga file rute tetap pendek dan komponen layar dapat diuji serta dipakai ulang.

**Kode 8** adalah proteksi rute pada kelompok `(app)`: satu file `_layout.js` melindungi semua halaman di dalam folder tersebut (Beranda, Daftar Mahasiswa, Detail, Form) tanpa mengubah satu pun file halaman — ini nilai utama pola route group dari Bab 7. Selama status `memuat`, ditampilkan `ActivityIndicator`; bila `keluar`, `Redirect` ke `/login`.

**Kode 9** melengkapi siklus: tombol Keluar memanggil `signOut` (menghapus token di SecureStore) lalu `router.replace('/login')`. Setelah logout, upaya membuka `/(app)/mahasiswa` secara langsung akan ditolak oleh Kode 8.

### Hasil yang Diharapkan

Setelah mengikuti langkah kerja, perangkat Anda menunjukkan perilaku berikut:

1. Saat aplikasi dibuka pertama kali (belum ada token), muncul halaman Masuk — bukan Beranda.
2. Pendaftaran akun baru lewat tab Daftar menampilkan pemberitahuan "Pendaftaran berhasil", lalu beralih ke tab Masuk.
3. Login dengan email dan kata sandi yang baru didaftarkan membawa Anda ke Beranda; di atas layar tampil sapaan "Selamat datang, <nama>" (nama pengguna dari respons server).
4. Halaman Daftar Mahasiswa menampilkan data dari API (hanya berhasil karena token dikirim pada header; server memproteksi rute tersebut).
5. Keluar dari aplikasi (tombol Keluar) mengembalikan Anda ke halaman Masuk. Coba akses ulang alamat `/(app)/mahasiswa` — aplikasi menolak dan mengarahkan ke `/login`.
6. Tutup dan buka kembali aplikasi tanpa logout: Anda tetap langsung masuk (token terbaca dari SecureStore). Hapus aplikasi dari perangkat lalu pasang ulang: Anda kembali ke halaman Masuk (token ikut terhapus karena tersimpan terenkripsi di area aman perangkat).

### Troubleshooting

**Masalah:** Saat menekan tombol Masuk muncul alert "Network request failed".
**Penyebab:** Aplikasi tidak dapat menjangkau server: `BASE_URL` salah, server belum berjalan, atau emulator Android tidak dapat memakai `localhost` (di emulator, `localhost` menunjuk ke emulator itu sendiri, bukan komputer host).
**Solusi:** Pastikan `npm start` berjalan di folder `backend/`. Gunakan `http://localhost:3000` untuk Expo Go di perangkat yang sama dengan komputer; gunakan `http://10.0.2.2:3000` untuk emulator Android. Verifikasi dengan membuka alamat tersebut di peramban komputer.
**Pencegahan:** Simpan `BASE_URL` sebagai konstanta di satu file (`api/client.js`) dan sesuaikan dulu sebelum mencoba login; tulis petunjuk alamat yang benar pada catatan praktikum Anda.

**Masalah:** Login berhasil, tetapi halaman Daftar Mahasiswa menampilkan error 401.
**Penyebab:** Server memproteksi `GET /api/mahasiswa` dan menolak token — kemungkinan token tidak dikirim (panggilan di layar mahasiswa belum menyertakan header `Authorization`) atau token kedaluwarsa.
**Solusi:** Lepas kondisi token kosong — pastikan layar memanggil `ambilMahasiswa(token)` dengan token dari `useAuth()`, bukan versi pemanggilan Bab 10 tanpa token. Bila token kedaluwarsa, logout lalu login ulang.
**Pencegahan:** Jadikan `api/client.js` satu-satunya tempat pemanggilan `fetch`; setiap fungsi yang menyertakan token dipakai konsisten di semua layar.

**Masalah:** Error "Cannot find native module 'ExpoSecureStore'" saat aplikasi dijalankan.
**Penyebab:** Paket `expo-secure-store` belum terpasang, atau versinya tidak cocok dengan SDK.
**Solusi:** Pasang dengan `npx expo install expo-secure-store` (bukan `npm install`, agar versi disesuaikan dengan SDK), lalu mulai ulang Metro dengan `npx expo start -c`.
**Pencegahan:** Gunakan selalu `npx expo install` untuk paket yang berhubungan dengan Expo; periksa daftar paket di `package.json` setelah instalasi.

**Masalah:** Setelah logout, menekan tombol kembali (*back button*) perangkat kembali ke halaman Beranda.
**Penyebab:** Navigasi ke Beranda memakai `router.push` sehingga layar login terdorong ke tumpukan; atau halaman beranda lama masih tersimpan di tumpukan navigasi.
**Solusi:** Pada alur masuk gunakan `router.replace('/')`, dan setelah logout gunakan `router.replace('/login')` — penggantian (*replace*) mencegah halaman lama tersisa di tumpukan.
**Pencegahan:** Jadikan aturan: perpindahan antar "zona" autentikasi (login ↔ beranda) selalu memakai `replace`, bukan `push`.

**Masalah:** Pendaftaran ditolak server dengan pesan validasi (misalnya "email sudah terdaftar").
**Penyebab:** Email yang sama sudah pernah didaftarkan (backend menolak email duplikat), atau aturan kata sandi server berbeda dari pemeriksaan ringan di layar.
**Solusi:** Gunakan email lain yang belum terdaftar; periksa pesan error persis dari server yang ditampilkan pada alert (pesan diambil dari respons server melalui `api/client.js`).
**Pencegahan:** Baca aturan validasi di `backend/README.md` dan samakan pemeriksaan klien dengan aturan server; jangan pernah menampilkan kata sandi pada alert atau log.

## Studi Kasus

**Kebocoran data pada "e-Kampus" — belajar dari sistem informasi nyata.** Sebuah perguruan tinggi meluncurkan aplikasi mobile "e-Kampus" untuk layanan akademik: jadwal, nilai, KRS, dan pengumuman. Enam bulan setelah peluncuran, media memberitakan kebocoran data yang menimpa sejumlah layanan daring — dan e-Kampus ikut terseret karena penyelidikan menemukan pola kelemahan yang sama pada banyak sistem, termasuk sistem buatan kampus lain yang sejenis. Pada e-Kampus, audit menemukan empat temuan:

1. **Token disimpan di AsyncStorage.** Token pengguna ikut tersalin ke cadangan cloud perangkat dan dapat dibaca dari berkas penyimpanan pada perangkat yang di-root. Satu perangkat hilang sama dengan satu akun tercuri.
2. **API tanpa proteksi.** Endpoint daftar nilai sebenarnya memeriksa token, tetapi endpoint profil dan daftar mahasiswa tidak. Siapa pun yang mengetahui pola URL dapat menarik ribuan data.
3. **Komunikasi HTTP polos di jaringan kampus.** Mahasiswa jurusan TI yang sama, terhubung ke Wi-Fi kampus yang sama, dapat menangkap lalu lintas e-Kampus dengan alat penyadap jaringan; email, kata sandi, dan token tampil sebagai teks yang dapat dibaca.
4. **Terlalu banyak data dalam satu permintaan.** Saat login, server mengembalikan seluruh profil pengguna (termasuk NIK dan alamat) dalam satu respons, padahal aplikasi hanya butuh nama dan peran.

Analisis: temuan 1–4 masing-masing adalah pelanggaran materi bab ini — penyimpanan rahasia pada media tidak aman (13.5), proteksi rute yang tidak konsisten (13.4), absennya HTTPS (13.6), dan pelanggaran least privilege (13.6). Perbaikan yang direkomendasikan auditor, berurutan berdasarkan dampak: (a) pindahkan token ke SecureStore dan singkirkan data sensitif dari respons login — perubahan kecil dengan dampak besar; (b) aktifkan proteksi server pada seluruh rute yang membawa data pribadi, bukan sebagian; (c) wajibkan HTTPS pada server produksi (kampus menyediakan sertifikat melalui unit TIK) dan batasi HTTP hanya untuk pengembangan lokal; (d) terapkan praktik permintaan data minimal: aplikasi hanya menerima field yang akan ditampilkan, dan klaim token tidak memuat informasi pribadi berlebih.

Keterkaitan dengan materi: kasus ini menunjukkan bahwa keamanan adalah *sistem*, bukan fitur tunggal — merapikan login saja tidak cukup bila penyimpanan token, kebijakan jaringan, dan desain API tetap lemah. Urutan perbaikan (a)–(d) mencerminkan prioritas yang sama dengan urutan bab ini: alur autentikasi yang benar, penyimpanan aman, transportasi aman, dan prinsip hak akses minimal. Pola pikir inilah yang akan Anda bawa ke Project Akhir: setiap keputusan desain (tempat menyimpan token, endpoint yang diproteksi, data yang dikirim) harus diuji dengan pertanyaan "bagaimana jika orang jahat memegang perangkat ini?". Pengujian semacam ini akan menjadi bagian dari checklist QA pada Bab 14.

## Latihan

### Soal Pemahaman

1. Jelaskan perbedaan autentikasi dan otorisasi. Berikan satu contoh nyata pada sistem informasi akademik untuk masing-masing.
2. Apa keunggulan dan kelemahan mekanisme session dibandingkan token? Kapan sebuah REST API sebaiknya memilih token?
3. Sebutkan tiga bagian JWT dan fungsi masing-masing. Mengapa dikatakan JWT "bukan enkripsi"?
4. Mengapa proteksi halaman di sisi aplikasi mobile saja tidak cukup untuk mengamankan data? Lapisan apa yang menentukan keamanan sebenarnya?
5. Bandingkan AsyncStorage dan SecureStore sebagai tempat penyimpanan token dari sisi enkripsi dan risiko cadangan perangkat.
6. Jelaskan empat prinsip keamanan API pada subbab 13.6 dan berikan satu contoh pelanggaran untuk masing-masing.

### Soal Praktik

1. Pada project praktikum, ubah tombol Keluar pada Beranda sehingga ketika server menjawab 401 pada pemanggilan `ambilMahasiswa`, aplikasi otomatis keluar (gunakan pola Contoh 13.3). Uji dengan membiarkan aplikasi terbuka melewati masa berlaku token.
2. Tambahkan halaman "Profil" di dalam kelompok `(app)` yang menampilkan `user.nama` dan `user.email` dari `useAuth()`. Pastikan halaman tersebut tidak dapat diakses setelah logout.
3. Buka kembali project latihan Bab 11 (Aplikasi Catatan). Pindahkan penyimpanan "token dummy" (bila ada di latihan tersebut) dari AsyncStorage ke SecureStore dengan memakai `utils/tokenStorage.js` sebagai acuan, lalu jelaskan apa yang berubah pada berkas cadangan.

### Soal Analisis

1. Sebuah tim memutuskan menyimpan kata sandi pengguna pada payload JWT agar "aplikasi tidak perlu memanggil server untuk menampilkan profil". Evaluasi keputusan ini berdasarkan materi 13.3 dan 13.6: apa yang salah secara konseptual, bagaimana cara yang benar, dan apa dampak bila token bocor sebelum kedaluwarsa. Tuliskan jawaban Anda sebagai ulasan singkat (maksimal dua paragraf) dengan menyebut istilah teknis yang relevan.

## Tantangan

1. **Refresh token sederhana.** Rancang dan implementasikan (secara konseptual atau dengan simulasi di backend lokal): token akses berumur pendek (misalnya 15 menit) dan refresh token berumur panjang. Pada `api/client.js`, tambahkan logika: bila respons 401, minta token baru memakai refresh token lalu ulangi permintaan yang gagal. *⚠ version-sensitive: endpoint refresh mengikuti `backend/README.md` bila tersedia; bila tidak, dokumentasikan simulasi Anda.*
2. **Otorisasi berbasis peran.** Tambahkan field `role` pada akun pengguna (misalnya `mahasiswa` dan `admin`). Buat halaman "Kelola Pengguna" yang hanya dirender bila `user.role === 'admin'`, dan tambahkan pemeriksaan peran pada sisi server sesuai dokumentasi backend. Jelaskan mengapa pemeriksaan klien saja tidak cukup.
3. **Log keamanan.** Buat file `utils/riwayatKeamanan.js` yang mencatat waktu login, waktu logout, dan upaya login gagal dengan `console.log` terformat. Gunakan catatan ini untuk menyusun laporan singkat "apa yang diamati selama satu sesi praktikum" — latihan observasi yang berguna untuk debugging (Bab 14).

## Rangkuman

1. Autentikasi membuktikan *siapa* pengguna; otorisasi menentukan *apa yang boleh dilakukan*; keduanya berurutan dan diputuskan final di server.
2. Register dan login adalah dua endpoint REST; kata sandi tidak pernah disimpan polos — server menyimpan hasil hash, dan buku ini tidak pernah menampilkan kata sandi asli.
3. Session menyimpan state di server (mudah dicabut, sulit diskalakan); token bersifat stateless (mudah diskalakan, sulit dicabut).
4. JWT terdiri atas header, payload, dan signature; isinya hanya di-encode (dapat dibaca), keasliannya dijamin tanda tangan dengan secret key server.
5. Klaim `exp` membatasi umur token; token yang dicuri tetap berlaku sampai kedaluwarsa — solusi umumnya adalah umur pendek plus refresh token.
6. Protected route di klien menggunakan `Redirect` berbasis state autentikasi; keamanan sebenarnya ditentukan proteksi di sisi server.
7. Token disimpan dengan `expo-secure-store` (enkripsi Keystore/Keychain), bukan AsyncStorage yang tanpa enkripsi.
8. Empat prinsip API security: validasi input di server, tanpa secret key di kode klien, HTTPS untuk semua lalu lintas non-lokal, dan least privilege pada izin, klaim token, dan data respons.
9. Logout dalam arsitektur token berarti menghapus token di klien lalu mengarahkan ulang ke halaman login.
10. HTTP hanya untuk pengembangan lokal; Android memblokir cleartext pada build produksi — *⚠ version-sensitive: perilaku Expo Go terhadap HTTP lokal dapat berubah.*

## Refleksi

1. Pernahkah Anda memakai aplikasi yang meminta login tetapi merasa "aneh" perilakunya (misalnya lupa login berulang kali)? Apa yang sekarang Anda pahami tentang penyebabnya?
2. Di antara materi bab ini, prinsip mana yang paling mudah Anda lupakan saat membuat aplikasi sendiri — dan bagaimana Anda mengingatnya?
3. Jika Anda bekerja di tim pengembang sistem informasi kampus, keputusan apa yang akan Anda perjuangkan terkait penyimpanan token dan kebijakan HTTPS, dan mengapa?
4. Bagaimana pemahaman "klien tidak dapat dipercaya" mengubah cara Anda menulis validasi pada aplikasi berikutnya?

## Evaluasi Bab

### Pilihan Ganda

1. Proses pembuktian bahwa pengguna adalah pihak yang ia klaim disebut ....
   A. Otorisasi
   B. Autentikasi
   C. Enkripsi
   D. Hashing

2. Pada sistem informasi akademik, dosen boleh menginput nilai sedangkan mahasiswa tidak. Ini adalah contoh ....
   A. Autentikasi
   B. Validasi
   C. Otorisasi
   D. Enkripsi

3. Pernyataan yang benar tentang JWT adalah ....
   A. Isi payload terenkripsi sehingga aman dari pembacaan
   B. Terdiri atas dua bagian yang dipisahkan tanda titik
   C. Signature menjamin keutuhan dan keaslian token
   D. Token tidak memiliki masa berlaku

4. Keunggulan utama token dibandingkan session adalah ....
   A. Server dapat mencabut token kapan saja
   B. Server tidak perlu menyimpan state autentikasi
   C. Token tidak dapat dicuri
   D. Token tidak perlu disimpan klien

5. Alasan token sebaiknya disimpan di SecureStore, bukan AsyncStorage, adalah ....
   A. SecureStore menyimpan data dalam bentuk terenkripsi
   B. SecureStore dapat menyimpan data berukuran besar
   C. AsyncStorage tidak dapat menyimpan teks
   D. AsyncStorage hanya tersedia di web

6. Fungsi `expo-secure-store` yang digunakan untuk menghapus token saat logout adalah ....
   A. `removeItemAsync`
   B. `clearAllAsync`
   C. `deleteItemAsync`
   D. `resetAsync`

7. Perlindungan halaman di sisi aplikasi (protected route) bersifat ....
   A. Pengganti proteksi server
   B. Pengalaman pengguna; keamanan data ditentukan server
   C. Tidak diperlukan bila memakai JWT
   D. Cukup untuk mencegah akses data

8. Menurut prinsip least privilege, aplikasi mobile sebaiknya ....
   A. Meminta semua izin perangkat saat pertama dibuka
   B. Menyimpan kunci rahasia server di dalam kode aplikasi
   C. Hanya meminta izin dan data yang benar-benar diperlukan
   D. Mengirim seluruh data pengguna pada setiap respons login

9. Pada pengembangan lokal, HTTP ke `localhost` masih dapat dipakai karena ....
   A. HTTP sama amannya dengan HTTPS
   B. Android tidak pernah memblokir cleartext
   C. Pengecualian untuk pengembangan; produksi wajib HTTPS
   D. Token tidak dikirim melalui HTTP

10. Setelah logout pada arsitektur token, yang terjadi adalah ....
    A. Server menghapus sesi pengguna
    B. Token dihapus dari penyimpanan klien dan pengguna diarahkan ke login
    C. Token otomatis kedaluwarsa di server
    D. Aplikasi menyimpan token untuk login berikutnya

### Soal Uraian

1. Gambarkan alur lengkap login → token → akses API → logout dengan menyebutkan: endpoint yang dipanggil, tempat token disimpan, header yang dikirim, dan peran protected route pada tiap tahap.
2. Seorang developer menyimpan `JWT_SECRET` (kunci penandatangan) di dalam `api/client.js` agar "verifikasi bisa dilakukan tanpa server". Jelaskan mengapa ini berbahaya dan bagaimana seharusnya dilakukan.
3. Jelaskan hubungan antara klaim `exp` pada JWT, penanganan status 401, dan kenyamanan pengguna. Kapan pengguna harus diminta login ulang, dan bagaimana aplikasi dapat melakukannya tanpa mengganggu?

### Kunci Jawaban

<details>
<summary>Klik untuk melihat kunci jawaban pilihan ganda</summary>

1. B — Autentikasi adalah pembuktian identitas.
2. C — Otorisasi menentukan hak akses berdasarkan peran.
3. C — Signature menjamin keutuhan dan keaslian; payload tidak terenkripsi, JWT terdiri atas tiga bagian, dan token memiliki masa berlaku (`exp`).
4. B — Token membuat server stateless; pencabutan justru sulit, token dapat dicuri, dan token tetap perlu disimpan klien.
5. A — SecureStore menyimpan nilai terenkripsi (Keystore/Keychain); AsyncStorage polos dan ikut cadangan perangkat.
6. C — `deleteItemAsync` adalah nama fungsi pada `expo-secure-store`.
7. B — Proteksi klien hanya mengatur pengalaman navigasi; keamanan data ditentukan proteksi server.
8. C — Least privilege berarti meminta izin dan data seminimal mungkin.
9. C — HTTP hanya pengecualian pengembangan lokal; produksi wajib HTTPS.
10. B — Logout = menghapus token di klien + pengarahan ulang; server tidak menyimpan sesi.

</details>