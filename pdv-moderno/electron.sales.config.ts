import react from "@vitejs/plugin-react";
import { defineConfig } from "electron-vite";
import { resolve } from "node:path";

const projectRoot = resolve(".");
const sharedRoot = resolve(projectRoot, "src/shared");
const sharedPublicRoot = resolve(projectRoot, "src/shared/public");
const rendererRoot = resolve(projectRoot, "apps/sales/renderer");

export default defineConfig({
  main: {
    build: {
      outDir: "out/sales/main",
      rollupOptions: {
        input: resolve(projectRoot, "apps/sales/electron/main.ts"),
      },
    },
  },
  preload: {
    build: {
      outDir: "out/sales/preload",
      rollupOptions: {
        input: resolve(projectRoot, "apps/sales/electron/preload.ts"),
      },
    },
  },
  renderer: {
    root: rendererRoot,
    publicDir: sharedPublicRoot,
    plugins: [react()],
    server: {
      host: "localhost",
      port: 5173,
      strictPort: true,
    },
    resolve: {
      alias: {
        "@shared": sharedRoot,
        "@sales": resolve(rendererRoot, "src"),
      },
    },
    build: {
      outDir: resolve(projectRoot, "out/sales/renderer"),
      emptyOutDir: true,
      rollupOptions: {
        input: resolve(rendererRoot, "index.html"),
      },
    },
  },
});
