# Bab 5 — Dasar React Native

Slide: [`slides/bab-05-dasar-react-native.md`](../../slides/bab-05-dasar-react-native.md)

Bab ini mengganti hampir semua gaya bab 4 dengan pengetahuan React Native yang
sesungguhnya: komponen inti, StyleSheet, Flexbox, pengukuran layar, dan pilihan
komponen gulir.

## Tujuan pembelajaran

- Menjelaskan perbedaan React untuk web dan React Native
- Mengidentifikasi fungsi komponen inti React Native
- Menerapkan StyleSheet, array style, dan style bersyarat
- Menyusun tata letak responsif dengan Flexbox dan `useWindowDimensions`
- Memilih penggulir yang tepat serta menangani perbedaan platform

## Isi folder

| Berkas | Gunanya |
| --- | --- |
| `App.js` | Layar jadwal: `FlatList` + `ListHeaderComponent` + `numColumns` responsif |
| `components/BarisJadwal.js` | Baris jadwal: array style, style bersyarat, `Platform.select` |

## Empat keputusan yang diambil di layar ini

| Keputusan | Alasan |
| --- | --- |
| `FlatList`, bukan `ScrollView` | Daftar panjang dan homogen; `FlatList` hanya merender baris yang terlihat |
| `numColumns` dari `useWindowDimensions` | Lebar ≥ 600 dp (tablet/web) memakai dua kolom |
| `key={kolom}` di `FlatList` | `numColumns` tidak boleh berubah pada komponen yang sama; ganti `key` memaksa render ulang |
| `Platform.select` untuk bayangan | Android memakai `elevation`, iOS memakai `shadowColor`/`shadowRadius` |

## Menjalankan

```bash
cd kode/bab-05-dasar-react-native
npm install
npx expo start
```

Coba ketiga jalur untuk melihat perbedaan nyata:

- `a` — emulator Android (padding atas 32, bayangan `elevation`)
- `i` — iOS simulator (padding atas 56, bayangan `shadow*`) — hanya di macOS
- `w` — browser, lalu ubah lebar jendela melewati 600 px untuk melihat dua kolom

## Langkah praktikum

1. Jalankan aplikasi, lalu ubah lebar jendela browser. Catat pada lebar berapa kolom
   berubah dari satu menjadi dua.
2. Buka `components/BarisJadwal.js`, hapus `...Platform.select({...})`, lalu bandingkan
   tampilan di Android dan iOS. Jelaskan mengapa bayangan hilang.
3. Tambahkan `ListEmptyComponent` yang berisi tombol "Muat ulang" — lalu buat daftar
   kosong sementara dengan mengubah `filterSemester(matakuliah, 5)` menjadi `9`.
4. Ganti `FlatList` dengan `ScrollView` berisi `JADWAL.map(...)`. Perhatikan bahwa
   hasilnya sama; lalu jelaskan mengapa untuk 200 baris pilihan itu salah.
5. Tambahkan satu baris `padding` berbeda per platform di `styles.layar` memakai
   `Platform.select`, lalu buktikan perbedaannya di dua jalur pengujian.
6. Ganti `keyExtractor={(mk) => mk.kode}` menjadi `(mk, indeks) => String(indeks)`.
   Jelaskan risiko yang muncul saat daftar difilter.

## Checkpoint

1. Layar menampilkan tujuh mata kuliah semester 5 dan total SKS-nya.
2. Kartu `Sistem Informasi Manajemen` dan `Data Mining` tampil redup dengan label
   "Kuota penuh" — itu style bersyarat dari `sisaKuota(mk) === 0`.
3. Lebar jendela ≥ 600 px menampilkan dua kolom tanpa error `numColumns`.
4. Kamu bisa menjelaskan kapan `ScrollView` lebih tepat daripada `FlatList`.

## Troubleshooting

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| `Changing numColumns on the fly is not supported` | `numColumns` berubah pada `FlatList` yang sama | Beri `key={kolom}` seperti di `App.js` |
| Bayangan tidak muncul di Android | Memakai `shadowColor` saja | Tambahkan `elevation` lewat `Platform.select` |
| Teks menempel di tepi atas | Safe area belum ditangani | Bab 7 memakai `SafeAreaView` dari `react-native-safe-area-context` |
| Gambar tidak tampil | `require()` memakai path yang salah | Path relatif dari berkas komponen, bukan dari proyek |
| `VirtualizedList: missing keys` | `keyExtractor` tidak stabil | Kembalikan `kode`, bukan indeks |

## Yang berubah dibanding bab 4

| Berkas | Perubahan |
| --- | --- |
| `components/BarisJadwal.js` | Baru — baris daftar dengan style bersyarat dan `Platform.select` |
| `App.js` | Layar jadwal responsif: `FlatList`, `Image`, `Pressable`, `useWindowDimensions` |
| `components/TombolSKS.js` dkk. | Dihapus dari layar; komponennya tetap ada di folder bab 4 |
