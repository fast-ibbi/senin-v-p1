import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { login as loginApi } from '../api/auth.js';
import { pasangPenanganUnauthorized } from '../api/client.js';
import { hapusSemuaSnapshot } from '../utils/cache.js';
import { bacaPayload, sisaUmurDetik, sudahKedaluwarsa } from '../utils/pemeriksaJwt.js';
import { bacaToken, hapusToken, simpanToken } from '../utils/tokenStorage.js';

/**
 * Sesi pengguna — versi bab 13, sekarang dengan token sungguhan.
 *
 * Empat tanggung jawab, semuanya di satu tempat:
 *   1. menyimpan token di SecureStore (bukan AsyncStorage)
 *   2. memulihkan sesi saat aplikasi dibuka, dan membuang token yang kedaluwarsa
 *   3. menyediakan `token` untuk setiap permintaan API
 *   4. bereaksi pada 401 dari server: bersihkan sesi, kembali ke login
 *
 * Nomor 4 adalah yang paling sering terlupa. Tanpa itu, token kedaluwarsa membuat
 * setiap layar menampilkan galat "tidak berhak" yang membingungkan, padahal
 * solusinya hanya login ulang.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [pengguna, setPengguna] = useState(null);
  const [memulihkan, setMemulihkan] = useState(true);

  // 1. Pulihkan sesi sekali saat aplikasi dibuka.
  useEffect(() => {
    let hidup = true;

    (async () => {
      const tersimpan = await bacaToken();
      if (!hidup) return;

      if (tersimpan && !sudahKedaluwarsa(tersimpan)) {
        const payload = bacaPayload(tersimpan);
        setToken(tersimpan);
        setPengguna({ nim: payload.sub, nama: payload.nama });
      } else if (tersimpan) {
        // Sudah kedaluwarsa: jangan tampilkan sebagai sesi aktif.
        await hapusToken();
      }

      setMemulihkan(false);
    })();

    return () => {
      hidup = false;
    };
  }, []);

  const keluar = useCallback(async () => {
    await hapusToken();
    // Data akademik di perangkat juga dibersihkan — snapshot bukan arsip permanen.
    await hapusSemuaSnapshot();
    setToken(null);
    setPengguna(null);
  }, []);

  // 4. Server menjawab 401 → sesi ini tidak berlaku lagi.
  useEffect(() => {
    pasangPenanganUnauthorized(() => {
      keluar();
    });
  }, [keluar]);

  const masuk = useCallback(async (nim, password) => {
    const hasil = await loginApi(nim, password);
    await simpanToken(hasil.token);
    setToken(hasil.token);
    setPengguna(hasil.pengguna);
    return hasil.pengguna;
  }, []);

  const nilai = useMemo(
    () => ({
      token,
      pengguna,
      memulihkan,
      masuk,
      keluar,
      sudahMasuk: Boolean(token) && Boolean(pengguna),
      sisaDetik: token ? sisaUmurDetik(token) : 0,
    }),
    [token, pengguna, memulihkan, masuk, keluar],
  );

  return <AuthContext.Provider value={nilai}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const konteks = useContext(AuthContext);
  if (konteks === null) {
    throw new Error('useAuth harus dipakai di dalam <AuthProvider>.');
  }
  return konteks;
}
