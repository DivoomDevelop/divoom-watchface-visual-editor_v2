// Maintainer-only snapshot of TimeFrame's GetDemoClockList, following AstroToo.
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { buildDivoomLanEnvelope } from "../src/editor/divoomLanJson.js";
import { sanitizeClockInfoForCfg } from "../src/editor/templateSync.js";
import { resolveCdnUrl, extFromAssetPath } from "../src/editor/cdnAssets.js";
import { normalizeFontListEntry, localFontFileRelPath } from "../src/editor/fontSync.js";
import { normalizeBundledFont } from "./bundled-font-bytes.mjs";

const workspace = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(workspace, "public");
const artifactsRoot = path.join(workspace, "artifacts");
const stage = inside(artifactsRoot, process.env.DIVOOM_TEMPLATE_STAGING || "timeframe-demo-staging");
const catalogPath = "template/demo-catalog.json";
const deviceId = Number(process.env.DIVOOM_DEVICE_ID || 300344410);
const api = (process.env.DIVOOM_CHINA_API_TARGET || "https://appchina.divoom-gz.com").replace(/\/$/, "");
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const read = (root, rel) => fs.readFile(path.join(root, rel)).catch(error => { if (error.code === "ENOENT") return null; throw error; });
function inside(root, relative) {
  const absolute = path.resolve(root, relative);
  const rel = path.relative(root, absolute);
  if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) throw new Error(`Path escapes target directory: ${relative}`);
  return absolute;
}
async function writeNew(root, rel, value) {
  const bytes = Buffer.from(value);
  const destination = inside(root, rel);
  const current = await read(root, rel);
  if (current) {
    if (!current.equals(bytes)) throw new Error(`Preserving changed file: ${destination}`);
    return;
  }
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, bytes, { flag: "wx" });
}
async function request(url, init) {
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await fetch(url, { ...init, signal: AbortSignal.timeout(45000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (!bytes.length) throw new Error(`Empty response: ${url}`);
      return bytes;
    } catch (error) { if (attempt >= 2) throw error; }
  }
}
async function store(command, payload = {}) {
  const bytes = await request(`${api}/${command}`, { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildDivoomLanEnvelope(command, payload, () => deviceId)) });
  const data = JSON.parse(bytes);
  if (Number(data.ReturnCode) !== 0) throw new Error(`${command}: ${data.ReturnMessage}`);
  return data;
}
function collectResources(value, assets = new Set(), fonts = new Set()) {
  if (Array.isArray(value)) for (const row of value) collectResources(row, assets, fonts);
  else if (value && typeof value === "object") for (const [key, child] of Object.entries(value)) {
    if (key === "font" && Number(child) > 0) fonts.add(Number(child));
    if (typeof child === "string" && /^(?:\/?group\d+\/|https?:\/\/)/i.test(child) && key !== "RequestUrl") assets.add(child);
    else if (key === "Config" && typeof child === "string") {
      for (const address of new URLSearchParams(child).values()) if (/^\/?group\d+\//i.test(address)) assets.add(address);
    } else collectResources(child, assets, fonts);
  }
  return { assets, fonts };
}
async function walk(root, prefix = "") {
  const result = [];
  let entries;
  try { entries = await fs.readdir(path.join(root, prefix), { withFileTypes: true }); }
  catch (error) { if (error.code === "ENOENT") return result; throw error; }
  for (const entry of entries) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) result.push(...await walk(root, relative));
    else if (entry.isFile()) result.push(relative);
    else throw new Error(`Unsupported resource entry: ${relative}`);
  }
  return result.sort();
}
async function check(root) {
  const catalog = JSON.parse(await read(root, catalogPath));
  if (catalog.product !== "TimeFrame" || catalog.deviceType !== "Frame" || catalog.source !== "Device/GetDemoClockList") throw new Error("Wrong product template catalog");
  const expectedIds = [...new Set(catalog.response.ClockList.map(row => Number(row.ClockId)))];
  if (!expectedIds.length || JSON.stringify(expectedIds) !== JSON.stringify(catalog.ClockList.map(row => row.ClockId))) throw new Error("Template IDs differ from the API response");
  const fontInfo = JSON.parse(await read(root, "font/font_info.cfg"));
  for (const [relative, digest] of Object.entries(catalog.files)) {
    const bytes = await read(root, relative);
    if (!bytes?.length || hash(bytes) !== digest) throw new Error(`Missing or changed bundled resource: ${relative}`);
  }
  for (const row of catalog.ClockList) {
    const cfg = JSON.parse(await read(root, row.config));
    if (Number(cfg.ClockId) !== row.ClockId || !cfg.ItemList?.length) throw new Error(`Invalid template: ${row.ClockId}`);
    for (const address of collectResources(cfg).assets) {
      if (row.unavailableAssets?.includes(address)) continue;
      if (!row.assets[address] || !catalog.files[row.assets[address]]) throw new Error(`Unbundled resource: ${address}`);
    }
    for (const id of collectResources(cfg).fonts) {
      if (catalog.fallbackFontIds.includes(id)) continue;
      if (!fontInfo.FontList.some(font => Number(font.id) === id) || !catalog.files[localFontFileRelPath(id)]) throw new Error(`Unbundled font: ${id}`);
    }
  }
  const starter = JSON.parse(await read(root, "defaults/starter-watchface.json"));
  if (!expectedIds.includes(Number(starter.ClockId))) throw new Error("Starter watchface is not in the API response");
  const expected = [...Object.keys(catalog.files).filter(relative => relative.startsWith("template/")), catalogPath].sort();
  const actual = await walk(root, "template");
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error("Legacy or unexpected template files remain");
  console.log(`Verified TimeFrame GetDemoClockList snapshot: ${expectedIds.length} templates, ${Object.keys(catalog.files).length} files.`);
  return catalog;
}
async function bundle() {
  const response = await store("Device/GetDemoClockList");
  const ids = [...new Set((response.ClockList || []).map(row => Number(row.ClockId)).filter(id => Number.isInteger(id) && id > 0))];
  if (!ids.length) throw new Error(`GetDemoClockList returned no templates for TimeFrame DeviceId ${deviceId}`);
  const fontOriginal = await read(publicRoot, "font/font_info.cfg");
  const fontInfo = JSON.parse(fontOriginal);
  const catalog = { product: "TimeFrame", deviceType: "Frame", source: "Device/GetDemoClockList", deviceId,
    response, ClockList: [], files: {}, fallbackFontIds: [], originalFontCatalogHash: hash(fontOriginal) };
  const save = async (relative, bytes) => { await writeNew(stage, relative, bytes); catalog.files[relative] = hash(bytes); };
  const fontIds = new Set();
  const resourceCache = new Map();
  for (const id of ids) {
    const cfg = sanitizeClockInfoForCfg(await store("Device/GetClockInfoV3", { ClockId: id, ParentItemId: 0, ParentClockId: 0 }));
    if (!cfg.ItemList?.length || Number(cfg.ClockId) !== id) throw new Error(`Missing configuration for returned template ${id}`);
    const row = { ClockId: id, config: `template/config/${id}.cfg`, assets: {} };
    const { assets, fonts } = collectResources(cfg);
    for (const font of fonts) fontIds.add(font);
    for (const address of assets) {
      const url = resolveCdnUrl(address);
      if (!/(^|\.)divoom-gz\.com$/i.test(new URL(url).hostname)) throw new Error(`Unexpected asset host: ${url}`);
      const bytes = resourceCache.get(url) || await request(url);
      resourceCache.set(url, bytes);
      if (/^\s*</.test(bytes.subarray(0, 100).toString())) {
        const replacement = cfg.ItemList.some(item => Number(item.x) === 0 && Number(item.y) === 0 && Number(item.w) === 800 && Number(item.h) === 1280 && item.image_addr && item.image_addr !== address);
        if (address !== cfg.DeviceImageUrl || !replacement) throw new Error(`Server returned HTML instead of a required asset: template ${id}, ${address}`);
        row.unavailableAssets = [...(row.unavailableAssets || []), address];
        continue;
      }
      const relative = `template/demo/assets/${hash(bytes)}${extFromAssetPath(address)}`;
      await save(relative, bytes);
      row.assets[address] = relative;
    }
    await save(row.config, JSON.stringify(cfg, null, 2) + "\n");
    catalog.ClockList.push(row);
    console.log(`Bundled ${id}: ${cfg.NameEn || cfg.NameCn}, ${Object.keys(row.assets).length} resources`);
  }
  const missing = [...fontIds].filter(id => !fontInfo.FontList.some(row => Number(row.id) === id));
  if (missing.length) {
    const data = await store("Device/GetSomeFontInfoV2", { FontIds: missing.map(id => ({ id })) });
    const unavailable = new Set(Object.values(data.FontNotList || {}).map(Number));
    catalog.fallbackFontIds = missing.filter(id => unavailable.has(id));
    for (const raw of data.FontList || []) {
      const font = normalizeFontListEntry(raw);
      if (font && missing.includes(font.id)) fontInfo.FontList.push(font);
    }
  }
  for (const id of fontIds) {
    if (catalog.fallbackFontIds.includes(id)) continue;
    const meta = fontInfo.FontList.find(row => Number(row.id) === id);
    if (!meta?.url) throw new Error(`No metadata for font ${id}`);
    const relative = localFontFileRelPath(id);
    const bytes = await read(publicRoot, relative) || await request(resolveCdnUrl(meta.url));
    await save(relative, bytes);
    const normalized = Number(meta.type) === 1 ? normalizeBundledFont(bytes) : bytes;
    if (!normalized.equals(bytes)) {
      const override = `template/demo/fonts/${id + 1}.bin`;
      await save(override, normalized);
      catalog.fontOverrides = { ...catalog.fontOverrides, [id]: override };
    }
  }
  await save("font/font_info.cfg", JSON.stringify(fontInfo, null, 4) + "\n");
  await writeNew(stage, catalogPath, JSON.stringify(catalog, null, 2) + "\n");
  await writeNew(stage, "defaults/starter-watchface.json", await read(stage, catalog.ClockList[0].config));
  await check(stage);
}
async function install() {
  const catalog = await check(stage);
  const currentFont = await read(publicRoot, "font/font_info.cfg");
  if (hash(currentFont) !== catalog.originalFontCatalogHash) throw new Error("Font catalog changed during download; preserving workspace changes");
  for (const relative of Object.keys(catalog.files).filter(name => name.startsWith("font/") && name !== "font/font_info.cfg")) {
    const current = await read(publicRoot, relative);
    if (current && hash(current) !== catalog.files[relative]) throw new Error(`Preserving concurrently changed font: ${relative}`);
  }
  const oldFiles = [...await walk(publicRoot, "template"), "defaults/starter-watchface.json"];
  const backup = inside(artifactsRoot, `template-legacy-backup-${Date.now()}`);
  const baseline = new Map();
  for (const relative of oldFiles) {
    const bytes = await read(publicRoot, relative);
    if (!bytes) continue;
    baseline.set(relative, hash(bytes));
    await writeNew(backup, relative, bytes);
  }
  const freshFiles = [...await walk(publicRoot, "template"), "defaults/starter-watchface.json"];
  if (JSON.stringify(oldFiles) !== JSON.stringify(freshFiles)) throw new Error("Template file list changed while backing up; preserving external changes");
  for (const [relative, digest] of baseline) {
    const current = await read(publicRoot, relative);
    if (!current || hash(current) !== digest) throw new Error(`Template changed while backing up: ${relative}`);
  }
  for (const [relative, digest] of baseline) {
    const absolute = inside(publicRoot, relative);
    if (hash(await fs.readFile(absolute)) !== digest) throw new Error(`Preserving concurrent template edit: ${relative}`);
    await fs.unlink(absolute);
  }
  for (const relative of ["template/15", "template/29", "template/33"]) {
    const directory = inside(path.join(publicRoot, "template"), path.basename(relative));
    if ((await fs.readdir(directory)).length === 0) await fs.rmdir(directory);
  }
  for (const relative of await walk(stage)) {
    const bytes = await read(stage, relative);
    if (relative === "font/font_info.cfg") {
      const current = await read(publicRoot, relative);
      if (hash(current) !== catalog.originalFontCatalogHash) throw new Error("Preserving concurrent font catalog edit");
      await fs.writeFile(inside(publicRoot, relative), bytes);
    } else await writeNew(publicRoot, relative, bytes);
  }
  await check(publicRoot);
  console.log(`Replaced all ${baseline.size} legacy template files. Recovery copy: ${backup}`);
}

try {
  if (process.argv.includes("--check")) await check(publicRoot);
  else if (process.argv.includes("--install")) await install();
  else await bundle();
} catch (error) { console.error(error); process.exitCode = 1; }
