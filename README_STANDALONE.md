The **TimeFrame desktop installer** includes the editor, fonts, templates, and resources. Users do not need Node.js, Python, Vite, or a separate browser. See [desktop packaging and installation](docs/DESKTOP_PACKAGING.en.md).

For web development, run `npm install` and `npm run dev`. Static resources live in `public/font`, `public/template`, and `public/examples`; source code lives in `src/` (`src/main.js` and `src/editor/app.js`).

For the web preview's double-click launcher, see **Windows: one-click launch** in [README.md](README.md). The `Open-Editor.cmd` launcher is separate from the desktop installer and still requires a local development runtime.
