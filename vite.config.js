import path from "node:path";
import httpProxy from "http-proxy";
import { defineConfig, loadEnv } from "vite";

const defaultLanTarget = process.env.DIVOOM_LAN_TARGET || "http://127.0.0.1:9000";

const cloudProxy = {
  target: "https://app.divoom-gz.com",
  changeOrigin: true,
  secure: true,
  rewrite: (p) => p.replace(/^\/divoom-cloud-proxy/, "")
};

function createLanProxyMiddleware() {
  const proxy = httpProxy.createProxyServer({
    xfwd: true,
    changeOrigin: true,
    secure: false
  });
  return function divoomLanProxy(req, res, next) {
    if (!req.url?.startsWith("/divoom-proxy")) return next();
    const raw = req.headers["x-divoom-lan-target"];
    let target = defaultLanTarget.replace(/\/$/, "");
    if (typeof raw === "string") {
      const t = raw.trim();
      if (/^https?:\/\//i.test(t)) target = t.replace(/\/$/, "");
    }
    const pathOnly = req.url.replace(/^\/divoom-proxy/, "") || "/";
    req.url = pathOnly;
    proxy.web(req, res, { target }, (err) => {
      console.error("[divoom-proxy]", err?.message || err);
      if (!res.headersSent) {
        res.statusCode = 502;
        res.end("Bad Gateway");
      }
    });
  };
}

function stripCrossoriginFromHtml() {
  return {
    name: "strip-crossorigin-html",
    apply: "build",
    transformIndexHtml(html) {
      return html.replace(/\s+crossorigin(?:="anonymous")?/gi, "");
    }
  };
}

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), "");
  return {
    root: ".",
    /** 相对路径，便于 dist 整夹拷贝；若要从本机直接打开 HTML，仍需用一键脚本或本地 HTTP（浏览器限制 file:// 读相邻文件）。 */
    base: "./",
    publicDir: "public",
    plugins: [
      stripCrossoriginFromHtml(),
      {
        name: "divoom-dynamic-lan-proxy",
        configureServer(server) {
          server.middlewares.use(createLanProxyMiddleware());
        },
        configurePreviewServer(server) {
          server.middlewares.use(createLanProxyMiddleware());
        }
      }
    ],
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "src")
      }
    },
    server: {
      proxy: {
        "/divoom-cloud-proxy": cloudProxy
      }
    },
    preview: {
      proxy: {
        "/divoom-cloud-proxy": cloudProxy
      }
    },
    build: {
      outDir: "dist",
      assetsDir: "assets",
      emptyOutDir: true
    }
  };
});
