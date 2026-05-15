/**
 * 一键探测 Divoom 设备 LAN：GetLocalClockInfo + create_local_clock（与编辑器同源 multipart）。
 * 用法: node scripts/lan-probe.mjs 192.168.1.5
 *   或: DIVOOM_LAN_IP=192.168.1.5 npm run lan:probe
 * 依赖: 系统 PATH 中有 curl；本机有 python + Pillow（用于生成 800×1280 测试 JPEG）。
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const curl = process.platform === "win32" ? "curl.exe" : "curl";

const ip = (process.argv[2] || process.env.DIVOOM_LAN_IP || "").trim();
if (!ip) {
  console.error("Usage: node scripts/lan-probe.mjs <device-ip>");
  console.error("  or:  DIVOOM_LAN_IP=x.x.x.x npm run lan:probe");
  process.exit(1);
}

const base = /^https?:\/\//i.test(ip) ? ip.replace(/\/$/, "") : `http://${ip}:9000`;

const jpgPath = path.join(__dirname, ".lan-probe-bg.jpg");
const metaPath = path.join(__dirname, ".lan-probe-meta.json");

function sh(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
    shell: false,
    ...opts
  });
  return r;
}

const py = process.platform === "win32" ? "python" : "python3";
const gen = sh(py, [
  "-c",
  `from PIL import Image; Image.new('RGB',(800,1280),(20,30,50)).save(r'${jpgPath.replace(/\\/g, "\\\\")}','JPEG',quality=80)`
]);
if (gen.status !== 0) {
  console.error("Need Python 3 with Pillow (pip install pillow) to generate probe JPEG.");
  if (gen.stderr) console.error(gen.stderr);
  process.exit(1);
}

const getPayload = JSON.stringify({
  Command: "Device/GetLocalClockInfo",
  ReturnCode: 0,
  UseCurrentDisplayClock: true
});
fs.writeFileSync(path.join(__dirname, ".lan-probe-getclock.json"), getPayload, "utf8");
const getPath = path.join(__dirname, ".lan-probe-getclock.json");

console.log("=== POST /divoom_api GetLocalClockInfo ===");
const g = sh(curl, [
  "-sS",
  "--connect-timeout",
  "6",
  "-m",
  "30",
  "-X",
  "POST",
  `${base}/divoom_api`,
  "-H",
  "Content-Type: application/json;charset=UTF-8",
  "-d",
  `@${getPath}`
]);
console.log(g.stdout || g.stderr || `(exit ${g.status})`);

const meta = {
  Command: "Device/CreateLocalClock",
  ReturnCode: 0,
  DialAssets: "image",
  ClockName: `probe-${Date.now()}`,
  NameCn: "lan-probe",
  NameEn: "lan-probe",
  ClockId: 0,
  ItemList: [
    {
      size: 160,
      x: 54,
      y: 54,
      w: 200,
      h: 80,
      disp: 4,
      alig: 3,
      sep: 0,
      font: 6,
      image_id: 0,
      image_addr: "",
      angle: 0,
      hier: 0,
      transp: 100,
      animation: 0,
      item_id: "",
      color_1: "#000000",
      color_2: "#ff0000"
    }
  ],
  ItemIdList: [""]
};
fs.writeFileSync(metaPath, JSON.stringify(meta), "utf8");

console.log("\n=== POST /create_local_clock (multipart) ===");
const part2 = `${Date.now()}`;
const c = sh(curl, [
  "-sS",
  "--connect-timeout",
  "6",
  "-m",
  "90",
  "-X",
  "POST",
  `${base}/create_local_clock`,
  "-F",
  `json=@${metaPath};type=application/json;filename=cmd.json`,
  "-F",
  `${part2}=@${jpgPath};type=image/jpeg;filename=clock_bg.jpg`
]);
console.log(c.stdout || c.stderr || `(exit ${c.status})`);

for (const f of [jpgPath, metaPath, getPath]) {
  try {
    fs.unlinkSync(f);
  } catch {
    /* ignore */
  }
}
