import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { daftarMahasiswa } from './data/daftarMahasiswa.js';
import { DetailMahasiswa } from './screens/DetailMahasiswa.js';
import { DaftarMahasiswa } from './screens/DaftarMahasiswa.js';
import { warna } from './tema/desain.js';

/**
 * Bab 6 — merangkai satu layar aplikasi dari komponen yang konsisten.
 *
 * Perpindahan daftar → detail masih dilakukan dengan state (`nimTerpilih`),
 * persis pola bab 4. Bab 7 menggantinya dengan expo-router, dan kamu akan melihat
 * bahwa layar-layarnya sendiri hampir tidak berubah — hanya cara berpindahnya.
 */
export default function App() {
  const [nimTerpilih, setNimTerpilih] = useState(null);

  const terpilih = daftarMahasiswa.find((mhs) => mhs.nim === nimTerpilih) ?? null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.aman} edges={['top', 'left', 'right']}>
        <View style={styles.layar}>
          {terpilih === null ? (
            <DaftarMahasiswa
              daftar={daftarMahasiswa}
              onPilih={(mhs) => setNimTerpilih(mhs.nim)}
            />
          ) : (
            <DetailMahasiswa mhs={terpilih} onKembali={() => setNimTerpilih(null)} />
          )}
        </View>
      </SafeAreaView>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  aman: { flex: 1, backgroundColor: warna.latar },
  layar: { flex: 1 },
});
