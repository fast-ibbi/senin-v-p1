import { StyleSheet, Text, View } from 'react-native';

import { TEKS, WARNA } from '../theme/warna';

// Satu baris "label — nilai" untuk kartu profil.
//
// Rujukan slide Bab 5, subbab 4.3–4.4: `justifyContent: 'space-between'`
// mendorong label ke kiri dan nilai ke kanan pada sumbu utama (row). Tidak ada
// lebar tetap sama sekali, jadi baris ini tetap rapi di HP maupun tablet
// (subbab 4.7).
export default function BarisInfo({ label, nilai }) {
  return (
    <View style={styles.baris}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.nilai} numberOfLines={1}>
        {nilai}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  baris: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 7,
  },
  label: {
    fontSize: TEKS.kecil,
    color: WARNA.tintaRedup,
  },
  nilai: {
    flexShrink: 1,
    fontSize: TEKS.isi,
    fontWeight: '600',
    color: WARNA.tinta,
    textAlign: 'right',
  },
});
