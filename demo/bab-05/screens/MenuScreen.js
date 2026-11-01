import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

// Menu demo. Daftar bagian di sini sengaja dirender dengan FlatList, bukan
// komponen lain: menu ini sekaligus contoh `data` + `renderItem` + `keyExtractor`
// yang dibahas di Bagian 5.
export const BAGIAN_DEMO = [
  {
    id: 'padanan',
    nomor: '1',
    judul: 'React Web vs React Native',
    ringkas: 'Tabel 5.1 sebagai bukti: tiap elemen web di sebelah komponen native yang benar-benar dirender.',
    rujukan: 'Bagian 1 · subbab 1.1–1.4',
  },
  {
    id: 'komponen',
    nomor: '2',
    judul: 'Komponen inti',
    ringkas: 'View, Text, Image, TextInput, Button, dan Pressable dalam satu halaman berlabel.',
    rujukan: 'Bagian 2 · subbab 2.1–2.6',
  },
  {
    id: 'gaya',
    nomor: '3',
    judul: 'StyleSheet dan gaya kondisional',
    ringkas: 'Satu tombol, satu state, tiga wajah — urutan array menentukan pemenangnya.',
    rujukan: 'Bagian 3 · subbab 3.1–3.4',
  },
  {
    id: 'responsif',
    nomor: '4',
    judul: 'Layout responsif',
    ringkas: 'Dua panel yang berpindah dari column ke row saat lebar jendela melewati 600.',
    rujukan: 'Bagian 4 · subbab 4.7–4.10',
  },
  {
    id: 'scroller',
    nomor: '5',
    judul: 'ScrollView dan FlatList',
    ringkas: 'Dua scroller, satu daftar panjang, dan angka item yang benar-benar dirender.',
    rujukan: 'Bagian 5 · subbab 5.1–5.3',
  },
  {
    id: 'katalog',
    nomor: '6',
    judul: 'Katalog produk responsif',
    ringkas: 'Semua isi bab bertemu: komponen inti, gaya kondisional, grid 2/3 kolom, dan pencarian.',
    rujukan: 'Praktikum Integrasi · penutup bab',
  },
];

export default function MenuScreen({ onPilih }) {
  return (
    <FlatList
      style={styles.akar}
      contentContainerStyle={styles.isi}
      data={BAGIAN_DEMO}
      keyExtractor={(bagian) => bagian.id}
      ItemSeparatorComponent={() => <View style={styles.pemisah} />}
      ListHeaderComponent={
        <View style={styles.kepala}>
          <Text style={styles.label}>DEMO KELAS · BAB 5</Text>
          <Text style={styles.judul}>Dasar React Native</Text>
          <Text style={styles.catatan}>
            Enam berhenti mengikuti urutan slide. Menu ini sendiri dirender dengan FlatList —
            perhatikan bahwa daftar tidak butuh pustaka navigasi.
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onPilih(item.id)}
          accessibilityRole="button"
          accessibilityLabel={'Buka bagian ' + item.nomor + ': ' + item.judul}
          style={({ pressed }) => [styles.baris, pressed && styles.barisTertekan]}
        >
          <View style={styles.nomor}>
            <Text style={styles.teksNomor}>{item.nomor}</Text>
          </View>

          <View style={styles.keterangan}>
            <Text style={styles.judulBaris}>{item.judul}</Text>
            <Text style={styles.ringkas}>{item.ringkas}</Text>
            <Text style={styles.rujukan}>{item.rujukan}</Text>
          </View>

          <Text style={styles.panah}>›</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  akar: {
    flex: 1,
    backgroundColor: WARNA.latar,
  },
  isi: {
    padding: JARAK.lg,
    gap: JARAK.md,
  },
  kepala: {
    gap: JARAK.xs,
    marginBottom: JARAK.sm,
  },
  label: {
    fontSize: TEKS.mungil,
    fontWeight: '700',
    letterSpacing: 1,
    color: WARNA.utama,
  },
  judul: {
    fontSize: TEKS.judulLayar + 6,
    fontWeight: '800',
    color: WARNA.tinta,
  },
  catatan: {
    fontSize: TEKS.isi,
    lineHeight: 20,
    color: WARNA.tintaRedup,
  },
  pemisah: {
    height: JARAK.md,
  },
  baris: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: JARAK.md,
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: WARNA.garis,
    padding: JARAK.md,
  },
  barisTertekan: {
    opacity: 0.75,
  },
  nomor: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.bulat,
    backgroundColor: WARNA.utamaMuda,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teksNomor: {
    fontSize: TEKS.isi,
    fontWeight: '800',
    color: WARNA.utama,
  },
  keterangan: {
    flex: 1,
    gap: 2,
  },
  judulBaris: {
    fontSize: TEKS.judul,
    fontWeight: '700',
    color: WARNA.tinta,
  },
  ringkas: {
    fontSize: TEKS.kecil,
    lineHeight: 17,
    color: WARNA.tintaRedup,
  },
  rujukan: {
    fontSize: TEKS.mungil,
    color: WARNA.utama,
    marginTop: 2,
  },
  panah: {
    fontSize: 24,
    color: WARNA.tintaRedup,
  },
});
