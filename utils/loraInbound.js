const { decompressData } = require("../services/compressionService");
const { verifyChecksum } = require("../services/checksumService");
const { decrypt } = require("../services/encryptionService");

function decodeLoRaPayload(encryptedPayload) {
  const decrypted = decrypt(encryptedPayload);
  const verified = verifyChecksum(decrypted);
  const decompressed = decompressData(verified);
  return decompressed;
}

module.exports = { decodeLoRaPayload };
