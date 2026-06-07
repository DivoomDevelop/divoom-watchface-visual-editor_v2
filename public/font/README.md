# 字体目录说明

把字体文件放在这个目录。

- TTF/OTF 即使后缀为 `.BIN` 也可加载
- 图像字体 `.BIN` 需配合 `font_info.cfg` 中的 `charset`
- 文件名固定按 `(字体ID+1).BIN` 命名（大小写不敏感）

页面会自动读取 `font_info.cfg` 并展示内置字体列表，点击字体后会从本目录按 `(ID+1).BIN` 规则按需读取对应字体文件，不依赖 `file` 字段。

## 从设备补齐缺失字体

在「更新模板库」并下载单个表盘时，编辑器会扫描表盘 `ItemList[].font`，对本地缺少元数据或 `(id+1).bin` 的字体调用 `Device/GetSomeFontInfoV2`，合并写入 `font_info.cfg` 并从 CDN 下载字体文件。协议说明见 `docs/FIRMWARE_REFERENCE.md`。
