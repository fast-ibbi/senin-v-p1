import { Stack } from 'expo-router';

import { warna } from '../../../tema/desain.js';

export default function ProfilLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: warna.latar },
        headerTintColor: warna.teks,
        headerTitleStyle: { fontSize: 16, fontWeight: '600' },
        contentStyle: { backgroundColor: warna.latar },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Profil' }} />
    </Stack>
  );
}
