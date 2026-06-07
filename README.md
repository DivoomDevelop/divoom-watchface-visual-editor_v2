# Divoom watchface visual editor

Vite + ES modules: application source lives under `src/`, large static assets under `public/`, and build output under `dist/`. The build uses **relative asset URLs** (`base: './'`) so you can copy the whole `dist/` folder as-is.

## Development

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173/` in the browser. The app must be served over **HTTP** so `font/` and `template/` can load.

## Build

```bash
npm run build
npm run preview
```

## Windows: one-click launch

The editor **must** be served over **HTTP**. Opening `index.html` directly (`file://`) in Chrome or Edge will **not** load fonts and templates because the browser blocks `fetch()` for those paths.

### Option A — Project root (recommended)

1. Clone or download this repository.
2. **First time only (optional):** run `npm install` in the project root if you want the script to auto-build when `dist/` is missing.
3. Double-click `**Open-Editor.cmd`** in the **project root** (same folder as `package.json`).

**What it does**

- If `dist\index.html` is missing and `package.json` is present, it runs `**npm run build`** (requires **Node.js** / `npm` on your PATH).
- It starts an HTTP server on **port 8765**, then opens your default browser to `http://127.0.0.1:8765/` after a short delay.
- **Python 3** is preferred: the script serves the `**dist`** folder with `python -m http.server` (looks for `py`, `python`, or `python3` on PATH).
- If Python is not found but `**node_modules**` exists (after `npm install`), it falls back to `**npm run preview -- --host 127.0.0.1 --port 8765**`.

**How to stop the server**

Close the minimized “Divoom HTTP” console window, or press **Ctrl+C** in that window.

**Requirements summary**


| Situation                         | What you need                                                   |
| --------------------------------- | --------------------------------------------------------------- |
| Script should auto-create `dist/` | Node.js + npm; then run once `npm install` in the repo root     |
| Only serve existing `dist/`       | Python 3 on PATH, **or** `npm install` + Vite fallback as above |


### Option B — From `dist/` after build

Running `npm run build` copies `public/start-local-preview.cmd` into `**dist/start-local-preview.cmd`**. Double-clicking that file moves up to the **parent** directory and runs `**Open-Editor.cmd`**, so this **only works** if your layout is:

```text
<project-root>/
  Open-Editor.cmd
  dist/
    index.html
    start-local-preview.cmd
    …
```

If you copy **only** the `dist` folder somewhere else, either:

- also copy `**Open-Editor.cmd`** to the **parent** of `dist` (same relative layout as above), **or**
- open a terminal, `cd` into `dist`, run `python -m http.server 8765`, and visit `http://127.0.0.1:8765/` in the browser.

### Why HTTP is required

Under `file://`, each page is treated as an isolated origin; the app uses `fetch()` to read `font/`, `template/`, and related paths. Serving the built site over `http://127.0.0.1` keeps everything same-origin so the editor can load those assets.

---

## Why double-clicking `index.html` is not enough

In modern browsers (especially **Chrome** and **Edge**), a `file://` page is a separate origin and **cannot** use `fetch()` to read neighboring files such as `font/` and `template/`. Opening `**dist/index.html` directly** therefore breaks font and template loading.

**Recommended:**

- **Preferred:** double-click `**Open-Editor.cmd`** at the repo root (if `dist/` is missing and Node/npm are installed, it can run `npm run build` automatically).
- **After build:** you can double-click `**dist/start-local-preview.cmd`** (it goes up one level and runs the root `**Open-Editor.cmd**`, so keep the **root + `dist/`** layout).
- **Manual:** run `npm run preview` from the folder that contains `package.json`, or `cd` into `dist` and run `python -m http.server 8765`, then open `http://127.0.0.1:8765/` in the browser.

If the page is opened as `file://` and `font_info.cfg` cannot be read, a dismissible banner appears at the top.

## AI / LLM authoring

To generate watchface JSON with external AI tools using **this repo’s font IDs and `disp` enum**, see **`docs/AI_WATCHFACE_GUIDE.md`**.

**`npm run build`** automatically runs **`npm run gen:ai-docs`** first (via npm `prebuild`), refreshing **`docs/generated/ai-font-catalog.json`** and **`docs/generated/disp-catalog.json`**. You can still run `npm run gen:ai-docs` alone during development without building.

## Directory layout


| Path                             | Purpose                                                                 |
| -------------------------------- | ----------------------------------------------------------------------- |
| `src/main.js`                    | Entry point                                                             |
| `src/editor/app.js`              | Editor logic                                                            |
| `src/i18n/`                      | Translations                                                            |
| `public/font/`                   | Fonts and `font_info.cfg`                                               |
| `public/template/`               | Templates                                                               |
| `public/examples/`               | Sample JSON                                                             |
| `docs/FIRMWARE_REFERENCE.md`     | Divoom firmware source path & LAN protocol map (template/font sync)    |
| `docs/AI_WATCHFACE_GUIDE.md`     | AI-friendly catalogs & schema pointers                                  |
| `docs/generated/`                | Regenerated by `npm run gen:ai-docs` (font + disp JSON for LLMs)       |
| `scripts/gen-ai-docs.mjs`        | Builds `docs/generated/*` from `font_info.cfg` + `app.js`             |
| `public/start-local-preview.cmd` | Copied into `dist/`; invokes the root script when launched from `dist/` |


## Related repository (v2)

- GitHub: [https://github.com/DivoomDevelop/divoom-watchface-visual-editor_v2](https://github.com/DivoomDevelop/divoom-watchface-visual-editor_v2)
- GitHub Pages: [https://divoomdevelop.github.io/divoom-watchface-visual-editor_v2/](https://divoomdevelop.github.io/divoom-watchface-visual-editor_v2/)

Publishing and tooling docs refer to the **v2 repository** and the Pages URL above.