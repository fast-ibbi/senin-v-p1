import { Pressable, StyleSheet, TextInput, Text, View } from 'react-native';

import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

// Kotak pencarian.
//
// Rujukan slide Bab 5, subbab 2.7: `TextInput` sebagai *controlled component* —
// nilainya dipegang state induk (`nilai`), dan setiap ketukan dilaporkan lewat
// `onChangeText`. Tanpa `onChangeText`, kotak akan tampak terkunci karena nilainya
// selalu dikembalikan ke `nilai` yang tidak berubah.
//
// Teks tombol hapus memakai `Text`, bukan karakter di dalam `View` (subbab 2.2).
export default function KotakPencarian({ nilai, onUbah, placeholder }) {
  return (
    <View style={styles.kotak}>
      <Text style={styles.ikon}>⌕</Text>
      <TextInput
        style={styles.input}
        value={nilai}
        onChangeText={onUbah}
        placeholder={placeholder}
        placeholderTextColor={WARNA.tintaRedup}
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel="Kolom pencarian mahasiswa"
      />
      {nilai.length > 0 && (
        <Pressable
          onPress={() => onUbah('')}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Hapus pencarian"
          style={({ pressed }) => [styles.hapus, pressed && styles.hapusDitekan]}
        >
          <Text style={styles.hapusTeks}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  kotak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: JARAK.sm,
    paddingHorizontal: JARAK.md,
    backgroundColor: WARNA.permukaan,
    borderWidth: 1,
    borderColor: WARNA.garis,
    borderRadius: RADIUS.md,
  },
  ikon: {
    fontSize: 18,
    color: WARNA.tintaRedup,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: TEKS.isi,
    color: WARNA.tinta,
  },
  hapus: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.bulat,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hapusDitekan: {
    backgroundColor: WARNA.permukaanRedup,
  },
  hapusTeks: {
    fontSize: 13,
    color: WARNA.tintaRedup,
  },
});
