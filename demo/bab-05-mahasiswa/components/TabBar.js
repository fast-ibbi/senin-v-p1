import { Pressable, StyleSheet, Text, View } from 'react-native';

import { JARAK, TEKS, WARNA } from '../theme/warna';

// Bilah navigasi bawah.
//
// Rujukan slide Bab 5: navigasi antar layar di project ini sengaja hanya memakai
// satu state di App.js — pustaka navigasi baru dibahas di Bab 7. Yang dilatih di
// sini justru komponennya: `Pressable` dengan gaya kondisional untuk tab aktif
// (subbab 2.6 dan 3.3).

const TAB = [
  { kunci: 'beranda', label: 'Beranda', ikon: '⌂' },
  { kunci: 'mahasiswa', label: 'Mahasiswa', ikon: '☰' },
  { kunci: 'katalog', label: 'Mata Kuliah', ikon: '▤' },
  { kunci: 'tentang', label: 'Info', ikon: 'ⓘ' },
];

export default function TabBar({ aktif, onPilih }) {
  return (
    <View style={styles.bilah}>
      {TAB.map((tab) => {
        const dipilih = tab.kunci === aktif;
        return (
          <Pressable
            key={tab.kunci}
            onPress={() => onPilih(tab.kunci)}
            accessibilityRole="tab"
            accessibilityState={{ selected: dipilih }}
            accessibilityLabel={tab.label}
            style={({ pressed }) => [styles.tab, pressed && styles.tabDitekan]}
          >
            <View style={[styles.garisAtas, dipilih && styles.garisAtasAktif]} />
            <Text style={[styles.ikon, dipilih && styles.teksAktif]}>{tab.ikon}</Text>
            <Text style={[styles.label, dipilih && styles.teksAktif]} numberOfLines={1}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bilah: {
    flexDirection: 'row',
    backgroundColor: WARNA.permukaan,
    borderTopWidth: 1,
    borderTopColor: WARNA.garis,
    paddingBottom: JARAK.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: JARAK.sm,
    paddingBottom: JARAK.xs,
    gap: 1,
  },
  tabDitekan: {
    backgroundColor: WARNA.permukaanRedup,
  },
  garisAtas: {
    height: 2,
    width: 22,
    borderRadius: 2,
    backgroundColor: 'transparent',
    marginBottom: 4,
  },
  garisAtasAktif: {
    backgroundColor: WARNA.utama,
  },
  ikon: {
    fontSize: 15,
    color: WARNA.tintaRedup,
  },
  label: {
    fontSize: TEKS.mungil,
    color: WARNA.tintaRedup,
  },
  teksAktif: {
    color: WARNA.utama,
    fontWeight: '700',
  },
});
