# Divoom watchface visual editor

Vite + ES modules 架构：UI 与逻辑在 `src/`，大体积静态资源在 `public/`（字体、模板 cfg、示例 JSON），构建产物输出到 `dist/`。

## 开发

```bash
npm install
npm run dev
```

默认打开 `http://127.0.0.1:5173/`（须用 HTTP，以便加载 `public/font` 与 `public/template`）。

## 构建

```bash
npm run build
npm run preview
```

## 目录说明

| 路径 | 说明 |
|------|------|
| `src/main.js` | 入口：样式 + 挂载编辑器 |
| `src/editor/app.js` | 表盘编辑器主逻辑（由历史单体逐步可再拆分） |
| `src/i18n/` | 多语言文案 |
| `public/font/` | 字体与 `font_info.cfg` |
| `public/template/` | 模板配置与资源 |
| `public/examples/` | 示例表盘 JSON |

## 相关仓库

- GitHub: https://github.com/DivoomDevelop/divoom-watchface-visual-editor
