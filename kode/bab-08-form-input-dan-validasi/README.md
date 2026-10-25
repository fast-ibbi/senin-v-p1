# Bab 8 — Form, Input, dan Validasi

Slide: [`slides/bab-08-form-input-dan-validasi.md`](../../slides/bab-08-form-input-dan-validasi.md)

Bab 7 punya layar login satu tombol. Bab 8 memberi layar itu dua kolom isian, menambah layar
registrasi enam kolom, dan memindahkan seluruh aturan validasi ke `utils/validators.js`
sebagai fungsi murni. Sesi masih tiruan — yang berubah adalah dari mana nilainya datang.

## Tujuan pembelajaran

- Menjelaskan props utama `TextInput` dan strategi penanganan keyboard mobile
- Menganalisis _controlled component_ dan state sebagai sumber kebenaran tunggal
- Mengimplementasikan validasi fungsi murni dan pesan error per field
- Mengevaluasi trade-off tombol submit nonaktif dan merancang `FormField`

## Isi folder

| Berkas | Isi |
| --- | --- |
| `utils/validators.js` | `POLA_NIM`, `MIN_PANJANG_PASSWORD`, tujuh validator field, `validasiLogin`, `validasiRegistrasi`, `kekuatanPassword` |
| `components/FormField.js` | Satu kolom: label, `TextInput`, petunjuk, pesan galat, tombol Lihat/Sembunyikan |
| `app/login.js` | Dua field controlled, validasi saat submit, `KeyboardAvoidingView` |
| `app/registrasi.js` | Enam field, pemilih prodi, bilah kekuatan password, layar sukses |
| `app/_layout.js` | Menambah `<Stack.Screen name="registrasi" options={{ title: 'Daftar Akun' }} />` |
| `context/AuthContext.js` | Sesi tiruan dari bab 7, tidak berubah |
| `app/(tabs)/beranda/`, `krs/`, `nilai/`, `profil/` | Rute dari bab 7, tidak berubah |
| `components/Tombol.js`, `tema/desain.js`, `data/` | Dipakai ulang tanpa perubahan |
## Controlled input, satu sumber kebenaran

`FormField` tidak menyimpan teks. Ia menerima `nilai` dan memanggil `onChangeText`, jadi
`nim` dan `password` di `app/login.js` adalah satu-satunya salinan. Yang tetap lokal di
dalam `FormField` hanya dua hal yang memang urusan tampilan: `fokus` (garis biru saat aktif)
dan `tampil` (password terlihat atau tidak).

| Kalau teks disimpan di dalam input | Kalau teks disimpan di state |
| --- | --- |
| Validasi harus membaca dari ref/`nativeEvent` | `validasiLogin({ nim, password })` langsung jalan |
| Reset form butuh trik (`setNativeProps`) | Cukup `setNim('')` |

Pesan galat **menggantikan** petunjuk, bukan ditumpuk di bawahnya, supaya tinggi kolom tidak
melompat. `{...sisa}` meneruskan `keyboardType`, `maxLength`, `editable`, dan `onSubmitEditing`
ke `TextInput` — hapus baris itu dan separuh perilaku form hilang tanpa pesan galat apa pun.

## Validasi saat submit, bukan saat mengetik

`kirim` memanggil `validasiLogin` lalu `setErrors(hasil.errors)`. Selama pengguna mengetik,
tidak ada pemeriksaan — huruf pertama `2023` belum dianggap salah. `errors` hanya berisi field
yang bermasalah, sehingga pesan bisa ditempel di kolom yang tepat.

| Tombol dinonaktifkan sampai valid | Tombol selalu aktif (dipakai di sini) |
| --- | --- |
| Terlihat rapi | Terlihat "bisa ditekan" walau isian belum lengkap |
| Pengguna tidak tahu apa yang kurang | Setiap kolom menjelaskan kesalahannya sendiri |
| Sulit dipakai pembaca layar | `accessibilityLiveRegion="polite"` membacakan pesan galat |

`Tombol` bisa dinonaktifkan lewat prop `nonaktif`; bab ini hanya memakai `memuat`, yang
menahan tombol selama 400 ms tiruan permintaan jaringan.

## Keyboard

Kedua layar memakai `KeyboardAvoidingView`: `behavior="padding"` di iOS dan `"height"` di
Android, karena Android sudah mengecilkan jendela sendiri. `keyboardShouldPersistTaps="handled"`
menjamin ketukan pertama pada tombol tidak hanya menutup keyboard. `app/registrasi.js` menambah
`keyboardVerticalOffset={88}` di iOS untuk mengimbangi header stack.

## Menjalankan

```bash
cd kode/bab-08-form-input-dan-validasi
npm install
npx expo start
```

Masuk dengan NIM `20230001` dan password `rahasia123`, atau daftar akun lewat "Daftar
sekarang". Selama validasi lolos, **nilai apa pun diterima**: `app/login.js` memanggil
`masuk(nim, 'Nadia Putri Ramadhani')` tanpa bertanya ke server; pemeriksaan baru ada di bab 13.

## Langkah praktikum

1. Jalankan aturan validasi di luar React:
   `node -e "import('./utils/validators.js').then(m => console.log(m.kekuatanPassword('rahasia123')))"`.
   Sebelum menjalankan, tebak skornya (0–4) dan label `labelKekuatan` yang muncul di
   `app/registrasi.js`. Ulangi dengan `'Rahasia123!'`.
2. Di `components/FormField.js`, hapus baris `{...sisa}`. Ketik 9 angka di kolom NIM, tekan
   tombol "go" pada password, dan jelaskan tiga props yang berhenti bekerja.
3. Masuk dengan NIM `20230002`. Periksa apa yang berubah di tab Profil: hanya baris "Sesi".
   Jelaskan mengapa nama tetap "Nadia Putri Ramadhani" (lihat argumen kedua `masuk(...)` dan
   `data/mahasiswa.js`).
4. Di `app/login.js`, hapus `setErrors(hasil.errors)`. Tekan "Masuk" dengan form kosong:
   tidak ada pesan dan tidak ada perpindahan. Kembalikan, lalu jelaskan peran baris itu.
5. Tambahkan `nonaktif={Object.keys(errors).length > 0}` pada tombol "Masuk". Tekan sekali
   dengan form kosong, lalu isi dengan benar: tombol tetap mati karena `errors` hanya
   diperbarui saat submit. Jelaskan mengapa trade-off ini kalah.
6. Ubah `MIN_PANJANG_PASSWORD` menjadi `12`. Sebutkan berkas mana saja yang berubah
   perilakunya dan pesan mana yang ikut berubah — pesannya memakai template literal, bukan
   angka yang ditulis ulang.

## Checkpoint

1. `20230001` + `rahasia123` masuk ke tab Beranda; password salah tapi valid juga masuk.
2. Menekan "Masuk" dengan form kosong memunculkan "NIM wajib diisi." dan "Password wajib
   diisi." tepat di bawah kolom masing-masing, bukan satu pesan di atas form.
3. NIM `2023000` menghasilkan "NIM harus 8 angka."; password `rahasia` menghasilkan
   "Password minimal 8 karakter."
4. Registrasi dengan password dan konfirmasi berbeda menampilkan "Password tidak sama." pada
   kolom konfirmasi; prodi yang belum dipilih menghasilkan "Pilih program studi."
5. Kolom terakhir kedua layar tetap terlihat saat keyboard terbuka, dan "go" pada keyboard
   mengirim form login.

## Troubleshooting

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| Kolom bawah tertutup keyboard | `KeyboardAvoidingView` tanpa `behavior`, atau `ScrollView` ada di luarnya | Pertahankan `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}` |
| Pesan galat muncul saat baru mengetik | Validasi dipindah ke `onChangeText` | Panggil validator hanya dari `kirim`, seperti `app/login.js` |
| Pesan galat tidak pernah muncul | `galat={errors.nim}` tidak diteruskan, atau kunci `errors` tidak cocok dengan nama field | Pastikan kunci `errors` sama dengan yang dibaca layar |
| Tombol "Lihat" tidak mengubah apa pun | `rahasia` tidak dipasang pada `FormField`, jadi `secureTextEntry` tidak pernah aktif | Tambahkan `rahasia` pada field password |
| Tombol "go" di keyboard tidak mengirim form | `{...sisa}` dihapus sehingga `onSubmitEditing` tidak sampai ke `TextInput` | Kembalikan spread props di `FormField` |

## Yang berubah dibanding bab 7

| Berkas | Perubahan |
| --- | --- |
| `utils/validators.js` | Baru — seluruh aturan validasi sebagai fungsi murni |
| `components/FormField.js` | Baru — satu kolom untuk semua form |
| `app/registrasi.js` | Baru — enam field, pemilih prodi, bilah kekuatan password |
| `app/login.js` | Ditulis ulang — dua field controlled menggantikan satu tombol |
| `app/_layout.js` | Tambah layar `registrasi` di stack akar |
| `package.json` | Hanya `description`; tidak ada dependensi baru |
