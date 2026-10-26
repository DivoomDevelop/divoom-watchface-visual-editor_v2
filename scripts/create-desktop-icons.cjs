// Render the product's SVG into installer icons using the pinned Electron runtime.
const fs = require("node:fs");
const path = require("node:path");
const { app, BrowserWindow } = require("electron");
app.disableHardwareAcceleration();
app.whenReady().then(async () => {
  const directory = path.resolve(__dirname, "../build");
  const svg = fs.readFileSync(path.join(directory, "icon.svg"), "utf8");
  const window = new BrowserWindow({ show: false, webPreferences: { sandbox: true } });
  try {
    await window.loadURL("about:blank");
    for (const size of [512, 256]) {
      const dataUrl = await window.webContents.executeJavaScript(`(async () => {
        const image = new Image();
        image.src = ${JSON.stringify("data:image/svg+xml;base64," + Buffer.from(svg).toString("base64"))};
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = ${size};
        canvas.getContext('2d').drawImage(image, 0, 0, ${size}, ${size});
        return canvas.toDataURL('image/png');
      })()`);
      const png = Buffer.from(dataUrl.split(",")[1], "base64");
      const destination = path.join(directory, size === 512 ? "icon.png" : "icon.ico");
      if (fs.existsSync(destination)) fs.readFileSync(destination);
      if (size === 512) fs.writeFileSync(destination, png);
      else {
        const header = Buffer.alloc(22);
        header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
        header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
        header.writeUInt32LE(png.length, 14); header.writeUInt32LE(22, 18);
        fs.writeFileSync(destination, Buffer.concat([header, png]));
      }
    }
    console.log("Generated TimeFrame PNG and ICO icons");
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { window.destroy(); app.exit(process.exitCode || 0); }
});
