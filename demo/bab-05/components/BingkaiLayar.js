import { Pressable, StyleSheet, Text, View } from 'react-native';

import KartuCatatan from './KartuCatatan';
import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

// Kerangka seragam untuk keenam layar demo:
//
//   KartuCatatan   (selalu tampil, tidak ikut tergulir)
//   isi layar      (flex: 1 — boleh berupa ScrollView atau FlatList sendiri)
//   tombol kembali (selalu tampil di bawah)
//
// Karena isi layar mendapat flex: 1 dan kartu catatan berada di luar area gulir,
// tidak ada scroller yang bersarang tanpa sengaja — kesalahan yang justru dinilai
// di Praktikum Soal 6.
export default function BingkaiLayar({ judul, rujukan, poin, onKembali, children }) {
  return (
    <View style={styles.akar}>
      <KartuCatatan judul={judul} rujukan={rujukan} poin={poin} />

      <View style={styles.isi}>{children}</View>

      <View style={styles.kaki}>
        <Pressable
          onPress={onKembali}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke menu demo"
          style={({ pressed }) => [styles.tombolKembali, pressed && styles.tombolTertekan]}
        >
          <Text style={styles.labelKembali}>‹ Kembali ke menu</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  akar: {
    flex: 1,
    backgroundColor: WARNA.latar,
  },
  isi: {
    flex: 1,
  },
  kaki: {
    paddingHorizontal: JARAK.lg,
    paddingVertical: JARAK.sm,
    borderTopWidth: 1,
    borderTopColor: WARNA.garis,
    backgroundColor: WARNA.permukaan,
  },
  tombolKembali: {
    alignSelf: 'flex-start',
    paddingVertical: JARAK.sm,
    paddingHorizontal: JARAK.md,
    borderRadius: RADIUS.bulat,
    backgroundColor: WARNA.latar,
  },
  tombolTertekan: {
    opacity: 0.6,
  },
  labelKembali: {
    fontSize: TEKS.isi,
    fontWeight: '600',
    color: WARNA.utama,
  },
});
