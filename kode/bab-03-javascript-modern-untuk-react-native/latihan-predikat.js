/**
 * Latihan 1 — `map` + percabangan.
 *
 * Jalankan:
 *   node latihan-predikat.js
 *
 * Yang dilatih: `const`, arrow function, `map` menghasilkan array baru,
 * dan percabangan berantai tanpa `else` yang berlebihan.
 */

/** Percabangan berantai: aturan predikat ditulis satu kali saja. */
const tentukanPredikat = (ipk) => {
  if (ipk >= 3.5) return 'Dengan Pujian';
  if (ipk >= 3.0) return 'Sangat Memuaskan';
  if (ipk >= 2.5) return 'Memuaskan';
  if (ipk >= 2.0) return 'Cukup';
  return 'Perlu Perbaikan';
};

const daftarIpk = [3.72, 3.41, 2.88, 2.15, 1.9];

// map: satu baris input → satu baris output, panjang array tetap.
const hasil = daftarIpk.map((ipk) => ({
  ipk,
  predikat: tentukanPredikat(ipk),
}));

console.log('IPK   Predikat');
console.log('---------------');
for (const { ipk, predikat } of hasil) {
  console.log(`${ipk.toFixed(2)}  ${predikat}`);
}

// filter + map: hanya yang di atas 3,0, lalu ambil IPK-nya saja.
const ipkBagus = daftarIpk.filter((ipk) => ipk > 3.0).map((ipk) => ipk.toFixed(2));
console.log(`\nDi atas 3,0: ${ipkBagus.join(', ')}`);
