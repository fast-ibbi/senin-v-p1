import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { nilai } from '../../../data/mahasiswa.js';
import { hitungIpk, totalSks } from '../../../utils/akademik.js';
import { spasi, teks, warna } from '../../../tema/desain.js';

/**
 * Tab Nilai — memperagakan `useFocusEffect`.
 *
 * `useEffect` biasa hanya berjalan sekali saat layar dipasang. Tab tetap hidup
 * ketika kamu berpindah tab, jadi datanya bisa basi. `useFocusEffect` dijalankan
 * setiap kali layar **kembali terlihat** — itulah yang nanti dipakai KRS untuk
 * membaca ulang daftar setelah kamu menambah mata kuliah di layar lain.
 *
 * Di bab ini belum ada data yang berubah, jadi efeknya hanya memperbarui
 * penanda waktu. Perhatikan angkanya bertambah setiap kali tab ini dibuka.
 */
export default function Nilai() {
  const [kunjungan, setKunjungan] = useState(0);
  const [dibukaPada, setDibukaPada] = useState('—');

  useFocusEffect(
    useCallback(() => {
      setKunjungan((lama) => lama + 1);
      setDibukaPada(new Date().toLocaleTimeString('id-ID'));
    }, []),
  );

  const ipk = useMemo(() => hitungIpk(nilai), []);
  const perSemester = useMemo(() => {
    return nilai.reduce((kelompok, baris) => {
      const daftar = kelompok[baris.semester] ?? [];
      return { ...kelompok, [baris.semester]: [...daftar, baris] };
    }, {});
  }, []);

  return (
    <ScrollView style={styles.layar} contentContainerStyle={styles.isi}>
      <View style={styles.ringkasan}>
        <View style={styles.kotak}>
          <Text style={styles.angka}>{ipk.toFixed(2)}</Text>
          <Text style={styles.label}>IPK</Text>
        </View>
        <View style={styles.kotak}>
          <Text style={styles.angka}>{totalSks(nilai)}</Text>
          <Text style={styles.label}>SKS lulus</Text>
        </View>
        <View style={styles.kotak}>
          <Text style={styles.angka}>{nilai.length}</Text>
          <Text style={styles.label}>mata kuliah</Text>
        </View>
      </View>

      {Object.entries(perSemester)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([semester, daftar]) => (
          <View key={semester} style={styles.kartu}>
            <Text style={styles.judulKartu}>
              Semester {semester} · {totalSks(daftar)} SKS
            </Text>
            {daftar.map((baris) => (
              <View key={baris.kode} style={styles.baris}>
                <View style={styles.info}>
                  <Text style={styles.nama}>{baris.nama}</Text>
                  <Text style={styles.meta}>
                    {baris.kode} · {baris.sks} SKS
                  </Text>
                </View>
                <Text style={[styles.huruf, warnaHuruf(baris.nilaiHuruf)]}>
                  {baris.nilaiHuruf}
                </Text>
              </View>
            ))}
          </View>
        ))}

      <Text style={styles.catatan}>
        Dibuka {kunjungan} kali · terakhir {dibukaPada} · diperbarui oleh useFocusEffect
      </Text>
    </ScrollView>
  );
}

function warnaHuruf(huruf) {
  if (huruf.startsWith('A')) return { color: warna.sukses };
  if (huruf.startsWith('B')) return { color: warna.utamaRedup };
  return { color: warna.peringatan };
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  isi: { padding: spasi.lg, paddingBottom: spasi.xxxl, gap: spasi.md },
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
  label: { color: warna.teksMati, ...teks.mikro, fontWeight: '400' },
  kartu: { backgroundColor: warna.permukaan, borderRadius: 12, padding: spasi.lg, gap: spasi.sm },
  judulKartu: { color: warna.utamaRedup, ...teks.mikro, marginBottom: spasi.xs },
  baris: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spasi.sm,
    borderTopWidth: 1,
    borderTopColor: warna.garis,
  },
  info: { flex: 1 },
  nama: { color: warna.teks, ...teks.isi },
  meta: { color: warna.teksMati, ...teks.mikro, fontWeight: '400', marginTop: 2 },
  huruf: { ...teks.subjudul, fontWeight: '700' },
  catatan: { color: warna.teksMati, ...teks.mikro, fontWeight: '400', textAlign: 'center' },
});
