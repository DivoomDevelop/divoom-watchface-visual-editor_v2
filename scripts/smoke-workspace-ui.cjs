// Run with Electron after `npm run build`. Uses an isolated profile and a local static server.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const http = require("node:http");
const { app, BrowserWindow } = require("electron");
const root = path.resolve(__dirname, "../dist");
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "timeframe-workspace-"));
app.setPath("userData", profile);
app.disableHardwareAcceleration();

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".cfg": "application/json", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml" };
const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  const file = path.resolve(root, "." + (pathname === "/" ? "/index.html" : pathname));
  if (!file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
  if (pathname === "/template/config/") {
    response.setHeader("Content-Type", "text/html");
    response.end(fs.readdirSync(file).map((name) => `<a href="${name}">${name}</a>`).join("\n"));
    return;
  }
  fs.readFile(file, (error, bytes) => {
    if (error) { response.writeHead(404).end(); return; }
    response.setHeader("Content-Type", types[path.extname(file)] || "application/octet-stream");
    response.end(bytes);
  });
});

app.whenReady().then(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const window = new BrowserWindow({ show: false, width: 1440, height: 1000, webPreferences: {
    nodeIntegration: false, contextIsolation: true, sandbox: true, backgroundThrottling: false
  } });
  const errors = [];
  window.webContents.on("console-message", (event) => {
    if (/Uncaught|init failed/.test(event.message)) errors.push(event.message);
  });
  window.webContents.session.webRequest.onBeforeRequest({ urls: ["http://*/*", "https://*/*"] }, (details, done) => {
    done({ cancel: !details.url.startsWith(origin + "/") });
  });
  try {
    await window.loadURL(origin);
    const result = await window.webContents.executeJavaScript(`(async () => {
      const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
      async function until(check, label) {
        for (let i = 0; i < 200; i++) {
          const value = await check();
          if (value) return value;
          await sleep(100);
        }
        throw new Error('Timed out: ' + label);
      }
      const rows = () => JSON.parse(localStorage.getItem('divoom_local_watchfaces_v1') || '[]');
      await until(() => document.querySelector('#local-watchface-list .local-watch-row-main') &&
        document.querySelectorAll('#template-list li .template-id').length, 'startup and templates');
      if (document.title !== 'TimeFrame Studio') throw new Error('Incorrect product title');
      const canvas = document.getElementById('watchface-canvas');
      if (canvas.width !== 800 || canvas.height !== 1280) throw new Error('Portrait canvas changed');
      document.getElementById('btn-new-watchface').click();
      await until(() => document.getElementById('local-save-named-dialog').open, 'new design dialog');
      document.getElementById('local-save-named-input').value = 'TimeFrame UI Smoke';
      document.getElementById('local-save-named-submit').click();
      await until(() => rows().find(row => row.name === 'TimeFrame UI Smoke'), 'saved design');
      const initialId = Number(document.querySelector('.disp-picker-item').value);
      const categories = document.querySelector('.disp-picker-category');
      const originalCategory = categories.value;
      categories.value = [...categories.options].find(option => option.value !== originalCategory).value;
      categories.dispatchEvent(new Event('change', { bubbles: true }));
      if (rows().find(row => row.name === 'TimeFrame UI Smoke').config.ItemList[0].disp !== initialId) {
        throw new Error('Browsing element categories changed the saved element');
      }
      const items = document.querySelector('.disp-picker-item');
      items.value = [...items.options].find(option => option.value).value;
      items.dispatchEvent(new Event('change', { bubbles: true }));
      const picker = document.querySelector('.disp-picker-category');
      picker.value = originalCategory;
      picker.dispatchEvent(new Event('change', { bubbles: true }));
      const restoredItems = document.querySelector('.disp-picker-item');
      restoredItems.value = String(initialId);
      restoredItems.dispatchEvent(new Event('change', { bubbles: true }));
      const fonts = document.querySelector('select[data-key="font"]');
      const ttf = fonts && [...fonts.options].find(option => option.textContent.includes('[TTF]'));
      if (ttf) { fonts.value = ttf.value; fonts.dispatchEvent(new Event('change', { bubbles: true })); }
      const slider = await until(() => document.querySelector('.sep-control-slider'), 'spacing slider');
      slider.value = '17';
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      if (document.querySelector('input[data-key="sep"]').value !== '17') throw new Error('Slider did not update number');
      await until(() => rows().find(row => row.name === 'TimeFrame UI Smoke')?.config.ItemList[0].sep === 17, 'spacing autosave');
      const source = document.createElement('canvas');
      source.width = 80; source.height = 128;
      source.getContext('2d').fillRect(0, 0, 80, 128);
      const blob = await new Promise(resolve => source.toBlob(resolve, 'image/png'));
      const transfer = new DataTransfer();
      transfer.items.add(new File([blob], 'portrait.png', { type: 'image/png' }));
      const file = document.getElementById('input-bg-file');
      file.files = transfer.files; file.dispatchEvent(new Event('change', { bubbles: true }));
      await until(() => !document.getElementById('bg-resource-preview').hidden, 'background preview');
      await until(() => rows().find(row => row.name === 'TimeFrame UI Smoke')?.backgroundDataUrl, 'background autosave');
      const saved = rows().find(row => row.name === 'TimeFrame UI Smoke');
      if (!saved.thumbnailDataUrl?.startsWith('data:image/png')) throw new Error('Missing saved design thumbnail');
      const thumb = new Image();
      thumb.src = saved.thumbnailDataUrl;
      await thumb.decode();
      const sample = document.createElement('canvas');
      sample.width = thumb.width; sample.height = thumb.height;
      const context = sample.getContext('2d');
      context.drawImage(thumb, 0, 0);
      if (!context.getImageData(0, 0, sample.width, sample.height).data.some((value, index) => index % 4 !== 3 && value > 100)) {
        throw new Error('Saved thumbnail has no visible elements');
      }
      const language = document.getElementById('select-lang');
      for (const locale of ['ENGLISH', 'SC']) {
        const option = [...language.options].find(option => option.value.endsWith('_' + locale));
        if (!option) throw new Error('Missing language option: ' + locale);
        language.value = option.value; language.dispatchEvent(new Event('change', { bubbles: true }));
        if (document.title !== 'TimeFrame Studio') throw new Error('Product title changed with language');
      }
      document.getElementById('btn-about').click();
      await until(() => document.getElementById('about-dialog').open, 'about dialog');
      document.getElementById('about-doubleclick-zone').dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      await until(() => document.getElementById('admin-password-dialog').open, 'administrator dialog');
      document.getElementById('admin-password-cancel').click();
      document.getElementById('about-close').click();
      return { width: canvas.width, height: canvas.height, cards: rows().length, thumbnail: true,
        spacing: saved.config.ItemList[0].sep, templates: document.querySelectorAll('#template-list li .template-id').length };
    })()`);
    await new Promise(resolve => setTimeout(resolve, 250));
    const desktopScreenshot = path.join(profile, "workspace-desktop.png");
    fs.writeFileSync(desktopScreenshot, (await window.webContents.capturePage()).toPNG());
    await window.loadURL(origin);
    assert.equal(await window.webContents.executeJavaScript(`(async () => {
      for (let i = 0; i < 200; i++) {
        if (document.getElementById('txt-clock-title')?.textContent === 'TimeFrame UI Smoke' &&
            document.querySelector('input[data-key="sep"]')?.value === '17' &&
            !document.getElementById('bg-resource-preview').hidden) return true;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return false;
    })()`), true, "Saved design did not reopen with its spacing and background");
    for (const width of [1180, 800]) {
      window.setContentSize(width, 1000);
      let resized = false;
      for (let attempt = 0; attempt < 100 && !resized; attempt++) {
        resized = await window.webContents.executeJavaScript(`innerWidth === ${width} &&
          (getComputedStyle(document.getElementById('main-layout')).gridTemplateColumns.split(' ').length === ${width <= 1100 ? 1 : 3})`);
        if (!resized) await new Promise(resolve => setTimeout(resolve, 50));
      }
      assert.equal(resized, true, `Window did not finish resizing to ${width}px`);
      const overflow = await window.webContents.executeJavaScript("document.documentElement.scrollWidth > window.innerWidth");
      assert.equal(overflow, false, `Horizontal overflow at ${width}px`);
      if (width === 800) {
        const layout = await window.webContents.executeJavaScript(`(() => {
          const left = document.getElementById('panel-local-shell');
          const center = document.querySelector('.center-panel');
          return { content: left.scrollHeight, height: left.clientHeight,
            bottom: left.getBoundingClientRect().bottom, next: center.getBoundingClientRect().top,
            rows: getComputedStyle(document.getElementById('main-layout')).gridTemplateRows };
        })()`);
        assert.ok(layout.content <= layout.height + 1 && layout.bottom <= layout.next + 1,
          'Narrow layout clips or overlaps the design library: ' + JSON.stringify(layout));
      }
    }
    fs.writeFileSync(path.join(profile, "workspace-narrow.png"), (await window.webContents.capturePage()).toPNG());
    window.setContentSize(1440, 1000);
    await new Promise(resolve => setTimeout(resolve, 250));
    fs.writeFileSync(desktopScreenshot, (await window.webContents.capturePage()).toPNG());
    await window.webContents.executeJavaScript("document.getElementById('app-mode-template').click()");
    await new Promise(resolve => setTimeout(resolve, 1200));
    const portrait = await window.webContents.executeJavaScript(`(async () => {
      const manifest = await fetch('/desktop-assets.json').then(response => response.json());
      const canvas = document.getElementById('watchface-canvas');
      const rect = canvas.getBoundingClientRect();
      return { width: canvas.width, height: canvas.height, ratio: rect.width / rect.height,
        categories: document.querySelectorAll('#template-category-rail button').length,
        expected: manifest.templateIds.length, templates: document.querySelectorAll('#template-list li .template-id').length,
        hasUpdate: Boolean(document.getElementById('btn-sync-templates')),
        visible: !document.getElementById('panel-template-shell').hidden };
    })()`);
    assert.equal(portrait.visible, true);
    assert.equal(portrait.categories, 0);
    assert.equal(portrait.hasUpdate, false);
    assert.equal(portrait.templates, portrait.expected);
    assert.ok(Math.abs(portrait.ratio - 5 / 8) < 0.01);
    fs.writeFileSync(path.join(profile, "templates.png"), (await window.webContents.capturePage()).toPNG());
    window.setContentSize(800, 1000);
    await new Promise(resolve => setTimeout(resolve, 250));
    const templateLayout = await window.webContents.executeJavaScript(`(() => {
      const panel = document.getElementById('panel-template-shell');
      const preview = document.querySelector('.center-panel');
      return { bottom: panel.getBoundingClientRect().bottom, next: preview.getBoundingClientRect().top,
        overflow: document.documentElement.scrollWidth > innerWidth };
    })()`);
    assert.equal(templateLayout.overflow, false, 'Narrow templates overflow horizontally');
    assert.ok(templateLayout.bottom <= templateLayout.next + 1, 'Narrow templates overlap their preview');
    const applied = await window.webContents.executeJavaScript(`(async () => {
      const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
      async function until(check, label) {
        for (let i = 0; i < 300; i++) { if (check()) return; await sleep(100); }
        throw new Error('Timed out: ' + label);
      }
      const rows = () => JSON.parse(localStorage.getItem('divoom_local_watchfaces_v1') || '[]');
      const original = rows().find(row => row.name === 'TimeFrame UI Smoke');
      const before = JSON.stringify(original.config);
      const item = [...document.querySelectorAll('#template-list > li')][1];
      const name = item.querySelector('.template-id').textContent;
      item.click();
      await until(() => document.querySelector('#template-list li.active .template-id')?.textContent === name,
        'click template preview');
      if (JSON.stringify(rows().find(row => row.id === original.id).config) !== before) throw new Error('Preview modified the saved design');
      for (const [action, title] of [['button', 'TimeFrame Template Copy'], ['double-click', 'TimeFrame Double Click Copy']]) {
        if (action === 'button') document.getElementById('btn-apply-template').click();
        else {
          document.getElementById('app-mode-template').click();
          await until(() => !document.getElementById('panel-template-shell').hidden, 'return to templates');
          document.querySelector('#template-list > li').dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
        }
        await until(() => document.getElementById('local-save-named-dialog').open, 'template naming dialog');
        document.getElementById('local-save-named-input').value = title;
        document.getElementById('local-save-named-submit').click();
        await until(() => rows().some(row => row.name === title), 'save template copy');
        const copy = rows().find(row => row.name === title);
        if (copy.width !== 800 || copy.height !== 1280 || !copy.config.ItemList.length || copy.id === original.id ||
          document.getElementById('panel-local-shell').hidden) throw new Error('Template copy is not editable in the TimeFrame workspace');
      }
      return { previewReadOnly: true, apply: true, doubleClick: true };
    })()`);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ...result, restored: true, responsive: true, portrait, applied, screenshots: profile }));
  } catch (error) {
    console.error(error);
    if (errors.length) console.error(errors);
    process.exitCode = 1;
  } finally {
    window.destroy();
    server.close();
    app.exit(process.exitCode || 0);
  }
});
