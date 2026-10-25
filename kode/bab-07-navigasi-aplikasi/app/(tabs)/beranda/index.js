import { Link, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CardMahasiswa } from '../../../components/CardMahasiswa.js';
import { Tombol } from '../../../components/Tombol.js';
import { mahasiswa, nilai } from '../../../data/mahasiswa.js';
import { matakuliah } from '../../../data/matakuliah.js';
import { filterSemester, hitungIpk, ringkas, sisaKuota, totalSks } from '../../../utils/akademik.js';
import { spasi, teks, warna } from '../../../tema/desain.js';

/**
 * Dashboard: ringkasan akademik + dua cara berpindah layar.
 *
 * Perhatikan dua tombol di bawah kartu:
 *   - "Jadwal" memakai `<Link>`          → deklaratif, alamatnya terlihat di kode
 *   - "Lihat nilai" memakai `router.push` → imperatif, dipakai saat perpindahan
 *     baru diputuskan setelah sesuatu terjadi (di sini: setelah dihitung)
 *
 * Keduanya sah; slide membandingkan kapan masing-masing lebih tepat.
 */
export default function Beranda() {
  const ipk = hitungIpk(nilai);
  const semesterIni = filterSemester(matakuliah, mahasiswa.semester);
  const [dibukaPada, setDibukaPada] = useState(null);

  // Berjalan setiap kali layar ini kembali fokus, bukan hanya saat pertama dirender.
  useFocusEffect(
    useCallback(() => {
      setDibukaPada(new Date().toLocaleTimeString('id-ID'));
    }, []),
  );

  return (
    <ScrollView style={styles.layar} contentContainerStyle={styles.isi}>
      <Text style={styles.sapaan}>Selamat datang,</Text>
      <Text style={styles.nama}>{mahasiswa.nama.split(' ')[0]}</Text>

      <CardMahasiswa
        mhs={{
          nama: mahasiswa.nama,
          nim: mahasiswa.nim,
          prodi: mahasiswa.prodi,
          angkatan: mahasiswa.angkatan,
          ipk,
        }}
      />

      <View style={styles.ringkasan}>
        <Kotak label="IPK" nilai={ipk.toFixed(2)} />
        <Kotak label="SKS lulus" nilai={String(totalSks(nilai))} />
        <Kotak label={`MK semester ${mahasiswa.semester}`} nilai={String(semesterIni.length)} />
      </View>

      <View style={styles.barisTombol}>
        <View style={styles.setengah}>
          <Link href="/(tabs)/beranda/jadwal" asChild>
            <Tombol judul="Jadwal" varian="sekunder" penuh />
          </Link>
        </View>
        <View style={styles.setengah}>
          <Tombol judul="Lihat nilai" varian="garis" penuh onPress={() => router.push('/(tabs)/nilai')} />
        </View>
      </View>

      <View style={styles.kartu}>
        <View style={styles.kepalaKartu}>
          <Text style={styles.judulKartu}>Mata kuliah semester ini</Text>
          <Link href="/(tabs)/krs" style={styles.tautan}>
            <Text style={styles.tautanTeks}>KRS</Text>
          </Link>
        </View>

        {semesterIni.slice(0, 4).map((mk) => (
          <Link key={mk.kode} href={`/(tabs)/beranda/matakuliah/${mk.kode}`} asChild>
            <Pressable style={({ pressed }) => [styles.barisMk, pressed && styles.ditekan]}>
              <View style={styles.infoMk}>
                <Text style={styles.namaMk}>{mk.nama}</Text>
                <Text style={styles.metaMk}>{ringkas(mk)}</Text>
              </View>
              <Text style={styles.sisa}>Sisa {sisaKuota(mk)}</Text>
            </Pressable>
          </Link>
        ))}

        <Text style={styles.catatan}>
          Terakhir diperbarui {dibukaPada ?? '—'} · layar ini memakai useFocusEffect
        </Text>
      </View>
    </ScrollView>
  );
}

function Kotak({ label, nilai: angka }) {
  return (
    <View style={styles.kotak}>
      <Text style={styles.angka}>{angka}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  isi: { padding: spasi.lg, paddingBottom: spasi.xxxl, gap: spasi.md },
  sapaan: { color: warna.teksRedup, ...teks.kecil },
  nama: { color: warna.teks, ...teks.judulBesar, marginTop: -spasi.sm },
  ringkasan: { flexDirection: 'row', gap: spasi.sm },
  kotak: {
    flex: 1,
    backgroundColor: warna.permukaan,
    borderRadius: 10,
    padding: spasi.md,
    alignItems: 'center',
    gap: 2,
  },
  angka: { color: warna.utamaRedup, ...teks.subjudul },
  label: { color: warna.teksMati, ...teks.mikro, fontWeight: '400', textAlign: 'center' },
  barisTombol: { flexDirection: 'row', gap: spasi.sm },
  setengah: { flex: 1 },
  kartu: { backgroundColor: warna.permukaan, borderRadius: 12, padding: spasi.lg, gap: spasi.sm },
  kepalaKartu: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  judulKartu: { color: warna.utamaRedup, ...teks.mikro },
  tautan: { paddingVertical: 2 },
  tautanTeks: { color: warna.utamaRedup, ...teks.kecil },
  barisMk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spasi.sm,
    paddingVertical: spasi.sm,
    borderTopWidth: 1,
    borderTopColor: warna.garis,
  },
  ditekan: { opacity: 0.7 },
  infoMk: { flex: 1 },
  namaMk: { color: warna.teks, ...teks.isi, fontWeight: '600' },
  metaMk: { color: warna.teksMati, ...teks.mikro, fontWeight: '400', marginTop: 2 },
  sisa: { color: warna.teksRedup, ...teks.mikro, fontWeight: '400' },
  catatan: { color: warna.teksMati, ...teks.mikro, fontWeight: '400', marginTop: spasi.sm },
});
