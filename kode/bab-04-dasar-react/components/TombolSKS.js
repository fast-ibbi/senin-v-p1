import { Pressable, StyleSheet, Text, View } from 'react-native';

/**
 * Penghitung SKS.
 *
 * Komponen ini **menerima** nilai dan **melaporkan** niat perubahan lewat
 * `onPress`; ia tidak menyimpan state sendiri. Pola ini disebut controlled
 * component dan dipakai lagi di bab 8 untuk semua input form.
 *
 * `onKurang` dan `onTambah` adalah props berisi fungsi — di React, fungsi
 * memang dikirim seperti data biasa.
 */
export function TombolSKS({ nilai = 0, onKurang, onTambah, batasBawah = 0, batasAtas = 24 }) {
  const bisaKurang = nilai > batasBawah;
  const bisaTambah = nilai < batasAtas;

  return (
    <View style={styles.baris}>
      <Tombol label="−" onPress={onKurang} nonaktif={!bisaKurang} />
      <View style={styles.nilai}>
        <Text style={styles.angka}>{nilai}</Text>
        <Text style={styles.satuan}>SKS</Text>
      </View>
      <Tombol label="+" onPress={onTambah} nonaktif={!bisaTambah} />
    </View>
  );
}

function Tombol({ label, onPress, nonaktif }) {
  return (
    <Pressable
      onPress={nonaktif ? undefined : onPress}
      style={({ pressed }) => [
        styles.tombol,
        nonaktif && styles.tombolNonaktif,
        pressed && !nonaktif && styles.tombolDitekan,
      ]}
    >
      <Text style={[styles.label, nonaktif && styles.labelNonaktif]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  baris: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tombol: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tombolDitekan: { backgroundColor: '#0284c7' },
  tombolNonaktif: { backgroundColor: '#334155' },
  label: { color: '#f8fafc', fontSize: 20, lineHeight: 24 },
  labelNonaktif: { color: '#64748b' },
  nilai: { alignItems: 'center', minWidth: 56 },
  angka: { color: '#f8fafc', fontSize: 22, fontWeight: '700' },
  satuan: { color: '#64748b', fontSize: 11 },
});
