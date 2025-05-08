const { prepareLoRaPayload } = require("../../../utils/loraOutbound");
const { decodeLoRaPayload } = require("../../../utils/loraInbound");

const testSamples = [
  { id: "123|UfmCzP2", l: "80.1232|13.3243", m: 99 },
  { id: "123|0000", l: "80.1232|13.3243" },
  { id: "123|UfmCzP2", l: "80.1232|13.3243", s: 1 },
  { id: "123|UfmCzP2", m: 3 },
  { id: "123|UfmCzP2", l: "80.1232|13.3243", wr: 1 },
  { id: "123|UfmCzP2", w: 60 }
];

function testSingle(data) {
  console.log("\n▶ Original:", data);
  const payload = prepareLoRaPayload(data);
  console.log("Encrypted Payload (hex):", payload.toString("hex"));
  const decoded = decodeLoRaPayload(payload);
  console.log("Decoded:", decoded);

  const match = JSON.stringify(data) === JSON.stringify(decoded);
  console.log("Test Result:", match ? "PASS" : "FAIL");
  return match;
}

function runTests() {
  console.log("\n=== Running LoRa Compression + Checksum + Encryption Pipeline Tests ===\n");
  let passed = 0;
  testSamples.forEach((sample, index) => {
    console.log(`\n[Sample ${index + 1}]`);
    if (testSingle(sample)) passed++;
  });
  console.log(`\n${passed}/${testSamples.length} tests passed.`);
}

runTests();