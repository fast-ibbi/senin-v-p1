# BAB 2 — Persiapan Lingkungan Pengembangan

## Deskripsi Singkat

Bab ini memandu Anda menyiapkan meja kerja (workstation) pengembangan aplikasi mobile dengan React Native dan Expo: menginstal dan memverifikasi **Node.js** beserta **npm**, mengenal **Visual Studio Code** sebagai editor, memahami **Expo Go** sebagai alat uji cepat, serta menyiapkan **emulator Android**, perangkat fisik, dan (secara pengenalan) **iOS Simulator**. Di akhir bab, Anda membuat project Expo pertama, menjalankannya di layar, dan memahami struktur folder project beserta fungsi setiap berkasnya. Bab ini merupakan fondasi wajib: seluruh bab berikutnya, mulai dari JavaScript (Bab 3) hingga build dan distribusi (Bab 15), memakai lingkungan yang Anda siapkan di sini.

## Tujuan Pembelajaran

Setelah mempelajari bab ini, Anda diharapkan mampu:

1. Menjelaskan peran Node.js, npm, dan npx dalam ekosistem pengembangan React Native/Expo beserta alasan mengapa ketiganya diperlukan.
2. Mengidentifikasi komponen lingkungan pengembangan yang dibutuhkan (editor, Expo CLI, Expo Go, emulator, perangkat fisik) dan fungsinya masing-masing.
3. Mengimplementasikan pembuatan project Expo pertama dengan `npx create-expo-app nama-app --template blank` dan menjalankannya melalui `npx expo start`.
4. Menganalisis perbedaan cara pengujian aplikasi pada Expo Go, emulator Android, dan perangkat fisik dari sisi kecepatan, kesetiaan perilaku (fidelity), dan kebutuhan perangkat keras.
5. Menjelaskan struktur folder project Expo beserta peran setiap berkas utama (App.js, app.json, package.json, assets/, node_modules/).
6. Mengevaluasi kendala umum lingkungan pengembangan (perintah tidak dikenal, port sibuk, perangkat tidak terdeteksi, ketidakcocokan SDK) dan memilih solusi yang tepat.

## Peta Konsep

```
            LINGKUNGAN PENGEMBANGAN APLIKASI MOBILE
   ┌──────────────┬──────────────┬───────────────┬──────────────┐
   │   Node.js    │  VS Code     │   Expo CLI    │  Alat Uji    │
   │ (runtime JS) │  (editor)    │ (create-expo- │ ├─ Expo Go   │
   │   + npm/     │  + ekstensi  │   app, start) │ ├─ Emulator  │
   │   npx        │  ESLint,     │   + npx       │ │  Android    │
   │              │  Prettier    │               │ ├─ Perangkat  │
   │              │              │               │ │  fisik      │
   └──────┬───────┴──────┬───────┴──────┬────────┴─┴──┬─────────┘
          └──────────────┴──────────────┴─────────────┘
                     Project Expo (App.js, app.json,
                     package.json, assets/, node_modules/)
                                  │
                 npx expo start → Metro Bundler (port 8081)
                                  │
                   Aplikasi tampil di Expo Go / emulator /
                              perangkat fisik
```

## Materi

### 2.1 Node.js dan npm

**Node.js** adalah *runtime* (lingkungan eksekusi) JavaScript yang berjalan di luar peramban (browser). Sebelum Node.js lahir, JavaScript hanya dapat dieksekusi di dalam browser; para pengembang web tidak punya cara menjalankan JavaScript di komputer secara langsung. Node.js mengubah keadaan itu dengan membungkus mesin JavaScript **V8** (mesin yang sama yang dipakai browser Chrome) ke dalam sebuah program yang berjalan di sistem operasi. Mengapa teknologi ini ada? Karena ekosistem pengembangan modern membutuhkan satu bahasa yang sama di banyak lapisan: bahasa yang Anda pakai menulis aplikasi mobile (JavaScript) juga dipakai oleh alat-alat pengembangnya (tooling). Dengan begitu, Anda tidak perlu mempelajari bahasa kedua hanya untuk menginstal dependensi atau menjalankan server pengembangan. Bagi kita, Node.js adalah fondasi karena **Expo CLI** (antarmuka baris perintah Expo) dan **Metro Bundler** (penggabung modul JavaScript) berjalan di atas Node.js.

**npm** (kependekan dari *Node Package Manager* — pengelola paket Node) adalah program pengelola paket (package manager) yang terpasang otomatis bersama Node.js. Paket (package) adalah pustaka kode siap pakai yang dibagikan melalui registry, yaitu gudang daring npmjs.com yang memuat jutaan paket. npm bertugas mengunduh paket, mengelola versinya, dan mencatat daftarnya di berkas **package.json**. Tanpa npm, Anda akan menyalin kode pustaka secara manual — pekerjaan yang rawan kesalahan dan sulit diperbarui.

Cara memverifikasi bahwa Node.js dan npm telah terpasang adalah dengan memeriksa versinya. Buka terminal (di Windows: PowerShell atau Command Prompt; di macOS/Linux: Terminal) lalu jalankan dua perintah berikut:

```bash
node --version
npm --version
```

Penjelasan: perintah `node --version` (biasa disingkat `node -v`) menampilkan nomor versi Node.js yang aktif, sedangkan `npm --version` menampilkan versi npm. Jika kedua perintah mengenali perintah tersebut, lingkungan Anda siap. Versi yang disarankan buku ini adalah **Node.js LTS** (Long Term Support — dukungan jangka panjang) minimal versi 22; LTS berarti versi tersebut dipelihara dan diperbarui keamanannya dalam waktu lama, sehingga paling stabil untuk pengembangan. *⚠ version-sensitive: angka versi LTS terbaru berubah seiring waktu; gunakan rilis LTS terbaru yang tersedia di situs resmi nodejs.org.*

Jika terminal menjawab dengan pesan seperti `node: command not found` atau `'node' is not recognized`, berarti Node.js belum terpasang atau belum dikenali (lihat bagian Troubleshooting pada Praktikum 2).

### 2.2 Package Manager dalam Ekosistem JavaScript

Bayangkan Anda membangun aplikasi yang memakai sepuluh pustaka, dan setiap pustaka bergantung pada pustaka lain dengan versi tertentu. Mengelola hubungan semuanya secara manual akan cepat kacau — masalah yang dikenal sebagai *dependency hell* (neraka ketergantungan). Package manager hadir untuk menjawab masalah nyata ini: ia mencatat daftar dependensi, mengunduh versi yang kompatibel, dan menyimpan semuanya di folder **node_modules** sehingga project Anda dapat dipasang ulang (reproducible) di komputer lain hanya dengan satu perintah.

Ekosistem JavaScript memiliki beberapa package manager dengan keunggulan berbeda:

| Package Manager | Ciri Khas | Kapan Cocok Dipakai |
|---|---|---|
| **npm** | Bawaan Node.js, paling luas dipakai, tanpa instalasi tambahan | Project standar; buku ini memakai npm |
| **yarn** | Lebih cepat pada masanya, berkas kunci (lockfile) ketat, dikembangkan Meta | Tim yang sudah memakai yarn |
| **pnpm** | Hemat ruang disk karena berbagi paket antar project | Monorepo atau project besar |

Perbedaan utama di antara ketiganya bukan pada kemampuan, melainkan pada strategi penyimpanan berkas dan kecepatan. Trade-off-nya sederhana: npm kalah efisien di ruang disk dibanding pnpm, tetapi menang di kemudahan karena tidak perlu dipasang terpisah. Untuk buku ini, kita konsisten memakai npm karena ia bawaan Node.js dan dipakai secara default oleh alat `create-expo-app`; konsistensi ini menghindari kebingungan saat Anda bekerja dalam tim.

Selain `npm`, Anda juga akan sering menjumpai **npx** — pelaksana paket (package runner) yang ikut terpasang bersama npm. Perbedaan penting: `npm install <paket>` memasang paket ke project Anda, sedangkan `npx <perintah>` menjalankan perintah dari sebuah paket *tanpa* memasangnya secara permanen. Mengapa npx ada? Karena alat seperti `create-expo-app` berubah seiring waktu; dengan npx, Anda selalu menjalankan versi terbaru dari registry tanpa harus mengingat memperbarui instalasi global, dan tanpa membuat komputer Anda penuh dengan program yang jarang dipakai. Sepanjang buku ini, perintah pembuatan project dan server pengembangan selalu memakai npx: `npx create-expo-app`, `npx expo start`, dan `npx expo install` (untuk menambah paket bawaan SDK, misalnya saat Bab 12 memakai kamera, gunakan `npx expo install <paket>` agar versinya otomatis cocok dengan SDK; paket JavaScript murni cukup dengan `npm install <paket>`).

### 2.3 Visual Studio Code

**Visual Studio Code** (sering disingkat **VS Code**) adalah editor kode sumber gratis buatan Microsoft yang menjadi editor paling populer untuk pengembangan JavaScript/TypeScript. Mengapa teknologi ini ada? Sebuah project React Native terdiri dari puluhan hingga ribuan berkas; menulisnya di editor teks polos (seperti Notepad) tidak realistis. VS Code menyediakan penyorotan sintaks (syntax highlighting), pelengkapan kode otomatis (**IntelliSense**), penelusuran lintas berkas, dan **terminal terintegrasi** — terminal yang bisa dibuka di dalam editor sehingga Anda tidak perlu berpindah aplikasi saat menjalankan perintah.

Kekuatan VS Code bertumpu pada **ekstensi** (extensions — pemasangan fitur tambahan). Untuk pengembangan React Native/Expo, ekstensi yang membantu antara lain:

- **ESLint** — memeriksa kualitas kode dan menandai kesalahan gaya penulisan secara langsung di editor. Ekstensi ini akan terasa manfaatnya mulai Bab 3 saat Anda menulis JavaScript.
- **Prettier – Code formatter** — merapikan format kode (indentasi, tanda kutip, panjang baris) otomatis saat berkas disimpan, sehingga kode semua anggota tim terlihat seragam.
- **Error Lens** — menampilkan pesan kesalahan tepat di samping baris yang bermasalah, tanpa harus mengarahkan kursor.
- **Material Icon Theme** — menampilkan ikon berwarna untuk tiap jenis berkas (opsional, semata untuk kenyamanan visual).

*⚠ version-sensitive: cek nama ekstensi di marketplace VS Code saat Anda membaca buku ini; beberapa ekstensi — termasuk yang pernah populer seperti React Native Tools — telah diarsipkan pengembangnya dan tidak lagi dianjurkan. Kombinasi ESLint + Prettier + terminal Expo sudah mencukupi untuk mengikuti seluruh buku ini.*

### 2.4 Expo dan Expo Go

**Expo** adalah *framework* (kerangka kerja) dan *toolchain* (rantai alat) yang menyederhanakan pengembangan React Native — konsep dan cara kerjanya telah Anda kenali di Bab 1; di sini kita fokus pada bagian yang Anda jalankan: **Expo CLI** dan **Expo Go**.

Expo CLI adalah antarmuka baris perintah untuk membuat, menjalankan, dan mengelola project Expo. Anda tidak perlu memasangnya global: semua perintah dijalankan lewat npx. Dua perintah yang paling sering dipakai adalah `npx create-expo-app` (membuat project baru) dan `npx expo start` (menyalakan server pengembangan).

**Expo Go** adalah aplikasi yang dipasang di ponsel (Android maupun iOS) dan berfungsi sebagai "pemutar" project Expo: selama ponsel dan komputer berada dalam jaringan yang sama, aplikasi yang sedang Anda kembangkan dapat langsung tampil di Expo Go tanpa proses build. Mengapa teknologi ini ada? Membangun aplikasi mobile secara tradisional membutuhkan *build* (proses penerjemahan kode menjadi berkas aplikasi) yang lambat dan rumit; Expo Go menghapus hambatan itu untuk tahap belajar, sehingga Anda bisa melihat hasil kode dalam hitungan detik. Trade-off-nya: Expo Go hanya mendukung API yang tersedia pada paket Expo dan tidak memuat kode native (kode asli platform) buatan Anda sendiri; untuk fitur khusus yang butuh kode native atau pengujian mendekati produksi, Anda perlu *development build* — topik yang akan dibahas di Bab 15.

Pada saat buku ini ditulis, SDK 57 adalah versi termutakhir (lihat tabel versi pada pendahuluan). Karena SDK 57 baru dirilis, versi Expo Go di toko aplikasi (Google Play dan App Store) dapat saja masih menunggu persetujuan (approval) sehingga versi yang tersedia di toko belum mendukung SDK 57. *⚠ version-sensitive: untuk mendapatkan Expo Go yang mendukung SDK 57, sementara waktu gunakan pemasangan melalui `eas go` (perangkat iOS) atau melalui fasilitas Expo CLI (untuk Android/emulator) sesuai petunjuk resmi di docs.expo.dev; mekanisme ini dapat berubah sewaktu-waktu.*

Di balik layar, `npx expo start` menjalankan **Metro Bundler** — *bundler* (penggabung modul) JavaScript buatan Meta yang menjadi bawaan React Native. Metro membaca seluruh modul yang di-*import* aplikasi Anda, menggabungkannya menjadi satu berkas, lalu mengirimkannya ke perangkat melalui jaringan dengan port default **8081**. Inilah mengapa saat server pengembangan menyala, laptop Anda bertindak sebagai "dapur" dan perangkat hanya menerima hasil olahan. Metro juga mendukung **Fast Refresh** (penyegaran cepat): ketika Anda menyimpan perubahan pada berkas kode, aplikasi di layar diperbarui otomatis dalam sekejap tanpa kehilangan keadaan (state) yang sedang berjalan — pengalaman yang akan sangat terasa di Praktikum 2.

### 2.5 Emulator Android dan Perangkat Fisik

Aplikasi Android pada akhirnya harus diuji pada perangkat yang menjalankan Android. Dua jalur yang tersedia: **emulator Android** (perangkat virtual di dalam komputer) dan **perangkat fisik** (ponsel sungguhan).

Emulator adalah program yang menyimulasikan perilaku ponsel Android — layar, prosesor, memori, hingga versi sistem — di dalam komputer Anda. Alat yang dipakai untuk mengelola emulator adalah **Android Studio**, IDE (lingkungan pengembangan terpadu) resmi Android. Dari Android Studio kita membuka **AVD Manager** (*Android Virtual Device* — pengelola perangkat virtual Android) untuk membuat perangkat virtual dengan memilih jenis ponsel dan versi Android. Mengapa emulator ada? Karena pengembang tidak mungkin membeli puluhan ponsel hanya untuk menguji aplikasi pada berbagai versi Android; emulator memungkinkan pengujian lintas-versi dengan biaya hampir nol. Trade-off-nya: emulator lebih lambat daripada ponsel sungguhan, tidak mendukung sebagian sensor (misalnya getaran yang realistis atau deteksi langkah), dan menghabiskan banyak memori komputer. Untuk aplikasi yang melibatkan kamera, lokasi, atau notifikasi (Bab 12), perangkat fisik jauh lebih meyakinkan.

Perangkat virtual Android dikendalikan lewat **adb** (*Android Debug Bridge* — jembatan debug Android), sebuah program baris perintah yang menghubungkan komputer dengan perangkat Android (virtual maupun fisik). Perintah `adb devices` menampilkan daftar perangkat yang terhubung — berguna untuk memastikan emulator atau ponsel Anda dikenali komputer sebelum menjalankan aplikasi.

Untuk memakai **perangkat fisik**, aktifkan fitur pengembang (Developer options) dengan membuka menu *About phone* (Tentang ponsel) lalu mengetuk nomor *Build number* (Nomor build) tujuh kali; setelah itu aktifkan *USB debugging* (debug USB) pada menu Developer options. Saat ponsel dihubungkan ke komputer memakai kabel USB, ponsel akan menanyakan apakah Anda mempercayai komputer ini (autentikasi RSA) — pilih izinkan. Untuk pengembangan dengan Expo Go, koneksi USB tidak wajib: ponsel cukup berada di jaringan Wi-Fi yang sama dengan komputer (lihat subbab 2.9).

### 2.6 iOS Simulator (Pengenalan)

Sama seperti Android, iOS pun memiliki alat uji: **iOS Simulator** — program simulasi iPhone/iPad yang berjalan di komputer. Bedanya dengan emulator Android, iOS Simulator hanya dapat berjalan di komputer **macOS** dan membutuhkan **Xcode** (IDE resmi Apple) yang berukuran sangat besar. Konsekuensinya: jika komputer Anda berbasis Windows atau Linux, Anda tidak dapat menjalankan iOS Simulator sama sekali.

Bagaimana cara mahasiswa ber-Windows menguji tampilan aplikasinya di iOS? Dua jalur alternatif: (1) meminjam iPhone fisik dan memasang Expo Go di sana — aplikasi tetap berjalan tanpa perlu komputer Mac selama berada di jaringan yang sama; atau (2) menyerahkan proses build iOS ke layanan cloud, misalnya EAS Build yang akan dibahas di Bab 15. Trade-off-nya perlu dipahami sejak sekarang: pengembangan lintas-platform tidak berarti setiap orang wajib memiliki semua perangkat, melainkan memahami jalur mana yang tersedia pada kondisi masing-masing. Di komputer Mac, cukup tekan tombol **i** di terminal Expo (setelah `npx expo start`) untuk membuka aplikasi di iOS Simulator.

### 2.7 Membuat Project Expo Pertama

Sekarang kita masuk ke bagian paling praktis: membuat project pertama. Buka terminal di folder tempat Anda ingin menyimpan project (misalnya folder `proyek-kuliah`), lalu jalankan:

```bash
npx create-expo-app aplikasi-pertama --template blank
```

Penjelasan setiap bagian perintah ini penting untuk dipahami, bukan dihafal. `npx` memastikan kita menjalankan versi terbaru `create-expo-app` (alat pembuat project Expo) tanpa memasangnya global. `aplikasi-pertama` adalah nama project sekaligus nama folder yang akan dibuat; gunakan huruf kecil tanpa spasi agar aman diberbagai sistem operasi. `--template blank` memilih templat (cetakan awal) project: templat **blank** berisi project React Native/Expo minimal *tanpa* TypeScript — kode JavaScript polos, sesuai bahasa pemrograman yang dipakai buku ini (Bab 3 mengupas alasan pemilihan JavaScript). Perlu Anda ketahui: templat **default** yang dipakai `create-expo-app` tanpa opsi `--template` justru berbasis TypeScript dan langsung menyertakan Expo Router; jika Anda tidak menyebutkan apapun, project yang terbentuk berisi berkas berekstensi `.tsx` dan struktur navigasi yang belum kita butuhkan di tahap ini. Dengan memilih `blank` secara eksplisit, kita mendapatkan struktur sesederhana mungkin sehingga Anda fokus memahami fondasi sebelum beranjak ke navigasi di Bab 7. *⚠ version-sensitive: perilaku templat dapat berubah antarversi Expo; jika ragu, periksa deskripsi templat di docs.expo.dev atau jalankan `npx create-expo-app --help`.*

Proses pembuatan berlangsung satu hingga beberapa menit karena npm mengunduh semua dependensi ke folder `node_modules`. Setelah selesai, masuki folder project:

```bash
cd aplikasi-pertama
```

Penjelasan: `cd` (change directory — pindah direktori) mengarahkan terminal ke folder project. Seluruh perintah selanjutnya harus dijalankan dari dalam folder ini. Buka project di VS Code dengan perintah:

```bash
code .
```

Penjelasan: `code .` menyuruh VS Code membuka folder saat ini (tanda titik berarti direktori aktif). Jika perintah ini tidak dikenal, jalankan VS Code lewat menu Start/Launchpad lalu pilih *File > Open Folder* dan arahkan ke folder `aplikasi-pertama`.

Terakhir, nyalakan server pengembangan:

```bash
npx expo start
```

Penjelasan: perintah ini menyalakan Metro Bundler dan menampilkan antarmuka interaktif di terminal: kode QR untuk Expo Go, alamat jaringan (LAN) tempat aplikasi disajikan, serta daftar tombol pintas. Tekan **a** untuk membuka aplikasi di emulator Android, **i** untuk iOS Simulator (khusus macOS), **w** untuk membuka versi web, dan **r** untuk memuat ulang aplikasi secara manual. Tekan **Ctrl+C** untuk menghentikan server. Anda juga dapat menjalankan aplikasi langsung menuju jalur tertentu, misalnya `npx expo start --android` (setara menekan a) atau `npx expo start --tunnel` (lihat subbab 2.9).

### 2.8 Struktur Folder Project

Setelah pembuatan selesai, buka folder `aplikasi-pertama` di VS Code. Struktur yang tampak kira-kira sebagai berikut (tampilan di sisi kiri VS Code):

```
aplikasi-pertama/
├── assets/
│   └── (ikon dan gambar bawaan template)
├── node_modules/
├── .gitignore
├── App.js
├── app.json
├── index.js
└── package.json
```

Peran setiap berkas/folder:

- **App.js** — komponen (bagian antarmuka) utama aplikasi. Inilah "pintu masuk" tampilan Anda; berkas ini yang akan sering Anda edit. Konsep komponen dipelajari mulai Bab 4.
- **index.js** — berkas pintu masuk (entry point) yang didaftarkan di `package.json` melalui kunci `main`; isinya memanggil `registerRootComponent` untuk memberitahu Expo komponen mana yang dirender pertama kali.
- **app.json** — berkas konfigurasi project dalam format JSON: nama aplikasi yang tampil di ponsel, *slug* (identitas unik project), versi, orientasi layar, ikon, dan pengaturan lainnya. Konfigurasi ini menjadi dasar saat build ke toko aplikasi (Bab 15).
- **package.json** — "KTP" project: memuat nama, daftar skrip (misalnya `start` untuk `expo start`), dan daftar dependensi versi eksak sesuai SDK. Jangan mengedit bagian ini secara manual kecuali memahami dampaknya.
- **assets/** — folder aset statis: ikon aplikasi dan gambar lain yang dipakai template. Saat Anda membutuhkan gambar sendiri, simpan di sini.
- **node_modules/** — folder berisi semua paket yang diunduh npm; folder ini sengaja tidak pernah diedit dan tidak dilaporkan ke sistem kendali versi karena dapat dipasang ulang kapan saja dengan `npm install`.
- **.gitignore** — daftar pola berkas yang dikecualikan dari Git (misalnya `node_modules/` dan `.expo/`); bermanfaat saat Anda mulai memakai Git untuk melacak perubahan kode.

Selain daftar di atas, setelah `npx expo start` dijalankan akan muncul folder **.expo/** yang menyimpan pengaturan lokal dan informasi perangkat — folder ini dibuat otomatis dan tidak perlu disentuh. *⚠ version-sensitive: isi persis template (nama aset ikon, berkas tambahan seperti `expo-env.d.ts`, atau susunan `app.json`) dapat berbeda antarversi SDK; jika struktur Anda tidak persis seperti di atas, jangan khawatir — yang wajib dipahami adalah peran keempat berkas inti: App.js, index.js, app.json, dan package.json.*

### 2.9 Menjalankan Aplikasi Pertama

Ada tiga jalur untuk melihat aplikasi Anda berjalan. Pilih sesuai perangkat yang tersedia.

**Jalur 1 — Expo Go di ponsel.** Pastikan ponsel terpasang Expo Go (dari Google Play untuk Android atau App Store untuk iOS; perhatikan catatan SDK 57 di subbab 2.4) dan ponsel berada di **jaringan Wi-Fi yang sama** dengan komputer. Di terminal Expo, pindai kode QR: di iPhone, buka aplikasi Kamera lalu arahkan ke QR; di Android, gunakan pemindai yang tersedia di dalam aplikasi Expo Go (menu Scan QR code). Aplikasi akan terunduh dari komputer ke ponsel dan langsung tampil.

**Jalur 2 — Emulator Android.** Pastikan emulator sudah dinyalakan melalui AVD Manager di Android Studio, lalu tekan **a** di terminal Expo (atau jalankan `npx expo start --android`). Metro akan memasang aplikasi pada emulator dan membukanya.

**Jalur 3 — Perangkat fisik Android lewat kabel USB.** Aktifkan Developer options dan USB debugging (subbab 2.5), sambungkan kabel, verifikasi dengan `adb devices`, lalu tekan **a** di terminal. Untuk pengembangan harian, jalur Wi-Fi + Expo Go lebih praktis karena tidak bergantung kabel.

Jika ponsel berada di jaringan yang berbeda dari komputer (misalnya hotspot ponsel, atau Wi-Fi kampus yang memblokir komunikasi antarperangkat), kode QR tidak akan berfungsi. Solusinya: matikan server dengan **Ctrl+C**, lalu nyalakan ulang dengan:

```bash
npx expo start --tunnel
```

Penjelasan: opsi `--tunnel` membuat Metro menjembatani koneksi melalui server publik (tunnel), sehingga ponsel dapat menjangkau komputer meskipun tidak satu jaringan. Trade-off-nya: kecepatan transfer lebih lambat dan membutuhkan koneksi internet yang stabil, tetapi jaringannya tidak perlu diubah.

Aplikasi pertama Anda adalah "Hello World" bawaan template: teks `Open up App.js to start working on your app!` di tengah layar. Ubahlah isi **App.js** menjadi teks sapaan Anda sendiri, simpan berkasnya, dan perhatikan layar ponsel — dalam satu hingga dua detik tampilan berubah tanpa Anda menekan apa pun. Itulah Fast Refresh yang dijelaskan di subbab 2.4. Seluruh perintah yang dipakai di bab ini dirangkum pada tabel berikut:

| Perintah | Fungsi |
|---|---|
| `node --version` / `npm --version` | Memeriksa versi Node.js/npm (verifikasi instalasi) |
| `npx create-expo-app nama-app --template blank` | Membuat project Expo baru bermodel JavaScript polos |
| `cd nama-app` | Berpindah ke folder project |
| `code .` | Membuka folder project di VS Code |
| `npx expo start` | Menyalakan Metro Bundler dan server pengembangan |
| `npx expo start --tunnel` | Menyalakan server dengan jembatan jaringan publik |
| `npx expo start --android` | Menyalakan server sekaligus membuka di emulator Android |
| Tekan `a` / `i` / `w` / `r` di terminal Expo | Buka di Android / iOS Simulator / web / muat ulang manual |
| `Ctrl+C` | Menghentikan server pengembangan |
| `adb devices` | Menampilkan daftar perangkat Android yang terhubung |

## Contoh

**Contoh 1: memastikan Node.js benar-benar bisa menjalankan kode.** Sebelum menulis aplikasi, buktikan bahwa Node.js berfungsi dengan membuat berkas JavaScript kecil dan menjalankannya.

File: kode/bab-02/sapaan.js

```js
console.log('Halo, calon developer mobile!');
console.log('Node.js yang aktif: ' + process.version);
console.log('Project React Native dan Expo siap dibangun.');
```

Penjelasan: `console.log` adalah fungsi untuk mencetak teks ke terminal — akan sangat sering dipakai untuk men-debug program (Bab 14 membahas debugging lebih dalam). `process.version` adalah properti Node.js yang menyimpan nomor versi runtime yang sedang berjalan. Simpan berkas ini di folder `aplikasi-pertama` lalu jalankan dari terminal project:

```bash
node sapaan.js
```

Penjelasan: perintah `node <namaberkas>.js` menyuruh Node.js mengeksekusi berkas tersebut. Jika tiga baris teks muncul di terminal, berarti rantai Node.js → npm → project berfungsi penuh. Setelah terbukti, Anda boleh menghapus berkas ini (tidak akan dipakai lagi).

**Contoh 2: melihat berkas pintu masuk project.** Buka `index.js` hasil template — perhatikan bahwa project Expo "menghidupkan" aplikasi melalui pemanggilan pendaftaran komponen.

File: kode/bab-02/index.js

```js
import { registerRootComponent } from 'expo';
import App from './App';

// Mendaftarkan komponen utama agar Metro tahu apa yang harus dirender pertama kali
registerRootComponent(App);
```

Penjelasan: baris pertama mengimpor (meminjam) fungsi `registerRootComponent` dari paket `expo`, dan baris kedua mengimpor komponen `App` dari berkas `App.js`. Baris terakhir memanggil fungsi tersebut untuk menetapkan `App` sebagai komponen akar. Konsep `import`/`export` (modul) akan dibahas tuntas di Bab 3 — untuk sekarang cukup pahami alurnya: `index.js` → `App.js` → tampilan.

**Contoh 3: mengenal berkas konfigurasi.** Perhatikan `app.json` — meskipun dibuatkan otomatis, Anda perlu mengenal beberapa kunci penting sejak awal.

File: kode/bab-02/app.json

```json
{
  "expo": {
    "name": "AplikasiPertama",
    "slug": "aplikasi-pertama",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "light",
    "newArchEnabled": true
  }
}
```

Penjelasan: `name` adalah nama aplikasi yang tampil di bawah ikon pada ponsel; `slug` adalah identitas unik untuk layanan Expo; `version` adalah nomor versi aplikasi Anda (berbeda dari versi SDK); `orientation` membatasi orientasi layar (di sini potret/tegak); `userInterfaceStyle` mengatur tema antarmuka; `newArchEnabled` menandakan project memakai New Architecture React Native (arsitektur terbaru — lihat Bab 1). *⚠ version-sensitive: berkas yang dihasilkan template memuat lebih banyak kunci (ikon, splash screen, pengaturan adaptif Android, dan plugin); contoh di atas hanyalah inti yang wajib Anda pahami, bukan salinan persis template.*

## Praktikum

Praktikum ini memandu Anda dari nol: lingkungan kosong hingga aplikasi pertama tampil di layar.

### Tujuan Praktikum

1. Membuat project Expo pertama dengan template blank (JavaScript polos).
2. Menjalankan server pengembangan `npx expo start` dan memahami antarmukanya.
3. Melihat aplikasi berjalan pada tiga jalur: Expo Go, emulator Android, dan (jika tersedia) perangkat fisik.
4. Mengubah kode "Hello World" dan membuktikan Fast Refresh bekerja.
5. Melatih diagnosis kendala lingkungan melalui daftar Troubleshooting.

### Kebutuhan

- Laptop/komputer (Windows, macOS, atau Linux) dengan koneksi internet.
- Node.js LTS terbaru (minimal 22) sudah terpasang dan terverifikasi (`node --version`).
- VS Code (disarankan) beserta ekstensi ESLint dan Prettier.
- Ponsel Android/iOS dengan **Expo Go** terpasang (disarankan), dan/atau Android Studio untuk emulator — setidaknya salah satu wajib tersedia agar hasil praktikum terlihat.

### Persiapan

1. Pastikan Node.js dan npm terverifikasi: jalankan `node --version` dan `npm --version` di terminal; catat kedua nomor versi di laporan praktikum Anda.
2. Buat folder kerja khusus, misalnya `proyek-kuliah`, dan jadikan folder itu direktori aktif terminal.
3. Jika memakai ponsel, pastikan Expo Go terpasang (lihat catatan subbab 2.4) dan ponsel berada di Wi-Fi yang sama dengan laptop.
4. Jika memakai emulator, nyalakan Android Studio lalu buat satu perangkat virtual melalui AVD Manager (pilih model ponsel dan versi Android terbaru yang tersedia), lalu nyalakan emulator tersebut agar sudah berjalan sebelum langkah kerja dimulai.

### Langkah Kerja

1. Buka terminal (PowerShell/Command Prompt di Windows; Terminal di macOS/Linux) dan arahkan ke folder kerja: `cd proyek-kuliah`.
2. Jalankan `npx create-expo-app aplikasi-pertama --template blank`. Perhatikan prosesnya: npx mengunduh alat pembuat project, lalu npm memasang seluruh dependensi ke `node_modules` — proses ini bisa memakan beberapa menit pada koneksi lambat. Baca pesan sukses yang muncul di akhir; pesan tersebut memberi tahu cara menjalankan project (langkah 4).
3. Masuk ke folder project: `cd aplikasi-pertama`. Coba telusuri struktur folder dengan perintah `ls` (macOS/Linux) atau `dir` (Windows) — bandingkan dengan struktur pada subbab 2.8.
4. Buka project di VS Code: `code .`. Di panel Explorer (kiri), buka berkas **App.js** dan amati isinya — templat default menampilkan teks instruksi di tengah layar.
5. Kembali ke terminal dan jalankan `npx expo start`. Tunggu hingga muncul kode QR dan teks antarmuka interaktif. Perhatikan baris yang menyebutkan alamat seperti `exp://192.168.x.x:8081` — itulah alamat LAN tempat Metro menyajikan aplikasi.
6. **Jalur Expo Go:** buka Expo Go di ponsel, pindai kode QR (di iPhone lewat aplikasi Kamera; di Android lewat pemindai di dalam Expo Go). Tunggu proses "memasang" (bundling) beberapa detik pada percobaan pertama — aplikasi akan tampil.
7. **Jalur emulator:** jika emulator sudah menyala, tekan **a** di terminal Expo. Aplikasi terbuka di jendela emulator.
8. **Jalur perangkat fisik (opsional):** sambungkan ponsel Android dengan USB (Developer options + USB debugging aktif, subbab 2.5), verifikasi dengan `adb devices`, lalu tekan **a**.
9. Ubah teks pada **App.js** (misalnya ganti isi `<Text>` menjadi nama dan NIM Anda), simpan berkas (Ctrl+S), dan amati Fast Refresh: layar ponsel/emulator berubah otomatis. Secara sengaja tulis satu baris yang salah (misalnya hapus tanda kutip), simpan, dan amati munculnya layar kesalahan merah beserta pesannya — lalu kembalikan kode yang benar.
10. Setelah puas, hentikan server dengan **Ctrl+C** di terminal.

### Kode

Kode lengkap aplikasi "Hello World" yang menjadi produk praktikum ini:

File: kode/bab-02/App.js

```js
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.kontainer}>
      <Text style={styles.judul}>Halo, Dunia!</Text>
      <Text style={styles.keterangan}>
        Project Expo pertama saya berhasil berjalan di perangkat.
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  kontainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  judul: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  keterangan: {
    fontSize: 16,
    color: '#555555',
    marginTop: 8,
    textAlign: 'center',
  },
});
```

### Penjelasan Kode

Berkas ini adalah komponen `App` — fungsi JavaScript yang mengembalikan deskripsi antarmuka. Dua baris `import` di awal meminjam alat dari pustaka: `StatusBar` dari paket `expo-status-bar` (pengatur bilah status atas layar) serta `StyleSheet`, `Text`, dan `View` dari `react-native`. `View` adalah kotak penampung antarmuka (seperti `div` di web), `Text` adalah teks yang tampil, dan `StyleSheet.create` adalah cara React Native menulis gaya (style) — ketiganya baru dikupas mendalam di Bab 5, jadi di sini cukup tiru polanya. Fungsi `App` mengembalikan struktur: satu `View` berisi dua `Text` dan satu `StatusBar`. Gaya ditulis sebagai objek dengan nama deskriptif (`kontainer`, `judul`, `keterangan`): `flex: 1` membuat kotak memenuhi layar, `alignItems` dan `justifyContent` memusatkan isi, sedangkan `fontSize`, `fontWeight`, dan `color` mengatur tampilan huruf — contoh di atas mengikuti pola resmi template SDK 57 dan dapat Anda ketik ulang, ganti teksnya, lalu amati perubahannya.

### Hasil yang Diharapkan

- Terminal menampilkan dua nomor versi saat `node --version` dan `npm --version` dijalankan.
- `npx create-expo-app aplikasi-pertama --template blank` selesai tanpa galat dan folder `aplikasi-pertama` terbentuk.
- `npx expo start` menampilkan kode QR dan alamat `exp://...:8081`.
- Aplikasi tampil di Expo Go (ponsel) dan/atau emulator Android dengan teks "Halo, Dunia!" di tengah layar.
- Setelah mengubah dan menyimpan App.js, tampilan berubah sendiri dalam 1–2 detik (Fast Refresh), dan layar kesalahan merah muncul ketika kode sengaja dirusak lalu hilang setelah dikembalikan.
- `adb devices` menampilkan entri `emulator-5554` (emulator) atau nama perangkat fisik Anda saat terhubung.

### Troubleshooting

**Masalah:** Terminal menjawab `node: command not found` (atau `'node' is not recognized as an internal or external command`).
**Penyebab:** Node.js belum terpasang, atau pemasangannya tidak tercatat pada PATH (daftar folder tempat sistem operasi mencari perintah).
**Solusi:** Unduh pemasang Node.js LTS dari situs resmi nodejs.org lalu pasang; pada Windows, centang opsi "Add to PATH" saat pemasangan. Setelah selesai, **buka terminal baru** (terminal lama tidak membaca PATH yang baru) dan ulangi `node --version`.
**Pencegahan:** Selalu unduh Node.js dari situs resmi, bukan dari tautan sembarang; verifikasi `node --version` dan `npm --version` sebelum memulai project apa pun.

**Masalah:** Saat `npx expo start` dijalankan, muncul peringatan bahwa port 8081 sedang dipakai aplikasi lain.
**Penyebab:** Ada program lain (project Expo lain, atau aplikasi apa pun) yang menduduki port 8081 — port default Metro.
**Solusi:** Tutup program yang memakainya, atau jalankan Metro di port lain dengan `npx expo start --port 8082`. Jika ingin memaksa mematikan pendudukinya di Windows: `netstat -ano | findstr 8081` untuk menemukan PID (identitas proses), lalu `taskkill /PID <angka-pid> /F`.
**Pencegahan:** Hentikan server Expo lama dengan Ctrl+C sebelum menyalakan yang baru, dan matikan aplikasi yang tidak perlu ketika mengembangkan.

**Masalah:** Layar ponsel/emulator menampilkan latar merah dengan pesan galat saat save — atau tiba-tiba muncul "Unable to resolve module ...".
**Penyebab:** Galat bundling di Metro: kode yang baru disimpan mengandung kesalahan sintaks, atau ada modul yang tidak ditemukan (misalnya nama berkas salah ketik).
**Solusi:** Baca baris pertama pesan galat — Metro menuliskan berkas dan baris yang bermasalah. Perbaiki kodenya, simpan, dan Fast Refresh akan mencoba lagi. Jika galat tetap muncul padahal kode tampak benar, coba jalankan `npx expo start -c` untuk membersihkan cache Metro, atau mulai ulang server dengan Ctrl+C lalu `npx expo start`.
**Pencegahan:** Simpan berkas secara teratur, biasakan memakai IntelliSense dan ESLint di VS Code untuk menangkap kesalahan ketik sebelum dijalankan, serta jangan menghapus berkas yang masih di-*import*.

**Masalah:** Menekan **a** di terminal Expo tidak membuka apa pun; tidak ada emulator yang muncul.
**Penyebab:** Emulator belum dinyalakan, atau Android Studio belum membuat perangkat virtual sama sekali (AVD kosong).
**Solusi:** Buka Android Studio → Device Manager (AVD Manager) → buat perangkat virtual bila belum ada (pilih model dan versi Android) → klik ikon *play* untuk menyalakannya, tunggu sampai layar ponsel virtual selesai booting, baru tekan **a** lagi di terminal Expo.
**Pencegahan:** Selalu nyalakan emulator sebelum `npx expo start` (atau minimal sebelum menekan a), dan pastikan laptop memenuhi kebutuhan memori emulator (disarankan 8 GB RAM ke atas).

**Masalah:** Perangkat fisik tidak muncul; `adb devices` menampilkan daftar kosong atau status `unauthorized`.
**Penyebab:** USB debugging belum aktif, kabel tidak mendukung transfer data, atau ponsel belum menyetujui autentikasi komputer.
**Solusi:** Periksa Developer options → USB debugging sudah aktif; ganti kabel (beberapa kabel hanya untuk pengisian daya); perhatikan dialog "Izinkan debugging USB?" di ponsel lalu pilih izinkan dan centang *always allow*; cabut dan pasang ulang kabel jika status tetap `unauthorized`.
**Pencegahan:** Gunakan kabel original yang mendukung data, dan cukup sekali menyetujui autentikasi per komputer; untuk pengujian harian, jalur Wi-Fi + Expo Go lebih andal daripada USB.

**Masalah:** Perubahan kode tidak tampil di layar meskipun berkas sudah disimpan; layar tetap menampilkan versi lama.
**Penyebab:** Fast Refresh gagal diam-diam (misalnya karena kesalahan yang tidak fatal pada berkas lain), atau cache Metro menyimpan versi lama.
**Solusi:** Tekan **r** di terminal Expo untuk memuat ulang manual; jika masih, hentikan server (Ctrl+C) lalu jalankan `npx expo start -c` (opsi `-c` membersihkan cache). Pada emulator/ponsel, muat ulang paksa bisa dilakukan lewat menu pengembang (gerakan shake pada perangkat fisik).
**Pencegahan:** Perhatikan terminal — Fast Refresh melaporkan status di sana; jika layar tidak berubah, terminal biasanya sudah memberi tahu alasannya.

**Masalah:** Expo Go menampilkan pesan bahwa project tidak kompatibel dengan versi Expo Go yang terpasang (perbedaan SDK antara project dan aplikasi).
**Penyebab:** Versi Expo Go di ponsel tidak mendukung SDK 57 yang dipakai project Anda — misalnya karena versi di toko aplikasi belum diperbarui.
**Solusi:** Perbarui Expo Go ke versi yang mendukung SDK 57 (lihat catatan subbab 2.4 tentang pemasangan melalui `eas go` di iOS atau fasilitas Expo CLI di Android — *⚠ version-sensitive*). Pastikan project dan perangkat memakai SDK yang sama dengan memeriksa versi `expo` di `package.json`.
**Pencegahan:** Sebelum memulai project, pastikan versi Expo Go yang terpasang mendukung SDK yang sama dengan `package.json`; jika ragu, jalankan `npx expo-doctor` untuk memeriksa kesehatan project dan kompatibilitas paket.

**Masalah:** Kode QR tidak dapat dihubungkan; Expo Go menampilkan "could not connect" atau aplikasi tidak pernah selesai dimuat.
**Penyebab:** Ponsel dan komputer berada di jaringan berbeda, atau jaringan memblokir komunikasi antarperangkat (umum terjadi di Wi-Fi kampus/kantor).
**Solusi:** Matikan server (Ctrl+C) lalu nyalakan dengan `npx expo start --tunnel` dan pindai ulang kode QR — tunnel menghubungkan perangkat lewat internet, bukan lewat jaringan lokal.
**Pencegahan:** Untuk kerja harian, gunakan Wi-Fi yang sama; simpan perintah `--tunnel` sebagai cadangan untuk jaringan yang ketat, dan ingat bahwa transfer lewat tunnel lebih lambat dari jaringan lokal.

## Studi Kasus

**Kasus: Standarisasi lingkungan di Divisi Sistem Informasi kampus.** Divisi Sistem Informasi sebuah perguruan tinggi merekrut tiga mahasiswa magang untuk membuat prototipe aplikasi pengumuman akademik berbasis mobile. Ketiga magang datang dengan komputer berbeda: Windows 11, macOS, dan Linux. Pada minggu pertama, tim menemukan tiga masalah: (1) satu magang memasang Node versi lama karena mengikuti tutorial YouTube tahun sebelumnya; (2) magang lain memakai yarn untuk menginstal, sehingga berkas kunci berbeda dari rekan-rekannya; (3) aplikasi yang berjalan di laptop satu orang gagal di laptop orang lain, disertai jawaban klasik "di komputer saya jalan kok". Akibatnya, seminggu terbuang untuk menyamakan versi sebelum satu baris kode pun ditulis.

**Analisis.** Kasus ini adalah gambaran nyata masalah *reproducibility* (keterulangan) lingkungan pengembangan di dunia Sistem Informasi/Teknik Informatika. Materi bab ini memberi tiga senjata untuk menyelesaikannya. Pertama, **pembakuan platform**: seluruh anggota tim memakai Node.js LTS yang sama dan memverifikasinya dengan `node --version` — versi runtime yang berbeda adalah sumber galat tersamar (misalnya perbedaan perilaku sintaks). Kedua, **satu package manager**: pemakaian npm secara seragam menghindari perbedaan berkas kunci dan strategi penyimpanan antaranggota tim. Ketiga, **npx daripada instalasi global**: karena `npx create-expo-app` dan `npx expo start` selalu mengambil versi terkini dari registry secara transparan, tidak ada lagi "versi alat yang berbeda di tiap laptop". Emulator dan Expo Go melengkapi cerita ini: dengan emulator, tim tidak perlu meminjam ponsel untuk menguji; dengan Expo Go, prototipe pengumuman akademik dapat langsung dicoba rektor di ponselnya tanpa proses build. Trade-off yang harus disadari tim: Expo Go tidak cukup untuk fitur yang membutuhkan kode native, sehingga prototipe yang lolos tahap ini akan berpindah ke development build dan pipeline build (Bab 15). Kebiasaan yang Anda latih di bab ini — memverifikasi versi, membaca pesan galat, dan mencatat kendala — adalah cikal bakal praktik *environment management* yang dibutuhkan saat Anda terlibat dalam project nyata, termasuk Project Akhir buku ini, Sistem Informasi Akademik Mobile, yang akan dikerjakan bersama tim pada akhir semester.

## Latihan

### Soal Pemahaman

1. Jelaskan perbedaan peran antara `npm` dan `npx`; berikan satu contoh penggunaan masing-masing.
2. Mengapa buku ini memilih templat `blank` daripada templat default `create-expo-app`? Kaitkan jawaban Anda dengan bahasa pemrograman yang digunakan di seluruh buku.
3. Apa fungsi Metro Bundler dan mengapa ia berjalan di atas Node.js?
4. Sebutkan minimal empat berkas/folder inti hasil `create-expo-app` dan fungsi masing-masing.
5. Apa perbedaan utama emulator Android dan iOS Simulator dari sisi sistem operasi tempat keduanya dapat berjalan?

### Soal Praktik

1. Buat project kedua bernama `praktik-hello` dengan `npx create-expo-app praktik-hello --template blank`, jalankan dengan `npx expo start`, lalu ubah `App.js` sehingga menampilkan "Hello, <nama Anda> — NIM <nim Anda>" di tengah layar. Screenshot hasilnya.
2. Nyalakan emulator Android, pastikan `adb devices` menampilkannya, lalu jalankan project `praktik-hello` di emulator dengan menekan tombol **a**. Catat berapa detik yang dibutuhkan dari menekan **a** hingga aplikasi tampil, lalu bandingkan dengan waktu pemuatan di Expo Go — tuliskan kesimpulan singkat.
3. Gunakan `npx expo start --tunnel` di jaringan yang berbeda dari ponsel Anda (misalnya pakai hotspot), pindai QR ulang, dan dokumentasikan pengalaman Anda: apa yang berubah dari segi kecepatan dan stabilitas?

### Soal Analisis

Sebuah tim memutuskan semua anggota memakai Node versi terbaru (bukan LTS) "agar fiturnya lengkap". Berdasarkan pemahaman Anda tentang LTS, package manager, dan risiko lingkungan pengembangan pada kasus Divisi Sistem Informasi di atas, analisislah keputusan tersebut: apa keuntungan jangka pendeknya, apa risiko jangka panjangnya bagi project tim, dan bagaimana Anda menanggulanginya bila sudah terlanjur terjadi?

## Tantangan

1. **Papan kendali lingkungan (environment dashboard):** buat berkas `cek-lingkungan.js` yang mencetak versi Node.js (`process.version`), lokasi npm, dan daftar perangkat Android (`adb devices` dijalankan dari skrip) dalam satu tampilan rapi, lalu jalankan dengan satu perintah `node cek-lingkungan.js`. (Petunjuk: pelajari `child_process.execSync` di dokumentasi resmi Node.js — *⚠ version-sensitive, konsultasikan docs.nodejs.org*.)
2. **Dokumentasi tim:** tulis berkas `LANGKAH-SETUP.md` di folder project berisi langkah instalasi dari nol (Node.js → verifikasi → create-expo-app → expo start → menguji di emulator dan ponsel) lengkap dengan perintah yang sahih, seolah-olah dokumen itu akan dipakai anggota tim baru. Uji dokumen tersebut dengan mengikuti langkahnya sendiri di folder terpisah.
3. **Eksperimen perbandingan:** ukur waktu muat pertama aplikasi pada tiga lingkungan (Expo Go, emulator, perangkat fisik) dan tulis tabel perbandingannya beserta analisis mengapa perbedaannya terjadi (perhatikan proses bundling Metro versus kecepatan perangkat).

## Rangkuman

1. Node.js adalah runtime JavaScript di luar browser; Expo CLI dan Metro Bundler berjalan di atasnya, sehingga Node.js menjadi prasyarat mutlak.
2. npm adalah package manager bawaan Node yang mengelola dependensi dan mencatatnya di package.json; pilih satu package manager dan konsisten menggunakannya.
3. npx menjalankan perintah paket tanpa instalasi global, menjamin alat yang dipakai selalu versi terkini — dasar dari `npx create-expo-app` dan `npx expo start`.
4. VS Code dengan ekstensi ESLint dan Prettier adalah editor yang disarankan; hindari ekstensi yang sudah diarsipkan pengembangnya.
5. Expo Go memungkinkan pengujian instan di ponsel tanpa build, dengan trade-off keterbatasan fitur native yang diatasi development build (Bab 15).
6. Emulator Android (dikelola Android Studio + adb) cocok untuk pengujian lintas-versi; perangkat fisik lebih baik untuk sensor dan pengalaman nyata (Bab 12).
7. iOS Simulator hanya tersedia di macOS; pengguna Windows dapat menguji iOS via ponsel fisik ber-Expo Go atau build cloud (Bab 15).
8. Project Expo pertama dibuat dengan `npx create-expo-app nama-app --template blank`; template blank berarti JavaScript polos, sedangkan template default memakai TypeScript.
9. `npx expo start` menyalakan Metro di port 8081; pemakaian `--tunnel` mengatasi jaringan yang memblokir komunikasi antarperangkat, dan Fast Refresh memperbarui layar otomatis saat kode disimpan.

## Refleksi

1. Saat Anda mengikuti Praktikum 2, bagian mana yang paling banyak menyita waktu — instalasi, menjalankan, atau memahami galat? Apa yang akan Anda lakukan berbeda pada project berikutnya?
2. Pernahkah Anda mengalami masalah "di komputer saya jalan kok"? Analisis bagaimana kebiasaan memverifikasi versi (node, npm, SDK) dapat mencegah kejadian serupa.
3. Manakah jalur pengujian (Expo Go, emulator, perangkat fisik) yang paling nyaman bagi gaya belajar Anda, dan kapan Anda akan memilih jalur lain dalam project sungguhan?
4. Bagaimana pengetahuan tentang package manager dan lingkungan pengembangan ini terhubung dengan karier yang Anda tuju di bidang Sistem Informasi/Teknik Informatika?

## Evaluasi Bab

### Pilihan Ganda

1. Alat berikut ini WAJIB tersedia sebelum menjalankan `npx create-expo-app` adalah ....
   A. Android Studio
   B. Node.js
   C. VS Code
   D. Expo Go
2. Perbedaan utama `npm install <paket>` dan `npx <perintah>` adalah ....
   A. npm lebih cepat daripada npx
   B. npm memasang paket ke project, npx menjalankan perintah tanpa memasang permanen
   C. npx hanya bekerja di macOS
   D. keduanya identik
3. Alasan buku ini memilih `--template blank` adalah ....
   A. blank menghasilkan project yang lebih kecil di toko aplikasi
   B. blank tidak membutuhkan Node.js
   C. blank menghasilkan project JavaScript polos, sementara template default memakai TypeScript
   D. blank otomatis memasang Expo Router
4. Peran Metro Bundler pada `npx expo start` adalah ....
   A. menyimpan kode ke GitHub
   B. menggabungkan modul JavaScript dan mengirimkannya ke perangkat
   C. mengompilasi kode menjadi APK
   D. menggantikan peran npm
5. Port default yang dipakai Metro Bundler adalah ....
   A. 3000
   B. 5000
   C. 8081
   D. 9000
6. Jika ponsel dan komputer berada di jaringan berbeda, perintah yang tepat adalah ....
   A. `npx expo start --tunnel`
   B. `npx expo start --port 3000`
   C. `npm start --force`
   D. `node sapaan.js`
7. Berkas yang berfungsi sebagai pintu masuk (entry point) project Expo adalah ....
   A. App.js
   B. index.js
   C. app.json
   D. package.json
8. Pernyataan yang paling tepat tentang iOS Simulator adalah ....
   A. dapat berjalan di Windows dengan Android Studio
   B. hanya berjalan di macOS dan membutuhkan Xcode
   C. sama dengan emulator Android
   D. membutuhkan akun berbayar Apple

### Soal Uraian

1. Jelaskan fungsi `app.json`, `package.json`, dan `node_modules/` dalam sebuah project Expo, serta alasan `node_modules/` tidak pernah diedit manual.
2. Uraikan langkah-langkah yang Anda lakukan bila `adb devices` tidak menampilkan ponsel fisik yang sudah dicolokkan, beserta alasan tiap langkah.
3. Bandingkan tiga jalur pengujian (Expo Go, emulator Android, perangkat fisik) dari sisi: kecepatan persiapan, kesesuaian dengan perilaku perangkat sungguhan, dan keterbatasan masing-masing. Kapan Anda memilih tiap jalur?

### Kunci Jawaban

<details>
<summary>Kunci Jawaban Pilihan Ganda</summary>

1. B
2. B
3. C
4. B
5. C
6. A
7. B
8. B

</details>