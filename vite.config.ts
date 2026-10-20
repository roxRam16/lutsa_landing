import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// API LUTSA-CORE local (lutsa_core/, puerto 8090).
const apiTarget = 'http://localhost:8090';

// Carpeta donde se publica el sitio. Raíz ('/') por defecto; la versión de pruebas usa
// `npm run build:pruebas` (modo "pruebas" → .env.pruebas → VITE_BASE=/pruebas/).
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: loadEnv(mode, '.', '').VITE_BASE || '/',
  // La versión de pruebas se compila en su propia carpeta para no mezclarla con la de la raíz
  build: { outDir: mode === 'pruebas' ? 'dist-pruebas' : 'dist' },
  server: {
    // Permite abrir el servidor de desarrollo desde un túnel de ngrok (para probar en celular/tableta)
    allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev', '.ngrok.app'],
    // En desarrollo, /api se reenvía al API: funciona igual en localhost y a través de ngrok
    // con UN solo túnel (el de la landing), sin abrir otro para el API ni configurar CORS.
    proxy: { '/api': { target: apiTarget, changeOrigin: true } },
  },
}));
