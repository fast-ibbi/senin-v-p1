/**
 * Perkakas token JWT.
 *
 * Satu tempat untuk menandatangani dan memeriksa token, supaya route tidak pernah
 * menyentuh jsonwebtoken secara langsung. Rahasia diambil dari environment
 * variable JWT_SECRET; nilai cadangan hanya untuk praktikum di laptop.
 */
import jwt from 'jsonwebtoken';

const RAHASIA = process.env.JWT_SECRET ?? 'rahasia-praktikum-siakad';
const MASA_BERLAKU = process.env.JWT_EXPIRES_IN ?? '2h';

/** Payload sengaja minimal: hanya identitas, tidak ada data sensitif. */
function buatToken(mhs) {
  return jwt.sign({ sub: mhs.nim, nama: mhs.nama }, RAHASIA, { expiresIn: MASA_BERLAKU });
}

function bacaToken(token) {
  return jwt.verify(token, RAHASIA);
}

export { buatToken, bacaToken, MASA_BERLAKU };
