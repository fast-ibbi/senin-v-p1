import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import BingkaiLayar from '../components/BingkaiLayar';
import { JARAK, RADIUS, TEKS, WARNA } from '../theme/warna';

// Layar 3 — Bagian 3.
//
// Satu tombol, satu state, tiga wajah. Yang disimpan di state hanya NAMA STATUS,
// bukan objek gaya — rujukan slide: subbab 3.3 (salah paham "menyimpan gaya di dalam state").
const PILIHAN_STATUS = [
  { nilai: 'utama', label: 'Utama' },
  { nilai: 'kedua', label: 'Kedua' },
  { nilai: 'nonaktif', label: 'Nonaktif' },
];

export default function GayaScreen({ onKembali }) {
  const [status, setStatus] = useState('utama');

  // Array gaya dibaca dari kiri ke kanan. Yang belakangan menimpa properti yang sama.
  const gayaTombol = [
    styles.tombol,
    status === 'utama' && styles.tombolUtama,
    status === 'kedua' && styles.tombolKedua,
    status === 'nonaktif' && styles.tombolNonaktif,
  ];

  const gayaLabel = [
    styles.labelTombol,
    status === 'nonaktif' && styles.labelTombolNonaktif,
  ];

  const namaGayaAktif = ['styles.tombol', 'styles.tombol' + kapital(status)];

  return (
    <BingkaiLayar
      judul="Satu state, tiga wajah tombol"
      rujukan="Bagian 3 · subbab 3.2–3.3"
      poin={[
        'Yang disimpan di state hanya nama status, bukan objek gaya.',
        'Array gaya dibaca kiri ke kanan: yang belakangan menimpa properti yang sama.',
        'Nilai false di dalam array diabaikan — itu dasar gaya kondisional.',
      ]}
      onKembali={onKembali}
    >
      <ScrollView contentContainerStyle={styles.isi}>
        <View style={styles.panggung}>
          <Pressable
            disabled={status === 'nonaktif'}
            onPress={() => {}}
            accessibilityRole="button"
            accessibilityState={{ disabled: status === 'nonaktif' }}
            accessibilityLabel={'Tombol contoh dengan status ' + status}
            style={gayaTombol}
          >
            <Text style={gayaLabel}>Simpan Data</Text>
          </Pressable>

          <Text style={styles.statusSekarang}>
            status = &quot;{status}&quot;
          </Text>
        </View>

        <View style={styles.kartu}>
          <Text style={styles.judulKartu}>Ubah status</Text>
          <Text style={styles.catatanKartu}>
            Ketiga tombol di bawah memanggil setStatus dengan nilai berbeda. Perhatikan bahwa
            tidak satu pun dari mereka menyimpan warna atau ukuran.
          </Text>

          <View style={styles.barisPilihan}>
            {PILIHAN_STATUS.map((pilihan) => {
              const dipilih = status === pilihan.nilai;
              return (
                <Pressable
                  key={pilihan.nilai}
                  onPress={() => setStatus(pilihan.nilai)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: dipilih }}
                  accessibilityLabel={'Ubah status menjadi ' + pilihan.label}
                  style={({ pressed }) => [
                    styles.pilihan,
                    dipilih && styles.pilihanAktif,
                    pressed && styles.pilihanTertekan,
                  ]}
                >
                  <Text style={[styles.labelPilihan, dipilih && styles.labelPilihanAktif]}>
                    {pilihan.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.kartu}>
          <Text style={styles.judulKartu}>Array gaya yang sedang dipakai</Text>
          <View style={styles.kotakKode}>
            <Text style={styles.kode}>[</Text>
            {namaGayaAktif.map((nama) => (
              <Text key={nama} style={styles.kode}>
                {'  '}
                {nama},
              </Text>
            ))}
            <Text style={styles.kode}>]</Text>
          </View>
          <Text style={styles.catatanKartu}>
            Dua entri pertama selalu ada. Entri ketiga hanya muncul saat statusnya cocok, dan
            saat tidak cocok nilainya false — false diabaikan, bukan error.
          </Text>
        </View>
      </ScrollView>
    </BingkaiLayar>
  );
}

// 'utama' -> 'Utama', untuk menampilkan nama konstanta gaya di kotak kode.
function kapital(teks) {
  return teks.charAt(0).toUpperCase() + teks.slice(1);
}

const styles = StyleSheet.create({
  isi: {
    padding: JARAK.lg,
    gap: JARAK.md,
  },
  panggung: {
    alignItems: 'center',
    gap: JARAK.sm,
    paddingVertical: JARAK.xl,
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: WARNA.garis,
  },
  tombol: {
    minWidth: 180,
    alignItems: 'center',
    paddingVertical: JARAK.md,
    paddingHorizontal: JARAK.xl,
    borderRadius: RADIUS.bulat,
  },
  tombolUtama: {
    backgroundColor: WARNA.utama,
  },
  tombolKedua: {
    backgroundColor: WARNA.permukaan,
    borderWidth: 2,
    borderColor: WARNA.utama,
  },
  tombolNonaktif: {
    backgroundColor: '#d7dee8',
  },
  labelTombol: {
    fontSize: TEKS.judul,
    fontWeight: '800',
    color: '#ffffff',
  },
  labelTombolNonaktif: {
    color: '#7c8798',
  },
  statusSekarang: {
    fontSize: TEKS.kecil,
    fontFamily: 'Courier',
    color: WARNA.tintaRedup,
  },
  kartu: {
    backgroundColor: WARNA.permukaan,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: WARNA.garis,
    padding: JARAK.md,
    gap: JARAK.sm,
  },
  judulKartu: {
    fontSize: TEKS.judul,
    fontWeight: '800',
    color: WARNA.tinta,
  },
  catatanKartu: {
    fontSize: TEKS.kecil,
    lineHeight: 17,
    color: WARNA.tintaRedup,
  },
  barisPilihan: {
    flexDirection: 'row',
    gap: JARAK.sm,
    marginTop: JARAK.xs,
  },
  pilihan: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: JARAK.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: WARNA.garis,
    backgroundColor: WARNA.latar,
  },
  pilihanAktif: {
    backgroundColor: WARNA.utamaMuda,
    borderColor: WARNA.utama,
  },
  pilihanTertekan: {
    opacity: 0.7,
  },
  labelPilihan: {
    fontSize: TEKS.kecil,
    fontWeight: '700',
    color: WARNA.tintaRedup,
  },
  labelPilihanAktif: {
    color: WARNA.utama,
  },
  kotakKode: {
    backgroundColor: '#1e293b',
    borderRadius: RADIUS.sm,
    padding: JARAK.md,
  },
  kode: {
    fontSize: TEKS.kecil,
    fontFamily: 'Courier',
    color: '#e2e8f0',
  },
});
