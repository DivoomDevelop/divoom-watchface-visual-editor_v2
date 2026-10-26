// Snapshot the product's own public resources after Vite has copied them into dist.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "public");
const distRoot = path.join(root, "dist");
const packageData = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const build = JSON.parse(fs.readFileSync(path.join(root, "version.json"), "utf8")).build;
const files = {};
function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) { visit(absolute); continue; }
    if (!entry.isFile()) throw new Error(`Unsupported public resource: ${absolute}`);
    const relative = path.relative(publicRoot, absolute).split(path.sep).join("/");
    if (relative === "start-local-preview.cmd") continue;
    const source = fs.readFileSync(absolute);
    const bundled = fs.readFileSync(path.join(distRoot, relative));
    if (!source.equals(bundled)) throw new Error(`Bundled resource differs: ${relative}`);
    files[relative] = { bytes: source.length, sha256: crypto.createHash("sha256").update(source).digest("hex") };
  }
}
visit(publicRoot);
const templateCatalog = JSON.parse(fs.readFileSync(path.join(publicRoot, "template/demo-catalog.json"), "utf8"));
const templateIds = templateCatalog.ClockList.map(row => Number(row.ClockId));
const actualIds = Object.keys(files).filter(name => /^template\/config\/\d+\.cfg$/.test(name))
  .map(name => Number(path.basename(name, ".cfg"))).sort((a, b) => a - b);
if (JSON.stringify([...templateIds].sort((a, b) => a - b)) !== JSON.stringify(actualIds)) throw new Error("Only API-returned template configurations may be bundled");
if (!templateIds.length || !files["font/font_info.cfg"]) throw new Error("Missing bundled TimeFrame templates or fonts");
const manifest = {
  product: "TimeFrame", version: packageData.version, build,
  canvas: { width: 800, height: 1280 }, templateElementSlots: 128,
  templateIds, resourceCount: Object.keys(files).length,
  templateSource: templateCatalog.source,
  totalBytes: Object.values(files).reduce((sum, file) => sum + file.bytes, 0), files
};
const output = path.join(distRoot, "desktop-assets.json");
if (fs.existsSync(output)) fs.readFileSync(output, "utf8");
fs.writeFileSync(output, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Bundled TimeFrame snapshot: ${templateIds.length} templates, ${manifest.resourceCount} resources, ${manifest.totalBytes} bytes.`);
