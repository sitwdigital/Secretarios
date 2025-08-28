import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // saída padrão do Vite
  },
  server: {
    port: 5173, // porta local padrão
    host: true, // permite acessar via rede/local
  },
  preview: {
    port: 4173,
    host: true,
  },
})