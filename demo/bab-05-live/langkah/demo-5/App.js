// App.js — Demo 5: import ditukar ke layar daftar
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import DaftarScreen from './screens/DaftarScreen';
import { warna } from './theme/warna';

export default function App() {
  return (
    <SafeAreaView style={gaya.akar}>
      <DaftarScreen />
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const gaya = StyleSheet.create({
  akar: { flex: 1, backgroundColor: warna.latar },
});
