//This service will forward data from other services to teh gateway
const axios = require("axios");
require('dotenv').config();

async function sendDataToGateway(data) {
  const gatewayUrl = `${process.env.GATEWAY_BASE_URL}/api/broadcast-gps`;

  try {
    const response = await axios.post(gatewayUrl, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

async function forwardChatDataToGateway(data) {
  const gatewayUrl2 = `${process.env.GATEWAY_BASE_URL}/api/broadcast-chat_data`;

  try {
    const response = await axios.post(gatewayUrl2, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

module.exports = { sendDataToGateway, forwardChatDataToGateway };
