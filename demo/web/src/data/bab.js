/**
 * Manifest 15 bab kuliah Pemrograman Mobile.
 *
 * Tiap bab memakai folder sendiri di `konten/` sesuai judul bab; berkas HTML di
 * dalamnya adalah fragmen konten (tanpa <!DOCTYPE>/<head>) yang dimuat dan
 * dirender oleh kerangka SPA. Entri `berkas` menentukan urutan navigasi.
 *
 * `status: 'lengkap'` artinya bab itu punya berkas konten yang sudah jadi.
 * `status: 'ditunda'` artinya bab masih menunggu sesi penulisan berikutnya —
 * kerangka dan rutenya sudah ada, kontennya belum.
 */
export const BABS = [
  {
    slug: 'bab-01-pengantar-pemrograman-mobile',
    judul: 'Pengantar Pemrograman Mobile',
    singkat: 'Pengantar',
    pertemuan: 'Pertemuan 1',
    status: 'lengkap',
    berkas: [
      { file: 'index.html', judul: 'Ikhtisar' },
      { file: 'bagian-1.html', judul: 'Bagian 1 — Karakteristik Aplikasi Mobile' },
      { file: 'bagian-2.html', judul: 'Bagian 2 — Empat Pendekatan, Android & iOS, Evolusi' },
      { file: 'bagian-3.html', judul: 'Bagian 3 — React Native & Expo' },
      { file: 'bagian-4.html', judul: 'Bagian 4 — Arsitektur, Studi Kasus & Peta Perjalanan' },
      { file: 'praktikum.html', judul: 'Praktikum Bab 1 — Lingkungan & Observasi' },
    ],
  },
  {
    slug: 'bab-02-persiapan-lingkungan-pengembangan',
    judul: 'Persiapan Lingkungan Pengembangan',
    singkat: 'Lingkungan',
    pertemuan: 'Pertemuan 2',
    status: 'lengkap',
    berkas: [
      { file: 'index.html', judul: 'Ikhtisar' },
      { file: 'bagian-1.html', judul: 'Bagian 1 — Fondasi: Node.js, npm & VS Code' },
      { file: 'bagian-2.html', judul: 'Bagian 2 — Expo, Expo Go & Metro' },
      { file: 'bagian-3.html', judul: 'Bagian 3 — Alat Uji: Emulator, adb & iOS Simulator' },
      { file: 'bagian-4.html', judul: 'Bagian 4 — Proyek Pertama & Struktur Folder' },
      { file: 'praktikum.html', judul: 'Praktikum Bab 2 — Proyek Expo Pertama' },
    ],
  },
  {
    slug: 'bab-03-javascript-modern-untuk-react-native',
    judul: 'JavaScript Modern untuk React Native',
    singkat: 'JavaScript Modern',
    pertemuan: 'Pertemuan 3–4',
    status: 'lengkap',
    berkas: [
      { file: 'index.html', judul: 'Ikhtisar' },
      { file: 'bagian-1.html', judul: 'Bagian 1 — Variabel, Tipe Data & Kendali' },
      { file: 'bagian-2.html', judul: 'Bagian 2 — Array, Objek & Pengolahan Data' },
      { file: 'bagian-3.html', judul: 'Bagian 3 — Modul & Pemrograman Asinkron' },
      { file: 'praktikum.html', judul: 'Praktikum Bab 3 — Pengolah Nilai Mahasiswa' },
    ],
  },
  {
    slug: 'bab-04-dasar-react',
    judul: 'Dasar-Dasar React',
    singkat: 'Dasar React',
    pertemuan: 'Pertemuan 4–5',
    status: 'lengkap',
    berkas: [
      { file: 'index.html', judul: 'Ikhtisar' },
      { file: 'bagian-1.html', judul: 'Bagian 1 — Pola Pikir, Component & Props' },
      { file: 'bagian-2.html', judul: 'Bagian 2 — Interaksi, Render & Komposisi' },
      { file: 'bagian-3.html', judul: 'Bagian 3 — Hook: useEffect, useMemo, useCallback' },
      { file: 'praktikum.html', judul: 'Praktikum Bab 4 — Data Mahasiswa' },
    ],
  },
  {
    slug: 'bab-05-dasar-react-native',
    judul: 'Dasar React Native',
    singkat: 'Dasar React Native',
    pertemuan: 'Pertemuan 6',
    status: 'lengkap',
    berkas: [
      { file: 'index.html', judul: 'Ikhtisar' },
      { file: 'bagian-1.html', judul: 'Bagian 1 — React untuk Web dan React Native' },
      { file: 'bagian-2.html', judul: 'Bagian 2 — Komponen Inti React Native' },
      { file: 'bagian-3.html', judul: 'Bagian 3 — StyleSheet dan Gaya Kondisional' },
      { file: 'bagian-4.html', judul: 'Bagian 4 — Layout Responsif dengan Flexbox' },
      { file: 'bagian-5.html', judul: 'Bagian 5 — Scroller dan Perbedaan Platform' },
      { file: 'praktikum.html', judul: 'Praktikum Bab 5 — Lembar Kerja dan Kunci' },
    ],
  },
  {
    slug: 'bab-06-membangun-user-interface-mobile',
    judul: 'Membangun User Interface Mobile',
    singkat: 'UI Mobile',
    pertemuan: 'Pertemuan 7',
    status: 'lengkap',
    berkas: [
      { file: 'index.html', judul: 'Ikhtisar' },
      { file: 'bagian-1.html', judul: 'Bagian 1 — Empat Prinsip Desain UI Mobile' },
      { file: 'bagian-2.html', judul: 'Bagian 2 — Layout dan Component: Card, Button, Form, List' },
      { file: 'praktikum.html', judul: 'Praktikum Bab 6 — Layar Statis Aplikasi Manajemen Data Mahasiswa' },
    ],
  },
  {
    slug: 'bab-07-navigasi-aplikasi',
    judul: 'Navigasi Aplikasi',
    singkat: 'Navigasi',
    pertemuan: 'Pertemuan 7',
    status: 'lengkap',
    berkas: [
      { file: 'index.html', judul: 'Ikhtisar' },
      { file: 'bagian-1.html', judul: 'Bagian 1 — Pola Navigasi Mobile' },
      { file: 'bagian-2.html', judul: 'Bagian 2 — Expo Router: Rute dari Folder' },
      { file: 'bagian-3.html', judul: 'Bagian 3 — Layar, Parameter & Perlindungan' },
      { file: 'praktikum.html', judul: 'Praktikum Bab 7 — Aplikasi Manajemen Data Mahasiswa' },
    ],
  },
  {
    slug: 'bab-08-form-input-dan-validasi',
    judul: 'Form, Input, dan Validasi',
    singkat: 'Form & Validasi',
    pertemuan: 'Pertemuan 9',
    status: 'lengkap',
    berkas: [
      { file: 'index.html', judul: 'Ikhtisar' },
      { file: 'bagian-1.html', judul: 'Bagian 1 — TextInput dan Papan Ketik' },
      { file: 'bagian-2.html', judul: 'Bagian 2 — Controlled Component dan Form State' },
      { file: 'bagian-3.html', judul: 'Bagian 3 — Validasi, Pesan Galat, dan UX Formulir' },
      { file: 'bagian-4.html', judul: 'Bagian 4 — Implementasi dan Studi Kasus' },
      { file: 'praktikum.html', judul: 'Praktikum Bab 8 — Form Data Mahasiswa' },
    ],
  },
  {
    slug: 'bab-09-state-management',
    judul: 'State Management',
    singkat: 'State Management',
    pertemuan: 'Pertemuan 9',
    status: 'lengkap',
    berkas: [
      { file: 'index.html', judul: 'Ikhtisar' },
      { file: 'bagian-1.html', judul: 'Bagian 1 — Dari State Lokal ke State Global' },
      { file: 'bagian-2.html', judul: 'Bagian 2 — Context API & Custom Hook' },
      { file: 'bagian-3.html', judul: 'Bagian 3 — Merancang State dan Membangun Keranjang' },
      { file: 'praktikum.html', judul: 'Praktikum Bab 9 — Keranjang Belanja TokoKu' },
    ],
  },
  {
    slug: 'bab-10-rest-api-dan-backend-integration',
    judul: 'REST API dan Backend Integration',
    singkat: 'REST API',
    pertemuan: 'Pertemuan 10–11',
    status: 'lengkap',
    berkas: [
      { file: 'index.html', judul: 'Ikhtisar' },
      { file: 'bagian-1.html', judul: 'Bagian 1 — Client–Server, HTTP, REST, dan JSON' },
      { file: 'bagian-2.html', judul: 'Bagian 2 — Metode HTTP dan Status Code' },
      { file: 'bagian-3.html', judul: 'Bagian 3 — fetch: GET, POST, PUT, dan DELETE' },
      { file: 'bagian-4.html', judul: 'Bagian 4 — Tiga State Antarmuka, Base URL, dan Struktur File' },
      { file: 'bagian-5.html', judul: 'Bagian 5 — Studi Kasus dan Pengantar Autentikasi' },
      { file: 'praktikum.html', judul: 'Praktikum Bab 10 — Menghubungkan Aplikasi ke Server' },
    ],
  },
  {
    slug: 'bab-11-penyimpanan-data-lokal',
    judul: 'Penyimpanan Data Lokal',
    singkat: 'Data Lokal',
    pertemuan: 'Pertemuan 12',
    status: 'lengkap',
    berkas: [
      { file: 'index.html', judul: 'Ikhtisar' },
      { file: 'bagian-1.html', judul: 'Bagian 1 — Kebutuhan & AsyncStorage' },
      { file: 'bagian-2.html', judul: 'Bagian 2 — JSON, Cache & Token' },
      { file: 'bagian-3.html', judul: 'Bagian 3 — Proyek Aplikasi Catatan' },
      { file: 'praktikum.html', judul: 'Praktikum Bab 11 — Aplikasi Catatan' },
    ],
  },
  {
    slug: 'bab-12-mengakses-fitur-perangkat',
    judul: 'Mengakses Fitur Perangkat',
    singkat: 'Fitur Perangkat',
    pertemuan: 'Pertemuan 13',
    status: 'lengkap',
    berkas: [
      { file: 'index.html', judul: 'Ikhtisar' },
      { file: 'bagian-1.html', judul: 'Bagian 1 — API Perangkat & Izin' },
      { file: 'bagian-2.html', judul: 'Bagian 2 — Kamera & Lokasi' },
      { file: 'bagian-3.html', judul: 'Bagian 3 — Notifikasi, File & Info Perangkat' },
      { file: 'bagian-4.html', judul: 'Bagian 4 — Privasi & Proyek Mini' },
      { file: 'praktikum.html', judul: 'Praktikum Bab 12 — Aplikasi Profil Mahasiswa' },
    ],
  },
  {
    slug: 'bab-13-autentikasi-dan-keamanan-aplikasi',
    judul: 'Autentikasi dan Keamanan Aplikasi',
    singkat: 'Autentikasi',
    pertemuan: 'Pertemuan 14',
    status: 'lengkap',
    berkas: [
      { file: 'index.html', judul: 'Ikhtisar' },
      { file: 'bagian-1.html', judul: 'Bagian 1 — Autentikasi, Session & Token' },
      { file: 'bagian-2.html', judul: 'Bagian 2 — Perlindungan, Penyimpanan & Keamanan API' },
      { file: 'praktikum.html', judul: 'Praktikum Bab 13 — Login, Token, dan Logout' },
    ],
  },
  {
    slug: 'bab-14-debugging-testing-dan-quality-assurance',
    judul: 'Debugging, Testing, dan Quality Assurance',
    singkat: 'Debug & QA',
    pertemuan: 'Pertemuan 15',
    status: 'lengkap',
    berkas: [
      { file: 'index.html', judul: 'Ikhtisar' },
      { file: 'bagian-1.html', judul: 'Bagian 1 — Debugging: Console dan DevTools' },
      { file: 'bagian-2.html', judul: 'Bagian 2 — Error Umum dan Debugging Jaringan' },
      { file: 'bagian-3.html', judul: 'Bagian 3 — Testing dan Quality Assurance' },
      { file: 'praktikum.html', judul: 'Praktikum Bab 14 — Unit Test, Console, dan Checklist' },
    ],
  },
  {
    slug: 'bab-15-build-dan-deployment',
    judul: 'Build dan Deployment',
    singkat: 'Build & Deploy',
    pertemuan: 'Pertemuan 15',
    status: 'lengkap',
    berkas: [
      { file: 'index.html', judul: 'Ikhtisar' },
      { file: 'bagian-1.html', judul: 'Bagian 1 — Dari Kode ke Berkas yang Bisa Dipasang' },
      { file: 'bagian-2.html', judul: 'Bagian 2 — Identitas Aplikasi dan Keaslian Berkas' },
      { file: 'bagian-3.html', judul: 'Bagian 3 — Distribusi dan Tiga Lingkungan' },
      { file: 'praktikum.html', judul: 'Praktikum Bab 15 — Build APK dan Laporan Build' },
    ],
  },
]

export function cariBab(slug) {
  return BABS.find((b) => b.slug === slug)
}

export function cariBerkas(bab, file) {
  return bab?.berkas.find((b) => b.file === file)
}
