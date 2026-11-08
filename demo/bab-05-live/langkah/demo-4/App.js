// App.js — Demo 4: satu import ditukar, layar beranda yang tampil
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import BerandaScreen from './screens/BerandaScreen';
import { warna } from './theme/warna';

export default function App() {
  return (
    <SafeAreaView style={gaya.akar}>
      <BerandaScreen />
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const gaya = StyleSheet.create({
  akar: { flex: 1, backgroundColor: warna.latar },
});
