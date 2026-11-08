// Versi web — dibaca saja, tidak dijalankan di Expo
// <div> <h1>Kantin Kampus</h1> <p>Menu hari ini: 8 pilihan</p> <button>Pesan</button> </div>

import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={gaya.halaman}>
      <Text style={gaya.judul}>Kantin Kampus</Text>
      <Text style={gaya.deskripsi}>Menu hari ini: 8 pilihan</Text>
      <Pressable style={gaya.tombol} onPress={() => console.log('Pesan ditekan')}>
        <Text style={gaya.label}>Pesan</Text>
      </Pressable>
    </View>
  );
}

const gaya = StyleSheet.create({
  halaman: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  judul: { fontSize: 28, fontWeight: 'bold' },
  deskripsi: { fontSize: 14, color: '#5b6169' },
  tombol: { backgroundColor: '#0f766e', paddingVertical: 12, borderRadius: 12 },
  label: { color: '#ffffff', textAlign: 'center', fontWeight: '600' },
});
