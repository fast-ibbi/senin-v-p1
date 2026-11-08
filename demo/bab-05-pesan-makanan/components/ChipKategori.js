// components/ChipKategori.js — Pressable yang berubah wajah, bukan Button.
//
// Bab 5 subbab 2.5: `Button` memakai gaya platform dan tidak bisa ditata bebas.
// Chip butuh bentuk sendiri, jadi yang dipakai `Pressable`.
// Bab 5 subbab 3.4: keadaan aktif ditulis sebagai array style bersyarat.
import { Pressable, StyleSheet, Text } from 'react-native';
import { huruf, jarak, radius, warna } from '../theme/warna';

export default function ChipKategori({ label, aktif, padaTekan }) {
  return (
    <Pressable
      onPress={padaTekan}
      accessibilityRole="button"
      accessibilityState={{ selected: aktif }}
      accessibilityLabel={`Kategori ${label}`}
      style={[gaya.chip, aktif && gaya.chipAktif]}
    >
      <Text style={[gaya.teks, aktif && gaya.teksAktif]}>{label}</Text>
    </Pressable>
  );
}

const gaya = StyleSheet.create({
  chip: {
    paddingHorizontal: jarak.sedang,
    paddingVertical: 6,
    borderRadius: radius.besar,
    borderWidth: 1,
    borderColor: warna.garis,
    backgroundColor: warna.permukaan,
  },
  // Yang ditulis belakangan menimpa yang lebih dulu: warna & garis chip aktif
  // mengalahkan gaya dasar di atas.
  chipAktif: { backgroundColor: warna.utama, borderColor: warna.utama },
  teks: { fontSize: huruf.kecil, color: warna.teksRedup, fontWeight: '600' },
  teksAktif: { color: '#ffffff' },
});
