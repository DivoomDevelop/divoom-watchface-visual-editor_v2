// Check the installed app's resources against the build snapshot inside its ASAR.
const assert = require("node:assert/strict");
const path = require("node:path");
const crypto = require("node:crypto");
const asar = require("@electron/asar");

const archive = process.argv[2];
assert.ok(archive, "Usage: npm run desktop:verify -- <path/to/app.asar>");
const read = relative => asar.extractFile(archive, path.join("dist", ...relative.split("/")));
const manifest = JSON.parse(read("desktop-assets.json"));
const packageData = JSON.parse(asar.extractFile(archive, "package.json"));
assert.equal(packageData.productName, "TimeFrame Watchface Editor");
assert.ok(asar.extractFile(archive, path.join("build", "icon.png")).length > 0, "Missing product icon");
assert.equal(manifest.product, "TimeFrame");
assert.equal(manifest.version, packageData.version);
assert.deepEqual(manifest.canvas, { width: 800, height: 1280 });
assert.equal(manifest.templateElementSlots, 128);
assert.ok(manifest.templateIds.length > 0);
assert.equal(Object.keys(manifest.files).length, manifest.resourceCount);
for (const [relative, expected] of Object.entries(manifest.files)) {
  const bytes = read(relative);
  assert.equal(bytes.length, expected.bytes, `Resource size: ${relative}`);
  assert.equal(crypto.createHash("sha256").update(bytes).digest("hex"), expected.sha256, `Resource hash: ${relative}`);
}
for (const id of manifest.templateIds) assert.ok(manifest.files[`template/config/${id}.cfg`]);
const catalog = JSON.parse(read("template/demo-catalog.json"));
assert.equal(catalog.source, "Device/GetDemoClockList");
assert.deepEqual(manifest.templateIds, catalog.response.ClockList.map(row => Number(row.ClockId)));
const packagedTemplates = asar.listPackage(archive).map(name => name.replace(/\\/g, "/"))
  .filter(name => name.startsWith("/dist/template/") && !asar.statFile(archive, path.join(...name.split("/").filter(Boolean))).files);
const expectedTemplates = new Set(Object.keys(manifest.files).filter(name => name.startsWith("template/")).map(name => "/dist/" + name));
for (const name of packagedTemplates) assert.ok(expectedTemplates.has(name), `Unexpected legacy template resource: ${name}`);
console.log(`Verified TimeFrame installer: ${manifest.templateIds.length} templates, ${manifest.resourceCount} resources, ${manifest.totalBytes} bytes.`);
