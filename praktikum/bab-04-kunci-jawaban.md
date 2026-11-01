# Kunci Jawaban & Panduan Penilaian — Praktikum Bab 4

> **Untuk asisten/dosen.** File ini memuat jawaban model dan kesalahan umum yang perlu diperhatikan saat menilai. Jangan dibagikan ke mahasiswa.

---

## Soal 1 — Deklaratif vs Imperatif (8 poin)

**Jawaban model:**

1. Versi deklaratif:

   ```jsx
   function RingkasanMahasiswa({ daftar }) {
     const aktif = daftar.filter((m) => m.aktif);
     return (
       <>
         <p>Jumlah mahasiswa aktif: {aktif.length}</p>
         <p>Pertama: {aktif[0]?.nama}</p>
       </>
     );
   }
   ```

2. **Sumber kebenaran:** array `daftar` (state atau data yang dikirim induk). `aktif.length` dan `aktif[0]` adalah **nilai turunan** — tidak disimpan di state, dihitung ulang setiap render.

3. Versi imperatif menuntut setiap perubahan data disertai perintah manipulasi DOM di tempat lain. Ketika ada dua jalur yang mengubah data (misalnya tambah dan hapus), salah satu jalur hampir pasti lupa memperbarui tampilan, sehingga data dan layar tidak sinkron.

**Penilaian:**
- 3 poin: versi React benar dan benar-benar merender, bukan sekadar `document.getElementById` dibungkus komponen.
- 3 poin: menandai nilai turunan sebagai derived, bukan state.
- 2 poin: penjelasan risiko desinkronisasi.

**Kesalahan umum:** menyimpan `jumlahAktif` di `useState` lalu menghitungnya di `useEffect` — ini menggelembungkan state dan menghadirkan bug sinkronisasi baru.

---

## Soal 2 — Lima Kesalahan JSX (10 poin)

| # | Kesalahan | Aturan |
|---|---|---|
| 1 | Tiga elemen bersaudara di level teratas | JSX harus punya **satu elemen akar** → bungkus `<></>` (fragment) atau `<div>` |
| 2 | `class="judul"` | Atribut memakai camelCase: `className` (karena `class` kata kunci JavaScript) |
| 3 | `<img src={foto}>` | Tag tanpa anak harus **self-closing**: `<img src={foto} />` |
| 4 | `style="color: gray"` | `style` menerima **objek**: `style={{ color: "gray" }}` |
| 5 | `<br>` | Tag tanpa anak harus self-closing: `<br />` |

**Perbaikan:**

```jsx
function Profil({ foto, nama }) {
  return (
    <>
      <h2 className="judul">Profil {nama}</h2>
      <img src={foto} />
      <p style={{ color: "gray" }}>Mahasiswa aktif</p>
      <br />
    </>
  );
}
```

**Alasan `class`:** `class` adalah kata kunci reserved di JavaScript, sedangkan JSX dikompilasi menjadi pemanggilan fungsi JavaScript; karena itu React memakai `className`.

**Penilaian:** 2 poin per kesalahan yang ditemukan **dan** dinamai benar (10 poin). Perbaikan kode yang berjalan tapi tidak menyebut aturannya maksimal 7 poin.

**Kesalahan umum:** memperbaiki `style` menjadi `style="color:gray"` (tetap salah); lupa bahwa `fragment` juga solusi sah untuk masalah akar.

---

## Soal 3 — Props Read-only (10 poin)

1. `props.nilai.huruf = ...` **memutasi objek milik induk**. Props hanya dibaca; anak tidak berhak mengubah data induk. Akibatnya sumber kebenaran data menjadi kabur: nilai huruf kini ada di objek yang dimiliki induk tetapi ditulis oleh anak, sehingga render berikutnya bisa memakai nilai lama atau nilai hasil mutasi secara tidak terduga.

2. Perbaikan:

   ```jsx
   function hitungHuruf(angka) {
     if (angka >= 85) return "A";
     if (angka >= 70) return "B";
     if (angka >= 55) return "C";
     if (angka >= 40) return "D";
     return "E";
   }

   function KartuNilai({ nilai, mataKuliah = "Tanpa Nama Mata Kuliah" }) {
     const huruf = hitungHuruf(nilai.angka); // dihitung, tidak disimpan
     return (
       <div>
         <p>{mataKuliah}</p>
         <p>Nilai: {huruf}</p>
       </div>
     );
   }
   ```

   Setara: `function KartuNilai({ nilai, mataKuliah = "..." })` atau `props.mataKuliah ?? "..."`.

3. Pemakaian dari induk:

   ```jsx
   <KartuNilai nilai={{ angka: 88 }} mataKuliah="Basis Data" />
   ```

   Jika `mataKuliah` tidak dikirim, **tidak terjadi error**: komponen tetap berjalan dengan nilai default.

**Penilaian:** 4 poin penjelasan read-only + konsekuensi; 4 poin perbaikan (perhitungan di luar props + default value); 2 poin contoh pemakaian & jawaban "tidak error".

**Kesalahan umum:** memakai `defaultProps` lalu menyatakan itu satu-satunya cara (di React 19.2 default parameter adalah cara utama); memindahkan perhitungan ke `useState` lalu mengisinya dengan `useEffect` (anti-pattern).

---

## Soal 4 — Imutabilitas (12 poin)

1. `m.aktif = true` memutasi **objek yang sama** yang sudah ditunjuk state. `setMahasiswa(mahasiswa)` mengirim referensi array yang sama, sehingga React menyimpulkan state tidak berubah dan **tidak melakukan render ulang**. React membandingkan referensi (identitas objek), bukan isi; mutasi tidak mengubah identitas.

2. Perbaikan:

   ```jsx
   function aktifkan(id) {
     setMahasiswa((sebelumnya) =>
       sebelumnya.map((m) => (m.id === id ? { ...m, aktif: true } : m))
     );
   }
   ```

   Kunci: `map` menghasilkan **array baru** dan spread menghasilkan **objek baru** untuk item yang berubah.

3. `setMahasiswa([...mahasiswa])` **tidak cukup**. Itu hanya membuat salinan dangkal array, sedangkan objek mahasiswa di dalamnya masih objek yang sama. Kalau mutasi `m.aktif = true` tetap dilakukan, React tetap melihat objek yang sama pada index tersebut, dan `React.memo`/perbandingan anak bisa melewatkan perubahan.

4. Aturan praktis (contoh yang diterima): *"Jika saya menulis `=` pada sesuatu yang berasal dari props atau state, itu tanda bahaya — ganti dengan operator yang menghasilkan nilai baru."* Variasi lain: *"Jangan pernah mengubah, selalu buat yang baru."*

**Penilaian:** 4 poin diagnosis (referensi vs isi); 4 poin perbaikan benar; 2 poin jawaban tepat untuk salinan dangkal; 2 poin aturan praktis yang bisa dipakai.

**Kesalahan umum:** memakai `useEffect` yang memantau `mahasiswa` untuk memaksa render; memakai `JSON.parse(JSON.stringify(...))` sebagai solusi tanpa bisa menjelaskan alasannya (boleh, tapi harus disertai alasan).

---

## Soal 5 — Props vs State (8 poin)

| Data | Jenis | Pemilik |
|---|---|---|
| `prodi` | state | `App` (dipakai filter + dikirim ke `FilterProdi` sebagai props) |
| `sedangMemuat` | state | `App` (dikelola dan diubah di dalam `App` sendiri) |
| `DATA_MAHASISWA` | bukan keduanya — konstanta modul statis | Di luar komponen; dikirim sebagai props |
| `detailTampil` | state | `KartuMahasiswa` masing-masing |

2. `detailTampil` bersifat lokal: membuka detail Budi tidak boleh membuka detail Siti. Menaikkannya ke `App` memaksa satu nilai tunggal untuk semua kartu, dan menuntut struktur data tambahan (misalnya himpunan id yang terbuka) yang belum perlu di bab ini.

3. Jika `prodi` menjadi state di setiap kartu, filter menjadi **tidak sinkron**: setiap kartu memilih sendiri, sehingga daftar bisa berisi campuran prodi sekaligus dan ringkasan agregat tidak lagi mewakili daftar yang ditampilkan. Ini contoh klasik "state diletakkan terlalu dalam".

**Penilaian:** 4 poin tabel benar; 2 poin alasan lokalitas `detailTampil`; 2 poin analisis konsekuensi.

**Kesalahan umum:** menyebut `DATA_MAHASISWA` sebagai state (padahal konstanta modul — tidak pernah berubah selama aplikasi berjalan).

---

## Soal 6 — Event Handling (12 poin)

1. Tiga kesalahan:
   - Tombol 1: `onClick={setDetailTampil(!detailTampil)}` — setter **dipanggil saat render**, bukan saat diklik. Nilai `!detailTampil` dievaluasi saat render dan hasilnya (`undefined`/hasil setter) yang diserahkan sebagai handler.
   - Tombol 2: `onClick={ubahKategori(prodi)}` — fungsi **dipanggil saat render**, dan argumen `prodi` tidak pernah dibawa dengan benar ke handler.
   - Tombol 3: `setKunjungan(kunjungan + 1)` tiga kali membaca nilai `kunjungan` yang **sama** (stale), jadi hasil akhirnya hanya +1.

2. Perbaikan:

   ```jsx
   <button onClick={() => setDetailTampil((t) => !t)}>Detail</button>
   <button onClick={() => ubahKategori(prodi)}>Pilih prodi</button>
   <button onClick={() => catatKunjungan()}>Kunjungi</button>

   function catatKunjungan() {
     setKunjungan((k) => k + 1);
     setKunjungan((k) => k + 1);
     setKunjungan((k) => k + 1); // hasil: +3
   }
   ```

3. Ketiga pemanggilan terjadi dalam satu batch render yang sama. Sebelum render ulang, `kunjungan` masih bernilai lama untuk ketiga baris, sehingga React menerima `set(0+1)` tiga kali dan hasil akhirnya `1`. Functional update membuat setiap langkah membaca nilai **terbaru** dari antrean, sehingga hasilnya `3`.

4. Jika dibiarkan, `setDetailTampil(false)` (atau nilai hasilnya) dipanggil **saat render**, bukan saat tombol ditekan. Akibatnya: tombol tampak "tidak berfungsi" saat diklik, dan pada kasus yang lebih parah muncul `Maximum update depth exceeded` karena setiap render memicu setter lagi.

**Penilaian:** 6 poin tiga diagnosis; 4 poin perbaikan berjalan; 2 poin penjelasan batch + dev-warning loop.

**Kesalahan umum:** memperbaiki tombol 1 menjadi `onClick={setDetailTampil(!detailTampil)}` dengan `useEffect` untuk "menunda" — gejala hilang, penyebab tidak.

---

## Soal 7 — Conditional Rendering (10 poin)

1. Perbaikan:

   ```jsx
   {jumlahMahasiswa > 0 && <p>Ada {jumlahMahasiswa} mahasiswa</p>}
   ```

   atau lebih eksplisit:

   ```jsx
   {jumlahMahasiswa ? <p>Ada {jumlahMahasiswa} mahasiswa</p> : <p>Belum ada mahasiswa</p>}
   ```

2. Contoh jawaban yang memakai dua pola:

   ```jsx
   function Tampilan({ status }) {
     if (status === "memuat") return <p>Memuat data…</p>; // early return

     return (
       <div>
         {status === "kosong" ? (
           <p>Tidak ada mahasiswa</p>          // ternary
         ) : (
           <DaftarMahasiswa />                 // cabang "siap"
         )}
       </div>
     );
   }
   ```

3. `&&` mengembalikan **operan kiri** ketika operan kiri falsy. Karena `0` dan `""` adalah falsy namun tetap dapat dirender, React menampilkan `0` atau string kosong di layar. Untuk nilai yang mungkin `0`/`""`, gunakan perbandingan eksplisit (`> 0`) atau ternary.

**Penilaian:** 4 poin perbaikan `&&`; 4 poin blok render tiga status dengan ≥2 pola; 2 poin alasan falsy.

**Kesalahan umum:** menulis `if` di dalam JSX (hanya ekspresi yang boleh), atau membuat tiga `useState` terpisah untuk satu status (harus satu variabel status).

---

## Soal 8 — Bug `key={index}` (12 poin)

1. Hasil pengamatan: setelah filter `Informatika`, kartu **Dewi Lestari** (semula index 3, kini index 1) tampil dengan detail terbuka — detail "menempel" pada posisi, bukan pada mahasiswa. Bisa juga muncul pada kartu lain bergantung urutan filter; yang dinilai adalah **fenomena**, bukan nama kartu tertentu.

2. React mencocokkan elemen lama dengan elemen baru berdasarkan **`key`**. Dengan `key={index}`, posisi 1 tetap dianggap elemen yang sama, sehingga state lokal `detailTampil` milik elemen posisi 1 dibawa ke mahasiswa baru yang menempati posisi itu. Akibatnya data benar, tetapi state komponen salah pemilik.

3. Perbaikan: `key={mahasiswa.id}`. Setelah diubah, React mengenali setiap kartu sebagai entitas berbeda sehingga state detail ikut berpindah bersama pemiliknya.

4. `key={Math.random()}` lebih buruk karena `key` berubah **setiap render**. React menganggap semua elemen hilang lalu membuat ulang seluruh daftar: state lokal (detail terbuka, input yang sedang diketik) hilang, animasi putus, dan performa jatuh. Bug tidak hilang, hanya berpindah menjadi "semua kartu selalu tertutup".

5. Dua syarat `key`: **(a) unik** di antara saudara sekandung, dan **(b) stabil** — tidak berubah antar-render untuk entitas yang sama.

**Penilaian:** 3 poin reproduksi + catatan pengamatan; 3 poin penjelasan mekanisme pencocokan; 2 poin perbaikan; 2 poin penjelasan `Math.random()`; 2 poin dua syarat `key`.

**Kesalahan umum:** meletakkan `key` di dalam komponen `KartuMahasiswa` (harus pada elemen hasil `map`); menyimpulkan bahwa `index` selalu salah (untuk daftar statis yang tidak pernah berubah urutan, `index` masih dapat diterima — poin diberikan bila mahasiswa menyebut syarat ini).

---

## Soal 9 — `useEffect` & Cleanup (10 poin)

1. Tiga masalah:
   - **Tanpa dependency array** → efek berjalan pada **setiap render**, sehingga setiap tick membuat `setInterval` baru (timer menumpuk, aplikasi makin berat).
   - Membaca `detik` di dalam closure → nilai **stale**; karena interval dibuat ulang terus, kenaikan tampak tidak beraturan.
   - **Tidak ada cleanup** → fungsi kembalian tidak disediakan, jadi interval lama tidak pernah dihentikan; saat komponen dilepas, interval tetap memanggil setter pada komponen yang sudah tidak ada.

2. Perbaikan:

   ```jsx
   useEffect(() => {
     const timer = setInterval(() => {
       setDetik((d) => d + 1);   // functional update → tidak stale
     }, 1000);

     return () => clearInterval(timer); // cleanup
   }, []);                      // hanya sekali saat mount
   ```

3. Tiga bentuk:
   - `useEffect(fn)` → berjalan pada **setiap render**. Contoh tepat: sinkronisasi ke sistem luar yang memang harus mengikuti setiap perubahan (mis. memperbarui judul dokumen berdasarkan state yang berubah).
   - `useEffect(fn, [])` → berjalan **sekali saat mount**, cleanup saat unmount. Contoh: memasang `setInterval`, berlangganan event, atau mengambil data awal.
   - `useEffect(fn, [dep])` → berjalan saat mount dan **diulang ketika `dep` berubah**. Contoh: memuat ulang data ketika `prodi` berubah.

4. Bukan bug. React sengaja menjalankan efek dua kali di mode pengembangan (Strict Mode) untuk membantu menemukan efek yang tidak bersih. Efek yang benar (dengan cleanup) tetap berperilaku benar; jika perilakunya rusak karena dijalankan dua kali, itu justru sinyal bahwa cleanup belum lengkap.

**Penilaian:** 4 poin tiga masalah; 3 poin perbaikan; 2 poin tabel tiga bentuk dependency; 1 poin penjelasan dev double-run.

**Kesalahan umum:** menambahkan `[detik]` pada dependency agar "benar" (menghasilkan interval baru setiap detik); memakai `clearInterval(timer)` di dalam callback tanpa `return`.

---

## Soal 10 — `useMemo` / `useCallback` (8 poin)

1. Evaluasi:

   | Baris | Putusan | Alasan |
   |---|---|---|
   | `useMemo(() => "Daftar Mahasiswa", [])` | **Tidak perlu** | Menyimpan konstanta string; tidak ada perhitungan, tidak terukur, hanya menambah kompleksitas |
   | `useCallback((n) => \`NIM ${n}\`, [])` | **Tidak perlu (kecuali ada alasan)** | Hanya bermanfaat bila fungsi itu dikirim ke anak yang dibungkus `React.memo` (atau dipakai sebagai dependency effect). Di sini tidak |
   | `useMemo(filter, [daftar, prodi])` | **Layak dipertahankan** | Filter atas seluruh data — biaya tumbuh linear terhadap jumlah data, dan `daftar`/`prodi` jarang berubah |
   | `useMemo(rataIpk, [hasilFilter])` | **Layak dipertahankan** | Agregasi atas hasil filter; bergantung pada `hasilFilter` yang sudah dimemo, sehingga cache benar-benar terpakai |

2. Dengan **10 data**, selisih waktunya tidak dapat dirasakan (mikrodetik); manfaatnya nol secara praktis dan justru menambah memori serta satu lapis pembacaan. Dengan **10.000 data**, filter + agregasi berjalan pada setiap render (mis. setiap ketikan atau setiap perubahan state tak terkait), dan di sinilah memo mulai terasa — itulah makna *measurable*: ada bukti beban, bukan asumsi.

3. `useMemo` menyimpan **nilai** hasil perhitungan; `useCallback` menyimpan **fungsi** (referensi fungsi yang sama antar-render).

4. Risiko: bukan hanya "tidak berguna", tetapi menambah penggunaan memori, memperlambat render pertama (biaya penyimpanan), dan menyulitkan pembaca karena harus memverifikasi sendiri kebenaran dependency array. Dependency yang salah menyebabkan **nilai basi** — bug yang lebih sulit dilacak daripada lambat.

**Penilaian:** 4 poin evaluasi empat baris (1 per baris, alasan wajib); 2 poin skala 10 vs 10.000; 1 poin pembeda `useMemo`/`useCallback`; 1 poin risiko.

**Kesalahan umum:** menyatakan semua `useMemo` salah dan dihapus tanpa menyebut syarat *measurable*; menyebut `useCallback` "untuk membuat fungsi lebih cepat" (yang disimpan adalah referensi, bukan kecepatan eksekusi).

---

## Panduan Cepat Saat Mendampingi Lab

**Jika mahasiswa berhenti lebih dari 10 menit**, arahkan ke pertanyaan pemeriksaan berikut, bukan ke jawabannya:

| Gejala | Pertanyaan pemicu |
|---|---|
| "Data berubah, layar tidak" | "Apakah kamu menulis `=`, `push`, atau `sort` pada sesuatu dari state?" |
| "Tombol tidak bereaksi" | "Yang kamu serahkan ke `onClick` itu fungsi atau hasil pemanggilan fungsi?" |
| "Detail pindah ke kartu lain" | "`key`-mu unik dan stabil, atau hanya unik?" |
| "Angka `0` muncul sendiri" | "Operan kiri `&&`-mu bernilai apa saat kosong?" |
| "Interval jalan dobel" | "Apa yang kamu `return` dari `useEffect`?" |
| "Terlalu banyak render" | "Ada setter yang dipanggil di badan komponen atau di efek tanpa dependency?" |

**Tanda jawaban hafalan (bukan pemahaman)** — kurangi poin penjelasan meski kodenya benar:
- menyebut "props itu seperti parameter" tanpa bisa menjelaskan mengapa read-only;
- menyebut "key harus unik" tanpa bisa menyebut syarat **stabil**;
- menghapus `useMemo` dari Soal 10 tanpa menyebut kriteria *measurable*.

**Ambang kelulusan praktikum:** 60/100, dengan syarat wajib Soal 4 dan Soal 8 benar (keduanya menguji konsep yang diuji kembali di UTS Pertemuan 8).
