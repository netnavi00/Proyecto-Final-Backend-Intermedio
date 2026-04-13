// Configuracion de Vite para el proyecto React con TypeScript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual del archivo de configuración
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Exportar la configuración de Vite
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});