# BAB 15 — Build dan Deployment

## Deskripsi Singkat

Bab ini menutup siklus pengembangan aplikasi: mengubah kode yang selama ini Anda jalankan di emulator menjadi **build** (hasil kompilasi) yang siap dibagikan, lalu **deployment** (penerapan atau penyebaran) ke toko aplikasi. Anda akan mempelajari perbedaan build pengembangan dan build produksi, layanan build cloud **EAS Build**, konfigurasi identitas aplikasi di `app.json`, variabel lingkungan, penandatanganan (signing), serta alur distribusi ke Google Play dan App Store. Bab ini berangkat dari Aplikasi Manajemen Data Mahasiswa yang Anda bangun di Bab 6–8 dan backend di Bab 10, dan menuntaskan jaminan kualitas yang dimulai di Bab 14.

## Tujuan Pembelajaran

Setelah mempelajari bab ini, mahasiswa mampu:

1. Membedakan development build dan production build serta menentukan kapan masing-masing digunakan.
2. Menjelaskan peran EAS Build dan ketiga profil build (development, preview, production) beserta produk yang dihasilkannya (APK/AAB).
3. Mengonfigurasi `app.json` meliputi identitas aplikasi (name, slug, application ID), versi semantik, ikon, dan splash screen.
4. Menganalisis peran environment variable ber-prefiks `EXPO_PUBLIC_` beserta batasannya terhadap kerahasiaan (secret).
5. Mengidentifikasi konsep signing (penandatanganan) dan risiko kehilangan kunci penandatanganan.
6. Merancang strategi distribusi aplikasi di Google Play (tracks saluran uji) dan memahami alur App Store secara konseptual.

## Peta Konsep

```text
          BAB 15 — DARI KODE MENUJU TOKO APLIKASI
┌──────────────┬──────────────┬───────────────┬──────────────┐
│ 15.1 Dev vs  │  15.2 EAS    │  15.3 Android │  15.4 iOS    │
│ Production   │   Build      │   APK vs AAB  │ (konseptual) │
│  Build       │  (3 profil)  │               │              │
├──────────────┴──────┬───────┴──────┬────────┴──────┬───────┤
│ 15.5 Konfigurasi    │ 15.6 Env     │ 15.7 Signing  │       │
│ app.json: name,     │ Variable     │ (keystore,    │       │
│ ID, versi, ikon,    │ EXPO_PUBLIC_ │ sertifikat)   │       │
│ splash              │              │               │       │
├─────────────────────┴──────┬───────┴───────────────┴───────┤
│ 15.8 Google Play           │ 15.9 App Store (konseptual)    │
│ internal/closed/open/      │ App Store Connect, TestFlight, │
│ production + review        │ review, biaya keanggotaan      │
├────────────────────────────┴───────────────────────────────┤
│ 15.10 Ringkasan: Development → Preview/Testing → Production │
│ Produk praktikum: app.json + eas.json + build APK (EAS)     │
└─────────────────────────────────────────────────────────────┘
```

## Materi

Sepanjang Bab 1–14 Anda bekerja dalam lingkup "aplikasi yang berjalan di emulator atau perangkat pengembang". Dunia nyata Sistem Informasi menuntut lebih: aplikasi harus sampai ke pengguna dalam jumlah besar, dengan versi yang terkendali, tanda tangan keaslian, dan cara memperbarui yang tidak merusak data. Build dan deployment menjawab tiga pertanyaan kunci: bagaimana kode menjadi berkas yang bisa dipasang, bagaimana berkas itu dijamin otentik, dan melalui saluran apa berkas itu sampai ke pengguna. Mengapa teknologi ini ada? Karena mendistribusikan berkas secara asal — misalnya mengirim APK lewat grup WhatsApp — terbukti berbahaya: tidak ada kendali versi, tidak ada jejak siapa menginstal apa, dan aplikasi tidak dapat diperbarui secara terpusat. Bab 14 menjamin kualitas isi aplikasi; bab ini menjamin kualitas pengemasannya.

### 15.1 Development Build vs Production Build

**Build** adalah hasil akhir proses kompilasi: kode JavaScript, aset (gambar, font), dan konfigurasi native dirakit menjadi satu berkas yang dapat diinstal pada perangkat. React Native tidak menjalankan kode Anda langsung seperti di web — bundel JavaScript dibuat oleh **Metro** (bundler yang sudah Anda kenal dari Bab 2), lalu digabung dengan kerangka native Android/iOS.

Selama pengembangan, `npx expo start` menjalankan Metro di komputer Anda dan aplikasi di Expo Go atau emulator memuat bundel dari server itu. Setiap perubahan langsung terlihat lewat Fast Refresh. Mode inilah yang disebut **development build** (build pengembangan): prosesnya cepat, menampilkan pesan error yang kaya, terhubung ke alat debugging (Bab 14), tetapi tidak dioptimalkan. Berkasnya besar, lambat, dan bergantung pada komputer pengembang — mustahil dibagikan ke pengguna akhir.

**Production build** (build produksi) adalah kebalikannya: JavaScript diminifikasi (dipadatkan, variabel dipersingkat, komentar dibuang), aset dioptimalkan, bundel disimpan di dalam aplikasi sehingga tidak lagi butuh Metro, dan berkas ditandatangani sebagai bukti keaslian. Hasilnya lebih kecil, lebih cepat, dan itulah yang diunggah ke toko aplikasi. Trade-off-nya jelas: kemudahan debugging dikorbankan demi ukuran, kecepatan, dan keamanan — pengorbanan yang wajar karena pengguna akhir tidak pernah perlu membaca pesan error internal.

Kapan menggunakan yang mana? Development build dipakai setiap hari oleh pengembang dan penguji; production build dibuat hanya saat akan dirilis, diuji, atau dibagikan secara terbatas. Di ekosistem Expo, pembuatan production build dilakukan dengan EAS Build (subbab 15.2) — baik di cloud maupun di mesin lokal.

### 15.2 EAS Build

**EAS (Expo Application Services)** adalah kumpulan layanan cloud dari tim Expo untuk membangun, menandatangani, dan mengirim aplikasi. Bagian yang membangun disebut **EAS Build**. Mengapa layanan ini ada? Membangun aplikasi Android yang "sungguhan" memerlukan Android SDK, JDK, dan Gradle; membangun iOS memerlukan macOS dan Xcode. Di lingkungan kampus, tidak semua mahasiswa punya perangkat seberat itu — EAS memindahkan pekerjaan berat ke server Expo: Anda cukup mengirim kode, server yang mengompilasi, lalu mengembalikan hasilnya beserta tautan unduhan.

Alur penggunaannya sebagai berikut.

**Langkah 1 — Pasang eas-cli.** `eas-cli` adalah program baris perintah (command line interface/CLI) untuk berinteraksi dengan layanan EAS. Ada dua cara memasangnya:

File: terminal

```bash
# Cara A: pasang sekali secara global, lalu pakai perintah `eas`
npm install -g eas-cli

# Cara B: tanpa memasang, panggil langsung dengan `npx`
npx eas-cli --version
```

Penjelasan: cara A (`npm install -g eas-cli`) memasang alat ini sekali di komputer Anda; setelah itu perintah ditulis `eas login`, `eas build`, dan seterusnya. Di Windows, setelah pemasangan global kadang terminal lama tidak mengenali `eas` — buka terminal baru atau gunakan cara B. Cara B (`npx eas-cli ...`) tidak memasang apa pun secara permanen; npx mengunduh paket saat dibutuhkan, sehingga setiap perintah ditulis dengan awalan `npx eas-cli`. Pilih satu cara dan konsisten menggunakannya sepanjang bab ini. *⚠ version-sensitive: nama paket, cara pemasangan, dan perintah dapat berubah antarvensi; periksa docs.expo.dev saat Anda memasang.*

**Langkah 2 — Masuk dengan akun Expo.** `eas login` membuka alur masuk di terminal: masukkan alamat email dan kata sandi akun Expo (akun gratis dapat dibuat di situs resmi Expo). Perintah `eas whoami` menampilkan nama akun yang sedang aktif — berguna untuk memastikan Anda sudah masuk sebelum membangun.

**Langkah 3 — Siapkan konfigurasi.** `eas build:configure` memeriksa project Anda dan membuat berkas **eas.json** di folder root bila belum ada. Berkas inilah pusat kendali build. Strukturnya berisi tiga bagian utama: `cli` (pengaturan alat itu sendiri), `build` (kumpulan **build profile** — profil build), dan `submit` (digunakan saat mengirim build ke toko aplikasi, dibahas di subbab 15.8–15.9). Tiga profil standar yang akan selalu Anda jumpai:

- **development** — build untuk pengembangan: memakai `developmentClient: true`, artinya aplikasi hasil build adalah **development build** (subbab 15.1) yang dilengkapi expo-dev-client. Hasilnya dipasang di perangkat pengembang dan dipakai bersama `npx expo start --dev-client`. Tujuannya menguji modul native tambahan yang tidak tersedia di Expo Go.
- **preview** — build rilis untuk pengujian internal: aplikasi versi hampir final yang dapat diinstal langsung di perangkat penguji (hasilnya APK untuk Android), tanpa melalui toko aplikasi. Cocok untuk mengirim "beta" ke teman atau dosen.
- **production** — build final untuk dikirim ke toko aplikasi: hasilnya AAB (Android) atau berkas iOS, ditandatangani untuk rilis publik, dan biasanya memakai `autoIncrement: true` agar nomor versi internal naik otomatis tiap build.

**Langkah 4 — Jalankan build.** Perintah dasar:

File: terminal

```bash
# Build Android dengan profil preview (hasil: APK untuk pengujian internal)
eas build --platform android --profile preview

# Build Android dengan profil production (hasil: AAB untuk Google Play)
eas build --platform android --profile production

# Build untuk kedua platform sekaligus (butuh akun Apple untuk iOS)
eas build --platform all
```

Penjelasan: saat perintah dijalankan, EAS mengunggah project Anda ke server, mengompilasi di sana, dan menampilkan progres di terminal. Bila berhasil, Anda mendapat tautan dan kode QR untuk mengunduh hasilnya ke perangkat. `--platform all` membangun Android dan iOS sekaligus — praktis, tetapi untuk iOS diperlukan akun Apple Developer (subbab 15.4). Build cloud memakan waktu beberapa menit; karena berjalan di server, Anda dapat menutup laptop dan memeriksa hasilnya nanti melalui tautan yang sama. *⚠ version-sensitive: durasi build, antrean, dan kebijakan paket gratis/berbayar EAS dapat berubah; cek halaman resmi EAS.* Perhatikan bahwa yang dikirim ke server adalah project Anda apa adanya — karena itu kualitas konfigurasi di `app.json` (subbab 15.5) sangat menentukan hasil build.

### 15.3 Android: APK dan AAB

Android memiliki dua format berkas yang sering tertukar. **APK (Android Package)** adalah berkas aplikasi klasik: satu arsip berisi kode terkompilasi, aset, manifest, dan tanda tangan. APK dapat diinstal langsung pada perangkat — inilah berkas yang Anda bagikan lewat WhatsApp atau diinstal dari situs mana pun (sideload).

**AAB (Android App Bundle)** adalah format pengemasan untuk toko: satu arsip berisi *semua* konten aplikasi tanpa dioptimalkan per perangkat. AAB tidak dapat diinstal langsung; ia diunggah ke Google Play, dan Google-lah yang menyusun **split APK** — APK yang disesuaikan per perangkat: hanya berisi kode untuk arsitektur prosesor perangkat (misalnya arm64), hanya grafis untuk kerapatan layarnya, dan hanya terjemahan untuk bahasanya. Efeknya nyata: ukuran unduhan bisa turun drastis, dan pengguna tidak menerima bagian aplikasi yang tidak akan pernah mereka pakai.

Mengapa AAB ada? Sebelumnya pengembang harus menyusun satu APK universal yang memuat semua kemungkinan varian perangkat — boros ruang dan waktu unduh. AAB memindahkan pekerjaan penyesuaian ke infrastruktur Google, yang justru lebih tahu kebutuhan tiap perangkat. Sejak Agustus 2021 Google Play mewajibkan aplikasi baru diunggah dalam bentuk AAB. *⚠ version-sensitive: kebijakan format unggahan dapat berubah; cek dokumentasi Play Console saat Anda mengunggah.*

Di EAS, keterkaitannya dengan profil build: profil dengan `distribution: "internal"` (development dan preview) menghasilkan APK, karena tujuannya diinstal langsung; profil production menghasilkan AAB, karena tujuannya toko aplikasi. Bila suatu saat Anda ingin production build berformat APK (misalnya untuk arsip rilis internal), hubungkan properti `android.buildType` pada profil — detailnya version-sensitive, cek dokumentasi EAS. *⚠*

### 15.4 iOS Build (Konseptual)

Membangun aplikasi iOS secara tradisional mensyaratkan macOS dan Xcode. EAS Build menyediakan server cloud berbasis macOS sehingga build iOS dapat dijalankan dari Windows sekalipun — inilah salah satu nilai jual EAS. Namun ada dua syarat yang tidak bisa dilompati.

Pertama, **keanggotaan Apple Developer Program** — akun developer berbayar Apple (biaya tahunan; angka pastinya dapat berubah — *⚠ version-sensitive*). Tanpa keanggotaan ini, sertifikat penandatanganan tidak dapat diterbitkan dan build iOS tidak dapat dihasilkan, baik di cloud maupun lokal. Kedua, **App Store Connect** — portal tempat aplikasi didaftarkan sebelum dibangun (dibahas di subbab 15.9).

Alur konseptualnya: daftarkan aplikasi di App Store Connect sehingga Anda mendapat identifier aplikasi; pastikan account Apple Developer aktif; lalu jalankan `eas build --platform ios` dengan profil yang sesuai. EAS mengelola sertifikat dan **provisioning profile** (profil penyediaan: dokumen yang memetakan aplikasi, perangkat yang diizinkan, dan identitas pengembang) secara otomatis — tugas yang sangat membingungkan jika dikerjakan manual di Xcode. Hasil build dapat diuji di TestFlight (saluran uji Apple) sebelum dikirim ke review.

Secara konseptual, perbedaan terbesar dengan Android: tidak ada jalur "instal langsung" yang bebas. iOS hanya mengizinkan distribusi melalui App Store, TestFlight, atau build development ke perangkat terdaftar — pemasangan dari sumber tak dikenal tidak ada. Bagi mahasiswa yang belum memiliki akun berbayar, cukup pahami alurnya; praktikum bab ini menyediakan jalur alternatif yang tetap melatih konsep build (subbab Praktikum).

### 15.5 Konfigurasi Aplikasi: Application ID, Versioning, Icon, dan Splash Screen

Semua keputusan "siapa aplikasi ini" ditulis di `app.json` — berkas konfigurasi pusat yang dibuat saat project lahir dari `npx create-expo-app` (Bab 2). Toko aplikasi dan layanan build membaca identitas dari berkas ini, jadi memahami tiap kunci setara dengan memahami akta kelahiran aplikasi. Kunci-kunci terpenting:

**name dan slug.** `expo.name` adalah nama yang tampil di bawah ikon aplikasi dan di Play Store/App Store. `expo.slug` adalah identitas internal project di ekosistem Expo (dipakai pada URL project dan EAS); ia harus ditulis tanpa spasi dan huruf besar. Name boleh berubah kapan pun; slug sebaiknya stabil karena menjadi bagian tautan project Anda.

**version — versi semantik.** `expo.version` memakai pola **semantic versioning** (penomoran versi semantik): `utama.tengah.tambalan` atau MAJOR.MINOR.PATCH. Angka utama (major) naik saat terjadi perubahan besar yang tidak kompatibel; angka tengah (minor) naik saat fitur baru ditambahkan tanpa merusak yang lama; angka tambalan (patch) naik saat perbaikan bug. Contoh: `1.0.0` → `1.1.0` (fitur baru) → `1.1.1` (perbaikan bug) → `2.0.0` (perombakan). Manusia membaca versi ini. Mesin membaca versi lain: `android.versionCode` (bilangan bulat yang *wajib naik* setiap kali AAB diunggah ke Google Play — Play menolak dua unggahan ber-versionCode sama) dan `ios.buildNumber` (string dengan aturan serupa). EAS mempermudah keduanya lewat `autoIncrement: true` pada profil production, yang menaikkan nomor versi mesin otomatis setiap build. *⚠ version-sensitive: perilaku autoIncrement bergantung pada versi eas-cli dan pengaturan appVersionSource; cek dokumentasi EAS.*

**Application ID.** `expo.android.package` (Android) dan `expo.ios.bundleIdentifier` (iOS) adalah **application ID** — identitas unik global aplikasi, ditulis dengan aturan **kebalikan nama domain** (reverse domain name): mulai dari nama domain milik organisasi, lalu nama aplikasi. `ac.id.univ` untuk domain univ.ac.id ditambah `mahasiswa` menghasilkan `ac.id.univ.mahasiswa`. Aturannya: huruf kecil, angka, dan titik; tiap ruas diawali huruf; tidak boleh ada dua ruas titik beruntun. Application ID adalah identitas permanen: begitu aplikasi dipublikasikan, ID tidak boleh diubah — mengubahnya berarti Play/App Store menganggapnya aplikasi baru yang berbeda, lengkap dengan "kehilangan" pengguna dan ulasan. Karena itu putuskan ID dengan hati-hati sejak awal.

**Icon dan adaptive icon.** Ikon aplikasi disediakan sebagai PNG persegi 1024×1024 piksel pada `expo.icon`. Android modern tidak lagi menampilkan ikon persegi penuh: launcher memotongnya sesuai bentuk perangkat (lingkaran, persegi membulat, dan lainnya) melalui **adaptive icon** (ikon adaptif) — properti `expo.android.adaptiveIcon` yang memuat `foregroundImage` (gambar latar depan 1024×1024 dengan area aman di tengah sekitar 66% kanvas *⚠*) dan `backgroundColor` (warna latar yang mengisi wilayah pemotongan). *⚠ version-sensitive: spesifikasi area aman dan ukuran direkomendasikan mengikuti panduan aset Android saat Anda menyiapkan ikon.* Mengapa ada dua lapis? Supaya ikon tetap terlihat baik di bentuk launcher apa pun tanpa perlu mendesain ulang per vendor.

**Splash screen.** **Splash screen** adalah layar yang tampil sesaat saat aplikasi dibuka, menutupi proses pemuatan kerangka native. Konfigurasinya pada SDK modern dilakukan melalui config plugin **expo-splash-screen** di properti `plugins` (pada SDK lama, berkas ini dikonfigurasi lewat kunci `splash` di level atas — *⚠ version-sensitive: cara konfigurasi ekspor berubah antarsdk; contoh bab ini mengikuti pola plugin SDK 57*). Parameternya: `image` (PNG, lazimnya 1024×1024), `imageWidth` (lebar gambar pada layar, misalnya 200 piksel — gambar splash tidak harus seluas layar), `resizeMode` (`contain` memuat gambar utuh tanpa terpotong, `cover` memenuhi layar dengan memotong), dan `backgroundColor`. Splash yang baik memakai warna latar yang sama dengan tema aplikasi sehingga transisi ke halaman pertama terasa mulus.

Cara cepat memastikan seluruh konfigurasi benar sebelum membangun: `npx expo config --type public` mencetak hasil konfigurasi yang telah diolah (resolved config) — pemeriksaan wajib sebelum build agar kegagalan diketahui lebih dini. *⚠ version-sensitive: bentuk output perintah dapat berubah antarvensi Expo.*

### 15.6 Environment Variable

Aplikasi yang sama sering harus berperilaku berbeda di lingkungan berbeda: di emulator ia memanggil backend di `10.0.2.2` (Bab 10), sedangkan di produksi ia memanggil server dengan domain `https`. Menuliskan alamat langsung di kode memaksa Anda mengubah kode setiap ganti lingkungan — tidak profesional dan rawan lupa. Solusinya adalah **environment variable** (variabel lingkungan): nilai konfigurasi yang disimpan di luar kode, biasanya dalam berkas `.env`.

Expo membaca berkas `.env`, `.env.local`, `.env.development`, dan `.env.production` di root project. Namun ada aturan penting: hanya variabel yang namanya berawalan **`EXPO_PUBLIC_`** yang nilainya akan disisipkan (inline) ke dalam kode aplikasi saat bundel dibuat. Di dalam kode, nilainya diakses sebagai `process.env.EXPO_PUBLIC_NAMA_VARIABEL`. Variabel tanpa prefix tetap tersedia selama proses build (misalnya untuk berkas konfigurasi seperti `app.config.js`), tetapi tidak akan sampai ke kode aplikasi.

Konsekuensi keamanan dari mekanisme inline ini harus dipahami benar: nilai `EXPO_PUBLIC_*` *tertanam di dalam bundel JavaScript* — berkas yang dibagikan ke semua pengguna. Siapa pun yang membongkar aplikasi dapat membaca nilainya. Karena itu, **jangan pernah** menaruh secret (rahasia) di variabel env aplikasi: kata sandi, token autentikasi, kunci API yang melindungi server, atau nomor kartu. Data rahasia yang benar: disimpan di sisi server (misalnya `.env` backend dari Bab 10, atau token JWT yang dikelola Bab 13). Untuk keperluan build-time yang tidak boleh masuk bundel, EAS menyediakan penyimpanan environment variable khusus build; tetap ingat aturan dasarnya — apa pun yang dibutuhkan aplikasi di perangkat pengguna akan terbaca oleh pengguna. *⚠ version-sensitive: detail dukungan berkas `.env`, prioritasnya, dan fasilitas env EAS dapat berubah; periksa dokumentasi Expo/EAS.* Setelah mengubah `.env`, mulai ulang server pengembangan (`npx expo start`) agar nilai baru tersisip.

### 15.7 Signing

**Signing** (penandatanganan) adalah pemberian tanda tangan digital pada build: bukti kriptografis bahwa berkas benar-benar berasal dari pengembang yang bersangkutan dan tidak diubah di tengah jalan. Siapa pun dapat membangun ulang aplikasi Anda dari kode yang sama, tetapi hanya pemilik kunci rahasia yang dapat menghasilkan tanda tangan yang cocok.

Di Android, tanda tangan dibuat dengan **keystore** — berkas (lazimnya `.jks` atau `.keystore`) berisi pasangan kunci dan sertifikat. Peran gandanya: (1) verifikasi keaslian saat instalasi, dan (2) verifikasi kelanjutan identitas saat pembaruan — sistem menolak pembaruan yang ditandatangani kunci berbeda, karena dianggap aplikasi lain. Inilah mengapa kehilangan keystore adalah bencana: aplikasi terpasang tidak akan pernah bisa diperbarui.

EAS mengurangi risiko ini dengan mengelola keystore secara otomatis: keystore dibuat saat build pertama, disimpan di akun Expo Anda, dan dapat diunduh dari halaman kredensial (perintah `eas credentials`) bila Anda ingin membangun lokal. Jaga salinannya di tempat aman — EAS menyediakan mekanisme persetujuan dua orang untuk mengunduh kunci, karena ini barang paling berharga dalam siklus hidup aplikasi. Google Play menambah satu lapis dengan **Play App Signing**: kunci penandatanganan disimpan oleh Google, sedangkan Anda memegang **upload key** (kunci unggah) khusus untuk mengirim build — sehingga kunci produksi tidak pernah berada di mesin pengembang.

Untuk membangun di mesin lokal (misalnya `npx expo run:android` dengan varian release), Anda memerlukan keystore sendiri yang dibuat dengan alat `keytool` dari JDK, misalnya `keytool -genkeypair -v -keystore mahasiswa.jks -alias mahasiswa -keyalg RSA -keysize 2048 -validity 10000`, lalu menghubungkannya ke konfigurasi build. *⚠ version-sensitive: sintaks keytool dan cara menghubungkan keystore pada build lokal dapat berbeda antarvensi alat; gunakan dokumentasi resmi saat Anda membutuhkannya — EAS mengotomatiskan seluruh proses ini sehingga tidak wajib dikuasai sekarang.* Di iOS konsepnya sama: sertifikat distribusi dan provisioning profile membuktikan identitas pengembang; EAS juga mengelolanya otomatis.

### 15.8 Deployment ke Google Play

**Deployment** (penerapan) adalah proses menghadirkan build ke pengguna melalui saluran resmi. Untuk Android, saluran resminya **Google Play** melalui **Play Console** (konsol Play: portal pengelola aplikasi untuk developer Google). Mendaftarkan akun developer dikenakan biaya pendaftaran sekali — *⚠ version-sensitive: nominal biaya dan proses verifikasi identitas dapat berubah; cek situs resmi Play Console.*

Setelah akun aktif, langkah pertama adalah **membuat aplikasi** dan mengisi **kehadiran aplikasi** (app presence) — daftar informasi toko: nama, deskripsi pendek dan panjang, kategori, ikon toko (512×512), gambar unggulan (feature graphic), tangkapan layar (screenshots), kuesioner peringkat konten, deklarasi data (data safety), target audiens, dan tautan kebijakan privasi bila aplikasi mengumpulkan data. Informasi ini yang dilihat calon pengguna — kualitasnya sama pentingnya dengan kualitas kode.

Inti distribusi Play adalah **tracks** (jalur/saluran rilis), diurutkan dari yang paling privat:

- **internal testing** (pengujian internal): rilis cepat ke maksimal 100 penguji dengan akun terdaftar; build tersedia dalam hitungan menit tanpa proses review — ideal untuk putaran uji harian tim.
- **closed testing** (pengujian tertutup): rilis ke kelompok penguji yang Anda undang lewat tautan; penguji perlu menerima undangan. Untuk akun developer pribadi yang baru, Google mewajibkan aplikasi diuji pada saluran ini (dengan jumlah penguji dan durasi tertentu) sebelum diizinkan rilis produksi — *⚠ version-sensitive: kebijakan ini berubah-ubah; cek persyaratan terbaru Play Console.*
- **open testing** (pengujian terbuka): aplikasi tampil di Play sebagai "rilis awal" untuk umum; siapa pun dapat mendaftar sebagai penguji.
- **production** (produksi): rilis resmi untuk semua pengguna; setiap unggahan melewati review Google dan dapat memakan waktu dari beberapa jam hingga beberapa hari — *⚠ version-sensitive: durasi review beragam dan dapat berubah.*

Alur pengunggahan praktis: `eas build --platform android --profile production` menghasilkan AAB; di halaman rilis Play Anda memilih track, mengunggah AAB (pastikan `versionCode` naik), menulis catatan rilis, lalu menekan tombol rilis. Play mendukung **rollout bertahap** (percentage rollout): rilis production dapat dibatasi ke persentase pengguna tertentu untuk memantau stabilitas sebelum digeber ke semua — praktik standar tim profesional. Dashboard Play menampilkan statistik, laporan kerusakan (crashes), dan ulasan; keluhan di sini adalah umpan balik produk yang berharga — lenyapnya pemisahan antara "uji sendiri" dan "dipakai publik" itulah yang membuat proses ini wajib.

### 15.9 Deployment ke App Store (Konseptual)

Saluran resmi iOS adalah **App Store**, dikelola melalui **App Store Connect** (portal developer Apple, sejajar Play Console). Syarat pertama adalah keanggotaan **Apple Developer Program** yang berbayar tahunan — *⚠ version-sensitive: biaya keanggotaan tahunan dapat berubah; cek situs resmi Apple Developer.* Tanpa keanggotaan, tidak ada build iOS yang sah pada perangkat nyata.

Alur konseptual: (1) daftarkan aplikasi di App Store Connect sehingga diperoleh identifier; (2) bangun dengan EAS (`eas build --platform ios`) — EAS mengelola sertifikat dan provisioning profile; (3) unggah hasil build ke App Store Connect (EAS menyediakan fasilitas submit otomatis); (4) distribusikan ke penguji lewat **TestFlight** (saluran uji Apple: hingga ratusan penguji internal dan ribuan penguji eksternal — *⚠ angka kuota dapat berubah*); (5) ajukan aplikasi ke **App Review** — tim Apple meninjau kelayakan, kepatuhan pedoman, dan stabilitas; umumnya berlangsung sehari-dua hari, terkadang lebih lama *⚠*; (6) jika disetujui, aplikasi dirilis atau dijadwalkan rilisnya.

Perbedaan strategis dengan Play: biaya tahunan (Play sekali, Apple tahunan), tingkat ketatnya review, dan tidak adanya jalur publik di luar App Store. Bagi mahasiswa di Indonesia yang belum memiliki akun berbayar, memahami alur ini sudah cukup — saat berkarier di tim produk, Anda akan berhadapan dengan proses yang sama persis.

### 15.10 Lingkungan: Development, Preview/Testing, dan Production

Ketiga profil build EAS sebenarnya mencerminkan tiga **lingkungan** (environment) yang lazim dalam organisasi perangkat lunak — konsep yang sama dengan yang Anda lihat di dunia web (development, staging, production). Ringkasannya:

| Lingkungan | Tujuan | Pengguna | Bentuk build & distribusi |
|---|---|---|---|
| **Development** | Pengembangan harian, eksperimen fitur | Pengembang, tester teknis | Expo Go / development build; terhubung Metro; tidak dibagikan |
| **Preview/Testing** | Uji kandidat rilis sebelum publik | Tim, dosen, kelompok uji terbatas | APK `distribution: internal`, track internal/closed Play, TestFlight |
| **Production** | Rilis resmi ke publik | Semua pengguna | AAB/berkas store, signed, melalui review Play/Apple |

Prinsip yang mengikat ketiganya: *kode yang sama, konfigurasi berbeda*. Satu basis kode dijalankan di tiga lingkungan dengan `app.json`, environment variable, versi, dan tanda tangan yang berbeda-beda — inilah yang mencegah penyakit klasik "berjalan di mesin saya" (works on my machine): production build diuji pada lingkungan preview yang sepersis mungkin dengan produksi. Evolusi berikutnya dari model ini adalah pembaruan tanpa build ulang (mekanisme EAS Update) — *⚠ version-sensitive* — yang memungkinkan tim mengirim perbaikan kecil langsung ke aplikasi terpasang; konsepnya akan Anda temui lagi di dunia kerja, tetapi fondasinya tetap tiga lingkungan di atas.

## Contoh

**Contoh 1 — `app.json` lengkap untuk Aplikasi Manajemen Data Mahasiswa (Bab 6–8).** Berkas ini adalah versi "terisi penuh" dari berkas yang lahir bersama template (Bab 2): identitas, versi, ID aplikasi, ikon adaptif, dan splash screen:

File: app.json

```json
{
  "expo": {
    "name": "Aplikasi Mahasiswa",
    "slug": "aplikasi-mahasiswa",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "scheme": "aplikasi-mahasiswa",
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#1D4ED8"
        }
      ]
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "ac.id.univ.mahasiswa",
      "buildNumber": "1"
    },
    "android": {
      "package": "ac.id.univ.mahasiswa",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1D4ED8"
      }
    }
  }
}
```

Penjelasan: `name`, `slug`, dan `version` menentukan tampilan dan penomoran versi yang dibaca manusia (subbab 15.5). `scheme` adalah skema URL khusus aplikasi yang dipakai navigasi berbasis berkas Expo Router (Bab 7). `plugins` berisi dua config plugin: `expo-router` (wajib jika project memakai router dari Bab 7 — hapus bila project Anda tidak memakainya) dan `expo-splash-screen` untuk splash. `ios` dan `android` memuat application ID — perhatikan keduanya sama `ac.id.univ.mahasiswa`, kebalikan domain kampus contoh; `versionCode` dan `buildNumber` adalah penomoran versi mesin yang nilainya sama-sama dimulai dari 1 dan harus naik pada setiap rilis berikutnya.

**Contoh 2 — `eas.json` dengan tiga profil build lengkap.**

File: eas.json

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

Penjelasan: profil `development` menghasilkan development build bernama dev client (`developmentClient: true`) untuk debugging native yang tidak bisa dilakukan di Expo Go. Profil `preview` menghasilkan APK rilis untuk pengujian internal: `distribution: "internal"` menandakan build ini untuk dibagikan langsung, bukan ke toko, dan `android.buildType: "apk"` menegaskan formatnya. Profil `production` memakai `autoIncrement: true`, artinya `versionCode`/`buildNumber` dinaikkan otomatis tiap build sehingga Anda tidak pernah lupa menaikkan versi mesin — sementara format keluarannya AAB secara default karena ditujukan ke toko. Bagian `submit` menyimpan konfigurasi pengiriman build ke toko (subbab 15.8–15.9). *⚠ version-sensitive: skema eas.json (misalnya kunci `cli.version` yang ditulis `eas build:configure`) dapat berbeda antarvensi eas-cli; berkas di atas adalah inti minimal yang sah secara konsep — biarkan `eas build:configure` menambahkan bagian yang ia perlukan.*

**Contoh 3 — Environment variable untuk alamat backend.** Pisahkan alamat API dari kode agar build preview/production memakai alamat yang tepat (Bab 10 memakai `10.0.2.2` untuk emulator Android):

File: .env

```text
# File: .env (jangan di-commit ke repository publik)
# Nilai default untuk pengembangan di emulator Android (Bab 10).
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
```

File: config/api.js

```js
// Alamat server API. Nilai EXPO_PUBLIC_API_URL disisipkan saat bundel dibuat;
// bila tidak ada, fallback ke alamat emulator Android (pola Bab 10).
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000';

export async function ambilDaftarMahasiswa() {
  const respons = await fetch(`${API_URL}/api/mahasiswa`);
  if (!respons.ok) {
    throw new Error(`Gagal memuat data: HTTP ${respons.status}`);
  }
  const data = await respons.json();
  return data.data;
}

export default API_URL;
```

Penjelasan: berkas `.env` menyimpan nilai lingkungan pengembangan; di production, Anda membuat `.env.production` berisi `EXPO_PUBLIC_API_URL=https://api.univ.ac.id` sehingga build production otomatis memakai domain resmi tanpa mengubah kode. Di kode, `process.env.EXPO_PUBLIC_API_URL` dibaca dengan operator `||` memberi nilai cadangan (fallback) — pola aman bila berkas `.env` belum dibuat. Fungsi `ambilDaftarMahasiswa` mengikuti pola `fetch` dari Bab 10: memeriksa `respons.ok`, melempar error bila gagal, dan mengembalikan `data.data` sesuai struktur respons backend buku. Perhatikan bahwa `API_URL` diekspor juga, agar screen lain (Bab 7) mengimpor satu sumber alamat yang sama. Kedua berkas ini adalah contoh aman: tidak ada secret di dalamnya — alamat server memang bukan rahasia, tetapi kunci API yang melindungi server adalah rahasia dan tidak boleh ditulis di sini (subbab 15.6).

**Contoh 4 — Rangkaian perintah build lengkap.**

File: terminal

```bash
# 1. Pastikan Node.js siap
node --version

# 2. Pastikan project sehat: konfigurasi tercetak sesuai harapan
npx expo config --type public

# 3. Masuk akun Expo (dibuat gratis di expo.dev)
npx eas-cli login
npx eas-cli whoami

# 4. Siapkan eas.json
npx eas-cli build:configure

# 5. Build APK preview untuk diuji di perangkat
npx eas-cli build --platform android --profile preview
```

Penjelasan: urutan ini adalah alur kerja standar sebelum build: cek lingkungan, cek konfigurasi, autentikasi, siapkan profil, lalu bangun. `npx expo config --type public` adalah "jendela intip" terakhir sebelum kode dikirim ke cloud — bila di sini nama atau application ID salah, hasil build pun salah. `npx eas-cli whoami` memastikan sesi login aktif; error pada langkah ini berarti langkah 3 belum berhasil. Setelah langkah 5, terminal menampilkan tautan build; buka tautan itu untuk mengunduh APK atau memindai kode QR dengan perangkat Android. *⚠ version-sensitive: perintah dan perilakunya dapat berubah; andalkan teks bantuan `npx eas-cli --help` sebagai sumber kebenaran versi Anda.*

## Praktikum

### Tujuan Praktikum

Setelah menyelesaikan praktikum ini, mahasiswa mampu: (1) mengonfigurasi `app.json` project sendiri (identitas aplikasi, versi, ikon, splash) dan memverifikasinya; (2) membuat `eas.json` dengan tiga profil build (development, preview, production); (3) menjalankan build Android via EAS (atau jalur alternatif ekspor bundel bila akun EAS belum dimiliki); dan (4) menyusun laporan build yang berisi hasil, versi, dan catatan pengujian.

### Kebutuhan

- Node.js LTS 22 atau lebih baru (`node --version`), project hasil Bab 6–8 (Aplikasi Manajemen Data Mahasiswa) atau project Expo lain yang sudah berjalan.
- Folder `assets/` pada project dengan berkas `icon.png`, `adaptive-icon.png`, dan `splash-icon.png` (biasanya sudah tersedia dari template — *⚠ version-sensitive: nama berkas aset bawaan template dapat berbeda*), atau gambar PNG 1024×1024 buatan sendiri.
- Koneksi internet stabil (untuk build cloud dan unduhan hasil build).
- Akun Expo (gratis) dan aplikasi Expo dev biasa — hanya diperlukan untuk jalur build cloud; tanpa akun, gunakan jalur alternatif di Langkah Kerja 7.
- Perangkat Android (fisik) untuk menginstal APK hasil build.

### Persiapan

1. Duplikat project Anda ke folder `praktikum15` (salin folder project hasil Bab 6–8; jangan bekerja pada project utama) — build cloud mengunggah seluruh folder, jadi bersihkan berkas sampah (misalnya `node_modules` tidak ikut terunggah, tetapi folder lain tetap Anda kendalikan). *⚠ version-sensitive: berkas apa yang dikecualikan EAS dari unggahan diatur berkas `.easignore`.*
2. Periksa `node --version` — pastikan Node LTS 22 atau lebih baru.
3. Siapkan ikon: jika tidak ingin memakai ikon bawaan, buat PNG persegi 1024×1024 (gambar polos berwarna + teks singkat cukup) dengan editor gambar apa pun yang Anda kuasai, simpan ke `assets/icon.png`, `assets/adaptive-icon.png` (gambar latar depan dengan ruang kosong aman di tengah), dan `assets/splash-icon.png`.
4. Baca `app.json` project Anda; catat nilai `name`, `slug`, `version` yang ada sekarang.

### Langkah Kerja

1. Buka `app.json` dan lengkapi tujuh hal ini dengan pola Contoh 1: `name`, `slug` (tanpa spasi/huruf besar), `version` (mulai dari `1.0.0`), `android.package`, `ios.bundleIdentifier` (application ID kebalikan domain, misalnya `ac.id.univ.mahasiswa` — sesuaikan dengan identitas Anda), `android.versionCode: 1`, dan `ios.buildNumber: "1"`. Jika project memakai Expo Router (Bab 7), pastikan `plugins` memuat `"expo-router"` dan `scheme` terisi.
2. Periksa konfigurasi: jalankan `npx expo config --type public` dari root project, lalu periksa baris `name`, `version`, `android.package`, dan `ios.bundleIdentifier` pada hasilnya.
3. Buat berkas `eas.json` di root project, salin isi Contoh 2, dan pastikan tiga profil (`development`, `preview`, `production`) ada.
4. Siapkan environment variable: buat berkas `.env` berisi `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000` (pola Contoh 3), lalu ubah screen yang memanggil API (Bab 10) agar memakai `process.env.EXPO_PUBLIC_API_URL` dengan fallback yang sama. Mulai ulang `npx expo start` dan pastikan aplikasi tetap berjalan di emulator.
5. Pasang alat EAS: `npm install -g eas-cli`, atau putuskan memakai `npx eas-cli` tanpa pemasangan (pilih satu cara, konsisten). Verifikasi dengan `npx eas-cli --version`.
6. Jalur build cloud (butuh akun Expo): `npx eas-cli login`, lalu `npx eas-cli whoami` untuk memastikan masuk. Jalankan `npx eas-cli build:configure` dan periksa `eas.json` yang dihasilkan (boleh timpa dengan versi Langkah 3 — *⚠: biarkan bagian `cli` yang ditambahkan `build:configure` tetap ada*). Terakhir jalankan `npx eas-cli build --platform android --profile preview`. Tunggu sampai terminal menampilkan tautan dan kode QR.
7. Jalur alternatif tanpa akun EAS (pilih salah satu dengan Langkah 6): jalankan `npx expo export --platform android` — perintah ini membuat bundel produksi dan asetnya di folder `dist/` di komputer Anda, tanpa layanan cloud. *⚠ version-sensitive: perintah, platform default, dan struktur folder `dist/` dapat berbeda antarvensi.* Bundel ini *bukan* APK yang bisa diinstal — ia adalah latihan memahami apa yang "dikemas" EAS di cloud.
8. Bila build cloud berhasil: unduh APK dari tautan, kirim ke perangkat Android (misalnya lewat Google Drive), izinkan pemasangan dari sumber tak dikenal bila diminta, dan instal. Buka aplikasi: periksa nama aplikasi di bawah ikon, versi di pengaturan Android (atau halaman "Tentang" bila ada), dan coba fitur yang terhubung backend (Bab 10).
9. Tutup praktikum dengan laporan build: tabel berisi tanggal, profil, platform, hasil (berhasil/gagal), tautan/ukuran berkas, dan catatan (misalnya "versi tampil 1.0.0", "APK 92 MB"). Simpan sebagai `LAPORAN-BUILD.md` di `praktikum15`.

### Kode

File: app.json

```json
{
  "expo": {
    "name": "Aplikasi Mahasiswa",
    "slug": "aplikasi-mahasiswa",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "scheme": "aplikasi-mahasiswa",
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#1D4ED8"
        }
      ]
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "ac.id.univ.mahasiswa",
      "buildNumber": "1"
    },
    "android": {
      "package": "ac.id.univ.mahasiswa",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1D4ED8"
      }
    }
  }
}
```

File: eas.json

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Penjelasan Kode

`app.json` di atas adalah "identitas" aplikasi Anda. Kunci yang paling menentukan hasil build adalah `slug` (identitas project di ekosistem Expo — jangan diubah sembarangan setelah project pernah terdaftar), `version` (versi semantik yang dibaca manusia, subbab 15.5), serta `android.package` dan `ios.bundleIdentifier` (application ID — sekali dipublikasikan tidak boleh berubah). Perhatikan pola JSON yang sama di Contoh 1: praktikum ini memang memakai konfigurasi yang sama dengan contoh, hanya nilai identitasnya yang Anda sesuaikan (misalnya `ac.id.univ.mahasiswa` diganti sesuai domain kampus Anda). Config plugin `expo-splash-screen` mengatur splash: `imageWidth: 200` membuat gambar tidak memenuhi layar, `resizeMode: "contain"` menjamin gambar utuh, dan `backgroundColor: "#1D4ED8"` menyamakan warna latar splash dengan warna utama aplikasi — trik agar transisi pembukaan aplikasi terasa mulus.

`eas.json` menentukan "bagaimana" tiap build dibuat. Profil `development` adalah build untuk pengembang: dengan `developmentClient: true`, hasilnya dipasang di perangkat pengembang dan dipakai bersama `npx expo start --dev-client` — bukan untuk dibagikan. Profil `preview` menghasilkan APK rilis untuk pengujian: para penguji (teman/dosen) memakainya seperti aplikasi sungguhan, lengkap dengan splash dan performa produksi, tanpa harus ke toko aplikasi. Profil `production` menghasilkan AAB untuk toko aplikasi dan menaikkan nomor versi mesin otomatis (`autoIncrement`) — sekali lagi, kode yang sama, konfigurasi berbeda. Jika project Anda *tidak* memakai Expo Router, hapus `"expo-router"` dari `plugins` dan `scheme` dari `app.json`; router yang terpasang di project namun tidak dikonfigurasi akan membuat build gagal.

### Hasil yang Diharapkan

1. Langkah 2: `npx expo config --type public` mencetak konfigurasi dengan `name: "Aplikasi Mahasiswa"` (atau nama Anda), `version: "1.0.0"`, `android.package` dan `ios.bundleIdentifier` sesuai yang Anda tulis. Bila nilai berbeda dari harapan, konfigurasi belum tersimpan benar — periksa kembali sebelum lanjut.
2. Langkah 4: aplikasi tetap berjalan normal di emulator setelah pemakaian environment variable — data mahasiswa dari backend (Bab 10) tetap tampil, membuktikan `EXPO_PUBLIC_API_URL` tersisip dengan benar.
3. Langkah 6 (jalur cloud): EAS menyelesaikan build dengan status *finished*; terminal menampilkan tautan; APK hasil unduhan terinstal di perangkat; nama aplikasi di launcher sesuai `name`, dan splash biru muncul sesaat saat aplikasi dibuka.
4. Langkah 7 (jalur alternatif): folder `dist/` terisi bundel JavaScript produksi dan asetnya; ukuran total bundel tercatat — bandingkan dengan perasaan "ringan" aplikasi saat dibuka, karena bundel produksi tidak lagi memuat alat debugging (subbab 15.1).
5. Langkah 9: `LAPORAN-BUILD.md` terisi minimal satu baris per jalur yang dijalankan, dengan kolom tanggal, profil, platform, hasil, dan catatan — artefak yang sama bentuknya dengan yang diminta perusahaan saat Anda melamar kerja.

### Troubleshooting

**Masalah:** Setelah `npm install -g eas-cli`, perintah `eas` ditolak dengan "eas is not recognized" (Windows) atau "command not found".
**Penyebab:** Folder tempat npm memasang paket global belum terdaftar pada PATH sesi terminal yang sedang berjalan; terminal lama tidak me-refresh PATH.
**Solusi:** Buka terminal baru lalu coba lagi; jika tetap gagal, gunakan `npx eas-cli ...` untuk semua perintah (tidak perlu memasang global).
**Pencegahan:** Sejak awal pilih satu cara (global atau npx) dan tulis pada dokumentasi project Anda, agar tim memakai cara yang sama.

**Masalah:** `npx eas-cli login` gagal dengan pesan jaringan, atau `eas build` mengeluh "network request failed" saat mengunggah project.
**Penyebab:** Koneksi tidak stabil, jaringan kampus memblokir sebagian lalu lintas, atau sesi login kedaluwarsa.
**Solusi:** Ulangi login (`npx eas-cli login`); cek `npx eas-cli whoami` untuk memastikan sesi aktif; coba jaringan lain (misalnya tethering dari ponsel) bila di jaringan kampus. Untuk build yang gagal di tengah unggahan, jalankan ulang perintah build — EAS melanjutkan dari awal dengan project yang sama.
**Pencegahan:** Bangun saat koneksi stabil; jangan menutup laptop saat unggahan berjalan; simpan tautan build dari percobaan sebelumnya sebagai riwayat.

**Masalah:** Build cloud gagal dengan error yang menyebut berkas aset tidak ditemukan, misalnya "Asset ./assets/icon.png does not exist".
**Penyebab:** Path pada `app.json` tidak cocok dengan berkas sungguhan — nama file beda, folder `assets` tidak ada, atau perbedaan huruf kapital (Windows sering tidak peka huruf, server EAS peka).
**Solusi:** Periksa isi folder `assets/` dan samakan persis dengan path di `app.json` (misalnya `./assets/icon.png`); jalankan `npx expo config --type public` untuk memastikan path yang terbaca.
**Pencegahan:** Verifikasi konfigurasi sebelum build (Langkah Kerja 2); jangan memakai path yang disalin dari project lain tanpa memeriksa berkasnya ada.

**Masalah:** Google Play menolak AAB dengan pesan "Version code 1 has already been used" (pada praktikum lanjutan subbab 15.8).
**Penyebab:** `android.versionCode` pada unggahan kedua sama dengan yang pertama; Play mewajibkan nomor selalu naik.
**Solusi:** Naikkan `android.versionCode` (misalnya dari 1 ke 2), atau aktifkan `autoIncrement: true` pada profil production agar EAS menaikkannya otomatis.
**Pencegahan:** Selalu gunakan `autoIncrement` pada profil production sejak awal; catat riwayat versi pada `LAPORAN-BUILD.md`.

**Masalah:** Nilai `process.env.EXPO_PUBLIC_API_URL` tampil `undefined` di aplikasi, atau aplikasi memakai nilai lama setelah `.env` diubah.
**Penyebab:** Nama variabel tidak berawalan `EXPO_PUBLIC_`, berkas `.env` salah nama/letak, atau server pengembangan belum dimuat ulang — nilai env disisipkan saat bundel dibuat, bukan saat aplikasi berjalan.
**Solusi:** Periksa ejaan prefix (`EXPO_PUBLIC_`), pastikan berkas bernama `.env` di root project, lalu hentikan `npx expo start` dan jalankan lagi (bila perlu `npx expo start -c` untuk membersihkan cache).
**Pencegahan:** Tulis pendekatan fallback (`|| 'http://10.0.2.2:3000'`) seperti Contoh 3 agar aplikasi tetap berjalan walau env belum terisi; biasakan memulai ulang server tiap mengubah `.env`.

## Studi Kasus

**Insiden "SIAKAD Mobile versi 1.0": ketika distribusi tanpa proses build yang terkendali menggagalkan sistem informasi kampus.** Sebuah perguruan tinggi swasta mengembangkan aplikasi mobile SIAKAD untuk mahasiswa — aplikasi dengan pola yang sama persis dengan Aplikasi Manajemen Data Mahasiswa buku ini: login, daftar, form, dan API (Bab 7–13). Tim kecilnya (dua mahasiswa magang dan satu dosen pembimbing) menemukan jalan pintas yang tampak efisien: APK versi 1.0 dibangun seadanya dan disebar lewat grup WhatsApp angkatan. Lima mahasiswa pertama yang menguji — Budi, Siti, Agus, Dewi, dan Rizky — berhasil memakainya, dan tim merasa selesai.

Masalah dimulai saat versi 1.0.1 dirilis untuk memperbaiki bug penyimpanan email: karena tidak ada saluran rilis resmi, sebagian mahasiswa tetap memakai versi 1.0, sebagian lagi 1.0.1, dan data yang dikirim keduanya bentrok di backend (Bab 10). Helpdesk kewalahan menebak "data siapa yang datang dari versi mana". Kemudian mesin laptop developer rusak dan keystore lokalnya ikut hilang; tim yang mencoba membangun ulang menemukan aplikasi terpasang menolak pembaruan — tanda tangan digital tidak cocok (subbab 15.7). Puncaknya, ketika akhirnya aplikasi didaftarkan ke Google Play, tim mengunggah build yang alamat API-nya masih mengarah ke IP laptop (misalnya `http://192.168.1.10:3000`) karena alamat ditulis keras di kode, bukan di environment variable (subbab 15.6) — aplikasi yang "berhasil diunduh" tidak dapat terhubung ke server mana pun.

Setiap gejala insiden ini berbanding lurus dengan satu subbab. Dua versi beredar di WhatsApp adalah kegagalan memilih lingkungan preview: seandainya tim memakai track internal testing Play (subbab 15.8), seluruh penguji otomatis menerima pembaruan dari satu sumber dan versi terpantau. Kehilangan keystore adalah kegagalan memahami signing: seandainya tim membangun memakai EAS, keystore tersimpan di akun dan tidak ikut hancur bersama laptop (subbab 15.2, 15.7). Alamat API yang keras adalah kegagalan memisahkan konfigurasi dari kode: `EXPO_PUBLIC_API_URL` dengan `.env.production` memastikan build preview dan production memakai alamat berbeda tanpa mengubah kode (subbab 15.6). Biaya perbaikannya: tiga minggu kerja ulang, dua pendaftaran ulang aplikasi, dan kepercayaan pengguna yang turun — jauh lebih mahal daripada satu pertemuan memahami build dan deployment. Rancangan penyebaran aplikasi yang terencana dengan pola yang sama akan Anda susun sebagai "Deployment Plan" pada Project Akhir "Sistem Informasi Akademik Mobile" (Bagian VII); bab ini memberi Anda seluruh fondasi konseptualnya.

## Latihan

### Soal Pemahaman

1. Jelaskan tiga perbedaan utama development build dan production build, dan kapan masing-masing digunakan.
2. Apa fungsi masing-masing profil di `eas.json` (development, preview, production)? Format keluaran apa yang dihasilkan profil preview dan production untuk Android?
3. Mengapa Google Play mewajibkan AAB untuk aplikasi baru, padahal APK lebih mudah diinstal? Kaitkan jawaban dengan pengalaman pengguna saat mengunduh.
4. Tuliskan application ID yang valid menurut aturan kebalikan domain untuk aplikasi "Siakad" milik organisasi `politeknik.ac.id`, lalu jelaskan mengapa application ID tidak boleh diubah setelah publikasi.
5. Mengapa secret (kata sandi, token, kunci API) tidak boleh disimpan dalam variabel `EXPO_PUBLIC_*`? Apa yang terjadi pada nilai itu saat build?
6. Apa peran keystore dalam siklus hidup aplikasi Android, dan bagaimana EAS mengurangi risiko kehilangannya?

### Soal Praktik

1. Ubah project Aplikasi Manajemen Data Mahasiswa (Bab 6–8) menjadi versi `1.2.0` dengan application ID `ac.id.univ.mahasiswa` (atau milik Anda), ganti `icon.png` dengan PNG 1024×1024 buatan sendiri, dan verifikasi dengan `npx expo config --type public`.
2. Buat `eas.json` dengan tiga profil, lalu jalankan `npx eas-cli build --platform android --profile preview` (atau `npx expo export --platform android` bila akun EAS belum ada — catat perbedaan hasil keduanya dalam laporan). Instal hasilnya di perangkat dan laporkan nama serta versi yang tampil.
3. Pisahkan alamat backend ke `EXPO_PUBLIC_API_URL`: buat `.env` (emulator) dan `.env.production` (domain `https` hipotetis), lalu tunjukkan bahwa aplikasi membaca nilai yang berbeda pada dua build tanpa mengubah kode (misalnya dengan mencetak `API_URL` pada layar Beranda).

### Soal Analisis

1. Bandingkan tiga saluran distribusi: APK lewat WhatsApp, track internal testing Play, dan rilis production Play — dari aspek kecepatan mencapai pengguna, kontrol versi, keamanan, dan biaya. Tentukan saluran yang tepat untuk: (a) uji harian tim, (b) beta 20 teman sekelas, (c) rilis resmi kampus.
2. Pada insiden "SIAKAD Mobile" (Studi Kasus), rancang ulang strategi rilisnya: urutan lingkungan development → preview → production, pengelolaan versi (semantik + versionCode), dan pengelolaan keystore — dengan menyebut subbab yang menjadi dasar tiap keputusan.

## Tantangan

1. Susun **Deployment Plan** mini satu halaman untuk aplikasi Anda: daftar versi & changelog, profil build yang dipakai, saluran distribusi per lingkungan (internal/closed/production), dan langkah-langkah di Play Console — dokumen ini menjadi cikal bakal Deployment Plan pada Project Akhir.
2. Jika Anda memiliki perangkat Android dan JDK: bangun production build di mesin lokal dengan `npx expo run:android` varian release, buat keystore sendiri dengan `keytool`, dan bandingkan prosesnya dengan build cloud EAS. *⚠ version-sensitive: butuh Android SDK; ikuti dokumentasi resmi saat menyiapkannya.*
3. Buat adaptive icon dengan dua `backgroundColor` berbeda, bangun dua kali, dan bandingkan tampilannya di launcher perangkat — lalu tuliskan kesimpulan mengapa desain adaptive icon perlu area aman di tengah.

## Rangkuman

1. Development build mengejar kecepatan iterasi (Metro, debug); production build mengejar ukuran, kecepatan, dan keamanan (minifikasi, aset optimal, tanda tangan) — keduanya produk dari proses build yang sama dengan tujuan berbeda.
2. EAS Build adalah build cloud Expo: `eas login` untuk autentikasi, `eas build:configure` untuk membuat `eas.json`, lalu `eas build --platform android --profile <nama>` untuk membangun.
3. Tiga profil build: development (dev client untuk pengembang), preview (APK rilis untuk pengujian internal), production (AAB untuk toko, `autoIncrement` versi).
4. APK dapat diinstal langsung; AAB adalah format induk untuk Play yang disusun Google menjadi APK khusus perangkat — wajib untuk aplikasi baru sejak 2021. *⚠*
5. `app.json` memuat identitas: `name`, `slug`, `version` (semantik `utama.tengah.tambalan`), application ID (`android.package`, `ios.bundleIdentifier` — kebalikan domain, permanen), ikon 1024×1024 + adaptive icon, dan splash screen lewat plugin expo-splash-screen. *⚠*
6. Environment variable ber-prefiks `EXPO_PUBLIC_` disisipkan ke bundel saat build — praktis untuk alamat server, tetapi tidak pernah untuk secret; sekret disimpan di sisi server (Bab 10/13).
7. Signing membuktikan keaslian dan menjamin aplikasi hanya bisa diperbarui oleh pemilik kunci; keystore yang hilang berarti aplikasi tidak dapat diperbarui — EAS mengelolanya otomatis dan aman.
8. Google Play mendistribusikan lewat tracks: internal testing, closed testing, open testing, dan production — masing-masing dengan jumlah penguji dan proses review berbeda; Play App Signing memisahkan kunci unggah dari kunci produksi.
9. App Store melalui App Store Connect, TestFlight, dan App Review memerlukan keanggotaan Apple Developer berbayar tahunan — alurnya dipahami secara konseptual, EAS mengotomatiskan sertifikat dan unggahan.
10. Tiga lingkungan (development, preview/testing, production) memakai kode yang sama dengan konfigurasi berbeda — prinsip yang mencegah "berjalan di mesin saya".

## Refleksi

1. Sebelum bab ini, bagaimana Anda membagikan aplikasi ke teman? Apa risiko tersembunyi dari cara itu yang kini Anda sadari?
2. Jika Anda memimpin tim kecil pengembangan aplikasi kampus, kebiasaan dari bab mana (konfigurasi, versi, signing, atau saluran distribusi) yang paling Anda wajibkan sejak hari pertama, dan mengapa?
3. Pernahkah Anda menemukan aplikasi yang "tidak bisa diperbarui" atau versinya tertinggal? Hubungkan pengalaman itu dengan konsep versioning dan signing di bab ini.
4. Dalam karier Anda sebagai analis/insinyur Sistem Informasi, pekerjaan mana yang lebih sering Anda hadapi — membangun aplikasi atau menyusun strategi rilisnya? Mengapa keduanya tidak bisa dipisahkan?

## Evaluasi Bab

### Pilihan Ganda

1. Perbedaan utama production build dan development build adalah...
   A. Production build memerlukan internet, development build tidak
   B. Production build diminifikasi, dioptimalkan, dan ditandatangani tanpa alat debugging; development build memudahkan iterasi dan debugging
   C. Development build hanya untuk iOS, production build hanya untuk Android
   D. Keduanya identik, hanya nama profilnya yang berbeda

2. Profil `development` pada eas.json ditandai `developmentClient: true`, artinya...
   A. Hasilnya AAB untuk Google Play
   B. Hasilnya development build memakai expo-dev-client, dipasang pada perangkat pengembang bersama `npx expo start --dev-client`
   C. Hasilnya aplikasi web
   D. Hasilnya harus diunggah ke TestFlight

3. Alasan Google Play mewajibkan AAB untuk aplikasi baru adalah...
   A. AAB lebih kecil daripada APK sehingga hemat penyimpanan server Google
   B. AAB memungkinkan Play menyusun APK yang disesuaikan per perangkat sehingga unduhan pengguna lebih kecil
   C. APK tidak dapat ditandatangani
   D. AAB adalah satu-satunya format yang didukung perangkat Android

4. Application ID `ac.id.univ.mahasiswa` mengikuti aturan...
   A. Nama domain biasa (bukan kebalikan), diakhiri ekstensi
   B. Kebalikan nama domain, huruf kecil, unik global, dan tidak boleh diubah setelah publikasi
   C. Bebas asalkan unik di perangkat lokal
   D. Harus diawali angka tahun pembuatan

5. `android.versionCode` adalah...
   A. Versi yang dibaca pengguna di toko aplikasi
   B. Bilangan bulat yang wajib naik setiap unggahan agar Play menerima build
   C. Nomor acak yang dihasilkan EAS
   D. Sama dengan `version` di app.json

6. Variabel `EXPO_PUBLIC_API_URL` pada kode aplikasi...
   A. Dapat menyimpan kata sandi server dengan aman
   B. Nilainya disisipkan ke bundel saat build, sehingga tidak cocok untuk secret
   C. Hanya bekerja di emulator iOS
   D. Otomatis dienkripsi oleh Google Play

7. Keystore yang hilang mengakibatkan...
   A. Aplikasi tidak dapat dikompilasi di EAS
   B. Aplikasi terpasang tidak dapat diperbarui karena tanda tangan tidak cocok
   C. Tidak ada efek, EAS membuatkan keystore baru otomatis
   D. Application ID berubah

8. Track Google Play tanpa proses review dan maksimal 100 penguji adalah...
   A. Production
   B. Open testing
   C. Internal testing
   D. Beta

9. Untuk membangun iOS via EAS, syarat yang tidak dapat dilewati adalah...
   A. Perangkat iPhone
   B. Keanggotaan Apple Developer Program (berbayar tahunan)
   C. Laptop Mac
   D. Kartu kredit pengguna akhir

10. `npx expo export --platform android` menghasilkan...
    A. APK yang siap diinstal
    B. AAB untuk Play Console
    C. Bundel JavaScript produksi beserta aset di folder `dist/` — bukan APK
    D. File `.ipa` untuk iOS

### Soal Uraian

1. Susun langkah demi langkah memublikasikan versi pertama aplikasi Anda ke track internal testing Google Play: mulai dari build yang tepat, dokumen kehadiran aplikasi yang harus disiapkan, hingga unggahan AAB dan verifikasi oleh penguji. Sebut subbab yang menjadi acuan tiap langkah.
2. Aplikasi Anda memakai backend yang berbeda di emulator (`10.0.2.2`), perangkat uji di jaringan kampus (IP LAN), dan produksi (`https://api.univ.ac.id`). Rancang pengaturan environment variable yang menangani ketiganya tanpa mengubah kode, dan jelaskan apa yang tidak boleh Anda taruh pada berkas `.env` beserta alasannya.
3. Analisislah: sebuah tim menyebarkan APK produksi lewat WhatsApp selama tiga bulan, lalu mendaftar ke Play dengan application ID yang sama. Identifikasi tiga risiko dari praktik ini berdasarkan materi bab (versi, signing, saluran) dan rekomendasikan perbaikannya.

### Kunci Jawaban

<details>
<summary>Kunci jawaban pilihan ganda (klik untuk membuka)</summary>

1. B — Production build diminifikasi, dioptimalkan, dan ditandatangani; development build memudahkan debugging (subbab 15.1).
2. B — `developmentClient: true` menghasilkan development build memakai expo-dev-client (subbab 15.2).
3. B — Play menyusun split APK per perangkat dari AAB sehingga unduhan lebih kecil (subbab 15.3).
4. B — Application ID mengikuti kebalikan domain, huruf kecil, unik global, dan permanen (subbab 15.5).
5. B — `versionCode` adalah bilangan bulat yang wajib naik setiap unggahan (subbab 15.5).
6. B — Nilai `EXPO_PUBLIC_*` disisipkan ke bundel saat build, sehingga bukan tempat untuk secret (subbab 15.6).
7. B — Tanda tangan baru tidak cocok dengan aplikasi terpasang, sehingga pembaruan ditolak (subbab 15.7).
8. C — Internal testing: hingga 100 penguji, rilis cepat tanpa review (subbab 15.8).
9. B — Keanggotaan Apple Developer Program berbayar tahunan adalah syarat mutlak (subbab 15.4, 15.9).
10. C — `expo export` menghasilkan bundel produksi dan aset di `dist/`, bukan APK (subbab Praktikum).

</details>