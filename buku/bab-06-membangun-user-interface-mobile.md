# BAB 6 — Membangun User Interface Mobile

## Deskripsi Singkat

Bab ini mengajarkan prinsip dan praktik membangun **user interface** (antarmuka pengguna) aplikasi mobile: prinsip desain (konsistensi, hierarki visual, umpan balik, thumb-friendly), fondasi visual (sistem jarak 8pt, tipografi, warna), hingga komponen praktis (Card, Button, Form, List, Header). Materi diuji melalui studi kasus Aplikasi Manajemen Data Mahasiswa: Anda merancang wireframe (kerangka layar) halaman Daftar dan Detail, lalu mengimplementasikannya sebagai layar statis dengan data baku. Bab ini bertumpu pada komponen dan layout dari Bab 5, dan menjadi fondasi yang dihidupkan oleh navigasi pada Bab 7, form pada Bab 8, serta data dari API pada Bab 10.

## Tujuan Pembelajaran

Setelah mempelajari bab ini, mahasiswa mampu:

1. Menjelaskan empat prinsip desain UI mobile beserta alasannya (konsistensi, hierarki visual, umpan balik, thumb-friendly).
2. Mengidentifikasi peran sistem jarak 8pt, skala tipografi, dan palet warna dalam membangun antarmuka yang konsisten.
3. Mengimplementasikan komponen Card, Button (variasi primary, secondary, outline, danger), tampilan Form, dan List dengan pola yang konsisten.
4. Merancang wireframe tekstual halaman Daftar dan Detail Mahasiswa sebelum menulis kode.
5. Mengimplementasikan layar statis Aplikasi Manajemen Data Mahasiswa dengan data baku lima mahasiswa tanpa navigasi dan tanpa pengambilan data (fetch).
6. Menerapkan atribut aksesibilitas dasar (accessibilityRole, accessibilityLabel, target sentuh minimum) pada komponen yang dibangun.
7. Menganalisis keputusan desain UI pada studi kasus dunia Sistem Informasi dan menghubungkannya dengan prinsip yang dipelajari.

## Peta Konsep

```text
┌─────────────────────────────────────────────────────────┐
│        BAB 6 — MEMBANGUN USER INTERFACE MOBILE          │
├─────────────────────────────────────────────────────────┤
│ Prinsip (6.1)   konsistensi · hierarki · umpan balik ·  │
│                 thumb-friendly                          │
│ Fondasi visual  layout 8pt (6.2) · tipografi (6.4) ·    │
│                 warna (6.4)                             │
│ Komponen (6.2)  Card · Button · Form (tampilan) · List  │
│ Struktur (6.3)  Header · Bottom Navigation (konsep)     │
│ Adaptasi (6.5)  responsive design                       │
│ Inklusi (6.6)   aksesibilitas dasar                     │
│ Penerapan (6.7) studi kasus → wireframe → layar statis  │
└─────────────────────────────────────────────────────────┘
```

## Materi

### 6.1 Prinsip Desain UI Mobile

Sebelum menulis satu baris kode, perancang UI profesional menjawab satu pertanyaan: mengapa sebuah aplikasi terasa mudah atau sulit dipakai? Jawabannya jarang terletak pada teknologi, melainkan pada seperangkat prinsip desain yang mengatur cara elemen disusun, diwarnai, dan merespons sentuhan. Prinsip ini lahir bukan dari selera, melainkan dari pengamatan bertahun-tahun terhadap cara manusia membaca, memegang, dan bereaksi terhadap layar sentuh. Memahaminya berarti Anda membangun antarmuka dengan alasan, bukan dengan coba-coba — kemampuan yang membedakan pengembang aplikasi dari perakit layar.

Ada empat prinsip yang menjadi landasan bab ini.

**Pertama, konsistensi.** Elemen yang serupa harus tampil dan berperilaku serupa: tombol menyimpan data selalu berwarna sama, jarak antar kartu selalu sama, istilah pada label selalu sama. Konsistensi menurunkan **biaya kognitif** (effort berpikir) pengguna: setelah belajar satu layar, pengguna dapat menebak layar lain tanpa perlu belajar ulang. Di dunia Sistem Informasi (SI), tempat aplikasi dipakai staf dengan jenjang literasi digital beragam, konsistensi bukan sekadar estetika — ia mengurangi kesalahan input dan mempercepat pelatihan pengguna baru. *Trade-off*-nya (pertukarannya): konsistensi yang kaku bisa menghambat solusi khusus konteks. Satu layar yang memang berbeda sifatnya (misalnya dashboard vs formulir) wajar menyimpang sedikit, selama aturan dasarnya (warna, font, jarak) tetap sama. Prinsip ini berwujud nyata melalui pembuatan **design token** (konstanta desain) — satu tempat menyimpan warna dan ukuran yang dipakai ulang — yang akan Anda lihat pada Contoh dan Praktikum bab ini.

**Kedua, hierarki visual** (urutan penting tidaknya tampilan). Mata manusia memindai layar, bukan membaca baris demi baris. Dengan mengatur ukuran, ketebalan huruf, warna, dan posisi, Anda memberi tahu pengguna mana yang harus dilihat lebih dulu. Judul layar paling menonjol, lalu konten utama, lalu keterangan tambahan yang paling redup. Hierarki yang baik membuat layar "dapat dipindai" dalam hitungan detik. *Trade-off*-nya: hierarki yang terlalu agresif (semua teks besar dan tebal) membuat layar berteriak sekaligus dan justru membingungkan; hierarki yang terlalu datar membuat pengguna tidak tahu harus mulai dari mana.

**Ketiga, umpan balik** (feedback). Setiap tindakan pengguna harus mendapat respons: tombol ditekan menjadi lebih redup, kartu yang ditekan memberi efek visual, layar yang sedang memuat menampilkan indikator. Umpan balik menjawab kecemasan dasar pengguna: "apakah sentuhan saya diterima?" Tanpa umpan balik, pengguna menekan tombol berulang kali, mengira aplikasi rusak. Prinsip ini lahir dari kenyataan bahwa layar sentuh tidak memberi sensasi fisik seperti tombol keyboard mekanik; umpan balik visual menggantikan sensasi itu. *Trade-off*-nya: umpan balik butuh biaya implementasi, sehingga perancang memilihnya secara bertingkat — yang wajib adalah respons visual pada sentuhan (mudah dilakukan dengan Pressable), sementara getaran dan animasi boleh dipertimbangkan belakangan.

**Keempat, thumb-friendly** (ramah ibu jari). Sebagian besar interaksi ponsel dilakukan dengan satu ibu jari, dan jangkauan ibu jari terbatas: bagian bawah dan tengah layar mudah dijangkau, sudut atas sulit. Karena itu, aksi penting (tombol simpan, navigasi bawah) ditempatkan di zona mudah dijangkau, sedangkan area atas layar diperuntukkan bagi judul dan umpan balik status. *Trade-off*-nya: penempatan demi jangkauan kadang berbenturan dengan kebiasaan (misalnya tombol kembali tradisional di kiri atas), sehingga perancang mengorbankan sebagian kepadatan layout demi kenyamanan. Perhatikan bagaimana ponsel modern menaruh tombol aksi utama di bawah — itu bukan kebetulan.

Keempat prinsip ini tidak berdiri sendiri. Hierarki visual tanpa konsistensi membuat tiap layar mengiklankan caranya sendiri; umpan balik tanpa hierarki membuat respons yang sama untuk tindakan berbeda. Pada subbab berikutnya, prinsip-prinsip ini Anda wujudkan dalam fondasi visual: jarak, komponen, tipografi, dan warna. Ingatlah selalu: Bab 5 telah membekali Anda dengan bahan mentahnya (View, Text, StyleSheet, Flexbox, FlatList); bab ini mengajarkan cara menyusun bahan itu menjadi antarmuka yang beralasan.

### 6.2 Layout dan Komponen UI: Card, Button, Form, List

#### Sistem jarak 8pt (8-point grid)

Desain antarmuka yang terlihat "rapi dengan sendirinya" biasanya memakai satu rahasia sederhana: semua jarak adalah kelipatan 8. Sistem ini, yang populer sebagai **8-point grid** (kisi berjarak 8pt), menetapkan nilai jarak dari himpunan {4, 8, 12, 16, 24, 32, 48, 64}. Mengapa 8, bukan 5 atau 7? Karena 8 habis dibagi 2 (sehingga 4, 8, 16, 32 selalu selaras), cukup kecil untuk detail, dan cukup besar untuk menciptakan ritme visual yang stabil. Layar diisi elemen yang jaraknya selaras di seluruh halaman, sehingga tidak ada area yang terasa "macet" atau "longgar tak menentu".

Sistem ini ada untuk menjawab *trade-off* klasik perancang: presisi pixel demi pixel memakan waktu dan menghasilkan layout yang tidak konsisten antar layar. Dengan grid, keputusan jarak menjadi cepat dan dapat diprediksi — tim tidak perlu berdebat "16 atau 17 pixel?". Dalam kode, aturan praktisnya: jarak antar elemen dalam satu grup dipakai 8, jarak antar grup 16, jarak tepi layar 16–24, jarak dalam kartu (padding) 16, sudut membulat (radius) 8–12. Anda akan melihat nilai-nilai ini berulang di seluruh kode bab ini — itulah konsistensi yang sedang bekerja.

#### Card (kartu)

**Card** (kartu) adalah wadah berbentuk persegi dengan sudut membulat yang mengelompokkan informasi menjadi satu kesatuan. Ia lahir dari pola katalog media sosial: satu kartu = satu ide = satu entitas. Pada Aplikasi Manajemen Data Mahasiswa, satu kartu mewakili satu mahasiswa, sehingga kartu berisi nama, program studi, NIM, dan IPK. Mengapa memakai kartu dan bukan sekadar baris teks? Karena kartu memberi batas visual yang jelas, memudahkan mata memisahkan entitas yang satu dari yang lain saat daftar digulir, dan memberi area sentuh yang tegas. *Trade-off*-nya: kartu memakan ruang vertikal lebih banyak daripada baris padat; untuk data yang banyak dan seragam (misalnya tabel nilai), baris lebih efisien. Keputusan kartu vs baris adalah keputusan desain yang harus disadari, bukan kebiasaan.

Anatomi kartu yang baik: latar putih dengan sedikit kontras terhadap latar layar, sudut membulat 8–12, jarak dalam (padding) 16, dan pemisahan antar kartu 8. Kartu yang dapat ditekan memberi umpan balik saat ditekan (lihat 6.1). Satu kartu membawa satu pesan — hindari menumpuk dua entitas dalam satu kartu.

#### Button (tombol)

**Button** (tombol) adalah elemen aksi: pengguna menekannya untuk memicu sesuatu. Pertanyaan desainnya bukan "seperti apa bentuknya?", melainkan "seberapa penting aksinya?". Jawabannya dikomunikasikan lewat variasi visual. Empat variasi standar yang dipakai buku ini:

| Variasi | Penampilan | Kegunaan | Contoh label |
|---|---|---|---|
| primary | Latar warna utama, teks putih | Aksi utama satu-satunya dalam satu layar | Simpan, Kirim |
| secondary | Latar abu lembut | Aksi pendukung yang tetap penting | Tambah, Edit |
| outline | Transparan, garis tepi warna utama | Aksi alternatif, mengurangi daya tarik mata | Kembali, Batal |
| danger | Latar merah | Aksi berisiko/merusak | Hapus |

Mengapa variasi ini ada? Karena pengguna membaca makna dari warna sebelum membaca teks. Tombol merah yang tidak pernah dipakai untuk menghapus akan kehilangan makna — dan sebaliknya, tombol menyimpan data yang diwarnai merah akan membuat pengguna ragu menekannya. Aturannya: satu primary per layar (jika semua tombol menonjol, tidak ada yang menonjol), danger hanya untuk aksi destruktif, dan label tombol berupa kata kerja yang jelas (Simpan, bukan "OK"). Teks tombol ditulis konsisten: singkat, tanpa tanda baca, kapitalisasi sesuai aturan pada 6.4.

Tombol juga memiliki **warna status (state colors)** — warna yang berubah menurut keadaan tombol: normal, ditekan (pressed), dan nonaktif (disabled). Tombol yang ditekan menjadi lebih redup (opacity menurun) sebagai umpan balik; tombol nonaktif memakai latar abu dengan teks redup agar jelas "tidak bisa dipakai". Anda akan mengimplementasikan keempat variasi dan ketiga status ini pada komponen `Tombol` di Praktikum bab ini.

#### Form (tampilan saja)

**Form** (formulir) adalah kumpulan input untuk memasukkan data. Bab 8 membahas lengkap struktur form (state, validasi, keyboard); di bab ini Anda hanya mempelajari *tampilannya*: pola visual yang membuat formulir mudah diisi. Pola standar mobile: label di atas kolom input (bukan di samping, karena layar sempit), kolom input selebar penuh dengan jarak dalam 12–16, garis tepi yang jelas, dan **placeholder** (teks petunjuk isian) sebagai contoh nilai. Bentuk tampilan form diilustrasikan sebagai berikut:

```text
┌──────────────────────────────┐
│ Nama Lengkap            label│
│ ┌──────────────────────────┐ │
│ │ Budi Santoso         [×] │ │  ← input berisi nilai
│ └──────────────────────────┘ │
│ NIM                          │
│ ┌──────────────────────────┐ │
│ │                          │ │  ← input kosong + placeholder
│ └──────────────────────────┘ │
│          [ Simpan ]          │ ← tombol primary
└──────────────────────────────┘
```

Dua keputusan tampilan yang penting: label selalu terlihat (jangan jadikan placeholder satu-satunya penanda, karena hilang saat pengguna mengetik), dan tombol simpan menempel di bawah form — dekat dengan ibu jari. Keseluruhan logika form (mengambil nilai, memvalidasi, menyimpan) sengaja ditunda ke Bab 8 agar Anda fokus pada visual dulu.

#### List (daftar)

**List** (daftar) adalah pola menampilkan banyak entitas sejenis secara vertikal — inti dari halaman Daftar Mahasiswa. Bab 5 telah mengenalkan FlatList; yang dibahas di sini adalah *konsistensi item*-nya. Setiap item list harus memiliki struktur yang sama: area sentuh minimal, jarak dalam yang sama, dan hierarki teks yang sama (nama lebih menonjol daripada keterangan). Dua pola teks yang umum: satu baris (judul saja) dan dua baris (judul di atas, keterangan kecil di bawah). Gunakan pola dua baris untuk entitas dengan atribut tambahan — di aplikasi kita, nama mahasiswa (baris pertama) dan NIM–angkatan (baris kedua). Pemisah antar item boleh berupa garis tipis atau jarak 8, tetapi pilih salah satu dan konsisten. Perhatikan juga tiga keadaan yang harus diantisipasi setiap list: sedang memuat (loading), kosong (empty state), dan gagal dimuat (error) — ketiganya diimplementasikan bersama data asli pada Bab 10.

### 6.3 Header dan Bottom Navigation

#### Header (kepala layar)

**Header** (kepala layar) adalah baris paling atas sebuah layar yang menjawab tiga pertanyaan pengguna: "saya di mana?", "apa yang bisa saya lakukan di sini?", dan "bagaimana saya kembali?". Elemennya: judul layar (jelas, singkat), aksi kontekstual di sisi kanan (misalnya tombol Tambah pada layar Daftar), dan tombol kembali di sisi kiri untuk layar yang dibuka dari layar lain. Pada aplikasi kita, header Daftar Mahasiswa menampilkan judul "Manajemen Mahasiswa" dengan subjudul penjelas dan tombol aksi "Tambah"; header Detail Mahasiswa menampilkan tombol "Kembali" dan judul "Detail Mahasiswa".

Keputusan desain penting: header harus konsisten di semua layar (tinggi, jarak, dan gaya yang sama), karena header adalah "papan nama" yang diulang pengguna di setiap perpindahan layar. Tinggi header umumnya 56pt ditambah area status (status bar) — area amannya ditangani komponen SafeAreaView, yang akan Anda pakai di Praktikum. *Trade-off*-nya: header memakan ruang vertikal berharga; beberapa aplikasi menghilangkan header pada layar konten penuh (misalnya galeri foto) untuk memberi ruang konten, dan mengorbankan kejelasan orientasi. Pada Bab 7, header bawaan navigasi (Expo Router) akan menggantikan peran sebagian besar header yang Anda buat manual di bab ini — yang Anda pelajari sekarang adalah anatomi dan fungsinya, bukan implementasi navigasinya.

#### Bottom Navigation (navigasi bawah)

**Bottom navigation** (navigasi bawah) adalah bar tab horizontal di bagian bawah layar untuk berpindah antar bagian utama aplikasi, biasanya 3–5 tab, masing-masing berikon dan berlabel. Mengapa diletakkan di bawah? Karena persis di zona paling nyaman dijangkau ibu jari (prinsip thumb-friendly pada 6.1) — pengguna dapat berpindah bagian tanpa menggeser genggaman. Konsepnya:

```text
┌──────────────────────────────┐
│  Beranda   Mahasiswa  Profil │
│    ●        ○         ○      │  ← tab aktif ditandai jelas
└──────────────────────────────┘
```

Aturan desainnya: tab aktif selalu ditandai (warna dan ikon berbeda), tab nonaktif tetap terbaca, jumlah tab dibatasi 3–5 (lebih dari itu masing-masing terlalu sempit dan sulit ditekan), dan tab hanya untuk bagian *utama* aplikasi — bukan untuk halaman detail atau formulir. *Trade-off*-nya: tab bawah memakan ruang konten vertikal dan bersaing dengan tombol aksi utama yang juga ingin diletakkan di bawah; perancang harus memutuskan mana yang lebih sering dipakai pengguna. Pengenalan ini sengaja bersifat konseptual: implementasi rute tab dengan Expo Router merupakan materi Bab 7. Di akhir Bab 6, aplikasi Anda belum memiliki navigasi sama sekali — berpindah layar dilakukan dengan state sederhana, yang justru mempermudah Anda merasakan peran navigasi saat tiba di Bab 7.

### 6.4 Tipografi, Spacing, dan Warna

#### Skala tipografi

**Tipografi** (seni mengatur huruf) adalah alat hierarki visual yang paling murah dan paling sering disepelekan. Masalahnya: jika setiap teks boleh memilih ukurannya sendiri, setiap layar menjadi random. Solusinya adalah **skala tipografi** (type scale) — serangkaian ukuran huruf baku yang dipakai seluruh aplikasi. Skala umum di aplikasi mobile:

| Level | Ukuran | weight | Pemakaian |
|---|---|---|---|
| caption | 12 | 400/500 | keterangan kecil, lencana |
| body kecil | 14 | 400 | teks sekunder, nilai detail |
| body | 16 | 400 | teks utama, isi kartu |
| subjudul | 18–20 | 600/700 | judul section, nama di detail |
| judul layar | 20–28 | 700 | judul header layar |
| display | 32+ | 700 | angka besar, halaman pembuka |

**Weight** (ketebalan huruf) adalah pasangan skala: daripada memperbesar teks untuk menonjolkannya, tebalkan saja (400 regular → 600 semibold → 700 bold). Dua efek yang sama sering dipakai bergantian (besar + tebal) justru membuat hierarki berlebihan — pilih salah satu. Catatan platform: font bawaan berbeda di tiap sistem operasi (Roboto di Android, San Francisco di iOS), dan Android hanya mendukung sebagian ketebalan untuk font bawaan; jika proyek menuntut font khusus, font kustom dimuat lewat pustaka *expo-font* (di luar cakupan buku ini). Jarak antar baris (lineHeight) diatur sekitar 1,3–1,5 kali ukuran huruf agar paragraf tidak sesak.

**Kapitalisasi** adalah keputusan desain yang sering lupa disadari: judul layar memakai gaya kalimat (sentence case: "Manajemen Mahasiswa"), tombol singkat boleh memakai huruf kapital semua jika konsisten, dan teks panjang tidak pernah memakai kapital semua karena sulit dibaca. Di React Native, transformasi huruf dapat diatur lewat properti gaya `textTransform` dengan nilai `uppercase`, `lowercase`, atau `capitalize`.

#### Spacing (jarak antar elemen)

**Spacing** (jarak antar elemen) menentukan "napas" sebuah layar. Semua nilai jarak pada bab ini mengikuti sistem 8pt dari 6.2: jarak dalam kartu 16, jarak antar kartu 8, jarak tepi layar 16, jarak antar grup 24. Aturan sederhana yang perlu diingat: *informasi yang berhubungan diberi jarak kecil (8), informasi yang berbeda kelompok diberi jarak besar (16–24)*. Jarak yang konsisten membuat pengguna merasakan keteraturan bahkan tanpa menyadarinya. *Trade-off*-nya: jarak yang longgar terlihat mewah namun memperpanjang guliran layar; jarak yang ketat memuat banyak informasi namun melelahkan mata. Aplikasi data (seperti manajemen mahasiswa) umumnya memilih jarak sedang agar padat namun tetap nyaman.

#### Warna: palet, kontras, dan state colors

**Palet** (palet warna) aplikasi sebaiknya dibangun dari lapisan yang jelas: warna primer (identitas aplikasi, untuk aksi utama), warna netral (teks dan latar: beberapa tingkat abu), dan warna semantik (makna: sukses, peringatan, bahaya/error). Warna sekunder hanya bila benar-benar diperlukan. Palet aplikasi contoh pada bab ini:

| Peran | Warna | Pemakaian |
|---|---|---|
| Primer | Biru `#2563EB` | tombol primary, avatar, aksi utama |
| Netral teks | `#1F2937`, `#6B7280`, `#9CA3AF` | teks utama, teks sekunder, teks redup |
| Netral latar | `#FFFFFF`, `#F9FAFB`, `#E5E7EB` | kartu, latar layar, garis pemisah |
| Sukses | Hijau `#15803D` | IPK ≥ 3,5, status aktif |
| Peringatan | Oranye `#C2410C` | nilai batas, peringatan |
| Bahaya | Merah `#B91C1C` / `#DC2626` | IPK rendah, tombol Hapus |

Aturan emas warna: jangan pernah andalkan warna sebagai satu-satunya pembawa makna (pengguna buta warna tidak akan membaca IPK merah vs hijau; berpasangan dengan keterangan teks), dan pastikan **kontras** (perbedaan kecerlangan antara teks dan latar) cukup. Acuan industri umum adalah WCAG (Web Content Accessibility Guidelines) versi 2.1 level AA: rasio kontras minimal **4,5:1** untuk teks normal dan **3:1** untuk teks besar atau elemen antarmuka. Kontras dihitung dari perbandingan kecerlangan dua warna, bukan dari selera; misalnya pasangan putih di atas biru primer pada tabel di atas berada di sekitar 5:1, cukup untuk teks normal — pilihan warna pada tabel ini memang dibuat agar seluruh pasangan teks–latar lolos ambang tersebut.

**State colors** (warna status) melengkapi warna dasar: elemen interaktif membutuhkan warna keadaan. Tiga keadaan wajib: normal (warna dasar), ditekan (lebih redup/gelap), dan nonaktif (abu pudar dengan kontras rendah — sengaja, karena tidak bisa dipakai). Keadaan tambahan seperti fokus (saat elemen dipilih lewat keyboard/aksesibilitas) baik untuk dipertimbangkan. Mengapa state colors penting? Agar pengguna tahu elemen mana yang hidup dan sedang apa; tanpa itu, layar terlihat "mati" dan pengguna ragu menekan. Inilah alasan desain yang melatarbelakangi fungsi `style` pada Pressable yang Anda pelajari di Bab 5 — sekarang Anda tahu apa yang mau dicapai, bukan sekadar cara menulisnya.

### 6.5 Responsive Design

**Responsive design** (desain responsif) adalah kemampuan antarmuka menyesuaikan diri dengan berbagai ukuran dan orientasi layar: ponsel sempit, ponsel lebar, tablet, dan mode lanskap. Mengapa ini ada? Karena satu aplikasi dijalankan di ribuan perangkat dengan rasio layar berbeda; aplikasi yang kaku (asumsi lebar tetap) akan terlihat rusak di sebagian perangkat. Memang ada *trade-off*: kode responsif lebih kompleks dan lebih sulit diuji — tetapi biaya itu jauh lebih kecil daripada biaya reputasi aplikasi yang "berantakan di tablet dosen".

Lima alat utama responsif di React Native: (1) **Flexbox** — fondasi pengaturan proporsi, sudah Anda kuasai di Bab 5; (2) lebar persentase dan `flex` untuk membagi ruang secara relatif; (3) **flexWrap** agar baris elemen pindah ke baris baru saat sempit; (4) `useWindowDimensions` — hook yang mengembalikan lebar dan tinggi layar saat ini dan memperbarui tampilan saat orientasi berubah; (5) batas maksimal (`maxWidth`) agar elemen tidak melebar tak terkendali di layar besar. Pola yang lazim: pada layar sempit tampilkan daftar satu kolom; pada layar lebar (misalnya tablet, lebar ≥ 700) tampilkan dua kolom. Di bab ini pola tersebut diimplementasikan pada halaman Daftar Mahasiswa — lihat Praktikum 6. Pola lebih lanjut bernama **master-detail** (daftar di kiri, detail di kanan pada layar lebar) biasa dihadirkan di tablet; di ponsel kedua panel tersebut menjadi dua layar terpisah, persis seperti halaman Daftar dan Detail yang Anda bangun.

Perhatikan juga skala teks: sebagian pengguna memperbesar ukuran font sistem karena kebutuhan membaca. Aplikasi yang baik tidak "pecah" saat ukuran font diperbesar — teks boleh meluber, selama layout tetap logis. Uji aplikasi di beberapa ukuran: emulator Android menyediakan simulasi berbagai perangkat, dan Expo Go memungkinkan Anda mencoba di ponsel sungguhan dengan ukuran berbeda (lihat Bab 2 untuk cara menjalankan).

### 6.6 Aksesibilitas Dasar

**Aksesibilitas** (keteraksesan) adalah kualitas antarmuka yang membuat aplikasi dapat dipakai oleh sebanyak mungkin orang, termasuk pengguna dengan keterbatasan penglihatan, pendengaran, atau motorik. Mengapa ini wajib dipelajari oleh mahasiswa SI? Tiga alasan: etika (teknologi seharusnya tidak menutup pintu bagi siapa pun), hukum (berbagai negara, termasuk Indonesia, mewajibkan layanan publik memperhatikan penyandang disabilitas — aplikasi kampus adalah layanan publik), dan bisnis (pasar pengguna yang lebih luas). Ada *trade-off*: atribut aksesibilitas menambah baris kode dan kadang membatasi kreativitas visual; tetapi justru karena itu aksesibilitas terbaik ditanam sejak awal, bukan ditambal di akhir.

Empat praktik dasar yang wajib Anda kuasai:

**Pertama, accessibilityRole** — properti yang menjelaskan peran sebuah elemen kepada **pembaca layar (screen reader)**, perangkat lunak yang membacakan isi layar (VoiceOver di iOS, TalkBack di Android). Nilai yang umum: `button` untuk tombol, `header` untuk judul, `image` untuk gambar, `link` untuk tautan. Tanpa peran ini, pembaca layar memperlakukan tombol sebagai teks biasa dan pengguna tidak tahu elemen itu bisa ditekan.

**Kedua, accessibilityLabel** — teks alternatif yang dibacakan menggantikan teks visual. Untuk tombol yang isinya hanya ikon, label ini wajib. Label yang baik bersifat eksplisit dan deskriptif: "Buka detail Budi Santoso, NIM 2201001" lebih berguna daripada "Kartu" atau "Budi". Sebaliknya, label yang tidak deskriptif seperti "Ketuk di sini" membuat pengguna pembaca layar kebingungan.

**Ketiga, accessibilityState** — status elemen interaktif, misalnya `{ disabled: true }` untuk tombol nonaktif, `{ selected: true }` untuk tab aktif. Pembaca layar mengumumkan status ini ("tombol nonaktif"), sehingga pengguna tidak menekan elemen yang memang tidak berfungsi.

**Keempat, ukuran target sentuh (touch target)** — area minimum agar jari dapat menekan dengan akurat. Konvensi industri: minimal **44×44** poin (acuan Apple) dan 48×48 dp (acuan Material Design), dengan jarak antar target sekitar 8pt agar tidak salah tekan. Jika desain menuntut elemen visual kecil (misalnya ikon), jangan mengecilkan area sentuhnya — perbesar area lewat properti `hitSlop`, yang memperluas zona sentuh tanpa mengubah tampilan. Target sentuh yang kecil adalah salah satu keluhan pengguna paling umum pada aplikasi kampus: tombol yang "sulit ditekan" bukanlah masalah jari pengguna, melainkan keputusan desain.

Pada Praktikum bab ini, seluruh komponen yang Anda tulis (Tombol, CardMahasiswa, layar Daftar dan Detail) sudah membawa atribut aksesibilitas di atas, sehingga Anda belajar dari contoh kerja — bukan hanya teori.

### 6.7 Studi Kasus: Aplikasi Manajemen Data Mahasiswa

#### Latar masalah

Sebuah program studi di perguruan tinggi swasta mengelola data mahasiswa aktif yang tersebar di beberapa berkas spreadsheet yang dipegang staf berbeda: data akademik di satu berkas, data kontak di berkas lain, dan tidak ada satu pun tampilan yang menyatukannya. Staf akademik harus membuka tiga berkas untuk menjawab satu pertanyaan sederhana ("berapa IPK mahasiswa X?"), dan sering kali data antar berkas tidak sinkron. Inilah masalah dunia SI yang khas: data sebenarnya ada, tetapi *tampilannya* tidak dirancang. Pemrograman mobile tidak hanya menyelesaikan masalah ini lewat database, tetapi juga lewat antarmuka: aplikasi yang menyajikan data mahasiswa secara konsisten, cepat dipindai, dan nyaman digunakan ibu jari di tengah kesibukan administrasi.

Pendekatan yang diambil buku ini adalah **UI-first**: rancang dan bangun antarmuka lebih dulu dengan data contoh, sebelum menghubungkan database dan server. Mengapa? Karena antarmuka adalah bagian yang paling sering disalahpahami kebutuhannya; dengan melihat layar yang nyata (walau data masih baku dan statis), pemangku kepentingan (staf akademik, dosen wali) dapat mengoreksi alur sebelum biaya pembangunan naik. Inilah alasan layar pada bab ini *sengaja* tanpa navigasi dan tanpa pengambilan data: Bab 7 menambahkan perpindahan layar, Bab 10 mengganti data baku dengan data dari server. Layar statis bukan produk setengah jadi — ia adalah artefak desain yang sah dan tool komunikasi tim.

#### Wireframe halaman Daftar Mahasiswa

**Wireframe** (kerangka layar) adalah sketsa tata letak tanpa hiasan visual, dibuat sebelum menulis kode. Wireframe tekstual halaman Daftar:

```text
┌────────────────────────────────┐
│ Manajemen Mahasiswa      [Tambah]│  ← header: judul + aksi
│ Kelola data mahasiswa aktif     │
├────────────────────────────────┤
│ ┌────────────────────────────┐ │
│ │ Budi Santoso        [Sistem  │ │  ← card: nama + lencana prodi
│ │ NIM 2201001 · Angkatan 2022 │ │
│ │ IPK 3,45                    │ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │ Siti Aminah        [Teknik  │ │
│ │ NIM 2201002 · Angkatan 2022 │ │
│ │ IPK 3,82                    │ │
│ └────────────────────────────┘ │
│ (…tiga kartu lain mengikuti)    │
│                                │
│ ┌────────────────────────────┐ │
│ │ ● Beranda  ○ Mahasiswa  ○ Profil │ ← bottom nav (konsep, Bab 7)
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

Bacaan wireframe ini: satu header konsisten (judul, subjudul, aksi kanan), daftar kartu yang seragam, dan posisi yang disediakan untuk navigasi bawah. Keputusan desainnya: memakai kartu (bukan baris tabel) karena tiap mahasiswa membawa tiga informasi dengan bobot berbeda; lencana program studi memakai warna lembut berbeda per prodi (warna sebagai pengelompokan, tetap disertai teks agar tidak bergantung warna); IPK diberi warna semantik (hijau/abu/merah sesuai ambang nilai) agar pemindaian cepat — staf akademik sering mencari "siapa yang IPK-nya bermasalah".

#### Wireframe halaman Detail Mahasiswa

```text
┌────────────────────────────────┐
│ [← Kembali]  Detail Mahasiswa  │ ← header dengan aksi kembali
├────────────────────────────────┤
│           ┌──────┐             │
│           │  BS  │             │ ← avatar inisial
│           └──────┘             │
│          Budi Santoso          │
│        [Sistem Informasi]      │
│ ┌────────────────────────────┐ │
│ │ NIM            2201001      │ │  ← pasangan label–nilai
│ │ Program Studi  Sistem Informasi│
│ │ Angkatan       2022         │ │
│ │ IPK            3,45         │ │
│ │ Email          budi.santoso@…│ │
│ │ Telepon        081234567890 │ │
│ └────────────────────────────┘ │
│     [ Edit ]      [ Hapus ]    │ ← aksi: pendukung + danger
└────────────────────────────────┘
```

Detail layar ini: profil ringkas (avatar inisial + nama + prodi), daftar pasangan label–nilai yang konsisten (pola list dari 6.2), dan dua tombol aksi — Edit (secondary) dan Hapus (danger). Perhatikan penerapan hierarki: identitas mahasiswa paling menonjol, lalu data, lalu aksi. Perhatikan juga keputusan aksesibilitas: avatar memakai inisial, bukan foto — pilihan yang sah untuk aplikasi data statis, selama setiap elemen diberi label yang benar.

#### Analisis keputusan desain

Tabel berikut merangkum keputusan desain pada dua wireframe dan prinsip yang melandasinya:

| Keputusan | Dasar prinsip |
|---|---|
| Header konsisten di kedua layar | Konsistensi (6.1) |
| Kartu seragam, jarak kelipatan 8 | Sistem 8pt + pemindaian (6.1, 6.2) |
| Satu primary di tiap layar, Hapus danger | Hierarki aksi + warna semantik (6.2, 6.4) |
| Lencana prodi berwarna + berteks | Kontras & tidak bergantung warna (6.4, 6.6) |
| IPK berwarna semantik | Pemindaian cepat data (6.4) |
| Tombol Kembali + aksi di bawah | Thumb-friendly (6.1) |
| Target sentuh ≥ 44×44, label aksesibel | Aksesibilitas (6.6) |

Wireframe ini adalah "kontrak visual" sebelum kode. Langkah berikutnya — mengimplementasikannya menjadi layar statis yang berjalan — Anda lakukan pada Praktikum 6. Perhatikan bahwa seluruh keputusan pada tabel dapat dilacak balik ke prinsip; itulah ciri antarmuka yang dirancang, bukan sekadar disusun.

## Contoh

Berikut tiga cuplikan yang menunjukkan pola-pola kunci bab ini. Cuplikan pertama dan kedua diambil dari komponen yang versi lengkapnya Anda tulis pada Praktikum 6; cuplikan ketiga menunjukkan pola responsif pada layar daftar.

**Contoh 1 — Warna semantik berbasis data** (cuplikan dari file kunci, versi lengkap pada Praktikum 6):

File: components/CardMahasiswa.js

```js
// Warna IPK berdasarkan ambang nilai: hijau ≥ 3,5; abu 3,0–3,49; merah < 3,0.
function warnaIpk(ipk) {
  if (ipk >= 3.5) return '#15803D';
  if (ipk >= 3.0) return '#374151';
  return '#B91C1C';
}
```

Penjelasan: fungsi murni (pure function, tanpa efek samping) ini menerima angka IPK dan mengembalikan satu warna — bentuk paling sederhana penerapan warna semantik (6.4). Karena keputusan warnanya satu tempat, aturan ambang nilai dapat diubah atau diuji tanpa menyentuh tampilan; pola ini juga yang akan diuji otomatis pada Bab 14 (fungsi murni mudah diuji). Perhatikan bahwa warna dipakai untuk *mempercepat* pemindaian, tetapi nilai IPK tetap ditampilkan sebagai teks — makna tidak bergantung warna.

**Contoh 2 — Status tombol: ditekan dan nonaktif** (cuplikan dari file kunci, versi lengkap pada Praktikum 6):

File: components/Tombol.js

```js
style={({ pressed }) => [
  styles.dasar,
  {
    backgroundColor: modeNonaktif ? '#E5E7EB' : LATAR_VARIASI[variasi],
    opacity: pressed && !modeNonaktif ? 0.75 : 1,
  },
]}
```

Penjelasan: fungsi gaya pada Pressable (Bab 5) menerima objek `{ pressed }` sehingga komponen dapat mengubah tampilan saat ditekan — inilah wujud umpan balik (6.1) dan state colors (6.4). Dua status ditangani sekaligus: ditekan menurunkan opacity menjadi 0,75, sedangkan mode nonaktif mengunci latar abu dan menonaktifkan efek tekan. Urutan kondisi penting: tombol nonaktif tidak boleh ikut meredup saat "ditekan" karena ia memang tidak merespons sentuhan.

**Contoh 3 — Daftar adaptif dua kolom** (cuplikan dari file kunci, versi lengkap pada Praktikum 6):

File: screens/DaftarMahasiswa.js

```js
import { useWindowDimensions } from 'react-native';

const { width } = useWindowDimensions();
const jumlahKolom = width >= 700 ? 2 : 1;

<FlatList
  data={data}
  numColumns={jumlahKolom}
  keyExtractor={(mhs) => mhs.id}
  ...
```

Penjelasan: `useWindowDimensions` mengembalikan lebar layar saat ini dan memperbarui komponen secara otomatis ketika orientasi berubah (misalnya ponsel diputar atau dibuka di tablet). Variabel `jumlahKolom` menentukan `numColumns` FlatList: satu kolom di layar sempit, dua kolom di layar lebar — pola responsive design dari 6.5 yang diterapkan tanpa perpustakaan tambahan. Karena nilai 700 adalah ambang yang Anda tentukan sendiri, ambang ini termasuk keputusan desain yang perlu diuji pada perangkat sungguhan, bukan angka mutlak.

## Praktikum

### Tujuan Praktikum

Mengimplementasikan layar statis Aplikasi Manajemen Data Mahasiswa dari wireframe pada 6.7: halaman Daftar Mahasiswa (list lima kartu mahasiswa) dan halaman Detail Mahasiswa, lengkap dengan komponen Tombol (empat variasi, tiga status) dan kartu yang konsisten, responsif (satu/dua kolom), serta atribut aksesibilitas dasar. Praktikum ini mempraktikkan seluruh prinsip 6.1–6.6 dalam satu aplikasi utuh.

### Kebutuhan

- Project Expo dari Bab 5 (disarankan) atau project baru: `npx create-expo-app aplikasi-mahasiswa --template blank` (template JavaScript, lihat Bab 2).
- Expo SDK 57 / React Native 0.86, Node.js LTS (Bab 2).
- Expo Go pada perangkat atau emulator (Bab 2).
- Paket `react-native-safe-area-context` — dipasang pada Persiapan.

### Persiapan

1. Pastikan project siap dijalankan dengan `npx expo start` (Bab 2 dan Bab 5).
2. Instal paket area aman layar. Paket ini menyediakan SafeAreaView modern; komponen SafeAreaView bawaan React Native telah ditandai deprecated (tidak disarankan) pada versi mutakhir, sehingga buku ini memakai pengganti resminya:

```bash
npx expo install react-native-safe-area-context
```

3. Dalam project, buat dua folder: `components/` dan `screens/`. Folder `components/` menampung elemen kecil yang dipakai ulang; folder `screens/` menampung layar utuh. Struktur akhir project:

```text
aplikasi-mahasiswa/
├── App.js
├── components/
│   ├── CardMahasiswa.js
│   └── Tombol.js
└── screens/
    ├── DaftarMahasiswa.js
    └── DetailMahasiswa.js
```

4. Buka `App.js` bawaan template, hapus isinya (akan ditulis ulang pada Langkah Kerja 7).

### Langkah Kerja

1. Tulis komponen `components/Tombol.js` — tombol dengan empat variasi (primary, secondary, outline, danger), status ditekan dan nonaktif, serta atribut aksesibilitas.
2. Tulis komponen `components/CardMahasiswa.js` — kartu satu mahasiswa: nama, lencana program studi, NIM, angkatan, dan IPK berwarna semantik.
3. Tulis layar `screens/DaftarMahasiswa.js` — header (judul + subjudul + aksi "Tambah") dan FlatList kartu, adaptif satu/dua kolom.
4. Tulis layar `screens/DetailMahasiswa.js` — header dengan tombol Kembali, profil avatar inisial, kartu pasangan label–nilai, dan baris aksi Edit/Hapus.
5. Tulis `App.js` — memuat lima data mahasiswa baku (Kontrak Penulisan buku, subbab 5), lalu menampilkan Daftar atau Detail berdasarkan state sederhana (bukan navigasi; perpindahan layar sungguhan dibangun di Bab 7).
6. Jalankan `npx expo start` dan buka aplikasi di Expo Go (Bab 2 bila perlu). Uji: gulir daftar, tekan kartu, tekan Kembali, dan putar perangkat/ubah ukuran untuk melihat mode dua kolom.

### Kode

Berikut kelima file, ditulis lengkap agar dapat diketik ulang. Mulailah dari komponen terkecil (Tombol, lalu Card), lanjut ke layar, dan akhiri di App.js.

File: components/Tombol.js

```js
import { Pressable, Text, StyleSheet } from 'react-native';

// Peta warna per variasi tombol: latar, warna teks, dan warna garis tepi.
const LATAR_VARIASI = {
  primary: '#2563EB',
  secondary: '#E5E7EB',
  outline: 'transparent',
  danger: '#DC2626',
};

const TEKS_VARIASI = {
  primary: '#FFFFFF',
  secondary: '#1F2937',
  outline: '#2563EB',
  danger: '#FFFFFF',
};

const GARIS_VARIASI = {
  primary: 'transparent',
  secondary: 'transparent',
  outline: '#2563EB',
  danger: 'transparent',
};

export default function Tombol({
  label,
  variasi = 'primary',
  onTekan,
  modeNonaktif = false,
  gaya = {},
}) {
  return (
    <Pressable
      onPress={onTekan}
      disabled={modeNonaktif}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: modeNonaktif }}
      style={({ pressed }) => [
        styles.dasar,
        {
          backgroundColor: modeNonaktif ? '#E5E7EB' : LATAR_VARIASI[variasi],
          borderColor: GARIS_VARIASI[variasi],
          opacity: pressed && !modeNonaktif ? 0.75 : 1,
        },
        gaya,
      ]}
    >
      <Text
        style={[
          styles.teks,
          { color: modeNonaktif ? '#9CA3AF' : TEKS_VARIASI[variasi] },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dasar: {
    minHeight: 48,
    minWidth: 44,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teks: {
    fontSize: 16,
    fontWeight: '600',
  },
});
```

Penjelasan: komponen ini satu-satunya "bahasa aksi" aplikasi. Tiga objek konstanta (LATAR, TEKS, GARIS) memetakan nama variasi ke warna; dengan pola ini menambah variasi baru cukup menambah satu baris pada tiga objek — bentuk awal design token (6.1). Ukuran minimum tombol dijamin oleh `minHeight: 48` dan `minWidth: 44` (target sentuh dari 6.6). Umpan balik tekan berupa penurunan opacity, dan mode nonaktif mengunci warna abu serta mengirim `disabled` ke Pressable sekaligus `accessibilityState` agar pembaca layar mengumumkannya (6.6).

File: components/CardMahasiswa.js

```js
import { Pressable, Text, View, StyleSheet } from 'react-native';

// Warna lencana program studi: latar lembut + teks gelap agar kontras cukup.
const WARNA_LENCANA = {
  'Sistem Informasi': '#EFF6FF',
  'Teknik Informatika': '#F0FDF4',
  'Informatika': '#FFF7ED',
  'Rekayasa Perangkat Lunak': '#FEF2F2',
};

const WARNA_TEKS_LENCANA = {
  'Sistem Informasi': '#1D4ED8',
  'Teknik Informatika': '#15803D',
  'Informatika': '#C2410C',
  'Rekayasa Perangkat Lunak': '#B91C1C',
};

// Warna IPK berdasarkan ambang nilai: hijau ≥ 3,5; abu 3,0–3,49; merah < 3,0.
function warnaIpk(ipk) {
  if (ipk >= 3.5) return '#15803D';
  if (ipk >= 3.0) return '#374151';
  return '#B91C1C';
}

export default function CardMahasiswa({ mahasiswa, onTekan }) {
  return (
    <Pressable
      onPress={onTekan}
      accessibilityRole="button"
      accessibilityLabel={`Buka detail ${mahasiswa.nama}, NIM ${mahasiswa.nim}`}
      style={({ pressed }) => [styles.kartu, pressed && styles.kartuDitekan]}
    >
      <View style={styles.barisJudul}>
        <Text style={styles.nama}>{mahasiswa.nama}</Text>
        <View
          style={[
            styles.lencana,
            { backgroundColor: WARNA_LENCANA[mahasiswa.prodi] },
          ]}
        >
          <Text
            style={[
              styles.teksLencana,
              { color: WARNA_TEKS_LENCANA[mahasiswa.prodi] },
            ]}
          >
            {mahasiswa.prodi}
          </Text>
        </View>
      </View>
      <Text style={styles.nim}>
        NIM {mahasiswa.nim} · Angkatan {mahasiswa.angkatan}
      </Text>
      <Text style={[styles.ipk, { color: warnaIpk(mahasiswa.ipk) }]}>
        IPK {mahasiswa.ipk.toFixed(2)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  kartu: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  kartuDitekan: {
    opacity: 0.75,
  },
  barisJudul: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nama: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flexShrink: 1,
    marginRight: 8,
  },
  lencana: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  teksLencana: {
    fontSize: 12,
    fontWeight: '500',
  },
  nim: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  ipk: {
    fontSize: 14,
    fontWeight: '600',
  },
});
```

Penjelasan: kartu ini menerima satu objek mahasiswa dan satu fungsi `onTekan` — komponen murni penerima data, pola komposisi dari Bab 4/5. Warna lencana per program studi disimpan di dua peta sehingga pasangan latar–teks selalu kontras tinggi (periksa pasangan ini pada tabel 6.4). `warnaIpk` menerapkan warna semantik; `flex: 1` pada kartu memungkinkan dua kartu berbagi satu baris saat FlatList memakai dua kolom (responsif, 6.5), dan `flexShrink: 1` pada nama mencegah nama panjang mendorong lencana keluar layar. Label aksesibilitas membaca "Buka detail [nama], NIM [nim]" — deskriptif, bukan sekadar "Kartu" (6.6).

File: screens/DaftarMahasiswa.js

```js
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { useWindowDimensions } from 'react-native';

import CardMahasiswa from '../components/CardMahasiswa';
import Tombol from '../components/Tombol';

export default function DaftarMahasiswa({ data, onPilihMahasiswa }) {
  const { width } = useWindowDimensions();
  const jumlahKolom = width >= 700 ? 2 : 1;

  return (
    <View style={styles.layar}>
      <View style={styles.header}>
        <View style={styles.barisJudul}>
          <Text style={styles.judul}>Manajemen Mahasiswa</Text>
          <Tombol label="Tambah" variasi="secondary" />
        </View>
        <Text style={styles.subjudul}>Kelola data mahasiswa aktif</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(mhs) => mhs.id}
        renderItem={({ item }) => (
          <CardMahasiswa
            mahasiswa={item}
            onTekan={() => onPilihMahasiswa(item)}
          />
        )}
        contentContainerStyle={styles.daftar}
        numColumns={jumlahKolom}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  layar: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  barisJudul: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  judul: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  subjudul: {
    fontSize: 14,
    color: '#6B7280',
  },
  daftar: {
    padding: 16,
  },
});
```

Penjelasan: layar ini memisahkan header (judul, subjudul, aksi "Tambah") dari konten list — struktur yang sama akan dipakai ulang di layar lain demi konsistensi (6.1, 6.3). `useWindowDimensions` memberi mode satu/dua kolom (6.5), dan `numColumns` FlatList mengatur jumlah kolom; saat dua kolom, kartu membagi lebar baris berkat `flex: 1` pada CardMahasiswa. Tombol "Tambah" sengaja belum memiliki fungsi — dalam pendekatan UI-first, tombol tampil lebih dulu dan dihubungkan ke form pada Bab 8. Latar layar (`#F9FAFB`) dan header putih kontras tipis, menjaga kartu putih tetap menonjol (hierarki, 6.1).

File: screens/DetailMahasiswa.js

```js
import { ScrollView, Text, View, StyleSheet } from 'react-native';

import Tombol from '../components/Tombol';

// Baris informasi yang ditampilkan sebagai pasangan label–nilai.
const BARIS_INFORMASI = [
  { label: 'NIM', kunci: 'nim' },
  { label: 'Program Studi', kunci: 'prodi' },
  { label: 'Angkatan', kunci: 'angkatan' },
  { label: 'IPK', kunci: 'ipk' },
  { label: 'Email', kunci: 'email' },
  { label: 'Telepon', kunci: 'telepon' },
];

// Inisial nama untuk avatar, misalnya "Budi Santoso" menjadi "BS".
function inisial(nama) {
  return nama
    .split(' ')
    .map((kata) => kata[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function nilaiBaris(mahasiswa, kunci) {
  const nilai = mahasiswa[kunci];
  return kunci === 'ipk' ? nilai.toFixed(2) : String(nilai);
}

export default function DetailMahasiswa({ mahasiswa, onKembali }) {
  return (
    <ScrollView style={styles.layar} contentContainerStyle={styles.isi}>
      <View style={styles.header}>
        <Tombol label="Kembali" variasi="outline" onTekan={onKembali} />
        <Text style={styles.judul}>Detail Mahasiswa</Text>
      </View>

      <View style={styles.profil}>
        <View style={styles.avatar}>
          <Text style={styles.teksAvatar}>{inisial(mahasiswa.nama)}</Text>
        </View>
        <Text style={styles.nama}>{mahasiswa.nama}</Text>
        <Text style={styles.prodi}>{mahasiswa.prodi}</Text>
      </View>

      <View style={styles.kartuInformasi}>
        {BARIS_INFORMASI.map((baris) => (
          <View key={baris.kunci} style={styles.barisInfo}>
            <Text style={styles.labelInfo}>{baris.label}</Text>
            <Text style={styles.nilaiInfo}>
              {nilaiBaris(mahasiswa, baris.kunci)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.barisAksi}>
        <Tombol label="Edit" variasi="secondary" gaya={styles.tombolAksi} />
        <Tombol label="Hapus" variasi="danger" gaya={styles.tombolAksi} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: {
    flex: 1,
  },
  isi: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  judul: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 12,
  },
  profil: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  teksAvatar: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  nama: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  prodi: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  kartuInformasi: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  barisInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  labelInfo: {
    fontSize: 14,
    color: '#6B7280',
  },
  nilaiInfo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  barisAksi: {
    flexDirection: 'row',
  },
  tombolAksi: {
    flex: 1,
    marginHorizontal: 4,
  },
});
```

Penjelasan: layar detail menerima satu objek mahasiswa dan fungsi `onKembali` — komponen ini tidak tahu dari mana data berasal, sehingga nanti (Bab 10) ia bisa menerima data dari server tanpa perubahan tampilan. Pasangan label–nilai dirender dari array `BARIS_INFORMASI` dengan `map` — satu pola untuk enam baris (konsistensi lewat data, bukan salin-tempel). Dua tombol aksi membagi lebar layar dengan `flex: 1`; Edit berwarna secondary, Hapus berwarna danger, keduanya belum terhubung fungsi (akan dihubungkan pada Bab 8 dan Bab 10). Header dengan tombol Kembali outline menghadirkan pola "aksi kembali" dari 6.3; `onKembali` bekerja lewat state App.js, bukan navigasi.

File: App.js

```js
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import DaftarMahasiswa from './screens/DaftarMahasiswa';
import DetailMahasiswa from './screens/DetailMahasiswa';

// Lima data mahasiswa baku yang dipakai konsisten di seluruh buku (Bab 4–8, 10).
const DATA_MAHASISWA = [
  {
    id: '1',
    nim: '2201001',
    nama: 'Budi Santoso',
    prodi: 'Sistem Informasi',
    angkatan: 2022,
    ipk: 3.45,
    email: 'budi.santoso@students.univ.ac.id',
    telepon: '081234567890',
  },
  {
    id: '2',
    nim: '2201002',
    nama: 'Siti Aminah',
    prodi: 'Teknik Informatika',
    angkatan: 2022,
    ipk: 3.82,
    email: 'siti.aminah@students.univ.ac.id',
    telepon: '081298765432',
  },
  {
    id: '3',
    nim: '2201003',
    nama: 'Agus Wijaya',
    prodi: 'Informatika',
    angkatan: 2023,
    ipk: 3.20,
    email: 'agus.wijaya@students.univ.ac.id',
    telepon: '081345678901',
  },
  {
    id: '4',
    nim: '2201004',
    nama: 'Dewi Lestari',
    prodi: 'Rekayasa Perangkat Lunak',
    angkatan: 2023,
    ipk: 3.61,
    email: 'dewi.lestari@students.univ.ac.id',
    telepon: '081356789012',
  },
  {
    id: '5',
    nim: '2201005',
    nama: 'Rizky Pratama',
    prodi: 'Sistem Informasi',
    angkatan: 2024,
    ipk: 2.95,
    email: 'rizky.pratama@students.univ.ac.id',
    telepon: '081367890123',
  },
];

export default function App() {
  // State sederhana untuk memilih layar; navigasi sungguhan ada di Bab 7.
  const [mahasiswaDipilih, setMahasiswaDipilih] = useState(null);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.bingkai} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />
        {mahasiswaDipilih ? (
          <DetailMahasiswa
            mahasiswa={mahasiswaDipilih}
            onKembali={() => setMahasiswaDipilih(null)}
          />
        ) : (
          <DaftarMahasiswa
            data={DATA_MAHASISWA}
            onPilihMahasiswa={setMahasiswaDipilih}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  bingkai: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});
```

Penjelasan: App.js adalah "pengarah" sementara: data baku lima mahasiswa disimpan di sini (nilai persis sesuai Kontrak Penulisan buku), dan satu state `mahasiswaDipilih` menentukan layar mana yang tampil — Detail ketika ada mahasiswa terpilih, Daftar ketika tidak (rendering bersyarat, Bab 4). Pola ini BUKAN navigasi; ia hanya mengilustrasikan alur Daftar→Detail dengan alat yang sudah Anda kuasai. Saat `setMahasiswaDipilih` dipanggil dari kartu, React merender ulang dan menampilkan detail; `onKembali` mengosongkan state dan mengembalikan daftar. SafeAreaView dari `react-native-safe-area-context` menjaga konten tidak menabrak area status bar dan poni perangkat (6.3); pada Bab 7, App.js ini akan digantikan struktur rute Expo Router, dan data akan pindah ke server pada Bab 10.

### Penjelasan Kode

Alur data pada aplikasi ini bergerak satu arah dan sederhana: App.js memegang data dan state → data diteruskan sebagai props ke layar → layar meneruskan ke komponen (CardMahasiswa) → interaksi pengguna mengirim fungsi balik (onTekan/onKembali) → state berubah → tampilan diperbarui. Inilah pola "data ke bawah, peristiwa ke atas" yang menjadi fondasi semua aplikasi React (Bab 4), dan memahami alurnya di sini akan memudahkan Anda saat Bab 7 menambah navigasi dan Bab 8 menambah state form.

Dua keputusan arsitektur kecil layak dicatat. Pertama, komponen tidak pernah mengimpor data secara langsung — CardMahasiswa dan Tombol hanya menerima props. Konsekuensinya, komponen dapat dipakai ulang di layar mana pun dan mudah diuji (Bab 14). Kedua, warna dan ukuran tersebar sebagai konstanta di tiap file (bukan file token terpusat); untuk aplikasi sekecil ini keputusan itu wajar, dan Tantangan pada bab ini mengajak Anda merapikannya menjadi satu file token — evolusi alami menuju skala tim (Contoh 6.1).

Perhatikan juga konsistensi nilai di seluruh file: jarak tepi layar 16, jarak dalam kartu 16, jarak antar kartu 8, sudut membulat 8–12, ukuran huruf 12/14/16/18/20 — semuanya kelipatan sistem 8pt dari 6.2, diterapkan tanpa terkecuali. Bila suatu saat sebuah layar terasa "janggal", langkah pertama debugging visual adalah memeriksa apakah salah satu nilai menyimpang dari ritme ini.

### Hasil yang Diharapkan

Saat aplikasi dijalankan di Expo Go:

1. Layar Daftar Mahasiswa menampilkan judul "Manajemen Mahasiswa", subjudul "Kelola data mahasiswa aktif", dan tombol "Tambah" di kanan header.
2. Lima kartu tampil berurutan: Budi Santoso (lencana biru Sistem Informasi, IPK 3,45 abu), Siti Aminah (lencana hijau Teknik Informatika, IPK 3,82 hijau), Agus Wijaya (lencana oranye Informatika, IPK 3,20 abu), Dewi Lestari (lencana merah Rekayasa Perangkat Lunak, IPK 3,61 hijau), Rizky Pratama (lencana biru Sistem Informasi, IPK 2,95 merah).
3. Menekan sebuah kartu → layar Detail menampilkan avatar inisial (misalnya "BS" untuk Budi Santoso), nama, prodi, enam baris label–nilai, dan dua tombol Edit/Hapus. Menekan "Kembali" → kembali ke daftar.
4. Menekan tombol mana pun → tombol meredup (opacity 0,75) selama ditekan; tombol nonaktif tidak ada di alur ini, tetapi variasi outline (Kembali) dan danger (Hapus) terlihat jelas berbeda.
5. Pada perangkat lebar (tablet) atau mode lanskap dengan lebar ≥ 700, daftar berubah menjadi dua kolom dan kartu menyusut proporsional.
6. Layar tidak menabrak area status bar/poni di semua perangkat (SafeAreaView).
7. Dengan pembaca layar aktif (TalkBack/VoiceOver), tiap kartu terbaca "Buka detail [nama], NIM [nim], tombol", dan tombol nonaktif diumumkan statusnya — coba navigasi tanpa melihat layar untuk merasakan aksesibilitasnya.

### Troubleshooting

**Masalah:** Layar putih atau muncul pesan error "Unable to resolve module ./components/Tombol" sesaat setelah aplikasi dimuat.

**Penyebab:** Path import tidak cocok dengan lokasi file — nama file atau folder salah ketik, atau file diletakkan di folder yang berbeda dari yang diimpor (perhatikan: sistem ini peka huruf besar/kecil pada sebagian sistem).

**Solusi:** Periksa nama folder (`components/`, `screens/`) dan nama file di struktur project, lalu samakan persis dengan path pada setiap baris `import`. Simpan file, lihat terminal Metro — jika masih error, tekan `r` untuk memuat ulang atau mulai ulang bundler dengan `npx expo start -c`.

**Pencegahan:** Buat struktur folder sebelum menulis kode, gunakan nama file lowercase konsisten, dan manfaatkan fitur autocomplete import pada editor agar path selalu persis.

**Masalah:** Setelah instalasi `react-native-safe-area-context`, muncul error berisi "SafeAreaProvider" atau "SafeAreaView" tidak ditemukan, dan aplikasi gagal dimuat.

**Penyebab:** Paket belum terpasang dengan benar atau versinya tidak cocok dengan SDK — biasanya karena paket diinstal dengan `npm install` biasa (yang bisa mengambil versi tak kompatibel) atau belum diinstal sama sekali.

**Solusi:** Jalankan `npx expo install react-native-safe-area-context` (perintah ini memilih versi yang kompatibel dengan SDK, lihat Persiapan), lalu mulai ulang bundler dengan `npx expo start -c` untuk membersihkan cache.

**Pencegahan:** Untuk pustaka yang berkaitan dengan native/Expo, selalu gunakan `npx expo install`, bukan `npm install`; tulis perintah instalasi ini di catatan project Anda (misalnya README) agar anggota tim lain tidak memakai perintah yang salah.

**Masalah:** Konten bagian atas layar (judul header) tertutup area status bar atau "poni" (notch) pada perangkat modern, padahal kode sudah benar.

**Penyebab:** Headers hanya diberi padding biasa tanpa memperhitungkan area aman layar; SafeAreaView tidak dipakai, atau dipakai di dalam layar yang bukan akar aplikasi.

**Solusi:** Pastikan `App.js` membungkus seluruh aplikasi dengan `SafeAreaProvider`, lalu gunakan `SafeAreaView` dengan `edges={['top', 'left', 'right']}` sebagai bingkai (lihat kode App.js). Jangan membuat SafeAreaView terpisah di tiap layar — cukup satu bingkai di akar.

**Pencegahan:** Jadikan SafeAreaView bagian dari "bingkai awal" project sebelum menulis layar pertama; dengan begitu seluruh layar baru otomatis aman.

**Masalah:** Menekan kartu tidak memberikan umpan balik apa pun dan layar Detail tidak pernah muncul; tidak ada error di terminal.

**Penyebab:** Rantai props putus: `onPilihMahasiswa` tidak diteruskan dari App.js ke DaftarMahasiswa, atau `onTekan` tidak dipasang pada Pressable kartu sehingga state tidak pernah berubah.

**Solusi:** Telusuri rantai props: App.js memanggil `<DaftarMahasiswa data={...} onPilihMahasiswa={setMahasiswaDipilih} />`; DaftarMahasiswa meneruskannya ke `CardMahasiswa` sebagai `onTekan={() => onPilihMahasiswa(item)}`; pastikan nama props konsisten di ketiga tempat. Sementara debugging, tambahkan `console.log` di dalam `onPilihMahasiswa` untuk memastikan fungsi dipanggil.

**Pencegahan:** Saat menambahkan props baru, periksa tiga tempat sekaligus: definisi komponen (parameter), pemakaian props, dan pemanggil komponen; biasakan membaca peringatan React di terminal Metro yang sering menunjukkan props tak terpakai.

**Masalah:** Pada perangkat lebar atau mode lanskap, kartu tetap satu kolom penuh sehingga daftar terlihat "menggantung" di tengah layar.

**Penyebab:** `numColumns` FlatList tidak diubah sesuai lebar layar, atau `useWindowDimensions` dipanggil di tempat yang tidak ikut ter-render ulang saat orientasi berubah.

**Solusi:** Pastikan layar memakai pola Contoh 3: `const { width } = useWindowDimensions();` di dalam komponen layar dan `numColumns={width >= 700 ? 2 : 1}` pada FlatList; karena hook ini melanggan perubahan ukuran, komponen otomatis merender ulang saat perangkat diputar.

**Pencegahan:** Uji aplikasi di beberapa ukuran (emulator dengan perangkat berbeda) sejak awal; simulasikan lanskap dengan memutar perangkat atau menekan ikon rotasi emulator.

### Troubleshooting Tambahan: Teks terpotong

**Masalah:** Pada mode dua kolom, teks nama atau lencana program studi terpotong/berantakan, terutama nama panjang.

**Penyebab:** Kartu tanpa `flexShrink` pada teks dan tanpa batas lebar untuk lencana; kolom yang menyempit memaksa elemen saling mendesak.

**Solusi:** Terapkan `flexShrink: 1` pada teks nama dan `marginRight: 8` (sudah ada pada kode bab ini); jika lencana tetap sempit, tambahkan `numberOfLines={1}` pada teks lencana agar terpotong rapi dengan elipsis alih-alih meluber.

**Pencegahan:** Uji mode dua kolom dengan data nama terpanjang yang mungkin ada di sistem; jadikan "nama panjang" bagian dari daftar uji data Anda di setiap iterasi desain.

## Studi Kasus

Bayangkan Anda adalah pengembang di divisi TIK sebuah universitas yang diminta membangun aplikasi mobile untuk administrasi akademik. Saat ini staf akademik menjawab pertanyaan mahasiswa dan dosen dengan membuka tiga spreadsheet yang tidak sinkron; pencarian data seorang mahasiswa memakan waktu menit, dan setiap akhir semester laporan IPK disusun manual sehingga rawan salah. Permintaan dari pimpinan sederhana: "satu aplikasi, data terlihat jelas, staf baru bisa memakainya dalam satu hari pelatihan." Permintaan ini adalah permintaan antarmuka, bukan permintaan database — dan itu kenyataan yang sering dialami proyek SI: *apa yang terlihat oleh pengguna menentukan keberhasilan sistem, apa pun teknologi di belakangnya*.

Keterkaitan studi kasus ini dengan materi bab: empat prinsip 6.1 menjadi kriteria penerimaan tidak tertulis — layar harus konsisten (staf baru belajar sekali), hierarkis (dipindai cepat), memberi umpan balik (tidak ada aksi yang "diam"), dan thumb-friendly (dipakai sambil berdiri di loket). Komponen 6.2 dan struktur 6.3 menjadi kosa kata bersama antara pengembang dan pengguna: ketika staf berkata "tombol hapus jangan dekat tombol simpan", kini ada bahasa untuk menerjemahkannya (danger vs primary, jarak antar aksi). Wireframe 6.7 menjadi alat negosiasi: sebelum satu baris kode backend ditulis, pengguna sudah bisa mengomentari alur yang salah. Inilah esensi pendekatan UI-first yang dipraktikkan bab ini: antarmuka statis dengan data baku adalah prototipe yang murah untuk memvalidasi kebutuhan, dan kelima data mahasiswa baku pada Praktikum adalah "data uji standar" yang sama yang akan dipakai bab-bab berikutnya hingga Bab 10 menyambungkan server.

Keputusan yang Anda buat hari ini ikut menentukan masa depan aplikasi: jarak dan warna yang konsisten akan terus dipakai saat Bab 7 menambahkan navigasi, Bab 8 menambahkan form, dan Bab 10 mengganti data baku dengan data sungguhan dari server. Bab-bab itu tidak akan mengulang desain; mereka membangun di atas fondasi yang Anda rancang di sini — alur yang sama akan Anda temukan berskala penuh pada Project Akhir buku ini, "Sistem Informasi Akademik Mobile".

## Latihan

### Soal Pemahaman

1. Sebutkan empat prinsip desain UI mobile dan berikan satu contoh penerapan masing-masing pada aplikasi Manajemen Data Mahasiswa.
2. Mengapa sistem jarak 8pt menggunakan kelipatan 8 dan bukan angka arbitrer seperti 5 atau 7? Apa keuntungannya bagi tim pengembang?
3. Jelaskan perbedaan fungsi warna primer dan warna semantik (danger, success). Kapan masing-masing dipakai?
4. Apa fungsi `accessibilityRole` dan `accessibilityLabel` pada komponen Pressable? Mengapa `accessibilityLabel` yang baik tidak berbunyi "Ketuk di sini"?
5. Apa perbedaan peran antara ukuran target sentuh minimal dan properti `hitSlop` dalam aksesibilitas?

### Soal Praktik

1. Tambahkan baris "Status: Aktif" pada kartu CardMahasiswa dengan warna semantik (hijau), lalu sesuaikan wireframe tekstual halaman Daftar pada 6.7 agar wireframe dan implementasi tetap sinkron.
2. Buat variasi tombol baru `sukses` (hijau) pada Tombol.js dengan menambahkan satu baris pada masing-masing peta warna, lalu pakai pada header Daftar untuk tombol "Tambah" dan amati perbedaan hierarkinya dengan variasi secondary.
3. Buat layar statis baru "Tentang Aplikasi" (nama file `screens/TentangAplikasi.js`) berisi header berjudul "Tentang", satu paragraf deskripsi aplikasi, dan daftar versi aplikasi memakai pola pasangan label–nilai dari DetailMahasiswa. Hubungkan (sementara) lewat tombol pada header Daftar menggunakan state seperti App.js.

### Soal Analisis

1. Sebuah aplikasi kampus menampilkan tombol "Hapus Riwayat" berwarna primary (biru) di samping tombol "Simpan", keduanya berukuran 36×36. Analisislah pelanggaran prinsip dan standar yang terjadi (sebutkan prinsip/nilai minimum yang dilanggar), lalu usulkan perbaikan beserta alasan setiap usulan.

2. Bandingkan dua pilihan desain halaman Daftar Mahasiswa: (a) kartu dua baris seperti bab ini, dan (b) tabel padat dengan kolom NIM–Nama–IPK. Analisis trade-off keduanya dari sisi pemindaian visual, kepadatan informasi, target sentuh, dan aksesibilitas; tentukan kapan pilihan (b) lebih masuk akal.

## Tantangan

1. **Dark mode statis.** Tambahkan state `modeGelap` di App.js dan sebuah tombol toggle di header. Buat versi gelap untuk palet 6.4 (latar `#111827`, kartu `#1F2937`, teks `#F9FAFB`) dan sesuaikan seluruh gaya — tanpa mengubah satu pun nilai logika komponen. Perhatikan kontras tiap pasangan warna baru dengan ambang WCAG 4,5:1.
2. **Token terpusat.** Pindahkan semua konstanta warna dan ukuran (WARNA_LENCANA, nilai padding, radius, font) ke satu file `tema/desain.js`, lalu ubah kelima file agar mengimpornya. Pastikan hasil render tidak berubah sama sekali — ini melatih refactoring yang aman.
3. **Master–detail adaptif.** Pada perangkat dengan lebar ≥ 900, tampilkan Daftar dan Detail berdampingan dalam satu layar (daftar 40%, detail 60%) dan sembunyikan tombol Kembali; pada layar sempit, pertahankan perilaku dua layar terpisah seperti sekarang. Gunakan `useWindowDimensions` dan rendering bersyarat — tanpa pustaka navigasi.

## Rangkuman

1. Empat prinsip UI mobile — konsistensi, hierarki visual, umpan balik, dan thumb-friendly — adalah kriteria keputusan desain, bukan sekadar teori.
2. Sistem jarak 8pt (4, 8, 12, 16, 24, 32, dst.) menciptakan ritme visual yang konsisten dan mempercepat keputusan desain.
3. Komponen Card membungkus satu entitas; Button berkomunikasi lewat variasi (primary, secondary, outline, danger); tampilan Form mengikuti pola label di atas input; List menuntut item yang konsisten.
4. Header layar menjawab "di mana saya, apa yang bisa saya lakukan, bagaimana kembali"; bottom navigation adalah pola navigasi bawah 3–5 tab, diimplementasikan pada Bab 7.
5. Skala tipografi (ukuran dan weight baku) membangun hierarki tanpa desain per teks; kapitalisasi diputuskan sadar, bukan kebiasaan.
6. Palet warna berlapis (primer, netral, semantik) dengan kontras minimal 4,5:1 untuk teks normal, dan warna status (normal, ditekan, nonaktif) untuk elemen interaktif.
7. Responsive design memakai Flexbox, persentase, `useWindowDimensions`, dan `numColumns` untuk beradaptasi dengan ukuran layar.
8. Aksesibilitas dasar meliputi `accessibilityRole`, `accessibilityLabel`, `accessibilityState`, dan target sentuh minimal 44×44 (dengan `hitSlop` bila perlu).
9. Pendekatan UI-first — wireframe lalu layar statis dengan data baku — memvalidasi kebutuhan sebelum navigasi (Bab 7), form (Bab 8), dan API (Bab 10) dibangun.
10. Data baku lima mahasiswa dan struktur layar pada bab ini dipakai konsisten hingga Project Akhir buku.

## Refleksi

1. Pilih aplikasi yang paling sering Anda pakai; identifikasi satu keputusan konsistensi dan satu keputusan hierarki visual yang Anda sadari setelah mempelajari bab ini. Apakah keputusannya berubah setelah Anda tahu alasannya?
2. Pernahkah Anda frustrasi menekan tombol yang terlalu kecil atau tidak memberi respons? Bagaimana perasaan itu mengubah cara Anda memperlakukan target sentuh dan umpan balik pada aplikasi buatan sendiri?
3. Sebagai calon profesional SI, di mana posisi keterampilan antarmuka dalam pekerjaan Anda kelak — apakah Anda akan mengerjakannya sendiri, atau berkomunikasi dengan perancang UI? Apa yang bab ini ajarkan tentang bahasa bersama keduanya?
4. Wireframe pada 6.7 dibuat sebelum kode. Menurut pengalaman belajar Anda sejauh ini, apakah merancang lebih dulu terasa membuang waktu atau justru menghemat waktu? Apa buktinya dari praktikum yang baru Anda selesaikan?

## Evaluasi Bab

### Pilihan Ganda

1. Prinsip UI yang menuntut elemen serupa tampil dan berperilaku serupa disebut ...
   A. hierarki visual
   B. konsistensi
   C. umpan balik
   D. thumb-friendly

2. Manakah urutan nilai yang seluruhnya termasuk sistem jarak 8pt?
   A. 4, 8, 12, 16, 24
   B. 5, 10, 15, 20, 30
   C. 8, 16, 20, 24, 28
   D. 4, 6, 8, 10, 12

3. Tombol dengan latar merah digunakan untuk ...
   A. aksi utama menyimpan data
   B. aksi berisiko seperti menghapus data
   C. aksi kembali ke halaman sebelumnya
   D. menampilkan informasi tambahan

4. Pada tombol nonaktif (disabled), kombinasi yang tepat adalah ...
   A. latar biru, teks biru
   B. latar abu pudar, teks redup, dan `disabled={true}`
   C. latar putih dengan garis tepi tebal
   D. latar merah dengan teks putih

5. Ambang rasio kontras WCAG level AA untuk teks normal adalah ...
   A. 2:1
   B. 3:1
   C. 4,5:1
   D. 7:1

6. Ukuran target sentuh minimum yang umum dipakai sebagai acuan industri adalah ...
   A. 24×24 poin
   B. 32×32 poin
   C. 44×44 poin
   D. 80×80 poin

7. `accessibilityLabel` pada sebuah kartu mahasiswa akan dibacakan oleh pembaca layar sebagai ...
   A. teks visual yang tampak di layar
   B. peran elemen, misalnya "tombol"
   C. status elemen, misalnya "nonaktif"
   D. teks alternatif yang kita definisikan, misalnya "Buka detail Budi Santoso, NIM 2201001"

8. Fungsi `useWindowDimensions` pada layar Daftar Mahasiswa adalah ...
   A. mengatur warna berdasarkan orientasi
   B. mengembalikan lebar/tinggi layar dan memperbarui tampilan saat ukuran berubah
   C. menggantikan kebutuhan FlatList
   D. mengatur target sentuh minimum

9. Alasan utama tombol aksi penting diletakkan di bagian bawah layar adalah ...
   A. sesuai kebiasaan aplikasi desktop
   B. memudahkan jangkauan ibu jari saat memegang ponsel satu tangan
   C. menambah ruang bagi iklan
   D. agar tidak menutupi judul layar

10. Pendekatan yang benar dalam membangun layar pada bab ini adalah ...
    A. langsung menulis kode backend lalu mendesain tampilan
    B. wireframe terlebih dahulu, lalu layar statis dengan data baku, sebelum navigasi dan API
    C. menggabungkan navigasi dan pengambilan data sejak awal
    D. menggunakan TypeScript agar lebih aman

### Soal Uraian

1. Jelaskan bagaimana keempat prinsip pada 6.1 diterapkan secara konkret pada komponen CardMahasiswa (sebutkan minimal satu wujud nyata untuk setiap prinsip).
2. Sebuah layar memakai lima ukuran huruf berbeda (11, 13, 15, 17, 19) dan jarak antar elemen yang tidak beraturan. Identifikasi masalah desainnya, lalu usulkan perbaikan dengan skala tipografi dan sistem 8pt, beserta nilai-nilai yang Anda pilih.
3. Untuk layar Detail Mahasiswa, mengapa tombol Hapus menggunakan variasi danger dan tombol Edit menggunakan secondary? Apa yang terjadi secara psikologis pada pengguna bila kedua tombol itu sama-sama berwarna primary?

### Kunci Jawaban

<details>
<summary>Klik untuk membuka kunci jawaban pilihan ganda</summary>

1. B — konsistensi.
2. A — 4, 8, 12, 16, 24 (semua kelipatan sistem 8pt).
3. B — aksi berisiko seperti menghapus data.
4. B — latar abu pudar, teks redup, dan `disabled={true}`.
5. C — 4,5:1 (level AA, teks normal).
6. C — 44×44 poin (acuan industri; Material Design memakai 48×48 dp).
7. D — teks alternatif yang didefinisikan, deskriptif (bukan teks visual atau peran).
8. B — mengembalikan lebar/tinggi layar dan memperbarui tampilan saat ukuran berubah.
9. B — memudahkan jangkauan ibu jari (prinsip thumb-friendly).
10. B — wireframe terlebih dahulu, lalu layar statis dengan data baku (UI-first), sebelum navigasi (Bab 7) dan API (Bab 10).

</details>