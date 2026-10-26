const path = require("node:path");
const { app, BrowserWindow, net, protocol } = require("electron");
const { APP_ORIGIN, handleAppRequest } = require("./routes.cjs");
const smokeTest = app.commandLine.hasSwitch("desktop-smoke");
if (smokeTest) {
  const profile = app.commandLine.getSwitchValue("user-data-dir");
  if (!path.isAbsolute(profile)) throw new Error("Smoke tests require an isolated absolute profile path");
  app.setPath("userData", profile);
  app.disableHardwareAcceleration();
}

protocol.registerSchemesAsPrivileged([
  { scheme: "timeframe", privileges: { standard: true, secure: true, supportFetchAPI: true } }
]);

const hasInstanceLock = app.requestSingleInstanceLock();
if (!hasInstanceLock) app.quit();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    title: "TimeFrame Watchface Editor",
    width: 1440,
    height: 900,
    minWidth: 1050,
    minHeight: 680,
    icon: path.join(__dirname, "../build/icon.png"),
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true
    }
  });
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith(`${APP_ORIGIN}/`)) event.preventDefault();
  });
  mainWindow.once("ready-to-show", () => { if (!smokeTest) mainWindow.show(); });
  mainWindow.on("closed", () => { mainWindow = null; });
  mainWindow.loadURL(`${APP_ORIGIN}/`);
}

if (hasInstanceLock) {
  app.setName("TimeFrame Watchface Editor");
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
  app.whenReady().then(() => {
    const bundleRoot = path.join(app.getAppPath(), "dist");
    const assetRoot = path.join(app.getPath("userData"), "downloaded-assets");
    if (smokeTest) {
      const { session } = require("electron");
      session.defaultSession.webRequest.onBeforeRequest({ urls: ["http://*/*", "https://*/*"] }, (_details, done) => done({ cancel: true }));
    }
    protocol.handle("timeframe", (request) => handleAppRequest(request, { bundleRoot, assetRoot, net }));
    createWindow();
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}
