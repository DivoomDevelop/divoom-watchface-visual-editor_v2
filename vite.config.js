import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  publicDir: "public",
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src")
    }
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true
  }
});
