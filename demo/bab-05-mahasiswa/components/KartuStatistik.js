import { StyleSheet, Text, View } from 'react-native';

import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

// Kartu angka ringkasan di dashboard.
//
// Rujukan slide Bab 5, subbab 4.5: kartu ini memakai `flex: 1`, jadi tiga kartu
// dalam satu baris membagi lebar yang tersedia rata — tanpa satu pun angka lebar
// tetap. `minWidth` mencegah kartu menjadi terlalu sempit di layar kecil.
export default function KartuStatistik({ angka, label, aksen = WARNA.utama }) {
  return (
    <View style={styles.kartu}>
      <Text style={[styles.angka, { color: aksen }]} numberOfLines={1}>
        {angka}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: {
    flex: 1,
    minWidth: 96,
    padding: JARAK.md,
    gap: 2,
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: WARNA.garis,
  },
  angka: {
    fontSize: 20,
    fontWeight: '700',
  },
  label: {
    fontSize: TEKS.mungil,
    color: WARNA.tintaRedup,
  },
});
