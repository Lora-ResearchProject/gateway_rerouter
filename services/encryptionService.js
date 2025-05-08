// encryptionService.js
/*
 * Custom Encryption Module for LoRa Transmission
 *
 * Purpose: This module provides lightweight encryption and decryption for compressed data,
 * minimizing size increase for LoRa's constrained payloads (e.g., 51 bytes at low data rates).
 *
 * Encryption Process:
 * 1. Input: Takes a buffer (e.g., 17-18 bytes from compressData).
 * 2. IV Generation: Creates a 12-byte random IV (nonce) to ensure each encryption is unique.
 * 3. AES-128-CTR Encryption: Uses AES in Counter (CTR) mode with a 128-bit key. CTR mode
 *    is a stream cipher, so the ciphertext matches the input size (no padding). Node.js
 *    requires a 16-byte IV for AES, so the 12-byte IV is padded with 4 zero bytes internally.
 * 4. HMAC-SHA256 Authentication: Computes an HMAC over the IV and ciphertext using the same
 *    key, then truncates it to 4 bytes for a compact integrity check.
 * 5. Output: Combines IV (12 bytes), ciphertext (N bytes), and tag (4 bytes) into a single
 *    buffer. For an 18-byte input, this results in 34 bytes (12 + 18 + 4).
 *
 * Decryption Process:
 * 1. Input: Takes an encrypted buffer (e.g., 34 bytes).
 * 2. Component Extraction: Splits into IV (first 12 bytes), tag (last 4 bytes), and
 *    ciphertext (middle).
 * 3. HMAC Verification: Recomputes the HMAC over the IV and ciphertext, compares it with
 *    the provided tag using timing-safe equality to prevent tampering.
 * 4. AES-128-CTR Decryption: Decrypts the ciphertext using the padded IV and key,
 *    restoring the original buffer.
 * 5. Output: Returns the decrypted buffer (e.g., 18 bytes) for decompression.
 *
 * Size Management:
 * - Original ChaCha20-Poly1305 added 28 bytes (12 nonce + 16 tag), resulting in 46 bytes
 *   for an 18-byte input.
 * - This method uses a 12-byte IV and 4-byte tag, adding only 16 bytes, resulting in
 *   34 bytes for an 18-byte input—a 12-byte savings.
 *
 * Security Trade-offs:
 * - 12-byte IV: Provides 2^96 unique values, sufficient if managed to avoid reuse (e.g.,
 *   random or counter-based).
 * - 4-byte Tag: Offers 32-bit integrity (1 in 4 billion forgery chance per attempt),
 *   weaker than a 16-byte tag but acceptable for low-risk applications.
 * - Single Key: Uses the same key for encryption and HMAC for simplicity; in production,
 *   consider key derivation for better separation.
 */

const crypto = require("crypto");

// Pre-shared 128-bit (16-byte) key for AES-128 - generate and share securely in practice
const KEY = Buffer.from("0123456789abcdef0123456789abcdef", "hex");

// Same key used for HMAC (in practice, you could derive separate keys)
const HMAC_KEY = KEY;

const encrypt = (buffer) => {
  // Generate a 12-byte IV
  const iv = crypto.randomBytes(12);

  // Encrypt with AES-128-CTR (Node.js expects a 16-byte IV, but we’ll pad it)
  const ivFull = Buffer.concat([iv, Buffer.alloc(4, 0)]); // Pad to 16 bytes with zeros
  const cipher = crypto.createCipheriv("aes-128-ctr", KEY, ivFull);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

  // Compute HMAC-SHA256 over IV (12 bytes) + ciphertext
  const hmac = crypto.createHmac("sha256", HMAC_KEY);
  hmac.update(iv); // Use only the 12-byte IV, not the padded version
  hmac.update(encrypted);
  const fullTag = hmac.digest();
  const tag = fullTag.slice(0, 4); // Truncate to 4 bytes

  // Combine IV, ciphertext, and tag
  return Buffer.concat([iv, encrypted, tag]); // Format: IV (12) + ciphertext (N) + tag (4)
};

const decrypt = (encryptedBuffer) => {
  // Extract components
  const iv = encryptedBuffer.slice(0, 12); // First 12 bytes
  const tag = encryptedBuffer.slice(-4); // Last 4 bytes
  const ciphertext = encryptedBuffer.slice(12, -4); // Middle part

  // Verify HMAC
  const hmac = crypto.createHmac("sha256", HMAC_KEY);
  hmac.update(iv);
  hmac.update(ciphertext);
  const computedTag = hmac.digest().slice(0, 4);
  if (!crypto.timingSafeEqual(tag, computedTag)) {
    throw new Error("HMAC verification failed - data may be tampered");
  }

  // Decrypt with AES-128-CTR
  const ivFull = Buffer.concat([iv, Buffer.alloc(4, 0)]); // Pad to 16 bytes
  const decipher = crypto.createDecipheriv("aes-128-ctr", KEY, ivFull);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
};

module.exports = { encrypt, decrypt };
