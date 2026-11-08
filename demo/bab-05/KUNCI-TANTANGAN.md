# Kunci Tantangan Lab — Bab 5: Dasar React Native

Kunci untuk `TANTANGAN-LAB.md`. **Jangan dibagikan ke mahasiswa.**

Isinya bukan berkas utuh, melainkan potongan **sebelum → sesudah** pada baris yang berubah, satu
paragraf alasan, dan daftar gejala kalau dikerjakan salah. Cara memakainya: buka berkas layar yang
disebut, cari potongan "sebelum"-nya, lalu bandingkan dengan pekerjaan mahasiswa. Kalau potongannya
tidak ada di tempat yang disebut, berarti mahasiswa menyelesaikannya lewat jalan lain — tanyakan
jalan itu, jangan langsung disalahkan.

Rujukan berkas: `demo/bab-05/`. Semua nomor baris sengaja tidak ditulis, karena berkas demo akan
terus berubah.

---

## T1 — Baris padanan yang belum ada

**Berkas:** `screens/PadananScreen.js`

**Sesudah** (disisipkan setelah baris `button`, sebelum baris `CSS`):

```jsx
<BarisPadanan
  kode="ul / li"
  keterangan="View + Text per butir — tidak ada daftar bawaan; satu li menjadi satu View berisi satu Text"
>
  <View style={styles.contohDaftar}>
    {['Laptop', 'Tablet', 'Headphone'].map((nama) => (
      <Text key={nama} style={styles.labelDaftar}>• {nama}</Text>
    ))}
  </View>
</BarisPadanan>

<BarisPadanan
  kode="section + h2"
  keterangan="View + Text — struktur semantik hilang; yang tersisa hanya susunan visual"
>
  <View style={styles.contohSection}>
    <Text style={styles.judulSection}>Judul bagian</Text>
    <Text style={styles.labelDaftar}>Satu kalimat isi bagian.</Text>
  </View>
</BarisPadanan>
```

Gaya yang perlu ditambahkan ke `StyleSheet.create` — semuanya dari konstanta tema:

```jsx
contohDaftar: { gap: JARAK.xs },
contohSection: { gap: JARAK.xs },
judulSection: { fontSize: TEKS.judul, fontWeight: '700', color: WARNA.tinta },
labelDaftar: { fontSize: TEKS.kecil, color: WARNA.tinta },
```

**Kenapa.** `ul` tidak punya padanan tunggal: satu `li` menjadi satu `View` berisi satu `Text`,
sedangkan `ul` itu sendiri adalah `View` yang menampungnya. `section` dan `h2` bahkan lebih jauh —
keduanya runtuh menjadi `View` dan `Text`, dan makna semantiknya hilang sama sekali. Inilah inti
kalimat slide "padanannya tidak selalu satu-satu".

**Gejala jawaban salah**

- Hanya ada `Text` bertumpuk tanpa `View` pembungkus → daftar jadi satu paragraf, dan butirnya
  tidak bisa digaya sendiri-sendiri.
- `keterangan` berbunyi "ul menjadi View" tanpa menyebut pemecahan → jawaban belum sampai ke
  bagian yang tidak satu-satu.
- Ada `'#1d4ed8'` atau angka `16` di dalam `StyleSheet` → konstanta tema dilewati.

---

## T2 — Satu kartu profil dari empat komponen

**Berkas:** `components/KartuProfil.js` (baru) dan `screens/KomponenScreen.js`

**Sesudah** — `components/KartuProfil.js`:

```jsx
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

// Komponen ini hanya membaca props; keadaannya sendiri (diikuti) hidup di sini.
export default function KartuProfil({ nama, peran, foto }) {
  const [diikuti, setDiikuti] = useState(false);

  return (
    <View style={styles.kartu}>
      <Image
        source={foto}
        style={styles.foto}
        resizeMode="cover"
        accessibilityLabel={'Foto ' + nama}
      />
      <View style={styles.badan}>
        <Text style={styles.nama}>{nama}</Text>
        <Text style={styles.peran}>{peran}</Text>
        <Pressable
          onPress={() => setDiikuti(!diikuti)}
          accessibilityRole="button"
          accessibilityState={{ selected: diikuti }}
          style={[styles.tombol, diikuti && styles.tombolAktif]}
        >
          <Text style={[styles.labelTombol, diikuti && styles.labelTombolAktif]}>
            {diikuti ? 'Diikuti' : 'Ikuti'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
```

Gaya penting — `foto` **wajib** punya dua ukuran:

```jsx
foto: { width: 64, height: 64, borderRadius: RADIUS.bulat },
```

Gaya lain (`kartu`, `badan`, `nama`, `peran`, `tombol`, `tombolAktif`) mengikuti pola yang sudah
ada di `screens/GayaScreen.js`: gaya dasar di kiri, pengecualian di kanan.

**Sesudah** — pemanggilan di `screens/KomponenScreen.js`, sebagai kartu terakhir:

```jsx
<Contoh
  judul="Kartu profil"
  subbab="subbab 2.7"
  catatan="Empat komponen kecil disusun menjadi satu bagian; dua pemanggilan, satu komponen."
>
  <KartuProfil nama="Rani" peran="Mahasiswa Sistem Informasi" foto={require('../assets/produk/headphone.png')} />
  <KartuProfil nama="Bagas" peran="Asisten Lab" foto={require('../assets/produk/keyboard.png')} />
</Contoh>
```

**Kenapa.** Ini kali pertama `props` dipakai untuk sesuatu yang berulang. Yang diuji bukan
sintaksnya, melainkan dua keputusan: di mana state `diikuti` diletakkan, dan kenapa `require` harus
berupa literal. Dua kartu yang tombolnya tidak saling memengaruhi adalah bukti bahwa state-nya
memang berada di komponen yang benar.

**Gejala jawaban salah**

- Menekan kartu pertama ikut mengubah tombol kartu kedua → `diikuti` disimpan di
  `KomponenScreen`, bukan di `KartuProfil`.
- Gambar tidak muncul sama sekali → `foto` diberi `flex: 1` atau `width: '100%'` tanpa tinggi.
- Ada galat `Invalid call at line …` → `require` dipanggil dengan variabel, bukan literal.
- Tombol berganti komponen (`<Button>` lalu `<Pressable>`), bukan berganti gaya → gaya kondisional
  belum dipakai.

---

## T3 — Kotak kode yang berkata jujur

**Berkas:** `screens/GayaScreen.js`

**Sesudah** — tiga suntingan kecil untuk status keempat:

```jsx
const PILIHAN_STATUS = [
  { nilai: 'utama', label: 'Utama' },
  { nilai: 'kedua', label: 'Kedua' },
  { nilai: 'nonaktif', label: 'Nonaktif' },
  { nilai: 'peringatan', label: 'Peringatan' },
];

const gayaTombol = [
  styles.tombol,
  status === 'utama' && styles.tombolUtama,
  status === 'kedua' && styles.tombolKedua,
  status === 'nonaktif' && styles.tombolNonaktif,
  status === 'peringatan' && styles.tombolPeringatan,
];

// di dalam StyleSheet.create
tombolPeringatan: { backgroundColor: WARNA.peringatan },
```

**Sebelum** — kotak kode menyusun namanya dari dua nama tetap:

```jsx
const namaGayaAktif = ['styles.tombol', 'styles.tombol' + kapital(status)];
```

**Sesudah** — kotak kode membaca array yang sebenarnya:

```jsx
// Urutan nama ini harus sejajar dengan urutan entri di gayaTombol.
const NAMA_GAYA = [
  'styles.tombol',
  'styles.tombolUtama',
  'styles.tombolKedua',
  'styles.tombolNonaktif',
  'styles.tombolPeringatan',
];

// Ditampilkan apa adanya: entri yang tidak berlaku muncul sebagai false.
const namaGayaAktif = gayaTombol.map((gaya, i) => (gaya ? NAMA_GAYA[i] : 'false'));
```

Dan kunci render-nya ikut berubah, karena `'false'` muncul lebih dari sekali:

```jsx
{namaGayaAktif.map((nama, indeks) => (
  <Text key={indeks} style={styles.kode}>{'  '}{nama},</Text>
))}
```

Fungsi pembantu `kapital()` menjadi tidak terpakai dan sebaiknya dihapus — kalau dibiarkan, ia
menjadi kode mati yang membuat pembaca berikutnya mengira masih dipakai di tempat lain.

**Kenapa.** Slide menjanjikan bahwa entri yang tidak cocok bernilai `false` dan diabaikan. Kotak
kode lama hanya menampilkan dua entri yang selalu benar, sehingga janji itu tidak pernah terbukti
di layar. Selama tiga status, kebetulan tidak ada yang salah — status keempatlah yang membongkar
kebohongannya. Inilah contoh nyata "tampilan dokumentasi bisa menyimpang dari kode yang berjalan".

**Gejala jawaban salah**

- Kotak kode tetap menampilkan dua baris setelah status keempat ditambahkan → langkah 3 dilewati,
  dan itu justru inti tantangannya.
- Entri `false` ditampilkan sebagai `undefined` atau string kosong → mahasiswa menyalin polanya
  tanpa mengikuti isi array aslinya.
- Muncul peringatan kunci kembar di console → `key={nama}` masih dipakai.
- Status `nonaktif` berhenti menyetel `disabled` → perilaku lama rusak saat menambah yang baru.
- Warna `'#b45309'` ditulis langsung → `WARNA.peringatan` dilewati.

---

## T4 — Susunan ketiga

**Berkas:** `screens/ResponsifScreen.js`

**Sesudah** — ambang kedua dan tiga susunan:

```jsx
const BREAKPOINT_LEBAR_TABEL = 900;

// Urutan pemeriksaan: yang paling lebar lebih dulu, karena setiap cabang
// menghentikan pemeriksaan berikutnya.
const susunan =
  lebar >= BREAKPOINT_LEBAR_TABEL ? 'tabel' : lebar >= BREAKPOINT_LEBAR ? 'row' : 'column';
```

**Sesudah** — isi layar bercabang tiga, sedangkan dua cabang lama tidak berubah:

```jsx
{susunan === 'tabel' ? (
  <View style={styles.tabel}>
    <View style={[styles.barisTabel, styles.kepalaTabel]}>
      <Text style={styles.selTabel}>Panel</Text>
      <Text style={styles.selTabel}>Nilai</Text>
    </View>
    <BarisTabel label="Ringkasan katalog" nilai={DAFTAR_PRODUK.length + ' produk'} />
    <BarisTabel label="Nilai stok" nilai={formatRupiah(nilaiStok)} />
  </View>
) : (
  <View style={[styles.panggung, { flexDirection: susunan }]}>…dua panel seperti semula…</View>
)}
```

Gaya tabel yang cukup, semuanya memakai konstanta tema:
```jsx
tabel: { borderWidth: 1, borderColor: WARNA.garis, borderRadius: RADIUS.md, overflow: 'hidden' },
barisTabel: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingVertical: JARAK.sm,
  paddingHorizontal: JARAK.md,
  borderTopWidth: 1,
  borderTopColor: WARNA.garis,
},
kepalaTabel: { backgroundColor: WARNA.latar, borderTopWidth: 0 },
selTabel: { fontSize: TEKS.kecil, color: WARNA.tinta },
```

Dan satu baris baru di `kartuUkur`:

```jsx
<BarisUkur label="breakpoint tabel" nilai={String(BREAKPOINT_LEBAR_TABEL)} />
```

`BarisTabel` cukup dibuat seperti `BarisUkur` yang sudah ada, dengan tambahan gaya
`styles.barisTabel`, supaya ketiga baris tabel memakai satu bentuk yang sama.

**Kenapa.** Breakpoint bukan ukuran perangkat, melainkan ambang keputusan. Menambah ambang kedua
memaksa satu keputusan yang tidak bisa dihindari: urutan pemeriksaan. Kalau `900` diperiksa setelah
`600`, cabang `row` sudah menangkap semua lebar di atas 600 dan cabang tabel tidak pernah tercapai.
Selain itu, `styles.panel` memakai `flex: 1` — mempertahankannya di dalam baris tabel adalah bukti
bahwa mahasiswa paham `flex` membagi ruang, bukan mengisi lebar.

**Gejala jawaban salah**

- Susunan tabel tidak pernah muncul di Expo Web → urutan pemeriksaan terbalik, atau ambang ditulis
  setelah `render` menghitung `susunan` lama.
- Susunan tabel muncul tetapi label dan nilainya menempel di tengah → `justifyContent` tanpa lebar
  kolom.
- Layar sempit rusak setelah suntingan → `flex: 1` pada `styles.panel` dihapus.
- `jumlah render` berhenti bertambah → `useWindowDimensions` diganti `Dimensions.get()`.
- Diuji di HP lalu dilaporkan "tidak berhasil" tanpa catatan ambang sementara → bukan kesalahan
  kode; minta catatan percobaannya.

---

## T5 — Angka yang membuktikan virtualisasi

**Berkas:** `screens/ScrollerScreen.js`

**Sebelum** — angka adalah potret sekali per pergantian mode, dan penghitungnya menghitung
pemanggilan render:

```jsx
let hitunganRender = 0;

function BarisPanjang({ item }) {
  hitunganRender += 1;
  …
}

useEffect(() => {
  const angka = hitunganRender;
  const timer = setTimeout(() => setTerrender(angka), 0);
  return () => clearTimeout(timer);
}, [mode]);
```

**Sesudah** — yang dihitung adalah id unik, dan angkanya diperbarui saat daftar digulir
(`useRef` ikut diimpor dari `react`):

```jsx
// di luar komponen: himpunan id yang pernah benar-benar tampil
const idTerlihat = new Set();

function gantiMode(modeBaru) {
  idTerlihat.clear();
  setTerrender(0);
  setMode(modeBaru);
}

// useRef supaya identitas fungsinya tetap antar-render — syarat FlatList
const lihatItem = useRef(({ viewableItems }) => {
  viewableItems.forEach(({ item }) => idTerlihat.add(item.id));
  setTerrender(idTerlihat.size);
}).current;
```

```jsx
<FlatList
  …
  onViewableItemsChanged={lihatItem}
  viewabilityConfig={{ itemVisiblePercentThreshold: 10 }}
  initialNumToRender={10}
  windowSize={5}
/>
```

Untuk cabang `ScrollView`, angkanya tidak perlu dihitung sama sekali: semua anak dirender, jadi
`setTerrender(daftarPanjang.length)` saat mode dipilih sudah benar dan lebih jelas. Efek potret
yang lama (`useEffect` dengan dependensi `[mode]`) dihapus seluruhnya — kalau dibiarkan, ia menimpa
angka baru dengan nilai lama dan angkanya kembali membeku.

**Hasil percobaan yang diharapkan** (Expo Web, jendela 390×844):

| `initialNumToRender` / `windowSize` | Angka "item dirender" |
|---|---|
| `10` / `5` (bawaan demo) | 10 |
| `50` / `5` | sekitar 50 |
| `50` / `1` | lebih kecil dari 50, turun setelah digulir |

Angka persisnya bergantung tinggi jendela dan tinggi baris. Yang harus terbukti bukan angkanya,
melainkan bahwa **angkanya bergerak ketika parameternya diubah** — itu bukti virtualisasi bekerja.

**Kenapa.** Bukti yang tidak dirawat akan berbohong. Angka lama tidak berubah saat digulir, padahal
baris baru jelas muncul; dan karena yang dihitung adalah pemanggilan render, menggulir bolak-balik
menaikkan hitungan untuk baris yang sama. Menghitung id unik menjawab pertanyaan yang sebenarnya
diajukan slide: berapa **baris berbeda** yang pernah disusun.

**Gejala jawaban salah**

- Angka tetap tidak bergerak setelah digulir → `onViewableItemsChanged` hilang, atau
  `viewabilityConfig` tidak diberikan (keduanya wajib berpasangan).
- Muncul peringatan "Changing onViewableItemsChanged on the fly is not supported" → fungsi tidak
  dibungkus `useRef`.
- Angka selalu 0 atau 1 → `new Set()` dibuat di dalam badan komponen, bukan di luar.
- Angka terus naik saat digulir bolak-balik → masih menghitung pemanggilan render.
- Catatan percobaan hanya berbunyi "sudah dicoba, hasilnya sama" → langkah 3 dilewati.
- Ada `FlatList` di dalam `ScrollView` → peringatan `VirtualizedLists` muncul, dan seluruh
  pengukuran menjadi tidak bermakna.

---

## T6 — Katalog yang ingat dan mengurutkan

**Berkas:** `screens/KatalogScreen.js` dan `App.js`

**Sesudah** — state diangkat ke `App.js`, karena layar dilepas dari pohon komponen saat kembali:

```jsx
const [kataKunciKatalog, setKataKunciKatalog] = useState('');

…
{layarAktif === 'katalog' ? (
  <KatalogScreen
    kataKunci={kataKunciKatalog}
    onUbahKataKunci={setKataKunciKatalog}
    onKembali={kembaliKeMenu}
  />
) : LayarAktif ? (
  <LayarAktif onKembali={kembaliKeMenu} />
) : (
  <MenuScreen onPilih={setLayarAktif} />
)}
```

**Sesudah** — `KatalogScreen` menerima props, mengurutkan hasil (bukan sumbernya), dan menambah
tombol hapus:

```jsx
export default function KatalogScreen({ kataKunci, onUbahKataKunci, onKembali }) {
  …
  // filter() mengembalikan array baru, jadi sort() di sini tidak menyentuh DAFTAR_PRODUK.
  const hasilSaring = DAFTAR_PRODUK.filter(…).sort(
    (a, b) => Number(a.stok === 0) - Number(b.stok === 0)
  );
```

```jsx
<View style={styles.barisCari}>
  <TextInput value={kataKunci} onChangeText={onUbahKataKunci} … />
  {kataKunci !== '' && (
    <Pressable
      onPress={() => onUbahKataKunci('')}
      accessibilityRole="button"
      accessibilityLabel="Hapus pencarian"
      style={styles.tombolHapus}
    >
      <Text style={styles.labelHapus}>Hapus</Text>
    </Pressable>
  )}
</View>
```

`styles.barisCari` memakai `flexDirection: 'row'` dengan `gap: JARAK.sm`, dan `TextInput` diberi
`flex: 1` supaya tombol mendorongnya, bukan menimpanya. Baris ringkasan tinggal ditambah penanda
urutan, karena jumlah hasilnya memang sudah dihitung dari `hasilSaring`:

```jsx
<Text style={styles.ringkasan}>
  {hasilSaring.length} dari {DAFTAR_PRODUK.length} produk · {jumlahKolom} kolom · urut: tersedia dulu
</Text>
```

**Kenapa.** Dua pelajaran sekaligus. Pertama: state hanya bertahan selama komponennya hidup —
kembali ke menu berarti layar katalog dilepas, dan `useState` di dalamnya ikut hilang. Mengangkat
state ke induk adalah jawaban paling sederhana sebelum Bab 9 memperkenalkan cara lain. Kedua:
`filter` mengembalikan array baru sehingga `sort` di belakangnya aman; `DAFTAR_PRODUK.sort(...)`
mengubah data yang dipakai layar 4 dan 5 sekaligus, dan kerusakannya baru terlihat setelah katalog
dibuka ulang.

**Gejala jawaban salah**

- Kata kunci hilang setelah kembali ke menu → state masih di `KatalogScreen`.
- Urutan produk berubah juga di layar 4 dan 5 → `DAFTAR_PRODUK` yang diurutkan, bukan hasil filter.
- Tombol hapus hilang bersama input saat ditekan → `TextInput` ditaruh di dalam cabang `if` yang
  berbeda, sehingga dibuat ulang dan fokus keyboard terputus.
- Ringkasan berbunyi "8 dari 8 produk" padahal daftar tersaring → angkanya diambil dari
  `DAFTAR_PRODUK`, bukan dari `hasilSaring`.
- Muncul peringatan `VirtualizedLists` → tombol atau input dibungkus `ScrollView` supaya bisa ikut
  tergulir.
- Grid berantakan setelah pencarian → `key={jumlahKolom}` atau `numColumns` ikut disunting.

---

## Kalau mahasiswa bertanya "ini masuk nilai?"

Jawaban singkat yang sesuai keputusan bab ini: **tidak**. Nilai praktikum berasal dari soal 1–10
(`praktikum/bab-05-soal-praktikum.md`). Tantangan ini latihan berpikir, dan yang diuji di kelas
berikutnya adalah penjelasannya, bukan hasil layarnya.

Kalau mahasiswa menyelesaikan seluruh enam tantangan, catat namanya — bukan untuk nilai, tetapi
sebagai calon pendamping di lab berikutnya.
