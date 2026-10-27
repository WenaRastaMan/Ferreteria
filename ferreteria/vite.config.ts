/// <reference types="vitest/config" />
/* Configuración de Vite (desarrollo y build) y de Vitest (pruebas).
   Las pruebas corren en "jsdom": un navegador simulado dentro de Node,
   así no hace falta abrir Chrome para probar los componentes. */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // xlsx y chart.js pesan; se sube el límite del aviso de tamaño del build
  build: { chunkSizeWarningLimit: 1000 },
  test: {
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    css: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/tests/**', 'src/data/**'],
      reporter: ['text', 'html'],
    },
  },
})
