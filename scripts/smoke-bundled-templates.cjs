// Exercise every returned template with all HTTP requests disabled.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { app, BrowserWindow, net, protocol } = require("electron");
const { APP_ORIGIN, handleAppRequest } = require("../desktop/routes.cjs");
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "timeframe-demo-smoke-"));
app.setPath("userData", profile);
app.disableHardwareAcceleration();
protocol.registerSchemesAsPrivileged([{ scheme: "timeframe", privileges: { standard: true, secure: true, supportFetchAPI: true } }]);
app.whenReady().then(async () => {
  const bundleRoot = path.resolve(process.argv[2] || path.join(__dirname, "../dist"));
  const requests = [];
  protocol.handle("timeframe", async request => {
    if (/proxy|divoom-china/.test(request.url)) {
      if (!request.url.endsWith("/divoom-cloud-proxy/Device/ReturnSameLANDevice")) requests.push(request.url);
      return new Response("Offline test", { status: 503 });
    }
    const response = await handleAppRequest(request, { bundleRoot, assetRoot: path.join(profile, "assets"), net });
    if (request.url === `${APP_ORIGIN}/`) {
      return new Response((await response.text()).replace(/<body[^>]*>/, '$&<pre id="font-status" hidden></pre>'), { headers: response.headers });
    }
    return response;
  });
  const window = new BrowserWindow({ show: false, width: 1440, height: 1000, webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false, backgroundThrottling: false } });
  window.webContents.session.webRequest.onBeforeRequest({ urls: ["http://*/*", "https://*/*"] }, (details, done) => { requests.push(details.url); done({ cancel: true }); });
  const errors = [];
  window.webContents.on("console-message", event => {
    if (/Uncaught|init failed|OTS parsing error/.test(event.message)) errors.push(event.message);
  });
  try {
    await window.loadURL(APP_ORIGIN + "/");
    const result = await window.webContents.executeJavaScript(`(async () => {
      const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
      async function until(check, label) {
        for (let i = 0; i < 300; i++) { const value = check(); if (value) return value; await sleep(100); }
        throw new Error('Timed out: ' + label + '\\n' + document.getElementById('font-status').textContent);
      }
      const catalog = await fetch('/template/demo-catalog.json').then(r => r.json());
      const expected = catalog.response.ClockList.map(row => Number(row.ClockId));
      await until(() => document.querySelectorAll('#template-list .template-id').length === expected.length &&
        document.querySelector('#local-watchface-list .local-watch-row-main'), 'startup');
      if (document.getElementById('template-category-rail') || document.getElementById('btn-sync-templates')) throw new Error('Legacy template controls remain');
      document.getElementById('app-mode-template').click();
      await until(() => !document.getElementById('panel-template-shell').hidden, 'template page');
      const summaries = [];
      for (let index = 0; index < expected.length; index++) {
        const id = expected[index];
        const log = document.getElementById('font-status');
        log.textContent = '';
        document.querySelectorAll('#template-list > li')[index].click();
        const summary = await until(() => log.textContent.split('\\n').find(line => line.includes(' ' + id + ' ') && /成功|loaded:|已应用/.test(line)), 'template ' + id);
        if (/缺失|未找到|missing|unmapped/i.test(summary)) throw new Error(summary);
        summaries.push(summary);
      }
      for (const image of document.querySelectorAll('#template-list img')) image.loading = 'eager';
      const thumbnails = await until(() => {
        const count = [...document.querySelectorAll('#template-list img')].filter(image => image.complete && image.naturalWidth > 0).length;
        return count === expected.length ? count : 0;
      }, 'all local thumbnails');
      return { templates: expected.length, thumbnails, ids: expected, summaries };
    })()`);
    assert.deepEqual(errors, []);
    assert.deepEqual(requests, [], "Template operations must never download resources");
    const screenshot = path.join(profile, "templates.png");
    window.setContentSize(1430, 1000);
    await new Promise(resolve => setTimeout(resolve, 300));
    fs.writeFileSync(screenshot, (await window.webContents.capturePage()).toPNG());
    console.log(JSON.stringify({ ...result, offline: true, screenshot }));
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { window.destroy(); app.exit(process.exitCode || 0); }
});
