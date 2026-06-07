/**
 * 本地仿真：分类缓存合并、GetClockInfoV3 补全、资源规划与 CDN 下载。
 * 用法：node scripts/simulate-template-sync.mjs [--repair-cache] [--clock 1475]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildDivoomLanEnvelope } from "../src/editor/divoomLanJson.js";
import {
  enrichClockInfoForLocalSave,
  mergeClassifyCatalogSnapshots,
  planTemplateAssetWrites
} from "../src/editor/templateSync.js";
import { downloadAssetBytes } from "../src/editor/cdnAssets.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const DEVICE_ID = Number(process.env.DIVOOM_DEVICE_ID || 300344410);
const CHINA_API = (process.env.DIVOOM_CHINA_API_TARGET || "http://appchina.divoom-gz.com:9506").replace(
  /\/$/,
  ""
);
const TEMPLATE_SLOT_COUNT = 128;
const DISP_OFFSET = { 13: 29, 46: 0, 66: 13 };

function parseArgs() {
  const args = process.argv.slice(2);
  let repairCache = false;
  let clockId = 1475;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--repair-cache") repairCache = true;
    if (args[i] === "--clock" && args[i + 1]) clockId = Number(args[++i]);
  }
  return { repairCache, clockId };
}

function loadFallbackFromApp() {
  const appSrc = fs.readFileSync(path.join(root, "src/editor/app.js"), "utf8");
  const marker = "const TEMPLATE_CLASSIFY_FALLBACK = Object.freeze(";
  const start = appSrc.indexOf(marker);
  if (start < 0) throw new Error("TEMPLATE_CLASSIFY_FALLBACK not found in app.js");
  const from = start + marker.length;
  const end = appSrc.indexOf("\n  });\n\n  /** 设备同步后写入", from);
  if (end < 0) throw new Error("TEMPLATE_CLASSIFY_FALLBACK end not found in app.js");
  const objLiteral = appSrc.slice(from, end + "\n  }".length);
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${objLiteral});`)();
}

function countIds(data) {
  return (data?.ClassifyList || []).reduce((n, r) => n + (Array.isArray(r.clockid) ? r.clockid.length : 0), 0);
}

function isImageItem(item) {
  const disp = Number(item?.disp) || 0;
  return disp === 13 || disp === 46 || disp === 66 || !!String(item?.image_addr || "").trim();
}

function getSlotByItem(clockId, item) {
  const disp = Number(item?.disp) || 0;
  const offset = DISP_OFFSET[disp];
  if (Number.isFinite(offset) && offset >= 0) {
    return clockId * TEMPLATE_SLOT_COUNT + offset + 1;
  }
  const imageId = Number(item?.image_id) || 0;
  if (imageId > 0 && imageId <= TEMPLATE_SLOT_COUNT) {
    return clockId * TEMPLATE_SLOT_COUNT + imageId;
  }
  if (imageId > TEMPLATE_SLOT_COUNT) return imageId;
  return null;
}

async function chinaStoreJson(command, payload = {}) {
  const envelope = buildDivoomLanEnvelope(command, payload, () => DEVICE_ID);
  const url = `${CHINA_API}/${String(command).replace(/^\//, "")}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify(envelope)
  });
  const text = await res.text();
  const data = JSON.parse(text);
  if (!res.ok || Number(data.ReturnCode) !== 0) {
    throw new Error(`API ${command}: ${data.ReturnMessage || res.status}`);
  }
  return data;
}

function repairClassifyCache(fallback) {
  const cachePath = path.join(root, "public/template/classify-cache.json");
  const corrupt = JSON.parse(fs.readFileSync(cachePath, "utf8"));
  const merged = mergeClassifyCatalogSnapshots(fallback, corrupt);
  fs.writeFileSync(cachePath, JSON.stringify(merged, null, 2), "utf8");
  console.log(`[repair-cache] clock ids: ${countIds(corrupt)} -> ${countIds(merged)}`);
  return merged;
}

async function simulateClockDownload(clockId) {
  console.log(`\n[clock ${clockId}] fetch GetClockInfoV3...`);
  const raw = await chinaStoreJson("Device/GetClockInfoV3", {
    ClockId: clockId,
    ParentItemId: 0,
    ParentClockId: 0
  });
  const enriched = enrichClockInfoForLocalSave(raw);
  console.log(`  DeviceImageUrl: ${String(enriched.DeviceImageUrl || "").slice(0, 60) || "(empty)"}`);
  console.log(
    `  DevicePreviewImageUrl: ${String(enriched.DevicePreviewImageUrl || enriched.DevPreviewSmallImgUrl || "").slice(0, 60) || "(empty)"}`
  );

  const writes = planTemplateAssetWrites(clockId, enriched, { getSlotByItem, isImageItem });
  console.log(`  planned asset writes: ${writes.length}`);
  for (const w of writes.slice(0, 5)) {
    console.log(`    - ${w.relPath}`);
  }
  if (writes.length > 5) console.log(`    ... +${writes.length - 5} more`);

  let ok = 0;
  let fail = 0;
  for (const w of writes.slice(0, 3)) {
    try {
      const bytes = await downloadAssetBytes(w.fileAddr, { useCdnProxy: false });
      console.log(`  CDN OK ${w.relPath} (${bytes.length} bytes)`);
      ok += 1;
    } catch (e) {
      console.log(`  CDN FAIL ${w.relPath}: ${e.message}`);
      fail += 1;
    }
  }
  return { writes: writes.length, cdnOk: ok, cdnFail: fail };
}

async function main() {
  const { repairCache, clockId } = parseArgs();
  const fallback = loadFallbackFromApp();
  console.log(`[fallback] categories=${fallback.ClassifyList.length} clocks=${countIds(fallback)}`);

  const cachePath = path.join(root, "public/template/classify-cache.json");
  const fileData = JSON.parse(fs.readFileSync(cachePath, "utf8"));
  const merged = mergeClassifyCatalogSnapshots(fallback, fileData);
  console.log(`[merge-runtime] file clocks=${countIds(fileData)} merged=${countIds(merged)}`);

  if (repairCache || countIds(fileData) < countIds(fallback) * 0.9) {
    repairClassifyCache(fallback);
  }

  const dl = await simulateClockDownload(clockId);
  console.log(`\n[summary] assets=${dl.writes} cdn_sample_ok=${dl.cdnOk} cdn_sample_fail=${dl.cdnFail}`);
  if (dl.cdnFail > 0 && dl.cdnOk === 0) {
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
