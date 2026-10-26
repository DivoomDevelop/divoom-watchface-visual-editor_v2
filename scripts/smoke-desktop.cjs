const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { app, BrowserWindow, net, protocol } = require("electron");
const { APP_ORIGIN, handleAppRequest } = require("../desktop/routes.cjs");

const profile = fs.mkdtempSync(path.join(os.tmpdir(), "timeframe-smoke-"));
app.setPath("userData", profile);
protocol.registerSchemesAsPrivileged([
  { scheme: "timeframe", privileges: { standard: true, secure: true, supportFetchAPI: true } }
]);

app.whenReady().then(async () => {
  const { session } = require("electron");
  session.defaultSession.webRequest.onBeforeRequest({ urls: ["http://*/*", "https://*/*"] }, (_details, done) => done({ cancel: true }));
  const bundleRoot = path.join(__dirname, "..", "dist");
  const assetRoot = path.join(profile, "downloaded-assets");
  protocol.handle("timeframe", (request) => handleAppRequest(request, { bundleRoot, assetRoot, net }));
  const window = new BrowserWindow({ show: false, webPreferences: {
    nodeIntegration: false, contextIsolation: true, sandbox: true, webSecurity: true
  } });
  try {
    await window.loadURL(`${APP_ORIGIN}/`);
    const result = await window.webContents.executeJavaScript(`(async () => {
      for (let i = 0; i < 200 && !document.querySelector('#template-list .template-id'); i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (!document.querySelector('#template-list .template-id')) throw new Error('Offline templates did not load');
      const manifest = await fetch('/desktop-assets.json').then(r => r.json());
      const index = await fetch('/template/config/').then(r => r.text());
      const canvas = document.getElementById('watchface-canvas');
      if (canvas.width !== 800 || canvas.height !== 1280 || manifest.product !== 'TimeFrame' ||
        !manifest.templateIds.every(id => index.includes(id + '.cfg'))) throw new Error('Incorrect TimeFrame bundle');
      const health = await fetch('/api/template-sync/health').then(r => r.json());
      const font = await fetch('/font/font_info.cfg');
      const write = await fetch('/api/template-sync/write', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ relPath: 'template/config/999999.cfg', base64: btoa('{"smoke":true}') })
      });
      const saved = await fetch('/template/config/999999.cfg').then(r => r.json());
      const db = await new Promise((resolve, reject) => {
        const req = indexedDB.open('desktop-smoke', 1);
        req.onsuccess = () => { req.result.close(); resolve(true); };
        req.onerror = () => reject(req.error);
      });
      return {
        origin: location.origin,
        protocol: location.protocol,
        title: document.title,
        hasEditor: Boolean(document.getElementById('watchface-canvas')),
        canvas: [canvas.width, canvas.height], templates: manifest.templateIds.length,
        resources: manifest.resourceCount,
        health: health.ok,
        fontStatus: font.status,
        writeStatus: write.status,
        saved: saved.smoke,
        indexedDb: db
      };
    })()`);
    console.log(JSON.stringify(result));
    if (result.origin !== APP_ORIGIN || !result.hasEditor || !result.health || result.fontStatus !== 200 ||
        result.writeStatus !== 200 || !result.saved || !result.indexedDb) {
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    window.destroy();
    app.exit(process.exitCode || 0);
  }
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
  app.exit(process.exitCode || 0);
});

app.on("quit", () => {
  try {
    if (profile.startsWith(path.resolve(os.tmpdir()) + path.sep)) fs.rmSync(profile, { recursive: true, force: true });
  } catch { /* Windows may still hold Chromium files */ }
});
