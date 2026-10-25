import { useCallback, useEffect, useRef, useState } from 'react';

import { ambilNilai } from '../api/nilai.js';
import { bacaSnapshot, KUNCI, simpanSnapshot, TTL_MS, umurTerbaca } from '../utils/cache.js';

/**
 * Data nilai dengan dua lapis: jaringan dan snapshot lokal.
 *
 * Urutan kerjanya sengaja seperti ini:
 *   1. baca snapshot → tampilkan segera (layar tidak kosong walau jaringan lambat)
 *   2. minta ke server  → kalau berhasil, perbarui layar **dan** snapshot
 *   3. kalau gagal      → tetap tampilkan snapshot, tandai "dari cache"
 *
 * Ini pola *cache-first with fallback*, bukan *network-only*. Bedanya terasa saat
 * demo di kelas: server dimatikan, layar tetap berisi.
 */
export function useNilai(nim, token) {
  const [data, setData] = useState(null);
  const [sumber, setSumber] = useState(null); // 'jaringan' | 'cache'
  const [umur, setUmur] = useState(null);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState(null);
  const hidup = useRef(true);

  useEffect(() => {
    hidup.current = true;
    return () => {
      hidup.current = false;
    };
  }, []);

  const muat = useCallback(async () => {
    setMemuat(true);
    setGalat(null);

    // 1. Snapshot dulu.
    const snapshot = await bacaSnapshot(KUNCI.nilai);
    if (snapshot && hidup.current) {
      setData(snapshot.data);
      setSumber('cache');
      setUmur(snapshot.umurMs);
    }

    // 2. Lalu server.
    try {
      const hasil = await ambilNilai(nim, { token });
      if (!hidup.current) return;
      setData(hasil);
      setSumber('jaringan');
      setUmur(0);
      await simpanSnapshot(KUNCI.nilai, hasil);
    } catch (err) {
      if (!hidup.current) return;
      setGalat({ kode: err.kode, pesan: err.message });
      // Data cache (kalau ada) sengaja tidak dihapus: itu satu-satunya yang tersisa.
    } finally {
      if (hidup.current) setMemuat(false);
    }
  }, [nim, token]);

  useEffect(() => {
    muat();
  }, [muat]);

  return {
    data,
    sumber,
    umur,
    umurTeks: umur === null ? null : umurTerbaca(umur),
    kedaluwarsa: umur !== null && umur > TTL_MS,
    memuat,
    galat,
    muatUlang: muat,
  };
}
