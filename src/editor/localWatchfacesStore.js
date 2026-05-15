export const STORAGE_KEY = "divoom_local_watchfaces_v1";
export const LAST_ACTIVE_ID_KEY = "divoom_last_active_watchface_id";
/** Stable id for the bundled 「立体方块2」preset seeded on first launch (empty library). */
export const BUNDLED_STARTER_WATCHFACE_ID = "wf-bundled-starter-v1";

export function listWatchfaces() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

export function upsert(record) {
  const arr = listWatchfaces();
  const next = { ...record, updatedAt: record.updatedAt || Date.now() };
  const i = arr.findIndex((x) => x.id === next.id);
  if (i >= 0) arr[i] = next;
  else arr.push(next);
  arr.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  writeAll(arr);
}

export function removeWatchface(id) {
  writeAll(listWatchfaces().filter((x) => x.id !== id));
}

export function getWatchface(id) {
  return listWatchfaces().find((x) => x.id === id) || null;
}

export function setLastActiveId(id) {
  try {
    if (id) localStorage.setItem(LAST_ACTIVE_ID_KEY, String(id));
    else localStorage.removeItem(LAST_ACTIVE_ID_KEY);
  } catch {
    /* ignore */
  }
}

export function getLastActiveId() {
  try {
    return localStorage.getItem(LAST_ACTIVE_ID_KEY) || "";
  } catch {
    return "";
  }
}

export function newWatchfaceId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `wf_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
