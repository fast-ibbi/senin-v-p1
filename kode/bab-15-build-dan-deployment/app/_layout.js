import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from '../context/AuthContext.js';
import { KrsProvider } from '../context/KrsContext.js';
import { warna } from '../tema/desain.js';

/**
 * Root layout: satu stack untuk seluruh aplikasi.
 *
 * Bab 9 menambah satu penyedia lagi: `KrsProvider`. Perhatikan urutannya —
 * penyedia yang lebih umum di luar (`AuthProvider`), yang lebih khusus di dalam.
 * Kalau `KrsProvider` nanti perlu membaca sesi pengguna, urutan ini sudah benar.
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <KrsProvider>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: warna.permukaan },
              headerTintColor: warna.teks,
              headerTitleStyle: { fontSize: 16, fontWeight: '600' },
              contentStyle: { backgroundColor: warna.latar },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false, title: 'Masuk' }} />
            <Stack.Screen name="registrasi" options={{ title: 'Daftar Akun' }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="light" />
        </KrsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
