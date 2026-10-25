/**
 * Middleware penjaga route.
 *
 * Tugasnya tiga: memastikan ada header Authorization, memastikan tokennya sah dan
 * belum kedaluwarsa, lalu menempelkan identitas pemiliknya di `req.mahasiswa`.
 *
 * Kode error dibedakan supaya aplikasi bisa membedakan dua tindakan:
 *   TOKEN_KEDALUWARSA → sesi habis, arahkan ke login
 *   TOKEN_TIDAK_VALID → token rusak/dipalsukan, hapus dari SecureStore
 */
import { muat } from '../lib/store.js';
import { bacaToken } from '../lib/token.js';

function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? '';
  const [skema, token] = header.split(' ');

  if (skema !== 'Bearer' || !token) {
    return res.status(401).json({
      kode: 'TOKEN_TIDAK_ADA',
      pesan: 'Permintaan ini butuh token. Login dulu.',
    });
  }

  try {
    const payload = bacaToken(token);
    const mhs = muat().mahasiswa.find((baris) => baris.nim === payload.sub);

    if (!mhs) {
      return res.status(401).json({
        kode: 'TOKEN_TIDAK_VALID',
        pesan: 'Token menunjuk akun yang tidak ada.',
      });
    }

    const { password, ...tanpaPassword } = mhs;
    req.mahasiswa = tanpaPassword;
    return next();
  } catch (err) {
    const kedaluwarsa = err.name === 'TokenExpiredError';
    return res.status(401).json({
      kode: kedaluwarsa ? 'TOKEN_KEDALUWARSA' : 'TOKEN_TIDAK_VALID',
      pesan: kedaluwarsa
        ? 'Sesi kamu sudah habis. Silakan login ulang.'
        : 'Token tidak valid. Silakan login ulang.',
    });
  }
}

export { requireAuth };
