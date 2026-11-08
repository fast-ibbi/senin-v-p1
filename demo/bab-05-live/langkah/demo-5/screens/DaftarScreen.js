// screens/DaftarScreen.js
import { useEffect, useState } from 'react';
import {
  View, Text, Pressable, ScrollView, FlatList, Platform,
} from 'react-native';
import KartuMenu from '../components/KartuMenu';
import { menuPanjang } from '../data/menu';

let jumlahRenderItem = 0;

function Baris({ item }) {
  jumlahRenderItem += 1;
  return <KartuMenu {...item} />;
}

export default function DaftarScreen() {
  const [mode, setMode] = useState('scroll');

  function gantiMode() {
    jumlahRenderItem = 0;
    setMode(mode === 'scroll' ? 'flat' : 'scroll');
  }

  useEffect(() => {
    const id = setTimeout(() => {
      console.log(`[${mode}] item dirender: ${jumlahRenderItem}`);
    }, 100);
    return () => clearTimeout(id);
  }, [mode]);

  return (
    <View style={{ flex: 1 }}>
      <Text>{`Platform: ${Platform.OS}`}</Text>
      <Pressable onPress={gantiMode}>
        <Text>{`Mode: ${mode} — tekan untuk berganti`}</Text>
      </Pressable>

      {mode === 'scroll' ? (
        <ScrollView>
          {menuPanjang.map((item) => <Baris key={item.id} item={item} />)}
        </ScrollView>
      ) : (
        <FlatList
          data={menuPanjang}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Baris item={item} />}
        />
      )}
    </View>
  );
}
