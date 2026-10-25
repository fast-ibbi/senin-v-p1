# Bab 6 — Membangun User Interface Mobile

Slide: [`slides/bab-06-membangun-user-interface-mobile.md`](../../slides/bab-06-membangun-user-interface-mobile.md)

Bab ini bukan tentang menambah fitur, melainkan tentang **membuat keputusan yang
konsisten**. Semua angka dan warna dikumpulkan di satu berkas token, lalu lima berkas
praktikum disusun dari token itu.

## Tujuan pembelajaran

- Menjelaskan empat prinsip desain UI mobile beserta alasan di belakangnya
- Mengidentifikasi peran sistem jarak 8pt, skala tipografi, dan palet warna
- Mengimplementasikan komponen Card, Button, Form, dan List secara konsisten
- Merancang wireframe halaman Daftar dan Detail Mahasiswa sebelum menulis kode
- Menerapkan aksesibilitas dasar dan menganalisis keputusan desain pada studi kasus

## Isi folder

| Berkas | Isi |
| --- | --- |
| `tema/desain.js` | Token: `spasi` (8pt), `teks` (skala tipografi), `warna` (palet per peran), `radius`, `bayangan` |
| `components/Tombol.js` | Empat varian (utama, sekunder, garis, teks) + keadaan `pressed`, `disabled`, `memuat` |
| `components/CardMahasiswa.js` | Nama, lencana prodi, NIM, angkatan, IPK |
| `screens/DaftarMahasiswa.js` | Header + `FlatList` satu atau dua kolom |
| `screens/DetailMahasiswa.js` | Profil, pasangan label–nilai, tombol Ubah/Hapus |
| `App.js` | Lima record statis + state pemilih layar |
| `data/daftarMahasiswa.js` | Lima mahasiswa (tiga sama dengan seed backend) |

## Mengapa token, bukan angka langsung

| Tanpa token | Dengan token |
| --- | --- |
| `padding: 16` di sepuluh tempat | `padding: spasi.lg` |
| Mengganti tema berarti mencari 100 angka | Mengubah satu nilai di `tema/desain.js` |
| "16 atau 17 piksel?" jadi perdebatan | Pertanyaan itu tidak ada |

Coba tantangan di slide: pindahkan seluruh konstanta ke `tema/desain.js` — di folder ini
pekerjaan itu sudah selesai, jadi bandingkan hasilmu dengan `tema/desain.js`.

## Menjalankan

```bash
cd kode/bab-06-membangun-user-interface-mobile
npm install
npx expo start
```

Ketuk salah satu kartu untuk masuk ke layar detail, lalu tekan "‹ Daftar mahasiswa" untuk
kembali. Di browser (`w`), ubah lebar jendela melewati 700 px untuk melihat dua kolom.

## Langkah praktikum

1. Sebelum menulis kode, gambar wireframe Daftar dan Detail di kertas. Tandai mana yang
   memakai jarak 8, 16, dan 24; cocokkan dengan `spasi` di `tema/desain.js`.
2. Buka `components/Tombol.js`. Tambahkan varian kelima `bahaya` untuk tindakan merusak,
   lalu pakai pada tombol "Hapus" di `DetailMahasiswa`.
3. Ubah `warna.utama` menjadi `#16a34a`. Periksa: berapa banyak berkas yang perlu diubah?
4. Di `CardMahasiswa`, tambahkan `accessibilityLabel` yang menyebut nama dan NIM, lalu
   periksa dengan TalkBack (Android) atau VoiceOver (iOS).
5. Hapus `...bayangan` dari kartu. Bandingkan tampilan Android dan iOS, lalu jelaskan
   mengapa satu properti saja tidak cukup.
6. Tambahkan keadaan kosong pada `DaftarMahasiswa`: kirim `daftar={[]}` dari `App.js`.
7. Ukur satu kartu di layar: padding 16, jarak antar kartu 8, radius 10. Apakah ada angka
   yang tidak berasal dari `spasi`/`radius`?

## Checkpoint

1. Lima kartu tampil rapi; dua kartu bertanda prodi berbeda warnanya konsisten.
2. Kartu `Salsabila Aulia` menampilkan IPK 3,86 dan angkatan 2024.
3. Mengetuk kartu membuka detail dengan pasangan label–nilai yang rata.
4. Tombol "Hapus" berkedip saat ditekan (efek `pressed`) tetapi tidak melakukan apa pun.
5. Tidak ada satu pun angka jarak/ukuran huruf yang ditulis langsung di berkas layar.

## Troubleshooting

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| `Unable to resolve react-native-safe-area-context` | Paket belum terpasang | `npm install` (sudah ada di `package.json`) |
| Layar tertutup notch/status bar | `SafeAreaView` bawaan React Native sudah usang | Pakai `SafeAreaView` dari `react-native-safe-area-context` seperti `App.js` |
| Teks terpotong di kartu | `flex: 1` tidak diberikan pada kolom tengah | Beri `flex: 1` pada pembungkus teks |
| Tombol tidak responsif | `disabled` bernilai `true` karena `memuat` | Periksa props `Tombol` |
| Dua kolom tapi kartu bertumpuk | `gap` di `columnWrapperStyle` tidak didukung versi lama | Gunakan `marginBottom` pada sel seperti `styles.sel` |

## Yang berubah dibanding bab 5

| Berkas | Perubahan |
| --- | --- |
| `tema/desain.js` | Baru — seluruh angka dan warna dipusatkan |
| `components/Tombol.js`, `CardMahasiswa.js` | Baru — komponen dengan varian dan keadaan |
| `screens/DaftarMahasiswa.js`, `DetailMahasiswa.js` | Baru — dua layar utuh pertama |
| `App.js` | Pemilih layar berbasis state, dibungkus `SafeAreaProvider` |
| `data/daftarMahasiswa.js` | Baru — lima record statis |

> Layar `DaftarMahasiswa`/`DetailMahasiswa` adalah praktikum UI sesuai RPS. Di bab 7
> aplikasi pindah ke expo-router dengan tab Beranda/KRS/Nilai/Profil; kedua layar itu
> tidak dibawa, tetapi **komponennya** (`Tombol`, `CardMahasiswa`, token tema) dipakai
> ulang di seluruh bab berikutnya.
