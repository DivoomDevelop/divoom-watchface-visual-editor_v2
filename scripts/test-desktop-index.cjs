const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { handleAppRequest } = require("../desktop/routes.cjs");

test("TimeFrame directory index includes downloaded clocks and respects removed bundled clocks", async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "timeframe-index-"));
  t.after(async () => {
    assert.ok(root.startsWith(path.resolve(os.tmpdir()) + path.sep));
    await fs.rm(root, { recursive: true, force: true });
  });
  const bundleRoot = path.join(root, "dist"), assetRoot = path.join(root, "user");
  await fs.mkdir(path.join(bundleRoot, "template/config"), { recursive: true });
  await fs.mkdir(path.join(assetRoot, "template/config"), { recursive: true });
  await fs.writeFile(path.join(bundleRoot, "template/config/286.cfg"), "{}");
  await fs.writeFile(path.join(bundleRoot, "template/config/362.cfg"), "{}");
  await fs.writeFile(path.join(assetRoot, "template/config/900.cfg"), "{}");
  await fs.writeFile(path.join(assetRoot, "template/config/evil.html"), "ignored");
  const route = (pathname, options) => handleAppRequest(new Request("timeframe://app" + pathname, options), { bundleRoot, assetRoot, net: {} });
  let response = await route("/template/config/");
  assert.match(await response.text(), /286\.cfg.*\n.*362\.cfg.*\n.*900\.cfg/);
  await route("/api/template-sync/delete", { method: "POST", body: JSON.stringify({ relPath: "template/config/286.cfg" }) });
  const index = await (await route("/template/config/")).text();
  assert.doesNotMatch(index, /286|evil/);
  assert.match(index, /900\.cfg/);
  assert.equal((await route("/template/config/", { method: "POST" })).status, 405);
  assert.equal((await route("/template/config/", { method: "HEAD" })).body, null);
  assert.equal((await handleAppRequest(new Request("astrotoo://app/"), { bundleRoot, assetRoot, net: {} })).status, 404);
});
