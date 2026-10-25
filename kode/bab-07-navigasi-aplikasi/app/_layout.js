import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from '../context/AuthContext.js';
import { warna } from '../tema/desain.js';

/**
 * Root layout: satu stack untuk seluruh aplikasi.
 *
 * Yang dipasang di sini hanya hal-hal yang berlaku untuk semua layar:
 * penyedia area aman, penyedia sesi, dan tema header. Setiap grup rute
 * di bawahnya (`(tabs)`) menambahkan navigatornya sendiri.
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
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
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
