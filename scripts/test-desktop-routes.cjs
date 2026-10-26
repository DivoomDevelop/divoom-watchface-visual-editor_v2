const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { handleAppRequest, resolveLanTarget, resourcePath, writablePath, proxyTarget } = require("../desktop/routes.cjs");

test("desktop paths only expose the intended assets and LAN targets", () => {
  assert.equal(resourcePath("/"), "index.html");
  assert.throws(() => resourcePath("/%2e%2e/secret"));
  assert.throws(() => writablePath("../../secret"));
  assert.throws(() => writablePath("template/config/evil.html"));
  assert.equal(writablePath("disp/disp_info.cfg"), "disp/disp_info.cfg");
  assert.equal(writablePath("template/33/2416.app.webp"), "template/33/2416.app.webp");
  assert.equal(writablePath("template/29/timeframe-2561.bin"), "template/29/timeframe-2561.bin");
  assert.throws(() => writablePath("template/15/timeframe-2561.bin"));
  assert.equal(resolveLanTarget("http://192.168.1.8:9000"), "http://192.168.1.8:9000");
  assert.throws(() => resolveLanTarget("http://example.com:9000"));
  assert.throws(() => resolveLanTarget("http://192.168.1.8:8080"));
  assert.equal(
    proxyTarget(new URL("timeframe://app/divoom-cdn-proxy/font/1.bin?x=1"), new Headers()),
    "https://f.divoom-gz.com/font/1.bin?x=1"
  );
});

test("bundled assets, downloaded overrides, deletion, and proxy requests work", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "timeframe-routes-"));
  t.after(() => {
    assert.ok(root.startsWith(path.resolve(os.tmpdir()) + path.sep));
    return fs.rm(root, { recursive: true, force: true });
  });
  const bundleRoot = path.join(root, "dist");
  const assetRoot = path.join(root, "user");
  await fs.mkdir(path.join(bundleRoot, "font"), { recursive: true });
  await fs.writeFile(path.join(bundleRoot, "index.html"), "<title>Editor</title>");
  await fs.writeFile(path.join(bundleRoot, "font", "font_info.cfg"), '{"bundled":true}');
  let forwarded;
  const net = { fetch: async (url, init) => {
    forwarded = { url, init };
    return new Response('{"ReturnCode":0}', { status: 200 });
  } };
  const route = (request) => handleAppRequest(request, { bundleRoot, assetRoot, net });

  let response = await route(new Request("timeframe://app/"));
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Editor/);
  assert.ok(response.headers.get("content-security-policy"));

  const write = (relPath, value) => route(new Request("timeframe://app/api/template-sync/write", {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ relPath, base64: Buffer.from(value).toString("base64") })
  }));
  response = await write("font/font_info.cfg", '{"new":true}');
  assert.equal(response.status, 200);
  response = await route(new Request("timeframe://app/font/font_info.cfg"));
  assert.equal(await response.text(), '{"new":true}');
  response = await write("disp/disp_info.cfg", '{"disp":1}');
  assert.equal(response.status, 200);
  response = await write("template/29/timeframe-2561.bin", 'image bytes');
  assert.equal(response.status, 200);
  response = await route(new Request("timeframe://app/template/29/timeframe-2561.bin"));
  assert.equal(await response.text(), 'image bytes');

  response = await route(new Request("timeframe://app/api/template-sync/delete", {
    method: "POST", body: JSON.stringify({ relPath: "font/font_info.cfg" })
  }));
  assert.equal(response.status, 200);
  response = await route(new Request("timeframe://app/font/font_info.cfg"));
  assert.equal(response.status, 404);

  response = await route(new Request("timeframe://app/divoom-proxy/Device/SetClock", {
    method: "POST",
    headers: { "X-Divoom-Lan-Target": "http://192.168.1.8:9000", "content-type": "application/json" },
    body: '{"ClockId":1}'
  }));
  assert.equal(response.status, 200);
  assert.equal(forwarded.url, "http://192.168.1.8:9000/Device/SetClock");
  assert.equal(forwarded.init.body.toString(), '{"ClockId":1}');
  assert.equal(forwarded.init.headers.get("x-divoom-lan-target"), null);
});
