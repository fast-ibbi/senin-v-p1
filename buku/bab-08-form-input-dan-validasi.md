# BAB 8 — Form, Input, dan Validasi

## Deskripsi Singkat

Bab ini membahas cara membangun **form** (formulir) yang utuh pada aplikasi React Native Expo: komponen **TextInput** (masukan teks) secara mendalam, konsep **controlled component** (komponen terkendali), pengelolaan state form, validasi input dengan fungsi murni, penanganan keyboard, serta prinsip UX form pada layar sentuh. Mahasiswa akan membangun tiga form nyata — Login, Registrasi, dan Data Mahasiswa — yang melengkapi rute aplikasi yang sudah dibuat di Bab 7. Materi ini menjadi fondasi integrasi API (Bab 10), penyimpanan data (Bab 11), autentikasi (Bab 13), dan pengujian unit pada validasi (Bab 14).

## Tujuan Pembelajaran

Setelah mempelajari bab ini, mahasiswa mampu:

1. Menjelaskan perilaku dan props utama **TextInput** serta strategi penanganan keyboard pada aplikasi mobile.
2. Menganalisis konsep **controlled component** dan alasan state dijadikan sumber kebenaran tunggal (single source of truth) untuk nilai input.
3. Merancang form state berbasis objek tunggal dengan fungsi `handleChange` yang dapat dipakai ulang lintas field.
4. Mengimplementasikan validasi input dengan fungsi murni untuk aturan wajib diisi, email, kata sandi, telepon, dan batas panjang, lalu menampilkan pesan error per field.
5. Mengevaluasi trade-off (pertukaran keuntungan) antara tombol submit nonaktif dan validasi saat submit, serta menerapkan pilihan yang tepat sesuai konteks.
6. Merancang komponen form reusable `FormField` dan menerapkannya pada tiga form nyata aplikasi.

## Peta Konsep

```text
┌───────────────────── FORM, INPUT & VALIDASI ─────────────────────┐
│                                                                  │
│  TextInput (props) ──► Controlled Component ──► Form State       │
│   value/onChangeText     (state = sumber        (objek tunggal + │
│   keyboard/keyboardType   kebenaran)             handleChange)   │
│        │                       │                     │           │
│        ▼                       ▼                     ▼           │
│  Keyboard:            Validasi: fungsi murni ◄── jalankanAturan  │
│  KeyboardAvoidingView  (required, email, password,               │
│  keyboardShouldPersistTaps  telepon, panjang)                    │
│                                 │                                │
│                                 ▼                                │
│            errors state → pesan error per field                  │
│                                 │                                │
│                                 ▼                                │
│     UX form: validasi saat submit vs tombol nonaktif             │
│              (trade-off, pilih + jelaskan)                       │
│                                 │                                │
│                                 ▼                                │
│  Reusable FormField ──► Form Login / Registrasi / Mahasiswa      │
└──────────────────────────────────────────────────────────────────┘
```

## Materi

### 8.1 TextInput dan Keyboard

**TextInput** adalah komponen inti React Native untuk menerima ketikan satu baris atau banyak baris (multiline) dari pengguna. Penggunaan dasarnya telah diperkenalkan di Bab 5; pada bab ini kita mendalaminya karena TextInput adalah bahan baku setiap form. Karakteristik pertama yang harus dipahami: TextInput **tidak menyimpan nilainya sendiri** dalam logika aplikasi — setiap ketikan memicu peristiwa (event) dan nilai yang diketik harus disimpan oleh komponen lain, biasanya state React (Bab 4). Karakteristik ini yang melahirkan konsep controlled component pada Subbab 8.2.

Props utama TextInput yang akan dipakai terus-menerus pada bab ini dirangkum pada Tabel 8.1.

**Tabel 8.1** Props utama TextInput

| Prop | Fungsi | Contoh nilai |
|------|--------|--------------|
| `value` | Nilai teks yang sedang ditampilkan, dikontrol dari luar | `{form.email}` |
| `onChangeText` | Dipanggil setiap kali teks berubah, menerima teks baru | `(teks) => handleChange('email', teks)` |
| `placeholder` | Teks contoh yang tampil saat field kosong | `"contoh: 2201001"` |
| `keyboardType` | Jenis papan ketik virtual yang muncul | `"email-address"`, `"number-pad"`, `"decimal-pad"`, `"phone-pad"` |
| `secureTextEntry` | Menyamarkan ketikan (untuk kata sandi) | `secureTextEntry` |
| `autoCapitalize` | Kapitalisasi otomatis: `"none"`, `"sentences"`, `"words"`, `"characters"` | `autoCapitalize="none"` |
| `autoCorrect` | Koreksi ejaan otomatis | `autoCorrect={false}` |
| `returnKeyType` | Label tombol Enter di papan ketik | `"next"`, `"done"` |
| `maxLength` | Batas jumlah karakter yang dapat diketik | `maxLength={10}` |
| `multiline` | Mengizinkan lebih dari satu baris | `multiline` |
| `onSubmitEditing` | Dipanggil saat tombol Enter ditekan | `onSubmitEditing={handleSubmit}` |
| `editable` | Mengunci field agar tidak dapat diedit | `editable={false}` |

Ketiga props pertama (nilai, sumber peristiwa, dan teks contoh) adalah pasangan konseptual yang wajib hadir di setiap field form. `keyboardType` penting karena papan ketik virtual (virtual keyboard) mobile tidak memiliki tombol fisik — memilih `"number-pad"` untuk NIM menghadirkan papan angka sehingga kesalahan ketik berkurang. `autoCapitalize="none"` dan `autoCorrect={false}` dipakai pada field email karena alamat email peka huruf, sedangkan koreksi ejaan justru sering merusak teks yang diketik.

Mengapa penanganan keyboard menjadi topik khusus dalam pengembangan mobile? Karena papan ketik virtual menempati separuh layar saat muncul — ia menutupi field bagian bawah dan tombol submit, sementara perangkat tidak menyediakan cara alami untuk menyingkirkannya selain tombol "kembali". Dua strategi baku yang disediakan React Native:

1. **KeyboardAvoidingView** (tampilan yang menghindari papan ketik) — komponen pembungkus yang menggeser kontennya ke atas saat papan ketik muncul, sehingga field yang sedang diketik tetap terlihat. Prop `behavior` menentukan cara pergeseran: `"padding"` menambah ruang bawah, `"height"` mengecilkan tinggi. Keduanya memberi hasil berbeda antar platform, sehingga pola umum yang dipakai adalah `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`.
2. **keyboardShouldPersistTaps** — prop `ScrollView` yang mengatur apa yang terjadi saat pengguna mengetuk layar ketika papan ketik terbuka. Nilai `"handled"` berarti ketukan pada elemen yang punya penangan (misalnya tombol) langsung dieksekusi; tanpa prop ini, ketukan pertama hanya menutup papan ketik dan tombol perlu ditekan dua kali — perilaku yang sering dikeluhkan pengguna.

Perilaku papan ketik juga diatur lewat `returnKeyType`: `"next"` memindahkan fokus ke field berikutnya (biasanya dipasangkan `onSubmitEditing`), `"done"` menutup keyboard sambil memicu submit — rantai "next → next → done" memungkinkan formulir diselesaikan tanpa menyentuh layar. `*⚠ version-sensitive: nilai keyboardType dan perilaku behavior bisa berbeda tipis antar versi SDK dan platform; periksa dokumentasi resmi (reactnative.dev) untuk nilai terkini.*`

### 8.2 Controlled Component

**Controlled component** (komponen terkendali) adalah pola di mana nilai sebuah input sepenuhnya ditentukan oleh state React: `value` selalu berisi isi state, dan setiap ketikan hanya dapat mengubah state melalui `onChangeText`. Cuplikan berikut menunjukkan pola ini pada field email.

File: screens/FormLogin.js
```jsx
// (cuplikan: controlled component dengan TextInput polos)
<TextInput
  value={form.email}
  onChangeText={(teks) => setForm((sebelumnya) => ({ ...sebelumnya, email: teks }))}
  placeholder="nama.kecil@students.univ.ac.id"
/>
```

**Penjelasan:** `value={form.email}` menampilkan isi state; tiap ketikan memicu `onChangeText`, dan `setForm` memperbarui state dengan menyebar (spread) nilai sebelumnya lalu menimpa kunci `email` (pola Bab 3 dan Bab 4). Hasilnya, teks yang tampil dan state aplikasi selalu identik — tidak ada "salinan kedua" nilai di dalam komponen; state disebut **sumber kebenaran tunggal** (single source of truth).

Mengapa React dan React Native memilih pola terkendali alih-alih membiarkan input mengelola nilainya sendiri (pola tak terkendali, uncontrolled, dengan prop `defaultValue`)? Sebab nilai input yang hidup di state dapat **dibaca, divalidasi, diubah, dan direset** oleh kode kapan saja — tiga hal yang tidak mungkin dilakukan bila nilai hanya diketahui oleh TextInput internal. Keuntungan ini langsung terasa pada kasus nyata: form mode edit harus bisa diisi ulang secara programatik dari data lama (lihat FormMahasiswa pada Subbab 8.6), validasi butuh membaca nilai sebelum dikirim, dan tombol reset cukup mengembalikan state ke nilai awal. Pola tak terkendali masih relevan untuk kasus yang sangat sederhana, tetapi form yang divalidasi — hampir semua form produksi — memakai pola terkendali.

### 8.3 Form State

Form dengan banyak field menghadapi pertanyaan desain: menyimpan nilai setiap field dalam state terpisah (`useState` untuk NIM, `useState` untuk nama, dan seterusnya) atau dalam **satu objek state**. Bab ini memilih objek tunggal, dan pola tersebut ditunjukkan pada cuplikan berikut.

File: screens/FormMahasiswa.js
```jsx
// (cuplikan: form state objek tunggal + handleChange generik)
const [form, setForm] = useState({
  nim: '',
  nama: '',
  prodi: '',
  angkatan: '',
  ipk: '',
  email: '',
  telepon: '',
});

function handleChange(namaField, nilai) {
  setForm((sebelumnya) => ({
    ...sebelumnya,
    [namaField]: nilai,
  }));
}
```

**Penjelasan:** seluruh nilai form hidup dalam satu objek `form` yang kunci-kuncinya persis menyamai nama field dan struktur data mahasiswa buku ini (`{ nim, nama, prodi, angkatan, ipk, email, telepon }`). `handleChange` memakai nama kunci terhitung (computed property name, Bab 3) sehingga satu fungsi melayani semua field: `handleChange('nim', '2201001')` memperbarui `form.nim`, `handleChange('nama', 'Budi')` memperbarui `form.nama` — lebih sedikit kode diulang (DRY) dan aturan validasi cukup ditulis sekali per field.

Pilihan objek tunggal bukan tanpa pertukaran. Kelebihannya: reset form tinggal mengisi objek kembali; pengiriman ke server tinggal mengirim `form` sekaligus (dipakai Bab 10); validasi dapat berjalan terhadap satu objek utuh. Kekurangannya: setiap ketikan harus menyebar objek lama (mekanisme immutability React, Bab 4), dan risiko menimpa field lain bila lupa menyebar. Untuk form berskala kecil-menengah, keterbacaan dan kemudahan reset mengalahkan kerumitan baris — keputusan yang mencerminkan praktik aplikasi produksi. Bab 9 menunjukkan cara mengangkat objek form ke state global bila beberapa layar perlu membacanya.

### 8.4 Validasi Input: Required, Email, Password, Telepon, Panjang Karakter

**Validasi** (pemeriksaan keabsahan) adalah proses memastikan data yang dimasukkan pengguna memenuhi aturan sebelum digunakan. Mengapa validasi ada? Karena data yang salah masuk ke sistem adalah biaya: email yang salah eja berarti informasi akademik tidak sampai ke mahasiswa, telepon yang kurang digit berarti dosen wali tidak dapat menghubungi orang tua, NIM yang salah format merusak laporan pangkalan data. Prinsip lama dalam sistem informasi berlaku di sini: *garbage in, garbage out* — data buruk yang masuk menghasilkan keluaran yang buruk pula. Validasi form adalah pertahanan pertama, tetapi bukan satu-satunya: buku ini menganut pertahanan berlapis (defense in depth) — sisi klien (bab ini), sisi server (Bab 10 dan Bab 13), dan skema database. Validasi klien tidak menggantikan validasi server; ia membuat kesalahan terdeteksi lebih awal.

Pendekatan yang dipakai bab ini: **fungsi murni** (pure function). Fungsi murni adalah fungsi deterministik tanpa efek samping — dengan masukan yang sama selalu menghasilkan keluaran yang sama, dan tidak mengubah apa pun di luar dirinya. Semua fungsi validasi berada di satu file `utils/validators.js` dengan kontrak sederhana: menerima nilai input, mengembalikan **pesan error** (string) bila tidak valid, atau **string kosong** bila valid. Kontrak satu arah ini membuat fungsi validasi mudah dipakai ulang lintas form dan mudah diuji otomatis (Bab 14).

File: utils/validators.js
```js
// (cuplikan: tiga fungsi inti — versi lengkap pada Praktikum 8)
export function wajibDiisi(nilai = '') {
  return nilai.toString().trim() === '' ? 'Field ini wajib diisi' : '';
}

export function validasiEmail(nilai = '') {
  const teks = nilai.trim();
  if (teks === '') return '';
  const pola = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pola.test(teks) ? '' : 'Format email tidak valid (contoh: nama@domain.com)';
}

export function validasiPassword(nilai = '') {
  if (nilai === '') return '';
  return nilai.length >= 6 ? '' : 'Kata sandi minimal 6 karakter';
}
```

**Penjelasan:** ketiga fungsi mematuhi kontrak yang sama. `wajibDiisi` memakai `trim()` agar spasi kosong dianggap tidak terisi. `validasiEmail` menggunakan pola reguler (regular expression) sederhana `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` yang cukup memastikan ada rangkaian karakter, tanda `@`, domain, dan titik — sengaja tidak meniru spesifikasi email resmi (RFC 5322) yang sangat kompleks, karena untuk pemberitahuan kesalahan di layar, pemeriksaan sederhana sudah menangkap 99% salah ketik pengguna. `validasiPassword` menegakkan panjang minimal 6 karakter; aturan kekuatan kata sandi yang lebih ketat adalah keputusan kebijakan keamanan, dibahas di Bab 13.

Karena setiap field bisa punya lebih dari satu aturan (misalnya email: wajib diisi **dan** format valid), diperlukan cara menjalankan aturan berurutan. Bab ini memakai tabel aturan dan fungsi pembantu `jalankanAturan`:

File: utils/validators.js
```js
// (cuplikan: menjalankan beberapa aturan berurutan)
export function jalankanAturan(aturan, nilai, konteks) {
  for (const fungsi of aturan) {
    const pesan = fungsi(nilai, konteks);
    if (pesan !== '') return pesan;
  }
  return '';
}

// pemakaian di layar form:
// jalankanAturan([wajibDiisi, validasiEmail], form.email)
```

**Penjelasan:** `jalankanAturan` menerima daftar fungsi aturan dan menghentikan pemeriksaan pada pesan error pertama yang ditemukan — pesan yang paling relevan ditampilkan lebih dulu. Argumen `konteks` bersifat opsional dan dipakai aturan yang membutuhkan nilai field lain, misalnya perbandingan kata sandi dengan konfirmasinya di FormRegistrasi. Dengan pola ini, menambah aturan baru cukup menambahkan fungsi di `validators.js` dan mendaftarkannya di tabel aturan; tidak ada logika validasi yang tersebar di dalam tampilan.

Tabel 8.2 merangkum aturan yang disediakan `validators.js` untuk bab ini.

**Tabel 8.2** Fungsi validasi dan pemakaiannya

| Fungsi | Aturan | Contoh pesan error |
|--------|--------|--------------------|
| `wajibDiisi(nilai)` | Nilai tidak boleh kosong (spasi diabaikan) | "Field ini wajib diisi" |
| `validasiEmail(nilai)` | Pola email sederhana | "Format email tidak valid (contoh: nama@domain.com)" |
| `validasiPassword(nilai)` | Minimal 6 karakter | "Kata sandi minimal 6 karakter" |
| `validasiKonfirmasiPassword(nilai, password)` | Harus sama dengan kata sandi | "Konfirmasi kata sandi tidak sama" |
| `validasiTelepon(nilai)` | 10–13 digit angka (tanpa memperhatikan spasi/tanda) | "Nomor telepon harus 10 sampai 13 digit angka" |
| `validasiPanjang(nilai, maksimal)` | Tidak melebihi panjang maksimal | "Maksimal 50 karakter" |
| `validasiNim(nilai)` | Hanya angka, maksimal 10 digit | "NIM hanya boleh berisi angka" |
| `validasiAngkatan(nilai)` | 4 digit, rentang 2000–2030 | "Angkatan berupa 4 digit, contoh: 2024" |
| `validasiIpk(nilai)` | Angka desimal 0.00–4.00 | "IPK harus antara 0.00 dan 4.00" |

Perhatikan `validasiTelepon`: alih-alih memaksa format tertentu, fungsi menghitung jumlah digit setelah membuang semua karakter bukan angka (`replace(/\D/g, '')`). Alasannya, pengguna menulis nomor dengan gaya berbeda — `081234567890`, `0812-3456-7890`, atau `+62 812-3456-7890` — dan yang penting bagi sistem hanyalah jumlah digitnya benar (10–13, mengikuti nomor Indonesia `08xxxxxxxxxx`). Memvalidasi maksud data, bukan gaya mengetiknya, adalah prinsip UX Subbab 8.5.

Kapan validasi dijalankan? Ada tiga momen yang umum: **(1) saat submit** — seluruh field diperiksa sekaligus ketika tombol ditekan; **(2) saat field ditinggalkan** (on blur); **(3) saat mengetik** (real-time). Submit menghasilkan daftar error lengkap tanpa mengganggu ketikan; real-time terasa responsif tetapi bisa menjengkelkan bila pesan muncul saat field baru pertama kali disentuh. Solusi yang dipakai bab ini adalah kombinasi: validasi penuh saat submit, lalu **validasi ulang field per ketikan setelah percobaan submit pertama** (ditandai state `sudahDikirim`). Dengan cara ini pengguna melihat semua kesalahan pertama kali, dan setiap perbaikan langsung direspons — pola ini diterapkan konsisten di ketiga form bab ini.

### 8.5 Error Handling dan UX Form Mobile

Menampilkan error dengan baik hampir sama pentingnya dengan mendeteksinya. Beberapa prinsip UX yang diadopsi:

1. **Pesan spesifik dan dekat field.** "Input salah" tidak memberi tahu cara memperbaiki; "Format email tidak valid (contoh: nama@domain.com)" memberi contoh yang bisa ditiru. Pesan diletakkan tepat di bawah field bermasalah agar mudah ditemukan.
2. **Dua sinyal sekaligus.** Field ditandai dengan warna border merah **dan** teks pesan. Warna saja tidak cukup karena sebagian pengguna buta warna dan screen reader tidak membacanya — prinsip aksesibilitas ini dibahas di Bab 6.
3. **Konsisten dan ringkas.** Semua pesan mengikuti gaya yang sama (kalimat pendek, tanpa tanda seru berlebihan), sehingga pengguna belajar membaca polanya.
4. **Nilai tidak dihapus.** Field yang gagal validasi tidak direset; pengguna cukup memperbaiki bagian yang salah.

Dua strategi besar untuk mencegah submit data invalid perlu dibandingkan secara jujur: **tombol submit nonaktif** (disabled) versus **validasi saat submit**. Tombol nonaktif — tombol yang berubah kelabu dan tidak merespons selama form belum valid — menjamin data yang dikirim selalu lolos validasi klien; keunggulan ini terasa pada form panjang yang biaya pengirimannya mahal (misalnya form yang langsung memanggil API, Bab 10). Namun strategi ini menyimpan kelemahan serius: selama tombol nonaktif, pengguna tidak pernah melihat pesan error, sehingga ia menebak-nebak syarat yang tidak terpenuhi; tombol kelabu juga kurang aksesibel dan membuat form terasa "mati" bila tanpa validasi real-time paralel. Validasi saat submit membuat syarat form transparan: tombol selalu aktif, error muncul setelah penekanan, dan pengguna memperbaiki dengan bimbingan pesan per field.

Bab ini memilih **validasi saat submit + validasi real-time setelah percobaan pertama**, dengan alasan: form yang dibangun (login, registrasi, data mahasiswa) berukuran kecil-menengah, dan tujuan pembelajaran adalah penguasaan pola penanganan error, bukan pencegahan pengiriman. Penerapannya terlihat konsisten di Subbab 8.7 dan Praktikum 8; pola tombol nonaktif beserta trade-offnya disajikan pada Contoh 1.

Selain pola di atas, UX form mobile yang baik memperhatikan hal-hal kecil berikut. **Label permanen** harus dibedakan dari **placeholder**: label ("Email") menjelaskan nama field dan selalu tampil; placeholder ("nama.kecil@students.univ.ac.id") memberi contoh nilai dan menghilang saat mengetik — placeholder tidak boleh menggantikan label: begitu pengguna mengetik, petunjuknya lenyap. Keyboard dikelola dengan `keyboardType`, `returnKeyType`, KeyboardAvoidingView, dan `keyboardShouldPersistTaps` sebagaimana Subbab 8.1. Kata sandi memakai `secureTextEntry`; field angka memakai `maxLength` agar ketikan tidak melebihi kebutuhan.

### 8.6 Reusable Form Component

Tiga form pada bab ini berulang-ulang membutuhkan hal yang sama: label, TextInput bergaya konsisten, dan pesan error di bawahnya. Mengulang kode di tiga layar berarti tiga tempat yang harus diubah bila gaya berubah — melanggar DRY dan rawan tidak konsisten. Solusinya adalah **komponen reusable** (komponen yang dapat dipakai ulang) `FormField`: satu komponen yang merangkum pola "label + TextInput + pesan error", menerima label dan error sebagai props, dan meneruskan semua props lainnya langsung ke TextInput. Ini memanfaatkan konsep komposisi komponen dari Bab 4.

File: components/FormField.js
```jsx
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function FormField({ label, error, ...propsLain }) {
  const tampilkanError = error !== undefined && error !== '';

  return (
    <View style={styles.wadah}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, tampilkanError && styles.inputError]}
        placeholderTextColor="#9ca3af"
        {...propsLain}
      />
      {tampilkanError && <Text style={styles.pesanError}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wadah: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  pesanError: {
    color: '#dc2626',
    fontSize: 13,
    marginTop: 4,
  },
});
```

**Penjelasan:** `FormField` menerima `label` (teks nama field), `error` (pesan error atau string kosong), dan `...propsLain` — operator sisa (rest, Bab 3) yang menampung semua props lain dan diteruskan ke TextInput dengan spread. Inilah kunci reusability komponen ini: pemakaian di luar cukup menulis `<FormField label="Email" value={form.email} onChangeText={...} keyboardType="email-address" error={errors.email} />`, dan semua props selain `label` dan `error` otomatis sampai ke TextInput tanpa perlu didaftarkan satu per satu. `tampilkanError` menghitung apakah error perlu ditampilkan; ketika ya, border berubah merah (gaya `inputError` ditumpukkan pada array gaya) dan teks pesan muncul di bawah field. Karena tampilan field didefinisikan satu kali di sini, konsistensi visual tiga form dijamin dari satu sumber. Pola "satu komponen, banyak pemakaian" ini kelak dirapikan dengan custom hooks di Bab 9.

### 8.7 Implementasi: Form Login, Registrasi, dan Data Mahasiswa

Subbab ini merakit seluruh materi menjadi tiga form utuh. Ketiganya mengikuti arsitektur layar yang sama: **layar form** (screen) ditulis sebagai komponen di folder `screens/`, lalu didaftarkan pada **rute** Expo Router yang sudah dibuat di Bab 7. Tabel 8.3 memetakan form ke rute aplikasi Manajemen Data Mahasiswa.

**Tabel 8.3** Pemetaan form ke rute

| Form | File layar | Rute (dibuat di Bab 7) |
|------|------------|------------------------|
| Login | `screens/FormLogin.js` | `app/login.js` — isi placeholder diganti komponen ini |
| Registrasi | `screens/FormRegistrasi.js` | `app/registrasi.js` — rute baru, pola sama dengan login |
| Data Mahasiswa | `screens/FormMahasiswa.js` | `app/(app)/mahasiswa/tambah.js` — lihat Praktikum 8 |

Pemisahan layar dari rute (folder `screens/` berisi logika form, file rute hanya merender komponen) adalah penerapan pemisahan tanggung jawab: rute mengatur *posisi* layar dalam navigasi, layar mengatur *isi* dan perilakunya. Ketiga form memakai pola internal yang identik — tabel aturan `ATURAN_*`, `validasiSatuField`, `validasiSemuaField`, `handleChange`, dan `handleSubmit` dengan state `sudahDikirim` — sehingga setelah memahami satu form, dua form lainnya terbaca tanpa usaha baru. Perbedaan ketiganya hanya pada daftar field dan aturannya.

**FormLogin** memuat dua field — email dan kata sandi — dan menjadi contoh paling ringkas dari pola tersebut.

File: screens/FormLogin.js
```jsx
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import FormField from '../components/FormField';
import {
  jalankanAturan,
  validasiEmail,
  validasiPassword,
  wajibDiisi,
} from '../utils/validators';

// Tabel aturan per field: setiap field berisi daftar fungsi validasi
// yang dijalankan berurutan oleh jalankanAturan.
const ATURAN_LOGIN = {
  email: [wajibDiisi, validasiEmail],
  password: [wajibDiisi, validasiPassword],
};

export default function FormLogin({ onSubmit = () => {} }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [sudahDikirim, setSudahDikirim] = useState(false);

  function validasiSatuField(namaField, nilai) {
    return jalankanAturan(ATURAN_LOGIN[namaField] || [], nilai);
  }

  function validasiSemuaField() {
    const hasil = {};
    for (const namaField of Object.keys(ATURAN_LOGIN)) {
      hasil[namaField] = validasiSatuField(namaField, form[namaField]);
    }
    return hasil;
  }

  function handleChange(namaField, nilai) {
    setForm((sebelumnya) => ({ ...sebelumnya, [namaField]: nilai }));
    // Setelah percobaan submit pertama, error divalidasi ulang
    // secara real-time setiap kali pengguna mengetik.
    if (sudahDikirim) {
      setErrors((sebelumnya) => ({
        ...sebelumnya,
        [namaField]: validasiSatuField(namaField, nilai),
      }));
    }
  }

  function handleSubmit() {
    const hasil = validasiSemuaField();
    setErrors(hasil);
    setSudahDikirim(true);
    const formValid = Object.values(hasil).every((pesan) => pesan === '');
    if (formValid) {
      onSubmit(form);
      Alert.alert(
        'Masuk Berhasil',
        'Data login valid. Autentikasi terhadap server dibahas di Bab 13.'
      );
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.halaman}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.konten} keyboardShouldPersistTaps="handled">
        <Text style={styles.judul}>Masuk</Text>
        <FormField
          label="Email"
          value={form.email}
          onChangeText={(teks) => handleChange('email', teks)}
          placeholder="nama.kecil@students.univ.ac.id"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          error={errors.email}
        />
        <FormField
          label="Kata Sandi"
          value={form.password}
          onChangeText={(teks) => handleChange('password', teks)}
          placeholder="minimal 6 karakter"
          secureTextEntry
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          error={errors.password}
        />
        <Pressable
          style={({ pressed }) => [styles.tombol, pressed && styles.tombolTekan]}
          onPress={handleSubmit}
        >
          <Text style={styles.teksTombol}>Masuk</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  halaman: { flex: 1, backgroundColor: '#f9fafb' },
  konten: { padding: 20 },
  judul: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  tombol: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  tombolTekan: { opacity: 0.8 },
  teksTombol: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
```

**Penjelasan:** alur `FormLogin` dipakai semua form bab ini: `ATURAN_LOGIN` mendaftarkan aturan tiap field; `validasiSemuaField` melingkari tabel dan mengumpulkan pesan ke objek `errors`; `Object.values(hasil).every((pesan) => pesan === '')` memeriksa seluruh field valid (metode `every`, Bab 3). Setelah submit pertama, `sudahDikirim` bernilai `true` sehingga setiap ketikan memicu validasi ulang field yang bersangkutan; error yang diperbaiki langsung hilang tanpa menekan tombol lagi. Saat form valid, data dikirim lewat `onSubmit` dan `Alert` tampil. Ditegaskan lagi: layar ini baru memvalidasi format — autentikasi sungguhan (memeriksa akun di server) dibahas di Bab 13.

**FormRegistrasi** menambahkan dua hal yang memperkaya pemahaman: aturan bertingkat untuk nama, serta field konfirmasi kata sandi yang **bergantung pada field lain**.

File: screens/FormRegistrasi.js
```jsx
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import FormField from '../components/FormField';
import {
  jalankanAturan,
  validasiEmail,
  validasiKonfirmasiPassword,
  validasiPanjang,
  validasiPassword,
  wajibDiisi,
} from '../utils/validators';

const ATURAN_NAMA = [wajibDiisi, (nilai) => validasiPanjang(nilai, 50)];
const ATURAN_EMAIL = [wajibDiisi, validasiEmail];
const ATURAN_PASSWORD = [wajibDiisi, validasiPassword];
const ATURAN_KONFIRMASI = [wajibDiisi, validasiKonfirmasiPassword];

export default function FormRegistrasi({ onSubmit = () => {} }) {
  const [form, setForm] = useState({
    nama: '',
    email: '',
    password: '',
    konfirmasiPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [sudahDikirim, setSudahDikirim] = useState(false);

  function validasiSatuField(namaField, nilai) {
    if (namaField === 'konfirmasiPassword') {
      // Butuh nilai password saat ini sebagai konteks pembanding.
      return jalankanAturan(ATURAN_KONFIRMASI, nilai, form.password);
    }
    if (namaField === 'nama') return jalankanAturan(ATURAN_NAMA, nilai);
    if (namaField === 'email') return jalankanAturan(ATURAN_EMAIL, nilai);
    return jalankanAturan(ATURAN_PASSWORD, nilai);
  }

  function validasiSemuaField() {
    return {
      nama: validasiSatuField('nama', form.nama),
      email: validasiSatuField('email', form.email),
      password: validasiSatuField('password', form.password),
      konfirmasiPassword: validasiSatuField('konfirmasiPassword', form.konfirmasiPassword),
    };
  }

  function handleChange(namaField, nilai) {
    const formBaru = { ...form, [namaField]: nilai };
    setForm(formBaru);
    if (sudahDikirim) {
      setErrors((sebelumnya) => {
        const hasil = { ...sebelumnya, [namaField]: validasiSatuField(namaField, nilai) };
        // Jika password berubah, konfirmasi password harus dicek ulang
        // karena kemungkinan besar menjadi tidak sama.
        if (namaField === 'password') {
          hasil.konfirmasiPassword = validasiSatuField(
            'konfirmasiPassword',
            formBaru.konfirmasiPassword
          );
        }
        return hasil;
      });
    }
  }

  function handleSubmit() {
    const hasil = validasiSemuaField();
    setErrors(hasil);
    setSudahDikirim(true);
    const formValid = Object.values(hasil).every((pesan) => pesan === '');
    if (formValid) {
      onSubmit(form);
      Alert.alert(
        'Registrasi Diterima',
        'Akun dibuat pada state lokal. Penyimpanan permanen dibahas di Bab 11 dan autentikasi di Bab 13.'
      );
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.halaman}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.konten} keyboardShouldPersistTaps="handled">
        <Text style={styles.judul}>Daftar Akun Baru</Text>
        <FormField
          label="Nama Lengkap"
          value={form.nama}
          onChangeText={(teks) => handleChange('nama', teks)}
          placeholder="contoh: Budi Santoso"
          autoCapitalize="words"
          returnKeyType="next"
          error={errors.nama}
        />
        <FormField
          label="Email"
          value={form.email}
          onChangeText={(teks) => handleChange('email', teks)}
          placeholder="nama.kecil@students.univ.ac.id"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          error={errors.email}
        />
        <FormField
          label="Kata Sandi"
          value={form.password}
          onChangeText={(teks) => handleChange('password', teks)}
          placeholder="minimal 6 karakter"
          secureTextEntry
          autoCapitalize="none"
          returnKeyType="next"
          error={errors.password}
        />
        <FormField
          label="Konfirmasi Kata Sandi"
          value={form.konfirmasiPassword}
          onChangeText={(teks) => handleChange('konfirmasiPassword', teks)}
          placeholder="ketik ulang kata sandi"
          secureTextEntry
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          error={errors.konfirmasiPassword}
        />
        <Pressable
          style={({ pressed }) => [styles.tombol, pressed && styles.tombolTekan]}
          onPress={handleSubmit}
        >
          <Text style={styles.teksTombol}>Daftar</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  halaman: { flex: 1, backgroundColor: '#f9fafb' },
  konten: { padding: 20 },
  judul: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  tombol: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  tombolTekan: { opacity: 0.8 },
  teksTombol: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
```

**Penjelasan:** aturan nama memakai fungsi panah `(nilai) => validasiPanjang(nilai, 50)` agar aturan dengan parameter berbeda tetap cocok dengan `jalankanAturan`. `validasiSatuField` untuk `konfirmasiPassword` memanggil `jalankanAturan(ATURAN_KONFIRMASI, nilai, form.password)` sehingga fungsi `validasiKonfirmasiPassword` menerima kata sandi sebagai konteks. Perhatikan `handleChange`: bila kata sandi berubah, error konfirmasi ikut dihitung ulang — "konfirmasi tidak sama" yang sebelumnya benar bisa menjadi salah setelah kata sandi diganti. Sinkronisasi lintas field ini hanya mungkin berkat sumber kebenaran tunggal (Subbab 8.2).

Form ketiga, **FormMahasiswa** (form data mahasiswa: nim, nama, prodi, angkatan, ipk, email, telepon) — form terlengkap dengan pemilihan program studi memakai chip — dibangun langkah demi langkah pada Praktikum 8.

## Contoh

**Contoh 1: Pola tombol submit nonaktif (disabled).** Subbab 8.5 memilih validasi saat submit; contoh ini memperlihatkan strategi alternatif yang dibahas pada trade-off tersebut: tombol nonaktif selama form belum valid, dilengkapi validasi saat field ditinggalkan (on blur) agar pengguna tetap mendapat umpan balik. Form Saran ini juga akan dikembangkan pada Latihan.

File: screens/FormSaran.js
```jsx
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { jalankanAturan, validasiPanjang, wajibDiisi } from '../utils/validators';

const ATURAN_SARAN = [wajibDiisi, (nilai) => validasiPanjang(nilai, 200)];

export default function FormSaran() {
  const [saran, setSaran] = useState('');
  const [error, setError] = useState('');

  const formValid = saran.trim() !== '' && saran.length <= 200;

  function handleBlur() {
    setError(jalankanAturan(ATURAN_SARAN, saran));
  }

  function handleSubmit() {
    if (formValid) {
      Alert.alert('Terima kasih', 'Saran Anda telah diterima.');
    }
  }

  return (
    <View style={styles.halaman}>
      <Text style={styles.label}>Saran Anda</Text>
      <TextInput
        style={[styles.input, error !== '' && styles.inputError]}
        value={saran}
        onChangeText={setSaran}
        onBlur={handleBlur}
        placeholder="tulis saran maksimal 200 karakter"
        multiline
      />
      {error !== '' && <Text style={styles.pesanError}>{error}</Text>}
      <Pressable
        style={[styles.tombol, !formValid && styles.tombolNonaktif]}
        disabled={!formValid}
        onPress={handleSubmit}
      >
        <Text style={styles.teksTombol}>Kirim Saran</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  halaman: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
  },
  inputError: { borderColor: '#dc2626' },
  pesanError: { color: '#dc2626', fontSize: 13, marginTop: 4 },
  tombol: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  tombolNonaktif: { backgroundColor: '#9ca3af' },
  teksTombol: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
```

**Penjelasan:** `formValid` dihitung langsung dari nilai `saran` — tombol `Pressable` diberi `disabled={!formValid}` sehingga tidak merespons dan berubah kelabu (gaya `tombolNonaktif`). Agar pengguna tidak dibiarkan menebak-nebak, validasi dijalankan saat field ditinggalkan (`onBlur`): jika saran kosong atau melebihi 200 karakter, pesan error tampil. Inilah trade-off Subbab 8.5: tombol nonaktif mencegah pengiriman data invalid, tetapi hanya nyaman bila validasi on-blur berjalan paralel — indikator error tidak akan pernah muncul dari penekanan tombol.

**Contoh 2: Pola kerangka layar form dengan penanganan keyboard.** Kerangka berikut dipakai semua layar form bab ini: KeyboardAvoidingView membungkus ScrollView, `keyboardShouldPersistTaps="handled"` membuat tombol langsung merespons saat keyboard terbuka, dan `returnKeyType` menyusun rantai "Berikutnya" menuju "Selesai".

File: screens/FormLogin.js
```jsx
// (cuplikan kerangka — versi lengkap pada Subbab 8.7)
<KeyboardAvoidingView
  style={styles.halaman}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
  <ScrollView contentContainerStyle={styles.konten} keyboardShouldPersistTaps="handled">
    <Text style={styles.judul}>Masuk</Text>
    {/* field-field form diletakkan di sini */}
  </ScrollView>
</KeyboardAvoidingView>
```

**Penjelasan:** pada iOS `behavior="padding"` menambah ruang di bawah konten sebesar tinggi keyboard, sedangkan pada Android `"height"` mengecilkan tinggi layar — keduanya membuat field yang sedang diketik tetap terlihat. `keyboardShouldPersistTaps="handled"` memastikan ketukan pada tombol submit tidak "ditelan" hanya untuk menutup keyboard, dan `Platform` didapat dari `import { Platform } from 'react-native'`.

## Praktikum

### Tujuan Praktikum

1. Membuat file fungsi validasi murni `utils/validators.js` dan menggunakannya pada form.
2. Merakit komponen reusable `FormField` bersama dengan pola form state dan `handleChange`.
3. Membangun layar `FormMahasiswa` lengkap (nim, nama, prodi, angkatan, ipk, email, telepon) dan menghubungkannya ke rute `app/(app)/mahasiswa/tambah.js` dari Bab 7.
4. Mengamati perilaku validasi saat submit, validasi real-time setelah submit, dan penanganan keyboard pada perangkat atau emulator.

### Kebutuhan

- Project aplikasi "Manajemen Data Mahasiswa" hasil Bab 7 (berisi struktur rute `app/`, `app/(app)/mahasiswa/tambah.js`, dan seterusnya), berbasis template blank Expo SDK 57 (Bab 2).
- Expo Go atau emulator Android (Bab 2), VS Code.
- Tidak ada dependency baru: seluruh materi bab ini memakai komponen inti React Native.

### Persiapan

1. Buka project di VS Code. Pastikan project berjalan dengan `npx expo start` dan layar Form (tambah mahasiswa) dari Bab 7 masih dapat diakses — saat ini layar tersebut masih berisi placeholder.
2. Buat folder `utils/` dan `components/` di root project bila belum ada, dan folder `screens/` bila belum ada. File-file praktikum ini akan diletakkan di ketiga folder tersebut.
3. Siapkan tabel data mahasiswa dari Bab 4 sebagai bahan uji: misalnya Budi Santoso (2201001, Sistem Informasi, 2022, IPK 3.45, budi.santoso@students.univ.ac.id, 081234567890). Data baku yang sama dipakai konsisten di seluruh buku.

### Langkah Kerja

1. Buat file `utils/validators.js` berisi seluruh fungsi validasi dari Subbab 8.4 (versi lengkap di bagian Kode), lalu simpan.
2. Buat file `components/FormField.js` persis seperti kode Subbab 8.6, lalu simpan.
3. Buat file `screens/FormMahasiswa.js` (bagian Kode langkah 3): form state objek tunggal, tabel `ATURAN_MAHASISWA`, chips pemilihan program studi, tombol "Simpan Data".
4. Ubah isi `app/(app)/mahasiswa/tambah.js` menjadi rute tipis yang merender `FormMahasiswa` dan menyimpan data hasil submit ke state lokal (bagian Kode langkah 4).
5. Jalankan kembali `npx expo start`, buka aplikasi, dan arahkan ke layar Tambah Mahasiswa melalui navigasi dari Bab 7.
6. Uji skenario tidak valid: tekan "Simpan Data" tanpa mengisi apa pun → semua field menampilkan "Field ini wajib diisi". Isi email salah format dan telepon 9 digit → pesan error sesuai aturan.
7. Uji validasi real-time: perbaiki satu field (misalnya ketik email valid) → error field tersebut hilang tanpa menekan tombol lagi.
8. Uji skenario valid: isi form dengan data Budi Santoso di atas → Alert "Data Tersimpan" muncul dan jumlah daftar bertambah.
9. Uji keyboard: ketik pada field Telepon (posisi terbawah) → field tetap terlihat karena KeyboardAvoidingView; tekan "Simpan Data" saat keyboard terbuka → tombol langsung merespons (satu ketukan).
10. Uji mode edit (pengayaan): beri prop `dataAwal` pada `FormMahasiswa` berisi data Budi Santoso, lalu pastikan seluruh field terisi otomatis dan validasi tetap bekerja.

### Kode

File: utils/validators.js
```js
// Kumpulan fungsi validasi murni (pure function).
// Kontrak: setiap fungsi menerima nilai input dan mengembalikan
// pesan error (string) atau string kosong '' jika nilai dianggap valid.

export function wajibDiisi(nilai = '') {
  return nilai.toString().trim() === '' ? 'Field ini wajib diisi' : '';
}

export function validasiEmail(nilai = '') {
  const teks = nilai.trim();
  if (teks === '') return '';
  const pola = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pola.test(teks) ? '' : 'Format email tidak valid (contoh: nama@domain.com)';
}

export function validasiPassword(nilai = '') {
  if (nilai === '') return '';
  return nilai.length >= 6 ? '' : 'Kata sandi minimal 6 karakter';
}

export function validasiKonfirmasiPassword(nilai = '', password = '') {
  if (nilai === '') return '';
  return nilai === password ? '' : 'Konfirmasi kata sandi tidak sama';
}

export function validasiTelepon(nilai = '') {
  const digit = nilai.replace(/\D/g, '');
  if (digit === '') return '';
  return digit.length >= 10 && digit.length <= 13
    ? ''
    : 'Nomor telepon harus 10 sampai 13 digit angka';
}

export function validasiPanjang(nilai = '', maksimal = 50) {
  return nilai.length <= maksimal ? '' : `Maksimal ${maksimal} karakter`;
}

export function validasiNim(nilai = '') {
  if (nilai === '') return '';
  if (!/^\d+$/.test(nilai)) return 'NIM hanya boleh berisi angka';
  return nilai.length <= 10 ? '' : 'NIM maksimal 10 digit';
}

export function validasiAngkatan(nilai = '') {
  if (nilai === '') return '';
  if (!/^\d{4}$/.test(nilai)) return 'Angkatan berupa 4 digit, contoh: 2024';
  const tahun = Number(nilai);
  return tahun >= 2000 && tahun <= 2030 ? '' : 'Angkatan di luar rentang 2000 sampai 2030';
}

export function validasiIpk(nilai = '') {
  if (nilai === '') return '';
  const angka = Number(nilai.replace(',', '.'));
  if (Number.isNaN(angka)) return 'IPK harus berupa angka desimal, contoh: 3.45';
  return angka >= 0 && angka <= 4 ? '' : 'IPK harus antara 0.00 dan 4.00';
}

// Menjalankan aturan berurutan; pesan error pertama yang muncul dikembalikan.
// Argumen konteks (opsional) dipakai aturan yang butuh nilai field lain,
// misalnya perbandingan kata sandi dengan konfirmasinya.
export function jalankanAturan(aturan, nilai, konteks) {
  for (const fungsi of aturan) {
    const pesan = fungsi(nilai, konteks);
    if (pesan !== '') return pesan;
  }
  return '';
}
```

**Penjelasan:** seluruh fungsi mematuhi kontrak "nilai masuk, pesan error atau string kosong keluar". Fungsi dimulai dengan pemeriksaan kosong sehingga aturan yang lebih spesifik tidak menimpa pesan "wajib diisi" — urutan aturan di tabel (wajib diisi lebih dulu) menentukan pesan mana yang tampil. `validasiTelepon` menghitung digit setelah membuang karakter non-angka, `validasiIpk` menormalkan koma desimal Indonesia (`,` → `.`) sebelum konversi angka, dan `validasiKonfirmasiPassword` menerima argumen kedua sebagai konteks.

File: screens/FormMahasiswa.js
```jsx
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FormField from '../components/FormField';
import {
  jalankanAturan,
  validasiAngkatan,
  validasiEmail,
  validasiIpk,
  validasiNim,
  validasiPanjang,
  validasiTelepon,
  wajibDiisi,
} from '../utils/validators';

const DAFTAR_PRODI = [
  'Sistem Informasi',
  'Teknik Informatika',
  'Informatika',
  'Rekayasa Perangkat Lunak',
];

const ATURAN_MAHASISWA = {
  nim: [wajibDiisi, validasiNim],
  nama: [wajibDiisi, (nilai) => validasiPanjang(nilai, 50)],
  prodi: [wajibDiisi],
  angkatan: [wajibDiisi, validasiAngkatan],
  ipk: [wajibDiisi, validasiIpk],
  email: [wajibDiisi, validasiEmail],
  telepon: [wajibDiisi, validasiTelepon],
};

const FORM_KOSONG = {
  nim: '',
  nama: '',
  prodi: '',
  angkatan: '',
  ipk: '',
  email: '',
  telepon: '',
};

// dataAwal dipakai untuk mode edit: field diisi nilai yang sudah ada.
export default function FormMahasiswa({ dataAwal = {}, onSubmit = () => {} }) {
  const [form, setForm] = useState(() => ({ ...FORM_KOSONG, ...dataAwal }));
  const [errors, setErrors] = useState({});
  const [sudahDikirim, setSudahDikirim] = useState(false);

  function validasiSatuField(namaField, nilai) {
    return jalankanAturan(ATURAN_MAHASISWA[namaField] || [], nilai);
  }

  function validasiSemuaField() {
    const hasil = {};
    for (const namaField of Object.keys(ATURAN_MAHASISWA)) {
      hasil[namaField] = validasiSatuField(namaField, form[namaField]);
    }
    return hasil;
  }

  function handleChange(namaField, nilai) {
    setForm((sebelumnya) => ({ ...sebelumnya, [namaField]: nilai }));
    if (sudahDikirim) {
      setErrors((sebelumnya) => ({
        ...sebelumnya,
        [namaField]: validasiSatuField(namaField, nilai),
      }));
    }
  }

  function handleSubmit() {
    const hasil = validasiSemuaField();
    setErrors(hasil);
    setSudahDikirim(true);
    const formValid = Object.values(hasil).every((pesan) => pesan === '');
    if (formValid) {
      onSubmit(form);
      setForm({ ...FORM_KOSONG, ...dataAwal });
      setErrors({});
      setSudahDikirim(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.halaman}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.konten} keyboardShouldPersistTaps="handled">
        <Text style={styles.judul}>Form Data Mahasiswa</Text>

        <FormField
          label="NIM"
          value={form.nim}
          onChangeText={(teks) => handleChange('nim', teks)}
          placeholder="contoh: 2201001"
          keyboardType="number-pad"
          maxLength={10}
          returnKeyType="next"
          error={errors.nim}
        />
        <FormField
          label="Nama Lengkap"
          value={form.nama}
          onChangeText={(teks) => handleChange('nama', teks)}
          placeholder="contoh: Budi Santoso"
          autoCapitalize="words"
          returnKeyType="next"
          error={errors.nama}
        />

        <Text style={styles.label}>Program Studi</Text>
        <View style={styles.barisProdi}>
          {DAFTAR_PRODI.map((prodi) => {
            const aktif = form.prodi === prodi;
            return (
              <Pressable
                key={prodi}
                onPress={() => handleChange('prodi', prodi)}
                style={[styles.chip, aktif && styles.chipAktif]}
              >
                <Text style={[styles.teksChip, aktif && styles.teksChipAktif]}>{prodi}</Text>
              </Pressable>
            );
          })}
        </View>
        {errors.prodi !== undefined && errors.prodi !== '' && (
          <Text style={styles.error}>{errors.prodi}</Text>
        )}

        <FormField
          label="Angkatan"
          value={form.angkatan}
          onChangeText={(teks) => handleChange('angkatan', teks)}
          placeholder="contoh: 2024"
          keyboardType="number-pad"
          maxLength={4}
          returnKeyType="next"
          error={errors.angkatan}
        />
        <FormField
          label="IPK"
          value={form.ipk}
          onChangeText={(teks) => handleChange('ipk', teks)}
          placeholder="contoh: 3.45"
          keyboardType="decimal-pad"
          maxLength={4}
          returnKeyType="next"
          error={errors.ipk}
        />
        <FormField
          label="Email"
          value={form.email}
          onChangeText={(teks) => handleChange('email', teks)}
          placeholder="nama.kecil@students.univ.ac.id"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          error={errors.email}
        />
        <FormField
          label="Telepon"
          value={form.telepon}
          onChangeText={(teks) => handleChange('telepon', teks)}
          placeholder="contoh: 081234567890"
          keyboardType="phone-pad"
          maxLength={13}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          error={errors.telepon}
        />

        <Pressable
          style={({ pressed }) => [styles.tombol, pressed && styles.tombolTekan]}
          onPress={handleSubmit}
        >
          <Text style={styles.teksTombol}>Simpan Data</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  halaman: { flex: 1, backgroundColor: '#f9fafb' },
  konten: { padding: 20 },
  judul: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  barisProdi: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    marginRight: 8,
    marginBottom: 8,
  },
  chipAktif: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  teksChip: { color: '#374151', fontSize: 13 },
  teksChipAktif: { color: '#ffffff' },
  error: { color: '#dc2626', fontSize: 13, marginBottom: 16 },
  tombol: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  tombolTekan: { opacity: 0.8 },
  teksTombol: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
```

**Penjelasan:** `FormMahasiswa` memperluas pola FormLogin dengan dua bentuk input baru. Program studi memakai **chip** — tombol `Pressable` berbentuk pil yang menyala bila dipilih — yang lebih ramah layar sentuh daripada daftar pilihan turun (dropdown) karena tidak memerlukan scroll dan tapped dengan area yang lega; nilai yang dipilih tersimpan lewat `handleChange('prodi', prodi)` sehingga ikut divalidasi seperti field lain. Field angka (NIM, angkatan, IPK) memakai `keyboardType` yang sesuai beserta `maxLength`, dan field terakhir (telepon) menutup rantai keyboard dengan `returnKeyType="done"` serta `onSubmitEditing={handleSubmit}`. `useState(() => ({ ...FORM_KOSONG, ...dataAwal }))` mengisi field dari `dataAwal` pada mode edit; setelah submit sukses, form dikembalikan ke kondisi awal (atau ke data awal pada mode edit) dan semua error dihapus.

File: app/(app)/mahasiswa/tambah.js
```jsx
import { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import FormMahasiswa from '../../screens/FormMahasiswa';

export default function TambahMahasiswa() {
  const [daftarMahasiswa, setDaftarMahasiswa] = useState([]);

  function simpanMahasiswa(dataForm) {
    const dataBaru = { id: Date.now(), ...dataForm };
    setDaftarMahasiswa((lama) => [...lama, dataBaru]);
    Alert.alert(
      'Data Tersimpan',
      `${dataForm.nama} (${dataForm.nim}) masuk daftar lokal. Total: ${daftarMahasiswa.length + 1}.`
    );
  }

  return (
    <>
      <Text style={styles.infobox}>
        Daftar lokal sesi ini: {daftarMahasiswa.length} mahasiswa. Data hilang saat aplikasi
        ditutup; penyimpanan permanen dibahas di Bab 11 dan API sungguhan di Bab 10.
      </Text>
      <FormMahasiswa onSubmit={simpanMahasiswa} />
    </>
  );
}

const styles = StyleSheet.create({
  infobox: {
    margin: 16,
    padding: 12,
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    color: '#075985',
  },
});
```

**Penjelasan:** rute `tambah.js` menjadi "pemilik" data: ia menyimpan daftar mahasiswa hasil submit pada state lokal `daftarMahasiswa` dan menambahkan data baru dengan menyebar objek form ditambah `id` unik dari `Date.now()`. Layar form dan pemilik data dipisahkan: `FormMahasiswa` hanya melaporkan data valid melalui `onSubmit`, tanpa tahu bagaimana data digunakan — pemisahan ini yang nanti memudahkan penggantian "penyimpanan lokal" dengan API (Bab 10) atau Context (Bab 9) tanpa menyentuh kode form. Ketika aplikasi ditutup, daftar ini hilang — keterbatasan state lokal inilah yang menjadi alasan keberadaan Bab 9, Bab 10, dan Bab 11. `id: Date.now()` menghasilkan angka milidetik yang unik untuk keperluan demo; basis data sungguhan akan menghasilkan id sendiri.

### Penjelasan Kode

Praktikum ini membangun empat lapis yang sudah dipelajari pada Materi: (1) `validators.js` sebagai pustaka fungsi murni yang menjadi satu-satunya tempat aturan validasi; (2) `FormField.js` sebagai komponen reusable yang menyeragamkan tampilan field dan pesan error; (3) `FormMahasiswa.js` sebagai layar yang merangkai tabel aturan, form state, chips, dan penanganan keyboard; (4) `tambah.js` sebagai rute tipis yang menyimpan data. Alur saat tombol "Simpan Data" ditekan: `handleSubmit` menjalankan `validasiSemuaField` — melingkari `ATURAN_MAHASISWA` dengan `validasiSatuField` — hasilnya disimpan ke `errors` dan `every` menentukan kelayakan; bila valid, `onSubmit(form)` mengirim data ke rute dan form direset; bila tidak, setiap `FormField` menampilkan pesan error field-nya. Setelah percobaan pertama, `sudahDikirim` mengaktifkan validasi real-time di `handleChange`. Dua konsep yang perlu dicermati: error adalah data (objek `errors` dirender, bukan `alert` berurutan), dan pemisahan lapisan membuat tiap lapisan dapat diganti tanpa merusak lapisan lain.

### Hasil yang Diharapkan

1. Saat form kosong dan tombol "Simpan Data" ditekan, ketujuh field menampilkan "Field ini wajib diisi" dengan border merah; tidak ada Alert yang muncul.
2. Saat email diisi "budi.santoso" (tanpa domain) dan telepon diisi "081234567" (9 digit), masing-masing menampilkan pesan "Format email tidak valid (contoh: nama@domain.com)" dan "Nomor telepon harus 10 sampai 13 digit angka".
3. Saat salah satu error diperbaiki (misalnya telepon dilengkapi menjadi "081234567890"), pesan error field tersebut hilang seketika tanpa menekan tombol — bukti validasi real-time berjalan.
4. Saat form diisi data Budi Santoso (2201001, Sistem Informasi, 2022, 3.45, budi.santoso@students.univ.ac.id, 081234567890) dan tombol ditekan, muncul Alert "Data Tersimpan ... Total: 1." dan kotak info di atas form menampilkan "Daftar lokal sesi ini: 1 mahasiswa".
5. Keyboard tidak menutupi field Telepon dan tombol Simpan saat mengetik di posisi terbawah; tombol merespons pada ketukan pertama meskipun keyboard masih terbuka.
6. (Pengayaan mode edit) Saat `dataAwal` berisi data Budi Santoso, seluruh field terisi otomatis; submit berhasil bila data tidak diubah, dan gagal dengan pesan yang tepat bila salah satu field dikosongkan.

### Troubleshooting

**Masalah:** Layar menampilkan "Unable to resolve module '../utils/validators' from 'screens/FormMahasiswa.js'" dan aplikasi berhenti di layar error.
**Penyebab:** Path impor salah — file `validators.js` tidak berada di folder yang dirujuk, atau nama file tidak sama persis (misalnya `validators.js` ditulis `validator.js`, atau folder bernama `utility`).
**Solusi:** Periksa nama folder dan file di VS Code Explorer; impor wajib mengikuti struktur `utils/validators.js` dari root project. Karena impor JavaScript peka huruf besar/kecil, pastikan penulisan `utils` dan `validators` identik di kedua tempat.
**Pencegahan:** Buat file di folder yang benar lebih dulu, lalu tulis impor dengan autocomplete; biasakan memakai nama file yang sama persis antara pembuatan dan impor.

**Masalah:** Saat submit, `Alert` tidak muncul meskipun semua field terlihat terisi.
**Penyebab:** Ada field yang dianggap kosong oleh validasi meskipun tampak terisi — misalnya field program studi belum dipilih (chip tidak menyala), atau salah satu field berisi spasi saja.
**Solusi:** Periksa pesan error di bawah tiap field; field dengan border merah dan pesan error menandakan penyebabnya. Setelah submit pertama, perbaiki field tersebut dan amati error yang hilang.
**Pencegahan:** Saat menguji, biasakan membaca pesan error per field alih-alih hanya melihat Alert; gunakan data uji baku (Budi Santoso) agar semua field terisi sesuai aturan.

**Masalah:** Ketika mengetik di field bagian bawah, papan ketik menutupi field dan tombol "Simpan Data"; kadang tombol baru merespons setelah ditekan dua kali.
**Penyebab:** KeyboardAvoidingView tidak membungkus konten (atau `behavior` tidak disesuaikan platform), dan ScrollView tidak diberi `keyboardShouldPersistTaps="handled"` sehingga ketukan pertama hanya menutup keyboard.
**Solusi:** Pastikan struktur layar persis: `KeyboardAvoidingView` di luar, `ScrollView` di dalam dengan `keyboardShouldPersistTaps="handled"`, dan `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`. Lakukan reload penuh (tekan `r` di terminal Metro).
**Pencegahan:** Selalu gunakan kerangka Contoh 2 untuk layar ber-form; uji keyboard di perangkat berukuran kecil atau emulator sebelum menyerahkan praktikum.

**Masalah:** Pesan error tidak pernah hilang setelah field diperbaiki, atau muncul saat mengetik sebelum submit pertama.
**Penyebab:** Logika `sudahDikirim` tidak dipakai — error dihitung di `handleChange` tanpa syarat, atau state `sudahDikirim` tidak pernah diaktifkan di `handleSubmit`.
**Solusi:** Cocokkan `handleChange` dengan pola bab ini: validasi ulang hanya dilakukan `if (sudahDikirim)`, dan `setSudahDikirim(true)` dipanggil di awal `handleSubmit`. Setelah diperbaiki, lakukan reload penuh.
**Pencegahan:** Salin pola `handleChange`/`handleSubmit` dari FormLogin (Subbab 8.7) sebagai acuan sebelum mengembangkannya.

**Masalah:** Setelah submit sukses, seluruh form tidak terisi (dihapus) padahal praktikan ingin melihat kembali data yang baru saja dimasukkan.
**Penyebab:** Perilaku ini memang dirancang — `handleSubmit` memanggil `setForm(FORM_KOSONG)` setelah data dilaporkan ke rute; data dapat dilihat kembali pada kotak info jumlah daftar atau Alert.
**Solusi:** Jika ingin menampilkan data yang baru disimpan, tampilkan dari `daftarMahasiswa` (state di `tambah.js`) — misalnya mencetak nama dan NIM pada kotak info — bukan dengan menahan isi form.
**Pencegahan:** Bedakan dua hal: form adalah alat masukan, daftar adalah hasil simpanan; membaca pemisahan lapisan pada Penjelasan Kode akan membantu memahami desain ini.

## Studi Kasus

Sebuah universitas sedang membangun ulang portal akademiknya. Keluhan yang paling sering masuk ke helpdesk bukan soal fitur, melainkan soal data: mahasiswa tidak menerima informasi penting karena alamat email salah ketik saat pendaftaran ulang; dosen wali tidak dapat menghubungi orang tua karena nomor telepon kurang digit; laporan ke Pangkalan Data Pendidikan Tinggi (PDDikti) — sistem pendataan perguruan tinggi nasional — harus diperbaiki berulang kali karena NIM dan angkatan yang tidak konsisten. Setiap koreksi data yang dilakukan staf akademik memakan waktu administrasi dan berpotensi menunda penerbitan dokumen resmi seperti KRS dan transkrip.

Studi kasus ini adalah masalah kualitas data (data quality), dan validasi form adalah pertahanan pertamanya. Hubungannya dengan materi bab ini sangat langsung: aturan `wajibDiisi` mencegah pendaftaran akun tanpa identitas; `validasiEmail` dan `validasiTelepon` menjaga agar kanal komunikasi dengan mahasiswa selalu dapat dijangkau; `validasiNim`, `validasiAngkatan`, dan `validasiIpk` menjamin konsistensi data yang akan dilaporkan ke PDDikti; pola real-time setelah submit menekan jumlah form yang dikirim dengan kesalahan yang seharusnya bisa dicegah di layar. Namun, bab ini mengajarkan bahwa validasi klien hanyalah lapis pertama: data yang lolos dari form tetap harus diperiksa ulang di server (Bab 10 dan Bab 13) karena aplikasi bukan satu-satunya pintu masuk data, dan data lama perlu dibersihkan (data cleansing) berkala. Dari sisi desain, kasus ini juga menunjukkan mengapa keputusan Subbab 8.5 diambil: portal melayani ribuan mahasiswa dengan beragam perangkat. Validasi saat submit dengan pesan per field mengajarkan pengguna aturan form secara eksplisit — program studi yang belum dipilih pun ikut dilaporkan — sementara tombol nonaktif akan membiarkan pengguna menebak-nebak. Form yang dibangun di bab ini adalah prototipe langsung solusinya; pada Project Akhir ketiga form dihubungkan ke server dan autentikasi sungguhan.

## Latihan

### Soal Pemahaman

1. Jelaskan dengan kata-kata Anda sendiri apa yang dimaksud **controlled component**, dan sebutkan dua keuntungan yang diperoleh dari pola ini pada form.
2. Mengapa form state sebaiknya berupa objek tunggal dengan satu fungsi `handleChange` daripada satu `useState` per field? Sebutkan satu kekurangan pola objek tunggal dan cara mengatasinya.
3. Apa kontrak (aturan main) yang harus dipatuhi setiap fungsi di `utils/validators.js`? Mengapa kontrak ini penting bagi pemakaian kembali fungsi tersebut di banyak form?
4. Mengapa `validasiEmail` hanya memakai pola reguler sederhana dan bukan validasi email yang mengikuti spesifikasi resmi? Apa konsekuensi praktis dari pilihan ini?
5. Mengapa keyboard dikelola secara khusus di React Native (KeyboardAvoidingView, `keyboardShouldPersistTaps`), padahal di aplikasi web hal ini jarang dipikirkan? Berikan alasan dari sisi perangkat keras dan kebiasaan pengguna.
6. Bandingkan tombol submit nonaktif dengan validasi saat submit. Dalam kondisi seperti apa masing-masing lebih unggul, dan mengapa bab ini memilih validasi saat submit?

### Soal Praktik

1. Kembangkan Contoh 1 menjadi layar "Form Saran" utuh: tambahkan field nama (wajib diisi, maksimal 50 karakter) dan kategori saran (chip: Akademik, Administrasi, Fasilitas) yang ikut tampil pada tombol nonaktif dan validasi.
2. Terapkan mode edit pada FormMahasiswa: buat layar `app/(app)/mahasiswa/[id].js` menerima parameter dari Bab 7, dan render `FormMahasiswa` dengan `dataAwal` berisi data Budi Santoso (2201001 · Sistem Informasi · 2022 · 3.45 · budi.santoso@students.univ.ac.id · 081234567890). Pastikan validasi tetap berjalan dan submit menghasilkan objek yang sama dengan data awal bila tidak ada perubahan.
3. Tambahkan penghitung karakter pada FormField: tampilkan teks kecil "12/50" di bawah input dan jadikan atribut opsional lewat prop `showCounter` dan `maxLength`. Gunakan pada FormRegistrasi (field nama, maksimal 50).

### Soal Analisis

1. Analisislah form pendaftaran ulang portal akademik kampus Anda (atau aplikasi sejenis): field apa saja yang ada, aturan validasi apa yang terlihat, di momen mana validasi dijalankan (submit, blur, atau real-time), dan bagaimana pesan errornya disajikan. Bandingkan dengan pola bab ini, lalu berikan tiga rekomendasi perbaikan yang didasari prinsip Subbab 8.5.

## Tantangan

1. **Validasi kata sandi bertingkat.** Tambahkan aturan baru di `validators.js` — misalnya harus mengandung minimal satu angka dan satu huruf besar — dan terapkan pada FormRegistrasi, lengkap dengan pesan error yang menyebutkan seluruh syarat. Diskusikan dalam laporan singkat: apakah aturan ini meningkatkan keamanan secara proporsional terhadap kesulitan yang dialami pengguna?
2. **Form dinamis lima data baku.** Bangun mode "input massal" yang memungkinkan pengguna mengisi lima data mahasiswa baku buku ini (Budi Santoso, Siti Aminah, Agus Wijaya, Dewi Lestari, Rizky Pratama) sekaligus dengan FormMahasiswa yang dipakai berulang, lalu tampilkan rekap jumlah data valid dan data yang ditolak beserta alasannya. Perhatikan cara mereset form di antara pengisian.
3. **Konversi ke API.** Ganti `simpanMahasiswa` di `tambah.js` sehingga memanggil fungsi `alamatKirim(form)` yang Anda definisikan sendiri (cukup mengembalikan Promise yang diselesaikan setelah jeda singkat, misalnya `setTimeout` dari Bab 3). Amati bagaimana lapisan form tidak berubah sama sekali — bukti pemisahan lapisan. Integrasi API sungguhan akan dilakukan di Bab 10.

## Rangkuman

1. TextInput adalah komponen masukan teks yang nilainya tidak disimpan sendiri; props `value`, `onChangeText`, `keyboardType`, `secureTextEntry`, `autoCapitalize`, `returnKeyType`, dan `maxLength` adalah dasar setiap form.
2. Controlled component menjadikan state sebagai sumber kebenaran tunggal nilai input, sehingga nilai dapat divalidasi, direset, dan diisi ulang secara programatik.
3. Form state berupa objek tunggal dengan `handleChange` generik (kunci terhitung + spread) menyederhanakan reset, validasi, dan pengiriman data.
4. Validasi ditulis sebagai fungsi murni dengan kontrak "nilai masuk, pesan error atau string kosong keluar", dikumpulkan di `utils/validators.js`, dan dijalankan berurutan oleh `jalankanAturan`.
5. Aturan yang dibahas: wajib diisi, email (pola sederhana), kata sandi minimal 6 karakter, telepon 10–13 digit, dan batas panjang; validasi klien adalah lapis pertama pertahanan berlapis.
6. Pesan error yang baik bersifat spesifik, dekat field, memakai dua sinyal (warna + teks), dan tidak menghapus nilai pengguna.
7. Bab ini memilih validasi saat submit ditambah validasi real-time setelah percobaan pertama; tombol submit nonaktif adalah alternatif yang sah dengan trade-off tersendiri.
8. Keyboard dikelola dengan KeyboardAvoidingView, `keyboardShouldPersistTaps="handled"`, dan rantai `returnKeyType`; label permanen tidak boleh digantikan placeholder.
9. Komponen reusable `FormField` menyeragamkan label, input, dan pesan error dari satu sumber gaya untuk semua form.
10. Data hasil form disimpan pada state lokal rute (Bab 8), dan akan diangkat ke global state (Bab 9), dikirim ke API (Bab 10), serta disimpan permanen (Bab 11).

## Refleksi

1. Pernahkah Anda mengisi form aplikasi yang membuat Anda frustrasi — misalnya pesan error yang tidak jelas atau tombol yang tidak merespons? Dengan pengetahuan bab ini, apa yang menurut Anda salah secara teknis pada form tersebut?
2. Dari ketiga form yang dibangun, manakah yang paling menantang dan mengapa? Apakah tantangannya berada pada validasi, tata letak, atau pemilihan pola state?
3. Sebagai calon pengembang sistem informasi, bagaimana Anda meyakinkan pemangku kepentingan bahwa investasi pada validasi form (dan kualitas data) lebih murah daripada biaya koreksi data di kemudian hari?
4. Kebiasaan apa yang akan Anda terapkan pada project berikutnya — mulai dari memberi pesan error yang baik hingga menguji validasi dengan data tidak valid — sebagai hasil dari bab ini?

## Evaluasi Bab

### Pilihan Ganda

1. Pada controlled component, nilai yang ditampilkan TextInput berasal dari ....
   A. property `placeholder`
   B. state React yang dihubungkan lewat `value`
   C. penyimpanan internal TextInput
   D. `returnKeyType`
2. Manakah kombinasi props yang paling tepat untuk field kata sandi?
   A. `secureTextEntry` dan `autoCapitalize="none"`
   B. `keyboardType="number-pad"` dan `maxLength={4}`
   C. `multiline` dan `editable={false}`
   D. `autoCorrect` dan `placeholderTextColor`
3. `handleChange('nama', 'Siti')` dengan pola objek tunggal akan ....
   A. mengganti seluruh objek form dengan `{ nama: 'Siti' }`
   B. menambah field baru bernama `nama` tanpa mengubah field lain
   C. menyebar objek form lama lalu menimpa nilai kunci `nama`
   D. mengubah nama field menjadi "Siti"
4. Kontrak yang harus dipatuhi setiap fungsi di `utils/validators.js` adalah ....
   A. menerima state form dan mengembalikan objek errors
   B. menerima nilai input dan mengembalikan pesan error atau string kosong
   C. mengubah state errors secara langsung (efek samping)
   D. menerima props dan mengembalikan elemen React
5. Fungsi `validasiTelepon` menerima "0812-3456-7890" sebagai valid karena ....
   A. pola reguler memastikan adanya tanda hubung
   B. jumlah digit setelah membuang karakter non-angka adalah 12 (rentang 10–13)
   C. panjang string mentah adalah 13 karakter
   D. semua nomor Indonesia selalu diawali "0812"
6. Alasan utama bab ini memilih validasi saat submit daripada tombol submit nonaktif adalah ....
   A. tombol nonaktif tidak mungkin diimplementasikan di React Native
   B. validasi saat submit membuat syarat form transparan bagi pengguna lewat pesan error
   C. validasi saat submit lebih cepat dieksekusi perangkat
   D. tombol nonaktif menghapus nilai pengguna setiap kali gagal
7. `keyboardShouldPersistTaps="handled"` pada ScrollView berfungsi agar ....
   A. ketukan di layar selalu menutup papan ketik
   B. ketukan pada elemen berpenangan (misalnya tombol) langsung dieksekusi meskipun papan ketik terbuka
   C. papan ketik tidak pernah muncul
   D. keyboard menyesuaikan jenis keyboardType
8. Setelah submit pertama gagal, perbaikan satu field langsung menghilangkan error field tersebut karena ....
   A. `errors` dihitung ulang seluruhnya oleh `handleChange` tanpa syarat
   B. `handleSubmit` dipanggil ulang secara otomatis
   C. `handleChange` memvalidasi ulang field yang berubah karena `sudahDikirim` bernilai `true`
   D. `Alert` menggantikan pesan error per field

### Soal Uraian

1. Jelaskan alur lengkap yang terjadi ketika pengguna menekan tombol "Simpan Data" pada FormMahasiswa, dari penekanan tombol hingga form direset — sebutkan fungsi-fungsi yang terlibat dan peran masing-masing.
2. Mengapa argumen `konteks` pada `jalankanAturan` diperlukan oleh FormRegistrasi tetapi tidak oleh FormLogin? Berikan ilustrasi kasus lain di dunia sistem informasi yang membutuhkan validasi lintas field serupa.
3. Rancang aturan validasi untuk field "Tanggal Lahir" yang dimasukkan lewat TextInput (format `DD-MM-YYYY`): tuliskan fungsi validasinya mengikuti kontrak bab ini dan jelaskan dua keputusan desain yang Anda ambil.

### Kunci Jawaban

<details>
<summary>Kunci Jawaban Pilihan Ganda</summary>

1. B
2. A
3. C
4. B
5. B
6. B
7. B
8. C

</details>