// compressionService.js
/*
 * Data Compression Module for LoRa Transmission
 *
 * Purpose: This module compresses and decompresses structured data for efficient transmission
 * over LoRa, reducing the payload size from JSON format (e.g., 50 bytes) to a compact binary
 * format (e.g., 12-18 bytes), tailored for constrained bandwidth.
 *
 * Compression Process:
 * 1. Input: Takes a single object or array of objects with fields: "id" (mandatory), and
 *    optional "l" (location), "s" (status), "m" (mode), "wr" (warning), "w" (weight).
 * 2. ID Parsing: Splits "id" into a numeric part (uint16, 2 bytes) and string part (variable
 *    length ASCII, 1 byte length + N bytes).
 * 3. Control Byte: Uses a single byte to flag field presence and values:
 *    - Bit 0: "l" present (1 bit)
 *    - Bit 1: "s" value (0 or 1, 1 bit)
 *    - Bit 2: "m" present (1 bit)
 *    - Bit 3: "wr" value (0 or 1, 1 bit)
 *    - Bit 4: "w" present (1 bit)
 *    - Bits 5-7: Unused (reserved).
 * 4. Field Encoding:
 *    - "l": Latitude/longitude (4 decimal places) scaled by 10,000, stored as two 24-bit
 *      signed integers (3 bytes each, 6 bytes total).
 *    - "m": 0-99, stored as 7-bit value (1 byte).
 *    - "w": 0-100, stored as 7-bit value (1 byte).
 *    - "s" and "wr": Packed into control byte (no extra bytes).
 * 5. Output: Combines all parts into a buffer (e.g., 17 bytes for id + l + s).
 *    - Single object: Returns a Buffer.
 *    - Batch: Returns an array of Buffers.
 *
 * Decompression Process:
 * 1. Input: Takes a single Buffer or array of Buffers.
 * 2. ID Extraction: Reads numeric ID (2 bytes), string length (1 byte), and string (N bytes).
 * 3. Control Byte Parsing: Interprets flags and values for "l", "s", "m", "wr", "w".
 * 4. Field Decoding:
 *    - "l": Reads two 24-bit integers, scales back by 10,000, formats to 4 decimal places.
 *    - "s": Extracts from control byte if 1.
 *    - "m": Reads 1 byte if flagged.
 *    - "wr": Extracts from control byte if 1.
 *    - "w": Reads 1 byte if flagged.
 * 5. Output: Reconstructs the original object(s).
 *    - Single buffer: Returns an object.
 *    - Batch: Returns an array of objects.
 *
 * Size Efficiency:
 * - Example: {"id":"123|UfmCzP2","l":"80.12321|13.32432","s":1} (50 bytes JSON)
 *   compresses to 17 bytes (2 + 1 + 7 + 1 + 6 + 0 extra).
 * - Supports batching for multiple messages without additional overhead per item.
 *
 * Notes:
 * - Range checks ensure data fits constraints (e.g., "m" ≤ 99, "w" ≤ 100).
 * - 24-bit integers for "l" use helper functions to handle 3-byte encoding/decoding.
 */

// Helper functions for 24-bit integer handling
function writeInt24BE(buf, value, offset) {
    const tempBuf = Buffer.alloc(4);
    tempBuf.writeInt32BE(value, 0);
    tempBuf.copy(buf, offset, 1, 4);
  }
  
  function readInt24BE(buf, offset) {
    const tempBuf = Buffer.alloc(4);
    tempBuf[0] = buf[offset] & 0x80 ? 0xff : 0x00;
    buf.copy(tempBuf, 1, offset, offset + 3);
    return tempBuf.readInt32BE(0);
  }
  
  const compressData = (data) => {
    const isBatch = Array.isArray(data);
    const items = isBatch ? data : [data];
    const buffers = [];
  
    for (const item of items) {
      // Parse "id"
      const idParts = item.id.split("|");
      const idNum = parseInt(idParts[0], 10);
      const idStr = idParts[1];
      const idStrBuf = Buffer.from(idStr, "ascii");
      if (idNum > 65535 || idStrBuf.length > 255)
        throw new Error("ID out of range");
  
      // Build control byte
      let control = 0;
      if ("l" in item) control |= 1 << 0; // "l" flag
      if ("s" in item) {
        if (item.s !== 0 && item.s !== 1) throw new Error('"s" must be 0 or 1');
        control |= (item.s & 0x01) << 1; // "s" value (0 or 1)
      }
      if ("m" in item) control |= 1 << 2; // "m" flag
      if ("wr" in item) {
        if (item.wr !== 0 && item.wr !== 1)
          throw new Error('"wr" must be 0 or 1');
        control |= (item.wr & 0x01) << 3; // "wr" value (0 or 1)
      }
      if ("w" in item) control |= 1 << 4; // "w" flag
  
      // Compress item
      const itemBuffers = [
        Buffer.alloc(2), // idNum (uint16)
        Buffer.from([idStrBuf.length]), // idStr length (uint8)
        idStrBuf, // idStr (N bytes)
        Buffer.from([control]), // control byte
      ];
      itemBuffers[0].writeUInt16BE(idNum, 0);
  
      if ("l" in item) {
        const [latStr, lonStr] = item.l.split("|");
        const lat = parseFloat(latStr);
        const lon = parseFloat(lonStr);
        const latScaled = Math.round(lat * 10000);
        const lonScaled = Math.round(lon * 10000);
        if (
          latScaled < -8388608 ||
          latScaled > 8388607 ||
          lonScaled < -8388608 ||
          lonScaled > 8388607
        ) {
          throw new Error("Coordinates out of range");
        }
        const latBuf = Buffer.alloc(3);
        const lonBuf = Buffer.alloc(3);
        writeInt24BE(latBuf, latScaled, 0);
        writeInt24BE(lonBuf, lonScaled, 0);
        itemBuffers.push(latBuf, lonBuf);
      }
  
      if ("m" in item) {
        if (item.m > 99) throw new Error('"m" out of range (0-99)');
        itemBuffers.push(Buffer.from([item.m & 0x7f])); // 7 bits
      }
  
      if ("w" in item) {
        if (item.w > 100) throw new Error('"w" out of range (0-100)');
        itemBuffers.push(Buffer.from([item.w & 0x7f])); // 7 bits
      }
  
      buffers.push(Buffer.concat(itemBuffers));
    }
  
    return isBatch ? buffers : buffers[0];
  };
  
  const decompressData = (compressed) => {
    const isBatch = Array.isArray(compressed);
    const items = isBatch ? compressed : [compressed];
    const results = [];
  
    for (const item of items) {
      // Extract "id"
      const idNum = item.readUInt16BE(0);
      const idStrLen = item[2];
      const idStr = item.toString("ascii", 3, 3 + idStrLen);
      const control = item[3 + idStrLen];
      const data = { id: `${idNum}|${idStr}` };
  
      let pos = 4 + idStrLen;
  
      // Parse control byte
      if (control & (1 << 0)) {
        // "l"
        const latScaled = readInt24BE(item, pos);
        const lonScaled = readInt24BE(item, pos + 3);
        data.l = `${(latScaled / 10000).toFixed(4)}|${(lonScaled / 10000).toFixed(
          4
        )}`;
        pos += 6;
      }
  
      const sVal = (control >> 1) & 0x01;
      if (sVal) data.s = sVal;
  
      if (control & (1 << 2)) {
        // "m"
        data.m = item[pos] & 0x7f;
        pos += 1;
      }
  
      const wrVal = (control >> 3) & 0x01;
      if (wrVal) data.wr = wrVal;
  
      if (control & (1 << 4)) {
        // "w"
        data.w = item[pos] & 0x7f;
        pos += 1;
      }
  
      results.push(data);
    }
  
    return isBatch ? results : results[0];
  };
  
  module.exports = {
    compressData,
    decompressData,
  };
  