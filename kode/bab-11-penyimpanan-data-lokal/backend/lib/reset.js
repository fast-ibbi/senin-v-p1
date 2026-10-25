/**
 * Mengembalikan data ke kondisi seed.
 *
 * Dipakai lewat `npm run api:reset` setiap kali praktikum selesai mencoba POST/DELETE
 * dan KRS kembali menumpuk. Salinan seed tidak pernah diubah oleh route mana pun.
 */
import { copyFileSync } from 'node:fs';
import { join } from 'node:path';

const SEED = join(import.meta.dirname, '..', 'data', 'db.seed.json');
const DATA = join(import.meta.dirname, '..', 'data', 'db.json');

copyFileSync(SEED, DATA);
console.log('Data SIAKAD dikembalikan ke kondisi awal (db.seed.json → db.json).');
