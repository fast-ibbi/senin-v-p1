# Bab 4 — Dasar React

Slide: [`slides/bab-04-dasar-react.md`](../../slides/bab-04-dasar-react.md)

Bab ini menambah tiga hal pada aplikasi: **komponen** yang bisa dipakai berulang,
**state** yang bisa berubah, dan **hooks** yang mengatur kapan perhitungan diulang.

## Tujuan pembelajaran

- Menjelaskan konsep UI deklaratif dan `UI = f(state)`
- Mengidentifikasi aturan penulisan JSX dan membedakan komponen dengan elemen
- Mengimplementasikan komponen reusable dengan props dan nilai default
- Menganalisis perbedaan props dan state serta memperbarui state secara immutable
- Menerapkan _event handling_, _conditional rendering_, dan _list rendering_
- Menguasai hooks `useState`, `useEffect`, `useMemo`, dan `useCallback`

## Isi folder

| Berkas | Gunanya |
| --- | --- |
| `components/KartuMahasiswa.js` | Props + nilai default + conditional rendering (`ipk` boleh kosong) |
| `components/Sapaan.jsx` | Komponen terkecil: satu fungsi, satu `Text` |
| `components/TombolSKS.js` | Controlled component; menerima nilai, melaporkan niat lewat `onPress` |
| `components/DaftarNilai.js` | List rendering `map` + `key` + keadaan kosong |
| `App.js` | Dua state: semester yang dilihat, SKS yang dipilih |

## JSX di web dan di React Native

Contoh kode di slide bab 4 memakai elemen DOM karena React lahir di web. Aplikasi ini
React Native, jadi setiap elemen dipetakan seperti ini:

| Di slide (web) | Di folder ini (React Native) |
| --- | --- |
| `<div>` | `<View>` |
| `<p>`, `<span>` | `<Text>` |
| `<img>` | `<Image source={require(...)} />` |
| `<button>` | `<Pressable onPress={...}>` |
| `className="kartu"` | `style={styles.kartu}` (objek, bukan string) |
| `onClick` | `onPress` |
| `style={{marginTop: 8}}` | sama, tetapi satuannya `dp` dan tanpa `px` |

Yang **tidak** berubah: komponen, props, state, hooks, conditional rendering, dan list
rendering. Itulah bagian React yang sebenarnya sedang dipelajari.

## Menjalankan

```bash
cd kode/bab-04-dasar-react
npm install
npx expo start
```

## Langkah praktikum

1. Buka `components/KartuMahasiswa.js`. Hapus nilai default `nim = '-'`, lalu lihat
   apa yang terjadi bila props `nim` tidak dikirim.
2. Di `App.js`, ubah `useState(3)` menjadi `useState(5)`. Bagian mana yang kosong, dan
   mengapa `DaftarNilai` menampilkan keadaan kosong tanpa error?
3. Tekan tombol `+` sampai batas `sksMaksimal`. Perhatikan bahwa tombol berhenti
   merespons — itu `batasAtas` di `TombolSKS`, bukan bug.
4. Ganti `setSksDipilih((lama) => Math.min(lama + 3, sksMaksimal))` menjadi
   `setSksDipilih(sksDipilih + 3)`. Tekan `+` dua kali cepat. Hasilnya bisa salah —
   jelaskan sebabnya (state dibaca dari render yang sama).
5. Buka React Native DevTools (tekan `j` di terminal Expo), lihat `console.log` dari
   `useEffect` setiap kali semester berubah.
6. Tambahkan satu komponen baru `components/LabelIpk.js` yang menerima `ipk` dan
   menampilkan predikat, lalu pakai di dalam `KartuMahasiswa`.

## Checkpoint

1. Aplikasi menampilkan kartu mahasiswa dengan IPK 3,70.
2. Menekan "Semester 4" mengganti daftar nilai tanpa mengubah array `nilai` asli.
3. Tombol `+` berhenti di 13 SKS (total semester 3), tombol `−` berhenti di 0.
4. Console menampilkan `[bab-04] menampilkan nilai semester N` setiap kali semester diganti.
5. Kamu bisa menjawab: mengapa `key` dipasang di elemen hasil `map`, bukan di dalam komponen?

## Troubleshooting

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| `Too many re-renders` | Memanggil `setState` langsung di badan komponen | Pindahkan ke dalam `onPress` atau `useEffect` |
| Perubahan state tidak terlihat | Mengubah array/objek lama (`push`, `sort`) | Buat nilai baru: `[...lama, baru]` |
| `onPress` tidak berjalan | `Pressable` tanpa `onPress`, atau tertutup `View` lain | Periksa props dan urutan elemen |
| Daftar tidak berubah walau data berubah | `key` memakai indeks array sehingga React salah mencocokkan baris | Pakai id stabil (`kode`, `nim`) |
| `useEffect` berjalan terus-menerus | Dependency array tidak diisi | Isi `[semester]` atau `[]` sesuai maksud |

## Yang berubah dibanding bab 3

| Berkas | Perubahan |
| --- | --- |
| `components/` | Baru — empat komponen reusable |
| `App.js` | Playground statis diganti layar berstate: pemilih semester dan penghitung SKS |
| `data/`, `utils/` | Disalin dari bab 3 tanpa perubahan |
