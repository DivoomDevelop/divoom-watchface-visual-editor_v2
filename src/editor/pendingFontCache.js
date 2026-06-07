/** 待下载字体扫描结果（localStorage，跨会话保留）。 */

export const PENDING_FONT_CACHE_KEY = "divoom_pending_font_scan_v1";

export function countPendingFontItems(items) {
  let n = 0;
  for (const item of Array.isArray(items) ? items : []) {
    if (item?.status !== "installed") n += 1;
  }
  return n;
}

export function serializePendingFontCache({ items, savedAt }) {
  return {
    version: 1,
    savedAt: savedAt || new Date().toISOString(),
    items: (Array.isArray(items) ? items : []).map((it) => ({
      id: Number(it?.id),
      type: Number(it?.type ?? 1),
      url: String(it?.url || ""),
      charset: String(it?.charset || ""),
      name: String(it?.name || ""),
      reason: it?.reason === "outdated" || it?.reason === "file_missing" ? it.reason : "missing",
      status: it?.status === "installed" ? "installed" : "pending",
      selected: it?.selected !== false
    }))
  };
}

export function parsePendingFontCache(raw) {
  if (!raw || typeof raw !== "object" || !Array.isArray(raw.items)) return null;
  const items = [];
  for (const it of raw.items) {
    const id = Number(it?.id);
    if (!Number.isFinite(id) || id <= 0) continue;
    items.push({
      id,
      type: Number(it?.type ?? 1),
      url: String(it?.url || ""),
      charset: String(it?.charset || ""),
      name: String(it?.name || ""),
      reason: it?.reason === "outdated" || it?.reason === "file_missing" ? it.reason : "missing",
      status: it?.status === "installed" ? "installed" : "pending",
      selected: it?.selected !== false
    });
  }
  if (!items.length) return null;
  return {
    items,
    savedAt: String(raw.savedAt || "")
  };
}

export function loadPendingFontCacheFromStorage() {
  try {
    const text = localStorage.getItem(PENDING_FONT_CACHE_KEY);
    if (!text) return null;
    return parsePendingFontCache(JSON.parse(text));
  } catch {
    return null;
  }
}

export function savePendingFontCacheToStorage(payload) {
  try {
    const pending = countPendingFontItems(payload?.items);
    if (!pending) {
      localStorage.removeItem(PENDING_FONT_CACHE_KEY);
      return;
    }
    localStorage.setItem(
      PENDING_FONT_CACHE_KEY,
      JSON.stringify(
        serializePendingFontCache({
          items: payload.items,
          savedAt: payload.savedAt || new Date().toISOString()
        })
      )
    );
  } catch {
    /* ignore */
  }
}

export async function reconcilePendingFontItems(items, { loadFontInfo, checkFontFileExists }) {
  if (!Array.isArray(items)) return { items: [], removed: 0 };
  const localInfo = await loadFontInfo?.().catch(() => ({ FontList: [] }));
  const localIds = new Set(
    (Array.isArray(localInfo?.FontList) ? localInfo.FontList : [])
      .map((row) => Number(row?.id ?? row?.ID))
      .filter((n) => Number.isFinite(n) && n > 0)
  );

  const out = [];
  let removed = 0;
  for (const item of items) {
    if (item.status === "installed") {
      removed += 1;
      continue;
    }
    if (item.reason === "missing" && localIds.has(item.id)) {
      let hasFile = false;
      try {
        hasFile = await checkFontFileExists(item.id);
      } catch {
        hasFile = false;
      }
      if (hasFile) {
        removed += 1;
        continue;
      }
      item = { ...item, reason: "file_missing" };
    } else if (item.reason === "file_missing" || item.reason === "outdated") {
      let hasFile = false;
      try {
        hasFile = await checkFontFileExists(item.id);
      } catch {
        hasFile = false;
      }
      if (localIds.has(item.id) && hasFile && item.reason === "file_missing") {
        removed += 1;
        continue;
      }
    }
    out.push(item);
  }
  return { items: out, removed };
}
