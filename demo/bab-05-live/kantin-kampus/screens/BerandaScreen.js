// screens/BerandaScreen.js — Demo 4: satu layar, dua susunan
import { useRef } from 'react';
import { View, Text, useWindowDimensions, StyleSheet } from 'react-native';
import { warna, jarak, radius, huruf, breakpoint } from '../theme/warna';

export default function BerandaScreen() {
  const { width } = useWindowDimensions();
  const layarLebar = width >= breakpoint.lebar;

  const jumlahRender = useRef(0);
  jumlahRender.current += 1;

  return (
    <View style={[gaya.halaman, { flexDirection: layarLebar ? 'row' : 'column' }]}>
      <Text style={gaya.catatan}>
        {`lebar ${Math.round(width)} · render ke-${jumlahRender.current}`}
      </Text>
      <View style={gaya.panel}>
        <Text style={gaya.judul}>Menu hari ini</Text>
        <Text style={gaya.isi}>8 pilihan, 2 habis</Text>
      </View>
      <View style={gaya.panel}>
        <Text style={gaya.judul}>Pesanan</Text>
        <Text style={gaya.isi}>3 menunggu diambil</Text>
      </View>
    </View>
  );
}

const gaya = StyleSheet.create({
  halaman: { flex: 1, flexWrap: 'wrap', gap: jarak.sedang, padding: jarak.sedang },
  catatan: { width: '100%', fontSize: huruf.kecil, color: warna.teksRedup },
  panel: {
    flex: 1,
    minWidth: 240,
    padding: jarak.sedang,
    backgroundColor: warna.permukaan,
    borderRadius: radius.sedang,
    borderWidth: 1,
    borderColor: warna.garis,
    gap: 4,
  },
  judul: { fontSize: huruf.judul, fontWeight: '600' },
  isi: { fontSize: huruf.isi, color: warna.teksRedup },
});
