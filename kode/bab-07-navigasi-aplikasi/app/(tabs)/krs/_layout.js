import { Stack } from 'expo-router';

import { warna } from '../../../tema/desain.js';

/** Tab KRS: untuk sekarang satu layar; bab 9 menambah layar ringkasan. */
export default function KrsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: warna.latar },
        headerTintColor: warna.teks,
        headerTitleStyle: { fontSize: 16, fontWeight: '600' },
        contentStyle: { backgroundColor: warna.latar },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'KRS' }} />
    </Stack>
  );
}
