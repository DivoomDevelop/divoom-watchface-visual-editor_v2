/** 与固件 `divoom_net_command_json_packet` 一致的 LAN JSON 根字段。 */
export const DIVOOM_DEVICE_TYPE_FRAME = "Frame";

let packetFlagCounter = 0;

export function nextPacketFlag() {
  packetFlagCounter = (packetFlagCounter + 1) % 2147483647;
  if (packetFlagCounter <= 0) packetFlagCounter = 1;
  return packetFlagCounter;
}

/**
 * @param {() => number|string|undefined|null} [getDeviceId]
 * @returns {number}
 */
export function resolveLanDeviceId(getDeviceId) {
  if (typeof getDeviceId === "function") {
    const id = Number(getDeviceId());
    if (Number.isFinite(id) && id > 0) return id;
  }
  try {
    const raw = localStorage.getItem("divoom_lan_selected_device_id");
    const id = Number(raw);
    if (Number.isFinite(id) && id > 0) return id;
  } catch {
    /* ignore */
  }
  return 0;
}

/**
 * 设备 HTTP 入站走 `divoom_net_command_json_unpacket_respone`（响应形 unpack）。
 * 请求体需带空数组/占位字段，否则 unpack 失败 → “Only accept JSON parameters”。
 */
const HTTP_RESPONE_UNPACK_STUBS = {
  "Channel/StoreClockGetClassify": { ClassifyList: [] },
  "Channel/StoreClockGetListForAI": { ClockList: [] },
  "Channel/StoreClockGetListForDevice": { ClockList: [] },
  "Device/GetClockInfoV3": { DeviceImageUrl: "", ItemList: [] },
  "Device/GetSomeFontInfoV2": { FontList: [] }
};

/**
 * @param {string} command
 * @param {Record<string, unknown>} [payload]
 * @param {() => number|string|undefined|null} [getDeviceId]
 */
export function buildDivoomLanEnvelope(command, payload = {}, getDeviceId) {
  const body = {
    Command: command,
    ReturnCode: 0,
    ReturnMessage: "",
    DeviceType: DIVOOM_DEVICE_TYPE_FRAME,
    DeviceId: resolveLanDeviceId(getDeviceId),
    PacketFlag: nextPacketFlag(),
    ...payload
  };
  const stubs = HTTP_RESPONE_UNPACK_STUBS[command];
  if (stubs) {
    for (const [key, value] of Object.entries(stubs)) {
      if (body[key] === undefined) body[key] = value;
    }
  }
  return body;
}
