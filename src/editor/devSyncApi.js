/** 开发服务器写入 API（vite.config.js → /api/template-sync/*，仅 npm run dev）。 */

function uint8ToBase64(u8) {
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < u8.length; i += chunk) {
    bin += String.fromCharCode.apply(null, u8.subarray(i, i + chunk));
  }
  return btoa(bin);
}

export async function isDevSyncApiAvailable() {
  try {
    const res = await fetch("/api/template-sync/health", { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

/** @deprecated 与 isDevSyncApiAvailable 相同 */
export const isTemplateSyncApiAvailable = isDevSyncApiAvailable;

export async function writeDevFileViaApi(relPath, bytes) {
  const path = String(relPath || "").replace(/\\/g, "/").replace(/^\/+/, "");
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const res = await fetch("/api/template-sync/write", {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ relPath: path, base64: uint8ToBase64(u8) })
  });
  const text = await res.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    /* ignore */
  }
  if (!res.ok) {
    throw new Error(String(data?.error || text || `write failed (${res.status})`));
  }
  return data;
}

export async function saveClassifyCacheViaApi(classifyPayload) {
  const res = await fetch("/api/template-sync/classify", {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ data: classifyPayload })
  });
  const text = await res.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    /* ignore */
  }
  if (!res.ok) {
    throw new Error(String(data?.error || text || `classify save failed (${res.status})`));
  }
  return data;
}

export async function writeFontInfoViaApi(fontInfo) {
  const text = JSON.stringify(fontInfo, null, 4);
  const enc = new TextEncoder();
  return writeDevFileViaApi("font/font_info.cfg", enc.encode(text));
}
