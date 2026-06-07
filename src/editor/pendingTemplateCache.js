/** 待下载表盘扫描结果（localStorage，跨会话保留；仅用户点「更新模板库」时重新扫描）。 */

export const PENDING_TEMPLATE_CACHE_KEY = "divoom_pending_template_scan_v1";

export function countPendingTemplateItems(classifyRows) {
  let n = 0;
  for (const row of Array.isArray(classifyRows) ? classifyRows : []) {
    for (const item of Array.isArray(row?.items) ? row.items : []) {
      if (item?.status !== "installed") n += 1;
    }
  }
  return n;
}

export function serializePendingTemplateCache({
  classifyRows,
  selectedClassifyId = null,
  activeClockId = null,
  catalogSource = ""
}) {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    catalogSource: String(catalogSource || ""),
    selectedClassifyId: Number.isFinite(Number(selectedClassifyId)) ? Number(selectedClassifyId) : null,
    activeClockId: Number.isFinite(Number(activeClockId)) ? Number(activeClockId) : null,
    classifyRows: (Array.isArray(classifyRows) ? classifyRows : []).map((row) => ({
      ClassifyId: Number(row?.ClassifyId),
      ClassifyName: String(row?.ClassifyName || ""),
      ClassifyNameEn: String(row?.ClassifyNameEn || ""),
      items: (Array.isArray(row?.items) ? row.items : []).map((it) => ({
        clockId: Number(it?.clockId),
        clockName: String(it?.clockName || ""),
        imagePixelId: String(it?.imagePixelId || ""),
        classifyId: Number(it?.classifyId ?? row?.ClassifyId),
        reason: it?.reason === "outdated" ? "outdated" : "missing",
        status: it?.status === "installed" ? "installed" : "pending"
      }))
    }))
  };
}

export function parsePendingTemplateCache(raw) {
  if (!raw || typeof raw !== "object" || !Array.isArray(raw.classifyRows)) return null;
  const classifyRows = [];
  for (const row of raw.classifyRows) {
    const classifyId = Number(row?.ClassifyId);
    if (!Number.isFinite(classifyId)) continue;
    const items = [];
    for (const it of Array.isArray(row?.items) ? row.items : []) {
      const clockId = Number(it?.clockId);
      if (!Number.isFinite(clockId) || clockId <= 0) continue;
      items.push({
        clockId,
        clockName: String(it?.clockName || ""),
        imagePixelId: String(it?.imagePixelId || ""),
        classifyId: Number(it?.classifyId ?? classifyId),
        reason: it?.reason === "outdated" ? "outdated" : "missing",
        status: it?.status === "installed" ? "installed" : "pending"
      });
    }
    if (items.length) {
      classifyRows.push({
        ClassifyId: classifyId,
        ClassifyName: String(row?.ClassifyName || ""),
        ClassifyNameEn: String(row?.ClassifyNameEn || ""),
        items
      });
    }
  }
  if (!classifyRows.length) return null;
  return {
    classifyRows,
    selectedClassifyId: Number.isFinite(Number(raw.selectedClassifyId))
      ? Number(raw.selectedClassifyId)
      : null,
    activeClockId: Number.isFinite(Number(raw.activeClockId)) ? Number(raw.activeClockId) : null,
    catalogSource: String(raw.catalogSource || ""),
    savedAt: String(raw.savedAt || "")
  };
}

export function loadPendingTemplateCacheFromStorage() {
  try {
    const text = localStorage.getItem(PENDING_TEMPLATE_CACHE_KEY);
    if (!text) return null;
    return parsePendingTemplateCache(JSON.parse(text));
  } catch {
    return null;
  }
}

export function savePendingTemplateCacheToStorage(payload) {
  try {
    const pending = countPendingTemplateItems(payload?.classifyRows);
    if (!pending) {
      localStorage.removeItem(PENDING_TEMPLATE_CACHE_KEY);
      return;
    }
    localStorage.setItem(
      PENDING_TEMPLATE_CACHE_KEY,
      JSON.stringify(serializePendingTemplateCache(payload))
    );
  } catch {
    /* ignore quota / private mode */
  }
}

/**
 * 用本地 .cfg 轻量校正：此前「缺失」的项若已存在配置则标为已安装并移出待下载列表。
 */
export async function reconcilePendingClassifyRows(classifyRows, loadExistingCfg) {
  if (!Array.isArray(classifyRows) || typeof loadExistingCfg !== "function") {
    return { classifyRows: [], removedInstalled: 0 };
  }
  const out = [];
  let removedInstalled = 0;
  for (const row of classifyRows) {
    const items = [];
    for (const item of Array.isArray(row?.items) ? row.items : []) {
      if (item.status === "installed") {
        removedInstalled += 1;
        continue;
      }
      if (item.reason === "missing") {
        let localCfg = null;
        try {
          localCfg = await loadExistingCfg(item.clockId);
        } catch {
          localCfg = null;
        }
        if (localCfg) {
          removedInstalled += 1;
          continue;
        }
      }
      items.push(item);
    }
    if (items.length) {
      out.push({
        ClassifyId: row.ClassifyId,
        ClassifyName: row.ClassifyName,
        ClassifyNameEn: row.ClassifyNameEn,
        items
      });
    }
  }
  return { classifyRows: out, removedInstalled };
}
