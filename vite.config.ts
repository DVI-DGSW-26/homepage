import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { twTokens } from './scripts/tw-tokens.ts';

export default defineConfig({
  plugins: [react(), tailwindcss(), twTokens()],
  server: { host: '127.0.0.1', port: 5173 },
  preview: { host: '127.0.0.1', port: 4173 }
});
