import { Stack } from 'expo-router';

import { warna } from '../../../tema/desain.js';

/**
 * Tab Beranda berisi stack sendiri: dashboard → jadwal → detail mata kuliah.
 *
 * Inilah "nested navigation" yang dimaksud slide: tab di dalam stack, bukan
 * stack di dalam tab. Konsekuensinya nyata — tombol Back di dalam tab beranda
 * kembali ke dashboard, bukan keluar aplikasi.
 */
export default function BerandaLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: warna.latar },
        headerTintColor: warna.teks,
        headerTitleStyle: { fontSize: 16, fontWeight: '600' },
        contentStyle: { backgroundColor: warna.latar },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Beranda' }} />
      <Stack.Screen name="jadwal" options={{ title: 'Jadwal' }} />
      <Stack.Screen name="matakuliah/[kode]" options={{ title: 'Detail Mata Kuliah' }} />
    </Stack>
  );
}
