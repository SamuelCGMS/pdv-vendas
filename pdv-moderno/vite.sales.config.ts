import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from "node:path";

const projectRoot = resolve(".");
const rendererRoot = resolve(projectRoot, "apps/sales/renderer");
const sharedPublicRoot = resolve(projectRoot, "src/shared/public");

export default defineConfig({
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
      "@shared": resolve(projectRoot, "src/shared"),
      "@sales": resolve(rendererRoot, "src"),
    },
  },
  build: {
    outDir: resolve(projectRoot, "out/web-sales"),
    emptyOutDir: true,
  },
});
