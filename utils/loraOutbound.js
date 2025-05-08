const { compressData } = require("../services/compressionService");
const { addChecksum } = require("../services/checksumService");
const { encrypt } = require("../services/encryptionService");

function prepareLoRaPayload(data) {
  const compressed = compressData(data);
  const withChecksum = addChecksum(compressed);
  const encrypted = encrypt(withChecksum);
  return encrypted;
}

module.exports = { prepareLoRaPayload };
