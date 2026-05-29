#!/usr/bin/env node
/**
 * Generates AI-facing artifacts from repo sources:
 * - docs/generated/ai-font-catalog.json  ← public/font/font_info.cfg
 * - docs/generated/ai-font-guide.md        ← font style/use-case descriptions for LLMs
 * - docs/generated/disp-catalog.json     ← DISP_NAME_MAP in src/editor/app.js
 * Run after changing fonts or disp enum in editor source.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildFontGuideMarkdown } from "./font-ai-descriptions.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "docs", "generated");

function dispHints(name) {
  const u = String(name || "").toUpperCase();
  const pictureLike =
    /(^|_)(PIC|PICTURE|GIF|IMAGE|QR|HEAD|POINTER|NET\d|WORLD_TIME)|_(GIF|IMG)|GIF\d/.test(u);
  const textClockLike =
    /HOUR|MIN|SEC|WEEK|MON|DAY|YEAR|TEXT|MESSAGE|TITLE|DATA|DIGIT|TEMP|NOISE(?![_A-Z]*IMAGE)|ENG_|CHINA_|DATE|COUNT|AM_PM|TIME/.test(
      u
    );
  return {
    likelyUsesRasterOrAssetLayer: pictureLike,
    oftenUsesVectorFontForText:
      !pictureLike && (textClockLike || /APP_ITEM|APP_TITLE|APP_CON|WEATHER_WORD|MUL_TEXT/.test(u)),
    note:
      "Heuristic only; firmware may differ. Validate in editor preview when unsure."
  };
}

function extractDispCatalog(appSrc) {
  const needle = "const DISP_NAME_MAP = Object.freeze({";
  const start = appSrc.indexOf(needle);
  if (start < 0) throw new Error("DISP_NAME_MAP block not found in src/editor/app.js");
  const slice = appSrc.slice(start);
  const openIdx = slice.indexOf("{");
  let depth = 0;
  for (let i = openIdx; i < slice.length; i++) {
    const c = slice[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        const body = slice.slice(openIdx + 1, i);
        const rows = [];
        const re = /^\s*(\d+)\s*:\s*"([^"]*)"/gm;
        let m;
        while ((m = re.exec(body))) {
          const disp = Number(m[1]);
          const name = m[2];
          rows.push({
            disp,
            name,
            hints: dispHints(name)
          });
        }
        rows.sort((a, b) => a.disp - b.disp);
        return rows;
      }
    }
  }
  throw new Error("Unterminated DISP_NAME_MAP");
}

function readFontCatalog(cfgPath) {
  let raw = fs.readFileSync(cfgPath, "utf8");
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
  const json = JSON.parse(raw);
  const list = Array.isArray(json.FontList)
    ? json.FontList
    : Array.isArray(json.font_list)
      ? json.font_list
      : [];
  const fonts = [];
  for (const item of list) {
    const id = Number(item.id ?? item.ID);
    if (!Number.isFinite(id)) continue;
    const type = Number(item.type ?? item.Type ?? 1);
    const charset = String(item.charset ?? item.Charset ?? "");
    fonts.push({
      id,
      type,
      typeLabel: type === 0 ? "image_glyph" : "vector_ttf",
      name: String(item.name ?? item.Name ?? item.NameEn ?? item.NameCn ?? "").trim(),
      url: String(item.url ?? item.Url ?? ""),
      charsetLength: charset.length,
      charsetPreview: charset.length > 120 ? `${charset.slice(0, 120)}…` : charset
    });
  }
  fonts.sort((a, b) => a.id - b.id);
  return fonts;
}

function main() {
  const fontCfgPath = path.join(ROOT, "public", "font", "font_info.cfg");
  const appJsPath = path.join(ROOT, "src", "editor", "app.js");

  if (!fs.existsSync(fontCfgPath)) throw new Error(`Missing ${fontCfgPath}`);
  if (!fs.existsSync(appJsPath)) throw new Error(`Missing ${appJsPath}`);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const generatedAt = new Date().toISOString();
  const fonts = readFontCatalog(fontCfgPath);
  const allowedFontIds = fonts.map((f) => f.id);
  const appSrc = fs.readFileSync(appJsPath, "utf8");
  const displays = extractDispCatalog(appSrc);

  const fontCatalog = {
    generatedAt,
    sourceFile: "public/font/font_info.cfg",
    summary: {
      count: fonts.length,
      vectorTtfCount: fonts.filter((f) => f.type !== 0).length,
      imageGlyphCount: fonts.filter((f) => f.type === 0).length
    },
    rulesForModels: [
      "Every ItemList entry uses numeric font field; MUST be one of allowedFontIds (or firmware may fall back / fail).",
      "type 0 (image_glyph): bitmap glyph atlas — editor hides size/sep/color styling for preview; use layout rect + alig only.",
      "type 1 (vector_ttf): TrueType — full text styling fields apply.",
      "Device loads font files by firmware rules (often id+1 mapping); do not invent font IDs.",
      "charset on image fonts lists drawable characters; empty charset often means full atlas handled by device."
    ],
    allowedFontIds,
    fonts
  };

  const dispCatalog = {
    generatedAt,
    sourceFile: "src/editor/app.js (DISP_NAME_MAP)",
    summary: { count: displays.length },
    rulesForModels: [
      "disp is the render/driver kind for an item (time slice, image slot, text, etc.).",
      "Names ending with IMAGE/GIF/PIC often need assets (image_addr / template) not just font.",
      "When hints.oftenUsesVectorFontForText is true, prefer type 1 fonts from the catalog.",
      "Always validate layout (x,y,w,h) within logical canvas (common 800×1280 for this editor)."
    ],
    displays
  };

  const fontGuideMd = buildFontGuideMarkdown(fonts, generatedAt);

  const bundle = {
    generatedAt,
    aiWatchfaceGuide: "docs/AI_WATCHFACE_GUIDE.md",
    fontGuide: "docs/generated/ai-font-guide.md",
    schema: "docs/watchface-config.schema.json",
    exampleMinimal: "docs/examples/ai-minimal-watchface.json",
    fontCatalog: fontCatalog.summary,
    dispCatalog: dispCatalog.summary
  };

  fs.writeFileSync(path.join(OUT_DIR, "ai-font-catalog.json"), JSON.stringify(fontCatalog, null, 2), "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "disp-catalog.json"), JSON.stringify(dispCatalog, null, 2), "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "ai-font-guide.md"), fontGuideMd, "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "ai-context-bundle.meta.json"), JSON.stringify(bundle, null, 2), "utf8");

  console.log(`Wrote ${path.relative(ROOT, OUT_DIR)}/ai-font-catalog.json (${fonts.length} fonts)`);
  console.log(`Wrote ${path.relative(ROOT, OUT_DIR)}/ai-font-guide.md`);
  console.log(`Wrote ${path.relative(ROOT, OUT_DIR)}/disp-catalog.json (${displays.length} disp kinds)`);
}

main();
