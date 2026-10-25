import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * Sesi pengguna — versi bab 7.
 *
 * Masih tiruan: tidak ada server, tidak ada token. Yang sudah benar adalah
 * **bentuknya**: satu tempat yang menyimpan status masuk, satu pintu untuk masuk
 * dan keluar, dan satu hook untuk membacanya dari layar mana pun.
 *
 * Bab 13 mengganti isi berkas ini dengan login sungguhan (`POST /api/auth/login`,
 * token di SecureStore) tanpa mengubah satu pun layar yang memakainya.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [pengguna, setPengguna] = useState(null);

  const masuk = useCallback((nim = '20230001', nama = 'Nadia Putri Ramadhani') => {
    // Tiruan sesi: identitas disimpan di memori saja.
    setPengguna({ nim, nama, masukPada: new Date().toISOString() });
  }, []);

  const keluar = useCallback(() => setPengguna(null), []);

  const nilai = useMemo(
    () => ({ pengguna, masuk, keluar, sudahMasuk: pengguna !== null }),
    [pengguna, masuk, keluar],
  );

  return <AuthContext.Provider value={nilai}>{children}</AuthContext.Provider>;
}

/**
 * Hook pembungkus. Alasannya sama dengan `useKrs` di bab 9: komponen tidak perlu
 * tahu nama context, dan lupa memasang provider menjadi error yang jelas,
 * bukan `undefined is not an object` di tempat acak.
 */
export function useAuth() {
  const konteks = useContext(AuthContext);
  if (konteks === null) {
    throw new Error('useAuth harus dipakai di dalam <AuthProvider>.');
  }
  return konteks;
}
