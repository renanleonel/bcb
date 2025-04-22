import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
  },
  plugins: react(),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}));
