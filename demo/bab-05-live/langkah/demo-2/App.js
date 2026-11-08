// App.js — dua kartu berbeda isi, satu komponen
import { useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import KartuMenu from './components/KartuMenu';
import { menu } from './data/menu';

export default function App() {
  const [kataKunci, setKataKunci] = useState('');

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <TextInput
        value={kataKunci}
        onChangeText={setKataKunci}
        placeholder="Cari menu"
      />
      <Text>{`Nilai terbaca: ${kataKunci}`}</Text>
      <KartuMenu {...menu[0]} />
      <KartuMenu {...menu[2]} />
    </ScrollView>
  );
}
