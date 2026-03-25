import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const projectRoot = resolve('.');
const rendererRoot = resolve(projectRoot, 'src/renderer');
const rendererSourceRoot = resolve(rendererRoot, 'src');
const sharedRoot = resolve(projectRoot, 'src/shared');

export default defineConfig({
  root: rendererRoot,
  plugins: [react()],
  resolve: {
    alias: {
      '@': rendererSourceRoot,
      '@shared': sharedRoot,
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
  },
});
