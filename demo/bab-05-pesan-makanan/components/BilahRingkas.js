// components/BilahRingkas.js — bilah bawah: jumlah item, total, dan satu aksi.
//
// Bab 5 subbab 4.1–4.3: `flexDirection: 'row'` + `justifyContent: 'space-between'`
// adalah dua properti yang menyelesaikan hampir semua baris di aplikasi mobile.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { huruf, jarak, radius, warna } from '../theme/warna';
import { rupiah } from '../utils/rupiah';

export default function BilahRingkas({ jumlahItem, total, padaBuka }) {
  return (
    <View style={gaya.bilah}>
      <View>
        <Text style={gaya.item}>{`${jumlahItem} item`}</Text>
        <Text style={gaya.total}>{rupiah(total)}</Text>
      </View>

      <Pressable
        onPress={padaBuka}
        accessibilityRole="button"
        accessibilityLabel="Lihat Keranjang"
        style={({ pressed }) => [gaya.tombol, pressed && gaya.tombolDitekan]}
      >
        <Text style={gaya.teksTombol}>Lihat Keranjang</Text>
      </Pressable>
    </View>
  );
}

const gaya = StyleSheet.create({
  bilah: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: jarak.sedang,
    paddingHorizontal: jarak.sedang,
    paddingVertical: jarak.sedang,
    backgroundColor: warna.permukaan,
    borderTopWidth: 1,
    borderTopColor: warna.garis,
  },
  item: { fontSize: huruf.kecil, color: warna.teksRedup },
  total: { fontSize: huruf.judul, fontWeight: '700', color: warna.teks },
  tombol: {
    paddingHorizontal: jarak.besar,
    paddingVertical: 12,
    borderRadius: radius.kecil,
    backgroundColor: warna.utama,
  },
  tombolDitekan: { backgroundColor: warna.utamaTua },
  teksTombol: { color: '#ffffff', fontSize: huruf.isi, fontWeight: '700' },
});
