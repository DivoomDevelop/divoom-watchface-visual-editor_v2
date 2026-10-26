/** Repair invalid SFNT metadata rejected by Chromium without changing glyph outlines. */
export function normalizeBundledFont(input) {
  const bytes = Buffer.from(input);
  if (bytes.readUInt32BE(0) !== 0x00010000) return bytes;
  const tables = new Map();
  for (let i = 0; i < bytes.readUInt16BE(4); i++) {
    const entry = 12 + i * 16;
    tables.set(bytes.toString("ascii", entry, entry + 4), {
      entry, offset: bytes.readUInt32BE(entry + 8), length: bytes.readUInt32BE(entry + 12)
    });
  }
  let changed = false;
  const maxp = tables.get("maxp");
  if (maxp?.length >= 16 && bytes.readUInt16BE(maxp.offset + 14) === 0) {
    bytes.writeUInt16BE(2, maxp.offset + 14);
    changed = true;
  }
  const cmap = tables.get("cmap");
  if (cmap) {
    for (let i = 0; i < bytes.readUInt16BE(cmap.offset + 2); i++) {
      const sub = cmap.offset + bytes.readUInt32BE(cmap.offset + 4 + i * 8 + 4);
      if (bytes.readUInt16BE(sub) === 12 && bytes.readUInt32BE(sub + 8) !== 0) {
        bytes.writeUInt32BE(0, sub + 8);
        changed = true;
      }
    }
  }
  if (!changed) return bytes;
  function checksum(offset, length) {
    let sum = 0;
    for (let i = 0; i < length; i += 4) {
      let word = 0;
      for (let n = 0; n < 4; n++) word = (word << 8) | (i + n < length ? bytes[offset + i + n] : 0);
      sum = (sum + (word >>> 0)) >>> 0;
    }
    return sum;
  }
  const head = tables.get("head");
  bytes.writeUInt32BE(0, head.offset + 8);
  for (const table of tables.values()) bytes.writeUInt32BE(checksum(table.offset, table.length), table.entry + 4);
  bytes.writeUInt32BE((0xb1b0afba - checksum(0, bytes.length)) >>> 0, head.offset + 8);
  return bytes;
}
