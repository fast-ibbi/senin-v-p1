// App.js
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={gaya.halaman}>
      <Text>Kantin Kampus</Text>
    </View>
  );
}

const gaya = StyleSheet.create({
  halaman: { flex: 1, padding: 24, justifyContent: 'center' },
});
