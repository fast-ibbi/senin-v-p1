// components/KartuMenu.js — satu kartu menu, dua bentuk.
//
// Bab 5 subbab 2.10 (props turun) + subbab 3.3 (array style) + subbab 4.4
// (flexDirection ikut lebar) + subbab 5.4 (Platform.select untuk bayangan).
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { breakpoint, huruf, jarak, radius, warna } from '../theme/warna';
import { rupiah } from '../utils/rupiah';

// Bayangan tidak sama di tiga platform. Inilah cara bab ini memilih:
// perbedaan kecil → Platform.select, bukan dua berkas terpisah.
const bayangan = Platform.select({
  ios: {
    shadowColor: warna.teks,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  android: { elevation: 2 },
  default: {
    shadowColor: warna.teks,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default function KartuMenu({
  id,
  nama,
  warung,
  harga,
  gambar,
  lebar,
  lebarKartu,
  jumlah,
  padaTambah,
}) {
  // Ponsel: kartu mendatar (gambar di kiri). Tablet/web: kartu petak.
  const mendatar = lebar < breakpoint.duaKolom;
  // Gambar petak dibuat persegi dari lebar kartu yang sudah dihitung layar.
  // `aspectRatio` tidak dipakai karena react-native-web memasangnya di pembungkus,
  // bukan di elemen gambar, sehingga tinggi asli foto tetap menang.
  const sisiGambar = lebarKartu > 0 ? lebarKartu - 2 : 0;

  return (
    <View style={[gaya.kartu, bayangan, mendatar ? gaya.kartuMendatar : gaya.kartuPetak]}>
      <Image
        source={gambar}
        style={
          mendatar
            ? gaya.gambarMendatar
            : [gaya.gambarPetak, { width: '100%', height: sisiGambar }]
        }
        resizeMode="cover"
        accessibilityLabel={`Foto ${nama}`}
      />

      <View style={mendatar ? gaya.isiMendatar : gaya.isi}>
        <Text style={gaya.nama} numberOfLines={2}>
          {nama}
        </Text>
        <Text style={gaya.warung} numberOfLines={1}>
          {warung}
        </Text>

        <View style={gaya.kaki}>
          <Text style={gaya.harga}>{rupiah(harga)}</Text>

          {/* Gaya bersyarat: lencana hanya ada kalau jumlah > 0. */}
          {jumlah > 0 && (
            <Text style={gaya.lencana}>{`${jumlah}× di keranjang`}</Text>
          )}

          <Pressable
            onPress={() => padaTambah(id)}
            accessibilityRole="button"
            accessibilityLabel={`Tambah ${nama}`}
            style={({ pressed }) => [gaya.tombol, pressed && gaya.tombolDitekan]}
          >
            <Text style={gaya.teksTombol}>Tambah</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const gaya = StyleSheet.create({
  kartu: {
    backgroundColor: warna.permukaan,
    borderRadius: radius.sedang,
    borderWidth: 1,
    borderColor: warna.garis,
    overflow: 'hidden',
  },
  kartuMendatar: { flexDirection: 'row' },
  kartuPetak: { flexDirection: 'column' },

  gambarMendatar: { width: 96, height: '100%', minHeight: 96 },
  gambarPetak: { width: '100%' },

  isi: { padding: jarak.sedang, gap: 2 },
  isiMendatar: { flex: 1, padding: jarak.sedang, gap: 2 },

  nama: { fontSize: huruf.judul, fontWeight: '600', color: warna.teks },
  warung: { fontSize: huruf.kecil, color: warna.teksRedup },

  kaki: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: jarak.kecil,
    marginTop: jarak.kecil,
    flexWrap: 'wrap',
  },
  harga: { fontSize: huruf.isi, fontWeight: '700', color: warna.utamaTua },
  lencana: {
    fontSize: huruf.kecil,
    color: warna.utamaTua,
    backgroundColor: warna.utamaMuda,
    paddingHorizontal: jarak.kecil,
    paddingVertical: 2,
    borderRadius: radius.kecil,
    overflow: 'hidden',
  },

  tombol: {
    paddingHorizontal: jarak.sedang,
    paddingVertical: 6,
    borderRadius: radius.kecil,
    backgroundColor: warna.utama,
  },
  tombolDitekan: { backgroundColor: warna.utamaTua },
  teksTombol: { color: '#ffffff', fontSize: huruf.kecil, fontWeight: '700' },
});
