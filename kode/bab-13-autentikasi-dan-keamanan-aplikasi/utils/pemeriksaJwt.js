/**
 * Pemeriksa JWT di sisi aplikasi.
 *
 * PENTING — baca sebelum memakai fungsi ini:
 * Membaca isi token **bukan** memverifikasi keasliannya. Siapa pun bisa membuat
 * token palsu dengan payload apa pun; yang membuktikan keaslian adalah tanda
 * tangan HMAC/RSA yang hanya bisa diperiksa dengan kunci rahasia di server.
 *
 * Jadi fungsi di sini hanya dipakai untuk hal yang aman dilakukan tanpa kunci:
 *   - menampilkan tanggal kedaluwarsa
 *   - membuang token yang jelas sudah kedaluwarsa sebelum mengirim permintaan
 *
 * Semua keputusan keamanan tetap di server. Itu sebabnya `requireAuth` di backend
 * memanggil `jwt.verify`, bukan sekadar membaca payload.
 */

/** base64url → objek JSON. Buffer tidak tersedia di React Native, jadi atob + decodeURIComponent. */
export function bacaPayload(token) {
  if (typeof token !== 'string') return null;
  const bagian = token.split('.');
  if (bagian.length !== 3) return null;

  try {
    const base64 = bagian[1].replace(/-/g, '+').replace(/_/g, '/');
    const dilengkapi = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = decodeURIComponent(
      atob(dilengkapi)
        .split('')
        .map((huruf) => `%${`00${huruf.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * @param {string} token
 * @param {number} sekarangDetik  bisa diisi saat pengujian supaya hasilnya deterministik
 */
export function sudahKedaluwarsa(token, sekarangDetik = Math.floor(Date.now() / 1000)) {
  const payload = bacaPayload(token);
  if (!payload || typeof payload.exp !== 'number') {
    // Tanpa `exp`, token tidak bisa dinilai; anggap perlu login ulang.
    return true;
  }
  return payload.exp <= sekarangDetik;
}

/** Sisa umur token dalam detik; negatif berarti sudah lewat. */
export function sisaUmurDetik(token, sekarangDetik = Math.floor(Date.now() / 1000)) {
  const payload = bacaPayload(token);
  if (!payload || typeof payload.exp !== 'number') return 0;
  return payload.exp - sekarangDetik;
}
