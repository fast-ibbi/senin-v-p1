import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import BingkaiLayar from '../components/BingkaiLayar';
import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

// Layar 1 — Bagian 1.
//
// Tabel 5.1 di slide menyatakan padanan elemen web ke komponen React Native.
// Di sini tabel itu dibuktikan: kolom kanan bukan tulisan, melainkan komponen
// yang benar-benar dirender di perangkat.
export default function PadananScreen({ onKembali }) {
  return (
    <BingkaiLayar
      judul="Padanan elemen web dan komponen native"
      rujukan="Bagian 1 · subbab 1.2 — Tabel 5.1"
      poin={[
        'Kolom kanan adalah komponen yang benar-benar dirender, bukan nama yang ditulis di slide.',
        'Padanannya tidak selalu satu-satu: satu div di web bisa menjadi dua View.',
        'Tidak ada CSS di sini — semua gaya berasal dari StyleSheet.',
      ]}
      onKembali={onKembali}
    >
      <ScrollView contentContainerStyle={styles.isi}>
        <BarisPadanan kode="div" keterangan="View — container untuk mengelompokkan dan menyusun layout">
          <View style={styles.contohView}>
            <Text style={styles.labelDiDalam}>View</Text>
          </View>
        </BarisPadanan>

        <BarisPadanan kode="p" keterangan="Text — semua huruf di aplikasi harus berada di dalam Text">
          <Text style={styles.contohTeks}>Text</Text>
        </BarisPadanan>

        <BarisPadanan kode="img" keterangan="Image — wajib diberi lebar dan tinggi eksplisit">
          <Image
            source={require('../assets/produk/laptop.png')}
            style={styles.contohGambar}
            resizeMode="cover"
            accessibilityLabel="Contoh komponen Image"
          />
        </BarisPadanan>

        <BarisPadanan kode="button" keterangan="Pressable — bebas ditata, umpan balik bisa diatur sendiri">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Contoh komponen Pressable"
            style={({ pressed }) => [styles.contohPressable, pressed && styles.contohPressableTertekan]}
          >
            <Text style={styles.labelPressable}>Pressable</Text>
          </Pressable>
        </BarisPadanan>

        <BarisPadanan kode="CSS" keterangan="StyleSheet — nama properti camelCase, ditulis sebagai objek">
          <View style={styles.contohStyleSheet}>
            <Text style={styles.labelStyleSheet}>StyleSheet</Text>
          </View>
        </BarisPadanan>

        <View style={styles.catatanKaki}>
          <Text style={styles.teksKaki}>
            Yang tetap sama dengan React web: struktur JSX, props, state, dan hooks. Yang
            berganti hanya elemen yang dirender dan cara menata gayanya.
          </Text>
        </View>
      </ScrollView>
    </BingkaiLayar>
  );
}

function BarisPadanan({ kode, keterangan, children }) {
  return (
    <View style={styles.baris}>
      <View style={styles.sisiKode}>
        <Text style={styles.kode}>{kode}</Text>
      </View>

      <Text style={styles.panah}>→</Text>

      <View style={styles.sisiNative}>{children}</View>

      <Text style={styles.keterangan}>{keterangan}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  isi: {
    padding: JARAK.lg,
    gap: JARAK.md,
  },
  baris: {
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: WARNA.garis,
    padding: JARAK.md,
    gap: JARAK.sm,
  },
  sisiKode: {
    alignSelf: 'flex-start',
    backgroundColor: '#1e293b',
    borderRadius: RADIUS.sm,
    paddingVertical: 3,
    paddingHorizontal: JARAK.sm,
  },
  kode: {
    fontSize: TEKS.kecil,
    fontWeight: '700',
    color: '#e2e8f0',
    fontFamily: 'Courier',
  },
  panah: {
    fontSize: TEKS.isi,
    color: WARNA.tintaRedup,
  },
  sisiNative: {
    alignItems: 'flex-start',
  },
  keterangan: {
    fontSize: TEKS.kecil,
    lineHeight: 17,
    color: WARNA.tintaRedup,
  },
  contohView: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: WARNA.utama,
    borderRadius: RADIUS.sm,
    paddingVertical: JARAK.sm,
    paddingHorizontal: JARAK.md,
    backgroundColor: WARNA.utamaMuda,
  },
  labelDiDalam: {
    fontSize: TEKS.kecil,
    color: WARNA.utama,
  },
  contohTeks: {
    fontSize: TEKS.judul,
    fontWeight: '600',
    color: WARNA.tinta,
  },
  contohGambar: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.sm,
  },
  contohPressable: {
    backgroundColor: WARNA.utama,
    borderRadius: RADIUS.bulat,
    paddingVertical: JARAK.sm,
    paddingHorizontal: JARAK.lg,
  },
  contohPressableTertekan: {
    opacity: 0.7,
  },
  labelPressable: {
    fontSize: TEKS.isi,
    fontWeight: '700',
    color: '#ffffff',
  },
  contohStyleSheet: {
    backgroundColor: WARNA.suksesMuda,
    borderWidth: 1,
    borderColor: WARNA.sukses,
    borderRadius: RADIUS.bulat,
    paddingVertical: JARAK.xs,
    paddingHorizontal: JARAK.md,
  },
  labelStyleSheet: {
    fontSize: TEKS.kecil,
    fontWeight: '700',
    color: WARNA.sukses,
  },
  catatanKaki: {
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.md,
    borderLeftWidth: 4,
    borderLeftColor: WARNA.sukses,
    padding: JARAK.md,
  },
  teksKaki: {
    fontSize: TEKS.kecil,
    lineHeight: 18,
    color: WARNA.tinta,
  },
});
