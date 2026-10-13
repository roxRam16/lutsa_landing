import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// API LUTSA-CORE local (lutsa_core/, puerto 8090).
const apiTarget = 'http://localhost:8090';

export default defineConfig({
  plugins: [react()],
  server: {
    // Permite abrir el servidor de desarrollo desde un túnel de ngrok (para probar en celular/tableta)
    allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev', '.ngrok.app'],
    // En desarrollo, /api se reenvía al API: funciona igual en localhost y a través de ngrok
    // con UN solo túnel (el de la landing), sin abrir otro para el API ni configurar CORS.
    proxy: { '/api': { target: apiTarget, changeOrigin: true } },
  },
});
