// App.js — Demo 6: satu layar, satu scroller
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import KatalogScreen from './screens/KatalogScreen';
import { warna } from './theme/warna';

export default function App() {
  return (
    <SafeAreaView style={gaya.akar}>
      <KatalogScreen />
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const gaya = StyleSheet.create({
  akar: { flex: 1, backgroundColor: warna.latar },
});
