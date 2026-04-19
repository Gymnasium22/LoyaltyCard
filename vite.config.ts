import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/LoyaltyCard/',  // ← ЗАМЕНИ на название своего репозитория!
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})