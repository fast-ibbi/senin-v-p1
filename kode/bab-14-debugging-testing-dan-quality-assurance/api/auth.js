import { permintaan } from './client.js';

/**
 * Login ke server, menerima token.
 *
 * Jawaban server: { token, expiresIn, data: mahasiswa }
 * Password tidak pernah disimpan di aplikasi — hanya dikirim sekali, lalu dilupakan.
 */
export async function login(nim, password) {
  const hasil = await permintaan('/api/auth/login', {
    metode: 'POST',
    data: { nim, password },
    abaikan401: true,
  });

  return {
    token: hasil.token,
    expiresIn: hasil.expiresIn,
    pengguna: hasil.data,
  };
}
