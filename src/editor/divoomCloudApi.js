import { buildDivoomLanEnvelope } from "./divoomLanJson.js";

/** 与固件 `DIVOOM_SERVER_HTTP_CHINA_URL` 一致（表盘商店 JSON API）。 */
export const DIVOOM_CHINA_API_BASE = "https://appchina.divoom-gz.com:9506";

/**
 * 浏览器经 Vite `/divoom-china-api` 代理，避免 CORS；代理目标可用 `DIVOOM_CHINA_API_TARGET` 覆盖（部分环境 HTTPS 握手失败时可改为 http）。
 */
export function resolveChinaStoreApiUrl(command) {
  const cmd = String(command || "").trim().replace(/^\//, "");
  if (!cmd) throw new Error("empty store API command");
  const useProxy =
    typeof import.meta !== "undefined" &&
    import.meta.env?.VITE_DIVOOM_CHINA_DIRECT !== "1";
  if (useProxy) {
    return `/divoom-china-api/${cmd}`;
  }
  return `${DIVOOM_CHINA_API_BASE.replace(/\/$/, "")}/${cmd}`;
}

/**
 * @param {() => number|string|undefined|null} getDeviceId
 * @returns {(command: string, payload?: Record<string, unknown>) => Promise<Record<string, unknown>>}
 */
export function createDivoomChinaStoreJson(getDeviceId) {
  return async function divoomChinaStoreJson(command, payload = {}) {
    const envelope = buildDivoomLanEnvelope(command, payload, getDeviceId);
    if (!envelope.DeviceId) {
      throw new Error("DeviceId required for Divoom store API");
    }
    const url = resolveChinaStoreApiUrl(command);
    let res;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        body: JSON.stringify(envelope)
      });
    } catch (e) {
      throw new Error(`store API network error: ${e?.message || e}`);
    }
    const text = await res.text();
    let data = null;
    try {
      data = JSON.parse(text);
    } catch {
      /* ignore */
    }
    if (!res.ok) {
      throw new Error(`store API HTTP ${res.status}: ${text.slice(0, 240)}`);
    }
    if (data && data.ReturnCode !== undefined && Number(data.ReturnCode) !== 0) {
      throw new Error(String(data.ReturnMessage || `store API ReturnCode ${data.ReturnCode}`));
    }
    return data || {};
  };
}
