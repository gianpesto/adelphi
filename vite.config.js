import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

console.log(process.env.VITE_BASE_URL)

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_URL,
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  optimizeDeps: {
    include: ['@fawmi/vue-google-maps', 'fast-deep-equal']
  }
})
