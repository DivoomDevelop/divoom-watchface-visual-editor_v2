import { downloadAssetBytes, extFromAssetPath } from "./cdnAssets.js";
import { saveClassifyCacheViaApi, writeDevFileViaApi } from "./devSyncApi.js";
import { collectFontIdsFromClockInfo, syncMissingFontsFromDevice } from "./fontSync.js";

export { DIVOOM_CDN_BASE, downloadAssetBytes, extFromAssetPath, resolveCdnFetchUrl, resolveCdnUrl } from "./cdnAssets.js";

export const TEMPLATE_SYNC_PAGE_SIZE = 100;

export function sanitizeClockInfoForCfg(data) {
  if (!data || typeof data !== "object") return {};
  const out = { ...data };
  for (const k of [
    "Command",
    "ReturnCode",
    "ReturnMessage",
    "DeviceType",
    "PacketFlag",
    "DeviceId",
    "IsAppCommand"
  ]) {
    delete out[k];
  }
  return out;
}

export function pickSyncLanguage(uiLocaleCode) {
  const code = String(uiLocaleCode || "").toLowerCase();
  if (code === "zh-cn" || code === "zh-tw") return "zh-hans";
  return "en";
}

export async function fetchStoreClockClassify(storeJson, language) {
  return storeJson("Channel/StoreClockGetClassify", { Language: language });
}

export function isUsableClockInfoV3(data) {
  if (!data || typeof data !== "object") return false;
  if (Array.isArray(data.ItemList) && data.ItemList.length > 0) return true;
  const url = String(data.DeviceImageUrl || "").trim();
  return url.length > 4 && url.includes("/");
}

/**
 * 从 Divoom 中国区服务器拉取商店分类与表盘列表（不经 LAN 设备）。
 * @returns {{ source: "cloud", buckets: object[], checkRemoteVersion: true }}
 */
export async function resolveStoreCatalogBuckets({ storeJson, language, onProgress }) {
  const report = typeof onProgress === "function" ? onProgress : () => {};

  report({ phase: "classify", message: "classify" });
  const classifyResp = await fetchStoreClockClassify(storeJson, language);
  const classifyList = Array.isArray(classifyResp?.ClassifyList) ? classifyResp.ClassifyList : [];
  if (!classifyList.length) {
    throw new Error("StoreClockGetClassify returned empty ClassifyList");
  }

  const buckets = [];
  for (let ci = 0; ci < classifyList.length; ci++) {
    const cat = classifyList[ci];
    const classifyId = Number(cat?.ClassifyId);
    if (!Number.isFinite(classifyId)) continue;
    report({
      phase: "list",
      classifyIndex: ci + 1,
      classifyTotal: classifyList.length,
      message: `list ${ci + 1}/${classifyList.length}`
    });
    const clockRows = await fetchAllClockRowsInClassify(storeJson, classifyId, language);
    buckets.push({
      ClassifyId: classifyId,
      ClassifyName: String(cat?.ClassifyName || "").trim(),
      ClassifyNameEn: String(cat?.ClassifyNameEn || cat?.ClassifyName || "").trim(),
      clocks: clockRows.map((row) => ({
        ClockId: Number(row?.ClockId),
        ClockName: String(row?.ClockName || "").trim(),
        ImagePixelId: String(row?.ImagePixelId || "").trim()
      }))
    });
  }

  if (!buckets.some((b) => (b.clocks || []).length)) {
    throw new Error("no clocks in store catalog");
  }
  return { source: "cloud", buckets, checkRemoteVersion: true };
}

export async function fetchStoreClockListPage(storeJson, { classifyId, startNum, endNum, flag = 0, language }) {
  return storeJson("Channel/StoreClockGetListForAI", {
    Language: language,
    Flag: flag,
    ClassifyId: classifyId,
    StartNum: startNum,
    EndNum: endNum
  });
}

export async function fetchAllClockRowsInClassify(storeJson, classifyId, language) {
  const all = [];
  let start = 1;
  while (true) {
    const data = await fetchStoreClockListPage(storeJson, {
      classifyId,
      startNum: start,
      endNum: start + TEMPLATE_SYNC_PAGE_SIZE - 1,
      language
    });
    const list = Array.isArray(data?.ClockList) ? data.ClockList : [];
    for (const row of list) {
      const id = Number(row?.ClockId);
      if (Number.isFinite(id) && id > 0) all.push(row);
    }
    if (list.length < TEMPLATE_SYNC_PAGE_SIZE) break;
    start += TEMPLATE_SYNC_PAGE_SIZE;
  }
  return all;
}

export async function fetchClockInfoV3(storeJson, clockId) {
  const data = await storeJson("Device/GetClockInfoV3", {
    ClockId: clockId,
    ParentItemId: 0,
    ParentClockId: 0
  });
  if (!isUsableClockInfoV3(data)) {
    throw new Error("GetClockInfoV3 returned no dial config");
  }
  return data;
}

export { isDevSyncApiAvailable, isDevSyncApiAvailable as isTemplateSyncApiAvailable } from "./devSyncApi.js";

export async function writeTemplateFileViaApi(relPath, bytes) {
  return writeDevFileViaApi(relPath, bytes);
}

export function buildClassifyCacheFromSync(classifyRows) {
  return {
    generatedAt: new Date().toISOString(),
    ReturnCode: 0,
    ClassifyList: (Array.isArray(classifyRows) ? classifyRows : []).map((row) => ({
      ClassifyId: row.ClassifyId,
      ClassifyName: row.ClassifyName || "",
      ClassifyNameEn: row.ClassifyNameEn || row.ClassifyName || "",
      clockid: [...(row.clockid || [])]
    }))
  };
}

/** 合并多份 ClassifyList（取并集），避免单次下载覆盖整表分类目录。 */
export function mergeClassifyCatalogSnapshots(...sources) {
  const byId = new Map();
  for (const src of sources) {
    if (!src || typeof src !== "object") continue;
    const list = Array.isArray(src.ClassifyList) ? src.ClassifyList : [];
    for (const row of list) {
      const classifyId = Number(row?.ClassifyId);
      if (!Number.isFinite(classifyId)) continue;
      let bucket = byId.get(classifyId);
      if (!bucket) {
        bucket = {
          ClassifyId: classifyId,
          ClassifyName: String(row?.ClassifyName || "").trim(),
          ClassifyNameEn: String(row?.ClassifyNameEn || row?.ClassifyName || "").trim(),
          clockids: new Set()
        };
        byId.set(classifyId, bucket);
      }
      if (!bucket.ClassifyName && row?.ClassifyName) bucket.ClassifyName = String(row.ClassifyName).trim();
      if (!bucket.ClassifyNameEn && row?.ClassifyNameEn) {
        bucket.ClassifyNameEn = String(row.ClassifyNameEn).trim();
      }
      for (const raw of Array.isArray(row?.clockid) ? row.clockid : []) {
        const id = Number(raw);
        if (Number.isFinite(id) && id > 0) bucket.clockids.add(id);
      }
    }
  }
  const ClassifyList = [...byId.values()]
    .map((b) => ({
      ClassifyId: b.ClassifyId,
      ClassifyName: b.ClassifyName,
      ClassifyNameEn: b.ClassifyNameEn || b.ClassifyName,
      clockid: [...b.clockids].sort((a, c) => a - c)
    }))
    .sort((a, b) => a.ClassifyId - b.ClassifyId);
  return {
    ReturnCode: 0,
    ReturnMessage: "",
    ClassifyList,
    generatedAt: new Date().toISOString()
  };
}

/** 写入本地 cfg 前补全空 DeviceImageUrl / 预览图（部分云端表盘仅填 ItemList）。 */
export function enrichClockInfoForLocalSave(clockInfo) {
  if (!clockInfo || typeof clockInfo !== "object") return clockInfo;
  const out = { ...clockInfo };
  const pickAddr = (item) => {
    const addr = String(item?.image_addr || "").trim();
    return addr && !/^https?:\/\//i.test(addr) ? addr : "";
  };
  if (!String(out.DeviceImageUrl || "").trim()) {
    for (const item of Array.isArray(out.ItemList) ? out.ItemList : []) {
      const disp = Number(item?.disp);
      if (disp === 13 || disp === 46 || disp === 66) {
        const addr = pickAddr(item);
        if (addr) {
          out.DeviceImageUrl = addr;
          break;
        }
      }
    }
    if (!String(out.DeviceImageUrl || "").trim()) {
      for (const item of Array.isArray(out.ItemList) ? out.ItemList : []) {
        const addr = pickAddr(item);
        if (addr) {
          out.DeviceImageUrl = addr;
          break;
        }
      }
    }
  }
  if (!String(out.DevicePreviewImageUrl || "").trim() && !String(out.DevicePreviewImageUrl2 || "").trim()) {
    const small =
      String(out.DevPreviewSmallImgUrl || "").trim() ||
      String(out.DevPreviewSmallImgUrl2 || "").trim();
    if (small) out.DevicePreviewImageUrl = small;
  }
  return out;
}

/**
 * 根据 GetClockInfoV3 响应规划要写入 public/template 的相对路径。
 * @param {(clockId:number, item:object)=>number|null} getSlotByItem
 * @param {(item:object)=>boolean} isImageItem
 */
export function planTemplateAssetWrites(clockId, clockInfo, { getSlotByItem, isImageItem }) {
  const id = Number(clockId);
  const writes = [];
  const seenUrls = new Set();

  const queueUrl = (relPath, urlPath) => {
    const addr = String(urlPath || "").trim();
    if (!addr || seenUrls.has(`${relPath}|${addr}`)) return;
    seenUrls.add(`${relPath}|${addr}`);
    writes.push({ relPath, fileAddr: addr });
  };

  const bgAddr = clockInfo?.DeviceImageUrl;
  if (bgAddr) {
    queueUrl(`template/15/${id + 1}${extFromAssetPath(bgAddr)}`, bgAddr);
  }

  const previewAddr =
    clockInfo?.DevicePreviewImageUrl ||
    clockInfo?.DevicePreviewImageUrl2 ||
    clockInfo?.DevPreviewSmallImgUrl ||
    clockInfo?.DevPreviewSmallImgUrl2;
  if (previewAddr) {
    queueUrl(`template/33/${id + 1}${extFromAssetPath(previewAddr)}`, previewAddr);
  }

  const items = Array.isArray(clockInfo?.ItemList) ? clockInfo.ItemList : [];
  for (const item of items) {
    if (!isImageItem(item)) continue;
    const addr = String(item?.image_addr || "").trim();
    if (!addr || /^https?:\/\//i.test(addr)) continue;
    const slot = getSlotByItem(id, item);
    if (!Number.isFinite(slot) || slot <= 0) continue;
    queueUrl(`template/29/${slot}${extFromAssetPath(addr)}`, addr);
  }

  return writes;
}

/**
 * 从已连接设备拉取商店分类与表盘详情，写入 public/template（需 Vite dev API）。
 */
export async function syncTemplatesFromDevice({
  storeJson,
  divoomJson,
  getSlotByItem,
  isImageItem,
  loadExistingCfg,
  loadFontInfo,
  checkFontFileExists,
  syncFonts = true,
  language,
  origin,
  onProgress,
  signal
}) {
  const report = (patch) => {
    if (typeof onProgress === "function") onProgress(patch);
  };

  const { buckets: catalogBuckets } = await resolveStoreCatalogBuckets({
    storeJson,
    language,
    onProgress: report
  });

  const syncedClassifyRows = [];
  const syncedClockIds = new Set();
  const allFontIds = new Set();
  let configsWritten = 0;
  let configsSkipped = 0;
  let assetsWritten = 0;
  let assetsFailed = 0;

  for (let ci = 0; ci < catalogBuckets.length; ci++) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    const bucket = catalogBuckets[ci];
    const classifyId = Number(bucket?.ClassifyId);
    if (!Number.isFinite(classifyId)) continue;

    const catName = String(bucket?.ClassifyName || "").trim();
    const catNameEn = String(bucket?.ClassifyNameEn || catName).trim();
    report({
      phase: "list",
      classifyIndex: ci + 1,
      classifyTotal: catalogBuckets.length,
      classifyId,
      classifyName: catName || catNameEn,
      message: `list ${ci + 1}/${catalogBuckets.length}`
    });

    const clockRows = bucket.clocks || [];
    const clockIds = [];
    for (const row of clockRows) {
      const clockId = Number(row?.ClockId);
      if (!Number.isFinite(clockId) || clockId <= 0) continue;
      clockIds.push(clockId);
      if (syncedClockIds.has(clockId)) continue;
      syncedClockIds.add(clockId);

      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
      report({
        phase: "clock",
        clockId,
        classifyId,
        message: `clock ${clockId}`
      });

      let remoteInfo;
      try {
        remoteInfo = await fetchClockInfoV3(storeJson, clockId);
      } catch (e) {
        assetsFailed += 1;
        report({ phase: "error", clockId, message: String(e?.message || e) });
        continue;
      }

      const remoteUpdate = Number(remoteInfo?.SysUpdateTime ?? remoteInfo?.UpdateTime ?? 0);
      let skipConfig = false;
      if (typeof loadExistingCfg === "function") {
        try {
          const existing = await loadExistingCfg(clockId);
          const localUpdate = Number(existing?.SysUpdateTime ?? existing?.UpdateTime ?? -1);
          if (localUpdate > 0 && localUpdate === remoteUpdate) {
            skipConfig = true;
            configsSkipped += 1;
          }
        } catch {
          /* no local cfg */
        }
      }

      const cfgObj = sanitizeClockInfoForCfg(remoteInfo);
      for (const fontId of collectFontIdsFromClockInfo(cfgObj)) allFontIds.add(fontId);
      if (!skipConfig) {
        const cfgText = JSON.stringify(cfgObj, null, "\t");
        const enc = new TextEncoder();
        await writeTemplateFileViaApi(`template/config/${clockId}.cfg`, enc.encode(cfgText));
        configsWritten += 1;
      }

      const assetWrites = planTemplateAssetWrites(clockId, cfgObj, { getSlotByItem, isImageItem });
      for (const aw of assetWrites) {
        if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
        try {
          const bytes = await downloadAssetBytes(aw.fileAddr, {
            useCdnProxy: true,
            origin,
            signal
          });
          await writeTemplateFileViaApi(aw.relPath, bytes);
          assetsWritten += 1;
        } catch {
          assetsFailed += 1;
        }
      }
    }

    syncedClassifyRows.push({
      ClassifyId: classifyId,
      ClassifyName: catName,
      ClassifyNameEn: catNameEn,
      clockid: clockIds
    });
  }

  const classifyCache = buildClassifyCacheFromSync(syncedClassifyRows);
  await saveClassifyCacheViaApi(classifyCache);

  let fontStats = null;
  if (
    syncFonts &&
    allFontIds.size > 0 &&
    typeof loadFontInfo === "function" &&
    typeof checkFontFileExists === "function"
  ) {
    report({ phase: "font", message: "sync missing fonts" });
    fontStats = await syncMissingFontsFromDevice({
      divoomJson,
      fontIds: [...allFontIds],
      loadFontInfo,
      checkFontFileExists,
      origin,
      onProgress,
      signal
    });
  }

  return {
    classifyCache,
    stats: {
      categories: syncedClassifyRows.length,
      clocks: syncedClockIds.size,
      configsWritten,
      configsSkipped,
      assetsWritten,
      assetsFailed,
      fonts: fontStats
    }
  };
}

function clockSysUpdateTime(cfg) {
  return Number(cfg?.SysUpdateTime ?? cfg?.UpdateTime ?? 0);
}

/**
 * 扫描商店中「本地缺失或 SysUpdateTime 不一致」的表盘（经中国区服务器 API，不经 LAN 设备）。
 */
export async function scanPendingTemplatesFromDevice({
  storeJson,
  loadExistingCfg,
  language,
  onProgress,
  infoConcurrency = 4
}) {
  const report = (patch) => {
    if (typeof onProgress === "function") onProgress(patch);
  };

  const { buckets: catalogBuckets, source: catalogSource, checkRemoteVersion = true } =
    await resolveStoreCatalogBuckets({
      storeJson,
      language,
      onProgress: report
    });

  const classifyRows = [];
  const seenClock = new Set();
  let totalPending = 0;

  async function evaluateCandidates(candidates, classifyId, catName, catNameEn, remoteCheck) {
    const items = [];
    let idx = 0;
    async function worker() {
      while (idx < candidates.length) {
        const i = idx++;
        const c = candidates[i];
        let reason = "";
        let localCfg = null;
        try {
          localCfg = await loadExistingCfg(c.clockId);
        } catch {
          localCfg = null;
        }
        if (!localCfg) {
          reason = "missing";
        } else if (remoteCheck) {
          try {
            const remote = await fetchClockInfoV3(storeJson, c.clockId);
            const ru = clockSysUpdateTime(remote);
            const lu = clockSysUpdateTime(localCfg);
            if (ru > 0 && lu !== ru) reason = "outdated";
            else if (ru > 0 && lu <= 0) reason = "outdated";
          } catch {
            reason = "outdated";
          }
        }
        if (reason) {
          items.push({
            clockId: c.clockId,
            clockName: c.clockName,
            imagePixelId: c.imagePixelId,
            classifyId,
            reason,
            status: "pending"
          });
        }
      }
    }
    const workers = Array.from({ length: Math.min(infoConcurrency, candidates.length || 1) }, () => worker());
    await Promise.all(workers);
    if (items.length) {
      classifyRows.push({
        ClassifyId: classifyId,
        ClassifyName: catName,
        ClassifyNameEn: catNameEn,
        items
      });
      totalPending += items.length;
    }
  }

  for (let ci = 0; ci < catalogBuckets.length; ci++) {
    const bucket = catalogBuckets[ci];
    const classifyId = Number(bucket?.ClassifyId);
    if (!Number.isFinite(classifyId)) continue;
    const catName = String(bucket?.ClassifyName || "").trim();
    const catNameEn = String(bucket?.ClassifyNameEn || catName).trim();
    const candidates = [];
    for (const row of bucket.clocks || []) {
      const clockId = Number(row?.ClockId);
      if (!Number.isFinite(clockId) || clockId <= 0 || seenClock.has(clockId)) continue;
      seenClock.add(clockId);
      candidates.push({
        clockId,
        clockName: String(row?.ClockName || "").trim(),
        imagePixelId: String(row?.ImagePixelId || "").trim(),
        classifyId
      });
    }
    report({
      phase: "scan",
      classifyIndex: ci + 1,
      classifyTotal: catalogBuckets.length,
      message: `scan ${ci + 1}/${catalogBuckets.length}`
    });
    await evaluateCandidates(candidates, classifyId, catName, catNameEn, checkRemoteVersion);
  }

  return { classifyRows, totalPending, catalogSource };
}

export async function mergeClockIdIntoClassifyCache(
  classifyId,
  clockId,
  { loadClassifyCache, getBaseClassifyData, fallbackClassifyData }
) {
  const layers = [];
  if (fallbackClassifyData) layers.push(fallbackClassifyData);
  if (typeof getBaseClassifyData === "function") {
    try {
      const live = getBaseClassifyData();
      if (live) layers.push(live);
    } catch {
      /* ignore */
    }
  }
  try {
    const raw = await loadClassifyCache?.();
    if (raw) layers.push(raw);
  } catch {
    /* ignore */
  }

  const merged = mergeClassifyCatalogSnapshots(...layers);
  const cid = Number(classifyId);
  const kid = Number(clockId);
  const list = merged.ClassifyList.map((r) => ({
    ClassifyId: r.ClassifyId,
    ClassifyName: r.ClassifyName,
    ClassifyNameEn: r.ClassifyNameEn,
    clockid: [...(Array.isArray(r.clockid) ? r.clockid : [])]
  }));
  let row = list.find((r) => Number(r.ClassifyId) === cid);
  if (!row) {
    row = { ClassifyId: cid, ClassifyName: "", ClassifyNameEn: "", clockid: [] };
    list.push(row);
  }
  const idSet = new Set(
    row.clockid.map((x) => Number(x)).filter((n) => Number.isFinite(n) && n > 0)
  );
  idSet.add(kid);
  row.clockid = [...idSet].sort((a, b) => a - b);
  const updated = {
    ...merged,
    ClassifyList: list.sort((a, b) => a.ClassifyId - b.ClassifyId)
  };
  await saveClassifyCacheViaApi(updated);
  return updated;
}

/**
 * 下载单个表盘全部资源（配置、15/29/33、字体）并合并分类缓存。
 */
export async function downloadSingleTemplateToLocal({
  storeJson,
  divoomJson,
  clockId,
  classifyId,
  getSlotByItem,
  isImageItem,
  loadFontInfo,
  checkFontFileExists,
  loadClassifyCache,
  getBaseClassifyData,
  fallbackClassifyData,
  origin,
  onProgress
}) {
  const report = (patch) => {
    if (typeof onProgress === "function") onProgress(patch);
  };
  const id = Number(clockId);
  if (!Number.isFinite(id) || id <= 0) throw new Error("invalid clockId");

  report({ percent: 2, message: "info" });
  const remoteInfo = enrichClockInfoForLocalSave(await fetchClockInfoV3(storeJson, id));
  const cfgObj = sanitizeClockInfoForCfg(remoteInfo);

  report({ percent: 10, message: "config" });
  const cfgText = JSON.stringify(cfgObj, null, "\t");
  const enc = new TextEncoder();
  await writeTemplateFileViaApi(`template/config/${id}.cfg`, enc.encode(cfgText));

  const assetWrites = planTemplateAssetWrites(id, remoteInfo, { getSlotByItem, isImageItem });
  const assetTotal = Math.max(1, assetWrites.length);
  let assetDone = 0;
  let assetsFailed = 0;
  const failedPaths = [];
  for (const aw of assetWrites) {
    const pct = 12 + Math.floor((68 * assetDone) / assetTotal);
    report({ percent: pct, message: aw.relPath });
    try {
      const bytes = await downloadAssetBytes(aw.fileAddr, { useCdnProxy: true, origin });
      await writeTemplateFileViaApi(aw.relPath, bytes);
    } catch (e) {
      assetsFailed += 1;
      failedPaths.push(`${aw.relPath}: ${e?.message || e}`);
    }
    assetDone += 1;
  }
  if (assetWrites.length > 0 && assetsFailed >= assetWrites.length) {
    throw new Error(
      `all ${assetWrites.length} assets failed to download (check npm run dev and /divoom-cdn-proxy). ${failedPaths[0] || ""}`
    );
  }

  report({ percent: 84, message: "fonts" });
  const fontIds = [...collectFontIdsFromClockInfo(cfgObj)];
  let fontStats = null;
  if (fontIds.length && typeof loadFontInfo === "function" && typeof checkFontFileExists === "function") {
    fontStats = await syncMissingFontsFromDevice({
      divoomJson,
      fontIds,
      loadFontInfo,
      checkFontFileExists,
      origin,
      onProgress: (p) => report({ percent: 84 + Math.min(10, 2), message: p?.message || "fonts" })
    });
  }

  report({ percent: 96, message: "classify" });
  const classifyCache = await mergeClockIdIntoClassifyCache(classifyId, id, {
    loadClassifyCache,
    getBaseClassifyData,
    fallbackClassifyData
  });

  report({ percent: 100, message: "done" });
  return { clockId: id, cfgObj, assetsFailed, fontStats, classifyCache };
}
