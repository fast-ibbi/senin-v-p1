import { useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { StatusBar as StatusBarExpo } from 'expo-status-bar';

import TabBar from './components/TabBar';
import BerandaScreen from './screens/BerandaScreen';
import DetailMahasiswaScreen from './screens/DetailMahasiswaScreen';
import KatalogScreen from './screens/KatalogScreen';
import MahasiswaScreen from './screens/MahasiswaScreen';
import TentangScreen from './screens/TentangScreen';
import { WARNA } from './theme/warna';

// SIAKAD Mobile — project contoh Bab 5: Dasar React Native.
//
// Navigasi di sini sengaja hanya memakai dua state: tab aktif dan id mahasiswa
// yang dibuka. Pustaka navigasi baru dibahas di Bab 7, jadi struktur layar dibuat
// sesederhana mungkin supaya perhatian tetap pada komponen, gaya, layout, dan
// scroller.
//
// Rujukan slide Bab 5, subbab 5.3: SafeAreaView bawaan React Native hanya
// melindungi iOS. Di Android, isi layar digambar sampai tepi, jadi padding atas
// ditambahkan dari StatusBar.currentHeight. Alternatif modernnya
// (react-native-safe-area-context) dibahas pada praktikum dan Bab 8.

const LAYAR = {
  beranda: BerandaScreen,
  mahasiswa: MahasiswaScreen,
  katalog: KatalogScreen,
  tentang: TentangScreen,
};

export default function App() {
  const [tabAktif, setTabAktif] = useState('beranda');
  const [idDetail, setIdDetail] = useState(null);

  const sedangMelihatDetail = idDetail !== null;
  const Layar = LAYAR[tabAktif];

  return (
    <SafeAreaView
      style={[styles.akar, Platform.OS === 'android' && styles.akarAndroid]}
    >
      <View style={styles.wadah}>
        {sedangMelihatDetail ? (
          <DetailMahasiswaScreen
            mahasiswaId={idDetail}
            onKembali={() => setIdDetail(null)}
          />
        ) : (
          <Layar
            onBukaMahasiswa={() => setTabAktif('mahasiswa')}
            onBukaKatalog={() => setTabAktif('katalog')}
            onBukaDetail={setIdDetail}
          />
        )}
      </View>

      {/* Bilah tab disembunyikan saat detail terbuka, supaya layar detail
          memakai seluruh tinggi yang tersedia. */}
      {!sedangMelihatDetail && <TabBar aktif={tabAktif} onPilih={setTabAktif} />}

      <StatusBarExpo style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  akar: {
    flex: 1,
    backgroundColor: WARNA.latar,
  },
  akarAndroid: {
    // Android menggambar konten sampai tepi layar; status bar perlu diberi ruang.
    paddingTop: StatusBar.currentHeight ?? 0,
  },
  wadah: {
    flex: 1,
  },
});
