# Divoom watchface visual editor

Vite + ES modules：源码在 `src/`，大体积静态资源在 `public/`，构建输出在 `dist/`。构建使用**相对资源路径**（`base: './'`），便于整夹拷贝。

## 开发

```bash
npm install
npm run dev
```

浏览器打开 `http://127.0.0.1:5173/`（需 HTTP 才能加载 `font/`、`template/`）。

## 构建

```bash
npm run build
npm run preview
```

## Windows: one-click launch (English)

The editor **must** be served over **HTTP**. Opening `index.html` directly (`file://`) in Chrome or Edge will **not** load fonts and templates because the browser blocks `fetch()` for those paths.

### Option A — Easiest (project root)

1. Clone or download this repository.
2. **First time only (optional):** run `npm install` in the project root if you want the script to auto-build when `dist/` is missing.
3. Double-click **`Open-Editor.cmd`** in the **project root** (same folder as `package.json`).

**What it does**

- If `dist\index.html` is missing and `package.json` is present, it runs **`npm run build`** (requires **Node.js** / `npm` on your PATH).
- It starts a local HTTP server on **port 8765**, then opens your default browser to `http://127.0.0.1:8765/` after a short delay.
- **Python 3** is preferred: the script serves the **`dist`** folder with `python -m http.server` (looks for `py`, `python`, or `python3` on PATH).
- If Python is not found but **`node_modules`** exists (after `npm install`), it falls back to **`npm run preview -- --host 127.0.0.1 --port 8765`**.

**How to stop the server**

Close the minimized “Divoom HTTP” console window, or press **Ctrl+C** in that window.

**Requirements summary**

| Situation | What you need |
|-----------|----------------|
| Script should auto-create `dist/` | Node.js + npm; then run once `npm install` in the repo root |
| Only serve existing `dist/` | Python 3 on PATH, **or** `npm install` + Vite fallback as above |

### Option B — From `dist/` after build

Running `npm run build` copies `public/start-local-preview.cmd` into **`dist/start-local-preview.cmd`**. Double-clicking that file moves up to the **parent** directory and runs **`Open-Editor.cmd`**, so this **only works** if your layout is:

```text
<project-root>/
  Open-Editor.cmd
  dist/
    index.html
    start-local-preview.cmd
    …
```

If you copy **only** the `dist` folder somewhere else, either:

- also copy **`Open-Editor.cmd`** to the **parent** of `dist` (same relative layout as above), **or**
- open a terminal, `cd` into `dist`, run `python -m http.server 8765`, and visit `http://127.0.0.1:8765/` in the browser.

### Why local HTTP is required

Under `file://`, each page is treated as an isolated origin; the app uses `fetch()` to read `font/`, `template/`, etc. Serving the built site over `http://127.0.0.1` keeps everything same-origin so the editor works fully offline.

---

## 离线使用 / 为何不能只双击 index.html

现代浏览器（尤其 **Chrome、Edge**）下，每个 `file://` 页面被视为**独立源**，**不允许**用 `fetch` 再读同目录下的 `font/`、`template/` 等文件，因此**仅双击 `dist/index.html` 无法正常使用**（字体与模板列表会失败）。

**推荐做法：**

- **首选：** 在仓库根目录双击 **`Open-Editor.cmd`**（若尚无 `dist`，且已安装 Node/npm，会自动执行 `npm run build`）。
- **构建后：** 也可双击 **`dist/start-local-preview.cmd`**（会跳到上一级并调用根目录的 `Open-Editor.cmd`，因此需保持「根目录 + `dist` 子目录」这一结构）。
- **手动：** 在含 `package.json` 的目录执行 `npm run preview`，或在 `dist` 目录下用 Python：`python -m http.server 8765`，再在浏览器打开 `http://127.0.0.1:8765/`。

若探测到 `file://` 且无法读到 `font_info.cfg`，页面顶部会出现提示条（可关闭）。

## 目录说明

| 路径 | 说明 |
|------|------|
| `src/main.js` | 入口 |
| `src/editor/app.js` | 编辑器主逻辑 |
| `src/i18n/` | 多语言 |
| `public/font/` | 字体与 `font_info.cfg` |
| `public/template/` | 模板 |
| `public/examples/` | 示例 JSON |
| `Open-Editor.cmd` | 仓库根目录一键本地预览（HTTP + 自动构建可选） |
| `public/start-local-preview.cmd` | 构建后复制到 `dist/`，从 `dist` 启动时会调用根目录一键脚本 |

## 相关仓库

- GitHub: https://github.com/DivoomDevelop/divoom-watchface-visual-editor
