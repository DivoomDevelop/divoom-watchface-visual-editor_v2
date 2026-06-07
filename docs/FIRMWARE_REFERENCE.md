# Divoom 固件参考工程

本编辑器在实现 LAN 协议、表盘商店同步、字体下载等功能时，以 **Divoom 设备固件应用层源码** 为权威参考。

## 本地路径（开发机）

```
z:\allwinner\TimeFrameSpeaker\tina_t113_v5.0_speaker\platform\thirdparty\gui\lvgl-8\divoom_app1\src
```

环境变量（可选）：`DIVOOM_FIRMWARE_SRC` 可指向上述目录，便于脚本或文档引用。

## 关键文件

| 路径（相对 `src/`） | 说明 |
|---------------------|------|
| `net/divoom_net_command_json.c` | JSON 命令名与 pack/unpack 注册表 |
| `net/divoom_device_json.c` | 设备侧请求/响应字段（表盘、字体、商店） |
| `net/divoom_channel_json.c` | Channel 类命令 |
| `middle/divoom_clock_manage.c` | 表盘 disp → 图片槽位偏移 |
| `middle/divoom_system_font.c` | 字体按需拉取 `GetSomeFontInfoV2` |
| `middle/divoom_store_clock_prefetch.c` | 表盘商店列表预取 |
| `middle/divoom_watchface_local_api.c` | 本地表盘 HTTP API |

## LAN JSON 报文（HTTP `/divoom_api`）

与 `divoom_net_command_json_packet` 一致，根对象需包含：

- `Command`, `ReturnCode`（0）, `ReturnMessage`（`""`）
- `DeviceId`, `DeviceType`（`"Frame"`）, `PacketFlag`

设备 HTTP 入站使用 **响应形** unpack（`divoom_net_command_json_unpacket_respone`）。例如 `Channel/StoreClockGetClassify` 请求体需带 `ClassifyList: []`，`StoreClockGetListForAI` 需带 `ClockList: []`，`Device/GetClockInfoV3` 需带 `DeviceImageUrl`（可为 `""`）等，否则 unpack 失败并返回 `Only accept JSON parameters`。

编辑器统一经 `src/editor/divoomLanJson.js` → `app.js` 的 `divoomJson()` 组包。

表盘商店扫描/配置拉取走 **中国区 HTTP API**（不经 LAN `/divoom_api`）：

- 基址：`https://appchina.divoom-gz.com:9506/`（开发态浏览器请求 `/divoom-china-api/*`，由 Vite 代理到该主机，默认 `http://appchina.divoom-gz.com:9506` 以避免部分环境 HTTPS 握手问题）
- 实现：`src/editor/divoomCloudApi.js` → `createDivoomChinaStoreJson()`
- 请求体仍含 `DeviceId`、`DeviceType: "Frame"`（`DeviceId` 来自顶部 LAN 设备选择或 `divoom_lan_selected_device_id`）

## 本编辑器已对接的命令

| Command | 用途 | 模块 | 通道 |
|---------|------|------|------|
| `Channel/StoreClockGetClassify` | 表盘商店分类 | `templateSync.js` | 中国区服务器 |
| `Channel/StoreClockGetListForAI` | 分类下表盘列表 | `templateSync.js` | 中国区服务器 |
| `Device/GetClockInfoV3` | 表盘完整配置 | `templateSync.js` | 中国区服务器 |
| `Device/GetSomeFontInfoV2` | 字体元数据 | `fontSync.js` | LAN 设备 |

## 本地资源布局（与固件命名对齐）

| 目录 | 规则 |
|------|------|
| `public/template/config/` | `{ClockId}.cfg` |
| `public/template/15/` | 底图 `{ClockId+1}.*` |
| `public/template/29/` | 元素图 `{ClockId*128+offset+1}.*` |
| `public/template/33/` | 预览 `{ClockId+1}.*` |
| `public/font/font_info.cfg` | `FontList[]`：`id`, `type`, `url`, `charset`, `name` |
| `public/font/` | 字体文件 `(fontId+1).bin`（TTF/OTF/图像字体均用此名） |

CDN 文件地址前缀：`https://f.divoom-gz.com/`（固件 `DIVOOM_SERVER_DEFAULT_URL`）。

## 开发态写入

`npm run dev` 时 Vite 提供 `/api/template-sync/*`，将同步结果写入 `public/template` 与 `public/font`。生产静态构建无此 API。
