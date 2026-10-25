#!/usr/bin/env node
/**
 * Pemeriksa lingkungan pengembangan — bab 1.
 *
 * Jalankan sebelum memasang apa pun:
 *
 *   node cek-lingkungan.js
 *
 * Skrip ini hanya membaca versi perkakas yang sudah ada, tidak memasang apa pun.
 * Gunanya satu: memastikan masalah "aplikasi tidak mau jalan" di pertemuan 2 bukan
 * berasal dari Node.js yang terlalu tua atau npm yang tidak ada.
 */
const { spawnSync } = require('node:child_process');

const SYARAT_NODE = 22;

/** Menjalankan satu perintah dan mengembalikan baris pertamanya. */
function versi(perintah, argumen = ['--version']) {
  const hasil = spawnSync(perintah, argumen, { encoding: 'utf8' });
  if (hasil.error || hasil.status !== 0) {
    return null;
  }
  return (hasil.stdout || hasil.stderr).trim().split('\n')[0];
}

function baris(nama, nilai, status, catatan) {
  const tanda = status === 'ok' ? '[ok]  ' : status === 'warn' ? '[!]   ' : '[x]   ';
  const kanan = (nilai ?? '-').slice(0, 20).padEnd(21);
  console.log(`${tanda}${nama.padEnd(14)}${kanan}${catatan ?? ''}`);
  return status;
}

console.log('\nPemeriksaan lingkungan — Pemrograman Mobile\n');

const status = [];

const node = versi('node');
const nodeMayor = node ? Number(node.replace(/^v/, '').split('.')[0]) : 0;
status.push(
  baris(
    'Node.js',
    node,
    node === null ? 'gagal' : nodeMayor >= SYARAT_NODE ? 'ok' : 'warn',
    node === null
      ? 'tidak ditemukan — pasang dari nodejs.org'
      : nodeMayor >= SYARAT_NODE
        ? `memenuhi syarat >= ${SYARAT_NODE}`
        : `terlalu tua, buku ini memakai Node.js >= ${SYARAT_NODE}`,
  ),
);

const npm = versi('npm');
status.push(
  baris(
    'npm',
    npm,
    npm === null ? 'gagal' : 'ok',
    npm === null ? 'npm biasanya ikut terpasang bersama Node.js' : 'dipakai untuk npm install',
  ),
);

const npx = versi('npx');
status.push(
  baris(
    'npx',
    npx,
    npx === null ? 'gagal' : 'ok',
    npx === null ? 'dipakai untuk npx create-expo-app dan npx expo start' : 'menjalankan paket tanpa memasang global',
  ),
);

const gitMentah = versi('git');
const git = gitMentah ? (gitMentah.match(/git version (\S+)/)?.[1] ?? gitMentah) : null;
status.push(
  baris(
    'git',
    git,
    git === null ? 'warn' : 'ok',
    git === null ? 'opsional, tetapi sangat disarankan untuk menyimpan riwayat' : 'untuk version control',
  ),
);

const expo = versi('npx', ['--no-install', 'expo', '--version']);
status.push(
  baris(
    'expo',
    expo,
    'ok',
    expo === null
      ? 'belum ada di folder ini — normal, akan terpasang saat npm install'
      : 'terpasang lokal di folder ini',
  ),
);

console.log('');

const gagal = status.filter((nilai) => nilai === 'gagal').length;
const peringatan = status.filter((nilai) => nilai === 'warn').length;

if (gagal > 0) {
  console.log(`Hasil: ${gagal} perkakas wajib belum siap. Perbaiki dulu sebelum pertemuan 2.`);
  process.exit(1);
}

if (peringatan > 0) {
  console.log(`Hasil: siap dipakai, dengan ${peringatan} catatan kuning di atas.`);
} else {
  console.log('Hasil: semua perkakas siap. Lanjut ke bab 2.');
}

console.log('\nBerikutnya: buat project pertama dengan');
console.log('  npx create-expo-app siakad-mobile --template blank\n');
