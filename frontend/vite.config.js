import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de Vite: el servidor de desarrollo corre en el puerto 5173.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
})
