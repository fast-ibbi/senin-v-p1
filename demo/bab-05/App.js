import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';

import GayaScreen from './screens/GayaScreen';
import KatalogScreen from './screens/KatalogScreen';
import KomponenScreen from './screens/KomponenScreen';
import MenuScreen from './screens/MenuScreen';
import PadananScreen from './screens/PadananScreen';
import ResponsifScreen from './screens/ResponsifScreen';
import ScrollerScreen from './screens/ScrollerScreen';
import { WARNA } from './theme/warna';

// Titik masuk demo kelas Bab 5.
//
// Navigasi antar layar hanya memakai satu state (`layarAktif`) — sengaja tanpa
// pustaka navigasi, karena navigasi baru dibahas di Bab 7. Menu sendiri dirender
// dengan FlatList, jadi daftar bagian demo sekaligus contoh komponen daftar.
const LAYAR = {
  padanan: PadananScreen,
  komponen: KomponenScreen,
  gaya: GayaScreen,
  responsif: ResponsifScreen,
  scroller: ScrollerScreen,
  katalog: KatalogScreen,
};

export default function App() {
  const [layarAktif, setLayarAktif] = useState(null);

  const kembaliKeMenu = () => setLayarAktif(null);
  const LayarAktif = layarAktif ? LAYAR[layarAktif] : null;

  return (
    <SafeAreaView style={styles.akar}>
      {LayarAktif ? (
        <LayarAktif onKembali={kembaliKeMenu} />
      ) : (
        <MenuScreen onPilih={setLayarAktif} />
      )}
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  akar: {
    flex: 1,
    backgroundColor: WARNA.latar,
  },
});
