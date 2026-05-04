import react from "@vitejs/plugin-react";
import { defineConfig } from "electron-vite";
import { resolve } from "node:path";

const projectRoot = resolve(".");
const sharedRoot = resolve(projectRoot, "src/shared");
const sharedPublicRoot = resolve(projectRoot, "src/shared/public");
const rendererRoot = resolve(projectRoot, "apps/management/renderer");

export default defineConfig({
  main: {
    build: {
      outDir: "out/management/main",
      rollupOptions: {
        input: resolve(projectRoot, "apps/management/electron/main.ts"),
      },
    },
  },
  preload: {
    build: {
      outDir: "out/management/preload",
      rollupOptions: {
        input: resolve(projectRoot, "apps/management/electron/preload.ts"),
      },
    },
  },
  renderer: {
    root: rendererRoot,
    publicDir: sharedPublicRoot,
    plugins: [react()],
    server: {
      host: "localhost",
      port: 5174,
      strictPort: true,
    },
    resolve: {
      alias: {
        "@shared": sharedRoot,
        "@management": resolve(rendererRoot, "src"),
      },
    },
    build: {
      outDir: resolve(projectRoot, "out/management/renderer"),
      emptyOutDir: true,
      rollupOptions: {
        input: resolve(rendererRoot, "index.html"),
      },
    },
  },
});
