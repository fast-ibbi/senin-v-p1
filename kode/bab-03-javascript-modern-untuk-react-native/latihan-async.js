/**
 * Latihan 3 — pola asinkron: Promise, async/await, try/catch.
 *
 * Jalankan:
 *   node latihan-async.js
 *   node latihan-async.js --gagal      (melihat jalur error)
 *
 * Yang dilatih: fungsi yang butuh waktu mengembalikan Promise; `await` membuat
 * kode asinkron terbaca seperti kode biasa; `try/catch` menangkap kegagalan
 * jaringan. Pola inilah yang dipakai `fetch` di bab 10.
 */

/**
 * Meniru panggilan API: jawabannya tidak langsung tersedia.
 * Fungsi `async` selalu mengembalikan Promise, sekalipun isinya nilai biasa.
 */
function ambilNilaiDariServer(nim, { gagal = false } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (gagal) {
        reject(new Error('Koneksi ke server gagal (simulasi).'));
        return;
      }
      resolve([
        { nim, kode: 'SI301', nilaiHuruf: 'A', sks: 3 },
        { nim, kode: 'SI302', nilaiHuruf: 'A-', sks: 3 },
      ]);
    }, 400);
  });
}

const BOBOT = { A: 4, 'A-': 3.7, 'B+': 3.3, B: 3 };

/** IPK dihitung setelah data benar-benar tiba. */
async function tampilkanIpk(nim, opsi) {
  console.log(`Meminta nilai ${nim} ...`);

  try {
    const daftar = await ambilNilaiDariServer(nim, opsi);
    const { mutu, sks } = daftar.reduce(
      (akumulasi, baris) => ({
        mutu: akumulasi.mutu + baris.sks * (BOBOT[baris.nilaiHuruf] ?? 0),
        sks: akumulasi.sks + baris.sks,
      }),
      { mutu: 0, sks: 0 },
    );

    console.log(`${daftar.length} nilai diterima.`);
    console.log(`IPK: ${(mutu / sks).toFixed(2)} dari ${sks} SKS`);
  } catch (error) {
    // Satu tempat menangani kegagalan; pemanggil tidak perlu tahu detailnya.
    console.error(`Gagal: ${error.message}`);
    console.error('Coba lagi beberapa saat lagi.');
  } finally {
    // Selalu dijalankan, baik berhasil maupun gagal.
    console.log('Selesai meminta data.');
  }
}

const modeGagal = process.argv.includes('--gagal');

// await di top-level boleh karena file ini modul ESM ("type": "module").
await tampilkanIpk('20230001', { gagal: modeGagal });
