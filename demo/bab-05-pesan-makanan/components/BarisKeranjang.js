// components/BarisKeranjang.js — satu baris di dalam keranjang.
//
// Bab 5 subbab 2.5–2.6: dua `Pressable` kecil (− dan +) yang ditata bebas,
// sesuatu yang tidak bisa dilakukan `Button`.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { huruf, jarak, radius, warna } from '../theme/warna';
import { rupiah } from '../utils/rupiah';

export default function BarisKeranjang({ id, nama, warung, harga, jumlah, padaTambah, padaKurang }) {
  return (
    <View style={gaya.baris}>
      <View style={gaya.isi}>
        <Text style={gaya.nama} numberOfLines={1}>
          {nama}
        </Text>
        <Text style={gaya.warung} numberOfLines={1}>
          {warung}
        </Text>
        <Text style={gaya.harga}>{rupiah(harga * jumlah)}</Text>
      </View>

      <View style={gaya.pengatur}>
        <Pressable
          onPress={() => padaKurang(id)}
          accessibilityRole="button"
          accessibilityLabel={`Kurangi ${nama}`}
          style={({ pressed }) => [gaya.bulat, pressed && gaya.bulatDitekan]}
        >
          <Text style={gaya.tanda}>−</Text>
        </Pressable>

        <Text style={gaya.jumlah} accessibilityLabel={`Jumlah ${nama}`}>
          {jumlah}
        </Text>

        <Pressable
          onPress={() => padaTambah(id)}
          accessibilityRole="button"
          accessibilityLabel={`Tambah ${nama}`}
          style={({ pressed }) => [gaya.bulat, pressed && gaya.bulatDitekan]}
        >
          <Text style={gaya.tanda}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const gaya = StyleSheet.create({
  baris: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: jarak.sedang,
    paddingVertical: jarak.sedang,
    borderBottomWidth: 1,
    borderBottomColor: warna.garis,
  },
  isi: { flex: 1, gap: 2 },
  nama: { fontSize: huruf.isi, fontWeight: '600', color: warna.teks },
  warung: { fontSize: huruf.kecil, color: warna.teksRedup },
  harga: { fontSize: huruf.isi, fontWeight: '700', color: warna.utamaTua },

  pengatur: { flexDirection: 'row', alignItems: 'center', gap: jarak.kecil },
  bulat: {
    width: 32,
    height: 32,
    borderRadius: radius.bulat,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: warna.utamaMuda,
  },
  bulatDitekan: { backgroundColor: warna.garis },
  tanda: { fontSize: huruf.judul, fontWeight: '700', color: warna.utamaTua, lineHeight: 20 },
  jumlah: { fontSize: huruf.isi, fontWeight: '700', color: warna.teks, minWidth: 18, textAlign: 'center' },
});
