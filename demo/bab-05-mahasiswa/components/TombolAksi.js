import { Pressable, StyleSheet, Text } from 'react-native';

import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

// Tombol aplikasi.
//
// Rujukan slide Bab 5, subbab 2.5–2.6:
//   • `Pressable`, bukan `Button`, karena tampilannya perlu ditata bebas.
//   • `pressed` pada `style` berupa fungsi: bernilai true saat jari menekan, dan
//     `styles.tertekan` diletakkan paling akhir supaya menimpa gaya dasar
//     (subbab 3.2 — yang belakangan menang).
//   • `hitSlop` memperluas area sentuh tanpa mengubah tampilan visual.
//   • `android_ripple` hanya berefek di Android; di iOS diabaikan.
//
// `jenis`: 'utama' | 'kedua' | 'hantu'
export default function TombolAksi({ label, onPress, jenis = 'utama' }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      android_ripple={{ color: WARNA.utamaMuda }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.dasar,
        GAYA_LATAR[jenis],
        pressed && styles.tertekan,
      ]}
    >
      <Text style={[styles.teks, GAYA_TEKS[jenis]]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dasar: {
    paddingVertical: 10,
    paddingHorizontal: JARAK.lg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  tertekan: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
  teks: {
    fontSize: TEKS.isi,
    fontWeight: '700',
  },
});

const GAYA_LATAR = StyleSheet.create({
  utama: { backgroundColor: WARNA.utama },
  kedua: { backgroundColor: WARNA.permukaan, borderColor: WARNA.garis },
  hantu: { backgroundColor: 'transparent', paddingHorizontal: JARAK.sm },
});

const GAYA_TEKS = StyleSheet.create({
  utama: { color: '#ffffff' },
  kedua: { color: WARNA.tinta },
  hantu: { color: WARNA.utama },
});
