# Soal Praktikum Lab — Bab 5: Dasar React Native

- **Mata Kuliah:** Pemrograman Mobile (3 SKS)
- **Pertemuan:** 6
- **Acuan materi:** `slides/bab-05-dasar-react-native.md`
- **Bobot total:** 100 poin
- **Sifat:** Individu, dikerjakan di lab, dinilai menggunakan rubrik praktikum (Lampiran A)
- **Versi teknologi:** Expo SDK 57 · React Native 0.86 · React 19.2

---

## Persiapan Praktikum

1. Project Expo dari Bab 2 sudah bisa dijalankan (`npx expo start`), diuji pada **minimal satu perangkat/emulator Android dan satu iOS/Expo Go** (atau dua emulator berbeda).
2. Struktur folder yang dipakai sepanjang praktikum ini:

   ```text
   profil-mahasiswa/
   ├── App.js
   ├── data/
   │   └── mahasiswa.js
   ├── components/
   │   ├── AvatarPlaceholder.js
   │   ├── BarisInfo.js
   │   └── BarisMahasiswa.js
   └── assets/
       └── icon.png
   ```

3. Data statis di luar komponen (`data/mahasiswa.js`):

   ```js
   export const DAFTAR_MAHASISWA = [
     { id: "1", nama: "Budi Santoso",  nim: "22101001", prodi: "Sistem Informasi", ipk: 3.62 },
     { id: "2", nama: "Siti Aminah",   nim: "22101002", prodi: "Informatika",       ipk: 3.18 },
     { id: "3", nama: "Rizky Pratama", nim: "22101003", prodi: "Sistem Informasi", ipk: 2.87 },
     { id: "4", nama: "Dewi Lestari",  nim: "22101004", prodi: "Informatika",       ipk: 3.91 },
     { id: "5", nama: "Andi Wijaya",   nim: "22101005", prodi: "Sistem Informasi", ipk: 3.05 },
   ];
   ```

4. **Metro console wajib dibuka** selama praktikum. Beberapa soal hanya bisa dijawab kalau Anda membaca peringatan di sana.
5. Setiap jawaban **wajib dijalankan** di perangkat/emulator. Kode yang tidak pernah dijalankan dianggap belum dikerjakan.
6. Jika sebuah soal meminta perbandingan platform, sebutkan perangkat/emulator apa yang Anda pakai.

---

## Bagian A — Dua Dunia React & Komponen Inti
**Soal 1–5 · 46 poin**

### Soal 1 — Migrasi dari React Web (10 poin)

Potongan komponen web berikut ingin dipindahkan ke React Native:

```jsx
export default function Profil() {
  const nama = localStorage.getItem("nama");
  return (
    <div className="kartu" onClick={() => alert("Halo")}>
      <h2 style={{ color: "#1e3a8a" }}>Profil</h2>
      <img src="https://example.com/foto.jpg" />
      <p>Halo, {nama}</p>
    </div>
  );
}
```

```css
.kartu { display: flex; padding: 16px; background: #fff; border-radius: 12px; }
```

**Tugas:**

1. Tuliskan versi React Native-nya dengan **lima** perubahan minimal, dan untuk setiap perubahan sebutkan **baris mana di Tabel 5.1** yang menjadi dasarnya.
2. Jelaskan mengapa baris `localStorage.getItem("nama")` **tidak dapat diselamatkan** hanya dengan mengganti nama komponen. Apa penggantinya di bab berikutnya?
3. Jelaskan mengapa berkas CSS di atas hilang seluruhnya, dan di mana `display: flex` serta `borderRadius` sekarang ditulis.
4. Sebutkan satu hal yang **tidak** berubah dari komponen di atas beserta alasannya.

**Yang dinilai:** ketepatan pemetaan DOM → komponen native, pemahaman "tidak ada browser", pemahaman CSS → StyleSheet, dan kesadaran bahwa model React (props/state/hooks) tetap sama.

---

### Soal 2 — Aturan Teks Hanya di Dalam `Text` (8 poin)

```jsx
export default function Kartu() {
  return (
    <View style={styles.kartu}>
      Sistem Informasi Akademik
      <Text style={styles.judul}>Profil Mahasiswa</Text>
      <Text>Selamat datang di aplikasi <Text style={styles.tebal}>mobile</Text> kampus kami</Text>
      <Text numberOfLines={2}>Deskripsi panjang yang bisa memakan banyak baris…</Text>
    </View>
  );
}
```

**Tugas:**

1. Jalankan kode di atas. **Sekilas** apa yang muncul di layar dan apa yang muncul di Metro console? Tulis pesan errornya.
2. Perbaiki sehingga seluruh teks tampil, tanpa menghapus satu kata pun.
3. Jelaskan manfaat `Text` yang **bersarang** pada baris ketiga. Apa yang terjadi jika `Text` di dalamnya diubah menjadi `View`?
4. Hapus `numberOfLines={2}` lalu bandingkan tinggi kartu dan posisi komponen di bawahnya. Jelaskan mengapa `numberOfLines` penting untuk tata letak yang stabil.

**Yang dinilai:** pengalaman langsung melihat red screen, ketepatan perbaikan, pemahaman `numberOfLines` terhadap tata letak.

---

### Soal 3 — Dua Sumber Gambar dan Placeholder Inisial (9 poin)

```jsx
<Image source={{ uri: "https://example.com/foto/2201001.jpg" }} />
```

**Tugas:**

1. Jalankan kode di atas **apa adanya**. Gambar tidak muncul sama sekali (kotak nol piksel). Jelaskan mengapa React Native tidak dapat menebak ukurannya, lalu perbaiki dengan gaya eksplisit 72×72 dan foto bulat.
2. Tuliskan dua cara memberi `source` beserta **kapan** masing-masing dipakai. Kapan sebuah logo sebaiknya di-*bundle*, bukan diambil dari server?
3. Matikan koneksi internet perangkat, lalu muat ulang. Jelaskan yang terjadi dan mengapa `resizeMode="cover"` tidak menolong pada kasus ini.
4. Buat komponen `AvatarPlaceholder` yang menerima props `nama` dan `ukuran`, lalu menampilkan **inisial** (mis. "BS" untuk Budi Santoso) dengan latar berwarna. Jelaskan kapan komponen ini dipakai alih-alih `Image`.

**Yang dinilai:** sebab dimensi wajib, pemilihan `require` vs `uri`, pemahaman kegagalan jaringan, dan pola placeholder sebagai solusi (bukan kotak kosong).

---

### Soal 4 — `Button` atau `Pressable`? (10 poin)

```jsx
// versi A
<Button title="Simpan Data" onPress={simpan} color="#2563eb" />

// versi B
<Pressable onPress={simpan} style={({ pressed }) => [styles.tombol, pressed && styles.tombolTertekan]}>
  <Text style={styles.labelTombol}>Simpan Data</Text>
</Pressable>
```

**Tugas:**

1. Sebutkan perbedaan keduanya, dan **tiga** hal yang tidak bisa dilakukan `Button` namun bisa dilakukan `Pressable`.
2. Pada versi B, jelaskan kapan `pressed` bernilai `true`, dan mengapa `styles.tombolTertekan` diletakkan **paling akhir** dalam array.
3. Tambahkan `android_ripple` pada versi B, lalu jalankan di Android dan iOS. Tulis hasil pengamatan Anda dan jelaskan sebabnya.
4. Tombol di desain hanya berukuran 100×32 piksel. Perbaiki agar mudah ditekan tanpa mengubah tampilan visualnya. Sebutkan nama propertinya dan alasannya.
5. Kapan `Button` masih pilihan yang wajar?

**Yang dinilai:** pemilihan komponen berbasis kebutuhan desain, pemahaman style sebagai fungsi, kesadaran perbedaan platform pada efek ripple, dan `hitSlop`.

---

### Soal 5 — `TextInput` sebagai Controlled Component (9 poin)

```jsx
export default function FormNama() {
  const [nama, setNama] = useState("");

  return (
    <View style={styles.form}>
      <TextInput style={styles.input} value={nama} placeholder="Ketik nama lengkap" />
      <Text>Halo, {nama ? nama : "belum ada nama"}!</Text>
      <TextInput style={styles.input} value={nama} maxLength={30} />
    </View>
  );
}
```

**Tugas:**

1. Ketik pada kotak pertama. Apa yang terjadi? Jelaskan mengapa, dan hubungkan dengan istilah *controlled component*.
2. Perbaiki kotak pertama agar dapat diketik dan teks sapaan ikut berubah setiap ketukan.
3. Pada kotak kedua, `maxLength` sudah dipasang. Jelaskan apa yang dijamin `maxLength`, dan apa yang **tidak** dijaminnya (petunjuk: validasi).
4. Tampilkan penghitung karakter `12/30` di bawah kotak. Nilai itu **turunan** dari state — jelaskan mengapa tidak perlu `useState` terpisah.
5. Jika `onChangeText` dihapus tetapi `value` dipertahankan, apa yang dialami pengguna? Sebutkan gejalanya secara spesifik.

**Yang dinilai:** diagnosis input terkunci, pemahaman siklus state → render, pemisahan state vs nilai turunan, kesadaran batas `maxLength`.

---

## Bagian B — Style, Layout, dan Platform
**Soal 6–10 · 54 poin**

### Soal 6 — Satu Layar, Satu Scroller Utama (12 poin)

```jsx
<ScrollView>
  <View style={styles.kartuProfil}>
    <Text style={styles.judul}>Profil Mahasiswa</Text>
    <Text>Total 1.000 mahasiswa</Text>
  </View>

  <FlatList
    data={DAFTAR_MAHASISWA}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <BarisMahasiswa mahasiswa={item} />}
  />
</ScrollView>
```

**Langkah kerja:**

1. Jalankan kode di atas. Gulir daftar dan perhatikan **Metro console**.
2. Catat peringatan yang muncul (kata kunci: `VirtualizedLists`).

**Tugas:**

1. Tuliskan peringatan yang muncul, kata per kata, dan jelaskan mengapa React Native menganggapnya berbahaya.
2. Jelaskan dua hal yang rusak ketika dua scroller searah bersarang: satu bersifat fungsional (gulir), satu bersifat kinerja (virtualisasi).
3. Perbaiki sehingga hanya ada satu scroller, tanpa memindahkan kartu profil keluar dari halaman. Sebutkan properti `FlatList` yang Anda pakai.
4. Tuliskan **kapan** alternatif sebaliknya (satu `ScrollView` untuk seluruh halaman) justru pilihan yang benar. Berikan satu contoh layar.
5. Peringatan ini tidak menghentikan aplikasi. Jelaskan mengapa justru itu yang membuatnya berbahaya, dan bagaimana Anda bisa menemukannya di proyek orang lain (petunjuk: Bab 14).

**Yang dinilai:** reproduksi peringatan, pemahaman mekanisme virtualisasi, ketepatan perbaikan, dan penalaran tentang "peringatan yang mudah diabaikan".

---

### Soal 7 — Tiga Properti Wajib `FlatList` dan `numColumns` (10 poin)

```jsx
<FlatList
  data={DAFTAR_MAHASISWA}
  renderItem={({ item }) => <BarisMahasiswa mahasiswa={item} />}
  numColumns={2}
/>
```

**Tugas:**

1. Properti wajib ketiga tidak ditulis. Jalankan, catat peringatan di console, lalu perbaiki dengan nilai yang memenuhi **dua syarat** `key`. Sebutkan kedua syarat itu.
2. Jelaskan mengapa `item.id` lebih baik daripada `index` pada daftar yang bisa difilter atau diurutkan. Hubungkan dengan pengalaman Bab 4.
3. Ganti `numColumns` dari `2` menjadi `3` saat aplikasi berjalan (mis. lewat sebuah tombol atau perubahan lebar layar). Amati hasilnya, lalu jelaskan mengapa `FlatList` membutuhkan `key` yang ikut berubah ketika `numColumns` berubah.
4. Sebutkan empat properti `FlatList` lain yang Anda pelajari, dan satu situasi tepat untuk masing-masing.

**Yang dinilai:** kelengkapan properti wajib, syarat `key` (unik **dan** stabil), pemahaman `key` untuk `numColumns`, dan pengetahuan lanjutan yang terarah.

---

### Soal 8 — Safe Area di Dua Platform (10 poin)

```jsx
import { SafeAreaView } from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.layar}>
      <Text style={styles.judul}>Profil Mahasiswa</Text>
    </SafeAreaView>
  );
}
```

**Tugas:**

1. Jalankan di iOS dan di Android. Tulis perbedaan hasilnya, lalu jelaskan sebabnya.
2. Ganti dengan pustaka modern. Tuliskan perintah instalasi, komponen yang dipasang di **akar** aplikasi, dan properti yang mengatur tepi mana yang dilindungi.
3. Jelaskan apa yang dimaksud dengan *inset*, dan sebutkan **tiga** hal pada layar ponsel yang membuat safe area diperlukan.
4. Jelaskan mengapa sejak Android 15 masalah ini menjadi **wajib**, bukan tambahan.
5. Sebutkan satu risiko yang muncul ketika Anda **meng-hardcode** `paddingTop: 44` sebagai pengganti safe area, dan hubungkan dengan keberagaman perangkat.

**Yang dinilai:** pengalaman melihat perbedaan nyata antar platform, kemampuan migrasi ke pustaka yang benar, pemahaman insets, dan kesadaran versi (perilaku ini dapat berubah antar rilis — sebutkan sumber verifikasi Anda).

---

### Soal 9 — StyleSheet, Array Style, dan Perbedaan Platform (10 poin)

```jsx
const styles = StyleSheet.create({
  baris: { padding: 12, backgroundColor: "#ffffff" },
  barisAktif: { backgroundColor: "#dbeafe" },
  barisTertekan: { opacity: 0.7 },
  judul: { fontSize: 18, fontWeight: "bold" },
  judulJudul: { color: "#1e3a8a" }, // salah ketik nama style
});
```

**Tugas:**

1. Jelaskan mengapa `StyleSheet.create` membuat salah ketik seperti `styles.judulJudul` lebih mudah ditemukan dibanding CSS biasa. Keuntungan kedua apa yang diberikan `StyleSheet.create` bagi keterbacaan komponen?
2. Tulis satu `Pressable` yang memakai **satu array style** berisi gaya dasar, gaya aktif bersyarat (props `aktif`), dan gaya tertekan sekaligus. Jelaskan urutan prioritasnya dan mengapa `false`/`null` di dalam array tidak merusak apa pun.
3. Jelaskan mengapa tidak ada *cascade* di React Native. Jika sebuah `View` berisi tiga `Text` dan Anda ingin semuanya berwarna biru, apa yang harus dilakukan?
4. Tulis gaya `kartu` yang memiliki bayangan berbeda di iOS dan Android, menggunakan `Platform.select` di dalam `StyleSheet.create`. Sebutkan properti yang dipakai masing-masing platform dan mengapa keduanya tidak saling menggantikan.
5. Tanpa melihat slide, tuliskan aturan pemilihan: kapan `Platform.select`, kapan `Platform.OS`, dan kapan berkas `.ios.js`/`.android.js`?

**Yang dinilai:** keunggulan `StyleSheet`, penguasaan pola array style, pemahaman tidak adanya cascade, kelengkapan bayangan dua platform, dan aturan pemilihan alat perbedaan platform.

---

### Soal 10 — Flexbox `column` dan Tata Letak Responsif (12 poin)

```jsx
const styles = StyleSheet.create({
  layar: { flex: 1, padding: 16 },
  barisJudul: { flexDirection: "row", justifyContent: "space-between" },
  barisKartu: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  kartuKecil: { width: "48%" },
  kaki: { flex: 1 },
});
```

**Tugas:**

1. Dua `View` ditumpuk tanpa `flexDirection` sama sekali. Tulis hasilnya, lalu jelaskan **mengapa** default React Native berbeda dari web dan apa nama mesin tata letaknya.
2. Dari kode di atas, jelaskan fungsi tiap properti berikut **dalam konteks kode itu**: `justifyContent`, `alignItems` (nilainya default), `flexWrap`, `gap`, dan `flex: 1` pada `kaki`. Untuk `kaki`, jelaskan pola apa yang dihasilkan.
3. Mengapa `width: "48%"` dipilih, bukan `"50%"`? Hitung dan jelaskan dengan `gap: 10` dalam pikiran.
4. Tulis logika `useWindowDimensions` yang menghasilkan **3 kolom** pada lebar ≥ 600 dan **2 kolom** di bawahnya, lalu terapkan sebagai `numColumns`. Jangan lupa `key`. Jelaskan mengapa `key` itu diperlukan.
5. Pada ponsel selebar 360 piksel, berapa kolom yang muncul? Buktikan dengan perhitungan atau tangkapan layar.
6. Putar perangkat ke posisi lanskap. Jelaskan mengapa menyimpan lebar layar di variabel biasa pada awal aplikasi berjalan adalah kesalahan.

**Yang dinilai:** pemahaman default `column` pada Yoga, penguasaan enam properti inti Flexbox, ketelitian angka layout, implementasi responsif yang berjalan (termasuk `key` untuk `numColumns`), dan kesadaran bahwa `useWindowDimensions` memicu re-render.

---

## Ketentuan Pengumpulan

1. Kumpulkan folder `praktikum-5/` berisi seluruh kode sumber **dan** `README.md` yang memuat:
   - cara menjalankan, serta perangkat/emulator yang dipakai (sebutkan OS dan ukuran layarnya);
   - untuk Soal 6 dan 8: **potongan pesan console** dan **tangkapan layar iOS vs Android**;
   - tiga perbedaan platform yang paling mengejutkan bagi Anda, beserta sebabnya.
2. Tangkapan layar wajib untuk: Soal 2 (red screen sebelum perbaikan), Soal 3 (kotak kosong sebelum perbaikan), Soal 6 (peringatan `VirtualizedLists`), Soal 8 (iOS vs Android), Soal 10 (2 kolom dan 3 kolom setelah rotasi/perubahan lebar).
3. Tidak boleh ada teks yang ditulis langsung di dalam `View`, dan tidak boleh ada peringatan `key` yang belum diselesaikan.
4. Batas waktu: akhir sesi lab Pertemuan 6. Project `profil-mahasiswa` **jangan dihapus**, karena dilanjutkan pada Bab 6 dan Bab 7.

## Sebaran Bobot

| Soal | Materi | Poin |
|---|---|---|
| 1 | React web vs React Native (Tabel 5.1) | 10 |
| 2 | `View` & `Text`, aturan teks | 8 |
| 3 | `Image`: `require` vs `uri`, placeholder inisial | 9 |
| 4 | `Button` vs `Pressable`, style fungsi, `hitSlop` | 10 |
| 5 | `TextInput` controlled component | 9 |
| 6 | `ScrollView` vs `FlatList`, scroller bersarang | 12 |
| 7 | Tiga properti wajib `FlatList`, `keyExtractor`, `numColumns` | 10 |
| 8 | Safe area di iOS & Android | 10 |
| 9 | `StyleSheet`, array style, `Platform.select` | 10 |
| 10 | Flexbox `column`, `useWindowDimensions`, layout responsif | 12 |
| **Total** | | **100** |

## Rubrik Umum (Lampiran A)

| Aspek | Bobot |
|---|---|
| Pemahaman konsep (penjelasan tertulis) | 15% |
| Implementasi (kode berjalan di perangkat) | 25% |
| Kualitas kode (penamaan, struktur, tanpa style duplikat) | 15% |
| UI/UX (tata letak rapi, aman dari notch, umpan balik sentuh) | 15% |
| Debugging (proses menemukan bug) | 10% |
| Dokumentasi (`README.md`, tangkapan layar) | 20% |

---

*Kunci jawaban untuk asisten/dosen tersedia di `praktikum/bab-05-kunci-jawaban.md`. Jangan dibagikan ke mahasiswa.*
