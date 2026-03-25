import { defineConfig } from 'electron-vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const sharedRoot = resolve(projectRoot, 'src/shared');
const rendererRoot = resolve(projectRoot, 'src/renderer');
const rendererSourceRoot = resolve(rendererRoot, 'src');

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@shared': sharedRoot,
      },
    },
  },
  preload: {
    build: {
      externalizeDeps: false,
    },
    resolve: {
      alias: {
        '@shared': sharedRoot,
      },
    },
  },
  renderer: {
    root: rendererRoot,
    plugins: [react()],
    resolve: {
      alias: {
        '@': rendererSourceRoot,
        '@shared': sharedRoot,
      },
    },
  },
});
