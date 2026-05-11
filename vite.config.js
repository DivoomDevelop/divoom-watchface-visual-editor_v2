import path from "node:path";
import { defineConfig } from "vite";

function stripCrossoriginFromHtml() {
  return {
    name: "strip-crossorigin-html",
    apply: "build",
    transformIndexHtml(html) {
      return html.replace(/\s+crossorigin(?:="anonymous")?/gi, "");
    }
  };
}

export default defineConfig({
  root: ".",
  /** 相对路径，便于 dist 整夹拷贝；若要从本机直接打开 HTML，仍需用一键脚本或本地 HTTP（浏览器限制 file:// 读相邻文件）。 */
  base: "./",
  publicDir: "public",
  plugins: [stripCrossoriginFromHtml()],
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
