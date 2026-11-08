// components/KartuMenu.js — status diturunkan, gaya dipilih dari status
import { View, Text, Image, StyleSheet } from 'react-native';
import { warna, jarak, radius, huruf } from '../theme/warna';

const gambarContoh = require('../assets/icon.png');

function statusStok(stok) {
  if (stok === 0) return 'habis';
  if (stok <= 3) return 'tipis';
  return 'tersedia';
}

export default function KartuMenu({ nama, kategori, harga, stok }) {
  const status = statusStok(stok);

  return (
    <View style={gaya.kartu}>
      <Image source={gambarContoh} style={gaya.gambar} />
      <View style={gaya.isi}>
        <Text style={gaya.nama}>{nama}</Text>
        <Text style={gaya.kategori}>{kategori}</Text>
        <Text style={gaya.harga}>{`Rp${harga.toLocaleString('id-ID')}`}</Text>
        <Text
          style={[
            gaya.badge,
            status === 'habis' && gaya.badgeHabis,
            status === 'tipis' && gaya.badgeTipis,
          ]}
        >
          {status}
        </Text>
        {stok > 0 && <Text style={gaya.sisa}>{`sisa ${stok}`}</Text>}
      </View>
    </View>
  );
}

const gaya = StyleSheet.create({
  kartu: {
    flexDirection: 'row',
    gap: jarak.sedang,
    padding: jarak.sedang,
    backgroundColor: warna.permukaan,
    borderRadius: radius.sedang,
    borderWidth: 1,
    borderColor: warna.garis,
  },
  gambar: { width: 56, height: 56, borderRadius: radius.kecil },
  isi: { flex: 1, gap: 4 },
  nama: { fontSize: huruf.judul, fontWeight: '600', color: warna.teks },
  kategori: { fontSize: huruf.kecil, color: warna.teksRedup },
  harga: { fontSize: huruf.isi, fontWeight: '600', color: warna.utama },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: jarak.kecil,
    paddingVertical: 2,
    borderRadius: radius.kecil,
    backgroundColor: warna.utamaMuda,
    fontSize: huruf.kecil,
  },
  badgeHabis: { backgroundColor: warna.bahayaMuda, color: warna.bahaya },
  badgeTipis: { backgroundColor: warna.latar, color: warna.teksRedup },
  sisa: { fontSize: huruf.kecil, color: warna.teksRedup },
});
