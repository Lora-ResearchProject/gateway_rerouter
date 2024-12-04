const {
  sendDataToGateway,
  forwardChatDataToGateway,
} = require("../services/loraService");

const receiveData = (req, res) => {
  const loraData = req.body;
  console.log("Received LoRa data:", loraData);
  res.status(200).send("Data received successfully");
};

const sendData = async (req, res) => {
  const inboundData = req.body;
  console.log("INBOUND DATA:", inboundData);

  try {
    const response = await sendDataToGateway(inboundData);
    console.log("Data Sent to Gateway:", response);
    res.status(200).send("Data forwarded successfully");
  } catch (error) {
    console.error("Error forwarding data:", error.message);
    res.status(500).send("Failed to forward data to gateway");
  }
};

const sendChatData = async (req, res) => {
  const inboundData = req.body;
  console.log("INBOUND DATA:", inboundData);

  try {
    const response = await forwardChatDataToGateway(inboundData);
    console.log("Chat Data Sent to Gateway:", response);
    res.status(200).send("Chat data forwarded successfully");
  } catch (error) {
    console.error("Error forwarding chat data:", error.message);
    res.status(500).send("Failed to forward chat data to gateway");
  }
};

module.exports = { receiveData, sendData, sendChatData };
