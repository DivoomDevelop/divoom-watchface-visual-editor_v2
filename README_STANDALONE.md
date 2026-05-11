本目录为 **Legacy 独立工程**（原版 `html/`，不含 `modern-editor`）。

- 静态资源：`font/`、`template/`、`examples/`、`i18n/` 等均在本目录内，与其它工程无关。
- 启动：在本目录运行 HTTP 服务后打开 `index.html`，例如：
  `python -m http.server 9001 --bind 127.0.0.1`
- 详情请同时阅读上级目录 `divoom_watch/README.md`。
