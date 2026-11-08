// screens/KatalogScreen.js
import { useState } from 'react';
import {
  View, Text, TextInput, FlatList, useWindowDimensions, StyleSheet,
} from 'react-native';
import KartuMenu from '../components/KartuMenu';
import { menu } from '../data/menu';
import { warna, jarak, breakpoint } from '../theme/warna';

export default function KatalogScreen() {
  const [kataKunci, setKataKunci] = useState('');
  const { width } = useWindowDimensions();

  const jumlahKolom = width >= breakpoint.lebar ? 3 : 2;
  const data = menu.filter((item) =>
    item.nama.toLowerCase().includes(kataKunci.toLowerCase())
  );

  return (
    <FlatList
      key={String(jumlahKolom)}
      data={data}
      numColumns={jumlahKolom}
      keyExtractor={(item) => item.id}
      columnWrapperStyle={{ gap: jarak.sedang }}
      contentContainerStyle={gaya.isi}
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => <View style={gaya.sel}><KartuMenu {...item} /></View>}
      ListHeaderComponent={
        <TextInput
          value={kataKunci}
          onChangeText={setKataKunci}
          placeholder="Cari menu kantin"
          style={gaya.pencarian}
        />
      }
      ListEmptyComponent={
        <Text style={gaya.kosong}>{`Tidak ada menu yang cocok dengan "${kataKunci}"`}</Text>
      }
    />
  );
}

const gaya = StyleSheet.create({
  isi: { padding: jarak.sedang, gap: jarak.sedang },
  sel: { flex: 1 },
  pencarian: {
    borderWidth: 1,
    borderColor: warna.garis,
    borderRadius: 12,
    padding: 12,
    marginBottom: jarak.sedang,
    backgroundColor: warna.permukaan,
  },
  kosong: { textAlign: 'center', padding: jarak.besar, color: warna.teksRedup },
});
