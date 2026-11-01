import { useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import BingkaiLayar from '../components/BingkaiLayar';
import { buatDaftarPanjang, formatRupiah } from '../data/produk';
import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

// Layar 5 — Bagian 5.
//
// Dua scroller, satu daftar panjang yang sama. Angka "item dirender" dihitung
// sungguhan: setiap baris menambah penghitung saat dirender. ScrollView merender
// seluruh anak sekaligus; FlatList merender bertahap.
//
// Catatan jujur untuk dosen (lihat NASKAH-DEMO.md): di Expo Web, FlatList bisa
// tetap merender seluruh item karena pengukuran tinggi baris di web terbatas.
// Beda yang sesungguhnya terasa di perangkat native.
const JUMLAH_ITEM = 300;

const daftarPanjang = buatDaftarPanjang(JUMLAH_ITEM);

// Penghitung render di luar komponen supaya bisa dinaikkan dari dalam baris.
let hitunganRender = 0;

function BarisPanjang({ item }) {
  hitunganRender += 1;

  return (
    <View style={styles.baris}>
      <Text style={styles.nomorBaris}>{item.id.replace('panjang-', '')}</Text>
      <Text style={styles.namaBaris} numberOfLines={1}>
        {item.nama}
      </Text>
      <Text style={styles.hargaBaris}>{formatRupiah(item.harga)}</Text>
    </View>
  );
}

export default function ScrollerScreen({ onKembali }) {
  const [mode, setMode] = useState('scrollview'); // 'scrollview' | 'flatlist'
  const [terrender, setTerrender] = useState(0);

  // Sesudah render selesai, laporkan angka sebenarnya ke layar.
  useEffect(() => {
    const angka = hitunganRender;
    const timer = setTimeout(() => setTerrender(angka), 0);
    return () => clearTimeout(timer);
  }, [mode]);

  function gantiMode(modeBaru) {
    hitunganRender = 0;
    setTerrender(0);
    setMode(modeBaru);
  }

  return (
    <BingkaiLayar
      judul="ScrollView dan FlatList pada daftar yang sama"
      rujukan="Bagian 5 · subbab 5.1–5.3"
      poin={[
        'Daftar yang sama (' + JUMLAH_ITEM + ' item), dua komponen berbeda.',
        'Perhatikan angka "item dirender" setelah berpindah mode.',
        'Jangan pernah menaruh FlatList di dalam ScrollView searah.',
      ]}
      onKembali={onKembali}
    >
      <View style={styles.kepala}>
        <View style={styles.pemilih}>
          <TombolMode
            label="ScrollView"
            aktif={mode === 'scrollview'}
            onPress={() => gantiMode('scrollview')}
          />
          <TombolMode
            label="FlatList"
            aktif={mode === 'flatlist'}
            onPress={() => gantiMode('flatlist')}
          />
        </View>

        <View style={styles.kartuAngka}>
          <View>
            <Text style={styles.labelAngka}>item dirender</Text>
            <Text style={styles.nilaiAngka}>{terrender}</Text>
          </View>
          <View style={styles.kananAngka}>
            <Text style={styles.labelAngka}>di data</Text>
            <Text style={styles.nilaiAngka}>{JUMLAH_ITEM}</Text>
          </View>
        </View>

        <Text style={styles.catatanMode}>
          {mode === 'scrollview'
            ? 'ScrollView: semua anak masuk ke pohon komponen sejak layar dibuka.'
            : 'FlatList: item disusun bertahap mengikuti area yang terlihat.'}
        </Text>
      </View>

      {mode === 'scrollview' ? (
        <ScrollView style={styles.areaGulir} contentContainerStyle={styles.isiGulir}>
          {daftarPanjang.map((item) => (
            <BarisPanjang key={item.id} item={item} />
          ))}
        </ScrollView>
      ) : (
        <FlatList
          style={styles.areaGulir}
          contentContainerStyle={styles.isiGulir}
          data={daftarPanjang}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BarisPanjang item={item} />}
          ItemSeparatorComponent={() => <View style={styles.pemisah} />}
          initialNumToRender={10}
          windowSize={5}
        />
      )}
    </BingkaiLayar>
  );
}

function TombolMode({ label, aktif, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: aktif }}
      accessibilityLabel={'Tampilkan daftar dengan ' + label}
      style={({ pressed }) => [styles.tombolMode, aktif && styles.tombolModeAktif, pressed && styles.tertekan]}
    >
      <Text style={[styles.labelMode, aktif && styles.labelModeAktif]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  kepala: {
    paddingHorizontal: JARAK.lg,
    paddingTop: JARAK.md,
    gap: JARAK.sm,
  },
  pemilih: {
    flexDirection: 'row',
    gap: JARAK.sm,
  },
  tombolMode: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: JARAK.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: WARNA.garis,
    backgroundColor: WARNA.permukaan,
  },
  tombolModeAktif: {
    backgroundColor: WARNA.utamaMuda,
    borderColor: WARNA.utama,
  },
  tertekan: {
    opacity: 0.7,
  },
  labelMode: {
    fontSize: TEKS.isi,
    fontWeight: '700',
    color: WARNA.tintaRedup,
  },
  labelModeAktif: {
    color: WARNA.utama,
  },
  kartuAngka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    borderRadius: RADIUS.md,
    padding: JARAK.md,
  },
  kananAngka: {
    alignItems: 'flex-end',
  },
  labelAngka: {
    fontSize: TEKS.mungil,
    color: '#94a3b8',
  },
  nilaiAngka: {
    fontSize: TEKS.judulLayar,
    fontWeight: '800',
    fontFamily: 'Courier',
    color: '#e2e8f0',
  },
  catatanMode: {
    fontSize: TEKS.kecil,
    lineHeight: 17,
    color: WARNA.tintaRedup,
  },
  areaGulir: {
    flex: 1,
    marginTop: JARAK.sm,
    backgroundColor: WARNA.permukaan,
  },
  isiGulir: {
    paddingVertical: JARAK.sm,
  },
  baris: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: JARAK.sm,
    paddingVertical: JARAK.sm,
    paddingHorizontal: JARAK.lg,
  },
  nomorBaris: {
    width: 40,
    fontSize: TEKS.mungil,
    fontFamily: 'Courier',
    color: WARNA.tintaRedup,
  },
  namaBaris: {
    flex: 1,
    fontSize: TEKS.isi,
    color: WARNA.tinta,
  },
  hargaBaris: {
    fontSize: TEKS.kecil,
    fontWeight: '600',
    color: WARNA.utama,
  },
  pemisah: {
    height: 1,
    backgroundColor: WARNA.garis,
    marginLeft: JARAK.lg,
  },
});
