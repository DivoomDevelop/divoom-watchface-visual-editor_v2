module.exports = {
  appId: "com.divoom.timeframe.watchfaceeditor",
  productName: "TimeFrame Watchface Editor",
  asar: true,
  electronDist: process.platform === "win32" ? "node_modules/electron/dist" : undefined,
  directories: { output: "out-desktop" },
  files: ["package.json", "desktop/**/*", "build/icon.png", "dist/**/*", "!dist/start-local-preview.cmd"],
  win: {
    icon: "build/icon.ico",
    target: "nsis",
    artifactName: "TimeFrame-Watchface-Editor-${version}-win-${arch}-setup.${ext}"
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    deleteAppDataOnUninstall: false
  },
  mac: {
    icon: "build/icon.png",
    target: "dmg",
    category: "public.app-category.graphics-design",
    hardenedRuntime: true,
    notarize: true,
    artifactName: "TimeFrame-Watchface-Editor-${version}-mac-${arch}.${ext}"
  }
};
