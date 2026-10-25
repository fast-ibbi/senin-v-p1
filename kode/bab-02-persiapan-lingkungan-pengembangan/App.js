import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Layar pertama project siakad-mobile.
 *
 * Perhatikan tiga komponen inti yang dipakai: View sebagai kotak pembungkus,
 * Text sebagai tempat tulisan, dan StyleSheet sebagai tempat seluruh gaya
 * dikumpulkan. Ketiganya dibahas mendalam di bab 5.
 */
export default function App() {
  return (
    <View style={styles.kontainer}>
      <Text style={styles.judul}>Halo, Dunia!</Text>
      <Text style={styles.keterangan}>
        Project Expo pertama saya berhasil berjalan di perangkat.
      </Text>
      <Text style={styles.catatan}>siakad-mobile · Sistem Informasi Akademik</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  kontainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  judul: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 8,
  },
  keterangan: {
    fontSize: 15,
    lineHeight: 22,
    color: '#cbd5f5',
    textAlign: 'center',
  },
  catatan: {
    marginTop: 24,
    fontSize: 12,
    letterSpacing: 0.5,
    color: '#64748b',
  },
});
