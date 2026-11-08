// components/KartuMenu.js — Demo 2: struktur dulu, gaya menyusul di Demo 3
import { View, Text, Image } from 'react-native';

const gambarContoh = require('../assets/icon.png');

export default function KartuMenu({ nama, kategori, harga, stok }) {
  return (
    <View style={{ flexDirection: 'row', gap: 12, padding: 12 }}>
      <Image source={gambarContoh} style={{ width: 56, height: 56 }} />
      <View style={{ flex: 1 }}>
        <Text>{nama}</Text>
        <Text>{kategori}</Text>
        <Text>{`Rp${harga.toLocaleString('id-ID')}`}</Text>
        <Text>{`Stok: ${stok}`}</Text>
      </View>
    </View>
  );
}
