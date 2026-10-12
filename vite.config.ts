import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Permite abrir el servidor de desarrollo desde un túnel de ngrok (para probar en celular/tableta)
  server: { allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev', '.ngrok.app'] },
});
