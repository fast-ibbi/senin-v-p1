# List Tutorial Demo — Bab 5: Dasar React Native

Delapan demo berurutan, dari folder kosong sampai halaman katalog responsif. Satu demo per bagian
deck, ditutup satu demo integrasi.

Proyek demo bernama **`kantin-kampus`** dan ditulis dari nol di depan kelas. Berkas ini tidak
memakai `demo/bab-05`, `demo/bab-05-mahasiswa`, maupun `demo/web/bab-05`; semua kode di bawah
berdiri sendiri dan bisa diketik ulang kapan saja.

Deck: `slides/bab-05-dasar-react-native.md` · Pertemuan 6 · total sesi 100 menit.
Versi yang dipakai sama dengan slide penutup: **Expo SDK 57 · React Native 0.86 · React 19.2 ·
Node.js ≥ 22**.

---

## Peta demo ke slide

| Demo | Isi demo | Slide yang dilayani | Subbab | Menit |
|---|---|---|---|---|
| 0 | Project kosong, Metro, hot reload, struktur folder | Pembuka bab | — | 5 |
| 1 | Satu halaman: versi web dibaca, versi native dijalankan | "Elemen HTML Diganti Komponen Native", "Bagian Kode yang Bisa Dipakai Ulang" | 1.1–1.4 | 6 |
| 2 | `View`, `Text`, `Image`, `TextInput`, `Button`, `Pressable` dalam satu kartu | "Empat Komponen Pertama", "Tombol, Daftar, dan Area Aman", "Props Turun" | 2.1–2.6 | 9 |
| 3 | `StyleSheet`, array style, gaya kondisional status stok | "Gaya Ditulis sebagai Objek", "Array Style", "Gaya Kondisional" | 3.1–3.4 | 7 |
| 4 | Dua panel `column` → `row`, penghitung render | "`useWindowDimensions()`", "Breakpoint dan Orientasi" | 4.7–4.10 | 9 |
| 5 | 200 item yang sama: `ScrollView` lalu `FlatList` | "`ScrollView`", "`FlatList`", "Memilih Komponen Pengguliran", "`Platform.OS`" | 5.1–5.4 | 7 |
| 6 | Katalog: pencarian, grid 2→3 kolom, keadaan kosong | "Praktikum Integrasi: Halaman Katalog Responsif" | penutup | 6 |
| 7 | Daftar teramati, kuis kilat, tenggat | "Yang Harus Teramati", "Kuis Kilat", "Siap ke Bab 6" | — | 10 |

Sisa 41 menit dipakai untuk pembuka (5 menit) dan praktikum di lab (36 menit), lihat
**Anggaran menit**.

---

## Sebelum masuk kelas

- [ ] `npx expo start` sudah dicoba sekali dari folder bersih; Metro dan satu target sudah terbuka.
- [ ] Metro console terlihat di layar kedua — Demo 1 dan Demo 5 membaca console, bukan layar HP.
- [ ] Emulator berjalan di **ponsel potret** (bukan tablet), supaya Demo 4 punya perubahan susunan.
- [ ] Ukuran font perangkat di pengaturan bawaan, bukan font raksasa.
- [ ] Folder `theme/` dan `data/` sudah dibuat kosong (isi ditulis di kelas), supaya tidak ada
      delapan menit habis untuk membuat folder.
- [ ] Sadar satu hal: Demo 2 memakai `assets/icon.png` bawaan template Expo sebagai gambar contoh.
      Tidak perlu mengunduh aset apa pun.

---

## Anggaran menit

| Segmen | Menit | Kumulatif |
|---|---|---|
| Pembuka, pertanyaan pemantik | 5 | 5 |
| Demo 0 — persiapan | 5 | 10 |
| Demo 1 — web dan native | 6 | 16 |
| Demo 2 — komponen inti | 9 | 25 |
| Demo 3 — style dan gaya kondisional | 7 | 32 |
| Demo 4 — layout responsif | 9 | 41 |
| Demo 5 — scroller | 7 | 48 |
| Demo 6 — katalog | 6 | 54 |
| Praktikum di lab | 36 | 90 |
| Demo 7 — kuis kilat dan penutup | 10 | 100 |

Pembuka memakai pertanyaan pemantik deck: **"Kalau cara berpikirnya sama dengan React, kenapa
kodenya harus berbeda?"** Tampung dua sampai tiga jawaban tanpa dikoreksi, lalu buka terminal:
"jawabannya ada di delapan demo ini".

Sebutkan satu kalimat pengikat: demo memakai data **kantin kampus**, sedangkan buku dan praktikum
memakai data mahasiswa. Struktur komponennya sama; yang berganti hanya isi datanya.

---

## Demo 0 — Dari folder kosong sampai layar hidup (5 menit)

**Slide:** pembuka bab, tanpa slide isi · **Berkas:** `App.js` · **Metro**

**Langkah**

1. Jalankan perintah scaffold, lalu masuk ke foldernya.
2. Hapus seluruh isi `App.js`, ganti dengan versi kosong di bawah.
3. Jalankan `npx expo start`, tekan `i` atau `a`, lalu `w`.
4. Tunjukkan satu teks berubah di editor, simpan, dan tunjukkan layar ikut berubah tanpa restart.
5. Buat tiga folder kosong: `theme/`, `data/`, `components/`.

```bash
npx create-expo-app@latest kantin-kampus --template blank
cd kantin-kampus
npx expo start
```

```jsx
// App.js
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={gaya.halaman}>
      <Text>Kantin Kampus</Text>
    </View>
  );
}

const gaya = StyleSheet.create({
  halaman: { flex: 1, padding: 24, justifyContent: 'center' },
});
```

**Hasil yang harus terlihat:** satu baris teks di tengah layar; setelah disunting, teks berubah
tanpa memuat ulang aplikasi.

**Pertanyaan kelas:** "Kenapa `View` tidak boleh berisi teks langsung?" Tampung dulu, jawab di
Demo 2.

**Jebakan:** `-t blank` vs `--template blank` pada versi baru; kalau salah, template default
membawa tab navigasi yang tidak dipakai hari ini.

---

## Demo 1 — Halaman pertama: JSX sama, medium berbeda (6 menit)

**Slide:** "Konsepnya Sama, Medianya Berbeda", "Elemen HTML Diganti Komponen Native", "HTML
Dirender Browser, Komponen Dirender Native", "Bagian Kode yang Bisa Dipakai Ulang" · **subbab
1.1–1.4** · **Berkas:** `App.js`

**Langkah**

1. Tulis versi web sebagai komentar di kepala berkas. Dibaca, tidak dijalankan.
2. Tulis versi native di bawahnya: `View`, `Text`, `Pressable`.
3. Tunjukkan `onPress` yang masih mengirim `console.log`, lalu tekan tombolnya dan lihat console.
4. Ganti `Pressable` menjadi `Button`, tekan sekali, lalu kembalikan: `Button` tidak bisa ditata
   bebas.
5. Minta kelas menghitung baris yang benar-benar berubah dibanding versi web.

```jsx
// Versi web — dibaca saja, tidak dijalankan di Expo
// <div> <h1>Kantin Kampus</h1> <p>Menu hari ini: 8 pilihan</p> <button>Pesan</button> </div>

import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={gaya.halaman}>
      <Text style={gaya.judul}>Kantin Kampus</Text>
      <Text style={gaya.deskripsi}>Menu hari ini: 8 pilihan</Text>
      <Pressable style={gaya.tombol} onPress={() => console.log('Pesan ditekan')}>
        <Text style={gaya.label}>Pesan</Text>
      </Pressable>
    </View>
  );
}

const gaya = StyleSheet.create({
  halaman: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  judul: { fontSize: 28, fontWeight: 'bold' },
  deskripsi: { fontSize: 14, color: '#5b6169' },
  tombol: { backgroundColor: '#0f766e', paddingVertical: 12, borderRadius: 12 },
  label: { color: '#ffffff', textAlign: 'center', fontWeight: '600' },
});
```

**Hasil yang harus terlihat:** judul, deskripsi, dan tombol berwarna; baris `Pesan ditekan` muncul di
Metro console setiap tombol ditekan.

**Pertanyaan kelas:** "Berapa baris yang benar-benar berubah?" Jawaban yang diharapkan: import,
nama komponen, dan definisi gaya — bukan logikanya.

**Jebakan:** menjanjikan versi web dijalankan di Expo. Yang dijalankan hari ini hanya versi native;
versi web hanya pembanding yang dibaca. Sebut ini terus terang. Dan `Button` tidak menerima
children: prop-nya `title`, bukan teks di dalam tag.

---

## Demo 2 — Komponen inti: enam peran dalam satu kartu (9 menit)

**Slide:** "Empat Komponen Pertama: Container sampai Input", "Tombol, Daftar, dan Area Aman",
"Props Turun, Komposisi Menyusun Antarmuka" · **subbab 2.1–2.6** · **Berkas:** `data/menu.js`,
`components/KartuMenu.js`, `App.js`

**Langkah**

1. Buat `data/menu.js` berisi delapan menu. Cukup satu yang perlu dibaca kelas: `stok`.
2. Buat `components/KartuMenu.js` dengan empat props: `nama`, `kategori`, `harga`, `stok`.
3. Panggil `KartuMenu` dua kali dengan props berbeda — tunjukkan satu komponen, dua isi.
4. Tambahkan `Image` **tanpa** `width`/`height`, tunjukkan kotaknya kosong, lalu beri ukuran 56 × 56.
5. Tambahkan `TextInput` terkendali di `App.js`: yang diketik muncul di baris "Nilai terbaca".
6. Sebut `Button` dan `Pressable` di kartu kedua tanpa menulis kode baru: keduanya sudah dipakai di
   Demo 1, bedanya hanya kebebasan menata gaya.

```js
// data/menu.js
export const menu = [
  { id: 'm01', nama: 'Nasi Ayam Geprek', kategori: 'Makanan', harga: 15000, stok: 12 },
  { id: 'm02', nama: 'Nasi Rendang', kategori: 'Makanan', harga: 18000, stok: 3 },
  { id: 'm03', nama: 'Mie Ayam Bakso', kategori: 'Makanan', harga: 13000, stok: 0 },
  { id: 'm04', nama: 'Sate Ayam', kategori: 'Makanan', harga: 16000, stok: 7 },
  { id: 'm05', nama: 'Es Teh Manis', kategori: 'Minuman', harga: 5000, stok: 40 },
  { id: 'm06', nama: 'Es Jeruk', kategori: 'Minuman', harga: 7000, stok: 2 },
  { id: 'm07', nama: 'Kopi Susu', kategori: 'Minuman', harga: 12000, stok: 9 },
  { id: 'm08', nama: 'Pisang Goreng', kategori: 'Camilan', harga: 8000, stok: 0 },
];
```

```jsx
// components/KartuMenu.js — Demo 2: struktur dulu, gaya menyusul di Demo 3
import { View, Text, Image } from 'react-native';

const gambarContoh = require('../assets/icon.png');

export default function KartuMenu({ nama, kategori, harga, stok }) {
  return (
    <View style={{ flexDirection: 'row', gap: 12, padding: 12 }}>
      <Image source={gambarContoh} style={{ width: 56, height: 56 }} />
      <View style={{ flex: 1 }}>
        <Text>{nama}</Text>
        <Text>{kategori}</Text>
        <Text>{`Rp${harga.toLocaleString('id-ID')}`}</Text>
        <Text>{`Stok: ${stok}`}</Text>
      </View>
    </View>
  );
}
```

```jsx
// App.js — dua kartu berbeda isi, satu komponen
import { useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import KartuMenu from './components/KartuMenu';
import { menu } from './data/menu';

export default function App() {
  const [kataKunci, setKataKunci] = useState('');

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <TextInput
        value={kataKunci}
        onChangeText={setKataKunci}
        placeholder="Cari menu"
      />
      <Text>{`Nilai terbaca: ${kataKunci}`}</Text>
      <KartuMenu {...menu[0]} />
      <KartuMenu {...menu[2]} />
    </ScrollView>
  );
}
```

**Hasil yang harus terlihat:** dua kartu dengan isi berbeda dari satu komponen; gambar muncul
setelah diberi ukuran; baris "Nilai terbaca" mengikuti ketikan.

**Pertanyaan kelas:** "Bolehkah `View` berisi teks langsung?" — tidak. Kalau ada waktu 30 detik,
hapus satu `View` pembungkus teks dan tunjukkan layar merahnya, lalu `Ctrl+Z`.

**Jebakan:** `contentContainerStyle` untuk padding di dalam area gulir; `style` pada `ScrollView`
tidak memberi hasil yang diharapkan.

---

## Demo 3 — StyleSheet: satu status, tiga wajah (7 menit)

**Slide:** "Gaya Ditulis sebagai Objek, Bukan CSS", "Warna, Ukuran, Jarak, dan Radius di Satu
Tempat", "Array Style: yang Ditulis Belakangan Menimpa", "Gaya Kondisional: Ternary dan Logika
`&&`" · **subbab 3.1–3.4** · **Berkas:** `theme/warna.js`, `components/KartuMenu.js`

**Langkah**

1. Buat `theme/warna.js`: satu tempat untuk warna, jarak, radius, huruf, dan breakpoint.
2. Pindahkan gaya `KartuMenu` ke `StyleSheet.create`, ganti angka mentah dengan konstanta tema.
3. Turunkan status dari `stok`: `habis`, `tipis`, `tersedia`. Yang disimpan hanya statusnya, bukan
   warnanya.
4. Pasang badge status dengan array style: gaya dasar di kiri, pengecualian di kanan.
5. Balik urutan array, tunjukkan hasilnya berubah — lalu kembalikan sambil mengucapkan aturannya.
6. Tunjukkan entri `false` diabaikan: menu berstok 12 tidak mendapat gaya `habis`, dan itu bukan
   error. Cara tercepat: tempel `console.log([gaya.badge, status === 'habis' && gaya.badgeHabis])`
   satu kali, tunjukkan `false` di console, lalu hapus lagi.

```js
// theme/warna.js
export const warna = {
  latar: '#f4f5f7',
  permukaan: '#ffffff',
  teks: '#1b1d21',
  teksRedup: '#5b6169',
  utama: '#0f766e',
  utamaMuda: '#ccfbf1',
  bahaya: '#b42318',
  bahayaMuda: '#fee4e2',
  garis: '#dfe3e8',
};

export const jarak = { kecil: 8, sedang: 16, besar: 24 };
export const radius = { kecil: 8, sedang: 12, besar: 20 };
export const huruf = { kecil: 12, isi: 14, judul: 20 };
export const breakpoint = { lebar: 600 };
```

```jsx
// components/KartuMenu.js — status diturunkan, gaya dipilih dari status
import { View, Text, Image, StyleSheet } from 'react-native';
import { warna, jarak, radius, huruf } from '../theme/warna';

const gambarContoh = require('../assets/icon.png');

function statusStok(stok) {
  if (stok === 0) return 'habis';
  if (stok <= 3) return 'tipis';
  return 'tersedia';
}

export default function KartuMenu({ nama, kategori, harga, stok }) {
  const status = statusStok(stok);

  return (
    <View style={gaya.kartu}>
      <Image source={gambarContoh} style={gaya.gambar} />
      <View style={gaya.isi}>
        <Text style={gaya.nama}>{nama}</Text>
        <Text style={gaya.kategori}>{kategori}</Text>
        <Text style={gaya.harga}>{`Rp${harga.toLocaleString('id-ID')}`}</Text>
        <Text
          style={[
            gaya.badge,
            status === 'habis' && gaya.badgeHabis,
            status === 'tipis' && gaya.badgeTipis,
          ]}
        >
          {status}
        </Text>
        {stok > 0 && <Text style={gaya.sisa}>{`sisa ${stok}`}</Text>}
      </View>
    </View>
  );
}

const gaya = StyleSheet.create({
  kartu: {
    flexDirection: 'row',
    gap: jarak.sedang,
    padding: jarak.sedang,
    backgroundColor: warna.permukaan,
    borderRadius: radius.sedang,
    borderWidth: 1,
    borderColor: warna.garis,
  },
  gambar: { width: 56, height: 56, borderRadius: radius.kecil },
  isi: { flex: 1, gap: 4 },
  nama: { fontSize: huruf.judul, fontWeight: '600', color: warna.teks },
  kategori: { fontSize: huruf.kecil, color: warna.teksRedup },
  harga: { fontSize: huruf.isi, fontWeight: '600', color: warna.utama },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: jarak.kecil,
    paddingVertical: 2,
    borderRadius: radius.kecil,
    backgroundColor: warna.utamaMuda,
    fontSize: huruf.kecil,
  },
  badgeHabis: { backgroundColor: warna.bahayaMuda, color: warna.bahaya },
  badgeTipis: { backgroundColor: warna.latar, color: warna.teksRedup },
  sisa: { fontSize: huruf.kecil, color: warna.teksRedup },
});
```

**Hasil yang harus terlihat:** menu `Mie Ayam Bakso` (stok 0) berbadge merah, `Nasi Rendang`
(stok 3) berbadge tipis, sisanya berbadge biasa. Setelah urutan array dibalik, latar merahnya kalah
oleh gaya dasar — tetapi warna hurufnya tetap, karena properti yang tidak diatur ulang tidak ikut
hilang.

**Pertanyaan kelas:** "Kenapa status jangan dibedakan lewat warna saja?" — sebagian pengguna tidak
dapat membedakan warna; karena itu badge membawa **teks** `habis`, bukan hanya warna.

**Jembatan ke praktikum:** aturan yang sama dipakai Praktikum 3 pada tombol, bukan badge. Yang
diganti hanya komponen yang diberi gaya.

**Jebakan:** menaruh objek gaya di dalam badan komponen sehingga dibuat ulang setiap render;
dan menyimpan gaya di dalam `useState` — yang disimpan cukup statusnya.

---

## Demo 4 — Satu layar, dua susunan (9 menit)

**Slide:** "Flexbox: Container, Item, dan Dua Sumbu", "Arah dan Perataan", "Pembagian Ruang",
"`useWindowDimensions()`: Ukuran Jendela Reaktif", "Breakpoint dan Orientasi" · **subbab
4.1–4.10** · **Berkas:** `screens/BerandaScreen.js`, `App.js`

**Langkah**

1. Buat `screens/BerandaScreen.js` dengan dua panel dan `flexDirection: 'column'` tetap.
2. Panggil dari `App.js`, lalu putar emulator: panel tetap bertumpuk. Ini pembandingnya.
3. Ganti dengan `useWindowDimensions()` dan ambang `breakpoint.lebar` (600).
4. Putar emulator lagi: panel berpindah ke `row` tanpa memuat ulang aplikasi.
5. Tunjukkan penghitung render bertambah setiap kali lebar berubah — bukti hook ini reaktif,
   bukan sekali ukur.
6. Sebut aturan berpasangan: `justifyContent` selalu sumbu utama, `alignItems` selalu sumbu silang.

```jsx
// screens/BerandaScreen.js
import { useRef } from 'react';
import { View, Text, useWindowDimensions, StyleSheet } from 'react-native';
import { warna, jarak, radius, huruf, breakpoint } from '../theme/warna';

export default function BerandaScreen() {
  const { width } = useWindowDimensions();
  const layarLebar = width >= breakpoint.lebar;

  const jumlahRender = useRef(0);
  jumlahRender.current += 1;

  return (
    <View style={[gaya.halaman, { flexDirection: layarLebar ? 'row' : 'column' }]}>
      <Text style={gaya.catatan}>
        {`lebar ${Math.round(width)} · render ke-${jumlahRender.current}`}
      </Text>
      <View style={gaya.panel}>
        <Text style={gaya.judul}>Menu hari ini</Text>
        <Text style={gaya.isi}>8 pilihan, 2 habis</Text>
      </View>
      <View style={gaya.panel}>
        <Text style={gaya.judul}>Pesanan</Text>
        <Text style={gaya.isi}>3 menunggu diambil</Text>
      </View>
    </View>
  );
}

const gaya = StyleSheet.create({
  halaman: { flex: 1, flexWrap: 'wrap', gap: jarak.sedang, padding: jarak.sedang },
  catatan: { width: '100%', fontSize: huruf.kecil, color: warna.teksRedup },
  panel: {
    flex: 1,
    minWidth: 240,
    padding: jarak.sedang,
    backgroundColor: warna.permukaan,
    borderRadius: radius.sedang,
    borderWidth: 1,
    borderColor: warna.garis,
    gap: 4,
  },
  judul: { fontSize: huruf.judul, fontWeight: '600' },
  isi: { fontSize: huruf.isi, color: warna.teksRedup },
});
```

**Hasil yang harus terlihat:** potret — dua panel bertumpuk; lanskap atau lebar ≥ 600 — dua panel
berdampingan; angka `render ke-N` bertambah setiap lebar berubah.

**Pertanyaan kelas:** "Properti apa yang berubah saat layar melebar?" — `flexDirection`, dari
`column` menjadi `row`.

**Jebakan:** memulai demo di tablet, sehingga panel sudah `row` sejak awal dan perubahannya tidak
terlihat. Dan mengukur sekali di `useState` awal — layout tidak akan pernah berubah. Penghitung
render sengaja kasar: ia menghitung pemanggilan render, bukan jumlah render unik, jadi angkanya
bisa melompat dua kali. Yang dibuktikan hanya satu hal — angkanya bergerak saat lebar berubah.

---

## Demo 5 — Dua scroller untuk data yang sama (7 menit)

**Slide:** "`ScrollView` untuk Konten Statis yang Panjang", "`FlatList` untuk Data yang Bisa
Memanjang", "Memilih Komponen Pengguliran", "`Platform.OS` dan File Khusus Platform" · **subbab
5.1–5.4** · **Berkas:** `data/menu.js`, `screens/DaftarScreen.js`

**Langkah**

1. Tambahkan `menuPanjang` — 200 item, satu baris data yang sama.
2. Render dengan `ScrollView`: penghitung `jumlahRenderItem` naik di setiap pemanggilan `Baris`,
   lalu angkanya dicetak sekali ke Metro setiap mode berganti.
3. Pindah ke `FlatList` dengan `data`, `keyExtractor`, `renderItem`. Baca angka yang sama di Metro.
4. Gulir daftar `FlatList` dan tekan tombol mode untuk memicu hitungan baru: angkanya tetap di
   puluhan, bukan 200 — hanya jendela di sekitar layar yang disusun.
5. Tambahkan satu baris `Platform.OS` di atas daftar, lalu sebut kapan file `.ios.js` lebih tepat.
6. Ucapkan larangannya: `FlatList` di dalam `ScrollView` searah merusak virtualisasi.

```js
// data/menu.js — tambahan untuk Demo 5
export const menuPanjang = Array.from({ length: 200 }, (_, i) => ({
  id: `p${i + 1}`,
  nama: `Menu uji ${i + 1}`,
  harga: 5000 + (i % 10) * 1000,
  stok: i % 7,
}));
```

```jsx
// screens/DaftarScreen.js
import { useEffect, useState } from 'react';
import {
  View, Text, Pressable, ScrollView, FlatList, Platform,
} from 'react-native';
import KartuMenu from '../components/KartuMenu';
import { menuPanjang } from '../data/menu';

let jumlahRenderItem = 0;

function Baris({ item }) {
  jumlahRenderItem += 1;
  return <KartuMenu {...item} />;
}

export default function DaftarScreen() {
  const [mode, setMode] = useState('scroll');

  function gantiMode() {
    jumlahRenderItem = 0;
    setMode(mode === 'scroll' ? 'flat' : 'scroll');
  }

  useEffect(() => {
    const id = setTimeout(() => {
      console.log(`[${mode}] item dirender: ${jumlahRenderItem}`);
    }, 100);
    return () => clearTimeout(id);
  }, [mode]);

  return (
    <View style={{ flex: 1 }}>
      <Text>{`Platform: ${Platform.OS}`}</Text>
      <Pressable onPress={gantiMode}>
        <Text>{`Mode: ${mode} — tekan untuk berganti`}</Text>
      </Pressable>

      {mode === 'scroll' ? (
        <ScrollView>
          {menuPanjang.map((item) => <Baris key={item.id} item={item} />)}
        </ScrollView>
      ) : (
        <FlatList
          data={menuPanjang}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Baris item={item} />}
        />
      )}
    </View>
  );
}
```

**Hasil yang harus terlihat:** di Metro, mode `scroll` mencetak `200`, mode `flat` mencetak sekitar
`10`. Log keluar sekali setiap mode berganti; ia tidak mencetak ulang selama daftar digulir.

**Pertanyaan kelas:** "Untuk delapan menu yang semuanya muat di satu layar, mana yang lebih tepat?"
— `ScrollView`; `FlatList` baru berguna saat datanya bisa memanjang.

**Jebakan:** angka bisa tercetak dua kali di mode pengembangan; cukup sebut sekali bahwa alat ukur
ini kasar, yang penting bedanya dua orde. Dan jangan menaruh `FlatList` di dalam `ScrollView` searah
hanya agar "bisa digulir" — peringatan `VirtualizedLists` di console adalah materinya.

---

## Demo 6 — Katalog: seluruh isi bab dalam satu halaman (6 menit)

**Slide:** "Praktikum Integrasi: Halaman Katalog Responsif" · **penutup bab** · **Berkas:**
`screens/KatalogScreen.js`

**Langkah**

1. Buat `KatalogScreen`: `FlatList` + `TextInput` pencarian di `ListHeaderComponent`.
2. Saring `menu` dengan `filter` di luar `renderItem`, bukan di dalamnya.
3. Set `numColumns` dari lebar layar: 2 di ponsel, 3 di lebar ≥ 600. Beri `key` yang ikut berubah.
4. Ketik kata yang tidak ada: `ListEmptyComponent` muncul, bukan indikator pemuatan.
5. Tambahkan `keyboardShouldPersistTaps="handled"`; tunjukkan tombol yang harus ditekan dua kali
   menjadi cukup sekali.
6. Tegaskan: hanya satu scroller di layar ini, dan tidak ada `ScrollView` yang membungkusnya.

```jsx
// screens/KatalogScreen.js
import { useState } from 'react';
import {
  View, Text, TextInput, FlatList, useWindowDimensions, StyleSheet,
} from 'react-native';
import KartuMenu from '../components/KartuMenu';
import { menu } from '../data/menu';
import { warna, jarak, breakpoint } from '../theme/warna';

export default function KatalogScreen() {
  const [kataKunci, setKataKunci] = useState('');
  const { width } = useWindowDimensions();

  const jumlahKolom = width >= breakpoint.lebar ? 3 : 2;
  const data = menu.filter((item) =>
    item.nama.toLowerCase().includes(kataKunci.toLowerCase())
  );

  return (
    <FlatList
      key={String(jumlahKolom)}
      data={data}
      numColumns={jumlahKolom}
      keyExtractor={(item) => item.id}
      columnWrapperStyle={{ gap: jarak.sedang }}
      contentContainerStyle={gaya.isi}
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => <View style={gaya.sel}><KartuMenu {...item} /></View>}
      ListHeaderComponent={
        <TextInput
          value={kataKunci}
          onChangeText={setKataKunci}
          placeholder="Cari menu kantin"
          style={gaya.pencarian}
        />
      }
      ListEmptyComponent={
        <Text style={gaya.kosong}>{`Tidak ada menu yang cocok dengan "${kataKunci}"`}</Text>
      }
    />
  );
}

const gaya = StyleSheet.create({
  isi: { padding: jarak.sedang, gap: jarak.sedang },
  sel: { flex: 1 },
  pencarian: {
    borderWidth: 1,
    borderColor: warna.garis,
    borderRadius: 12,
    padding: 12,
    marginBottom: jarak.sedang,
    backgroundColor: warna.permukaan,
  },
  kosong: { textAlign: 'center', padding: jarak.besar, color: warna.teksRedup },
});
```

**Hasil yang harus terlihat:** grid 2 kolom di ponsel, 3 kolom saat jendela dilebarkan; pencarian
menyaring seketika; keadaan kosong muncul untuk kata yang tidak ada.

**Pertanyaan kelas:** "Bagian mana yang paling lama kamu kerjakan nanti, dan kenapa?" — jawaban
umumnya layout, dan itulah alasan Bagian 4 mendapat porsi terbesar.

**Jebakan:** `numColumns` tidak boleh berubah tanpa `key` baru; tanpa itu `FlatList` mengeluh dan
barisnya berantakan. Baris terakhir yang tidak penuh akan melebar mengisi ruang kosong — sebut
sekali sebagai perilaku `flex: 1`, bukan bug yang perlu dikejar di kelas.

---

## Demo 7 — Yang teramati, kuis, dan penutup (10 menit)

**Slide:** "Yang Harus Teramati", "Kuis Kilat", "Kunci Kuis Kilat", "Ringkasan", "Siap ke Bab 6"

**Langkah**

1. Minta kelas mencentang lima butir "Yang Harus Teramati" pada aplikasi demo di layar.
2. Butir yang gagal ditandai, bukan dijelaskan panjang; bahas di sesi berikutnya.
3. Kuis kilat: dua menit, jawaban ditulis dulu, baru slide kunci dibuka.
4. Sebut tenggat Praktikum 5 dan praktikum integrasi beserta bobot rubriknya.
5. Tutup dengan satu kalimat: "Hari ini abjad visualnya; minggu depan kata dan kalimatnya."

**Hasil yang harus terlihat:** semua orang menulis jawaban sebelum kunci dibuka; dua butir yang
paling sering gagal disebut terang-terangan.

**Pertanyaan kelas:** "Butir mana yang paling sering gagal di kelas ini?" — jawaban yang
diharapkan: tombol yang berubah status, dan area aman.

**Jebakan:** membuka slide kunci terlalu cepat. Kalau perlu, sembunyikan kunci dengan `p` sebelum
kuis dimulai.

---

## Urutan memotong kalau sesi melar

Potong dari atas daftar ini, dan katakan kepada kelas bahwa bagian itu dibaca mandiri.

1. **Demo 0** — pakai project yang sudah disiapkan, cukup tunjukkan layarnya hidup.
2. **Demo 1** — bawakan Bagian 1 langsung dari slide; isinya konsep, bukan keterampilan baru.
3. **Demo 5** — tampilkan `FlatList` saja beserta angka di Metro, lalu serahkan `ScrollView` ke
   praktikum.
4. **Demo 3** — kalau ini juga terpotong, ganti satu kalimat: "yang ditulis belakangan menimpa, dan
   `false` diabaikan".

Jangan dipotong: **Demo 4** dan **Demo 6**. Keduanya paling banyak menyita waktu praktikum kalau
tidak pernah dilihat di kelas.

---

## Empat hal yang harus dikatakan terang-terangan

1. **Demo berjalan di satu target.** Perbedaan Android dan iOS tidak didemokan; bagian itu
   dibawakan dari slide dan dikerjakan di praktikum.
2. **Versi web hanya dibaca.** Satu-satunya kode yang dijalankan hari ini adalah versi native.
3. **Tidak ada kode yang sengaja dibuat salah, kecuali satu.** Layar merah di Demo 2 berlangsung 30
   detik dan langsung dibatalkan; sisanya dikerjakan mahasiswa sendiri di lab.
4. **Gambar contoh memakai aset bawaan template.** Bukan gambar kantin sungguhan — supaya tidak ada
   demo yang gagal karena unduhan.
