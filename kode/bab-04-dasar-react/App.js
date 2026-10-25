import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { DaftarNilai } from './components/DaftarNilai.js';
import { KartuMahasiswa } from './components/KartuMahasiswa.js';
import { Sapaan } from './components/Sapaan.jsx';
import { TombolSKS } from './components/TombolSKS.js';
import { mahasiswa, nilai } from './data/mahasiswa.js';
import { hitungIpk } from './utils/akademik.js';

/**
 * Bab 4 — state, event, dan hooks.
 *
 * Tiga hal yang diperagakan layar ini:
 *   1. `useState` menyimpan dua nilai: semester yang sedang dilihat dan SKS yang
 *      dipilih.
 *   2. State **tidak pernah diubah langsung**. `setSks(sks + 1)` membuat nilai
 *      baru; cara itu cukup untuk satu perubahan. Bila perubahan bergantung pada
 *      nilai sebelumnya, pakai bentuk fungsi: `setSks((lama) => lama + 1)`.
 *   3. `useMemo` menandai perhitungan yang mahal supaya tidak diulang tiap render,
 *      dan `useCallback` melakukan hal yang sama untuk fungsi.
 */
export default function App() {
  const [semester, setSemester] = useState(3);
  const [sksDipilih, setSksDipilih] = useState(0);

  // Array baru setiap render; `useMemo` menghemat perhitungan bila semester tetap.
  const nilaiSemester = useMemo(
    () => nilai.filter((baris) => baris.semester === semester),
    [semester],
  );

  const ipk = useMemo(() => hitungIpk(nilai), []);
  const sksMaksimal = useMemo(
    () => nilaiSemester.reduce((jumlah, baris) => jumlah + baris.sks, 0),
    [nilaiSemester],
  );

  // Efek samping: berjalan setelah render, hanya ketika `semester` berubah.
  useEffect(() => {
    console.log(`[bab-04] menampilkan nilai semester ${semester}`);
  }, [semester]);

  // Fungsi yang dikirim ke anak stabil selama `sksMaksimal` tidak berubah.
  const tambahSks = useCallback(() => {
    setSksDipilih((lama) => Math.min(lama + 3, sksMaksimal));
  }, [sksMaksimal]);

  const kurangSks = useCallback(() => {
    setSksDipilih((lama) => Math.max(lama - 3, 0));
  }, []);

  return (
    <ScrollView style={styles.layar} contentContainerStyle={styles.isi}>
      <Text style={styles.judul}>Dasar React</Text>
      <Text style={styles.subjudul}>Bab 4 — komponen, props, state, dan event</Text>

      <KartuMahasiswa
        nama={mahasiswa.nama}
        nim={mahasiswa.nim}
        prodi={mahasiswa.prodi}
        semester={mahasiswa.semester}
        ipk={ipk}
      />

      <View style={styles.bagian}>
        <Sapaan nama={mahasiswa.nama} prodi={mahasiswa.prodi} />
      </View>

      <View style={styles.bagian}>
        <Text style={styles.judulBagian}>State 1 — pilih semester</Text>
        <View style={styles.pilhanSemester}>
          {[3, 4].map((angka) => (
            <Pressable
              key={angka}
              onPress={() => setSemester(angka)}
              style={[styles.tombolSemester, semester === angka && styles.tombolAktif]}
            >
              <Text
                style={[styles.labelSemester, semester === angka && styles.labelAktif]}
              >
                Semester {angka}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.catatan}>
          {nilaiSemester.length} mata kuliah · {sksMaksimal} SKS · sumber data tidak berubah
        </Text>

        <DaftarNilai daftar={nilaiSemester} />
      </View>

      <View style={styles.bagian}>
        <Text style={styles.judulBagian}>State 2 — SKS yang dipilih</Text>
        <TombolSKS
          nilai={sksDipilih}
          onTambah={tambahSks}
          onKurang={kurangSks}
          batasAtas={sksMaksimal}
        />
        <Text style={styles.catatan}>
          {sksDipilih === 0
            ? 'Belum ada SKS yang dipilih.'
            : `${sksDipilih} dari ${sksMaksimal} SKS semester ${semester} dipilih.`}
        </Text>
      </View>

      <StatusBar style="light" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#0f172a' },
  isi: { padding: 20, paddingBottom: 48, gap: 12 },
  judul: { fontSize: 24, fontWeight: '700', color: '#f8fafc' },
  subjudul: { fontSize: 13, color: '#94a3b8', marginBottom: 4 },
  bagian: { backgroundColor: '#1e293b', borderRadius: 10, padding: 14, gap: 10 },
  judulBagian: { color: '#7dd3fc', fontSize: 13, fontWeight: '600' },
  pilhanSemester: { flexDirection: 'row', gap: 8 },
  tombolSemester: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#0f172a',
  },
  tombolAktif: { backgroundColor: '#0ea5e9' },
  labelSemester: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  labelAktif: { color: '#f8fafc' },
  catatan: { color: '#64748b', fontSize: 11, lineHeight: 16 },
});
