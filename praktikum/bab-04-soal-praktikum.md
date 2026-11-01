# Soal Praktikum Lab — Bab 4: Dasar React

- **Mata Kuliah:** Pemrograman Mobile (3 SKS)
- **Pertemuan:** 4 (Bagian A) dan 5 (Bagian B)
- **Acuan materi:** `slides/bab-04-dasar-react.md`
- **Bobot total:** 100 poin
- **Sifat:** Individu, dikerjakan di lab, dinilai menggunakan rubrik praktikum (Lampiran A)

---

## Persiapan Praktikum

Sebelum mengerjakan soal, pastikan hal berikut sudah siap di komputer masing-masing:

1. Project dari Bab 2 sudah bisa dijalankan (`npm run dev` untuk React web, atau `npx expo start` untuk Expo).
2. Struktur folder minimal:

   ```text
   project/
   ├── App.js
   ├── components/
   │   ├── KartuMahasiswa.js
   │   └── DaftarMahasiswa.js
   └── data/
       └── mahasiswa.js
   ```

3. Data statis diletakkan **di luar komponen** (`data/mahasiswa.js`):

   ```js
   export const DATA_MAHASISWA = [
     { id: 1, nama: "Budi Santoso", nim: "22101001", prodi: "Sistem Informasi", ipk: 3.62, aktif: true },
     { id: 2, nama: "Siti Aminah",  nim: "22101002", prodi: "Informatika",       ipk: 3.18, aktif: true },
     { id: 3, nama: "Rizky Pratama", nim: "22101003", prodi: "Sistem Informasi", ipk: 2.87, aktif: false },
     { id: 4, nama: "Dewi Lestari", nim: "22101004", prodi: "Informatika",       ipk: 3.91, aktif: true },
     { id: 5, nama: "Andi Wijaya",  nim: "22101005", prodi: "Sistem Informasi", ipk: 3.05, aktif: true },
   ];

   export const PILIHAN_PRODI = ["Semua", "Sistem Informasi", "Informatika"];
   ```

4. Setiap jawaban **wajib dijalankan** (bukan hanya ditulis). Kode yang tidak pernah dijalankan dianggap belum dikerjakan.
5. Konsol browser/terminal harus dibuka selama praktikum, karena beberapa soal meminta Anda membaca peringatan di sana.

> **Catatan platform:** Contoh di Bab 4 memakai elemen web (`<div>`, `<p>`) agar fokus pada konsep React. Jika kelas Anda memakai Expo, ganti `<div>` → `<View>` dan `<p>`/`<h2>` → `<Text>`. Ikuti satu pilihan yang ditetapkan asisten agar penilaian seragam.

---

## Bagian A — Mindset, JSX, Props, dan State (Pertemuan 4)
**Soal 1–5 · 48 poin**

### Soal 1 — Deklaratif vs Imperatif (8 poin)

Perhatikan potongan kode untuk menampilkan jumlah mahasiswa yang masih aktif:

```js
// versi imperatif
const aktif = DATA_MAHASISWA.filter((m) => m.aktif);
document.getElementById("jumlah").textContent = aktif.length;
document.getElementById("daftar").appendChild(buatBaris(aktif[0]));
```

**Tugas:**

1. Tulis ulang potongan kode di atas menjadi versi deklaratif React yang mengikuti pola `UI = f(state)`.
2. Sebutkan state apa yang menjadi **sumber kebenaran** pada versi Anda, dan bagian mana yang menjadi turunan (derived) sehingga **tidak perlu** disimpan di state.
3. Jelaskan dalam 2–3 kalimat mengapa versi imperatif lebih mudah rusak ketika data berubah di dua tempat sekaligus.

**Yang dinilai:** ketepatan konsep deklaratif, pemisahan state vs nilai turunan.

---

### Soal 2 — Lima Kesalahan JSX (10 poin)

Kode berikut **tidak bisa dijalankan**. Ada **lima** pelanggaran aturan JSX.

```jsx
function Profil({ foto, nama }) {
  return (
    <h2 class="judul">Profil {nama}</h2>
    <img src={foto}>
    <p style="color: gray">Mahasiswa aktif</p>
    <br>
  );
}
```

**Tugas:**

1. Temukan dan tuliskan kelima kesalahan tersebut beserta **nama aturannya**.
2. Tulis perbaikan lengkap sehingga komponen berhasil dirender.
3. Jelaskan mengapa JSX tidak bisa memakai `class` seperti HTML biasa.

**Yang dinilai:** identifikasi aturan JSX, ketepatan perbaikan, alasan teknis.

---

### Soal 3 — Props Itu Read-only (10 poin)

```jsx
function KartuNilai(props) {
  props.nilai.huruf = hitungHuruf(props.nilai.angka);
  return (
    <div>
      <p>{props.mataKuliah}</p>
      <p>Nilai: {props.nilai.huruf}</p>
    </div>
  );
}
```

**Tugas:**

1. Jelaskan mengapa baris pertama di dalam komponen tersebut melanggar aturan props. Apa akibatnya bagi sumber kebenaran data di komponen induk?
2. Tulis perbaikan versi komponen, dengan ketentuan:
   - huruf mutu **dihitung**, bukan disimpan ke props;
   - `mataKuliah` memiliki **nilai default** jika induk lupa mengirimkannya.
3. Tunjukkan contoh pemakaian komponen tersebut dari komponen induk, lalu jawab: apa yang terjadi (error atau tidak) jika `mataKuliah` tidak dikirim?

**Yang dinilai:** pemahaman props read-only, penggunaan default value, arah aliran data.

---

### Soal 4 — Aturan Emas Imutabilitas (12 poin)

```jsx
const [mahasiswa, setMahasiswa] = useState(DATA_MAHASISWA);

function aktifkan(id) {
  const m = mahasiswa.find((x) => x.id === id);
  m.aktif = true;
  setMahasiswa(mahasiswa);
}
```

Tombol **Aktifkan** ditekan, tetapi tampilan di layar tidak berubah.

**Tugas:**

1. Jelaskan penyebab bug tersebut, dan hubungkan dengan cara React mendeteksi perubahan (`reconciliation`).
2. Perbaiki fungsi `aktifkan` sehingga layar ikut berubah, tanpa memutasi state.
3. Seseorang mengusulkan perbaikan cepat: `setMahasiswa([...mahasiswa])` saja. Apakah ini cukup? Jelaskan alasannya.
4. Tuliskan satu aturan praktis (satu kalimat) yang bisa dipakai untuk memeriksa kode sendiri sebelum dikumpulkan.

**Yang dinilai:** diagnosis bug immutabilitas, perbaikan dengan `map` + spread, penalaran tentang salinan dangkal.

---

### Soal 5 — Props atau State? (8 poin)

Perhatikan struktur berikut:

```jsx
// App.js
function App() {
  const [prodi, setProdi] = useState("Semua");
  const [sedangMemuat, setSedangMemuat] = useState(false);
  return (
    <>
      <FilterProdi nilai={prodi} onUbah={setProdi} />
      <DaftarMahasiswa daftar={DATA_MAHASISWA} />
    </>
  );
}
```

**Tugas:**

1. Untuk tiap data berikut, tentukan **props atau state**, dan **siapa pemiliknya**: `prodi`, `sedangMemuat`, `DATA_MAHASISWA`, serta `detailTampil` pada komponen `KartuMahasiswa`.
2. Jelaskan mengapa `detailTampil` sebaiknya **tidak** diangkat ke `App`.
3. Analisis: jika `prodi` dipindahkan menjadi state di dalam setiap `KartuMahasiswa`, apa yang akan terjadi pada perilaku filter?

**Yang dinilai:** tabel props vs state, keputusan lokasi state, penalaran konsekuensi desain.

---

## Bagian B — Event, Rendering, Komposisi, dan Hooks (Pertemuan 5)
**Soal 6–10 · 52 poin**

### Soal 6 — Tiga Kesalahan Event Handling (12 poin)

```jsx
function KartuMahasiswa({ mahasiswa, prodi }) {
  const [detailTampil, setDetailTampil] = useState(false);
  const [kunjungan, setKunjungan] = useState(0);

  function catatKunjungan() {
    setKunjungan(kunjungan + 1);
    setKunjungan(kunjungan + 1);
    setKunjungan(kunjungan + 1);
  }

  return (
    <div>
      <button onClick={setDetailTampil(!detailTampil)}>Detail</button>
      <button onClick={ubahKategori(prodi)}>Pilih prodi</button>
      <button onClick={() => catatKunjungan()}>Kunjungi</button>
    </div>
  );
}
```

**Tugas:**

1. Sebutkan **tiga** kesalahan pada ketiga handler di atas, satu kesalahan per handler.
2. Perbaiki ketiganya sehingga berjalan sesuai maksud.
3. Khusus tombol ketiga: jelaskan mengapa hasil akhirnya hanya bertambah 1 (bukan 3), lalu perbaiki dengan **functional update**.
4. Jelaskan apa yang terjadi jika kesalahan pada tombol pertama dibiarkan: kapan fungsi itu dipanggil?

**Yang dinilai:** function reference vs pemanggilan, arrow inline untuk mengirim argumen, functional update.

---

### Soal 7 — Conditional Rendering (10 poin)

```jsx
const [status, setStatus] = useState("siap"); // "memuat" | "kosong" | "siap"
const [jumlahMahasiswa, setJumlahMahasiswa] = useState(0);
```

**Tugas:**

1. Perbaiki baris berikut sehingga angka `0` tidak muncul di layar:

   ```jsx
   {jumlahMahasiswa && <p>Ada {jumlahMahasiswa} mahasiswa</p>}
   ```

2. Tulis satu blok render yang memunculkan tiga tampilan berbeda berdasarkan `status` (`memuat`, `kosong`, `siap`) menggunakan **minimal dua dari tiga pola** conditional rendering yang dibahas di kelas.
3. Jelaskan mengapa kondisi `&&` berbahaya untuk nilai `0` dan string kosong `""`.

**Yang dinilai:** tiga pola conditional rendering, kepekaan terhadap nilai falsy, alasan pemilihan pola.

---

### Soal 8 — Bug `key={index}` (12 poin)

Komponen berikut dipakai pada daftar yang **bisa difilter**:

```jsx
{DATA_MAHASISWA.map((mahasiswa, index) => (
  <KartuMahasiswa key={index} mahasiswa={mahasiswa} />
))}
```

**Langkah kerja:**

1. Jalankan aplikasi. Buka detail pada kartu **Andi Wijaya** (mahasiswa ke-5), lalu filter prodi menjadi `Informatika`.
2. Amati: detail yang terbuka berpindah ke kartu mahasiswa lain padahal datanya benar.

**Tugas:**

1. Reproduksi bug tersebut dan catat hasil pengamatan Anda (kartu mana yang ikut terbuka).
2. Jelaskan mekanisme penyebabnya: apa yang React gunakan untuk mencocokkan elemen lama dengan elemen baru?
3. Perbaiki `key`-nya, lalu buktikan bug hilang tanpa mengubah satu baris pun logika data.
4. Jelaskan mengapa `key={Math.random()}` **lebih buruk** daripada `key={index}`.
5. Sebutkan dua syarat nilai yang layak dipakai sebagai `key`.

**Yang dinilai:** reproduksi bug, pemahaman pencocokan elemen React, ketepatan perbaikan, penalaran anti-pattern.

---

### Soal 9 — `useEffect` dan Cleanup (10 poin)

```jsx
function Pengingat() {
  const [detik, setDetik] = useState(0);
  const [aktif, setAktif] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setDetik(detik + 1);
    }, 1000);
  });

  return <p>Berjalan {detik} detik</p>;
}
```

Komponen ini bermasalah: angka naik tidak beraturan, aplikasi makin berat, dan muncul peringatan di konsol setelah komponen dilepas.

**Tugas:**

1. Sebutkan **tiga** masalah pada `useEffect` di atas (petunjuk: dependency array, nilai yang dibaca di dalam closure, dan yang tidak dikembalikan).
2. Perbaiki sehingga: penghitung berjalan 1 detik sekali, hanya satu `setInterval` aktif, dan timer dihentikan saat komponen dilepas.
3. Jelaskan perbedaan perilaku antara `useEffect(fn)`, `useEffect(fn, [])`, dan `useEffect(fn, [dep])`. Berikan satu contoh pemakaian yang tepat untuk masing-masing.
4. Saat mode pengembangan, efek Anda tampak berjalan dua kali. Apakah itu bug pada kode Anda? Jelaskan.

**Yang dinilai:** pemahaman dependency array, cleanup, functional update di dalam interval, pemahaman perilaku dev mode.

---

### Soal 10 — Evaluasi `useMemo` dan `useCallback` (8 poin)

Rekan satu kelompok menulis:

```jsx
function DaftarMahasiswa({ daftar, prodi }) {
  const judul = useMemo(() => "Daftar Mahasiswa", []);
  const label = useCallback((n) => `NIM ${n}`, []);
  const hasilFilter = useMemo(
    () => daftar.filter((m) => prodi === "Semua" || m.prodi === prodi),
    [daftar, prodi]
  );
  const rataIpk = useMemo(
    () => hasilFilter.reduce((a, m) => a + m.ipk, 0) / (hasilFilter.length || 1),
    [hasilFilter]
  );

  return <p>{judul} — rata IPK {rataIpk.toFixed(2)}</p>;
}
```

**Tugas:**

1. Dari empat penggunaan `useMemo`/`useCallback` di atas, tentukan mana yang **tidak perlu** dan mana yang **layak dipertahankan**. Beri alasan berbasis kata kunci *measurable*.
2. Untuk yang layak dipertahankan, jelaskan manfaatnya ketika `daftar` berisi 10 data vs 10.000 data.
3. Satu kalimat pembeda: apa yang disimpan `useMemo`, dan apa yang disimpan `useCallback`?
4. Jelaskan risiko menambahkan `useMemo` pada **semua** perhitungan di dalam aplikasi.

**Yang dinilai:** evaluasi (bukan hafalan), penalaran biaya–manfaat optimasi, kejelasan istilah.

---

## Ketentuan Pengumpulan

1. Kumpulkan dalam satu folder `praktikum-4/` berisi:
   - seluruh file sumber (`App.js`, `components/`, `data/`);
   - `README.md` singkat: cara menjalankan, daftar soal yang dikerjakan, dan **tiga bug tersulit** yang Anda temui beserta cara Anda menemukannya.
2. Sertakan tangkapan layar untuk Soal 8 (kondisi sebelum dan sesudah perbaikan) dan Soal 9 (isi konsol).
3. Kode harus bebas dari peringatan `Each child in a list should have a unique "key" prop` dan bebas dari error React yang tidak ditangani.
4. Batas waktu: akhir sesi lab Pertemuan 5. Keterlambatan dikenakan pengurangan sesuai kebijakan kelas.

## Sebaran Bobot

| Soal | Materi | Poin |
|---|---|---|
| 1 | Konsep deklaratif, `UI = f(state)` | 8 |
| 2 | Aturan JSX | 10 |
| 3 | Props read-only & default value | 10 |
| 4 | Imutabilitas state | 12 |
| 5 | Props vs state, lokasi state | 8 |
| 6 | Event handling | 12 |
| 7 | Conditional rendering | 10 |
| 8 | List rendering & `key` | 12 |
| 9 | `useEffect` & cleanup | 10 |
| 10 | `useMemo` / `useCallback` | 8 |
| **Total** | | **100** |

## Rubrik Umum (Lampiran A)

| Aspek | Bobot |
|---|---|
| Pemahaman konsep (penjelasan tertulis) | 15% |
| Implementasi (kode berjalan) | 25% |
| Kualitas kode (penamaan, struktur, tanpa mutasi) | 15% |
| UI/UX (keterbacaan tampilan) | 15% |
| Debugging (proses menemukan bug) | 10% |
| Dokumentasi (`README.md`, tangkapan layar) | 20% |

---

*Kunci jawaban untuk asisten/dosen tersedia di `praktikum/bab-04-kunci-jawaban.md`. Jangan dibagikan ke mahasiswa.*
