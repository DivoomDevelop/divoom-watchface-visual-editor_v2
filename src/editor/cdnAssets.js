/** Divoom 静态资源 CDN（与固件 DIVOOM_SERVER_DEFAULT_URL 一致）。 */
export const DIVOOM_CDN_BASE = "https://f.divoom-gz.com/";

export function resolveCdnUrl(fileAddr) {
  const path = String(fileAddr || "").trim();
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return DIVOOM_CDN_BASE + path.replace(/^\//, "");
}

/** 开发态经 Vite 代理拉 CDN，避免浏览器跨域。 */
export function resolveCdnFetchUrl(fileAddr, { useProxy = false, origin = "" } = {}) {
  const url = resolveCdnUrl(fileAddr);
  if (!url || !useProxy) return url;
  try {
    const u = new URL(url);
    if (u.hostname.endsWith("divoom-gz.com") && origin) {
      return `${origin.replace(/\/$/, "")}/divoom-cdn-proxy${u.pathname}`;
    }
  } catch {
    /* ignore */
  }
  return url;
}

export function extFromAssetPath(path) {
  const m = String(path || "").match(/\.([a-z0-9]+)(?:\?.*)?$/i);
  return m ? `.${m[1].toLowerCase()}` : ".bin";
}

export async function downloadAssetBytes(fileAddr, { useCdnProxy = false, origin = "", signal } = {}) {
  const url = resolveCdnFetchUrl(fileAddr, { useProxy: useCdnProxy, origin });
  if (!url) throw new Error("empty asset url");
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`asset fetch ${res.status}: ${fileAddr}`);
  }
  return new Uint8Array(await res.arrayBuffer());
}
