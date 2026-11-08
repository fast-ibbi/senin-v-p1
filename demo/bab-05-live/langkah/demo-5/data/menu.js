// data/menu.js — tambahan untuk Demo 5
export const menuPanjang = Array.from({ length: 200 }, (_, i) => ({
  id: `p${i + 1}`,
  nama: `Menu uji ${i + 1}`,
  harga: 5000 + (i % 10) * 1000,
  stok: i % 7,
}));
