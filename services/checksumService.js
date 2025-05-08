/*
 * Lightweight Checksum Module for LoRa Transmission Redundancy
 *
 * Purpose: This module adds a compact error-detection layer to compressed data before
 * encryption, ensuring end-to-end integrity for LoRa’s constrained payloads (e.g., 51 bytes
 * at low data rates). It complements the HMAC in the encryption layer by verifying the
 * plaintext data’s correctness.
 *
 * Checksum Process:
 * 1. Input: Takes a buffer (e.g., 18 bytes from compressData).
 * 2. CRC-8 Calculation: Computes an 8-bit Cyclic Redundancy Check (CRC-8) using the
 *    polynomial x^8 + x^2 + x + 1 (0x07), a standard lightweight error-detection method.
 * 3. Append Checksum: Adds the 1-byte CRC to the buffer, increasing its size by 1 byte
 *    (e.g., 18 bytes → 19 bytes).
 * 4. Output: Returns the combined buffer (data + CRC) for encryption.
 *
 * Verification Process:
 * 1. Input: Takes a buffer with appended CRC (e.g., 19 bytes post-decryption).
 * 2. Extract Components: Splits into data (e.g., first 18 bytes) and received CRC (last byte).
 * 3. CRC-8 Recalculation: Recomputes the CRC-8 over the data.
 * 4. Comparison: Checks if the computed CRC matches the received CRC; throws an error if not.
 * 5. Output: Returns the data buffer (e.g., 18 bytes) if valid, for decompression.
 *
 * Size Efficiency:
 * - Adds only 1 byte to the payload, keeping it minimal (e.g., 18-byte compressed data
 *   becomes 19 bytes, then 35 bytes after encryption with 12-byte IV + 4-byte HMAC).
 * - Fits within LoRa’s 51-byte limit at low data rates (e.g., SF12).
 *
 * Error Detection:
 * - Detects single-bit errors, odd numbers of bit errors, and burst errors up to 8 bits.
 * - Does not correct errors (use retransmission if verification fails).
 * - Collision risk is 1/256 due to 8-bit size, but sufficient when paired with HMAC’s 32-bit
 *   strength (1/4 billion forgery chance).
 *
 * Notes:
 * - Applied pre-encryption to catch errors in data preparation or post-decryption corruption.
 * - Complements encryption’s HMAC by providing redundancy at the application layer.
 */

const addChecksum = (buffer) => {
    let crc = 0x00;
    for (let byte of buffer) {
      crc ^= byte;
      for (let i = 0; i < 8; i++) {
        crc = crc & 0x80 ? (crc << 1) ^ 0x07 : crc << 1;
      }
      crc &= 0xff;
    }
    return Buffer.concat([buffer, Buffer.from([crc])]);
  };
  
  const verifyChecksum = (buffer) => {
    const data = buffer.slice(0, -1);
    const receivedCrc = buffer[buffer.length - 1];
    let crc = 0x00;
    for (let byte of data) {
      crc ^= byte;
      for (let i = 0; i < 8; i++) {
        crc = crc & 0x80 ? (crc << 1) ^ 0x07 : crc << 1;
      }
      crc &= 0xff;
    }
    if (crc !== receivedCrc) throw new Error("Checksum verification failed");
    return data;
  };
  
  module.exports = { addChecksum, verifyChecksum };