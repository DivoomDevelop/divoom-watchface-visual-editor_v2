/**
 * 将指定表盘的 CDN 资源写入 public/template（不依赖 Vite dev API）。
 * 用法：node scripts/repair-clock-assets.mjs 1475
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildDivoomLanEnvelope } from "../src/editor/divoomLanJson.js";
import {
  enrichClockInfoForLocalSave,
  planTemplateAssetWrites,
  sanitizeClockInfoForCfg
} from "../src/editor/templateSync.js";
import { downloadAssetBytes } from "../src/editor/cdnAssets.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clockId = Number(process.argv[2] || 1475);
const DEVICE_ID = Number(process.env.DIVOOM_DEVICE_ID || 300344410);
const CHINA_API = (process.env.DIVOOM_CHINA_API_TARGET || "http://appchina.divoom-gz.com:9506").replace(
  /\/$/,
  ""
);
const TEMPLATE_SLOT_COUNT = 128;
const DISP_OFFSET = { 13: 29, 46: 0, 66: 13 };

function isImageItem(item) {
  const disp = Number(item?.disp) || 0;
  return disp === 13 || disp === 46 || disp === 66 || !!String(item?.image_addr || "").trim();
}

function getSlotByItem(id, item) {
  const disp = Number(item?.disp) || 0;
  const offset = DISP_OFFSET[disp];
  if (Number.isFinite(offset) && offset >= 0) return id * TEMPLATE_SLOT_COUNT + offset + 1;
  const imageId = Number(item?.image_id) || 0;
  if (imageId > 0 && imageId <= TEMPLATE_SLOT_COUNT) return id * TEMPLATE_SLOT_COUNT + imageId;
  if (imageId > TEMPLATE_SLOT_COUNT) return imageId;
  return null;
}

async function chinaStoreJson(command, payload = {}) {
  const envelope = buildDivoomLanEnvelope(command, payload, () => DEVICE_ID);
  const res = await fetch(`${CHINA_API}/${String(command).replace(/^\//, "")}`, {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify(envelope)
  });
  const data = await res.json();
  if (!res.ok || Number(data.ReturnCode) !== 0) {
    throw new Error(data.ReturnMessage || `HTTP ${res.status}`);
  }
  return data;
}

async function main() {
  const raw = await chinaStoreJson("Device/GetClockInfoV3", {
    ClockId: clockId,
    ParentItemId: 0,
    ParentClockId: 0
  });
  const enriched = enrichClockInfoForLocalSave(raw);
  const cfgObj = sanitizeClockInfoForCfg(enriched);
  const cfgPath = path.join(root, "public/template/config", `${clockId}.cfg`);
  fs.mkdirSync(path.dirname(cfgPath), { recursive: true });
  fs.writeFileSync(cfgPath, JSON.stringify(cfgObj, null, "\t"), "utf8");
  console.log(`wrote ${cfgPath}`);

  const writes = planTemplateAssetWrites(clockId, enriched, { getSlotByItem, isImageItem });
  for (const w of writes) {
    const bytes = await downloadAssetBytes(w.fileAddr, { useCdnProxy: false });
    const abs = path.join(root, "public", w.relPath.replace(/\//g, path.sep));
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, bytes);
    console.log(`wrote ${w.relPath} (${bytes.length} bytes)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
