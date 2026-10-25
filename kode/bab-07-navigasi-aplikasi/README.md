# Bab 7 — Navigasi Aplikasi

Slide: [`slides/bab-07-navigasi-aplikasi.md`](../../slides/bab-07-navigasi-aplikasi.md)

Bab 6 berhenti pada satu layar dengan pemilih layar berbasis `useState`. Bab 7 mengganti
pemilih itu dengan **expo-router**: alamat menjadi berkas, setiap tab punya stack sendiri,
dan satu layout menjaga seluruh isi aplikasi. Hampir tidak ada layar baru yang penting di
sini — yang berubah adalah cara berpindah antar layar dan siapa yang boleh membukanya.

## Tujuan pembelajaran

- Membedakan navigasi deklaratif (`<Link>`) dan imperatif (`router.push`)
- Mengimplementasikan dynamic route dan pengiriman parameter antar halaman
- Merancang nested navigation, `useFocusEffect`, dan protected screen

## Isi folder

| Berkas | Isi |
| --- | --- |
| `package.json` | `"main": "expo-router/entry"` — titik masuk bukan lagi `index.js` |
| `app.json` | `scheme: "siakad-mobile"` dan `plugins: ["expo-router"]` |
| `app/_layout.js` | Stack akar: `SafeAreaProvider` → `AuthProvider` → tiga layar |
| `app/index.js` | Gerbang `/`: `<Redirect>` ke `/(tabs)/beranda` atau `/login` |
| `app/login.js` | Sesi tiruan satu tombol; `router.replace`, bukan `push` |
| `app/(tabs)/_layout.js` | Empat tab + satu-satunya pemeriksaan `sudahMasuk` |
| `app/(tabs)/beranda/_layout.js` | Stack bersarang: `index` → `jadwal` → `matakuliah/[kode]` |
| `app/(tabs)/beranda/index.js` | Dashboard; `<Link>` dan `router.push` berdampingan |
| `app/(tabs)/beranda/jadwal.js` | Rute statis berisi 8 mata kuliah semester 5 (22 SKS) |
| `app/(tabs)/beranda/matakuliah/[kode].js` | Rute dinamis, `useLocalSearchParams` |
| `app/(tabs)/nilai/index.js` | `useFocusEffect` menghitung berapa kali tab dibuka |
| `app/(tabs)/profil/index.js` | `keluar()` + tombol "uji penjagaan" |
| `context/AuthContext.js` | Sesi tiruan di memori, `useAuth` yang melempar galat jelas |
| `components/`, `tema/`, `data/`, `utils/` | Dibawa apa adanya dari bab 6 |

## Dari template blank ke expo-router

Migrasi ini hanya tiga penyesuaian, dan semuanya terlihat di dua berkas:

| Hal | Bab 6 | Bab 7 |
| --- | --- | --- |
| Titik masuk | `index.js` mendaftarkan `App.js` | `"main": "expo-router/entry"` |
| Navigasi | `useState` + pemilih layar | pohon berkas `app/`, tiap folder punya `_layout.js` |
| Pendaftaran | tidak ada | `scheme` + `plugins: ["expo-router"]` di `app.json` |

`App.js`, `index.js`, dan `screens/` hilang; isinya menjadi rute. `components/Tombol.js`,
`components/CardMahasiswa.js`, token di `tema/desain.js`, dan `utils/akademik.js` tidak
disentuh — itu bukti bahwa lapisan tampilan dan lapisan navigasi bisa dipisahkan.

## Stack di dalam tab, dan satu pintu

`(tabs)/beranda/` bukan satu layar, melainkan satu stack: `index` → `jadwal` →
`matakuliah/[kode]`. Konsekuensinya nyata: tombol Back di dalam tab Beranda kembali ke
dashboard, bukan keluar aplikasi. Tab KRS, Nilai, dan Profil punya `_layout.js` sendiri dengan
satu layar, jadi keempat tab punya header dan perilaku Back yang sama.

Penjagaan sesi hanya ada di **satu** tempat: `app/(tabs)/_layout.js` mengembalikan
`<Redirect href="/login" />` kalau `sudahMasuk` bernilai `false`. Empat tab di bawahnya tidak
memeriksa apa pun, dan `app/(tabs)/profil/index.js` memanggil `keluar()` tanpa
`router.replace` — layar digantikan oleh pengalihan di layout itu. `app/index.js` menutup dua
arah: belum masuk → `/login`, sudah masuk → `/(tabs)/beranda`, dan `/login` tidak pernah
mengarah ke dirinya sendiri, sehingga tidak ada lingkaran pengalihan.

## Menjalankan

```bash
cd kode/bab-07-navigasi-aplikasi
npm install
npx expo start
```

Bab ini belum punya kolom isian: layar login hanya satu tombol "Masuk" dengan identitas
tetap (`NIM 20230001 · Nadia Putri Ramadhani`). Tekan tombol itu, lalu coba keempat tab.
Akun demo `20230001` / `rahasia123` baru benar-benar diketik mulai bab 8. Di browser (`w`),
alamat di address bar ikut berubah setiap kali kamu berpindah layar.

## Langkah praktikum

1. Buka `app/(tabs)/_layout.js`. Sebelum mengubah apa pun, tebak apa yang terjadi kalau blok
   `if (!sudahMasuk)` dihapus. Hapus, muat ulang, dan periksa apakah tebakanmu benar.
2. Di `app/login.js`, ganti `router.replace('/(tabs)/beranda')` menjadi `router.push(...)`.
   Masuk, lalu tekan tombol Back: layar login kembali. Jelaskan mengapa `replace` yang dipakai.
3. Masih di `app/login.js`, ubah pengalihan `sudahMasuk` menjadi `<Redirect href="/login" />`
   lalu buka `/login` saat sudah masuk. Perhatikan peringatan lingkaran pengalihan di
   konsol, lalu kembalikan seperti semula.
4. Di `app/(tabs)/beranda/jadwal.js`, ubah satu `href` menjadi
   `/(tabs)/beranda/matakuliah/SI999`. Buka baris itu: cabang `if (!mk)` di `[kode].js`
   menampilkan "Mata kuliah dengan kode SI999 tidak ditemukan" dan tombol `router.back()`.
5. Di `app/(tabs)/nilai/index.js`, baca `useFocusEffect` + `setKunjungan`. Tebak angka
   "Dibuka N kali" setelah tiga kali berpindah tab, lalu ganti `useFocusEffect(...)` dengan
   `useEffect(..., [])` dan jelaskan mengapa penghitungnya membeku di 1.
6. Dari `app/(tabs)/profil/index.js`, tekan "Buka halaman login (uji penjagaan)". Karena
   `sudahMasuk` masih `true`, `login.js` langsung mengembalikanmu ke Beranda — bukan
   menampilkan form. Sebutkan berkas mana yang membuat penjagaan itu tetap berlaku.
7. Buka `/beranda/matakuliah/SI502` lewat baris jadwal. Perhatikan "Kuota 45 dari 45 terisi"
   dan "Sisa kursi 0", lalu tekan "Ambil mata kuliah ini" dan jelaskan mengapa tidak ada
   yang berubah (handler-nya `onPress={() => {}}`).

## Checkpoint

1. Aplikasi terbuka di layar login; setelah menekan "Masuk" mendarat di tab Beranda.
2. Empat tab tampil dengan ikon dan label, masing-masing punya header sendiri.
3. Di Beranda, membuka "Jadwal" lalu menekan Back kembali ke dashboard, bukan keluar aplikasi.
4. Menekan salah satu baris jadwal membuka detail dengan kode mata kuliah yang sama.
5. Memuat ulang aplikasi mengembalikanmu ke layar login — sesi hanya hidup di memori.

## Troubleshooting

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| Layar "Unmatched Route" saat menekan tombol | `href` tidak cocok dengan berkas mana pun di `app/` | Samakan dengan jalur berkasnya, mis. `/(tabs)/beranda/jadwal` |
| Selalu kembali ke login setelah reload | `AuthProvider` menyimpan `pengguna` di `useState`, bukan penyimpanan | Memang demikian di bab 7; bab 11/13 yang menyimpan sesi |
| `useAuth harus dipakai di dalam <AuthProvider>.` | `AuthProvider` hilang dari `app/_layout.js`, atau layar dipasang di luar stack akar | Pasang kembali pembungkus di `app/_layout.js` |
| Detail selalu "tidak ditemukan" | Nama berkas `[kode].js` tidak sama dengan kunci yang di-destructure dari `useLocalSearchParams()` | Samakan nama parameter; nilainya selalu string |
| Header menampilkan nama berkas, bukan judul | Layar tidak dideklarasikan di `_layout.js` induknya | Tambahkan `<Stack.Screen name="..." options={{ title }} />` |
| Dua header bertumpuk | `headerShown: false` dihapus dari `(tabs)` di `app/_layout.js`, padahal tiap tab sudah punya header sendiri | Biarkan `(tabs)` tanpa header dan atur judul di `_layout.js` tiap tab |

## Yang berubah dibanding bab 6

| Berkas | Perubahan |
| --- | --- |
| `app/` (14 berkas) | Baru — seluruh rute: `_layout`, `index`, `login`, empat tab + stack Beranda |
| `context/AuthContext.js` | Baru — sesi tiruan dan `useAuth` |
| `app.json` | Tambah `scheme: "siakad-mobile"` dan `plugins: ["expo-router"]` |
| `package.json` | `main` menjadi `expo-router/entry`; tambah `expo-router`, `expo-linking`, `expo-constants`, `react-native-screens` |
| `App.js`, `index.js`, `screens/` | Dihapus — digantikan rute di `app/` |
| `components/`, `tema/`, `data/`, `utils/` | Tidak berubah |
