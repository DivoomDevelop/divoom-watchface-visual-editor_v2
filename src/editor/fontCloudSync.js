import { downloadAssetBytes } from "./cdnAssets.js";
import { writeDevFileViaApi, writeFontInfoViaApi } from "./devSyncApi.js";
import {
  localFontFileRelPath,
  mergeFontInfoEntries,
  normalizeFontListEntry
} from "./fontSync.js";

/** @param {Record<string, unknown>} raw */
export function normalizeCloudFontEntry(raw) {
  const id = Number(raw?.id ?? raw?.ID);
  if (!Number.isFinite(id) || id <= 0) return null;
  return {
    id,
    type: Number(raw?.type ?? raw?.Type ?? 1),
    url: String(raw?.url ?? raw?.Url ?? "").trim(),
    charset: String(raw?.charset ?? raw?.charSet ?? raw?.Charset ?? "").trim(),
    name: String(raw?.name ?? raw?.Name ?? raw?.NameEn ?? "").trim()
  };
}

export async function fetchTimeDialFontV2(storeJson) {
  const data = await storeJson("Device/GetTimeDialFontV2", { FontList: [] });
  const list = Array.isArray(data?.FontList) ? data.FontList : [];
  return list.map((row) => normalizeCloudFontEntry(row)).filter(Boolean);
}

/**
 * 对比中国区字体目录与本地 font_info / (id+1).bin，返回待下载项。
 */
export async function scanPendingFontsFromStore({ storeJson, loadFontInfo, checkFontFileExists }) {
  const remoteList = await fetchTimeDialFontV2(storeJson);
  let localInfo = null;
  try {
    localInfo = await loadFontInfo();
  } catch {
    localInfo = { FontList: [] };
  }

  const localById = new Map();
  for (const raw of Array.isArray(localInfo?.FontList) ? localInfo.FontList : []) {
    const norm = normalizeFontListEntry(raw);
    if (norm) localById.set(norm.id, norm);
  }

  const items = [];
  for (const remote of remoteList) {
    const local = localById.get(remote.id);
    let reason = "";
    if (!local) {
      reason = "missing";
    } else {
      let hasFile = false;
      try {
        hasFile = await checkFontFileExists(remote.id);
      } catch {
        hasFile = false;
      }
      if (!hasFile) reason = "file_missing";
      else if (local.url && remote.url && local.url !== remote.url) reason = "outdated";
    }
    if (!reason) continue;
    items.push({
      ...remote,
      name: remote.name || local?.name || `Font ${remote.id}`,
      reason,
      status: "pending",
      selected: true
    });
  }

  items.sort((a, b) => a.id - b.id);
  return { items, remoteTotal: remoteList.length };
}

/**
 * 下载用户勾选的字体：合并 font_info.cfg 并从 CDN 写入 (id+1).bin。
 */
export async function downloadSelectedFontsToLocal({
  items,
  loadFontInfo,
  origin,
  onProgress,
  signal
}) {
  const report = (patch) => {
    if (typeof onProgress === "function") onProgress(patch);
  };

  const selected = (Array.isArray(items) ? items : [])
    .map((row) => normalizeFontListEntry(row))
    .filter((row) => row && row.url);

  if (!selected.length) {
    return { requested: 0, metaMerged: 0, filesWritten: 0, filesFailed: 0 };
  }

  let currentInfo = null;
  try {
    currentInfo = await loadFontInfo();
  } catch {
    currentInfo = { FontList: [] };
  }
  const merged = mergeFontInfoEntries(currentInfo, selected);
  await writeFontInfoViaApi(merged);
  const metaMerged = selected.length;

  let filesWritten = 0;
  let filesFailed = 0;
  const total = selected.length;

  for (let i = 0; i < selected.length; i++) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    const entry = selected[i];
    report({
      phase: "font",
      index: i + 1,
      total,
      message: `font ${entry.id} (${i + 1}/${total})`
    });
    try {
      const bytes = await downloadAssetBytes(entry.url, {
        useCdnProxy: true,
        origin,
        signal
      });
      await writeDevFileViaApi(localFontFileRelPath(entry.id), bytes);
      filesWritten += 1;
    } catch {
      filesFailed += 1;
    }
  }

  return { requested: total, metaMerged, filesWritten, filesFailed };
}
