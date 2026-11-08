<!-- BERKAS INI DIHASILKAN OTOMATIS dari TUTORIAL.src.md.
     Sunting template-nya, lalu jalankan `npm run build:tutorial`. -->

# Tutorial Bab 5 — Membangun SIAKAD Mobile

Tutorial ini menuntun pembuatan satu aplikasi utuh bertema **data mahasiswa**, dari folder
kosong sampai siap diuji di HP. Setiap langkah menyebut subbab slide yang mendasarinya, jadi
tutorial ini bisa dipakai sebagai naskah mengajar maupun lembar kerja mandiri.

Semua blok kode di bawah **diambil langsung dari berkas project di folder ini**, bukan ditulis
ulang. Kalau kamu macet, bandingkan hasilmu dengan berkas yang disebut di atas setiap blok —
isinya harus sama persis.

---

## Apa yang akan dibangun

Aplikasi **SIAKAD Mobile** dengan lima layar:

| Layar | Berkas | Isi |
|---|---|---|
| Beranda | `screens/BerandaScreen.js` | Dashboard, dua panel responsif, peringkat IPK |
| Mahasiswa | `screens/MahasiswaScreen.js` | Daftar dengan pencarian dan pengurutan |
| Detail | `screens/DetailMahasiswaScreen.js` | Profil, ringkasan akademik, catatan bimbingan |
| Mata Kuliah | `screens/KatalogScreen.js` | Katalog grid dengan jumlah kolom mengikuti lebar |
| Info | `screens/TentangScreen.js` | Padanan React Web/Native, `Platform.OS`, tabel scroller |

Data contoh: 8 mahasiswa dan 7 mata kuliah, semuanya statis di `data/mahasiswa.js`.

---

## Sebelum mulai

**Prasyarat:** project Expo dari Bab 2 sudah pernah dibuat dan dijalankan; Node.js ≥ 22;
Expo Go di HP atau emulator Android/iOS. Tidak ada pustaka UI, navigasi, atau data tambahan —
project ini hanya memakai `react`, `react-native`, dan `expo-status-bar`.

**Perkiraan waktu:** 2 sesi × 100 menit. Pembagian yang dipakai di tutorial ini:

| Bagian | Langkah | Isi | Waktu |
|---|---|---|---|
| A | 1–3 | Project, token tampilan, data | 25 menit |
| B | 4–9 | Tujuh komponen inti | 60 menit |
| C | 10–15 | Lima layar | 90 menit |
| D | 16–19 | Perakitan, pengujian, build | 25 menit |

**Cara memakai:** bacakan bagian **Kenapa** sebagai pertanyaan ke kelas sebelum kodenya
dijalankan; bagian **Sering salah** adalah gejala yang paling sering muncul di lab.

**Tiga penanda di sepanjang tutorial:**

- **Cek** — apa yang harus terlihat di layar setelah langkah ini. Kalau tidak sesuai, jangan
  lanjut dulu.
- **Sering salah** — gejala, sebab, dan perbaikannya.
- **Kenapa** — alasan keputusan teknisnya, lengkap dengan rujukan subbab slide.

---

## Peta langkah

| Langkah | Yang dibuat | Rujukan slide |
|---|---|---|
| 1 | Project Expo dan struktur folder | Bab 2 (pengulangan) |
| 2 | `theme/warna.js` | 3.1, 3.4, 4.9 |
| 3 | `data/mahasiswa.js` | 2.10, 3.4 |
| 4 | `LabelStatus` + App sementara | 2.1–2.2, 3.1–3.3 |
| 5 | `AvatarPlaceholder` | 2.3 |
| 6 | `TombolAksi` | 2.5–2.6, 3.2 |
| 7 | `KotakPencarian` | 2.4 |
| 8 | `BarisInfo`, `KartuStatistik` | 4.3–4.7 |
| 9 | `BarisMahasiswa` | 2.10, 3.3 |
| 10 | `MahasiswaScreen` | 2.8, 5.2 |
| 11 | `DetailMahasiswaScreen` | 2.7, 5.1, 5.5 |
| 12 | Uji dua layar pertama | 2.10 |
| 13 | `BerandaScreen` | 4.1–4.9 |
| 14 | `KartuMataKuliah`, `KatalogScreen` | 5.2, 4.9 |
| 15 | `TentangScreen` | 1.1–1.4, 5.3–5.4 |
| 16 | `TabBar` | 2.6, 3.3 |
| 17 | `App.js` final | 2.9, 5.3 |
| 18 | Pengujian dan build web | 4.10, 5.4–5.5 |

---

# Bagian A — Fondasi

## Langkah 1 — Membuat project dan struktur folder

Buat project baru dengan template paling polos. Jangan pilih template `tabs`: ia sudah membawa
expo-router dan puluhan berkas yang harus dibongkar lebih dulu, padahal navigasi baru dibahas
di Bab 7.

```bash
npx create-expo-app@latest siakad-mobile --template blank
cd siakad-mobile
mkdir components data screens theme
npx expo start
```

Nama folder bebas — di repo ini folder contohnya bernama `bab-05-mahasiswa`. Yang penting
konsisten sampai akhir.

**Cek:** terminal menampilkan QR dan menu; tekan `w` untuk membuka versi web. Yang muncul
masih halaman bawaan "Open up App.js to start working on your app!".

Sekarang sesuaikan `app.json`. Empat nilai yang penting: `name`, `slug`, `orientation`, dan
`supportsTablet`. `orientation` diubah menjadi `default` supaya layar boleh diputar — tanpa itu
uji responsif di Langkah 13 tidak mungkin dilakukan.

**`app.json`**

```json
{
  "expo": {
    "name": "SIAKAD Mobile",
    "slug": "bab-05-mahasiswa",
    "version": "1.0.0",
    "orientation": "default",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/android-icon-foreground.png",
        "backgroundImage": "./assets/android-icon-background.png",
        "monochromeImage": "./assets/android-icon-monochrome.png"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```


> Bandingkan dengan `app.json` di project ini. Kalau template Expo-mu punya kunci tambahan
> (misalnya `splash` atau `plugins`), biarkan saja; yang perlu disamakan hanya empat nilai di
> atas.

Dependensi yang dipakai sepanjang tutorial ini sengaja sedikit — tidak ada pustaka navigasi,
pustaka UI, atau pustaka data:

**`package.json`**

```json
{
  "name": "bab-05-mahasiswa",
  "version": "1.0.0",
  "private": true,
  "main": "index.js",
  "description": "SIAKAD Mobile — project contoh bertema data mahasiswa untuk Bab 5 (Dasar React Native)",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "export:web": "expo export --platform web"
  },
  "dependencies": {
    "expo": "~57.0.31",
    "expo-status-bar": "~57.0.1",
    "react": "19.2.3",
    "react-native": "0.86.3"
  },
  "devDependencies": {
    "@expo/metro-runtime": "57.0.17",
    "react-dom": "19.2.3",
    "react-native-web": "0.21.4"
  }
}
```


`@expo/metro-runtime`, `react-dom`, dan `react-native-web` hanya dibutuhkan bila kamu ingin
membuka aplikasi di browser. Kalau kamu hanya menguji di HP atau emulator, ketiganya boleh
tidak dipasang.

Berkas `index.js` dari template Expo dibiarkan apa adanya: isinya hanya mendaftarkan `App.js`
sebagai komponen akar. Kamu tidak perlu menyentuhnya sepanjang tutorial ini.

**Sering salah:** lupa `mkdir`, lalu menyimpan berkas di folder yang belum ada sehingga Metro
mengeluh "Unable to resolve module".

**Kenapa:** struktur folder `components/`, `screens/`, `theme/`, `data/` memisahkan benda yang
berbeda peran. Satu layar boleh berisi banyak komponen kecil; komponen tidak boleh tahu layar
mana yang memakainya.

---

## Langkah 2 — Token tampilan

Sebelum menulis komponen pertama, tetapkan warna, jarak, radius, ukuran teks, dan breakpoint di
satu tempat.

**`theme/warna.js`**

```jsx
// Token tampilan SIAKAD Mobile, dipakai bersama seluruh layar.
//
// Rujukan slide Bab 5: Bagian 3, subbab 3.4 — "warna dan ukuran disimpan sebagai
// konstanta agar konsisten". Semua layar mengimpor dari sini, jadi satu perubahan
// desain cukup disunting sekali.
//
// Tidak ada file CSS di project ini: gaya tetap ditulis sebagai objek JavaScript
// lewat StyleSheet.create() di masing-masing komponen (subbab 3.1).

export const WARNA = {
  latar: '#f1f5f9',
  permukaan: '#ffffff',
  permukaanRedup: '#e8eef6',
  garis: '#dbe3ec',

  tinta: '#0f172a',
  tintaRedup: '#5a6b85',

  utama: '#1d4ed8',
  utamaMuda: '#e4ecfe',
  utamaTua: '#173aa8',

  sukses: '#15803d',
  suksesMuda: '#dcfce7',

  peringatan: '#b45309',
  peringatanMuda: '#fef3c7',

  bahaya: '#b91c1c',
  bahayaMuda: '#fee2e2',

  netral: '#475569',
  netralMuda: '#e2e8f0',
};

export const JARAK = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 18,
  bulat: 999,
};

export const TEKS = {
  judulLayar: 22,
  judul: 17,
  isi: 14,
  kecil: 12,
  mungil: 11,
};

// Satu-satunya breakpoint project ini.
// Rujukan slide: Bagian 4, subbab 4.9 — "ambang seperti 600 dipakai untuk memilih
// susunan, bukan menamai perangkat".
export const BREAKPOINT_LEBAR = 600;
```


**Cek:** belum ada yang berubah di layar. Berkas ini baru terasa pengaruhnya mulai Langkah 4.

**Kenapa:** di React Native tidak ada berkas CSS dan tidak ada cascade. Gaya ditulis sebagai
objek JavaScript dengan `camelCase`, lalu dipakai per komponen (subbab 3.1). Kalau warna yang
sama ditulis di sepuluh tempat, satu perubahan desain berarti sepuluh suntingan (subbab 3.4).

---

## Langkah 3 — Data dan nilai turunan

Data statis diletakkan di luar komponen, bersama fungsi yang menghitung nilai turunannya.

**`data/mahasiswa.js`**

```jsx
// Sumber data statis aplikasi — sengaja di luar komponen.
//
// Rujukan slide Bab 5: subbab 2.10 (data dikirim ke komponen lewat props) dan
// subbab 3.4 (nilai yang dipakai berulang disimpan di satu tempat).
//
// Semua nilai turunan (predikat, rata-rata IPK, sebaran prodi) dihitung dengan
// fungsi di bawah, bukan disimpan sebagai state. State hanya untuk hal yang
// berubah karena interaksi pengguna.

export const DAFTAR_MAHASISWA = [
  {
    id: '1',
    nama: 'Budi Santoso',
    nim: '22101001',
    prodi: 'Sistem Informasi',
    angkatan: 2022,
    ipk: 3.62,
    sksLulus: 118,
    status: 'Aktif',
    pembimbing: 'Dr. Ratna Kusuma',
    // Foto dari jaringan: `source` menerima objek { uri }. Kalau gagal dimuat,
    // AvatarPlaceholder jatuh ke inisial (lihat components/AvatarPlaceholder.js).
    fotoUri: 'https://i.pravatar.cc/160?img=12',
  },
  {
    id: '2',
    nama: 'Siti Aminah',
    nim: '22101002',
    prodi: 'Informatika',
    angkatan: 2022,
    ipk: 3.18,
    sksLulus: 112,
    status: 'Aktif',
    pembimbing: 'Ir. Hendra Wijaya',
    fotoUri: null,
  },
  {
    id: '3',
    nama: 'Rizky Pratama',
    nim: '22101003',
    prodi: 'Sistem Informasi',
    angkatan: 2022,
    ipk: 2.87,
    sksLulus: 104,
    status: 'Aktif',
    pembimbing: 'Dr. Ratna Kusuma',
    fotoUri: null,
  },
  {
    id: '4',
    nama: 'Dewi Lestari',
    nim: '22101004',
    prodi: 'Informatika',
    angkatan: 2022,
    ipk: 3.91,
    sksLulus: 126,
    status: 'Aktif',
    pembimbing: 'Ir. Hendra Wijaya',
    fotoUri: null,
  },
  {
    id: '5',
    nama: 'Andi Wijaya',
    nim: '22101005',
    prodi: 'Sistem Informasi',
    angkatan: 2023,
    ipk: 3.05,
    sksLulus: 78,
    status: 'Aktif',
    pembimbing: 'Dr. Ratna Kusuma',
    fotoUri: null,
  },
  {
    id: '6',
    nama: 'Nurul Hidayah',
    nim: '22101006',
    prodi: 'Informatika',
    angkatan: 2023,
    ipk: 3.44,
    sksLulus: 82,
    status: 'Aktif',
    pembimbing: 'Ir. Hendra Wijaya',
    fotoUri: null,
  },
  {
    id: '7',
    nama: 'Fajar Nugroho',
    nim: '22101007',
    prodi: 'Sistem Informasi',
    angkatan: 2023,
    ipk: 2.66,
    sksLulus: 74,
    status: 'Cuti',
    pembimbing: 'Dr. Ratna Kusuma',
    fotoUri: null,
  },
  {
    id: '8',
    nama: 'Putri Maharani',
    nim: '22101008',
    prodi: 'Informatika',
    angkatan: 2023,
    ipk: 3.77,
    sksLulus: 86,
    status: 'Aktif',
    pembimbing: 'Ir. Hendra Wijaya',
    fotoUri: null,
  },
];

export const DAFTAR_MATA_KULIAH = [
  {
    id: 'mk-1',
    kode: 'SI3101',
    nama: 'Pemrograman Mobile',
    sks: 3,
    semester: 5,
    dosen: 'Dr. Ratna Kusuma',
    kategori: 'Wajib',
    ruang: 'Lab Komputer 2',
  },
  {
    id: 'mk-2',
    kode: 'SI3102',
    nama: 'Basis Data Lanjut',
    sks: 3,
    semester: 5,
    dosen: 'Ir. Hendra Wijaya',
    kategori: 'Wajib',
    ruang: 'Ruang 2.3',
  },
  {
    id: 'mk-3',
    kode: 'SI3103',
    nama: 'Analisis Proses Bisnis',
    sks: 2,
    semester: 5,
    dosen: 'Dra. Maya Sari',
    kategori: 'Wajib',
    ruang: 'Ruang 1.1',
  },
  {
    id: 'mk-4',
    kode: 'SI3104',
    nama: 'Desain Antarmuka Pengguna',
    sks: 3,
    semester: 5,
    dosen: 'Dra. Maya Sari',
    kategori: 'Pilihan',
    ruang: 'Studio Desain',
  },
  {
    id: 'mk-5',
    kode: 'SI3105',
    nama: 'Rekayasa Perangkat Lunak',
    sks: 3,
    semester: 5,
    dosen: 'Ir. Hendra Wijaya',
    kategori: 'Wajib',
    ruang: 'Ruang 2.1',
  },
  {
    id: 'mk-6',
    kode: 'SI3106',
    nama: 'Keamanan Informasi',
    sks: 2,
    semester: 6,
    dosen: 'Dr. Bagus Prakoso',
    kategori: 'Pilihan',
    ruang: 'Ruang 3.2',
  },
  {
    id: 'mk-7',
    kode: 'SI3107',
    nama: 'Manajemen Proyek TI',
    sks: 3,
    semester: 6,
    dosen: 'Dra. Maya Sari',
    kategori: 'Wajib',
    ruang: 'Ruang 2.2',
  },
];

// ---------------------------------------------------------------------------
// Nilai turunan
// ---------------------------------------------------------------------------

// Format IPK selalu dua angka di belakang koma, termasuk saat nilainya bulat.
export function formatIPK(ipk) {
  return ipk.toFixed(2);
}

// Predikat akademik: satu fungsi, satu sumber kebenaran.
// `jenis` dipakai LabelStatus untuk memilih warna, bukan warna yang disimpan
// di dalam state (rujukan slide: subbab 3.3).
export function predikatAkademik(ipk) {
  if (ipk >= 3.5) return { jenis: 'baik', label: 'Sangat baik' };
  if (ipk >= 3.0) return { jenis: 'sedang', label: 'Baik' };
  return { jenis: 'kurang', label: 'Perlu perhatian' };
}

// Ringkasan dashboard dihitung dari daftar, bukan ditulis ulang sebagai angka
// tetap — supaya tidak ada dua sumber kebenaran.
export function hitungRingkasan(daftar) {
  const total = daftar.length;
  const rataIpk = daftar.reduce((jumlah, m) => jumlah + m.ipk, 0) / total;
  const berprestasi = daftar.filter((m) => m.ipk >= 3.5).length;
  const cuti = daftar.filter((m) => m.status === 'Cuti').length;
  return {
    total,
    rataIpk: Number(rataIpk.toFixed(2)),
    berprestasi,
    cuti,
  };
}

export function sebaranProdi(daftar) {
  const peta = daftar.reduce((hasil, m) => {
    hasil[m.prodi] = (hasil[m.prodi] ?? 0) + 1;
    return hasil;
  }, {});
  const terbanyak = Math.max(...Object.values(peta));
  return Object.entries(peta).map(([prodi, jumlah]) => ({
    prodi,
    jumlah,
    // `porsi` 0–1 dipakai untuk lebar bar di dashboard.
    porsi: jumlah / terbanyak,
  }));
}

export function peringkatIpk(daftar, jumlah = 3) {
  return [...daftar].sort((a, b) => b.ipk - a.ipk).slice(0, jumlah);
}

export function cariMahasiswa(id) {
  return DAFTAR_MAHASISWA.find((m) => m.id === id) ?? null;
}
```


Perhatikan tiga hal:

1. Satu mahasiswa (`Budi Santoso`) punya `fotoUri`; sisanya `null`. Dua jalur `Image` ini
   dilatih di Langkah 5.
2. `predikatAkademik()` mengembalikan `jenis` (`baik`/`sedang`/`kurang`), bukan warna. Yang
   memilih warna adalah komponen (subbab 3.3).
3. `hitungRingkasan()`, `sebaranProdi()`, dan `peringkatIpk()` selalu dihitung dari daftar —
   tidak ada angka yang disimpan terpisah, jadi tidak mungkin basi.

**Cek:** belum ada tampilan. Fungsi-fungsi ini dipakai mulai Langkah 9 dan 13.

**Sering salah:** menyimpan hasil hitungan ke `useState`, lalu lupa memperbaruinya ketika data
berubah. Nilai turunan dihitung saat render; state hanya untuk hal yang berubah karena
interaksi pengguna (subbab 2.4 dan 3.3).

---

# Bagian B — Komponen inti

Mulai di sini, semua berkas yang dibuat akan langsung terlihat. Ganti isi `App.js` dengan
"App sementara" yang ditunjukkan di setiap langkah; berkas itu akan diganti dua kali lagi dan
akhirnya menjadi `App.js` final di Langkah 17.

## Langkah 4 — `LabelStatus`: StyleSheet dan gaya kondisional

Komponen pertama: badge status yang warnanya mengikuti `jenis`.

**`components/LabelStatus.js`**

```jsx
import { StyleSheet, Text, View } from 'react-native';

import { RADIUS, TEKS, WARNA } from '../theme/warna';

// Label status/predikat.
//
// Rujukan slide Bab 5, subbab 3.3: warna dipilih lewat gaya kondisional dari
// `jenis` yang diberikan induk — bukan disimpan sebagai state berisi gaya.
// Perhatikan bahwa semua variasi warna didefinisikan sekali di StyleSheet,
// lalu dipilih saat render.
//
// `jenis`: 'baik' | 'sedang' | 'kurang' | 'netral'
export default function LabelStatus({ label, jenis = 'netral' }) {
  return (
    <View style={[styles.dasar, GAYA_LATAR[jenis]]}>
      <Text style={[styles.teks, GAYA_TEKS[jenis]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dasar: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: RADIUS.bulat,
  },
  teks: {
    fontSize: TEKS.mungil,
    fontWeight: '700',
  },
});

const GAYA_LATAR = StyleSheet.create({
  baik: { backgroundColor: WARNA.suksesMuda },
  sedang: { backgroundColor: WARNA.peringatanMuda },
  kurang: { backgroundColor: WARNA.bahayaMuda },
  netral: { backgroundColor: WARNA.netralMuda },
});

const GAYA_TEKS = StyleSheet.create({
  baik: { color: WARNA.sukses },
  sedang: { color: WARNA.peringatan },
  kurang: { color: WARNA.bahaya },
  netral: { color: WARNA.netral },
});
```


**Cek:** ganti seluruh isi `App.js` dengan berkas sementara berikut, lalu simpan. Expo memuat
ulang otomatis.

```jsx
// App.js — versi sementara. Diganti di Langkah 12, lalu di Langkah 17.
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import LabelStatus from './components/LabelStatus';

export default function App() {
  return (
    <SafeAreaView style={styles.akar}>
      <ScrollView contentContainerStyle={styles.isi}>
        <LabelStatus label="Sangat baik" jenis="baik" />
        <LabelStatus label="Baik" jenis="sedang" />
        <LabelStatus label="Perlu perhatian" jenis="kurang" />
        <LabelStatus label="Aktif" jenis="netral" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  akar: { flex: 1, backgroundColor: '#f1f5f9' },
  isi: { padding: 16, gap: 8 },
});
```

Empat badge dengan warna berbeda, lebarnya mengikuti panjang teks (`alignSelf: 'flex-start'`).

**Sering salah:**

- Menulis `font-size` atau `background-color` di style — React Native mengabaikan nama
  bertanda hubung dan hanya menerima `fontSize`, `backgroundColor`.
- Menulis teks langsung di dalam `View`. Teks wajib dibungkus `Text`; kalau tidak, muncul
  "Text strings must be rendered within a `<Text>` component".

**Kenapa:** di sini gaya kondisional diperkenalkan dalam bentuk paling sederhana — semua
variasi warna didefinisikan sekali di `StyleSheet.create()`, lalu dipilih lewat `jenis` saat
render. Tidak ada state berisi gaya (subbab 3.3).

---

## Langkah 5 — `AvatarPlaceholder`: `Image` dan ukuran eksplisit

Avatar mahasiswa: foto kalau ada, inisial kalau tidak ada atau gagal dimuat.

**`components/AvatarPlaceholder.js`**

```jsx
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

// Avatar mahasiswa.
//
// Rujukan slide Bab 5:
//   • subbab 2.3 — `Image` wajib diberi lebar dan tinggi eksplisit; tanpa itu
//     gambarnya tidak muncul sama sekali (bukan sekadar kecil).
//   • subbab 2.3 — `source` menerima `require('...')` untuk berkas yang dibundel
//     dan `{ uri: '...' }` untuk gambar dari jaringan. Di sini dipakai `uri`.
//   • subbab 3.3 — jatuh ke inisial saat foto kosong atau gagal dimuat; ini juga
//     contoh state lokal yang mengubah tampilan.
//
// Ukuran avatar berbeda-beda per layar, jadi lebar/tinggi/radius dihitung dari
// props. Objek gaya dinamis seperti ini wajar; yang dihindari adalah menulis
// ulang seluruh StyleSheet di dalam render (subbab 3.1).

const PALET = ['#1d4ed8', '#0f766e', '#7c3aed', '#b45309', '#be123c'];

function inisial(nama) {
  const kata = nama.trim().split(/\s+/);
  const depan = kata[0] ? kata[0][0] : '';
  const belakang = kata.length > 1 ? kata[kata.length - 1][0] : '';
  return (depan + belakang).toUpperCase();
}

export default function AvatarPlaceholder({ nama, ukuran = 48, fotoUri = null }) {
  const [gagalDimuat, setGagalDimuat] = useState(false);

  const bingkai = {
    width: ukuran,
    height: ukuran,
    borderRadius: ukuran / 2,
  };

  if (fotoUri && !gagalDimuat) {
    return (
      <Image
        source={{ uri: fotoUri }}
        style={[styles.gambar, bingkai]}
        resizeMode="cover"
        onError={() => setGagalDimuat(true)}
        accessibilityLabel={'Foto ' + nama}
      />
    );
  }

  const latar = PALET[nama.length % PALET.length];

  return (
    <View style={[styles.kotak, bingkai, { backgroundColor: latar }]}>
      <Text style={[styles.huruf, { fontSize: ukuran * 0.34 }]}>{inisial(nama)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gambar: {
    backgroundColor: '#dbe3ec',
  },
  kotak: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  huruf: {
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
```


Tambahkan dua baris ini ke dalam `ScrollView` pada `App.js` sementara:

```jsx
        <AvatarPlaceholder nama="Budi Santoso" ukuran={64} fotoUri="https://i.pravatar.cc/160?img=12" />
        <AvatarPlaceholder nama="Dewi Lestari" ukuran={64} />
```

Jangan lupa menambahkan impornya di bagian atas:

```jsx
import AvatarPlaceholder from './components/AvatarPlaceholder';
```

**Cek:** satu foto bulat berukuran 64 piksel dan satu lingkaran biru bertuliskan "DL". Matikan
internet lalu muat ulang: foto Budi berubah menjadi inisial "BS", aplikasi tidak error.

**Sering salah:** menulis `<Image source={{ uri }} />` tanpa lebar dan tinggi. React Native
tidak menebak ukuran gambar, jadi hasilnya kotak nol piksel — tidak terlihat sama sekali, bukan
"kecil".

**Kenapa:** `source` menerima `require('...')` untuk berkas yang dibundel dan `{ uri }` untuk
gambar dari jaringan (subbab 2.3). Ukuran bergantung props, jadi lebar/tinggi/radius dihitung
saat render; objek gaya dinamis seperti ini wajar, yang dihindari adalah menulis ulang seluruh
`StyleSheet` di dalam render.

---

## Langkah 6 — `TombolAksi`: `Pressable` yang bisa ditata

**`components/TombolAksi.js`**

```jsx
import { Pressable, StyleSheet, Text } from 'react-native';

import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

// Tombol aplikasi.
//
// Rujukan slide Bab 5, subbab 2.5–2.6:
//   • `Pressable`, bukan `Button`, karena tampilannya perlu ditata bebas.
//   • `pressed` pada `style` berupa fungsi: bernilai true saat jari menekan, dan
//     `styles.tertekan` diletakkan paling akhir supaya menimpa gaya dasar
//     (subbab 3.2 — yang belakangan menang).
//   • `hitSlop` memperluas area sentuh tanpa mengubah tampilan visual.
//   • `android_ripple` hanya berefek di Android; di iOS diabaikan.
//
// `jenis`: 'utama' | 'kedua' | 'hantu'
export default function TombolAksi({ label, onPress, jenis = 'utama' }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      android_ripple={{ color: WARNA.utamaMuda }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.dasar,
        GAYA_LATAR[jenis],
        pressed && styles.tertekan,
      ]}
    >
      <Text style={[styles.teks, GAYA_TEKS[jenis]]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dasar: {
    paddingVertical: 10,
    paddingHorizontal: JARAK.lg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  tertekan: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
  teks: {
    fontSize: TEKS.isi,
    fontWeight: '700',
  },
});

const GAYA_LATAR = StyleSheet.create({
  utama: { backgroundColor: WARNA.utama },
  kedua: { backgroundColor: WARNA.permukaan, borderColor: WARNA.garis },
  hantu: { backgroundColor: 'transparent', paddingHorizontal: JARAK.sm },
});

const GAYA_TEKS = StyleSheet.create({
  utama: { color: '#ffffff' },
  kedua: { color: WARNA.tinta },
  hantu: { color: WARNA.utama },
});
```


Tambahkan tiga tombol ke `App.js` sementara:

```jsx
        <TombolAksi label="Simpan catatan" onPress={() => {}} />
        <TombolAksi label="Batal" onPress={() => {}} jenis="kedua" />
        <TombolAksi label="Lihat semua" onPress={() => {}} jenis="hantu" />
```

**Cek:** tombol utama berlatar biru, tombol kedua berlatar putih dengan garis, tombol hantu
tanpa latar. Saat ditekan, ketiganya sedikit memudar dan mengecil.

**Sering salah:**

- Menulis `style={[styles.dasar, pressed && styles.tertekan]}` — di `Pressable`, `style` harus
  berupa fungsi `({ pressed }) => [...]`. Tanpa fungsi, `pressed` tidak pernah ada.
- Meletakkan `styles.tertekan` **sebelum** `styles.dasar`. Gaya yang ditulis belakangan menang
  (subbab 3.2), jadi urutan array adalah urutan prioritas.

**Kenapa:** `Button` bawaan mengikuti gaya platform dan tidak bisa ditata bebas. Begitu desain
meminta radius, ikon, atau warna sendiri, `Pressable` yang dipakai (subbab 2.5–2.6).
`android_ripple` hanya berefek di Android; di iOS ia diabaikan — itu sendiri sudah menjadi bahan
pengamatan perbedaan platform.

---

## Langkah 7 — `KotakPencarian`: `TextInput` controlled

**`components/KotakPencarian.js`**

```jsx
import { Pressable, StyleSheet, TextInput, Text, View } from 'react-native';

import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

// Kotak pencarian.
//
// Rujukan slide Bab 5, subbab 2.7: `TextInput` sebagai *controlled component* —
// nilainya dipegang state induk (`nilai`), dan setiap ketukan dilaporkan lewat
// `onChangeText`. Tanpa `onChangeText`, kotak akan tampak terkunci karena nilainya
// selalu dikembalikan ke `nilai` yang tidak berubah.
//
// Teks tombol hapus memakai `Text`, bukan karakter di dalam `View` (subbab 2.2).
export default function KotakPencarian({ nilai, onUbah, placeholder }) {
  return (
    <View style={styles.kotak}>
      <Text style={styles.ikon}>⌕</Text>
      <TextInput
        style={styles.input}
        value={nilai}
        onChangeText={onUbah}
        placeholder={placeholder}
        placeholderTextColor={WARNA.tintaRedup}
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel="Kolom pencarian mahasiswa"
      />
      {nilai.length > 0 && (
        <Pressable
          onPress={() => onUbah('')}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Hapus pencarian"
          style={({ pressed }) => [styles.hapus, pressed && styles.hapusDitekan]}
        >
          <Text style={styles.hapusTeks}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  kotak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: JARAK.sm,
    paddingHorizontal: JARAK.md,
    backgroundColor: WARNA.permukaan,
    borderWidth: 1,
    borderColor: WARNA.garis,
    borderRadius: RADIUS.md,
  },
  ikon: {
    fontSize: 18,
    color: WARNA.tintaRedup,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: TEKS.isi,
    color: WARNA.tinta,
  },
  hapus: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.bulat,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hapusDitekan: {
    backgroundColor: WARNA.permukaanRedup,
  },
  hapusTeks: {
    fontSize: 13,
    color: WARNA.tintaRedup,
  },
});
```


Kotak ini tidak menyimpan teksnya sendiri; nilainya dipegang induk. Untuk melihatnya, tambahkan
komponen uji kecil di `App.js` sementara:

```jsx
function UjiPencarian() {
  const [cari, setCari] = useState('');
  return (
    <>
      <KotakPencarian nilai={cari} onUbah={setCari} placeholder="Cari mahasiswa…" />
      <Text>State berisi: {cari === '' ? '(kosong)' : cari}</Text>
    </>
  );
}
```

lalu pakai `<UjiPencarian />` di dalam `ScrollView`, dan tambahkan `useState` serta `Text` pada
import:

```jsx
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
```

**Cek:** setiap ketukan langsung muncul di kotak dan di baris teks di bawahnya; tombol ✕ muncul
begitu ada isi dan mengosongkan kotak saat ditekan.

**Sering salah:** menghapus `onChangeText` tetapi mempertahankan `value`. Kotak lalu tampak
terkunci: pengguna mengetik, state tidak berubah, dan React mengembalikan tampilan ke nilai
lama.

**Kenapa:** `TextInput` hanya melaporkan ketukan; nilai sebenarnya dipegang state induk. Itulah
arti *controlled component* (subbab 2.4) — dan alasan penghitung karakter nanti bisa dihitung
dari nilai yang sama.

---

## Langkah 8 — `BarisInfo` dan `KartuStatistik`: Flexbox dasar

Dua komponen kecil untuk menyusun baris "label — nilai" dan kartu angka.

**`components/BarisInfo.js`**

```jsx
import { StyleSheet, Text, View } from 'react-native';

import { TEKS, WARNA } from '../theme/warna';

// Satu baris "label — nilai" untuk kartu profil.
//
// Rujukan slide Bab 5, subbab 4.3–4.4: `justifyContent: 'space-between'`
// mendorong label ke kiri dan nilai ke kanan pada sumbu utama (row). Tidak ada
// lebar tetap sama sekali, jadi baris ini tetap rapi di HP maupun tablet
// (subbab 4.7).
export default function BarisInfo({ label, nilai }) {
  return (
    <View style={styles.baris}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.nilai} numberOfLines={1}>
        {nilai}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  baris: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 7,
  },
  label: {
    fontSize: TEKS.kecil,
    color: WARNA.tintaRedup,
  },
  nilai: {
    flexShrink: 1,
    fontSize: TEKS.isi,
    fontWeight: '600',
    color: WARNA.tinta,
    textAlign: 'right',
  },
});
```


**`components/KartuStatistik.js`**

```jsx
import { StyleSheet, Text, View } from 'react-native';

import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

// Kartu angka ringkasan di dashboard.
//
// Rujukan slide Bab 5, subbab 4.5: kartu ini memakai `flex: 1`, jadi tiga kartu
// dalam satu baris membagi lebar yang tersedia rata — tanpa satu pun angka lebar
// tetap. `minWidth` mencegah kartu menjadi terlalu sempit di layar kecil.
export default function KartuStatistik({ angka, label, aksen = WARNA.utama }) {
  return (
    <View style={styles.kartu}>
      <Text style={[styles.angka, { color: aksen }]} numberOfLines={1}>
        {angka}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: {
    flex: 1,
    minWidth: 96,
    padding: JARAK.md,
    gap: 2,
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: WARNA.garis,
  },
  angka: {
    fontSize: 20,
    fontWeight: '700',
  },
  label: {
    fontSize: TEKS.mungil,
    color: WARNA.tintaRedup,
  },
});
```


Tambahkan ke `App.js` sementara:

```jsx
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <KartuStatistik angka="8" label="Mahasiswa aktif" />
          <KartuStatistik angka="3.31" label="Rata-rata IPK" aksen="#15803d" />
          <KartuStatistik angka="3" label="IPK ≥ 3,50" aksen="#b45309" />
        </View>

        <View>
          <BarisInfo label="IPK" nilai="3.62" />
          <BarisInfo label="SKS lulus" nilai="118 SKS" />
        </View>
```

Tambahkan `View` pada import `react-native`.

**Cek:** tiga kartu berbagi lebar baris secara adil tanpa satu pun angka lebar tetap; pada baris
info, label menempel kiri dan nilai menempel kanan.

**Sering salah:** memakai `justifyContent: 'center'` untuk memusatkan secara mendatar padahal
`flexDirection` masih `column`. Di React Native arah bawaan adalah `column`, berbeda dari web
yang bawaannya `row` (subbab 4.2).

**Kenapa:** pasangan aturannya sederhana dan berlaku terus: `justifyContent` mengatur **sumbu
utama**, `alignItems` mengatur **sumbu silang**. Kalau `flexDirection` diganti, keduanya
bertukar arah (subbab 4.3–4.4). `flex: 1` pada kartu membagi ruang tersisa, bukan menetapkan
lebar (subbab 4.5).

---

## Langkah 9 — `BarisMahasiswa`: props dan komposisi

Satu baris daftar, disusun dari komponen yang sudah ada.

**`components/BarisMahasiswa.js`**

```jsx
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatIPK, predikatAkademik } from '../data/mahasiswa';
import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';
import AvatarPlaceholder from './AvatarPlaceholder';
import LabelStatus from './LabelStatus';

// Satu baris daftar mahasiswa.
//
// Rujukan slide Bab 5:
//   • subbab 2.10 — data masuk lewat props, komponen ini tidak tahu dari mana
//     asalnya.
//   • subbab 3.3 — label predikat memakai gaya kondisional dari hasil
//     predikatAkademik(), bukan state berisi warna.
//   • subbab 5.2 — komponen ini dipakai sebagai `renderItem` FlatList: harus
//     menerima `mahasiswa` dan tidak menyimpan data daftar sendiri.
export default function BarisMahasiswa({ mahasiswa, onPress }) {
  const predikat = predikatAkademik(mahasiswa.ipk);

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: WARNA.permukaanRedup }}
      accessibilityRole="button"
      accessibilityLabel={'Buka detail ' + mahasiswa.nama}
      style={({ pressed }) => [styles.baris, pressed && styles.barisDitekan]}
    >
      <AvatarPlaceholder
        nama={mahasiswa.nama}
        ukuran={44}
        fotoUri={mahasiswa.fotoUri}
      />

      <View style={styles.identitas}>
        <Text style={styles.nama} numberOfLines={1}>
          {mahasiswa.nama}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {mahasiswa.nim} · {mahasiswa.prodi}
        </Text>
        <View style={styles.barisLabel}>
          <LabelStatus label={predikat.label} jenis={predikat.jenis} />
          {mahasiswa.status !== 'Aktif' && (
            <LabelStatus label={mahasiswa.status} jenis="netral" />
          )}
        </View>
      </View>

      <View style={styles.nilai}>
        <Text style={styles.ipk}>{formatIPK(mahasiswa.ipk)}</Text>
        <Text style={styles.ipkLabel}>IPK</Text>
      </View>

      <Text style={styles.panah}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  baris: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: JARAK.md,
    padding: JARAK.md,
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: WARNA.garis,
  },
  barisDitekan: {
    backgroundColor: WARNA.permukaanRedup,
  },
  identitas: {
    flex: 1,
    gap: 2,
  },
  nama: {
    fontSize: TEKS.isi,
    fontWeight: '700',
    color: WARNA.tinta,
  },
  meta: {
    fontSize: TEKS.kecil,
    color: WARNA.tintaRedup,
  },
  barisLabel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: JARAK.xs,
    marginTop: 2,
  },
  nilai: {
    alignItems: 'flex-end',
  },
  ipk: {
    fontSize: TEKS.judul,
    fontWeight: '700',
    color: WARNA.utama,
  },
  ipkLabel: {
    fontSize: TEKS.mungil,
    color: WARNA.tintaRedup,
  },
  panah: {
    fontSize: 22,
    color: WARNA.tintaRedup,
    marginLeft: -2,
  },
});
```


Sekarang `App.js` sementara bisa dirapikan menjadi versi lengkap yang memuat semua komponen.
Ganti seluruh isinya dengan berkas berikut:

```jsx
// App.js — versi sementara. Diganti di Langkah 12, lalu di Langkah 17.
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import AvatarPlaceholder from './components/AvatarPlaceholder';
import BarisInfo from './components/BarisInfo';
import BarisMahasiswa from './components/BarisMahasiswa';
import KartuStatistik from './components/KartuStatistik';
import KotakPencarian from './components/KotakPencarian';
import LabelStatus from './components/LabelStatus';
import TombolAksi from './components/TombolAksi';
import { DAFTAR_MAHASISWA } from './data/mahasiswa';

function UjiPencarian() {
  const [cari, setCari] = useState('');
  return (
    <View style={{ gap: 6 }}>
      <KotakPencarian nilai={cari} onUbah={setCari} placeholder="Cari mahasiswa…" />
      <Text>State berisi: {cari === '' ? '(kosong)' : cari}</Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.akar}>
      <ScrollView contentContainerStyle={styles.isi}>
        <LabelStatus label="Sangat baik" jenis="baik" />
        <LabelStatus label="Baik" jenis="sedang" />
        <LabelStatus label="Perlu perhatian" jenis="kurang" />

        <AvatarPlaceholder nama="Budi Santoso" ukuran={64} fotoUri="https://i.pravatar.cc/160?img=12" />
        <AvatarPlaceholder nama="Dewi Lestari" ukuran={64} />

        <TombolAksi label="Simpan catatan" onPress={() => {}} />
        <TombolAksi label="Batal" onPress={() => {}} jenis="kedua" />

        <UjiPencarian />

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <KartuStatistik angka="8" label="Mahasiswa aktif" />
          <KartuStatistik angka="3.31" label="Rata-rata IPK" aksen="#15803d" />
          <KartuStatistik angka="3" label="IPK ≥ 3,50" aksen="#b45309" />
        </View>

        <View>
          <BarisInfo label="IPK" nilai="3.62" />
          <BarisInfo label="SKS lulus" nilai="118 SKS" />
        </View>

        {DAFTAR_MAHASISWA.slice(0, 3).map((m) => (
          <BarisMahasiswa key={m.id} mahasiswa={m} onPress={() => {}} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  akar: { flex: 1, backgroundColor: '#f1f5f9' },
  isi: { padding: 16, gap: 12 },
});
```

**Cek:** tiga baris mahasiswa muncul di bagian bawah, rapi seperti kartu: avatar, nama, NIM,
badge predikat, IPK di kanan, dan tanda `›`.

**Sering salah:** menuliskan baris satu per satu secara manual. Kalau datanya bertambah, layar
harus disunting lagi. `.map()` dengan `key` sudah cukup untuk daftar pendek; untuk daftar yang
bisa memanjang, kita pakai `FlatList` di langkah berikutnya.

**Kenapa:** `BarisMahasiswa` hanya menerima `mahasiswa` dan `onPress`. Ia tidak tahu dari mana
datanya berasal — inilah syarat supaya komponen yang sama bisa dipakai `FlatList` sebagai
`renderItem` tanpa perubahan (subbab 2.10 dan 5.2).

---

# Bagian C — Lima layar

## Langkah 10 — `MahasiswaScreen`: `FlatList`, pencarian, pengurutan

**`screens/MahasiswaScreen.js`**

```jsx
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import BarisMahasiswa from '../components/BarisMahasiswa';
import KotakPencarian from '../components/KotakPencarian';
import { DAFTAR_MAHASISWA } from '../data/mahasiswa';
import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

// Daftar mahasiswa — pencarian, pengurutan, dan FlatList.
//
// Rujukan slide Bab 5:
//   • subbab 2.9 & 5.2 — `FlatList` dengan tiga properti wajib: `data`,
//     `renderItem`, dan `keyExtractor`. `keyExtractor` memakai `item.id`, bukan
//     indeks array, karena indeks bergeser saat data difilter.
//   • subbab 2.7 — `TextInput` pencarian adalah controlled component; hasil
//     pencarian adalah nilai turunan, jadi tidak perlu state kedua.
//   • subbab 3.3 — tombol urut memakai array style untuk keadaan aktif.
//   • subbab 5.2 — `ListHeaderComponent`, `ListEmptyComponent`,
//     `ItemSeparatorComponent`, dan `ListFooterComponent` dipakai apa adanya.
export default function MahasiswaScreen({ onBukaDetail }) {
  const [kataKunci, setKataKunci] = useState('');
  const [urutIpk, setUrutIpk] = useState(false);

  const kunci = kataKunci.trim().toLowerCase();

  // Nilai turunan: dihitung saat render, bukan disimpan di state. Kalau daftar
  // sumber berubah, hasil pencarian ikut berubah tanpa sinkronisasi manual.
  const tersaring = DAFTAR_MAHASISWA.filter((m) => {
    if (kunci === '') return true;
    return (
      m.nama.toLowerCase().includes(kunci) ||
      m.nim.includes(kunci) ||
      m.prodi.toLowerCase().includes(kunci)
    );
  });

  // Salinan baru sebelum diurutkan: `sort` mengubah array aslinya.
  const urut = [...tersaring].sort((a, b) =>
    urutIpk ? b.ipk - a.ipk : a.nama.localeCompare(b.nama),
  );

  return (
    <FlatList
      style={styles.layar}
      contentContainerStyle={styles.isi}
      data={urut}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <BarisMahasiswa mahasiswa={item} onPress={() => onBukaDetail(item.id)} />
      )}
      ItemSeparatorComponent={() => <View style={styles.pemisah} />}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.kepala}>
          <Text style={styles.judul}>Data mahasiswa</Text>
          <Text style={styles.subJudul}>
            Cari berdasarkan nama, NIM, atau program studi.
          </Text>

          <KotakPencarian
            nilai={kataKunci}
            onUbah={setKataKunci}
            placeholder="Cari mahasiswa…"
          />

          <View style={styles.barisAlat}>
            <Text style={styles.jumlah}>
              {urut.length} dari {DAFTAR_MAHASISWA.length} mahasiswa
            </Text>
            <Pressable
              onPress={() => setUrutIpk((sebelumnya) => !sebelumnya)}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel="Ubah urutan daftar"
              style={({ pressed }) => [
                styles.tombolUrut,
                urutIpk && styles.tombolUrutAktif,
                pressed && styles.tombolUrutDitekan,
              ]}
            >
              <Text style={[styles.teksUrut, urutIpk && styles.teksUrutAktif]}>
                {urutIpk ? 'IPK tertinggi' : 'Nama A–Z'}
              </Text>
            </Pressable>
          </View>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.kosong}>
          <Text style={styles.ikonKosong}>⌕</Text>
          <Text style={styles.judulKosong}>Tidak ada mahasiswa yang cocok</Text>
          <Text style={styles.teksKosong}>
            Kata kunci “{kataKunci}” tidak ditemukan pada nama, NIM, maupun program studi.
            Hapus pencarian untuk melihat seluruh daftar.
          </Text>
        </View>
      }
      ListFooterComponent={
        <Text style={styles.catatanKaki}>
          Daftar ini dirender bertahap oleh FlatList: hanya item di sekitar layar yang
          dibuat. Itu sebabnya daftar panjang tetap ringan, dan sebabnya FlatList tidak
          boleh dibungkus ScrollView searah.
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  layar: {
    flex: 1,
    backgroundColor: WARNA.latar,
  },
  isi: {
    padding: JARAK.lg,
    paddingBottom: JARAK.xxl,
  },
  kepala: {
    gap: JARAK.sm,
    marginBottom: JARAK.md,
  },
  judul: {
    fontSize: TEKS.judulLayar,
    fontWeight: '700',
    color: WARNA.tinta,
  },
  subJudul: {
    fontSize: TEKS.kecil,
    color: WARNA.tintaRedup,
    marginBottom: JARAK.xs,
  },
  barisAlat: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: JARAK.sm,
    marginTop: JARAK.xs,
  },
  jumlah: {
    flexShrink: 1,
    fontSize: TEKS.kecil,
    color: WARNA.tintaRedup,
  },
  tombolUrut: {
    paddingVertical: 4,
    paddingHorizontal: JARAK.sm,
    borderRadius: RADIUS.bulat,
    borderWidth: 1,
    borderColor: WARNA.garis,
    backgroundColor: WARNA.permukaan,
  },
  tombolUrutAktif: {
    borderColor: WARNA.utama,
    backgroundColor: WARNA.utamaMuda,
  },
  tombolUrutDitekan: {
    opacity: 0.85,
  },
  teksUrut: {
    fontSize: TEKS.mungil,
    fontWeight: '600',
    color: WARNA.tintaRedup,
  },
  teksUrutAktif: {
    color: WARNA.utama,
  },
  pemisah: {
    height: JARAK.sm,
  },
  kosong: {
    alignItems: 'center',
    gap: JARAK.xs,
    paddingVertical: JARAK.xxl,
    paddingHorizontal: JARAK.lg,
  },
  ikonKosong: {
    fontSize: 28,
    color: WARNA.tintaRedup,
  },
  judulKosong: {
    fontSize: TEKS.isi,
    fontWeight: '700',
    color: WARNA.tinta,
    textAlign: 'center',
  },
  teksKosong: {
    fontSize: TEKS.kecil,
    lineHeight: 18,
    color: WARNA.tintaRedup,
    textAlign: 'center',
  },
  catatanKaki: {
    marginTop: JARAK.lg,
    fontSize: TEKS.mungil,
    lineHeight: 17,
    color: WARNA.tintaRedup,
  },
});
```


Untuk melihatnya, ganti isi `App.js` sementara dengan satu layar ini:

```jsx
import MahasiswaScreen from './screens/MahasiswaScreen';

export default function App() {
  return <MahasiswaScreen onBukaDetail={() => {}} />;
}
```

**Cek:**

- 8 baris muncul; ketik `informatika` → tinggal 4 baris dan tulisan "4 dari 8 mahasiswa".
- Tekan tombol urut: daftar berpindah antara A–Z dan IPK tertinggi.
- Ketik kata yang tidak ada (misalnya `zzz`) → muncul kotak "Tidak ada mahasiswa yang cocok".
- Gulir sampai bawah → catatan kaki tentang virtualisasi terlihat.

**Sering salah:**

- `keyExtractor` memakai indeks array. Saat data difilter, indeks bergeser dan baris bisa
  tercocokkan dengan data yang salah. Pakai `item.id` (subbab 5.2).
- Membungkus `FlatList` dengan `ScrollView`. Dua scroller searah membuat virtualisasi rusak dan
  Metro menampilkan peringatan `VirtualizedLists should never be nested inside plain
  ScrollViews` (subbab 5.2).
- Mengurutkan `tersaring` tanpa menyalin lebih dulu (`[...tersaring].sort(...)`). `sort`
  mengubah array aslinya.

**Kenapa:** `FlatList` butuh tiga properti: `data`, `renderItem`, dan `keyExtractor`. Sisanya
opsional tetapi dipakai semua di sini — `ListHeaderComponent` (judul dan pencarian ikut
tergulir), `ListEmptyComponent`, `ItemSeparatorComponent`, dan `ListFooterComponent`.

---

## Langkah 11 — `DetailMahasiswaScreen`: `ScrollView` dan formulir

**`screens/DetailMahasiswaScreen.js`**

```jsx
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import AvatarPlaceholder from '../components/AvatarPlaceholder';
import BarisInfo from '../components/BarisInfo';
import LabelStatus from '../components/LabelStatus';
import TombolAksi from '../components/TombolAksi';
import {
  DAFTAR_MATA_KULIAH,
  cariMahasiswa,
  formatIPK,
  predikatAkademik,
} from '../data/mahasiswa';
import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

const BATAS_CATATAN = 200;

// Detail mahasiswa — tempat paling banyak komponen inti bertemu.
//
// Rujukan slide Bab 5:
//   • subbab 2.3 — `Image` (lewat AvatarPlaceholder) dengan ukuran eksplisit.
//   • subbab 2.7 — `TextInput` catatan sebagai controlled component; penghitung
//     karakter adalah nilai turunan, bukan state tambahan.
//   • subbab 3.2 — array style dipakai untuk keadaan tombol dan label.
//   • subbab 5.1 — `ScrollView` dipakai karena isinya konten statis satu
//     mahasiswa (bukan daftar panjang), dengan `contentContainerStyle` untuk
//     jarak di dalam area gulir.
//   • subbab 5.5 — `keyboardShouldPersistTaps` supaya tombol Simpan langsung
//     merespons saat papan ketik terbuka.
export default function DetailMahasiswaScreen({ mahasiswaId, onKembali }) {
  const mahasiswa = cariMahasiswa(mahasiswaId);

  const [catatan, setCatatan] = useState('');
  const [tersimpan, setTersimpan] = useState(false);

  if (!mahasiswa) {
    return (
      <View style={styles.tidakDitemukan}>
        <Text style={styles.judul}>Mahasiswa tidak ditemukan</Text>
        <TombolAksi label="Kembali" onPress={onKembali} jenis="kedua" />
      </View>
    );
  }

  const predikat = predikatAkademik(mahasiswa.ipk);
  const sisaKarakter = BATAS_CATATAN - catatan.length;

  const simpanCatatan = () => {
    if (catatan.trim() === '') return;
    setTersimpan(true);
  };

  return (
    <ScrollView
      style={styles.layar}
      contentContainerStyle={styles.isi}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        onPress={onKembali}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Kembali ke daftar mahasiswa"
        style={({ pressed }) => [styles.kembali, pressed && styles.kembaliDitekan]}
      >
        <Text style={styles.teksKembali}>‹ Kembali</Text>
      </Pressable>

      <View style={styles.kartuProfil}>
        <AvatarPlaceholder
          nama={mahasiswa.nama}
          ukuran={72}
          fotoUri={mahasiswa.fotoUri}
        />

        <View style={styles.identitas}>
          <Text style={styles.nama}>{mahasiswa.nama}</Text>
          <Text style={styles.meta}>
            {mahasiswa.nim} · {mahasiswa.prodi}
          </Text>
          <View style={styles.barisLabel}>
            <LabelStatus label={predikat.label} jenis={predikat.jenis} />
            <LabelStatus
              label={mahasiswa.status}
              jenis={mahasiswa.status === 'Aktif' ? 'baik' : 'netral'}
            />
          </View>
        </View>
      </View>

      <View style={styles.kartu}>
        <Text style={styles.judulKartu}>Ringkasan akademik</Text>
        <BarisInfo label="IPK" nilai={formatIPK(mahasiswa.ipk)} />
        <BarisInfo label="SKS lulus" nilai={mahasiswa.sksLulus + ' SKS'} />
        <BarisInfo label="Angkatan" nilai={String(mahasiswa.angkatan)} />
        <BarisInfo label="Pembimbing akademik" nilai={mahasiswa.pembimbing} />
      </View>

      <View style={styles.kartu}>
        <Text style={styles.judulKartu}>Mata kuliah semester ini</Text>
        {DAFTAR_MATA_KULIAH.map((mataKuliah) => (
          <View key={mataKuliah.id} style={styles.barisMk}>
            <View style={styles.teksMk}>
              <Text style={styles.namaMk} numberOfLines={1}>
                {mataKuliah.nama}
              </Text>
              <Text style={styles.metaMk}>
                {mataKuliah.kode} · {mataKuliah.dosen}
              </Text>
            </View>
            <LabelStatus label={mataKuliah.sks + ' SKS'} jenis="netral" />
          </View>
        ))}
      </View>

      <View style={styles.kartu}>
        <Text style={styles.judulKartu}>Catatan bimbingan</Text>
        <Text style={styles.petunjuk}>
          Ketik catatan untuk mahasiswa ini. Teks di kotak dipegang state, bukan oleh
          komponen input itu sendiri.
        </Text>

        <TextInput
          style={styles.catatan}
          value={catatan}
          onChangeText={(teks) => {
            setCatatan(teks);
            setTersimpan(false);
          }}
          placeholder="Contoh: siapkan proposal skripsi sebelum bimbingan berikutnya."
          placeholderTextColor={WARNA.tintaRedup}
          multiline
          maxLength={BATAS_CATATAN}
          textAlignVertical="top"
          accessibilityLabel="Catatan bimbingan"
        />

        <View style={styles.kakiCatatan}>
          {/* Nilai turunan: dihitung dari panjang teks, tanpa state terpisah. */}
          <Text style={[styles.penghitung, sisaKarakter <= 20 && styles.penghitungBahaya]}>
            {catatan.length}/{BATAS_CATATAN}
          </Text>
          <TombolAksi
            label="Simpan catatan"
            onPress={simpanCatatan}
            jenis={catatan.trim() === '' ? 'kedua' : 'utama'}
          />
        </View>

        {tersimpan && (
          <View style={styles.konfirmasi}>
            <Text style={styles.teksKonfirmasi}>
              Catatan tersimpan di layar ini ({catatan.length} karakter). Project ini belum
              memakai penyimpanan permanen — itu bahan Bab 11.
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.catatanKaki}>
        Layar ini memakai ScrollView, bukan FlatList: isinya satu profil dengan jumlah
        komponen tetap, jadi seluruh anak boleh dirender sekaligus.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: {
    flex: 1,
    backgroundColor: WARNA.latar,
  },
  isi: {
    padding: JARAK.lg,
    paddingBottom: JARAK.xxl,
    gap: JARAK.md,
  },
  tidakDitemukan: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: JARAK.md,
    padding: JARAK.xl,
    backgroundColor: WARNA.latar,
  },
  kembali: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
  },
  kembaliDitekan: {
    opacity: 0.6,
  },
  teksKembali: {
    fontSize: TEKS.isi,
    fontWeight: '600',
    color: WARNA.utama,
  },
  kartuProfil: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: JARAK.lg,
    padding: JARAK.lg,
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: WARNA.garis,
  },
  identitas: {
    flex: 1,
    gap: 3,
  },
  nama: {
    fontSize: TEKS.judulLayar,
    fontWeight: '700',
    color: WARNA.tinta,
  },
  meta: {
    fontSize: TEKS.kecil,
    color: WARNA.tintaRedup,
  },
  barisLabel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: JARAK.xs,
    marginTop: 2,
  },
  kartu: {
    gap: JARAK.xs,
    padding: JARAK.lg,
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: WARNA.garis,
  },
  judulKartu: {
    fontSize: TEKS.judul,
    fontWeight: '700',
    color: WARNA.tinta,
    marginBottom: JARAK.xs,
  },
  barisMk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: JARAK.sm,
    paddingVertical: 6,
  },
  teksMk: {
    flex: 1,
    gap: 1,
  },
  namaMk: {
    fontSize: TEKS.isi,
    fontWeight: '600',
    color: WARNA.tinta,
  },
  metaMk: {
    fontSize: TEKS.mungil,
    color: WARNA.tintaRedup,
  },
  petunjuk: {
    fontSize: TEKS.kecil,
    lineHeight: 18,
    color: WARNA.tintaRedup,
    marginBottom: JARAK.xs,
  },
  catatan: {
    minHeight: 88,
    padding: JARAK.md,
    fontSize: TEKS.isi,
    lineHeight: 20,
    color: WARNA.tinta,
    backgroundColor: WARNA.latar,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: WARNA.garis,
  },
  kakiCatatan: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: JARAK.sm,
  },
  penghitung: {
    fontSize: TEKS.mungil,
    color: WARNA.tintaRedup,
  },
  penghitungBahaya: {
    color: WARNA.bahaya,
    fontWeight: '700',
  },
  konfirmasi: {
    padding: JARAK.sm,
    borderRadius: RADIUS.sm,
    backgroundColor: WARNA.suksesMuda,
  },
  teksKonfirmasi: {
    fontSize: TEKS.mungil,
    lineHeight: 16,
    color: WARNA.sukses,
  },
  catatanKaki: {
    fontSize: TEKS.mungil,
    lineHeight: 17,
    color: WARNA.tintaRedup,
  },
  judul: {
    fontSize: TEKS.judul,
    fontWeight: '700',
    color: WARNA.tinta,
  },
});
```


Layar ini belum punya jalan masuk; itu dibuat di langkah berikutnya.

**Cek (setelah Langkah 12):**

- Buka Budi Santoso → profil, empat baris ringkasan, tujuh mata kuliah, dan kotak catatan.
- Ketik catatan → penghitung berubah dari `0/200`. Tekan Simpan → muncul konfirmasi hijau.
- Tekan tombol kembali → daftar terbuka lagi dengan pencarian kosong. State pencarian ikut
  hilang karena layar daftar dilepas saat detail dibuka; kalau ingin dipertahankan, state-nya
  harus diangkat ke `App.js` — itulah bahan Bab 9.

**Sering salah:**

- Memberi `padding` pada `style` ScrollView, bukan pada `contentContainerStyle`. Jarak di
  dalam area gulir tidak muncul seperti yang diharapkan (subbab 5.1).
- Menyimpan sisa karakter di state terpisah. `BATAS_CATATAN - catatan.length` adalah nilai
  turunan; menyimpannya berarti punya dua sumber kebenaran yang bisa berbeda.
- Lupa `keyboardShouldPersistTaps="handled"`, sehingga tombol Simpan harus ditekan dua kali
  saat papan ketik terbuka.

**Kenapa:** layar ini memakai `ScrollView`, bukan `FlatList`, karena isinya satu profil dengan
jumlah komponen tetap — seluruh anak boleh dirender sekaligus (subbab 5.1 dan 5.3).

---

## Langkah 12 — Uji dua layar pertama

Rakit daftar dan detail dengan dua state saja. Ini juga pertama kalinya aplikasi terasa
"berjalan".

```jsx
// App.js — versi sementara kedua. Diganti di Langkah 17.
import { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import DetailMahasiswaScreen from './screens/DetailMahasiswaScreen';
import MahasiswaScreen from './screens/MahasiswaScreen';

export default function App() {
  const [idDetail, setIdDetail] = useState(null);

  return (
    <SafeAreaView style={styles.akar}>
      {idDetail !== null ? (
        <DetailMahasiswaScreen mahasiswaId={idDetail} onKembali={() => setIdDetail(null)} />
      ) : (
        <MahasiswaScreen onBukaDetail={setIdDetail} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  akar: { flex: 1, backgroundColor: '#f1f5f9' },
});
```

Uji lima skenario ini sebelum lanjut:

| Skenario | Hasil yang diharapkan |
|---|---|
| Ketuk baris Dewi Lestari | Layar detail Dewi terbuka |
| Ketuk "‹ Kembali" | Kembali ke daftar; pencarian kembali kosong karena layar daftar dipasang ulang |
| Cari `22101005` lalu ketuk hasilnya | Detail Andi Wijaya |
| Ketik 200 karakter di catatan | Penghitung berhenti di `200/200` |
| Ketuk Simpan dengan catatan kosong | Tidak ada konfirmasi (fungsi berhenti lebih awal) |

**Kenapa:** navigasi di Bab 5 belum memakai pustaka apa pun. Satu state `idDetail` bernilai
`null` atau sebuah id sudah cukup; `null` berarti "tampilkan daftar".

Perhatikan konsekuensi yang baru saja kamu lihat: ketika detail dibuka, layar daftar dilepas,
jadi kata kunci pencariannya hilang. Untuk aplikasi latihan ini wajar — dan justru menjadi
contoh mengapa state kadang perlu diangkat ke komponen induk. Itu dibahas di Bab 9.

---

## Langkah 13 — `BerandaScreen`: dashboard responsif

**`screens/BerandaScreen.js`**

```jsx
import { useRef } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import AvatarPlaceholder from '../components/AvatarPlaceholder';
import KartuStatistik from '../components/KartuStatistik';
import TombolAksi from '../components/TombolAksi';
import {
  DAFTAR_MAHASISWA,
  formatIPK,
  hitungRingkasan,
  peringkatIpk,
  predikatAkademik,
  sebaranProdi,
} from '../data/mahasiswa';
import { BREAKPOINT_LEBAR, JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

// Beranda — dashboard kampus.
//
// Rujukan slide Bab 5:
//   • Bagian 4 — dua panel berpindah susunan dari `column` menjadi `row` saat
//     lebar jendela melewati breakpoint; nilainya dibaca ulang setiap jendela
//     berubah lewat `useWindowDimensions()`, bukan sekali ukur di awal.
//   • subbab 3.4 — semua warna dan jarak dari theme/warna.js.
//   • subbab 4.5 — pakai `flex: 1` dan `gap`, bukan lebar/tinggi tetap.
export default function BerandaScreen({ onBukaMahasiswa, onBukaDetail, onBukaKatalog }) {
  const { width } = useWindowDimensions();
  const lebar = Math.round(width);
  const lebarLayar = lebar >= BREAKPOINT_LEBAR;
  const susunan = lebarLayar ? 'row' : 'column';

  // Penghitung render ini sengaja ditampilkan: ia membuktikan hook di atas
  // mengembalikan nilai terbaru, bukan angka hasil pengukuran sekali di awal.
  const jumlahRender = useRef(0);
  jumlahRender.current += 1;

  const ringkasan = hitungRingkasan(DAFTAR_MAHASISWA);
  const sebaran = sebaranProdi(DAFTAR_MAHASISWA);
  const terbaik = peringkatIpk(DAFTAR_MAHASISWA);

  return (
    <ScrollView
      style={styles.layar}
      contentContainerStyle={styles.isi}
      showsVerticalScrollIndicator={false}
    >
      {/* Kepala layar: gambar lokal lewat require (subbab 2.3). */}
      <View style={styles.kepala}>
        <Image
          source={require('../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Logo SIAKAD Mobile"
        />
        <View style={styles.kepalaTeks}>
          <Text style={styles.judulAplikasi}>SIAKAD Mobile</Text>
          <Text style={styles.subJudul}>Manajemen Data Mahasiswa</Text>
        </View>
      </View>

      <View style={styles.barisUkur}>
        <LabelUkur label="layar" nilai={lebar + ' px'} />
        <LabelUkur label="breakpoint" nilai={String(BREAKPOINT_LEBAR)} />
        <LabelUkur label="flexDirection" nilai={susunan} />
        <LabelUkur label="render" nilai={'ke-' + jumlahRender.current} />
      </View>

      <View style={styles.barisKartu}>
        <KartuStatistik angka={String(ringkasan.total)} label="Mahasiswa aktif" />
        <KartuStatistik
          angka={formatIPK(ringkasan.rataIpk)}
          label="Rata-rata IPK"
          aksen={WARNA.sukses}
        />
        <KartuStatistik
          angka={String(ringkasan.berprestasi)}
          label="IPK ≥ 3,50"
          aksen={WARNA.peringatan}
        />
      </View>

      {/* Inti Bagian 4: dua panel, satu properti yang berubah. */}
      <View style={[styles.duaPanel, { flexDirection: susunan }]}>
        <Panel
          judul="Sebaran program studi"
          keterangan={
            'Lebar bar dihitung dari jumlah mahasiswa per prodi, bukan angka tetap. ' +
            'Panel memakai flex: 1 sehingga lebar dibagi rata.'
          }
        >
          {sebaran.map((item) => (
            <View key={item.prodi} style={styles.barisBar}>
              <View style={styles.barisBarTeks}>
                <Text style={styles.namaProdi}>{item.prodi}</Text>
                <Text style={styles.jumlahProdi}>{item.jumlah} orang</Text>
              </View>
              <View style={styles.trekBar}>
                <View style={[styles.isiBar, { width: Math.round(item.porsi * 100) + '%' }]} />
              </View>
            </View>
          ))}
        </Panel>

        <Panel
          judul="Ringkasan akademik"
          keterangan={
            'Semua angka dihitung ulang dari DAFTAR_MAHASISWA setiap render. ' +
            'Tidak ada state tambahan, jadi tidak mungkin berbeda dari daftar aslinya.'
          }
        >
          <BarisRingkas label="Total mahasiswa" nilai={String(ringkasan.total)} />
          <BarisRingkas label="Rata-rata IPK" nilai={formatIPK(ringkasan.rataIpk)} />
          <BarisRingkas label="Predikat sangat baik" nilai={String(ringkasan.berprestasi)} />
          <BarisRingkas label="Sedang cuti" nilai={String(ringkasan.cuti)} />
        </Panel>
      </View>

      <Text style={styles.judulBagian}>Mahasiswa dengan IPK tertinggi</Text>
      <View style={styles.daftarTerbaik}>
        {terbaik.map((mahasiswa, urutan) => {
          const predikat = predikatAkademik(mahasiswa.ipk);
          return (
            <Pressable
              key={mahasiswa.id}
              onPress={() => onBukaDetail(mahasiswa.id)}
              android_ripple={{ color: WARNA.permukaanRedup }}
              accessibilityRole="button"
              accessibilityLabel={'Buka detail ' + mahasiswa.nama}
              style={({ pressed }) => [styles.barisTerbaik, pressed && styles.barisDitekan]}
            >
              <Text style={styles.peringkat}>{urutan + 1}</Text>
              <AvatarPlaceholder
                nama={mahasiswa.nama}
                ukuran={36}
                fotoUri={mahasiswa.fotoUri}
              />
              <View style={styles.identitas}>
                <Text style={styles.namaTerbaik} numberOfLines={1}>
                  {mahasiswa.nama}
                </Text>
                <Text style={styles.metaTerbaik} numberOfLines={1}>
                  {mahasiswa.nim} · {predikat.label}
                </Text>
              </View>
              <Text style={styles.ipkTerbaik}>{formatIPK(mahasiswa.ipk)}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.tombol}>
        <TombolAksi label="Lihat semua mahasiswa" onPress={onBukaMahasiswa} />
        <TombolAksi label="Katalog mata kuliah" onPress={onBukaKatalog} jenis="kedua" />
      </View>

      <Text style={styles.catatanKaki}>
        Putar perangkat atau ubah lebar jendela: susunan dua panel di atas berpindah tanpa
        memuat ulang aplikasi. Angka pada chip “render” ikut bertambah — bukti bahwa
        useWindowDimensions() memicu render ulang, bukan mengukur sekali di awal.
      </Text>
    </ScrollView>
  );
}

// Panel kecil dipakai dua kali di atas. Komposisi seperti ini membuat layar
// tetap terbaca tanpa satu blok JSX raksasa (subbab 2.10).
function Panel({ judul, keterangan, children }) {
  return (
    <View style={styles.panel}>
      <Text style={styles.judulPanel}>{judul}</Text>
      <View style={styles.isiPanel}>{children}</View>
      <Text style={styles.keteranganPanel}>{keterangan}</Text>
    </View>
  );
}

function BarisRingkas({ label, nilai }) {
  return (
    <View style={styles.barisRingkas}>
      <Text style={styles.labelRingkas}>{label}</Text>
      <Text style={styles.nilaiRingkas}>{nilai}</Text>
    </View>
  );
}

function LabelUkur({ label, nilai }) {
  return (
    <View style={styles.chipUkur}>
      <Text style={styles.labelUkur}>{label}</Text>
      <Text style={styles.nilaiUkur}>{nilai}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  layar: {
    flex: 1,
    backgroundColor: WARNA.latar,
  },
  isi: {
    padding: JARAK.lg,
    paddingBottom: JARAK.xxl,
    gap: JARAK.lg,
  },
  kepala: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: JARAK.md,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
  },
  kepalaTeks: {
    gap: 1,
  },
  judulAplikasi: {
    fontSize: TEKS.judulLayar,
    fontWeight: '700',
    color: WARNA.tinta,
  },
  subJudul: {
    fontSize: TEKS.kecil,
    color: WARNA.tintaRedup,
  },
  barisUkur: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: JARAK.sm,
  },
  chipUkur: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 3,
    paddingHorizontal: JARAK.sm,
    borderRadius: RADIUS.bulat,
    backgroundColor: WARNA.permukaan,
    borderWidth: 1,
    borderColor: WARNA.garis,
  },
  labelUkur: {
    fontSize: TEKS.mungil,
    color: WARNA.tintaRedup,
  },
  nilaiUkur: {
    fontSize: TEKS.mungil,
    fontWeight: '700',
    color: WARNA.utama,
  },
  barisKartu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: JARAK.sm,
  },
  duaPanel: {
    gap: JARAK.md,
  },
  panel: {
    flex: 1,
    gap: JARAK.sm,
    padding: JARAK.lg,
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: WARNA.garis,
  },
  judulPanel: {
    fontSize: TEKS.judul,
    fontWeight: '700',
    color: WARNA.tinta,
  },
  isiPanel: {
    gap: JARAK.sm,
  },
  keteranganPanel: {
    fontSize: TEKS.mungil,
    lineHeight: 16,
    color: WARNA.tintaRedup,
  },
  barisBar: {
    gap: 4,
  },
  barisBarTeks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: JARAK.sm,
  },
  namaProdi: {
    fontSize: TEKS.kecil,
    color: WARNA.tinta,
  },
  jumlahProdi: {
    fontSize: TEKS.kecil,
    fontWeight: '600',
    color: WARNA.tintaRedup,
  },
  trekBar: {
    height: 8,
    borderRadius: RADIUS.bulat,
    backgroundColor: WARNA.permukaanRedup,
    overflow: 'hidden',
  },
  isiBar: {
    height: '100%',
    borderRadius: RADIUS.bulat,
    backgroundColor: WARNA.utama,
  },
  barisRingkas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: JARAK.sm,
  },
  labelRingkas: {
    fontSize: TEKS.kecil,
    color: WARNA.tintaRedup,
  },
  nilaiRingkas: {
    fontSize: TEKS.kecil,
    fontWeight: '700',
    color: WARNA.tinta,
  },
  judulBagian: {
    fontSize: TEKS.judul,
    fontWeight: '700',
    color: WARNA.tinta,
  },
  daftarTerbaik: {
    gap: JARAK.sm,
  },
  barisTerbaik: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: JARAK.md,
    padding: JARAK.md,
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: WARNA.garis,
  },
  barisDitekan: {
    backgroundColor: WARNA.permukaanRedup,
  },
  peringkat: {
    width: 16,
    fontSize: TEKS.isi,
    fontWeight: '700',
    color: WARNA.tintaRedup,
  },
  identitas: {
    flex: 1,
    gap: 1,
  },
  namaTerbaik: {
    fontSize: TEKS.isi,
    fontWeight: '600',
    color: WARNA.tinta,
  },
  metaTerbaik: {
    fontSize: TEKS.mungil,
    color: WARNA.tintaRedup,
  },
  ipkTerbaik: {
    fontSize: TEKS.judul,
    fontWeight: '700',
    color: WARNA.utama,
  },
  tombol: {
    gap: JARAK.sm,
  },
  catatanKaki: {
    fontSize: TEKS.mungil,
    lineHeight: 17,
    color: WARNA.tintaRedup,
  },
});
```


Untuk melihatnya, ganti `App.js` sementara menjadi:

```jsx
import BerandaScreen from './screens/BerandaScreen';

export default function App() {
  return (
    <BerandaScreen
      onBukaMahasiswa={() => {}}
      onBukaDetail={() => {}}
      onBukaKatalog={() => {}}
    />
  );
}
```

**Cek:**

- Di layar sempit, dua panel bertumpuk dan chip berbunyi `flexDirection: column`.
- Perbesar jendela (atau putar HP) melewati 600 piksel: panel berpindah ke samping, chip
  berubah menjadi `row`, dan angka pada chip `render` bertambah satu.
- Tiga kartu statistik berbagi lebar; angka di dalamnya dihitung dari data, bukan ditulis tetap.

**Sering salah:**

- Mengukur sekali di awal (`Dimensions.get()` lalu disimpan di `useState`). Saat perangkat
  diputar, layout tidak pernah berubah. `useWindowDimensions()` mengembalikan angka terbaru
  setiap kali jendela berubah (subbab 4.8).
- Memakai lebar tetap 375 supaya "pas di HP". Di tablet sisanya kosong; di HP kecil isinya
  terpotong.
- Menyamakan breakpoint 600 dengan "ukuran tablet". Ia hanya ambang keputusan layout (subbab
  4.9).

**Kenapa:** inilah inti Bagian 4 — satu properti (`flexDirection`) yang berubah berdasarkan
lebar, dan dua panel dengan `flex: 1` yang membagi ruang tersisa. Chip pengukur sengaja
ditampilkan supaya kelas bisa melihat hook-nya bekerja, bukan mempercayainya.

---

## Langkah 14 — `KartuMataKuliah` dan `KatalogScreen`: `numColumns`

**`components/KartuMataKuliah.js`**

```jsx
import { StyleSheet, Text, View } from 'react-native';

import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';
import LabelStatus from './LabelStatus';

// Kartu mata kuliah untuk katalog berbentuk grid.
//
// Rujukan slide Bab 5:
//   • subbab 5.2 — kartu ini adalah `renderItem` FlatList dengan `numColumns`,
//     jadi lebarnya ditentukan `flex: 1` di dalam kolom, bukan lebar tetap.
//   • subbab 3.3 — kategori "Pilihan" memakai gaya kondisional pada badge.
export default function KartuMataKuliah({ mataKuliah }) {
  const pilihan = mataKuliah.kategori === 'Pilihan';

  return (
    <View style={styles.kartu}>
      <View style={styles.kepala}>
        <Text style={styles.kode}>{mataKuliah.kode}</Text>
        <LabelStatus
          label={mataKuliah.kategori}
          jenis={pilihan ? 'sedang' : 'netral'}
        />
      </View>

      <Text style={styles.nama} numberOfLines={2}>
        {mataKuliah.nama}
      </Text>

      <View style={styles.kaki}>
        <Text style={styles.meta}>{mataKuliah.sks} SKS</Text>
        <Text style={styles.meta}>Semester {mataKuliah.semester}</Text>
      </View>

      <Text style={styles.dosen} numberOfLines={1}>
        {mataKuliah.dosen}
      </Text>
      <Text style={styles.ruang} numberOfLines={1}>
        {mataKuliah.ruang}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: {
    flex: 1,
    gap: 6,
    padding: JARAK.md,
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: WARNA.garis,
  },
  kepala: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: JARAK.sm,
  },
  kode: {
    fontSize: TEKS.mungil,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: WARNA.utama,
  },
  nama: {
    fontSize: TEKS.isi,
    fontWeight: '700',
    color: WARNA.tinta,
  },
  kaki: {
    flexDirection: 'row',
    gap: JARAK.sm,
  },
  meta: {
    fontSize: TEKS.mungil,
    color: WARNA.tintaRedup,
    backgroundColor: WARNA.permukaanRedup,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
  },
  dosen: {
    fontSize: TEKS.kecil,
    color: WARNA.tinta,
  },
  ruang: {
    fontSize: TEKS.mungil,
    color: WARNA.tintaRedup,
  },
});
```


**`screens/KatalogScreen.js`**

```jsx
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import KartuMataKuliah from '../components/KartuMataKuliah';
import { DAFTAR_MATA_KULIAH } from '../data/mahasiswa';
import { BREAKPOINT_LEBAR, JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

const PILIHAN_SEMESTER = [
  { kunci: 'semua', label: 'Semua' },
  { kunci: 5, label: 'Semester 5' },
  { kunci: 6, label: 'Semester 6' },
];

// Katalog mata kuliah — grid responsif.
//
// Rujukan slide Bab 5:
//   • subbab 5.2 — `numColumns` pada FlatList, plus satu syarat yang jarang
//     diingat: `key` daftar harus ikut berubah saat `numColumns` berubah, karena
//     jumlah kolom ikut menentukan susunan InternalVirtualizedList.
//   • subbab 4.9 — jumlah kolom dipilih dari lebar jendela, bukan dari nama
//     perangkat.
//   • subbab 3.3 — chip semester memakai array style untuk keadaan aktif.
export default function KatalogScreen() {
  const { width } = useWindowDimensions();
  const lebarLayar = width >= BREAKPOINT_LEBAR;
  const kolom = lebarLayar ? 2 : 1;

  const [semester, setSemester] = useState('semua');

  const tersaring =
    semester === 'semua'
      ? DAFTAR_MATA_KULIAH
      : DAFTAR_MATA_KULIAH.filter((m) => m.semester === semester);

  const totalSks = tersaring.reduce((jumlah, m) => jumlah + m.sks, 0);

  return (
    <FlatList
      // `key` berubah ketika jumlah kolom berubah — tanpa ini, FlatList
      // mempertahankan susunan lama dan kartu tampak berhimpitan.
      key={'katalog-' + kolom}
      style={styles.layar}
      contentContainerStyle={styles.isi}
      data={tersaring}
      numColumns={kolom}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <KartuMataKuliah mataKuliah={item} />}
      columnWrapperStyle={kolom > 1 ? styles.barisKolom : undefined}
      ItemSeparatorComponent={() => <View style={styles.pemisah} />}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.kepala}>
          <Text style={styles.judul}>Katalog mata kuliah</Text>
          <Text style={styles.subJudul}>
            {tersaring.length} mata kuliah · {totalSks} SKS · {kolom} kolom
          </Text>

          <View style={styles.barisChip}>
            {PILIHAN_SEMESTER.map((pilihan) => {
              const aktif = pilihan.kunci === semester;
              return (
                <Pressable
                  key={String(pilihan.kunci)}
                  onPress={() => setSemester(pilihan.kunci)}
                  hitSlop={6}
                  accessibilityRole="button"
                  accessibilityState={{ selected: aktif }}
                  style={({ pressed }) => [
                    styles.chip,
                    aktif && styles.chipAktif,
                    pressed && styles.chipDitekan,
                  ]}
                >
                  <Text style={[styles.teksChip, aktif && styles.teksChipAktif]}>
                    {pilihan.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.kosong}>
          <Text style={styles.teksKosong}>Belum ada mata kuliah pada semester ini.</Text>
        </View>
      }
      ListFooterComponent={
        <Text style={styles.catatanKaki}>
          Di layar lebar katalog menjadi dua kolom (numColumns), di layar sempit satu kolom.
          Perhatikan juga properti key pada FlatList: nilainya ikut berubah saat jumlah
          kolom berubah, supaya susunan tidak memakai layout lama.
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  layar: {
    flex: 1,
    backgroundColor: WARNA.latar,
  },
  isi: {
    padding: JARAK.lg,
    paddingBottom: JARAK.xxl,
  },
  kepala: {
    gap: JARAK.sm,
    marginBottom: JARAK.md,
  },
  judul: {
    fontSize: TEKS.judulLayar,
    fontWeight: '700',
    color: WARNA.tinta,
  },
  subJudul: {
    fontSize: TEKS.kecil,
    color: WARNA.tintaRedup,
  },
  barisChip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: JARAK.sm,
    marginTop: JARAK.xs,
  },
  chip: {
    paddingVertical: 5,
    paddingHorizontal: JARAK.md,
    borderRadius: RADIUS.bulat,
    borderWidth: 1,
    borderColor: WARNA.garis,
    backgroundColor: WARNA.permukaan,
  },
  chipAktif: {
    borderColor: WARNA.utama,
    backgroundColor: WARNA.utamaMuda,
  },
  chipDitekan: {
    opacity: 0.85,
  },
  teksChip: {
    fontSize: TEKS.kecil,
    fontWeight: '600',
    color: WARNA.tintaRedup,
  },
  teksChipAktif: {
    color: WARNA.utama,
  },
  barisKolom: {
    gap: JARAK.md,
  },
  pemisah: {
    height: JARAK.sm,
  },
  kosong: {
    alignItems: 'center',
    paddingVertical: JARAK.xl,
  },
  teksKosong: {
    fontSize: TEKS.kecil,
    color: WARNA.tintaRedup,
  },
  catatanKaki: {
    marginTop: JARAK.lg,
    fontSize: TEKS.mungil,
    lineHeight: 17,
    color: WARNA.tintaRedup,
  },
});
```


Untuk melihatnya:

```jsx
import KatalogScreen from './screens/KatalogScreen';

export default function App() {
  return <KatalogScreen />;
}
```

**Cek:**

- Di layar sempit: satu kolom, keterangan "1 kolom".
- Di layar lebar: dua kolom, kartu berbagi lebar dengan jarak yang sama, keterangan "2 kolom".
- Tekan chip "Semester 6": tinggal 2 mata kuliah, 5 SKS.
- Ubah lebar jendela bolak-balik: jumlah kolom berubah tanpa error.

**Sering salah:**

- Lupa memberi `key` pada `FlatList` yang nilainya ikut berubah saat `numColumns` berubah.
  Tanpa itu, daftar memakai susunan lama dan kartu tampak berhimpitan.
- Lupa `columnWrapperStyle`. Tanpa `gap` di sana, dua kolom menempel.
- Memberi lebar tetap pada kartu. Kartu harus `flex: 1` di dalam kolomnya.

**Kenapa:** `numColumns` mengubah susunan internal daftar, jadi `key` pada `FlatList` adalah
satu-satunya cara memaksa daftar disusun ulang. Ini salah satu detail yang paling jarang
disebut di tutorial lain, tetapi muncul di praktikum (subbab 5.2).

---

## Langkah 15 — `TentangScreen`: perbedaan platform

**`screens/TentangScreen.js`**

```jsx
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import LabelStatus from '../components/LabelStatus';
import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

// Info — halaman rujukan cepat untuk materi Bab 5.
//
// Rujukan slide Bab 5:
//   • Bagian 1 — padanan elemen HTML dan komponen React Native.
//   • subbab 5.3–5.4 — perbedaan platform dan Platform.OS.
//   • subbab 5.2 — tabel pemilihan komponen pengguliran.
//   • daftar periksa "Yang harus teramati" di akhir bab.

const PADANAN = [
  { web: 'div', native: 'View', catatan: 'container dan layout' },
  { web: 'p', native: 'Text', catatan: 'semua teks wajib dibungkus Text' },
  { web: 'button', native: 'Pressable', catatan: 'bebas ditata, punya pressed' },
  { web: 'CSS', native: 'StyleSheet', catatan: 'objek JavaScript, camelCase' },
];

const SCROLLER = [
  { kebutuhan: 'Konten halaman relatif sedikit', komponen: 'ScrollView' },
  { kebutuhan: 'Daftar data panjang atau dinamis', komponen: 'FlatList' },
  { kebutuhan: 'Daftar dua dimensi', komponen: 'FlatList + numColumns' },
  { kebutuhan: 'Daftar bertingkat beberapa bagian', komponen: 'SectionList' },
  { kebutuhan: 'Daftar kecil di dalam daftar lain', komponen: 'Evaluasi struktur' },
];

const PERBEDAAN_PLATFORM = [
  'Indikator gulir dan efek sentuh (ripple) hanya muncul di Android.',
  'Tombol kembali punya perilaku sendiri di Android, tidak ada padanannya di iOS.',
  'Area aman: iOS punya home indicator, Android modern menggambar isi sampai tepi layar.',
  'Papan ketik menutupi kotak isian dengan cara berbeda di kedua platform.',
];

const DAFTAR_PERIKSA = [
  'Teks muncul sebagai Text, bukan sebagai isi View.',
  'Tombol berubah tampilan saat status aktif dan nonaktif.',
  'Dua panel berubah susunan saat jendela melebar atau diputar.',
  'Daftar panjang tetap ringan saat digulir.',
  'Tidak ada konten tertutup status bar atau home indicator.',
];

const CONTOH_KODE = [
  "import { View, Text, Pressable } from 'react-native';",
  '',
  'export default function Halaman() {',
  '  return (',
  '    <View>',
  '      <Text>Judul Halaman</Text>',
  '      <Pressable onPress={() => {}}>',
  '        <Text>Tekan</Text>',
  '      </Pressable>',
  '    </View>',
  '  );',
  '}',
].join('\n');

export default function TentangScreen() {
  const namaPlatform = Platform.select({
    ios: 'iOS',
    android: 'Android',
    default: 'Web',
  });
  const paddingPlatform = Platform.select({ ios: 16, android: 12, default: 14 });

  return (
    <ScrollView
      style={styles.layar}
      contentContainerStyle={styles.isi}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <Text style={styles.judul}>Info aplikasi</Text>
        <Text style={styles.subJudul}>
          Ringkasan materi Bab 5 — Dasar React Native, dipakai di project ini.
        </Text>
      </View>

      <View style={styles.kartu}>
        <Text style={styles.judulKartu}>1 · React Web dan React Native</Text>
        <Text style={styles.paragraf}>
          Konsepnya sama — component, props, state, hooks. Yang berganti adalah mediumnya:
          JSX yang sama berakhir di DOM browser pada React Web, dan di komponen native pada
          React Native.
        </Text>

        <View style={styles.tabel}>
          <View style={[styles.barisTabel, styles.barisKepala]}>
            <Text style={[styles.selKepala, styles.kolomWeb]}>React Web</Text>
            <Text style={styles.selKepala}>React Native</Text>
          </View>
          {PADANAN.map((baris) => (
            <View key={baris.web} style={styles.barisTabel}>
              <Text style={[styles.sel, styles.kolomWeb]}>{baris.web}</Text>
              <View style={styles.selKanan}>
                <Text style={styles.selTebal}>{baris.native}</Text>
                <Text style={styles.selCatatan}>{baris.catatan}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.kotakKode}>
          <Text style={styles.kode}>{CONTOH_KODE}</Text>
        </View>

        <Text style={styles.catatanKartu}>
          Struktur JSX, logika, dan penamaan state bisa disalin apa adanya dari versi web.
          Yang berubah hanya import, nama komponen, dan cara menata gaya.
        </Text>
      </View>

      <View style={styles.kartu}>
        <Text style={styles.judulKartu}>2 · Platform yang sedang dipakai</Text>

        <View style={styles.barisPlatform}>
          <Text style={styles.labelPlatform}>Platform.OS</Text>
          <LabelStatus label={String(Platform.OS)} jenis="netral" />
        </View>

        <Text style={styles.paragraf}>
          Aplikasi ini berjalan di {namaPlatform}. Setiap platform diberi padding berbeda
          lewat Platform.select(); nilainya {paddingPlatform}. Ini pilihan yang lebih rapi
          daripada menulis Platform.OS === 'ios' ? ... : ... berulang kali.
        </Text>

        <View style={styles.daftarPoin}>
          {PERBEDAAN_PLATFORM.map((poin) => (
            <View key={poin} style={styles.barisPoin}>
              <Text style={styles.tandaPoin}>•</Text>
              <Text style={styles.teksPoin}>{poin}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.catatanKartu}>
          Urutan keputusannya: satu kode untuk dua platform dulu, Platform.OS kalau bedanya
          kecil, dan berkas .ios.js / .android.js hanya kalau perbedaannya satu komponen
          utuh.
        </Text>
      </View>

      <View style={styles.kartu}>
        <Text style={styles.judulKartu}>3 · Memilih komponen pengguliran</Text>

        {SCROLLER.map((baris) => (
          <View key={baris.kebutuhan} style={styles.barisScroller}>
            <Text style={styles.teksScroller}>{baris.kebutuhan}</Text>
            <Text style={styles.nilaiScroller}>{baris.komponen}</Text>
          </View>
        ))}

        <Text style={styles.catatanKartu}>
          Pilih berdasarkan struktur data dan jumlah item, bukan kebiasaan. FlatList tidak
          boleh dibungkus ScrollView searah — virtualisasinya rusak dan Metro menampilkan
          peringatan VirtualizedLists.
        </Text>
      </View>

      <View style={styles.kartu}>
        <Text style={styles.judulKartu}>4 · Yang harus teramati</Text>
        {DAFTAR_PERIKSA.map((butir) => (
          <View key={butir} style={styles.barisPoin}>
            <Text style={styles.tandaCentang}>✓</Text>
            <Text style={styles.teksPoin}>{butir}</Text>
          </View>
        ))}
      </View>

      <View style={styles.kartu}>
        <Text style={styles.judulKartu}>5 · Data contoh</Text>
        <Text style={styles.paragraf}>
          Delapan mahasiswa dan tujuh mata kuliah disimpan di data/mahasiswa.js. Semua angka
          di dashboard, predikat, dan sebaran program studi dihitung dari berkas itu — satu
          sumber kebenaran, tanpa state yang menduplikasi nilai.
        </Text>
      </View>

      <Text style={styles.versi}>
        Expo SDK 57 · React Native 0.86 · React 19.2 · Node.js ≥ 22
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: {
    flex: 1,
    backgroundColor: WARNA.latar,
  },
  isi: {
    padding: JARAK.lg,
    paddingBottom: JARAK.xxl,
    gap: JARAK.md,
  },
  judul: {
    fontSize: TEKS.judulLayar,
    fontWeight: '700',
    color: WARNA.tinta,
  },
  subJudul: {
    marginTop: 2,
    fontSize: TEKS.kecil,
    lineHeight: 18,
    color: WARNA.tintaRedup,
  },
  kartu: {
    gap: JARAK.sm,
    padding: JARAK.lg,
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: WARNA.garis,
  },
  judulKartu: {
    fontSize: TEKS.judul,
    fontWeight: '700',
    color: WARNA.tinta,
  },
  paragraf: {
    fontSize: TEKS.kecil,
    lineHeight: 19,
    color: WARNA.tinta,
  },
  tabel: {
    borderWidth: 1,
    borderColor: WARNA.garis,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  barisTabel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: JARAK.sm,
    borderTopWidth: 1,
    borderTopColor: WARNA.garis,
  },
  barisKepala: {
    backgroundColor: WARNA.permukaanRedup,
    borderTopWidth: 0,
  },
  selKepala: {
    flex: 1,
    fontSize: TEKS.mungil,
    fontWeight: '700',
    color: WARNA.tintaRedup,
  },
  kolomWeb: {
    flex: 0.8,
  },
  sel: {
    flex: 0.8,
    fontSize: TEKS.kecil,
    color: WARNA.tintaRedup,
  },
  selKanan: {
    flex: 1,
    gap: 1,
  },
  selTebal: {
    fontSize: TEKS.kecil,
    fontWeight: '700',
    color: WARNA.utama,
  },
  selCatatan: {
    fontSize: TEKS.mungil,
    color: WARNA.tintaRedup,
  },
  kotakKode: {
    padding: JARAK.md,
    backgroundColor: WARNA.tinta,
    borderRadius: RADIUS.md,
  },
  kode: {
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    fontSize: 11,
    lineHeight: 17,
    color: '#e2e8f0',
  },
  catatanKartu: {
    fontSize: TEKS.mungil,
    lineHeight: 17,
    color: WARNA.tintaRedup,
  },
  barisPlatform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: JARAK.sm,
  },
  labelPlatform: {
    fontSize: TEKS.kecil,
    color: WARNA.tintaRedup,
  },
  daftarPoin: {
    gap: 6,
  },
  barisPoin: {
    flexDirection: 'row',
    gap: JARAK.sm,
  },
  tandaPoin: {
    fontSize: TEKS.kecil,
    lineHeight: 19,
    color: WARNA.utama,
  },
  tandaCentang: {
    fontSize: TEKS.kecil,
    lineHeight: 19,
    fontWeight: '700',
    color: WARNA.sukses,
  },
  teksPoin: {
    flex: 1,
    fontSize: TEKS.kecil,
    lineHeight: 19,
    color: WARNA.tinta,
  },
  barisScroller: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: JARAK.sm,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: WARNA.garis,
  },
  teksScroller: {
    flex: 1,
    fontSize: TEKS.kecil,
    color: WARNA.tinta,
  },
  nilaiScroller: {
    fontSize: TEKS.mungil,
    fontWeight: '700',
    color: WARNA.utama,
  },
  versi: {
    textAlign: 'center',
    fontSize: TEKS.mungil,
    color: WARNA.tintaRedup,
  },
});
```


Untuk melihatnya:

```jsx
import TentangScreen from './screens/TentangScreen';

export default function App() {
  return <TentangScreen />;
}
```

**Cek:** badge `Platform.OS` berisi `web` di browser, `ios` di simulator iOS, `android` di
emulator Android. Kalimat di bawahnya menyebut nama platform dan angka padding yang berbeda
sesuai platform.

**Sering salah:** memakai `Platform.OS === 'ios' ? ... : ...` untuk hal yang bisa ditangani
`Platform.select`, atau sebaliknya: membuat berkas `.ios.js` dan `.android.js` hanya untuk
membedakan satu angka padding. Urutan keputusannya: satu kode dulu, `Platform.OS` kalau bedanya
kecil, berkas terpisah hanya kalau komponennya sendiri berbeda (subbab 5.4).

**Kenapa:** layar ini juga menjadi "halaman rujukan" kelas: padanan React Web–React Native,
tabel pemilihan scroller, dan daftar periksa akhir bab tersedia di dalam aplikasi, bukan hanya
di slide.

---

# Bagian D — Merakit dan menguji

## Langkah 16 — `TabBar`

**`components/TabBar.js`**

```jsx
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { JARAK, TEKS, WARNA } from '../theme/warna';

// Bilah navigasi bawah.
//
// Rujukan slide Bab 5: navigasi antar layar di project ini sengaja hanya memakai
// satu state di App.js — pustaka navigasi baru dibahas di Bab 7. Yang dilatih di
// sini justru komponennya: `Pressable` dengan gaya kondisional untuk tab aktif
// (subbab 2.6 dan 3.3).

const TAB = [
  { kunci: 'beranda', label: 'Beranda', ikon: '⌂' },
  { kunci: 'mahasiswa', label: 'Mahasiswa', ikon: '☰' },
  { kunci: 'katalog', label: 'Mata Kuliah', ikon: '▤' },
  { kunci: 'tentang', label: 'Info', ikon: 'ⓘ' },
];

export default function TabBar({ aktif, onPilih }) {
  return (
    <View style={styles.bilah}>
      {TAB.map((tab) => {
        const dipilih = tab.kunci === aktif;
        return (
          <Pressable
            key={tab.kunci}
            onPress={() => onPilih(tab.kunci)}
            accessibilityRole="tab"
            accessibilityState={{ selected: dipilih }}
            accessibilityLabel={tab.label}
            style={({ pressed }) => [styles.tab, pressed && styles.tabDitekan]}
          >
            <View style={[styles.garisAtas, dipilih && styles.garisAtasAktif]} />
            <Text style={[styles.ikon, dipilih && styles.teksAktif]}>{tab.ikon}</Text>
            <Text style={[styles.label, dipilih && styles.teksAktif]} numberOfLines={1}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bilah: {
    flexDirection: 'row',
    backgroundColor: WARNA.permukaan,
    borderTopWidth: 1,
    borderTopColor: WARNA.garis,
    paddingBottom: JARAK.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: JARAK.sm,
    paddingBottom: JARAK.xs,
    gap: 1,
  },
  tabDitekan: {
    backgroundColor: WARNA.permukaanRedup,
  },
  garisAtas: {
    height: 2,
    width: 22,
    borderRadius: 2,
    backgroundColor: 'transparent',
    marginBottom: 4,
  },
  garisAtasAktif: {
    backgroundColor: WARNA.utama,
  },
  ikon: {
    fontSize: 15,
    color: WARNA.tintaRedup,
  },
  label: {
    fontSize: TEKS.mungil,
    color: WARNA.tintaRedup,
  },
  teksAktif: {
    color: WARNA.utama,
    fontWeight: '700',
  },
});
```


**Cek:** belum terlihat. Komponen ini dipasang di langkah berikutnya, yang langsung setelah ini.

**Kenapa:** tab aktif dibedakan lewat array style (`dipilih && styles.teksAktif`), bukan dua
salinan komponen. `accessibilityState={{ selected: dipilih }}` memberi tahu pembaca layar tab
mana yang sedang aktif.

---

## Langkah 17 — `App.js` final

Sekarang ganti `App.js` sementara dengan versi sebenarnya.

**`App.js`**

```jsx
import { useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { StatusBar as StatusBarExpo } from 'expo-status-bar';

import TabBar from './components/TabBar';
import BerandaScreen from './screens/BerandaScreen';
import DetailMahasiswaScreen from './screens/DetailMahasiswaScreen';
import KatalogScreen from './screens/KatalogScreen';
import MahasiswaScreen from './screens/MahasiswaScreen';
import TentangScreen from './screens/TentangScreen';
import { WARNA } from './theme/warna';

// SIAKAD Mobile — project contoh Bab 5: Dasar React Native.
//
// Navigasi di sini sengaja hanya memakai dua state: tab aktif dan id mahasiswa
// yang dibuka. Pustaka navigasi baru dibahas di Bab 7, jadi struktur layar dibuat
// sesederhana mungkin supaya perhatian tetap pada komponen, gaya, layout, dan
// scroller.
//
// Rujukan slide Bab 5, subbab 5.3: SafeAreaView bawaan React Native hanya
// melindungi iOS. Di Android, isi layar digambar sampai tepi, jadi padding atas
// ditambahkan dari StatusBar.currentHeight. Alternatif modernnya
// (react-native-safe-area-context) dibahas pada praktikum dan Bab 8.

const LAYAR = {
  beranda: BerandaScreen,
  mahasiswa: MahasiswaScreen,
  katalog: KatalogScreen,
  tentang: TentangScreen,
};

export default function App() {
  const [tabAktif, setTabAktif] = useState('beranda');
  const [idDetail, setIdDetail] = useState(null);

  const sedangMelihatDetail = idDetail !== null;
  const Layar = LAYAR[tabAktif];

  return (
    <SafeAreaView
      style={[styles.akar, Platform.OS === 'android' && styles.akarAndroid]}
    >
      <View style={styles.wadah}>
        {sedangMelihatDetail ? (
          <DetailMahasiswaScreen
            mahasiswaId={idDetail}
            onKembali={() => setIdDetail(null)}
          />
        ) : (
          <Layar
            onBukaMahasiswa={() => setTabAktif('mahasiswa')}
            onBukaKatalog={() => setTabAktif('katalog')}
            onBukaDetail={setIdDetail}
          />
        )}
      </View>

      {/* Bilah tab disembunyikan saat detail terbuka, supaya layar detail
          memakai seluruh tinggi yang tersedia. */}
      {!sedangMelihatDetail && <TabBar aktif={tabAktif} onPilih={setTabAktif} />}

      <StatusBarExpo style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  akar: {
    flex: 1,
    backgroundColor: WARNA.latar,
  },
  akarAndroid: {
    // Android menggambar konten sampai tepi layar; status bar perlu diberi ruang.
    paddingTop: StatusBar.currentHeight ?? 0,
  },
  wadah: {
    flex: 1,
  },
});
```


**Cek:**

- Empat tab di bawah; tab aktif berwarna biru dengan garis di atasnya.
- Beranda → "Lihat semua mahasiswa" berpindah ke tab Mahasiswa.
- Mahasiswa → ketuk baris membuka detail; bilah tab hilang selama detail terbuka; "‹ Kembali"
  mengembalikannya.
- Isi layar tidak tertutup status bar, baik di iOS maupun Android.

**Sering salah:**

- Mengandalkan `SafeAreaView` bawaan React Native saja. Komponen itu hanya bekerja di iOS;
  di Android isi layar digambar sampai tepi. Karena itu `App.js` menambahkan `paddingTop` dari
  `StatusBar.currentHeight` ketika berjalan di Android (subbab 5.3).
- Lupa `flex: 1` pada wadah layar, sehingga bilah tab tidak menempel di bawah.

**Kenapa:** `App.js` sengaja hanya berisi dua state dan satu peta layar. Navigasi baru dibahas
di Bab 7; di sini tujuannya agar seluruh materi Bab 5 punya tempat berpijak.

---

## Langkah 18 — Pengujian dan build web

Jalankan daftar periksa akhir bab pada aplikasimu sendiri. Jangan hanya melihat tampilan — ubah
kondisinya, lalu perhatikan apa yang berubah.

| Butir | Cara menguji |
|---|---|
| Teks muncul sebagai `Text` | Hapus satu `Text` pembungkus teks, lalu lihat layar merah dan pesan Metro-nya |
| Tombol berubah saat aktif/nonaktif | Tekan dan tahan tombol; bandingkan dengan saat dilepas |
| Dua panel berubah susunan | Ubah lebar jendela melewati 600, atau putar perangkat |
| Daftar panjang tetap ringan | Tambahkan 500 mahasiswa lewat `.map()` di data, lalu gulir |
| Tidak ada konten tertutup status bar | Uji di Android dan iOS, dua orientasi |

Uji juga lima skenario dari Langkah 12 di dua ukuran layar (HP kecil dan lebar) dan dua platform.

Build web sebagai bukti terakhir bahwa project bersih:

```bash
npx expo export --platform web
npx serve dist -l 8080
```

Buka `http://localhost:8080` dan ulangi daftar periksa. Build yang gagal hampir selalu berarti
ada impor yang salah nama atau berkas yang belum disimpan.

---

## Langkah 19 — Kalau ada yang tidak berjalan

| Gejala | Sebab yang paling sering | Perbaikan |
|---|---|---|
| "Text strings must be rendered within a `<Text>`" | Teks ditulis langsung di dalam `View` | Bungkus dengan `Text` |
| Gambar tidak muncul | `Image` tanpa lebar/tinggi | Beri `style={{ width, height }}` |
| Semua komponen menumpuk ke bawah | `flexDirection` tidak disetel | Ingat: bawaan React Native adalah `column` |
| Layout tidak berubah saat diputar | Lebar disimpan sekali di `useState` | Pakai `useWindowDimensions()` |
| Peringatan `VirtualizedLists should never be nested` | `FlatList` di dalam `ScrollView` searah | Pakai `ListHeaderComponent` |
| Tombol harus ditekan dua kali | Papan ketik terbuka | `keyboardShouldPersistTaps="handled"` |
| Daftar berkedip dan urutannya kacau | `keyExtractor` memakai indeks | Pakai `item.id` |
| Perubahan berkas tidak muncul | Cache Metro | `npx expo start -c` |
| "Unable to resolve module" | Salah nama berkas atau impor | Periksa huruf besar-kecil; Linux case-sensitive |

**Eksperimen lanjutan (bisa jadi tugas rumah):**

1. Ubah `BREAKPOINT_LEBAR` menjadi `900` dan jelaskan akibatnya pada HP berukuran 800 piksel.
2. Tambahkan satu mahasiswa di `data/mahasiswa.js` tanpa menyunting layar mana pun, lalu
   periksa apakah dashboard, sebaran prodi, dan peringkat ikut berubah.
3. Hapus `onChangeText` di kotak pencarian dan jelaskan gejala yang muncul.
4. Ganti `keyExtractor` menjadi indeks array, filter daftar, lalu jelaskan mengapa baris bisa
   tercocokkan dengan data yang salah.
5. Bungkus `FlatList` di `MahasiswaScreen` dengan `ScrollView` dan cari peringatan di Metro.

---

## Setelah tutorial ini

Project ini adalah titik berangkat, bukan hasil akhir. Tiga bab berikutnya menyambung tanpa
merombak struktur komponennya:

- **Bab 6** menyusun antarmuka yang lebih rapi — jarak, warna, dan hierarki visual.
- **Bab 7** menambahkan navigasi sungguhan, menggantikan dua state di `App.js`.
- **Bab 8** melengkapi formulir dan validasi, termasuk penanganan papan ketik.

Peta lengkap subbab slide ke berkas ada di [`README.md`](README.md); kode yang sudah jadi ada di
folder yang sama dengan tutorial ini.
