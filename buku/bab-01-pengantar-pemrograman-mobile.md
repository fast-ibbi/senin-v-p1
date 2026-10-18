# BAB 1 — Pengantar Pemrograman Mobile

## Deskripsi Singkat

Bab ini membangun fondasi konseptual sebelum Anda menulis kode apa pun. Anda akan mempelajari apa itu aplikasi mobile, karakteristiknya, jenis-jenisnya (native, web, dan hybrid), dua platform utama (Android dan iOS), evolusi teknologi mobile, serta dua teknologi yang menjadi inti buku ini: React Native dan Expo. Bab ini juga memperkenalkan arsitektur umum aplikasi mobile dan peta kompetensi yang akan Anda raih, sehingga bab-bab berikutnya tinggal mengisi keterampilan teknis di atas kerangka yang sudah Anda pahami di sini.

## Tujuan Pembelajaran

Setelah menyelesaikan bab ini, mahasiswa diharapkan mampu:

1. menjelaskan pengertian dan karakteristik aplikasi mobile serta perannya dalam sistem informasi modern;
2. membedakan aplikasi native, web, dan hybrid beserta kelebihan serta kekurangannya masing-masing;
3. menjelaskan posisi platform Android dan iOS dalam ekosistem mobile dan implikasinya bagi pengembang;
4. menjelaskan evolusi teknologi mobile dan alasan munculnya pendekatan lintas platform (cross-platform);
5. menjelaskan konsep dan cara kerja React Native serta peran Expo dalam pengembangan aplikasi;
6. menganalisis keunggulan dan keterbatasan React Native melalui pendekatan pertukaran (trade-off);
7. menggambarkan arsitektur umum aplikasi mobile dan memetakan kompetensi yang akan diperoleh selama perkuliahan.

## Peta Konsep

`File: (diagram peta konsep — bukan berkas program)`
```text
              BAB 1: PENGANTAR PEMROGRAMAN MOBILE
                             │
   ┌───────┬─────────┬───────┼─────────┬──────────┬─────────┐
   ▼       ▼         ▼       ▼         ▼          ▼         ▼
Karakter  Jenis    Platform  Evolusi  React      Expo    Kompetensi
aplikasi  aplikasi  Android   teknologi Native    (SDK,    yang akan
mobile    native/   & iOS     mobile   (konsep &  Expo Go, diperoleh
          web/                         cara      EAS)
          hybrid                        kerja)
                             │
                             ▼
            Keunggulan & Keterbatasan (analisis trade-off)
                             │
                             ▼
            Arsitektur umum aplikasi mobile
            (klien: UI – bisnis – data | server: REST API)
                             │
                             ▼
        Contoh aplikasi nyata → Praktikum → peta 15 bab → Project Akhir
```

## Materi

### 1.1 Aplikasi Mobile dan Karakteristiknya

**Aplikasi mobile** (aplikasi seluler) adalah perangkat lunak yang dirancang khusus untuk dijalankan pada perangkat bergerak, terutama **smartphone** (telepon pintar) dan tablet. Istilah *mobile* menunjuk mobilitas: aplikasi ini menyertai penggunanya berpindah tempat, dan dari mobilitas itulah nilai utamanya lahir. Berbeda dengan aplikasi web yang dibuka melalui peramban (browser) atau aplikasi desktop yang berjalan di komputer meja, aplikasi mobile diinstal pada perangkat, hidup dalam ekosistem toko aplikasi, dan memanfaatkan kemampuan fisik perangkat tempat ia dipasang.

Untuk merancang aplikasi mobile yang baik, kita harus memahami karakteristik yang membedakannya dari jenis perangkat lunak lain. Paling tidak ada tujuh karakteristik yang perlu diingat.

*Pertama, mobilitas dan konteks pengguna.* Pengguna menjalankan aplikasi sambil beraktivitas: di kampus, di kendaraan, di antrean. Konsekuensinya, sesi penggunaan cenderung pendek dan sering terinterupsi. Aplikasi yang baik harus bisa "berhenti sekejap dan lanjut lagi" tanpa kehilangan data — inilah salah satu alasan mengapa penyimpanan lokal dan manajemen status (state) menjadi tema penting di buku ini (lihat Bab 9 dan Bab 11).

*Kedua, antarmuka berbasis sentuhan.* Layar sentuh menggantikan tetikus dan papan ketik. Desain antarmuka (user interface) harus memperhitungkan ukuran jari, gerakan (gesture) seperti geser dan cubit, serta keterbatasan lebar layar. Hal ini memengaruhi hampir semua keputusan desain yang akan Anda pelajari di Bab 5 dan Bab 6.

*Ketiga, akses ke sensor dan fitur perangkat.* Smartphone membawa kamera, mikrofon, penerima GPS (penentu posisi global), akselerometer (pengukur gerakan), hingga sistem notifikasi yang selalu aktif. Aplikasi mobile memanfaatkan perangkat keras ini untuk menciptakan pengalaman yang tidak mungkin direplikasi aplikasi web: ojek daring mengetahui posisi kita, kamera memindai kode QR untuk pembayaran, dan notifikasi mengingatkan kita tentang jadwal kuliah yang berubah. Di Bab 12 Anda akan mempraktikkan cara mengakses fitur-fitur ini lewat Expo.

*Keempat, konektivitas yang berubah-ubah.* Jaringan berganti-ganti antara Wi-Fi dan data seluler, dan kadang hilang sama sekali. Aplikasi yang matang tidak boleh "mati" begitu jaringan terputus; ia menyimpan data sementara dan menyinkronkan saat jaringan kembali. Prinsip ini dikenal sebagai mode offline-pertama (offline-first) dan menjadi bahan diskusi pada Bab 11.

*Kelima, distribusi melalui toko aplikasi.* Aplikasi mobile dipasang melalui **toko aplikasi** seperti Google Play dan App Store. Distribusi terkurasi ini menjamin keamanan dasar pengguna, tetapi menambah proses peninjauan (review) sebelum rilis — konsekuensi yang akan Anda rasakan saat belajar menerbitkan aplikasi di Bab 15.

*Keenam, sumber daya perangkat yang terbatas.* Baterai, memori, dan daya proses terbatas dibanding komputer desktop. Kode yang boros membuat baterai cepat habis dan aplikasi lemot. Kesadaran akan keterbatasan ini membentuk kebiasaan menulis kode yang hemat — misalnya menghindari pemrosesan berulang yang tidak perlu.

*Ketujuh, siklus hidup aplikasi yang diatur sistem.* Berbeda dengan program desktop, aplikasi mobile tidak menentukan sendiri kapan ia berjalan atau berhenti. Sistem operasi dapat memindahkan aplikasi ke latar belakang (background), membekukannya, atau menutupnya demi menghemat daya, lalu mengembalikannya saat pengguna membuka lagi. Aplikasi yang baik harus menyimpan keadaannya agar tidak "lupa" posisi terakhir pengguna.

Mengapa mahasiswa Sistem Informasi perlu memahami karakteristik ini? Karena hampir setiap sistem informasi modern sekarang memiliki "wajah mobile": e-learning, presensi, layanan akademik, hingga sistem antrean rumah sakit. Karakteristik di atas bukan sekadar teori — setiap butirnya akan kembali muncul sebagai keputusan desain dan baris kode di bab-bab berikutnya.

### 1.2 Jenis Aplikasi Mobile: Native, Web, dan Hybrid

Ketika sebuah organisasi memutuskan membangun aplikasi mobile, pertanyaan pertamanya bukan "bahasa apa?", melainkan "pendekatan apa?". Secara garis besar ada tiga pendekatan klasik — native, web mobile, dan hybrid — kemudian muncul pendekatan keempat yang menjadi fokus buku ini: **cross-platform** (lintas platform). Memahami keempatnya penting karena setiap pilihan adalah pertukaran (trade-off) antara biaya, performa, dan pengalaman pengguna — tidak ada yang menang mutlak di semua kondisi.

**Aplikasi native** (aplikasi asli) dibangun dengan bahasa dan perangkat pengembangan resmi milik satu platform: untuk Android menggunakan Kotlin (atau Java), untuk iOS menggunakan Swift (atau Objective-C). Aplikasi native berkomunikasi langsung dengan sistem operasi, sehingga performanya paling tinggi, aksesnya ke fitur perangkat paling lengkap, dan tampilannya paling "terasa" sesuai platform. Kekurangannya jelas: satu aplikasi berarti satu basis kode (codebase) per platform. Organisasi yang ingin hadir di Android dan iOS harus membangun dua aplikasi terpisah dengan dua tim (atau satu tim yang menguasai dua bahasa), dan setiap perubahan fitur dikerjakan dua kali. Biaya pengembangan dan pemeliharaan hampir berlipat dua.

**Aplikasi web mobile** (aplikasi web bergerak) sebenarnya bukan aplikasi yang diinstal — ia adalah situs web yang dioptimalkan untuk layar kecil dan diakses melalui peramban. Keunggulannya sangat menarik bagi organisasi: satu basis kode yang sama untuk web dan mobile, tidak perlu melewati toko aplikasi, dan pembaruan langsung berlaku tanpa menunggu pengguna memperbarui. Namun ada harga yang dibayar: akses ke sensor dan notifikasi sangat terbatas (meskipun teknologi Progresif Web App, disingkat PWA, menutup sebagian celah ini), performa di bawah native, dan pengguna harus "membuka peramban dulu" setiap kali ingin mengakses — kebiasaan yang jauh lebih lemah daripada mengetuk ikon aplikasi yang selalu tampak. Padahal mengelola notifikasi dan kehadiran "di layar utama" adalah salah satu senjata utama aplikasi mobile dalam memenangkan perhatian pengguna.

**Aplikasi hybrid** (aplikasi hibrida) menggabungkan keduanya: antarmuka ditulis dengan teknologi web (HTML, CSS, JavaScript), lalu dibungkus dalam kontainer native yang menampilkannya lewat komponen **WebView** (jendela peramban tertanam) dan menyediakan jembatan (bridge) ke sebagian fitur perangkat. Satu basis kode dapat dipublikasikan ke Google Play dan App Store — daya tarik utamanya. Kelemahannya juga terkenal: antarmuka tidak pernah "terasa native" karena dirender seperti halaman web, animasi berat tersendat, dan pengalaman pengguna menjadi korban kompromi. Pendekatan hybrid klasik (era Cordova/PhoneGap) populer sekitar 2012–2015, lalu ditinggalkan ketika cross-platform modern hadir.

**Cross-platform modern** adalah jawaban generasi berikutnya atas persoalan yang sama — satu basis kode untuk banyak platform — tetapi dengan cara kerja berbeda dari hybrid: kode ditulis dalam satu bahasa (React Native memakai JavaScript, Flutter memakai Dart) dan diterjemahkan menjadi antarmuka dengan tampilan native sungguhan, bukan halaman web di dalam WebView. React Native, Flutter, dan .NET MAUI termasuk kategori ini. Di sinilah model "tulis sekali, jalankan di mana-mana yang *layak*" lahir: pengalaman mendekati native dengan biaya mendekati web.

Tabel 1.1 merangkum perbandingan keempat pendekatan.

**Tabel 1.1 Perbandingan pendekatan pengembangan aplikasi mobile**

| Aspek | Native | Web mobile | Hybrid | Cross-platform (React Native) |
|---|---|---|---|---|
| Bahasa | Kotlin/Java (Android), Swift (iOS) | HTML, CSS, JavaScript | HTML, CSS, JavaScript | JavaScript/JSX |
| Basis kode | Dua (per platform) | Satu (web) | Satu | Satu |
| Distribusi | Toko aplikasi | Peramban web | Toko aplikasi | Toko aplikasi |
| Performa | Tertinggi | Rendah–sedang | Sedang | Tinggi (mendekati native) |
| Akses fitur perangkat | Penuh | Terbatas | Sebagian (via bridge) | Luas (via modul) |
| Tampilan | Asli platform | Tidak asli | Tidak asli | Mendekati asli |
| Biaya pengembangan | Paling tinggi | Rendah | Sedang | Sedang |

Kapan memilih yang mana? Tidak ada rumus tunggal, tetapi ada kriteria pegangan. Pilih *native* jika aplikasi bergantung pada performa dan fitur perangkat mutakhir (misalnya game berat). Pilih *web mobile* jika anggaran sangat terbatas, fitur perangkat tidak diperlukan, dan kecepatan rilis lebih penting daripada kehadiran di toko aplikasi. Pilih *hybrid* hanya jika tim sudah sangat kuat di teknologi web dan menerima kompromi pengalaman pengguna. Pilih *cross-platform* untuk sebagian besar kasus sistem informasi: aplikasi bisnis yang butuh kehadiran di dua platform, form, daftar data, dan integrasi server — wilayah yang paling tidak menuntut performa ekstrem, tetapi paling menuntut kecepatan pengembangan. Buku ini memilih React Native + Expo atas dasar pertimbangan itu, yang akan diuraikan pada Subbab 1.5 hingga 1.7.

### 1.3 Platform Android dan iOS

Dua platform yang mendominasi dunia mobile adalah **Android** (dikembangkan Google, dirilis 2008) dan **iOS** (dikembangkan Apple, dirilis 2007). Keduanya bersaing memperebutkan pengguna, tetapi cara mereka memperlakukan pengembang sangat berbeda — dan perbedaan inilah yang membentuk strategi pengembangan aplikasi.

Android adalah sistem operasi berbasis sumber terbuka (open source) yang digunakan oleh ratusan merek: Samsung, Xiaomi, Oppo, dan lainnya. Keterbukaannya membuat Android menguasai mayoritas pasar perangkat di dunia, termasuk Indonesia, dengan rentang harga perangkat yang sangat lebar. Namun keterbukaan itu membawa konsekuensi: **fragmentasi** (pemecahan) — ribuan model perangkat dengan ukuran layar, kinerja, dan versi sistem operasi yang berbeda-beda. Aplikasi Android harus diuji pada beragam perangkat; sebuah perilaku yang mulus di satu ponsel bisa berbeda di ponsel lainnya. Distribusi aplikasi Android dilakukan melalui Google Play, tetapi pengguna juga dapat memasang berkas aplikasi (APK) dari sumber lain.

Sebaliknya, iOS hanya berjalan pada perangkat buatan Apple (iPhone dan iPad). Ekosistemnya tertutup dan terkendali: satu perangkat keras, satu toko aplikasi, dan proses peninjauan yang ketat. Konsistensi inilah kekuatannya — aplikasi diuji pada segelintir perangkat saja dan perilakunya dapat diprediksi. Harga yang dibayar pengembang: biaya masuk untuk mendaftar sebagai pengembang resmi, perangkat Apple yang relatif mahal, dan aturan distribusi yang kaku. Pengembangan untuk iOS sendiri dilakukan di lingkungan **Xcode** yang hanya berjalan di komputer Mac.

Tabel 1.2 merangkum perbandingan kedua platform.

**Tabel 1.2 Perbandingan Android dan iOS**

| Aspek | Android | iOS |
|---|---|---|
| Pengembang | Google | Apple |
| Model sumber | Terbuka (AOSP) | Tertutup |
| Perangkat | Ratusan merek | Hanya Apple |
| Bahasa native | Kotlin (Java) | Swift |
| Toko aplikasi | Google Play (+ lainnya) | App Store |
| Review aplikasi | Lebih longgar | Ketat |
| Alat pengembangan | Android Studio (Windows/macOS/Linux) | Xcode (khusus macOS) |
| Karakter pasar | Mayoritas global, beragam harga | Premium, konsisten |

Apa implikasinya bagi pengembang? Pertama, membangun native untuk dua platform berarti mempelajari dua bahasa, dua alat pengembangan, dan dua proses review — beban yang nyata bagi tim kecil seperti kelompok praktikum mahasiswa. Kedua, perbedaan karakter pasar: jika target utama adalah jangkauan luas dengan perangkat beragam (khas Indonesia), Android adalah prioritas; jika target adalah pengguna premium yang setia pada ekosistem Apple, iOS tidak boleh dilewatkan. Ketiga, aturan main berubah-ubah — kebijakan toko aplikasi dan ketentuan privasi dua vendor ini sering diperbarui, sehingga pengembang harus mengikuti perkembangannya (kebijakan privasi akan dibahas singkat di Bab 12 dan Bab 13).

Reaksi wajar pengembang terhadap biaya ganda ini adalah membangun sekali untuk dua platform — titik lahirnya React Native dan pendekatan cross-platform. Dalam buku ini, seluruh praktikum dijalankan di Android (Expo Go atau emulator) karena tidak membutuhkan komputer Mac, sementara kode yang sama tetap dapat dijalankan di iOS. Detail teknisnya akan Anda praktikkan di Bab 2, dan penerbitan ke kedua toko dibahas secara konseptual di Bab 15.

### 1.4 Evolusi Teknologi Mobile

Untuk memahami mengapa ekosistem mobile berbentuk seperti sekarang, kita perlu menelusuri sejarahnya secara singkat — karena setiap generasi teknologi lahir sebagai jawaban atas keterbatasan generasi sebelumnya, sebuah pola yang akan terus Anda jumpai sepanjang karier pengembang.

Era pertama adalah ponsel fitur (feature phone), akhir 1990-an hingga pertengahan 2000-an. Ponsel waktu itu berlayar kecil, berinteraksi lewat tombol fisik, dan "aplikasi"-nya sangat terbatas: permainan sederhana dan layanan web primitif melalui protokol WAP yang lambat dan mahal. Perangkat lunak didistribusikan lewat kartu SIM dan operator seluler — bukan toko yang bisa diakses siapa saja.

Era kedua dimulai 2007 ketika Apple meluncurkan iPhone: layar sentuh kapasitif yang responsif, tanpa tombol fisik untuk navigasi. Setahun kemudian, 2008, Apple membuka App Store dan Android 1.0 dirilis sebagai pesaing berat. Dua peristiwa itu mengubah segalanya: toko aplikasi memberi pengembang kecil akses distribusi global tanpa izin operator, dan lahirlah istilah **ekonomi aplikasi** (app economy). Pola pembaruan pun berubah: dari menunggu versi baru perangkat menjadi pembaruan lewat udara (over-the-air) langsung ke perangkat pengguna.

Era ketiga, web ikut berevolusi: situs yang hanya dioptimalkan untuk layar desktop mulai ditinggalkan, dan lahirlah praktik desain responsif (responsive design) serta HTML5 yang menjalankan media lebih kaya di peramban — meskipun akses fitur perangkatnya tetap kalah dari aplikasi native.

Era keempat, pertengahan 2010-an, adalah era cross-platform — biaya dua codebase native yang terus membengkak memunculkan framework lintas platform; React Native dibuka sebagai sumber terbuka oleh Meta pada 2015 dan menjadi pelopor pendekatan "satu basis kode JavaScript untuk antarmuka native". Kini perkembangan berlanjut: lahir layanan besar (super-app), kecerdasan buatan merambah lewat fitur penerjemahan dan asisten, dan muncul ponsel lipat. Anda tidak perlu menghafal tanggal-tanggal ini; yang perlu dipahami adalah polanya: setiap generasi menjawab keterbatasan generasi sebelumnya, dan React Native adalah salah satu jawaban atas mahalnya dua codebase native.

### 1.5 React Native: Konsep dan Cara Kerja

**React Native** (disingkat RN) adalah framework sumber terbuka yang dikembangkan Meta untuk membangun aplikasi mobile Android dan iOS menggunakan **JavaScript** — bahasa yang sama dengan web. Ia merupakan turunan dari pustaka React yang terkenal untuk membangun antarmuka web; pola pikirnya (komponen, props, state — lihat Bab 4) dibawa utuh ke dunia mobile, tetapi elemen antarmukanya berubah dari tag HTML menjadi komponen khusus mobile.

Konsep intinya sederhana namun revolusioner: *tulis antarmuka sekali dengan JavaScript, dan React Native akan menggambar antarmuka itu menggunakan komponen UI native milik masing-masing platform*. Ketika Anda menulis komponen `View` (wadah tata letak), di Android ia menjadi `ViewGroup` dan di iOS menjadi `UIView` — bukan kotak abu-abu di dalam halaman web yang digambar WebView, melainkan elemen antarmuka sungguhan milik sistem operasi. Inilah pembeda terbesar antara React Native dan hybrid klasik (Subbab 1.2): hasilnya adalah antarmuka native, sehingga pengguna tidak bisa membedakannya dari aplikasi yang ditulis Kotlin atau Swift.

Bagaimana cara kerjanya secara teknis? Di dalam aplikasi React Native terdapat dua "dunia" yang hidup bersamaan: dunia JavaScript tempat logika aplikasi berjalan (dijalankan mesin JavaScript bernama **Hermes** yang dioptimalkan untuk perangkat mobile), dan dunia native tempat antarmuka digambar. Kedua dunia berkomunikasi melalui lapisan penghubung yang meneruskan pesan bolak-balik: JavaScript memerintahkan "buat tombol hijau di sini", lapisan native menerjemahkannya menjadi tombol asli, lalu melaporkan kejadian seperti ketukan pengguna kembali ke JavaScript. Secara historis lapisan ini disebut **bridge** (jembatan), dan seiring waktu arsitekturnya terus disempurnakan dengan renderer dan mekanisme komunikasi yang lebih cepat. *⚠ version-sensitive: detail arsitektur React Native terkini (renderer baru, mesin JavaScript default) sebaiknya diverifikasi di dokumentasi resmi reactnative.dev, karena terus diperbarui.*

Selain antarmuka native, React Native mewarisi keunggulan pengembangan dari ekosistem web: **hot reload** (perubahan kode langsung terlihat tanpa membangun ulang aplikasi), pembaruan cepat, dan akses ke jutaan pustaka npm. Saat aplikasi dijalankan dalam mode pengembangan, bundler bernama **Metro** menggabungkan seluruh berkas JavaScript menjadi satu dan mengirimkannya ke perangkat — inilah yang akan Anda lihat berjalan saat `npx expo start` (Bab 2).

Perlu ditegaskan apa yang *bukan* React Native: ia bukan penerjemah kode ke bahasa native (Kotlin/Swift) dan bukan pembungkus halaman web. Kode JavaScript tetap berjalan sebagai JavaScript; yang "native" adalah tampilan antarmukanya. Konsekuensinya, aplikasi React Native unggul untuk aplikasi berbasis data (form, daftar, integrasi server) — bukan untuk permainan ber-grafik berat yang tetap lebih baik ditulis native (Subbab 1.7).

Dalam buku ini Anda akan memakai React Native 0.86 yang dibundel dalam Expo SDK 57, dengan React 19.2 sebagai pustaka antarmukanya (versi-teknologi dirangkum pada bagian pendahuluan buku). Seluruh konsep komponen, state, dan efek samping yang akan Anda pelajari di Bab 4 dan Bab 5 adalah fondasi React Native itu sendiri.

### 1.6 Expo: Framework untuk Pengembangan Cepat

React Native menyelesaikan masalah "dua codebase", tetapi meninggalkan pekerjaan rumah lain: membangun dan mengonfigurasi project native (Xcode/Android Studio), menangani modul perangkat (kamera, lokasi, notifikasi), dan membangun berkas rilis untuk toko aplikasi. **Expo** adalah framework (dan platform layanan) di atas React Native yang merapikan pekerjaan rumah itu. Jika React Native adalah "bahasa dan mesin", Expo adalah "lingkungan kerja yang membuat mesin itu mudah dipakai".

Tiga komponen Expo yang akan Anda kenali sepanjang buku ini:

1. **Expo SDK** — kumpulan pustaka resmi yang menyatukan akses ke fitur perangkat (kamera, lokasi, notifikasi, penyimpanan) dengan API yang konsisten lintas platform. Daripada menulis kode native berbeda untuk Android dan iOS, Anda cukup memakai satu API JavaScript. Buku ini memakai Expo SDK 57.
2. **Expo Go** — aplikasi perangkat yang memungkinkan project Expo dijalankan langsung di ponsel tanpa membangun aplikasi native sama sekali. Anda mengetik `npx expo start`, memindai kode QR dengan Expo Go, dan aplikasi tampil — proses yang ideal untuk belajar karena menghilangkan hambatan instalasi Android Studio atau Xcode di tahap awal (praktiknya di Bab 2).
3. **EAS (Expo Application Services)** — layanan cloud untuk membangun (build) dan menerbitkan aplikasi ke toko aplikasi, termasuk menghasilkan berkas APK/AAB untuk Android. EAS akan Anda gunakan di Bab 15.

Mengapa Expo ada di atas React Native? Alasan yang sama dengan mengapa React Native ada di atas native: mengurangi kerja berulang. Tim tidak perlu memelihara dua project native yang rapuh; konfigurasi diatur dari satu berkas, fitur perangkat disediakan via SDK, dan pembaruan dapat dikirim tanpa membangun ulang aplikasi. Bagi mahasiswa, manfaat terbesarnya adalah kurva belajar: dari nol hingga aplikasi berjalan di ponsel hanya butuh beberapa langkah — pengalaman pertama yang menyenangkan, bukan frustrasi konfigurasi.

Tentu ada harga yang dibayar, dan Anda berhak mengetahuinya sejak awal. Pertama, aplikasi Expo cenderung lebih besar ukurannya. Kedua, jika project membutuhkan modul native yang belum didukung Expo, Anda harus keluar dari jalur nyaman dan melakukan proses *prebuild* (membangkitkan project native) atau *development build* — pekerjaan yang lebih rumit, dibahas konseptual di Bab 15. Ketiga, fitur perangkat mutakhir kadang baru tersedia setelah tim Expo menyesuaikannya ke SDK terbaru, sehingga ada jeda antara rilis fitur native dan dukungan Expo. Bagi mayoritas aplikasi sistem informasi, ketiga keterbatasan ini tidak menghalangi; bagi project khusus, inilah pertimbangan trade-off yang harus dievaluasi (pola berpikir Subbab 1.7).

Perlu dicatat bahwa pembuatan project memakai perintah `npx create-expo-app` dengan template JavaScript polos, dan seluruh detail instalasi akan Anda praktikkan di Bab 2 — bab ini cukup memahami *peran* masing-masing alat.

### 1.7 Keunggulan dan Keterbatasan React Native

Keputusan memilih React Native tidak boleh didasarkan pada tren, melainkan pada analisis keunggulan dan keterbatasannya — itulah esensi analisis pertukaran (trade-off) yang menjadi ciri berpikir profesional. Tabel 1.3 merangkumnya.

**Tabel 1.3 Keunggulan dan keterbatasan React Native**

| Keunggulan | Keterbatasan |
|---|---|
| Satu basis kode untuk Android dan iOS | Performa di bawah native untuk beban ekstrem |
| Tim JavaScript dapat langsung produktif | Aplikasi lebih besar dan lebih boros memori |
| Ekosistem npm yang sangat luas | Fitur platform terbaru kadang terlambat diadopsi |
| Hot reload mempercepat iterasi | Debugging lintas lapisan (JS + native) lebih rumit |
| Pembaruan aplikasi tanpa membangun ulang | Modul native khusus tetap butuh keahlian native |
| Komunitas besar dan banyak materi belajar | Bergantung pada kestabilan versi pustaka pihak ketiga |

Mari bedah tiap sisi. Keunggulan pertama jelas: satu basis kode. Perubahan fitur ditulis sekali dan berlaku di dua platform — penghematan terbesar justru terjadi pada pemeliharaan jangka panjang, bukan pada penulisan awal. Kedua, kesinambungan keterampilan: mahasiswa dan tim yang menguasai JavaScript (termasuk lulusan yang baru belajar seperti Anda) bisa langsung membangun antarmuka native tanpa mempelajari Kotlin dan Swift sekaligus. Ketiga, ekosistem: ribuan pustaka npm siap pakai mempercepat pengembangan, dan komunitas besar berarti jawaban atas masalah hampir selalu sudah tersedia di internet. Keempat, hot reload menghasilkan siklus "ubah–lihat hasil" yang singkat — pengalaman yang sangat mendukung proses belajar. Kelima, pembaruan dikirim langsung ke pengguna tanpa melewati peninjauan toko untuk perubahan kecil, sehingga organisasi bergerak lebih gesit. Keenam, jejaring dukungan: ketersediaan sumber belajar dan tenaga kerja dengan keterampilan React Native membuat perekrutan tim lebih mudah.

Di sisi keterbatasan, pertama, performa: aplikasi yang menuntut rendering grafis real-time kelas berat (game 3D, editor video) tetap lebih baik ditulis native, karena komunikasi lintas lapisan JS–native menambah beban. Kedua, ukuran dan memori: aplikasi React Native membawa runtime JavaScript, sehingga berkasnya lebih besar dan konsumsi memorinya lebih tinggi daripada native murni — pertimbangan nyata untuk perangkat kelas bawah. Ketiga, kesenjangan adopsi: ketika Apple atau Google merilis fitur baru, perlu waktu sebelum React Native mendukungnya. Keempat, debugging: kesalahan bisa terjadi di lapisan JavaScript, lapisan native, atau keduanya (Bab 14 akan melatih penelusurannya). Kelima, jika project membutuhkan modul native yang sangat khusus, Anda tetap harus menyentuh kode native — keahlian Kotlin/Swift tidak sepenuhnya bisa dihindari pada skenario lanjutan.

Dengan kerangka ini, kapan React Native adalah pilihan tepat? Pola umumnya: aplikasi yang kaya antarmuka dan data tetapi tidak menuntut performa ekstrem — aplikasi bisnis, e-commerce, layanan, sistem informasi — justru mendapat manfaat terbesar, karena kecepatan pengembangan lebih penting daripada keunggulan performa marginal. Inilah profil mayoritas aplikasi di dunia nyata, dan inilah alasan buku ini memilih React Native: Anda belajar teknologi yang paling relevan untuk menjadi pengembang aplikasi sistem informasi. Saat menghadapi keputusan serupa di dunia kerja, kembalilah ke analisis trade-off, bukan preferensi pribadi.

### 1.8 Arsitektur Umum Aplikasi Mobile

Aplikasi mobile modern nyaris tidak pernah berdiri sendiri; hampir semua aplikasi yang Anda pakai sehari-hari berkomunikasi dengan server. Memahami bagaimana aplikasi di perangkat dan server berbagi peran adalah kompetensi fundamental yang menjadi kerangka seluruh buku ini.

Pola paling umum adalah arsitektur **client–server** (klien–pelayan): aplikasi di perangkat berperan sebagai *klien* yang menampilkan antarmuka dan mengumpulkan masukan pengguna, sementara *server* menyediakan data dan aturan bisnis. Keduanya berkomunikasi melalui web melalui protokol HTTP, dengan format data **JSON** (JavaScript Object Notation — notasi objek JavaScript) dan pola desain **REST API** (antarmuka pemrograman aplikasi bergaya REST; dibahas menyeluruh di Bab 10). Ketika Anda membuka aplikasi cek nilai, aplikasi mengirim permintaan "tampilkan nilai saya" ke server, server menjawab dengan data JSON, lalu aplikasi menggambar tabel nilai di layar.

Di dalam sisi klien, aplikasi mobile yang baik disusun dalam tiga lapisan (layer) logis, seperti pada Gambar 1.1:

`File: (diagram arsitektur — bukan berkas program)`
```text
┌─────────────────────────────────────────────────────────┐
│  PERANGKAT (klien)                                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Lapisan presentasi (UI): komponen, layout, navigasi│  │
│  ├───────────────────────────────────────────────────┤  │
│  │ Lapisan bisnis: aturan aplikasi, validasi, state  │  │
│  ├───────────────────────────────────────────────────┤  │
│  │ Lapisan data: REST API client, penyimpanan lokal  │  │
│  └───────────────────────────────────────────────────┘  │
│                     │  HTTP + JSON                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │ SERVER: REST API, basis data, autentikasi          │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Gambar 1.1 Arsitektur client–server aplikasi mobile**

Lapisan **presentasi** bertanggung jawab atas apa yang dilihat dan disentuh pengguna: komponen, tata letak, dan navigasi. Lapisan **bisnis** memuat aturan aplikasi: validasi input (misalnya "NIM harus 7 digit"), perhitungan, dan pengelolaan keadaan (state). Lapisan **data** berkomunikasi dengan server dan membaca/menulis penyimpanan lokal. Pemisahan ini bukan sekadar kerapian: lapisan yang terpisah dapat diuji, dirawat, dan diganti secara independen — misalnya mengganti tampilan tanpa menyentuh logika, atau mengganti server tanpa menulis ulang antarmuka.

Di dalam ekosistem React Native/Expo, ketiga lapisan ini dipetakan sebagai berikut. Lapisan presentasi dibangun dari komponen (Bab 4) dan komponen inti React Native seperti `View`, `Text`, dan `FlatList` (Bab 5), diatur dengan pola navigasi (Bab 7). Lapisan bisnis diwujudkan lewat pengelolaan state lokal dan global (Bab 9), validasi form (Bab 8), serta logika yang diuji (Bab 14). Lapisan data memakai `fetch` untuk memanggil REST API (Bab 10), penyimpanan lokal seperti AsyncStorage (Bab 11), dan penyimpanan token autentikasi yang aman (Bab 13).

Pola ini tidak hanya berlaku untuk React Native — ia bahasa arsitektur yang sama di semua teknologi mobile, sehingga pemahaman Anda tetap berguna meskipun kelak berpindah framework. Dua pertimbangan khas mobile menambah kompleksitasnya: *konektivitas* (server sering tidak terjangkau, sehingga lapisan data butuh penyimpanan lokal dan sinkronisasi — Bab 11) dan *keamanan* (data pribadi yang dikirim lewat jaringan wajib dilindungi autentikasi dan komunikasi terenkripsi — Bab 13). Pada Project Akhir buku ini, Anda akan membangun aplikasi lengkap yang menerapkan arsitektur tiga lapis ini: kerangka yang Anda pahami sekarang akan diisi keterampilan teknis bab demi bab.

### 1.9 Contoh Aplikasi Mobile di Kehidupan Sehari-hari

Tidak ada cara yang lebih baik untuk memaknai teori selain mengamati aplikasi yang setiap hari Anda gunakan. Hampir semua layanan yang sebelumnya hanya ada di web atau kantor fisik kini hadir sebagai aplikasi mobile. Tabel 1.4 menampilkan contoh nyata beserta fitur khas yang memanfaatkan karakteristik mobile.

**Tabel 1.4 Contoh aplikasi mobile nyata dan pemanfaatan karakteristik perangkat**

| Kategori | Contoh | Fitur perangkat yang dimanfaatkan |
|---|---|---|
| Transportasi daring | Ojek daring, taksi daring | GPS, kamera (bukti foto), notifikasi status pesanan |
| Belanja daring | Marketplace, toko daring | Notifikasi promo, pembayaran scan kode QR |
| Perbankan dan pembayaran | Aplikasi bank, dompet digital | Autentikasi sidik jari, kamera (scan QR), notifikasi transaksi |
| Komunikasi | Aplikasi pesan, panggilan video | Mikrofon, kamera, notifikasi real-time |
| Media sosial | Jejaring sosial, berbagi video | Kamera, galeri, GPS (tag lokasi) |
| Edukasi | Platform kursus daring, aplikasi kampus | Notifikasi jadwal, unduhan materi (offline) |
| Kesehatan | Aplikasi pedometer, telekonsultasi | Sensor gerak, GPS, kamera |
| Produktivitas | Aplikasi catatan, kalender | Notifikasi pengingat, sinkronisasi lintas perangkat |

Perhatikan bahwa setiap aplikasi di tabel itu memenangkan pengguna karena memanfaatkan lebih dari sekadar "website yang diperkecil". Aplikasi transportasi daring tahu posisi Anda melalui GPS dan memberi tahu sopir bahwa Anda sudah menunggu — pengalaman yang mustahil ditiru situs web. Dompet digital memindai kode QR dengan kamera sambil mengunci akses dengan sidik jari. Aplikasi pesan membangunkan ponsel Anda untuk menyampaikan kabar penting. Inilah karakteristik mobile pada Subbab 1.1: konteks, sensor, dan notifikasi bekerja bersama.

Ada juga pola menarik yang bisa diamati: banyak aplikasi besar memulai sebagai web, kemudian menambahkan aplikasi mobile, dan akhirnya menjadikan aplikasi mobile sebagai produk utamanya. Sebaliknya, ada pula layanan "mobile-first" yang lahir langsung sebagai aplikasi. Pengamatan semacam ini akan Anda latih secara sistematis pada Praktikum bab ini: mengamati tiga aplikasi yang Anda pakai sehari-hari, memperkirakan jenisnya (native, web, hybrid, cross-platform — Subbab 1.2), mengidentifikasi fitur perangkat yang digunakannya, dan menilai pengalaman penggunanya. Kemampuan "membedah" aplikasi seperti ini adalah bekal analisis yang akan terus Anda pakai ketika merancang aplikasi sendiri di bab-bab berikutnya.

### 1.10 Kompetensi yang Akan Diperoleh

Bab ini adalah gerbang; setelah memahaminya, Anda akan menempuh peta perjalanan lima belas bab yang masing-masing membangun keterampilan baru di atas bab sebelumnya. Memahami peta ini sejak awal membantu Anda melihat setiap praktikum sebagai bagian dari satu tujuan besar, bukan tugas yang terpisah-pisah.

Perjalanan dimulai di Bab 2 dengan persiapan lingkungan pengembangan, lalu Bab 3 memperkuat fondasi JavaScript modern (variabel, fungsi, array, objek, pemrograman asinkron). Bab 4 memperkenalkan React — komponen, props, state, hooks — pola pikir yang sama dengan React Native; Bab 5 mengajarkan komponen inti React Native dan tata letak Flexbox; Bab 6 melatih antarmuka aplikasi yang rapi; Bab 7 menambahkan navigasi antarhalaman memakai Expo Router.

Pada paruh kedua buku, Anda membangun aplikasi yang sungguh-sungguh "hidup": Bab 8 form dan validasi, Bab 9 pengelolaan state, Bab 10 integrasi dengan REST API dan backend, Bab 11 penyimpanan data lokal, Bab 12 akses kamera, lokasi, dan notifikasi, Bab 13 autentikasi dan keamanan, Bab 14 debugging dan pengujian, serta Bab 15 build dan penerbitan aplikasi ke toko aplikasi. Puncaknya adalah Project Akhir: membangun sistem informasi akademik mobile yang menggabungkan seluruh keterampilan tersebut.

Kompetensi yang akan Anda peroleh meliputi: (1) menjelaskan konsep dan arsitektur aplikasi mobile; (2) membangun aplikasi dengan React Native dan Expo; (3) merancang antarmuka yang baik; (4) mengimplementasikan navigasi, state, form, dan validasi; (5) mengintegrasikan aplikasi dengan REST API; (6) menggunakan penyimpanan lokal dan fitur perangkat; (7) menerapkan prinsip keamanan, pengujian, dan debugging; serta (8) membangun dan menerbitkan aplikasi — persis capaian pembelajaran mata kuliah pada pendahuluan buku.

Terakhir, kompetensi yang sering terlupakan tetapi paling menentukan di dunia kerja: kebiasaan profesional — mendokumentasikan pekerjaan, membaca pesan kesalahan dengan teliti, mencari solusi di dokumentasi resmi, dan menulis kode yang bisa dibaca orang lain. Buku ini melatihnya di setiap bab, dan Bab 1 adalah tempat yang tepat untuk memulainya: setiap kali menemui istilah asing, biasakan mencari maknanya; setiap kali aplikasi tidak berjalan, biasakan membaca pesan errornya sebelum bertanya.

## Contoh

Contoh-contoh di bagian ini memperlihatkan bentuk "kode" pertama yang akan Anda temui di buku ini — bukan kode aplikasi, melainkan alat bantu untuk memverifikasi lingkungan pengembangan dan memodelkan hasil pengamatan. Kedua contoh JavaScript memakai Node.js murni dan dapat dijalankan langsung di komputer Anda (cara menginstal Node.js dijelaskan pada Praktikum bab ini).

#### Contoh 1: Memeriksa versi Node.js dan npm dari terminal

Terminal (di Windows: Command Prompt atau PowerShell) adalah jendela tempat Anda berinteraksi dengan alat-alat pengembangan sepanjang buku ini. Langkah pertama yang selalu dilakukan setelah instalasi adalah memeriksa versi perangkat lunak yang terpasang.

`File: (terminal)`
```bash
node --version
npm --version
npx --version
```

**Penjelasan:** Perintah `node --version` menampilkan versi Node.js yang terpasang, sedangkan `npm --version` dan `npx --version` menampilkan versi pengelola paket beserta pelaksananya. Output yang diharapkan berupa baris seperti `v22.14.0` untuk Node.js — angka diawali huruf `v` dan minimal harus 22 (LTS terbaru) sesuai asumsi versi buku ini. Ketiga perintah ini menjadi "cek kesehatan" pertama sebelum Anda membangun project apa pun; jika salah satu tidak dikenal, berarti instalasi belum benar (lihat Troubleshooting pada Praktikum).

#### Contoh 2: Script pemeriksa lingkungan `cek-lingkungan.js`

Menjalankan tiga perintah secara manual mudah dilupakan. Kita dapat menggabungkannya dalam satu script JavaScript kecil yang sekaligus menilai apakah lingkungan siap.

`File: kode/bab-01/cek-lingkungan.js` (cuplikan — bagian penilaian)
```js
const nomorUtamaNode = Number(versiNode ? versiNode.match(/^v(\d+)/)?.[1] : 0);
if (nomorUtamaNode >= 22) {
  console.log('\nHasil: lingkungan siap. Versi Node.js memenuhi syarat (minimal 22).');
} else if (versiNode) {
  console.log('\nHasil: Node.js terpasang, tetapi versinya lebih lama dari 22.');
  console.log('       Instal ulang Node.js LTS terbaru dari situs resminya.');
} else {
  console.log('\nHasil: Node.js belum terpasang. Instal dahulu Node.js LTS.');
}
```

**Penjelasan:** Cuplikan di atas adalah bagian penilaian dari script `cek-lingkungan.js`; bagian awalnya (memeriksa versi Node.js, npm, dan npx) serta versi lengkap yang dapat Anda ketik ulang tercetak pada bagian Kode di Praktikum bab ini. Logika yang ditunjukkan sederhana namun penting: script mengekstrak angka utama versi Node.js dengan ekspresi reguler, membandingkannya dengan ambang 22 — sesuai asumsi versi pada pendahuluan buku — lalu mencetak kesimpulan yang berbeda untuk tiga kemungkinan kondisi. Alur "periksa → bandingkan → simpulkan" ini adalah cermin mini cara kerja aplikasi yang lebih besar: aplikasi mobile juga memeriksa kondisi, membandingkan data, dan memberi tanggapan kepada pengguna. Anda belum perlu menguasai seluruh sintaksis cuplikan ini; pemahaman mendalam tentang variabel, fungsi, dan ekspresi reguler akan dibangun di Bab 3.

#### Contoh 3: Memodelkan hasil pengamatan dengan `profil-aplikasi.js`

Tugas observasi pada Praktikum bab ini akan terasa lebih konkret jika data pengamatan disusun dalam bentuk terstruktur. JavaScript memiliki cara alami untuk memodelkannya: objek dan array.

`File: kode/bab-01/profil-aplikasi.js`
```js
// profil-aplikasi.js
// Menyimpan profil tiga aplikasi yang diamati dan menampilkannya
// dalam bentuk laporan singkat.

const aplikasiYangDiamati = [
  {
    nama: 'Aplikasi Transportasi Daring',
    kategori: 'Transportasi',
    platform: ['Android', 'iOS'],
    perkiraanJenis: 'native',
    fiturPerangkat: ['GPS', 'notifikasi', 'kamera'],
    penilaian: 'Sangat mudah dipakai, tetapi pemakaian data cukup besar.',
  },
  {
    nama: 'Aplikasi Dompet Digital',
    kategori: 'Pembayaran',
    platform: ['Android', 'iOS'],
    perkiraanJenis: 'native',
    fiturPerangkat: ['kamera', 'sidik jari', 'notifikasi'],
    penilaian: 'Cepat untuk transaksi kecil, menu cukup padat.',
  },
  {
    nama: 'Situs Toko Buku (versi mobile)',
    kategori: 'Belanja',
    platform: ['Android', 'iOS', 'web'],
    perkiraanJenis: 'web mobile',
    fiturPerangkat: ['notifikasi (terbatas)', 'penyimpanan (terbatas)'],
    penilaian: 'Mudah dibuka tanpa instalasi, tetapi tidak ada notifikasi promo.',
  },
];

console.log('LAPORAN OBSERVASI APLIKASI MOBILE');
console.log('=================================');

for (const aplikasi of aplikasiYangDiamati) {
  console.log('Nama        :', aplikasi.nama);
  console.log('Kategori    :', aplikasi.kategori);
  console.log('Platform    :', aplikasi.platform.join(', '));
  console.log('Perkiraan   :', aplikasi.perkiraanJenis);
  console.log('Fitur       :', aplikasi.fiturPerangkat.join(', '));
  console.log('Penilaian   :', aplikasi.penilaian);
  console.log('---------------------------------');
}
```

**Penjelasan:** Script ini mendefinisikan satu array bernama `aplikasiYangDiamati` yang berisi tiga objek; setiap objek mewakili satu aplikasi dengan atribut nama, kategori, platform, perkiraan jenis, fitur perangkat, dan penilaian subjektif. Perulangan `for...of` kemudian menelusuri array dan mencetak setiap atribut ke layar melalui `console.log`, dengan `join` digunakan untuk menggabungkan array teks menjadi satu kalimat yang dipisah koma. Perhatikan bahwa isi data di sini hanyalah *contoh* — tugas Anda pada Praktikum adalah mengganti ketiganya dengan aplikasi yang benar-benar Anda gunakan sehari-hari. Struktur objek seperti ini (dengan nama dan atribut deskriptif) adalah pola yang akan Anda pakai terus menerus, dan akan dijelaskan secara sistematis di Bab 3.

## Praktikum

### Tujuan Praktikum

Setelah menyelesaikan praktikum ini, mahasiswa mampu:

1. menginstal Node.js LTS dan memverifikasi pemasangannya bersama npm;
2. memasang Visual Studio Code sebagai editor kode;
3. membuat akun Expo sebagai syarat menggunakan layanan pengembangan;
4. menjalankan script pemeriksaan lingkungan dan membaca hasilnya;
5. mengamati tiga aplikasi mobile yang dipakai sehari-hari dan menyusun laporan observasi berdasarkan template yang disediakan.

### Kebutuhan

- Komputer (Windows 10/11, macOS, atau Linux) dengan hak untuk memasang perangkat lunak;
- Koneksi internet yang stabil (untuk mengunduh penginstal dan mendaftar akun);
- Alamat email yang aktif (untuk pendaftaran akun Expo);
- Smartphone dengan minimal tiga aplikasi mobile yang sering Anda gunakan (sebagai objek observasi);
- Editor teks bawaan (Notepad) sudah cukup untuk latihan ini, tetapi disarankan langsung memasang Visual Studio Code.

### Persiapan

Sebelum memulai, pastikan hal-hal berikut:

1. Tutup aplikasi berat yang tidak perlu agar proses instalasi berjalan lancar;
2. Catat versi sistem operasi Anda (misalnya Windows 11) dan arsitektur prosesor (64-bit) — penginstal Node.js tersedia sesuai sistem;
3. Siapkan akses administrator komputer. Jika menggunakan komputer laboratorium kampus yang terkunci, koordinasikan dengan pengelola lab (lihat Troubleshooting);
4. Pastikan Anda mengunduh **LTS** (Long Term Support — versi dukungan jangka panjang), bukan versi "Current" — LTS adalah pilihan stabil untuk pengembangan dan sesuai asumsi versi buku (Node.js minimal 22);
5. Siapkan buku catatan atau berkas teks untuk mencatat kendala yang ditemui — mencatat masalah adalah bagian dari kebiasaan profesional yang dibangun buku ini.

### Langkah Kerja

Ikuti langkah-langkah berikut secara berurutan. Jika sebuah langkah gagal, jangan lanjut — selesaikan dahulu dengan bantuan bagian Troubleshooting.

1. **Unduh Node.js LTS.** Buka situs resmi Node.js (nodejs.org) melalui peramban dan unduh penginstal LTS yang sesuai sistem operasi Anda. *⚠ version-sensitive: alur situs unduhan dapat berubah; pastikan memilih label "LTS", bukan "Current".*
2. **Instal Node.js.** Jalankan berkas penginstal yang telah diunduh. Gunakan seluruh opsi bawaan (default) — tidak perlu mengubah apa pun. Pada Windows, proses instalasi selesai setelah muncul layar "Completed".
3. **Buka terminal baru.** Tutup terminal yang sudah terbuka sebelumnya, lalu buka terminal baru (Command Prompt/PowerShell di Windows, Terminal di macOS/Linux). Terminal baru diperlukan agar sistem mengenali perintah Node.js yang baru dipasang.
4. **Verifikasi instalasi.** Jalankan `node --version` lalu `npm --version` di terminal. Jika keduanya menampilkan nomor versi, instalasi berhasil. Jika muncul pesan "not recognized" atau "command not found", lihat Troubleshooting nomor 1.
5. **Instal Visual Studio Code (VS Code).** Unduh dari situs resminya dan instal dengan opsi bawaan. VS Code adalah editor kode yang digunakan seluruh buku ini karena ringan, mendukung JavaScript dengan baik, dan memiliki terminal terintegrasi.
6. **Buat akun Expo.** Buka situs resmi Expo (expo.dev), pilih menu pendaftaran (Sign Up), dan daftar menggunakan alamat email Anda (atau akun yang terhubung sesuai pilihan yang tersedia). Akun ini akan dipakai mulai Bab 2 untuk menjalankan project dengan Expo. *⚠ version-sensitive: alur pendaftaran di situs Expo dapat berubah; ikuti instruksi yang tampil di layar.*
7. **Jalankan script pemeriksaan lingkungan.** Buat folder kerja misalnya `latihan-bab1` di komputer Anda. Di dalamnya, buat berkas `cek-lingkungan.js` dengan isi persis seperti pada bagian Kode di Praktikum bab ini (atau salin dari `kode/bab-01/cek-lingkungan.js`). Dari terminal, masuk ke folder tersebut lalu jalankan:

`File: (terminal)`
```bash
node cek-lingkungan.js
```

8. **Buat laporan observasi.** Pilih tiga aplikasi mobile yang benar-benar Anda gunakan dalam seminggu terakhir (misalnya satu aplikasi transportasi, satu aplikasi pembayaran, satu aplikasi media sosial). Gunakan template `kode/bab-01/template-laporan-observasi.md` sebagai kerangka, lalu isi setiap bagian berdasarkan pengamatan jujur Anda. Untuk membantu analisis, jalankan juga `profil-aplikasi.js` (Contoh 3) dan ganti isi datanya dengan tiga aplikasi pilihan Anda. Sertakan hasil keluaran script tersebut di dalam laporan.

### Kode

Berkas kode utama praktikum ini adalah script pemeriksa lingkungan (identik dengan Contoh 2 — script inilah yang Anda ketik ulang pada langkah 7).

`File: kode/bab-01/cek-lingkungan.js`
```js
// cek-lingkungan.js
// Memeriksa versi Node.js, npm, dan npx yang terpasang di komputer.

const { execSync } = require('node:child_process');

function ambilVersi(namaPerintah) {
  try {
    return execSync(namaPerintah + ' --version', { encoding: 'utf8' }).trim();
  } catch (error) {
    return null;
  }
}

const versiNode = ambilVersi('node');
const versiNpm = ambilVersi('npm');
const versiNpx = ambilVersi('npx');

console.log('LAPORAN LINGKUNGAN PENGEMBANGAN');
console.log('===============================');
console.log('Node.js :', versiNode ?? 'TIDAK TERPASANG');
console.log('npm     :', versiNpm ?? 'TIDAK TERPASANG');
console.log('npx     :', versiNpx ?? 'TIDAK TERPASANG');

const nomorUtamaNode = Number(versiNode ? versiNode.match(/^v(\d+)/)?.[1] : 0);
if (nomorUtamaNode >= 22) {
  console.log('\nHasil: lingkungan siap. Versi Node.js memenuhi syarat (minimal 22).');
} else if (versiNode) {
  console.log('\nHasil: Node.js terpasang, tetapi versinya lebih lama dari 22.');
  console.log('       Instal ulang Node.js LTS terbaru dari situs resminya.');
} else {
  console.log('\nHasil: Node.js belum terpasang. Instal dahulu Node.js LTS.');
}
```

### Penjelasan Kode

Script di atas adalah program Node.js paling sederhana yang berguna sungguhan. Di bagian paling atas, `require('node:child_process')` mengimpor modul bawaan Node.js yang mampu menjalankan perintah sistem; `const { execSync } = ...` mengambil satu fungsi dari modul itu — "Sync" berarti pemanggilan berjalan sinkron (menunggu perintah selesai sebelum melanjutkan). Fungsi `ambilVersi` dibungkus `try/catch` sehingga kegagalan (perintah tidak dikenal) tidak menghentikan program, melainkan mengembalikan `null`; inilah pola penanganan kesalahan yang akan dipelajari lebih dalam di Bab 3.

Selanjutnya tiga konstanta menampung hasil pemeriksaan, dan `console.log` mencetaknya ke layar dengan label rapi. Operator `??` memastikan nilai `null` ditampilkan sebagai "TIDAK TERPASANG" — cara ringkas menulis nilai cadangan. Terakhir, bagian penilaian: `versiNode.match(/^v(\d+)/)` menangkap angka utama versi (misalnya 22 dari `v22.14.0`), lalu membandingkannya dengan ambang 22 yang menjadi syarat buku ini. Tiga cabang `if/else` mencetak kesimpulan sesuai kondisi. Logika "periksa → bandingkan → simpulkan" ini adalah cermin mini cara kerja aplikasi yang lebih besar: aplikasi mobile juga memeriksa kondisi, membandingkan data, dan memberi tanggapan — bedanya, di aplikasi sungguhan yang "memeriksa" adalah komponen antarmuka yang akan Anda pelajari di Bab 5.

### Hasil yang Diharapkan

1. **Terminal:** setelah langkah 4, perintah `node --version` menampilkan nomor versi LTS (diawali huruf `v`, misalnya `v22.x.x` atau lebih baru) dan `npm --version` menampilkan nomor versi npm — bukan pesan kesalahan.
2. **Keluaran script:** setelah langkah 7, terminal menampilkan laporan seperti berikut (angka versi di komputer Anda dapat berbeda):

`File: (contoh keluaran terminal)`
```text
LAPORAN LINGKUNGAN PENGEMBANGAN
===============================
Node.js : v22.14.0
npm     : 10.9.2
npx     : 10.9.2

Hasil: lingkungan siap. Versi Node.js memenuhi syarat (minimal 22).
```

3. **Akun Expo:** pendaftaran berhasil ditandai dengan email konfirmasi dan Anda dapat masuk (login) ke situs Expo.
4. **Laporan observasi:** satu berkas laporan berisi tiga aplikasi yang diamati lengkap dengan kategori, perkiraan jenis aplikasi, fitur perangkat, penilaian, beserta kesimpulan, dikumpulkan sesuai ketentuan dosen (misalnya dalam format Markdown atau PDF). Sertakan tangkapan layar (screenshot) keluaran `cek-lingkungan.js` dan `profil-aplikasi.js` sebagai bukti pengerjaan.

### Troubleshooting

**Masalah:** Setelah instalasi selesai, perintah `node --version` di terminal menampilkan "node is not recognized as an internal or external command" (Windows) atau "command not found" (macOS/Linux).
**Penyebab:** Folder tempat Node.js terpasang belum tercatat pada variabel lingkungan PATH, atau terminal masih memakai sesi lama yang dibuka sebelum instalasi sehingga belum mengenali perintah baru.
**Solusi:** Tutup semua terminal yang terbuka, lalu buka terminal baru dan coba lagi. Jika tetap gagal, jalankan ulang penginstal Node.js dan biarkan seluruh opsi bawaan aktif (penginstal resmi mengatur PATH secara otomatis); pastikan Anda tidak mencentang opsi yang menghapus penambahan PATH. Pada Windows, periksa juga di Pengaturan Sistem → variabel lingkungan bahwa folder pemasangan Node.js (umumnya `C:\Program Files\nodejs`) ada pada daftar PATH.
**Pencegahan:** Selalu pasang Node.js dari penginstal resmi dengan opsi bawaan dan jangan memindahkan folder instalasinya setelah terpasang.

**Masalah:** `node --version` menampilkan versi lama (misalnya v16), padahal baru saja menginstal versi LTS terbaru.
**Penyebab:** Di komputer tersebut masih ada instalasi Node.js lama yang posisinya didahulukan dalam PATH, sehingga terminal memanggil versi lama; atau penginstal yang dipakai ternyata versi "Current", bukan LTS.
**Solusi:** Hapus semua instalasi Node.js lama melalui Pengelola Aplikasi (Windows) atau alat manajemen paket (macOS/Linux), lalu instal ulang satu versi LTS terbaru dari situs resmi. Verifikasi dengan `node --version` sampai menampilkan versi yang benar. Jika sering berganti versi Node, pertimbangkan pengelola versi Node (misalnya nvm) — tetapi untuk buku ini satu instalasi LTS saja sudah cukup.
**Pencegahan:** Pertahankan satu instalasi Node.js saja pada satu komputer; tandai versi yang terpasang dengan mencatat hasil `node --version` di dokumen pribadi.

**Masalah:** Proses instalasi Node.js berhenti di tengah jalan atau gagal dengan kode kesalahan tak dikenal.
**Penyebab:** Perangkat lunak keamanan (antivirus/firewall) memblokir penginstal, atau berkas penginstal rusak karena unduhan terputus di tengah jalan.
**Solusi:** Unduh ulang berkas penginstal dari situs resmi dan pastikan ukuran berkasnya sesuai dengan yang ditampilkan situs. Nonaktifkan sementara antivirus (atau izinkan penginstal untuk berjalan) lalu jalankan penginstal sebagai administrator. Setelah selesai, aktifkan kembali antivirus Anda.
**Pencegahan:** Gunakan koneksi internet yang stabil saat mengunduh; jangan memakai penginstal yang diunduh dari situs lain.

**Masalah:** `npm --version` berjalan sangat lambat atau gagal dengan pesan berkaitan jaringan (misalnya ETIMEDOUT atau ENOTFOUND).
**Penyebab:** Koneksi internet tidak stabil, jaringan kampus/kantor memblokir akses ke registry npm, atau komputer diatur memakai server proxy yang belum dikonfigurasi untuk npm.
**Solusi:** Periksa koneksi internet dengan membuka situs biasa di peramban. Jika berada di jaringan ber-proxy, hubungi administrator jaringan untuk konfigurasi proxy yang benar pada npm. Sebagai uji cepat, jalankan ulang perintah beberapa saat kemudian atau pindah ke jaringan lain (misalnya jaringan seluler) untuk memastikan masalahnya memang jaringan.
**Pencegahan:** Pastikan jaringan yang dipakai mengizinkan akses ke registry npm resmi; jika praktikum sering di jaringan kampus, sampaikan kebutuhan ini kepada pengelola jaringan sebelum pertemuan.

**Masalah:** Instalasi Node.js ditolak atau meminta hak administrator yang tidak dimiliki di komputer laboratorium kampus.
**Penyebab:** Kebijakan keamanan laboratorium membatasi pemasangan perangkat lunak oleh pengguna biasa.
**Solusi:** Mintalah bantuan pengelola laboratorium untuk memasang Node.js LTS, atau gunakan versi arsip (zip/portable) Node.js yang tidak memerlukan proses instalasi — cukup diekstrak ke folder pengguna dan folder tersebut ditambahkan ke PATH. Koordinasikan pilihan ini dengan dosen pengampu.
**Pencegahan:** Sebelum jadwal praktikum, informasikan kebutuhan perangkat lunak (Node.js LTS, Visual Studio Code) kepada pengelola lab dan dosen agar instalasi disiapkan lebih awal.

## Studi Kasus

**Kebutuhan Aplikasi Mobile di Institusi Pendidikan** — Kasus berikut fiktif, tetapi polanya sangat nyata: hampir setiap kampus di Indonesia pernah mengalaminya.

Universitas Wijaya Nusantara memiliki sekitar delapan ribu mahasiswa aktif. Layanan akademik masih berjalan dengan pola lama: jadwal kuliah ditempel di papan pengumuman tiap fakultas, perubahan ruang diumumkan lewat grup percakapan tak resmi, nilai ujian hanya bisa dilihat di komputer Biro Akademik pada jam kantor, dan pengisian KRS selalu disertai antrean panjang. Hasilnya bisa ditebak: mahasiswa ketinggalan informasi, biro kewalahan melayani pertanyaan yang sama berulang-ulang, dan dokumen menumpuk. Pihak universitas menyadari bahwa masalahnya bukan pada data — data akademik sudah tersimpan rapi di sistem lama — melainkan pada *saluran penyampaian* kepada pengguna yang setiap hari membawa smartphone di saku.

Analisis kebutuhan dimulai dari pengguna. Ada tiga kelompok: mahasiswa (butuh jadwal, nilai, KRS, pengumuman, notifikasi perubahan jadwal), dosen (butuh jadwal mengajar dan daftar peserta), serta staf akademik (butuh mengurangi beban layanan berulang). Kebutuhan fungsional dirumuskan sederhana: melihat jadwal, melihat nilai, mengisi KRS, menerima pengumuman. Kebutuhan non-fungsionalnya lebih menantang: aplikasi harus cepat diakses saat jaringan kampus padat, melindungi data pribadi (nilai tidak boleh dilihat mahasiswa lain), dan hemat kuota karena sebagian mahasiswa mengandalkan paket data terbatas.

Sampai di sini, keputusan arsitektur menjadi pusat perhatian — dan di sinilah materi bab ini dipakai. Apakah cukup situs web mobile? Website memang hemat biaya, tetapi gagal pada dua kebutuhan: notifikasi proaktif (perubahan jadwal harus *menemukan* mahasiswa, bukan menunggu dibuka) dan kehadiran permanen di layar utama perangkat. Apakah aplikasi native dua platform? Kualitasnya terbaik, tetapi tim universitas hanya kecil (staf TIK dan praktikan) — memelihara dua codebase Kotlin dan Swift melampaui kapasitasnya. Jawaban yang masuk akal adalah cross-platform dengan React Native dan Expo (Subbab 1.2, 1.5, 1.6): satu basis kode JavaScript untuk Android dan iOS, notifikasi lewat Expo SDK, dan kurva belajar yang memungkinkan praktikan mahasiswa ikut mengembangkan — persis jalur yang Anda tempuh di buku ini.

Arsitekturnya mengikuti pola Subbab 1.8: aplikasi di perangkat menjadi klien tiga lapisan (presentasi, bisnis, data), sementara server menyediakan REST API untuk data akademik — pola yang sama dengan *backend* buku ini, yang akan Anda integrasikan di Bab 10. Data nilai dan data pribadi dilindungi autentikasi berbasis token (Bab 13), jadwal yang diunduh disimpan lokal agar tetap terbaca saat jaringan bermasalah (Bab 11), dan notifikasi perubahan jadwal memanfaatkan fitur perangkat (Bab 12). Solusi kasus ini bukan satu teknologi, melainkan kombinasi berlapis yang masing-masing dipilih berdasarkan trade-off — dan Anda akan membangun aplikasi dengan pola persis seperti ini sebagai Project Akhir buku ini.

Diskusi kelas yang bermanfaat: teknologi tidak menyelesaikan semua masalah. Antrean KRS berkurang, tetapi tetap ada jika proses bisnisnya sendiri berbelit; data yang tidak terpelihara tetap salah walau tampil di aplikasi secantik apa pun. Analisis sistem yang matang memisahkan "masalah yang bisa diselesaikan teknologi" dari "masalah yang harus diselesaikan proses" — kompetensi yang membedakan analis sistem dari sekadar penulis kode.

## Latihan

### Soal Pemahaman

1. Sebutkan dan jelaskan minimal empat karakteristik aplikasi mobile yang membedakannya dari aplikasi web atau desktop. Untuk setiap karakteristik, berikan satu contoh konsekuensi desainnya.
2. Jelaskan perbedaan mendasar antara aplikasi native, web mobile, hybrid, dan cross-platform. Berikan satu contoh nyata (boleh perkiraan) untuk masing-masing jenis.
3. Mengapa muncul pendekatan cross-platform seperti React Native? Kaitkan jawaban Anda dengan biaya pengembangan dan pemeliharaan codebase.
4. Bedakan peran Expo SDK, Expo Go, dan EAS dalam ekosistem pengembangan dengan React Native.
5. Gambarkan arsitektur client–server aplikasi mobile beserta tiga lapisan logis di sisi klien, dan sebutkan satu tanggung jawab setiap lapisan.
6. Sebutkan tiga keterbatasan React Native dan kondisi penggunaan yang membuat Anda sebaiknya memilih pengembangan native.

### Soal Praktik

1. Instal Node.js LTS di komputer Anda, jalankan `cek-lingkungan.js`, lalu tempel keluaran lengkap script tersebut beserta tangkapan layar terminal pada laporan Anda. Tuliskan satu paragraf yang menjelaskan arti setiap baris keluaran.
2. Buat versi pribadi `profil-aplikasi.js` berisi tiga aplikasi yang benar-benar Anda gunakan sehari-hari (bukan contoh dari buku). Jalankan script tersebut, lalu tempel keluarannya pada laporan.
3. Pilih satu aplikasi yang paling sering Anda gunakan. Selama satu hari, catat setiap momen ketika aplikasi memanfaatkan salah satu karakteristik mobile (Subbab 1.1): lokasi, kamera, notifikasi, sesi pendek yang terputus, atau mode offline. Susun temuan Anda menjadi satu paragraf analisis.

### Soal Analisis

1. Kampus Anda berencana membangun aplikasi mobile untuk melihat jadwal dan nilai. Tim yang tersedia hanya dua orang mahasiswa praktikan dengan kemampuan JavaScript dasar, anggaran terbatas, dan target pengguna mencakup perangkat Android kelas menengah ke bawah serta iPhone. Berikan rekomendasi jenis aplikasi (native, web mobile, hybrid, atau cross-platform) beserta argumen berdasarkan minimal empat kriteria, dan jelaskan trade-off yang Anda terima dari pilihan tersebut.

## Tantangan

1. **Matriks perbandingan lima aplikasi sejenis.** Pilih satu kategori aplikasi (misalnya transportasi daring, belanja daring, atau dompet digital). Amati lima aplikasi dalam kategori tersebut, lalu susun tabel perbandingan berisi: platform, perkiraan jenis aplikasi (native/web/hybrid), fitur perangkat yang digunakan, kelebihan, dan kelemahan. Tutup dengan satu paragraf kesimpulan tentang pola yang Anda temukan.
2. **One-pager proposal aplikasi kampus.** Susun proposal satu halaman untuk aplikasi mobile pemecah satu masalah nyata di lingkungan kampus Anda (boleh di luar contoh studi kasus). Cantumkan: pengguna sasaran, tiga fitur utama, jenis aplikasi pilihan beserta alasannya, dan sketsa arsitektur client–server. Presentasikan di kelas dan mintalah tanggapan teman.
3. **Bekal menuju Bab 3.** Tulis script Node.js baru bernama `aplikasi-favorit.js` yang menyimpan tiga aplikasi favorit Anda dalam bentuk array berisi objek (nama, kategori, alasan memilih), lalu menampilkannya ke layar. Bandingkan script Anda dengan `profil-aplikasi.js` pada buku — perbedaan itulah yang akan Anda pelajari lebih dalam pada Bab 3 (variabel, array, objek, dan perulangan).

## Rangkuman

1. Aplikasi mobile adalah perangkat lunak yang dirancang untuk perangkat bergerak dan memiliki tujuh karakteristik khas: mobilitas, antarmuka sentuh, akses sensor, konektivitas berubah-ubah, distribusi via toko aplikasi, sumber daya terbatas, dan siklus hidup yang diatur sistem.
2. Ada empat pendekatan pengembangan: native (paling mahal, performa terbaik), web mobile (paling murah, fitur terbatas), hybrid (satu codebase web dalam WebView, pengalaman paling lemah), dan cross-platform modern seperti React Native (satu codebase dengan antarmuka native).
3. Android bersifat terbuka dengan pasar luas namun terfragmentasi; iOS tertutup dan konsisten namun membutuhkan ekosistem Apple; perbedaan ini mendorong lahirnya pendekatan satu-codebase.
4. Evolusi mobile mengikuti pola ponsel fitur → smartphone dan toko aplikasi → web seluler → cross-platform; setiap generasi menjawab keterbatasan generasi sebelumnya.
5. React Native memetakan kode JavaScript menjadi komponen antarmuka native per platform melalui lapisan komunikasi JavaScript–native, sehingga tampilannya bukan WebView.
6. Expo melengkapi React Native dengan SDK terpadu, Expo Go untuk menjalankan project tanpa build native, dan EAS untuk build serta distribusi.
7. Keunggulan React Native (satu codebase, ekosistem, hot reload) harus diimbangi kesadaran keterbatasannya (performa ekstrem, ukuran aplikasi, kesenjangan adopsi fitur) — keputusan teknologi adalah analisis trade-off, bukan tren.
8. Arsitektur aplikasi mobile umumnya client–server dengan tiga lapisan logis di sisi klien: presentasi, bisnis, dan data.
9. Aplikasi sehari-hari memenangkan pengguna justru karena memanfaatkan karakteristik mobile: GPS, kamera, notifikasi, dan konteks pengguna.
10. Buku ini memetakan perjalanan dari konsep (Bab 1) menuju keterampilan teknis bertahap hingga Project Akhir; kebiasaan profesional (membaca dokumentasi, mencatat kendala, membaca pesan error) adalah kompetensi yang menyertainya.

## Refleksi

1. Aplikasi mobile apa yang paling sering Anda gunakan dalam seminggu terakhir, dan fitur apa yang membuat Anda terus kembali menggunakannya? Kaitkan dengan karakteristik mobile pada Subbab 1.1.
2. Sebelum membaca bab ini, bagaimana bayangan Anda tentang cara aplikasi mobile dibuat? Apa yang berubah dari bayangan itu sekarang?
3. Dari keempat pendekatan pengembangan (native, web, hybrid, cross-platform), pendekatan mana yang paling mengejutkan Anda dan mengapa?
4. Jika kelak Anda menjadi analis sistem di sebuah instansi, pertimbangan apa yang akan Anda gunakan untuk memutuskan "cukup website" versus "perlu aplikasi mobile"?

## Evaluasi Bab

### Pilihan Ganda

Pilihlah satu jawaban yang paling tepat.

1. Karakteristik yang paling membedakan aplikasi mobile dari aplikasi web/desktop adalah ...
   A. ukuran berkasnya kecil
   B. memanfaatkan sensor, konteks, dan notifikasi perangkat
   C. tidak membutuhkan koneksi internet
   D. otomatis terpasang di semua perangkat

2. Aplikasi yang antarmukanya ditulis dengan teknologi web lalu dibungkus dalam kontainer native lewat WebView disebut ...
   A. aplikasi native
   B. aplikasi web mobile
   C. aplikasi hybrid
   D. progresif web app

3. Alasan utama lahirnya pendekatan cross-platform adalah ...
   A. performa native yang tidak memadai
   B. biaya pengembangan dan pemeliharaan dua codebase native
   C. larangan toko aplikasi bagi aplikasi native
   D. keterbatasan bahasa pemrograman web

4. Di dalam aplikasi React Native, komponen `View` yang kita tulis akan digambar sebagai ...
   A. elemen HTML di dalam WebView
   B. gambar statis yang tidak bisa disentuh
   C. komponen UI native milik platform (misalnya ViewGroup di Android)
   D. kode Kotlin yang dikompilasi ulang

5. Peran Expo Go dalam pengembangan adalah ...
   A. membangun berkas APK untuk toko aplikasi
   B. menjalankan project Expo langsung di perangkat tanpa build native
   C. menggantikan peran Node.js
   D. menyimpan data aplikasi di cloud

6. Yang BUKAN termasuk keunggulan React Native adalah ...
   A. satu basis kode untuk Android dan iOS
   B. hot reload mempercepat iterasi
   C. performa selalu lebih tinggi daripada aplikasi native
   D. ekosistem npm yang luas

7. Dalam arsitektur client–server, REST API berada di sisi ...
   A. klien
   B. server
   C. perangkat
   D. jaringan

8. Perintah untuk memeriksa versi Node.js yang terpasang adalah ...
   A. `node check`
   B. `node --version`
   C. `npm start`
   D. `version node`

9. Lapisan pada sisi klien yang bertanggung jawab menampilkan antarmuka pengguna adalah lapisan ...
   A. presentasi
   B. bisnis
   C. data
   D. autentikasi

10. Karakteristik yang membuat aplikasi mobile "tidak boleh lupa posisi pengguna" meskipun ditutup sistem adalah ...
    A. antarmuka sentuh
    B. siklus hidup yang diatur sistem operasi
    C. distribusi melalui toko aplikasi
    D. fragmentasi perangkat

### Soal Uraian

1. Bandingkan aplikasi native, web mobile, dan hybrid dari tiga sudut: pengalaman pengguna, akses fitur perangkat, dan biaya pemeliharaan. Nyatakan jawaban dalam bentuk tabel atau paragraf perbandingan, lalu simpulkan kapan masing-masing paling cocok dipakai.
2. Jelaskan alur kerja React Native dari kode JavaScript yang Anda tulis hingga tampilan yang muncul di layar perangkat, termasuk peran komponen native, lapisan komunikasi JavaScript–native, dan Hermes.
3. Sebuah koperasi unit desa ingin membangun aplikasi mobile untuk katalog produk dan notifikasi promo kepada anggotanya, dengan dana terbatas dan tanpa tim pengembang profesional (akan dikerjakan vendor). Berikan rekomendasi pendekatan pengembangan beserta argumen trade-off, dan jelaskan risiko yang harus dikelola.

### Kunci Jawaban

<details>
<summary>Kunci Jawaban Pilihan Ganda (klik untuk membuka)</summary>

1. **B** — Sensor, konteks, dan notifikasi adalah pembeda utama aplikasi mobile; ukuran berkas, kebutuhan internet, dan pemasangan bukan pembeda esensial.
2. **C** — Definisi hybrid adalah teknologi web di dalam kontainer native via WebView.
3. **B** — Dua codebase native menggandakan biaya; cross-platform menjawab masalah ini.
4. **C** — React Native memetakan komponen ke elemen UI native per platform, bukan WebView.
5. **B** — Expo Go menjalankan project tanpa build native; EAS yang menangani build (opsi A salah).
6. **C** — Performa React Native mendekati native tetapi tidak selalu lebih tinggi.
7. **B** — REST API disediakan server; klien memanggilnya lewat HTTP.
8. **B** — `node --version` adalah perintah pemeriksaan versi Node.js.
9. **A** — Lapisan presentasi menangani antarmuka; bisnis mengelola aturan; data menangani komunikasi server dan penyimpanan.
10. **B** — Sistem dapat menutup aplikasi kapan saja; menyimpan keadaan adalah konsekuensi siklus hidup yang diatur sistem.

</details>