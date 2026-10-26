const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const APP_ORIGIN = "timeframe://app";
const MAX_WRITE_BYTES = 50 * 1024 * 1024;

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".cfg": "application/json; charset=utf-8",
  ".wasm": "application/wasm",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

function jsonResponse(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}

function resourcePath(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    throw new Error("invalid URL encoding");
  }
  if (decoded.includes("\\") || decoded.includes("\0")) throw new Error("invalid resource path");
  const relative = decoded.replace(/^\/+/, "") || "index.html";
  if (relative.split("/").some((part) => part === ".." || part === "." || !part)) {
    throw new Error("invalid resource path");
  }
  return relative;
}

function writablePath(input) {
  const rel = String(input || "").replace(/\\/g, "/").replace(/^\/+/, "");
  if (rel.includes("..") || rel.includes("\0")) throw new Error("invalid write path");
  if (/^template\/config\/\d+\.cfg$/.test(rel)) return rel;
  if (/^template\/(?:15|29)\/\d+\.(?:bin|png|jpe?g|gif|webp|bmp)$/i.test(rel) ||
      /^template\/29\/timeframe-\d+\.(?:bin|png|jpe?g|gif|webp|bmp)$/i.test(rel) ||
      /^template\/33\/\d+(?:\.app)?\.(?:bin|png|jpe?g|gif|webp|bmp)$/i.test(rel)) return rel;
  if (rel === "template/classify-cache.json") return rel;
  if (rel === "font/font_info.cfg" || /^font\/\d+\.bin$/i.test(rel)) return rel;
  if (rel === "disp/disp_info.cfg") return rel;
  throw new Error("write path is not allowed");
}

function inside(root, relative) {
  const target = path.resolve(root, relative);
  const fromRoot = path.relative(root, target);
  if (!fromRoot || fromRoot.startsWith("..") || path.isAbsolute(fromRoot)) {
    throw new Error("resource path escapes root");
  }
  return target;
}

async function fileExists(file) {
  try {
    return (await fs.stat(file)).isFile();
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

function resolveLanTarget(raw) {
  const target = new URL(String(raw || ""));
  const parts = target.hostname.split(".").map(Number);
  const privateIpv4 = parts.length === 4 && parts.every((part) => Number.isInteger(part) && part >= 0 && part <= 255) && (
    parts[0] === 10 ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168) ||
    (parts[0] === 127 && parts[1] === 0 && parts[2] === 0 && parts[3] === 1)
  );
  if (!privateIpv4 || target.protocol !== "http:" || target.port !== "9000" ||
      target.username || target.password || target.pathname !== "/" || target.search || target.hash) {
    throw new Error("invalid LAN device target");
  }
  return target.origin;
}

function proxyTarget(url, headers) {
  const routes = [
    ["/divoom-cloud-proxy/", "https://app.divoom-gz.com"],
    ["/divoom-cdn-proxy/", "https://f.divoom-gz.com"],
    ["/divoom-china-review-api/", "https://appchina.divoom-gz.com"],
    ["/divoom-china-api/", "http://appchina.divoom-gz.com:9506"]
  ];
  for (const [prefix, origin] of routes) {
    if (url.pathname.startsWith(prefix)) {
      return origin + url.pathname.slice(prefix.length - 1) + url.search;
    }
  }
  if (url.pathname.startsWith("/divoom-proxy/")) {
    const origin = resolveLanTarget(headers.get("x-divoom-lan-target"));
    return origin + url.pathname.slice("/divoom-proxy".length) + url.search;
  }
  return null;
}

async function proxyRequest(request, target, net) {
  const headers = new Headers(request.headers);
  for (const name of ["host", "origin", "referer", "content-length", "accept-encoding", "x-divoom-lan-target"]) {
    headers.delete(name);
  }
  const method = request.method.toUpperCase();
  const body = method === "GET" || method === "HEAD"
    ? undefined
    : Buffer.from(await request.arrayBuffer());
  try {
    return await net.fetch(target, { method, headers, body, redirect: "follow" });
  } catch (error) {
    return jsonResponse(502, { error: error.message || "proxy request failed" });
  }
}

async function readJsonRequest(request) {
  const raw = await request.text();
  if (raw.length > MAX_WRITE_BYTES * 1.4) throw new Error("request body too large");
  return JSON.parse(raw);
}

async function atomicWrite(file, bytes) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.tmp-${process.pid}-${crypto.randomUUID()}`;
  try {
    await fs.writeFile(temp, bytes);
    await fs.rename(temp, file);
  } finally {
    await fs.rm(temp, { force: true });
  }
}

async function handleWriteApi(request, url, assetRoot) {
  const route = url.pathname;
  if (route === "/api/template-sync/health" && request.method === "GET") {
    return jsonResponse(200, { ok: true });
  }
  if (request.method !== "POST") return jsonResponse(405, { error: "method not allowed" });
  try {
    const body = await readJsonRequest(request);
    if (route === "/api/template-sync/classify") {
      if (!body?.data || typeof body.data !== "object" || Array.isArray(body.data)) {
        throw new Error("missing classify data");
      }
      const relative = "template/classify-cache.json";
      await atomicWrite(inside(assetRoot, relative), JSON.stringify(body.data, null, 2));
      return jsonResponse(200, { ok: true, relPath: relative });
    }
    if (route !== "/api/template-sync/write" && route !== "/api/template-sync/delete") {
      return jsonResponse(404, { error: "not found" });
    }
    const relative = writablePath(body?.relPath);
    const file = inside(assetRoot, relative);
    const tombstone = `${file}.deleted`;
    if (route.endsWith("/delete")) {
      const deleted = await fileExists(file);
      await fs.rm(file, { force: true });
      await atomicWrite(tombstone, "");
      return jsonResponse(200, { ok: true, relPath: relative, deleted });
    }
    const base64 = String(body?.base64 || "");
    if (!base64 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(base64)) {
      throw new Error("invalid base64");
    }
    const bytes = Buffer.from(base64, "base64");
    if (bytes.length > MAX_WRITE_BYTES) throw new Error("file too large");
    await atomicWrite(file, bytes);
    await fs.rm(tombstone, { force: true });
    return jsonResponse(200, { ok: true, relPath: relative, bytes: bytes.length });
  } catch (error) {
    return jsonResponse(400, { error: error.message || String(error) });
  }
}

async function serveFile(request, url, bundleRoot, assetRoot) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("method not allowed", { status: 405 });
  }
  let relative;
  try {
    relative = resourcePath(url.pathname);
  } catch {
    return new Response("bad path", { status: 400 });
  }
  const overlay = inside(assetRoot, relative);
  if (await fileExists(`${overlay}.deleted`)) return new Response("not found", { status: 404 });
  const file = await fileExists(overlay) ? overlay : inside(bundleRoot, relative);
  if (!await fileExists(file)) return new Response("not found", { status: 404 });
  const type = contentTypes[path.extname(file).toLowerCase()] || "application/octet-stream";
  const headers = { "content-type": type, "cache-control": "no-cache" };
  if (relative === "index.html") {
    headers["content-security-policy"] = "default-src 'self' data: blob:; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https: http:; connect-src 'self' data: blob: https: http:; object-src 'none'; base-uri 'self'";
  }
  return new Response(request.method === "HEAD" ? null : await fs.readFile(file), { status: 200, headers });
}

// TimeFrame's existing browser reads a numeric .cfg directory index. Merge the
// read-only bundle with downloaded overrides, honoring deletions in the overlay.
async function serveTemplateIndex(request, bundleRoot, assetRoot) {
  if (request.method !== "GET" && request.method !== "HEAD") return new Response("method not allowed", { status: 405 });
  const names = new Set();
  for (const root of [bundleRoot, assetRoot]) {
    let entries;
    try { entries = await fs.readdir(path.join(root, "template/config"), { withFileTypes: true }); }
    catch (error) { if (error.code === "ENOENT") continue; throw error; }
    for (const entry of entries) {
      if (entry.isFile() && /^\d+\.cfg$/.test(entry.name)) names.add(entry.name);
    }
  }
  const visible = [];
  for (const name of [...names].sort((a, b) => parseInt(a, 10) - parseInt(b, 10))) {
    if (!await fileExists(path.join(assetRoot, "template/config", name + ".deleted"))) visible.push(name);
  }
  return new Response(request.method === "HEAD" ? null : visible.map(name => `<a href="${name}">${name}</a>`).join("\n"), {
    status: 200, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }
  });
}

async function handleAppRequest(request, { bundleRoot, assetRoot, net }) {
  const url = new URL(request.url);
  if (url.protocol !== "timeframe:" || url.host !== "app") {
    return new Response("not found", { status: 404 });
  }
  if (url.pathname.startsWith("/api/template-sync/")) return handleWriteApi(request, url, assetRoot);
  if (url.pathname === "/template/config/") return serveTemplateIndex(request, bundleRoot, assetRoot);
  let target;
  try {
    target = proxyTarget(url, request.headers);
  } catch (error) {
    return jsonResponse(400, { error: error.message });
  }
  if (target) return proxyRequest(request, target, net);
  return serveFile(request, url, bundleRoot, assetRoot);
}

module.exports = { APP_ORIGIN, handleAppRequest, resolveLanTarget, resourcePath, writablePath, proxyTarget };
