import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { twTokens } from './scripts/tw-tokens.ts';

export default defineConfig({
  plugins: [react(), tailwindcss(), twTokens()],
  server: { port: 5174 },
  preview: { port: 4174 }
});