/**
 * 缺失字体：经 LAN 设备调用 Device/GetSomeFontInfoV2，写入 public/font。
 * 协议与固件 divoom_system_font_get_font_info_inner / divoom_device_get_single_font_item_request_pack 一致。
 */
import { downloadAssetBytes } from "./cdnAssets.js";
import { writeDevFileViaApi, writeFontInfoViaApi } from "./devSyncApi.js";

export const FONT_SYNC_BATCH_SIZE = 40;

export function normalizeFontListEntry(item) {
  const id = Number(item?.id ?? item?.ID);
  if (!Number.isFinite(id) || id <= 0) return null;
  return {
    id,
    type: Number(item?.type ?? item?.Type ?? 1),
    url: String(item?.url ?? item?.Url ?? "").trim(),
    charset: String(item?.charset ?? item?.charSet ?? item?.Charset ?? "").trim(),
    name: String(item?.name ?? item?.Name ?? item?.NameEn ?? "").trim()
  };
}

export function mergeFontInfoEntries(existing, incomingEntries) {
  const byId = new Map();
  for (const raw of Array.isArray(existing?.FontList) ? existing.FontList : []) {
    const norm = normalizeFontListEntry(raw);
    if (norm) byId.set(norm.id, norm);
  }
  for (const raw of Array.isArray(incomingEntries) ? incomingEntries : []) {
    const norm = normalizeFontListEntry(raw);
    if (!norm) continue;
    const prev = byId.get(norm.id);
    byId.set(norm.id, {
      ...prev,
      ...norm,
      name: norm.name || prev?.name || ""
    });
  }
  return {
    FontList: [...byId.values()].sort((a, b) => a.id - b.id)
  };
}

export function collectFontIdsFromClockInfo(clockInfo) {
  const set = new Set();
  for (const item of Array.isArray(clockInfo?.ItemList) ? clockInfo.ItemList : []) {
    const f = Number(item?.font);
    if (Number.isFinite(f) && f > 0) set.add(f);
  }
  return set;
}

export function collectFontIdsFromClockInfos(clockInfos) {
  const set = new Set();
  for (const info of clockInfos || []) {
    for (const id of collectFontIdsFromClockInfo(info)) set.add(id);
  }
  return [...set];
}

/**
 * @param {number[]} fontIds
 * @param {{ loadFontInfo: () => Promise<object|null>, checkFontFileExists: (id:number)=>Promise<boolean> }} deps
 */
export async function findMissingFontIds(fontIds, { loadFontInfo, checkFontFileExists }) {
  const unique = [...new Set(fontIds.map((n) => Number(n)).filter((n) => Number.isFinite(n) && n > 0))];
  if (!unique.length) return [];

  let info = null;
  try {
    info = await loadFontInfo();
  } catch {
    info = null;
  }
  const metaIds = new Set(
    (Array.isArray(info?.FontList) ? info.FontList : [])
      .map((row) => Number(row?.id ?? row?.ID))
      .filter((n) => Number.isFinite(n) && n > 0)
  );

  const missing = [];
  for (const id of unique) {
    if (!metaIds.has(id)) {
      missing.push(id);
      continue;
    }
    let hasFile = false;
    try {
      hasFile = await checkFontFileExists(id);
    } catch {
      hasFile = false;
    }
    if (!hasFile) missing.push(id);
  }
  return missing;
}

/** 请求体：{ FontIds: [{ id }, ...] }（见 divoom_device_json.c） */
export async function fetchSomeFontInfoV2(divoomJson, fontIds) {
  const ids = [...new Set(fontIds.map((n) => Number(n)).filter((n) => Number.isFinite(n) && n > 0))];
  if (!ids.length) return [];
  const data = await divoomJson("Device/GetSomeFontInfoV2", {
    FontIds: ids.map((id) => ({ id }))
  });
  return Array.isArray(data?.FontList) ? data.FontList : [];
}

export function localFontFileRelPath(fontId) {
  const n = Number(fontId);
  if (!Number.isFinite(n) || n < 0) throw new Error(`invalid font id: ${fontId}`);
  return `font/${n + 1}.bin`;
}

/**
 * 为模板/表盘所用字体补齐 font_info.cfg 与 (id+1).bin 文件。
 */
export async function syncMissingFontsFromDevice({
  divoomJson,
  fontIds,
  loadFontInfo,
  checkFontFileExists,
  origin,
  onProgress,
  signal,
  batchSize = FONT_SYNC_BATCH_SIZE
}) {
  const report = (patch) => {
    if (typeof onProgress === "function") onProgress(patch);
  };

  const missing = await findMissingFontIds(fontIds, { loadFontInfo, checkFontFileExists });
  if (!missing.length) {
    return { requested: 0, metaMerged: 0, filesWritten: 0, filesFailed: 0 };
  }

  let metaMerged = 0;
  let filesWritten = 0;
  let filesFailed = 0;

  for (let i = 0; i < missing.length; i += batchSize) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    const batch = missing.slice(i, i + batchSize);
    report({
      phase: "font",
      message: `fonts ${i + 1}-${Math.min(i + batch.length, missing.length)}/${missing.length}`
    });

    let fontList = [];
    try {
      fontList = await fetchSomeFontInfoV2(divoomJson, batch);
    } catch {
      filesFailed += batch.length;
      continue;
    }

    if (!fontList.length) {
      filesFailed += batch.length;
      continue;
    }

    let currentInfo = null;
    try {
      currentInfo = await loadFontInfo();
    } catch {
      currentInfo = { FontList: [] };
    }
    const merged = mergeFontInfoEntries(currentInfo, fontList);
    await writeFontInfoViaApi(merged);
    metaMerged += fontList.length;

    for (const raw of fontList) {
      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
      const entry = normalizeFontListEntry(raw);
      if (!entry?.url) {
        filesFailed += 1;
        continue;
      }
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
  }

  return {
    requested: missing.length,
    metaMerged,
    filesWritten,
    filesFailed
  };
}
