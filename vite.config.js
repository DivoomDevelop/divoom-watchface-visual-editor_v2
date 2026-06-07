import fs from "node:fs";
import path from "node:path";
import httpProxy from "http-proxy";
import { defineConfig, loadEnv } from "vite";

const publicRoot = path.resolve(process.cwd(), "public");
const templateRoot = path.join(publicRoot, "template");
const fontRoot = path.join(publicRoot, "font");
const templateSyncAllowed = new Set(["config", "15", "29", "33"]);

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

function assertDevSyncRelPath(relPath) {
  const norm = String(relPath || "").replace(/\\/g, "/").replace(/^\/+/, "");
  if (norm.includes("..")) {
    throw new Error(`invalid path: ${relPath}`);
  }

  const tpl = norm.match(/^template\/(config|15|29|33)\/([^/]+)$/);
  if (tpl && templateSyncAllowed.has(tpl[1])) {
    return {
      norm,
      absPath: path.join(templateRoot, tpl[1], tpl[2]),
      mkdir: path.join(templateRoot, tpl[1])
    };
  }

  if (norm === "font/font_info.cfg") {
    return {
      norm,
      absPath: path.join(fontRoot, "font_info.cfg"),
      mkdir: fontRoot
    };
  }

  const fontBin = norm.match(/^font\/(\d+)\.bin$/i);
  if (fontBin) {
    return {
      norm: `font/${fontBin[1]}.bin`,
      absPath: path.join(fontRoot, `${fontBin[1]}.bin`),
      mkdir: fontRoot
    };
  }

  throw new Error(`invalid dev-sync path: ${relPath}`);
}

function sendJson(res, status, obj) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json;charset=UTF-8");
  res.end(JSON.stringify(obj));
}

/** 开发态：将商店表盘同步结果写入 public/template（仅本地 npm run dev）。 */
function createTemplateSyncApiMiddleware() {
  return async function templateSyncApi(req, res, next) {
    const url = req.url?.split("?")[0] || "";
    if (!url.startsWith("/api/template-sync")) return next();

    if (url === "/api/template-sync/health" && req.method === "GET") {
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method !== "POST") {
      sendJson(res, 405, { error: "method not allowed" });
      return;
    }

    let body;
    try {
      body = await readJsonBody(req);
    } catch {
      sendJson(res, 400, { error: "invalid JSON body" });
      return;
    }

    try {
      if (url === "/api/template-sync/write") {
        const { norm, absPath, mkdir } = assertDevSyncRelPath(body?.relPath);
        const b64 = String(body?.base64 || "");
        if (!b64) throw new Error("missing base64");
        const buf = Buffer.from(b64, "base64");
        fs.mkdirSync(mkdir, { recursive: true });
        fs.writeFileSync(absPath, buf);
        sendJson(res, 200, { ok: true, relPath: norm, bytes: buf.length });
        return;
      }

      if (url === "/api/template-sync/classify") {
        const data = body?.data;
        if (!data || typeof data !== "object") throw new Error("missing data");
        fs.mkdirSync(templateRoot, { recursive: true });
        const outPath = path.join(templateRoot, "classify-cache.json");
        fs.writeFileSync(outPath, JSON.stringify(data, null, 2), "utf8");
        sendJson(res, 200, { ok: true, relPath: "template/classify-cache.json" });
        return;
      }

      sendJson(res, 404, { error: "not found" });
    } catch (e) {
      sendJson(res, 400, { error: e?.message || String(e) });
    }
  };
}

const defaultLanTarget = process.env.DIVOOM_LAN_TARGET || "http://127.0.0.1:9000";

const cloudProxy = {
  target: "https://app.divoom-gz.com",
  changeOrigin: true,
  secure: true,
  rewrite: (p) => p.replace(/^\/divoom-cloud-proxy/, "")
};

const defaultChinaApiTarget =
  process.env.DIVOOM_CHINA_API_TARGET || "http://appchina.divoom-gz.com:9506";

function createChinaStoreApiMiddleware() {
  const proxy = httpProxy.createProxyServer({
    changeOrigin: true,
    secure: false
  });
  const target = defaultChinaApiTarget.replace(/\/$/, "");
  return function divoomChinaApiProxy(req, res, next) {
    if (!req.url?.startsWith("/divoom-china-api")) return next();
    const pathOnly = req.url.replace(/^\/divoom-china-api/, "") || "/";
    req.url = pathOnly;
    proxy.web(req, res, { target }, (err) => {
      console.error("[divoom-china-api]", err?.message || err);
      if (!res.headersSent) {
        res.statusCode = 502;
        res.end("Bad Gateway");
      }
    });
  };
}

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
          server.middlewares.use(createTemplateSyncApiMiddleware());
          server.middlewares.use(createChinaStoreApiMiddleware());
          server.middlewares.use(createLanProxyMiddleware());
        },
        configurePreviewServer(server) {
          server.middlewares.use(createTemplateSyncApiMiddleware());
          server.middlewares.use(createChinaStoreApiMiddleware());
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
        "/divoom-cloud-proxy": cloudProxy,
        "/divoom-cdn-proxy": {
          target: "https://f.divoom-gz.com",
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/divoom-cdn-proxy/, "")
        }
      }
    },
    preview: {
      proxy: {
        "/divoom-cloud-proxy": cloudProxy,
        "/divoom-cdn-proxy": {
          target: "https://f.divoom-gz.com",
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/divoom-cdn-proxy/, "")
        }
      }
    },
    build: {
      outDir: "dist",
      assetsDir: "assets",
      emptyOutDir: true
    }
  };
});
