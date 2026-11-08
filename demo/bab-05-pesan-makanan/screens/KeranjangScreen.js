// screens/KeranjangScreen.js — keranjang, ringkasan biaya, dan keadaan "terkirim".
//
// Bab 5 subbab 3.4: tiga wajah dari satu layar dipilih dengan logika `&&` dan
// ternary — bukan `Modal`, bukan `Alert`. (`Alert.alert` tidak melakukan apa pun
// di react-native-web, jadi keadaan sukses harus benar-benar dirender.)
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import BarisKeranjang from '../components/BarisKeranjang';
import { ONGKIR } from '../data/menu';
import { huruf, jarak, radius, warna } from '../theme/warna';
import { rupiah } from '../utils/rupiah';

export default function KeranjangScreen({
  butir,
  terkirim,
  totalDibayar,
  padaTambah,
  padaKurang,
  padaKembali,
  padaPesan,
  padaPesanLagi,
}) {
  const subtotal = butir.reduce((jumlah, b) => jumlah + b.harga * b.jumlah, 0);
  const total = subtotal + ONGKIR;

  // ---------- Keadaan 3: pesanan sudah dikirim ----------
  if (terkirim) {
    return (
      <View style={gaya.terkirim}>
        <View style={gaya.lingkaranCentang}>
          <Text style={gaya.centang}>✓</Text>
        </View>
        <Text style={gaya.judulTerkirim}>Pesanan diterima</Text>
        <Text style={gaya.keteranganTerkirim}>
          Kurir sedang menuju Kos Melati. Perkiraan tiba 25–35 menit.
        </Text>

        <View style={gaya.kartuTotal}>
          <Text style={gaya.labelTotal}>Total dibayar</Text>
          <Text style={gaya.nilaiTotal}>{rupiah(totalDibayar)}</Text>
        </View>

        <Pressable
          onPress={padaPesanLagi}
          accessibilityRole="button"
          accessibilityLabel="Pesan lagi"
          style={({ pressed }) => [gaya.tombolUtama, pressed && gaya.tombolUtamaDitekan]}
        >
          <Text style={gaya.teksTombolUtama}>Pesan lagi</Text>
        </Pressable>
      </View>
    );
  }

  // ---------- Keadaan 1: keranjang masih kosong ----------
  if (butir.length === 0) {
    return (
      <View style={gaya.kosong}>
        <Text style={gaya.judulKosong}>Keranjang masih kosong</Text>
        <Text style={gaya.keteranganKosong}>Tambahkan masakan dari katalog dulu.</Text>

        <Pressable
          onPress={padaKembali}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke katalog"
          style={({ pressed }) => [gaya.tombolUtama, pressed && gaya.tombolUtamaDitekan]}
        >
          <Text style={gaya.teksTombolUtama}>Lihat katalog</Text>
        </Pressable>
      </View>
    );
  }

  // ---------- Keadaan 2: keranjang berisi ----------
  return (
    <View style={gaya.akar}>
      <View style={gaya.kepala}>
        <Pressable
          onPress={padaKembali}
          accessibilityRole="button"
          accessibilityLabel="Lanjut belanja"
          style={({ pressed }) => [gaya.tautanKembali, pressed && gaya.tautanKembaliDitekan]}
        >
          <Text style={gaya.teksKembali}>← Lanjut belanja</Text>
        </Pressable>
        <Text style={gaya.judul}>Keranjang</Text>
      </View>

      <FlatList
        data={butir}
        keyExtractor={(item) => item.id}
        contentContainerStyle={gaya.isiDaftar}
        renderItem={({ item }) => (
          <BarisKeranjang {...item} padaTambah={padaTambah} padaKurang={padaKurang} />
        )}
      />

      <View style={gaya.ringkasan}>
        <View style={gaya.barisRingkasan}>
          <Text style={gaya.labelRingkasan}>Subtotal</Text>
          <Text style={gaya.nilaiRingkasan}>{rupiah(subtotal)}</Text>
        </View>
        <View style={gaya.barisRingkasan}>
          <Text style={gaya.labelRingkasan}>Ongkos kirim</Text>
          <Text style={gaya.nilaiRingkasan}>{rupiah(ONGKIR)}</Text>
        </View>
        <View style={[gaya.barisRingkasan, gaya.barisTotal]}>
          <Text style={gaya.labelTotal}>Total</Text>
          <Text style={gaya.nilaiTotalKecil}>{rupiah(total)}</Text>
        </View>

        <Pressable
          onPress={padaPesan}
          accessibilityRole="button"
          accessibilityLabel="Pesan sekarang"
          style={({ pressed }) => [gaya.tombolUtama, pressed && gaya.tombolUtamaDitekan]}
        >
          <Text style={gaya.teksTombolUtama}>Pesan sekarang</Text>
        </Pressable>
      </View>
    </View>
  );
}

const gaya = StyleSheet.create({
  akar: { flex: 1 },

  kepala: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: jarak.sedang,
    paddingHorizontal: jarak.sedang,
    paddingVertical: jarak.sedang,
    borderBottomWidth: 1,
    borderBottomColor: warna.garis,
  },
  tautanKembali: { paddingVertical: 4, paddingRight: jarak.kecil },
  tautanKembaliDitekan: { opacity: 0.6 },
  teksKembali: { fontSize: huruf.kecil, color: warna.utama, fontWeight: '700' },
  judul: { fontSize: huruf.judul, fontWeight: '700', color: warna.teks },

  isiDaftar: { paddingHorizontal: jarak.sedang, flexGrow: 1 },

  ringkasan: {
    padding: jarak.sedang,
    gap: jarak.kecil,
    backgroundColor: warna.permukaan,
    borderTopWidth: 1,
    borderTopColor: warna.garis,
  },
  barisRingkasan: { flexDirection: 'row', justifyContent: 'space-between' },
  labelRingkasan: { fontSize: huruf.isi, color: warna.teksRedup },
  nilaiRingkasan: { fontSize: huruf.isi, color: warna.teks },
  barisTotal: { borderTopWidth: 1, borderTopColor: warna.garis, paddingTop: jarak.kecil },
  labelTotal: { fontSize: huruf.isi, fontWeight: '700', color: warna.teks },
  nilaiTotalKecil: { fontSize: huruf.judul, fontWeight: '700', color: warna.utamaTua },

  tombolUtama: {
    marginTop: jarak.kecil,
    paddingVertical: 14,
    borderRadius: radius.sedang,
    backgroundColor: warna.utama,
    alignItems: 'center',
  },
  tombolUtamaDitekan: { backgroundColor: warna.utamaTua },
  teksTombolUtama: { color: '#ffffff', fontSize: huruf.isi, fontWeight: '700' },

  kosong: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: jarak.besar, gap: jarak.kecil },
  judulKosong: { fontSize: huruf.judul, fontWeight: '700', color: warna.teks },
  keteranganKosong: { fontSize: huruf.isi, color: warna.teksRedup, textAlign: 'center', marginBottom: jarak.kecil },

  terkirim: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: jarak.besar, gap: jarak.kecil },
  lingkaranCentang: {
    width: 72,
    height: 72,
    borderRadius: radius.bulat,
    backgroundColor: warna.suksesMuda,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: jarak.kecil,
  },
  centang: { fontSize: 36, color: warna.sukses, fontWeight: '700' },
  judulTerkirim: { fontSize: huruf.besar, fontWeight: '700', color: warna.teks },
  keteranganTerkirim: { fontSize: huruf.isi, color: warna.teksRedup, textAlign: 'center' },
  kartuTotal: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 2,
    marginTop: jarak.sedang,
    padding: jarak.sedang,
    borderRadius: radius.sedang,
    backgroundColor: warna.permukaan,
    borderWidth: 1,
    borderColor: warna.garis,
  },
  nilaiTotal: { fontSize: huruf.besar, fontWeight: '700', color: warna.utamaTua },
});
