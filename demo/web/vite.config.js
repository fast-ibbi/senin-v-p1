import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Aplikasi demo web dibangun ke dist/demo/ (repo root), dipublikasikan di
 * GitHub Pages sebagai /senin-v-p1/demo/. Base relatif dipakai supaya app
 * bekerja di mana pun dist/ di-host (HashRouter, tanpa rewrite server).
 */
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '../../dist/demo',
    emptyOutDir: true,
  },
  publicDir: false,
})
