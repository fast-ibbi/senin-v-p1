import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import LabelStatus from '../components/LabelStatus';
import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

// Info — halaman rujukan cepat untuk materi Bab 5.
//
// Rujukan slide Bab 5:
//   • Bagian 1 — padanan elemen HTML dan komponen React Native.
//   • subbab 5.3–5.4 — perbedaan platform dan Platform.OS.
//   • subbab 5.2 — tabel pemilihan komponen pengguliran.
//   • daftar periksa "Yang harus teramati" di akhir bab.

const PADANAN = [
  { web: 'div', native: 'View', catatan: 'container dan layout' },
  { web: 'p', native: 'Text', catatan: 'semua teks wajib dibungkus Text' },
  { web: 'button', native: 'Pressable', catatan: 'bebas ditata, punya pressed' },
  { web: 'CSS', native: 'StyleSheet', catatan: 'objek JavaScript, camelCase' },
];

const SCROLLER = [
  { kebutuhan: 'Konten halaman relatif sedikit', komponen: 'ScrollView' },
  { kebutuhan: 'Daftar data panjang atau dinamis', komponen: 'FlatList' },
  { kebutuhan: 'Daftar dua dimensi', komponen: 'FlatList + numColumns' },
  { kebutuhan: 'Daftar bertingkat beberapa bagian', komponen: 'SectionList' },
  { kebutuhan: 'Daftar kecil di dalam daftar lain', komponen: 'Evaluasi struktur' },
];

const PERBEDAAN_PLATFORM = [
  'Indikator gulir dan efek sentuh (ripple) hanya muncul di Android.',
  'Tombol kembali punya perilaku sendiri di Android, tidak ada padanannya di iOS.',
  'Area aman: iOS punya home indicator, Android modern menggambar isi sampai tepi layar.',
  'Papan ketik menutupi kotak isian dengan cara berbeda di kedua platform.',
];

const DAFTAR_PERIKSA = [
  'Teks muncul sebagai Text, bukan sebagai isi View.',
  'Tombol berubah tampilan saat status aktif dan nonaktif.',
  'Dua panel berubah susunan saat jendela melebar atau diputar.',
  'Daftar panjang tetap ringan saat digulir.',
  'Tidak ada konten tertutup status bar atau home indicator.',
];

const CONTOH_KODE = [
  "import { View, Text, Pressable } from 'react-native';",
  '',
  'export default function Halaman() {',
  '  return (',
  '    <View>',
  '      <Text>Judul Halaman</Text>',
  '      <Pressable onPress={() => {}}>',
  '        <Text>Tekan</Text>',
  '      </Pressable>',
  '    </View>',
  '  );',
  '}',
].join('\n');

export default function TentangScreen() {
  const namaPlatform = Platform.select({
    ios: 'iOS',
    android: 'Android',
    default: 'Web',
  });
  const paddingPlatform = Platform.select({ ios: 16, android: 12, default: 14 });

  return (
    <ScrollView
      style={styles.layar}
      contentContainerStyle={styles.isi}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <Text style={styles.judul}>Info aplikasi</Text>
        <Text style={styles.subJudul}>
          Ringkasan materi Bab 5 — Dasar React Native, dipakai di project ini.
        </Text>
      </View>

      <View style={styles.kartu}>
        <Text style={styles.judulKartu}>1 · React Web dan React Native</Text>
        <Text style={styles.paragraf}>
          Konsepnya sama — component, props, state, hooks. Yang berganti adalah mediumnya:
          JSX yang sama berakhir di DOM browser pada React Web, dan di komponen native pada
          React Native.
        </Text>

        <View style={styles.tabel}>
          <View style={[styles.barisTabel, styles.barisKepala]}>
            <Text style={[styles.selKepala, styles.kolomWeb]}>React Web</Text>
            <Text style={styles.selKepala}>React Native</Text>
          </View>
          {PADANAN.map((baris) => (
            <View key={baris.web} style={styles.barisTabel}>
              <Text style={[styles.sel, styles.kolomWeb]}>{baris.web}</Text>
              <View style={styles.selKanan}>
                <Text style={styles.selTebal}>{baris.native}</Text>
                <Text style={styles.selCatatan}>{baris.catatan}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.kotakKode}>
          <Text style={styles.kode}>{CONTOH_KODE}</Text>
        </View>

        <Text style={styles.catatanKartu}>
          Struktur JSX, logika, dan penamaan state bisa disalin apa adanya dari versi web.
          Yang berubah hanya import, nama komponen, dan cara menata gaya.
        </Text>
      </View>

      <View style={styles.kartu}>
        <Text style={styles.judulKartu}>2 · Platform yang sedang dipakai</Text>

        <View style={styles.barisPlatform}>
          <Text style={styles.labelPlatform}>Platform.OS</Text>
          <LabelStatus label={String(Platform.OS)} jenis="netral" />
        </View>

        <Text style={styles.paragraf}>
          Aplikasi ini berjalan di {namaPlatform}. Setiap platform diberi padding berbeda
          lewat Platform.select(); nilainya {paddingPlatform}. Ini pilihan yang lebih rapi
          daripada menulis Platform.OS === 'ios' ? ... : ... berulang kali.
        </Text>

        <View style={styles.daftarPoin}>
          {PERBEDAAN_PLATFORM.map((poin) => (
            <View key={poin} style={styles.barisPoin}>
              <Text style={styles.tandaPoin}>•</Text>
              <Text style={styles.teksPoin}>{poin}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.catatanKartu}>
          Urutan keputusannya: satu kode untuk dua platform dulu, Platform.OS kalau bedanya
          kecil, dan berkas .ios.js / .android.js hanya kalau perbedaannya satu komponen
          utuh.
        </Text>
      </View>

      <View style={styles.kartu}>
        <Text style={styles.judulKartu}>3 · Memilih komponen pengguliran</Text>

        {SCROLLER.map((baris) => (
          <View key={baris.kebutuhan} style={styles.barisScroller}>
            <Text style={styles.teksScroller}>{baris.kebutuhan}</Text>
            <Text style={styles.nilaiScroller}>{baris.komponen}</Text>
          </View>
        ))}

        <Text style={styles.catatanKartu}>
          Pilih berdasarkan struktur data dan jumlah item, bukan kebiasaan. FlatList tidak
          boleh dibungkus ScrollView searah — virtualisasinya rusak dan Metro menampilkan
          peringatan VirtualizedLists.
        </Text>
      </View>

      <View style={styles.kartu}>
        <Text style={styles.judulKartu}>4 · Yang harus teramati</Text>
        {DAFTAR_PERIKSA.map((butir) => (
          <View key={butir} style={styles.barisPoin}>
            <Text style={styles.tandaCentang}>✓</Text>
            <Text style={styles.teksPoin}>{butir}</Text>
          </View>
        ))}
      </View>

      <View style={styles.kartu}>
        <Text style={styles.judulKartu}>5 · Data contoh</Text>
        <Text style={styles.paragraf}>
          Delapan mahasiswa dan tujuh mata kuliah disimpan di data/mahasiswa.js. Semua angka
          di dashboard, predikat, dan sebaran program studi dihitung dari berkas itu — satu
          sumber kebenaran, tanpa state yang menduplikasi nilai.
        </Text>
      </View>

      <Text style={styles.versi}>
        Expo SDK 57 · React Native 0.86 · React 19.2 · Node.js ≥ 22
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: {
    flex: 1,
    backgroundColor: WARNA.latar,
  },
  isi: {
    padding: JARAK.lg,
    paddingBottom: JARAK.xxl,
    gap: JARAK.md,
  },
  judul: {
    fontSize: TEKS.judulLayar,
    fontWeight: '700',
    color: WARNA.tinta,
  },
  subJudul: {
    marginTop: 2,
    fontSize: TEKS.kecil,
    lineHeight: 18,
    color: WARNA.tintaRedup,
  },
  kartu: {
    gap: JARAK.sm,
    padding: JARAK.lg,
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: WARNA.garis,
  },
  judulKartu: {
    fontSize: TEKS.judul,
    fontWeight: '700',
    color: WARNA.tinta,
  },
  paragraf: {
    fontSize: TEKS.kecil,
    lineHeight: 19,
    color: WARNA.tinta,
  },
  tabel: {
    borderWidth: 1,
    borderColor: WARNA.garis,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  barisTabel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: JARAK.sm,
    borderTopWidth: 1,
    borderTopColor: WARNA.garis,
  },
  barisKepala: {
    backgroundColor: WARNA.permukaanRedup,
    borderTopWidth: 0,
  },
  selKepala: {
    flex: 1,
    fontSize: TEKS.mungil,
    fontWeight: '700',
    color: WARNA.tintaRedup,
  },
  kolomWeb: {
    flex: 0.8,
  },
  sel: {
    flex: 0.8,
    fontSize: TEKS.kecil,
    color: WARNA.tintaRedup,
  },
  selKanan: {
    flex: 1,
    gap: 1,
  },
  selTebal: {
    fontSize: TEKS.kecil,
    fontWeight: '700',
    color: WARNA.utama,
  },
  selCatatan: {
    fontSize: TEKS.mungil,
    color: WARNA.tintaRedup,
  },
  kotakKode: {
    padding: JARAK.md,
    backgroundColor: WARNA.tinta,
    borderRadius: RADIUS.md,
  },
  kode: {
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    fontSize: 11,
    lineHeight: 17,
    color: '#e2e8f0',
  },
  catatanKartu: {
    fontSize: TEKS.mungil,
    lineHeight: 17,
    color: WARNA.tintaRedup,
  },
  barisPlatform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: JARAK.sm,
  },
  labelPlatform: {
    fontSize: TEKS.kecil,
    color: WARNA.tintaRedup,
  },
  daftarPoin: {
    gap: 6,
  },
  barisPoin: {
    flexDirection: 'row',
    gap: JARAK.sm,
  },
  tandaPoin: {
    fontSize: TEKS.kecil,
    lineHeight: 19,
    color: WARNA.utama,
  },
  tandaCentang: {
    fontSize: TEKS.kecil,
    lineHeight: 19,
    fontWeight: '700',
    color: WARNA.sukses,
  },
  teksPoin: {
    flex: 1,
    fontSize: TEKS.kecil,
    lineHeight: 19,
    color: WARNA.tinta,
  },
  barisScroller: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: JARAK.sm,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: WARNA.garis,
  },
  teksScroller: {
    flex: 1,
    fontSize: TEKS.kecil,
    color: WARNA.tinta,
  },
  nilaiScroller: {
    fontSize: TEKS.mungil,
    fontWeight: '700',
    color: WARNA.utama,
  },
  versi: {
    textAlign: 'center',
    fontSize: TEKS.mungil,
    color: WARNA.tintaRedup,
  },
});
