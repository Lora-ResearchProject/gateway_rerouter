const {
  sendDataToGateway,
  forwardChatDataToGateway,
} = require("../services/loraService");
const logger = require('../utils/logger');

const receiveData = (req, res) => {
  const loraData = req.body;
  logger.info(`Received LoRa data: ${JSON.stringify(loraData)}`);
  res.status(200).send("Data received successfully");
};

const sendGpsData = async (req, res) => {
  const inboundData = req.body;
  logger.info(`Inbound data for sendData: ${JSON.stringify(inboundData)}`);

  try {
    const response = await sendDataToGateway(inboundData);
    logger.info(`GPS GATEWAY : ${response.data}`);
    res.status(200).send("Data forwarded successfully");
  } catch (error) {
    logger.error("GPS GATEWAY :", error);
    res.status(500).send("Failed to forward data to gateway");
  }
};

const sendChatData = async (req, res) => {
  const inboundData = req.body;

  try {
    const response = await forwardChatDataToGateway(inboundData);
    logger.info(`CHAT GATEWAY: ${response.data}`);
    res.status(200).send("Chat data forwarded successfully");
  } catch (error) {
    logger.error(`CHAT GATEWAY: ${error}`);
    res.status(500).send("Failed to forward chat data to gateway");
  }
};

module.exports = { receiveData, sendGpsData, sendChatData };
