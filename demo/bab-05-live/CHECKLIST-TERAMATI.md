# Checklist "Yang Harus Teramati" — Bab 5

Lima butir dari slide **Yang Harus Teramati**, dipecah menjadi gejala yang bisa dilihat langsung.
Dicentang pada aplikasi mahasiswa sendiri sebelum sesi berakhir; yang tidak tercentang menjadi bahan
pertanyaan di sesi berikutnya, bukan dijelaskan panjang di kelas.

Cara pakai: minta kelas membuka aplikasinya, lalu jalankan tiap butir berurutan. Beri tanda `✓` atau
`✗`. Dua butir yang paling sering gagal: **butir 2** (bergantung pada state) dan **butir 5**
(bergantung pada area aman).

| # | Butir | Gejala yang dilihat | `✓` / `✗` |
|---|---|---|---|
| 1 | Teks muncul sebagai `Text`, bukan isi `View` | Tidak ada layar merah; teks tampil normal | |
| 2 | Tombol berubah tampilan saat aktif dan nonaktif | Tampilan tombol berbeda saat ditekan dan dilepas | |
| 3 | Dua panel berubah susunan saat jendela melebar atau diputar | Potret bertumpuk, lanskap berdampingan | |
| 4 | Daftar panjang tetap ringan saat digulir | Gulir 200 item tanpa tersendat dan tanpa memori melonjak | |
| 5 | Tidak ada konten tertutup status bar atau home indicator | Judul pertama dan baris terakhir terbaca penuh | |

---

## Cara memeriksa tiap butir

**1 — Teks di dalam `Text`.** Buka berkas layar, cari `<View>` yang isinya teks mentah tanpa
`<Text>`. Kalau ada, aplikasi menampilkan layar merah. Perbaikan: bungkus dengan `<Text>`.

**2 — Tombol berubah tampilan.** Tekan dan tahan tombol. Kalau tampilannya sama saja, `Pressable`
belum memakai argumen `pressed` atau belum ada state yang mengubah gaya:

```jsx
<Pressable style={({ pressed }) => [gaya.tombol, pressed && gaya.tombolDitekan]}>…</Pressable>
```

Yang dinilai bukan indahnya, melainkan ada tidaknya perubahan yang terlihat.

**3 — Susunan berubah.** Buka di ponsel potret, lalu putar perangkat atau lebarkan jendela melewati
600 px. Kalau susunan tetap, `flexDirection` masih ditulis tetap, atau lebarnya diukur sekali di
nilai awal `useState` — bukan lewat `useWindowDimensions()`.

**4 — Daftar panjang tetap ringan.** Gulir cepat sampai ujung. Kalau tersendat di awal gulir,
kemungkinan `FlatList` dibungkus `ScrollView` searah, atau `renderItem` menyusun seluruh data
sebelum ditampilkan.

**5 — Area aman.** Lihat bagian paling atas dan paling bawah layar. Kalau judul masuk ke bawah jam
atau tombol terakhir tertutup garis gestur, konten belum dibungkus `SafeAreaView` (iOS) atau belum
diberi penanganan inset (Android — `SafeAreaView` bawaan tidak menutup kasus ini).

---

## Yang ditanyakan kalau ada butir gagal

- Butir 2 gagal → "Di mana status tombol disimpan? Kalau tidak ada, dari mana tampilannya tahu harus
  berubah?"
- Butir 5 gagal → "Berapa `paddingTop` yang kamu tulis, dan kenapa angka itu berbeda di tiap
  perangkat?"

Keduanya mengarah ke materi sesi berikutnya tanpa perlu menjelaskannya sekarang.
