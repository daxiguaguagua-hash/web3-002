import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_APP_MODE': JSON.stringify(env.VITE_APP_MODE || 'mock'),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || ''),
    },
    resolve: {
      alias: { '@': path.resolve(__dirname, '.') },
    },
  };
});
